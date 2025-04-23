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
  if (!args) {
    throw new Error("No args provided");
  }
  let normalizedArgs = args.trim();
  if (!normalizedArgs.startsWith('{')) {
    normalizedArgs = `{${normalizedArgs}}`;
  }
  try {
    // error example: "a:1, b:2" => "{a:1, b:2}" => '{"a":1, "b":2}'
    normalizedArgs = normalizedArgs.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
    return JSON.parse(normalizedArgs);
  } catch (error) {
    throw new Error("Invalid args format, cannot parse.");
  }
}

export function argsValidator(args: Record<string, any>, schema: Record<string, { type: string, description?: string }>): void {
  for (const key in schema) {
    if (!(key in args)) {
      throw new Error(`Missing argument: ${key}`);
    }

    const expectedType = schema[key].type;
    const actualType = typeof args[key];

    if (expectedType !== actualType) {
      throw new Error(`Invalid type for argument '${key}': expected '${expectedType}', got '${actualType}'`);
    }
  }
}
