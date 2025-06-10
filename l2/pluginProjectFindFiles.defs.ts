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
  }
}
    