/// <mls shortName="pluginCollabLogin" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginCollabLogin",
    "type": "plugin",
    "group": "other",
    "tags": [
      "login",
      "oauth",
      "collab.codes",
      "auth",
      "plugin"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [
      "mls.l0.providersConnected",
      "mls.api.common.getCookie('loginUser')"
    ],
    "statesRW": [],
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
      "Tokens (clientId/clientid) for Google, GitHub, and GitLab OAuth are hardcoded in the code. This is generally not recommended for production environments.",
      "Direct use of window.location.href for redirects can be a vector for open redirect attacks if not properly controlled.",
      "Direct manipulation of document.cookie for authentication state (logoff) may be insufficient for secure session management."
    ],
    "unusedImports": [
      "property (from lit/decorators.js) is imported but not used."
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Buttons use semantic <button> elements, which is good for accessibility.",
      "SVG icons are used inline, but do not have aria-labels or roles for screen readers.",
      "No explicit keyboard navigation/focus management, but default browser behavior applies.",
      "No aria-* attributes present for additional accessibility context.",
      "Color contrast for some elements (e.g., .footer, .divider span) may be insufficient for visually impaired users, depending on the theme."
    ],
    "i18nWarnings": [
      "All user-facing strings are properly internationalized via the i18n message objects. No hardcoded untranslated strings found."
    ]
  },
  "planning": {
    "generalDescription": "Plugin de login para Collab.codes, permitindo autenticação via Google, GitHub e GitLab usando OAuth2. Exibe botões de login, estado de conexão e links para Termos de Serviço e Política de Privacidade.",
    "goal": "Oferecer uma interface de login unificada e segura para múltiplos provedores OAuth no Collab.codes.",
    "userStories": [
      {
        "story": "Como usuário, quero poder entrar no Collab.codes usando minha conta Google, GitHub ou GitLab para facilitar o acesso.",
        "derivedRequirements": [
          {
            "description": "Exibir botões de login para Google, GitHub e GitLab.",
            "done": true,
            "comment": "Implementado nos métodos renderButton e render."
          },
          {
            "description": "Mostrar o estado de conexão do provedor (conectado, pode conectar, pode desconectar, pode adicionar).",
            "done": true,
            "comment": "Implementado em getState e renderButton."
          },
          {
            "description": "Internacionalizar todas as mensagens e labels.",
            "done": true,
            "comment": "Implementado via objetos message_pt e message_en."
          },
          {
            "description": "Permitir logoff do usuário.",
            "done": true,
            "comment": "Implementado no método logoff e renderLogOff."
          },
          {
            "description": "Redirecionar corretamente para os fluxos OAuth de cada provedor.",
            "done": true,
            "comment": "Implementado nos métodos googleLogin, gitHubLogin, gitLabLogin."
          },
          {
            "description": "Exibir links para Termos de Serviço e Política de Privacidade.",
            "done": true,
            "comment": "Implementado em renderFooter."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "embedding": "eJwdmHdczl0YxrW0KA20bKJCdvWc+5AKlS2bSBRee1T2qqQyGmSlQhTekIx6zn0QKXuvUMje2eMl7336r8+nep7f79zXfV3f68TvuYWzXXtyvQf/4mvv2/D+bSKcXz9No+1nJv/u2ouJNhk4ziARruuuA/n1X3HUppZkBzswh0YW3O/Uv/BuYzpudO0guoXZYAenHGDdUpjtgQb0v8686Zma2DTrBK5Ifot4zwUm7VuJB9aexJK8Mtw/bAM4f7eVyZkSA25dgccWp2GfJgLOtPQEt9Gv4NZgwT4YfNOW1T2k6f89GrPe1BHfGrbg7sbWOGHtSxHT8DG+quUiMjZVwiarVVB/vYM8M669OPVRitaW9tz1Tg2Z7r0Er+U4yMMDHmFoSTs0+haFx/ofg3fzh2s8mtcVOh3Osj+7A/CKXj7s6t5a6sZopO2wZ5r+/vfBdlgIfH/akTdefRx7xU6QAbf646o5N3DZ1Z14It2C07Oiw1CQ7y+fly98/rIv+9vTc02Sv7J+o/0IXXl9yFO5+EMyprp4o2/5UGj7eS/uCHIAk4K+8nNETR7QZhUsPHoBbEbuQ/UMM6MfM4P0MD7cazFvMnO9HGmyB1361JKrh9bgX+Z6ihpxNXj/7wbYtMtONtzrD/7824nrDDDn5kfKWbfnnfixcju+usRBjnw7jsee7SEDF6TCxwMjZX0DDzn2oi92cnwBjoUbcfG1i1CarS+tm+/BJo/bwRORJd28DXC+837hN7AO+HU8x/rEWMqlJnXln7Iq6JBfRzjM1ePxs53luW4LYZjpdRQ4Qe46dBYGRu7UfGpqLXt1MZe+5bfRKO0ixOT4SO2JvdhmYm0527UYRx9eg4uDDsLHS02kzUgX2XCdvuQX8lh2biMceHsehIf4gnvufVaYekHcLdoP96dcgsm2ZdgnJom5eUfDoi3bZWnhS+jcKgridczk0oXtZaHWkgcdTMNrUEPaJ7ThpCf2xN9U6Y3JqDpInylTdlrj3QBLuW66kKUPXbHg51YWmZvHfLIHg+vW2RCR+plm4uxh8D0HQlgyzkurI6IuHpb0fXCo6BSunaUj163WRdcVZjImpwjmivFwutVkWXHnGtQxuQa0L3Dyi568YNhSftLvi+PCczhpkM8JnQVd3icJ0jZ8MAgXbgsOYuO9Bnhd1xybP4rBQE8XD4e5kfyf6VdgRn1TObk4hq9YYMSf1x7M9g+rK4V1A2z/aTlEjbLRDg8qEhlHj4H/iVAZ6n6JZtVS3nqSBgdmztf8+e8MHDwzRdwazOSlpq3EALkeZ3Woxe3+Hab2DHx/N5CtHtigOpOV596DmuGiLU346BbOfKFZFFuzZh/EDnMSe5skQ8sfXjCt/1jc28QKLzXNxqE9vOU7R3q3ed4isOlToN3mEVoNnYsXp7/XOrh/VfvCbXQ/w73TBnykiRMftuUI9vv6EicXGwLtfPWzptUK4M969Tj2VXMFTLc1A/vzDXmQ3lylQ540LQlJ23Lf8K5yidE82FBmwO+djoZClwOCzl02i6+LpAvNWaOrYKefAD1nLoPHKx6yZYdGw8QZPzBqQyzk2R7BfS+2M/WsYW23wfyt5+Hg7Hr878OtGNa2Afq45TOap2jjV4xrKhrItJ4+2MPejOdVGJNfbULtxE/4+N5GeOcYiQmDLOSl3Hh49X48LG9RT2kSHDt0wi11ToHjf0bSp9he+Z0sHvMG1qxx4Ru+vWKvtprJkiAjbDiLc7Ogt0B646QlOTn7ZLVP3Nh7WySdnMgvdr3Ono7/IO4GJKF/P39BeoSenT6B17N43HRnPtI82SrdY9iq7xE8XqrL6XfY8YPQPIpuwcn3pEtIJWxbdgTD5DJsMbUFHP4TJ/Sm1JFuby7i0PEmvLU2GA5Pz4Jp0xyZ1zNTucSnJn+eegy/NdwlWNIbpLkJp6hH8MP+IWn4FRhN3F6Q674L/FcxQeelCTrYEB+26yjuddoheluPAPIZPqr7TUy71ZL5TtPChhPHtfROcNaxPj7YMY/bdl0uvj/NAxPf9pK+l84ukeUFOOKdNXo8a3QOVHWYRV6rz6v3tNsK9A4Irn6vNn49WdH1S3BuobE0WGnBZ/z0RpoPeVIfd/pOoD3hyqfaLfXlShfvL/vLYtMU0uepAuPPXXmT05NFqE5Teaz9TOmp00XGNBwHlgt8eMOKUubX0Q+99tnR/mzD/Ewnvt3UGUh7COtXYZ3uvzHXbgzeq3cf64ffEsEj9bC8TxnrkJ+AN4YtFwvN9IVh5AWkswBji5rcb2CC2NI2VpLPy+2LenLbxhp0Lr2OFXcGyoujbfmFVw/BIuU9e125jFe4xnHlK86lg+SMVVng6tuAp9ZeJFSWyqgEdWZyfOJ+8XT8DJn1JgFqxC1Dw7scJg5dLyhTtVNtDkMvm7MM1hvJLcvL8U5VI+7Y4TB/a6oLmSbLNSFP7mF+x9p8052f4LhzAHxoxnn6uB549cUayLz8SXkF+u9eIe9ODYdfT0xwaeBrkWtXjt1LiiTpi18MW4y0m8zHzV0ubDlJRr4cwyL80lBvSgLc69QU78ZJVnItk4U0uChGjd2qfLuaByjXtLkzBkBJXiBbt3qFNsW6PWcHD4lgQPqOf2DX1XUa+j8ZOvs4+sbrwJ8iO0nZLEdddQNLb1swXTpaOln5KJ/0IK/DgLRM7HTEX+48shYONGiunl2r9mzF6EI2aFkgDvGNxftT+sq/ncz4ifRE+MR+QD+rdpL2DD5HrMQnZn+Q5iwoW6HdNnMIzC0hXVUw8jW8PmSC8iq2uTQFyB9V5gjKRXhzdJ3YFx6NCZ38+cIervJZrzNIWYILChI5eR+oLEiMBTzruBHJg/BBeU2M4tfIW4wl7b2gfGejU3rKt3l+mun3fzOTgkswJuI2th+fVs0yY5svJ12VA/mMUDp9ey1BTCp6zXISV1bnJO0c3na3oDNdo7IT12//zjIqW7EhZjYy5kK8+/NUNxk7bA9aHD4C5Ev0LAg3G9SB+s2WIfm7R2jJQRi0rEwUH92Jm/3zYKLDTtLyInzcuxNs/LESx+teUJoGw+2WnPwYa5Tdwpyno1DNM/bsGa3KqOmZ1+DI6c1ChvrBTOsz+CykFnxb153bn0/T+tdvJLNGt0Hab9rdSJjwvLF8eSwfabfVsws6B97G/JYgpiGPjYQgvS8Y97cSPr9sis6TumjMatcH0h7+KVsCQ286IjEZkLdKt8NN+Kao5qj0epLWgDTFE6d8FVu/1IcLr8YinQ/LXxksX21dy2mvYHVVL3b1RW0ev2cI86h5GVeemy6vzL0JVbZroM+PtiDwKRy1WY1WV46KuZPM+BKflejWoivQjJjJnfWIGRokn0XSKNCcYPu7CjTxzRU7vIYAWtxhvacmwu8qU2yxux6SJ3CLxXFira2f2gst61YPQ5gV3ji7DYk32RLHE1piPva2eaikbGPjE9sieR/7G/MEIvwaouJAYk6hfELD56vvRL9/5rL64UPkjJ+nGXGAYlPS92xROt2Kpx0LklOz6mPgG3fRb0cyUCaw5Yb9MbX2byS/hiG+xlJ5hXq//LrFNIMMXLTonqCs0VJusV+DW4pFpse1EalzRI/Ve2G/Rz/Fi9y/rA0onhx6czeuX5UMjad/x947UTPY2QspD5B8Gz8lt9OqZyGv4dkjJmorR76EQXc3QOW8Axi7t0pQvgAxA36ZexJWLFjFOrfSVzyiobyHZyGrSXuBjPqAmj/mzOmGZd9fs4UtX0JTm9FATC9oZpIYVHkhnu55ELxn7WFjm+sghwHYzqw1Um6JKY+NUO3o/M+6qDxsTMRQLD7ajLwqDnvOrIEqW2vdvKxmwxUPUzbyF8HFTHnPlvRdoDg/ue49bXDOXbb19lWabbD8udZGEDsx74ozsC/cwI34CIl7cOuXjfjmymegM0PSoLTcFA/EVfBqcQnSPLFrY0c+7sW5amb58uwBvc8/YqDLFLRu7oT5KyuUB0BVnJM8dSOchX/ZB/S87HTPdmCQ/hWyR7zAwwOCxJ2qdEbdQXrOvg4zVrVkKlv6RV2EjMpsdFvQTi5yMtCUZkdhrfGHgPgV6bkx2zMSXnzcg20n9GLEd/nzzHMUw+HwIB/FKFDrZj9Zr5szp/cA5XGnzKPhQf9mai89/OunQ6pfHDHrJ9FkUF9WaWgl1bl0vPaFKTYjxuOzjztV+1bPxw5Qr8l42vmB0ikqCG/Hh4LqCtNP2XDySkFa5qEJ0ZT1eezi6M1M9Z60WjcgZXIzCDAvFIsWjQR0TSNOGMs2/qjJHm5X3LYTQxr0weRTUeLyy6M4cai1Vt9qOC6oRNjwbbJcGW7LlQ8mle9XvAMF/7jD8pQOoLT6elwDaeL8Go7+8pHK+6/u+ws5us3QjjH+5qg5Ut8RpBVoVOyKK190Vv1K+/DuL9Escz4nzmKVIydJYkp2+WUXRh2KGGqGIC2orNeQ1mB239oYPDJSsaSMTjrNmmX+ZDavzGBOlDsMSO/L8/57Bx5jVormP6fIKD5QFtwfjGeNBohHbd6xsa/XwbnAUzjZrbniYFa0dQejPZWdTXi1P/lO04iquD3UMfdV8/60abvFnv2l1fnbt+927HrAGNyv7GC9svYBfTZeubhaEMPKGfXjxXMXez5mwzYmj+sgTl6HxNyYl70JaaaceiGo/uowFIUxWsnfM7KxdEAfRjpUWoZ1D+8Iyl7M0v+qJTYE0jX/GzMebsc/16Z7V9GZfWXEQ5ou7y2rOwx5CE62DWTEhPC0jh1+ONSYp/qZyIRO5z1aR7rJAemXkNgeqBeK6LmLxKpEO6gx1QODmgjo1WWd6p2YOCVM5RSP+PgM6X85sRuaBxvjvV1dwad4K4bq7CBfjxWp2t2w2b8jlj48AL/OnAaHZ+noMaYmlmVu8Hj/1oITY1d7w51Hw2FtXIjiSHYtJxVP9ioF6qO0rz2Q9g8pq4D6FhAn4e6Uhlg7PxPrtLLhtJ9A/Ul+2Z/LOt1IRMpz8TUpBiI+hrA8285CzeLoryKsyHAE4l448ek5Xn/aC4uca0ryOEb+gZdyTTWOO6/iijeZbOjRh6TvAFC89jnhNXrOHsQ2fT2J88zbADGv4nWwH7Gi2tspNzxGbPzArDf0QMoEII9Vzw4ZS2uBaWtDgPDufLW7BxCjgee/3qiesc7mw0BzR8Uq9P7UL4oYZQNpIxbUfYDuLh1xNWkrKIYh/mciukD0in3KlK4ox9jauGcaygwgFsDcPYVAeYiuvtuqPV11mqULc8Hdsxv2faCPxIHat6YrZFL/3ryBwwXUnfyZjR31r7q7oDy4wWgPNNeflojLjYLFsXI7uHR+Bqq7kvKfhqh2XXGXV9UM/m14PaB9hZp9MuC191C+3+OymiGv8V8qRNbcLTZEX6ruLu6eJ8TqqhKY77y/YNzwUKBujlZj7OTBM28E8QkxSg2+OKidoL4NoQkGnBgRyJ+0nqxldd+nmYofHrvBaUdLnqUfVn1OHw5lwN96Jcoj5MiFPYj7ylhK7weg9sr483FM7rgd9I6HsBFHjsLVcz3VLD3UXJSeN2b0k64FBXghxUSqd5tsW0a7XVN1U1Cd1fVODdzhdQtKvApJ1+Z84O0f1Sykfn7ZM1WoTCAdMO0JZ+i+5w9r5TpdjL70kZGvFyxyisbBn+tx4l+hd/wZmzRrAxADU7/szMhn6dlrqRmzQhdXVPcAlYbJtPPXGPVzDXErUwxE7MVoXuLIruugU+jC6fMp01Kg65yF3C6sNX4vnsrI4+SEYRLqzreHj12Pi50bSxh1I4h9vhonzpgnBt2tK9G1Iew65CtJf6LZtH7Ux0ox3XsJa2rzAFprK5jVmC2qd6Hn+TjSRRTvX9oVKBeR9CzqNXmiOhzt9DhwkdloHVElyM+1Vp4BUBHaGQPaGHH6LJUxeGj3QlD8RxyotCaiRm2CbE89Tj1O3TnJ94FtQe0R9UhGHo+vK2twYv7q3KIepLwYE7P05K8z3mqfxNu8cyLQeBnxeCR+yzHixDRCMdysH3Zcdas/ZVWCWE4St6rMERPCoogDdgLNGtu2SVX7oNgH1H0E5RrTzDeU5wK9gHocO30rGU72GiG+F7/VKm6inoXXYBmqrqqenzgayNtA6YfyAek7Me+/aYI8z+PwQ28G4YWq/7G4BvniYtgfNtviLxx+eJrOYQRQl0TybeV3nPJE7Vs++aJiS6D3Ux6Im6yMJDG/0gV+6K7PVccquH8Tvuplgr3OeeqgRRD5shzmLfNTnMmLanUD/R1M5T7uOnQWW0ceE5SN+OhbdzH9/iIWGeHFlqccwnlpCah53UxSl+B9YpKw/J/mcrjXYqhwNUH6O9i+pbZUfZq6jOo4EJZegNYbzuDHAyORvADGhbeRL4J7AumbqQ5L+0KZkqx6PrM0ztbQnIG4G6Pn/iaG9ZSJNo1Rf4dALwc3ljTNUj6yNpaaUZ5C/+QK8gQdlaHQyWc//XIKX6V7TEO5zZzax7Mh494pj1Q+xKmbg6HlAXUHqrQFxBx4XAjVxXDsa3NmdaULb99jGPnTHC11QLiaZM+Jv6nXpiN1BAiY0FHd37Ds3HQg7lT5y2mnOe0qMcdKOptTmiO7BkF4pDmjbo+UazjIrwNQT9VQhxInQzI8Ljeq0JR4dQeVb7ZddWR45DpobL8DC7WWyj8x0nMjI62IxxbeaJ1XS/awX0sdP0rd54K6N+hi+B1d6lRpDhWdEur7Y6AVkMdhpokOV7yw4HoYtKt8qjhZ3b0h6RGJmxjlHA5fEg/UeUWDNROJI6PVPSHcmr0CyD9EYeoFNq3ci3s9MwWaFyq9EhNicQ9Dvi34PVyOsEPLN48g5V43dUfJKRvEgZk/BbGn0E6cXXBo93+o7pTSJsQjdU7F5WzW5GNAns1LCydpNmZcZuQlsH6VFVfduHeHxvDf7/cFE8L0uaGlK25uPVXQrlYzc/CFdDnRoRnWvVhZfZ9IvM8+6fcFdZfaot8Y9mOvFyMew/8Blhq2Xw==",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    