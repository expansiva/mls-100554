/// <mls shortName="aiAgentHelper" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

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

export const getNextInProgressStepByAgentName = (task: mls.msg.TaskData, agentName: string): mls.msg.AIAgentStep | null => {
  const allSteps = getAllSteps(task.iaCompressed?.nextSteps);
  const agentSteps = allSteps.filter((step): step is mls.msg.AIAgentStep => step.type === 'agent');
  return agentSteps.find(step => step.status === 'in_progress' && step.agentName === agentName) || null;
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
    const actualType = typeof args[key];

    if (expectedType !== actualType) {
      throw new Error(`Invalid type for argument '${key}': expected '${expectedType}', got '${actualType}'`);
    }
  }
}

export const updateStepStatus = async (task: mls.msg.TaskData, stepId: number, status: mls.msg.AIStepStatus, traceMsg?: string): Promise<mls.msg.TaskData> => {
  const args: mls.msg.RequestUpdateStepStatus = {
    "action": "updateStepStatus",
    "userId": task.owner || '',
    "messageId": task.messageid_created || '',
    "taskId": task.PK,
    stepId,
    status,
    traceMsg
  };
  const ret = await mls.api.msgUpdateStepStatus(args);
  if (!ret || ret.statusCode !== 200) throw new Error("error on AI update status , stoped");
  return (ret as mls.msg.ResponseUpdateStepStatus).task;
}

export const updateTaskTitle = async (task: mls.msg.TaskData, newTitle: string): Promise<mls.msg.TaskData> => {
  const args: mls.msg.RequestUpdateTaskTitle = {
    userId: getUserIdLocalStorage() || task.owner,
    newTitle,
    taskId: task.PK,
    messageId: task.messageid_created || '',
    action: 'updateTaskTitle',
  };
  const ret = await mls.api.msgUpdateTaskTitle(args);
  if (!ret || ret.statusCode !== 200) throw new Error("error on AI update task title , stoped");
  return (ret as mls.msg.ResponseUpdateTaskTitle).task;
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

const USER_ID_KEY = 'collabMessages_userId';

export function saveUserIdLocalStorage(userId: string): void {
  localStorage.setItem(USER_ID_KEY, userId);
}

export function getUserIdLocalStorage(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function notifyTaskChange(context: mls.msg.ExecutionContext): void {
  const event = new CustomEvent('task-change', {
    detail: context,
    bubbles: true,
    composed: true
  });
  window.dispatchEvent(event);
}

export function notifyThreadChange(thread: mls.msg.Thread): void {
  const event = new CustomEvent('thread-change', {
    detail: thread,
    bubbles: true,
    composed: true
  });
  window.dispatchEvent(event);
}


export function dispatchDetailsTaskClose(): void {
  const event = new CustomEvent('task-details-close', {
    bubbles: true,
    composed: true
  });
  window.dispatchEvent(event);
}


export function getTotalCost(task: mls.msg.TaskData): string {

  let tot = 0;
  const nextSteps = task.iaCompressed?.nextSteps;
  if (!nextSteps || nextSteps.length === 0) return tot.toFixed(4);

  const sumCosts = (interaction: mls.msg.AIInteraction) => {
    tot += interaction.cost ? interaction.cost : 0;
    if (interaction.payload && interaction.payload.length > 0) {
      interaction.payload.forEach((p) => {
        if (p.interaction) sumCosts(p.interaction);
        if (p.nextSteps) {
          p.nextSteps.forEach((p1) => {
            if (p1.interaction) sumCosts(p1.interaction);
          });
        }
      });

    }
  };

  nextSteps.forEach((step) => {
    if (step.interaction) sumCosts(step.interaction);
  })

  return tot.toFixed(4);
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
  const dateFull = `${date} ${time}`;
  return { dateFull, date, time };
}


