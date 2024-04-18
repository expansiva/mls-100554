/// <mls shortName="aimActionAddIca" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';
import { getInfoMyService } from "./_100554_aimHelper";
import { getFormComponentsPrompt, getAttributeDefinitions } from './_100554_icaBaseDescription';
import { initIcaSelectGroup, IcaSelectGroup } from './_100554_icaSelectGroup';
import { ServiceBase } from './_100554_serviceBase';
import { ServiceSource100554 } from './_100554_serviceSource';

const myName = '_100554_aimActionAddIca';
export const templateInitStr = "**completion_str**";
export const templateFinalStr = "**completion_end**";

@customElement('aim-action-add-ica-100554')
export class AimActionAddIca extends AimActionBase {

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

        (window as any)['aim-action-add-ica-user'] = txtAreaValue;

        (window as any)['aim-action-add-ica-file-info'] = {
            group: this.actualGroups,
            attr: this.actualAttributes,
        };

        this.taskRoot = {
            mode: 'initializing',
            title: 'verify group and create new component',
            widget: myName,
            children: [],
            trace: [new Date().toISOString() + ': trask created at ']
        }
        tasks.unshift(this.taskRoot);
        this.prepareTask1(this.taskRoot);
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

        return html`
        <p> ${this.messages.template_title}</p>
        <ica-select-group-100554 @selection-changed=${this.onGroupChanged} ></ica-select-group-100554>

        ${this.showPrompt
                ? html` 
            <ul>
                ${this.actualAttributes.map((attr) => {
                    return html`<li>${attr}</li>`
                })}
            </ul>
    
            <div>
                <label><b>Prompt:</b></label>
                <textarea .value=${this.actualSuggest} rows="5" placeholder=${this.messages.textarea_placelholder} style="width:100%"></textarea>
            </div>

        `
                : ''}
        <div class="buttonGroup">
            <button @click="${this.handleCancel}">${this.messages.btn_cancel}</button>
            ${this.showPrompt ? html`<button @click="${this.handleAdd}">${this.messages.btn_confirm}</button>` : ''}
        </div>
        ${!this.validPrompt ? html`<div style="color:red;"> ${this.messages.error_prompt}</div>` : ''}

            `;
    }

    private getPrompt(source: string, user: string) {

        const promptInitial = `
-System: 
Usando Typescript e Lit 3.O. Criar o render de um webcomponent, usando o source fornecido abaixo.
Do source abaixo deve ser mantido as propriedades, a declaração de imports, e a definição da classe.
Não implementar nenhum styles css.
Sempre manter a primeira linha /// <mls
Completar o source abaixo apenas entre a demarcação ${templateInitStr} e ${templateFinalStr} .

-User:
${user}

-Saida esperada: 
Um component Lit com sua implementação de renderização completa, seguindo todas as especificações do usuario e utilizando as propriedades fornecidas.

Todos as funções devem ser declaradas com um corpo vazio, porém sua implementação de lógica deve ser antecedido um comentários // **implement_here**' e comentários sobre o que o método deve fazer. Segue exemplo:
minhaFunçao(){
    **implement_here**
}

Remover os seguintes comentários : // ${templateInitStr} e // ${templateFinalStr} do resultado final .
Retornar o código em um único bloco  \`\`\`typescript.
Remover os comentários na função quando implementada.

-Source: ${source}
`

        return promptInitial;
    }

    private getPromptHTML(source: string) {
        const prompt = `
-System: 
Usando Typescript e Lit 3.O analisar o source do web component abaixo e gerar um html de use cases.
Não é necessario declarar as tags html, body, head. 
Somente uma seção com o use cases.

-Saida esperada: 
Retornar o código em um único bloco  \`\`\`html.

-Source: ${source}
 .`
        return prompt;
    }

    prepareTask1(taskRoot: cbe.ITaskRoot): void {

        let obj = {};
        if ((window as any)['aim-action-add-ica-file-info']) {
            obj = (window as any)['aim-action-add-ica-file-info'];
            (window as any)['aim-action-add-ica-file-info'] = undefined;
        }

        this.mode = taskRoot.mode = 'in progress';
        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: 'prepare source',
            widget: '_100554_aimTaskPrepareIcaSource',
            prompt: JSON.stringify(obj),
            trace: [],
            nextStep: this.prepareTask2.name // danger, loop
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
        child.mode = 'processed';

        let user = '';

        if ((window as any)['aim-action-add-ica-user']) {
            user = (window as any)['aim-action-add-ica-user'];
            (window as any)['aim-action-add-ica-user'] = undefined;
        }

        this.addTaskAndWaitForCompletion(taskFinishResult.taskRoot, {
            mode: 'initializing',
            title: 'exec prompt',
            widget: '_100554_aimTaskExecLLM',
            ref: child.ref,
            agent: this.assistant,
            prompt: this.getPrompt(source, user),
            trace: [],
            nextStep: this.prepareTask3.name // danger, loop
        });

        this.requestUpdate();

    }

    prepareTask3(taskFinishResult: ITaskFinish): void {

        // show result
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
            prompt: this.getPrompt(source, taskFinishResult.newPrompt as string),
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

        if (value) activeOpService.setEditorValue(value);
        if (valueHTML) activeOpService.setEditorHTMLValue(valueHTML);
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

    messages = {
        "prompt_ts_title_1": "Usando Typescript e Lit 3.O. Criar o render de um webcomponent, usando o source fornecido abaixo.",
        "prompt_ts_title_2": "Do source abaixo deve ser mantido as propriedades, a declaração de imports, e a definição da classe.",
        "prompt_ts_title_3": "Não implementar nenhum styles css.",
        "prompt_ts_title_4": "Sempre manter a primeira linha /// <mls",
        "prompt_ts_title_5": "Completar o source abaixo apenas entre a demarcação:",

        "prompt_ts_output_1": "Um component Lit com sua implementação de renderização completa, seguindo todas as especificações do usuario e utilizando as propriedades fornecidas.",
        "prompt_ts_output_2": "Um component Lit com sua implementação de renderização completa, seguindo todas as especificações do usuario e utilizando as propriedades fornecidas.",
        "prompt_ts_output_3": "Todos as funções devem ser declaradas com um corpo vazio, porém sua implementação de lógica deve ser antecedido um comentários // **implement_here**' e comentários sobre o que o método deve fazer. Segue exemplo:",
        "prompt_ts_output_4": "Remover os seguintes comentários do resultado final:",
        "prompt_ts_output_5": "Retornar o código em um único bloco  \`\`\`typescript",
        "prompt_ts_output_6": "Remover os comentários na função quando implementada.",


        "template_title": "Irá verificar o grupo selecionado e criar um novo componente Lit",
        "textarea_placelholder": "Entre com o prompt aqui",
        "btn_cancel": "Cancelar",
        "btn_confirm": "Confirmar",
        "error_prompt": "Por favor, ajuste o prompt para suas necessidades",



    }

}

export function isValidRef(taskRoot: cbe.ITaskRoot, activeOpService: ServiceBase) {
    const actualRef = activeOpService.getActualRef();
    const taskWithRef = taskRoot.children.find((task) => task.widget === "aimTaskPrepareIcaSource");
    if (!taskWithRef) return false;
    return taskWithRef.ref === actualRef;
}

export function getActiveOpServiceIfIsValid(el: HTMLElement) {
    const info = getInfoMyService(el);
    if (!info) return undefined;
    const activeServiceOp: ServiceBase = info.actServiceOp;
    if (activeServiceOp.tagName !== 'SERVICE-SOURCE-100554') return undefined;
    return activeServiceOp;
}
