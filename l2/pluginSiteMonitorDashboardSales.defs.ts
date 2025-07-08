/// <mls shortName="pluginSiteMonitorDashboardSales" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSiteMonitorDashboardSales",
    "type": "plugin",
    "group": "dashboard",
    "tags": [
      "sales",
      "analytics",
      "chart",
      "pie-chart"
    ]
  },
  "references": {
    "widgets": [
      "wc-chart-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "filter",
      "chartData",
      "autoPrepare",
      "mode"
    ],
    "statesWO": [],
    "imports": [
      "./_100554_wcChart",
      "./_100554_pluginBaseModule"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Use of innerHTML with escapeHTML for chart rendering. While escapeHTML reduces XSS risk, using innerHTML is still discouraged. Consider using safer DOM manipulation or template rendering."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Select element in header lacks explicit label or aria-label. Consider adding for better accessibility.",
      "Chart component <wc-chart-100554> may not be accessible to screen readers. Add aria-label or role as needed.",
      "No keyboard navigation or focus management for chart interactions.",
      "Color contrast appears sufficient, but verify with real data and backgrounds."
    ],
    "i18nWarnings": [
      "Option label 'mounth' should be 'month' and should be internationalized.",
      "Static strings in select and chart title/subtext are not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin de dashboard para visualização de distribuição de vendas por produto usando gráfico de pizza interativo",
    "goal": "Fornecer uma visualização clara e interativa da distribuição de vendas por produto, permitindo análise rápida de performance e tomada de decisões baseada em dados",
    "userStories": [
      {
        "story": "Como gerente de vendas, quero visualizar a distribuição de vendas por produto em um gráfico de pizza para identificar rapidamente os produtos mais vendidos",
        "derivedRequirements": [
          {
            "description": "Implementar gráfico de pizza com dados de vendas por produto",
            "done": true,
            "comment": "Implementado usando wc-chart com dados mockados"
          },
          {
            "description": "Mostrar percentual de cada produto no total de vendas",
            "done": true,
            "comment": "Configurado no tooltip do gráfico"
          }
        ]
      },
      {
        "story": "Como usuário, quero filtrar os dados de vendas por período (hoje, semana, mês, todos) para analisar tendências temporais",
        "derivedRequirements": [
          {
            "description": "Implementar dropdown de filtros de período",
            "done": true,
            "comment": "Select com opções implementado no header"
          },
          {
            "description": "Conectar filtros com atualização dos dados do gráfico",
            "done": false,
            "comment": "Filtro implementado mas não conectado com dados reais - apenas chama prepare()"
          }
        ]
      },
      {
        "story": "Como usuário, quero ver informações detalhadas ao passar o mouse sobre cada seção do gráfico para obter insights específicos",
        "derivedRequirements": [
          {
            "description": "Configurar tooltip interativo no gráfico",
            "done": true,
            "comment": "Tooltip configurado mostrando nome, valor e percentual"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar modo de visualização em tabela além do gráfico de pizza",
        "done": false,
        "comment": "Não implementado - apenas modo gráfico disponível"
      },
      {
        "description": "Implementar exportação dos dados em CSV/Excel",
        "done": false,
        "comment": "Funcionalidade não implementada"
      },
      {
        "description": "Adicionar comparação com período anterior",
        "done": false,
        "comment": "Não implementado - apenas dados do período atual"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir erro de digitação 'mounth' para 'month' na opção do select",
        "done": false,
        "comment": "Typo identificado na opção 'Last 30 days'"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar tratamento de erro quando dados não estão disponíveis",
        "done": false,
        "comment": "Não há tratamento de erro para falha no carregamento de dados"
      },
      {
        "description": "Adicionar loading state durante carregamento dos dados",
        "done": false,
        "comment": "Não há indicador visual de carregamento"
      },
      {
        "description": "Implementar responsividade para dispositivos móveis",
        "done": false,
        "comment": "Layout pode não ser otimizado para telas pequenas"
      },
      {
        "description": "Adicionar animações de transição entre mudanças de filtro",
        "done": false,
        "comment": "Mudanças de dados são instantâneas sem transições suaves"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides an interactive pie chart for visualizing product sales distribution.",
    "It allows filtering by period (today, week, month, all) and displays tooltips with product details.",
    "Feature requests include table view, CSV/Excel export, period comparison, and improved error/loading states.",
    "Known issues: typo in 'month', lack of real data connection for filters, and missing i18n for static strings."
  ],
  "embedding": "eJwdlndAT+8XxytJRiVNDZKGkChSn/ucFEVSVLbszTeFBiFKQwuVUFEk0lYS6p6DjISSPfqRsiVkZef3XH/0R326z3Pue7zOR04u7KycXJijnJycc8r1eBrY1xI2blSiz0Ov4uQe/bHA5gkuytmF7euNIVXubaVZtAW9ajsKP9Vz0CtKC7Ms+tKabocgbo45rDVIxevvPXCoXCx5XnSDsJtesJ5ZUGXvTnBYfgb++GuFU/ydoRtbR+apB4ThaQniCTdD8FvTh9YNtKHHwa7QS6EbjXfSBdP+MaR7/JdoHWQE09u92OrvBYyfKdiP38wuBr5nT94+gYfXJrI9jzpYoZIR3bTNwdAfunDWPJNVzDiNBj3c2C7FalFhWjZZPTKg4BXL7fn/CaH7/OFkzybm/doWPVqTYIZyjXhyXSR0qrjIArOPYFC5PkQfLyLjwT6suF+SKM027MRU+D7YH4dczcH5x17ilU8DoGNuMNsd8hgLv1igt/1TdowpkFasDg5wb2VFK5xolO5i8j4YzRSHPKL0F1nsj2cndF+5iSivOyksT8MZemcqK8WZXNdDQunk1Rg1NkncqdyPbLZpM9U9LtIdGHBjMbAtTeIdX2UqOZBN5+xTQCk7gJm/ucqGep1g5+JG0TGbbVQbYkuNMWfEN5oprCi3vdJEvZf0O/twbyPYPHAi3JEOm14dovalhXRNW4tOD3eHGyYluHr8fbZwq7ngoPSeLqXOIvVGQ9g1ZiP2+RhG6du+4x/PCHA220LSXCPvLIXro0JI0eAlrHygR9N2lbADnxmuPirHwocHsAT1QPx7fTdyz/G3w3ZcMECe5HfPkFlXTyBtWAyfn2TS1yML6Eyn46RTFEFz32TD73ExUNGhTvHF3tTZ0ZtqrzZjz1pzpp83gO5aT6AWO7kz8edqWHFlq3iiNeDf/WXrZjMrS1cKdbtIFtflIdTNmfoeqWPOkQPYoK0T/2X1QEEC3J92Sqh7NF2Usx6JGofnU/hXQLGuHs1T+7K2sfrUjX1D1zAPGD2fsTv1FrTUMosV6WqTdqsdjHdKRa4deQYcgN4XP7LigQnSe4GJ52Uc/OID+xV4GbkGOCBfi//uDx9Fa2FH+0DSNdZnf940ykz1VCAw6RjPkykcX/KScX/B1e8+9r64RuR5g7wz4+CMGA77C57jXFm94J+gBo4DG1CnY0jF9CM5kJv+P7AOOki5hV5wq+WTGDdhGPrfGcU6fzAT2pcOhoRwDaa5rh+j49EYMLIrZHvEs8/+W7AxxoEujTvGNhtGsVFblEl5SCTIKjJw4LBsevJ2nlgnkxfMZcFYmfeMzQydB0reNbirLB37jB5cUf1rI23UXEgGYiZ4Re2ulGvuDnvnagLPCv34e4zsdg+DA58RO/AA7omfDINSLuJXLfkzjg+HsLexBcA1xiOLQ4B3jvl4GrHtz09IOrH9+ops0TcH9vzHT0y39SD3hn1SBgSjU2NgcZUidCvUhkca5sAzjHmrDKjmOkPeLZQ8zqr4i5wBrPuZBCZpsaLaBOqrVFGayah9PajmiqLTHz36qhX+r3sXzvUT164aI3D9cVXJZDItW45JDhGM84kaR2rQnPuWsHOmOyXq7WV2L2ezE62f4fXkK8izyA5d+4of8xhdOJeFT8bHomXX2ZBjehE3rEik0tK0irPrxzOp++sedqHEwdvZn/w8iT3oxDxBrJtEbwzVaE3hd+ic9AdXLv+FXH94HFzD2MtIEjeZUK+2XaT4uATUKktxd8gcOv1VG+p7yVhFRxJN6OJDNX2XUwf2ZbZrXNjiWfPB654jgXc/kHpwpek4qtgcFg52LqPkppmsc1IonOlkjcs/P8PRBz4yfjfyPiJ/J/HPm7mM55aNiolgpQouJM02sG8RLRu1l0ImHmDjn/mh5K3C8t5iZvNYltg/men/nAwqNiaUUe+JmjXutPr7IHZfdRtIzzSdMYLgGz1A4gxnOYw834ZqP16Kj8tDhRXVh1nchFLRf3c3yHbuCes2NuKjCjmpZ4yzgP3w9OG7whxD5mtJ70KaNbX4t68Trt9+h/HMUknbdfx7P5GufMoFwzpNKFQ6iMcaH+DwlpGQ/aGZ+SfsZItsA+nvdS3g+0jodE1GA9x9pd0Dusb72L3dvsT7yedZCjva82HO/SLg2jPOdZZlcYCU5DOYVsN5zndFWNy1XNpn4p98C9w5sxZXblhDkrc5d1IlL5jFpWji74MZ9TfIzlkJ9SdsgU91uRSkdJm9PhxISaF2TGdSA7NJVCer98mM70qwe/noFN83EGsvoGBwFv5rSRR8f0dTkMsmSUfkXoPhPTW+p66L+77t/ded6pmm4N77JoW0BbGnNnb0dYotZVqvJZdX43k39GnB6lJBu/U0bZ5dyTgT2Te9H9B+ajrfJ8+lmWhe/M9/HCt4WobcX+CsRonlUrazM20p2zmR+F7mfiSyLX4lsDoziviOYcsSzzOeBdhc9ELKBTqb/a38FTiOyTsXsb0ZV7BXmwY5Ds+gpkoFtjIniEV0K8XQZZpUNvU73jDbjJHF1rBv9TdhcvFc1mjzlf3ccw1LS9vRJeuVWF1XDDvqD8PgzvWkoxXPLn6eRaHDzoMlLoURbX6470Mpjr83hY3eaUu/ag3RIXsYicoirM/bAW3GGkKh6izs0OxHLi31wi+taGHK8xLW1iWfVm95zkLKfOH5VHdmGdkV1rsQLm07D1/zx1byWSo7n+sJT0uvVvaLHUMbDt7DxxY6gvVoNVjre51t7lN4OnAs7/2vvWTe2w1GjbOhlKY20fB2T9gTuRauRTQLJpvD4KWVERsmQ7Z3zSMcYX8fh9b2ALXh46luTjlKz8yp9xQuR46FTm47sPxRZ5wWY03rZkyGquY8JnsUgF3G54m3irpD/+eP0DKgg1k9MUaHh53OXIgaBANuNDP+OXnc9Wcpubvg20RXuvHeCPYOCKSZXr/Em7M92VWt45XX3Q6wxuPHRKs9lZVG+prkvDeWnk+theq6IbD8qjat/30HPZf60Aj76RCbforpL2sVto3KZMXDtEnxNFBS6iqa/XQp1VVF0+YDayBJJ5c9MM5j7xrUYOo+V1A+9YDJm3uTg3ozBTSE0tv9LUzjlxKrWVOCLi2ToOlAGi12dyLuF31aeAF3RDOxq88sUGtWgE2/PuD+R/r0yqAbXdWypobqfDAZkYomm+VgTe8Y5LqxzNMb4MpcvX/+Rj1XpL9W3YgWTQHDI+oUWXyctQwRyOntcIpa4sZKh5bSoXfL2Ah/C0i30wOTm9Xotr0VZaaPsGVdNs5FGdSfvo5PS93ILKiGRhVEQpmhPgmuqaJ3VSCpVvcGA/meqKq2lR498GEJgfw7a345ONvY/fOU3w1DPtmJ00ZdxaNZavDj03hKV3AFqz0yaQaxo/E6U61O4z4ex3eOrTjr6ybcfHeMaO93UXjW9ydLOxYOwZ1VKPJbOtWfnki+u56w13H2LONKFNNs2SjWaXpA9rZ4sc2zF2TIL6K4bVkQEd9eWVkTJ9zUeI2zHF7gSI1B0Es1gy0U7+L6PFW4OiESenjuRcO4XNoJd7CXhRJxraBysT3bOjkN9UabQkVRFr5+H0fvgs+wH2sUYfi1oxi7+AWaxszFW+NlsCXBh73KqBczR46AzLAMWL9RDfgM7JmCEmWpd8WEQdnSLMKYSzHi0imadHP2DSZlpGLIq8qPgz/iiar9pLnCFryrvrBK/ZtM8ppnhdqbUmnChmkQZJNA7brtWCBqOHTa+h8uyj2LDc0acHhmAhYd/x/yfEo+iZ3N3jGzIFeoa9wgck7Q69tZovVqVZi5zYOdjU4E7Yv1bJ3aW1HKIfcXL+avlalAOI3UKBBbY6eQ4e1EOvdlFNjGJYumMY3Cxo/qokHGGZZf5sh1rmAmeseEmFldWMibM8jzDNxPVjJmHMUpv2JcN7j/nzrc22wOCzzMhDffl2PM4Bhy8v2JcwO8SfLu4bjVMNNrI36PTCcFTaz0MvzMzAvSsejXBQy/Kgd/cjfRH/OR2L5gLl2rKIMJPxLRdFQ7uyYLoZz6HZhi8RD5O2DJ+XCJA+LIlDYymDKNRd8OYRKjoDWNni1fyA73NEHeafyluJH98lhEP8dEkZQN92HvMXL9fLqmsF+84/OfsDzlIuldaKFvdVtRa00sDNj2g88RRiFlreg12YXPLC/jTBMvHNQktdBhYJ37Hw0MXERSjsrsInFJZZswdV8NDr9mzjU6h8uOzuI/DezxJRcyDi7CyF6KpLvci/RL7mDTtFLa2z2M1VUpAc8zcu7A+L5ESlffo4mnPO7/poh3G0y5x7tksekj2UbnGdjJTVU8aXCS6S6/iUKSHLhaT6bYZ31ZevhWtljbnyLig0/Z39Iit6k7KbilP377FY6lIb0Fp35doF03WKz3Xwq8u6x9QaPw/vkqkHzc0FcdvU7tsWN/rUjq1OmuB6lH9mO2eHceyFUYU171PWwz3kUSo/gzaBxsCdwjVjPAlXhO4firGkir/YqTnDR5p5bThul+4mmnP0KZnSKWqAQJr2/34917JuSvfEA8d8TPFJvuBwPnIBjdGgSKBmrCzG111PmIOWw1vMz3BgBnMuScOCK4lwxgVQX3hcXuVfg7YgT55MeKOj/70ZyJ3WnAthDM2nKalJLVuVddHXhmpR6JEg+cNxmBd7c5pDLrK64KuyIOSI0UZutWiJsu9AItFTt4dzYHjmy+DRXtXenIZUHMehbLbNxXAe8829NHmzUd6A1Sn7n+oKDJKPn6KDhqfJfN6Zwt3kw2hpSm1VIuYar3/H8+vojP5LvNDeflHQbjb2vJJ/AU7nbXopq74aRTWiGxgX3Qc8QQj0TOztkkdYfzh7J9jemraipbt8P0Hx+lXTBVLwJeLgsF6czcgJ7AmcOyfQ8JXcZbAO81iz8UR3xfsmFdt5PRfzqof3QKyH0cjDuDutEPt+7sYZY/+yFW4pPOGmCZ4wZtJsvY9uGvUa9LIB47u5BdNJIx0WIcBPTJgt5BncHvPz/EK0chp8Yf6nQs8bWKtpDSVUC7s48rT0SYsm1/gyjWcxwb08UYx6y/SZO1lqLqY0/af66VWdW04PqAjwzGPMH2mDhQMjsAFV2OorFlqsxZ11qWqX5G3LA4G6ZOU4ZDUzfzuyvZtx/2dMrFjAaP2IdploZw93qjsNDpmv2VxRtw6PJrtOySO/iOnygGl64mhQBfsf5hkRBjpYyRPbrAouYCsXDwLvQImwJbchdRbtdk1JC3oREJRQI1nMLyL3dEt6ILokmjMn0O7g3P3pTRqtidkBa6nca9HQ0RYjl7bflF9vxhJK4/ZMweTznEokJtSW3VVmoIT2KXt+6jgD796PDYEhwW4oMWu75jZK0L+Xevr+yydyKo9lBA64G17N1HW/bX05113/gBHzaXkIZ8Geuh7wlv+uRIWtLZ2evo9apysDifxxaF95DNvf4QD0UeE3bccRWEfmdpbpEe2Qizqdm8DK3G9aCbDar094kB7Z/vQVUeebItr03Q0SWLksbJQH3Ucab2vgkHyHcjfl7lpaQV5HjkHBb+aRauKPpgw/G/jGsLlevvwWezPOb7phiXdHKHkkmaOERnA3CNyenkDVn0qm04eqwC/K/TTbb+0CH2avYRXDsn3D7VY6Po99OBpXe8xU4XgSyVWlD7gg3c71uCIRrexKzrGf87RqI27ptETDqv1XEsci9lBqnR7FePBOTzkp6tqbAp+gI+SHxCTScjqOzWcBoUOZAMr3wRLMcWUNn5zqCs3IHjJiyE+1vqhaCmLBipuoqVp5QjZHfg6ZN3hcT213hP1YjeL1yKxu/uybwXB5Fb0Rj6uDiXVY9uECV9g71uihoLvEG7LJLFlCxls1rsyPFFONlCplhc7M1y9obTwV2hwpbXh1H6/K7fWdZx4H+i+pNeRFeV+X0jxA+jY0DS8NSLaOTPQ2uTGXwKspN8A6VoB2GleTF7mrqQ5/4yu/fkPfK+0M6oCuHkcG2K7LENIn3NmMmx6VKeYeNdb6g7pUJBQ3tJM9Dbvl3E1qE6NM9PRrpRw8UTt7XYrLg0Vm9fJ0t3KKKLYTPZU7sxIOn/6ncU99eaNt69hVXvYvEVOjNdzc40pssh2hLTmamtUoBPWr2hy/2dGFYRAHOHhJBS8E5mPdCdyvtHU5plBvd9GtdqGqmGDhPPz62gjr8b0PSDLiy33STU7BoEv0MFWJJdyBZ5/w+L32sg9xN+G+6HZ+Nvg160FsTJ2wm894QrYhhnAVjYzITVBvMYS36PVtNFEZ6dFSJxDxhb6sIF/yvCouMbWNW7rixwpyfcoeuoCm0stFoRtRdpSs8R7zw2bbsFnEHsf4tW49TqaZwP8yA7KpE1X96FvnmrqPHSTVZ9cyA+2rUVkkfG067UeDqs9IFd8B9PX/Y+YPvUfiPvMEgeviw4QcbbR9KzNzYQamZCtn8esflbrrJJN4+gmmEyLckezAL8kqT7Kh13q/NsVjN3NdN/90u96/doLJ6f2I1uxmXiDs1u4ojW2sqbDTuI9xl/P54Ftfff4qpZc2H7hdP45ds6Ukn4S7cLz+DVlAT2cl/nM8eTAzBfWADSHG4ZKZiSp0/cS7Y1/wgLyY6Azy9fYY1ND1mkbw5KvMmNW02eT8vZuPj+tPiTCLzXILFayrGZXB7zLzhGrrM/sd0bWoT+HS9lTdu88XN0DToeceQZ6Eo9xKG4SUsTOUdFxRHvWNcYOZ5BP1ihnSns1psAH8pGilecDZAzEp6uV4S1Kkl4b24ijN9vQ/xMlrJiFtmsVKEdgRaMvzM5K3fCensPkJhk4pALf64nQLcfVvS/5CyJ6RSS3ekfv66ZbSR5BWB+MjnouTkZjD2C4YUsqvLBDSP4oDGdKWjUydz6BJDPvjzwSz9AMaNOkV3fUIgy3AvyhzKYx7HOEJ6mxdSfJHP+60oZl93aV4yXb3VnBq57KrvGhP3z0vPpCDKbX4PxH5WBcwTqH1qCwxR/4u8r41ph57GhoOsSgNQwUnhglERwPgwe3DgoPk19irGOutRzc68zUv+PfDvI2kxe4ceL49jFc3ogr0CkmaVBz3+OoeHuvqQ/rhyWdKol3jOmc+eCYL5mBgxVLgTeYziamwR9K3NgyKkGDDrYZC/twRv5v4WWD19Eh/7hOGHucEjwjsWK6Tp8zzwTeT+A705wiDjIPbbBA+eHUGL7cnrTxwym8u9HnNGi5scIsM0gCHJ0go6/P3mnvWn6ADva/8FQyhjD9HbGmYdSJ9K2M9gT/5N0XT6jxIObPu/wZguh4Yq7mHd1GNZO2w4PEudBl5FWdH5inMh3FEhZqtMpYvVprXjrV51QnXuL6lp2wMTvN5jiLRe6/O0Um7WTf1co0xH3dU/AjKCvWJdhy/SeJQtFxYco/MteUlrdE9ZbuYJi1DuoUAulFN1y5nHxEPEfiIsIAdnBziS3pRrtyp+yVyfy8YrrQNgc3Sz6zItim42S4eg9BcqvWgtHVs6ksLiNbJnTUkwzeiMsfdgVt/VOhLcxJcwxfyzkPdiJVZPH0o61JzF4UDGLDDnN+DyVJhde4l6DSazboFb21HkZvBv1CX2+BdGfRj/aH7Cc9q3xoRkfJ4JNSBi9fHkNj3eyglR7DSy2sqDHrAwWtNSi1ws59Ekyo7bkj7KWu8ps/SYjql0Rg0tmROA5rwrmb3efBe1sEx1y7aGqbyqt27ALr+5V41zLlyUlbYMFJ/sw6T3GtW6l1NMJsOVuNf0OTqbgHwkytyM3MfNxJHVcVoTf31LR+GwtU/9vH8kqNjGvF2GiR/sYWtK9AArmlJD+iwNC44cG9u7hIYoYeJuV/E2BZwsG0bPiTpTQz5kMl9uA4fIylLN+L8w9Hkm+HfJY3vUeU+dG1070Et++/yvYdhxEF/kmscw7hS3qoo5fJ6nQphEf2M7AMfQz3h/npc0SqpT8oMG2BxwVJ4C2mopoW1pTUVofxg7bFlBdxskKyY+TRzRgO4XDl+tK5KljTJcvaWOTaqGoYTwHnOb9ErjOjGsnrLMUhUPWSSDpwT1i/DzQuegEDrkVTD78Nuvd3Jmc/94S9uidZ6vfbsYNYTKa1dOI9iX0wgur40D/RV+48DGRulo8Ecu7ThPlajNZyJ8cFhB/DyMHz6fEYE8KMynEw/qBFGSRRVO81tFCe2twMdhL934Go+t7NTAr7kr39wyH4fOnQez+/uTjfJ25fcoTzn+IgE0j/OHb5KPMaawiDhhmSGNK3uH+c+ew/ZYRfJEbALnTY3HZ7AyZ+9G5zLyE76T4PvDf0Gx0XRVLuslGrPZ1OP58MA57N0dBQI4KWd7dIf62kLHQA/GiVsAkdCqcTJPGncSaHxfFtYfDKEY/g3TU01nLlK04VaZC80foitvvfWcqugaQ75NN9rfMxNCRm4RpogZ7l3CVdfw4AjscdzPuLf3dZC/rZeQJzY+6gQaksODGqTQ2I4ONn+YL6q39MF91AvJMQdZQRSytl8OwT92gsFAL/L3CqYvpJfhQoE8dllPg9tF1/2Y4qzDFvvyuOfq+mI5H721l3TW3QsS6QbwHE6DnClUa/cuOwcw7Uj4rT8+eipaV91HKRI8rtpQ3U5uFPP+N3q+24+k8S/JJysGkXqpU5q0pfhxyDJ41HYbz/Uyh6mAmrWVroONyJARuXwT4uxA1/MsxrbI323FWVcb69+Z8qPnHjdctL8S5ez2I34d+CvuhdoUyJe9KgUcHv7IRC59hz/rHUtdOvRoxjHt5T5y1szclrX/MhhcVi7NGO8FBLQ8YrrFZKOg5AzTXjCZDfR94NaKUwtYokrx+pOgfZQUN+33Ao/0CjvlzifnZXmVmTQMFrXPmdANUqc/Kc8Kv7ZukPqCWShhe+eUF0UM3UFZpN4DPilQ1uZp61s+hc4rNonNaJ9hgs1Acc+0w2S5ug+UFCnSiy3h22TkRd2kP4M/EUU1hK/LOw70Uc54BW9JZt4IONmfC4YhOKPVkT90KSvDbT0vaAvDQYmvQ06mCT0MZFeTHYLROhBi18RJTDsw/NXSWFUYP/SmobP6PDVWZjs2jGzDBz4DOGsazdttFIJ1xLc0A5PUVaYxbH3ROi6AD83UrXCbaET9T/O+ZG3Fmsk19oojPiz/6a0Doge7Ee8r+DLosSN7uqXvDdjhqMdNLnys5e6BwkBrErtzKGsqjGNcQC/KV+ftdgRWDY8kxv5pCNluyiIGTeSYrGO8gu5ucLr56PYNOHTWiqCHvWPcNXuKZ66Y04pgAk9+kSznG2tfyDn3s+sLMz//DwNx0fN2yhGvuiEK/Htjr9jqWo6QD1gP1eYdUiUqbSTXNGLJqAqHJsU6UGMD7CVeKQyQv0F7RFfpXPeT74KXI+qdJPKYdpnOpZ0sKG/WtDzxxOIcBOdtlll1KpP5R44dZzHVVVykHYH/Kn40ubsJ0/4k8a4p8N60C6rBnTxv3QrpxO+N7S/g4xAqcj28QU/s8EoIeuTLXrFM40cUCzmUmkeqycPItzRNMLiyl5MvnqXzaEHiQWsW23B1LkdU9yV6xBs0WlCLvKSmPjoXzyhuJ3+3ga13COT5U8p4mfveEW+eywPP3SuT7Rox0iYPDy92xpXUtPJ2XSRKDp9jJkUzprtBDe6ds/dMPeC/lKNuzTI/xPqNuSDt6jr8gzF7Qy4EzkvHO4blMdZqoEcOiajKwXghn9auM4eeDy+gfdQxf7H0pTFnZj1g3f9qvkoaRIXbEzxR4t/51mrMbOH8ldoD70cbKd0f/cY1WvVos7T780/ie/R+bs8bl",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9776,version:2"
}
    