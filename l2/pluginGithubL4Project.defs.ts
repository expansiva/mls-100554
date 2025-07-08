/// <mls shortName="pluginGithubL4Project" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginGithubL4Project",
    "type": "plugin",
    "group": "other",
    "tags": [
      "github",
      "project-management",
      "issues",
      "kanban",
      "lit",
      "collab.codes"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [
      "error",
      "scenary",
      "isLoader",
      "autoClick",
      "viewIssue",
      "addInStatus",
      "listIssues"
    ],
    "statesRW": [
      "error",
      "scenary",
      "isLoader",
      "autoClick",
      "viewIssue",
      "addInStatus",
      "listIssues"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_libCommom",
      "./_100554_libGithubIo",
      "./_100554_collabLitElement",
      "https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.3/Sortable.min.js"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Uso de unsafeHTML para renderizar conteúdo HTML dinâmico (ex: descrições e comentários de issues) pode abrir brechas para XSS se o conteúdo não for sanitizado.",
      "Uso de innerHTML indireto via unsafeHTML em vários pontos do render pode ser perigoso se o backend não garantir a limpeza dos dados.",
      "Acesso direto ao window['Sortable'] para drag-and-drop, embora comum, pode ser problemático se o objeto Sortable for sobrescrito ou manipulado externamente."
    ],
    "unusedImports": [
      "repeat (de lit) não é usado diretamente, mas sim via html templates.",
      "getMyKeysBranch (de ./_100554_libCommom) é usado apenas em initInfoProject.",
      "svg (de lit) é usado apenas em pluginData.getSvg."
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "O componente utiliza muitos elementos customizados (ex: contentlistitem, contentheader, contentstatusitem) que não possuem roles ARIA explícitos.",
      "Botões customizados (ex: backbutton, buttonnewissues) não usam <button> nativo, o que pode prejudicar navegação por teclado e leitores de tela.",
      "Faltam atributos aria-label ou roles em ícones SVG e botões.",
      "Uso de tabindex não foi identificado, o que pode dificultar navegação por teclado.",
      "Contraste de cores parece adequado, mas depende das variáveis CSS e pode variar conforme tema."
    ],
    "i18nWarnings": [
      "Strings como 'No projects', 'Filter issues ...', 'Not found project', 'No Status', 'Add Title', 'Add a description', 'Add new issue', 'No issues', 'Issues', 'Delete', 'Labels', 'Members', 'Description', 'Activity', 'Write a comment ...', 'Save', 'Empty comment', 'fill in all fields' estão hardcoded e deveriam ser internacionalizadas para suportar múltiplos idiomas."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin para Collab.codes que integra projetos do GitHub, permitindo visualizar, filtrar, adicionar e gerenciar issues em formato kanban, com suporte a labels, membros, comentários e drag-and-drop.",
    "goal": "Facilitar a gestão visual de projetos GitHub dentro do Collab.codes, promovendo colaboração e organização eficiente de tarefas.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar todos os projetos do GitHub associados ao repositório para escolher em qual trabalhar.",
        "derivedRequirements": [
          {
            "description": "Listar projetos do GitHub do repositório.",
            "done": true,
            "comment": "Implementado em renderList e setInfos."
          }
        ]
      },
      {
        "story": "Como usuário, quero ver as issues organizadas por status em um quadro kanban para acompanhar o progresso.",
        "derivedRequirements": [
          {
            "description": "Exibir issues em colunas por status.",
            "done": true,
            "comment": "Implementado em renderShow e organizeItens."
          }
        ]
      },
      {
        "story": "Como usuário, quero adicionar novas issues e atribuí-las a membros e labels.",
        "derivedRequirements": [
          {
            "description": "Formulário para adicionar issues com título, descrição, labels e membros.",
            "done": true,
            "comment": "Implementado em renderAddIssue e addIssue."
          }
        ]
      },
      {
        "story": "Como usuário, quero comentar em issues e ver o histórico de comentários.",
        "derivedRequirements": [
          {
            "description": "Permitir adicionar e visualizar comentários em issues.",
            "done": true,
            "comment": "Implementado em renderViewMain e clickSaveComment."
          }
        ]
      },
      {
        "story": "Como usuário, quero mover issues entre status via drag-and-drop.",
        "derivedRequirements": [
          {
            "description": "Implementar drag-and-drop entre colunas de status.",
            "done": true,
            "comment": "Implementado em setDragAndDrop."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a filtros avançados por label, membro e data.",
        "done": false,
        "comment": "Filtro atual é apenas por texto, não há filtros avançados implementados."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Problema ao adicionar comentário vazio: deveria bloquear envio.",
        "done": true,
        "comment": "Já há validação e alerta para comentário vazio em clickSaveComment."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Internacionalizar todas as mensagens e textos do plugin.",
        "done": false,
        "comment": "Mensagens estão hardcoded em inglês, sem suporte i18n."
      },
      {
        "description": "Melhorar acessibilidade com roles ARIA e uso de elementos nativos.",
        "done": false,
        "comment": "Elementos customizados não possuem roles ARIA nem navegação por teclado adequada."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin integrates GitHub Projects into Collab.codes, providing kanban-style issue management, filtering, and drag-and-drop between statuses. Users can add, assign, and comment on issues, with visual feedback and project metadata.",
    "Current features include project listing, kanban board, issue creation with labels and members, comment threads, and drag-and-drop. Filtering is basic and only by text.",
    "Known bugs are mostly handled, such as blocking empty comments. However, accessibility and internationalization are lacking and are planned for future improvements.",
    "Enhancements requested include advanced filtering, full i18n support, and improved accessibility with ARIA roles and native elements for better usability."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9776,version:2"
}
    