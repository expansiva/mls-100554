/// <mls shortName="pluginPreviewInsights" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginPreviewInsights",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [
      "preview.service"
    ],
    "statesRW": [
      "defs",
      "loading",
      "mode"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_stateLitElement",
      "./_100554_collabIcons",
      "./_100554_collabState",
      "./_100554_serviceSource",
      "./_100554_collabInputTag",
      "./_100554_widgetDefsPlanningChecklistEdit",
      "./_100554_widgetDefsListEdit"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "No use of innerHTML or direct window access detected.",
      "No hardcoded tokens or sensitive data found.",
      "User input is handled via controlled components, but no explicit sanitization for tags input."
    ],
    "unusedImports": [
      "css (imported from 'lit', not used in code)"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Uses native <input>, <button>, <details>, <summary> for basic accessibility.",
      "No explicit aria-* attributes present.",
      "Tab navigation is possible via native elements.",
      "Color contrast depends on theme variables; appears sufficient.",
      "Suggestion: Add explicit labels and aria-labels for better accessibility."
    ],
    "i18nWarnings": [
      "Some UI strings like 'Add', 'No planning', 'Save', and error messages are not internationalized.",
      "Most essential messages are internationalized via the messages object."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Componente de preview de insights para plugins, widgets e estados do Collab.codes. Permite visualizar e editar metadados, referências técnicas, métricas de qualidade de código e planejamento de funcionalidades.",
    "goal": "Facilitar a análise, documentação e melhoria contínua de plugins e widgets, centralizando informações técnicas, métricas e planejamento em um painel interativo.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero visualizar rapidamente os metadados, referências e métricas de qualidade de um plugin/widget, para facilitar manutenção e evolução.",
        "derivedRequirements": [
          {
            "description": "Exibir metadados editáveis (grupo, tags) do componente.",
            "done": true,
            "comment": "Implementado em renderMeta()."
          },
          {
            "description": "Listar widgets, plugins, estados e imports referenciados.",
            "done": true,
            "comment": "Implementado em renderWidgets(), renderPlugins(), renderStatesRO(), etc."
          },
          {
            "description": "Exibir métricas de qualidade de código (correctness, errorHandling, readability, maintainability).",
            "done": true,
            "comment": "Implementado em renderCodeQualityMetrics()."
          },
          {
            "description": "Permitir edição inline de listas de referências e insights.",
            "done": true,
            "comment": "Feito via widget-defs-list-edit-100554."
          },
          {
            "description": "Internacionalizar títulos e labels principais.",
            "done": true,
            "comment": "Mensagens principais internacionalizadas via objeto messages."
          }
        ]
      },
      {
        "story": "Como PO/analista, quero visualizar e atualizar o planejamento (user stories, features, bugs, enhancements) de cada plugin/widget.",
        "derivedRequirements": [
          {
            "description": "Exibir user stories e requisitos derivados em formato checklist.",
            "done": true,
            "comment": "Implementado em renderUserStories()."
          },
          {
            "description": "Permitir adicionar/remover itens de planejamento.",
            "done": true,
            "comment": "Funções addStoryItem, deleteStoryItem, etc."
          },
          {
            "description": "Exibir solicitações de features, bugs e melhorias.",
            "done": true,
            "comment": "Implementado em renderUserRequestFeatures(), renderUserRequestsBugs(), renderUserRequestsEnhancements()."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a mais idiomas além de PT e EN.",
        "done": false,
        "comment": "Estrutura permite expansão, mas só PT/EN implementados."
      },
      {
        "description": "Permitir salvar rascunho das edições antes de salvar definitivo.",
        "done": false,
        "comment": "Atualmente só salva direto ao clicar em Save."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Injeção de javascript via campos de input/tag.",
        "done": false,
        "comment": "Fazer validação para não permitir injeção de código."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com labels e aria-*.",
        "done": false,
        "comment": "Inputs não possuem labels explícitos nem aria-label."
      }
    ]
  },
  "textToEmbedding": [
    "This component provides a preview and editing interface for plugin and widget insights in Collab.codes.",
    "It displays and allows editing of metadata, technical references, code quality metrics, and planning (user stories, features, bugs, enhancements).",
    "Most essential UI strings are internationalized, but some actions and error messages are not.",
    "Future improvements include better accessibility, more language support, and input sanitization to prevent code injection."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9768,version:2"
}
    