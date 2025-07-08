/// <mls shortName="collabJsonType" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabJsonType",
    "type": "widget",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [
      "collab-json-type-100554"
    ],
    "imports": [
      "lit",
      "lit/decorators.js"
    ],
    "statesRO": [],
    "statesRW": [
      "json",
      "jsonInfo"
    ],
    "statesWO": []
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [
      "css"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "No ARIA attributes or keyboard navigation detected. Consider adding ARIA roles or tabindex for better accessibility if this widget is to be used interactively."
    ],
    "i18nWarnings": [
      "Not json",
      "field:",
      "type:"
    ],
    "correctness": 9,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Este widget exibe a estrutura de um objeto JSON em formato de árvore, mostrando campos e tipos de dados de forma recursiva. Ele utiliza LitElement e repete os campos dinamicamente, permitindo visualizar a estrutura de qualquer objeto JSON fornecido.",
    "goal": "Permitir a visualização clara e recursiva da estrutura de objetos JSON, facilitando o entendimento de dados complexos para desenvolvedores e usuários técnicos.",
    "userStories": [
      {
        "story": "Como usuário técnico, quero visualizar a estrutura de um objeto JSON para entender rapidamente seus campos e tipos.",
        "derivedRequirements": [
          {
            "description": "Renderizar a estrutura do JSON em formato de árvore, exibindo campos e tipos.",
            "done": true,
            "comment": "Implementado via renderJson e renderItem."
          },
          {
            "description": "Permitir visualização recursiva de objetos e arrays aninhados.",
            "done": true,
            "comment": "A recursão está implementada em renderItem e generateJsonFromInterface."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a colapso/expansão de nós na árvore.",
        "done": false,
        "comment": "Não implementado; atualmente todos os nós são sempre expandidos."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Internacionalizar os textos exibidos ('Not json', 'field', 'type').",
        "done": false,
        "comment": "Strings estão hardcoded em inglês, sem suporte a i18n."
      }
    ]
  },
  "textToEmbedding": [
    "This widget displays the structure of a JSON object as a recursive tree, showing fields and types. It uses LitElement and dynamic rendering to help developers understand complex data.",
    "The main goal is to provide a clear, recursive visualization of any JSON structure, making it easier for technical users to inspect data models.",
    "Future requests include adding node collapse/expand functionality and supporting i18n for displayed strings.",
    "Currently, all nodes are always expanded and some UI strings are hardcoded in English, lacking internationalization."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9796,version:2"
}
    