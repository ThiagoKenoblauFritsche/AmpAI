# O Ciclo de Vida de uma OS (Governança v7.0 - Hub-and-Spoke)

A operação de software da AmpAI segue uma arquitetura **Hub-and-Spoke (Estrela)**. O @CTO atua como o cérebro central (Hub) e os outros agentes como executores especialistas (Spokes). O CEO Humano não "pensa" em prompts, atua puramente como Gatekeeper e Transportador.

```mermaid
sequenceDiagram
    participant CEO as Você (CEO Humano)
    box rgb(20, 40, 60) O Cérebro (Antigravity)
        participant CTO as @CTO (Hub Central)
        participant Frontend as @Frontend
    end
    box rgb(20, 60, 40) Chão de Fábrica (Claude Code)
        participant Cientista as @Eletricista
        participant QA as @QA_Security
        participant Backend as @Backend
    end
    participant Nuvem as CodeRabbit/GitHub
    
    %% Inicialização
    CEO->>CTO: "Temos a demanda do Backlog X."
    CTO-->>CEO: Entrega a [Ordem de Serviço 1 - BDD]
    
    %% Fase 3: Ciência
    CEO->>Cientista: Cola a [O.S. 1] gerada pelo CTO
    Cientista-->>CEO: Devolve rascunho de física/BDD
    CEO->>CTO: Entrega o resultado do Eletricista
    CTO-->>CEO: Aprova e gera a [O.S. 2 - ZOMBIES]
    
    %% Fase 4: QA (TDD Red)
    CEO->>QA: Cola a [O.S. 2] gerada pelo CTO
    QA-->>CEO: Devolve testes quebrando
    CEO->>CTO: Entrega os testes quebrados
    CTO-->>CEO: Aprova e gera a [O.S. 3 - Backend]
    
    %% Fase 5: Backend (TDD Green)
    CEO->>Backend: Cola a [O.S. 3] gerada pelo CTO
    Backend-->>CEO: Código verde e tipado
    CEO->>CTO: Entrega o core_math.js funcional
    CTO-->>CEO: Avalia e gera a [O.S. 4 - Frontend]
    
    %% Fase 6: Frontend
    CEO->>Frontend: Cola a [O.S. 4] gerada pelo CTO
    Frontend-->>CEO: Entrega a UI pronta
    
    %% Fase 7: O Commit do CTO
    CEO->>CTO: "Teste manual ok. APROVADO."
    CTO->>CTO: Roda git add, git commit, git push
    
    %% Fase 8: A Muralha da Nuvem
    Nuvem->>Nuvem: CodeRabbit audita a Pull Request
    alt Erro na Nuvem
        Nuvem-->>CEO: Rejeita a PR
        CEO->>CTO: Cola o erro do CodeRabbit
        CTO-->>CEO: Gera O.S. de Correção para o Culpado
    else Tudo Certo
        Nuvem-->>CEO: "Aprovado: Código Seguro"
        CEO->>Nuvem: Botão de Merge (Produção!)
    end
```

---

### A Dinâmica "Hub-and-Spoke" (O Papel do CTO)

Para que nenhuma IA sofra de "alucinação" por excesso de contexto e o CEO humano não sofra "fadiga de decisão", todo o ciclo de vida de uma *feature* é orquestrado de um ponto central: A aba isolada do **@CTO** no Antigravity.

#### O Roteiro Padrão de Execução:
1. **O Gatilho:** Você avisa o CTO qual feature será feita.
2. **A Ordem:** O CTO elabora a "Ordem de Serviço (Prompt)" perfeita, contendo apenas as informações que o Engenheiro Eletricista precisa saber. Nenhuma palavra a mais.
3. **O Ping:** Você copia essa Ordem de Serviço, vai na aba isolada do Eletricista e cola.
4. **O Pong:** O Eletricista te dá a física pronta. Você não precisa ler nem julgar a física. Você apenas copia o resultado e devolve para o CTO.
5. **O Ciclo se Repete:** O CTO lê a física, valida se atende a arquitetura, e elabora a O.S. para o QA. Você atua como carteiro, levando o prompt até a aba do QA, e trazendo a resposta de volta ao CTO.

#### A Diferença entre `git push` (CTO) e `Merge` (CEO):
- Após a UI ficar pronta, você testa o sistema. Se estiver visualmente e funcionalmente ok, você diz ao CTO: **"APROVADO"**.
- Como o Antigravity possui acesso ao terminal, o CTO executará o comando de `git push` criando a Pull Request.
- **O Gatekeeper Final:** A nuvem (CodeRabbit) faz a auditoria matemática do PR criado pelo CTO. Somente o **CEO (Você)** tem o poder de abrir o GitHub pelo navegador e clicar no botão verde de **Merge**. Uma máquina não pode jogar código diretamente em produção sem a bênção final de um humano.
