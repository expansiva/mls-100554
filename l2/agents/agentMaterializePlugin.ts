/// <mls fileReference="_100554_/l2/agents/agentMaterializePlugin.ts" enhancement="_100554_/l2/enhancementAgent"/>


import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { getTokensLess } from '/_102027_/l2/designSystemBase.js';

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentMaterializePlugin",
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: " Materialization Plugin",
    visibility: "private",
    beforePromptImplicit,
    afterPromptStep
  };
}

async function beforePromptImplicit(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

  if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');

  let pp = userPrompt
        .replace(`@@ ${agent.agentName}`, '')
        .replace(`@@${agent.agentName}`, '').trim()
        .replace(`@@_100554_/l2/agents/agentMaterializePlugin`, '')

  const data = extractJSON(pp);

  if (!data) throw new Error('Not found info file: ' + pp);

  const userDefs = await getDefs(data as any);
  const tokens = await getTokensLess(mls.actualProject || 0, 'Default');


  const inTest = true;
  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [{
        type: "system",
        content: system1.replace('{{lit_skill}}', skill_lit).replace('{{plugin_skill}}', skill_plugin).replace('{{less_skill}}', skill_less.replace('[TOKENS]', tokens)).replace('{{user_defs}}', userDefs)
      }, {
        type: "human",
        content: userPrompt
      }],
      taskTitle: agent.agentDescription,
      threadId: context.message.threadId,
      userMessage: inTest ? `test ${agent.agentName}` : agent.agentDescription,
      longTermMemory: {},
    }
  };
  return [addMessageAI];

}

async function afterPromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {
  if (!agent || !context || !step) throw new Error(`[afterPromptStep] invalid params, agent:${!!agent}, context:${!!context}, step:${!!step}`);

  const payload = (step.interaction?.payload?.[0]) as Output || undefined;
  if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)
  let status: mls.msg.AIStepStatus = 'completed';
  let intents: mls.msg.AgentIntent[] = [];
  try {
    const output = payload.result;
    await processOutput(output as any);
  } catch (e) {
    console.error(e);
    status = 'failed';
  }
  if (step.stepId === 1) intents = []; // test mode do not advance

  const updateStatus: mls.msg.AgentIntentUpdateStatus = {
    type: 'update-status',
    hookSequential,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    parentStepId: parentStep.stepId,
    stepId: step.stepId,
    status
  };
  return [...intents, updateStatus];

}



async function processOutput(info: any): Promise<void> {

  //console.log("=== Materialization Plugin")
  //console.log(JSON.stringify(materializationPlugin, null, 2));

  if (!info || !info.project || !info.shortName || !info.ts || !info.less) throw new Error('[processOutput] Invalid return:' + JSON.stringify(info, null, 2));

  const files = await mls.stor.getFiles({ project: info.project, shortName: info.shortName, folder: info.folder, loadContent: false, level: 2 });

  const tokens = await getTokensLess(mls.actualProject || 0, 'Default');

  if (!files.ts) throw new Error('[processOutput] Not found ts file');
  if (!files.less) throw new Error('[processOutput] Not found less file');

  const mTs = await files.ts.getOrCreateModel();
  const mLess = await files.less.getOrCreateModel();

  const srcLess = `${info.less}\n//Start Less Tokens\n${tokens}\n//End Less Tokens`;

  mTs.model.setValue(info.ts);
  mLess.model.setValue(srcLess)

}


export async function getDefs(info: mls.stor.IFileInfoBase) {

  const key = mls.stor.getKeyToFile({ ...info, level: 2, extension: '.defs.ts' });
  if (!key || !mls.stor.files[key]) throw new Error('Not found defs:' + info.shortName);

  const vl = await mls.stor.files[key].getContent() as string;
  return vl;
  
}

export function extractJSON(str:string) {
  const match = str.match(/\{[\s\S]*\}/);

  if (!match) return null;

  try {
    return mls.common.safeParseArgs(match[0]);
  } catch (e) {
    console.error('Invalid JSON:', e);
    return null;
  }
}

const system1 = `
<!-- modelType: geminiChat -->
<!-- modelTypeList: geminiChat 9/10 , code (grok) 7/10, deepseekchat 2/10, codeflash (gemini) 8/10, deepseekreasoner 3/10, mini (4.1) ou nano (openai) 4/10, codeinstruct (4.1) 4/10, codereasoning(gpt5) 3/10, code2 (kimi 2.5) -->

You are a senior Frontend Architect and Staff Software Engineer with 20+ years of experience building large-scale web applications using TypeScript, Lit, and state-driven architectures.

You must generate production-ready code that compiles without errors.
Task: Generate a web component according the user request.

---

## Lit Skill
{{lit_skill}}

## Plugin Skill
{{plugin_skill}}

## Less Skill
{{less_skill}}

## User Definition
{{user_defs}}

## Output format

You MUST return strictly valid JSON.
No explanations outside JSON.
No comments.
No markdown.

[[OutputSection]]
`;

//#region OutputSection
export type Output =
  {
    type: "flexible";
    result: MaterializationPlugin;
  }

/* =========================
 * Materialized Plugin
 * ========================= */

export interface MaterializationPlugin {
  project: number,
  shortName: string,
  folder:string,
  ts: string; 
  less: string;
}

//#endregion 
const skill_lit = `
# Requirements for Creating Web Components — Lit 3 (Collab Codes)

---

## 1. Triple Slash (Mandatory)

Every component file **must** start with the triple slash directive. It is indispensable for the system and must be the **first line** of the file.

\`\`\`ts
/// <mls fileReference="_XXXXX_/l2/path/file.ts" enhancement="_102027_/l2/enhancementLit" />
\`\`\`

- \`fileReference\`: Full path of the file within the project, including the project number in the \`_XXXXX_\` format.
- \`enhancement\`: Always \`_102027_/l2/enhancementLit\` for Lit components.

---

## 2. Mandatory Imports

The following imports are mandatory in every component:

\`\`\`ts
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
\`\`\`

### 2.1 Lit 3 Directives

If the component uses Lit directives (e.g., \`repeat\`, \`classMap\`, \`styleMap\`, \`unsafeHTML\`, \`ifDefined\`, etc.), they must be imported **together with \`html\` in the same import statement**, never in separate paths.

Correct:
\`\`\`ts
import { html, repeat, classMap, unsafeHTML } from 'lit';
\`\`\`

Incorrect:
\`\`\`ts
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
\`\`\`

---

## 3. \`@customElement\` Naming Rules

### 3.1 camelCase → kebab-case Conversion
Every uppercase letter in the filename is converted to \`-\` + lowercase letter.

### 3.2 Folder Separator
When the file is in a subfolder (beyond \`l2\`), the folder name is separated by \`--\` from the filename.

### 3.3 Project Number
The project number (extracted from the \`_XXXXX_\` format) always goes at the **end** of the tag, separated by \`-\`.

### 3.4 Examples

| File Path | Generated Tag |
|---|---|
| \`_100554_/l2/testComp.ts\` | \`test-comp-100554\` |
| \`_100554_/l2/helloWorld.ts\` | \`hello-world-100554\` |
| \`_100554_/l2/test/helloWorld.ts\` | \`test--hello-world-100554\` |
| \`_100554_/l2/forms/inputText.ts\` | \`forms--input-text-100554\` |
| \`_100554_/l2/ui/card/myCard.ts\` | \`ui--card--my-card-100554\` |

---

## 4. Internationalization — I18n (Mandatory when text is present)

### 4.1 Structure

The I18n block must be declared **before** the \`@customElement\`, delimited by the mandatory markers:

\`\`\`ts
/// **collab_i18n_start**
const message_pt = {
    hello: 'Olá',
}

const message_en = {
    hello: 'Hello',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
\`\`\`

### 4.2 Rules

- The markers \`/// **collab_i18n_start**\` and \`/// **collab_i18n_end**\` are **mandatory**.
- The block is always placed **between the imports and the \`@customElement\`**.
- \`message_en\` is always the source of truth for \`MessageType\` (use \`typeof message_en\`).
- The \`messages\` dictionary must be typed as \`{ [key: string]: MessageType }\`.
- If the user **does not specify languages**, generate only \`message_en\` with English texts as default.

### 4.3 Usage inside the class

\`\`\`ts
export class MyComp extends CollabLitElement {

    private msg = messages['en'];

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html\`
            <h1>\${this.msg.hello}</h1>
        \`;
    }
}
\`\`\`

- \`private msg\` always initializes with \`messages['en']\`.
- \`this.getMessageKey(messages)\` is called at the beginning of \`render()\` to resolve the active language.
- All keys in the message object must be typed via \`MessageType\`.

---

## 5. TypeScript Typing (Mandatory)

Since the file is TypeScript, **everything must be typed**, without exception.

### 5.1 Properties
\`\`\`ts
@property({ type: String }) label: string = '';
@property({ type: Number }) count: number = 0;
@property({ type: Boolean }) disabled: boolean = false;
@property({ type: Object }) data: Record<string, unknown> = {};
@property({ type: Array }) items: string[] = [];
\`\`\`

### 5.2 Callbacks and Lit Functions

When using directives like \`repeat\`, callbacks must be explicitly typed with casting when necessary:

\`\`\`ts
import { html, repeat, TemplateResult } from 'lit';

render() {
    return html\`
        <ul>
            \${repeat(
                this.items,
                ((item: string) => item) as () => string,
                ((item: string) => html\`<li>\${item}</li>\`) as () => TemplateResult<1>
            )}
        </ul>
    \`;
}
\`\`\`

### 5.3 \`render()\` Return
The \`render()\` method implicitly returns \`TemplateResult<1>\`. When necessary to declare the type explicitly, import \`TemplateResult\` from \`'lit'\`.

---

## 6. Full File Structure

\`\`\`ts
/// <mls fileReference="_XXXXX_/l2/path/myComp.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    label: 'Rótulo',
}

const message_en = {
    label: 'Label',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('my-comp-XXXXX')
export class MyComp extends CollabLitElement {

    @property({ type: String }) label: string = '';
    private msg = messages['en'];

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html\`
            <div>\${this.msg.label}: \${this.label}</div>
        \`;
    }

}
\`\`\`

---

## 7. Validation Checklist

Before finalizing the component, check:

- [ ] Triple slash present as the first line of the file.
- [ ] \`fileReference\` with correct path and project number.
- [ ] Mandatory imports present (\`html\`, \`customElement\`, \`property\`, \`CollabLitElement\`).
- [ ] Lit directives imported from \`'lit'\` (not from subpaths).
- [ ] I18n block present with \`/// **collab_i18n_start**\` and \`/// **collab_i18n_end**\` markers.
- [ ] I18n block positioned between imports and \`@customElement\`.
- [ ] \`MessageType\` derived from \`typeof message_en\`.
- [ ] \`messages\` typed as \`{ [key: string]: MessageType }\`.
- [ ] Default language \`message_en\` present (even if other languages weren't requested).
- [ ] \`private msg\` initialized with \`messages['en']\`.
- [ ] \`this.getMessageKey(messages)\` called at the start of \`render()\`.
- [ ] \`@customElement\` tag follows the naming rule (kebab-case, \`--\` for folders, number at the end).
- [ ] All variables, properties, and callbacks are typed.
- [ ] Class extends \`CollabLitElement\`.
- [ ] Class exported with \`export class\`.
`;

const skill_plugin = `
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
`;

const skill_less = `
# Skill: Creating the Component or Plugin LESS File

## LESS File Structure

Every component or plugin \`.less\` file follows three fundamental rules: triple slash on the first line, encapsulation within the component tag, and strict use of system tokens.

---

## 1. Triple Slash (Mandatory)

The first line of the file must always be the triple slash directive with the path to the \`.less\` file and the \`_blank\` enhancement:

\`\`\`less
/// <mls fileReference="_100554_/l2/myComp.less" enhancement="_blank" />
\`\`\`

---

## 2. Encapsulation in the Component Tag

All CSS must be encapsulated within the corresponding custom element tag. The tag follows the exact same naming rule as the \`@customElement\` defined in the \`.ts\` file.

\`\`\`less
/// <mls fileReference="_100554_/l2/serviceSave.less" enhancement="_blank" />

service-save-100554 {

    display: block;
    font-family: @font-family-primary;
    font-size: @font-size-16;

    .errorLocal {
        text-decoration: line-through;
        color: red;
    }

}
\`\`\`

No style should be declared outside the component's root tag.

---

## 3. Use of Tokens (Mandatory)

### 3.1 Main Rule

- **Use tokens** when the desired value exists in the provided token list.
- **Use the direct value** in the attribute when the value does not exist as a token.
- **Never invent tokens** that were not provided.

### 3.2 Available Tokens

\`\`\`less
[TOKENS]
\`\`\`

### 3.3 Correct Usage Examples

Token exists → use the token:
\`\`\`less
font-family: @font-family-primary;
font-size: @font-size-20;
\`\`\`

Value does not exist as a token → use directly:
\`\`\`less
color: #e53935;
background-color: rgba(0, 0, 0, 0.5);
border-radius: 4px;
\`\`\`

Never invent tokens:
\`\`\`less
/* WRONG - token does not exist in the list */
color: @color-error;
border-radius: @border-radius-sm;
\`\`\`

---

## 4. Full Structure

\`\`\`less
/// <mls fileReference="_100554_/l2/pluginCodeInsights.less" enhancement="_blank" />

plugin-code-insights-100554 {
    display: block;
    overflow-y: auto;
    font-family: @font-family-primary;
    font-size: @font-size-16;

    h2 {
        font-size: @font-size-24;
        font-family: @font-family-secondary;
    }

    .error-message {
        color: red;
        font-size: @font-size-12;
    }

    .badge {
        background-color: #1976d2;
        color: #fff;
        border-radius: 4px;
        padding: 2px 8px;
    }
}
\`\`\`

---

## 5. Validation Checklist — LESS

- [ ] Triple slash present as the first line with \`enhancement="_blank"\`.
- [ ] \`fileReference\` points to the correct \`.less\` file.
- [ ] All CSS content is encapsulated within the component tag.
- [ ] Root tag matches exactly the \`@customElement\` from the \`.ts\` file.
- [ ] No styles declared outside the root tag.
- [ ] Tokens used only when they exist in the provided list.
- [ ] Values without a corresponding token used directly in the attribute.
- [ ] No tokens invented.
`;