/// <mls shortName="pluginNewProjectTemplate" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginNewProjectTemplate",
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
    "imports": []
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "O HTML contém apenas um <h1>, sem problemas de acessibilidade detectados, mas não há navegação, foco ou atributos aria. Recomenda-se adicionar mais estrutura e considerar acessibilidade se expandir o componente."
    ],
    "i18nWarnings": [
      "O texto do <h1> ('_100554_pluginNewProjectTemplate') não está internacionalizado. Recomenda-se internacionalizar títulos e textos visíveis ao usuário."
    ],
    "correctness": 10,
    "errorHandling": 10,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "Este plugin fornece templates de arquivos essenciais para novos projetos Collab.codes, incluindo tsconfig, package.json, arquivos de build, design system e index core. Serve como ponto de partida para automação e padronização de projetos.",
    "goal": "Facilitar a criação de novos projetos Collab.codes, fornecendo templates prontos e configuráveis para acelerar o setup inicial e garantir consistência.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero criar um novo projeto Collab.codes rapidamente, com todos os arquivos de configuração essenciais já prontos, para não perder tempo com setup manual.",
        "derivedRequirements": [
          {
            "description": "Gerar tsconfig.json, package.json, arquivos de build e design system automaticamente ao criar novo projeto.",
            "done": true,
            "comment": "Templates prontos e exportados como constantes."
          },
          {
            "description": "Permitir customização mínima (ex: nome do projeto, organização) nos templates.",
            "done": true,
            "comment": "Templates usam placeholders como [project] e [org]."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a múltiplos temas no design system.",
        "done": true,
        "comment": "Já existem dois temas de exemplo ('Default' e 'Natal')."
      },
      {
        "description": "Permitir atualização dos templates sem precisar alterar o código fonte.",
        "done": false,
        "comment": "Atualmente, templates estão hardcoded; seria necessário mecanismo dinâmico."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar comentários explicativos nos templates para facilitar customização.",
        "done": false,
        "comment": "Templates estão sem comentários internos, dificultando entendimento para novos usuários."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides ready-to-use templates for new Collab.codes projects, including tsconfig, package.json, build scripts, design system tokens, and a core index. Its main goal is to speed up project setup and ensure configuration consistency.",
    "Templates are exported as constants and use placeholders for project and organization names, allowing minimal customization. Two design system themes are included as examples.",
    "Feature requests include dynamic template updates and more internal comments for easier customization. No bugs reported so far.",
    "Accessibility is basic, with only a heading present. Internationalization is recommended for visible texts. Code quality is high, with no security or dead code issues."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9812,version:2"
}
    