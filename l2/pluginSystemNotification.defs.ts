/// <mls shortName="pluginSystemNotification" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSystemNotification",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "notification",
      "in-development"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
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
    "securityWarnings": [],
    "unusedImports": [
      "css"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "No ARIA attributes or roles present. Consider adding ARIA roles for better accessibility.",
      "No keyboard navigation or focus management implemented.",
      "Contrast and font settings are handled via LESS tokens, but actual usage in HTML is not shown."
    ],
    "i18nWarnings": [
      "Notification ( In develpoment )"
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin de notificação para o sistema Collab.codes, baseado em LitElement. Atualmente exibe apenas uma mensagem estática indicando que está em desenvolvimento.",
    "goal": "Fornecer um sistema de notificação reutilizável e internacionalizável para plugins do Collab.codes.",
    "userStories": [
      {
        "story": "Como usuário, quero receber notificações do sistema para ser informado sobre eventos importantes.",
        "derivedRequirements": [
          {
            "description": "Exibir notificações visuais no plugin.",
            "done": false,
            "comment": "Apenas mensagem estática implementada."
          },
          {
            "description": "Internacionalizar mensagens de notificação.",
            "done": false,
            "comment": "Estrutura i18n criada, mas sem mensagens implementadas."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a múltiplos tipos de notificação (sucesso, erro, aviso).",
        "done": false,
        "comment": "Não implementado."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Permitir customização visual das notificações.",
        "done": false,
        "comment": "Não implementado."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a notification system for Collab.codes, built with LitElement.",
    "Currently, it only displays a static message indicating development status.",
    "Internationalization structure exists but no actual messages are implemented yet.",
    "Future enhancements include support for multiple notification types and visual customization."
  ],
  "embedding": "eJwdV3dcjf8XT1QqGiLaqCQjlZLuc06UjOwdITOb7MiqiIq0aCANJZGRRN3nHBmZiYwkOzsr2y+jfp/7/eve+3p97uec817nedTUQkrU1EL6qqmpeVO2CZ9esx0G6Ezm0XV9pc1tB+HPbgmwIf8f+PwI43vZv8nt0B2Ykn2aw4xGUf5ZFza3OAj+5rNw2pcPMGrGT4BNd6TmZ9Vo28WR2Ey3Pfh/XMlb7oSg6SAr7Gw2hXo4x/FCjbNseSMOI+LfU2FWU1h/wQbVtXLp0z5nnN35qhziMQhrh2+RNetX49hdk9A4oo580BNXOSzkxEOF1DHHkF6u1MQWjpX81FSXX304QbHeC/D8j/5wYUwmKh4Xya4HHkkPPHWx6HqK8t+ANaT+IpJ7Fm3ih0fm4rdPT6S45dXkmRiLXk6PaARNosf91elZ4Xg69v4wDT65iOPVsjgmcAaGFq6ghslJMNy/UV638xQ3yR3Km4bp8Y+19rRA0mSLoYlwpMc3OJdUK6nphcrbrY8oOpYd56QOz2WXoE+010CNM9asY/+72dAwua2YvS9PWXWVmsfFS8GxffiLyT3p8r8CWOTiAOO+uXF1SYzC+PQUynl6CXtmBmDq1jwOX2nDDzb85gnjtuHSlg54baoWDt5jAQMSerDoidZ/bXXmcbI+Rd81lmb4JdOAh4tQcMJOf6/h/YVh3LrgNY0+e5vWK25x2G81aX5xFNwuOES7mu2B3WMvszT2Fb1oe4g334zkg2gNC6ZmQ8mX4bzftRA/2mmiRcBs7tXMHf9OaM/68YLv41v4cvNNYNC7H3YeXAbr0jSwotM0afPbahazkHPXYvY12Mj/tKP4U3ACzb/tx25rX9Hbz7m8YV4fLKsJU80NgiPYdrECUh6boq9BI028flqxo+932vKhQvAzEYe9uU3Wvy1ZcC9fd4kFm3R3npZ7FJeBOfjojaGJB9vJQlO423Yiiju4z6sDclmNOp8yqIGf1eGo3n4Nhvi0hXiTFRy610a+6JvCWeuXU+a0PNpl8V4SGHLla30pcNRK8nKaLF9bXUVLjt2Ca1O3qu7lS9U7ccoqH6HdNBL88cXOXdlbMwAz1CvA8oIX9W5+HHZZLECTd15c8HgtZTh5wIKcmaSn4Y+JW4xRcfQaPPDcppwXZa7SJHQf7c7WRoEozvKpPiNY+2WavFH/AYQPOIV3K5bSfkNjqmvzVBY8QdAUP95hZwNjLI9RujKOpBZ2Kh9x72pPfhDQBZ27ukP7y+7cLc8SBecqr/HvE+GC3xAWGpFU2j3UKo9K60kWWPIfe2cK8tYh4SHMSohTzSTN/XcLlyQ24Q0rdpC4i2LbrIcuVmMh8o8xLH4wiPaUfZPffW/PXap2sZ7GE3oeNRX2bCqkzIPvoNmjfMWg4z9JhdHE1j/hWs5FCvFJwqs+taTys8eEyTApT58znM6AtX1LHlY0C81Khkjnkubx3G5nSfgHNRR6XGMZhismvqCJVVv41RUjMgtqCSqPX7rRX/D2HdaYGMFGfT8uXLlL+tnBG7PyaqTV8ik0OJfoHviqLTiGW8oXFn4lgSF/3hAFHX7mQMaav9KdLr5yl6o27FQ+ma7cBqlv6zbQvDCf31olk1nsFIXgnhK3JILJjzjUvb0aFu4wAqw5hs69IuS1n8zww9VcnnEkm2wb2vDcf6Nw3v6FrN3tiWRu0ZkUj3uj1bwpbHfHEluyFa4MDMXUCR7sEGqHeV830UXPtfL6RyuwxiuD8i604cuTDFjbSI8Pjl+OQz17c3/zTVzZOJUHJR1QlN0roEMvWFF4JZNfuyyFz8tlFrNRpcMNEprHSKte/O7iCXD13ye/a/mFFziehmWwVz4edwl2DZ0I2/JCioNjSyjxkCsLTcK/BgUbB1qh4BPdZ2+XXv0KpUe6/VnF7Sz/GKlXs2I5qdoaS68NL2bzASh4oYLSw+Cw+xfs6LtCoROlwOlaurjq9RE4E5xJqVu7YWbVfTDvtVoSmY8Hx38j4T38GFiK97KDcXcLbVn4GsdY9uBVjetBeJWsvaYoBZ94x1ALtXzHsdACCtwV4zoegP6BsazVeQ467lssPKqBfSffYZ8f6srMad1w0boPqhxk8R9VXyh2EG9rbEn2a9xxXVo4F6a4iMw7Jqt2y9cxRlzUegIejb7JDd3tucXUfsXGQ9RQ5JIqs3FCp1ReYWiryi5EjkXheUV36yHSQZNmwivpkouu4X9+Un161aZCUvV+Vq5vij2ebmJVfgtPY22GEZp/KobU9L/0NegECTxg56e/pKrRNCAc97u6il3xEXoNDeqdX5cJq9/ZoBEoueT8M/I/rolXH28DkUmUAdF48lsKiBwQmaiDtocjaEfTcKofa4/Po56ysiKWfe/EwOVumTR+/ixJ9AsCX1lqkQOP52WgYaIVx/7txiLHVDktZ+VNVyYVNqOEHq2wW94+utqkK1W0jAWdXdqswq99chmoTd/Bew1CUOxn/mA4l+ekrcS5L5ugX79ZKLzAd09nwBH/Grg17oYitqsZerXbTm/mhfDX02HUZ7cJfj7TGsL/IsR8uQGeoR1w75eebPutL7bYqSbPXK/HKflKWqarw6PWvKGa37NRe+xWON99N/ftfFxu920SF+RvxvzGDPy40JUjrw2T1i7bjMEvnsGB/DRyfdCd/wZEoP3cqeA/PhomHiapz6phfKHcGJ0sgqDLuZGIb3uB6ozd6Ug4PqwPrl6TKKW8fkpv7wzm+6eLZMkvndYuDeLG7CbwvUM5zSo1wQn11bK1Y7j4PYzT7suS6BFudlvGAZVfKejvBBZ3S3dqD0LqZF3q2ayRonUuo5gXr+zpBI1DY2GrVitct6sfFkT3piULosHvZnP6c1EXfWK64Nwpm/lfnhEmT7hKdy5OpvYHl8PfMZnwybIdej2IR4EDBDjMck/fuxlTKjXPbEhPopVtbsGmkGjS9yU29toCEyw6wRPlIrztNoDL+8/H3X1uwYb0tmS7+yasWuwla34+J7WpcsDwcT3o9ZVV6BmaQYHFXTjZ5R/5lp5knYBpsPREsnwv7yVpTUqRTU/b0N8e47npq0X8NaEXNdVW0PBQTQy6XCD5p7Zjc98O5OHZmXv/fAANGuH0wc2Am3Q8oeKWH4cPwt8ZfdjJ84Ks7SjJv6Zfgv9dTxV3fYR7FY6w+XIyOOeZYuKmHMotH8r3Ez4UxQ7uy867XVSccAS4oZgJD5z/n+w+4jr4+IVLwSZGvOKwJsYVJjH+3kvrJ7aAEacOy/vDGiW9hsF4Wr1KGlcXz9qOMkXP7I31tjFwp7YzH+sSwjdnZMHniBns0CtQ8KZQFo5cQfPbn6W6gP0QmbMD96xYxYYepZztMgO+90/BpeteQ3l0GEUN3Mb99Hvj9MQtqML0hMFavmxZqxS90abBD4X+CsGPO2LL7GrpnsY9oZ9rcuWebXLzqquw/0CZdMsoGFTzqO6bvjkd2+6ej+J+qWu3zjyHgkHUpNrmn+H+VUu2CThEbudcIXbwWalUnehB8Aqubb7k9NGSgwAL6lXaonbfHoK/dw7YVjThugBr3rz/Oqwf2IluqXfgs9EWXFPbUlL1LHrhjZVEo1IL8GPGA3kO/YZsl+f0ePpf7NS2JdP3E5BRcoHanemFYe7qOKhXMelvr6Hik+44PLC9PLZ4mrR4swa2O3OKtHx6ouAOgqpT4HlklPKRdjtc+DKCni4ciSfNbtK3hmiK19MWXPeDpEfJxSfPT8EGxSGaHF9K5j0reUzXwdyYsIe8Tg3g42Gz8MhsNxjXax8nT/DBG/segsCRF2ldYUMzDb7c0oD63DyD1QZdoE3tTlVtEp6APSubsn1PBX7RSEe9BxugumOs9Gv6AD7hMhCbzejKPFUHbQK60KBWH+WJh4EW73pSPPVnJDiteguN2aFSX4UxZl1LgqKNO3FoRDKIzKCynTslwTsuq7eGs/tWQd79dNTacF8Z4nBU9O6N9j2VAudQtnjlxnub7maBnZxwVAPjW/7F0GexNC/eHg91OkNCU6xRHgYq/R+J2gS1I5vLWDqfTz1NQpU2Aj/dxPn/1Eil57qgSBa+oH/8gbbnV1KMeA5O62fkoVGuDtvWHcfMYX7w8WInlR/l1U4bQHyCWUMP3FjfHHeQPZzvE4IBFtsUQZd7Sm0KZsCpcifOee0NafclPvk6V+UBjteL5F3tKkj3zCjcWAl8wuCPVBlUotIhnnmo4FJ1YKnJMRrdfBse6p2FV/Ia6Xt/E+ypsZ1Msz24aNIVafasRBru/knlH+nmSA9uMXQun03bBO+mT4cTLpfhyOzT4uwZCnFwoGCtI8UeY/TY6HMnXHNUkjp1no0tJH3KevhZ8lnwhAR2dC3MAV9U7IJvVyah4iArRe/uBucTeHDpTYKCOOykYcdlD9PoVmst9+mJmrBreBi+VDxjwTG9/7wZD84MY+sW7ri3qSk/NXqq2L9pOwq8sfRJoLR26S/S2dOKWi2vlX/hb7r/cDNWRtpyV1Mv9F8zlOsH3VDu22/MYXZ7MSGqGNbCbSmkb2vML0oUz4cFBAu3UO3ICPqFwWDs2B5rHE2kVfF6dOmkJa67NpfFf+jDoHmY5tRd6uqxA0Vm4ASHRlnM+5/n8g0joINtvtwq1wzFnLTSPZWHh25R6j5PlR/9csKnbl1VOhV1NPFFxHpemu7MhSvO0oELGvzp9xB+r7zNSdY2cpbhfsx4oQ8i42jdtbeg8ubxqbZoGrqMPxh5o/C/soPfPRXPdO68F0pNeqBv+lsy0E4rUuV8l+1dacCIfOn6h//BlqixuD1/HDmfCeEvbbdQ759+IvuPkqWHPXpOGcdC79zP+zF2bmjtkfEiRuTMZ/HcOYONHdPBzMAYF8Mi+UvNGFQ/foXaRhryv4jLvLdNCAtv0jkzF/4aOJ/FPqHGwJuY9i4DFr1YK980M/HYts6RxA6Qtldm4KbBk1DUVr7p78ICSy7tZcn/drhjw5cC/GH0AZwLnKQ7qwooY20XDFWT6X/wkB4OG8c6X735odVhynb14PR2jmi3LJAyZrXBo8d1Oa/duSLTvFraOPczrJ1n4eFrocFPsj7B/JkJmDLTFwyWDeNJGv14evgQPNZlD2s0raFqrw642MKOlUZJihJHW3a9qMud9H/QwKhZuOnYbhQ1cajOR9mlMlg6m2DFA6NewmOja/LDd35smJOKb6xIpmpdnDbyD0S20wPrcTU0um0L9u45BFu8nsmqu+sC3Kmw7jklZzWHjXOX8OzMauls3fL/5lDYTcTdyXbcZXwaZeTehcNLtvKat2/gbdgpmJ05EcNX6sONidk8xEWbA15EQdTaCNppWA9qRZ15VNkBXK4ohMCQDnQvLZOL1l6HfK1sTijM4vR34VDifxOytXayubEOXvIcjVtHp0C8jRr2awjGVXE35Kda82BWSCzW3jA7I87RON9YrPL/AtU2rxXnJ+5En/Bcbvf6u/uYkv58avRjsOw9hm89eUueF8355LneXNSrJZdaaZ/JykqRNHJa4Naji1g96BdMexzHSs9zEK4czm4VJXD3cFP8HjZQeSC5Nw7xXg0D7N5BhOFb6dn8mbzFwgdSXLujd88yvqJ1WYYSa5xztjUPvrUDGtGEoy23cvh2G1rYN5WnxuVB+jsN/rqjM6i9vq2MXdkeJuhswO6l5fBbvCOD2WpoUeTOdW76eGStDObeJyWdIxryw2GVtDbEmYpTtLh5gy1lKtbA4ydrCEdegb0DtyKU7Ied7ayw2isDSnvto38Ta0l7sC5dzhrKTu6Z0ujJZexckM/rridJOl9LJb+KZfxn924+FLIK3pmGstavRqVPwRgOPDqE5duvqGLtYuxR9AE7JLbCBzs0eUzJRVb+DWXj0sNyr0X9YZ+NIc9TS8Hp4WUkcOMRGs5Cn1X4KMwWG8PuqzTxH87P9GLIZ2S1pM0rYH+XKFDhNf6tCx649JzibULk8O1ZILTPGVUNoAxcQE8GmZL18r3w0S+c0wpd+ZvVMPQdcgyM9hA9WeXNVQFtwbX3D/mdUyJP/L0DhYbxpc0vaNNzK+e8TKWNPzQ9upm3/o/Xc6MXc/JtZ97YwhzL1FuQR3g7aNXbi4/fHsup4t3I0WwOv13QQfrtGCybuofg0cvp3PClJ6rnDUTr5ebksuYAVc6/TY+Oj6Dfjr/lC+1m0kHHTRwW9xR+VT+TNXK2Q3BdS9h9aRRfTX4PmrMfwpLrmmzYdBkfV9sISakzyHbDSJ5Xv4x3NonCAfV9pFcTB3LCi+HQVN8Lu2Y2Q6E1xejJQ3BDVRnV+yXShTv7hWbteWTieLZr1BC1b0JLMxdsaXZS+uOWzp8ca0mF/YuE2zRDafZftghcsHGsA3aL+UfxFn44qr4CveeaSQEvdOSIF0zqD75QU/3z4Gj2BvTy7isPXJohGcY2V+kaa40mcb7rCBI1aVT9SGX4yhi8n3AOfqtX0OwVx9AtcxeoMCi3GcfPoBhPFfryiE/mPEdjLPerGIkNDyyxU0F79tbogNhxH4k+ofa0Jpl8NOWoqkfyFa2BKk3hxzRvrl96GJLVpqj8Tpsu9eDtqaMk4SVSaUz0Iol6JLIQN9sfklc63IVFyjxouKCNwtfYx/sNZEVvprabgmXhNS5+cglmHVXgtMeG8P34F+nj0t2sfy2BTr+zQ7WigyDyis9v9UBVvprcC4ckzx10prwLfyxfzOte5FHGsBBwrpnEmYp6eX2PVjxgsgLaTM8Hg/QgbrYM4ExaCHxcaqrKUZjWcRRmZZmIbBpK6QMewOl3OQgfy0HFqcAJDrWMZqeO0VD+tA0PPJgG+0ZL5FFwHm4bFVPcfVMW98pWV4NQUX8UrCdvpbqEmbB4yC0SuSUXDVhHm33HwqCOx9h25AFcscVUatL6n7R+xShJ5DupMjnnj7PouRu+rx7BXRadFFm9TZT/xOK1Dr90dUDBB6r40bXbxYJbNqsphnvlQ7HvGjexy4vlzjNCoGp4GD/2/C4NWTOIr7guRc+jW0lffwxGVU3mGHuZBfbwINsMxZ4BB7sr9Mw2C1S592bYbBUeKPaS9FzdAa/ahqHQKIcrb1CO/RRS5dXbsF4svIBBHb+hmf5L6a7WfZrTs4F2rvgG2tPb8/vD2XTQ/wib+ARik2Z6uOTFHlBliMgoWN1qMzb3C4YDodZYU/6Yun8NUqryYFRZJ55TlStNqkqGtMJC6ldRAQV/+qn0LLvqDMFraYag2dsJj0fv4rQXU1UYyje2jsASEwPMvBxDvi67ubHTZnj4Rc1jlN1asvO+yNMLVir/168Jfr7SUzI+kij3MWYoczxFQR2Xyz0bjXlFag+x63I41WKBYvBb6/92XIy9xJenRhMn+/EaJWPriu3Q3rwpD/roz41WT8hVp0weZmjEYldjs95qXC7eg0MP7sOC0gpwy/fk2wfcpasParChx3t5cX1fnOsVgXmmHTlorja0iwxiZ99k2HlyG7xV74azirvi+IRDGLklXrrd9CrsrdtBnX5MpOcHw1Dt0i3Yd7SEqKcJ2wWG8Fu6hi3qJ5O4Q57hq4MxN9JINlyC9c63ZBv1lxQf/xw22s9G57JxqBayRBm4aAPOMpYg/2Cs8PNfKPQ7jT0ONeVzJhpY+ngg11d64jnBa8/wFWj49AoM/amBHWoMpTYdvTm/LYF9iQbodo5lo9tnFBsDB/K/doh5d/sqMt3M5a4bTikiW3ygbY01so7mG2n4AF3WDbeCsG9xuOv5G8j8osCFZ2vJ2ilJ4o9ubDo8Dox63JDPjn0vOZdVQnC/37DusMjCzBRSuzRKshpymM33GZPhz1Xy9BZtcdLHMZxr141Huody112zaMvUKsWc2X1xyYdekkb7tagXc0HauH87ugzWQ9XsHfU/0c7w+1D0ORU73+rAnbed5bcJaryyhzOGDIlhn6YGmF70gi5PbwWOroE4qWchz3mwnpcfr6erY5tz6SUTMjTawTGtmyB/PM2X3yzAqXdK6ObeXbQcgH7tnQ8p+bY4as5jedBmXy5B5tebvklTVx1nwTMc8nhAk3q64lW3L+jwap6ianu2NPBakTLo0QAO7nadBpt6cED3WlLd0dnBiXMXRcOCXAm0TtXQCOUgvAvtGXTfiyzdwksqI0jgxAEV1ZD+JpGX2e6Q9x+upqhb4fAg0QdGjeyBj17foB7n8ik9wxX/LOjM/fa9p2GXb8uF/+zg68Q6ejfaCfbIV6VLxmlsPqEQ9D6Mxp9lFpxVri7t8VfAz+dlGFoyFKsGlMpaXllUtytPSrkyBtO9D+CW7N7YKfmaXKf9jkqt7XnqKkf+fkmX35r4wcNlhuB4fyps2tOasj3PSjq5VbL5H1vcrD+aK95EUM2UGIGjHucF5fP7S4v5f2b7oVgyZLvrMWj486e8UHMIO3itoQW5MiU2i0OXHAssz7XCjvqLKeaGFZ2P9uL+LqPR4MpuFl6ib2uT2XG0Jg/QjWBtV1NW9awdnyvrVWZh9MNcyHE5BWV/ddCiVhuUfa15Uqw3h937TU8TXtCGCSlsen447WlyGNq767MK46htWeDhfZ5Sk+LQMOWN7NLsCH3u1ATTJ41Vbrw+XhKz0UXDljjvVH9+/0KD/slHCMIN+eSGQJx48i/0rzoPAlMp/v4FmDpVnctz00hgj8pUZ/7fGSPu4JEhebw5wVpeNpzz6S596G+HVhqDsW5XNzQer407y4pJ8CGrvj85b0zS4x00dP4FLDr3Djo9OSwH9wuWdXJ9odjyNwxteVLapzuCBNbcdUMv6vqwv1S13ZaXPc0DN71b0j9/S86xaC40YsydQs3JqHYhf00bSWP6ZfOzVns5J+4iBAxWk0U+wBOrA7DkwDiM/upLSz6cktMn3eUucyJ46p0++Eq/F355lQ9LfAawzwE1FpnD9dpaKm/yEmeRVYu7cP/gAoZRQ3lPlhn2mJWJ9THPhB/Pks06HVQ39hWZUykLbfORQQ3Szs4+LDyN0xxvksmXUJj9NYw/vG2LavO8OHrEGzlmaSwE5Ojj+azP9PXvU+qwx5EFH/TeukGh4vBLREce6xTJI1bMYZEfkHf3LNtnLuYO425KNuqzePmY+fhknSsWWwbzmMgtWFZeJdsMukj7dG9KohZEJDvwhsKDFHYvWHjAh4fZPIeCkQk41m+MPLp0IQe/fieLnOXBQcOk4MhJGJF8FGZr58Os5YNxwKfPIDJGvJdFsNPv5qhXaQPLy2P5dXoU9JjVkZ9Ue2PBHE+4MtsGRf5B9spwqii4oPIv7Lu4SKUNut3Uh8pO5crB0+JoQXw0iXlQUliym+1GVHEWZ5mNjyJLMHLeHxo0qaXqO+U7vFMENw3DuFmabGB7CFLCvkoPvt0Ht7HOGPGDyeqgAlVe6PSkq/Q0YSa3i/wFzosvKV6O1OBpA9dL4jyopWphfwsbrhtRBjVT9CXtut5Sm4sn5RbPj5J7lhuv2l8nLTYIBP0Lzc+IXcWhGg54btVOXDrtO3keXonNHSM4/5afwPcduJ4ZgjnBSWCf+Um5JMaOF9TtBYG/QrV3jB/NUAoszjwJ0FL5Dv88DYDrXebwi5Lj2LboEA/9GY7Tj23lve0msrv/PVy53ZP7uvXGPQNboP+vX+AQ4Qez8zIki0Jv7LrrJbhW1lMr/1De2fkq2Df++2/nCI+Dbngafr+0DVqM/wCt/Juw2JeUVR4GYu+JzLIRu+gsiAwiVb3wQfbyzz6TpDZzs0Ht8UY0DShB6x2d+HvuCnZ7pclBF9uxyHBp31x/FLonkY2U82ksi13DN/e24aTKKbx4fAU1DA2jgm9NJbHD5ZJn3ZGn/8DE6ek4fthVVS1cnfgKhCflomFHqOLaUun/0KiG9A==",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9836,version:2"
}
    