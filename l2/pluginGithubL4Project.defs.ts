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
    ]
  },
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    