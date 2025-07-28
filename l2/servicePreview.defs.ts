/// <mls shortName="servicePreview" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "servicePreview",
    "type": "widget",
    "group": "other",
    "tags": [
      "preview",
      "test",
      "collab",
      "typescript",
      "lit"
    ]
  },
  "references": {
    "widgets": [

    ],
    "plugins": [],
    "statesRO": [
      "preview.pausePreview"
    ],
    "statesRW": [
      "preview.pausePreview",
      "serviceSource.left.selectedMode"
    ],
    "statesWO": [],
    "imports": [
      "./_100554_serviceBase",
      "./_100554_stateLitElement",
      "./_100554_designSystemBase",
      "./_100554_libProjectConfig",
      "./_100554_collabState",
      "./_100554_utilsLit",
      "./_100554_collabIcons",
      "./_100554_collabState",
      "./_100554_tsTestAST",
      "./_100554_collabMessageHelper",
      "./_100554_aiAgentHelper",
      "./_100554_collabMessageHelper",
      "./_100554_aiAgentBase",
      "./_100554_collabConsole",
      "./_100554_collabResultTest",
      "./_100554_servicePreviewView",
      "./_100554_pluginPreviewInsights",
      "./_100554_collabMessagesPrompt",
      "./_100554_collabSpliterVerticalVarFixed",
      "./_100554_collabSpliterHorizontalVarFixed"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of innerHTML in opAboutWCD (potential XSS risk if not sanitized).",
      "Direct window/global object access (window.preview, window.top), ensure safe usage.",
      "Dynamic import with user-controlled agentName in fireCollab (ensure agentName is validated)."
    ],
    "unusedImports": [
      "css (from 'lit')"
    ],
    "deadCodeBlocks": [
      "getParam: variable 'ret' is set but only used for return, could be simplified.",
      "processValue: always returns string or number, else JSON.stringify, but only used in one place."
    ],
    "accessibility": [
      "No explicit aria-* attributes found in HTML or render().",
      "Icon buttons (fa fa-times) should have aria-label for accessibility.",
      "Keyboard navigation for dynamically created elements (test results, close button) not guaranteed.",
      "Color contrast in .less seems sufficient, but test for #000000 on #f4f4f4.",
      "No tabindex management for interactive elements."
    ],
    "i18nWarnings": [
      "Error messages in handleSend and fireCollab are hardcoded in English/Portuguese, should use i18n.",
      "Some UI error strings (e.g., 'Erro page not selected', 'Please select a agent first ex: @@Improve') are not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Widget de preview de páginas e componentes no Collab.codes, permitindo visualização, execução de testes, alteração de temas, linguagens e interação com agentes de IA. Suporta integração com editor Monaco, execução de testes automatizados e manipulação de temas e variações de linguagem.",
    "goal": "Fornecer uma interface robusta para visualizar, testar e interagir com páginas e componentes em tempo real, facilitando o desenvolvimento colaborativo e a automação de testes.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar o preview de uma página/componentes em diferentes modos (desktop, mobile, insights) para garantir que o layout e funcionalidades estejam corretos.",
        "derivedRequirements": [
          {
            "description": "Implementar tabs para alternar entre modos de visualização.",
            "done": true,
            "comment": "Tabs implementados via menu.tabs e preview()."
          }
        ]
      },
      {
        "story": "Como usuário, desejo executar e gerenciar testes automatizados diretamente do preview para validar funcionalidades.",
        "derivedRequirements": [
          {
            "description": "Permitir execução, edição e exclusão de testes via interface.",
            "done": true,
            "comment": "Funções de testes implementadas (runTest, runAllTests, deleteTest, etc)."
          }
        ]
      },
      {
        "story": "Como usuário, quero alternar entre temas e linguagens para verificar a internacionalização e personalização visual.",
        "derivedRequirements": [
          {
            "description": "Dropdowns para seleção de tema e linguagem.",
            "done": true,
            "comment": "setLanguages e setTheme implementados."
          }
        ]
      },
      {
        "story": "Como usuário, desejo interagir com agentes de IA para obter sugestões e revisões automáticas.",
        "derivedRequirements": [
          {
            "description": "Integração com agentes via collab-messages-prompt.",
            "done": true,
            "comment": "handleSend e fireCollab implementados."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a múltiplos agentes de IA para diferentes tipos de análise.",
        "done": false,
        "comment": "Atualmente apenas um agente pode ser selecionado por vez."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Preview não atualiza corretamente ao trocar de tema em alguns casos.",
        "done": false,
        "comment": "Pode estar relacionado ao método onStyleChanged; investigar atualização de atributos."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade dos botões e navegação por teclado.",
        "done": false,
        "comment": "Faltam aria-labels e tabindex nos botões dinâmicos."
      }
    ]
  },
  "textToEmbedding": [
    "This widget provides a live preview and test environment for Collab.codes pages/components.",
    "It supports switching between desktop, mobile, and insights modes, running and managing automated tests, and interacting with AI agents for code review and suggestions.",
    "Users can change themes and languages to verify internationalization and visual customization. There are requests to improve accessibility and support multiple AI agents.",
    "Known issues include preview not updating on theme change and lack of keyboard navigation/aria-labels for dynamic buttons."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9828,version:2"
}
    