/// <mls fileReference="_100554_/l2/collabOrgUsers.defs.ts" enhancement="_blank"/>

export const skill = `
## COMP – \`collab-org-users-100554\`

# Definition

\`\`\`YAML
component:
  tag: collab-org-users-100554
  file: _100554_/l2/collabOrgUsers.ts
  type: common
  extends: CollabLitElement
  description: >
    Displays a table of organization members with their avatar, username,
    teams and repository access status (GitHub and GitLab). Includes a
    togglable invite panel powered by collab-org-invite-user-100554.

  imports:
    - /_100554_/l2/collabOrgInviteUser.js

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

  internal_state:
    - name: _members
      type: Member[]
      default: []
      description: List of organization members
    - name: _accessMap
      type: AccessMap
      default: {}
      description: Map of username to RepoAccess fetched in parallel
    - name: _loading
      type: boolean
      default: false
      description: Shows loading screen during fetch
    - name: _error
      type: string
      default: ""
      description: Error message displayed when fetch fails
    - name: _inviteOpen
      type: boolean
      default: false
      description: Controls visibility of the invite panel

  interfaces:
    Member:
      id: number
      username: string
      avatarUrl: string
      teams: string[]

    RepoAccess:
      github: boolean | null
      gitlab: boolean | null

    AccessMap: "{ [username: string]: RepoAccess }"

  lifecycle:
    connectedCallback: calls _fetchMembers()

  methods:
    _fetchMembers:
      returns: Promise<void>
      steps:
        - set _loading = true, _error = '', call requestUpdate()
        - resolve org via mls.l5.getProjectOrgIndex(this.project)
        - get org name via mls.l5.getOrgsName()[idx]
        - read mls.stor.orgs[orgName]
        - if org not found: set _error = 'Not found organization' and return
        - call this.configUsers(lastOrg) and assign to _members
        - call _fetchAllAccess()
        - on catch: set _error from err.message or 'Unknown error'
        - finally: set _loading = false, call requestUpdate()

    configUsers:
      returns: Member[]
      params:
        - info: mls.cbe.IOrgInfo
      steps:
        - iterate info.sett.users with forEach((u, idx))
        - for each user build Member with id=idx, username=u, avatarUrl fixed placeholder, teams=[]
        - iterate info.sett.teams and push team.name to user.teams if team.usrIndex includes idx
        - return users array

    _fetchAllAccess:
      returns: Promise<void>
      steps:
        - map _members with Promise.all calling _fetchRepoAccess(m.username) for each
        - each promise resolves to [username, RepoAccess] tuple
        - assign Object.fromEntries(entries) to _accessMap

    _fetchRepoAccess:
      returns: Promise<RepoAccess>
      params:
        - username: string
      steps:
        - simulate 300ms delay via Promise + setTimeout
        - return { github: false, gitlab: false }

    _toggleInvite:
      returns: void
      steps:
        - toggle _inviteOpen
        - call requestUpdate()

    _handleInviteSuccess:
      returns: void
      steps:
        - set _inviteOpen = false
        - call _fetchMembers()

    _renderAccessBadge:
      returns: TemplateResult
      params:
        - value: boolean | null
        - platform: string
      steps:
        - if value === null → span.badge.badge-neutral with "{platform} –"
        - if value === true → span.badge.badge-ok with "{platform} ✓"
        - if value === false → span.badge.badge-fail with "{platform} ✗"

    _renderAccessCell:
      returns: TemplateResult
      params:
        - username: string
      steps:
        - look up _accessMap[username]
        - if not found → span.access-loading with msg.loadingAccess
        - otherwise → div.access-badges with _renderAccessBadge for github and gitlab

    _renderTable:
      returns: TemplateResult
      steps:
        - if _members.length === 0 → p.no-members with msg.noMembers
        - otherwise → div.table-wrapper with table.members-table
      table_structure:
        thead:
          columns: [colAvatar, colUser, colTeams, colAccess]
        tbody:
          row_per_member:
            - td.td-avatar → img.avatar with src=m.avatarUrl and alt=m.username
            - td.td-user → m.username
            - td.td-teams → div.tags-wrapper
                if teams > 0: map to span.team-tag
                otherwise: span.no-teams with "—"
            - td.td-access → _renderAccessCell(m.username)

  events: []

  render:
    priority_order:
      - if _loading → div.state-loading with span.spinner and span msg.loading
      - if _error   → div.feedback.error with this._error
      - default     → full layout

    default_layout:
      element: div.users-root
      children:
        - div.header:
            children:
              - h1.page-title → msg.title
              - button.btn-invite @click → _toggleInvite()
                  label: if _inviteOpen then '✕' else '+ ' + msg.inviteToggle
        - invite panel (conditional on _inviteOpen):
            element: div.invite-wrapper
            children:
              - collab-org-invite-user-100554
                  prop: project="\${this.project}"
                  event: "@invite-success → _handleInviteSuccess()"
        - _renderTable()

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