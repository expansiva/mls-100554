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
      "css"
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
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin para integração com GitHub Issues, permitindo listar, filtrar, criar, comentar e votar em issues diretamente pela interface Collab.codes, utilizando LitElement.",
    "goal": "Facilitar a gestão colaborativa de issues do GitHub dentro do Collab.codes, com interface amigável e recursos essenciais de interação.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar a lista de issues do repositório para acompanhar o andamento do projeto.",
        "derivedRequirements": [
          {
            "description": "Implementar listagem de issues com filtro por texto.",
            "done": true,
            "comment": "A listagem e filtro estão implementados via renderList e filter."
          }
        ]
      },
      {
        "story": "Como usuário, quero criar uma nova issue para reportar problemas ou sugerir melhorias.",
        "derivedRequirements": [
          {
            "description": "Implementar formulário para criação de nova issue.",
            "done": true,
            "comment": "Formulário de nova issue implementado em renderNewIssue e addNewIssue."
          }
        ]
      },
      {
        "story": "Como usuário, quero comentar em issues para colaborar com a discussão.",
        "derivedRequirements": [
          {
            "description": "Permitir adicionar comentários em uma issue.",
            "done": true,
            "comment": "Função de comentários implementada em renderComments e clickNewComment."
          }
        ]
      },
      {
        "story": "Como usuário, quero votar (thumbs up) em issues para indicar prioridade.",
        "derivedRequirements": [
          {
            "description": "Permitir adicionar e remover reações de thumbs up.",
            "done": true,
            "comment": "Funções addVote e removeVote implementadas."
          }
        ]
      },
      {
        "story": "Como usuário, quero filtrar issues por label para encontrar rapidamente tópicos relevantes.",
        "derivedRequirements": [
          {
            "description": "Implementar filtro por label.",
            "done": true,
            "comment": "Filtro por label implementado em filterMyIssues."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin integrates GitHub Issues into Collab.codes, allowing users to list, filter, create, comment, and vote on issues using a LitElement-based UI.",
    "The main goal is to streamline collaborative issue management from within Collab.codes, providing essential GitHub issue features in a user-friendly interface.",
    "Future requests may include improved accessibility, i18n support, and enhanced keyboard navigation for custom elements.",
    "Known bugs or enhancements are not currently listed, but the code already covers listing, filtering, commenting, voting, and issue creation."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9824,version:2"
}
    