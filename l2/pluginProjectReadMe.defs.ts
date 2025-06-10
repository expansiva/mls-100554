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
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "_100554_pluginBaseModule",
      "_100554_collabEditMd"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Header structure uses proper h2 tag for semantic hierarchy",
      "SVG icon lacks aria-label or title for screen readers",
      "No keyboard navigation considerations for the markdown editor interaction"
    ],
    "i18nWarnings": [],
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
        "done": false
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
        "done": false
      },
      {
        "description": "Adicionar suporte a templates de README",
        "done": false
      },
      {
        "description": "Implementar histórico de versões do README",
        "done": false
      }
    ]
  }
}
    