/// <mls shortName="pluginExamplesIndex" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginExamplesIndex",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [
      "_100554_pluginSiteMonitorDashboardErrors",
      "_100554_pluginSiteMonitorDashboardActiveUsers",
      "_100554_pluginSiteMonitorDashboardExpenses",
      "_100554_pluginSiteMonitorDashboardRegionalLatency",
      "_100554_pluginSiteMonitorDashboardResponseTime",
      "_100554_pluginSiteMonitorDashboardSales",
      "_100554_pluginSiteMonitorDashboardSpikes"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "./_100554_pluginBaseIndex"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "O HTML contém apenas um <h1> simples, sem problemas de acessibilidade evidentes, mas também sem recursos avançados como aria-* ou navegação por teclado. Recomenda-se expandir para melhor acessibilidade se o componente crescer."
    ],
    "i18nWarnings": [
      "O texto '_100554_pluginExamplesIndex' no <h1> não está internacionalizado. Se for exibido ao usuário final, considere usar i18n."
    ]
  },
  "auth": {
    "view": [
      "admin",
      "editor",
      "author"
    ],
    "edit": [],
    "use": [],
    "restrictReason": "Os menus definidos neste plugin são restritos a usuários com papéis 'admin', 'editor' ou 'author', conforme especificado nos arrays 'auth' de cada menu."
  },
  "planning": {
    "generalDescription": "Plugin de exemplo que registra vários widgets de dashboard em diferentes categorias, com controle de acesso baseado em papéis de usuário.",
    "goal": "Fornecer exemplos de integração de widgets em dashboards, demonstrando uso de categorias, escopos e controle de acesso.",
    "userStories": [
      {
        "story": "Como administrador, quero ver diferentes widgets de monitoramento no dashboard para acompanhar métricas do sistema.",
        "derivedRequirements": [
          {
            "description": "Registrar widgets de monitoramento em diferentes categorias.",
            "done": true,
            "comment": "Implementado nos arrays de menus retornados por getMenus()."
          },
          {
            "description": "Restringir acesso aos widgets conforme o papel do usuário.",
            "done": true,
            "comment": "Cada menu define o array 'auth' com os papéis permitidos."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "embedding": "eJwdmHs81ucbxzugFTqgg0PlYRU6UKvw3NeNaugw6UCHX7QWqh+1SrWkth46YSs6kFaohVYOHVB57uuuoVp0QofRami/RdtSa2Et6nfd/vDiVXyf+3sdPp/3586bO1aGTprMm+EUq3LIQus2FOG/6DDbx0e6XDqMjhOmgPXmO9D/VSsL3X0Jax39UTPrQ/S1nM/FQg1fax+LLdOS9Xv9WzF833Ze+3gOr7jDpU/tYQgo06HD6HQM//dr3OXRTbacPQL0XLzx01KoeuTAgw64S9cLtuDZJKDJuhY0Z3aCWWQX3jHdE+qNyuFh+UrR+OMFiKxzQtOFAeAfHcIjZo7GlfOq9VVLmIzd/RgWfbgbwvcZ8LCzn6PGwIEHbNyO5lZlrCXsKPOf/ooFeaXSWazB84innHkqAIOC7Hl6eT5W3usOde/see2GGVj2nxvML9xStsVXYvX/bul1YweK2N3BEDatEa78uwILbbxl2QM3nvXAUpYlAGpCE9C4oZu0W+mMN06slV621SBMszCiuQKjbHaJvK99ZavhJRkceh11XYfzjicXMNFeI/UaYwhfai5t22PBJuM9zOzlyqPr72FBbirEHJuC3Wft4D5XJ3C/bvvkuPT1aPO+AV98fAdMZp8W4V+lQ9WCAVj6+xAwntYLi2pWQWZ6d7Zn2zam++1baMwZxR8eegsxVeN5UFQ+zm+Lhvf6COn8XRJavTiIhanjuLnZEGmTsRUWrYkXkWVD5aY/+3N84yE7pl9G14/2QMBpK9T1/wb1q3rIyIGT0GrEGJ4/MgxMiifyqav+wZq0gTx3hgnfVHMadJ99wEWJAzT90YiJfztLrx9esDbTXyF27Rz5MvUla/D4VI9+9cVuu5wlnYflh7wV8xL/xmDdXIio9pTpXa9ih9lJba71YfCYmo6ts/WY5n0ESo1OYRu/h1QnSKorZ3k9iiSdXxg/O6H3PmYoE3ukiGCDZWDcEMv8zR6Jysx9kJJqjh5RifzKuK0Q6O8mazSn0DF5GPg157CAtwPkzMhL7mOX/YLpfiXoqRsv1v5NNWEHtLrfrOBllygR4GsOKYXpLDZ4pUw6XQNZ/8kF/ye/48Oxr0HNLT0D9cXd+dP5xtKnJRv8hqSBwb2BzGfScT3VHA0fgYxzOsITVw/mVDuetncQGof1B6ufx2KpkZOszQK0zvFimDcZnAznCHXWsi8eAPVEhk1bTn+zi5ufY/DUOBHjxk1yr7Ttwp2ru0rPQaO1Cb02sMC706XXvUBcd/e/WBPzDdrceYmBFy4zx2mOONZM6g1M8sH4lo0U3gLyxEUoN+/PZdFybHv8F9byIveksktA/eU5zjE8fMBAbL1/E6i/4L3Wgmbwgih3tuXNR0ykseUhLG/rCY5h4+XU+++R5oGv9TSFkKJe/GhtFH8mWsHhpLE+0necsP/4V3DZcwrE3gug5kLVdm9jM4Ycy4Q6swSIDOEyLKaDvXj0o9BrvsYX/8xhWR4avmpxG7hMzuchz235ofZ3mOd5g3kOysPI08WQNHAJRFX2gohuY2XKlg+g9f4nYBenxZEL1+n1hl3AI8hA6g6lA+mLMIvUAZ2J2dxZI9p4gIyuD+B+1bbq72XWq0x8nxCtdgTrz43QXtnXgGV2Rap+crMukteaXhENHnXgtm4aBgz8jlklTpDbRr8VlkPjWd7csVx/vzfG7HDjSkdyC/ajembHmELA/tPlom8s1M7ziPOFWPDPARniPpgH9R3BfwqLgbil43jqlRW0z4Nk6qg16nelt0zi3Y/EIM2qVp2B5oUZ5t4Aqi+rG9NfysEvsOTddqUHGBQ1Rvbu/yU++WUL0lyq2eGaiyNlS0eqyPI4hm7zL2FAnTHUxJjwlZdqsTFRIwssbJljMg3YGw/9wT8LRWitHqk2+norZ9kaMxJDAr8Xu3r3o5kdDDR32LGY9mJnpt71hhHs2dZdtj/cxyzvfkO1eg7Ro2YztYcGtgcgpfIkRnx3W2D5LUgr6SmVziZ6jsKmGdO5w6Tt6pk8/Ksh0q/6KHr3NIXq65Ol0qDQWq1wvXBU0Fng4PbRPM2xn/SYOkRWFJwDj+91mPLJQcj9wxFzlx+Ewk/Oo9LXUv1o6Zv8MdYvywHTDXVK53je1z/izMULOntUN92WdGY5j3EH/bj015hV+pH0OXlK7QCUpttx8hJoNjiA1EP0OGAF5mMcwXfaVB4zeCybaviXCB3mKjPcf2YGMBRct/aSar47FmeJ/gkv0KGlB3j9sLpTbw/iFKGZldmp40rzryxdI1tG9+LqrGNT/KXhEn9G78rXbb3OHa6mYEhRAqc+cc9ZZWLzmRAUji7QfHEgj9t3XEQHlUKrphx8JzwRK4d/hh1PXCV5oXh5vQFLl32DVf98xJptM+j9yqF8yk41A9Lt50qwWf5f/lzX1YN8l3meGYa7Xhli9JVyyDi2VJAGs3nzg3mG+yI1nxBf/Ysgn0Q1I37hh1jopFJYe+IAJI30QfNrxyTNDI/odpYZLrmD8d9Opd0ZIun9eUhVMpJ3S/JqPLjGFy309aD70lxkDwhEpXEaXX+11yyjZziQRrOMHT+J1ANt9G+uSj+1HkHbMc5nBDyzfyfDLL/AmOeXsen9LQwo60IzfwA6Wgez5syzsjwxFoLPfCzozBjWUAcxRSeRGIDFn5/LS+dkQ9mrMm3Ns/2s4o/rSJohNEdsJWkga43JgfAKKyBfk0u79uBPjftg0OvDuMnNjHT3IEacH++uOWMkqSbg2rgXd2X3lORbrHlWkvDo+4FM9XqAxmf3wmbdK6WR8t2y6ZzOLScO3Eb6aSJdb+zkpG0Q/VqvjapMEKQheuohOqVV0L44SDozetnOwZEl0VD/O5f+ZkGAvy0Ag/VFULiiRDx90V35P2pu9mNGlW8Z7S1mFE0l3xhF/KJzt7h9DaKnBiHNHr5ImgHdj3SVFe/z1fMw94+T6B0Yrze5Pwkth/aEdRFL0f/cJsgveyzyy4K5T/AYWTEjB1uLS9QMcjsTP1G1RCD1DCwjDMmLUkTi6jSgz8aW0QmKvdA37C6QzkCuazaaen9Oep2gpz0qph0WxpaWpD9dwe/bXuAVt7Cz39ZT3PnTy/tQac9PljuYS69UUbFtEqceY3z1YsycswtpjljjCCuu0SXTfuYJ7+ddZdGap509MEoNA03TEarFJDRM8sLavQ8gNegzWVg5FZQmKX2qTy+BgJB0tFn+DGl+gPZFT2eFvRe+BJE1mNNZpN36e6B23tDiLqifg3V3BfkLet50UbpY7HkmC6yOW0Nov9ngOKEMY6oKaZcaQG+o09tbRLqTL9I+JwD1XET2sVGaCrTPvGCJjaTPEy69BvGiDz4FekdhtsdY+Yu2PdIYaPe0bsaT5bpGf2wf3gcVlymPzBhcyZL6CAgeP59q0EOubF0N7jM60DGsUGmRPmpFd6k8bj1bC5OSvoKIIUAe+S1m7yuFsWOmyqSNk+HEzAitOmOmkTE0mo/na7/uebGWT5BZdgPAZfhxOFgzk1WtPyayPt8niDVEVdIoTCkcwluuxorYYQ+A5kTgbzXED8msfbKV9lD7V1rxuABr7ueh6eNl7MSQf3HXF4N48KCbxTSbUGmrQ9IxRjMhNv2ZrFhbxA2YiNQrFhw6VVQXPoLQqwHcPedTkT/yNyj6oE74zewtfW/9BxLnmqnayoidZaB70wXNl3lKx1sMxhltQfJmCG25isQ6SGeUd/+M1Orjzfi73x9RHeuF1Yh8bL73nZjZWgkFj+JZ/1dfiEkOG+msH2Fgd5AG6yfId+euCbtMbyTNQfIlQT7eyS7ZXz0S5NWyrLRan/+WmLD9B6T54W0bfgfyZRZ4eDxrTZsIckerSL3ShKRnerUfHvUDeOsqb0l8g2FnmyFi5xSw/zhEnQUcNllRHdMx7peh/GafNxjbEio7zBxRZQPSU55maiSd4kN5660R5C8pqHaM6iocJhmw93Z/6xN6tegbnS+D2cMeUu0u/R9z7Z6Gig3JY3njz2noMnkMxjnZgDq74uD0sROVPqDujQ5ynLsC+TRWf3IfvBasUDrDb3iG44sFE+j9Exj1U/EuS+lijXYLpoHfd6eR+FFL/Mrm7ZoprQ8+ZIGNLlD5sjeMux3GyG9VBlN1YZ5NDImTtSpnBW49iTfmzuLz2/7V0z6g4fUHKjsAeS5Y/D4bnTSPWUcKk90N4tE/+lcgpsbS2+ZQ4XpV2zpbSzq+UemA1uOKMcv2uQakizzZIoah3xLmqStk9GxYfzwK62+fA5o9IN7CulPdUHms+bLLGPjRaMjOv4UGJmOE4hxiMm796RU0eGknlE/V/nWR1RhmQHXqbAj5b29JzNL5nfpD+3YHRi78G+0fLeKUY4TZqRQwWODEab+AvFC7GLYI8hEhNozi9JmcMpraN1aYeo72xQzcc+rA+td59J5V0JD9FFI+Gaidd/l/QPuG8d0qgfSfGa14DeTt7pH7x3BiA8iomstPnH+leFA69NtPbNWOdi9L8IrTQyF4CjHOTHR85oO6vO1Q8s4AVUY5eNSNCdNhoOqmcmm1y3Ro2rZE7QIjf+Ll5skYVF+EIe5pwnqzv8pplG3WIeU+0uK5mFQ3jW86ainy364rJl0RKZWOsir3Aju69i8I6nuCOL+P3v9JuL4luZ+8sfpnQVlRvb9Qnk49F8Q1gpgUnJtNuFGX58RJE4nVtnX645WKNrHLI7ZTnykrgMeo/SzotbWqgVA+TnoAR9euBe+eu8XdP1+hpslG0plY4XV7SUyGaSXxSFpAOTKd/LKvJH9ClaPJ8znVHSlbctIGLD0XB+Q9aDzhQ7Z5UASoPJ/0NoARF6D/9EhROtGaE7O7Ks2OsumBey90UE48D8SPNDNDYGXrC61fNzN0bewnyYdg3og/kWYDPQ1+RLPJfUAxleLs814tWvI3V6PKzfC8KQ5ODImWxAtCZdqgoOPC+bu+1PdPWdmDiyJgf6KWeEiqjGVncos4Iw3T+49k6u7BuGO3+4v1XtgxZjx2XBuFeT+VMWJHTlqNpE/gP/0V1qXYsJBjH8q0valMcZfbCD9R8etxKEjarTyhk9NqNE5SeSNxCgpvxjXjLZFmTGv4CMEz9KSgfnTW29S0RvkC7Z1tZ9ZUvrWopq/SIxntdUFlOcqnQax9ns41cn8+VNuEUua0kJTVRNoGU/K31WB5IcY9ZMchkTf3rHZz0xso+HivME85o6WMhIknCjBtYaxQOVztI80ilmX7EkunQ9CBYiSuYSsvLQTaIawEYyy1SoI9GXvA8awLs5hTKxrbvqdsNUPvc9IJWyc4S+NkI56xYz7XHDkK4U+zQGUW2l8eGnwLnbU9OTGJNjpoMlLdkfxZkpaLumumQL5y3gAyWGiLN9JOY4WrNxLrAnFK8ciSf9mmo4eYw+4u3KffODeDzGzm2+DFaNaB/B+jD9SwWsc74GjpxlxOFWFHioC0hd04aRYqNtSE9sKKbSVQc380b/zRVQb4Egsun0gZ/iKk98/ByI3HkXpIuWY8Ws3PoF7niKT9fvLghzNkZnp3ru6T5r24D/a54VgfO1EQf2oph4Njg0a0xc9CymQs2OAp+Hbc6OQx8h9uZXycdHoQasYfYlRffaL9MaxbbNQ5v96yL33OUF4/x1v5K9Rd2w15f99WngTk0ezhZ2FAfiDJnyB11EtGOZjYI07lUurPfrVDMm5cCSQKS16VlFtsHj0M7cCDmz3cBZTxofXZOCQeANI0lVFkYEQZnP++XUs6QpmmgHLvWeJDRwjpmYvki0xkpeGNjJtocduH0TOReIH5n3sjnAyrkTKtUHdIuXeGIGVadLlkjZQjgPzZvW1DuCA2ZsQixAHLoCb+LESOPIER4W7KDyi3OxEzx4PJX5903imoPaDacfSrB/pC8kmkfWMtyXtVNhAPy1fqZ84roHxYpThSkgew/EUPmG17rNoBptiBGFTQ+SF3m53M/uUSkI7qwyxbgfInGDoUo+eRyyKy7hQ+E18wypmKgxl9QeH146hmIyzmS0ZayVJfL8SsB5Z6x7Nn0O3nWfDudpXI1O+hmn1O2egZU95r+I8v1qwajsTzYJy8E/NOzAFiOHW3wZWeeUT1kU0zKjqZMD3Pnr1csRXIA/SL1vQEK3ZA1RIcn12DjlMa0pwPlM7JwBvDOPUXiX0oZ0UBfQaYTx+PJdO7UkbchQcDUE/6xsh3wSBzOOKXs9nNPpsgOkppiD1X+imfd2iJb4AYUtA+ql0Byr7CekqxoHyAJsUToVPj8/2YyrFFR3/SenzfRZrmbeDkp1Jpte6zOJq5meTjwXjifCTLD9nMNn2YKygziSv/NnVyCc0akq/B3e1/YPtDM563GoB4SKxdNIjm4LC6r5EN2csYzTPlrOGy1KqvLEgylaRnGHTFSVZv8QHyR9VjdCoORMUPpMfYvPIwuJsvV/vKbd5/Bu2TvxU49r6WMgDLTN/GHr55DMqX6BlITCVodhmxDrgOdZDqnRPtNUC5Bayd74qEyC2CWI35XJ0ApAHksde0iZ65zDJiBxALqcwLdrYfyfPfbyGe79J5b0Z+p/xAcR8UuuQg9VztrEjqwyjj5uC6rVMZ/S7WW50W9edOaOvMeqkcKi3S70N1YRBQxtcTjyJlSySv1TZ8XoltWYuw1dBDqFxMDM2SfKs6ebR+2Ujy12+Y0h//6BA0vnVE+OweCmPfzRMNdvfY0dp/gJiRq1wfNGocbtq+pzhpYymW9b4DlCdJn0ZCm+mvQjieoZwzBIy6rMLn4w156qg1lD+OaIkbMG7f8WLKvFqHk1+Dur8mTwbHjlFC6Qhlcwjft51RHVXOENlfBUFD72by3wRUHkX+pFV32LQvoHpKnga0+8z8yShU7EN1YxYTb4N3YE8M2GjQyYLq/iPNca8gD5dUd6mYkN5V6Lpm0+dpVO/0lO/Eix9QsZdQ9yD/B3Slpws=",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    