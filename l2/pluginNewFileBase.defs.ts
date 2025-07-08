/// <mls shortName="pluginNewFileBase" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginNewFileBase",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "./_100554_libCommom"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Uso de localStorage diretamente em saveLocalHistory pode expor dados sensíveis se não for tratado corretamente.",
      "Não há verificação de origem ou integridade dos dados lidos do localStorage, o que pode causar problemas de segurança se dados maliciosos forem injetados."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "Função createNewFile comentada (versão antiga) permanece no código, pode ser removida se não for mais necessária."
    ],
    "accessibility": [
      "O HTML contém apenas um <h1>, sem outros elementos interativos. Não há problemas de acessibilidade detectados, mas o componente não possui interface interativa.",
      "Não há atributos aria-* ou tabindex, mas também não há elementos interativos que exijam isso."
    ],
    "i18nWarnings": [
      "O título do HTML ('_100554_pluginNewFileBase') está hardcoded e não está internacionalizado. Se o projeto usar i18n, considerar extrair para tradução."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Este plugin fornece funções utilitárias para criar novos arquivos baseados em templates, manipulando nomes de classes, widgets, tags e estados. Ele também gerencia o histórico local de arquivos criados e integra-se ao sistema de eventos do Collab.codes.",
    "goal": "Facilitar a criação de novos arquivos de componentes de forma padronizada e rápida, garantindo integração com o histórico local e preview automático.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero criar rapidamente novos arquivos de componentes baseados em templates, para acelerar o desenvolvimento e manter o padrão do projeto.",
        "derivedRequirements": [
          {
            "description": "Funções para substituir nomes de classe, widget, tag e estado em templates.",
            "done": true,
            "comment": "Funções changeClassName, changeWidget, changeTagName, changeStateName implementadas."
          },
          {
            "description": "Função para criar novo arquivo e atualizar histórico local.",
            "done": true,
            "comment": "Função createNewFile implementada, incluindo integração com localStorage."
          },
          {
            "description": "Integração com sistema de eventos do Collab.codes para acionar ações de arquivo.",
            "done": true,
            "comment": "Uso de mls.events.fire e openService implementados."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin provides utility functions to generate new component files from templates, handling class, widget, tag, and state name replacements. It manages local file history and integrates with Collab.codes event system.",
    "The main goal is to streamline and standardize the creation of new component files, ensuring quick integration with local history and automatic preview.",
    "The code includes template string replacement utilities, a file creation function with event firing, and localStorage-based history management.",
    "Accessibility is not a concern as the UI is minimal. Security risks relate to localStorage usage. The code is readable and maintainable, but error handling could be improved."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9764,version:2"
}
    