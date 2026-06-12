---
tags:
  - arquitetura/ia
  - ampai/fluxo
versao: 6
status: ativo
---

# 🧠 AmpAI — Fluxo Híbrido Mobile e Contexto Infinito

> [!info] **Conceito de Engenharia de Contexto**
> Esta documentação estabelece o fluxo circular perfeito do ecossistema AmpAI. O objetivo é permitir que o Thiago desenvolva o software 24h por dia pelo celular, utilizando IA de longo contexto GRATUITA para pensar/refinar e a assinatura ANTIGRAVITY PRO na VPS para executar o código com custo zero de tokens externos (OpenRouter).

---
## 🗺️ 1. O Loop Circular de Dados (Arquitetura v6.0)

┌────────────────────────────────────────────────────────────────────────┐
│ 📱 FASE 1: ESTRATÉGIA (Mobile/Web)                                     │
│ [Google NotebookLM] Brainstorming gratuito e RAG de contexto infinito. │
└───────────────────────────────┬────────────────────────────────────────┘
▼
┌────────────────────────────────────────────────────────────────────────┐
│ 💻 FASE 2: FÁBRICA LOCAL (PC de Casa)                                  │
│ [Claude Code Pro] Escreve código JS, aplica SoC e comita no Git.       │
│ NUNCA audita seu próprio código definitivamente.                       │
└───────────────────────────────┬────────────────────────────────────────┘
▼ (git push & Telegram Handoff)
┌────────────────────────────────────────────────────────────────────────┐
│ 🖥️ FASE 3: TRIBUNAL NA NUVEM (VPS Hetzner)                             │
│ [Antigravity CLI] Puxa o código e roda a Muralha TDD na Sandbox.       │
│ Se verde, o CEO carimba o Deploy.                                      │
└───────────────────────────────┬────────────────────────────────────────┘
▼ (Sincronização Unificada via ./sync.ps1)
┌────────────────────────────────────────────────────────────────────────┐
│ ☁️ FASE 4: ATUALIZAÇÃO DA CONSCIÊNCIA                                  │
│ O script `sync.ps1` converte tudo para .txt e joga no Drive,           │
│ alimentando o NotebookLM e reiniciando o ciclo com contexto cravado.   │
└────────────────────────────────────────────────────────────────────────┘

---

## ⚙️ 2. Funcionamento Dinâmico dos Componentes

### A. O Cérebro de Leitura (Google NotebookLM)
- **Papel:** Copiloto estratégico de Chat móvel.
- **Custo:** 100% Gratuito.
- **Mecânica:** Ele fica conectado diretamente ao canal unificado do seu **Meu Drive (Disco G:)** lendo o arquivo compactado `AmpAI_Contratos_E_Estrutura_De_Codigo.txt`. Ele possui uma janela de contexto massiva e persistente, sabendo o estado atual das funções matemáticas sem misturar dados com o Obsidian local.

### B. O Garoto de Recados (Hermes Agent)
- **Papel:** Gateway e orquestrador de infraestrutura na VPS.
- **Mecânica:** Ele fica escutando o seu grupo do Telegram. Ao ler a tag `RUN_PRO_ANTIGRAVITY:`, ele barra qualquer chamada de API paga da OpenRouter e encaminha o texto do prompt diretamente para o terminal local da IDE Headless na nuvem.

### C. O Executor Técnico (Antigravity CLI na VPS)
- **Papel:** Motor de escrita, refatoração e injeção de código.
- **Custo:** Consome a cota da sua assinatura Antigravity PRO.
- **Mecânica:** Funciona em modo Headless (segundo plano) dentro do servidor Linux. Como está logado na sua conta oficial, ele roda os modelos avançados na Sandbox da nuvem com o seu computador pessoal de casa totalmente desligado.

---

## 📈 3. Vantagens Estratégicas do Modelo Híbrido

1. **Imunidade à Amnésia de IA:** O NotebookLM mantém o histórico vivo de todas as modificações do AmpAI baseado em arquivos reais de contratos, e não em históricos voláteis de chat.
2. **Rigor Técnico com Custo Zero de Token:** Horas de conversas, testes conceituais e refinamento de prompts na rua são feitos de graça. O saldo e as cotas do Antigravity PRO só são acionados no milissegundo final da escrita do código.
3. **Mobilidade e Produtividade 24h:** Permite aproveitar os ciclos de reset (refresh) das cotas das IAs durante a madrugada. Você envia o comando antes de dormir pelo celular e acorda com o código testado e commitado no GitHub.
