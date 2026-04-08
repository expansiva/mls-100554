/// <mls fileReference="_100554_/l2/collabOrgUsers.defs.ts" enhancement="_blank"/>

export const req = `
## COMP-06 – '<collab-org-users>'

**Descrição:** Lista membros da organização e incorpora o subcomponente de convite.

**Responsabilidades:**
- Fazer fetch da lista de membros ao inicializar.
- Renderizar tabela com Avatar, User e Teams.
- Exibir indicador de status de acesso ao repositório por plataforma (GitHub/GitLab) para cada usuário.
- Incorporar '<collab-org-invite-user>' recolhido por padrão.
- Atualizar lista após convite bem-sucedido.

**Props principais:**

| Prop | Tipo | Descrição |
|---|---|---|
| 'org-slug' | 'string' | Identificador da organização |
| 'base-url' | 'string' | URL base da API |

**Fetch interno:**

GET {base-url}/organizations/{org-slug}/members
GET {base-url}/organizations/{org-slug}/members/{username}/repository-access

`