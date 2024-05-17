/// <mls shortName="aimActionAddIca" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';
import { getInfoMyService } from "./_100554_aimHelper";
import { getFormComponentsPrompt, getAttributeDefinitions } from './_100554_icaBaseDescription';
import { initIcaSelectGroup, IcaSelectGroup } from './_100554_icaSelectGroup';
import { ServiceSource100554 } from './_100554_serviceSource';

const myName = '_100554_aimActionAddIca';

/// **collab_i18n_start**
const message_pt = {
    prompt_ts_title_1: "Usando Typescript e Lit 3.O. Criar o render de um webcomponent, usando o source fornecido abaixo.",
    prompt_ts_output_1: "Um component Lit com sua implementação de renderização completa, seguindo todas as especificações do usuario e utilizando as propriedades fornecidas.",
    prompt_ts_output_2: "Não remover a primeira linha /// <mls",
    prompt_ts_output_3: "Nao alterar definição da classe",
    prompt_ts_output_4: "Nao alterar extends da classe",
    prompt_ts_output_5: "Não alterar imports",
    prompt_ts_output_6: "Nao altere as propriedades iniciais",
    prompt_ts_output_7: "Não implementar nenhum styles css.",
    prompt_ts_output_8: "As funções não implementadas devem ser declaradas com um corpo vazio, e dentro da função deve adicionar um comentários // **implement_here**' e comentários sobre o que o método deve fazer. Segue exemplo:",
    prompt_ts_output_9: "Retornar o código em um único bloco  \`\`\`typescript.",

    prompt_html_title: "Usando Typescript e Lit 3.O analisar o source do web component abaixo e gerar um html de use cases. Não é necessario declarar as tags html, body, head. Somente uma seção com o use cases.",
    prompt_html_output: "Remover os comentários nas funções quando implementadas.",

    prompt_fc_title_1: "Usando Typescript e Lit 3.O. Criar a função especificada pelo usuario, utilizando o source abaixo",
    prompt_fc_output_1: "O component Lit com a implementação da função completa e alterações solicitadas, seguindo todas as especificações do usuario.",
    prompt_fc_output_2: "Remover os comentários nas funções quando implementadas.",

    template_title: "Irá verificar o grupo selecionado e criar um novo componente Lit",
    textarea_placelholder: "Entre com o prompt aqui",
    btn_cancel: "Cancelar",
    btn_confirm: "Confirmar",
    error_prompt: "Por favor, ajuste o prompt para suas necessidades",
}

const message_en = {
    prompt_ts_title_1: "Using Typescript and Lit 3.0. Create the rendering of a web component, using the provided source below.",
    prompt_ts_output_1: "A Lit component with its complete rendering implementation, following all user specifications and using the provided properties.",
    prompt_ts_output_2: "Do not remove the first line /// <mls",
    prompt_ts_output_3: "Do not change the class definition",
    prompt_ts_output_4: "Do not change the class extends",
    prompt_ts_output_5: "Do not change imports",
    prompt_ts_output_6: "Do not change initial properties",
    prompt_ts_output_7: "Do not implement any CSS styles.",
    prompt_ts_output_8: "Unimplemented functions should be declared with an empty body, and within the function add a comment // implement_here' and comments about what the method should do. Example follows:",
    prompt_ts_output_9: "Return the code in a single block ```typescript.",

    prompt_html_title: "Using Typescript and Lit 3.0, analyze the source of the web component below and generate an HTML of use cases. It is not necessary to declare the html, body, head tags. Only one section with the use cases.",
    prompt_html_output: "Remove comments in functions when implemented.",

    prompt_fc_title_1: "Using Typescript and Lit 3.0. Create the function specified by the user, using the source below",
    prompt_fc_output_1: "The Lit component with the complete function implementation and requested changes, following all user specifications.",
    prompt_fc_output_2: "Remove comments in functions when implemented.",

    template_title: "Will check the selected group and create a new Lit component",
    textarea_placelholder: "Enter your prompt here",
    btn_cancel: "Cancel",
    btn_confirm: "Confirm",
    error_prompt: "Please adjust the prompt to your needs"
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en-us': message_en,
    'pt-br': message_pt
}
/// **collab_i18n_end**

@customElement('aim-action-add-ica-100554')
export class AimActionAddIca extends AimActionBase {

    private msg: MessageType = messages['en-us'];

    constructor() {
        super();
        initIcaSelectGroup();
    }

    public getRules(): AimActionRules {
        return {
            levels: [2],
            tags: ["*serviceSource*"]
        }
    }

    public assistant = "gpt3_typescript";

    public title = "New Component";

    @query('textarea') textarea: HTMLTextAreaElement | undefined;
    @query('ica-select-group-100554') selectGroup: IcaSelectGroup | undefined;

    @property({ type: Boolean }) showPrompt: boolean = false;
    @property({ type: String }) actualSuggest: string = '';
    @property({ type: String }) validPrompt: boolean = true;
    @property({ type: Array }) actualAttributes: string[] = [];

    actualGroups: string[] = [];
    language = 'english';

    private taskRoot: cbe.ITaskRoot | undefined;

    private handleCancel() {
        this.clear();
        this.selectGroup?.clear();
        this.dispatchEvent(new CustomEvent('add-task', {
            detail: { cancel: 'true' }, bubbles: true, composed: true
        }));
    }

    private handleAdd(): void {

        this.validPrompt = true;

        let txtAreaValue: string = '';
        if (!this.textarea) return;

        txtAreaValue = this.textarea.value;

        if (txtAreaValue.trim() === this.actualSuggest.trim()) {
            this.validPrompt = false;
            this.requestUpdate();
            return;
        }

        const args: IArgsAddIca = {
            prompt: this.textarea.value,
            group: this.actualGroups,
            attr: this.actualAttributes,
        }

        this.taskRoot = {
            mode: 'initializing',
            title: 'verify group and create new component',
            widget: myName,
            children: [],
            args: JSON.stringify(args),
            trace: [new Date().toISOString() + ': trask created at ']
        }
        tasks.unshift(this.taskRoot);

        //this.prepareTask1(this.taskRoot);
        this.prepareCheckTask1(this.taskRoot);
        this.dispatchEvent(new CustomEvent('finished-add-task-root', {
            detail: this.taskRoot, bubbles: true, composed: true
        }));

    }

    private onGroupChanged(e: CustomEvent) {
        const groups: string[] = e.detail.selection;
        if (groups.length === 3) {
            const [root, subgroup, finalgroup] = groups;
            this.showPrompt = true;
            this.actualSuggest = getFormComponentsPrompt(root, subgroup, finalgroup);
            this.actualAttributes = getAttributeDefinitions(root, subgroup, finalgroup);
            this.actualGroups = groups;
        } else {
            this.clear();
        }
    }

    private clear() {
        this.showPrompt = false;
        this.actualSuggest = ''
        this.actualAttributes = [];
        this.actualGroups = [];
    }

    renderAdd(): TemplateResult { // from abstract

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <p> ${this.msg.template_title}</p>
        <ica-select-group-100554 @selection-changed=${this.onGroupChanged} ></ica-select-group-100554>

        ${this.showPrompt
                ? html` 
            <div>
                <label><b>Prompt:</b></label>
                <textarea .value=${this.actualSuggest} rows="5" placeholder=${this.msg.textarea_placelholder} style="width:100%"></textarea>
            </div>

        `
                : ''}
        <div class="buttonGroup">
            <button @click="${this.handleCancel}">${this.msg.btn_cancel}</button>
            ${this.showPrompt ? html`<button @click="${this.handleAdd}">${this.msg.btn_confirm}</button>` : ''}
        </div>
        ${!this.validPrompt ? html`<div style="color:red;"> ${this.msg.error_prompt}</div>` : ''}

            `;
    }

    prepareCheckTask1(taskRoot: cbe.ITaskRoot): void {

        this.mode = taskRoot.mode = 'in progress';
        if (!taskRoot.args) {
            this.mode = taskRoot.mode = 'error';
            taskRoot.trace.push('invalid taskroot args');
            return;
        }
        const args: IArgsAddIca = JSON.parse(taskRoot.args);

        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: 'verify prompt',
            widget: '_100554_aimTaskExecLLM',
            agent: this.assistant,
            ref: 'testeRef',
            prompt: this.getPromptCheckPrompt(args.prompt),
            trace: [],
            nextStep: this.prepareCheckTask2.name // danger, loop
        });

        this.requestUpdate();
    }

    prepareCheckTask2(taskFinishResult: ITaskFinish): void {

        const child = taskFinishResult.taskChild;
        const result: string = child.result || '';
        if (taskFinishResult.status === 'error' || !result) {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            return;
        }

        child.mode = 'processed';
        this.addTaskAndWaitForCompletion(taskFinishResult.taskRoot, {
            mode: 'initializing',
            title: 'improve prompt',
            widget: '_100554_aimTaskResultAddIcaPrompt',
            result: child.result,
            trace: [],
            nextStep: this.prepareTask1.name // danger, loop
        });
        this.requestUpdate();

    }

    prepareTask1(taskFinishResult: ITaskFinish): void {

        const child = taskFinishResult.taskChild;
        if (taskFinishResult.status === 'error') {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            return;
        }

        if (!taskFinishResult.taskRoot.args) {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            child.trace.push('invalid taskroot args');
            return;
        }
        const args: IArgsAddIca = JSON.parse(taskFinishResult.taskRoot.args);

        if (taskFinishResult.status === 'userEvent' && taskFinishResult.newPrompt) {
            args.prompt = taskFinishResult.newPrompt;
        }

        child.mode = 'processed';
        this.addTaskAndWaitForCompletion(taskFinishResult.taskRoot, {
            mode: 'initializing',
            title: 'prepare source',
            widget: '_100554_aimTaskPrepareIcaSource',
            prompt: JSON.stringify(args),
            trace: [],
            nextStep: this.prepareTask2.name  // danger, loop
        });
    }


    prepareTask2(taskFinishResult: ITaskFinish): void {

        const child = taskFinishResult.taskChild;
        if (taskFinishResult.status === 'error') {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            return;
        }
        const source = taskFinishResult.result;
        if (!source) {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            child.trace.push('invalid finish , must be notify finish with result field');
            this.requestUpdate();
            return;
        }

        if (!taskFinishResult.taskRoot.args) {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            child.trace.push('invalid taskroot args');
            return;
        }
        const args: IArgsAddIca = JSON.parse(taskFinishResult.taskRoot.args);
        child.mode = 'processed';

        this.addTaskAndWaitForCompletion(taskFinishResult.taskRoot, {
            mode: 'initializing',
            title: 'exec prompt',
            widget: '_100554_aimTaskExecLLM',
            ref: child.ref,
            agent: this.assistant,
            prompt: this.getPrompt(source, args.prompt),
            trace: [],
            nextStep: this.prepareTask3.name // danger, loop
        });

        this.requestUpdate();

    }

    prepareTask3(taskFinishResult: ITaskFinish): void {

        const child = taskFinishResult.taskChild;
        const result: string = child.result || '';
        if (taskFinishResult.status === 'error' || !result) {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            return;
        }

        child.mode = 'processed';
        this.addTaskAndWaitForCompletion(taskFinishResult.taskRoot, {
            mode: 'initializing',
            title: 'result',
            widget: '_100554_aimTaskResultAddIca',
            ref: child.ref,
            trace: [],
            result: result,
            nextStep: this.prepareTask4.name // danger, loop
        });
        this.requestUpdate();
    }

    prepareTask4(taskFinishResult: ITaskFinish) {

        const child = taskFinishResult.taskChild;
        if (taskFinishResult.status === "ok" || taskFinishResult.status === "error" || taskFinishResult.status === "rejected") {
            return this.endTasks(taskFinishResult);
        }
        if (taskFinishResult.status !== "userEvent") throw new Error('Event not prepared');
        if (taskFinishResult.taskRoot.children.length > 20) throw new Error('Maximum task exceted');
        if (!taskFinishResult.newPrompt) throw new Error('Prompt invalid');

        const source = taskFinishResult.result;
        if (!source) {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            child.trace.push('invalid finish , must be notify finish with result field');
            this.requestUpdate();
            return;
        }

        if (taskFinishResult.newPrompt === '[html]') {
            child.mode = 'processed';
            this.addTaskAndWaitForCompletion(taskFinishResult.taskRoot, {
                mode: 'initializing',
                title: 'exec prompt',
                widget: '_100554_aimTaskExecLLM',
                ref: child.ref,
                agent: this.assistant,
                prompt: this.getPromptHTML(source),
                trace: [],
                result: source,
                nextStep: this.endTasks.name // looping exec prompt
            });
            return;
        }

        child.mode = 'processed';
        this.addTaskAndWaitForCompletion(taskFinishResult.taskRoot, {
            mode: 'initializing',
            title: 'exec prompt',
            widget: '_100554_aimTaskExecLLM',
            ref: child.ref,
            agent: this.assistant,
            prompt: this.getPrompt2(source, taskFinishResult.newPrompt as string),
            trace: [],
            nextStep: this.prepareTask3.name // looping exec prompt
        });

    }

    endTasks(taskFinishResult: ITaskFinish): void {
        const { taskChild, taskRoot, status, result } = taskFinishResult;
        if (status === 'error') taskChild.mode = 'error';
        else if (status === 'rejected') taskChild.mode = 'processed';
        else if (status === 'ok') {
            taskChild.mode = 'processed';
            if (taskChild.widget === '_100554_aimTaskExecLLM') {
                const res = taskRoot.children.filter((ch) => ch.widget === '_100554_aimTaskResultAddIca');
                const lastRes = res.pop();
                const result = lastRes ? lastRes.result : '';
                if (!result) return;
                this.setResultInEditor(this.extractTS(result), this.extractHTML(taskChild.result || ''));
            } else this.setResultInEditor(result);
        }

        this.mode = taskFinishResult.taskRoot.mode = taskChild.mode;
        this.requestUpdate();
        updateTaskOnServer(taskFinishResult.taskIndex);
    }

    private setResultInEditor(value: string, valueHTML?: string) {

        const activeOpService = getActiveOpServiceIfIsValid(this) as ServiceSource100554;
        if (!activeOpService) {
            window.collabMessages.add('The service in the opposite position does not refer to this action', 'error')
            return false;
        };

        if (value) activeOpService.setEditorValue(value.trim());
        if (valueHTML) activeOpService.setEditorHTMLValue(valueHTML.trim());
        return true;
    }

    private extractHTML(src: string) {
        const regex = /```html([\s\S]+?)```/g;
        const matches = src.match(regex);
        const contents = [];
        let ret = src;
        if (matches) {
            for (const m of matches) {
                const conteudo = m.replace(/```html|```/g, '').trim();
                contents.push(conteudo);
            }
            ret = contents[0];
        }
        return ret;
    }

    private extractTS(src: string) {
        const regex = /```typescript([\s\S]+?)```/g;
        const matches = src.match(regex);
        const contents = [];
        let ret = src;
        if (matches) {
            for (const m of matches) {
                const conteudo = m.replace(/```typescript|```/g, '').trim();
                contents.push(conteudo);
            }
            ret = contents[0];
        }
        return ret;
    }

    private getPrompt(source: string, user: string) {

        const promptInitial = `
### system ###: 

${this.msg.prompt_ts_title_1}
-Saida esperada: 
1. ${this.msg.prompt_ts_output_1}
2. ${this.msg.prompt_ts_output_2}
3. ${this.msg.prompt_ts_output_3}
4. ${this.msg.prompt_ts_output_4}
5. ${this.msg.prompt_ts_output_5}
6. ${this.msg.prompt_ts_output_6}
7. ${this.msg.prompt_ts_output_7}
8. ${this.msg.prompt_ts_output_8}
minhaFunçao(){
    // **implement_here**
}

9. ${this.msg.prompt_ts_output_9}

### user ###:

${user}

-Source: ${source}
`
        return promptInitial;
    }

    private getPrompt2(source: string, user: string) {

        const promptInitial = `
### system ###: 
${this.msg.prompt_fc_title_1}

-Saida esperada: 
1. ${this.msg.prompt_fc_output_1}
2. ${this.msg.prompt_ts_output_2}
3. ${this.msg.prompt_ts_output_3}
4. ${this.msg.prompt_ts_output_4}
5. ${this.msg.prompt_ts_output_5}
6. ${this.msg.prompt_ts_output_6}
7. ${this.msg.prompt_ts_output_7}
9. ${this.msg.prompt_ts_output_9}
10. ${this.msg.prompt_fc_output_2}

### user ###:
${user}

-Source: ${source}
`
        return promptInitial;
    }

    private getPromptHTML(source: string) {
        const prompt = `
### system ###: 
${this.msg.prompt_html_title}

-Saida esperada: 
${this.msg.prompt_html_output}

-Source: ${source}
 .`
        return prompt;
    }

    private getPromptCheckPrompt(promptUser: string) {
        const prompt = `
        ### system ### 
Analise o prompt do usuário e retorne:

- 'sim' se o prompt estiver dentro do contexto, e for suficiente para a próxima etapa.
- 'não' se o prompt for para qualquer outra coisa que não for a geração de um web component.
- 'forneça mais informações' se o prompt estiver dentro do contexto e precisar de mais informações importantes neste primeiro passo.

contexto: Todos os web components devem ser desenvolvidos utilizando TypeScript e Lit 3. Os componentes serão usados em navegadores modernos, e nesta etapa focaremos apenas no corpo principal do TypeScript, sem CSS.

condição especial: Após retornar 'forneça mais informações', gere uma lista de 1 a 3 itens das informações necessárias para o contexto.

Ao adotar esta descrição de contexto, qualquer usuário que interaja com o sistema já estará ciente de que o desenvolvimento deve ser feito usando TypeScript e Lit 3, e poderá se concentrar em especificar outros aspectos do web component que está sendo proposto. Isso simplifica a interação do usuário com o sistema e permite um foco maior nos detalhes funcionais e técnicos específicos de cada componente.
Não retorne explicações ou comentários , somente 'sim' ou 'não' ou 'forneça mais informações' (com uma lista complementar) 

### user ###
${promptUser}
 `
        return prompt;
    }

}

export function isValidRef(taskRoot: cbe.ITaskRoot, activeOpService: ServiceSource100554) {
    const actualRef = activeOpService.getActualRef();
    const taskWithRef = taskRoot.children.find((task) => task.widget === "aimTaskPrepareIcaSource");
    if (!taskWithRef) return false;
    return taskWithRef.ref === actualRef;
}

export function getActiveOpServiceIfIsValid(el: HTMLElement) {
    const info = getInfoMyService(el);
    if (!info) return undefined;
    const activeServiceOp: ServiceSource100554 = info.actServiceOp;
    if (activeServiceOp.tagName !== 'SERVICE-SOURCE-100554') return undefined;
    return activeServiceOp;
}

export interface IArgsAddIca {
    prompt: string,
    group: string[],
    attr: string[],
}
