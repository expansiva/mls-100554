/// <mls shortName="pluginPullrequest" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginPullrequest",
    "type": "plugin",
    "group": "other",
    "tags": [
      "git",
      "pullrequest",
      "integration"
    ]
  },
  "references": {
    "plugins": [],
    "statesRO": [
      "mls.actual[5].project"
    ],
    "statesRW": [
      "error",
      "autoPrepare",
      "itens",
      "owner",
      "repo",
      "branch"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "_100554_pluginBaseModule",
      "_100554_libCommom"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct access to global 'mls' object without proper validation",
      "External URL opening with target='_blank' without rel='noopener noreferrer'"
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Links missing descriptive text for screen readers",
      "No ARIA labels for dynamic content updates",
      "Error messages should have proper ARIA live regions"
    ],
    "i18nWarnings": [],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para exibir pull requests abertos de um repositório Git, integrado ao sistema MLS",
    "goal": "Fornecer uma interface visual para visualizar e acessar pull requests abertos do projeto atual",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero visualizar todos os pull requests abertos do meu projeto para acompanhar o progresso das funcionalidades",
        "derivedRequirements": [
          {
            "description": "Implementar listagem de pull requests via API",
            "done": true,
            "comment": "Implementado através do método loadListPullRequest"
          },
          {
            "description": "Exibir informações básicas do PR (título, autor)",
            "done": true,
            "comment": "Implementado no renderItemListPull"
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero clicar em um pull request para abrir diretamente no navegador",
        "derivedRequirements": [
          {
            "description": "Implementar links clicáveis para cada PR",
            "done": true,
            "comment": "Links implementados com target='_blank'"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar filtros por status do PR (draft, ready for review)",
        "done": false,
        "comment": "Funcionalidade não implementada"
      },
      {
        "description": "Mostrar data de criação e última atualização do PR",
        "done": false,
        "comment": "Informações não exibidas atualmente"
      },
      {
        "description": "Implementar refresh automático da lista",
        "done": false,
        "comment": "Apenas carregamento manual no prepare()"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Melhorar tratamento de erro quando repositório não é encontrado",
        "done": false,
        "comment": "Erro genérico é exibido, poderia ser mais específico"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar indicadores visuais para PRs com conflitos",
        "done": false,
        "comment": "Não há diferenciação visual entre tipos de PR"
      },
      {
        "description": "Implementar paginação para repositórios com muitos PRs",
        "done": false,
        "comment": "Lista todos os PRs sem paginação"
      },
      {
        "description": "Adicionar suporte a múltiplos repositórios",
        "done": false,
        "comment": "Atualmente limitado ao repositório do projeto atual"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin displays open pull requests from a Git repository integrated with MLS.",
    "Its goal is to provide a visual interface for viewing and accessing open pull requests.",
    "Future requests include PR status filters, creation/update dates, and auto-refresh.",
    "Known bugs include generic error handling; enhancements suggest conflict indicators and pagination."
  ],
  "embedding": "eJwdl3dcT/8XxyMpDSlEGUlWw551z6mQkSgrspMZyaxQKGmXNkKkJCGFjD73nEJ2ZPvJTiF7i1J+7/v9qx73cz/v8RrP8/ioqQUVq6kFOaipqTkmDg3hy3+WovymQDp3wlOqvJAHe8ufkdvzcWxt0577/QliyyF7yfDAHsru9IpUc1uwXWhLSI9WQ/KMpb7nbOU+0jZW3zOI1aZn49v4WRgyoor6j34C+mc18fBuWx7ndhL8ciPYJyeZKpqOYNSW8KHNTr7+xZjHt0qDPpE/wPvgdvyf40IsPTNJGnp/Kbj56kLrng7SqYwe/O6KuWzW/yiZ/a0Cr+X3KGncWOy+7jSdf9+DZyz2At3M7rA7silXxr6Wb/pLHHuhD0+f2QnNCieyab9jNGNvPxxkp4ea6fmq44fXS+KZPKJ5nnxx1RhuOqsjlawchyfSj7JYh+tSz8PXCcXKvfhr854w/VADPT4r8V26DPWdqmwnmVXKFbtDcKyhOS19d4RsnCfB3kkquPZ5N9e23MN63s+kMvufZBXQl7faNzuTHJpIpWfu0sLvDRQ0ZA8szOpEo9v5YlqKK/5ot1qydQinG4W3VLPSe/NH3RNYrJFom2GYwQnNUCXuXWS86jrOnNUBFX3ejC2T5u83l6yKhvO6+hd8sHUqGFSfAH1LJ0UDqp+aC5k7RlKvmqaceLm7NCJ5EutZjGWbi72wxfd/IOcv5cU/6iDNqjkNfaUBd/+Vg5/dOu6z8eCQipLjnF5myOfeHcb7k0LA6/hCXuQzFYUWXHtLByLPn+JGL0ohuJEbHlvbmKOdHsr/zOai0IN8PnTjk1XI2asTOExqzTpLK+iv5x+a9/oMDH+9mc41jaMFyx6xwbElMPjCMSwvtuMVHzPJWEsHdoTH0KLqfvjmpS5ZDF9quyTbhNwXLsf5cxOo9wYruHI4lkU+CoWXql3Ne7GSz7iLPcm0X18Qa0rijDQ0sZxGWcVRZi8N7q1+i4KLhvHWze34Uc0WULLZ5VuK9LYykndHhmFU2T9Vm/eWsOL3cjLubYs7jWslnVeAH1+FqKb5h3FWagnEOd+Bzw8WknqXGdR4xn7u/u8xbn/VBLfYtuXWJ6qog7YGBhedlyucpgrNEmm19hYcds0Uf7TIRpPfKyBwUBcS58bLfQZSBCTSsvc5Sm/A1Hc4u/ZWV/UY9knaE6WOOkV68NohFLdd3YczTaJx0/r+HKruikuyd5Li3dqjobLTJJlflG3k/EP1MMndWgoO6MO6Hq2llCpNfDAkja0CjoHQjuNv/wK3aTl0wmsBVsYuZP/+PUUnT0l9JCOI1HBCp/I5uPr0VOy5wwDMXBPY13cYHF3oA6+0ilmcD4sO7Ob2n8woYII2xl3M5cUH0v7za26GhXi+D6btGYhfjNdRjx9x8pkOwaixtz9OmX4A4irisbf6eJjQaSHV9Q6GBZajFT7g4gMd8J9ZBXweP4yU/bysh8FnvXy0WF8A/SAJjA7uYNFL7nD6IT2qaSI1SrPhOaxPT6RWFPRTB7fff0eTno2nqX7NUPQZQwJzqX5nMX5qG4iupm+lJ1Iy678ZxN0nRsD94V6Y426FSu4vHWrBzyABNoZu4ja9mNxnZCodAOGTyJIe5LgfluJDdmDoWcAbfkXkU/NNpfTf3B8hYawrJ25J4d+GZry0aQvE+DkksgoDMJ4Uj16UNcjN93fhhEuWkn/hbSj7uk0wLBUr04Lw0LSDlJp0HwLkUvplsB/Ki4vEd4tsT+Wuke2GNWLxDq84lICZj92xyaJl3MhPW5U8LIgHRPtAnn+o5OnRiseUJbG4I7zXGcQ9G98F1JZB8V9kXJItR7FgIQqP4WQVg9AJtNo1E/8j/bSOYrfOHtLoFjlgWreIV8E/yJ9pKny1YLsrWZBh2JnHRAeTp0cyFVsPlT0zD5CiU0XTi5D15D51GXiQbbSGSgOdplHEpv30XufUf73eWbqL1Ras5uWrnPlAq90Q7LiIrvY9joJ39FG3v+jEFtnkkCE9i/ps42Qdo/gnsvda8Z8nPJ2E1r8iQZkVsyrPsdJrU98S8pizHRxL27OB1SWYW6SLo/SP0IWcJJDfDFA6Ziv6JhhoCBP6BHHjGV0g55kr9yx2wJxdqORS9NlI6Qvd6G/Nk4220/PR0zHH7KU0sbUJ1vVuVLSyWTgIToCYO+AYEcVrMBAWnQth7TltuW5KH6n1u57yVPNZdMCzFgQz+PPrILZ3GSM/3RkJCicLvZ8oWWesjJYdrmb8N+daLr9Pa+39UOQMDneeg1X2WqjR9aHN56TJGCA749XaaqFzV17yc60kfIbGbROhv8YYnNF1Kp8uilZmgtBgKN/5Hi/7/62E3dd3sMmiIE5vv5Ivn5rG+caxyNV9eXXf/vh4gwUKT+1En2l0CwvBwMMk5g5MNX8KoWdJ9DGHsnpvplbZ7fhJ5Df5zvcWnKZ/WMxoUw7dYPlfJ95XhXHXhtmSspdOxiFwCItHPlZN+stmQN6ipYiVOgr7WHnmd2MY53n/k9ZOfCyXrjaF5xZqOO/hberwP2uubmxAUWZxNNLJgz/vmAiuL7JhwE5/KvAfxGV2DrjRTOKuvZ7Bxey17E5fKer8CbTN6oU/MgVr++lir4td8din2ZQxL4jW3bPl64NHAxzpxp6tcuCSxUOKjb1HXaOCKMH9p2Sl5o8BbbTRqh65+P5zMAr7KC3rfx66fr5BfXKM8cGUCuq0Nxmm/9XkhemFUOubQStsVfLwPVHQ0OgEdDBCWhUSQBcqXblk7hc6fdYfjZ3bc3pRew7cnQHar9ZIg/ctR+0DVeIe3fGDqwFjr6ak/30+d6qYhaPjFvPydWOg9xg7vPkvzzb+7hO5ZPZgCOrRn3Z+8+Xt3d3Q83grava8MdYNSsRkWR9HlRbTs+xO2OiaCbodP8u/+03iWt/O8i+rGfzc2oZ7R7rAm5AlEDBtEl+ycOdP9yzQ5o0/F6qPwqjz/bGgcBO2jTrCTadYgd7Slpx2ej+G+EiScqaG4YGyx+1yTnD3xS1fdqLjua040HgPqSKeS0UGgzm3mz97lKXLuZ1CSRXaDf1078qKHwN+GaPeB2/2a2aCISvXMOg0Zru+xXj/9hVpcH0CN7dW57AaQ65aZwNCd/p3PoP9t/aTX9W1pZLZp8ESXNB05ggpskGbQwuG4+ZDiTzFzwuvaCfx+xt94Xjfo9LXx/togsVbyhq3EKw3P6BrJxdzI90qGpf2kH5eiuWNQUbovM2DxZ4wYYEDiTMqd+Obs6PltCEb8fgyDU77s0y+c+2WXD69EweYDCetuuZ0ZN9suaGJN9381xvX/9Dg02dr4FieC2s++yvNHR/Exi5uUOr3UOo5fCR5eMdgydwVKM4utWrYRY+en6Gnr/OV55QxfCBrpEhwtCqXBmwv4tDTf23zvEby/N3rQbK8TOn11jRsYzENdD+KXzosxdrT76XY2MnCq3dke3CRlPjoHjiq7YULnT341J8Ubnf3ozhPqOrJ3Lbc5HYih2wNg3zLUyA8p1Gl9lB44RT41CyBHt9jcEe1IwuPpWNjgrHENJvVnH9I6TMjsNeV2fC7twm9t9aDW1tG85BO2zCn/Jet03h3POTewc6wJhOrAr/Rp/6hoDUrk8JlmSbHqIvMJbPehw8w5eQ61MudSRMW/4HrdSt40dwcaJewnyMbOaL9qam0K9+af1k9JtENzNmeS0o+9m2KIe9jnhT47D1YFeWKMzyD3E4aWOG7XnTIRg6vdebQe8153e1g1Fl0T7z7kra6OOIcvWM8v1CXSgfo4wYPZxpbngdlQ9fByg2CkSK/dTal0NMhFte2MESO+x9OWd0HRRZo1dDjKld7dSWPtrZZR09fKd0s+ngTVCONSCNFll58PIjTpB2y6cyL0vj9t3jnB3Wa0K0PNrltCLpvT3DXD63YSq0GllhfgwHJGvxlnR6KjuP1qUlknjMCv3moMKLoB4g7899pYvYOvkJNT4Zh+kwt/riqNbRLfmp7UppDf75EQkoGcNwtc578aTvX6G6DFr6OCnv+O/fU36NxYeYqUvrSdJrI7U5T6DgtBrz1NPD7q4mQULDdRs15DQpP0aZCQ5Wlk0YzTGPwiGcZR5nps4P/ZRI5IIchp7ltlDXePGuKM87m0+iYPJKdbvLkPhXkMns0P0zNp8iGKBI9h6NvFrLQGy2MDDDO8KNK5ApnBHdi08AW8r7NF2WFFwONO2L5bi+2XbiHrxz9Aq+DjoHIIzuqP6S9NltA16pedp68HYXOlJERD5O8h9DSjzaY0aQrp7nFS2E2Myl12VMI8ZGpcbQ28/hRFNLbSp6pHsSCjzyr2Tclg9xm1FP6/tKYr2i3xM4hEfBzUT86OeQA3ijMFrmpEWvMwlfoKSn57z5wCos8UH3gTnjjOJ1rfCz5xvo2mJ0fhAob5zhpodAcJvc8SAEdAmW7Ab/5XLtqWcwP9Mrui+I7eKnbXj75IKHwr3yIFnR8ZBtaUELD2BVPBy9iwSR4bJds26TlEznBDVDogOfa5kHF8ggWbKCs5lNED0Lwz/fz4Kjujop/lw8P5uJtruQ89ZY0eE431RDPOdCqoR0KrXlCt3xcE65SHV9hh2qjJW57FeQtX0x4mt0ElavpGbhzbTyJTsk683dJyvteTWP5MBhg0o5o+JETgC18L4DwgASnaNaCZNnnpJltoXmi0id8mRiD761jUd9VEyvPOLHgC3Ze6Icm+iPY+G04K+srWg2VvgiG5UnK2oLbdHy1vzKv+E6zCjk67Il0ZfkLWr7uGnfc5abMVV4xXQMbHEpk98IzoNvjAobcMLJr8GjOZh5NWGQLlIwL3/BjS1ss9XPHZh2TSORAcDyRrnh3Z5NbBWx4Jom99UJ59rUKwWA9FH7A0qM50j29dMjdnIpiplC4SRv0WrwPZ13uAX++D1OyR29jwllO3ISbnq3DmXsb6Fz2o8LYX5bw4e1hOT92u9QyayqkX9mPs4dYYJdVHaV/qb9pip8uPNboKRsl3VFNXb0Ujq0ugkSdMMn/wlJ8sSQLP9oFchvt8bBJLZsOvjzOWvPfgl/9eNqzeA6ylSVfHrOU27vHU6P+5tzg2IP14gNhze80tLM3od5Dh+GqOd9lbTcNDhm+itwGTsLKfAMs07fALPkOnI5IlTvkeqDdxQB2TTwvR928RrP/Dcf2aqZ0rXFnnj53oeBKL741qBn+r9wYyw9qFW0435wnF92nimJfNOg1HfXeb4W1khcaLk+i2ue9eXhLgH1rNdlZ/gfhJgPxa0OYJE0wxQcqPXi0NQ83RObwpObf4euTafKAZfdxbrf94KV5Q+7efQAKLXC/zhfYv7Bx0TkfX84b2A3cpgaR/exurK9ZSz/UbTnxrTu0Db7BnctXo5zSiRsZ+GHF7+lSFxsbeq9WpRp5ZQJ0eH2Rg7uHo0eTGvCml1yimc5dxq/krc4BqP34NeTe9+BSs16U/nwmtnodz+enMhfGXufxzc7y4Vs9+XZ0udAzk6tupnFCshYfnxlGdXGGPMPAiVZ5JmPtgWtgseA6PdN+QT8+NOJu+YPkSTUqDtmzhb+EN2N38zKggFE4fWcpRrrfoAdfbksmxa/Ap7ZW8h0ngFJgzXF1T6lxZSieeeoFu0440ZzYdfh70xKIOLhEehp4CPrcrJH6Om2D63nzyHXaU/44NA1dA7R51DFjmvauWqqbkksB302x0r0TbbSJoSE6/Uk3KY2+XTTDVTvc+W+H0bzA6zMI/8kmdTF/y/xBqXCdN5gE0SPTpqi+UubkffpC/y7ceUAY5iS2xmVZlrivw09o6b0KP316JqecbYfT5mtyn69duLhW/MZ8OI+WbLwmb/5kxiGBU9Gh6zlZ+ECx4Y1QeIIt0rvgtelJcGT2PGq5dS+H9V1Gg5IH8kLjO3S73pxPvJPh8K1cqPlaQHk+0Ugj1EVfHSgi4TiIz6F9/Qa6NE4XBx7diu7mLiDeYdEN/JB/CUQHxJ2usPHoajnjxlTGK7t567IeuHq0LL3hHTh0tx3ACiu+k9vU7s+vNxCl1YcUP5o900SjQBPRGy85bWkQd5w1XGpSPYR6fCqT4s6vBYcPM0jkXhLn4IK5NiL/JZKzUSK/t3FSeoC1K5pSzdcBcoZ9BnmmmaE9rKN5PxOl4O6anPbIAicGMZnqHYA/vcfx9R1W/DTQEv2Wt+Nz8Z257k0IbXO5TX6XY2TRNZr/2AZ7r++O3fJP4ai1BXCjWwXMs/qf0mto7hmDEQn9INDQmpQeu/kMIbzSHteucUEl08E3U0ROroJ1jDVvrDDBFqdnosgNQngl1C17RauDO2FFRQZeDrkFjSNW032LwUK7XNjv6MYTRz1URbdogi6l2ehsZMhpX+fa9FQ/hLce+6FgDs8ekkPKWa0nXYbMU6a4a7cBrr+X9J/2Ig80+9IzGLM3maa8GsiLpkezzeY+/F49lJ2fWqO+RTaYn5eEpwNI731zXtorlwLLR2K7g7nQsEFP+FjGT07G4ayIkaQT7YQXTm9mz4AfdE/8iHGfeYJcA6Ig+88SfDvAiD/vOUcXUu7DwA5DeNDhj7a/tJbRS5tkWl55npt+0RWd/w4K527XZ7LlAQ1UlYXyjpi38tDdRXKT6SGY+bkJinxDgLWGwkwOzTwNc6qjiXT38DRdI1BhHhksKgaRW/po95esTV7SggvB5NO+Bx9s1xZ6nHxLwXbF0LhSg33Hx/G3GMAVSV3JQ7OtoqHUYqO/8FKXIw6+g7AlE/H2BTsS/IBx7UZIZ2tqSDAa6mc3AquLBtxvcYbCfc5/pUXKfvGrHtPXAymyw4fHdOjNKzpa1IPbBo+Tqp3LsHDyG3l7a29Fb6ib0hMsW+fR5THv4da4oaI7E6ngWxzNcp0Lghlov12HRRbQO6wjmZxvKr9f1UtVpRWCoQO20qZnf+jCxjQc3XSJtKx+l1xqdpSMpi8DwTDM/+vAM/dupMftF1Bzh+fyv92pUn9eBeOO7OKf60+zcu5XXXxg9zxrCjQ88p8Wt561wZOffVjz41JcWe0LnQ2nwYDBCYIH+0Et5CwW93lK5+IzaL53PJttMWfBdup4M5bEbCGf2vWY3e+WdMboJt2c/4c+XG4g4QGeNNhNitYv+p6VW18/LVm6JIN1VRrunZCN1VtO4BeX/YoXLO6DrTXSoNm4vqCpb8wPTntjtaEX3VljhkkeD+BK7TjpRV8H3Lc2nDvtmiHm8UlZsIaslnWCXu610M3/NpRnLUIxC3C6VWfZ6slVFrOXP53ZScIfHNQ1BpSuRm/KpcGdl7JD82by8H0rWdVkTOFJg/YQmLmZx/Qcw8I36bvvFjm/ZAb23TQd7X2fwY/kFtL4ndvEWbug0tHL3jvAPPIBPCkrUb1rbYJbR/ewG2w/Ej12vyWTPR/JcbkLpnYhonI/WJ95BCrrW+P3R3M4K7yQPnskYfqRx6qb7jshRvMF3TnSHH/1mkxNBUtHQDl6DtoE0T/647xDhM1/utCoTv242nEZ1WdexgVRq3GepjU57DAUe3lx1wEeeK3kKd19oIXe/xbCId8SMPRIwA2T4zHg1EPp2pIWPHfZNqgriZenjiqG5C8tuMDOSrXFO1k+um0Y39u7Ele6NKaSibp4tdkmHha3Xc45OITGHrsuvf6yFpyyd5HF3wS5Y/EHm9RnJlLXIY0p6ZIRZFX14KyhO8jG3JTV3A5D0qB+PHhKMpcObidVtTgPt53rqc3hKB534Te8PjSVjdemoHurMQg9b+ElJwMc1q8HPrihh8snPZbLzRrjmhGaHBuQxt8KNOV/Vfq4rr8B25WGc8nP3azs8S88nTe/OoRW27Ll3WvzMcXoLT3flM1lVTOxrOoJtX8+kN/MH4Q/s5egcq8SLSduUKXwV4druKJLBF/N78suKVnkPjuWGts04VrXu1w0vzHsMIjn1gUaOGVAEh1MieEczzZ8RL+clpRvVQ14P4GscybxZ/X9JPaQhH6ym7Yxn21ow6c6ekJN3WxY4HiHPuju5dnGGTC03XQ81fEl1lQft92edofnczUc2BPORSb22O+olaysLfJCumcOynWd1LB/39Wofc8VPxe+oCL/XtDZMo/MWlbAhXa+UubIleyfMg2vbSAa+Wswt6p0Z7uCQrnv0wZp5VdD0vrRlnOvDubyhA7i72kynLmcmu8OBvtgR8rYoEVN7qbKtSlreFZOGI/MN7J9uChTCsRh/OrpdTk12IpKk7VB6M5T9/cC9awN/PskUpeNmSAypOwp/brfFIdVz8e8eTf4prsJX7a4QraHtDjceIo8asM+KnF5RwscJ6K9ZA5mqpYQv6qzPKJShwND5tFaz/nUaVYXFnmiqCA/Lo2vBrdcC1x4Jk46HLGcD6bocsjeZnwvMwneBGwh6DlefKcKDOKq6LdhLvQ+3Q33r9GjEq2rZ9Sz6ulbQTg20xzBVd1bcGLeFdXhYS7yiss78G/8LtA2+Sq98X+JJhlxaLTBh89LduyqMRQ8hrend6VT2Jo2yYcjPsPnQg+YOG0geuk24aVOlux21k1OT+2NdgU28KiRDSr52PS//8lKVk9sGYsi/4qOLLomPjsGtanboLtvDw761BVXZbvyqYcO1PxlBvc8uw8Kfkei6AUH7X8J+xaqKLoinMa0GcynOjfBjP4X/8uL6TpnTPjphdMiNPnkxVb8PdgQS+MXg76XrsjATRLnp3MFk8ljyhUyvu2JF+9PgvrMUWTiPpZEnki9aRwWmRTjpG5nIWNDBL6MdIe5Xj+gfdepGNe6PwyfmQGKh3o+CwqNBo8Dr4ldybJbDB5vdQye24SRyBa0tFhPL8Yeh/99XyAvKpXZ4q8BC17gXotWeD54DrfOn8fj236kRaUSKGfT6BPJih7Ce1D6dHvIbc5Uu4VNT4zn4RkleL2oCYueyH+uR8MNywZI7QJ0vkciBfvG0RDdCRB+t8C23fVmaFKdLx8b1Q2WBJqy9jlz2v4mhaK27KBys82s8OX1hChxN3v6NMiYvHS3cMZHc/K74sI+DnmksHX8HWc+JFeRyn4uDvsQJhk4lUDtr1C6bNQebMelkqJh10927OByE260uUM8bgC7fGv1nx/pqXmU47ldaMN0eFiZJPJPQifbG5Yb+albTy7bI4PgGqYOXoznfE5gVrgNhxw/KTkWJrA/xODR7325cso8OKkzCGcstsOFDfnUb7E2+aT+JZEnkYOzGBvQAds2eUib7X7Dgvdb+MDkC5JquDopHol+235KiuD4mwmgsq8A0Qfq0lyLri2JR5ug5lznuQnjZkyWrm0AhdN4fW6KkkPqp7NLHhS6CMdYzsPI+qNkL2VKgp2Ul/MJRAdZ8IRFD7nf/GpZdEPxEL5GxaLQDcbWLKP/1YSzo0VPON6qL0v+STDX/C49GjVdfj5wPo7rql007sJa9kkNxMMxCSzuBN/07sPl5W9hUGQznDX6p9S7fhT2GqXDJhn6iv9y7Dk7UvstYZW5D/UaFU1V19LZ9ksOVPhZo8iZwhV23pOuzCj6F9JAc1t0Z4WXCvf/bB7Nsz5ny155yapzBfdgkcFTMbNmkZgbmDd+Hx6S55OYi+xcNRQbP/wGYfOM5dvOG2hg405o4TYHjKPPKVzi8e315ch0+/+4t1xPJXkfSKVlq7uwkq+69rPRqUk0vvH3xLF1+nbp3wJtRQ8V9pDVdyO8GHecxJog+IoT9j6gw2+DWMxoMD/WVuELmx/bAYbqnfnDAm8WXKHpbonUxWwAbq9cjbZfLPhnux7KbJcPPs7F9X/XkZ2BBX0Je0//B6uUqaE=",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9772,version:2"
}
    