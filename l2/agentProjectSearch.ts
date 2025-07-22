/// <mls shortName="agentProjectSearch" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';

import {
  getAgentStepByAgentName,
  notifyTaskChange,
  updateStepStatus,
  getNextStepIdAvaliable,
} from "./_100554_aiAgentHelper";

import {
  startNewAiTask,
  executeNextStep,
  addNewStep
} from "./_100554_aiAgentOrchestration";

const agentName = "agentProjectSearch";
const project: number = 100554;//Number(localStorage.getItem("l5-last-project") || "1");

export function createAgent(): IAgent {
  return {
    agentName,
    avatar_url: svg_agent,
    agentDescription: "Agent for create a new Module",
    visibility: "public",
    async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
      return _beforePrompt(context);
    },
    async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
      return _afterPrompt(context);
    }
  };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
  const taskTitle = "Planning...";
  if (!context || !context.message || context.task) throw new Error("Invalid context");

  const inputs: any = await getPrompts(context.message.content);
  await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
  return;
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

  if (!context || !context.task) throw new Error(`[${agentName}] [_afterPrompt] Invalid context`);
  const agentStep = getAgentStepByAgentName(context.task, agentName); // Only one agent execution must exist in this task
  if (!agentStep) throw new Error(`[${agentName}] [_afterPrompt] no agent found`);

  context = await updateStepStatus(context, agentStep.stepId, "completed");
  if(!context.task) throw new Error(`[${agentName}] [_afterPrompt] Invalid context task`);
  const newStep: mls.msg.AIAgentStep = {
    type: 'agent',
    agentName: 'agentProjectSearch2',
    prompt: '...',
    status: 'pending',
    stepId: getNextStepIdAvaliable(context.task),
    interaction: null,
    nextSteps: null,
    rags: null
  }
  // complete this step (payload) and push another step
  await addNewStep(context, agentStep.stepId, [newStep], "Search");
  notifyTaskChange(context);
  await executeNextStep(context);
}

async function getPrompts(userPrompt: string): Promise<mls.msg.IAMessageInputType[]> {
  if (!userPrompt) throw new Error(`Erro [${agentName}] getPrompts: invalid userPrompt`);

  if (userPrompt.startsWith("@@")) userPrompt = userPrompt.replace(/^@@\S+\s*/, ""); // remove '@@xxx ' , first word
  const data = {
    userPrompt
  }
  const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data })
  return prompts;
}

export function getPayload1(context: mls.msg.ExecutionContext): PayLoad1 {
  if (!context || !context.task) throw new Error(`[${agentName}] [getPayload] Invalid context`);
  const agentStep = getAgentStepByAgentName(context.task, agentName); // Only one agent execution must exist in this task
  if (!agentStep) throw new Error(`[${agentName}] [getPayload] no agent found`);

  // get result
  const resultStep = agentStep.interaction?.payload?.[0];
  if (!resultStep || resultStep.type !== "flexible" || !resultStep.result) throw new Error(`[${agentName}] [getPayload] No step flexible found for this agent.`);
  let payload1: PayLoad1 | string = resultStep.result;
  if (typeof payload1 === "string") payload1 = JSON.parse(payload1) as PayLoad1;

  // get userPrompt
  payload1.userPrompt = agentStep?.interaction?.input.find((input) => input.type === 'human')?.content || '';

  if (payload1.embedding) {
    payload1.embeddingVector = mls.l4.decompressVector(payload1.embedding);
  }

  return payload1;
}

export interface PayLoad1 {
  userPrompt: string;
  textToEmbedding?: string;
  embedding?: string;
  embeddingVector?: number[] | number[][];
  embeddingVersion?: string;
  principalSearch?: string;
  optionalSearchTS?: string;
  optionalSearchHTML?: string;
  optionalSearchLess?: string;
}
