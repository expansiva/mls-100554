/// <mls shortName="pluginAgentPlayground" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginAgentPlayground",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "playground",
      "agent",
      "collab.codes"
    ]
  },
  "references": {
    "widgets": [
      "widget-playground-state-100554",
      "widget-world-time-greeting-100554",
      "ica-forms-input-string-100554",
      "wc-input-text-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "preview.pausePreview"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabLitElement",
      "./_100554_collabMessageHelper",
      "./_100554_aiAgentBase",
      "./_100554_aiAgentHelper",
      "./_100554_msgDBController",
      "./_100554_collabDOMSync",
      "./_100554_collabIcons",
      "./_100554_collabState"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of innerHTML in getPrompts() (i.innerHTML.trim()) may allow XSS if children are not sanitized.",
      "Direct access to window.clipboardData in handlePaste may have security implications."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Good: Uses semantic HTML elements (button, select, details, summary).",
      "Good: Focusable elements (buttons, selects) are accessible via keyboard.",
      "Potential: No explicit aria-* attributes for overlay/spinner; consider adding for screen readers.",
      "Potential: Color contrast for some elements (e.g., spinner on overlay) should be checked for WCAG compliance.",
      "Good: Tab navigation is possible for main controls."
    ],
    "i18nWarnings": [
      "Strings like 'No input found!', 'Inputs', 'Result', 'Settings', 'Running...', 'Agent:', 'Message', 'Error when testing agent:' are hardcoded and not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "O plugin-agent-playground-100554 é um componente Lit para testar agentes de IA no Collab.codes. Ele permite criar, editar e organizar prompts, executar agentes e visualizar resultados, além de configurar preferências de chat e threads.",
    "goal": "Fornecer uma interface visual para testar e depurar agentes de IA, facilitando a edição de prompts e a análise de respostas em ambiente colaborativo.",
    "userStories": [
      {
        "story": "Como usuário, quero adicionar, editar e remover prompts para testar diferentes cenários de agentes de IA.",
        "derivedRequirements": [
          {
            "description": "Permitir adicionar prompts de diferentes tipos (system, human, ai, memory).",
            "done": true
          },
          {
            "description": "Permitir edição inline do conteúdo dos prompts.",
            "done": true
          },
          {
            "description": "Permitir remoção de prompts.",
            "done": true
          }
        ]
      },
      {
        "story": "Como usuário, quero executar um agente e visualizar o resultado da execução.",
        "derivedRequirements": [
          {
            "description": "Botão para executar o agente e exibir o resultado em uma aba dedicada.",
            "done": true
          },
          {
            "description": "Exibir mensagens de erro amigáveis caso a execução falhe.",
            "done": true
          }
        ]
      },
      {
        "story": "Como usuário, quero configurar preferências de chat e selecionar threads para manutenção.",
        "derivedRequirements": [
          {
            "description": "Permitir seleção de thread de manutenção nas configurações.",
            "done": true
          },
          {
            "description": "Persistir preferências de chat do usuário.",
            "done": true
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a múltiplos agentes simultâneos.",
        "done": false,
        "comment": "Não implementado; atualmente apenas um agente por vez."
      },
      {
        "description": "Permitir exportação/importação de conjuntos de prompts.",
        "done": false,
        "comment": "Não há funcionalidade de exportação/importação."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Drag and drop dos prompts às vezes não atualiza a ordem corretamente.",
        "done": false,
        "comment": "O código tenta corrigir com handleSave após drop, mas pode haver race conditions."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com aria-labels e feedback para leitores de tela.",
        "done": false,
        "comment": "Acessibilidade básica presente, mas sem aria-labels específicos."
      },
      {
        "description": "Internacionalizar todas as mensagens e labels.",
        "done": false,
        "comment": "Mensagens estão hardcoded em inglês."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a visual playground for testing AI agents in Collab.codes.",
    "Users can add, edit, reorder, and remove prompts, execute agents, and view results.",
    "Settings allow chat preferences and thread selection; error handling and accessibility are present but could be improved.",
    "Future enhancements include multi-agent support, prompt import/export, better accessibility, and full i18n."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9828,version:2"
}
    