/// <mls shortName="collabInputTag" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabInputTag",
    "type": "widget",
    "group": "internal",
    "tags": [
      "lit",
      "input",
      "tag",
      "custom-element"
    ]
  },
  "references": {
    "widgets": [
      "collab-input-tag-100554"
    ],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_stateLitElement"
    ],
    "statesRW": [
      "tags",
      "pattern",
      "hasError",
      "allowDelete"
    ],
    "statesRO": [
      "value",
      "input"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Input does not have aria-label or role, consider adding for screen readers.",
      "No explicit keyboard navigation for tag removal, only via backspace.",
      "No tabindex set, but input is focusable by default.",
      "Error state is visually indicated, but not announced for assistive tech."
    ],
    "i18nWarnings": [
      "No user-facing strings present, so no i18n issues detected."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Componente de input customizado para tags, permitindo adicionar, remover e validar tags com base em um padrão regex opcional. Indica erros visuais e suporta integração com outros componentes via eventos.",
    "goal": "Permitir ao usuário inserir múltiplas tags de forma intuitiva, com validação e feedback visual, facilitando a manipulação de listas de tags em formulários.",
    "userStories": [
      {
        "story": "Como usuário, quero adicionar múltiplas tags em um campo para categorizar ou descrever itens.",
        "derivedRequirements": [
          {
            "description": "Permitir adicionar tags separadas por vírgula ou Enter.",
            "done": true,
            "comment": "Implementado via onInputKeyDown."
          },
          {
            "description": "Permitir remover a última tag com backspace quando o campo estiver vazio.",
            "done": true,
            "comment": "Implementado via onInputKeyDown."
          },
          {
            "description": "Exibir erro visual quando a tag não for válida.",
            "done": true,
            "comment": "Classe 'invalid' e hasError implementados."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar botão de remoção individual para cada tag.",
        "done": false,
        "comment": "Não implementado, apenas remoção via backspace."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com suporte a aria-label e feedback para leitores de tela.",
        "done": false,
        "comment": "Atributos de acessibilidade ainda não implementados."
      }
    ]
  },
  "textToEmbedding": [
    "This widget provides a custom tag input for users to add, remove, and validate tags.",
    "It supports keyboard interactions, visual error feedback, and optional regex validation.",
    "Future enhancements include better accessibility and individual tag removal buttons.",
    "No major bugs reported; focus is on usability and accessibility improvements."
  ],
  "embedding": "eJwlV3dcju0Xb1hlNKWkYVVGwyj13OckRBSizEhSKCNlVUZCyyg0SbKyIpJCz31O2UXma2S88hoZrzIzkvG7nvf3R58+dV/3dZ3zXee+1NRiy9XUYt3U1NTcA79kQP6ArujTK4mdFq2AkfvDOb+ihCzidkiff+lgUad8rE10xb3XgXzf94EEfeTI4faQc3eI5GW+A/bOagehS59JxvY92H5YHdbNG4oJNd0JQlaj7nV1LL22De0+2cPl86vohtsksq5155jjGeDzIF7K0xjHTU63IackV3U+bn+8xiUyPA2T327GkHftSO9hf6rrBuzrVQAzLn6CoVqL0HrQGfLqq4PVHz1YT2Mb+gV7kZ9DMdmMWoQ12rNoSFM8r1oykPeax9PZzPeyV4p2WaThVrRPWQILNmxU3thsSTX3RoP70MugEZsu6b2z4r2uPclHzpZ1F7ag6sd3KfTlDTDWaeZqfLuAtevDwDqwlhyrnUjDvQw0KnfIq0ZNoZjx2bJWdDJYGDpgcr9syImulH3kjrwjvkne65OD+h1XccbrX+CbdhIi6/pxzckefHapJ1qE9yJVj+nGnSl5dh9lw5ebpLW2Bc5wnM7G3qNx71UNHGo2k2vuXYfAL+3ZIs4MrWsvsE+vVqJeQ8wpMWdxHp25lMr31pkw5GzllA6hZG0yFTSDg/jwkHsw0vUcRJwKBqeBtez76pMc9WIxJ6zpienNjqm443uBJRAZ17xMO2I0aY09xLUdxrJ1aDd2fGvDPjfaYEiqARpPbMtN0wZwXaUb+0UhprvFs0WDtmLGgxfSPU012SfAAuucj4LxkO2kwufsXxelmB1dYUFGPIevvQaYtJ9n7LuGGpMc+Mx6ENqYB00Pq+Xa1uZosXUT1/zuC6Urx7LGLheys2shzjkDggu0vDAbw6vuwU3jxWgXNgbyNTdyzq8DsPerJd4z6U01y25LEXs/SSbWc6D0wUj00cwrzU/LxWQLm/+0ZDUwgcNvZyh9B0jsdN5daHEfq2p/HGYptLAefBbpQc3JQzzSqIaqJy/Fe0usUX/pMqh3fwpiL+XjNalQ4Z0LuLgYjXk1J4+Nl/ND1VD7wU9qaP9V0hv8HOzKjKFWM4DzHi5gvQnjlbXfenGI01Y8rDOQV2UE05zRMQqTJ//AGadYfHngOdV+OwzGrM4Rb5soyi2cc8wELuktXIuOANU1y+K6D91Ej9boaJYANyz70WkPNQr/rOAzE7pLep575HDTnTz0bKjs+CcbVrm8oaJOPbl+47+S0Adp9YljvyN3aK/yCqUb74YzPw6R4yZbOjO4n9BnWzky3AAbSn/ASOUMVOmn6eHE08dHJ1ID+mHllFvUlGCKRQ0XMb9rHygyfCsbl8sQOoFZpU+hMRB8wJneiYra7Q7o+PYgmWRNxCFNzdGr7ybWOmvEn+/2Ugp/Kqp/LYNVGS+g7qApGO/MxMoFQ/j461R55MIHchHc4PAnlZD8RwPP5B6l5GNK2NvTGWtnm1Dg067olY14PH8NFhnOJRXvCWvyUfDBKQELwfq4Lc7wv0Aqr4cH2dDId9HcpBQ7tjlLMzqHsd+YyajiLMHqGJgYRHHUiwbIOTuWKz53Yb2YUji7ZiUMvftIyokezlNslnBNykVAYgxtsYTtRvdiwTVaGBbS9alaXH9nEcM4HdmiYT1bbVdHvdRe0GR0VP6cvAf2LFPDupG7wP2yDSYPvEYiM2XBCU+JC8fPQ01QL8aFrR5swdB2xZj+Yp3w1C1In96TSh9cBcEzCF+z9S0ftD5eAImzouWalKEo/IruJU4nD796yKqaawP82Hp8EYn/YfLs4xQ/I162VHNFXaUOreoeSQ3xQbLutHTQ2FUqe/0br8oLatg2njXHfKQi8OZVJheopq8nRiVFQ1ShP6uyQuS5MyZZkU3GTxA483a9bBDa45Au++G4Qyes7TUERQ/kO/EfkWWFUHHYhGv+PYP1UVEg1hC+2E0it0jkGO716QTCt5iTrPiPIy0tSzyRtxIqPZ5AYHuZT+T9ki0vvKIZ6pfBzspDjpzaGatLPoL1RQty1f0BdbEDyP7eb6lWvgvWjU7kk7gWoVBb5QcSuYhCo9TkOZT3LIul47u0MN8rg0Pn2JPl5pt03TBW6M8Gkls78ZlcO9Z+Kqmwwx1Pv1K4txOV7nOEvEu/SLu9r0rj0DTtFG6/vBlERglON/GM+nsqLaPfzxzYsa1eqXlmGos5Q/p/fZFqsqPY3SWT/ToNRicLNx7p+UVyX20BMRcT5bx3TyFy6m6yql+LYl5hwrBxGLMoHo114qAy6wBq/OyPwutk8Xst6V5fjSIP0K/VGNir9BQ+zRea/K5UaSYhxZ+jQu7I+e9N2KrzdkrelEHxo9NYZAaoPBp1wZtiGs1PCy2B3V/ark1GdqCt/hRmbJkCZ8tus8o7h2+HQOVaR6x2GUuBEU5QufehZLFVh6Mu3CC9H5OVqz4G8OGdY9F9vq1C9ElaT1aj11dnLroaCO6jkjB+tAFaPdDDuthTCr8o5sBrx3lgUC5t83+Hhq0i8JhiLpb178OPx5ZD+e+XMDp9CS5VroWtbY6jcbA+2vYvlRMnuINv6CbM6XdWXuC0jboNrVUEbSvAIjNDvtQ0AuWo9WiUnMDPIo3Q4NQJ6fIiLRR7kcutbuy02BM7GgSheEc+9sicQ1yc2CwcOa9VKO9uigP1wnV0Y8Qc7Oq7GNocOUsLMmrhrHYcjL7cglxvNoJtmxg4GbCON34diT80g+n+0HRodDkqXTWsks4Lf7TY7U0bmv0tTZ7dC0c0zIPeg4dz7tIFnHnsHrhMOgKiN9R3laG3yPf5PX9ShJo39Gh7iJUJ2+CTHXFBeAkpp9XQiMJ42KIzGhNvEJ8IXI7Tg9uxVmQXHD4gmfy7mODUC/Gi/0F4O3yZ7HIrD8ZZLYDC3lO5f4cPnJvbk5dYByBuTOX9i3yoYvFgfv2zlHZu3s74vT/afP4pddVpi9/POOLNYl85+v0eFnvwj7wsCnO3kTrUDKFmTrO457SXpOv3gLT8l2JMjro4szleyt8Im80eS7M9LtIC3sXzpl+iIt0yVnSZwfUpJ9DNdhz/fDUUDFe/4VDNOlrbMpqH9zxF/tv1sKyyHX54m8xdHzbRTx11OURvOXeKuUqqesemrgXPl/4cnjgBZwYF4aQlSsg6asbbP6TC/XXL+XOxNg4xb8PzXxriOv23VLvzidRhIlCzWhtMCdvIJuf28YAfW7nd4VbQOWuU+J46IVdBAsdsOqyIXZTMi/17SEYzvdh6Tzmt3KGA6XAbJm7eqVpLl9aMJcnQl1XcBD5ugR2LM6llmps07FUrFjygCpcfeR3wUtNlGO+2XXYd8YnUdO6B/c49zhu/XqWWHSuxvssWuTT9IPcbeLj08pPDpLO5K016V4Sq+oQ+aNPVnWxVeF0q1mnOfqdf0+MrA1iFh1qmPyrOtxe1tgDf0T1xR1wMv5/0Bvz6PKXtg8b8t7by4h8w2PQdjOp8MOpXHziedZGe/TbDKfmTeTQ5oMOHAAos8eKQoqNy7zmapMJ7v2GClFbVALd7p6Fp8zswM+i5JPzF17JN+PKkbtyUKXrrdBDbdlfy4qOz2O53GAq9o3+XbTTr+lU54bEXGwenwr+np0Pya4ZX2iPw2XNn7NG2Bwtu2GGLAfYaUw39/HRVOpOCivWx3GqP/LvKGtN8VsiTF6tjiq+1imuYmuOJYVXHYLjGCjREDfjg6Yeh5c046Ht0qX/L/pzzTJMVnjtwYcIOpYqL3KXv5aI8U44e/Z7OjyqC7ZXVUvTSfGr76zcM/ZKF3m3DePrb9lyUtx0H7R+JXzZkQtZuD/T5YARb05zl3L5JePPvFFDWzmRVzVc82/P04BRqLNqv4lZKn3cQmjKTcFzFHnB/9Jb7df+jEL6DlUv+QLer83jvjlWoOa8QRlVn0ATtW/KGfZtQYA41ZINLB21QHN7oC31HKVBwz+ZfW/NtPTt+vaQI5ep7nDR+A+ndviX9euDEJp0XktvfmdQpZiTqXxyMF09vZ9EHeyXqqXIJbu/bAEeaX+UaOigftI+GsoIeKPKORQ9scWIu1FS3dTE/+0PZb2AvEhzzBvMkzO1eJOs2teH7Pe258uIq0AkJ4Wmxvfn0shWKt30mU0zXdVj9So2XhZgyfdRg20oj/GfXemXn8las9fsQH3yrJ3scL5Ma18/F1V4+HBzxiWaNv0O2sht1sogl0+bjQPDA99c1ga7fZFZPuq7Y9+MB2Q7SQdcIW3gadQO+/n1bMnA4IvfLjeT1G4LE2T8pyrgDmWT/69z/dFfcUrhaGl9qwLdsR3K0dhK17a7gmNnhZDKiAGqNJ5HGsnK44pmBCz8NlA1O9ePzfq1wrX2xdO/aHQjwnEG+BV8l34KlsPBTucxpvySH0PsC19bsqBWIKpwF/rznokLMBU0cY9Ja4D4BRZ0k8pHtCvrgHDNj9k+RWGiR67p6ovfR3bjoYwLsr/PEjGkmtLzvWOVuv7E8yvQXtMstIk33JVJYgLhrCE2o6hc9kvAjOTWN5WLfeZzQPFFoxwrNF8RB9atY+tVgyunzbHhq+yGS4epQTHevJ+F9UPlZMzqBWitvwrfrF0DUC4X77kjB+9cqRV5KwhMcWFIFVdt9ZJv0QojaolNW65YGMe++yaOulNNVQy9OvAGYeXkNJ79GetOkxkG2G9i2zW+RIXbc0tocTzxchCYjbKWGiDnY848JNJnpYlzJGlTl441zM3j37cuqjFVxQGJm0tOPFfCybxzhRn3E78VU7ewKRjOryNs6m0WmkJgtXFmv5BHLF+O5kA58Yp0TDPKIJaET17Aqex638xWVzqsnoR241oIklfZ9+/+GRS8KSWhZvilNQcEzXr/5kQ7aN8pi9tE3D4RB11tika7rf77oG7LTWTVzrXt44PTzfqRZtQKPD0uS1niacPMxqbxMyx5GNZXLX5J+SldbHEHtnVrcQdyNym5dgXPLa2G4ewI+TgikmXYROGCdOlNaew5vSMDYj7+l5JoITB+xCvt6r6eFIwxxZ7+NqHRNwt7tDTgm6ofkPGUs3s/VgzH7HpLj3QIpRl8X+UIvWNWqGh5efCefnoVcvLUXevvPw6q7GYru/WfDwvkbwGvuc/nPaH2or5sEG04Z0oKIyxB09QJFqFvhprDr4lkqzoi7RyNs7eTDxdtY9bzxeTOMTohQ/hXckdesfiR/yFzEWbG67MnaZTs79cdr95soYT1Bmz0LlJ3G3IW+zkUke1nz4pE/qKJlHNq06cvuHeyw/3EnaWJCC/brugYn77rAs5YGcEd9S55ddk1a4PdRliamyTZd10PLClcoN3FR9YqJsg+86TWL5393Z/2APPJ73RcXv9xEt773568353C5SSmtN/tDy8fuQJP9CjZYu11+Kw8m8Y70YnZbPtXyG3QaM55v9YvDoJI6rJ6wl0U/cuzHGC532IIBLhplKVb/gHbScXrX34P2qufCKfMbXPnLkw+crubP8UZYFfANznfJZq3l+rAn5h9ym2+Aijt36XaEC4x7s145vaERDqpdou4JKXTi2Fo6vbsN66ZH8eOEp2zqlMUzY7fi9Dn//+na8RCsoXz+y20vGMw7T+1MF9OTU5E8MqeRLs1/R3b2Y/lQwEaw0KuEkEGtOahkHkFwX5z8KA0edXPk7GeAui8tyizTm2NFyd80UP0oPPhszi2UFpxt1oZTAu3h1GRzrndVIxsPdfH3MZr2UOK2//pLhsXHMavzFdh/brPc1FkpWzQT32eVobSz+VQYor2JRW/QAyvZfvorEHjJZzxvUJdFiyluZCK/GeyKj9r6w4CFPbCqDFFV49+un7nxYAnf9gtkx7viXqzxlDSSK+BR28f0fuZjWLGtNeZHXwEVd5/GqeGV5AN0Us+Bc6aclYT2eVbyKZhbcRT92vQUGiki829abGTZgSGpB3vct4SRJ8YKTpWwO8MZNzxqzebf1kF1sxUw3deNLts9hXFZQVKBrTlOzWmBVxvbEOxUR9X5QgPYfMAM3NaYLnRSDD8+dMUHhwtPC49wMXWhLO2F1LXPavjwuiMPMAiCg2/qFQd2r4JM5z2QPG6zyl9Q1HuYPCt5AO3PNeHsqmD+GWqDXd6k0qCBQfKHAi/WbOzNQhM0I24CRQakq7wKMMoPkx1M6GuXVDjwMhH8l3+RhH/wzfNIhX/qKOqZ00741Y+FB1yumsVRmFs/DC8doDx/ZDkOTryFT2wzpXX9J9KIJTkKgTV39yonq5krJVEHT/toQKuPbYBDfaaizgM1eD/TH1Ln6PLGNl1ks9VzcVZlCy5rk02bd75QfnTQojW3NaTm67Rwy80fKm+DT3gL/nd9b877FkwrphFrPV2Bsw8swYJPozlqc0/seCYKR564BVHFncnUYiAnO2xT6R+/lyfjkBvlLhp3HblQvxU6T7lFb1Ymw8eap0rdcwcVWZ09FU2xsSz4402HzOQwtxOgfHKWLkYeUOHq8nR/RxJr+PUPb17hEYyq33cfm0PpVxPo/VuBQnv8CQ/S9QHnqOJqMVSbjhMYPwfnzF1sWKXF0x7K4GSWwzolWhihvh9uFl4i423b+XCxCbavrVD5UXreZM0jlnT6Lxu1e8zFb74HUW78AwIT3FNqzz1wOGdNNZFal3qAyGQUa+n9rt7Mu/rjRV8HdL00jXpdy4MQM0NafNgN/VOvceS8E7C0gxV+PtRW5HGM4PmeVPrXHpXnJMvJTpxwsTV0MJrGjwLiyOvpauWgEnWhMQfs5LKSArrk0/cRC2jiDB1VvuDsxk44uv1vSZWnQssgzuWo8VP4+3QPTtu+n5bVnqIfhtupr7c2v3bciQ7ltsIT+VSjtROK/zHBkvrT1C8vS1ZlwxSTEaA6P+bdVlw8chnOrWkh5kM6ptqflf70NMVL88PkOZlbRWYUUVaoM3n718lCb5gSlQind2+UdIKeSUIvJPbkD6+z0T6yHMQM4qSO20R+v5dUmfDvonEscls5ymkTqby2ub0m9jpkS0Kz0Hl3npQ2faLqPZp94AtdaHjDc2sShCfPSCKLyMdxgCozy8QsAcsf76nz7m7c/v5Bvi6+QXr/VrK7tA/u/oucpDmIdk5ci8evreKi9mFoOfkkWf/R/89H3ovd8djc2zh/YmssGJsBv9a+JHE+WhfMxbDlGiBqh302y3HocHcprMcjiBr/iPLaMb8YYgROPSWO0zsNfR685QsNoSxyg0SmQeLX3codFVYguMVx3kvwcfGW/zJe5Ck//HuYlH5wqGRkexKXG12n7KoX8umLa1nv71lUkvKJSprpkcBH3hXchbyuHALhU3rz/BvSoHfSllc+qjmAfT4MQYctK6Hg0VeB51NJ5AvHZl0H980bcP7vC5h9dg4e+Dkehj/V595xa1zWNDRD+eYO2P+5K8HhBrLbk1EaEVzAnt+m4A/TsdCzfxC2HL0eyj//omc2Kcofprfk8e8m4LMfs3jIqk2Y0H8zTurrAakWU7nuly4/b/0cLqbnyWfsAKcmngCxD6c5TMKoLwOxh1sq/MTLVPhgj2L2zBA+v7A3Pjm5FArmfqDke+aY6PKYzLQXw5JSE7bwS1ME9TinqGuXDGO2akgl5svx3Jj+XOt9WzGo311auH499ylulM9afaI79wfBhgM6bPIqjf75YgJmoIZrm6+Wss/+S/PqK/l2xUXyEN/7r9ZUkJ/UKGlUd8dc5xs0bMsiRcVRH1Ye3UeWUVasLb75xl2dRiqs+ukVkv1hD2quMQZFn+R7Pxmc4CE79prGPcT9OOsAwfPWQcwPvHnW/L48vvUaNgw4cXpa0WPIVkuhcbV5crOPt2Gg2UbQeN2ZhyYNwom63hxkfAmvaJbjnwOZnHcglHfNPc+LYqZgY+Mk0m28gsq4IK6o2Eohu6zYcNh83rrzE2mvd+DLrbVYhXn7iW8UDcVqaH+4gn3zX0pDVulA0OBWnOq8BycqttCvYcvxcUkKBitcxdpQ3PQ9E065LeLllnNo9FJtjPt1EiN/abluON0ao+uXcHPTTOXnvXE8wXibuJ8e5Eeh43jfrV5g2rEVeXbXFJzpy39SHan7vQtkGNAPV5deQreee6F9/GbwanWfvhvFgeCGhaYUa28vlouaOvKJz2OwTV4NXh84k/V7DyTtlAzS7doW1k25S9W2dmTQbQlat82Ft2X19Hn6CtYftIsDzj+AC1u1sNZ1IptqbYQIxVy6Pn+jNOJdD87MXa8Q2JHxZTWuSY+hbZeL4e7NSFgxeAbGvQh3ifpS/h+Ou+LW8Ylm1+in4ypa+8iVfsfn0rkBYdh1702wMc8mFc+CL7q04x70nl0tj7gbxCnPHaGmzI2HzBqB6pd64NCks3y1TQS8jG4vxaR0kqsM5dLhn1I43LcPj5m1lEaa3JGWYQZhUxpZBkynjVlN4L47kWcvDUZRHwgMJP0J6rj2URm873YPe446JD0zsEXxDua6bUPRMzx5sQNuBD4ufWZQQAeaWbKN+gK+ufABDIjcCp93WtC3Jz0xfLAjZyS3U/5TsRB1tT3+q/cNN+esMxpk+mEo5zp706M1Hfnm2ru0YvAzEDXj3Kox2DtOA3evKIfg4Fj4cuSkJLzBLluGcavwNfg4ZzhcH/OUVLoVz7mqaTHd+ZhI+W6XSNRPvwIGYeHjRFQe7c5TC3RZ/dIh1Gw0Q/OhRXQusBDDJxpReXdtCPZtRo7DtVB4ixKGbhR7a/Bzx+6qXMFWtsvwu1EziPo7Gid5tVWo9Df8UztW7DlHi46sgWlF/rC/VXzpSt9p8gLjz/KxqxtkrZDTeHT/UbqZY4plhik84Y8Pdnq9nOnpNvn6pMNs9eoM9vm2GhM6zJREFvC2wjDW8l6IFeWj+Vb6LSrdcQhEHfLvkEXcyvYHfcmrA6FTCPx6DUaajMP7gzfBchcHVXbA0fw0OOLXAA89ppIJ34Lxj/1Aeb4FfwzfzD4VergwoTvfvfmN6rVtuAcUUK8Fnenw2HOkp/FLUuH0zsAPNz16S/N/u4t1kdytJoVUuXanfHmpqEk+mtGXl7sU0kn7byAyTuoBtiD0K3RdLYnzuHP439D2ubqqFmX6XCOVlkm8Q34x6kSVvnzxUHPpaQd9PBmoibcKsnhqYj9VTYpDwzdjJ/VzgC+LMCK6HYYe7wIlbVexykci14VeM0jV36yIDvhi2G6545MR+KZEopaOF6RAnXQIE/ePswOdVbiSyGJ2TkoXVtgvRVusUVb3MYC+av3ZQ3bEaNMd8Gl1G+68bg9mxl8AOjWRVR5av3IU5Y5tL/e9F4HnJ8/i7+p7eYVnb64ov47Ta29B0wQdFN4AwQXndGmBUVUruXNyoiT0yyElifxDe7wksAO/mTL+VZYmiXki7Zo7hCNC9FlkhbOq3qvdB/DW06elZb8jlAfb/sXxFse45TA3+W11PzrRbJSYU2aQ01BDptV/qL/WLDzjoYGqrN16bRsfmVFG41vuoKctjGBqWL0sckzq88zyvxnzJzMbRKaJ+bSZjVIPoMNdLWxdmMxBf1bxzCEfFCL/VPpjv5kS1+xbhq7f7PD4u7Xof6iX8NkNFB4TuTeMRaZwyl+lKNZL+x/6Y0NxrPRg+h5QyK3on3+c5d/hzO9M8/hrSQir6kobdAdUGeMrzyDVnO3+XhtDEqfjp9Qk7FMcjWE6g9BNshCcx6vmiGSAEn37sB++lrwGy9n5NPdFpqzbKG636wulvRcM+chGNRa6EHPqX1mVo1W26iov4Oa62SjmGoSUtMTteuvhmt0bkY3PqGloGmUsruT/AUfzg2w=",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9788,version:2"
}
    