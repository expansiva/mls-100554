/// <mls shortName="agentCreateHtmlExample" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

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

const agentName = "agentCreateHtmlExample";

export function createAgent(): IAgent {
  return {
    agentName,
    avatar_url:svg_agent,
    agentDescription: "Especialista em desenvolvimento de componentes WEB com Lit versão 3",
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
  prompts.push(systemRulesInstruction());
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
    content: `Você é um programador especialista em desenvolvimento de componentes WEB com Lit versão 3

A partir do código typescript passado pelo usuário, você deve gerar um HTML de saída, simulando a inclusão do componente em uma página

Se faltar qualquer informação, retornar uma "clarificationMessage".
`
  }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `## Regras adicionais
- gerar pelo menos dois exemplos
`
  }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `## Exemplo de saída

Para o código de entrada abaixo

\`\`\`ts
/// <mls shortName="wcInputDateRange" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, ifDefined, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement'

@customElement('wc-input-date-range-100554')
export class WCInputDateRange extends IcaLitElement {

    @property({ type: String }) name: string = '';

    @property({ type: String }) label: string = '';

    @property({ type: String }) widget: string = '';

    @property({ type: String }) pattern: string = '';

    @property({ type: String }) errormessage: string = '';

    @property({ type: Number }) maxvalue: number | undefined;

    @property({ type: Number }) minvalue: number | undefined;

    @property({ type: Boolean }) required: boolean = false;

    @property({ type: Boolean }) disabled: boolean = false;

    @property({ type: Boolean }) readonly: boolean = false;

    @property({ type: Boolean }) autofocus: boolean = false;

    @property({ type: String }) hint: string = '';

    @property({ type: String }) inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' = 'none';

    @property({ type: String }) valueInitial: string = '';

    @property({ type: String }) valueFinal: string = '';

    @property({ type: String }) separatorText: string = '';

    @query('.input_control.initial') inputInitial: HTMLInputElement | undefined;

    @query('.input_control.final') inputFinal: HTMLInputElement | undefined;


    error: string = '';

    render() {
        return html\`
        <label class="form-control-label">
          \${this.label}
        </label>
        <div class="input_container">
            <input
                class="input_control initial"
                type="date"
                name=\${ifDefined(this.name)}
                ?disabled=\${this.disabled}
                ?readonly=\${this.readonly}
                ?required=\${this.required}
                min=\${ifDefined(this.minvalue)}    
                .value=\${this.valueInitial}
                ?autofocus=\${this.autofocus}
                pattern=\${ifDefined(this.pattern)}
                inputmode=\${ifDefined(this.inputmode)}
                @input=\${this.handleChange}
            />

            <span>\${this.separatorText}</span>

            <input
                class="input_control final"
                type="date"
                name=\${ifDefined(this.name)}
                ?disabled=\${this.disabled}
                ?readonly=\${this.readonly}
                ?required=\${this.required}
                min=\${ifDefined(this.valueInitial)}
                max=\${ifDefined(this.maxvalue)}
                .value=\${this.valueFinal}
                ?autofocus=\${this.autofocus}
                pattern=\${ifDefined(this.pattern)}
                inputmode=\${ifDefined(this.inputmode)}
            />
        </div>
        <small class="form_hint">\${this.hint}</small>

        <div class="form_error_message">\${this.error}</div>
        \`;
    }


    private handleChange() {
        if (!this.inputFinal || !this.inputInitial) return;

        let maxValue = this.inputInitial.value;

        this.inputFinal.min = maxValue;

        if (this.inputFinal.value < maxValue) {
            this.inputFinal.value = maxValue;
        }
    }
}
\`\`\`

deve gerar o seguinte exemplo

<div>
<wc-input-date-range-100554 
    name=""
    label=""
    widget=""
    pattern=""
    errormessage=""
    maxvalue=""
    minvalue=""
    required="false"
    disabled="false"
    readonly="false"
    autofocus="false"
    hint=""
    inputmode="none"
    valueInitial=""
    valueFinal=""
    separatorText=""
    ></wc-input-date-range-100554>
</div>

outro exemlo de saída seria

<div>
<wc-input-date-range-100554 
    name="txtInterval"
    label="Período de viagem"
    errormessage="data inválida"
    hint="selecione um interválo válido de datas"
    inputmode="none"
    valueInitial="2025-02-01"
    valueFinal="2025-02-28"
    separatorText="até"
    >
</wc-input-date-range-100554>
</div>
`
  }
}