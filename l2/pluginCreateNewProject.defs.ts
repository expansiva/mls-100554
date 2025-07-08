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
    "This plugin guides users through creating new projects in Collab.codes, allowing selection of project type, customization, and plugin choices for publishing and storage.",
    "The main goal is to streamline project creation with a step-by-step interface, supporting both English and Portuguese, and interactive selection of features.",
    "Future requests include support for more languages and the ability to save project drafts before final creation. Accessibility improvements are also suggested.",
    "Most core messages are internationalized, but some UI strings and plugin names are not. No critical bugs reported; enhancements focus on usability and accessibility."
  ],
  "embedding": "eJwdV3c8V+8XJ4SmjEoUldHQ1OKeQ0PaJKQhhQZpKKVoISFbGmSUkJBIqbjnKJoamlpKpb2/lbbq93x+f3g9Pp97P89zznude5WUQk4qKYWMVFJSsls79gydwdVWrf4Nx2+92/LkkHz8YtuG1461Q00/dV6gOpFbav6Dbre8+KnbcfK7O4kc7znwJm8PONz8q2Lp2iGcPfYNlT7dD+53euCRquVQ8+4NbU1HCNhZSzY1Kfzs3Gy6ecyUPda0xlqn8Xywfa714dR4XpAWSnYXWmBuq0eQNkEdr4bFcq9XQ/GHTjv8suEdDLnvhL+8W7Bzkw5LqiaY8nKjLPZgYzVzWJQzmJPr0tFmBMKou7nYZs9eUtJaIXXsOA97u83iTj1S6NagFvTqyV7p9tlS+uH0gR3GZtKKbwuwT1SmFP05DvLmDYBhwdaoO2IXqVISh5Qfooe6SfLa34UVs+Oiy2v2TeOyz0fYI/GRlV6exGsOJ1e82qXB6nrDod4xHU5O3cNR/fT5056eoP8ylp8O7sulT804vz4Gm3ukgeGbJ7TgEfO1GyF8YtJM7lzvQvtd1vDKh0mo2rIAB4ZaoLhWcdN0Ilj/eCs5NyVj4OwxaHrvADsYb6MpH6fwtcs5uOL6PZr6d5Z1K5MzVi/rfKDls88UfUW5coB2FOQE9scr6iVwQP8ddPrTmkJVzuNur3q+sSROvth1ABs93s1Zi7JA8IVDTRbzz7DB2FJzE61+l0lf5qfQwfamPNHxufjcjV6WuEs9v6rYdHDoCOUVf8jwoDKMydjNKr8+gXNbHxa9o476TRhTH0xfbGPB0r47Nh0q4Yg7F/jNs68cmFsvib645f5t8rhvtlyospQ1/SL57gID/DeoF+eb5oDNBxP2KPOTO/RuhYm91wtMbsl9iwroR+AvsrIthh1HnsvlFRt477A5co+LBuheupPXBz1EHx03WfDHUdNMOe1ggAIjtPQrokrfL9TGNYqGmryBHzrxuKDiMMxyt+cGj3z+5pBqLbhlwyHBNPzMNG4eZ86uNx6Aw+a/5KK/l4LTtrPACjwjUsDweltr761L+YXhQdxuNBQFrsAxBbwldG3FzAt66JE4ly92LYYWMVPA5MB8fDq4EDZs0eMb45S53QZf8ro2EAf9N5WcBhgpcMcYMFPUB5qJyfTptSxlLw7kAX3d+c1qJ3nFCTX0++OG3VPdOPz9OOzxMY+WZpyytjC8yvs7dsLc59P+z8mYte3A1yiBrA4587aaZ1Jor5u0rHoyC62K+0fi+TNb2eP+Gm5lYsehvZzJTSULxjiHQcP8LbAtZwZfUR/I9/toQXOSLe74swEt7bMw9tpt9DtiS8tezsDNFyRuP18PBvR9AHYvS0n0zHXlv45XOa/ihb1vywJ7aBO8HZ4XReLx4704JeOFzHWjqfF0hDz27DrQ6jpNHmztiyab75La6loo+2yJLfdrQ1JHVRykN4eX9DckhaeEHlh8x62TX4EnhECfcxsxW72VzL8cePS4iXzm33ayvjkXijZOQH0lTw5pqJBjOu2uEBqEPlHdBA99JAgYjypGG/HVrii4NfG23LC5TCrznEEH36RA0FEfKIm7LRVdeEKOCcOkoIQHJPqif4MOyF/2reX3+Yv5BIfDqZOnIb2FHaqtdoCuBvul0CmPQOQMDX2xlYIWT8X34R7sVWjC0qNOvO/3ddngbB08uqeGSUOHyBr5i+D5DR1FbZLITNwWEw4Gw5Ur7xhsxi7TD8PWF3Xy10XvwX/MFi7fseL/PfytVsGB7sY0dvod6b8T36V4M3OudzQkpbfP5N/zfsPlw3OFp6Lo7X/9+PHfJGjYPJRdvEcoMpRV+w6jtOubFF7jspsqENdlOS117oWf242XL99+K19pzCZ9pSc08fFI7tImlUcvuS0vtjMgj/vfyXfORxIe44LtF+SvXevgTvZvkS9+8Ha/HiVmbcbkX4LL6s/Q9VsqTVhhiP6RVTS83VvoOnIwromNJIex3TBsSAw8XLMBduxOwsOp7XjnyQxc1uY5mI2fgsZqeWwwPBT1TZda9/hojuknCkld77i0t6sm7tQ8BhcPRfO9bnelaacduWgmQ1ZsEefNK5ZFZpDAEn+O2M3zd5jymlh1tGtji5MvjuI53SWMUzaQTY+mc7n/AirzvEvTy6N4TPV+emFogX+U5uPYdU+tFXoYNrAHX59XB3P8nAX/nfFrV1c8XTuVBJZ8XaqRdHVac7lbB7SuiJFm/xfIijlSt9dMGumrrNhLZEgurTBYSZdv+/HDNX9IMa+iWzdy8RgbvHz4kYJDEDOOpj6PgGuXTTAxSwUXaoVhic9FdL3hjtoBPVCho9cti7BLG33UCxvAbird4Uj6U9jiY8LGjrbssLgAbXQGQcW5MgrZ3oMLym9xvlJnXj9vK0WtGcSiH+6T9Rk6zVtLhm88ZbGX0PErbF5iKQtsbFY+7MAOHivBNqxOqnJuqji6OYFWXJ8JoidsPWEqdT52gRQe7/pNn9+HN9Da23u41+l8ycmlEHtanSLLxHIFJzjiWrR8eFUYXlo0Duumx0P+xIF4ZI2bJGqCmg5rKPBDBfg3DsfMpw7wYOwyWtJuGE+cnEv5RS544r0Brv+FvMT9GFRqPqKv6cF8dOos6mOmxxXuc/BO5FtR3x5WGqfEKZMvwz41J36+dSXuVI2hxB/qcC9lSUW6sYPcvlKdJw8z497eurhf6Sal/7wiHx25u3zOrv6sfkEFdiRE4y3HxaQ4w8W5QOq6sh1cPbEINGNUIVw9jGBiN/wS81NeP75SHrCzkxSURri04JiVovYZ5hbS1kNnIGTMSB7ZzRg7HIgi39tH2fqtIbrNL+T8CBf6YPBd/h36R66/thTJqAGkeRnk7NsbtveZiJ5+JZx9Igk8y0s49MRIcr1QUOG4I8/6ePFsNnuozfeHvCefd5acvGgCOlIe99Lbztp2W6FtUYScOcORl8vDOcxlFNYavuQJd0wYJmayqJM1Pqpgo9MnGJOTJY1wTOcl7Y7xliOjpdm3+nHpdH28PHghjC3bB8XlbrznylX6s+0vhbWswgyPdjatzLfwnuUJFGKpxGunAAb4lNMNm9cwgHdB5iBHSWCAa6cQ66+JhbZzW/L0j30U9+DWSDsOSgP8ZbmBZ0cU4btWgZw4fTxvV7koOfw040A9mbIXJ8Feg6ng7JvPL18FYLpxLc1Mt8DX4U0Vr9o3waSAXBS4WF+pXUijB3THRWeP8KMNyzHwg7XoYRgWhU6XUndfpqWbj9G1fq+gPmwpB4LEq/pWsFTXFbMapnL8UHUMfg289PowPgONVOH+sKLASo+uJr2URa2cW3oDcjpO42mj82mGgwUtWDiYPSyLIWNLPIzW6I6zRvTjoGrgsH6j0DZ/D19uvRCDPZhiTp7l7AtOPMErB4x/JOCuva2t7J16yt4XD/O0pl54L+UdPJNWUlbDtYr8QF1e4y1DfoYu+2uekCea5vLZaC+ObrajSQGmrLNNkwvr9LD3XV0UmqXsC9dlO/19/LIqAKeEm2GYnbK10DO8GxQoftcIp0Y9llVHh1EG1ZLntoG4clS5nPDkPIj7uNnur3WPxkR0USuQx+R0Z7E/GkS1RbXEMHlSlakk8K/wejxQcGTFUdp2UKC9g5OWRmGTeTA3Oq0gPJmJG59VgrGRFl8JWUglrmKuPa+Tqvs+gYwdtRATpSanVcdRsd8dWmtGtDqoglT2K0NUC1XJx3qI0Ep7nvjXhIM9kGd16Afj1vbExZPKKOG6OmTVaolarSDn43V02nSAiq5Ox7B+VfK+MR3wg8EaRX0KbUL2iQ5wBrxAoTfBPe9uP4Uyx7fH9d1tUPgbHZeZ89a6M1jl85hYbqhIKIjEHxOaKzpPbYPrDiJWJcyjd62+yaYJ2/Dz/CDcKU2SCne5Cj/34fSfU/jGf68o6dJ4anL4BddrfCTBNVoFpkNE583Q9VR8eQ7egCalX/LgMamk0FBk4BiIUD4tXWv5CkSGcPU0Tyze5oYBD8vRcrF+5ZgNWVB09TYdnDVdGqFsiMt+DON9atep5uZ8LIzcAckPanDdTRQaqgJDk3jW/hZF68fb0HjdHIXnyS2mL1ereloLD5HT/l6s0GDPjUmg8XEzNQz4SEen3odn7z9B2dlZimysWJRpicecDLhbuwTq0aiFew2uQVpaHI9aspdME7QhLrUlC++iolaRTTw3tJjXmgE0qqyAbZqa/P3WOnoxOUBW8Lk6yBpnKFmAgucDb5zpS+lPKWOZg+y3cihsXaOKn7J+0OOR/pz+Ok7q+CmaN6+rgrvNfpRboy1/j1jHTx748zHP2TxCOR3mdx7MZN9gXTtmEXipH6b0cbW0cfDJY6eDPHndFuQ10ZJYWR5sqA/xY8f9H3/7Bz2466l2/GvWBj658RG0jYgggQPO8e9PIuupi3Vb4ZvtGDXPDmYXFWFoaAiJujHMpUryLB8oC/7w6doVqJ61mRW5IjCn/Fu36EjcPTrQS5etAg3Z3imbR343wqIVO9GloTeZByXTkzJ/8bwfg4v/DMEjC2fCweYdNPdAMfidKoNDQzrh7rttUMFRqUYqjDuXDVPFO8PYRfsAemZKwr/y6AFZUuXARyJnMjiqRTg5LsuD0s73FDomoSWK73beOmtmIkmHMuCYUxoWl9+RLu1c8P8eycgDWp/egisuj4Bz/xqlI/UzOTvLSZHDvE1/Aonc5Ct5C3HvYC081LYTvnz1RRJ704K4UkyZPBmHL0ijaJ0tOP1jAR5w3I7CK7TzYTS6WBTA8zufyct1EFudSccemklCZ5UVi03KKGbFWDjmWV/BSz3Q5kUmp0a3wX8XN5GYmdKjnOUMzRksRXbFBUcHY9tbEVLImFNYH/YejNzb2/joHKXjxfWk6xrNYraBalMoRnwKg+Xbj2NJtxSqNVxE0T3Pct6CZJ652oJtrxmxTvlWWPtPBo/nhyC1ajK7lRZiXmwybjlSDYqs7qHZgQt61IGYsbRjz0WFF/jnqv7w1L0KDthfxgLfaOvd8w5TyvFGSmnZFkIueWJeO1uSn0yHzm8Gc9KTMPqjHsm/n40n++g8SGkZh96j4qVq1xia5v0Lcta35RN1Q7H6UweIL+3JVPYG/O/l0vtze3mE3125fXmktY+dMiTvMQaNAXO4v3IQ7ywcxVe35kOlmQXBK2tQ+jsIh+2y488d/eVB9rW0WWs4lWQ/hb+9u+EZnXy4fegIhT+7iEPN++A/z0KyPJ7ArcEUXz+3A/1Ke5w2P0uOXurAxRrhmNY8nOv/5dPAdlU0fUAkh0rNcM10IJo0l8teuerwxeEPPdrWonL2jsuwYLgVF/2WIbZpC84Lq4HcFpkVH5eN57Tm42DTNJs3RFpWHNY15fIVBMV+t8F4kxv59I+R2mcncWlJX/knZPHx+U285EcNWdi1IIOFy9h6rTFf/zmGjQ0a+E92W662+QCGmeuIo3Ol/I33yNFoMvYKSodPjzQxQ2MmvzsbhMrLLqOthS8LHnjJKWLRH3YMTqHV8TtQI/k2eSd0QN+LSZJhWedKp75L6aixPdV4/6D5XhvppmEY9+xlxltCrot1vyT+ZJdbMjT1HIH2H4ypYcwM+L7oBX2dfZaevN1EpZNL6U+5Ckf899bqyuP7FOLTHmuUzGw+NXjxKtcnFDy6gVpDLuk9XEzD5h7nxlMVlJuxASvNDtKsObZQ1dIT194Yo8CITt9vgsRZk/Bv/W6y1jWHGzsusk//1mhl+07W+rQdfo+vlormlsmqpb+oqecJnFzfld9qqPAI9UfknH5InlDrSgk9KuXHC3eimWYYR7i24ZBLT+DSrXLKVV7DOY8j6Ni6JLY89kqWN6ri9TmMZm5bOLlFAF62c+EZTpnSunXauDXVmgTmaGzgASfqymj3mQJW9JObmcPh48/QwJXWoHnJG5z6vodjNbr4xTEH1WdP4NvaRfTy7nqOjEuFEJ8E9vr8lOpiDTlnwX+EVAv9OndkSzUdmKbUi/3vmbJYpT1Bu0Ertkluo1VO7r7zsEWrm/Bo3QIyvXZFcTZcqxqG1fteSoIj3KPXXZY3zOH2J+ZhZOxnepBWggr+xHdQYBCJ93K34K5NdTT/XyFkJ7lTs+F0+uMaTYra1jtsgol+KmymUU9J35yEJ09SgVqSwOU7Kfq46esBO8ddoI4djbDgeBykxnZFBa+rXD15v3UhTNHpC+6G4WiVEwvVtno2L1f3gRfOOtLC5fZsOe0j2W14BDjDlUVN1CVZmQNCr7DQP6Ts08Ebg66jj10ozHifQypfVWw6lZpiv4vbpEWtr8DpwN9yZL0h2k/rguM9ZPg2YCYLfUNEuRr+UNXFZJUuqNV7Hydn/qy4MmALiL1g4U1b1E4l2dK5o0IDGPw1lMR1KvsaIq2qCGWr+s80/3ym8HSuNOO9CSpwzRwVRz6P1aWdhVWYarNb4XEeVHDeWmgD/p01oee+W1Hoh20vfJQE7zjJtS0fKDiLe9Z+kUdlFNCtfdpw0qOcfS924PZ+4Sj8K3nHv5EeH/kM60p/0OKp+yD3aBfY+bSW3vX+AmpHsqytRuqg8DWcyDhQsf6tBT+Zaky7DNyJ96ZBYUx3np4cgrozQlkjeTq7XWpLozL64MHTh2jvYXN+8s6MDS7Fc7/OOyHiPz9sPGXN6zp+lkrideVFec7ijAAUuWTdfMKdVMZEyt4PdSnF2ZdjNOsk9ZOjae+U/lxS709tx9vD8r2fyCTllGz+YJnIqHJrgb8sfAbLs1J4cn0GXBTP7jNNB1PeyhFygfN2WfgaPpd+g8hePznr9VFZZCrnX1GhzC+aCt1AYqUdCJzArawTC0+SzzZVUvjmcWcdDLubTwYXF0ljfbTYuDaU/UyGyc99vMDp/Bep/0J9kb2WkvafoVyW+BhFxoChSjrv0Q2mq1t7c+yoRqpSj0LFeYocn3toqOTlporBwW/xcaclbNJshSI7uO6+ERr0fyLHvxmIwhdcF5sOdYH7qaPeDwVW8PX7JJqrPQBxRh2J/1l52EkI6dJGepuzla5s0CBFfjq8rOTq7HhONf8jv4vXUeiBBDaQmduSRd6RxTY17KW7HnVzH5aLPP3/jJh8P5B2Garg/XOrKcqzHxss/MD+qw/i1NHRFVFn90sDbluyyFDUvPRU9l9tAbGjNaWQRa/kDI17WH/eEGrmG9E0pQMwxyUJFX0Wa6iymDM43zsXp6/3VswgaUFaKW7T11JkBiREDKcL5z/h1BkhsG2DJugsvSbyNYGCvypjie1i5g+ZlJmgxSnHvfjhcjs8u/m09Oc/X/h1UKKHN1GRY/gt+QYL3KVvydPg6AxnNNgQI7LIAYVeSTGvlIfZKmYPX0hsLc+sGkE/jiWWi7nH8W9KaJKNP3xcdgGf+zTCxtnnRRYdg8GNLrLtumTp7EuCm4vV4OSvk9bh47yEZldjTKsg7DtkKr7efYJaxN6ggElhEK+ljh1GuVNLb1WGysPkFp5Ne9re4jtpSeidfBhciy/hurAV3HP5I3JtyON//kmSxYKWNmN/LOLQa6MxrmQVFp8ZDr7iueH0+W08eZwZjlilS4HDgqHVxrFY91WP+yT2xz0N38nN9bz87+l6adcaW3lLl3l8d1kCnm0/nY/YxnD6mZ78eeAU2tb8Vo78eJxLUvbB842tcFK2KtadswJbjaug89KN3a/thjc29yF6oRsv+9uVXR5cka/mnbE+aYTYdZM9q3nt4ss33sFd2yM0etMy2DKBOOuII1R174Q1MwO4waMXa+vOwlaH2lHQg9Ww+GgIH+/7H5T4zOS6rzvg/JHvEPF+Dmac1cLxzQbof0NDXv0xmyO7bceSc0mcYuDJkR+H0w3jSug9dy1ftPgET9Q60PUpp6h0SVt2TLwNgdsHs2qCPonesClvCY/r3Y0DDPej2asZ/GS/H5p33ocamkqVYdkjee6azWz4IAkN6k1YiluH69rp8w3H3Vy8YzaLfSuX/c2g5ot6PK5Pa/Z1WQZxYIiKfjolFLF+yytSG5NRspP6N4KEOvAt3S+Pu7QA3bNsoLNqAI9vTqOg1tMwts1NXvc4nwaZvIZdeRo4q88eBS9UfNaEJ6x4Aqu7hYjVE88ujeesDlHUPqNCGliixUWfrHByYAs0cunG95+68KoPwzjn+GaBSRS8a/wN9bqt5aYhoRWdEnfz/v49scRqAw/NaJQVfbRf1gCBC26T0BEpsE8/kw23zjyiQc5j0T9HH4dermSN+9nwsDyV04zD+FaPFL6vPQiCrPvzlom9OWPEegXP8tN1p6k+8pt0JrUnb9+3iCx7ZeDe9odQp+NRuU+SAUXvsOS/Wpu4crItv/6+me8++UWRXfPoytxQaa9NK+o2zY6Nf5xUaJiiz7QHs1d3aVbfNui0vRWbla/nf6PKoK+3BQs+MFYqVmiee3MJqc69RnPHm7PFgghpYlYBC4/A8utp8P1gHLzrMINrjhfSgI1Lof75IfSe78o+of6o57GGEsv0OOlYGMYubo1bJuZjfuBCvlOjhP/1D8Cypxb4brmW4hpn+g7mDity4bLyBN6VFyV1Torkyx7baWpVLD+d/JIEv9Krbx0hwNCsIvmqL9tt3kdfgxfTG5tZENzgSG3NDGBKFxOF/qlVUXcUWFqHrXoGUcn36O2ybGjz9ZksPCELz1JDnCrYu8VhkVFvnvV7NIXndmHlVyXCJyKz9+rx48HJ9MukC33Nt8cfxgtRK9Ocf5tG8pQJIWgzv0j8pho6siHue5pCMT6DuBQHgTgD/9rWw8XZV+jl2Xn8NyMZDktuOKy2M4ksYI9x1jhvojKmdpWhz8lWXPNCnQVu6H6tC1yIWA1p22dRQV46CHzAsldX3LZVieJLHfikQyrvnhKOp31ncXGTEncZ1pEn7tsFe9v3R6+PCXB86wGaOaOdrPemG1zNs6OCCc8oeuEd8Eq6Q/XP+4tzIjklKJUc3meJV0oZjEyrYdXJWXCrqRfHPymQx2d6w2nrv1SuNF6a/Xcrmuu3Z8cP8SS4kH1dPkBt7htalbgRq8+OgBEd3YUW86WNkdoc3NaC/vl3IPM3pXJJSo8KONmNX3S3lYXm6dv6M1B7y571h/Zmz4QNVorsalIzxd48kA63+U1Narm020hPkbOcM/MSaz//Az97jERRG3XRyIMBD7XZtcGcpS5a/88gcY8cWJ0FzT/CeYr+cKy9dQ5iWv0koXtFP7Jy9A9SrAET9TjXogaKv+jw6xpdsF2ojt5Dg8TrpjkKH8D8hQNomP9jen3BHEU+yDO2JMIXTxW6XhBD3cLiSGSPbKHuYP24xUQ+4W4m8n8QCo3BP+2ZHGBghQ7xzdLmm5ocDFGoGm+huA6mdsPxxedGulMTQkbfFnBW+BdQOv5LKjRsVOSBgm/KfqaGQiegfrdGLpxkw6IPGn1oIgs8pcmBYWj8wxaXXR2Fem8yef0Rc/lZoXhm/Roqw7wgKH20ll+aREhCV/zqfAUr8utjtBOIbJD73Z+EA53e0qaZPbnf8F0oesEBRTWSd3VbEtqT4yCd0cuZXduqijnVAaOqy+jByyjcAyWoc+I3fZy9WpEPIGqs6Ff4kf3tn5CYFaSmslLoNgXUBtfSQp+tkt7b1qjIjPvah9mldQF6Vs5EeB/3/9lyf1Qc2t77DBGGFXDO1ggjkzahIovV85eSZ+U9Eh5mm6FOPHyMB6V+aAA81ZqjjJQlxT6nz2uz4IoWSeoCPyWb8HGNoLHej606H6PC4C6Y/PcsTLIvp6rPFRAeWEkenRtIkTPZEVdoyYwe/+9NdWAT3T+6FtDrJny924OXBzwV86YUMxbNwP3/7PGXyW46drwT5ueOZoWnXEM+0v8A33+xDQ==",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9848,version:2"
}
    