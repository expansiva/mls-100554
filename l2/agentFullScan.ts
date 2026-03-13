/// <mls fileReference="_100554_/l2/agentFullScan.ts" enhancement="_100554_/l2/enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentFullScan",
    agentProject: 100554,
    agentFolder: "",
    avatar_url: svgFullScan,
    agentDescription: "Responsible for analyzing project files according to user requests.",
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

  const system = await prepareSystemPrompt()

  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [{
        type: "system",
        content: system,
      }, {
        type: "human",
        content: context.message.content
      }],
      taskTitle: `Full scan`,
      threadId: context.message.threadId,
      userMessage: context.message.content,
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

  const payload = (step.interaction?.payload?.[0]);
  if (!payload || !payload.type) throw new Error(`Payload invalid`);

  let status: mls.msg.AIStepStatus = 'completed';

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

  if (payload.type === 'flexible' && !Array.isArray(payload.result) && payload.result.type === 'tool') {
    const newStep: mls.msg.AgentIntentAddStep = {
      type: "add-step",
      messageId: context.message.orderAt,
      threadId: context.message.threadId,
      taskId: context.task?.PK || '',
      parentStepId: step.stepId,
      step: {
        type: 'tool',
        stepId: 0,
        interaction: null,
        status: 'waiting_human_input',
        nextSteps: [],
        toolName: payload.result.toolName,
        args: payload.result.args
      }
    };
    return [newStep]
  }

  if (payload.type === 'flexible' && Array.isArray(payload.result)) {

    const nexts = payload.result as INextsAgents[];
    const nextsIntents: mls.msg.AgentIntent[] = [];
    for (let agent of nexts) {
      const prompt = {
        page: agent.page,
        prompt: agent.title,
        position: agent.position,
        mode: agent.mode
      }
      const newStep: mls.msg.AgentIntentAddStep = {
        type: "add-step",
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: step.stepId,
        step: {
          type: 'agent',
          stepId: 0,
          interaction: null,
          status: 'waiting_human_input',
          nextSteps: [],
          agentName: agent.agentName,
          rags: null,
          prompt: JSON.stringify(prompt)
        }
      };

      nextsIntents.push(newStep);
    }

    return nextsIntents;
  }

  return [updateStatus]

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
  const system = await prepareSystemPrompt()

  const continueIntent: mls.msg.AgentIntentPromptReady = {
    type: "prompt_ready",
    args,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    hookSequential,
    parentStepId: parentStep.stepId,
    humanPrompt: args || '',
    systemPrompt: system
  }

  return [continueIntent];
}

async function prepareSystemPrompt(): Promise<string> {

  let system: string = system1.replace('{{date}}', new Date().toISOString());
  return system;

}

const system1 = `
<!-- modelType: code -->
<!-- modelTypeList: geminiChat 9/10 , code (grok) 7/10, deepseekchat 2/10, codeflash (gemini) 8/10, deepseekreasoner 3/10, mini (4.1) or nano (openai) 4/10, codeinstruct (4.1) 4/10, codereasoning(gpt5) 3/10, code2 (kimi 2.5) -->

You are an assistant that converts natural language instructions into structured filters and defines the tasks to be executed.


---
# If the section **Response from tool toolFilterFilesL2** exists

### 🔍 Mandatory steps:

1. **Analyze user request
2. For each entry in the list, check whether there is **any agent compatible** with the instruction, based on the keywords declared below.
3. If one or more compatible agents exist, generate tasks.
4. If **no agent is compatible**, **do not generate tasks** and return 'result: []'.
---

### 🚦 Semantic compatibility with agents

For each available agent, use the allowed keywords to verify whether the user's instruction matches.  
**Do not attempt to infer meaning without compatible keywords.**

---

## 🧠 Available agents:

### 1. agentReview
- **Description:** responsible for performing technical reviews of '.ts', '.html', or '.less' files
- **Allowed keywords:** 'review', 'revisar', 'revisão', 'analisar código', 'verificar código'
- **Examples of compatible instructions:**
  - "review agentX"
  - "review the .ts files"
- **Examples of invalid instructions:**
  - "improve the file"
  - "enhance code"
- **Prompt model:**

\`\`\`json
{
  "page": "_100554_pluginExploreStories",
  "prompt": "@@Review perform the review",
  "position": "left",
  "mode": "typescript" || "less" || "html"
}
\`\`\`

The page parameter must follow the pattern _\${projectId}_\${shortName}  
The mode parameter must correspond to the file extension  
Always remember that for each file there are .ts, .html, and .less versions.


---------------------------------------------------------------------------------------
# If the section **Response from tool toolFilterFilesL2** does NOT exist

## Relevant information for filter analysis:
- Files starting with 'plugin' — plugin-type files, representing extension modules that add specific functionality to the main system.
- Files starting with 'service' — service-type files.
- Files starting with 'widget' — web component files, reusable UI components developed for web applications.
- Files starting with 'agent' — LLM agent files, intelligent assistants, classifiers, content analyzers, or AI-based decision makers.
- Files starting with 'ica' — files from an internal Collab system module (Intention Component Appearance).
- Files starting with 'wcd' — files from an internal Collab system module (Web Component Designer).
- Files starting with 'lib' — internal library files of the Collab system.
- Files starting with 'lit' — files related to the external Lit 3.0 library.

Each file has the following fields:
- project (number)
- level (number)
- shortName (string)
- folder (string)
- extension (string, e.g. ".ts", ".html", ".less")
- status (string, "nochange", "changed", "new", "renamed", "deleted")
- hasError (boolean)
- isLocalVersionOutdated (boolean)
- inLocalStorage (boolean)
- updatedAt (string, ISO 8601 format, e.g. "2025-06-16T00:00:00.000Z")

Current date: {{date}}

Your response must be a list of filters in the following format:
{
  filters: [
    {
      field: string,
      op: "equals" | "startsWith" | "endsWith" | "contains" | "regex" | "isTrue" | "isFalse" | "between",
      value?: string | number | string[]
    }
  ]
}

Some examples:

Instruction: "review files changed 10 days ago"  
Response:
{
  "filters": [
    {
      "field": "updatedAt",
      "op": "between",
      "value": ["2025-06-16T00:00:00.000Z", "2025-06-16T23:59:59.999Z"]
    }
  ]
}

Instruction: "review all agent files"  
Response:
{
  "filters": [
    { "field": "shortName", "op": "startsWith", "value": "agent" }
  ]
}

Instruction: "review files with errors"  
Response:
{
  "filters": [
    { "field": "hasError", "op": "isTrue" }
  ]
}

Instruction: "review plugin files"  
Response:
{
  "filters": [
    { "field": "shortName", "op": "startsWith", "value": "plugin" }
  ]
}


## Output format
Return only valid JSON in the following structure:

[[OutputSection1]]

`

//#region OutputSection1
export type Output1 =
  {
    type: "flexible",
    result: INextsTools

  } |
  {
    type: "flexible",
    result: INextsAgents[]
  }

interface INextsTools {
  type: "tool",
  title: string,
  toolName: "toolFilterFilesL2"
  args: string
}

interface INextsAgents {
  id: string,
  type: "agent",
  agentName: string,
  title: string,
  prompt: string,
  page: string,
  position: string,
  mode: "typescript" | "less" | "html"
}
//#endregion

const svgFullScan = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>`

