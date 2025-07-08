/// <mls shortName="pluginPresenterRecorder" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginPresenterRecorder",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "plugins": [],
    "widgets": [],
    "statesRO": [
      "avatarShape",
      "avatarZoom",
      "isRecording",
      "isCountdown",
      "countdownValue",
      "downloadUrl"
    ],
    "statesRW": [
      "avatarShape",
      "avatarZoom",
      "isRecording",
      "isCountdown",
      "countdownValue",
      "downloadUrl"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_collabLitElement"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM manipulation with innerHTML in showPipPreview (container.innerHTML = ''). If user input is ever injected, this could be a risk.",
      "Direct access to window object (window.setInterval).",
      "Direct DOM manipulation for download link creation in saveRecording()."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "// this.isRecording = false;",
      "// this.requestUpdate();"
    ],
    "accessibility": [
      "Buttons have visible labels and icons, but lack aria-labels for screen readers.",
      "No explicit tabindex or keyboard navigation for custom controls in PiP preview.",
      "Color contrast appears sufficient, but should be verified with real CSS variables.",
      "No aria-live region for countdown feedback.",
      "Download link is accessible, but could use aria-label for clarity."
    ],
    "i18nWarnings": [
      "Camera Style, Square, Round, Zoom, Baixar vídeo, and some button tooltips are not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin para gravação de apresentações, capturando tela, câmera e áudio, com opção de download do vídeo.",
    "goal": "Permitir ao usuário gravar apresentações com tela e câmera, baixar e compartilhar o vídeo facilmente.",
    "userStories": [
      {
        "story": "Como usuário, quero gravar minha tela e minha câmera simultaneamente para criar apresentações em vídeo.",
        "derivedRequirements": [
          {
            "description": "Permitir seleção de formato da câmera (quadrado ou redondo).",
            "done": true,
            "comment": "Implementado via avatarShape e controles de radio."
          },
          {
            "description": "Permitir ajuste de zoom da câmera.",
            "done": true,
            "comment": "Implementado via select de zoom."
          },
          {
            "description": "Permitir iniciar e parar gravação facilmente.",
            "done": true,
            "comment": "Botões de iniciar/parar implementados."
          },
          {
            "description": "Exibir contagem regressiva antes de iniciar a gravação.",
            "done": true,
            "comment": "Contagem regressiva implementada."
          },
          {
            "description": "Permitir download do vídeo gravado.",
            "done": true,
            "comment": "Link de download automático implementado."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a mais idiomas na interface.",
        "done": false,
        "comment": "Somente pt/en parcialmente implementado; textos fixos ainda não internacionalizados."
      },
      {
        "description": "Permitir pausar e retomar gravação.",
        "done": true,
        "comment": "Botões de pause/resume implementados no PiP preview."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Em alguns navegadores, a gravação pode falhar se o usuário negar permissão de tela ou câmera.",
        "done": false,
        "comment": "Tratamento de erro básico implementado, mas sem feedback detalhado ao usuário."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade dos controles e feedback visual para usuários com deficiência.",
        "done": false,
        "comment": "Faltam aria-labels e feedback para leitores de tela."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin allows users to record their browser screen and camera (with audio), offering a countdown before recording and options for camera shape and zoom.",
    "After recording, users can download the video and share it anywhere. The UI supports English and Portuguese, but some interface strings are not yet internationalized.",
    "There are user requests for improved accessibility and more language support. Some error handling is present, but feedback for permission denial could be enhanced.",
    "Enhancements include better accessibility and more robust i18n. Bugs include possible failures if permissions are denied."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9784,version:2"
}
    