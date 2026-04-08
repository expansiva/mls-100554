/// <mls fileReference="_100554_/l2/collabOrgTeams.defs.ts" enhancement="_blank"/>

export const req = `
## COMP-08 – '<collab-org-teams>'

**Descrição:** Lista os times da organização, com membros expansíveis e ações.

**Responsabilidades:**
- Fazer fetch da lista de times ao inicializar.
- Renderizar tabela com: Team, Auth, Projects (link), Users (link).
- Cada linha expansível exibe os membros via '<collab-org-team-card>'.
- Botão "New Team" abre formulário inline ou modal.
- Emite evento após criação de novo time.

**Props principais:**

| Prop | Tipo | Descrição |
|---|---|---|
| 'org-slug' | 'string' | Identificador da organização |
| 'base-url' | 'string' | URL base da API |

**Fetch interno:**

GET  {base-url}/organizations/{org-slug}/teams
POST {base-url}/organizations/{org-slug}/teams
**Eventos emitidos:**
- team-created → { name: string }
- view-team-projects → { team_name: string }
- view-team-users → { team_name: string }

---

`