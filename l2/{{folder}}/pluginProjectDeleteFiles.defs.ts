/// <mls shortName="pluginProjectDeleteFiles" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "{{folder}}",
    "shortName": "pluginProjectDeleteFiles",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "file-management",
      "delete",
      "i18n",
      "collab.codes"
    ]
  },
  "references": {
    "plugins": [
      "plugin-project-delete-files-100554"
    ],
    "statesRO": [],
    "statesRW": [
      "groupName",
      "filesToDelete",
      "logs"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_agentNewModuleCreate"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct access to mls.actual[5].project in onSearch may be unsafe if mls is not validated.",
      "No explicit error handling for async calls to getListFilesToDelete and deleteAllFiles.",
      "No validation on file data before deletion."
    ],
    "unusedImports": [
      "customElement"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Labels are correctly associated with inputs.",
      "No explicit aria-* attributes found.",
      "Checkboxes are accessible via keyboard.",
      "Contrast in logs area is good (white on black).",
      "No tabindex management, but default navigation is sufficient."
    ],
    "i18nWarnings": [
      "Log messages like 'No project selected' and 'All files removed' are not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin para deletar arquivos locais de um projeto no Collab.codes. Permite pesquisar arquivos por grupo, selecionar múltiplos arquivos e deletá-los em lote, exibindo logs do processo.",
    "goal": "Facilitar a limpeza de arquivos desnecessários em projetos, com interface simples e suporte a múltiplos idiomas.",
    "userStories": [
      {
        "story": "Como usuário, quero pesquisar arquivos por grupo e tipo para poder selecionar e deletar arquivos desnecessários do projeto.",
        "derivedRequirements": [
          {
            "description": "Permitir busca de arquivos por grupo.",
            "done": true,
            "comment": "Implementado via campo de busca e chamada getListFilesToDelete."
          },
          {
            "description": "Permitir seleção múltipla de arquivos para deleção.",
            "done": true,
            "comment": "Checkboxes implementados na lista de arquivos."
          },
          {
            "description": "Exibir logs das operações de deleção.",
            "done": true,
            "comment": "Logs exibidos em área específica após operações."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar filtro por tipo de arquivo além do grupo.",
        "done": false,
        "comment": "Campo de tipo de arquivo está presente na UI, mas não está funcional."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Mensagens de log não são traduzidas conforme idioma selecionado.",
        "done": false,
        "comment": "Mensagens como 'No project selected' e 'All files removed' estão hardcoded em inglês."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar confirmação antes de deletar arquivos.",
        "done": false,
        "comment": "Atualmente, a deleção ocorre imediatamente após o clique."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin allows users to search and delete local files in a Collab.codes project.",
    "It supports searching by group, multi-selection via checkboxes, and batch deletion with log feedback.",
    "There is partial i18n support, but some log messages remain untranslated. Error handling for async operations is minimal.",
    "Future improvements include file type filtering, confirmation dialogs before deletion, and full i18n coverage."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9748,version:2"
}
    