# Manual de Onboarding Executivo (O Guia do Piloto)
*Documento restrito aos C-Levels (CEOs e Sócios Humanos).*

Bem-vindo à sala de controle da **AmpAI (Governança v7.0)**. O AmpAI não é apenas um repositório de código, é uma fábrica inteira operada por Inteligências Artificiais especializadas. Como CEO e Gatekeeper Humano, sua função não é escrever código, mas sim orquestrar essa máquina industrial.

---

## 1. Topologia da Fábrica (Onde cada coisa mora)
Você possui três plataformas de trabalho:

### A) NotebookLM (O Oráculo Omnisciente)
*   **O que é:** Uma base de conhecimento que leu todos os documentos e códigos.
*   **Seu uso:** Não programa nada. Você usa o NotebookLM para fazer perguntas gerais: *"Quais normas IEC usamos no projeto?"*, *"Qual a nossa fase do Roadmap atual?"*, *"O que foi definido no backlog comercial?"*

### B) Antigravity (Estúdio de Design e Arquitetura)
*   **O que é:** Seu ambiente de planejamento visual e estrutural.
*   **Seu uso:** Abrir chats isolados para o **@CTO**, **@Arquiteto_Governanca**, **@Senior_Frontend_Dev** e **@Negocios**. Aqui as funcionalidades são planejadas, a UI é desenhada e as Ordens de Serviço (O.S.) nascem.

### C) Claude Code Pro IDE (O Chão de Fábrica TDD)
*   **O que é:** O motor que encarna e roda os testes na sua máquina.
*   **Seu uso:** Abrir chats isolados para a "Turma da Matemática": **@Engenheiro_Eletricista**, **@Senior_QA_Security** e **@Senior_Backend_Dev**. Aqui a física pesada vira código que funciona.

---

## 2. Como Pilotar (A Lei do Isolamento de Contexto)
O erro fatal de um CEO de IA é colocar um Cientista de Dados e um Pintor de Tela na mesma sala e mandar os dois trabalharem. Eles vão "alucinar".
**Regra de Ouro:** 1 Persona = 1 Chat / 1 Aba Isolada.

**Rotina de Boot (O Ritual de Inicialização):**
1.  Você vai abrir uma aba *limpa* (no Antigravity ou no Claude Code).
2.  Você vai abrir o arquivo de Boot (ex: `.github/chat_contexts/init_CTO.md`) e colar todo o texto dele na aba vazia.
3.  A IA vai ler, assimilar toda a empresa, trancar o cérebro em uma única função, e responder: *"Pronto, mande a O.S."*
4.  Só então você envia a Ordem de Serviço.

---

## 3. O Fluxo de Produção Perfeito (Hub-and-Spoke)
Como o CEO transforma uma ideia de negócio em código pronto sem precisar ser um "Engenheiro de Prompts"? A resposta é: **O CTO é o cérebro central (Hub).** Toda saída de um robô deve ser devolvida para a aba do CTO para ele analisar e criar o próximo prompt.

1.  **A Ideia:** Você tem uma ideia. Vai na aba **@Negocios**, documenta no `Backlog_Comercial.md`.
2.  **O Início do Ciclo:** Você vai na aba isolada do **@CTO** (Antigravity). Mostra a ideia. O CTO avalia toda a arquitetura da empresa e gera a **[O.S. 1 - Física]**.
3.  **A Ciência (O Ping-Pong):** 
    - Você copia a [O.S. 1] gerada pelo CTO e cola na aba do **@Engenheiro_Eletricista**. 
    - O Engenheiro devolve um rascunho matemático. 
    - **Você não precisa avaliar a matemática.** Apenas copie a resposta dele, volte para a aba do **@CTO** e diga: *"Esta é a resposta do Engenheiro"*.
4.  **A Quebra (TDD RED):** O CTO vai ler, validar, e gerar a **[O.S. 2 - ZOMBIES]**. Você copia a [O.S. 2], cola na aba do **@Senior_QA_Security**, copia os testes quebrando gerados por ele, e devolve para o CTO.
5.  **A Construção (TDD GREEN):** O CTO aprova os testes destrutivos e gera a **[O.S. 3 - Backend]**. Você cola na aba do **@Senior_Backend_Dev**. Ele devolve a lógica core rodando. Você devolve a lógica pronta para o CTO.
6.  **A Pintura:** O CTO gera a **[O.S. 4 - UI]**. Você cola no chat do **@Senior_Frontend_Dev** e ele desenha a tela final.

---

## 4. O Commit do CTO e a Sua Aprovação (Merge)
Depois que a interface está pronta e você testou o software manualmente na sua tela:
1. Você volta para a aba do **CTO** e manda a palavra mágica: **"APROVADO"**.
2. O CTO aciona as próprias ferramentas de terminal do Antigravity e executa os comandos `git add .`, `git commit` e `git push`, criando o Pull Request.
3. O **CodeRabbit** (na nuvem) audita a PR criada pelo CTO.
   - Se o CodeRabbit achar um erro, você copia o erro do Github, cola na aba do CTO, e o CTO formula o prompt de correção para o robô culpado.
   - Se estiver perfeito, você (CEO Humano) clica no botão verde de **Merge** no GitHub.

*Você está pilotando uma fábrica que nunca dorme. Bom trabalho.*
