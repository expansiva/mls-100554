/// <mls shortName="agentGenerateWidgetShowcase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { preferModelType } from './_100554_aiPrompts';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    getNextPendentStep,
    updateTaskTitle
} from "./_100554_aiAgentHelper";

import {
    executeNextStep,
    startNewInteractionInAiTask
} from "./_100554_aiAgentOrchestration";

const agentName = "agentGenerateWidgetShowcase";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Especialista em frontend com foco em marketing visual e persuasivo, com a tarefa de criar uma “página” de apresentação para um Web Component fornecido.",
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
    const taskTitle = "Creating.";

    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        throw new Error('[_beforePrompt]This agent cannot be started first: agentGenerateWidgetShowcase')
    } else {

        const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);

        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }

        context.task = await updateStepStatus(context.task, step.stepId, "in_progress");

        if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

        const data = JSON.parse(step.prompt);

        if (!('shortName' in data) || !('project' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing json and prompt`);

        const inputs = await getPrompts(data.shortName, data.project);

        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);

    context.task = await updateStepStatus(context.task, step.stepId, "completed"); 
    await updateFile(context);
    await executeNextStep(context);
}

async function updateFile(context: mls.msg.ExecutionContext) {
    if (!context || !context.task) throw new Error('Not found context to create files');

    const step = getNextPendentStep(context.task) as any;

    if (!step || step.type !== 'flexible') throw new Error('Invalid step in create files');

    if (!step.content || !step.content.html) throw new Error('Not found "html"  in addFile files');

    
    const pageName = step.content.shortName;
    const project = step.content.project;
    const fileHTML = step.content.html;

    const m = mls.editor.getModels(project, pageName);
    if (m && m.html) m.html.model.setValue(fileHTML)

    let aux = '';
    if (m && m.ts && m.ts.compilerResults && m.ts.compilerResults.errors.length > 0) {
        aux = ', com '+ m.ts.compilerResults.errors.length + ' erros, favor verificar'
        
    }

    context.task = await updateTaskTitle(context.task, "Widget created" + aux);
        
}

export async function getPrompts(shortName: string, project: number): Promise<mls.msg.IAMessageInputType[]> {

    if (!shortName || !project) throw new Error("Invalid Prompt");

    const prompts: mls.msg.IAMessageInputType[] = [];

    prompts.push(systemMainInstruction());
    prompts.push(systemTaskInstruction());
    prompts.push(systemDefinitionsInstruction());
    prompts.push(systemDemoInstruction());    
    prompts.push(await systemDefinitionsBaseTSInstruction(shortName, project));
    prompts.push(systemRulesInstruction());
    prompts.push(systemOutInstruction());
    
    return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
    //executor or translate
    return {
        type: 'system',
        content: `${preferModelType("executor")}
Você é um assistente especialista em marketing técnico, design web e vendas. Sua tarefa é criar uma página HTML clara, moderna e atrativa que sirva como vitrine de demonstração (showcase) para um WebComponent personalizado.
`
    }
}

function systemTaskInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##TASK

Você receberá um arquivo ".ts" contendo a definição de um Web Component.  Sua tarefa é:

1. Analisar o conteúdo do componente fornecido.
2. Identificar sua funcionalidade principal, pontos fortes, diferenciais e caso de uso ideal.
3. Criar uma “mini landing page” de marketing e demonstração, totalmente contida em uma única "<div>" raiz.
4. No HTML , não se deve usar "<html>", "<body>" ou "<script>" externos.
5. Todo o estilo deve ser aplicado **inline (usando "style" diretamente em cada elemento)** — não utilize blocos "<style>" ou CSS externos.
`
    }
}

function systemDefinitionsInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##CARACTERISTICAS DO HTML

O bloco HTML gerado deve conter:
  
 - Demonstre o WebComponent em funcionamento real.
 - Destaque seus benefícios com textos de fácil compreensão, voltados para usuários técnicos e semi-técnicos.
 - Use boas práticas de design e copywriting de vendas, com um tom profissional, convidativo e leve (sem parecer exageradamente comercial).
 - Utilize cores modernas e uma tipografia amigável, não tão técnica.
 
- Inclua seções como:
   - Título chamativo com o nome e propósito do componente.
   - Mantenha os títulos e subtítulos todos centralizados.  
   - Descreva o webcomponente, de maneira demonstrativa, explicando brevemente seu proposito.
   - Demonstração ao vivo do WebComponent. com no mínimo 2 exemplos, esta parte tem que usar um style mais destacado e convidativo.
   - Lista de vantagens e diferenciais do componente.
   - Código de uso (snippet) para copiar/colar.
   - Explicações visuais ou textuais de como o componente pode ser integrado em projetos reais.
   - Pode incluir ícones para deixar o texto menos técnico

 - Certifique-se de que:
   - A página seja autoexplicativa, com seções bem definidas.
   - O layout seja atrativo tanto em desktop quanto mobile.
   - Os estilos não ofusquem o componente, mas valorizem sua presença.
`
    }
}

function systemDemoInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## HTML DEMONSTRATIVO

<div class="widget-showcase">
  <section class="section_title">...</section>
  <section class="section_info">...</section>
  <section class="section_demo">...</section>
  <section class="section_benefits">...</section>
  <section class="section_code">...</section>
  <section class="section_use_cases">...</section>
</div>
`
    }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Formato de saida
Você deve retornar um array de objetos no formato JSON.O objeto representa uma subtarefa, com **apenas um dos seguintes formatos**:
\`\`\` json
[{{
    "type": "flexible",
    "content": {{ shortName:string, project:number, html: string}}
  }}]
\`\`\`
`
    }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `**Regras importantes:**

- Não repita ou explique o código TypeScript.
- Apenas gere o bloco HTML dentro da "<div>", pronto para ser colado em qualquer página.
- Pressuponha que o Web Component está registrado e pode ser usado diretamente pela tag personalizada dele.

O HTML gerado deve estar pronto para ser injetado como parte de um container maior (por exemplo, dentro de uma aba de preview ou guia de documentação).
`
    }
}


//Tem q ser dinamico
async function systemDefinitionsBaseTSInstruction(shortName:string, project:number): Promise<mls.msg.IAMessageInputType> {

    shortName = firstLowercaseLetter(shortName);

    const key = mls.stor.getKeyToFiles(project, 2, shortName, "", ".ts");
    if (!mls.stor.files[key]) throw new Error("[systemDefinitionsBaseTSInstruction]Not found class base:" + project + "_" + shortName);

    let contet = await mls.stor.files[key].getContent() as string;

    if (!contet) throw new Error("[systemDefinitionsBaseTSInstruction]Not found content:" + project + "_" + shortName);
    return {
        type: 'system',
        content: `## WEBCOMPONENTE BASE

Abaixo está o conteúdo do webcomponente de referência que você deve utilizar como base:

\`\`\` typescript
${contet}
\`\`\`

`
    }
}

function firstLowercaseLetter(str: string): string {

  if (str.length === 0) return str;

  const first = str[0];
  const rest = str.slice(1);

  if (first === first.toLowerCase()) {
    return str;
  }

    return first.toLowerCase() + rest;
  
}
