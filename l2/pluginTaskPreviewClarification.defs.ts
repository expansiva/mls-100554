/// <mls shortName="pluginTaskPreviewClarification" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginTaskPreviewClarification",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "clarification",
      "ai",
      "task",
      "step"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [
      "step",
      "task"
    ],
    "statesRW": [
      "mode",
      "tag"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabLitElement",
      "./_100554_utilsLit",
      "./_100554_aiAgentHelper",
      "./_100554_aiAgentBase"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Use of unsafeHTML for dynamic HTML rendering in renderClarification(). This can introduce XSS vulnerabilities if the content is not strictly controlled."
    ],
    "unusedImports": [
      "convertFileNameToTag"
    ],
    "deadCodeBlocks": [
      "Commented-out block in renderClarification() related to clarificationid.data and setAttribute('mode', 'readonly')."
    ],
    "accessibility": [
      "Tab navigation is implemented with buttons, which is good for accessibility. However, there is no explicit aria-selected or role attributes for tabs.",
      "No evidence of keyboard navigation between tabs.",
      "SVG icons used for chevrons do not have aria-label or role attributes.",
      "No explicit focus styles for interactive elements."
    ],
    "i18nWarnings": [
      "Strings like 'Step not Found.', 'Not found!', 'No input found!', 'Not found step', 'Not next step', 'Step details', 'Task details', 'Info', 'Clarification', 'Results' are hardcoded and should be internationalized for multi-language support."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Este plugin exibe uma prévia de esclarecimento de tarefas e etapas de agentes de IA, permitindo ao usuário alternar entre informações, esclarecimentos e resultados de uma etapa específica de uma tarefa.",
    "goal": "Fornecer uma interface clara para visualizar detalhes, esclarecimentos e resultados de etapas de tarefas de IA, facilitando a navegação e compreensão do fluxo de tarefas.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar detalhes de uma etapa de tarefa de IA para entender seu status e contexto.",
        "derivedRequirements": [
          {
            "description": "Exibir detalhes da etapa e da tarefa em abas separadas.",
            "done": true,
            "comment": "Implementado nas abas Info e Task Details."
          }
        ]
      },
      {
        "story": "Como usuário, quero acessar esclarecimentos gerados por agentes de IA para entender decisões tomadas em etapas.",
        "derivedRequirements": [
          {
            "description": "Renderizar conteúdo de esclarecimento dinamicamente usando o agente correspondente.",
            "done": true,
            "comment": "Implementado via renderClarification e getFile()."
          }
        ]
      },
      {
        "story": "Como usuário, quero ver os próximos passos possíveis após uma etapa para planejar minhas ações.",
        "derivedRequirements": [
          {
            "description": "Listar próximos passos e opções de interação na aba Results.",
            "done": true,
            "comment": "Implementado em renderResults()."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin provides a preview interface for AI agent task steps, allowing users to switch between info, clarification, and results tabs for a given task step.",
    "It dynamically loads clarification content from the relevant agent and displays step and task details, as well as possible next steps.",
    "There are no current user feature requests, bug reports, or planned enhancements registered for this component.",
    "Strings are hardcoded and should be internationalized for broader language support; unsafeHTML is used and should be reviewed for security."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9792,version:2"
}
    