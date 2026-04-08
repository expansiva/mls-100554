/// <mls fileReference="_100554_/l2/collabOrgProjects.defs.ts" enhancement="_blank"/>

export const req = `
---

## COMP-05 – '<collab-org-projects>'

**Descrição:** Lista projetos ativos e arquivados da organização.

**Responsabilidades:**
- Fazer fetch da lista de projetos ao inicializar.
- Renderizar duas seções: **Active Projects** e **Archived Projects**.
- Campo de busca filtra localmente por nome.
- Botão "View project" emite evento com o ID do projeto.

**Props principais:**

| Prop | Tipo | Descrição |
|---|---|---|
| 'org-slug' | 'string' | Identificador da organização |
| 'base-url' | 'string' | URL base da API |

**Fetch interno:**

GET {base-url}/organizations/{org-slug}/projects
`