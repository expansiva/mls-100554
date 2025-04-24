/// <mls shortName="agentPromptGetScopeFromTs" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

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

const agentName = "agentPromptGetScopeFromTs";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Especialista em pegar o scopo de um component lit",
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
    prompts.push(systemRules2Instruction());
    //prompts.push(systemOutInstruction());
    prompts.push({
        type: 'human',
        content: prompt
    });
    return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `
Você é um programador especialista em desenvolvimento de componentes WEB com Lit versão 3

A partir do código typescript passado pelo usuário, você deve gerar um HTML de saída, emulando o processamento do lit

Se faltar qualquer informação, retornar uma "clarificationMessage"
`
    }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Exemplo de processamento

* Código enviado pelo usuário
\`\`\`
/// <mls shortName="wcButtonSubmit" project="100554" enhancement="_100554_enhancementLit" groupName="FormsSubmitSubmit" />

import { html, css, ifDefined } from 'lit';
import { customElement, property, } from 'lit/decorators.js';
import { IcaFormsSubmitSubmitBase } from './_100554_icaFormsSubmitSubmitBase';
import { propertyDataSource } from './_100554_icaLitElement';

@customElement('wc-button-submit-100554')
export class WcButtonSubmit extends IcaFormsSubmitSubmitBase {

    @propertyDataSource({ type: String, attribute: 'clicked-value' }) clickedValue: string | undefined;
    @propertyDataSource({ type: String, attribute: 'clicked-action' }) clickedAction: string | undefined;

    @property({ type: String }) name: string | undefined;
    @property({ type: String }) title: string = '';
    @property({ type: String }) icon: string | undefined;
    @property({ type: String }) text: string | undefined;
    @property({ type: Boolean }) disabled: boolean = false; // Whether the field is ready for input or disabled
    @property({ type: String }) form: string | undefined; // The form element that the button is associated with (it is the owning form).   

    render() {
        return html\`
            <button 
                name=\${ifDefined(this.name)} 
                title=\${ifDefined(this.title)} 
                ?disabled=\${this.disabled} 
                form=\${ifDefined(this.form)}
                @click=\${this.handleClick}
                >
                \${this.text || ''}
            </button>
        \`;
    }

    handleClick() {
        this.clickedAction = this.clickedValue;
    }

}
\`\`\`

* retorno esperado
<wc-button-submit-100554 text="Example">
       <button title="">
                <!--?lit$494687120$-->Example
       </button>
</wc-button-submit-100554>
`
    }
}

function systemRules2Instruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Restrições adicionais

- o HTML processado deve estar sempre dentro da tag gerada pelo componente
- Simular o HTML final com todos os parâmetros possíveis, configurados no componente pelo marcador @property
`
    }
}
