/// <mls shortName="pluginStyleFlex" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleFlex",
    "type": "plugin",
    "group": "other",
    "tags": [
      "css",
      "flexbox",
      "layout",
      "styling"
    ]
  },
  "references": {
    "widgets": [
      "collab-ds-input-range-100554"
    ],
    "plugins": [],
    "statesRO": [
      "less.left",
      "less.right"
    ],
    "statesRW": [
      "less.left.lessCSS.styles",
      "less.right.lessCSS.styles"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "_100554_stateLitElement",
      "_100554_collabDecorators",
      "_100554_collabState",
      "_100554_collabLitElement",
      "_100554_lessCSS",
      "_100554_collabDsInputRange"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Elementos <select> não possuem <label> associado, dificultando navegação por leitores de tela.",
      "Faltam atributos aria-* nos controles para melhor descrição semântica.",
      "Itens da galeria não possuem texto alternativo ou descrição para leitores de tela.",
      "Itens interativos da galeria não são acessíveis via teclado (apenas click)."
    ],
    "i18nWarnings": [],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para gerenciar e personalizar propriedades de layout flexível em CSS, oferecendo interface visual para configurar display flex, direção, alinhamento e distribuição de elementos.",
    "goal": "Facilitar a configuração de propriedades CSS Flexbox através de uma interface intuitiva com galeria de layouts pré-definidos e controles individuais para cada propriedade.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero configurar rapidamente layouts flexbox através de uma galeria visual para acelerar o desenvolvimento",
        "derivedRequirements": [
          {
            "description": "Implementar galeria com 8 layouts flexbox pré-configurados",
            "done": true,
            "comment": "Galeria implementada com layouts row/column e diferentes justify-content"
          },
          {
            "description": "Permitir seleção de layout através de clique na galeria",
            "done": true,
            "comment": "Funcionalidade implementada no handleChangeGalleryCss"
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero controlar individualmente cada propriedade flexbox para ter controle fino sobre o layout",
        "derivedRequirements": [
          {
            "description": "Criar controles para propriedades do container flex (display, flex-direction, flex-wrap, justify-content, align-items, align-content)",
            "done": true,
            "comment": "Todos os controles implementados na seção renderFlex()"
          },
          {
            "description": "Criar controles para propriedades dos itens flex (align-self, order)",
            "done": true,
            "comment": "Controles implementados na seção renderFlexItem()"
          }
        ]
      },
      {
        "story": "Como usuário, quero que o plugin seja internacionalizado para usar em diferentes idiomas",
        "derivedRequirements": [
          {
            "description": "Implementar sistema de internacionalização com suporte a português e inglês",
            "done": true,
            "comment": "Sistema i18n implementado com messages_pt e messages_en"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para propriedades flex-grow, flex-shrink e flex-basis",
        "done": false,
        "comment": "Propriedades importantes do flexbox que não estão disponíveis no plugin"
      },
      {
        "description": "Implementar preview visual dos layouts na galeria",
        "done": false,
        "comment": "Atualmente a galeria mostra apenas representações simples com spans"
      },
      {
        "description": "Adicionar mais opções de justify-content (space-evenly, start, end)",
        "done": false,
        "comment": "Valores CSS mais recentes não estão incluídos"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir problema de acessibilidade nos controles select",
        "done": false,
        "comment": "Elementos select precisam de labels associados"
      },
      {
        "description": "Melhorar navegação por teclado na galeria",
        "done": false,
        "comment": "Gallery items não são acessíveis via teclado"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar tooltips explicativos para cada propriedade flexbox",
        "done": false,
        "comment": "Ajudaria usuários menos experientes a entender cada propriedade"
      },
      {
        "description": "Implementar undo/redo para mudanças de estilo",
        "done": false,
        "comment": "Funcionalidade útil para experimentação com layouts"
      },
      {
        "description": "Adicionar modo de visualização responsiva",
        "done": false,
        "comment": "Permitir testar layouts em diferentes tamanhos de tela"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a visual interface for managing CSS Flexbox properties.",
    "It enables quick layout configuration via a gallery and individual property controls.",
    "Users requested support for flex-grow/shrink/basis, better gallery previews, and more justify-content options.",
    "Accessibility improvements and enhancements like tooltips, undo/redo, and responsive preview are desired."
  ],
  "embedding": "eJwdlnlYjW0XxdEkzVHGEEkUMoXz7N3gLRIyVYhMSZmSOXOJkgYpSlIypFDKnJ69I0lI9SKZlQyFyhzeDN99vj/OdXV1hnvfa/3W2k+LFkGXW7QIsm/RooXjiKD93Km4CTab7KKc6Fja6hch32+lxS2GtuLCzwPY6+8X6b/YjjhtY8kIr5deVOAeSR7NTGenBeOr+VFU+nQRXeg3CSb5zqFJvtXwwyCS2visYpN8axzouZ5U+sRyh3l/yTu7ltzjR9E4AxVS/l73JeGYPXc0B3c7ge0/H8uLN9oJb7M16UeLB1SYF4Lvx/UD8XlcMreJ/v605K6Pr9P+xb7YTzUZ1re5DLd3WKDFpVQMPXxXttL7I6nVjIWntg1S6CJzdE1ezsbLO0LcADU80nIOrze/D2o1JVTunwXhE0+K70zGyTkOMP9oKE61CGfb2kwIKzfhDcPaoPdaWVrYO5vtUxcgZgfR6iNWfPXF+rzbS2Jhs942Tjj0AxoXzUI/rY5SF+xJR03WwD+hi9Gz4wf+6ePKmN1C3mQRgB1PzoHoe/fAz3g99854L7ev1KcX+7tSUfEWjlUsAO+STfA7MAXGDV8vmRzuJIVPtOSSGV5YdHIhfrMMU95VmrZvLjs3bMKP7xfDwg3LQTmfnXU029wtkOS0fZwyz1QKWDWKDhZ3wCvaJ6VglT080tUODWbdJK01x8H4eBErvfTTSiSz5xthnp0emYSqKh51B3bxPsFlDjU09sYhtml8APRrG2/Mbc+OCd0hfMdUhUlWMzm+n4fvVMYxz5oMR24O5nfSD9BL08M3r/eDauI7rA9TocfjNXhy3VIW3vH7cVkQ4xPP+s9kOGQVQ45nbfhWkw/3P2TPG9Jr6LNTK9ZL24W53+1YyzMOE9unkUPpQPj6R+K8mcPA9+pFONm7BVbVF1GQ7mpcaXseT9e4sdJHNjfHAndtFt7AvBlpNOjycojashud/5wBK73NeT692kGEpg9ebl6NZywvwKUBS4aL+2DplQo50iaHqv7NZuMXy5Vc40XPA1R6J1yOG5tEpVfcqEevQnyq7kCn/7wDg5FnsW5BBt3SSJIfrdpMQZU3aGl0AYi74MxdSZTc8QrcDNWRvF4+o/9OZVOjcRdUtLTgFrOP0IZlNththht/z9xDfwc+pCNZJoql0Q449oYpVg9NpylGl1DwhD/69aALtuq2PtarOSfaEENSh0F2n87g43BC3uqnBVN+HibTKyU0t6kfDz6nz7CgG/Z0DEG3kdsohEpZL0GVayEMuY0+bZjSHdpXxpD7mZnsHXeHAsMHYmbCQ2pQ8+XuaxdRy4RyOPMlnKK2GNh6FBrgJm1PecUjlit9W+HLzpkgub+TJ+cU4OclP8E+9Q0cPLmVhwxN4etfXXhGXzN5QFnEpUXz1FB35inF4d1hgCXxLDQFpR/ZTgMx5Os6/DRkPNo0TsUSu9HYcZcLaj/pjqrR4co8YGJDCBX2fco1F87hdtcY7LK6nIZ0bI33Apz5RfhCtuuhIk1tXwHdelrw4dzN5PehFd483BO74BESGcUNEbdHOA1xpMtVVcqz0ezYRMXBu+twmV45La6uo7oFFhCk+436dT8LdSkV0EvLmfqu8CTBr8jCZXml7VD+PbO1YmhaEz3r1RKfTeiB4Tse4NfrejS9KDNvbeAvcj1lTpg3VzpW4spKZvV/3uHfIVuUc8ND1WN04uoO7mzlj1j5XRa5ksXccF9xka58bMd5geOVXGIX0yiKtLHGwspEybbbI9nA3IQE4/DGZDTe0bpDos945KA+eecf6WLg0iRJsA937pnx29rz4nf2wL4zWXlWX3x52rm1ZHmwFy+PecpyQX+6eGuVssvwBmaSyGLes17BPOf1Dxq+7LX0uuI1aD5SwxUGi2D29DbsGquPrWPM8MTbLbw3x5CVnWbk6Iqz9PuwZwsVKljegxdlAF489Ryav8eA+D9cm9obxdmctjBYNoxfjT/H5FLmbCscY1MFs6wuw+HcP/K4LvP5m00dzG3KAmW/HA6aLM2yssPbR22pehKikbsKK7UPe39W2cn8ePtZDlZpx6/m69C7dsF41HAvXxpQDyJP7PQrAZSdcbXolVzWcJAmhTRBrw+n+V7GV6lM8wIqe3bxfQ1bvw9bRXdXK2cUXu2CJX1csG2VB5Vp2vDNwK3C0x0YE2yFKaMisLnVCvz+yl5Rl7cIfI+ZYuqwT1DTZi1MmzOUkzYeoJ/J/ymU+whcwulJ2R7uHWDH7XVZztxwNe/DhrYgMkI1d12kXW4v8NyrD/RpojfUuq+kDOtR2PxWDZWM6O15jFMGluPe2xbYzmI4uoxuB9wmBts2L8HK6J+y8ATOl4TgxO8aUlRSOkwKNMLTfxaBul575fsQ2Wm/Mrdw5PUY8t0Zwe+61ZBq4iI68favLM6EvaruvILT5dzLccodZhsT8F0Wu0ma+D2M3Ndbs5ibpjp2g8idn6nR1ZnOWNpwmzGz+NlgbfY4H6rsIpj+4irFD+xuC1uHsvCVlV34bHAkWn2phSqzFQQummKfr6TMf+JprqHjpXsBN0jbc4a81ygfxr07DW4DH4Bppg9PnN2f5w3uTl+0UokkhaL+1+K84O5zWLWtDWvIlRg4ORT2FPTD4oFJPK1NEo0x/yz902IEbgh+Ai3XbQZL9WjegZuo3dofMOamE/+3/S0dWXWWhq6V88xKJ1F18R9Y3NqIo9zHs27vi2hQ/gDsq8ZxcOFZ6LW/H0Y8OAePKt7KHqLbb5m+or3vh2LXiJ/yX2M1+FW9B71fzUSn7wdoT0EWZuktZL/pjwCHWUkf4o9Q0dlWiriENDZRdeLj1W3p7gs3rl99kd6PzZbeZ8zAHl2MwMRPm6/k2ODf/3zwRkA6v63phObXzvPyN71wcNBULF0yjQ0PDMawTvp84LkLW8dEU/SPVBy3fAHMbQjkV//Eg/+UcLqn5QUVs5fihKHm3LlPEH9qRzTgoQ3791gAjqe/QdaOIdijcimPbgyC+WE5fNQqAo6jPfGX3YohT1opNQYfN228u82C2jy9Sg6ZFrbrjsWjtvUUqWvEOtZ3PsLdmjOwYWQcC7155LptKLyi8qcaSk155qfRPNnDkDXtd2Iv03mwQv8U9xyYiJ4rs6Faxxy79i/ljcWtWGPWiTyhEz4Imk7PVzZKffT6wqbAy7wheAYL3zlpqjEdddCDaY/W5o0dPQvPO/fioWoR7DvgDtjOHcKqh9SGL17vxGq+oyC4cDBojlgGocNzsNOlf0lhfIX0Hq6E/EEpVKZnham3Y7n+13vJJf4Q+ycNJPXG9aDpHs0h7R2hxQ0H/hDfU7at8+Pd/Q3Y9YURlTTaoe2HEB7p5YMaQw5Du7gExeWXnhCX0AtmL5uDbicO8wyzejCfvD1PfbcrOWi6U/6grvSrTTIO8z8Id7dlkNuJHnDh5wv6lBQgOebGgFnpHbjWfIIKprRh9xlVpDLqMQ0820xP9x1XLF3eh0fUD+NPy+tA6ZtgnifETsZ9cR5yx/pVFLG+NdhY/IDiI2OpSX8pObqN4ZcR+TCpVSvWPfWelHqcHGKGbd20uGR3Wz5yp4q2xujxqs86vNikI++4cIP299Pl4xciQEP2YNX9i8hnoT68Pf1dmTV0Poj8/Zkzn0ndhlv6bOQASiavzv+C2ffptM3hNi1Qu5knMkZnTjXAoU3l0oOfZrzhv2P01m0sxpfuhRPf2vPb7ylclxsLHZ5rgWCGN31qw7zLhXb/bpD1vhqipqU6mm/UUZ4BV3RegqV3njRzUVvU2eaNNY9bssglBXS8JS80Hwppn0tIsICb1PWwXiWMD3XviXMXOHLErIXU5BAjC51GqATU4KQ3NfT2yRbMOBTGKX9t0HzsO8G0NaiVRNHe6HCR4any+8ZWKPiQJ+svhuST5twUnou3fCN49OqhnDplNKyp8UAbx/YYo6qJiqN6LHTCcVFquHVVAAl/IS0oiarsb4HoBLB4fYhqvXxRZESx3+ADeXtZoM30JCyY+wVuja2n65+jaeT8INYY0kPZDXk1+TVKduTqlybsoHlfYVMylv85EknCH7gxqhuvmp/PXWxVlazj8f310ocrJ2lWfk/+4jdO+HkUpmZ/oPG2IzlhoSvvehzE57omyzf3Z0Ndaby8NWYXHzy8E7wCN/LTfX244mEuKI7ukmJvjeGwSHtSdtltOYnWzDgMe+YHg+YZBa+8sV2uqVuk9BXXaldJgTa+3PfKAlwQ1wGvba2S2l4Xz8ibJoDoVtG3p/D7sxsgssDOv95STf489hm+lE2f7YDnK/3p3yhHXqdSCIu+6KPoULYz/KSQ7J1pUvgFEj0COce7o6W3Au9cvA1WF2/J+1XU+WOgCoieATEjKjs0YE0TvDNN/3/HbizeyrtTHdDYfybpfY3F49dW8WlPLzHLe1D7ZsRXI5rhcPpU3PQ0VJ6g1VVk8zWNvxiFWsdTpK9DM2DJ0fE4/qIOivvwjuldcIbZEhL5ky0/aYK3VwaLLsk3NrBmrl8DUZZFuL/2DfkXjcDZqSHSmKlG2HCzOO+58VXqmt6Bsyx30O9upmy/NRW65JzDj+/OwlErLRyYZsinRiynmDWXwMjRDZWZnjc4FehmOIvcc+rjDZhlH4nd7qSKPo/EVpfTYMR6DRQ7QL788rE053wYCe4x5X5/5V15k7p4hhh9SDHTfReXvj4i9y0OZnEW5cYlssLYnul5FAfEGtl2mdKaPS7sRM//RFbm2uCvyU5illh5hmUYjKi/CCJjeY/+LMe6sGWQY30fRZfi/L6q9Cazr9gfafDf2iBI0D4seFrGB0Pfw4TYuygyAifaHGAj7oaXZ5qz6Q1VjtwVSeLFB4JTqCp5DY5cp0ohKYG4MGSutPTHMyWj1AtbQvknLR4XtZ07muzjzFmZ8njbq5K4B8Geh+A7YBIP7nlS7Og8dnS7CW2vS6JPTPDZmAUoel25+/COZ3f8axmOsdMSQexo6tn3D4j7w4ElnbjHOge0q93ChQ9Hw8MIXczyDQftskhWJF5gu8oxPHNmrOzS2Iv/HXcH5pYcBJ+irSTfG8vlPbri4ln/UOHb35c0ux3Cat+/9Pj6WnoyNge0DhjCy4mZ/DWyK7ar3y5LT9+MKPvYU+7v94we8Q5o9yofQ4emsl76Sfp0bSgrAlfg+qnbQWVzIifE/aH/+h2DC/G5UO0xBtf6P4QXT1ryafsMyultCV65duJ1GV4t7INlF2qknkk/oFKexSoJxjhwnr3Ux9IFUtZE464UfZ78+ChMsU2URz0p4ldza2iFhiF7z9WF/Mx3uN7GgXUMEKtjdrJOx21csLETWRbkUnndU7l/uCmO7q/K57dvRfVRWzlk6UV5ckG6ZK0eB+/902i/y2kcdKAlaIXspfiJZaQX6ktNhn9hs1419wswYyvVhWTsfBZ6F7tDrMf7PDEv80IFFhpq8qVZpthj2g04FmmP7od1uI/XNer8UBW1W4TBt4+G/OnIJ/RQb4XzM9X4Q/9i2uAn8W2HXAz/3ZrnGbeHZ9lm2DS4EIpfVsPj69/5cHBvuh/+isi8Dd8Pny8ZmCVzYodhePGRH8WaLRd6bqYPwdvZZPwAzuwSCw+6TWFFSQ52+DCVJ38x/b8u2lVX+fmVxzClVxcmtVG4ZWUFbnbw5DFbF/Hq4rOSQZdKsWcO0c39cfxlsSeFuppgxagh5O28G0emDKJRT5z4hM9sXnqvQdo/oxYe18pcvTZK6S8XrJpCXo9COFizkIJ/RLLwj89+iEPt2nDFos5xdPeduly3N1R2tlNItTOKiIZdgfHJBkqeIFz3MumlW5J2/mbOdTKjLw7pcCTWi72dDXDwg0UQVLUL89cHoEdFGNp3XM/KWW7RFnnC4CA5KyhU6VGeSWfBV4k155eeopO5yexvbgXNgcngNmECCc4p9VcjDJx3BTJVjLDHSXVsDqhU3gPqouyUWvPYDo/Qae0dqu1TggMdNuKp3SB9tjjBM0OdaK3/NOW9pAG375BrdYHynnjr5E1FP5uX9MA+Ac6WTaCJjjYs2JZMRxvSjqeOfLVaF3vvfSILplG+V4Jtg1wgbsdr+JrWWTJc1g7HbxyfW/ntIC+82JXVTdZi6q1VoHpTn5dNM8ff6kVgau5KNb+XcuL3FexpkASr9o7gqRaNUL1WBx5O30P3ugTzYqub0oFP7rjnayrHXNnIccf7ULvC9ZLnRw/ctb0tvy41gSUxTHatr4HFYANO7vkvfdOMwZQwR/4zXYWUbPgcWEsjfEFaMbBIntApBLob7cPtNS9oyD/mQgOi7V16wunhc/HPcDus/NaNNoz+DmS+U8lk3tXqaAg4koxo/2T4+I2lkNk8noWH0uhfmuiXcgiz+jnjvkYVzC68IP1Wd+KFbztgWX4f1Ag4D0p+3c8WSiLrrF01kmmYPbxr9S7v/BI1dtrSAWaKZ6DosZP5U9MAbjM8hRe1iudVey9Jb4tb0JJlP6nEeiv2TVDjCZ++08+bp6my4WHeXrt9XPgzQra5ksBmjRdkwR74bT+KqjlxnNFjAGaUf5RrvSPB5dwreNl1EF8tNoD8pHOcXWgDd0INWdl3nS+HceeL9lRs0oMbTQxGtHJ8KPdYp42xHou5U1QUnmtxS1rpfZnqFzyXo0wPcptJSXzkdlfcOrMl/9fPHOOnGfHDiGgQ7KDWgVgOyjKSV/y9Jf3d8AHmvTqAu9tKKNimcSNMULObKXyw+83K3DS8j4ezlcbK3GDpNj+MnpJIiX0aQNklzqNbsl3tX1n0ExalWoPQlU4kTMeFNyrgU1M2pezS4hV/Xej63RMQlrhHrnJqy+V1M8lhSS4d3n+UNq5bjrObl+HZsnJ40reevNI1ccuGJEnkn/r6/wciNyB0hFWrVnPPpED+2WyJuz+vwdE69hhxtB8e+HlAFqxK+10G4rE9Grzu7m06PMcbdAyYi1/OkderFsvCdxBdgj8yGkiwq7h6ag+7BcShso9OBQRKs95dgnSx+0z776WMj0Og0UbXlox/5R1tmoS6bktJZ1BLEgxS8+79eSsXq+PfMavhs8YbKtHL5+xvObRlpRtWTF2E5VISBRbEQ1TtM0qzbou9yw+Acqf9fmpAwQY7+YunGSg72PNHspJrnto+Vy4a/5liWqlhxsdzLDjmcF07VnZBUw8d/nlzIM/P3E5Jp3rhkWsPQNlxEwwJ80v7Q3+5MxpodceS9ttRtUYHtc7vwlyrdGLnNSzuLxg35Rl990kqPl1w1s3VONXCn25P9gfnrmv4Fv2VP/i1xpgX9tQk7QTl2b9OJNC3clfJd0pftolOlmbd/Ca97HoG24ypINENbD1ch0UPsFu4Pm3ttA7F3Um5N86Z6tKwzwaktcGVNlsflfziH9OSLRokdqDwqYmUu2tmdCQuthqDQtPhMdmjuNl2prRr0zhMuK+O299Z0NKrw/JU/7SHDrqGUJu9Ecd9ScJ6u+OU8o87/elwFzZXeOM3pyJJx9mZ3H9epGGbQqh/fy94frxaVr/lhj+iklD7zlHxvc6Mb7JhWfFabLhwG5L1R3Fjl8VY+oIkPnMdoiJtGHYbs6NeG+Azo1D38mJ4HuYxQu/zeo66XATbuzlLNwL18XfhcIh5vRvdrYphYowWJj+7IM35HMNOlwDTlgxApyejyOinCxTp5qBahgsNc/oDD3MjOONHIl4pjpK5sCSv4qcBhMYvxl4uJVCnGUlhj7dw5Q8v/lcjXP5aZQ5Wk5Lgz67VJP4m+xX7xV3vM5ztju26aLLJiVJw1NsJ+YoPZDHbUIqetpJtC5djbcpaDnWYjBE1IVTU7bzivuiqZNlKcpx/BNIKbkjY1xESJgdR2t1SbpjYn5+5jVasDVxPz9yKaeKZvXwh0Je7/dNMFWiuvFveq+hjZFNVRQcSD8MNj1BpjdN78p/7iMqz1uHqqtt4vmcZ547Zz7fNt7P7gyxcY/iUGvZcRb9gTRa+UPri5tw3i+u4Q30Yu6o08CjvZaT+25vMo6v44a+Dst+5fXyes+WT21QZ+14j3RffQJwJbkdT4NzU3ez6uZaG7hzFUS8mcFNpgzz/XjtWWy3nebhOQqfQLFSbMpDHR45hm5bvwH5iDO+1GoJ141N54hkjNl/iDgdOpJOx63wY1e0JLDl2iI+6pFF2lz+wz1sNbco8eeO1WBiSpZqvvTgUOvzWptZlxuw/0Q2mVv6kOk1tWNNz7qVysdeFtizuBoIZGmdkzqHb30gdrLtgY7+PdKx3LWXZgeL5vhksGCJ3q9Fy2UIfbghBSXiHcDgJc9XUpZw1Uej4ZxtUwmd6M3w6JpuWSGJ+TPdsgtuRPSnzWPT/dWwKdOOYCm2lN+x1+xqVfi6QxPtYeipLcm7ZFgWv3DpTm8vz/4AFtpbt7SI4tV1rFl7AmiFvJMEKDjGz4O7/dmShsxz2+C8V6VrjUu0r0riaeLZamZZXqfkSvmYmyIITVPpf5HAZXh+0JMEKttDW42uhGnJa9AhZZIA9gqvxeVgl3C8qA/MZ/6LbhO3YVb+ezFL3UX1zO0nMBflNnnz9pi+rhdqjyYIRONSPZKfQfhj92Y03H3KDSsulAIc7KzR2boWu+kt4c9NSNrvag7r9swHHL7Ljr0mG3G6OCWRejJNnOh7A7pHb+aBKCG5uashb8PK11O9RIYns5OX2jkHB9SWVvBBqtP1GFW0SeE+bviAyl6vvvwfmqBjj9cf14LUjBxvmnqXGhx5QNnoG5iuW4dedOuCzqRinee+Tecsw9moskzb5F4HQSLKrWAN7A25Q938T4cKQKULrfijyJyvnndmiNeE4V4pKlsUzQjpnFO0E4T/3t6uBrIkOPMq6ml7fVWBtbTAutSun5yWL8JnPbUjL+Qd/VyBN8G9JD+KDofSzAy7I8cCniXpsZR+fN806nAIGafOe60aoNv8CiXwoe0A6/zGfrfX3/j/H50Zpo9EDe/o2xJ6iVR5L6k8eyTrTS6n/3CX0r4YmboqZAN96yjBrkDdsW70XEzpt4Pp3emC2WZefNmbAm95unDX3OkR+ac3XErS5tN04nuAfrMxZXt0PdW5hsod8LE5xJayAfemJGJQWz/Pv7RFzRSr+pq6Xu7TojIFqiWK2peAxu1Ky0tGga5eMWfw+Ut+uHFMYRrBMW3TqAMj1PKjo/fW3vCmmnITOpLZakjPOqaHIMg8dNQhF7+QddemFswa9JJFFwZQHbLvUhzZrrORzfsZY2u42VdRFcr8btqja/TBku4XQqxE6ypyi060CScmV8Jr2xIUidUwkq0mdmQ8V0Ktoc+6vfY+iIi8omaWlzQp8/dIO7Vd0YnEmdhu0Bl8fPMmCVbxIzdBYPIn1/dth5DATFlqTf1qDIl6zCc5XXcJxqqacebEt/j5zlu67npTczveULX8Fw7aMo6xd04cyNA/StVudsYn8cJOXPYveBx+XXNGZG7hR6w2Mu2OAX/xCWORKFvyBU8ZFFvyx2E0gOgKFx9L5lo54YEFbupwWQjpfTpHbnJ34W6OUKn88I7Ndcaxk/VhvXyxvCuHMGx1Y7A6O/LIjLzT9I635OIl6WTjwNGtNW8EYteuny3i/r8J3+BbJZwZibysVFjpA+9gf0vDo1thLfRg61Y+FsvWLMMdnB7Y/sklwYTHidwVj+pEWFFTcnWz9p5Hd6w1YZJ0HdZ1208e8aDbf9JhFL+IOj47UdNKbBDey9sYInjm4PYrcUHztexBdjOd2drctvXxG0j31hpP/2rNvgKokdift8E0ZITSXvrU8TWUHVrGt/0NpQcGMXME/2B7yJbuKJrHTOsm/m4rFfpnN+7y342vjCRjd65WcVuCMkdPTEXbHo9gloORWsEj/A+4At5k=",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9844,version:2"
}
    