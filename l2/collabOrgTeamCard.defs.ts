/// <mls fileReference="_100554_/l2/collabOrgTeamCard.defs.ts" enhancement="_blank"/>
/// <mls fileReference="_100554_/l2/collabOrgSettings.defs.ts" enhancement="_blank"/>

export const skill = `
## COMP – \`collab-org-settings-100554\`

# Definition

\`\`\`YAML
component:
  tag: collab-org-team-card-100554
  file: _100554_/l2/collabOrgTeamCard.ts
  type: common
  extends: CollabLitElement
  description: >
    Displays the member list of a single team. Allows adding a new member
    via a select dropdown and removing existing members with an inline
    confirmation step. Data is read from mls.stor on firstUpdated.

  external:
    mls:
      description: Global variable injected by the host environment at runtime
      usage: use directly without any import, declare or type annotation
      forbidden:
        - declare const mls
        - declare var mls
        - import mls
        - window.mls

  props:
    - name: project
      type: number
      default: 0
      description: Project index used to locate the organization via mls
    - name: members
      type: Member[]
      default: []
      description: Current list of members in this team, populated on firstUpdated
    - name: users
      type: Member[]
      default: []
      description: Full list of org users used to populate the add select, populated on firstUpdated
    - name: loading
      type: boolean
      default: false
      description: Disables action buttons when true

  internal_state:
    - name: team
      type: Team | undefined
      default: undefined
      description: >
        Team object passed via property binding (.team) from parent.
        Not decorated with @property — received as a direct property set.
    - name: _addOpen
      type: boolean
      default: false
      description: Controls visibility of the add user form
    - name: _addUsername
      type: string
      default: ""
      description: Current value of the add user select
    - name: _confirmingRemove
      type: string | null
      default: null
      description: Username currently pending removal confirmation, null if none

  interfaces:
    Member:
      idx: number
      name: string
      avatar: string

    Team:
      name: string
      auth: string
      projectCount: number
      userCount: number
      users: Member[]

  lifecycle:
    firstUpdated:
      steps:
        - resolve org via mls.l5.getProjectOrgIndex(this.project)
        - get org name via mls.l5.getOrgsName()[idx]
        - read mls.stor.orgs[orgName]
        - if org not found: return early
        - if this.team is defined: set this.members = this.team.users
        - iterate lastOrg.sett.users and build Member[] with idx, name, avatar placeholder
        - assign result to this.users

  methods:
    _toggleAdd:
      returns: void
      steps:
        - toggle _addOpen
        - reset _addUsername = ''
        - call requestUpdate()

    _handleAddInput:
      returns: void
      params:
        - e: Event
      steps:
        - cast e.target to HTMLInputElement
        - set _addUsername = target.value

    _handleAdd:
      returns: void
      params:
        - e: Event
      steps:
        - call e.preventDefault()
        - if _addUsername.trim() is empty: return
        - set _addOpen = false, _addUsername = ''
        - call requestUpdate()
      note: actual add logic is not yet implemented, body is a placeholder

    _requestRemove:
      returns: void
      params:
        - username: string
      steps:
        - set _confirmingRemove = username
        - call requestUpdate()

    _cancelRemove:
      returns: void
      steps:
        - set _confirmingRemove = null
        - call requestUpdate()

    _confirmRemove:
      returns: void
      params:
        - username: string
      steps:
        - set _confirmingRemove = null
        - call requestUpdate()
      note: actual remove logic is not yet implemented, body is a placeholder

    _renderMember:
      returns: TemplateResult
      params:
        - m: Member
      steps:
        - derive confirming = _confirmingRemove === m.name
        - render li.member-item with div.member-info (img.avatar + span.member-name)
        - if confirming: render div.confirm-inline with
            span.confirm-label → msg.confirmMessage
            button.btn-danger ?disabled=loading @click → _confirmRemove(m.name) → msg.confirmRemove
            button.btn-secondary @click → _cancelRemove() → msg.cancelRemove
        - otherwise: render button.btn-remove ?disabled=loading @click → _requestRemove(m.name) with 🗑 icon

    _renderAddForm:
      returns: TemplateResult
      steps:
        - render form.add-form @submit → _handleAdd(e)
        - select.add-input with placeholder=msg.addUserPlaceholder, .value=_addUsername, ?disabled=loading, @input → _handleAddInput
          options:
            - option value="-1" empty label (default)
            - map this.users to option[value=u.idx] with u.name as label
        - button.btn-primary type=submit ?disabled=loading → msg.btnAdd
        - button.btn-secondary type=button @click → _toggleAdd() → msg.btnCancel

  events: []

  render:
    root:
      element: div.team-card
      children:
        - ul.member-list:
            if members.length > 0: map members to _renderMember(m)
            otherwise: li.no-members → msg.noMembers
        - div.add-section:
            if _addOpen: _renderAddForm()
            otherwise: button.btn-add-toggle ?disabled=loading @click → _toggleAdd()
                        label: "+ " + msg.addUser

  i18n:
    languages: [en, pt]
    default: en
\`\`\`


# Required skills

## Lit Skill
[[(_100554_/l2/skills/lit.ts).skill]]

## Less Skill
[[(_100554_/l2/skills/less.ts).getSkillWithTokens()]]


`