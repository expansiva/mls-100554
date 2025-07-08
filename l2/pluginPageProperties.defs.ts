/// <mls shortName="pluginPageProperties" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginPageProperties",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "elementAttributes"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_serviceBase"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Uso de iframe.contentDocument e manipulação direta do DOM pode abrir brechas de segurança, especialmente se o conteúdo do iframe não for totalmente controlado.",
      "Acesso a parent.info.element.getAtributtes() e getAttribute pode ser problemático se o objeto não for validado.",
      "Não há sanitização explícita dos valores exibidos nos inputs, o que pode ser um vetor de XSS se os atributos forem manipuláveis externamente."
    ],
    "unusedImports": [
      "css",
      "svg",
      "queryAll"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Os inputs gerados dinamicamente não possuem labels associados, o que pode prejudicar a acessibilidade.",
      "Não há uso de atributos aria-* ou tabindex para melhorar navegação por teclado.",
      "O contraste de cores parece adequado devido ao uso de tokens de cor, mas recomenda-se validar com ferramentas automáticas.",
      "O HTML gerado não possui roles ou landmarks semânticos além de <ul> e <li>."
    ],
    "i18nWarnings": [
      "O texto do botão ou placeholder dos inputs não está internacionalizado (embora não haja placeholder explícito, se for adicionado deve ser i18n).",
      "O título <h3> está corretamente internacionalizado.",
      "O título do HTML <h1> não está internacionalizado."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Este plugin exibe e permite editar atributos de elementos de um serviço, buscando-os dinamicamente via DOM dentro de um iframe. É utilizado para inspeção e edição rápida de propriedades de componentes em contexto de preview de serviço.",
    "goal": "Permitir que usuários visualizem e editem atributos de elementos de um serviço de forma dinâmica e segura, facilitando a customização e inspeção de componentes.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar os atributos de um elemento selecionado para poder inspecionar e editar rapidamente suas propriedades.",
        "derivedRequirements": [
          {
            "description": "Buscar atributos do elemento selecionado dentro do preview do serviço.",
            "done": true,
            "comment": "Implementado no método getMyAttributes."
          },
          {
            "description": "Exibir os atributos em uma lista editável.",
            "done": true,
            "comment": "Implementado em createItens e renderItem."
          },
          {
            "description": "Internacionalizar mensagens de feedback.",
            "done": true,
            "comment": "Mensagens de ausência de itens estão internacionalizadas."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar labels aos inputs para melhorar acessibilidade.",
        "done": false,
        "comment": "Inputs ainda não possuem labels associados."
      },
      {
        "description": "Permitir edição e salvamento dos atributos diretamente na interface.",
        "done": false,
        "comment": "Inputs exibem valores, mas não há lógica de persistência implementada."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir possíveis falhas ao acessar elementos do DOM caso a estrutura do iframe mude.",
        "done": false,
        "comment": "A navegação DOM é frágil e pode quebrar se a estrutura mudar."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar suporte a mais idiomas além de pt e en.",
        "done": false,
        "comment": "Atualmente só há suporte para pt e en."
      },
      {
        "description": "Melhorar tratamento de erros ao buscar atributos.",
        "done": false,
        "comment": "Não há tratamento robusto de erros em getMyAttributes."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin displays and allows editing of element attributes from a service preview, fetching them dynamically via DOM inside an iframe. It is used for quick inspection and editing of component properties.",
    "The main goal is to let users view and edit attributes of a service element dynamically and safely, supporting customization and inspection.",
    "Future requests include adding labels for accessibility, enabling direct attribute editing and saving, and supporting more languages.",
    "Known bugs involve fragile DOM navigation and lack of robust error handling when fetching attributes."
  ],
  "embedding": "eJwdl3c81f8Xx42kjBahImSkNKXifs5BqVQSLQ2lpPVNW0WUyMgIKVJRRmVES5PPOUoT0d6aQnvXt+nb731/f3jc697347zPeL5e53NVVMJPq6iEu6ioqAzb4jGCpQ7X8WCfqWxd3SC3PJ6g0K/Rh8d/VGHIIztYbKYDaxwGlQ371x5VIjdy1zDGk74ZZJ5+WrZodqF2Xe7ALMtLkuv324rgd8EYEqWPhWXhHJPphJMadbD1ri/ylHtZ9Hf3Ii5Ibe8Q7aNNxZWTpaAYb5xl6cavFV2cZrIlLI1JBKPt6aSTcQTy0+ykZ+Uh4rsM+juoBzVhGIVkTeEfixbA6AoD3mDcGdarG+Hm9RH4K+AS/LPUA0+7mimeTzIg950t6e3EcjAaU0qtrvbBxZIXSRc/w7WkpfycHGDlrdV4PXEsbTDeyXM/FOCh3qf445NEOO2azQ13/4DxnM4o7uNJ1i7oUfifbNtnr1ybp8lT7pnimfaNdFzvMenZ35P1BwymkRFR8nJ5JQTdsMdM91qOVXPhzHRb1jC5KpuuM5bCvAzhQsUG7vXnZZlep1Qyf26Ct/KuUZ3l0TL73mOwz9YoHGWvUa77z79kHN+aTQwzcGCvItxVspSDHe/y12jzMoctxfj4k3dZO+sIuajj3bLkF8O4/ywbavX6M5efaMN+TgvZ0+cxlRf5Q2fLVhwcPRDCTJvJrJ8J7uk3nvv+suZjAa2w27auMPrhA3loURAtyGnFw2fc5Re3y6jI7zirZ8axw5ZeIGog3bElODe2JT+wmshrrm/FOWDDqzYGoYHqWp4Y6Aw+n3KkN+8yJMeUBAxr4cg/vSJ51akUsituSWMLHkkNrdJZdVwNWIwy5UkP/HiZYxtu33kgH5s1g7fs2ItWf7LQ68tOzmjoyYIf9nTZyTZrz1NefX8S3JDnV4mkoj586GIaDLbVQvPnu9jcW0favHO4bKfXg0dv/gMNFnVwbHgnel/mjBPOOOHBkJMk6oLQwWl488tV6F51Dv6Z2Jrz00pwxooXlPCgDUcNQva1eimvbRdNmsZ9eHl2P9QaeBiegj5PdnkOGz1PC26clDNU8otNcdPheuIV+f0aHRwQ4o69nlniwfoQWmTeG2NP+KGoSTGT95L7ynTa1/cIFeufgKZuZXB4jQH6au1V3im0kEriHLx+T6BktvD3Udk/Lp/bzbfnrWP24SJYToEtS6hnqAV2n50jv8r1xVcbO/PjOx34UG8HupWgAzMm76GwAB9S6K3Aer7vqMyx+Vp3/LFrA4YO7gh/ro/kumXtwd2mFOJUTeniSnXUjPRCj28PIa0kT06x21A6qo3B/7Xi8W06pzRZAKsnsdAReluZlgl9yKqDWjkp6z7Tfi6KXGnUo99yiYamfH1FPAiOBSMD4VBaKJq7P1P2mDaPfUEvYAYaHa2Dte00UKmbSY2buPDQbXAs9sSognisfNCCu8yVUFdtYtm3rPN89JQmGkzRkLvcjWX9F1MwtOVvKDLbwKsDOsALt1hFvwPd8d833WhPQyCGX59Ob7ONQf2kBz6J20pyz93yGI+N2LnTIyq+qYZw4ToI5iDg9liqb+2g5B6n7XNF53Nt0VC7JeSPmshmDeXytwlN0BxVRTfzP9HRLdtlv7tusG1uPtZWuOOHxS6kstudlO8HPq2RZneL5snuSZxkP4wfxR/jed7udGBWalmY6ToU93Do+Ps0Lq+LZH3IDA46tuDy7xXw6kBrrrMcwGMLZvDwBRsk+941sHdtP5FHMo1N7ERZczzx+2tVbLzjw7d1A9noqA8s7DZWppQzJNiEI2519LtrpZyiuoCV9xQaBLPwBGh/xVv23p7IqZ1fU9CNY9IH83r59tRxVJCaAn1/5fGyd31x7gcbsOmYi39M8gWTB9gudBHvHl2Mr2fFCzaPUwvPeBJnqM75u8J0TwIrPTHytS/n9dmM5SeSoKgqGKu+VZLSo1cHbGHxHkatOqX0R/Zb2gJFD2gWRfIOu8t0rucLZWzwLb8Ak6zPKGz7WMr5zzbj3Mlv6cRFXyoL2qXUnFzR7rzwz5104+syTn5xno4FxMLxH52wy91W5Xf2HQJD7Ri+O+UwCv7Rpl8T6P6zGkqeGOIqs0mc1Vwszu5A/lEvLaAxqPSDye5tyOGxFkZEzcDeTyNRx/OmrPx8VJtt3Falg5INMPCYhq6+wVi//De4utrzpg1zcNsRDX5ySE14hwkkdBnKR36v5ZcfHpFb28GUbmTD4dH/UeiMFvzk40DO/LuE3a6oc/yCCqo436iMxU+1f4G85Zm80dMZRDx4NEoV1zicUM4RO+6cqri5qbfwxQK5UU5H03WZYNNvntDVHhC+jZVDK+lE0U5+ezFB3rv2sKTmZcuaxgel82ctlLuODj2bSt2rXHlQcBzX6u6nkT1DWcvrK9QvDyV/HIWs3gbFHnO6eU+b2234ISlrdFVT5TF1pXKDhQ892LQav0WF06Dg1phw1Z9Wltqx2LkkPJs+mg0BYyNC4cV8c9MBzr68HNftMsDPMWdhXm6hdHdvG2iUDbH6a3cSe4YDx7fD0lUa2MNE1al6TTp1TvsMmutrIC1kJcxRaLPVCj3ps/CFVSfvSsnTE/H4ek9eXRWA7nrteffwCDJ1mUUb/dugZdch2BhL0nPXgXjpxERUXxtJiyEVV28LRoMtPbipcbt0/KY558S3wu2nf5eNvCK8+ctJrJ+jz/JmC5yd059K7yyEu186Ozirr4OufqfJbv8UeX+AHTWnGnHLan25Se7LZ3uNQL19zdQ29xh01G6AfsNWYPtZ/8qNN6MoIvqAvPVRe8j/MhjPzXRk5V+WZTdUPVstn7bTxIA7B7jf803407irtNz5EY06sJ/v9d2OX/VvsevHArg/O4E/q52BF+9zYUGJBtTofoSsQx8p+fE4epjfgW9F9cTAfa6slhNAWkPbKmuj7PrnVP27jq6M/w7pTx+whc4B+av+RDa8YAxjBzsqvn5ZSfsNZ7G/5nauWpZII0NOwlVLDTzQQgdntpqC5X/18HeLKp6R+4mejleBtrn2mH9jCu5P68LF60ZwYeRGEn3GlWrZlHsxGmpTB0LaByt+XJpHJsWa5dOOEPeo6sOzb+2lMVZWuEI8nHHuSRnLV0mzJHd8NTGOV94bxGekFDj9wgmMPW3ZOfggJ9tZcmhlEV93tlBc/2cTW4Wa0OLUpbjexXpQv2GfUf2WL3cM7yjDk4m4/FgS36heDh1eyLQ1zhk+tIqAEQv2SO9vJyq+ul2SRF6sbtOf96pFgoiF4i6Oqj6G5r+2846detymLI6nGPnzu9yd0vA4Nbz7Zy9qdGoiB/v50swXwfLrAfsVyt74LSmXlLX0NhvNIlf+MvAohPlpOHa4OJ2fBL2k2/6XKUz3KIsccfjMTnzwrIccl5WAwV79Fcdv5tDY5/Oo/O9WjFP5BAa0Be9U9ech8WdBfXxnTgv5CtWeB/lTaAj0XplJlfPVuecfc+40ez2+3bHZ0VHuxZ88YmGLdw0NdC2ByDdb0WpfDKxpEwiXbFviMp3XsCwiAx5OcOECa1t2nD8Nji6W2NizSDk3rnzlxi6DPsqjHH6WhekO4PuztTG00hYmde8DYxMSFHuutoVFA7R42hFgMWPuFOnLG9sSWqT/poWeC9hxRCiurnoj6QclyCFPVShliTlnJlRSmF+0dMglDtbm14BSU9ruO6C0J8qm5RlS0oRIHKz6FUxT7fit5Uxu3tWNHz3Q4JYVWvgjYCl+XZAn7f50kIS+aeP76Si/DMNXxXO448wTUt+YwxzVdSPZ1p0loUfQfRmKhh+i8UpeFd21biPrDTOCH3r68q2o/WRnGq9Qfid6DNhhpNTbrJq23NrI4nu8GOmH98uayj60UsWB6VH8Pn447EiJwwcBaSi0JGKHSlFfTTgk7RT/Y7wKvzuslRS1LrwgNhP1lkTIe0KZp2YV0KxkEzLyegNH1rZEtW+IJYqRHGt+jTrOHISTHc9SjPxKit0WgU8uKzi5/XDcvbYZzgzrwotfDoGPH4vQLHAC7T14GLD8GyhZVfvG3OudN3q0GEGOI35DRnF39tqVxd9Cyvjyhhxc9+A0hLyKZ78lTiTOQr/nOixeyXdCNjurN8vLtx7iXR3ayEkT1HHlvROQ7xbPLpOvknVUdx5p3QiNhV24hY8lxcSu5smOQxXjk24p+SVlb8UMYdRdPdY6P4GvRi/E6UN0pNqXmjzdQY2byyNg9etqhW+PwZSXNRc72+vydy0t9r09h9IybkLR6JvSXZMoChz3SRb+R8K/uKgyCS4XxytuHdRD2zJ/6ldqwc0L+6JDbCl1mR+OmYP/pXc16rzQ8yWdWRIFd6qOoNmlfcKvdTmmXxdcdPwK6YRtYvt2zqTsq/BJnNupGIR+cemvSbCs9yg0cLoLKUFF6OfxBAqOrOHvDn9oxYpr0sSRuvzQzo8SzTbz/bJ5+HN3Paze9gOEl+ONFduwk2pnnjcmC75uSSbh4Wy4vJou/uhA4n7FjNEG3D+oEVLJDmtTj7OkYo+if8rc8M2nN3Cv7oLknGvIpqklUt3fdyT8Gqt/++A1nX6czJ8h5uFIJbNskR6K544moGX1e1gX8w5yM41536LP3FlrL1xY7oFmn5KEBkpAycTHzKmlJ1L8cUmX47zddxuGDGmC0rC2bFs3lHVmHCDhyzhevSWa9KmhYK8j3NDNm5L+HpaLRk8g990z6VVxA3BNNvvPDESLN7XSi7YbaLqhBYrZkPAqFPeg2JPYQnEB68xqoZPqTtxQ3xo3J4dTSdJO+GMgnjEyDFhrz0rWtA2Bltm2mBJki9P+RIFyf7V2jGa/s5tJp6eCV2n3ZMEPJdvtpbkX7kuzb1nyT+PdUoFXKl7r3dbJpHgjHPHJlwM/auMzHy34df02bXpnDB4tLmKTfIiePboCJmv0WelJylg5W7dwfwMVPFqhi7G162hQdhIvGd4VY829xI5cjWVH1FDz5m76MnAAxPTLgD75yTyn6RQ8vvyQFodF4suojTipcwzN2d4sjXuygHY5LIfrhpnS36Qd1GCkTb+mL4S/SZ04Y24N7Yk25X8nuHHTm74w70oo7giyQevSl/By9S9Jx/WBVBShwfphxaAf1gtaXCmj5c41cvf1XXhz1GGwWqwFX7I+0ogTKzgxdj1PPflMnmfgjb80u2J+YQWc22WDXuf/IZ33iYo5TydTYO+PNLmB4OA8SToy8Qmlfiym2OKTODVmA4yLz4Tluft44t8Yad6V36DRP1Xy8SqlKBeJYcIh0m2dSKt75HCP452wZKkvz579F7psXgEeXc24YfFd2j69kIr7IXfSsIF2h+6wR+BbeZX/EtTzP1DaJVIFB+kn8ba4Fiji0zWzeLrrzTzDwld2u74cVdchrw57J+16bsm8fSIN/6+GvauYPwz4KtkMHoLV30dy+ODt9Ov0Oc7tdpHj6wdygIqtPL6qFVtGLpQK3TeSyEXxrqCQXOd+k76fyObd/+2BKZmzMfRwJkc+ekbtV8Xx3xHOeDizlIJnmqLIRZ45dTquN+7EzVO6lAc9G8Etl6nwxLod/M1hJKTPTecVz1I49/Qi/vjTGtdJ8/l2vgZP9orCrYkTUNumTv5bEkPj93Xh9aWn6UxqNM+kgbwjoyPsn9cSVf7OgepD73FpRaB8aqUdR+T7U/aUZCpN7s8TGjbyC5/fJGLAjgcRbLOzM1aHJePSRfmkflSmhOMPYJu1Lb5r/kZofQsqWoxjF/1gnNzLkNcvn0tDp6hzmJUmJzTbAy7pg7v/swCDe4acE5hEHkMTSeQqHXacRecaN2Dgn3a8dsFZ2WOorlx7dRO72buzVZMrd0u7yLUqb0HMnss+a6FZUxI4jN6E4jNpaeuxdDjTUTBXXHbxvRW+D70iu2VvkZY9XMHsFUL2Ax5ytI9CqvLfDDF9nkjXpdbc9XA7vD/sGebdyZREHOn8qXy+sKwWWgT4cZWzBZ3bVcBLN6eCa+VYjLQiWNDiF7VZc4+KIqLJ7/NR1tKdzp0XqKLPuyeKsxsKodLSkgrOnyGnty3R2NuKp+VEoGC3VJN8OWlsCenkHeU7uw0xzLuJBG/YcLw/HbEIZ7fsDvhz7zD8NyOHdp8YVTb0wFU5wNKI/G3sYMCswST4pOW5Vnw70qjscodKSf/mj7KpMWqwT94lh99yosOtVDl1QgyHlGph+KaG/zP0btZVOlE3jSec6Yzyhb70vDkB/2AmJQ4YgFvahrLBsf3ywsYiMhg3DlxOF+EN71aS3PmPpORh5NuPJGqjtCXReKr9fbQPPSH3uN9SElrE9r37knmIG30/YQbZ9t2o7fd+2Jk9cKvDRppwZidlqH0Bl6BxKDwDm6dkYHfjoWw33IFGd1uKF7qoYszqUgj8sxnab/hNDi/saOJWZ+ox/gx8116Mg2uOktdWLbBYEMB+nwfQszn26H9hCn78mUdGrwtgrdkCPJMThLP3T+UxUxbTys1V9PjydJzk3qhkj4UPsTu+R61TbflVVgzW14u99zgZ5qcePHXDLoOPtRqkZBH3BZ4rEzOjO2dboGBb8CvBP/NvlglOuGJ+T7n5wAsaHV0JK6a5U8Ck75B0JIHmuPYX+kbpq0mV4j/bM2VKzxO58pG/Hfj9uQISecK0dfq4cZSvlKN5iYzaGPD+oTtwXkVrtI0tpzWGwzkyNg0/bKsld522yK6t5MqK0ZQT2AaXO4/BgF3jBHsegqWZEHhvDy/ZsYFrjiXCfT01Tv95FXIXmtH8h7GwJO8rDTB6BIIrFr2UVK5ES732sGTbVoN1K0oos3IfvFlRRBOCXXjYcw/KOJAnJRyfxp6FryX/ZTpoHRuHM1tshilu2yTFbW8Ydacdvi7TANEf+bqhMRVnRvHFQSrcy+c5tetwmIQ2aODPJHK1NzgVtUefTS8nl7abFo/LivTEbz5v3tozhE/EJFGl5V55esApEGxRVicLCHn9ij45bFXOFLOuV1Lc+um4UBHMjVbNYNbUBsXs0SHrHjn/DOZuxony5Q4jMW2JBqqbqqN2gj0Oe14LquuYI8Yb4p7oLDByXkWriiqFbry566Y9DNq3edtoIxb7QLkHqLD7TvQsXEiCX/wwRBU0JkVg4pt7ILxWfnn/JrdNnQz09CAU1z6H+5tk/mWrXV6RYIhdN1nw3N93YNO1qZzy9TeaLN/LvVoastp2koIW6MIAoxmYe/otXfEfLtdZ6cGds1Fo6zJHfLYIlB7793kjLNxwg4pr/Vn0Dl9PLgaNmKfSvVsdWW3gc7z7SJ0n9mtSZMctIdNho1jols3tFrPtm3RW1l5fr0Ni3+Csu8dInFdYjdpFYs/hD+u3kGf7iseom9M6rViRWyhZzzGGTzWX0eBeOg3z7MiX8i7LQn+8p1BHuVvls3kGbNf8iITH0rfwbo5ibrgx5RQ0GCXgEIxCOBEr/e5mAmKvih3XGy+vMi9bG+VF8eovMET1ENbOdce/k7LguUcQHFvsB4HuI/mp2zGaD1rYvDMFTe4u5tDr5hT0uLs8Y/VcFq9oyX7gHtcBtUv6cMngFMgcvhCnHv0hr426Bl0mjsFZ5cl8o9KE/0YXgzK+V8gyfH+xGtb4VWFY/mQ+rnsJHYMy6b/jjpjUJQoCLizBTDtzfHjsFoQem6GYXbifwu7OIfUjW+TFA92ksF5pcsu9Opg281/J+ds2uGIUAqsS9HC101k5adsIUnH0ofSJOtLV23t4q049PYxykyK1emK9aQyXXhsAP7IcSPvCd7rQdj2v01zB1u1WU88zncD5QmuO+BXA/VeHw/ujqmzdXCzr3j7Ozq1m4SBKYjffYhyztwx23YhBx7PjMKW0loYFlODwungYvBTxYk0Br72vUh70OJ+3wAcYl7WVfdU3cJ1qHtss1uDfZ53ZJzgCN3dagP2cUhXzTUdwg6IP377yVHFF4wiJvvLn0vMwb5EhFra/waKv/HtfKL3zXoGiz6yXrcrVl1R53OCdLGYkq/e6zSrl2+VtUTv4/DNd3uq3hWouNJKPxTgRcxaI+DjCNYoqHKvkOX/K4e/2VfjMsDvo3h4ouV4ew6K3UPxJDT1W9uZrseP5wzbGOxbtsfC/WKzw1uWw8xnc+tJWFDXya6++ODQ8nbIS9dFqxiVS27SU87ST8XTTMYio9i177x4Lpm4XBUN98caPnlxUaoDQeI+UvXzqZs95XadQ0KePVDDkCa0ZG45iPiBmTYotw1i1cAB0cGil8G1iyf+ZAUcN3QbLbCrIbfm3sgUfHKDt8CT+AvNIxKSr+0SS0U5w6PtwHHUlise/rpRcgk9BXYMfO4z/Cbu3h8E/39Px6GtnzCkgNPz0E3S6aZab/fpKN+qa6NqjDbLoHYkZwCVQZcOKRahk5NOSZHIbsgAyZh+kA7fKQfQC1NbkSWfe6/GFP8dJWb/gBu169KXCeWrc8+ZsurlAnV+FAz/W/Iccz16nvMBY6B9XRVr1MuUezqAshwbwvFRBXfOfwsj2dXBn900oyYonxezBPDW7L5Vf3oSB1zTkRD0reNG8E+ctSkfN0/ZksziaG/e3hLmZe0UO1tT47iE88HOBscPMcEr0RsjTbotPpzVD3ICV0HVOPEYnulNNfSFl36tiMWtyvVwj91D/CGsnnpMFH9C3ZQHMOdKap7mk4XBtI6VG8WGONo3Zq+CY3kfkG/3SydEtGT/HnZSrV1yn9iqZgrvfZUv3mZZ9rVITd63jlf+tFuxF4GPLAyh6TrfldI561yidn+6FaWsVPKDYC+b8cWLP72O5c0MgDXg4A2NcfjkkHY2na7rtqHzEVTo4eRaklHqgfkKm9OzXbPR/tk1SSUqgEUmlcvvt3aQUJ22Yco0gvxxp1JUWYL5zGju03QPqo3aAztxHNLK9Dwa1Gci5I7tRTO/+8PhrFlmGaLNG5gHMvqBCQ426gt1Pc+l0k730PaodDc6qLrWqj6LYwzeU2pLEeR4ysoiM/MbjhV7npF9PIlHUCVr1Evtvmid60Z8232mPOz9Pol3Hh7KYG504UExGTcmOcWZFJObMOuNTGTo2lTk5LJYvtkgD61pTvrSoDZw50Z1XydkUHKaLYq4coh9M4YaHIeJkRwwosRLeNJQ3fIjgssjZSi+lDQvPi3x3Q23alNIrA514608jfNG7gM4fCQfhM/Slxy4p2ECfbbwqaN3g9dIbdV9yvjeelRy5ZjjTxnaLxe+LNiT8ExLd23NT4lnFJlc7ObX4Ej4NqqD7FdNQeC4JhjC0dRs+V2jOBrZqKLwUNT8MwQLfPfBxkAV5hXyUxbxx7fKN3K6jKt4PiyKNRdnCX0ylOC8H/jhojzw8MIWbZgzkw+lFpULrwmMvkmCC8t6PxqrkjsLrluJ6N4SOX9JInIHeXRJl4Z1wyXM03gytgcYO4bDaJ4ZzCgBaJXcXLMbhOstBFKm1H46WlXD61SvwYV4/jjT5AsI7UPxPol/UOceEhwXYyZuXbOeUOBec2FMfox5kKt55f4bC/1qVF5u3E7soBz0bolkwhB6T/0HDx/0kmwHryH/6fXJONOFJul6c6xOAIf2JjZracscl9+QGrRy5LLKeXAqGs9AQ5fq8gd7brrKdToDYUb3I4oEVT5odztd0N9PSVVvQ18Bd6WVyQZ9t0PhuOtiPOQHPF8rYemZn/v42Djs6uaPoIRytDRUx3gidZsPpn+tYeLFc1/AMBMsofEfKTzpMwk8kpd/0HXScHD/7Cg6G8YTFr5X34bSCNv/XmtCKLPTk1KJGQRmz+8jHe2qz9zobOTG0Kwu+lOdRqXfr2izqPxXw2qo4xYqi2bSr8Sq4norkvQfXY1l2nngW1oNPnWZillWG/P7fyXz1tgXWe24Fd/NO+HyhVOo0qT+YVb+A/wGe55dC",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9876,version:2"
}
    