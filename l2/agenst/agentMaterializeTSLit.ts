/// <mls fileReference="_100554_/l2/agenst/agentMaterializeTSLit.ts" enhancement="_100554_/l2/enhancementAgent"/>

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { getTokensLess } from '/_102027_/l2/designSystemBase.js';
import { getSkill } from '/_102027_/l2/defsAST.js';
import { collabImport } from '/_102027_/l2/collabImport.js';

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentMaterializeTSLit",
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: " Materialization TSLit",
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

  const inTest = true;
  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [{
        type: "system",
        content: system1.replace('{{user_defs}}', userDefs)
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
  const src = await mls.stor.files[key].getContent() as string;
  const oriSkill = getSkill(src);

  return await processTemplate(oriSkill);

  
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

export async function processTemplate(input: string): Promise<string> {
  const regex = /\[\[\((.*?)\)\.(.*?)\]\]/g;

  let result = input;

  const matches = [...input.matchAll(regex)];

  for (const match of matches) {
    const fullMatch = match[0];
    const filePath = match[1];
    const expression = match[2];

    const isFunction = expression.endsWith("()");
    const exportName = isFunction
      ? expression.replace("()", "")
      : expression;

    try {
      const f = mls.stor.convertFileReferenceToFile(filePath);
      if (!f) continue;
      const module = await collabImport(f as any);

      if (!module) {
        console.info(`Módulo não registrado: ${filePath}`);
        continue;
      }

      let replacement;

      if (isFunction) {
        replacement = await module[exportName]();
      } else {
        replacement = module[exportName];
      }

      result = result.replace(fullMatch, String(replacement));

    } catch (err) {
      console.error(`Erro em ${fullMatch}`, err);
    }
  }

  return result;
}