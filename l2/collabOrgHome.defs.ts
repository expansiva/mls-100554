/// <mls fileReference="_100554_/l2/collabOrgHome.defs.ts" enhancement="_blank"/>

export const req = ` 
---

## COMP-03 – '< collab - org - home > '

**Descrição:** Exibe o resumo da organização (nome, descrição, contadores).

**Responsabilidades:**
- Fazer fetch dos dados ao ser conectado ao DOM.
- Exibir nome, descrição (ou "no description"), total de projetos, usuários e times.
- Exibir estado de loading e erro.

**Props principais:**

| Prop | Tipo | Descrição |
|---|---|---|
| 'org-slug' | 'string' | Identificador da organização |
| 'base - url' | 'string' | URL base da API |

**Fetch interno:**

GET { base - url } /organizations/{ org - slug }

`