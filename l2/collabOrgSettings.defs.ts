/// <mls fileReference="_100554_/l2/collabOrgSettings.defs.ts" enhancement="_blank"/>

export const skill = `
## COMP – \`collab-org-settings-100554\`

# Definition

\`\`\`YAML
component:
  tag: collab-org-settings-100554
  file: _100554_/l2/collabOrgSettings.ts
  type: common
  extends: CollabLitElement
  description: >
    Form for editing an organization's registration data, with data reading
    via mls.stor, save with feedback, and a danger zone section with
    destructive actions.

  external:
    - mls (dont need import)

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
    - name: _saving
      type: boolean
      default: false
      description: Disables Save button and shows "Saving…" during submit
    - name: _error
      type: string
      default: ""
      description: Error message displayed below the form
    - name: _successMessage
      type: string
      default: ""
      description: Success message displayed below the form
    - name: _form
      type: OrgSettings
      default: { url: "", company: "", location: "", email: "", logo: "", description: "" }
      description: Form data being edited

  interfaces:
    OrgSettings:
      url: string
      company: string
      location: string
      email: string
      logo: string
      description: string

  lifecycle:
    connectedCallback: calls _fetchSettings()

  methods:
    _fetchSettings:
      returns: Promise<void>
      steps:
        - set _loading = true, call requestUpdate()
        - resolve org via mls.l5.getProjectOrgIndex(this.project)
        - get org name via mls.l5.getOrgsName()[idx]
        - read mls.stor.orgs[orgName].value and JSON.parse it
        - extract l5_actionOrgSettings from parsed object
        - map fields to _form
        - if org not found: set _error = "Not found organization"
        - on catch: set _error from err.message
        - finally: set _loading = false, call requestUpdate()
      field_mapping:
        html_url: url
        company: company
        location: location
        email: email
        logo: logo
        description: description

    _handleSave:
      returns: Promise<void>
      steps:
        - call e.preventDefault()
        - set _saving = true, clear _error and _successMessage, call requestUpdate()
        - build payload { l5_actionOrgSettings: { ...this._form } } typed as any
        - call mls.l5.setProjectSettings() — pending, keep commented
        - simulate 600ms delay via Promise + setTimeout
        - set _successMessage = this.msg.feedbackSuccess
        - dispatch org-updated event
        - on catch: set _error from err.message
        - finally: set _saving = false, call requestUpdate()

    _handleInput:
      returns: void
      params:
        - field: keyof OrgSettings
        - e: Event
      steps:
        - cast e.target to HTMLInputElement | HTMLTextAreaElement
        - update _form immutably with new field value
        - clear _successMessage

    _handleArchive:
      returns: void
      steps:
        - empty body, future implementation

    _handleDelete:
      returns: void
      steps:
        - dispatch org-deleted event

  events:
    - name: org-updated
      when: after saving successfully
      options: { bubbles: true, composed: true }
    - name: org-deleted
      when: when Delete button is clicked
      options: { bubbles: true, composed: true }

  render:
    loading_state:
      element: div.state-loading
      children:
        - span.spinner
        - span with msg.loadingSettings

    feedback:
      - condition: _successMessage truthy
        element: div.feedback.success
      - condition: _error truthy
        element: div.feedback.error
      - condition: neither
        element: empty template

    form:
      element: form.settings-form
      event: submit → _handleSave
      fields:
        - label_key: fieldUrl
          element: input
          type: url
          field: url
        - label_key: fieldCompany
          element: input
          type: text
          field: company
        - label_key: fieldLocation
          element: input
          type: text
          field: location
        - label_key: fieldEmail
          element: input
          type: email
          field: email
        - label_key: fieldLogo
          element: input
          type: url
          field: logo
        - label_key: fieldDescription
          element: textarea
          rows: 6
          field: description
          label_hint: fieldDescriptionHint
      footer:
        - feedback block
        - button.btn-primary type=submit
          disabled_when: _saving
          label_key_default: btnSave
          label_key_saving: btnSaving

    danger_zone:
      element: section.danger-zone
      title: h2.danger-title → msg.dangerTitle
      items:
        - title_key: archiveTitle
          desc_key: archiveDesc
          button_class: btn-warning
          action: _handleArchive()
        - title_key: deleteTitle
          desc_key: deleteDesc
          button_class: btn-danger
          action: _handleDelete()

    root:
      condition: not _loading
      element: div.settings-root
      children:
        - h1.page-title → msg.pageTitle
        - _renderForm()
        - _renderDangerZone()
\`\`\`


# Required skills

## Lit Skill
[[(_100554_/l2/skills/lit.ts).skill]]

## Less Skill
[[(_100554_/l2/skills/less.ts).getSkillWithTokens()]]


`