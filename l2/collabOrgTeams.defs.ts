/// <mls fileReference="_100554_/l2/collabOrgTeams.defs.ts" enhancement="_blank"/>

export const skill = `
## COMP – \`collab-org-teams-100554\`

# Definition

\`\`\`YAML
component:
  tag: collab-org-teams-100554
  file: _100554_/l2/collabOrgTeams.ts
  type: common
  extends: CollabLitElement
  description: >
    Displays a table of organization teams with name, auth, project count
    and user count. Supports expanding a row to show a team card, and
    includes a togglable form to create new teams.

  imports:
    - /_100554_/l2/collabOrgTeamCard.js

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
    - name: _teams
      type: Team[]
      default: []
      description: List of teams fetched from mls.stor
    - name: _loading
      type: boolean
      default: false
      description: Shows loading screen during fetch
    - name: _error
      type: string
      default: ""
      description: Error message displayed when fetch fails
    - name: _expandedTeam
      type: Team | null
      default: null
      description: Currently expanded team row, null if none
    - name: _newTeamOpen
      type: boolean
      default: false
      description: Controls visibility of the new team form
    - name: _newTeamName
      type: string
      default: ""
      description: Current value of the new team name input
    - name: _formStatus
      type: FormStatus
      default: idle
      description: Current status of the create form
    - name: _formError
      type: string
      default: ""
      description: Error message shown inside the create form

  interfaces:
    Team:
      name: string
      auth: string
      projectCount: number
      userCount: number
      users: "{ idx: number; name: string; avatar: string }[]"

    FormStatus: "'idle' | 'saving' | 'success' | 'error'"

  lifecycle:
    connectedCallback: calls _fetchTeams()

  methods:
    _fetchTeams:
      returns: Promise<void>
      steps:
        - set _loading = true, _error = '', call requestUpdate()
        - resolve org via mls.l5.getProjectOrgIndex(this.project)
        - get org name via mls.l5.getOrgsName()[idx]
        - read mls.stor.orgs[orgName]
        - if org not found: set _error = 'Not found organization' and return
        - call configTeams(lastOrg) and assign to _teams
        - on catch: set _error from err.message or 'Unknown error'
        - finally: set _loading = false, call requestUpdate()

    configTeams:
      returns: Team[]
      params:
        - info: mls.cbe.IOrgInfo
      steps:
        - iterate info.sett.teams with forEach
        - for each team build Team with name, auth, projectCount=0, userCount=t.usrIndex.length, users=[]
        - iterate info.sett.users and push { idx, name, avatar placeholder } if usrIndex includes idx
        - return teams array

    _handleCreate:
      returns: Promise<void>
      params:
        - e: Event
      steps:
        - call e.preventDefault()
        - set _formStatus = 'saving', _formError = '', call requestUpdate()
        - simulate 600ms delay (real fetch commented out, keep as comment)
        - dispatch CustomEvent('team-created') with detail { name: _newTeamName }, bubbles true, composed true
        - set _formStatus = 'success', clear _newTeamName
        - call _fetchTeams()
        - set _newTeamOpen = false, _formStatus = 'idle'
        - on catch: set _formStatus = 'error', _formError from err.message or 'Unknown error'
        - finally: call requestUpdate()

    _toggleExpand:
      returns: void
      params:
        - team: Team
      steps:
        - if _expandedTeam === team set _expandedTeam = null, otherwise set _expandedTeam = team
        - call requestUpdate()

    _toggleNewTeam:
      returns: void
      steps:
        - toggle _newTeamOpen
        - reset _newTeamName = '', _formStatus = 'idle', _formError = ''
        - call requestUpdate()

    _handleNameInput:
      returns: void
      params:
        - e: Event
      steps:
        - cast e.target to HTMLInputElement
        - set _newTeamName = target.value

    _emitViewProjects:
      returns: void
      params:
        - teamName: string
      steps:
        - dispatch CustomEvent('view-team-projects') with detail { team_name: teamName }, bubbles true, composed true

    _emitViewUsers:
      returns: void
      params:
        - teamName: string
      steps:
        - dispatch CustomEvent('view-team-users') with detail { team_name: teamName }, bubbles true, composed true

    _renderNewTeamForm:
      returns: TemplateResult
      steps:
        - derive saving = _formStatus === 'saving'
        - render div.new-team-form-wrapper containing form.new-team-form
        - form @submit → _handleCreate(e)
        - div.form-group with label and input#new-team-name
          input: type text, .value=_newTeamName, ?disabled=saving, @input → _handleNameInput
        - if _formStatus === 'error': div.feedback.error with _formError or msg.feedbackError
        - div.form-actions with two buttons:
            - button.btn-secondary type=button ?disabled=saving @click → _toggleNewTeam() → msg.btnCancel
            - button.btn-primary type=submit ?disabled=saving → msg.btnCreating if saving else msg.btnCreate

    _renderTable:
      returns: TemplateResult
      steps:
        - if _teams.length === 0 → p.no-teams with msg.noTeams
        - otherwise → div.table-wrapper with table.teams-table
      table_structure:
        thead:
          columns: [colTeam, colAuth, colProjects, colUsers]
        tbody:
          row_per_team: _renderRow(t)

    _renderRow:
      returns: TemplateResult
      params:
        - t: Team
      steps:
        - derive expanded = _expandedTeam?.name === t.name
        - render tr.team-row with class 'expanded' if expanded
          cells:
            - td.td-name → t.name
            - td.td-auth → span.badge.auth-{t.auth} with t.auth
            - td.td-link → "{t.projectCount} projects" (static text)
            - td.td-link → button.btn-link @click → _toggleExpand(t) showing "{t.userCount} {msg.viewUsers}"
        - if expanded: render tr.expand-row with td colspan=5 containing
            collab-org-team-card-100554 with .team=\${t} and project="\${this.project}"

  events:
    - name: team-created
      when: after team is created successfully
      detail: { name: string }
      options: { bubbles: true, composed: true }
    - name: view-team-projects
      when: _emitViewProjects is called
      detail: { team_name: string }
      options: { bubbles: true, composed: true }
    - name: view-team-users
      when: _emitViewUsers is called
      detail: { team_name: string }
      options: { bubbles: true, composed: true }

  render:
    priority_order:
      - if _loading → div.state-loading with span.spinner and span msg.loading
      - if _error   → div.feedback.error with this._error
      - default     → full layout

    default_layout:
      element: div.teams-root
      children:
        - div.header:
            children:
              - h1.page-title → msg.title
              - button.btn-primary @click → _toggleNewTeam()
                  label: if _newTeamOpen then msg.btnCancel else msg.btnNewTeam
        - new team form (conditional on _newTeamOpen):
            content: _renderNewTeamForm()
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