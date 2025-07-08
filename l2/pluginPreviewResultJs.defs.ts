/// <mls shortName="pluginPreviewResultJs" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginPreviewResultJs",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [
      "mls-editor-100529"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "msize"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_libCompile"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct access to global 'mls' object may expose security risks if not sandboxed.",
      "Direct use of 'monaco' global object; ensure it is not user-injectable.",
      "No explicit sanitization for dynamic content in editor models."
    ],
    "unusedImports": [
      "css",
      "svg",
      "repeat",
      "TemplateResult"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "No ARIA attributes or roles found in HTML.",
      "Custom element <mls-editor-100529> should ensure keyboard accessibility.",
      "No tabindex or focus management detected.",
      "No color contrast issues detected in LESS tokens, but actual usage not shown."
    ],
    "i18nWarnings": [
      "The string in <h1>_100554_pluginPreviewResultJs</h1> is not internationalized.",
      "All user-facing messages in TS are properly internationalized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Este plugin exibe o resultado da compilação de arquivos JavaScript/TypeScript em um editor somente leitura, mostrando erros, código compilado e dependências. Utiliza Monaco Editor e integra-se ao sistema Collab.codes.",
    "goal": "Permitir que usuários visualizem rapidamente o resultado da compilação de arquivos JS/TS, incluindo erros e dependências, de forma clara e segura.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar o código compilado e os erros de um arquivo JS/TS para entender rapidamente o resultado da compilação.",
        "derivedRequirements": [
          {
            "description": "Exibir o código compilado em um editor somente leitura.",
            "done": true,
            "comment": "Implementado via Monaco Editor em modo readOnly."
          },
          {
            "description": "Mostrar mensagens de erro de compilação, se houver.",
            "done": true,
            "comment": "Erros são exibidos em formato JSON."
          },
          {
            "description": "Internacionalizar mensagens de interface.",
            "done": true,
            "comment": "Mensagens implementadas para 'en' e 'pt'."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para múltiplos idiomas além de inglês e português.",
        "done": false,
        "comment": "Atualmente apenas 'en' e 'pt' estão disponíveis."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Editor não atualiza corretamente ao trocar o arquivo.",
        "done": false,
        "comment": "Necessário verificar se o modelo é atualizado ao trocar de arquivo."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Permitir copiar o código compilado diretamente do editor.",
        "done": false,
        "comment": "Funcionalidade de copiar não implementada."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin displays the result of JS/TS compilation in a read-only Monaco Editor.",
    "It shows compiled code, errors, and dependencies, with i18n for English and Portuguese.",
    "Planned improvements include multi-language support and copy-to-clipboard for compiled code.",
    "Known issues: editor may not update on file change; only two languages supported."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9740,version:2"
}
    