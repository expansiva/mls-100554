/// <mls fileReference="_100554_/l2/collabOrgInviteUser.defs.ts" enhancement="_blank"/>

export const skill = `
## COMP – \`collab-org-invite-user-100554\`

# Definition

\`\`\`YAML
component:
  tag: collab-org-invite-user-100554
  file: _100554_/l2/collabOrgInviteUser.ts
  type: common
  extends: CollabLitElement
  description: >
    Form for inviting a user to an organization. Receives teams list and
    loading/status state from the parent via props. Dispatches invite-submit
    with form data, leaving submission logic to the parent.

  props:
    - name: teams
      type: string[]
      default: []
      description: List of team names used to populate the team select options
    - name: loading
      type: boolean
      default: false
      description: Disables all fields and submit button when true
    - name: status
      type: InviteStatus
      default: idle
      description: Controls which feedback message is displayed

  internal_state:
    - name: _usernameOrEmail
      type: string
      default: ""
      description: Current value of the username or email input
    - name: _initialTeam
      type: string
      default: ""
      description: Current value of the team select
    - name: _complementaryText
      type: string
      default: ""
      description: Current value of the complementary text textarea

  interfaces:
    InviteStatus: "'idle' | 'success' | 'error'"

  methods:
    _handleInput:
      returns: void
      params:
        - field: "'username' | 'team' | 'text'"
        - e: Event
      steps:
        - cast e.target to HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        - if field === 'username': set _usernameOrEmail = target.value
        - if field === 'team': set _initialTeam = target.value
        - if field === 'text': set _complementaryText = target.value
        - call requestUpdate()

    _handleSubmit:
      returns: void
      params:
        - e: Event
      steps:
        - call e.preventDefault()
        - dispatch CustomEvent('invite-submit') with detail below, bubbles true, composed true
        - detail: { username_or_email: _usernameOrEmail, initial_team: _initialTeam, complementary_text: _complementaryText }

    _renderFeedback:
      returns: TemplateResult
      steps:
        - if status === 'success' → div.feedback.success with msg.feedbackSuccess
        - if status === 'error'   → div.feedback.error with msg.feedbackError
        - otherwise → empty template

  events:
    - name: invite-submit
      when: form is submitted
      detail:
        username_or_email: string
        initial_team: string
        complementary_text: string
      options: { bubbles: true, composed: true }

  render:
    root:
      element: form.invite-form
      event: "@submit → _handleSubmit(e)"
      fields:
        - id: invite-username
          label_key: fieldUsername
          element: input
          type: text
          value_binding: _usernameOrEmail
          disabled_when: loading
          event: "@input → _handleInput('username', e)"

        - id: invite-team
          label_key: fieldTeam
          element: select
          value_binding: _initialTeam
          disabled_when: loading
          event: "@change → _handleInput('team', e)"
          options:
            - value: "" → msg.fieldTeamPlaceholder (default option)
            - map this.teams to option[value=t] with t as label

        - id: invite-text
          label_key: fieldCompText
          element: textarea
          rows: 3
          value_binding: _complementaryText
          disabled_when: loading
          event: "@input → _handleInput('text', e)"

      footer:
        - _renderFeedback()
        - div.form-actions:
            - button.btn-primary type=submit ?disabled=loading
                label: if loading then msg.btnSubmitting else msg.btnSubmit

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