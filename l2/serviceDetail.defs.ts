/// <mls shortName="serviceDetail" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceDetail",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "dynamic-content",
      "plugin",
      "service"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "msize",
      "widget"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase",
      "./_100554_libCompile",
      "./_100554_utilsLit"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of innerHTML in setContentinEl and showAboutThis can lead to XSS if content is not sanitized.",
      "Dynamic script injection in setContentinEl may introduce security risks if content is not trusted.",
      "No explicit sanitization of HTML content loaded from storage or events."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "//Array.from(this.contentPlugin.children).forEach((i) => (i as HTMLElement).style.display = \"none\");"
    ],
    "accessibility": [
      "No ARIA attributes or accessibility enhancements detected.",
      "Dynamic content may not be accessible to screen readers.",
      "No keyboard navigation or focus management implemented."
    ],
    "i18nWarnings": [
      "Strings like 'About this content', 'Reference', 'Level', 'Position', 'Open', 'Not found storFile:' are hardcoded and not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "O componente service-detail-100554 é um widget LitElement que exibe detalhes dinâmicos de plugins e serviços, permitindo a visualização e interação com conteúdos de plugins carregados dinamicamente. Ele integra-se ao sistema de eventos do Collab.codes para responder a ações do usuário e atualizar o conteúdo exibido conforme necessário.",
    "goal": "Permitir a exibição e manipulação dinâmica de detalhes de plugins e serviços, facilitando a navegação e interação do usuário com conteúdos relacionados a arquivos, referências e ações contextuais.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar detalhes de plugins e arquivos relacionados para entender melhor o contexto do serviço.",
        "derivedRequirements": [
          {
            "description": "Renderizar dinamicamente o conteúdo do plugin selecionado no painel de detalhes.",
            "done": true,
            "comment": "Implementado via showPluginContent e setContentinEl."
          },
          {
            "description": "Permitir navegação entre diferentes níveis e posições de plugins.",
            "done": true,
            "comment": "Gerenciado por eventos e métodos como fireEvents e selectLevel."
          }
        ]
      },
      {
        "story": "Como usuário, quero acessar rapidamente informações sobre o conteúdo exibido e abrir arquivos relacionados.",
        "derivedRequirements": [
          {
            "description": "Exibir informações detalhadas sobre o plugin/arquivo atual, incluindo referência, nível e posição.",
            "done": true,
            "comment": "Implementado em showAboutThis."
          },
          {
            "description": "Permitir abrir arquivos diretamente a partir do painel de detalhes.",
            "done": true,
            "comment": "Botão 'Open' em showAboutThis dispara fireEvents."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a internacionalização (i18n) para todos os textos exibidos ao usuário.",
        "done": false,
        "comment": "Não implementado; todos os textos estão hardcoded em inglês."
      },
      {
        "description": "Melhorar acessibilidade com suporte a ARIA e navegação por teclado.",
        "done": false,
        "comment": "Sem atributos ARIA ou foco gerenciado detectado."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Conteúdo dinâmico pode não ser exibido corretamente se o plugin não for encontrado.",
        "done": false,
        "comment": "Retorna mensagem 'Not found storFile', mas não há fallback amigável ao usuário."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar validação e sanitização do conteúdo HTML carregado dinamicamente.",
        "done": false,
        "comment": "innerHTML e scripts são injetados sem validação."
      }
    ]
  },
  "textToEmbedding": [
    "This widget displays dynamic plugin details for Collab.codes, allowing users to view and interact with plugin content loaded at runtime.",
    "It responds to system events, updates its content area, and provides contextual actions like opening related files or showing plugin metadata.",
    "There are requests for i18n support and improved accessibility, as well as concerns about unsanitized HTML and dynamic script injection.",
    "A known bug is the lack of user-friendly fallback when a plugin file is missing; enhancements include better validation and ARIA support."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9768,version:2"
}
    