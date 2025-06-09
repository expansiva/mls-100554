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
      "_100554_serviceListFilesAdd"
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
    ]
  },
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    