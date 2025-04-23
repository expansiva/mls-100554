/// <mls shortName="agentPlanner1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent } from './_100554_aiAgentBase';
import * as helper from "./_100554_aiAgentHelper";
import * as orc from "./_100554_aiAgentOrchestration";


const agentName = "agentPlanner1";

export function createAgent(userId:string, threadId:string): IAgent {
    return {
        agentName,
        agentDescription: "Agente de ferramentas para executar tarefas complexas com base no prompt do usuário.",
        visibility: "private",

        async beforePrompt(context: mls.msg.ExecutionContext, userId:string,threadId:string): Promise<void> {
            return _beforePrompt(context, userId, threadId);
        },

        async afterPrompt(context: mls.msg.ExecutionContext, userId:string,threadId:string): Promise<void> {
            return _afterPrompt(context, userId, threadId);
        }

    };
}


async function _beforePrompt(context: mls.msg.ExecutionContext, userId:string,threadId:string): Promise<void> {
 
    const taskTitle = "Planning";
    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        // using temporary context, create a new task
        const inputs = getPrompts(context.message.content, null);
        orc.startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, _afterPrompt);

    } else { 
        const step: mls.msg.AIAgentStep | null = helper.getNextPendingStepByAgentName(context.task, agentName);
        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }
        const args: mls.msg.RequestUpdateStepStatus = {
            action: 'updateStepStatus',
            status: "in_progress",
            taskId: context.task.PK,
            messageId: context.task.messageid_created || '',
            stepId: step.stepId,
            userId
        }

        context.task = (await mls.api.msgUpdateStepStatus(args)).task;
        //context.task = await updateStepStatus(context.task, step.stepId, "in_progress");
        const inputs = getPrompts(step.prompt, step.rags);
        orc.startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt);
    }

}

async function _afterPrompt(context: mls.msg.ExecutionContext, userId:string,threadId:string): Promise<void>{
    if (!context || !context.message || !context.task) throw new Error("Invalid context");

    const step: mls.msg.AIAgentStep | null = helper.getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    const { flexible } = helper.calculateStepsStatistics([step], true);
    if (flexible > 0) throw new Error(`[${agentName}] afterPrompt: error, Flexible step found.`);

    const args: mls.msg.RequestUpdateStepStatus = {
            action: 'updateStepStatus',
            status: "completed",
            taskId: context.task.PK,
            messageId: context.task.messageid_created || '',
            stepId: step.stepId,
            userId
        }

    context.task = (await mls.api.msgUpdateStepStatus(args)).task;
    //context.task = await updateStepStatus(context.task, step.stepId, "completed");

    await orc.executeNextStep(context, userId);
}

export function getPrompts(prompt: string | undefined, rags: string[] | null): mls.msg.IAMessageInputType[] {

    if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");

    const prompts: mls.msg.IAMessageInputType[] = [];

    prompts.push(systemMainInstruction());
    prompts.push(systemAgentsAvailable());
    prompts.push(systemRagsAvailable());
    prompts.push(systemToolsAvailable());
    //addRAGAdditionalInformation(rags, prompts); // optional
    prompts.push(systemReturnJsonFormat());
    prompts.push({
        type: 'human',
        content: prompt
    });

    return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType{
    return {
        type: 'system',
        content: `
Você é um coordenador de agentes e ferramentas para executar tarefas complexas com base no prompt do usuário.

Seu unico objetivo é analisar o prompt do usuário e decidir qual agente chamar.

1. Se faltar informações apenas para decidir o agente ou a resposta, retorne apenas uma subtarefa do tipo \`clarification\`. Sempre que possível, inclua um \`htmlForm\` com campos e opções para facilitar a resposta do usuário.
2. Se a tarefa puder ser resolvida diretamente com uma resposta, retorne uma subtarefa do tipo \`result\`.
3. Decida qual agente, ferramenta ou base de conhecimento (RAG) será executado no próximo passo.
4. Nunca retorne múltiplas subtarefas. Retorne **apenas uma subtarefa por vez** neste passo inicial.
5. Se retornar um agent, no atributo prompt, deve se repetir o prompt do usuario.
6. Lembre seu unico objetivo é identificar qual agente chamar, não elabore mais coisas
`
    }
}

function systemAgentsAvailable(): mls.msg.IAMessageInputType{
    return {
        type: 'system',
        content: `
##Agentes disponíveis:
•agentPlannerNewPage:planejamento para a criação de novas páginas no sistema, será pedido mais informações ao usuário se necessário.
•agentPlannerNewWidget:planejamento para a criação de componentes/widgets, será pedido mais informações ao usuário se necessário.
•agentPlannerNewAPI:criação de endpoints ou APIs, será pedido mais informações ao usuário se necessário.
•agentSupportExternal:suporte para usuários externos. Executar rag1 antes de enviar o prompt.
•agentSupportInternal:suporte para usuários internos. Executar os RAGs rag1 e rag2 antes de enviar o prompt."
`
    }
}

function systemRagsAvailable(): mls.msg.IAMessageInputType{
    return {
        type: 'system',
        content: ``
    }
}

function systemToolsAvailable(): mls.msg.IAMessageInputType{
    return {
        type: 'system',
        content: ``
    }
}

function systemReturnJsonFormat(): mls.msg.IAMessageInputType{
    return {
        type: 'system',
        content: `##Padrão de retorno:
Você deve retornar um array de objetos no formato JSON. Cada objeto representa uma subtarefa, com **apenas um dos seguintes formatos**:
Não altere o atributo prompt, use sempre o do usuario.
JSON:
\`\`\` json
[
  {
    "type": "agent",
    "agentName": string,
    “title": string,
    "prompt": string, // prompt original do usuario
    "rags": string[] | null
  },
  {
    "type": "tool",
    "toolName": string,
    “title": string,
    "args": string // JSON stringified
  },
  {
    "type": "clarification",
    "clarificationMessage": string,
    "htmlForm?": string // Optional HTML form shown to the user. The submitted data will be included in the prompt of the next interaction.
  },
  {
     "type": "result",
     “result”: string
  }
]
\`\`\`
`
    }
}