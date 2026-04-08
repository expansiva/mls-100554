/// <mls fileReference="_100554_/l2/collabOrgManager.defs.ts" enhancement="_blank"/>

export const req = `
---

## COMP-01 – '<collab-org-manager>'

**Descrição:** Componente raiz e orquestrador. Controla o menu lateral internamente e renderiza a seção ativa no conteúdo principal. É o único ponto de entrada da suite — quem usa a suite instancia apenas este componente.

**Responsabilidades:**

_Layout:_
- Renderizar um layout de duas colunas: menu lateral fixo à esquerda + área de conteúdo à direita.
- Em telas largas (≥ 768px): menu expandido, exibindo ícone + label lado a lado para cada item.
- Em telas estreitas (< 768px): menu recolhido, exibindo apenas o ícone centralizado; ao hover ou foco, exibir a label em tooltip.
- A transição entre os modos deve ser suave (CSS transition na largura do menu).

_Menu lateral:_
- Renderizar os itens de navegação diretamente no template, sem delegar a um componente filho.
- Cada item do menu é composto por um **ícone SVG** + **label textual**, dispostos horizontalmente no modo expandido.
- Itens disponíveis e suas respectivas seções:

| Ícone | Label | Seção ('active-section') |
|---|---|---|
| 🏠 home | Home | 'home' |
| ⚙️ settings | Settings | 'settings' |
| 📁 folder | Projects | 'projects' |
| 🗑️ trash | Trash | 'trash' |
| 👤 person | Users | 'users' |
| 👥 group | Teams | 'teams' |
| 📈 chart | Explorer | 'explorer' |
| 🔍 search | Verify | 'verify' |

- O item ativo deve ter destaque visual distinto (ex: background, cor de texto e ícone diferenciados).
- Ao clicar em um item, atualizar 'active-section' internamente e emitir o evento 'section-changed'.
- A seta '›' à direita de cada item (presente no sistema antigo) deve ser exibida apenas no modo expandido.

_Conteúdo:_
- Renderizar o componente de seção correspondente ao 'active-section' atual.
- Propagar 'org-slug' e 'base-url' automaticamente para todos os componentes de seção filhos.
- Exibir um estado de fallback ("Seção não encontrada") caso 'active-section' não corresponda a nenhuma seção conhecida.

**Props principais:**

| Prop | Tipo | Descrição |
|---|---|---|
| 'org-slug' | 'string' | Identificador da organização |
| 'base-url' | 'string' | URL base da API |
| 'active-section' | 'string' | Seção ativa inicial (default: '"home"') |

**Eventos emitidos:**
- 'section-changed' → '{ section: string }' disparado ao trocar de seção via menu

---

`