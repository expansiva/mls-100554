/// <mls shortName="collabDsInputRange" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabDsInputRange",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "input",
      "range",
      "custom-element"
    ]
  },
  "references": {
    "widgets": [
      "collab-ds-input-range-100554"
    ],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_stateLitElement"
    ],
    "statesRW": [
      "this.value",
      "this.valueInput",
      "this.useSelect",
      "this.prop",
      "this.arraySelect",
      "this.cursorPosition"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM access via querySelector (input, select) can be fragile if structure changes.",
      "No sanitization for input values, but only numbers/letters are allowed, reducing risk.",
      "No use of innerHTML or direct window access detected."
    ],
    "unusedImports": [
      "initCollabDSInputRange"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "No aria-* attributes present on input/select.",
      "No explicit label for input or select; consider adding for better accessibility.",
      "Keyboard navigation is possible (input/select), but focus style is not customized.",
      "No tabindex used, but default tab order is preserved."
    ],
    "i18nWarnings": [
      "No i18n implementation detected; static strings like 'px' and option values are not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Componente customizado Lit para entrada de valores numéricos com sufixo (ex: px, %, etc), permitindo ajuste via input de texto e seleção de unidade. Suporta incremento/decremento via scroll do mouse e dispara eventos customizados para integração.",
    "goal": "Permitir ao usuário inserir valores numéricos com unidade de medida, facilitando ajustes rápidos e integração com outros componentes.",
    "userStories": [
      {
        "story": "Como usuário, quero inserir um valor numérico e escolher uma unidade (ex: px, %, em) para configurar propriedades de estilo de forma rápida.",
        "derivedRequirements": [
          {
            "description": "Permitir digitação apenas de números e ponto decimal no campo de input.",
            "done": true,
            "comment": "Implementado via regex em changeInput."
          },
          {
            "description": "Permitir seleção de unidade via dropdown.",
            "done": true,
            "comment": "Dropdown implementado com arraySelect."
          },
          {
            "description": "Permitir ajuste do valor via scroll do mouse.",
            "done": true,
            "comment": "handleWhell implementa ajuste incremental."
          },
          {
            "description": "Disparar evento onchange ao alterar valor ou unidade.",
            "done": true,
            "comment": "fireEvents implementado."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a labels acessíveis para input e select.",
        "done": false,
        "comment": "Não implementado; necessário para acessibilidade."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Valor do input pode ficar inconsistente se usuário digitar múltiplos pontos decimais.",
        "done": false,
        "comment": "changeInput tenta corrigir, mas pode não cobrir todos os casos."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Permitir configuração dinâmica das unidades disponíveis via propriedade.",
        "done": false,
        "comment": "arraySelect é pública, mas não há documentação clara sobre uso externo."
      }
    ]
  },
  "textToEmbedding": [
    "This widget is a Lit-based custom input for numeric values with selectable units (e.g., px, %).",
    "It allows users to type numbers, pick a unit from a dropdown, and adjust values with mouse wheel.",
    "The component emits onchange events for integration and restricts input to valid numeric formats.",
    "Accessibility and i18n are limited; future improvements include better labeling and dynamic unit options."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9796,version:2"
}
    