/// <mls fileReference="_100554_/l2/collabOrgInviteUser.defs.ts" enhancement="_blank"/>

export const req = `
## COMP-07 – '<collab-org-invite-user>'

**Descrição:** Subcomponente de convite de usuário, usado dentro de '<collab-org-users>'.

**Responsabilidades:**
- Renderizar campos: Username or Email, Initial Team (dropdown), Complementary Text.
- Receber a lista de times via prop (sem fazer fetch próprio).
- Emitir evento com os dados do convite ao submeter.
- Exibir feedback de sucesso/erro recebido via prop.

**Props principais:**

| Prop | Tipo | Descrição |
|---|---|---|
| 'teams' | 'array' | Lista de times disponíveis para o dropdown |
| 'loading' | 'boolean' | Estado de envio |
| 'status' | '"idle" \| "success" \| "error"' | Feedback após envio |

**Eventos emitidos:**
- 'invite-submit' → '{ username_or_email, initial_team, complementary_text }'
`