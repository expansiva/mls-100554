/// <mls shortName="pluginCodelensFileReferences" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginCodelensFileReferences",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [],
    "plugins": [
      "plugin-codelens-file-references-100554"
    ],
    "statesRO": [
      "references",
      "project",
      "shortName",
      "position"
    ],
    "statesRW": [
      "references",
      "project",
      "shortName",
      "position"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabLitElement"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct usage of global object 'mls' (mls.events.fire, mls.editor.models) may pose security risks if not sandboxed or validated.",
      "No validation or sanitization of 'ref.storFile.project', 'ref.storFile.shortName', or 'ref.storFile.extension' before using in event payload."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "The method getReferences always returns an empty array and is not used to update the component state after async call."
    ],
    "accessibility": [
      "No explicit accessibility attributes (aria-*) found in HTML.",
      "Links (<a>) are used for actions but do not have role or tabindex set. Consider adding role=\"button\" and tabindex=\"0\" for better accessibility.",
      "No visible focus style enforced for interactive elements."
    ],
    "i18nWarnings": [
      "The strings in the render method are properly internationalized using the i18n section.",
      "No hardcoded user-facing strings outside the i18n block."
    ],
    "correctness": 7,
    "errorHandling": 5,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin que exibe referências de arquivos no Collab.codes, mostrando onde determinado arquivo é referenciado em outros arquivos do projeto. Utiliza LitElement e internacionalização básica.",
    "goal": "Permitir ao usuário visualizar rapidamente todas as referências de um arquivo dentro do projeto, facilitando navegação e entendimento de dependências.",
    "userStories": [
      {
        "story": "Como usuário, quero ver todas as referências de um arquivo para entender onde ele é utilizado.",
        "derivedRequirements": [
          {
            "description": "Exibir lista de referências de arquivos relacionados ao arquivo atual.",
            "done": false,
            "comment": "A estrutura está presente, mas a busca real de referências não está implementada."
          },
          {
            "description": "Permitir navegação ao clicar em uma referência.",
            "done": true,
            "comment": "A navegação é disparada via evento mls.events.fire."
          },
          {
            "description": "Internacionalizar mensagens exibidas ao usuário.",
            "done": true,
            "comment": "Mensagens estão internacionalizadas para pt e en."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a mais idiomas além de pt e en.",
        "done": false,
        "comment": "Atualmente só pt e en estão disponíveis."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Referências nunca aparecem, mesmo quando deveriam existir.",
        "done": false,
        "comment": "O método getReferences sempre retorna array vazio, impedindo exibição de referências reais."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade dos links de referência.",
        "done": false,
        "comment": "Links não possuem role ou tabindex, dificultando navegação por teclado."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin displays file references in Collab.codes, showing where a file is used.",
    "Its goal is to help users quickly see all references to a file for better navigation.",
    "Currently, references are not shown due to getReferences always returning an empty array.",
    "Accessibility and multi-language support are present, but could be improved further."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9796,version:2"
}
    