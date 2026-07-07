/// <mls fileReference="_100554_/l2/agentArchitectMind.ts" enhancement="_102027_/l2/enhancementAgent"/> 


import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';
import { getAllDefs } from '/_102027_/l2/libMindMap.js';

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentArchitectMind",
        agentProject: 100554,
        agentFolder: "",
        agentDescription: "Agent architect",
        visibility: "public",
        beforePromptImplicit,
        afterPromptStep
    };
}

async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');

    const data = {
        defs: await getDefs(),
        prompt: userPrompt
    };

    const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
        type: "add-message-ai",
        request: {
            action: 'addMessageAI',
            agentName: agent.agentName,
            inputAI: [{
                type: "system",
                content: system1.replace('{{defs}}', JSON.stringify(data)),
            }, {
                type: "human",
                content: context.message.content.replace(`@@ ${agent.agentName}`, '')
                    .replace(`@@_100554_${agent.agentName}`, '')
                    .replace(`@@ _100554_${agent.agentName}`, '')
                    .replace(`@@ _100554_/l2/${agent.agentName}`, '')
                    .replace(`@@_100554_/l2/${agent.agentName}`, '')
                    .replace(`@@${agent.agentName}`, '').trim()
            }],
            taskTitle: `Searching...`,
            threadId: context.message.threadId,
            userMessage: context.message.content,
        }
    };
    return [addMessageAI];

}

async function afterPromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {

    if (!agent || !context || !step) throw new Error(`[afterPromptStep] invalid params, agent:${!!agent}, context:${!!context}, step:${!!step}`);
    const payload = (step.interaction?.payload?.[0]) as Output;

    console.info(payload.result)

    if (!payload || !payload.type) throw new Error(`Payload invalid`);
    if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)

    let status: mls.msg.AIStepStatus = 'completed';
    let intents: mls.msg.AgentIntent[] = [];

    const updateStatus: mls.msg.AgentIntentUpdateStatus = {
        type: 'update-status',
        hookSequential,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: parentStep.stepId,
        stepId: step.stepId,
        status
    };

    return [updateStatus];

}

export async function getDefs(): Promise<string> {

    const defs = await getAllDefs();
    const ret: any = {};
    Object.keys(defs).forEach((key) => {
        ret[key] = defs[key].defs.asIs;
    });

    return JSON.stringify(ret);

}


const system1 = `
<!-- modelType: nano -->

<!-- modelTypeList: geminiChat ?/10 , code (grok) ?/10, deepseekchat ?/10, codeflash (gemini) ?/10, deepseekreasoner ?/10, mini (4.1) ou nano (openai) ?/10, codeinstruct (4.1) ?/10, codereasoning(gpt5) ?/10, code2 (kimi 2.5) ?/10 -->

Você é um arquiteto de software sênior responsável por entender um grande sistema a partir de documentos estruturados de definição de arquivos ("file defs").

Cada file def descreve:
- O propósito do arquivo
- Suas responsabilidades
- Seus relacionamentos com outros arquivos
- Seu papel arquitetural dentro do sistema

Você NUNCA lê código-fonte.
Você raciocina EXCLUSIVAMENTE com base nos file defs fornecidos.

Seu trabalho é responder perguntas sobre a arquitetura do sistema, responsabilidades dos arquivos, fluxo de dados, comportamento e impacto de mudanças analisando esses file defs.

Ao responder:

1. Baseie seu raciocínio SOMENTE nos file defs fornecidos.
2. Nunca invente arquivos, comportamentos ou responsabilidades que não estejam descritos nos defs.
3. Ao identificar arquivos relevantes, explique claramente POR QUE cada arquivo é relevante com base em suas responsabilidades descritas.
4. Pense sempre em termos de arquitetura, responsabilidade e relacionamentos — não em busca de palavras-chave.
5. Se a resposta não puder ser determinada a partir dos defs, deixe isso claro.
6. Prefira raciocínio semântico (o que o arquivo faz) ao invés de correspondência textual.
7. Sempre que possível, agrupe os arquivos por papel arquitetural (UI, estado, persistência, navegação, integração, etc).
8. Seja técnico, preciso e objetivo.
9. A descrição deve ser sempre na lingua da solicitação do usuário.

Você atua como uma camada de inteligência arquitetural sobre o sistema.

## DEFS

\`\`\`json
{{defs}}
\`\`\`

## FORMATO OBRIGATÓRIO DE RESPOSTA

Você deve SEMPRE retornar exclusivamente um JSON válido, sem nenhum texto antes ou depois.

Nunca escreva explicações fora do JSON.
Nunca utilize markdown.
Nunca escreva comentários.
Nunca escreva texto adicional.

Regras obrigatórias:

- "file" deve conter exatamente o nome do arquivo conforme aparece no file def.
- "description" deve explicar tecnicamente a relação do arquivo com a pergunta do usuário.
- Retorne apenas arquivos que realmente tenham relação com a pergunta.
Se nenhum arquivo for relevante, retorne vazio: []

## Output format
You must return the object strictly as JSON
[[OutputSection]]
`

//#region OutputSection
export type Output = {
    type: "flexible";
    result: IResult[];
};

interface IResult {
    files: [
        {
            file: string, // "nome_do_arquivo",
            description: string //  "explicação técnica clara e curta do porquê este arquivo é relevante para a pergunta, baseada nas responsabilidades descritas no file def"
        }
    ]
}

//#endregion

