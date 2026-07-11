# AmpAI ROADMAP (Fase 2): Guia de Deploy na VPS e Telegram

> [!CAUTION]
> **Segurança:** credenciais nunca devem ser registradas neste documento. Use o cofre de segredos aprovado, GitHub Secrets ou variáveis de ambiente não versionadas.

> [!WARNING]
> **Atenção:** Este documento descreve uma expansão futura do AmpAI. Atualmente operamos na **Governança v7.1**, onde a Fábrica roda no terminal local e o Gate opera em shadow mode. A implementação descrita abaixo só poderá ser executada após ratificação e ativação de `@Engenheiro_DevOps_SRE`.

Este documento descreve os passos operacionais futuros para configurar a VPS Hetzner como um "Headless Orchestrator". A VPS passará a ter a responsabilidade de ouvir comandos via Telegram e instanciar o Claude Code de forma autônoma (Air Gap via Firecracker).

`@Engenheiro_Plataforma_CI` não possui autorização para executar este guia: seu escopo termina na infraestrutura de CI dentro do repositório. VPS, credenciais de ambiente, deploy, observabilidade, backup e rollback pertencerão ao futuro `@Engenheiro_DevOps_SRE`, após O.S. e ratificação próprias.

---
## 0. Credenciais de Acesso Mestre (Root)

> [!warning] **Segurança Crítica**
> Mantenha estas informações protegidas. Não envie este arquivo para repositórios públicos.

*   **Nome do Servidor (Hostname):** `ampai-core-production`
*   **Endereço IP:** `178.105.252.252`
*   **Usuário:** `root`
*   **Acesso SSH:** `ssh root@178.105.252.252`
*   **Diretório do Projeto:** `/app/ampai`
*   **Senha Inicial:** `<ver cofre de segredos: VPS_ROOT_PASSWORD>`
*   **GitHub PAT:** `<ver cofre de segredos: GITHUB_PAT>`
*   **Antigravity CLI Auth:** `thiagokenoblaufritsche@gmail.com`

---

## 1. Configurando o Sincronizador do Drive (Rclone)

Como a VPS (Linux) não possui o aplicativo Google Drive oficial, usaremos o `rclone`.

### 1.1 Instalação
No terminal da VPS:
```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```

### 1.2 Autenticação (Oauth)
Como a VPS não tem navegador (ambiente headless), o ideal é rodar a configuração no seu computador local e depois copiar o token para a VPS.
1. No seu PC local (Windows), instale o rclone.
2. Rode `rclone config`.
3. Escolha `n` para New Remote. Chame-o estritamente de `gdrive`.
4. Escolha `drive` (Google Drive).
5. Deixe Client ID e Client Secret vazios (ou crie os seus no Google Cloud Console para maior limite).
6. Escolha escopo `1` (Full access).
7. Aceite as opções padrão até ele abrir o seu navegador para você logar com sua conta Google.
8. Após autenticado, o rclone gerará um arquivo `rclone.conf` no seu Windows (geralmente em `%APPDATA%\rclone\rclone.conf`).
9. Copie o conteúdo desse arquivo e cole no arquivo `~/.config/rclone/rclone.conf` na VPS Hetzner.

### 1.3 Validação
Na VPS, teste se ele lista seus arquivos:
```bash
rclone ls gdrive:
```

---

## 2. Configurando a Cloud Factory (Claude Code)

### 2.1 Instalação do Claude Code
Assumindo que o Node.js v22 já está instalado:
```bash
npm install -g @anthropic-ai/claude-code
```

### 2.2 Autenticação
Rode o comando e siga o processo de autenticação via OAuth ou token:
```bash
claude
```

---

## 3. Preservando o "Air Gap" via Firecracker (MicroVMs)

O Claude Code precisa escrever os códigos, mas o Codex (@Senior_QA_Security) ficará no ambiente de Tribunal julgando-os. Para a segurança máxima exigida pelo projeto, usaremos **Firecracker** (via `ignite`) para provisionar MicroVMs super leves e totalmente isoladas no nível de kernel, em vez de containers Docker tradicionais.

> [!WARNING]
> **Requisito de Hardware (KVM):** O Firecracker exige aceleração de hardware (KVM). Se a sua instância Hetzner for um VPS Cloud comum (linha CX/CPX), ela **NÃO** suporta *nested virtualization* e o Firecracker não vai rodar. Ele exige um Servidor Dedicado (Bare Metal) ou instâncias cloud específicas que exponham `/dev/kvm`. Verifique rodando `kvm-ok` na sua VPS.

### 3.1 Instalação do Ignite (Gerenciador do Firecracker)
O Ignite é uma ferramenta open-source que permite rodar MicroVMs Firecracker com a facilidade do Docker. Na VPS:
```bash
# Instale os binários do Ignite, Firecracker e containerd
export IGNITE_VERSION=v0.10.0
curl -fLo ignite https://github.com/weaveworks/ignite/releases/download/${IGNITE_VERSION}/ignite-amd64
chmod +x ignite
sudo mv ignite /usr/local/bin/
```

### 3.2 Script de Acionamento da Fábrica (`factory_run.sh`)
Crie este script no host da VPS para o Hermes (Bot do Telegram) acionar quando você pedir para a IA programar. Ele criará uma MicroVM descartável, rodará o Claude Code e a destruirá:

```bash
#!/bin/bash
# Executa o Claude Code DENTRO de uma MicroVM Firecracker efêmera.
# Monta o repositório atual e injeta o comando passado por parâmetro.
# Exemplo de uso: ./factory_run.sh "Refatore a interface de Média Tensão"

PROMPT=$1
VM_NAME="ampai-claude-factory-$(date +%s)"

# Cria e executa a microVM montando a pasta atual no /app da VM
sudo ignite run weaveworks/ignite-ubuntu \
  --name $VM_NAME \
  --cpus 2 \
  --memory 1GB \
  --copy-files $(pwd):/app \
  --ssh \
  --command "cd /app && npm install -g @anthropic-ai/claude-code && export ANTHROPIC_API_KEY='$ANTHROPIC_API_KEY' && claude -p '$PROMPT'"

# Destrói a microVM após a execução (Garante o isolamento efêmero)
sudo ignite rm -f $VM_NAME
```

Dessa forma, a Fábrica roda em um kernel isolado (MicroVM), blindando o host da VPS (onde fica o Tribunal Codex) contra qualquer escape de sandbox.

---

## 4. Automatizando o Loop Semântico

Para que o NotebookLM atualize mesmo com seu PC desligado, precisamos que a VPS escute as mudanças do GitHub.

### 4.1 Permissão de Execução no Sincronizador
```bash
chmod +x sync.sh
```

### 4.2 Cron Job (A cada 5 minutos)
Adicione no Cron da VPS para puxar atualizações e jogar no Drive:
```bash
crontab -e
```
Adicione a linha (ajuste `/caminho/para/ampai`):
```cron
*/5 * * * * cd /caminho/para/ampai && ./sync.sh >> /var/log/ampai_sync.log 2>&1
```

> **Alternativa Avançada:** Em vez de Cron, você pode configurar um webhook do GitHub com um servidor Node.js simples ou Express para rodar o `sync.sh` imediatamente após um `push`.
