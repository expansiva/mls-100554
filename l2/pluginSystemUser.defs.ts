/// <mls shortName="pluginSystemUser" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSystemUser",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "user-preferences",
      "console-toggle"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "consoleEnabled",
      "autoPrepare"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM access via document.querySelector for 'collab-console'. Consider using refs or events for better encapsulation."
    ],
    "unusedImports": [
      "html",
      "svg"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "The checkbox input is associated with a label using 'for', which is good. However, there is no aria-label or description for screen readers. Consider adding aria attributes for better accessibility.",
      "No visible focus style is enforced for the checkbox, which may affect keyboard navigation."
    ],
    "i18nWarnings": [
      "The label 'Enable develpoment console' in render() is not internationalized. It should use the i18n message system."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Este plugin permite ao usuário alternar a visibilidade do console de desenvolvimento no sistema Collab.codes, armazenando a preferência do usuário e suportando internacionalização básica.",
    "goal": "Oferecer uma interface simples para ativar/desativar o console de desenvolvimento, respeitando preferências do usuário e idioma.",
    "userStories": [
      {
        "story": "Como usuário, quero poder ativar ou desativar o console de desenvolvimento para personalizar minha experiência.",
        "derivedRequirements": [
          {
            "description": "Exibir um checkbox para alternar o console de desenvolvimento.",
            "done": true,
            "comment": "Implementado no método render() e onChangeConsoleEnabled()."
          },
          {
            "description": "Persistir o estado do console enquanto o componente estiver ativo.",
            "done": false,
            "comment": "O estado é mantido apenas em memória, não há persistência entre sessões."
          },
          {
            "description": "Internacionalizar todos os textos exibidos ao usuário.",
            "done": false,
            "comment": "O label principal não está internacionalizado."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar persistência da preferência do console no localStorage.",
        "done": false,
        "comment": "Não implementado."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir erro de digitação em 'develpoment' para 'development'.",
        "done": false,
        "comment": "Erro presente tanto no i18n quanto no label."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade do componente, adicionando aria-label e foco visível.",
        "done": false,
        "comment": "Acessibilidade básica, mas pode ser aprimorada."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a UI for toggling the development console in Collab.codes.",
    "Its goal is to let users enable or disable the dev console, respecting user preferences and language.",
    "Currently, the main label is not internationalized and state is not persisted across sessions.",
    "Future improvements include i18n for all labels, localStorage persistence, typo fixes, and better accessibility."
  ],
  "embedding": "eJwll3k8VV8XxkXJGKIIaUQpSbN71lIapJJUFCWao5kGGpSQDImoTPmVlAZRGoizVqVIqaS5UJrnedbk3bf3j/tx73XO3s9e6/k+6x4VlbBTKiphg1RUVIba2q5j2wAG60m7oFtjKgW33Yjt7I8qtp45AuFPCyjWNxCOb3WSC0yWkO62/JIZHu1wc+skaV7kCUgd7Ul337iAc59aqL8uceWxk7g4yBP0Dodz0oap6Hdon7RvR28aV2zK75tu58jFN6Q28xypIcUOO8xvRu1sYkh/RAN47dTFkJXOaBSaRV3fLMQb7Q5AY04l/Z3SGcfXpLKeynh267tLOlC8AVyWTwRL/28w8sEq1nwVjz7b11DfpIPSkKtTubvLQO6bNgE2t24J73q/o9nZ62lW+AbC9LaYazMB7MvjeQUNxuR992FRk+bU79FqfLlghTR6yHLw7+DIJ+vz6cfyAphZvoC2fxqFi7rasdnN6WzoosemG0nmk4dh/+kCRTfrUuj1TBvvHt5Ifec2lfYYbQYrh93svuOc0PVL6vnFD1NH3+S+gT0wPu2svCE3hw7lV5H1pI645OYYvulfDdsrs9F3kw22fpBBXVa1h5TuE3m4bQGG39+AnW515U/RW2iQVjjfDt+N3XrMQ51MLxyZ2I2nLDjIHePVOMWjkY/0Gk7fPY9K8upj1Cb5Wckgi9b88G0CxrS6yOqzW9E0p6+spmb2T0dT/fWoWqXBrXI1ucf0ZB70x5j7/3Zn/4atHK5bIy1a0UjxgWZkemwmbiopldwr3pHzk1hcWrKZDyXr41fDIg41Sca2xn6kUV1MTfJi8WCn7tQybhm3SZ7Ne3PuMZVPghC/aBa1l8Te5LchjP+ud+Womh/U6e9VOahuBU67p48+ndXBaQ7Bob27edXfk5SeMJaMm6QrdcHFmyB/sDRlryv1YKO7AC0047h08H5sXLNLlif3k1eEqfPun4DxgRk4SauX7LUznl5tuExdsl3opU0yGv3XDi+/1+du1k5C0xSs7VHOq25t46eld06sbPaSlLVyrTcAZW/D7zdn6/BKuZl9BJYoTkg7FRo8rjgd5Yj7MKdMDW03P+W/U3aTYAE/LQ0boDXZp+TeYicq25yAhz9Ulqy8d5qS+uujo5wht9J7B/W5yf/e2789Lgc7amGHLXl0+PwuxXTFRdC/GkaxP3X43eO2nHCjFUZND0OzPAVPQEPU7zBW6XOYwqu56dKXIGoNZnkl0sqsphx1pJrx1QK8OWgf2rfypTqXNlx4fw59PgwYFbuPO5Anexv4cPtRzWnG6uG06dFL6K4TAfMv+7Lgz8Fp4Ww6E3cFmi04BXFmcbB8wEi8Yh/PRY2zKCtlMO+ZOQ2epvXESb0mQeggiUxnbpFPB67iTUdTeM6dFMIz5QrXjj+kMTmLkTJ70fVbEYxnhqHHr22YnnBVqrPOQKc5gJ7zn0LawHUQfWk3DD48HQ1M9/LMZW0xY7+l6H8Ii7VhavtgFMzLov74yNeXv3waQIuDbgpOm8k1V2OhLngeCo2opfCFoZWFBCt24FKL5TiqoCsmfjXEtIXjcZjhPUqpUwdY0Q7L9mTTkry9sOCdDw0+/AiSwwqpcW4LxKgYUp+9lY2bmHJFV3M+/P0L+HSOwpeO1rzGwQCPTFqEQqdSC9yaloPGXQdLGj+mcc1VLRZn4Rb1HiTyCnxc88HihQ46Ddwi5UwpAtONQLsevJDdKxbi54ZH0G5cAecNtaFAeRVU6euxyBKorHtGC573khvnbmKToBey14d7MFlNg1vOuKxk4J9OwT27/rwCH51NqKl+M3qT1YFF3aUWzf+QYFt2lM34g0EUFR3aCq4dQ5S9glRLW8FLZ+yv9gsirPOl57Xduf3ZRjjxQ8JL30pgZmY5JA57IgsOcGyq+b+cuGsUSGcXG8DR8eUKwRaKesKTnZPwUJQVD/e8C9bOmzC7YBtZmlhxQ8ohuPbkNhwc5cGLxt4meXIhNHl5jnYlmuAgi2086VEMiqxH6wNBcqzvR3JQ3Sxyaj9k7N+Dby6M4EwpSGS8OY4/Fwlbso5xnxAvFDOATrn/kVzc7PghToXRQ75J9m/74tHxwzjY20Ve/jte2Se4NTqJQlaewz/zQv6tlbflp1T2dYnUr/YaPV5bB/tf3MWQJeborHNU2Rd8p+1MPzX+grJ2Pq49oNXzYVg9Lg7CdSeJHsbicX5JG3Kt8MWwsazkcbxNAJp0NCGTIH8+uGQ17wEHVGYWpmdydpM5lLHVAAIGE3UtOwcL9WrJ07wVJnSezYI3SdQGJnc7TKNi1onvnqHIaBr2ug9Gf7lEynx5Ex8PA8+vpwMP7UicC9XUMkDwTMv1d4Hwlaz0jJipFJIxlK/dy+PTI8bj6JlfyMqhM68v/knC3/yxV6Sk9MeuE4Pw54k8bDOktaOYtZxQO5CD6hroYp6RXBmiKs6QSp+KZqN3aRwle7WQC1eqkaP2fL69MBFi3nbkottMVQP6o5IvsTeLTEMxEzHVMg82PQrA2BZZIHTjiBRP+HznidDYkUs/lMHgqgj48eUtxGbryH/jDXDFzIvUvkOe3C7dEveaamGpbw6l5PrR4tvjSZp0BPTS6sC0z2PQnqPP/gPLS/TSfFAraC+MnJ0EmqZLsW/tBXmAayf21DkM9Re+l/i1P0RdBw1hnbbzEdYsUkwsWkrhfp2p8LkP45I7ch8Vc1xe1hZ9uznzs5q/+L26Jz/HCxLdsMKlLnn8VSWdm5tp0pH56+Cww07y1uuCG5d04szU/XJ8QQZM296OW+vmU8sQY4X1/XiIe2MmVSyy5QfpnXjNu5EQWbsFR+z8A0NXnJdbLGsHSwpbsLiGq8KOYfDKBgrwVoFthcu5Js+bGlyzoKPHJqmNfo7U7uR0/jZiP2XkT+SVFa34fPJceUumO5Svn4xp1tVSdVoNPd+ZTKIGMP10HdesWU/eWefoiZ2CF06ewZ7/uWFVWB+YOfwJBVx9LCdqlMhOiXHcJHwWuv3ah6Z9ZtBo9UGs1dWEz9ZsA/88K/Tu/RQODe1PCy8M5c6d9/Dyz4GopTcFN6d74av8XVzs1Y+vtRrF7RM28cSiLzB7iwpqRN8E8V4KVPzHmRV/YN1cmfV+W+GXj19587FketihGwR9aIDhX0+Q0MQPTk7l6PsbOfBjC15jmMl7Z6RBx0sf5ek9HDHHMgu9TAeyZe5BijVbjNpzEjnDYBcNNk7mgver0Nh+HjczXk0vJixCy9zuyvto4rd1vCr0I4n1cJztMl4w+6c0eXCMLH2fQ1P63ZPPvbCkXnM/SNMcPPHUpgQ8Z7wSVGtMeNzfnbzN0ZA72RH1GLAbRrTw47PBl6SAXXqyc9JCNNj7GpX1obAwVHrlYtOh8oxO1nyj0ZxbmQzDrvmdaUy7Z8p+0LrL62lSFzd09HfCG5tl0IkbTdoW66S8886s+XoHH6sq5HsWR+Ut2keks5qvSa5HZW2kBe+2oaizFDpnCGbanKe6lFw0l1/BYf8v5Lp2AA94eYe85XWYFGkDalfWseL6AdKbG630O50z/gnb+/rh1L2F1MYMYULPt6D5up2kG9YPtZs6Q4+cZjgq9gpMcU+V145tVQzqOmx9X5f6TyyhF2XVuLd2NevEXS5eHVQDCYZXYXXTBkUbfSsIVFhgtvMzpY9BuyGfNtpsQa/QGDTe0hcEJ/zBp55KZBVMSijlU0s9+Mqythz8oob2jvBl5b2GC1Twjmor7pSkDl6Oq8WZugkuv8CgccmwoL8VqZlsZhzalH+s1uIF/XNgtzSGlD0p/wwUETISRK2oINgEHO47gcf+pxD1RYE+Yevo6GcNvBnVme4fvip1q6jEHQVjON0pDurczFHJ/f5yN+n9+ySMirqLB0qKOCsjC0MrdU/OPefKI7qY8rbOdyBYtTUKXmWRAexmE6oQzIAcl0Kj3raBvrUj8OUoL6zdNZg1Qx1R+BSFN3GU+UIY8NKL9PeF0bGqfkhhKuxqcFsW9/OwhfaKTBsX6n0mm7SCrJEn98BIrZfytwXPpMpQotHZy+hB9zMwC0ZznP5dNjr+U2RSMAQGBOFVRVuHnKKBKDwIo9VPc1hCvNTg2gEqdGZIVzcNQcPNTF+LtMRfpPiUBzDbvh85q7jDnjoDbKnVDz3swwVnOfxnzQL0n5nC1+zUwS0gtsTm2jQ5csFRFh6n9Nh0LDNJ4FPDwlj4mwQXKHxMiRoKeFPhwsr7Eve8F33uwQatRnO/6iNSn2cPoO3h6/Jbt2o4eH0K/1L9I4fd2Q7z64NI+Fd+7KHDjf6nxIxtBKfl7vj3VnuK1ArAkqaJrKzhwI1raPWQKH5iVwLuRldkcUbanH4Hj5/dQQ/d16LgWPJN21viE9aERSYqsx4EKyWqwVUg8o1cDSb+yxHhO+pX3QuVDPxRjxWcWIrfvYkUMqgFeh2cgu/nfKMtmdWi396iTrH8wtqMxQxho6gcFpo499BOMG2WgBhvyPljquBaxEFwStRWMiELtuldQTqP2h2LYc0/KjPYcZPFC+judo1mXgnDhHVH5M6FZ5XXYPMmVZg36Sk1nbYTRH7Btb0vSZxBOYPILdUXgkJaQ+YYU964JBu0Hmhg+MczpJg1AssnNCd7597ssPiBPHieAwh+ePppH/l+pQ70/vj9X668rzxN3d3GcddBZ8GPn8h2Pg/pdACTcqZE604reVHmjjsuaim5Q5FlSDdy5NFLs+DI/CYc/nEwBl4CMX92COYL4XLbuUrvU8+xlTBj3C8KLo6CaGtzVPKlPMuXFUns4/QFXB+pcoNaEj322MhnntrChejxuGjuBslvUyKkmxfj8ZX6jsr8dbprCj/K0/jLipZ0ZVkmqv315D9j2ojc2y3mQxksHtaXxPyWp+7tx0u/qHPRNxXaUXAFRF+hZUgKj+6WhIaNFqiWuBT1jqaI3unzr7Wqyj3o9KUN/OnOGD6/rR8t2r4Mi8sPoGz03OF8ZhueEGAHF9/chHlbZvD3gH6kVr2Cvhm3lyYHlsoRq5fzbJd1qD81Ab5bRECC63iyHbwQvy9O4w6PdaXHjuG4/1cTbjN9AaSdLYSnUZP5TZo3FV+KZ/WXueDU87h048R+Wn19Mx5vncSGbIADLS/A0uLDVPYujNbDIezyTRs1nfPpuHiO3/Aui3sc1ud7pk/o56pm6LbbkQ1yz+DSOaawvc0EoXkO5mX3LxH7carPd8WrTW/h/fsftLLDDmqY7cO7HrYnyyQrhFs6dKfCgme92E2uKknynKeVMNvJQr78dze4imf98l5XKXZoKc1XVce539vQvhF6WLe8iM883kLOA4bLSq3W0QED7I+1oTFNM1CtukFKUVsD0UlVPKldLqx/lcqrLcoln8oSuKCYge93l7P5uXHgUBiM/RdacG+tYui0NYwex/Sl9Y/74qH8bPw8rTN17lUJv0NypYRJaWw70Zja3cmio/PCWRsCqfkIDX68ahHYH0vjZ+KZ5HelE1a6dGVVhSGHBp/ka7Ia/+kk8e9AF25Vmi4t/vqOdiXEylFDkriqWTQs8rLkS8PGyPuf3UGhgwumtsbOoaGEdlH0+mt3ePFqEE69dol/6M6AFjtvYWWyD1d8ioE7Ff9xl29x/KVUBZYfWkK45BbI1a35Zd+lcuTNRXDq7FoO9MmHM4+N8MeFljzkxkPpoFckm1xSd2xX3xREj2jkIG9UesDk5Gke7R1HpcuCePmElTxzWwvs8vAR3fRcAi2126G4B5dpD//ngY3fjlLi0Zbi2k80rVdXNA8PZ88i4tIB67lj2EQoWRNGI7IT+MDAa6xoW8Tj/MPgRd1KHD2qXFFcbkOWcWfBoFjDcemcdNiq7sX6U/X4QffebH7DRGh5SyfmF9CpqCTwabUQ8tWMeKxecykvuwgNvn2FWTX35ajtccq6gzgP1Pl/pC/NxtKdZRq0wGO7dCD1InifclP2mmzeuP1b36tjMy6NGMBR27VxTXV/mExLiwetGcz37XSpfewWySIqDv/YWLA4l+z0tAm2q48k1e6X4aRtG6yw+05CBx8c2wHz3s3Fu+1NoFf2Cqpt68jqfeplvYYrMK3bOTg6TxVd95qQbbN1HDvUibt/L6G+lEuCW4i8+R7Whh/gc2mJFOj2gnI/DpWuFzjjNr+x9MHlE6msrKG++bMotV0svUm7q4jZaYTv/5wkxTU1PnV1GE889ggEDzg0ygNHjNwmrzS8K4t12WpoG/6Y9Zq0Hn+H616Xqfep9fzoqQYaNnkEV3MmkbOzLgvu+eUQBd2eWi8p9c95OpIMeTN9Gn8fnJ3j0WyBN1e5yzjuoDuLzJBXdgln+8ZL8iSrFnR5Tzc8cbKC+MYO8Oq4Xn7UE1D33WNsY9EW3Y5E4sjnfrC2pxEaNCWqeG2Fok6KItMMikmz5+1BY/DKl+ck9uPC8005yy4fbH5uIZ9KhZxiMJSER7Gp43YavMqfjQ//lA+OzQLBP+3pupL/2PzHbW2TJKFdEizKYY+iaLZLE+xL3fh3ZSmchRYlMWkF0uaJA0nwJH/TR+UaJDIQlf7eF19PWf0M5Ffbew+I2jAdW045Th77l9PFN54gMhIyqnZJwveituV8i3oB14ZjtMNNSPr1mpr2L+abMxxQZCu7HWnKHr5i3vSNEKyrsod7KGmlDuXyXmPZXv0wjmlqxtMcdDhQrS9nXhRsH/VgkWnS06hakR3Hi0MDQkgrJ5aF73mr+h386juSV5T4YYnlBt6865Nk636Mtpqtw/roKO6WuIpyEotBZJvIJgW8/q2nrK+k2vuw4GUIzElPwbpukfjdQo0/aDeDud/T+N22tSzyThLnhhundGB43WdpWP1oSDmnz04dF4n8HQyxDfHSvC2P6flAe1zkp4HrewRATVmZ9OxtOl3364lWWMgvXp2Wyp63xZjXw6lJdHsUHlIyDsf17NDfNRaV/bL5aUS+FVPZMi0GBecodELnQYkkZg00j/di5Ywp27pB6q3lgNmKdP74c6Y8xLaWJ81YxbrD7wmfbIHGiudyq6M3hIdbY+pc5O7/OWG15mYSGUs74pqguI58rmbyz8sZdBB+yO0j7PHnKU8Oaduabp3divWXJvC3ck35QfejCpFTJU9sH9EnvRZcF2qKVe4SCE9A401bFt7n45OmwzfV77LIc+qZMx6V8+BKxkIpYkCO7H7IRsyM/hh0fC9pN6ph+1gj2HnPmO00tWDcwWrJYd5QFDnC7llPwHbwO2g7d63Isf6g0k/LUa95a9YeWcQBjxbjhMUtHUVN5Mkhndl1b6oyD0hkKgZzsaycmyIbaMSmZ6KvDhw/QZ9vzt3OZXcn4p5hUf9mjsgizLi5Xr6zLBqVs8jk5CD8ZbVVyQHPxFYYl1nCtde00HZiCn6bacaRxv6YmOyFT7po4oO0SFA3P0j7n7ngpgcG5GV7i3QiW9PDyg4IIbnw+2cl39y1VfqwpkZadzwPPS9mKEZrdIRI4xd01Xgm9WiniuVDiOP7BjoUeN6HgFlboWD/GRr8xJ/39ffEv02WY4V5R3laW1Pe2T6YF1b9BBMvR3Q4o4PPCu5JYg/MtlnJA2uegvKeYNjKDWdUKeVvOjyZ4MaTNY2w9NFq9DsTC0pNq77G8VWMQOcRq6hzl2SYXN+B1dNV6aVeOd2tuUfXz03kw2PjsL9hGnWo+ivdS/bATldvke/L3TCuNJX3NOrwmpvmGHMpjv961pBGp4mo96yazjz1QOOxyfzHuhXPM4phlx8LedeVV9Tg0ijNWLUOp+0YIu7RlkybH+HaB7pyusZ/bLt4E5v6BcCvHbJC0z2LLCN2kdDL8feK6dGPZ/Q1ri8ttNDhx+O/wbgFx2DbXl82XrWexr2OlUE8Q/fcNwEy597B951G8cWbJnzMbxqPkV+AptUhfrPgIHgGF9F2eSZsDLdhubLTydjrhaDTsxffrZkiuc+tAzedZbw4dCEM29aH7bs2A5tBb+hE2WdFzOqfMM+kDmofxMMzbys5eJA/t+g/RfKfjjzygIL3n1Bjf60oNHj7C2LXXsPKfVU0Ykw3puwYyskPK/lwzVH0vBXPUolQnh9EPflYcxu0/VQEK0fOo31xDqx5rRKSPw5EpeaKxVE04vI6ftPmPMRU3+dQdzM5TmUdZK+5r7hx4RBw6Fxs3n4tFadF0ak8HQ71eAf+D5KpiM+TVe1d9G/hzbUb90uu3j2438w9HJW6jX8Oj6RtvwZzT/d20MXBiX9sPSGFvNagJweOYMqEcTz8ixlhtyC0ON0FFcuuQ2/fZaCszwSrXN4ev4OD8hLZe9JO6OkRBFX1GWA23YnzP2eTeOGO8udwzO8hnbyzgo94FZLabF3WXDObT5h44ba990uEx/HEfEBN9w5cqmHORp9z6WJuDou9ZV/DFKj2/0BvFnSHILsSycIonovT1NHY8xntXFqLgd2ng3lCnELTyo6t+70kpRddm1VSJiTjg8zbNH7xRoDVa7BlqjnO8iqhnrsj5BsX7DjXyQsr3Y15+i4zvphrhe6QQqI39HZxpJIF6tEwXS5ruUM6uH2Oki0QmniOfXv8qrlROnIwHeTKbLbZ4s4uruOxtjCDFmXrYsTMLFL27W6PM5Q8bDeotdxPUQs747rjtig4o/uvEnGoURyXbXFh52FdWPhXErXH3yFZck3MWBTrOyanRUuf+zTQyk+98Wv/q9Q9YxWNPFACbQPmQ5/jBXJAQnPePsMWQ1fqsoFhBqr0MuEVGcEKpeffZ3WQLeYPhYZUfVxWZMil/R6SZ6fxJHimhqHd8cGiJDL6vkbpI77V+RSpzjgOLjuLlPUq+eHkQT0utqWgiP9wp3Nr3rk4mrOtrFn9/HBUXOiPvk4+3O31Rj5l1w+7DRkK4n+Qv2Mge7T/JZdtOU/JH0/981L2Sm1lZtHlSJ3/Z86UFcXDth2TxItKe22Sxd7yH+utNMd+p/BZKWl83axcR7aBNHnMDHu5mm7At2dl1L7iOqz6qq2sA4f+LoQI8qLeR7yhqng1Px7TidVODuXze77BqdqrqOTSxfU6+aWaiP7oSCJTIf/7cmp5ZpPk+zYYBXt0yq6QP9m6kZKNi41avCprL2vuXi+JNWj+olTIbJlVUvbiIDQ5VkqvTp6Ampir5KQVDaHuGSj6RnApAbb+mEuf60ohQMqWujyMERrKSOimTqGflLkGpT4q6B3ZEtfkHsCC/YPhfaeLUF6ahEv7PSXft98lueNkabSPOvu3uCu75iVx70kd+Zvjb/J5dklw0kn06beyf7wr+CjeG7hY6Wu5emYmdlheAW5T71ILTRPsEm/JrrcjgSx783jzLngoZy6mRWwn5XeB3R+RWYspaPwnX1JmvgHq8oQ106Hr5h90sos2jhwXgc/yYuXIlx3xTYoFKy4U8T7NRBJnlpPePZdyDQ3Z9OhlWvgljYck13HyotZcMfK5NGJMrpI/TLsdxlW60/jkDfHrIyECxQyhjQfNZfGZJ/e/CxXORsrrSDnfooK+8/ilfkp/OZxxKGaRFeTdMx/LX0fyxqhQ3jBci5VZ55y2Ed6el9m9pSWOmjCBh0h7YEepEfbcd4sCu+ihvdpsZV4pe0SBYedw1uFAjLf/j8wK98DBhbtwVYMvD7yVRCJL2MTrZInwAIe8jpYvHmqgead3K1nhceXzsHpTgtxHN4Bm3Uok/weGji0/jMfLR8ay7X/jWQ3MeE3jJrm3+kk4rhWOY2YUUGJCM15X344Sk++QalEatajfU2y35y+pyvOh8VY0TO6tziVLnuND11GgzEUnLQ3sfKMHpN1WQY1gmbo81ETb/67T/wAzzZiN",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9788,version:2"
}
    