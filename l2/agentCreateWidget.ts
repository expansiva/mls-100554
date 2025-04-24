/// <mls shortName="agentCreateWidget" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';

import {
  getNextPendingStepByAgentName,
  getNextInProgressStepByAgentName,
  calculateStepsStatistics,
  updateStepStatus
} from "./_100554_aiAgentHelper";

import {
  startNewAiTask,
  executeNextStep,
  startNewInteractionInAiTask
} from "./_100554_aiAgentOrchestration";

const agentName = "agentCreateWidget";

export function createAgent(): IAgent {
  return {
    agentName,
    avatar_url:svg_agent,
    agentDescription: "Responsável pela criação de um novo componente (widget) no sistema",
    visibility: "private",
    async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
      return _beforePrompt(context);
    },
    async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
      return _afterPrompt(context);
    }
  };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
  const taskTitle = "Planning";

  if (!context || !context.message) throw new Error("Invalid context");

  if (!context.task) {
    // using temporary context, create a new task
    const inputs = await getPrompts(context.message.content, null);
    await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
  } else {

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) {
      throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    }
    context.task = await updateStepStatus(context.task, step.stepId, "in_progress");
    const inputs = await getPrompts(step.prompt, step.rags);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
  }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
  if (!context || !context.message || !context.task) throw new Error("Invalid context");
  const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
  if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
  const { flexible } = calculateStepsStatistics([step], true);
  if (flexible > 0) throw new Error(`[${agentName}] afterPrompt: error, Flexible step found.`);
  context.task = await updateStepStatus(context.task, step.stepId, "completed");
  await executeNextStep(context);
}

export async function getPrompts(prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
  if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
  const prompts: mls.msg.IAMessageInputType[] = [];

  prompts.push(systemMainInstruction());
  prompts.push(systemOutInstruction());
  prompts.push({
    type: 'human',
    content: prompt
  });
  return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `Você é um programador responsável pela criação de um novo componente (widget) no sistema.

Com base no prompt original do usuário, sua tarefa é:
1. Com base no json enviado pelo usuário, criar um novo componente nestas especificações
2. Se os dados forem suficientes, preparar a chamada para o agente "agentCreateNewWidget".
3. Se faltar qualquer informação, retornar uma "clarificationMessage".
`
  }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `## Formato de saida

Você deve retornar o código em typescript, como no exemplo abaixo. 
Observação: não deve retornar nenhum código LESS ou CSS, pois isso será feito posteriormente.

* Arquivo TS

/// <mls shortName="wcInputNumber" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, ifDefined, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaFormsInputNumberBase } from './_100554_icaFormsInputNumberBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';

@customElement('wc-input-number-100554')
export class WCInputNumber extends IcaFormsInputNumberBase {

    @propertyDataSource({ type: String }) value: number | undefined;

    @property({ type: String }) name: string | undefined;

    @property({ type: String }) placeholder: string | undefined;

    @propertyCompositeDataSource({ type: String }) label: string | undefined;

    @property({ type: String }) pattern: string | undefined;

    @property({ type: String }) errormessage: string | undefined;

    @property({ type: Number }) maxvalue: number | undefined;

    @property({ type: Number }) minvalue: number | undefined;

    @property({ type: Number }) step: number | undefined;

    @property({ type: Boolean }) required: boolean = false;

    @property({ type: Boolean }) disabled: boolean = false;

    @property({ type: Boolean }) readonly: boolean = false;

    @property({ type: Boolean }) autofocus: boolean = false;

    @propertyCompositeDataSource({ type: String }) hint: string = '';

    @property({ type: String }) inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' = 'none';

    @query('.input_control') input: HTMLInputElement | undefined;

    error: string = '';

    render() {
        return html\`
        <label class="form-control-label" for="input">
          \${this.label}
        </label>

        <input
            id="input"
            class="input_control"
            type="number"
            name=\${ifDefined(this.name)}
            ?disabled=\${this.disabled}
            ?readonly=\${this.readonly}
            ?required=\${this.required}
            min=\${ifDefined(this.minvalue)}    
            max=\${ifDefined(this.maxvalue)}
            step=\${ifDefined(this.step as number)}
            .value=\${this.value}
            ?autofocus=\${this.autofocus}
            pattern=\${ifDefined(this.pattern)}
            inputmode=\${ifDefined(this.inputmode)}
            @input=\${this.handleChange}
        />

        <div class="form_error_message">\${this.error}</div>
        \`;
    }

    private handleChange() {
        if (!this.input) return;
        let newval = +this.input.value;
        if (!isNaN(newval)
            && (this.minvalue === undefined || (newval >= this.minvalue))
            && (this.maxvalue === undefined || (newval <= this.maxvalue))
        ) {
            this.value = newval;
            this.error = '';
            this.requestUpdate();
        } else {
            this.error = this.errormessage || '';
            this.requestUpdate();
        }
    }
}
`
  }
}