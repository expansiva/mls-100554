/// <mls shortName="pluginProjectFindFiles" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginProjectFindFiles",
    "type": "plugin",
    "group": "other",
    "tags": [
      "search",
      "files",
      "project-tools"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "_100554_pluginBaseModule",
      "_100554_libCommom",
      "_100554_libProjectConfig",
      "_100554_collabIcons"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct access to global 'mls' object without validation",
      "File content access without proper error handling for security"
    ],
    "unusedImports": [
      "getConfigProject from _100554_libProjectConfig",
      "icons from _100554_collabIcons"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Missing aria-labels for form controls",
      "Progress element lacks aria-describedby or aria-labelledby",
      "Button lacks proper focus management",
      "Select and input elements need better labeling association"
    ],
    "i18nWarnings": [],
    "correctness": 7,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para buscar texto em arquivos do projeto, permitindo filtrar por tipo de arquivo (.ts, .html, .less) e exibir resultados com progresso da busca.",
    "goal": "Facilitar a localização de código específico dentro dos arquivos do projeto através de busca textual com filtros por extensão.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero buscar por texto específico em arquivos do projeto para encontrar rapidamente onde determinado código está localizado",
        "derivedRequirements": [
          {
            "description": "Implementar campo de busca textual",
            "done": true,
            "comment": "Campo de input implementado"
          },
          {
            "description": "Adicionar filtro por tipo de arquivo",
            "done": true,
            "comment": "Select com opções .ts, .html, .less implementado"
          },
          {
            "description": "Exibir progresso da busca",
            "done": true,
            "comment": "Progress bar implementada"
          }
        ]
      },
      {
        "story": "Como usuário, quero ver uma lista organizada dos arquivos que contêm o texto buscado para navegar facilmente pelos resultados",
        "derivedRequirements": [
          {
            "description": "Listar arquivos encontrados ordenados alfabeticamente",
            "done": true,
            "comment": "Lista implementada com sort()"
          },
          {
            "description": "Mostrar contador total de arquivos encontrados",
            "done": true,
            "comment": "Contador exibido acima da lista"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar preview do conteúdo encontrado nos arquivos",
        "done": false,
        "comment": "Seria útil mostrar algumas linhas do contexto onde o texto foi encontrado"
      },
      {
        "description": "Implementar busca com regex",
        "done": false,
        "comment": "Permitir padrões mais complexos de busca"
      },
      {
        "description": "Adicionar opção para buscar em todos os tipos de arquivo simultaneamente",
        "done": false,
        "comment": "Atualmente só busca um tipo por vez"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Melhorar tratamento de erros na busca de arquivos",
        "done": false,
        "comment": "Adicionar try-catch e feedback de erro para o usuário"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar indicador visual durante a busca",
        "done": true,
        "comment": "Progress bar já implementada"
      },
      {
        "description": "Implementar busca case-insensitive como opção",
        "done": false,
        "comment": "Atualmente a busca é case-sensitive"
      },
      {
        "description": "Adicionar atalhos de teclado para iniciar busca",
        "done": false,
        "comment": "Enter no campo de busca poderia disparar a pesquisa"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin allows searching for text in project files, filtering by file type (.ts, .html, .less) and showing results with a progress bar.",
    "Its main goal is to help developers quickly locate specific code within project files using textual search and extension filters.",
    "Future requests include content preview, regex search, and searching all file types at once. There are also requests for case-insensitive search and keyboard shortcuts.",
    "A known bug is the lack of robust error handling during file search. Enhancements already implemented include a visual progress indicator."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9808,version:2"
}
    