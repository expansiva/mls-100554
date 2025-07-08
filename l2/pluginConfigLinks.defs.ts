/// <mls shortName="pluginConfigLinks" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginConfigLinks",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "myLinks",
      "autoPrepare"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_libProjectConfig"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Uso de alert() para mensagens de erro pode ser considerado inseguro ou ruim para UX.",
      "Não há validação sanitizada para os campos de entrada antes de adicionar links (potencial XSS se o valor for usado em innerHTML em futuras alterações).",
      "Uso de 'unsafeHTML' importado, mas não utilizado; se for usado no futuro, pode ser um risco de XSS."
    ],
    "unusedImports": [
      "unsafeHTML"
    ],
    "deadCodeBlocks": [
      "A variável privada 'test' nunca é utilizada no código."
    ],
    "accessibility": [
      "Os botões possuem ícones SVG e texto, mas o texto está dentro do SVG, o que pode dificultar a leitura por leitores de tela.",
      "Não há uso de atributos aria-* nos botões ou links.",
      "Os elementos <link-item> não possuem tabindex ou roles de acessibilidade.",
      "O contraste de cor dos links depende do valor escolhido pelo usuário, podendo gerar problemas de contraste.",
      "O foco visual é tratado via CSS para link-item, mas não há indicação clara para navegação por teclado nos botões."
    ],
    "i18nWarnings": [
      "Strings como 'fill all the fields!', 'title', 'url', 'color', 'add', 'cancel', 'New' estão hardcoded e deveriam ser internacionalizadas para suportar múltiplos idiomas."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin para configuração e exibição de links customizados em um projeto. Permite adicionar, editar e remover links, armazenando-os na configuração do projeto.",
    "goal": "Facilitar a gestão de links úteis diretamente na interface do projeto, permitindo personalização rápida e fácil pelos usuários.",
    "userStories": [
      {
        "story": "Como usuário, quero adicionar links personalizados ao meu projeto para acesso rápido a recursos externos.",
        "derivedRequirements": [
          {
            "description": "Permitir adicionar links com título, URL e cor personalizada.",
            "done": true,
            "comment": "Funcionalidade implementada e disponível na interface."
          },
          {
            "description": "Permitir remover links existentes.",
            "done": true,
            "comment": "Remoção de links implementada via botão de exclusão."
          },
          {
            "description": "Persistir os links na configuração do projeto.",
            "done": true,
            "comment": "Persistência realizada via updateConfigProject."
          }
        ]
      },
      {
        "story": "Como usuário, quero editar os links existentes para corrigir informações ou atualizar URLs.",
        "derivedRequirements": [
          {
            "description": "Permitir edição inline dos links.",
            "done": false,
            "comment": "Edição inline não está implementada, apenas adição e remoção."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte à edição inline dos links.",
        "done": false,
        "comment": "Ainda não implementado."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Internacionalizar todas as mensagens e labels da interface.",
        "done": false,
        "comment": "Strings ainda estão hardcoded em inglês."
      },
      {
        "description": "Melhorar acessibilidade com uso de aria-labels e roles apropriados.",
        "done": false,
        "comment": "Acessibilidade básica, sem atributos ARIA."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin allows users to manage custom links for their project, supporting add and remove actions, with persistence in project config.",
    "The main goal is to provide a quick way to access external resources by letting users create, view, and delete links with custom titles and colors.",
    "There are requests for inline editing of links, better accessibility (ARIA), and full internationalization of UI strings.",
    "Some security and accessibility issues exist, such as lack of input sanitization and missing ARIA attributes."
  ],
  "embedding": "eJwdV3dcj98Xj3Y0RGjKiFBGZp/nHCNJZEWI4otUtsyESGknilIaZBPJCPWck1lKGcmISvYe2aXidz+/P3p9Xj3d5973ea/7SUUl6KKKStAwFRUVR/v0GipWOQ5P1FvwlwVbqXD5BJ4+LJWuX8ikCeeeS4esVKl0sQ0uG/hG9ogw4wK/TPndrLV8c1uEVLt1q1Q7fQpsq9gvx/39oDAceQ592qRjZUQWPqyzRQd1lrVrGimr/xE4FvyFjngelhYesFBMGjkU6tOm4sjlyJ8+3YPRT57hCGtjnlBhQuZlg3Dygouwe54VZuAYDE9w4vL5trzRdSQ6qCXju7iW7PPNGy/XaHDb04/x9DVrHLR2l/I53mj+A3jiMfp4Yy34r92rKKrqqdxHjqjaB4s/pvN8hQ/9cjtNT3704hOfSujoJlVeaujLg1PbIel84xSfTzBaZTfsha7Yd+MTmBLrxVWZOkpeYOySITRobTt2UDPG9a/nY/UzHby5dBXvHl5Mk+en0Ju2a3mG9yXOd71FnwxOkcaKCnL9O5dLrO6Qf8A1OWN5c6xp3xs7zhlMO2MOYFHubXCuZjB0jJeWuXfAt/Zu7Bn1En9PeYA3t2nxmimO/MW9L5tGDsLHwydxWtYSELPKs36kyu5mZmz7uZpTI4ulObPNpYXBPnhh3Vc41OYwiXXoa3+Fiqoy0cShUj7z1po7DvGUHccao1I3sunBhp1m8J1HE/l4cYnU4ZcHB07M4Iu7NDDtxGh5xbU9mGRmxcdyQnhl4RvYmabCKqSPys+WLoGwM6YL1q1bx6HjCuHmkom47qUlC82lz63u0xH7EvrzQo+HrAZyHJvMV1TDIWx5oZQ87CB83duXH8/Lkm4M0KLqrF90csBYrvS+K3sdMQdbg0SpKvIuzA0dTvtzg6Hiz0/6t3oaGg8fhHUBUzlj9iGZeobBUxN/fvUlmq1n2oP9pXYgsEPLxXFsFuVB3rVpsJkL8DKPx6LKcPpeGCDW5eYtc9/DlngBntxdw9Mt5oFn1Dzc/viD+Hu9wsNnnnR+7VEY/jQpr/2fx/Ttvi6sfDcCQzQWCm0Q7NP/4zeDs3mgWzuppUuTPDNrHpLNMThrro7bGzvLQntJZIOflE2i0c3yoep4Fhl2eiydvqqWO/X+UCzcoYkaCWfpWI4qusWkSMKHdM1FEwMuWYqZuqJyzt+RsXi47RcQ3IGlSRWT9nh68EobR45/xkbZhrCqpSVVcRQ/dvglDU6TaMvYfXyjiw0fsgpBoT1rVfcX/FuwbBzGOlY5sFpvPqb/sILxZ024aYK+OGsv2V1rCzxBY8jpfX4IOrOVWMQ5t6BpzjYOoo4K8XdcdOg1DQqQIEdvOdb8WsP3Y3/Cglk+WLtVF6fVmaLIuXJ2DOy1QDa2qJTyVx1TakslzjbYsyiBG1Efq6J+SQ/vl8Gq974g8NBdxxOS8uwdASr5I5ezYm3aNVi77i2c0N8CGgn92UEdUeQdrifcVohz+KfeH+l9TkscHz8XhJ4ktMNDbbrxmYJSGsYAbWLiMcvQD0flMhwN6sbrtTryh+sxqMztl4EBIHTjHy3tuGBZOGCv2SCyJAmdKLLaSZkXKhh3O2+3wyfwCxxB5lke0L7hr/yr71TQfuJO74KyqTJZh2dDGokMkIuzCSp9uuu+M616/0Zh8zEBS0ZpUX3aA4iN/wDvZtXJYxfv5oLxK8HHyAFr1+vSx499oGsbIwKbJK4M1+GTA/1o/kwHiHbuLHcPSuCXpb3pw0E37hOooKFJ7UnZQWINC6/zEc9uvC3nOkdbjQKNlY3UaNOPWy7JyTvbQp1F5qXMRyGcZLqZL1EPsvZM4AmP8snzuNmF3u6JeXul5nynQYt7Fhmhq2UKzphnhnvaNc+fV5qGhp03CryLZKtbVfDLzY69wl5hcasIdhk9RFJ2TnuzHVLLxa1YeJo3aI+U09WDuWliP5iZ9RLUem7gFs6tYH/oDdlpxTMUHQzhCYUoPEgn3a0xxLoT/3WdhmIuTMg+wMoOFpmkZk/1Oe9ldz45oBRMvAf9v8Mdx7F0b4ErCs9ATp+jIHCD0amBKPoCTSN2cOejF7DlkgE8dM3TXLetQ5WZkIUfuXykK8U7HqD8SStwr/EYbOrVQNLrGuH1AZybvhxPfF6GF9eswGMHBH/nPpDdviewuo8lJZ4qkv5cnqrs+TzRb1BfFkvKdW3vD5QXFTuQ2Ec63HaZJDpT2fmcmzaOazecErnezz/7nMYW3QLhsJGLMj+gam3AnUIH4xq3vXDEQ1Xpd+HDWpg+/BJqN8tRCL74rf09eKgdBVpyo7KD2cPnJWYeWga3zmgpsUriPWX/0DnvUMnQ0VD0bRhPyTZFx3GIVrc8UXQLC9+gybzWmGTabMjF1eOx93QFLv7kQGEr3ucZnTon+6+1xP2h4k5MXEiCQxL3L4/QeEa3H2pJ1XeyoL+urIjrG4QW5Zv4+AdVRZLZQVS13g4iRxCR64SiP+l1m2xIOKkCIs/crs6QQ0+34mZe5tjbNVUxO3EEzu3wVVJ595ATj7vDhogSmLbUFp/f65DnVLgIl/dEaeC/xTDyv6UsW7SE9Tfbc9bTPEh+NpGefveEI0cmoBH443zVblKHKHPkyVvw9bUb8nmtMoj/bIcUGind3KzCO6Zk09eO09HU0pY7dd0h+aZ2x9cPDfFbSjoUb9yKt7bPV4h1WLAwGOsUmjwsw1ly2TUd287VxAbj3ZCvdx4qOmyAzx9nY+a0rViyF7FUU2IDYzUpuM1H+35yS369KZArb9nThv6JHKMTSKNLYlmreRg+GhlDP7qIu6fTF/nM0hY0soU9ny2vgJpu8Txo/m6wHKWCCU+qIfBLkZjfhbsGStDMK420uwwkv/arOdF9v9wjqBdmJv1RRE8Yw616mOGT/HlQU3ac/dr/JIdlV0ntnyFY71lENWU2tOTyWC5okya9fhjPpZoy9T68WdZYXQf0aAg6xn3HuMr37Po8BssqrHFYRhEWtDEH6c4MvmjXjnq8yWRMn4LFG3V5uOd69OnSRk43JrB9+IDaFavlm33uJlcNOE9JXdPlwTd9sfpbMpvknpT1nldSy0s9cf+wbexv2YI9KtLA47o62j6cSorms3kibYD7ibdk56bWaO4wkw2upvOyX444tHwcvH+sjumnh3BZxRHWc9HGmthtzIfteXtpcw784oyNcSfBsc6PP4W3Rq1jfvDMM4oOuHbj98G1FLsrCoZrOXGQ03I4VLWFy/+4w/CfTXn+56tl3wE2vO6fOQ8OOA3JP5Lo2okOHOppQzbaVWij7UkL8h/lKvlvdv4uXazqC/GOSaD3cz9pLwjhbr+DcPzuUnmqZh8SWOjLlFjBtw0mO9+CcWvN2DwzSqkVTlZjnF6vg2r/4rFZ4x4K2+gJ375M5oYedhB86Zzc6aIRdwhQ55hzozg0e47wfRquMk8i1b7tWWP1WtZ51h4/J2XmJURZ4yvtJAj4eB+GezZQ8cV1KDxCrYKaSSIDXP8zF5ZYj6GmuuPk9KgfX/bdJqlNdsb3vST2v3GQ1vbdDwtj3FB4hgXnbH36DGQb9UOzz4dpQVlHFrNDRYkTzpgdwR7XQ2ns36l4KGyPHLV5ArMYQnAhhY8Ph8SRHlL66Xw4cfMbeSaocKfWJdRgbIJH19zgzdNzcfBAI37sSyT24uVD1PPj+qlIq3r1QadHZ6T9ITY8da8dOzd4yZXyV5i+vRotqFMeNyyV1v1L40V7UiWhObvH63LnW4EoMqnEzDdeRUn5JcYc/baURK5o7oWVeLGPL06cP4pPqqVgjwc7+GvEVJI2HISOx2/K/eQYHNOnivb5vaRb29+SZoqWLPrj/5+BI/7KYgbwtCknb99TsuXX3VTxJBYiC1Oh9X9t+GTWAPyQMJhTFv6lPi0nQLffKlxm80SqVrVjkWH72zpZKPwM8GIfdXG+CspciTU4cFowKd899NgNz41Lx5/RxfQvJAr0XCKptnOkNOdotELZCeIZiYxiontnLtftyH8Lu/GCbuH42BcoumEn9wjKgh4PWuN502SKNGuOMTpNtMq8PZR6+LG6XgM46x2HhK8Hua7bUBpQTdjt5QX2iY4DkX9SemmPjVp+usYPmPdpEeROjOO0Wdq4F1PBeV4cHxjyH18prZJ9Os3j1R8MSXidm52fREXZ8fRmiAGI86nby8GSMlurE06A0dvLVGP1nEYltuUXccFM4n4fvbo7PZsxg8Q5/PdMjXzqxQl2WjGQH6tcBPee2+lz316snFNaUC09dlvFNbH6eKjDPvnm/QEw4UQbftw6HJW+e3d2NcOgiryTKUuo/vlXUPKRWraeldlK6d4Kv0aF0e9Lw5X9IffAOBbZk4RfQKnNinGflD6Xh2sVolm1vjhrpgT2Wui2MRj/bZ7Bp+xb46NPv6Q/WsG8vCeDMuPB3c5y09i5nNTVgkLWL8AOnfcKPmqk+ljApjobXGJ9A5Of3RHdWEraPBgfqwxl1FRFcafgtKUnSORPunZiDyn18r9hhdM8vPFR8nC0apsPe5Z8ldZ3vMXizuAcxQPpQ+MAiKjriA6menkJo6JzfbrshFHD+nKX1LWo7JygmpUssiSJXNPJGUG5om+kvPOxlFrWQK16pMpvW0ZTG5NRlDlNl0Vn4ZfJs7hk609I6R4Hx6pHYfaCt7DVvIAf+sfRitdfIGlrCh6qUsP7lSk0kRrR4KoF9msMYDu3beIuSCX7/t5ovecDr8u7gyoJnbDv49HKbNONuw4sdFHOQuGvpvMybV0G+4hcoTP4+UVBRM4WZdfz549PIXr/P7w+cByK3pIa2i2UxX3KCjUDPtn8AxRf/APiDiSvkZu56OsmHtPHk8/ej2DhP7mNrfje1cIRlb3Vwuk1n9rQB/U9M6C43XZ80OSC7j0NSO3jGPC3jMZtf8PZSnUN62Qk8IfyQxi+/oCk2X01vg6ZSkd7I2fUXaH3b/RgxzsVnrWnBRa/HQFF+/7RvpczpMj9LXFoyiS5ybgEjOMbQD1CX7z3gK6kPYOJNkexMj6Cb367LZd2N0G/VyfBc6A3rdHNlnadviUPO1aal3G5Tl5laEFXj3vwjd8Mdik69Lv6OS0+8AgaZ0RCo+0Z+VKsL0pnrbnDcxcu//2JnoR0xT92GdQwRVXuatsL3xy6AHMTemPQ5AO0ztFQhpuJ9GjqYKx30uZaY1We7TVZChzQB/cU+nBNvCW0vWhPzfu5Ssv5P6rC50RJV+nii60cOCCbx1S54xeVBC5q7Al3DK7Bt4ZDUkeVYTimqoI7qPdCncxI6qXTCCY51eT67Bckt9oMtR+P06Ehe6Qhd83YUS+U1BxK2LTiIq/sGkZp5z9Kk9xa0ZGWHtKou2N5qttRSeDlvEut8VCr0TzGfJdsn5uIE7SvU0DPA/Qy8xDkRY5mgxBXfFHcfMjAeRXc5k0ke40JpKaJCfhX/QXZWrxEMws1MM34CUInXqPQyLcPHitPbD+c9Xfl0pVmwRi6+BjbDi+k1BI3Lnc1QednTlBnmyIZVmyzr1plAyueDpd6zbNW4uGfxqb8w1aVX+ftZY8xN6ncZCKuMjNEg5AyWPRqF/vXX+eKVW3Q2noYhTvOAME7Cw7offY1aZ8mcsXCvXLTRCM0u/aQ01slk9GvEMr/tBk/3RosbzC8BbD3Elv/p4P/rAto7qxXUqOOK4ena9CkWj8anHgWQgc8lTW3Gsnq8ap4ZnVf0t9lz35loyAyuT1Y6ZSyircRb08fiJNmhfK7ip28XvWedNDqFEPgLPr1dQxe+b0Vmm1UxdYZI9Hdaz899OgKQi/B6Sg4PGczbtb6Zt/VNovXDo0R/88kSAITC+xKnuhlxDVqsdUW+9s1yh+qd2PXGWo8NL8/f8p8QOvaAd9bqMUjr96F9l8T5AzTgyD0QeXvvZaaQfRpDZ48cAAPTNnH33UyIOGzhixyIQlvQcCPR/Dv6x/qbbwGBde4ZXQRVK06Djd6RYhMMW2ea8GTZqmjT2kr7vRxGtqu3U78JBxO+OzBAzWL8Z9LN3nn/fasFmAEy+p3AR9m8pm/nL02X5eX7vkAR+tW8GOHO3LXX16k9ERzgy9U8OQ8zZo/nC7f68mCF7CLS5S2BjlAyaWVFNzznizFFUr2V3VQyeX7bEfauXMGLnjaiotP1VO/GWPl+GRnEtpguckdyrGvB5EPFj7gZwvvSEqsTq/7Y6X3aVp49Lrk7tV5iOCGzp5qxulN2dCp8z5wzp+HVyIDsGW2PummHmalJya2vwxnVp8CkX1Zf/YyFnkli4sLMKUGsKh7sMjeCPgY8YMedfhMTq/PEvt9p6nm/+HdFg/IL+sV7Gm7hyN2GiLGuKMSW+iadGWvKLZH3YJP6iHKPfhBQHPQ9a6Wjcoz4OAkTbynMZ/nTFhElRE7cccRB7YbtBCFLjBw7SXxvWMkvboVwW83zudjplPwptFpsP76U2H5tQAEFyiwQA+VWtp1enze0bpvdH/scbo9Kha37j9Ai75E89NRSzknLRnwaieqzZmLS1VbUtdfL2jKilCO3B/Dy+rbodayXMWdR/VgmGPLBfJ92p5+Li/3Rjh6T/eX522/zNcNdpKfYRhN39CKz3l6YKnGYBL8SluiwuBZhgme2qErsA5jt07jQIl/ujSZz21iWem1321O0JVPxvz9TT68Kd4ti+xIl0+N5pYO6/HWjU1Y2Wu+vHP5Wn7/JlYOXdwD9fNMhU/DWOglb16jweY6qST2AaEbbqr/DWNyf4FDcCOdGfKGujS4grX6k9yyqVooupZmdFsEm/pcyRP42Ly8jOoG6edZvXknWw1PxMSmIHLWM+dbg3eiyz8FSEXbuf9eA8zZcZCMiwuUuSbDnBM84W4jPQgI5rCOa/+v4T5NpjOiNA5bjuB516PxQuwgbBuxDIU/6Zzzd1nZCWJmXKMIw1bxJdA7XAfTTHVZZfBQFrmBtpmu8Dx7pxz411sSeOSfz+/wV3XTfJFBaG6wTOkrZTalgLLfklbqNhT74cwNR7HBIpc0u/+k/w604gsFzeDyvUzwPtOZDlr1lRZXduZRP7MwenmRrMzQsis3aUdNDBqlPqShH3Sg7O1KUGbF4NAZLGrMZL2cBPrcEAvCZ+hSVIth7g7Y0+ksxp3og8KTpOyP5JfHRKdsEBi35TXzyJA/pFaBf1cL5f1CoquU2aAs5xHol+XNgnOiOQE87FlbXt0zBudeCYUtXV9L6r28UMwy5MAIXTy7JZOfbhzMorP41S0t3NixCJ4tnIhiDvKvH8WW1gayx+ZdHFsYJpf20+P1M4Noevuv9HbjW0rc78YLnsah8DzmnxuEBS308G2OHSduW4z77nwjgZscHyo4OUhD3uJwCN08/fBX/Cgs2RWItYcraXBl/vnW37bITsFB2MWtUNJ0iwY/2ZZ+z1hAnSym4M6ZRD7RqrR5a095jI0TdU57It1tthKcf7khjMqQ/Up9pZCrZhj/5aM8qMtDWqE4n1f3aAVkrBuqqPg4C8uWn5TeO6dwcUQfmL5UhVfe+AMjor6RrU00Gqjb5HmlH4OoIWO5+8TFPLnUBisqu4h1QdKqwTfoy+w+mPDpH8z+806+PumiHHssCy6cs4Peqn/Ad/JBGBIYT+VXt9G6zufkw7bjOOX6KXg+4gT1Xxcn2eBIUIzW463fC2lf3248pXWFfM3bB76Xxkudj+zgy1ON8bzzC/lbV2/sGnWe5y1vhqf26kDf2foYmRWR5+ZyDmwNzOhkx2Ycu2Iizu3QUTFUdypop5zjPK3W+eeCLpPJsGjMaXaB13UeSPNfvGWBBXpdD+ErX1vhKj9ruuxbLo98o8kC2//5vOw7WT7doQ1PUovG1iVPYdroYh64szXbqvvy7bFr4T2+pkKvAOyh6SZVPxwDVZYvaGTdZX4R5c5iVuUnTH6bQsd6zmbXRInv5F2XHex08cJnA/wo1ZP4kZp0/aG35M5GtbukV9pzuTJjumz+fiI1XXvCZ6eE8twOGfizsgZelNeippktTzIaKZ51xAMhmqzkY/zR5/QspkC652CM45OsefGEElg8QwX3jWvLdY++UWS8sZJfrLFYQ0fOR6PAIVuZzcct67ZweGuDvDb22axusZvtZzjj3/WFktBEvvDvhhxla4hGLTV5ioUuZ0TXU6CBPmp6F8gjL3nh7FNloPUlhIV28pm8GF57KUXo5gQrNz8H/fHXuHnfy4oL507DfJ2tNHy9Fe60eiK1Wa6HWbuuoGfgTXy0aD7Y1d7lhwP8ebnLV0o84MuZyb1BNfuGFCvPl1T3bIfzk5MUm2cH0+ejziSwKedWCP/xAtfBiPojOOLiFfptFgY+J/zp/mcXrq39Tq/9T/HnpFj+tzCGfU2vyysUg/iOXgLl81bpdytXsDJ7S7mRkehtfhaSp8/FRXcuwyvt52DS5M8ia1R+YQbWb9oLO56cpszkk3khV1Ox4OUXuOZmg8UR2ZRmHM+m+w9Kwnsk5qDINT0wVKcI1vWvpbErl+PTtH+g6LRQsWD3HWz/uQd65GTmBvir8pDCHvBfx1jov6xKSnrsTj0071GXmAPY8/ZPyfTiTuz0+hcIT6PynIzoAFK5upw6ddfh3CUm2BjYT9YxGcb/2Tlz2oO/Ysa+HOOlimlN+8hdpS/3KWiL7bpGoss5Ncq+2Y8PZY3AR/sLsYehNs7Z2w46WF6htAJHafTqJ7DLcBBmlm1lo2aTsOTxdn43L4pynX7BHsfxmLKtPDen+BFGaXyGOXt3cfrZKLnj1H5K/wFYNkkmw1pIqQM2Y2BFNi255SZN3XwYqx/ekBeHd4c3vYxZuf+GOHWMW59EjROj6MmexXimxAlLMRNWDR6DBd1Ulc/z/L5Hk8u5LaidMhArj8fKY+ee51YJy3jNpp8gfEgLu+jDgOqe7HXyJbkuiGdw9yC9fXFcctsDxWx8u4ea3C9RBS0yLshqvqd5gvViDnrTxIJn7JM3h6osvYgb/PjfeHMa1asfnh/UnQI7jqakYgtePCOIhbch1UnGoboPlNnk+/Uq+fUp27gs+J3UGHgGJtaUk0OLBbLyvSPnW8Afk2QeOvIsiXyT5Vuv3A8vWousFEktI/Sh34UfeeJ9XnRRE3VvKzCoQBtF1yh5zTO4OY6v3u/EffKekV1DOHQzaYDClGmSVbc0WqLRD8sPW7LAIFX3bI+OARdgUGtzfLfaEV12J8Aon1b8w8UMt8wywkfxMZimN5OPLw7j6FB/e+FJmRbZUvP65/wywALTNxyXP317Sqb7rVjogIk7bEG3fbnI00nhr9VSQ+wSVvZBqI4zNxS68B/9l7D3dBrN1IzBx++/kuhHyvvYmcHLAJ2CVYRXrsGxSWrc9YoRblg4h4W/afzRueiSOQHFu4pTW1L4atZGyXVcZ/aTT0D7c6WKMTaFypmkfolBPDo1mMNdVyp9y3q7PPFqmiPZZxnhqS2m/PT+TOn722bgEx1CC7X2wtJVwdz5PnDna8EsvMkaafsVYq18oLeCstUNUdw5LO4+OuCbBCLz8u/RvUn990/Js/8AauyfIrpkHD9vu0WJEaJ5Ci5K8kKXF7ZQdlR3yA+XVMwbALyi+XQWWqLoV9g1xgg6WdyHu7UXYGniL6ky4xHodzRl07M1dKP9Kgo4YAOZZbrS+DthLPRkcSbG2wVRyL2pvCPBBJv3HT4kMj6ZdLTDJLlgk+Rv1Zm9X00h73spdHlqMia0OUD/LTykWHlEg10yb8MnY3Wu3N6BfebVkO9kKxy+a6fSK2xdF4ZrNq3m05Kq4Ks5vLexgVdt2omuKyI1Xzt6VXeY/wc/b6ch",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9796,version:2"
}
    