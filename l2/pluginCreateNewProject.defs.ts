/// <mls shortName="pluginCreateNewProject" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginCreateNewProject",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "project-creation",
      "collab.codes",
      "plugin"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [
      "actualSiteSelected",
      "// usado em leitura para verificar seleção",
      "currentScenario"
    ],
    "statesRW": [
      "actualSiteSelected",
      "// alterado em onTypeSiteClick",
      "currentScenario"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabIcons",
      "./_100554_pluginBaseModule"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Uso de alert() para mensagens de erro e avisos. Embora não seja crítico, pode ser considerado inadequado para UX em produção.",
      "Não há sanitização explícita de dados de entrada do usuário nos campos de input/textarea, mas como não há uso de innerHTML, o risco é baixo.",
      "Não há uso de innerHTML, window direto, nem tokens hardcoded sensíveis."
    ],
    "unusedImports": [
      "css (importado de 'lit', mas não utilizado no código)"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "O componente utiliza <input>, <textarea> e <button> nativos, o que garante acessibilidade básica.",
      "Não há uso de atributos aria-* explícitos.",
      "Botões são acessíveis via teclado.",
      "Uso de <summary> dentro de <details> melhora a navegação por teclado.",
      "Contraste de cores parece adequado, mas depende das variáveis CSS definidas no tema.",
      "Sugestão: adicionar labels explícitos para inputs e atributos aria-label onde necessário para melhorar ainda mais a acessibilidade."
    ],
    "i18nWarnings": [
      "Strings como 'Resume', 'Id:', 'Test' e nomes de plugins/títulos de cards não estão internacionalizadas.",
      "A maioria das mensagens essenciais está corretamente internacionalizada via objeto messages."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin para criação de novos projetos no Collab.codes, permitindo ao usuário selecionar o tipo de projeto, customizar opções e escolher plugins de publicação e armazenamento.",
    "goal": "Facilitar a criação de novos projetos de diferentes tipos, com seleção de plugins e opções personalizadas, de forma guiada e acessível.",
    "userStories": [
      {
        "story": "Como usuário, quero criar um novo projeto selecionando o tipo de site e plugins desejados, para iniciar rapidamente um novo workspace.",
        "derivedRequirements": [
          {
            "description": "Exibir lista de tipos de projetos disponíveis para seleção.",
            "done": true,
            "comment": "Implementado via tabela e lista no cenário 'select'."
          },
          {
            "description": "Permitir seleção de plugins de publicação e armazenamento.",
            "done": true,
            "comment": "Implementado via cards interativos no cenário 'customize'."
          },
          {
            "description": "Internacionalizar mensagens principais para PT e EN.",
            "done": true,
            "comment": "Mensagens principais estão internacionalizadas, mas há pequenas strings não cobertas."
          },
          {
            "description": "Bloquear avanço se nenhum tipo de projeto for selecionado.",
            "done": true,
            "comment": "Implementado em onBtnContinueClick()."
          },
          {
            "description": "Exibir detalhes do tipo de projeto selecionado.",
            "done": true,
            "comment": "Implementado na coluna direita do cenário 'select'."
          },
          {
            "description": "Permitir navegação entre etapas (select/customize).",
            "done": true,
            "comment": "Controlado via currentScenario."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a mais idiomas além de PT e EN.",
        "done": false,
        "comment": "Atualmente só PT/EN; estrutura permite expansão."
      },
      {
        "description": "Permitir salvar rascunho do projeto antes de criar.",
        "done": false,
        "comment": "Não implementado; só há alerta de 'em desenvolvimento' ao criar."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com labels e aria-*.",
        "done": false,
        "comment": "Inputs não possuem labels explícitos nem aria-label."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin guides users through creating new projects in Collab.codes.",
    "It allows selection of project type, customization, and plugin choices for publishing and storage.",
    "Most core messages are internationalized (PT/EN), but some UI strings and labels are not.",
    "Future improvements include more languages, draft saving, and better accessibility with labels and aria attributes."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9800,version:2"
}
    