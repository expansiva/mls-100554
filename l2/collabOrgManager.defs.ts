/// <mls fileReference="_100554_/l2/collabOrgManager.defs.ts" enhancement="_blank"/>

export const skill = `
## COMP – \`collab-org-manager-100554\`

# Definition

\`\`\`YAML
component:
  tag: collab-org-manager-100554
  file: _100554_/l2/collabOrgManager.ts
  type: common
  extends: CollabLitElement
  description: >
    Shell component that renders a sidebar navigation and dynamically displays
    the active section component. Acts as the layout manager for all
    organization sub-pages.

  imports:
    - /_100554_/l2/collabOrgHome.js
    - /_100554_/l2/collabOrgSettings.js
    - /_100554_/l2/collabOrgProjects.js
    - /_100554_/l2/collabOrgUsers.js
    - /_100554_/l2/collabOrgTeams.js

  props:
    - name: project
      type: number
      default: 0
      description: Project index passed down to every section component
    - name: activeSection
      type: string
      default: home
      description: Key of the currently active section

  internal_state:
    - name: _menuItems
      type: Array<{ section: string; label: string }>
      description: Static list of visible menu entries
      value:
        - { section: home,     label: Home }
        - { section: settings, label: Settings }
        - { section: projects, label: Projects }
        - { section: users,    label: Users }
        - { section: teams,    label: Teams }
      commented_out:
        - { section: trash,    label: Trash }
        - { section: explorer, label: Explorer }
        - { section: verify,   label: Verify }

  methods:
    _handleSectionClick:
      returns: void
      params:
        - section: string
      steps:
        - set this.activeSection = section
        - dispatch CustomEvent('section-changed') with detail { section }, bubbles true, composed true

    _renderIcon:
      returns: TemplateResult
      params:
        - section: string
      steps:
        - define a Record<string, TemplateResult> map with inline SVG for each key
        - return icons[section] or html\`\` if not found
      icon_keys:
        - home
        - settings
        - projects
        - trash
        - users
        - teams
        - explorer
        - verify

    _renderSection:
      returns: TemplateResult
      steps:
        - define a Record<string, TemplateResult> sectionMap with one child element per key
        - each child receives prop project="\${this.project}"
        - return sectionMap[this.activeSection] or div.fallback if not found
      section_map:
        home:     collab-org-home-100554
        settings: collab-org-settings-100554
        projects: collab-org-projects-100554
        trash:    collab-org-trash-100554
        users:    collab-org-users-100554
        teams:    collab-org-teams-100554
        explorer: collab-org-explorer-100554
        verify:   collab-org-verify-100554

  events:
    - name: section-changed
      when: when a menu item is clicked
      detail: { section: string }
      options: { bubbles: true, composed: true }

  render:
    root:
      element: div.layout
      children:
        - nav.sidebar:
            content: >
              maps _menuItems to div.menu-item elements.
              active item receives class "active" when section === activeSection.
              each item has @click → _handleSectionClick(item.section).
              each item has @keydown → calls _handleSectionClick on Enter or Space.
              each item has tabindex="0".
            children_per_item:
              - span.menu-icon → _renderIcon(item.section)
              - span.menu-label → this.msg[item.section] (cast as any)
              - span.menu-arrow → › (static)
        - main.content:
            content: _renderSection()

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