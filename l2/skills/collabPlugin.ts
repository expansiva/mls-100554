/// <mls fileReference="_100554_/l2/skills/collabPlugin.ts" enhancement="_blank"/>

export const skill = `
# Skill: Creating a Web Component as a Collab Plugin

## What is a Plugin?

A plugin is a special web component that integrates into the Collab system as an extensible module. The main difference compared to a standard component lies in the **base import** and the **export of \`pluginData\`** at the end of the file.

---

## What changes compared to a standard component

### 1. Different base import

Instead of importing \`CollabLitElement\`, a plugin imports \`PluginBaseModule\`:

\`\`\`ts
// Standard Component
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

// Plugin
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
\`\`\`

### 2. Class extends \`PluginBaseModule\`

\`\`\`ts
export class PluginCodeInsights extends PluginBaseModule { ... }
\`\`\`

### 3. Export of \`pluginData\` at the end of the file (Mandatory)

Every plugin **must** export the \`pluginData\` constant typed as \`mls.plugin.IPluginData\` at the end of the file. It contains the plugin's metadata displayed by the system, including the title and an SVG icon.

---

## Full Plugin Structure

\`\`\`ts
/// <mls fileReference="_100554_/l2/pluginCodeInsights.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';

/// **collab_i18n_start**
const message_pt = {
    title: 'Análise de Código',
}

const message_en = {
    title: 'Code Insights',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-code-insights-100554')
export class PluginCodeInsights extends PluginBaseModule {

    @property({ type: String }) title: string = '';
    private msg = messages['en'];

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html\`
            <div>\${this.msg.title}</div>
        \`;
    }

}

export const pluginData: mls.plugin.IPluginData = {
    title: "Code Insights",
    getSvg(): TemplateResult {
        return svg\`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="..."/>
            </svg>
        \`;
    }
};
\`\`\`

---

## \`pluginData\` Rules

- Must be exported as \`export const pluginData\`.
- Mandatory typing: \`mls.plugin.IPluginData\`.
- Must **always be at the end of the file**, after the class definition.
- The \`title\` field is a \`string\` with the name displayed by the system.
- The \`getSvg()\` method must return \`TemplateResult\` using the \`svg\` tagged template.
- \`svg\` must be imported from \`'lit'\`.

--- 

## Validation Checklist — Plugin

- [ ] Triple slash present as the first line.
- [ ] \`PluginBaseModule\` imported from \`'/_102027_/l2/pluginBaseModule.js'\`.
- [ ] \`svg\` and \`TemplateResult\` imported from \`'lit'\` (required for \`pluginData\`).
- [ ] Class extends \`PluginBaseModule\`.
- [ ] \`@customElement\` tag follows naming rules (kebab-case, \`--\` for folders, number at the end).
- [ ] I18n block present with \`/// **collab_i18n_start**\` and \`/// **collab_i18n_end**\` markers.
- [ ] I18n block positioned between imports and \`@customElement\`.
- [ ] \`MessageType\` derived from \`typeof message_en\`.
- [ ] \`messages\` typed as \`{ [key: string]: MessageType }\`.
- [ ] Default language \`message_en\` present.
- [ ] \`private msg\` initialized with \`messages['en']\`.
- [ ] \`this.getMessageKey(messages)\` called at the start of \`render()\`.
- [ ] All properties and callbacks are typed.
- [ ] \`pluginData\` exported at the **end of the file**.
- [ ] \`pluginData\` typed as \`mls.plugin.IPluginData\`.
- [ ] \`getSvg()\` returns \`TemplateResult\` with \`svg\`\`.

`