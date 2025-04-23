/// <mls shortName="aiAgentBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export interface IAgent {
  visibility: 'public' | 'private';
  agentName: string;
  agentDescription: string;
  beforePrompt(context: mls.msg.ExecutionContext): Promise<void>;
  afterPrompt(context: mls.msg.ExecutionContext): Promise<void>;
}

export interface ITool {
  toolName: string;
  description: string;
  argsSchema: Record<string, any>;
  execute(args: Record<string, any>): Promise<any>;
}