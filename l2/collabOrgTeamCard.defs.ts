/// <mls fileReference="_100554_/l2/collabOrgTeamCard.defs.ts" enhancement="_blank"/>

export const req = `
## COMP-09 – '<collab-org-team-card>'

**Descrição:** Subcomponente que representa um time expandido, listando seus membros com ações.

**Responsabilidades:**
- Receber lista de membros via prop (sem fetch próprio).
- Renderizar avatar e nome de cada membro.
- Botão de remoção (lixeira) por membro, com confirmação antes de executar.
- Seção "Add User" recolhida com campo para adicionar membro ao time.
- Emitir eventos de adição e remoção para o pai tratar via API.

**Props principais:**

| Prop | Tipo | Descrição |
|---|---|---|
| 'team-name' | 'string' | Nome do time |
| 'members' | 'array' | Lista de membros '{ username, avatar_url }' |
| 'loading' | 'boolean' | Estado de operação em andamento |

**Eventos emitidos:**
- 'member-remove' → '{ team_name, username }'
- 'member-add' → '{ team_name, username }'
`