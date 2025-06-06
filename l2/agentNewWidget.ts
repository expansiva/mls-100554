/// <mls shortName="agentNewWidget" project="100554" enhancement="_blank" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { forceServiceInstance } from './_100554_libCommom';
import { convertFileNameToTag } from './_100554_utilsLit';
import { createNewFile } from "./_100554_pluginNewFileBase";
import { descriptionForPrompt } from "./_100554_icaBaseDescription";
import { preferModelType, systemComponentsInstruction, systemTokensLessInstruction } from './_100554_aiPrompts';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    getNextPendentStep,
    updateTaskTitle
} from "./_100554_aiAgentHelper";

import {
    executeNextStep,
    startNewInteractionInAiTask,
    addNewStep
} from "./_100554_aiAgentOrchestration";

const agentName = "agentNewWidget";
const project = 100554;
const enhancement = '_100554_enhancementLit';

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Responsável pela criação de um novo web componente (widget) para o sistema Collab Codes.",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async replayForSupport(context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> {
            return _replayForSupport(payload); 
        },
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Creating.";

    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        throw new Error('[_beforePrompt]This agent cannot be started first: agentNewWidget')
    } else {

        const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }

        context.task = await updateStepStatus(context.task, step.stepId, "in_progress");

        if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);
        const data = JSON.parse(step.prompt);
        if (!('json' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing json and prompt`);
        
        const inputs = await getPrompts(data.json, data.prompt, step.rags);

        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);

    context.task = await updateStepStatus(context.task, step.stepId, "completed");
    await addFile(context);

    //await executeNextStep(context);
}


const _replayForSupport = async (payload: mls.msg.AIPayload[]): Promise<void> => {

    const step = payload[0] as mls.msg.AIPayload;
    if (!step || step.type !== 'flexible') throw new Error('Invalid step in create files');

    const content = (step as any).content ? (step as any).content : step.result;

    if (!content || !content.html || !content.ts || !content.less || !content.shortName) throw new Error('Not found "html" or "ts" or "less" or "shortName" in addFile files');

    await createNewFiles(content);


}

async function addFile(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error('Not found context to create files');
    const step = getNextPendentStep(context.task);

    if (!step || step.type !== 'flexible') throw new Error('Invalid step in create files');

    const content = (step as any).content ? (step as any).content : step.result;

    if (!content || !content.html || !content.ts || !content.less || !content.shortName) throw new Error('Not found "html" or "ts" or "less" or "shortName" in addFile files');

    await createNewFiles(content);

    const rc = { shortName: content.shortName, project }

    const newStep: mls.msg.AIPayload = {
        agentName: 'agentGenerateWidgetShowcase',
        prompt: JSON.stringify(rc),
        status: 'pending',
        stepId: step.stepId + 1,
        interaction: null,
        nextSteps: null,
        rags: null,
        type: 'agent'
    }

    await addNewStep(context, step.stepId, [newStep]);

    let aux = '';
    const m = mls.editor.getModels(project, content.pageName);
    if (m && m.ts && m.ts.compilerResults && m.ts.compilerResults.errors.length > 0) {
        aux = ', com ' + m.ts.compilerResults.errors.length + ' erros, favor verificar'

    }

    context.task = await updateTaskTitle(context.task, "Widget created " + content.pageName + aux);

}

async function createNewFiles(content:{shortName:string, html:string, ts:string, less:string}) {
    await forceServiceInstance(2, '_100554_serviceSource')

    const pageName = content.shortName;
    const fileHTML = content.html;
    const fileTS = content.ts;
    const fileLess = content.less;

    await createNewFile(
        { project, position: 'right', shortName: pageName, enhancement, sourceTS: fileTS, sourceHTML: fileHTML, sourceLess: fileLess, openPreview: false }
    );
}

export async function getPrompts(obj: any[], prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
    if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
    const prompts: mls.msg.IAMessageInputType[] = [];

    prompts.push(systemMainInstruction());
    prompts.push(systemRulesInstruction());
    prompts.push(systemObsInstruction());
    prompts.push(systemDefinitionsInstruction());
    prompts.push(systemProcessInstruction());
    prompts.push(systemOutInstruction());
    prompts.push(systemModelInstruction());
    prompts.push(systemRequirementsUserInstruction(obj));
    prompts.push(systemDefinitionMD(obj));
    prompts.push(await systemDefinitionBaseInstruction(obj));
    prompts.push(await systemTokensLessInstruction());

    prompts.push({
        type: 'human',
        content: prompt
    });
    return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
    //code
    return {
        type: 'system',
        content: `${preferModelType("code")}
Você é um programador responsável pela criação de um novo web componente (widget) para o sistema Collab Codes.

Se não for possível cumprir esta tarefa (por falta de dados ou conflito de requisitos), **retorne um objeto JSON** do tipo "result", com uma descrição do problema.

Se for possível cumprir esta tarefa, **retorne um objeto JSON** do tipo "flexible", contendo o typescript gerado, o html gerado e o less gerado.
`
    }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Requirements do Collab Codes:
1. Para o retorno do .ts
1.1. Utilize **TypeScript fortemente tipado**.
1.2 Não use comentários dentro do render, isto dá problemas de compilação.
1.3. Utilize **Lit 3**, siga o modelo para análise dos imports.
1.4. **Não estenda diretamente** "LitElement"; existem classes especializadas já definidas para cada tipo de widget.
1.5. **Padrões de nomeação**:
- "camelCase" para propriedades.
- "PascalCase" para nomes de componentes/classes.
1.6. Use sempre os atributos padrões da classe base, nunca crie novos atributos, trabalhe com os atributos da classe base.
1.6.1 Deve-se obrigatoriamente declarar todos os campos definidos na classe base, com os mesmos nomes e tipos. Isso é necessário para garantir consistência e evitar erros de execução.
1.6.2 O componente nunca deve renderizar um <ica-...> dentro dele mesmo.
1.6.3 Caso o componente base tenha um atributo config, o mesmo deve ser usado, seguindo os parametros da interface, nunca crie atributos novos, a mesma pode ser importada para a tipagem. Isso é necessário para garantir consistência e evitar erros de execução.
1.6.4 Nunca altere a interface do config, adicionando novos atributos. Isso é necessário para garantir consistência e evitar erros de execução.
1.6.5 Nunca gere o atributo "class", "style" ou "id".
1.6.6 Se utilizar o config, e o atributo do mesmo poder ser "undefined" deve ser feito uma verificação antes.
1.6.7 Caso crie um get de algum atributo, sempre crie com "__" dois underlines, exemplo criar um get do atributo config seria: "__config"
1.7. Deixe a linha 1 , tripleSlash, igual no modelo, isto irá ser importante para saber o nome do arquivo e outros detalhes.
1.7.1 Coloque uma quebra de linha entre o tripleSlash e o codigo, conforme o modelo.
1.8 Não use o CSS, usaremos o .less em um arquivo separado.
1.9 Caso tenha textos fixos deve se usar a parte do bloco collab_i18n
2. Para o retorno do .less
2.1 Inclua o código LESS, onde o primeiro nível é a tag HTML do componente.
2.2 Utilize apenas os tokens passados na sessão "LESS TOKENS - DESIGN SYSTEM", não adicione novos tokens. Isso é necessário para garantir consistência e evitar erros de execução.
3. Para o retorno do .html
3.1 use o html para demonstrar o componente criado, procure demonstrar pontos fortes e restrições, inicie o html com a tag div, não inclua javascript, inclua estilos para uma apresentação melhor.
4. Para todos os retornos(.ts, .less e .html)
4.1 Retorne os conteúdos sem qualquer indentação (sem espaços ou tabulações no início das linhas), mantendo apenas as quebras de linha.
5. Analise cuidadosamente as seções fornecidas abaixo:
- "Modelo Widget"
- "Requirements editáveis pelo usuário"
- "Definições dos Atributos"
- "Definições da Classe Base"
- "Formato de saida"
- "LESS TOKENS - DESIGN SYSTEM"
`
    }
}


function systemObsInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## ATENÇÃO
### ATENÇÃO — Uso da função repeat com tipagem correta no Lit
1. Importações obrigatórias:
    O import deve ser feito diretamente de 'lit', assim:
    import { html, LitElement, repeat, TemplateResult } from 'lit';

2. Uso correto da função repeat:
    Correto:
        \${repeat(
            this.history,
            ((item: mls.stor.IFileInfo) => item.shortName) as () => string,
            ((file: mls.stor.IFileInfo, index: any) => this.renderLiItem(file, index, true)) as () => TemplateResult<1>
        )}

    Errado (sem tipagem):
        \${repeat(
            this.history,
            (item: mls.stor.IFileInfo) => item.shortName,
            (file: mls.stor.IFileInfo, index: any) => this.renderLiItem(file, index, true)
        )}

    Importante:
    A tipagem explícita com as () => string e as () => TemplateResult<1> é necessária para que o TypeScript reconheça corretamente os tipos esperados e evite erros de compilação.

3. É PROIBIDO criar função com o nome "renderOptions()", essa é uma função reservada.

4. Qualquer propriedade ou variavel com a tipagem que pode ser "undefined" ou "null" deve ser verificada antes de usar-la. Isso é necessário para garantir consistência e evitar erros de execução.
`
    }
}

function systemDefinitionsInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Definições de Propriedades (Collab Codes):
A classe base utilizada no sistema Collab Codes define três tipos principais de propriedades:

- @property: Padrão do Lit para propriedades estáticas. Mas vamos evitar usar.
- @propertyDataSource: Propriedade ligada a um único state dinâmico. Exemplo de binding: "{{page1.name}}".
- @propertyCompositeDataSource: Propriedade composta por múltiplos states dinâmicos. Exemplo: "Olá {{page1.userId}} - {{page1.userName}}".
- para atributos na classe 'Text', use '@propertyCompositeDataSource'.
- para atributos na classe 'Bind', use '@propertyDataSource'.
- para atributos na classe 'Cfg', use '@propertyDataSource'.

- a propriedade autofocus deve ser definida conforme lit "@propertyDataSource({{ type: Boolean }}) autofocus: boolean = false;"
- a propriedade name deve ser definida conforme lit "@propertyCompositeDataSource({{ type: String }}) name: string | undefined;"

- Caso criar um attributes A11y (optional): role, ariaLabel, ariaDescribedBy, ariaExpanded, ariaSelected ect. O mesmo deve ser definido da seguinte forma ex: "@propertyDataSource({{ type: String }}) ariaLabel: string = '';"

- Todo atributo aria é string e não string | undefined, sempre iniciar com '';

**Importante**: Use corretamente a anotação conforme o tipo da propriedade analisada.
Para cada propriedade criada, use um JSDoc com exemplo.
Para a classe , use um JSDoc com o resumo das funcionalidades do componente.
`
    }
}

function systemProcessInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Processo de Execução (Modelo Agentic)

Você opera em um ciclo de agente iterativo (agent loop) focado na conclusão da tarefa:

1. **Analisar o Contexto:** Revise todas as informações fornecidas, principalmente o "Modelo Widget", os "Requirements editáveis pelo usuário" e as "Definições da Classe Base".
2. **Planejar a Geração:** Decida a estrutura geral do widget com base no contexto atual, incluindo ".ts", ".html" e ".less".
3. **Gerar o Código:** Produza o código:
   - ".ts": conforme todos os requisitos TypeScript e padrões do Collab Codes.
   - ".html": representando visualmente o widget de forma clara, usando apenas marcação e estilo.
   - ".less": usando a tag do componente como seletor de nível superior e tokens do design system.
4. **Validar o Código:** Verifique se:
   - Todos os requisitos foram seguidos.
   - A tipagem está correta.
   - A estrutura está coerente com o sistema Collab Codes.
   - A saída está no formato esperado com os três arquivos gerados.
5. **Finalizar a Tarefa:** Retorne um objeto JSON do tipo:
   - "flexible" com os três campos: "ts", "html", "less", se tudo estiver correto.
   - "result" com descrição do erro, caso algo esteja inválido ou impossível de gerar.

**Importante:**
- Execute **apenas uma etapa por vez** com atenção.
- **Valide completamente** antes de retornar a saída.
- Seja **preciso, padronizado e consistente**, 
Só finalize a tarefa quando estiver completamente de acordo com os requisitos.`
    }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Formato de saida
Você deve retornar um array de objetos no formato JSON. Cada objeto representa uma subtarefa, com **apenas um dos seguintes formatos**:
\`\`\` json
[{{
    "type": "flexible",
    "result": { html: string, ts: string, less: string, shortName:string }
  },
  {
    "type": "result",
    "result": string
  }}]
\`\`\`
`
    }
}

function systemModelInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Modelo Widget

/// <mls shortName="widgetInputNumber" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, ifDefined, css, repeat, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaFormsInputNumberBase } from './_100554_icaFormsInputNumberBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';

/// **collab_i18n_start**
const message_pt = {
    hello: 'Olá',

}

const message_en = {
    hello: 'Hello',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('widget-input-number-100554')
export class WidgetInputNumber extends IcaFormsInputNumberBase {

    private myMessage: MessageType = messages['en'];

    @propertyDataSource({ type: String }) value: number | undefined;

    @propertyCompositeDataSource({ type: String }) hint: string = '';

    @propertyDataSource({{ type: String }}) ariaLabel: string = '';

    error: string = '';

    render() {
        return html\`
        <h2>\${this.myMessage.hello}</h2>
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
        <ul>
            \${repeat(
                ['Banana', 'Cafe'],
                ((item: string) => item) as () => string,
                ((item: string) => html\`<li>\${item}</li>\`) as () => TemplateResult<1>
            )}
        </ul>
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

function systemRequirementsUserInstruction(req: any[]): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Requirements editável pelo usuário
\`\`\`json
${JSON.stringify(req, null, 2)}
\`\`\`
`
    }
}

function systemDefinitionMD(obj: any[]): mls.msg.IAMessageInputType {

    try {

        const step = obj.find((i) => i.sectionName === 'parentClass');
        if (!step) throw new Error("[systemDefinitionBaseInstruction] Not found section: parentClass");
        if (!step.widgetName) throw new Error("[systemDefinitionBaseInstruction] Not found widget in parentClass");

        const shortName = firstLowercaseLetter(step.widgetName);
        let tag = convertFileNameToTag(`_100554_${shortName}`);
        tag = extractBaseComponentName(tag);

        const content = extractComponentMarkdown(descriptionForPrompt, tag);

        return {
            type: 'system',
            content: `## DESCRIÇÃO DA CLASSE BASE \n\n ${content}`
        }


    } catch (e) {
        console.info(e);
        return {
            type: 'system',
            content: `## DESCRIÇÃO CLASSE BASE \n\n`
        };
    }

}

async function systemDefinitionBaseInstruction(obj: any[]): Promise<mls.msg.IAMessageInputType> {

    try {

        const step = obj.find((i) => i.sectionName === 'parentClass');
        if (!step) throw new Error("[systemDefinitionBaseInstruction] Not found section: parentClass");
        if (!step.widgetName) throw new Error("[systemDefinitionBaseInstruction] Not found widget in parentClass");

        const shortName = firstLowercaseLetter(step.widgetName);

        const key = mls.stor.getKeyToFiles(project, 2, shortName, "", ".ts");
        if (!mls.stor.files[key]) throw new Error('[systemDefinitionBaseInstruction] not found class base:' + shortName);

        let content = await mls.stor.files[key].getContent() as string;

        if (!content) throw new Error('[systemDefinitionBaseInstruction] not found content:' + key);

        return {
            type: 'system',
            content: `## DEFINIÇÕES DA CLASSE BASE \n\n ${content}`
        }


    } catch (e) {
        console.info(e);
        return systemComponentsInstruction();
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

function extractComponentMarkdown(md: string, componentName: string): string | null {

    const pattern = new RegExp(`(## ${componentName}\\n(?:.+\\n)*?)(?=\\n## |$)`, 'gm');
    const match = md.match(pattern);

    if (match) {
        const lines = match[0].split('##');
        return lines && lines[1] ? lines[1].trim() : '';
    }

    return '';
}

function extractBaseComponentName(input: string): string {
    const match = input.match(/^(.*?)(?:-base-\d+)?$/);
    return match ? match[1] : input;
}
