/// <mls shortName="iaChatInterfaces" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export const StatusCodeOk = 200;
export const StatusCodeNotModified = 304;
export const StatusCodeNotAuthenticated = 401;
export const StatusCodeBadRequest = 400;
export const StatusCodeUnauthorized = 401;
export const StatusCodeNotFound = 404;
export const StatusCodeForbidden = 403;
export const StatusCodeConflict = 409;
export const StatusCodeServerError = 500;
export const StatusCodeNotImplemented = 501;

export interface RequestBase {
  action: string;
}

export interface ResponseGetTaskUpdate extends ResponseBase {
  task: TaskData;
}

export interface ResponseBase {
  statusCode: typeof StatusCodeOk | typeof StatusCodeNotModified | typeof StatusCodeNotAuthenticated | typeof StatusCodeBadRequest | typeof StatusCodeNotFound | typeof StatusCodeServerError | typeof StatusCodeConflict; // 200, 401, 400, 404, 409, 500
  msg?: string; // error message from 400 or 500 status code
}

export interface RequestAddMessageAI extends RequestBase {
  action: "addMessageAI";
  userId: string;
  threadId: string;
  message: string;
  inputAI: IAMessageInputType[];
}

export interface ResponseAddMessageAI extends ResponseBase {
  message: Message;
  task: TaskData;
}


export interface User {
  userId: string; // compact UTC format `yyyyMMddHHmmss.nnn` unique sorted index, nnn is a sequence number
  name: string;
  status: string;
  threads: string[];
  lastSync?: string; // compact UTC format `yyyyMMddHHmmss`
}

export interface Thread {
  threadId: string; // compact UTC format `yyyyMMddHHmmss.nnn` unique sorted index, nnn is a sequence number
  name: string; // name of the thread (room)
  users: string[];
  history: { action: string, user: string, by?: string, timestamp: string }[];
  languages: string[];
}


export interface Message {
  threadId: string;
  orderAt: string; // compact UTC format `yyyyMMddHHmmss.nnn` unique sorted index, nnn is a sequence number
  createAt: string; // compact UTC format `yyyyMMddHHmmss`
  updatedAt?: string; // compact UTC format `yyyyMMddHHmmss`
  senderId: string;
  content: string;
  language_detected?: string;
  externalPlatform?: string;
  translations?: { [key: string]: string };
  reactions?: { [key: string]: string[] };
  type?: string; // default is `text`
  status?: string;
  pin?: boolean;
  priority?: string;
  taskId?: string;
  updates?: object[];
  visibility?: string;
  url?: string;
  replyTo?: string;
}

export interface ProviderConfig {
  provider: string;
  model: string;
  text: boolean;
  image: boolean;
  json: boolean; // accept json as output
  inputValue: number; // value for 1M tokens
  outputValue: number; // value for 1M tokens

}

export interface Providers {
  [provider: string]: Record<string, ProviderConfig>;
}

export type TaskOperationType = "create" | "read" | "update" | "delete" | "query";

export interface TaskOperation {
  operation: TaskOperationType;
  taskId?: string;
  data?: Partial<TaskData>;
  filters?: Record<string, any>;
  message?: string | null; // clarification message
}

export interface TaskData {
  PK: string;
  SK: string;
  title: string;
  owner: string | null;
  team: string | null;
  status: 'todo' | 'in progress' | 'done' | 'paused' | 'waitingforuser';
  last_updated: number;
  last_update_log: string | null;
  source?: string;
  url?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  effort?: number;
  cost?: number;
  iaCompressed?: IACompressed; // compressed to string to save in DB
  tags?: string[];
  messageid_created?: string; // message id from origin this task
  messageid_refs?: string[]; // messages id referenced in this task
}


//
// ====================
// AI TASKS
// ====================


export interface IACompressed {
  // this object can be compressed to a string for saving in DB
  interaction: AIInteraction;
}

export interface AIInteraction {
  input: IAMessageInputType[];
  cost: number; // cost in this interaction , with no deep cost
  trace: string[]; // optional trace of the steps
  payload: AIPayload[] | null; // Tree of steps or null for not processed
}

export interface IAMessageInputType {
  type: 'system' | "human" | "ai";
  content: string;
}

export type AIStepStatus = 'pending' | 'in_progress' | 'waiting_for_user' | 'completed' | 'failed';

export type AIPayload = AIAgentStep | AIToolStep | AIClarificationStep | AIFinalResultStep | AIFlexibleResultStep;

export interface AIStep {
  type: AIPayload['type'];
  stepId: number; // unique id , from first interaction
  status: AIStepStatus;
  title: string; // title of the step, ex: "Criado: /pages/cliente.html"
  // If null => interaction not prepared yet
  // If undefined => no LLM interaction needed for this step (e.g., tool call)
  // If defined => contains prompt/response used in this step
  interaction: AIInteraction | null | undefined;
  nextSteps: AIPayload[] | null; // Tree of steps or null for not processed or [] if no next steps
}

export interface AIAgentStep extends AIStep {
  type: 'agent';
  agentName: string;
  prompt: string;
  rags: string[] | null; // name of files RAG to search
}

export interface AIToolStep extends AIStep {
  type: 'tool';
  toolName: string;
  args: string; // JSON stringified
}

export interface AIClarificationStep extends AIStep {
  type: 'clarification';
  clarificationMessage: string;
  htmlForm?: string; // Optional HTML form shown to the user. The submitted data will be included in the prompt of the next interaction.
}

export interface AIFinalResultStep extends AIStep {
  type: 'result';
  result: string;
}

export interface AIFlexibleResultStep extends AIStep {
  type: 'flexible';
  result: any; // Flexible JSON result, parsed and handled by afterPrompt function
}


export interface AIAfterPrompt{
  agent: string,
  nextprompt: any,
  stepFather:number,
}

export interface AgentBase{
  visibility: 'public' | 'private',
  beforePrompt(task: TaskData, payload: AIPayload | null | undefined): IAMessageInputType[],
  afterPrompt(task: TaskData, payload: AIPayload[] | null | undefined): Promise<AIAfterPrompt[]>,
  startPrompt(userPrompt: string): IAMessageInputType[]
}
