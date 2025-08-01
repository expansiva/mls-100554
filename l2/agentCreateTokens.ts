/// <mls shortName="agentCreateTokens" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { preferModelType, systemTokensLessInstruction } from './_100554_aiPrompts';
import { getNextPendingStepByAgentName, getNextInProgressStepByAgentName, updateStepStatus, getNextPendentStep } from "./_100554_aiAgentHelper";
import { startNewInteractionInAiTask, executeNextStep } from "./_100554_aiAgentOrchestration";
import { getTokens, addNewTokensTheme } from "./_100554_designSystemBase";

const agentName = "agentCreateTokens";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Responsavel por criado arquivos tipo organismo e templates",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
    }
};

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Planning";

    if (!context || !context.message) throw new Error("Invalid context");
    if (!context.task) throw new Error("Invalid task");

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    context = await updateStepStatus(context, step.stepId, "in_progress");
    const inputs = await getPrompts(step.prompt, step.rags);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");
    await updateTokensProject(context);
    await executeNextStep(context);
}

async function updateTokensProject(context: mls.msg.ExecutionContext) {
    if (!context || !context.task) throw new Error(`[${agentName}] Not found context on updateTokensProject`);
    const step = getNextPendentStep(context.task) as any;

    if (!step || step.type !== 'flexible') throw new Error(`[${agentName}] Invalid next pendent step on updateTokensProject`);
    if (!step.content) throw new Error(`[${agentName}] Not found "content" in flexible result`);
    console.info({ tokens: step.content });
    const actualProject = mls.actualProject;
    if (!actualProject) throw new Error('No Project selected');

    const tokens = step.content;
    if (!('themeName' in tokens) ||
        !('description' in tokens) ||
        !('color' in tokens) ||
        !('typography' in tokens) ||
        !('global' in tokens) ||
        typeof tokens.themeName !== 'string' ||
        typeof tokens.description !== 'string' ||
        typeof tokens.color !== 'object' ||
        typeof tokens.global !== 'object' ||
        typeof tokens.typography !== 'object'
    ) {
        throw new Error('Tokens response is invalid');
    }
    await addNewTokensTheme(actualProject, step.content);
}

async function getPrompts(prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
    if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
    const prompts: mls.msg.IAMessageInputType[] = [];
    prompts.push(systemMainInstruction());
    prompts.push(await systemTokens())
    prompts.push(outputFormat());

    prompts.push({
        type: 'human',
        content: `## Definições do usuário: \n\n ${prompt}`
    });

    return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `${preferModelType("code")}
Você é responsável por criar conjuntos de tokens.

Com base em conjunto de tokens existente que segue um determinado padrão. Gerar um novo conjunto de tokens baseado nesse modelo, seguindo as definições do usuário.
Analisar o objetivo do site, o tipo do site, e as definições em stylePreferences, para determinar qual o melhor conjunto de tokens.

O novo conjunto de tokens deve manter a estrutura, formato e regras dos tokens originais.

`
    }
}

async function systemTokens(): Promise<mls.msg.IAMessageInputType> {
    const actualProject = mls.actualProject || 100554;
    const tokens = await getTokens(actualProject);
    const tokensModel = tokens[0];
    return {
        type: 'system',
        content: `
Aqui está o modelo de tokens existentes:
${JSON.stringify(tokensModel)}
`
    }

}

function outputFormat(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `
## Formato de saida
Você deve retornar um objetos no formato JSON. **no seguinte formato**:
- Para cada componente, gerar um objeto no array content
- Manter o tagName o mesmo valor do name
\`\`\` json
{
    "type": "flexible",
    "content": {"themeName":"...","color":{}, "global":{}, "typography":{} }
  },
 }
\`\`\`

`}
}
