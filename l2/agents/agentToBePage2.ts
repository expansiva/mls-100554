/// <mls fileReference="_100554_/l2/agents/agentToBePage2.ts" enhancement="_102027_/l2/enhancementAgent.ts"/>

import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';
import { updateVariableJson, updateVariableText } from '/_102027_/l2/defsAST.js';

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentToBePage2",
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: "New agent",
    visibility: "public",
    beforePromptImplicit,
    beforePromptStep,
    afterPromptStep
  };
}

async function beforePromptImplicit(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

  if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');

  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [{
        type: "system",
        content: system1,
      }, {
        type: "human",
        content: context.message.content
      }],
      taskTitle: `Test 1`,
      threadId: context.message.threadId,
      userMessage: context.message.content,
    }
  };
  return [addMessageAI];

}

async function beforePromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
  args?: string
): Promise<mls.msg.AgentIntent[]> {

  if (!args) throw new Error(`(${agent.agentName})[beforePromptStep] args invalid`);

  const continueParallel: mls.msg.AgentIntentPromptReady = {
    type: "prompt_ready",
    args,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    hookSequential,
    parentStepId: 1,
    systemPrompt: system1,
    humanPrompt: args
  }

  return [continueParallel];
}


async function afterPromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {


  if (!agent || !context || !step) throw new Error(`[afterPromptStep] invalid params, agent:${!!agent}, context:${!!context}, step:${!!step}`);

  const payload = (step.interaction?.payload?.[0]);
  if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)
  let status: mls.msg.AIStepStatus = 'completed';
  let intents: mls.msg.AgentIntent[] = [];


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

  const output = payload.result;
  if (context.isTest) {
    console.info(output);
    return [updateStatus];
  }

  intents = await processOutput(context, output, agent);

  

  return [...intents, updateStatus];

}

async function processOutput(context: mls.msg.ExecutionContext, output: any, agent: IAgentMeta): Promise<mls.msg.AgentIntent[]> {

  let module = context.task?.iaCompressed?.longMemory['moduleName'];
  if (!module) throw new Error('Not found moduleName:' + agent.agentName);

  const ref = mls.stor.convertFileReferenceToFile(output.outputPath);
  const key = mls.stor.getKeyToFile(ref);
  const sf = mls.stor.files[key];
  if (!sf) throw new Error('Not found stor:' + output.outputPath);
  const m = await sf.getOrCreateModel();
  const src = m.model.getValue();

  //contract
  let newSrc = generateContract(src, output.outputPath, module);

  //shared
  newSrc = generateShared(newSrc, output.outputPath, module, sf);

  // page
  newSrc = updateVariableJson(newSrc, 'desktopLayout', output.definition);
  newSrc = generatePage(newSrc, output.outputPath, module, sf);

  //pipeLine
  newSrc = updateVariableJson(newSrc, 'materializeIndex', generatePipeLine(module, sf));

  // update model
  m.model.setValue(newSrc);

  await mls.stor.localStor.setContent(sf, { contentType: 'string', content: newSrc });

  const newStep: mls.msg.AgentIntentAddStep = {
    type: "add-step",
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    parentStepId: 1,
    step:
    {
      type: 'agent',
      stepId: 0,
      interaction: null,
      status: 'waiting_human_input',
      nextSteps: [],
      agentName: 'agentMaterialize',
      prompt: output.outputPath,
      rags: [],
    }
  };

  return [newStep];
}

function generateContract(src: string, defsPath: string, moduleName: string) {
  return updateVariableText(src, 'contractSpec', `
##Pages spec
\\\`\\\`\\\`JSON
    [[(${defsPath}).definition]]
\\\`\\\`\\\`
`)
}

function generateShared(src: string, defsPath: string, moduleName: string, sf: mls.stor.IFileInfo) {
  return updateVariableText(src, 'sharedSpec', `
##Pages spec
\\\`\\\`\\\`JSON
{
  "interfacePath":"_${sf.project}_/l1/${moduleName}/layer_2_controller/${sf.shortName}.js",
  "definition": [[(${defsPath}).definition]]
}    
\\\`\\\`\\\`

##Base Interfaces, Enuns ...
\\\`\\\`\\\`
    [[(_${sf.project}_/l1/${moduleName}/layer_2_controller/${sf.shortName}.ts)]]
\\\`\\\`\\\`
`)
}

function generatePage(src: string, defsPath: string, moduleName: string, sf: mls.stor.IFileInfo) {
  return updateVariableText(src, 'desktopLayoutSpec', `
## Page layout
\\\`\\\`\\\`JSON
{ 
  "interfacePath":"_${sf.project}_/l1/${moduleName}/layer_2_controller/${sf.shortName}.js",
  "definition": [[(${defsPath}).desktopLayout]]  
}
\\\`\\\`\\\`

##Base class
\\\`\\\`\\\`
  [[(_${sf.project}_/l2/${moduleName}/web/shared/${sf.shortName}.ts)]]
\\\`\\\`\\\`
`)
}

function generatePipeLine(moduleName: string, sf: mls.stor.IFileInfo) {
  const dt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const pipe = [
    {
      "id": "contract",
      "specVar": "contractSpec",
      "outputPath": "/l1/" + moduleName + "/layer_2_controller/" + sf.shortName + ".ts",
      "skillPath": "_102027_/l2/agents/skills/genContract.ts",
      "agent": "agentMaterializeContract",
      "dependsOn": [],
      "specUpdatedAt": dt
    },
    {
      "id": "shared",
      "specVar": "sharedSpec",
      "outputPath": "/l2/" + moduleName + "/web/shared/" + sf.shortName + ".ts",
      "skillPath": "_102027_/l2/agents/skills/genPageShared.ts",
      "agent": "agentMaterializeSharedPage",
      "dependsOn": ["contract"],
      "specUpdatedAt": dt
    },
    {
      "id": "desktop",
      "specVar": "desktopLayoutSpec",
      "outputPath": "/l2/" + moduleName + "/web/desktop/" + sf.shortName + ".ts",
      "skillPath": "_102027_/l2/agents/skills/genPageRender.ts",
      "agent": "agentMaterializePageLit",
      "dependsOn": ["contract", "shared"],
      "specUpdatedAt": dt,
    },
    {
      "id": "desktop-less",
      "specVar": "desktopLayout",
      "outputPath": "/l2/" + moduleName + "/web/desktop/" + sf.shortName + ".less",
      "skillPath": "_102027_/l2/agents/skills/genLess.ts",
      "agent": "agentMaterializeLess",
      "dependsOn": ["shared"],
      "specUpdatedAt": dt,
    }
  ];

  return pipe;
}


const system1 = `
<!-- modelType: code-->
<!-- modelTypeList: geminiChat (2.5 pro), code (grok), deepseekchat, codeflash (gemini), deepseekreasoner, mini (4.1) ou nano (openai), codeinstruct (4.1), codereasoning(gpt5), code2 (kimi 2.5) -->


# SKILL: Layout Spec Generator

You are responsible for generating the \`layoutSpec\` JSON from a single definition JSON. You analyze the page's intent and organisms, and produce a complete layout definition that the WebComponent agent will use to generate the \`render()\` method.

You receive one JSON input with this structure:
\`\`\`json
{
  "outputPath": "/_102009_/petshop/storeLocation.defs.ts",
  "folder":     "l2/petshop/web/",
  "definition": { ...pages JSON... }
}
\`\`\`

---

## Path derivation rules — apply these BEFORE writing any output

### sharedPath
Derived from \`folder\` + \`"shared/"\` + \`pageName\` + \`".js"\`:
\`\`\`
folder:    "l2/petshop/web/"
pageName:  "storeLocation"
→ sharedPath: "/_XXXXX_/l2/petshop/web/shared/storeLocation.js"
\`\`\`
The project number \`_XXXXX_\` is extracted from \`outputPath\` (the \`_102009_\` part).

### imports paths
Same as \`sharedPath\` — both the action enum and the shared class are imported from the shared file:
\`\`\`json
"imports": [
  { "type": "value", "import": "{ anyInterfaces }", "path": "{interfacePath}" },
  { "type": "value", "import": "{ StoreLocationShared }",  "path": "/_102009_/l2/petshop/web/shared/storeLocation.js" }
]
\`\`\`

### tagName
Derived from \`folder\` + \`pageName\`, converted to kebab-case, with project number at the end.

Steps:
1. Take \`folder\`: \`"l2/petshop/web/"\`
2. Remove leading \`l2/\` and trailing \`/\`: \`"petshop/web"\`
3. Replace \`/\` with \`--\`: \`"petshop--web"\`
4. Add \`"--desktop--"\`: \`"petshop--web--desktop"\`
5. Convert \`pageName\` to kebab-case: \`"storeLocation"\` → \`"store-location"\`
6. Append project number from \`outputPath\`: \`"-102009"\`

\`\`\`
folder:   "l2/petshop/web/"
pageName: "storeLocation"
→ tagName: "petshop--web--desktop--store-location-102009"
\`\`\`

### outputPath
Return exactly as received in the input JSON. Do NOT use it to derive any other value.

### className
\`PascalCase(pageName)\` + \`"Page"\`:
\`\`\`
pageName: "storeLocation"
→ className: "StoreLocationPage"
\`\`\`

### extends
\`PascalCase(pageName)\` + \`"Shared"\`:
\`\`\`
pageName: "storeLocation"
→ extends: "StoreLocationShared"
\`\`\`

### project
Extracted from \`outputPath\`. Given \`"/_102009_/..."\` → \`102009\`.

---

## Your reasoning process (follow this order before writing the layout)

### Step 1 — Understand page intent and actor

Read \`definition.pages[*].purpose\` and \`definition.pages[*].actor\`.

- \`actor: "customer"\` → display mode (read-only, no forms)
- \`actor: "staff"\` → edit mode (forms, inputs, action buttons)
- Purpose with "exibe/apresenta/mostra" → display mode
- Purpose with "edita/atualiza/cadastra" → edit mode

### Step 2 — Each organism becomes one section

Each organism in \`sections[*].organisms\` becomes one \`<section>\` element in the default block, with a class in kebab-case of \`organismName\`.

### Step 3 — Decide layout mode per organism

| Organism signals | Layout mode |
|---|---|
| \`editable: false\` + display fields | \`display\` — spans, paragraphs, headings |
| \`editable: true\` OR staff + writable fields | \`form\` — inputs, selects, checkboxes |
| Fields suggest list/collection | \`list\` — repeating cards |
| navigationFields + contact channels | \`contact\` — links, buttons |
| Map + address fields | \`map-info\` — address block + map button |

### Step 4 — Map fields to elements

**Display mode:**
| Field pattern | Element |
|---|---|
| \`name\`, heading-like | \`h2\` or \`h3\` |
| \`address\`, \`businessHours\`, text | \`p\` or \`address\` |
| \`mapLink\`, external URL | button calling navigation method |
| \`phone\`, \`whatsapp\`, \`email\` | button calling navigation method |
| \`imageUrl\` | \`img\` |
| \`price\` | \`span\` with price class |
| \`description\` | \`p\` |
| computed \`fullAddress\` | \`address\` element |
| computed \`hasWhatsapp\` | used as \`condition\` on wrapper element |

**Form mode:**
| Field type / pattern | Element |
|---|---|
| \`string\` text | \`input[type="text"]\` |
| \`number\` | \`input[type="number"]\` |
| \`boolean\` | \`input[type="checkbox"]\` |
| \`imageUrl\`/\`url\` in name | \`input[type="url"]\` |
| \`string\` with \`Id\` suffix + list state | \`select\` |
| \`description\`, long text | \`textarea\` |
| \`email\` | \`input[type="email"]\` |
| \`phone\`, \`whatsapp\` | \`input[type="tel"]\` |

### Step 5 — Conditions

Always generate when shared has \`loading\` and \`error\` states:
\`\`\`json
"conditions": [
  { "if": "this.loading", "return": "loading" },
  { "if": "this.error",   "return": "error"   }
]
\`\`\`

### Step 6 — Actions and events

**navigationFields** → button calling shared public method:
\`\`\`json
{ "event": { "on": "click", "type": "method", "method": "openMap" } }
\`\`\`

**Form submit** → action event:
\`\`\`json
{ "event": { "on": "submit", "type": "action", "state": "action", "value": "PageNameAction.SAVE_X", "prevent": true } }
\`\`\`

**Retry button** → action event to reload:
\`\`\`json
{ "event": { "on": "click", "type": "action", "state": "action", "value": "PageNameAction.LOAD_X" } }
\`\`\`

**computedFields with boolean** (e.g. \`hasWhatsapp\`) → used as \`"condition"\` on wrapper element, not rendered directly.

### Step 7 — Desktop layout structure per organism

| Organism type | Desktop structure |
|---|---|
| Single entity display (address, hours) | Two-column grid: info left, map/action right (\`2fr 1fr\`) |
| Contact channels | Horizontal flex row of contact buttons |
| Edit form | Two-column grid + full-width for long fields + actions row |
| List/catalog | Three-column card grid |
| Detail view | Two-column: image left, info+actions right |

### Step 8 — State prefix for binds

State names follow the prefix rule from the shared: \`stateKey\` suffix → prefix.
- \`db.storeInfo\` → prefix \`storeInfo_\`
- \`db.product\` → prefix \`product_\`

So binds use: \`"bind": "this.storeInfo_name"\`, \`"bind": "this.storeInfo_fullAddress"\`, etc.

Computed states follow the same prefix: \`"bind": "this.storeInfo_fullAddress"\`, \`"condition": "this.storeInfo_hasWhatsapp"\`.

Temp states use their camelCase name directly: \`"condition": "this.selectedContactChannel"\`.

### Step 9 — Action enum values

Action enum values are derived from the shared file reasoning (not from the contract). The pattern is:
- \`PascalCase(pageName)Action.LOAD_STORE_INFO\` for loads
- Reference only actions that will exist in the shared file

### Step 10 — i18n keys

Collect all text labels needed:
- Each field label → key matching \`entityField\` name
- Each button → key matching its action (\`openMap\`, \`callUs\`, \`whatsapp\`, \`emailUs\`, \`retry\`)
- State messages → \`loading\`, \`error\`, \`retry\`

---

## Element schema reference

### Container
\`\`\`json
{ "element": "div", "class": "my-class", "children": [ ... ] }
\`\`\`

### Text display
\`\`\`json
{ "element": "p", "class": "organism__text", "bind": "this.storeInfo_address" }
\`\`\`

### Conditional wrapper
\`\`\`json
{ "element": "div", "class": "channel", "condition": "this.storeInfo_phone", "children": [ ... ] }
\`\`\`

### Navigation button (calls shared method)
\`\`\`json
{
  "element": "button", "class": "btn btn--secondary", "i18n": "openMap",
  "event": { "on": "click", "type": "method", "method": "openMap" }
}
\`\`\`

### Action event (sets action state)
\`\`\`json
{
  "event": { "on": "click", "type": "action", "state": "action", "value": "StoreLocationAction.LOAD_STORE_INFO" }
}
\`\`\`

### Set event (sets data state)
\`\`\`json
{
  "event": { "on": "input", "type": "set", "state": "storeInfo_name", "cast": "string" }
}
\`\`\`

### Input (inside label)
\`\`\`json
{
  "element": "label", "class": "field", "i18n": "name",
  "input": {
    "type": "text", "class": "field__input", "bind": "storeInfo_name",
    "event": { "on": "input", "type": "set", "state": "storeInfo_name", "cast": "string" }
  }
}
\`\`\`

### Repeat block
\`\`\`json
{
  "element": "div", "class": "grid",
  "repeat": { "source": "this.flavors", "item": "item", "key": "item.id" },
  "children": [ ... ]
}
\`\`\`

---

## Output format
You must return the object strictly as JSON

\`\`\`json
[[OutputSection]]
\`\`\`

## What you NEVER do

- Derive \`outputPath\` from anything — return it exactly as received
- Use \`outputPath\` to build \`sharedPath\`, \`tagName\`, or any other value
- Generate inputs for \`editable: false\` organisms
- Use \`import type\` for action enum or shared class — they are runtime values
- Reference action enum values not derivable from the shared reasoning
- Reference navigation methods not derivable from \`navigationFields\`
- Generate i18n keys not used in the layout blocks
- Skip loading and error blocks when those states will exist in the shared
- Add \`desktop\` to the \`sharedPath\` — the shared file is never under a \`desktop\` folder

`



//#region OutputSection
export type Output =
  {
    type: "flexible";
    result: StoreLocationDefinition;
  }

export interface StoreLocationDefinition {
  outputPath: string;
  definition: {
    className: string;
    tagName: string;
    extends: string;
    sharedPath: string;
    styling: string;

    imports: ImportsDef[];

    render: RenderConfig;

    i18n: I18nConfig;
  };
}

export interface ImportsDef {

  type: string,
  import: string,
  path: string

}

export interface RenderConfig {
  conditions: RenderCondition[];
  blocks: Record<string, RenderBlock>;
}

export interface RenderCondition {
  if: string;
  return: string;
}

export interface RenderBlock {
  element: string;
  class?: string;
  bind?: string;
  i18n?: string;
  condition?: string;
  event?: EventConfig;
  children?: RenderBlock[];
}

export interface EventConfig {
  on: string;
  type: "action" | "method";
  state?: string;
  value?: string;
  method?: string;
}

export interface I18nConfig {
  default: string;
  languages: string[];
  keys: string[];
}

//#endregion 


