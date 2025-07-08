/// <mls shortName="pluginNewProjectLog" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginNewProjectLog",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "text",
      "status"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabIcons",
      "./_100554_collabLitElement"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [
      "css"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "No explicit aria-* attributes found. The icon is rendered as SVG, which may need role/presentation or aria-hidden for decorative icons.",
      "No tabindex or keyboard navigation issues detected. Contrast appears to be handled via LESS tokens."
    ],
    "i18nWarnings": [
      "The 'text' property is rendered directly. If used for user-facing messages, consider i18n support."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "Este plugin exibe uma linha de log para projetos, mostrando um ícone de status e uma mensagem de texto. O componente é estilizado para refletir diferentes estados como 'inprogress', 'error', 'finish' e 'waiting'.",
    "goal": "Fornecer feedback visual claro sobre o status de operações de projeto, facilitando o acompanhamento de logs em tempo real.",
    "userStories": [
      {
        "story": "Como usuário, quero ver o status de uma operação do projeto com um ícone e mensagem, para entender rapidamente o progresso ou erros.",
        "derivedRequirements": [
          {
            "description": "Exibir ícone correspondente ao status atual ('inprogress', 'error', 'finish', 'waiting').",
            "done": true,
            "comment": "Implementado via iconsByStatus e renderização condicional."
          },
          {
            "description": "Exibir mensagem de texto associada ao status.",
            "done": true,
            "comment": "A propriedade 'text' é exibida no template."
          },
          {
            "description": "Aplicar estilos visuais distintos para cada status.",
            "done": true,
            "comment": "Estilos LESS aplicam cores e animações conforme o status."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin displays a project log line with a status icon and message.",
    "It visually distinguishes between statuses like inprogress, error, finish, and waiting.",
    "The component aims to provide clear, real-time feedback on project operations.",
    "Future improvements may include i18n support for user-facing messages."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9812,version:2"
}
    