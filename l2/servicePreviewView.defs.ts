/// <mls shortName="servicePreviewView" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "servicePreviewView",
    "type": "widget",
    "group": "other",
    "tags": [
      "preview",
      "iframe",
      "collab.codes",
      "lit",
      "dynamic"
    ]
  },
  "references": {
    "widgets": [
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "father",
      "page",
      "mode",
      "lang",
      "level",
      "isDsComponent",
      "watch",
      "stylechanged",
      "actualtheme",
      "error",
      "lastCompiledUrl",
      "widthP",
      "heightP"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_libCompile",
      "./_100554_utilsLit",
      "./_100554_enhancementStyle",
      "./_100554_stateLitElement",
      "./_100554_previewModeSinglePage",
      "./_100554_previewModeMinimum"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of unsafeHTML in renderError() may expose to XSS if error content is not sanitized.",
      "Direct manipulation of iframe.contentDocument and window.preview.iframe can be risky if not properly sandboxed.",
      "Use of localStorage for 'iframeTesting' may expose data to other scripts.",
      "window.preview.iframe is set globally, which may lead to conflicts or leaks."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "Commented-out code block for testing in init() (/*let vTesting = this.getTesting(); ... */)",
      "Commented-out fireTesting() call in init()"
    ],
    "accessibility": [
      "No explicit aria-* attributes found in HTML/TS.",
      "Input fields for width/height have labels, which is good.",
      "No tabindex or keyboard navigation for mobile controls.",
      "iframe is hidden by default (display:none) until loaded, which may confuse screen readers.",
      "Error messages are rendered as divs, but no role='alert' or similar for accessibility."
    ],
    "i18nWarnings": [
      "Some error messages and UI strings are internationalized, but not all dynamic error content is guaranteed to be translated (e.g., error details from compiler)."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Componente LitElement para visualização dinâmica de páginas/serviços em iframe, com suporte a temas, modos (desktop/mobile), internacionalização e integração com eventos do Collab.codes.",
    "goal": "Permitir a pré-visualização segura e customizável de páginas/serviços do Collab.codes, facilitando testes, edição e integração com o editor.",
    "userStories": [
      {
        "story": "Como usuário do Collab.codes, quero visualizar uma página ou serviço em diferentes modos (desktop/mobile) para testar responsividade e aparência.",
        "derivedRequirements": [
          {
            "description": "Renderizar iframe com controles de largura/altura para modo mobile.",
            "done": true,
            "comment": "Implementado em renderPreview() e changeWidthP/changeHeightP."
          },
          {
            "description": "Permitir alternância entre modos desktop e mobile.",
            "done": true,
            "comment": "Implementado via propriedade 'mode'."
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero receber feedback de erros de compilação ou carregamento de arquivos.",
        "derivedRequirements": [
          {
            "description": "Exibir mensagens de erro amigáveis e detalhadas.",
            "done": true,
            "comment": "Mensagens de erro internacionalizadas e detalhadas em renderError()."
          }
        ]
      },
      {
        "story": "Como usuário, quero que o preview respeite o tema e tokens definidos no projeto.",
        "derivedRequirements": [
          {
            "description": "Aplicar estilos e tokens dinâmicos ao iframe.",
            "done": true,
            "comment": "Funções addStyles e mountTokens implementam isso."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a navegação por teclado nos controles mobile.",
        "done": false,
        "comment": "Não implementado; controles não possuem tabindex ou handlers de teclado."
      },
      {
        "description": "Permitir configuração de temas customizados pelo usuário.",
        "done": false,
        "comment": "Apenas temas predefinidos via actualtheme."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Em alguns casos, o iframe não carrega corretamente após erro de compilação.",
        "done": false,
        "comment": "Possível race condition ao manipular display/style do iframe após erro."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade das mensagens de erro e controles.",
        "done": false,
        "comment": "Mensagens não possuem role='alert' e controles não são acessíveis por teclado."
      }
    ]
  },
  "textToEmbedding": [
    "This widget provides a dynamic preview of Collab.codes pages/services in an iframe.",
    "It supports desktop/mobile modes, theme switching, i18n, and error feedback for compilation.",
    "User requests include better keyboard accessibility and custom theme support.",
    "Known issues: iframe may not reload after errors; error messages lack ARIA roles."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9788,version:2"
}
    