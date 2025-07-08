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
  },
  "textToEmbedding": [
    "This plugin provides a read-only editor to preview JavaScript output and errors",
    "from TypeScript test file compilation. It helps developers debug and validate",
    "the generated code. There are requests for syntax highlighting, auto-refresh,",
    "clipboard support, better error handling, i18n, and accessibility improvements."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9768,version:2"
}
    