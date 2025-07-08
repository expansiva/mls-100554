/// <mls shortName="pluginProjectDeleteFiles" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginProjectDeleteFiles",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "file-management",
      "delete",
      "plugin"
    ]
  },
  "references": {
    "plugins": [],
    "widgets": [],
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
      "Direct access to mls.actual[5].project and mls.stor.files may be unsafe if not validated.",
      "No validation on user input for groupName before using in getListFilesToDelete."
    ],
    "unusedImports": [
      "svg"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Input fields have associated labels, which is good.",
      "No explicit aria-* attributes found; consider adding for better screen reader support.",
      "Buttons are accessible via keyboard by default.",
      "Checkboxes are labeled, but no aria-checked or role attributes for enhanced accessibility.",
      "No tabindex management, but default order is logical."
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
    "goal": "Facilitar a limpeza de arquivos desnecessários em projetos, com interface simples e feedback ao usuário.",
    "userStories": [
      {
        "story": "Como usuário, quero pesquisar arquivos por grupo e tipo para poder selecionar e deletar arquivos desnecessários do meu projeto.",
        "derivedRequirements": [
          {
            "description": "Permitir pesquisa de arquivos por grupo.",
            "done": true,
            "comment": "Implementado via campo de texto e botão de pesquisa."
          },
          {
            "description": "Exibir lista de arquivos encontrados com opção de seleção múltipla.",
            "done": true,
            "comment": "Checkboxes implementados na lista."
          },
          {
            "description": "Permitir deleção em lote dos arquivos selecionados.",
            "done": true,
            "comment": "Botão de deletar implementado, chama deleteAllFiles."
          },
          {
            "description": "Exibir logs do processo de deleção.",
            "done": true,
            "comment": "Logs exibidos em lista após operação."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar filtro por tipo de arquivo além do grupo.",
        "done": false,
        "comment": "Campo de filtro de tipo está no layout, mas não implementado na lógica."
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
        "description": "Melhorar acessibilidade com atributos aria e suporte a leitores de tela.",
        "done": false,
        "comment": "Atributos aria-* não presentes, pode dificultar uso por pessoas com deficiência visual."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin allows users to search and delete local project files in bulk, providing a simple UI for group-based search, multi-selection, and log feedback.",
    "The main goal is to help users clean up unnecessary files efficiently, with clear feedback and minimal steps.",
    "There are requests to add file type filtering and to internationalize log messages, as well as to improve accessibility for screen readers.",
    "Some security and error handling improvements are needed, especially regarding user input validation and i18n for all user-facing messages."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9752,version:2"
}
    