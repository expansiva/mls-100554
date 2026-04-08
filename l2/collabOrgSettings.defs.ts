/// <mls fileReference="_100554_/l2/collabOrgSettings.defs.ts" enhancement="_blank"/>

export const req = `
## COMP-04 – '<collab-org-settings>'

**Descrição:** Formulário de edição dos dados cadastrais da organização.

**Responsabilidades:**
- Fazer fetch dos dados atuais ao inicializar.
- Renderizar campos: URL, Company, Location, Email, Logo, Description (markdown).
- Enviar PATCH ao clicar em Save.
- Exibir feedback de sucesso/erro.
- Renderizar seção "Delete Organization" com botões Archive e Delete.

**Props principais:**

| Prop | Tipo | Descrição |
|---|---|---|
| 'org-slug' | 'string' | Identificador da organização |
| 'base-url' | 'string' | URL base da API |

**Fetch interno:**

GET  {base-url}/organizations/{org-slug}/settings
PATCH {base-url}/organizations/{org-slug}/settings


**Eventos emitidos:**
- 'org-updated' → após salvar com sucesso
- 'org-deleted' → após deletar a organização

`