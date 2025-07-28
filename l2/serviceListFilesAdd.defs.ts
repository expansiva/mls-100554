/// <mls shortName="serviceListFilesAdd" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceListFilesAdd",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "file-management",
      "plugin",
      "collab.codes"
    ]
  },
  "references": {
    "widgets": [
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "l2.addFile.shortName",
      "l2.addFile.project"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_utilsLit",
      "./_100554_serviceBase",
      "./_100554_collabLitElement",
      "./_100554_pluginNewFileBase",
      "./_100554_collabDecorators",
      "./_100554_collabState",
      "./_100554_libCommom"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of innerHTML via htmlText in options (potential XSS risk if not sanitized).",
      "Dynamic import of plugin modules (ensure plugin code is trusted)."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "No explicit aria-* attributes found; consider adding for better accessibility.",
      "Inputs and buttons are present, but no tabindex or keyboard navigation enhancements.",
      "Error messages are shown in <span>, but not linked to input via aria-describedby.",
      "Contrast and font sizes are generally good due to LESS variables."
    ],
    "i18nWarnings": [
      "String 'Loading...' in renderTemplates() is not internationalized.",
      "Some error messages and template labels are i18n, but not all dynamic content."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Widget para adicionar novos arquivos a um projeto Collab.codes, permitindo ao usuário escolher o projeto, nome do arquivo e modelo (template) de plugin. Utiliza LitElement e integrações Collab.codes para manipulação de estado global e eventos.",
    "goal": "Facilitar a criação de novos arquivos baseados em templates/plugins, garantindo nomes válidos e integração com o fluxo do projeto.",
    "userStories": [
      {
        "story": "Como usuário, quero adicionar um novo arquivo ao meu projeto selecionando um template, para acelerar a criação de funcionalidades.",
        "derivedRequirements": [
          {
            "description": "Permitir seleção de projeto e template/plugin."
          },
          {
            "description": "Validar nome do arquivo conforme regras do sistema."
          },
          {
            "description": "Exibir mensagens de erro amigáveis e internacionalizadas."
          },
          {
            "description": "Atualizar o estado global ao criar novo arquivo."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a seleção de múltiplos templates/plugins.",
        "done": false,
        "comment": "Não implementado; atualmente só permite um template por vez."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Mensagem de erro não aparece corretamente se o nome do arquivo for inválido.",
        "done": true,
        "comment": "Mensagem de erro é exibida via this.error e span."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Internacionalizar todas as mensagens, incluindo 'Loading...'.",
        "done": false,
        "comment": "Nem todas as mensagens estão internacionalizadas."
      }
    ]
  },
  "textToEmbedding": [
    "This widget enables users to add new files to a Collab.codes project by selecting a template/plugin and entering a valid file name. It validates input, updates global state, and fires events for integration.",
    "The main goal is to streamline file creation with template support, ensuring naming rules and user feedback. It uses LitElement and Collab.codes state/events.",
    "There are requests for multi-template selection and full i18n coverage. Some error messages are already handled, but 'Loading...' is not internationalized.",
    "Accessibility could be improved with aria attributes and better keyboard navigation. Security risks include dynamic HTML and plugin imports."
  ],
  "embedding": "eJwdV3dATm0UT1O0y4hSSgPJTr33nEgiJCt7RCqpxJdNVkuDSiKjQiEjI6Jxz9GSrOydvfcKkdH3vP64f7zvvc/znPNb514VlVWlKiqr+qmoqAxY7Rtd8kQjB9eNL5UGDB7DT565YJegcHJ815LmrZxFifJkeP0tDlPfp9GsFaNgY85x8tuUTm7h50msk2pWXobZRa2KZaOJ/N7iB+zbPQOjnPpylfF/cOTWNqiYMqJkW94Efhy/j9P7tcaefdvwg/P3JaMV2pzN9mxj/lv+kJOB6/9rS8cO2SiCy3Zh0tb1eP3caco72Zdyh1zjleo2/Fx2x10TE7F7diFl6m/kBssuXP3FButaxVNu9404KTQBZlw+SdnH/0h2FfE81eqA/JEmot9PNTYa8w3e/BfJ3kPeyX/nHYF6v+mo11kT6z58hfeeOlzys618xzeDk1IDaYl3ICqm/4bCR6WQ7vxe8l0uE57SFOdXyq/1BuGYTF1OOjac4gfpUW1tC3itV63oX1NLiVvn8a2KYlbejzufhi/6MPdz3iWdMU6mMRv9uE9qJl/t4o+Wc4J4zdxoFL2iduEWtOjtxtPbZMmV6fU0/0kHnN6mHVp5Z/L40Y7s1Gcdh7TtjQMSc8F8hzb+ddFGJaYBs3fyJTQ7eWvVTDLDi/BEw5o98lKwtnYjv9MsQdPAUxS12JDvmJ/jJXMukW/WLqnw5x/JRv0kO+n9LKkCDZ59ZQw3pplC0IADrHKpjAcEu/JmMmTvkBtY990CzdCbYoe35Sv5wex18Qvmj97INcWLsKxstuR1vIDeHIvBlnsXo+CbRzR15rpug7hN+XUQ9bDvpiXsWtAoNDIUH66PoZPNaqCtmh2NM5wM+05foHLVfpC3ezX2yI7lCG91tlF3LfH6WEuh6Y6Y8aEzihpogx3g6YV5IPvk8epaRwwdMxkrplymmK/NKNN+NP4dVQ2pFzrzphx1qi1xIM3b/qRnPQkNylBoKoLjbXfzg/3zsZ1ZFLvotVLiAIVtXsKBiNk8780qLjuzmVba6OGbEaaih6fwO8MWN3juZqFtnDNsONa7LUZln111V7FTyw709sA+FrjKL5ckg12FNq77b7nsSvspbfoMVtF+RVY6Q7F1hy8g96ykmh3F0q2dl+FLQQ18DTcl/diW/3SqpxrO11IsuJe8Aa3jTqHmo2R+0fI6ZA4mWri5qvhb1QqeVqqLQpMEfx+QiqGxQmDCLZNLeMIlO2xr9hxc7Maw04jzdFtdB+PbLSXhFVY+IzRDPdrlS7kGDuR8TBNvVbiA0ZgFIPoE123lKHrAyhXFUOq1HVW0g6gxbQu2v5rDuyY2l6KPOuOKiqvSyxG/FDqxP6DHs3heXDeGhRekeA1gpR9fHTsBH09poCLBAOceScCWYSOxcrsVdq+0FHyNkf/UO8FArZ1ktnIH3egSiZ9ahchXeyfjy9QauuCxj39WmVGAV5Fi3o6r8l+XeOyfF04XcAV45Bmg7cAUOefmC8ioqfh3uS69LQsNUUDAd2h/1drl0lQNvDFHAzO1gkE6VSi1GLNBanZ5HBdNdqGE1b3h4t1HVDS5mAQf/PbUTLzj2pPb/vpFTX2mQmXRNM4f3YJP7NmsaGcynpXcDb+YgrLRXTIvrpYrix6B2qsMUHr72KUkXrjZQ8GXbaCr7UkSHkM91S90IdBIHrpMF6/nN+UTWe+lXS7Z5NBCF2dfucHzyyX8ffyZ0KkDBnqtwUF+3bnw53Le6twc38y6BVPd00B4UjrZbBhMeRVFSv8uwmiKO2+COxon89NpPfnQ6EUQ2eKmvOW7M4k8puY9N4jeiuFqb30ee6uAH+p2wzHzl0Dk73S0XdUHRY/Q977xvwwUuUKNB8eRYnoEpc3Sw7nJO2Fe4AFQ+lXpyUOTssG/8yWoPnINIrq0ZU92KxEZq6wFwhxegO1AAz5oepk+WWyCdxdSIfixLgVZ90eTO1ugXd0H0MmdDtHnv1NQQBqGOQTirbhUvDPus6z0ydeRR8jPpwqW9N5Lgl8WGY73HJfR2B/m/PG+O+oc1oFlOj1gpU0SXwhMpT/1J2DpOV9Ymt+eldmSnVEKzgdqqfpNg8vsturU3GskHPcfyEL35D2qFXd0Gs/tTG47Oz4L4WEGVXjQdASeTg7Gey2Yj8d05Sadrii+Bn+g/nlfSn4Er8W2arnUaXEnuD9OH8UMwB/BOjh02ToWmSMl3vMQ2BXC/vZTqMO5TbT03MMSH8VVeeHULPrkfF3R+d0P5ewDV+qERlAorZ/1iU6UjmXXSDWFwEk5m/Ceky1adSmQx89PR8E3pEV64ajo7koP8FPbtTR18lVIzM4izSymia+ey31vBIGeda18bpgGbtuwjYW/Jf2Ag6ScBeIsjh00V9StQ90G2aHAhZ5tvSsNiIqQu2f3cT3dsJoiv76jvt9H4pLe9rz9wTwQvFGhVSpaz5xE/p2HU7LeNF7juJqF93hRsSO0OjudHVqsg/Gh7+RNFl05IGAhTi79SI7nu6DoE/ZGN5RM+1mAIsfhfHNVOVnvkTy9TTSsCOqDESfWwLGZLlA81BvVEkzk9MVlMKSjAScdlxQPUl7A8R2utGdtXyhwU8d3u55LQeecaYi+JQ4YWQZN40zBtmMFhDadQTccI9FNI4R/KDbiiLpe+OlTCeUN2U45a9pwRIUX7t9VQMmra+nqGcBupw05cs9jcLS0g9t5V5RroeF0MlpeUMXJ8lTKdLJE+XMRD4nQkPsEr4aGCfvBpJMeP7NfL+mX5kDU+/W47HsetGkThJudt5HF9oqS+PVNcFFWKu+7bcIjljZj9dfePB71sceotWRYFIVnfGuwcPdTEj1JJmffQ2mGJx9Q+wir9LJ5S2IKfZsZjBVjomDr8ueQ3S+YkmrnUst7zC/LLstRD1/Qr6GNFN/BDP+b2RRdZ3eme0WrYdq1azQxcgLvCWzGmlbX6dCTB3Snrgl3WK9aMth9Fa9VW8sh+/by6rvlcOTQCn58T4Z3R1NwztLZuL7Jei7oeYe8PHeTh/k0VHP3l6+H2bF9XASblV2lukv7QWp/U14WXw0/fDTgxB13WezLf9N9TipxNfhhT3PKM+GGSSrq9v3A2mH7sM7Po0TvjjFvsx7By5NCObDDRQgsfEVmWzPpRq4Dqe1S5xF1BRCzZC2lTNrDln8jyKyLM+aXe4OoBQe9bqQ0hxBWce3rYlY2ilsOzsG4+kmsa+qCWF1GCYsM5edrhip1gtN17pBDEyPunprPx3U7YGnGGRZnQNwVWz5xTI/r/KpIWXtXo9/yyGPJfGPab7pzZz3ol1qj28PjZDhuBjib5dP1Jv2JOrniM7kz9lk4kM3fp8rbTgQrTtyp5LRHKthyzm358PBT8p61pRTw1pMsdOxdwifcJ5dlITBg0YJ/XC98UIg5bXpDu2tWZO9XzWU3hkH/AzdYYCQJ/Cn/eDwNqjwnfu8l9xhLXjYjVVK/r82VBch37hhiZo4GD9Hfgdq1STjloiOfSoqTPI400MmKP9LyjzrcTDEYjjoWUEn0aFyjsUapCbr02otrA9aS+B8C/7bGkH329HmTDRYanSU7tXWwyTSWW0fao/Rrh/ykRbn0Ra05CezlbqfXo/uXGB40NoAmTu6AS57egxU3MsQ77UtqmNCJhT7pSnKh8ONFGpX4lZKsdkLdpU5S+nMbFtqhq72tcIaLKZxuE8Whw4257GwcD+rWTfj0pPT2tgcGjD9ElG4NwxRLpdnZcbi/zyX8NGUHw/sFOOmwKa9vYghz1yFvqOmGunmj0UH3FnRP7Q6N6gpFxTJnzt7ZTA78u1mpf3nY6v140bwLCY+i0akz1NPZDG/HmuGhBUswpvU70Jylrjh/wIqU2mh4N0BosCN2atqDEjJP48Ujg9huUy4d+eYIowP64qXKdFlwgaeLn9B5V4RLY49Sl5c7SfgUP53TQLfA5pLJrdY0/t4HKE1RKxEZhPoO2hL2ssXna84Df58CNX0y+cLfdEqtC+DuNl4oMkuuzV/Ibhpv5WVmT6BptrbsY7MV4vzLKWiXGjfMa8OO63Q4b64PLypSxb4XAnBok2+UPqo5uaqclgILgzhviAXu+zuY2/VrSqv0rHCOjzPdnHeB2h9NZfmzsyRyDIY2WcCDZ/WWh+X68pexq3DawSxW9tT4QB3G3jpLxLexx+cQXno4gj+di1H6HoZt20pH4s6S8CTPNTHmhQHroP1RIzJ/byT4NuPX13bQ5t2rJIEXO1rmYm2im9zj81ue41MEkS6/KdK4mm9qzkQ3r7b4me5CpbSBZiUYK/FlkX1Sdr838Hn4N1rRX7XIuX+g8O1beOu7DVrkOPNIB4Vc8SpT0po0QdZucop4hjuKWuCtxwHJ1PsMbUs57qL//DbMcYwS2RGG2068gYpX5izWwpTpg3Hmp9lI6vFotWsm3ZgWgWIP9EwOBoEpDslWoMCJ+c1mFJgrc4UnWFtIMzwelFTeDWeNsb1k/VEnoc8IQ8ytGsAG+YuxaKUj9t+egl3fDSzZ3zkBTrW3Zs1Z0VBgl0YCN4g9ORaVXCXBei5p9QG83TRO3t6h8y8PrN6m47APyUpv4zybPxzst5jvnRrID4K7Y8bHOdAkcwn6r02i6tFNYe6xcBxwcjd2TNaiRPfunDptKMb4ZoBy/ZSvM1jrwzxlrUrt85G2/jwku4RCF5zhwx310f5SHiQ0c8CXXZxcpIK5JHSGhz7FU7OaGUL7nihmF5CYKFd+m0HLwdao9OGxD0k0wvQN7Zx/Dg62LIUs1X5cm1gOynmi5GeVyiK43TeUk6zaY+K5WHK5l8idD5lx/cvtrHJlgrTS3gh+px4uEXMFej2Ile86aLnmHLxEw0w8+Im0EJrnHgKL7f1hnMElUM5VZX5RvrFsGeLHykwfWN9J4F1ALQyyeFq/YhBr4c/5Xrw2+y3+ULQAgTl8PrJRmmx/qiTXayvOq1OVzlWlimxooPf2uthzjTeGK+yx2eSOPKmnNjvkZpNlmReFazyTDZ4gW+8rhZs5Htw9axLf6ziR9982ROjcBvJtF2DFeQMcrB8FVpt1eHtaIa7IuYE2tZs4pXoSXTbPlypczsCyjcks9oZctb5o3usB+LdfxnPqMyFgbF9e8k2Flw5vTYccLim2266Sg01i8IlbH1yduQwe/SqVw9Md+H2MIQxSbQRz/ebivekoXZ9yEabN2wOBGU6Q4qFO6x68gg3fq+Rvpu/ANXIAZ5pGcH+LF3RYXR+uau5icUGf7NacVx5N3l/awhVHf5gUGiGvyBnDn5xG88sJJlJ0x2A+szVenvojGMbnbqUPn2ppbc1x3msSjvKJHXzsby+8NW4+BM4Mp7InmZhuc4TGnrSDOfXmlGi6Rn63JZ+Lo8+KvmuhKiUcRI30takL2vQ+RDdvx/Pz4hgWZ+CfvGjaanETJqasQ9fIU+z66Rd4XX8GER9tee9/3yF9w0ss2RjBAjcyP72HrTRP4SGH4exeb4PfvbvBWb/bxUs1C8gjtsnJopZGGHDqe8miV78pRycWO3x04jVvMkDv5xDe6fkCju3sxnu4uuRLfhII3OnF5NXUoSSc3+9/Rns6N8rdzdTlbEtbPlUQJV+dXyuZhSZDJ600PJmxhy8FtuCOXa9LTX03UWjBBlAcecDtvxngm59W8uhTTVjghGFBFZi45iTPLQ2V/zxfRB833JI8Hm0Gu5kxNCitGiKffgGEGm5zYRUpMcyp3MkCK150WBs6y/1B9IO6Yy/Rwfhr1EZRRKax8VSv6otOjRm8OHGxtIcHsRIDU78fNLPZB8j1yuFG8b3kHnBfIfrnm4bL4eEbHQw20WDPPu4w+eg8fLBrIzTP3gEb93+Vd1gbU4pHND8WPnPRncHPOu2Xqut1+UaqES8KtAFFfzvanZeGGgmVEJ91nm4a/uF9vVtSTeNPODnTj7VMt+OcQy5ymE82ttH4iv0K2sLAz+el5StU2XLURi6N08TWI6v46bfn8mLt9tjD7RYZ1s1l/SsJOO3xFCyPMcXPd7zpzwxL8Axdw3K2CkY+DUeLpTdA7IvD1YbzOcVmOH9/A9b7zoCA7dagktuJeWxXir+WjBdvuZA3j4PIBTLsXL6fTFb68q5FI3jPcAOoqnLijK3r//FpX26G41uMojXjr5PgiIQXKeHwCtHHEl6emo3z9vrCZqenoPuqFfee6wb/YQtuN8uK0zfMhLOPVgFsuQICAxb4SaN7FJPgR2Dizr8XlWHMED229pKL0/z/gC81c62rj8HkE/Y88+BrMO0YA6n909HS/Aq83t6cXV7pc3jUWvi6dTXeHOiG9uUZJSFhGezj/o6ipx6CkDAz+GhjqUjOjoNl+7qyz41ebNA5m/LK1dFl+wH8GKYu/HiN7j7141y1Uurg3BbDo3TwnvhG235/G9kOfOwyf9V2mG+9jdvP8JT6nCgix0Hd4UzpPahVX8PVzQ9RlNwD183Np6yoaMndZz/dbpjDaRdjSMnXINWVLNfOQ8EDn/gxEWWDItnX1Q9qY6eCe8AUaVnJEzA/bctiT5F9/mi3zIb7Z+phmv9yEtqRa05rkqgThn1rym1tW2P8NX2RhevZprYlDmh6R/5icVpwmFMCF1uQci/PPpVkcDETvTdHs5Ib+2ZN8M0RV1lgpfQK5W7U4qqeH8j592EMuqgLaVvKaVv9RvLerE4+5Sbc4eMJOdRqKKcbGvDTy0aszM/eqs14fPhNWDgrFcIaEsDu9WRUesLkjxY8MKqh0Ts+UfsZZ+RX1edp07C5vGhplVyxyUtkjD82KboPQqv/PCN65tE9XHhW3SM4rJ5MLq+SSdE/F46FvitxuPCNBEf00VCFNz4skhosN5HmjwbYfOaA0KJEx6+tgUenf4FOkgprdikFC50syaFjA+V6WcPjhG0szuOLHp9JnpABLTNbQk5gJndb0pS1Lit4511HFJmDb/prYZR6Oq9t2QbcKx6Dz+JudCVPB52rQySHXCsSz/GvQF1WnTThn+aHdp+F6jcFJuI7T+DCo/98VWYkLJlRBBvi9LCt7WYUGSUHjQjA4PM7MGLKVNS2C8CLlu04z/1escg0gYun7D18B1QvCWDP3Uv56vCmeLksj1a1M4QebuNYzIMSsb/kZIw8cdJgLjG24RUDR+LK116K4RvT5cuJQXQk/LSYMafwWqtxfHGWKmZ9ltC//S8YOXggJ0/YBcKb2OhlTP0bjNjjUWsxS9pQpJY6ZyfdF1owR+MwBzF7fkvK3I37NZzN9RNZ6Bjf+b+HtkNDyC0iGJOMu7gO9vxOySf2/puPvXyTYO9/C2FtTW/hhXY4JeEYKf3j15gGprHaIs9SeZ5tHCU1ruUuGyLFzBggZslCMVuW/cNC5Kgk7pHbnTCBmScWRw/mwafbscAGl6pZUtXLFVirswaDUnbi04kdMGDtdmplbMIHW6uhvrY+DjduBypSlqwz2IbV8uZDSlkxzNVaRmH5q2T8Y0R3uU7KrQyVMaZSMhrZUbwLx1O7zj/h05fJ4h33Ld0v/1ZybF0ttcs5Q16je6FUPRHHmVvjgcJ17DcgBltZf5Mij+TLm86wXD4/Fxa4HWfjsr/gXK/Pk2A1hY/Xh+qIA9AiLBYvhvhQRLcH0LfTSGn+k37UMdaIdspBOPWxnjzj5Xqy3zQPEmMbYd9xHV6XM5liHdTY/vBFem4fxrP93oNa3le4V9eZJ65oTS95Kx3T6Cy9ViuAHtk/Sdlf0xeHwPr9DP48ciSKvfg/7IkWqshp1t3kzp13KNfAYKdbcNrJCOcVqmGfzdso2fMNqEcVsXrz1/w9MZHoKCkerpzKRU5vybfuE5sP8OF5v7bx/fIF+HN7GGk8ySP5fLp0NUcXQkc0Z33t5BLfurkU/f0c3tqXgj9bneS84iR+tasvQ1YWhmfY8Rs/e2x0NuduCyS+rxdHv+g8pwYM4mFhKVzl6w0LdnSEr2NGc6PnX+h1uzu/tzLCuSuHsLHuer7cEWm232zBsRbd12sKl86d4e6Tp/H2fZry0tI1vF6RwKuqEzHyzmzULWrAWrNX1DrytfQzeR22bbWJ5gd/BhWtmfzHKQPqG6YpuQcf0/Y4eaYrWk7P5+qIzixqxIWN5mi09DmNCDfChr9PqEf2Eqq/sosFB7h8YT3Z67nz+w93ocMpOwz5vIlS3y+i6LCtnLTUUtL2yJFP757Je/IT4GMHY+C5u6lVwXaI8G/Bpzdq4hafufxgczFfzp8NTcN8YerBcXyiyoTmRV2AUDMf+v1JFSelLMXee37B04m7cI//Yhzjq4APvb6yb0g/PmD7lBRBL+hJYSsSdcsCK9lwQz+c/DFMahv7lgqD2tPohWl036WKxH4lYeXTMfNyOamiBdid6cj+AzVxY2QHXuxRSC2+O3FWrgYfaBlJFqoMZgubse3n5zDkrKqiSb0G51a+o20J9vhw5QP4WpON102ewX/HVeFxhkQvpu6hLc+3gm9IGWR7p3GBpZZCcIIfo7Rw5lVnVOpuZAsL2PezA2p7WLP+MDuOCjXF8t/j8PruJG5paIwCB9qYuUrq9icEvX+Ug7GuIe37uYv7GX6H0GVnlJ4Ay4h10qzG75LQk+z6rA+E5avghLfv6HCTfWhvlwVBKe1pTbgZK4IC+Wi7WLy0vTk6Le9Lt1N6s8Xrx1SbVihlehpijY0sn5kxgrdc6Iszh8RhwdABvHZAEJtNOYyHm3TEoaH6slK7W4/5c4+PzSW/OHNs6LGVdP1X82LWxEdjrahvozGJdTjx/loqcgqRH9YfxErT3jD40B7W+9CDui2QeYfXBnmz3i3lRe+SX0g2D9U4q+UkvJGbjKR4T2ZTusqbY22FhipBqe1B68/KbNid6r4/AKM7E9DnRhzk+qTj3q1HyLlyvPyjaDA/X+OHA+aHUtWGGNi3+gZ/cf5O6U9N8VNwHq9r6wDNjN+T4Ib6TY1jpfa+OC9kwRuMCE+l6fl34IrKanyt1ouaJRJXDawTfWzgd1onMKh7F745JIPEufymXQpsPfYMho9zUp5H9oe9ncernyET/VS6t2wyTovNQI+hR3iv1WNe46jOoxea/POT+YDr1NxPBa7v1oMT2l2w7EobLp90gYQWpQ/Dhku3F90lDbeddHXOTUkv2ZUdEkz+ZYCyF6ELnNT0HAnvQvvcc7KLVY3Lu8pMWjbYRdItWgpxVwz40jlP3h/UALPvAn8dc01kZRkmLd0BFclRqFjthu4tfsCBrKOifgPcNOIDiazG9hZteFdpsLIOUGosxcKRRSazyEv8tV4PLJbqcF7MLZqRkCVduzgEtyXsZaFDlB4dlywjdNnrvBo2eq6guSvPseAR/nxRo4RWnXBYjbpUcO0rnKm14Osm/uhncFEyyGtbIjJXPrdvFihzbtGLChg1yVmJN/ZoM1g2nXCQXy9T43NNH8ha+iEodIoOCWkUwg9BeW7WECMuurUQdh7QYt/obainpYcnE1djz8865BmkSwvs7xZ7r/pCVpp9SYm/MjejO0VKyiy0NN/CVklzWGiJ1uXck91eFXPd96k8veM+mHtsNb23SqXPI6/QvboD5Ng1G5X+f3hsIyX2iIWM3dHYtWU1ivlIn2zT0H1PNnY4lcsptS14cc1LacKQ6ZRXrEcit/DTl3vC4yZQvPEhzbEcy6OuabHQMGaO/0JxV1I4JfeBpDy74+xCnOIayfsfnZVabRsAaQ9buSrn7nP7DyTmqfQp2IFFnkoeWq1hxtiXKGYk7TocD1aapZT3x5bd1w1iM9N0+XljdxKzC+sbHvHfO3uVNWOdvoJv5OrLPXrugvWKZjywxw1Z9FXi1O48TVq1hf8HmfOmtg==",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9820,version:2"
}
    