/// <mls shortName="pluginProjectConfig" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "other",
    "shortName": "pluginProjectConfig",
    "type": "plugin",
    "group": "configuration",
    "tags": [
      "config",
      "project-management",
      "editor"
    ]
  },
  "references": {
    "widgets": [
      "mls-editor-100529"
    ],
    "plugins": [],
    "statesRO": [
      "mls.actual[5].project"
    ],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "./_100554_pluginBaseModule",
      "./_100554_libProjectConfig"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Use of eval() function in onEditorChange() method poses security risk - line: eval(val)",
      "Direct access to window object for storing project_config"
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Missing aria-labels on buttons",
      "No keyboard navigation support for editor interactions",
      "Missing focus management for dynamic content",
      "Button lacks descriptive text for screen readers"
    ],
    "i18nWarnings": [
      "String 'Config' in pluginData.title should be internationalized",
      "Error messages and validation feedback not internationalized"
    ],
    "correctness": 7,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin para configuração de projetos que permite editar configurações através de um editor Monaco integrado",
    "goal": "Fornecer uma interface intuitiva para gerenciar configurações de projeto com validação em tempo real",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero editar configurações do projeto em um editor com syntax highlighting para facilitar a manutenção",
        "derivedRequirements": [
          {
            "description": "Implementar editor Monaco com suporte a TypeScript",
            "done": true,
            "comment": "Editor já implementado e funcional"
          },
          {
            "description": "Adicionar validação de sintaxe em tempo real",
            "done": true,
            "comment": "Validação através de Monaco markers implementada"
          }
        ]
      },
      {
        "story": "Como usuário, quero limpar alterações não salvas para reverter configurações problemáticas",
        "derivedRequirements": [
          {
            "description": "Implementar botão de limpar alterações",
            "done": true,
            "comment": "Botão 'Clear changes' implementado"
          },
          {
            "description": "Integrar com sistema de cache local",
            "done": true,
            "comment": "Integração com libProjectConfig para gerenciar cache"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar preview das configurações antes de aplicar",
        "done": false,
        "comment": "Seria útil para validar configurações complexas"
      },
      {
        "description": "Implementar histórico de alterações",
        "done": false,
        "comment": "Para rastrear mudanças ao longo do tempo"
      },
      {
        "description": "Adicionar templates de configuração pré-definidos",
        "done": false,
        "comment": "Para acelerar setup de novos projetos"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir problema de segurança com uso de eval()",
        "done": false,
        "comment": "Substituir eval() por parser JSON seguro"
      },
      {
        "description": "Melhorar tratamento de erros quando projeto não existe",
        "done": false,
        "comment": "Adicionar validações e mensagens de erro apropriadas"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com aria-labels e navegação por teclado",
        "done": false,
        "comment": "Importante para usuários com deficiências"
      },
      {
        "description": "Adicionar auto-save das configurações",
        "done": false,
        "comment": "Para evitar perda de trabalho"
      },
      {
        "description": "Implementar validação de schema para configurações",
        "done": false,
        "comment": "Para garantir integridade dos dados"
      }
    ]
  }
}
    