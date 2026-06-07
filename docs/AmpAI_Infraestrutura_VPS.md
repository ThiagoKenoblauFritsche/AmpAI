---
tags:
  - infraestrutura/vps
  - devops/runtime
versao: 5
status: ativo
provedor: Hetzner Cloud (Alemanha)
---
# 🖥️ AmpAI — Central de Infraestrutura e Runtime VPS

> [!meta] **Consciência de Infraestrutura**
> Esta nota centraliza os dados de acesso, credenciais e os comandos de provisionamento do servidor em nuvem que roda a esteira automatizada do Hermes Agent 24h por dia de forma isolada e segura.

---
## ⌨️ 0. Comandos mais Utilizados

```bash
ssh root@178.105.252.252
```

```bash
cd /app/ampai
ls -la js/
```

```bash
/ThiagoKenoblauFritsche/AmpAI
```

```bash
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
```

---
## 🔑 1. Credenciais de Acesso Mestre (Root)

> [!warning] **Segurança Crítica**
> Mantenha estas informações protegidas. Não envie este arquivo para repositórios públicos.

*   **Nome do Servidor (Hostname):** `ampai-core-production`
*   **Zona de Disponibilidade:** NBG-1, Alemanha (Nuremberg)
*   **Endereço IP (IPv4 Principal):** `178.105.252.252`
*   **Usuário Padrão:** `root`
*   **Diretório do Projeto:** `/app/ampai`
*   **Senha Inicial (Enviada por E-mail):** `9KwtLXPAdrqwnH33dHmW`
*   **GitHub Personal Access Token (PAT):** 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
*   **GitHub AmpAI Link**: https://github.com/ThiagoKenoblauFritsche/AmpAI
*   **Antigravity CLI Auth:** `thiagokenoblaufritsche@gmail.com (Google AI Pro)`

---
## 🛠️ 2. Guia de Provisionamento e Instalação (Terminal Linux)

### Passo 2.1: Primeiro Acesso e Atualização do Sistema
```bash
# Conectar via SSH tradicional
ssh root@178.105.252.252

# Atualizar dependências base do Ubuntu Linux
sudo apt update && sudo apt upgrade -y
```

### Passo 2.2: Instalação Oficial do Docker Engine
O Docker é obrigatório para isolamento de Sandboxes de teste de código.
```bash
# Instalar dependências e chaves oficiais do Docker
sudo apt-get update
sudo apt-get install ca-certificates curl -y
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://docker.com -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Adicionar o repositório ao APT
echo \
  "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://docker.com \
  \((. /etc/os-release && echo "\)VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

### Passo 2.3: Instalação do NodeJS v22 e Git
```bash
# Injetar repositório do NodeSource para Node v22 LTS
curl -fsSL https://nodesource.com | sudo -E bash -
sudo apt-get install -y nodejs git

# Validar binários
node -v
git --version
```

### Passo 2.4: Instalação do Antigravity CLI e Clonagem (Google AI Pro)
```bash
# Instalar a CLI Oficial da Google para desenvolvimento automatizado
curl -fsSL https://antigravity.google | bash

# Ativar o comando globalmente no ambiente Linux
echo 'export PATH="/root/.local/bin:\$PATH"' >> ~/.bashrc && source ~/.bashrc

# Inicializar o diretório e clonar o repositório se necessário
mkdir -p /app/ampai && cd /app/ampai
git clone https://github.com.git/ThiagoKenoblauFritsche/AmpAI .

# Autenticar a cota PRO da IDE na nuvem
agy auth login
```

---
## 🔒 3. Políticas de Firewall Recomendadas (Painel Hetzner)


| Prioridade | Direção | Protocolo | Porta  | Origem        | Descrição                       |
| :--------- | :------ | :-------- | :----- | :------------ | :------------------------------ |
| 100        | Inbound | TCP       | `22`   | `Qualquer IP` | Acesso ao Terminal SSH          |
| 110        | Inbound | TCP       | `80`   | `Qualquer IP` | Visualização HTTP do App        |
| 120        | Inbound | TCP       | `8080` | `127.0.0.1`   | Porta local da IDE Headless     |

---
## 🚨 4. Procedimentos de Reconexão (Queda de Terminal)

```bash
# 1. Reconectar à máquina na Alemanha
ssh root@178.105.252.252

# 2. Entrar direto no diretório do software
cd /app/ampai

# 3. Validar se a estrutura modular js/ está intacta
ls -la js/
```

---
## 🔄 5. Protocolo de Sincronização Diária (Chegando em Casa)

### Comando Único de Automação
No terminal do **PowerShell (PS)** dentro da sua Antigravity IDE no Windows, execute:
```powershell
./sync.ps1
```

### O que o script executa sozinho:
- `[Git Fetch/Reset]` Limpa conflitos e força o PC local a ficar idêntico à VPS.
- `[Copy-Item]` Converte o mapa de contratos gerado na nuvem para `.txt` e injeta direto no disco virtual `G:\Meu Drive\AmpAI_NotebookLM\`
- `[Auto-Sync]` O Google NotebookLM engole a atualização de forma 100% autônoma.
