/// <mls shortName="serviceSource" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceSource",
    "type": "widget",
    "group": "service",
    "tags": [
      "editor",
      "monaco",
      "collab",
      "source-management"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "serviceSource.left.selectedMode",
      "serviceSource.left.historyLanguage",
      "serviceSource.left.lockMap",
      "serviceSource.right.selectedMode",
      "serviceSource.right.historyLanguage",
      "serviceSource.right.lockMap",
      "less.left",
      "less.right"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_utilsLit",
      "./_100554_serviceBase",
      "./_100554_collabDOMSync",
      "./_100554_enhancementStyle",
      "./_100554_designSystemBase",
      "./_100554_lessCSS",
      "./_100554_libCommom",
      "./_100554_collabState",
      "./_100554_collabDecorators",
      "./_100554_validateLit",
      "./_100554_collabIcons",
      "./_100554_agentFix",
      "./_100554_aiAgentHelper",
      "./_100554_collabMessageHelper",
      "./_100554_collabSpliterVerticalVarFixed",
      "./_100554_collabSpliterHorizontalVarFixed",
      "./_100554_cssHelperIndex"
    ]
  },
  "codeInsights": {
    "todos": [
      "// TODO: InDevelpoment"
    ],
    "securityWarnings": [
      "Use of eval() in setConfEditorFromJavascript (potential code injection risk).",
      "Direct window access (window.open, window.setTimeout, window.localStorage) - ensure safe usage.",
      "Potentially unsafe dynamic script injection in showHistorie2 (div.appendChild(scr))."
    ],
    "unusedImports": [
      "getProjectDetails",
      "collab_file_code"
    ],
    "deadCodeBlocks": [
      "updatedOnServer: commented-out code block.",
      "onWidgetActionEvents: case 'SelectWidget' is empty."
    ],
    "accessibility": [
      "No explicit aria-* attributes found in HTML render.",
      "Keyboard focus management is handled for Monaco editor.",
      "Overlay loading uses <span> for loader, but no role or aria-live for screen readers.",
      "Tab navigation for theme select is present, but no explicit tabindex or labels."
    ],
    "i18nWarnings": [
      "Strings in menu, tooltips, and error messages are mostly hardcoded in English.",
      "Some error/info messages (e.g., 'Invalid File', 'Driver not found') are not internationalized.",
      "Theme names and some UI texts are not i18n-enabled."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Widget de gerenciamento de arquivos-fonte (TS, HTML, LESS, Test, Defs) para o Collab.codes, integrando editor Monaco, histórico, temas, controle de status, e sincronização de arquivos. Permite criação, edição, deleção, renomeação, clonagem e undo de arquivos, além de integração com agentes de IA para correção automática.",
    "goal": "Oferecer uma interface robusta para edição colaborativa de arquivos de código, com suporte a múltiplos formatos, histórico, integração com IA e controle de status/erros.",
    "userStories": [
      {
        "story": "Como usuário, quero editar arquivos TS/HTML/LESS/Test/Defs em um editor avançado, com histórico e integração com temas.",
        "derivedRequirements": [
          {
            "description": "Permitir alternância entre diferentes modos de arquivo (TS, HTML, LESS, Test, Defs).",
            "done": true,
            "comment": "Implementado via menu.tabs e EToolsSource."
          },
          {
            "description": "Permitir visualização e restauração do histórico de arquivos.",
            "done": true,
            "comment": "Função showHistory e getHistories implementadas."
          },
          {
            "description": "Permitir configuração e troca de temas do editor.",
            "done": true,
            "comment": "Função showPageTheme e integração com localStorage."
          }
        ]
      },
      {
        "story": "Como usuário, quero que o sistema detecte e destaque erros automaticamente, sugerindo correções via IA.",
        "derivedRequirements": [
          {
            "description": "Detectar erros de compilação e sintaxe em tempo real.",
            "done": true,
            "comment": "Uso de markers do Monaco e updateActionBasedOnError."
          },
          {
            "description": "Oferecer ação de correção automática via agente de IA.",
            "done": true,
            "comment": "Função fireAgentFix implementada."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a atalhos de teclado customizáveis.",
        "done": false,
        "comment": "Não implementado, apenas atalhos fixos (Ctrl+M para agent fix)."
      },
      {
        "description": "Permitir edição colaborativa em tempo real.",
        "done": false,
        "comment": "Sincronização básica via eventos, mas não colaboração em tempo real."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Erro ao abrir arquivos inexistentes exibe mensagem genérica.",
        "done": false,
        "comment": "Mensagens de erro são lançadas, mas sem tratamento i18n ou detalhamento."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade para leitores de tela.",
        "done": false,
        "comment": "Faltam roles/aria nos elementos principais."
      },
      {
        "description": "Internacionalizar todas as mensagens e tooltips.",
        "done": false,
        "comment": "Apenas parte do sistema usa i18n, muitos textos estão hardcoded."
      }
    ]
  },
  "textToEmbedding": [
    "This widget manages source files (TS, HTML, LESS, Test, Defs) in Collab.codes.",
    "It integrates Monaco editor, file history, theming, error status, and AI agent for auto-fix.",
    "User requests include customizable keyboard shortcuts, real-time collaboration, and improved accessibility.",
    "Some bugs relate to error messages and i18n; enhancements focus on accessibility and full internationalization."
  ],
  "embedding": "eJwdlnlYTW0XxpuUSKUkGYoklKFSqbPXEpIiFKnInIS3V+ZIGZIGSSkZixBSyJAMZ6+VMpcps4SQjJEM6cPL9xx/nIvO9Zxnr3Wv332vraa26qya2qqBampqQ/44RbNmt3JoWBiCXpFFrN1rPy5MncoORkXk+99Sptnl9PaBEf4JPwIxQQbymoGX4O44Lc6v+AyGLl1xtp8nWj5roFQtM96vMRyUGifhhUYKz4jbiYHn47FezxeWhczg68tm8Z+A3TCsmxbfaG8H7wOKwKS4Cz8PHoo7F89FvQh1bP16GuUqszGnozHG5m2SE/tmwJll0bxqwQ6ybdWGc4x/SeENfhC5Yys//urPrn8uA9zXwbl5PbF9mzUQ0NKeDp4OkXxGKcHDpi+nxcqQWpfEkXFJKB/7Sj2L1/PPXdroZNYadzwtphlx5vhvkhuNOqULblpvZd/ad/K11Hgc3NWP2sZ9hJqyIJxZd5w6nh/MeqsT8U3/qzB7awx9fz4WtJ5YoFH2KWijPQL2t38IG5X9eH6PayTfNuOV72rkIKP1bNrNGRsSNfjLz05cMjCJ4wxtuB7+5TFz9sLS646YbOKNc9MyeZLhbVIzD+c5gzfB7oxKGDPHir8N30sf9kly8/MBWLnvJuwtdEenpvdCHwuZdY34n5Y7+NWbITz5SneUleuIXftgYe9jfKtLMm7PvSQtrT0HLYwm8YRSb3x84Yz0T8tOqInjuG/L8by64azil89FepYezCmORWwz5xq/aN9R1D2d+q/qhjqfNPDV6R5s2NkEh1+RuCj6FF55PIEvPt2MzTcq5WtX8yg+9xGeDw/DWdSWX45uw5u6eLFH0FXwGMx8OrMLCV34fYATX9AvJM+8W3Ja2GHpa/oNmpDHsKjvAakpJgvuzEsXurTgkTdNsdw2mFSzObBtGYp5888j/8GWPHW4oWHJpjgEnQx/wOKnryhcNxjrPswAJ/VYrNNfx0tGGdHd/tVyx4MnaOGSMdh11kFa2zgVBre8yNt0/igFC5z7TmLnKz6np/3JBnub8zRx2kaetTeRVOxerTkl+SfrY37lWqVd0k9y65YCj9YPwnc7q+HR4n7c7ts2qY+0GAWzXOsaj//VJ7OYAYaOCKN1vSuhWC2KDuxJk9ZeuiDl6+7HidOM2dAlRyrK8KCyQ2dpQNxQWHC0GVXpvaQNV2eQqEFOmGKHlfxEdRaWjEqn6MwnIHiRXrTP4pl1DvKySE3uYt8PLzRa0ZElm/nR4kL+n9fsvxppXUxjhx/74Z+utqDdph17b83mn1vmcqGHG65UXgbhX/Czj6EvV9XZveqA3LBuAZnsiMZEzz3o8GIrVhuX4KI/LTklegoIvjg2To37pT2AglwH2BOCOGpzCHf48pSTawto96GZ3PN+pqpPfHLIFgU32KivjmUZx/CotT/2LIrAsKpVOCQ7jkJDIml5WCktfhrKTaPV8LO74MGmL75OTJY3V+7g2DwTmrK1JU5+5vRX45yfcyjAbwJG1e3Eg4leCLUr8KrxWFf5XXdMd1jG6vtzqbbdNIy+GgkvGuNhhcYCUeNxmFB6FdY+vS1FrOgjjTq1luQCLfRx7sVidrKKQ7ukKBQ+pvizs1T9AxYFs8EsN34QMEycXcO7ruuhn+N8bN/LSPi3P7fvGoVJK9pTsslVyL3dm9Pb11Fds0U0tCEKf/l4oM2cEfz7ZCU5RpZJ34+dhkzPFOjTdaa0zbAt/afToVgadUMx3qYD3s9NOiM0kb48WspCf4571kqlrZwSMlraUmqAMUGpNGrzSyg0ycFVSQc5qOE16PbTIF/tDULrPiJrm+jqz4uKj4uzSejBV76+BdtulvRKzY81/tFCkSs4KGz5X53EHTBTaxAbJeQpVP4WGQc+oV7IuunytfQI5bNCHbZyMWAf50N86mcl5F/XkO7v/CJZmf4jmRuV0fPhp0H/og6/O/kBbL81w+WxPrwlcSKIPmHcnmnylxoD1L/yHcoOuaH7l5PwLfg4jQ/qj8ILqNtvNW6rn0e6Ub3whUM+fd+Wjzwa6LBFpMj1o3RPxx0npB0Bx2mSJOZJQlsM0m1kXW9Dqd7qKfwJ6IIljpqsyv734e5iDziB8DSIDIL7mbGqncEnHs9l48BWDNp7Vf+q8oOsXFJx7N3TsMexC7xeuZiH2bfkyn0+0qVJruB8tFT6OCkNmybp8IQ8xLYpcYo5QTmoXuwEIsdpdtg9KIruT8LrJLiCIXu+yd/LLikEt6zWPY4u6zbnauOBfMr4jST4JsEgPwgP5F212+Hj+sPy8KO9uefxeFTVOMdcTVlT9gjb+o+hGw4DpBzjaHz89R7ZB1VLJ0N6Qrn7PHKyz5YHzHGB5gevgN3BzjxOWQ+iPh6AWXT2tC8t+rOOPUunsL2NOx8ad4hU++Zr/kS225gOsbtWwAX9fgOwXE31DEhIvYZ7C89Lnaf5kGBCsas0DjfULKTSBwrOsn4Lx/ctEfm5hYwSekJG0hZe8Gw3TvUczqqaa46NwK6rXNlPyx9uvjMGVd4k/0eY/B/IP2feoWMFKbSobinnvHDDBS/vY5vgm4rASSVUuLI9xy8YgIlCzNVNC2mqWxDO7q9GXX+2kzd61NIMu9fy6Co/Gu6QAh2vW/O6IRmwa3eZFNZiiuJO7lj8Mu6aQr/UFpXj0zHnfKK0be9auTT/Gu9JcsTQ0qFo+rMC8qk/XcyspGXhteATZY2tu1QCPWyEXmtdsL+TNm9Yf0gyn6ytHDPLErQDxpJW1SrSm5GKocPX0E/TnZw9bMCZzweKMA3P00yzMaDv8lGZbp5MNXIDjTj2WX63aTZFTO4CwT08CPsU/e1pvmMJHPzWEkv7Z5Lfv4Xc8fp+XHS9lL1Kamnw2Di2CiwCzUZrUliuZlhhjqO2T6J6r+awaPFJfhdxnObP1uSul/yhY90TuLZ4NN1zOQGN286BOIOf1QbxlI7p3OBrQ+7jNsv3XBy5aFYzvONTJmot5gkmkWxrfxivtN5Ie9MDVB+8FrAdrKc8oCc5LdmlNos+mQagKx6QtvmmsqldBu+O7wrN+iVjsvELcO4wGy3Dh/MGrblkb/NYOrvHphi/TWXlsR382gnY2C2BRl5N5R+jo3C2BkrHNvelg7tb8++rHvQWn4LX7j50+2E81Ux/BQnlZQqfO/b8xHsVjVy4ht2MDbh1QBZVVQbiq7huaBFsytcL9qFzh7fywJRgOrxonmLHprbc7cYSen8DYUB8Cdx83wJ7qf0E/mzMs/Pt0dcWuW6Cnuz41QD2D57DXu3mi08DDT19njp0MoTUtZnkO3UVzskcgLHKOG6jDKKEwK2yZ8MW7jRkNtbGZNDeDm2o8fT/ZH9/c7KKqKP/3v2Cg/+OYpVe1hnbqfnkCM5q7oWX7h6mbkdKcHJ/Fw72jAajW/UKk8wc/ny5DqZc0OZx7/TxXM0uaK2xB8svKlVz5tL8EVQ+p6+0f/AHGjX4Nh6wfQirIlPRY1AM9XNYgU57rXFMmwNUcC0KtdeZwnRdfV5b6Mh/JnbjZv30MD3CFO8FvoeK0Mk8w24miPPiXWIixC8opreXMuHsDyc4We3JS0PdsfrgYXnLTCtWaSzqodn9V8n3yzb+7UNoAPMeO8LkgLn44dQB0g64SyMtktB6SiDO7WXOt3vF0NJ6NTpZYog9DD6C3OMZl79sINeJ1bAn6QTpLt1IYt6QOnYc4sh/Vc+E/60+LEW2fQTD4ptT6hMTedSSTdCKtyvrvRJBzF++GG0JM81uS9GBvpjyawSObxWozG/jLh151U4SXLCYo3RGPYHy6RQshGASdcuCQ16h81oWeQDmX/8oVbNbU7wZEy39+X+re0vrzy8V3m6OE2MNcbBaS5UelGJvyNstJvE1jV04QOTS6NPrsFM3B7iwtDWL/MAOcBlv3vstC26hadh4WpjxAQzMTmHS1hR5TnQC7LJJkJ69VMeLVqYo6gbBDVf2LCWjoN4ocgE6x03BhrnTVIxKar2+KHXr/XnCgyQQZ/BW9nHOCzlE2uu24M8Xj8BCf4cUcmYvBzZzAsWHYjAxCqWUvaXsonUXLvc6w3Myi1HF5GeLJlDx1AE88VeHIyR8zob5bXn5Bit0vzkON3rMkMUsQNytLDOxwp2G70jooNIY63TSSdzPejMMsLBxIhc4r5aGdA/htAXxvHNbLlfUZ6KvXjw89UljcTc/XvtR8lg5F1VsFPi7UlSuqxx8TEP+tGsj+fvv5DNLy+QXGVv5XFANvMhoR9XlLyHc25/LLyowfdMo8H6xF/QeDuSMHZ8g7lx39h4/E1SeDmmVje0SLXjb5VsUYPUvGZZdh8EWg/l7w0h5pEULWOZTQFd/65PILTngcB48XhtOBhv+B2bJdlh/thw3fYviodv04EEXC7p3cbVCZDmI/EIVs/NLU2h9pRad6HsMjjTzxeN32vD3FR1x2tI+qnzEfrIMTk27SNQj10wPhdNuiznc+x5sls3pcMdawfoJFBxJTcMqUfyfT1ZfBtELOUw/+tf717vNErk8kATbOD/ZG0VmgK19bxw8IJIv3e1Npy50ofyqcPnh1mkY2qjLjacjUeX129+RxO7BFj3y5Y5ddoPIAfxvrCZsOFRDddbD0HNYDuhuKcfKW07sq6fNB/S6sNhF4FezWB43QJeF73ghvJD1nwWL3MmgJ8//B0UJQFMXdWJHrxZS/Uw3VZ8scgCbL9LASq+luOn+EOwcVw3XC7rh+yPa3H8s4r/vc1HPbgTHeE0Sc5uuqoHFDoK6QlNWnRc7S3GxIguEV1lz+G5e8aYvt44M4SSbJbT2dpgqz7k2pg3nNjcEtbuv4XyLZcBD9Qe09Vay3bZfcp11mVSh7yd2qRG+vdQBm/32Qq/dBRTj9UT57a0tP/25mRQn/mHBJC/MmMNfnuuyyD3ovvWgat+hiuuVWy9BV/Np+KIuB4bn+UpiR6v0hgVm7Skt46cyxMQMH9F2NMuKw6hem2BTo6G86nCxlDO5Bo+6P4d9eaep2GARP/kcDv7D4sljuxfWBTwgN7NsatA5JN7Nasjx9S75SfF4WW5VpHBW20yTt1bCt3v+aB2jyVZZOZT7dT0X72vDRxfqkeGp1jQi1JMfWRryvD69KDzqkGTZ6YxcjRfkmMg82Np0E7zUrsidKqywbP4OPuA+Et7QYPAKaQ7zpiZz2PMtUjP/NzTzSG/MmuzDk4MN0O/30f62s/bAxoMSTzRpRmuMB8Ajas/qCQOok0YzKMybyoZ+o9GvvAMWusWQOCt1/2ckBG8u4BEODrzdvRtH/XoLYcMGU/7XLXJaozYWXIjgqnupnGMzSvlKRx9XT9aFwsVXSWcXw8P5F+mMdWc817INiPs5KHSuPHTkFfYLreKPrhrYdMeGe7/W47QNaVxybiHHBy9X/Q3iNxDVywTo6zAsXugIl5Oa86/dd5WqM86h6/C5VSVuNH7FQgtW9R52rA6WV2coHLQi0HL0Dfo99i44ZHnLazzv8FCzfvwrLInHmx7l3dVL4de9t2wRa4WjTbN43o+23Nl5r0orxdFWpnjd7TKOCDECXzsd3mSzn3XlmbzguS1PX+7OiZHMqr6bsje5Vs+vRNUsB816SkUbFqOteP+qmtteVp0xtfDlBmkQ+TjOp94jV0uiN1wSfI9VOtsXOVNx1WS4WXyMfUOyJDE/tvTZpixc7M1uMcPQSPsWNOS8B02XtZJ1TCyGG2vIQjuakaGJYkas9+HWmZKUyXSqajiELX9A1bpHaMklE1zn+Zo6ufjAIMdh4BJTxOI3/CTgCIqzWGCtwfubluAr3fOg3nUFq9e/gQNVluToc1W29DGj6y0daPqxh5w09TZPjVrDQkd59ZU3ZGgBHLj1ojLyuRseyhtBURlnoXr3GoiIXEfXF06Uxq0MYgufVKbPGby9OgRSPQDvB2TSbndXoakVR9mtBNus/hQU3AzDDmuw4IXefArEuzmZ4LPVHq9a7ZCFtnA0tws4OHbho1XO3CkrlcX31CT5c4e3qVzlNheDNrfnc/t2ihrHYfU94UHLDRRUfgQq5h+j6cMK5K0bunHWOQMo+WxOl4t34N0HdtxwZzMM0Vio6lteYFIK+SWrJeFLFv6irB5xuO/JdcnWcT24mVmw6dtmgu3jELh5A6wyeQujTI1QfI8vLQtAd3Si9Gfub9mhYioPLVqAOV9j0eyffZCfYslJTbl8PGi3VDBxBH6xDEDxTBIzkbMm38Ti3DJpkd17V70Po/E5FaDPtaGo0/wNFO/LoPu0gYUu+KJlOIv6ydSvFsT9tNnDF1Uzm3PlkELhWKTsMFqB1x90RMGwNC94kKputo51gXXGt+WN1RUgdCfhPbKMq4FFGbb4TuqNzT4g+oZ0RFETlIxro5qLeK/sJp/53ALVLTKwxZ5oflJcKYU9N8WCkmSyuqGJ/ssz0S90AoYtD0RHsxi+2/ISv5oTq2KRhnpvhGONz8Bqlj5GHLlH65YYSVFXxnJkdRJYVbiwYA5disqV4rkstOHCVl0wKDiOdxtYcW6PrlSn3IJ+Dpc4PKoX10hm7GimzhXYES4XdyLN2xtlkWe87mD3v7qbJixT+YYln2rVvCi1dS7eXfgJsmyUJDIOBAuQ3SMVdHYmkirbdP2YLuZOEvrNkDDUQsWNUl2+Q7lBsbLIBPl2chUIv/MP81WwYFiAyNM0cL7hBJPt+rrq+iFMHNae0xrjOatxL4k8p7Bh56T7xR4YaJep7PDWALMarRQzn4s3RANDrk8shSV9SlwXLH8PS9PV+N2d1eR17bjCw8Gc9f8FGu99kQzf75dGe9tjC23EX642qMrlilYN8HysFpv7RYLIeIz0UAMxQ1l4gCow62+2fMA6EP3gv3aB2Mx/Fgq2aPhKB/mG9USOqF6FlmeWku57IxY8Sr/uzcbt7vswcUlzEj6leX0OccV8e+XD+R44O2M9bjf+QeJ3cvwlpu+dD/Ka6gNcNHEqwGtHWF6zgjJ+LMOmnD9KZw1vVlxrgeYWISA0xOHH0sn0VDfSuXtb0n2fLlUm1xM6f5UPPXnOdQGBaPk2h/zKM2F2cG+2PnX9b18P9z2SxG7hRI8e7OC4G+8nHaXgPlqyev0slfck3/I0vE3xpHl/OWqG30GxnygrPYR/n87AHs6naU11D/wxZpNqt+C84FIYcaNBOjd/LT9JNBDadBS+367yN4Uf1gPn7bt43qUYHGXmSX7bP2FNznk4YOCCuvXRODk4lSsqq6Te7yPI9sYWEL9RXhi3E0f8zlLtPniomymtO5gLqlqbpHu09YJC8HgIXio1Vd4jMZMBIudl4VcUPELUVBuaV/4eBmV9gQvJ/UDwyZeiJpHf2GU49U6rAXOfGeOIqWPoSTTymMgV+KmNN3Zu/YHE9zz8cB4NOXmcAl5U8EYXX9TOlyg3/h5WPAykvM8X5OrIzlxyYxcs7PIcNUOzWb/2BvxjF4AjpFFwZelAjjy0ncoX52DbEwswOP4kjetJoDXdlwu3XZYCF16gm2l1cqBOgjRz+U95kOY4+U3qEXz65hC1KIvjiocPJA9Pa16G+nzfTJfPfdKBbO/B+L5JHfv8Qskq+zx0mZBLjUv+SJ8OrIc9vzuym/ZienOiH1DSGHnxrBFYvj33bw2HnY2xIs0cEzLeUZFcwB9NZ3FN9XxwPxPD1yiFto+OhmkhMfB+cAvJ5vRcntbek4amtGaDWjUc+tCMftgko0+ZFY4tmS2Fb+uBQifO+ScZ9d6E8ey3HXm8d1fp9W8ZIu5KLN99JI9ysed7t3dwkHomHR+Tgq/mXKGqsjbw2dkB74QW8C1LIxb605NAV04JTQXRK3asyOaqvRt40s9oPvNgCfY9XsQDt8zC2sdjueK/KupYYcGPjDsVPw5qDgem3aKJXtr8uXUfnD7NgZ2vPgfnT7X8vlM8bnbqB+pHF5P9ka0wc9x3ytKxhuar22OWzn7WOtwC7xx1Rtth03nt8Dacd30gvhDvGFWGNzDbegCZf47nPo8SKT/WhV1XACacCeeHk75Q06IXcKXPaXri4ISGvRS4LNiIp5vacJtNerh7Tk84YvdNUaZ7QpJ25XDjMjVsmxqu0kR2vLGCT51uTbMvhMLeOz9AdfelgErYoRUIz0rWif7PUO+i28ozv6Lw8rkrfGhfNvg6teFRLsf4x+Zh7K4m06KwDvxzxCBW9eBfm63YHqnOLQOXymtebuBK4zB5sbsXFm7zxM3v82lQj8eSZd12+aUymzNWJ/HI1a68ae9ZEnUIznT4S11P3lPZTl79+jAOOnNT0ppeIW9aKXF6w0ta2mhJrc6bcdHmfLC/m0U6Ul/USryLlwNasnWWNe3UWksnbCRxR56rmClFJrTl9k0D5Z8jSinif27c4KpO1WOzwOvHKjT/rM2y+0x8aT2J35wopKUDbVE1r5UrWg2o/BjKNz1D0CDiHI7tewC/13yE9gUurD21H2x70wqLbzFPvbOepCgLmFNzlP4LP0A7Fpqw8JfiePO7tL+gBzopwlm5vh6qViYrhvxrg4MzvLl7881Su+RbJNindsmjMW9arNLr+x9YGDabj76qA7A3heiJi+T2d4DLfS3k9k0l8D+fyWznngfWpTagYnbtydHsn7lFErzJghMW7OHKd+VYe6qClmGKeOZcTJgbyv33G9DIXJaKE4roxagVrD92PW1tlY6fDrRC5ylWHK/5nV6lj4BMDkOXnBLo9SeIzU1b4skRe6SqvYYwI3abawe3XqTidUrTFBA9ydw4iIXWYGe+D+7cU6DWdyPelX5Y3lE9BlYYmWMmv6c+Q4eyxqDZnHcA8EofF+x6wdN1751lij5dBmNkwmbamKuP/r3G83yrFfKCovlwvNib23XO4GNLpoJgQ+THOezzqDmqPCdFZSsas7X4wbWVYndPlMNeXacOa0+A4t1BeY2uCfoGbaWf3RlEf5LgEBI08+ixkxa59I+VVN5Zc1ZPXvTgofJAhQHUPr5LY2vngLHSkIVn0D9iGuaG7OJEtSDJO/+RNKVTiFI8A7Vu65Ngktp4a1FD+TmFf8RzDns1kh6tfAQil8DJ5B3tnpMHGWXurLpPs6Opykd4uzAOzjz4rtKB6UgAFh86IzJgtFx/oKq/yBU8v2IZOQzUI10XI/6fzSNVznCPmjQSzxder4FpbldhX0g4/miWyEPS+nDvP8l4WW8079TSxU1B/aFl9C9aktQP0htCQDX3iLsyHV9ixF/7bcLBT5vB4B76VP95E043zYdtO+N4Qro+2nSPJpVGWVtnYvzTBdz3uJPUfYw567Q9iO5qEgxJKyCvH2oKvfMzeZWBOiad1KTKj68o73oJ++zdpbxkf08SGQdiF6n4ReF5uKIXy72LxojPbTi0KlNKWbeR2v00AEOdk+BtZqbKvmKxf6DL5ZfUameNrLGuK/QoXg+v1FuSRsdaWLjBAk0qG6UXo36rsoeSLEvlYYeXwL9LSsVznsjdXhXwsnZJGPDCFxuXrZKjY5oouv8nqXJ1nrxz3iXu2i+eVf2WKjaIvuMUf8LWKVS7UfgQhLewR3Er7m90HY9mhaDtxjAQM+Wqsgw8smw5mHXywN9WnV0+Ox/HmAClLLxE3/TTuFXkFPa0aCayMpn2dl4jR5gP4b4PXFmVWz1qWkunnmyCs8HHyK/FZ5ylPxfzJ5/gpR26s+Aa6mMfgGnnYAUPLJdbvzhGap4J1OpNJzh3VZPFM0UmWNCtQj++cfKT4uK72aTip+RGZzxtFaNiUBL7Gy5enKHyAIzTOg3u3dz+MvJ/KJiB1g==",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9764,version:2"
}
    