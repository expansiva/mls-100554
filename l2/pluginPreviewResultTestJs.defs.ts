/// <mls shortName="pluginPreviewResultTestJs" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginPreviewResultTestJs",
    "type": "plugin",
    "group": "other",
    "tags": [
      "development",
      "compiler",
      "preview"
    ]
  },
  "references": {
    "widgets": [
      "mls-editor-100529"
    ],
    "plugins": [],
    "statesRO": [
      "mls.actual[2].left",
      "mls.editor.models",
      "mls.editor.conf"
    ],
    "statesRW": [],
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
      "Direct access to global 'mls' object without validation",
      "Type assertion '(mls.actual[2] as any).left' bypasses type safety"
    ],
    "unusedImports": [
      "getDependenciesByMFile from './_100554_libCompile' - imported but not used"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Editor component lacks ARIA labels for screen readers",
      "No keyboard navigation support documented",
      "Missing focus management for editor interactions"
    ],
    "i18nWarnings": [
      "String 'compiling...' should be internationalized",
      "Error messages in JSON.stringify output are not translated"
    ],
    "correctness": 7,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para visualizar resultados de compilação de arquivos de teste JavaScript, fornecendo uma interface de editor somente leitura para mostrar o código JavaScript produzido e erros de compilação.",
    "goal": "Permitir aos desenvolvedores visualizar o resultado da compilação de seus arquivos de teste TypeScript em JavaScript, facilitando a depuração e validação do código gerado.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero visualizar o código JavaScript compilado dos meus testes para verificar se a compilação está gerando o código esperado",
        "derivedRequirements": [
          {
            "description": "Implementar editor Monaco somente leitura para exibir JavaScript compilado",
            "done": true,
            "comment": "Editor criado com readOnly: true"
          },
          {
            "description": "Carregar automaticamente o arquivo atual selecionado",
            "done": true,
            "comment": "Implementado no firstUpdated()"
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero ver os erros de compilação para corrigir problemas no meu código de teste",
        "derivedRequirements": [
          {
            "description": "Capturar e exibir erros de compilação do TypeScript",
            "done": true,
            "comment": "Erros capturados em getCompileResults()"
          },
          {
            "description": "Formatar erros de forma legível",
            "done": true,
            "comment": "Usando JSON.stringify com indentação"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar syntax highlighting específico para JavaScript compilado",
        "done": false,
        "comment": "Atualmente usa highlighting padrão do Monaco"
      },
      {
        "description": "Implementar refresh automático quando o arquivo fonte é modificado",
        "done": false,
        "comment": "Requer implementação de watchers"
      },
      {
        "description": "Adicionar opção para copiar código compilado",
        "done": false,
        "comment": "Funcionalidade de clipboard não implementada"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir import não utilizado getDependenciesByMFile",
        "done": false,
        "comment": "Import presente mas não usado no código"
      },
      {
        "description": "Melhorar tratamento de erro quando actualFile é undefined",
        "done": false,
        "comment": "Apenas return sem feedback ao usuário"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar internacionalização para mensagens de status",
        "done": false,
        "comment": "Estrutura i18n existe mas está vazia"
      },
      {
        "description": "Implementar indicador visual de status de compilação",
        "done": false,
        "comment": "Apenas texto 'compiling...' temporário"
      },
      {
        "description": "Melhorar acessibilidade com ARIA labels e navegação por teclado",
        "done": false,
        "comment": "Editor Monaco precisa de configurações de acessibilidade"
      }
    ]
  }
}
    