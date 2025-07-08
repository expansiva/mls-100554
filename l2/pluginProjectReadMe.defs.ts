/// <mls shortName="pluginProjectReadMe" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginProjectReadMe",
    "type": "plugin",
    "group": "other",
    "tags": [
      "readme",
      "markdown",
      "editor"
    ]
  },
  "references": {
    "widgets": [
      "collab-edit-md-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "autoPrepare",
      "body",
      "mkEditor"
    ],
    "statesWO": [],
    "imports": [
      "_100554_pluginBaseModule",
      "_100554_collabEditMd"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct access to global 'mls' object may expose sensitive project data if not properly sandboxed.",
      "No explicit sanitization of markdown content before rendering in the editor, potential XSS risk if CollabEditMd is not secure."
    ],
    "unusedImports": [
      "css"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Header structure uses proper h2 tag for semantic hierarchy.",
      "SVG icon lacks aria-label or title for screen readers.",
      "No keyboard navigation or focus management for markdown editor.",
      "No ARIA attributes for plugin container or editor."
    ],
    "i18nWarnings": [
      "Static string 'ReadMe: ${project}' should be internationalized.",
      "Static header 'README.md' is not localized.",
      "No i18n mechanism detected for UI strings."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para visualização e edição do arquivo README.md do projeto, fornecendo uma interface integrada para documentação",
    "goal": "Permitir que usuários visualizem e editem facilmente o arquivo README.md do projeto através de um editor markdown integrado",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero visualizar e editar o README.md do meu projeto para manter a documentação atualizada",
        "derivedRequirements": [
          {
            "description": "Implementar carregamento automático do arquivo README.md existente",
            "done": true,
            "comment": "Implementado no método setReadme()"
          },
          {
            "description": "Integrar editor markdown para edição do conteúdo",
            "done": true,
            "comment": "Usando CollabEditMd component"
          },
          {
            "description": "Salvar automaticamente as alterações no arquivo",
            "done": true,
            "comment": "Implementado no método onChangeMd()"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar preview em tempo real do markdown",
        "done": false,
        "comment": "Funcionalidade pode estar disponível no CollabEditMd"
      },
      {
        "description": "Implementar auto-save durante a edição",
        "done": false,
        "comment": "Atualmente salva apenas no callback de finish edit"
      },
      {
        "description": "Adicionar validação de sintaxe markdown",
        "done": false,
        "comment": ""
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Verificar comportamento quando projeto não está definido",
        "done": true,
        "comment": "Tratamento implementado com early returns"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar feedback visual durante carregamento do arquivo",
        "done": false,
        "comment": ""
      },
      {
        "description": "Adicionar suporte a templates de README",
        "done": false,
        "comment": ""
      },
      {
        "description": "Implementar histórico de versões do README",
        "done": false,
        "comment": ""
      }
    ]
  },
  "textToEmbedding": [
    "This plugin allows users to view and edit the project's README.md file using an integrated markdown editor. The main goal is to keep project documentation up to date and easily accessible within the Collab.codes environment.",
    "Future requests include real-time markdown preview, auto-save during editing, and markdown syntax validation. There is also interest in improving visual feedback during file loading and supporting README templates.",
    "A bug related to undefined project handling has been addressed. Enhancements like version history for the README are planned but not yet implemented.",
    "Security and accessibility need improvement, especially regarding markdown sanitization and ARIA support. Internationalization for static UI strings is also lacking."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9792,version:2"
}
    