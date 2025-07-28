/// <mls shortName="pluginExploreList" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginExploreList",
    "type": "plugin",
    "group": "other",
    "tags": [
      "file-explorer",
      "list",
      "collab.codes",
      "plugin",
      "typescript",
      "lit"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [
    ],
    "statesRO": [
      "project",
      "projectLabel",
      "files",
      "history",
      "info.tot",
      "info.version",
      "info.storage",
      "info.error",
      "mode",
      "levelFiles",
      "position",
      "autoPrepare",
      "refresh"
    ],
    "statesRW": [
      "project",
      "projectLabel",
      "files",
      "history",
      "info.tot",
      "info.version",
      "info.storage",
      "info.error",
      "mode",
      "levelFiles",
      "position",
      "autoPrepare",
      "refresh"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_libCommom",
      "./_100554_serviceListFilesAdd"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct assignment to (window as any).securityMode = true in clickOptOpenSecurity. This could be a vector for global state pollution or XSS if not controlled.",
      "Use of .innerHTML in renderHeader and renderLiItem for dynamic content. If any of these variables are user-controlled, this could be a vector for XSS."
    ],
    "unusedImports": [
      "css",
      "repeat",
      "TemplateResult"
    ],
    "deadCodeBlocks": [
      "Commented-out code in verifyChangeInList2 related to mls.stor.server.loadProjectInfoIfNeeded and mls.events.fireFileAction."
    ],
    "accessibility": [
      "No explicit aria-* attributes found in HTML or TS.",
      "Keyboard navigation is partially supported via button and input elements, but no tabindex or focus management is present.",
      "Contrast appears sufficient based on LESS tokens, but actual runtime colors depend on variable values.",
      "Buttons and links use semantic elements, but some clickable spans (e.g., .mls-gpbtnslider-item) may not be accessible for screen readers.",
      "Use of <a> for actions is acceptable but could be improved with role='button' and keyboard handlers."
    ],
    "i18nWarnings": [
      "The placeholder for the filter input is hardcoded as 'Filter' in renderHeader. This should use the i18n system.",
      "Some error messages in validInputsAux and isValidNewName are hardcoded in English and not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin de listagem e gerenciamento de arquivos do projeto no Collab.codes. Permite visualizar, filtrar, adicionar, renomear, clonar, excluir e acessar histórico de arquivos, além de indicar status de erro, armazenamento local e conciliação de versões.",
    "goal": "Facilitar a navegação, organização e manutenção dos arquivos do projeto, integrando operações comuns de gerenciamento de arquivos em uma interface única e intuitiva.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar todos os arquivos do projeto, filtrando por nome ou status, para encontrar rapidamente o que preciso.",
        "derivedRequirements": [
          {
            "description": "Implementar filtro de arquivos por nome.",
            "done": true,
            "comment": "Filtro implementado via input e função filterLiChange."
          },
          {
            "description": "Exibir status de erro, armazenamento local e conciliação de versões.",
            "done": true,
            "comment": "Indicadores visuais implementados em renderLiItem."
          }
        ]
      },
      {
        "story": "Como usuário, quero adicionar, renomear, clonar e excluir arquivos diretamente da lista.",
        "derivedRequirements": [
          {
            "description": "Permitir ações de adicionar, renomear, clonar e excluir arquivos.",
            "done": true,
            "comment": "Ações implementadas via botões e métodos específicos."
          }
        ]
      },
      {
        "story": "Como usuário, quero acessar rapidamente o histórico de arquivos abertos ou modificados.",
        "derivedRequirements": [
          {
            "description": "Exibir histórico de arquivos recentes.",
            "done": true,
            "comment": "Histórico exibido em renderHistory e gerenciado por setHistory."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin provides a file explorer for Collab.codes projects, allowing users to view, filter, and manage project files in a unified interface.",
    "It supports actions like add, rename, clone, delete, and shows file status such as errors, local storage, and version reconciliation.",
    "The interface includes a filter input, history of recent files, and visual indicators for file states, aiming for efficient project navigation.",
    "Future improvements may include enhanced accessibility, better i18n coverage, and stricter security for dynamic HTML rendering."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9760,version:2"
}
    