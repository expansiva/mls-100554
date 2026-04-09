/// <mls fileReference="_100554_/l2/collabOrgProjects.defs.ts" enhancement="_blank"/>

export const skill = `
## COMP – \`collab-org-projects-100554\`

# Definition

\`\`\`YAML
component:
  tag: collab-org-projects-100554
  file: _100554_/l2/collabOrgProjects.ts
  type: common
  extends: CollabLitElement
  description: >
    Displays active and archived projects of an organization, with a search
    filter. Each project has a "View project" button that switches the active
    project and reloads the page.

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
    - name: projects
      type: mls.cbe.IPrj_settings[]
      default: []
      description: Full list of projects fetched from mls.stor
    - name: searchQuery
      type: string
      default: ""
      description: Current value of the search input
    - name: _loading
      type: boolean
      default: false
      description: Shows loading screen during fetch
    - name: _error
      type: string
      default: ""
      description: Error message displayed when fetch fails

  lifecycle:
    connectedCallback: calls fetchProjects()

  methods:
    fetchProjects:
      returns: Promise<void>
      steps:
        - set _loading = true, _error = '', call requestUpdate()
        - resolve org via mls.l5.getProjectOrgIndex(this.project)
        - get org name via mls.l5.getOrgsName()[idx]
        - read mls.stor.orgs[orgName]
        - if org not found: set _error = 'Not found organization' and return
        - set this.projects = lastOrg.sett.projects
        - on catch: set _error from err.message or 'Unknown error'
        - finally: set _loading = false, call requestUpdate()

    handleSearch:
      returns: void
      params:
        - e: Event
      steps:
        - cast e.target to HTMLInputElement
        - set this.searchQuery = input.value
        - call requestUpdate()

    handleViewProject:
      returns: void
      params:
        - project: mls.cbe.IPrj_settings
      steps:
        - call mls.setActualProject(project.id)
        - call mls.l5.getProjectOrgIndex(project.id) to get orgIndex
        - call mls.l5.setActualOrg(orgIndex)
        - call window.location.reload()

    getFiltered:
      returns: mls.cbe.IPrj_settings[]
      params:
        - archived: boolean
      steps:
        - lowercase this.searchQuery into query
        - filter this.projects where p.name includes query
        - when archived=true also require p.archived_at !== ''
        - when archived=false no archived_at restriction

    renderProjectList:
      returns: TemplateResult
      params:
        - items: mls.cbe.IPrj_settings[]
      steps:
        - if items.length === 0 return p.no-results with msg.noResults
        - otherwise return ul.project-list
        - each item is li.project-item with span.project-name and button.btn-view
        - span.project-name shows p.name(p.id)
        - button.btn-view @click → handleViewProject(p) → msg.viewProject

  events: []

  render:
    priority_order:
      - if _loading → div.state-loading with span.spinner and span msg.loading
      - if _error   → div.feedback.error with msg.error
      - default     → full layout

    default_layout:
      element: div.container
      children:
        - input.search-input:
            type: text
            placeholder: msg.searchPlaceholder
            value binding: this.searchQuery
            event: "@input → handleSearch"
        - section.section:
            title: h2.section-title → msg.activeProjects
            content: renderProjectList(getFiltered(false))
        - section.section:
            title: h2.section-title → msg.archivedProjects
            content: renderProjectList(getFiltered(true))
  
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