/// <mls fileReference="_100554_/l2/collabOrgHome.defs.ts" enhancement="_blank"/>

export const skill = `
## COMP – \`collab-org-home-100554\`

# Definition

\`\`\`YAML
component:
  tag: collab-org-home-100554
  file: _100554_/l2/collabOrgHome.ts
  type: common
  extends: CollabLitElement
  description: >
    Displays an organization overview card with name, description and
    counters for projects, users and teams. Data is read from mls.stor
    on connectedCallback.

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
    - name: _loading
      type: boolean
      default: false
      description: Shows loading screen during initial fetch
    - name: _error
      type: string
      default: ""
      description: Error message displayed in the error state
    - name: _data
      type: OrgData | null
      default: null
      description: Organization data fetched from mls.stor

  interfaces:
    OrgData:
      name: string
      description: string
      totalProjects: number
      totalUsers: number
      totalTeams: number

  lifecycle:
    connectedCallback: calls _fetchOrg()

  methods:
    _fetchOrg:
      returns: Promise<void>
      steps:
        - set _loading = true, _error = '', _data = null, call requestUpdate()
        - resolve org via mls.l5.getProjectOrgIndex(this.project)
        - get org name via mls.l5.getOrgsName()[idx]
        - read mls.stor.orgs[orgName]
        - if org not found: set _error = 'Not found organization' and return
        - populate _data from lastOrg.sett
        - on catch: set _error from err.message or msg.error
        - finally: set _loading = false, call requestUpdate()
      field_mapping:
        name: orgName
        description: lastOrg.sett.description
        totalProjects: lastOrg.sett.projects.length
        totalUsers: lastOrg.sett.users.length
        totalTeams: lastOrg.sett.teams.length

  events: []

  render:
    priority_order:
      - if _loading → _renderLoading()
      - if _error   → _renderError()
      - if _data    → _renderData(_data)
      - fallback    → empty template

    loading_state:
      element: div.state-loading
      children:
        - span.spinner
        - span → msg.loading

    error_state:
      element: div.state-error
      children:
        - span.error-icon → ⚠ (static)
        - span → this._error
        - button @click → _fetchOrg() → msg.again

    data_state:
      element: div.org-card
      children:
        - div.org-header:
            children:
              - h1.org-name → data.name
              - p.org-description → data.description or 'no description' if empty
        - div.org-counters:
            children:
              - div.counter:
                  - span.counter-value → data.totalProjects
                  - span.counter-label → msg.projects
              - div.counter:
                  - span.counter-value → data.totalUsers
                  - span.counter-label → msg.users
              - div.counter:
                  - span.counter-value → data.totalTeams
                  - span.counter-label → msg.teams
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