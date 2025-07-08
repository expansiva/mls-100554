/// <mls shortName="collabLogLine" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabLogLine",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "log",
      "status",
      "ui"
    ]
  },
  "references": {
    "widgets": [
      "collab-log-line-100554"
    ],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabIcons"
    ],
    "statesRO": [],
    "statesRW": [
      "text",
      "status"
    ],
    "statesWO": []
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "O componente não utiliza atributos aria nem fornece suporte explícito para leitores de tela.",
      "O contraste de cores para status 'error' e 'finish' depende das variáveis Less, que parecem adequadas, mas recomenda-se validar contraste mínimo.",
      "Não há suporte para navegação por teclado (tabindex) ou foco visual.",
      "Os ícones SVG são inseridos diretamente, mas sem descrição alternativa (aria-label ou role)."
    ],
    "i18nWarnings": [
      "A string exibida em <span>${this.text}</span> depende da propriedade 'text'. Se esta vier de fonte fixa, considerar internacionalização."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "Componente visual para exibir uma linha de log com status e ícone correspondente. Utiliza LitElement e aceita propriedades para texto e status, exibindo diferentes ícones e estilos conforme o status.",
    "goal": "Fornecer uma linha de log reutilizável e visualmente clara, indicando o status de uma operação (em progresso, erro, finalizado, aguardando).",
    "userStories": [
      {
        "story": "Como usuário, quero ver o status de uma operação em uma linha de log, para entender rapidamente se está em andamento, finalizada ou ocorreu erro.",
        "derivedRequirements": [
          {
            "description": "Exibir ícone correspondente ao status atual (inprogress, error, finish, waiting).",
            "done": true,
            "comment": "Implementado via mapeamento iconsByStatus."
          },
          {
            "description": "Permitir customização do texto exibido na linha de log.",
            "done": true,
            "comment": "Propriedade 'text' já implementada."
          },
          {
            "description": "Aplicar estilos visuais distintos para cada status.",
            "done": true,
            "comment": "Estilos definidos no arquivo .less."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a acessibilidade (aria-label nos ícones, foco via teclado).",
        "done": false,
        "comment": "Não implementado; importante para usuários com necessidades especiais."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Permitir customização dos ícones via propriedade.",
        "done": false,
        "comment": "Atualmente os ícones são fixos no código."
      }
    ]
  },
  "textToEmbedding": [
    "This widget displays a log line with a status icon and message, using LitElement.",
    "It visually indicates operation status (in progress, error, finished, waiting) with different icons and styles.",
    "Accessibility is limited; icons lack aria-labels and keyboard navigation is not supported.",
    "Future improvements include customizable icons and enhanced accessibility for screen readers."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9756,version:2"
}
    