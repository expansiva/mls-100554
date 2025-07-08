/// <mls shortName="collabDsInputSelectColor" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabDsInputSelectColor",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "input",
      "color",
      "select",
      "custom-element"
    ]
  },
  "references": {
    "widgets": [
      "collab-ds-input-select-color-100554"
    ],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabLitElement",
      "./_100554_libCommom"
    ],
    "statesRO": [],
    "statesRW": [
      "_valueInput",
      "_valueSelect",
      "_valueColor",
      "prop",
      "useInput",
      "useSelect",
      "useColor",
      "arrayInputSelect",
      "arraySelect"
    ],
    "statesWO": []
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM querying via querySelector can be fragile if DOM structure changes.",
      "No input sanitization for CustomEvent payloads, but risk is low in this context."
    ],
    "unusedImports": [
      "css"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "No explicit aria-* attributes present.",
      "Inputs and selects are focusable by default, but no custom keyboard navigation.",
      "Color input is accessible, but no label is provided for any input.",
      "Consider adding labels or aria-labels for better accessibility."
    ],
    "i18nWarnings": [
      "No i18n implementation; option values and placeholders are not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Widget customizado para seleção de valores compostos: número, unidade e cor. Permite configuração dinâmica de quais campos exibir (input, select, color). Utilizado para facilitar a entrada de valores CSS ou similares em interfaces visuais.",
    "goal": "Oferecer um componente flexível para entrada de valores compostos (ex: '10px #ff0000'), facilitando a edição visual de propriedades CSS ou parâmetros similares.",
    "userStories": [
      {
        "story": "Como usuário de interface visual, quero selecionar rapidamente valores numéricos, unidades e cores em um único componente para configurar estilos ou parâmetros.",
        "derivedRequirements": [
          {
            "description": "Permitir ativar/desativar input numérico, select de unidade e seletor de cor via propriedades.",
            "done": true,
            "comment": "Implementado via propriedades useInput, useSelect, useColor."
          },
          {
            "description": "Emitir evento onchange com os valores selecionados sempre que houver alteração.",
            "done": true,
            "comment": "Implementado via fireEvents e CustomEvent."
          },
          {
            "description": "Permitir configuração dinâmica das opções do select.",
            "done": true,
            "comment": "arrayInputSelect e arraySelect disponíveis para configuração externa."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a labels acessíveis para todos os campos.",
        "done": false,
        "comment": "Não implementado; importante para acessibilidade."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Valor do select pode não ser atualizado corretamente se DOM mudar inesperadamente.",
        "done": false,
        "comment": "Uso de querySelector pode ser frágil em DOM dinâmico."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Internacionalizar opções e placeholders.",
        "done": false,
        "comment": "Sem suporte i18n atualmente."
      }
    ]
  },
  "textToEmbedding": [
    "This widget enables users to select a number, unit, and color in a single UI component.",
    "It is configurable to show/hide input, select, or color fields, and emits onchange events.",
    "Accessibility could be improved by adding labels; i18n is not implemented for option values.",
    "Future enhancements include better accessibility and internationalization support."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9796,version:2"
}
    