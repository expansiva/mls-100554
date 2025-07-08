/// <mls shortName="pluginConfigLinks" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginConfigLinks",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "myLinks",
      "autoPrepare"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_libProjectConfig"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Uso de alert() para mensagens de erro pode ser considerado inseguro ou ruim para UX.",
      "Não há validação sanitizada para os campos de entrada antes de adicionar links (potencial XSS se o valor for usado em innerHTML em futuras alterações).",
      "Uso de 'unsafeHTML' importado, mas não utilizado; se for usado no futuro, pode ser um risco de XSS."
    ],
    "unusedImports": [
      "unsafeHTML"
    ],
    "deadCodeBlocks": [
      "A variável privada 'test' nunca é utilizada no código."
    ],
    "accessibility": [
      "Os botões possuem ícones SVG e texto, mas o texto está dentro do SVG, o que pode dificultar a leitura por leitores de tela.",
      "Não há uso de atributos aria-* nos botões ou links.",
      "Os elementos <link-item> não possuem tabindex ou roles de acessibilidade.",
      "O contraste de cor dos links depende do valor escolhido pelo usuário, podendo gerar problemas de contraste.",
      "O foco visual é tratado via CSS para link-item, mas não há indicação clara para navegação por teclado nos botões."
    ],
    "i18nWarnings": [
      "Strings como 'fill all the fields!', 'title', 'url', 'color', 'add', 'cancel', 'New' estão hardcoded e deveriam ser internacionalizadas para suportar múltiplos idiomas."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin para configuração e exibição de links customizados em projetos, permitindo adicionar, editar e remover links com título, URL e cor personalizada.",
    "goal": "Facilitar a gestão de links úteis diretamente na interface do projeto, tornando o acesso a recursos externos mais rápido e organizado.",
    "userStories": [
      {
        "story": "Como usuário, quero adicionar links personalizados ao meu projeto para acessar rapidamente recursos externos.",
        "derivedRequirements": [
          {
            "description": "Permitir adicionar links com título, URL e cor personalizada.",
            "done": true,
            "comment": "Funcionalidade implementada e disponível na interface."
          }
        ]
      },
      {
        "story": "Como usuário, quero remover links que não são mais necessários.",
        "derivedRequirements": [
          {
            "description": "Permitir remover links existentes da lista.",
            "done": true,
            "comment": "Remoção de links implementada via botão de exclusão."
          }
        ]
      },
      {
        "story": "Como usuário, quero editar os links existentes.",
        "derivedRequirements": [
          {
            "description": "Permitir edição dos links já cadastrados.",
            "done": false,
            "comment": "Edição direta não está disponível, apenas remoção e adição."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a internacionalização (i18n) para os textos exibidos.",
        "done": false,
        "comment": "Ainda não implementado, textos estão hardcoded."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Problemas de contraste de cor podem dificultar a leitura dos links.",
        "done": false,
        "comment": "O contraste depende da cor escolhida pelo usuário, sem validação automática."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar validação sanitizada para os campos de entrada para evitar possíveis XSS.",
        "done": false,
        "comment": "Não há sanitização dos campos de entrada atualmente."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin allows users to manage custom links for their project, including adding, removing, and displaying links with custom titles and colors.",
    "The main goal is to provide quick access to external resources directly from the project interface, improving organization and productivity.",
    "There are requests for i18n support and better color contrast validation, as well as suggestions to sanitize input fields to prevent XSS vulnerabilities.",
    "Currently, link editing is not directly supported; users must remove and re-add links to modify them."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9804,version:2"
}
    