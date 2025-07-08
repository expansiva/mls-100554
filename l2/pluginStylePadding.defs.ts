/// <mls shortName="pluginStylePadding" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStylePadding",
    "type": "plugin",
    "group": "other",
    "tags": [
      "padding*"
    ]
  },
  "references": {
    "widgets": [
      "collab-ds-input-range-100554",
      "collab-ds-input-select-color"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "state.paddingLeft",
      "state.paddingRight",
      "state.paddingTop",
      "state.paddingBottom",
      "state.lessCSS",
      "state.lessCSS.lessAST",
      "state.lessCSS.lessAST.ast",
      "state.lessCSS.lessAST.toCamelCaseProperty",
      "state.lessCSS.selector"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_stateLitElement",
      "./_100554_collabDecorators",
      "./_100554_collabState",
      "./_100554_collabLitElement",
      "./_100554_lessCSS",
      "./_100554_collabDsInputSelectColor",
      "./_100554_collabDsInputRange",
      "./_100554_collabIcons"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Dynamic creation of CSSStyleSheet and insertRule in findCSSRuleInIframe may expose to CSS injection if ruleSelector or property values are not sanitized. However, current usage appears controlled."
    ],
    "unusedImports": [
      "propertyDataSource",
      "collab_lock",
      "collab_lock_open",
      "collab_padding_bottom",
      "collab_padding_top",
      "collab_padding_left",
      "collab_padding_right"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Checkbox uses label for accessibility, but no explicit aria-* attributes found.",
      "Icons use <i> tags with data-tooltip, but may lack screen reader support.",
      "Keyboard navigation is partially supported via input elements.",
      "No tabindex or focus management for gallery boxes; consider adding for better accessibility."
    ],
    "i18nWarnings": [
      "Tooltip strings for icons (data-tooltip) are translated.",
      "All visible strings are internationalized via message_en/message_pt.",
      "No untranslated UI strings found."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin para ajuste visual de paddings em elementos CSS, com interface intuitiva, suporte a múltiplas unidades de medida e integração ao sistema Collab.codes. Permite bloqueio/desbloqueio de paddings e seleção rápida via galeria de presets.",
    "goal": "Facilitar o ajuste preciso de espaçamentos internos (padding) em elementos de interface, promovendo consistência visual e produtividade para desenvolvedores.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero ajustar facilmente o padding de um elemento para garantir espaçamento consistente.",
        "derivedRequirements": [
          {
            "description": "Permitir ajuste individual de padding-top, padding-right, padding-bottom e padding-left.",
            "done": true,
            "comment": "Implementado via collab-ds-input-range-100554 para cada direção."
          },
          {
            "description": "Permitir bloqueio para que todos os paddings sejam iguais.",
            "done": true,
            "comment": "Checkbox de lock implementado, sincroniza valores."
          }
        ]
      },
      {
        "story": "Como usuário, quero presets de padding para aplicar rapidamente configurações comuns.",
        "derivedRequirements": [
          {
            "description": "Exibir galeria de presets visuais de padding.",
            "done": true,
            "comment": "Galeria implementada com clique para aplicar preset."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a mais unidades de medida (%, cm, etc).",
        "done": false,
        "comment": "Atualmente suporta px, em, rem, vh, vw, vmin, vmax, ex, ch, auto."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade dos controles e galeria.",
        "done": false,
        "comment": "Faltam atributos aria e navegação por teclado na galeria."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides an intuitive UI for adjusting CSS paddings, supporting multiple units and preset gallery for quick selection.",
    "Its goal is to help developers achieve consistent element spacing efficiently, with lock/unlock for uniform paddings and direct state integration.",
    "All visible strings are internationalized, and accessibility is partially addressed but could be improved, especially for gallery navigation.",
    "Future enhancements include adding more units and improving accessibility for a broader user base."
  ],
  "embedding": "eJwdV3dcTn0UTyIjSlRKZURKKUnUc89JlBmJFFGiosgOldmQlmiIjKIIkZVV3XOSEtkzZJPx2hkhxPt7/PF8ut2ezj3nu87vqqhEnlJRiXRSUVFxeds/ki9f6QUxg/6A26B48Ok5kdUrbNiuZTL8HbuNIp/3kRp7NmEppZ58jAfxk8vHYOvgXOqsdga7dTXBtetO/vu7YUU8Vc5zRi33GjC63o7DJiTg/UUa3Lepm1Qx3Y/vzTOgw0krQTXKnCRvY+45qjWbdNTgb78uYk3UcOinO4K1vOeX7NzXhd9NzsfjG625d3osdA+pL/mz+Af5L78PB6xsKLOZBmb2cMb17IJTZ07FlVXGbLU7Eqe0i4WOp+eicZv7NLlhEz8ofgfnKxrkst6SPMqqDd20ewDXG7Q51Pm0w9JjXvT9tRE6FzVTeP8YyT38H8msPoSX5Zqh/LYvjl2ZzW5jUjHvmBqL51Lw9UfUZNsHqPA4ovgYtR1cJ9yHe/O2YOrheGlygx6+DghFx3gLPrvhHXWYU0RP5eawLjENJ9dF4je1AC4YsQTejB3C42JSoLp3GlX66qCoJUve2TDfwRf29Q4k8zmaPKxpHg46mIODThaxf6gLv3VJ4Pmts3CUVTL3SisCk4k/peXnrnPH9S0x5PwG3h7ckUfDRvp8uAC8X26DN8OtuPZBIp7ulAw5+TcBt9Rwy9sF/GtoCLk8tEKz+PH8blwaWF/Mp4ZeNWxVZMU3HEO5fMB22KP+QW6p9h70d+ejkl/zJbulJukT6NiRRax/6zXE2a3ndo4W6DaoBWZ0/0Y2j3bhvm8aWNZ/HEdqL+CubffyAcMYwWUV+3VXIck9jgdfsKVnr8+KmuYs+qPPm9eSFDcFUq+dohkpJtBkuh6/DSyTHh/J5ZHSCHmKDUhPz2TBN7VaOV4RRe7+azF8eSFbXzSX93fqj6IfPjjIUmof3yg5lV1F62MJ4Nq3L8/7mCj59LxL4wqmAD3bCv/6HJPKLzregpzIWDKsPiEPN7sCQrt8rflVOe/rQu7Xpi9p/M6lsXHHuWqxqpS7KU+KaZLCf53TQWDtsJ7P0IuO4+la4wCO+r4f67JspP/sjkqdDidLh+wzSqoyHDjvbF+ynxYsv48cJwt/QOu2Y2Go8SzSvzWT39i0RdvOU2lsyijQ2zYECzP8eZpTGjav9uMtvq+gpEjF0XwVktONRlp/dSEI/VFqzW053+A1bTHVoriezYnrN+K2IFfOWvtV/jvJFiNy7lNGp8dkdD2VN31XRcNLnfmAzydZaAKsH96RNZopyPixAde2rYMJL65ShYcN/gm4AFd+vwGhebQ6pIdDX2mz+a6XtC6nryQ8DM2z44H0v6DAp+TetHbkMKaEnM6/lDsW3QHRq7wt6CIM3MVYOKW14NAQLU5O41FDDsAwDQKhDXR5eBCci2LBP/YzvBmohwnBg+SXFlchwa8Xq23YBRaRiRwWe55XW7tj9oJD2La5OhYG5cKYFWPpc3EF9T5dWSLwlm1eyTRE9S7PtW4AzW6boYveKXJc1QE/bdjC4fs+U5O5VnDAZwHMM7pIH/J+kcgPha/CgwMy58ChGdWSV5kpigwBbcUafnanI/GfAzzFb7nc0Mubt453p3mm/rzr6Xd5q0W07FQ2Bie2aoCjMcfot3+j9OyJNU54YI8n83vxk9sX6eSOdJ6xWUEiW4RXM2jmXi02i78Fk1qfpdZd/pJmN30MnNECfXR68crrdrKYS67/z53TzpkhBqgCv0pW+hfGLFLAVlcHbP1EizdZTSKRaTj4aHvU+NKa+U9vWS/9oDRMx0PJN0562Ax1ZqbzFLMeEOvqzy0vZ3DdmlQQeUDLs2NANdGJxPchObYLC71QydUuvCsngSarHoJV789RvsFMPjRvtvDkWvCoqvuXgeKaVps6YJanEWHqYH4d8IUEh7L9rL+yUp/vwyRMv7cTow2rOdErHb9+CsLAFWYg7kuz7pcrM5L29f9FZ/3V2X7iWKycYYkvNBkHGLbgHx800edPAn1IHw0iG//lnmpiGRjkqolcX8uw+LC88XMKmfutwdMjLlOnV4FyqUEZKetceQOg2W8Y3M+6Jw+ty5fbzQ7hHcvSJa+T65UalYqfuuHPjvuVHAt8j9Ovfogav7uhyAMgLR/u7zaHiygPyp1OoNA5bnNoLbjYB05pmjzruTeqXxqOX0tSUCXSB1xu6TkIXXKsUW7xitpaCDo+irtCMGnYLqWPUZ35tUmz0pVV2Vzg5MdqK9QcXbuo8e3A19BfbyM8f5OuxBI+hsfLYkdi937ZKLSEyt13bk9QSciN/firH6PQarHYB7x2x3QMKg2gB4c94e7cy3D9bUtQ6lJkWPFI6bwy3/mQvQ4PgFNC90P4lX5XZT6T2HMUeV8fTIdtRtEDJXq1dwyY1Zu2jr9GipBRtOfaRh500p6X8nsQ2pZq0pfQkIsqJDJLvh04E0T+wNp1AyjjvTGdjS5FJQdPbrsqfeD4YXoyZk05Btsckkg5y/u53REW9+H/7Gz5erdpVFxgTlXjNoNOk3IM67MQz3r/kMd1F3VCSqB53nWqy2mDG1w20G7tJux3/R10f/wB5PR4qfunPlgWd5raJIwEt+Bu7N/wmiLM29PDgd1I9UgmqT75CtmpZngZP0m+he5sGmvN8Wdz4NGDKMWuldG86sgFMLTvxDW3mzsefzWKLuUvxPDbhYr2c5xh64SZ+D5CCwI2ngdRhyxnmvGufjFc9X6JtPPsKiloXCWt6BCC7s1UYWBUB2KvWpiCc8H7r53YlbXw9DOw5cIE+VfEKen5tiUKs61vpLqcZLJPqoExhTnYYvARehzUmeb29sWGmyu5+2FtviQfo1dnvlD1uX0YNCKQxAfTxo+HhEldOCO0juYOV5E7Z3pyYb9CeXbKCuy0yxDDMjbg8GXDwTo1j6TKTPC6MoHPlRqwb1ttvjzmqKKn+my8v9+E9f7bAW4LYnivTRbodZlCw1ebl3yLXQPvjK5SY+Z9OUQvl/6bdhN+JUVh+1WxMMTHkjPupvHRqj58vO4ANvG8Q6e+lMsP06I5sNdwdrAxwJC2p7nevFJWOT2RPbIiaHKfDqjxp4CbGfTDaXMv0V+TCNqr+5MGzljAGbF9oXGqMRi3sadVFRowe/MUtt3RhPvdLeU9SQ+4q+UtyWOuEW2degFUbhqg6boUilnVgg/7ZcDivFv8NXsPLmmiS542P0pGXxwM29u/UM6B0r56EjVggAqxX+1BqeRvgmQae4i3VLyRz2zMYreeqxUHBmSCUhPjOjGsy3Hg3S13wMGLG2FlRDKa3tVUxF+NZluXMvJ+H4ojOu7FcS1/yW/qr8Pxhrbs/rsL+cpHWPSOAk+wyV7FL1078uofAWK2pei5cYscfnkstV/VTOpbnMv+qq7ccXlnbDchHmsNSnjoqxFwpNt8emzaBGcteOpw52NPGn2xnBYftCOrr0N460INLNIcCVE15xRW7nEYMXEeZ30djt3KbkhGQWEUf7Yr93Bpx+9M+2CgbT7EnFfn+5ufSr75HyF/2TYOXTGB9MwHop7UhGcOjiWl1oc+CpZzNNbwsvorFHM+jv3ujcaudnbCBwukQZvGYN2z/cXnt2WSwBjj9VVR4EJVLbbgd/1YXNTOy+Hl4AHMwXlwSMNO0irZi4k3fxUH9qqiwf2swWDgUpnKn9PytIM8K2YnZK96Cek/O/DAi+3JaP5dCr/dl6waTflLK3M0mj+R73VZI9W2CJcfXRiIdv0iYaO+DUQv6cnHpmuB8Aefj6qX9w+biAfnVaPgAb3HbaR1mRPZxLcQ2lq3LtE6Mky+n1uuyJX8UcxMKfGZKA8YxheX6qLQIo4MaYHP52yR1+0z4B8Bauj08yOJXviT3Vp54RADtu37B548WcofIUSpDzwzKhvf1I/FXoMs0HFABs1aWq70DPxnvvGfP70ql9CUMX1Q8ITdztti9JyzJY/nq8DvX8vo+KO3kPU2iNVqMnDs5khoa3SehPc46tleocfpZKx2B2IznHFE1wQWHqLz6QOo4PkAbD6nA6/5pKbMCP5VHckWjxJB4Iv7h92l0JpMVs4g+mXFMn108zvN602WoNCXYoAK4E1bSxbYUMXpSI6eMxRE5vFm+9HyF98EFrhIjz0fkj4zzLjWgjfNbse5Xs2wSOwtkX9sN5tp6vS3St8rs0K2qM5n63gX3vsqC6WjXjDY4gppvHujULngAJ7OJbSluoAE9/T9bHccoXmObcJXy8KX1Kydh3QyuQ2IrEMHmy3iPaI9qxSFgfazHlyh2hk9DklgFPSdnDT6wo3kEJxsfAO09s6QhV/opm0Bil5gn2Yn3FJtiXSxEhrXL0Wrt4GgtuIWHD3xQf5+tZmjmAmvzb2KPyaZQN21mfwp8D+KmPiRms/ZAC9dM4VfdSEjdD5+aZUvWZolSpNfdiDxXXyZocfNWiwk2007St4muLPBJCM+pKPLg7u9p/TDGTRqgAvuCvDDm5/bkF2AD+ozgulyN5wW1puvRbajxA/ZPPnlBkm2mvFPs19+vER9rWwSz4Hwx+mUU5yn9B8ePTUGsxrNwanpWExx1KfZKY3cfskuaeTxOFzwJAzx+TEoS8kFrztF8GnOCEX1tdYid3diL+uZkpILseM4rM9n6lseA+I+B2zfR4kvmJu1u0nCQ3TGmZVaUWKIaa6hkOZrp8wm7PJVF+NiY7C2nTf5tk2DrvEZKDvtxaiaYTjYwo2P+VhL8frRuEZSQwczB7jZ6yLsO1oDyWr3MNfF+d9OHBtXivbRP0CZ5daraktUP/fHyAlJYh8eIu9xumxxaTjnlK9hpR4y1qVDSLMngv9hjs9qOnGpHPsvh79mnCXhrRLxu+SxexIODD9KAcnB/7w8IeQk6J/Nhle37WCUVQCJ3YjTItfJ3DOO7+nl4XVVNwyERBC5qmhmosPa1wJA7FHljqWEgY1SJ6NKuc4nEt8XlZMN6+K9rD48b3QTyvo9j8fv2VjS9MA5+jvBh82CvsDGwD2c3Wkua6fNhrMBXbAifz/GT5/OhcPXKXZUP6MXiYGoH30Fq83Pcf9YW8LFOlhonkKuzdW57EgJhW7Ow/Wew0B8H2Pi2oG5FMsphadp8lsL2HS6K7salsKjdgbYTvcr/XKagzfcx1P0CB1e9H6iuL5VvHRvMx4/phGO1ao5Tu/ZFwIvDMDyEGvS0SuAfhcdueHMV9CYkA2nxjuxUcwaStUEXv08iTv36wcdXcbR5Qez6I/+E+nJ3ZW0xGMLjHx0mo/VrubA18exV9dgdt5iifsNDuPFOwnsPwdxb7dTvH5RJaxfNIQXjvOXDMpGQu6kXGh6aQiW6rogDc1UJFfosWWwBTZdd55n90/jg9o5VOarjmIe6uuwnjov7MOVLrmwsv1enmNYL40I0WLRM4g+YMWmQ3TF4JVs/O2keN+bCZt9MsEnaBeudvtG1e218NbbC1zy5DYm17hxxx7j0VinP2xQP8A3L43iZ2YtS3+eVJOtl9yE2iML4F7WYezZKoJeplvgIo0JnO09C8ePWQEdA67R+5g2UB1UIRmfVuWLgxZRYStt/qM/ladpOZN67TFurZ9LKVPWoeWI3mRmGIev6vJ47yDmPVdaw9SsVE7f11d5nz99OITTtCokC6eXlLJiLc5JX4vOy6y4ykiHrQcZU6ldOTbPs6e+c13w5H/T+ZKHKoTU6LHLh8dgemk5u0qg1JS0rTQU5J4GNHHYXBT6AzuzYlJ1v0zLfhdJZsPrYeje8bKoC+9jksE2LInn1wfxBx3kYnHWiZhWTr9XzpTeqmeQ3Zem4PUmFGLnfJUD1sqSwArKfONA9IuCF7ziMJ2TzHL4dY4H31Bk0bbIMC7VPSNtDw8mw8B4CFMbTk3DtbHppcoipX71o93EM+5SkZaFosthS1qxyRpdX8VT2IvzYFQkYZfUg1x3+KhSp1T9tR0bLj0l+TbclAP2O4DmshXSh9MtUTmn9dRtAovBmOTrhaMi7GGCWR0cTwqB/OyTtG17vbTe8xz4NnhAXaodCz/gtu2Lccb0g8U7qv0xJd2Z+9wcLeV12AT7f9lwvbPIAVFraIKXtOPEc574OwoSVtfSMoWdNGpSCQiOSMbr1Em9LQh9kZW+t/TocyfsTVP4wRITro2NgdXW4bDjRCA15H2D6zZewhckJZe4M6/egNaDsvnNn8vQSX0dDZl1l5Q4P+89i6u/psINhRG7FO+TL35Tp/pmneHqxsf40cOBlHqJiUuFf70JHywPPwIR0wZT288bODBDFdt/nIEulj7YQtVW9F4uPNEVz+9uhNz1ExzSGlbLtmGt0c9PR1LqVXiDhH45L3ikdHz0PO4/47gc7JgDz0IX89M3GtDvDaHZo1Ycsb1UeLy0uOyaPXqarOfLv4JZ2a/LBz/cvSAV9XNGcejSnpjkeFc29U870cTmqtwsiAAG6MvdXHeSz4r7Shx5x9epeLxrE8q+FgVx2ZFiXibXxoFwt2sRlY86Ar73PCXhG15RbYF8d5jQ5Wg2n9SUC8L2Kf3Plc1348KUKZJNuwvyi1H/kb9+Ip97nCkHq/RQ4v1PY+chnT3iOyrIZwxaZk3Frlf3yYkqDzjpTXfUn70JTN8upc1owH3HnKXgzib/PDd5ykP5VnU6W9lPoKabtFA29mDLlf4kcozN8+ax8AotsvAE06gUWeBKSi1lharjyU8FQmNFdMTzj/QzIl6KsGyDYWpVsv5sPbrE7+TcsZMZN7Tn0u9DaFd9puxi+YBS0ivA+eo0adrPJDaZ1ZU85y6TBCYoMoC6HC6gn5nNebn3UTnwmArfWR/PU2oNcfDCV/Bu8nDWTfQFpb+H2O2ESc8C2enbBzxaGA5NtMeCv9tAEHkNZsMXc4RrEufOr4Gz0cZ44XkD/QhaCn3HDOWL3+Jwubcthuh1wEs6ayB+aBCpHPdiUbukIrE38k5t1DaLhrCr2qz8HNP8QsI7OHmgHz/ukynPWbROCthfzL+zXnHyrs04oMIa83q50em2dii8wau1fsLT8WFihyyC2timfHOdOwY9NeWR+WtZ4Mfzb7+WI1xbg8hb+tGoidmK2TD/ZAgvD7ehd0NSRfa3ZO/YN2TwuMrho0cxbNnSAcXekwYWfZZbZZmz2JOwdth2/NPUnBdOzsf59a/+eU3sFvY00VTuLEwpHERrZ2TBtS/eoJz7j/0jkW32/Hp2tnT4wCYSPqLACyclkTVKPHlk4joU+udL2XP5/s999KtexXF05glo+7kDv7reU768MJLUqjUk33vVJHYBcPF5sl7iwaXlWso5+NPVI/xx4UlKvGiq9B+suTCXR98upOHOrvhgQg/lTkfd/MnU1HsDvSm7Lm1epssv85+RoakG7/cfwYnFDYrzz1s7jtm+HY31zshTnKxl87UhMNkzDAPfVoBvzR/F4tSDUudJnRTeSwzZ/e9l2OY0A5vHdpBGfG3FuSk96WGBGYfrnJDHmvTEl6dzaH1VIh49XCsvslHhG9X7Ja1lmmzl9Qf2nzHmSfY7+Fn9K1hzZBY/eLOL3J+MgRl1xmzy9DaNwQuS/eVR2Ce7T9HH6wNxU/E+qXJpTxpU+o46nArFuNAPFD4xmUovDKAOjz5RRJHMCxK24+LDBVA5wB32kCaPPNG2tOJODr7KNaFLgsvgRaY0SrGRh82PAYtbRrCi7ALV3n4NnzKN+Wb4EbJtqsB9qp3Iw3QyGqYDif5AWnyAKjve4MxlVvae56fSOfmO5Dk3ucSwQ0rxcqMhOFDxQjLydELboalS+dEqKDZaziuf7+SwjQmKvjuTFLr+DaRruotuhttw4dVpfNmsTjbQtEOdwB3Er+2woZU2rf7UBvuwFWbcvEz+QcA+P5ZDmdspfJ+ynjvus2CbVYWc+TsKH2ncUdaFAmdXzo7vqKwJOa0a2HnwInbzqSIoWk0Ca3hYsJcEptghJpu1DefC/JebwWNIjahNYLCgFa6q7CGbOFvi26R+/K1WDU9rOXNo8FLuveEnfKlxQ+/CBei5zx83fjdF1RWxoof9NLFuDm/+OQnM97+mliMv8VShmSzVWbzicZVU8viv9OJvFldPWcd+XW34ecQ8uDTjHWWd3QCDp33m3Eu/wbC+HSu+RfK2F2lSZHMv6WPhIN668hme21YjP3p/lyq+dS5W2z4ALrfezOFhrWll01wMF+eh88Lv0W4t+KFFNSv7nH5gGAQV5rL2k468TZw/gr/cwJJmkSz4YqW25k0NUfLOT8a3xFW790D37la0fthJ+qBJXH5jKK8X/u89sQf+OrBJVv19ROEndtO4s5b451Z3tClviV6zZ8CgaD1Rd5yk9mwdzzx+G0IaW/AfraXSR1sdmBOVglumtS72nNtGftZhBgvu+PfahXh9TKNUsfgSvE/RZMPCEvrtbkR2rzdCSkuJxRzQ9VEubZ+5BcwuvCq+NncZvZC+wMyIKIhO9EWhK3B/chV8n0Sib81KWF/VigPfOtPknztBXm0p/ODFV96Esvnat7AmbTbvlQDE/Bg6Yjm7VHUD5XOj3eKp66nu+LHDJjLWc8HZj1qB0jfpc8/QU9tArhnsgvPPbQXvDANMK3CCpQ82lMTbfQZ7627QZkENRAZb0LO7KYgnfKWiyeF0dFFbqltUSTeqLdgvMJ6/58VjVJU36I+2wUHRmzC79i29jo/ktIIybD2mJ3e6XkRTctVYmQMNQ1+R0BMKvFCZET2Gx0ka46O5UZxn9Q+twdxDeVCWqiunvgFK2rIMqgY1Z+XzTfKiHASn0qZOKrzWZxW/MN7GcePng/AsJk0xxc4156Cg+2iBfxKmJQ/GL1J3vKdWxRqfLbnDowUon4tBC61QfFYfRAVruqHSE5P7Rwh8n1DFhgvyuMA7cKbIhIck7mYTlWpoo9ucB/cwkr2vfxTXa+hCZTIkrthFA/9o8sRjHTHZpSnHDdgM+rMP0a4lavQ4LZZnrDuviNofze7TTLhRO4cvi318ag7y5x+j2E/1qCRqwy05XjEp/Ytct2iIZPtc4rUBUfChjhX/DTGnGXXZILSBP3Y+VWTY7cSE7/X/vCK0iK/VDyiKln6Tlyw8LM9vugB/9nxN+2sNqXrF2uKxavnyFnoEyhkOzbpbsq65umKrXyD2a6HD2/M+YuDozRRhkOrgVNb+n77FTwwq7AYt9gzlnCsm2LPFc0W/SqaNunm00HUnioySRN8o5oEQQ3XI/N1EVmbDxeB0aUxkDnTrfJOvzu+mrC0lLWuUnZtvB5El8hS/A8o94DBLipXE/+LVgjBU6r3NzYNKbrh0f7HI0RLq/KMSujmO5c33feBw3RpJmXdn73meCLXMg+M6c4QWlqBGyh06lHAbhO95aO9/HJbcezECO9muw7Z3W/LZBg+60KSWbnfR5sdXJmG6OCdt9Xuu9CbaXegoPE+cL97dZoXdk12/O1JacrlU2kYTS/40Qp/sw/B16w1YKd5DPZOT6HYpYI/h6qxxyBN/u2dJjTad8aE4Bwie/mm4qPNOuCfO98qZ7bW6K/OB8yY0x6VLB/Lm7XGC9xF4+2EJj1f3hUU2kfBf4B4UHIGjUVuxO2wwxDAOhFdA7BYefs1Gmank6B3AK7p1AbFH0CspkF4YG5LIL67+XcSu30vt53XXJYEz3Iksk4S2ueXMkXTqqjbmTViDyt6PeczEYwuDsGVBDtsFV3CKeD9y+NSDhf+EhrJw7OnrpOT59kAtFr4idTMDEjpW7hnx3mPNmrf90SlHh0Mm+mC+0yYckWZHWwe3YcEPDBvbDP5++uWg67yMjRaV0v/nqpJs",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9788,version:2"
}
    