/// <mls shortName="collabIcaConfigAttributes" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabIcaConfigAttributes",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "attributes",
      "ica",
      "config"
    ]
  },
  "references": {
    "widgets": [
      "collab-ica-config-attributes-100554"
    ],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase",
      "./_100554_collabLitElement"
    ],
    "statesRO": [],
    "statesRW": [
      "myParent",
      "myAttributes",
      "servicePreview"
    ],
    "statesWO": []
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM access via querySelector and shadowRoot in getMyAttributes(). If the iframe or embedded content is not trusted, this can be a vector for XSS or privilege escalation.",
      "No sanitization of attribute values before rendering in input fields. If attribute values are user-controlled, this could lead to DOM-based XSS."
    ],
    "unusedImports": [
      "initCollabICATree"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Input fields in renderItem do not have associated <label> elements, which may hinder screen reader accessibility.",
      "No aria-* attributes or tabindex management present.",
      "Color tokens are defined in LESS, but no evidence of their use in the HTML output."
    ],
    "i18nWarnings": [
      "The string in <h3> uses i18n, but the <span> in renderItem uses item.key directly, which may be a user-facing string that should be internationalized if keys are not technical."
    ],
    "correctness": 8,
    "errorHandling": 5,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Widget para exibir e editar atributos de elementos ICA em uma interface baseada em LitElement. Busca atributos de um elemento específico dentro de um iframe e os exibe em uma lista editável.",
    "goal": "Permitir que usuários visualizem e editem atributos de elementos ICA de forma dinâmica e integrada ao Collab.codes.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar todos os atributos de um elemento ICA para poder entender e modificar suas propriedades.",
        "derivedRequirements": [
          {
            "description": "Buscar atributos do elemento ICA ativo e exibi-los em uma lista.",
            "done": true,
            "comment": "Implementado em getMyAttributes() e render()."
          },
          {
            "description": "Permitir edição inline dos valores dos atributos.",
            "done": false,
            "comment": "Inputs são exibidos, mas não há lógica de atualização dos valores."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para salvar alterações feitas nos atributos diretamente no elemento ICA.",
        "done": false,
        "comment": "Inputs exibem valores, mas não há evento de update implementado."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade adicionando labels e suporte a teclado.",
        "done": false,
        "comment": "Inputs não possuem labels e não há atributos aria."
      },
      {
        "description": "Internacionalizar todos os textos exibidos, incluindo nomes de atributos se aplicável.",
        "done": false,
        "comment": "Somente mensagem de 'nenhum item' está internacionalizada."
      }
    ]
  },
  "textToEmbedding": [
    "This widget displays and allows editing of ICA element attributes using LitElement.",
    "It fetches attributes from a nested iframe and presents them in an editable list.",
    "Currently, editing is not persisted and accessibility is limited (no labels, no aria).",
    "Future improvements include saving changes, better i18n, and enhanced accessibility."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9796,version:2"
}
    