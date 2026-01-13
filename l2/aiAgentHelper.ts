/// <mls shortName="aiAgentHelper" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { updateMessage, getMessage, getThreadByName } from '/_102025_/l2/collabMessagesIndexedDB.js';
import { getUserId, createThread } from '/_102025_/l2/collabMessagesHelper.js';
import { loadAgent, executeBeforePrompt } from '/_100554_/l2/aiAgentOrchestration.js';
import { openService } from '/_100554_/l2/libCommom.js';
import { IAgent } from '/_100554_/l2/aiAgentBase.js';
import { collabImport } from '/_100554_/l2/collabImport.js';

/**
 * Helper function to collect all steps from a task in a flat array
 */
export const getAllSteps = (firstStep: mls.msg.AIPayload[] | undefined): mls.msg.AIPayload[] => {
  if (!firstStep || firstStep.length < 1) {
    return [];
  }
  const allSteps: mls.msg.AIPayload[] = [];
  const queue: mls.msg.AIPayload[] = [...firstStep];

  // BFS approach to collect all steps
  while (queue.length > 0) {
    const currentStep = queue.shift()!;
    allSteps.push(currentStep);

    // Add nextSteps to queue if they exist
    if (currentStep.nextSteps) {
      queue.push(...currentStep.nextSteps);
    }

    // Add steps from interaction.payload if they exist
    if (currentStep.interaction?.payload) {
      queue.push(...currentStep.interaction.payload);
    }
  }

  return allSteps;
};

export const getAgentStepByAgentName = (task: mls.msg.TaskData, agentName: string): mls.msg.AIPayload | null => {
  const allSteps = getAllSteps(task.iaCompressed?.nextSteps);
  const agentSteps = allSteps.find((step): step is mls.msg.AIAgentStep => step.type === 'agent' && step.agentName === agentName);
  return agentSteps || null;
};

export const getAgentsStepByAgentName = (task: mls.msg.TaskData, agentName: string, status?: mls.msg.AIStepStatus): mls.msg.AIPayload[] => {
  const allSteps = getAllSteps(task.iaCompressed?.nextSteps);
  const agentSteps = allSteps.filter((step): step is mls.msg.AIAgentStep => step.type === 'agent' && step.agentName === agentName);
  if (!status) return agentSteps || [];
  return agentSteps.filter(step => step.status === status);
};


export const getStepById = (task: mls.msg.TaskData, stepId: number): mls.msg.AIPayload | null => {
  const allSteps = getAllSteps(task.iaCompressed?.nextSteps);
  return allSteps.find(step => step.stepId === stepId) || null;
};

export const getNextPendentStep = (task: mls.msg.TaskData): mls.msg.AIPayload | null => {
  const allSteps = getAllSteps(task.iaCompressed?.nextSteps);
  return allSteps.find(step => step.status === 'pending') || null;
};

export const getNextResultStep = (task: mls.msg.TaskData): mls.msg.AIResultStep | null => {
  const allSteps = getAllSteps(task.iaCompressed?.nextSteps);
  const agentSteps = allSteps.filter((step): step is mls.msg.AIResultStep => step.type === 'result');
  return agentSteps.find(step => step.status === 'completed') || null;
}

export const getNextClarificationStep = (task: mls.msg.TaskData): mls.msg.AIClarificationStep | null => {
  const allSteps = getAllSteps(task.iaCompressed?.nextSteps);
  const agentSteps = allSteps.filter((step): step is mls.msg.AIClarificationStep => step.type === 'clarification');
  return agentSteps.find(step => step.status === 'pending') || null;
}

export const getNextPendingStepByAgentName = (task: mls.msg.TaskData, agentName: string): mls.msg.AIAgentStep | null => {
  const allSteps = getAllSteps(task.iaCompressed?.nextSteps);
  const agentSteps = allSteps.filter((step): step is mls.msg.AIAgentStep => step.type === 'agent');
  return agentSteps.find(step => step.status === 'pending' && step.agentName === agentName) || null;
}

export const getNextFlexiblePendingStep = (task: mls.msg.TaskData): mls.msg.AIFlexibleResultStep | null => {
  const allSteps = getAllSteps(task.iaCompressed?.nextSteps);
  const agentSteps = allSteps.filter((step): step is mls.msg.AIFlexibleResultStep => step.type === 'flexible');
  return agentSteps.find(step => step.status === 'pending') || null;
}

export const getNextInProgressStepByAgentName = (task: mls.msg.TaskData, agentName: string): mls.msg.AIAgentStep | null => {
  const allSteps = getAllSteps(task.iaCompressed?.nextSteps);
  const agentSteps = allSteps.filter((step): step is mls.msg.AIAgentStep => step.type === 'agent');
  return agentSteps.find(step => step.status === 'in_progress' && step.agentName === agentName) || null;
}

export const getRootAgent = (task: mls.msg.TaskData): mls.msg.AIAgentStep | null => {
  const allSteps = getAllSteps(task.iaCompressed?.nextSteps);
  const agentSteps = allSteps.filter((step): step is mls.msg.AIAgentStep => step.type === 'agent');
  return agentSteps[0] || null;
}


export const getInteractionStepId = (task: mls.msg.TaskData, stepId: number): number | null => {
  // nextSteps []
  // | interaction
  // | | nextsSteps []
  // ...
  // this routine find the parent interaction stepId
  const allSteps = getAllSteps(task.iaCompressed?.nextSteps);
  if (!allSteps) return null;

  for (const step of allSteps) {
    if (!step.interaction || !step.interaction.payload) continue;
    if (step.interaction.payload.length < 1) continue;
    if (step.interaction.payload.find(s => s.stepId === stepId)) return step.stepId;
  }

  return null;
}


// todo: remove , this function has moved to orchestration js
export async function getAgentInstanceByName(agentName: string): Promise<IAgent | undefined> {

    const projectActual = mls.actualProject;
    if (!projectActual) throw new Error('Not found project actual!');

    const deps: number[] = mls.l5.getProjectDependencies(projectActual, false);
    const projectsToSearch = [projectActual, ...(deps.length === 0 ? [100554] : deps)];

    // função interna para buscar dentro de 1 projeto
    const searchInProject = (projectId: number) => {
        let foundInFolder: mls.stor.IFileInfo | undefined;

        for (const file of Object.values(mls.stor.files)) {
            if (
                file.project === projectId &&
                file.shortName.startsWith('agent') &&
                file.shortName === agentName.trim()
            ) {
                if (file.folder === '') {
                    return file;
                }
                foundInFolder = file;
            }
        }
        return foundInFolder;
    };

    for (const projId of projectsToSearch) {
        const agent = searchInProject(projId);
        if (agent) {
            try {
                const moduleAgent = await collabImport({ project: agent.project, shortName: agent.shortName, folder: agent.folder.trim() });
                if (typeof moduleAgent.createAgent !== "function") throw new Error(`[getAgentInstanceByName] createAgent function not found in ${agentName}`);
                const agentInstance = moduleAgent.createAgent();
                if (typeof agentInstance.beforePrompt !== "function") throw new Error(`[getAgentInstanceByName] beforePrompt function not found in ${agentName}`);
                if (typeof agentInstance.afterPrompt !== "function") throw new Error(`[getAgentInstanceByName] afterPrompt function not found in ${agentName}`);
                return agentInstance;
            } catch (error: any) {
                console.error(`[loadAgent] ${error.message || error} `);
                return undefined;
            }
        }
    }

    return undefined;
}

export type StatisticsAITask = {
  agents: number, tools: number, clarification: number, result: number, flexible: number,
  totalCost: number, totalSteps: number,
};

export const calculateStepsStatistics = (steps: mls.msg.AIPayload[], removeFirstStep: boolean): StatisticsAITask => {
  const allSteps = getAllSteps(steps);
  if (removeFirstStep) allSteps.shift();

  return {
    agents: allSteps.filter(step => step.type === 'agent').length,
    tools: allSteps.filter(step => step.type === 'tool').length,
    clarification: allSteps.filter(step => step.type === 'clarification').length,
    result: allSteps.filter(step => step.type === 'result').length,
    flexible: allSteps.filter(step => step.type === 'flexible').length,
    totalCost: allSteps.reduce((sum, step) => sum + (step.interaction?.cost || 0), 0),
    totalSteps: allSteps.length
  };
};

export const calculateStepsByFilter = (task: mls.msg.TaskData, filter: Record<string, any>): number => {
  const allSteps: mls.msg.AIPayload[] = getAllSteps(task.iaCompressed?.nextSteps);
  // example: calculateStepsByFilter(task, { toolName: "abc "})
  let result = 0;
  for (const step of allSteps) {
    let allPropertiesMatch: boolean = true;
    for (const [key, value] of Object.entries(filter)) {
      const value2 = (step as any)[key];
      if (value2 !== value) {
        allPropertiesMatch = false;
        break; // exit for
      }
    }
    if (allPropertiesMatch) result += 1;
  }
  return result;
};


export const getTemporaryContext = (threadId: string, userId: string, prompt: string): mls.msg.ExecutionContext => {
  // create temporary context
  const context: mls.msg.ExecutionContext = {
    task: undefined,
    message: {
      threadId: threadId,
      orderAt: "",
      createAt: "",
      senderId: userId,
      content: prompt.trim(),
    }
  };
  return context;
};

export function safeParseArgs(args: string): Record<string, any> {
  // must accept entries like
  // { a: 5, b: 4 }
  // a:5,b:4
  // a=5, b=4
  if (!args) throw new Error("No args provided");

  let input = args.trim();

  if (input.startsWith("{")) {
    try {
      return JSON.parse(input);
    } catch (e) {
      throw new Error("Invalid JSON format");
    }
  }

  if (input.includes("=") && !input.includes(":")) {
    input = input.replace(/([a-zA-Z0-9_]+)\s*=/g, '"$1":');
  } else {
    input = input.replace(/(^|,)\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
  }

  if (!input.startsWith("{")) {
    input = `{${input}}`;
  }

  try {
    return JSON.parse(input);
  } catch (e) {
    throw new Error("Invalid args format, cannot parse.");
  }
}

export function argsValidator(
  args: Record<string, any>,
  schema: Record<string, { type: string, description?: string; optional?: boolean }>
): void {
  for (const key in schema) {
    const isOptional = schema[key].optional === true;

    if (!(key in args)) {
      if (!isOptional) {
        throw new Error(`Missing argument: ${key}`);
      }
      continue; // ok se for opcional
    }

    const expectedType = schema[key].type;
    let actualType: string = typeof args[key];
    actualType = actualType === 'object' ? (Array.isArray(args[key]) ? 'array' : 'object') : actualType

    if (expectedType !== actualType) {
      throw new Error(`Invalid type for argument '${key}': expected '${expectedType}', got '${actualType}'`);
    }
  }
}

export async function appendLongTermMemory(context: mls.msg.ExecutionContext, longTermMemory: Record<string, string>) {
  if (!context.task) throw new Error('[appendLongTermMemory] invalid task');
  const messageId: string | undefined = context.task.messageid_created;
  if (!messageId) throw new Error("[appendLongTermMemory] Invalid messageId");

  try {
    const ret = await mls.api.msgAppendLongTermMemory({
      longTermMemory,
      messageId,
      taskId: context.task.PK,
      userId: getUserId() || context.message.senderId,
    });

    if (!ret || ret.statusCode !== 200) throw new Error("error on AI appendLongTermMemory , stoped");
    return (ret as mls.msg.ResponseAppendLongTermMemory).task;
  } catch (err: any) {
    throw new Error('[appendLongTermMemory] ' + err.message);
  }

}

export const updateStepStatus = async (context: mls.msg.ExecutionContext, stepId: number, status: mls.msg.AIStepStatus, traceMsg?: string): Promise<mls.msg.ExecutionContext> => {
  if (!context.task) throw new Error("[updateStepStatus] , invalid task");
  const args: mls.msg.RequestUpdateStepStatus = {
    "action": "updateStepStatus",
    "userId": getUserId() || context.task.owner || '',
    "messageId": context.task.messageid_created || '',
    "taskId": context.task.PK,
    stepId,
    status,
    traceMsg
  };

  try {
    const ret = await mls.api.msgUpdateStepStatus(args);
    if (!ret || ret.statusCode !== 200) throw new Error("error on AI update status , stoped");
    if (ret.message) {
      context.message = ret.message;
      const message = await getMessage(`${ret.message.threadId}/${ret.message.createAt}`);
      if (message) await updateMessage(ret.message);
    }

    context.task = ret.task;
    return context;
  } catch (err: any) {
    throw new Error("[updateStepStatus] " + err.message);
  }


}

export const updateTaskTitle = async (task: mls.msg.TaskData, newTitle: string): Promise<mls.msg.TaskData> => {
  const args: mls.msg.RequestUpdateTaskTitle = {
    userId: getUserId() || task.owner,
    newTitle,
    taskId: task.PK,
    messageId: task.messageid_created || '',
    action: 'updateTaskTitle',
  };
  try {
    const ret = await mls.api.msgUpdateTaskTitle(args);
    if (!ret || ret.statusCode !== 200) throw new Error("[updateTaskTitle] , stoped");
    return (ret as mls.msg.ResponseUpdateTaskTitle).task;
  } catch (err: any) {
    throw new Error("[updateTaskTitle] " + err.message);
  }

}

export async function appendPromptToInteraction(
  userId: string,
  messageId: string | undefined,
  taskId: string,
  interactionStepId: number,
  inputAI: mls.msg.IAMessageInputType[],
  stepdIdToChangeStatus: number,
  newStatus: mls.msg.AIStepStatus
): Promise<mls.msg.TaskData | undefined> {
  if (!messageId) throw new Error("Message ID is undefined");
  if (!taskId) throw new Error("Task ID is undefined");
  const args: mls.msg.RequestAppendPromptToInteraction = {
    action: "appendPromptToInteraction",
    userId,
    messageId,
    taskId,
    interactionStepId,
    inputAI,
    stepdIdToChangeStatus,
    newStatus
  }

  const ret = await mls.api.msgAppendPromptToInteraction(args);
  if (!ret || ret.statusCode !== 200) throw new Error("error on AI update status , stoped");
  return (ret as mls.msg.ResponseUpdateStepStatus).task;

}

export function notifyMessageSendChange(context: mls.msg.ExecutionContext): void {
  const scopeWindow = window?.top ? window.top : window;
  const event = new CustomEvent('message-send', {
    detail: { context },
    bubbles: true,
    composed: true
  });
  scopeWindow.dispatchEvent(event);
}

export function notifyTaskChange(context: mls.msg.ExecutionContext, oldContextCreateAt?: string): void {
  const scopeWindow = window?.top ? window.top : window;
  const event = new CustomEvent('task-change', {
    detail: { context, oldContextCreateAt },
    bubbles: true,
    composed: true
  });
  scopeWindow.dispatchEvent(event);
}

export function notifyTaskCompleted(context: mls.msg.ExecutionContext, result?: string): void {
  const scopeWindow = window?.top ? window.top : window;
  const event = new CustomEvent('task-completed', {
    detail: { context, result },
    bubbles: true,
    composed: true
  });
  scopeWindow.dispatchEvent(event);
}

export function notifyThreadChange(thread: mls.msg.Thread): void {
  const scopeWindow = window?.top ? window.top : window;
  const event = new CustomEvent('thread-change', {
    detail: thread,
    bubbles: true,
    composed: true
  });
  scopeWindow.dispatchEvent(event);
}

export function notifyThreadCreate(thread: mls.msg.Thread): void {
  const scopeWindow = window?.top ? window.top : window;
  const event = new CustomEvent('thread-create', {
    detail: thread,
    bubbles: true,
    composed: true
  });
  scopeWindow.dispatchEvent(event);
}

export function dispatchDetailsTaskClose(taskId: string): void {
  const scopeWindow = window?.top ? window.top : window;
  const event = new CustomEvent('task-details-close', {
    detail: taskId,
    bubbles: true,
    composed: true
  });
  scopeWindow.dispatchEvent(event);
}


export function getTotalCost(task: mls.msg.TaskData): string {
  let tot = 0;
  const nextSteps = task.iaCompressed?.nextSteps;
  if (!nextSteps || nextSteps.length === 0) return "$ 0.01"; // garante saída mínima

  const sumCosts = (payload: mls.msg.AIPayload[]) => {
    payload.forEach((pay) => {
      const { interaction, nextSteps } = pay;

      if (interaction) {
        tot += interaction.cost ? interaction.cost : 0;
        if (interaction.payload) sumCosts(interaction.payload);
      }

      if (nextSteps) {
        nextSteps.forEach((next) => sumCosts([next]));
      }
    });
  };

  nextSteps.forEach((step) => sumCosts([step]));

  const rounded = Math.ceil(tot * 100) / 100;
  return `${rounded.toFixed(2)}`;
}


export function getNextStepIdAvaliable(task: mls.msg.TaskData): number {

  let nextStepId = 0;
  const nextSteps = task.iaCompressed?.nextSteps;
  if (!nextSteps || nextSteps.length === 0) return nextStepId + 1;

  const findNextStepId = (payload: mls.msg.AIPayload[]) => {
    payload.forEach((pay) => {
      const { interaction, nextSteps, stepId } = pay;
      if (stepId > nextStepId) nextStepId = stepId + 1;
      if (interaction) {
        if (interaction.payload) findNextStepId(interaction.payload);
      }
      if (nextSteps) {
        nextSteps.forEach((next) => {
          if (next.stepId > nextStepId) nextStepId = next.stepId + 1;
          findNextStepId([next])
        });
      }

    });
  };

  nextSteps.forEach((step) => {
    if (step.stepId > nextStepId) nextStepId = step.stepId + 1;
    findNextStepId([step]);
  });
  return nextStepId;
}


export async function executeAgentByFile(agentName: string, prompt: string, file: mls.stor.IFileInfo, openMsg: boolean = false) {

  const pageName = file.folder ? `_${file.project}_${file.folder}/${file.shortName}` : `${file.project}_${file.shortName}`;

  let thread = await getThreadByName(pageName);
  if (!thread) {
    thread = await createThread(pageName, [], 'company');
  }

  const userId = getUserId();
  if (!userId) return;
  const threadId = thread?.threadId;
  if (!threadId) throw new Error('[executeAgentByFile] Cannot find thread');

  const agent = await loadAgent(agentName);
  if (!agent) throw new Error('[executeAgentByFile] Invalid Agent' + agentName);

  const context = getTemporaryContext(threadId, userId, prompt);

  if (openMsg) {
    mls.events.fire([mls.actualLevel], 'collabMessages' as any, JSON.stringify({ threadId: threadId, taskId: 'last', type: 'thread-open' }));
  }
  executeBeforePrompt(agent, context);
}

export async function openCollabMessage(file: mls.stor.IFileInfo) {

  const pageName = file.folder ? `_${file.project}_${file.folder}/${file.shortName}` : `${file.project}_${file.shortName}`;

  let thread = await getThreadByName(pageName);
  if (!thread) {
    openService('_100554_serviceCollabMessages', 'left', mls.actualLevel);
    return;
  }

  const threadId = thread?.threadId;
  if (!threadId) {
    openService('_100554_serviceCollabMessages', 'left', mls.actualLevel);
    return;
  }

  
  mls.events.fire([mls.actualLevel], 'collabMessages' as any, JSON.stringify({ threadId: threadId, type: 'thread-open' }));
  

}

export function formatTimestamp(timestamp: string) {
  if (!timestamp || timestamp.length < 14) {
    return;
  }
  const year = timestamp.slice(0, 4);
  const month = timestamp.slice(4, 6);
  const day = timestamp.slice(6, 8);
  const hour = timestamp.slice(8, 10);
  const minute = timestamp.slice(10, 12);
  const second = timestamp.slice(12, 14);
  const utcDate = new Date(Date.UTC(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  ));

  const localYear = utcDate.getFullYear();
  const localMonth = (utcDate.getMonth() + 1).toString().padStart(2, '0');
  const localDay = utcDate.getDate().toString().padStart(2, '0');
  const localHour = utcDate.getHours().toString().padStart(2, '0');
  const localMinute = utcDate.getMinutes().toString().padStart(2, '0');
  const localSecond = utcDate.getSeconds().toString().padStart(2, '0');

  const date = `${localYear}-${localMonth}-${localDay}`;
  const time = `${localHour}:${localMinute}:${localSecond}`;
  const timeShort = `${localHour}:${localMinute}`;

  const dateFull = `${date} ${time}`;
  return { dateFull, date, time, timeShort };
}


