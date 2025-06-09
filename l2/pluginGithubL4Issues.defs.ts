/// <mls shortName="pluginGithubL4Issues" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginGithubL4Issues",
    "type": "plugin",
    "group": "other",
    "tags": [
      "github",
      "issues",
      "lit",
      "collab.codes"
    ]
  },
  "references": {
    "widgets": [
      "backbutton",
      "buttonnewissues",
      "contentlistissues",
      "contentlistitem",
      "contentlabels",
      "contentlabel",
      "contentthumb",
      "contentshow",
      "votethumbsup",
      "contentshowcomments",
      "itemcomment",
      "commentavatar",
      "boxcomment",
      "boxcommentheader",
      "boxcommentbody",
      "contentnewcomment",
      "contentnewissue",
      "contentissuescogs",
      "contentissuescogsinfo"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "error",
      "scenary",
      "myIssues",
      "isLoader",
      "labelfilter"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_libCommom",
      "./_100554_libGithubIo",
      "./_100554_collabLitElement"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Usage of unsafeHTML in renderComments may allow XSS if comment bodies are not sanitized before being passed to the component."
    ],
    "unusedImports": [
      "css",
      "html",
      "TemplateResult",
      "repeat",
      "svg"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "SVGs used as icons do not have aria-label or role attributes for accessibility.",
      "No explicit keyboard navigation/focus management for custom elements like backbutton, buttonnewissues, etc.",
      "Color contrast appears sufficient, but some color tokens are hardcoded and may not meet all accessibility standards.",
      "Inputs and buttons lack aria-labels or descriptive text for screen readers.",
      "No tabindex management for custom interactive elements."
    ],
    "i18nWarnings": [
      "Strings like 'No issues', 'Add Title', 'Add a description', 'Add new issue', 'Add a comment', 'Comment', 'Fill in all the information!', 'Erro to add issue', 'Erro add comment', 'Priorities:', 'Low', 'Medium', 'High', 'Close Issue', 'Filter issues ...' are hardcoded and should be internationalized if i18n is enabled."
    ]
  },
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    