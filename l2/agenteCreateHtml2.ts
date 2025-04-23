/// <mls shortName="agenteCreateHtml2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent } from './_100554_aiAgentBase';
import { systemComponentsInstruction } from './_100554_aiPrompts';

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

const agentName = "agenteCreateHtml2";

export function createAgent(): IAgent {
    return {
        agentName,
        agentDescription: "Transformar a estrutura conceitual da interface em um modelo técnico pronto para geração de HTML com web components e bindings de state.",
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
        const inputs = await getPrompts(JSON.stringify(step.prompt), step.rags);
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
    prompts.push(systemTaskInstruction());
    prompts.push(systemComponentsInstruction());
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
        content: `
Você é um desenvolvedor de interface. Sua tarefa é transformar a estrutura conceitual da interface em um modelo técnico pronto para geração de HTML com web components e bindings de state.
`
    }
}

function systemTaskInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##TAREFA

	1.	Mapear o web component mais adequado para cada campo ou ação, usando a lista de componentes disponíveis.
	2.	Definir os atributos principais do componente (ex: value, visible, readonly), com:
	  •	valor (texto fixo ou binding ex: {{page1.cliente.nome}})
	  •	flag computed, se o valor precisa ser calculado no .ts
	3.	Gerar um id exclusivo para cada componente com base no seu nome lógico.
`
    }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##OBSERVAÇÃO
No atributo  allowedChildren e allowedParents

- Pode encontrar itens que terminam -*, exemplo: "ica-forms-*" isso significa que o componente aceita qualquer filho que a tag comece com "ica-forms-" exemplo nesse caso aceitaria "ica-forms-submit"

- Pode ser encontrado também itens que começam com **, exemplo "**ica-forms-content-form" isso significa que o item não precisar ser filho direto do elemento, porem tem q estar debaixo desse elemento

-Pode encontrar também o item "!*", isso significa que esse componente não aceita filho nenhum
`
    }
}


function systemOutInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##EXEMPLO SAIDA
A resposta deve ser um JSON estruturado contendo as informações da interface.

{
    "type": "agent",
    "agentName": "agenteCreateHtml3",
    "taskTitle": string,
    "promptUser": string, // original do usuario,
    "rags": null,
    "prompt":{
        "pageName": string,
        "pageType": "crud" | "report" | "dashboard" | "form" | "search" | "workflow" | "config" | "association",
        "loadContext": false,    
        "modoInicial": "visualizacao",
        "fluxo": "Permite visualizar os dados inicialmente. O botão 'Editar' ativa os campos para edição. A alteração só é salva após clicar em 'Salvar'.",
        "secoes": [
            {
                "nome": "credenciais",
                "descricao": "Campos para inserção de dados de login",
                "campos": [
                    {
                        "nome": "usuario",
                        "intencao": "capturar nome de usuário ou e-mail para login",
                        "webComponent": "ica-forms-input-string",
                        "id": "campo-usuario",
                        "atributos": {
                            "value": "{page1.usuario}",
                            "required": {
                                "valor": "true",
                                "computed": false
                            },
                            "readonly": {
                                "valor": "false",
                                "computed": false
                            },
                            "placeholder": {
                                "valor": "Digite seu usuário ou e-mail",
                                "computed": false
                            }
                        }
                    },
                    {
                        "nome": "senha",
                        "intencao": "capturar senha do usuário para autenticação",
                        "webComponent": "ica-forms-input-string",
                        "id": "campo-senha",
                        "atributos": {
                            "value": "{page1.senha}",
                            "required": {
                                "valor": "true",
                                "computed": false
                            },
                            "readonly": {
                                "valor": "false",
                                "computed": false
                            },
                            "placeholder": {
                                "valor": "Digite sua senha",
                                "computed": false
                            },
                            "type": {
                                "valor": "password",
                                "computed": false
                            }
                        }
                    }
                ]
            },
            {
                "nome": "acoes",
                "descricao": "Botões de ação para login",
                "campos": [
                    {
                        "nome": "botaoEntrar",
                        "intencao": "autenticar o usuário com as credenciais fornecidas",
                        "webComponent": "ica-forms-submit-submit",
                        "id": "botao-entrar",
                        "atributos": {
                            "text": {
                                "valor": "Entrar",
                                "computed": false
                            },
                            "disabled": {
                                "valor": "false",
                                "computed": false
                            },
                            "eventBinding": {
                                "valor": "onSubmit",
                                "computed": true
                            }
                        }
                    },
                    {
                        "nome": "linkRegistrar",
                        "intencao": "direcionar o usuário para a página de registro, caso não tenha uma conta",
                        "webComponent": "ica-navigation-links-links",
                        "id": "link-registrar",
                        "atributos": {
                            "href": {
                                "valor": "/registrar",
                                "computed": false
                            },
                            "text": {
                                "valor": "Registrar-se",
                                "computed": false
                            },
                            "eventBinding": {
                                "valor": "onNavigateToRegister",
                                "computed": true
                            }
                        }
                    },
                    {
                        "nome": "linkEsqueciSenha",
                        "intencao": "permitir ao usuário solicitar a recuperação da senha, caso tenha esquecido",
                        "webComponent": "ica-navigation-links-links",
                        "id": "link-esqueci-senha",
                        "atributos": {
                            "href": {
                                "valor": "/recuperar-senha",
                                "computed": false
                            },
                            "text": {
                                "valor": "Esqueci a senha",
                                "computed": false
                            },
                            "eventBinding": {
                                "valor": "onNavigateToRecoverPassword",
                                "computed": true
                            }
                        }
                    }
                ]
            }
        ]
    }  
}        
`
    }
}