/// <mls shortName="aimActionStyleNew" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';
import { getInfoMyService } from "./_100554_aimHelper";
import { ServiceDsStyles } from "_100554_serviceDsStyles";

const myName = '_100554_aimActionStyleNew';

/// **collab_i18n_start**
const message_pt = {
    prompt_title: "Objetivo:Criar um novo CSS em LESS.",
    prompt_system_1: "Use LESS para criar um novo estilo baseado na fonte fornecida abaixo, incorporando sugestões do usuário.",
    prompt_system_2: "Desenvolva um arquivo LESS isolado, empregando tokens conforme descrito no modelo abaixo.",
    prompt_system_3: "Formato de Saída Esperado: Retorne o CSS recém-criado na linguagem LESS, em um único bloco sem a listagem de tokens. Comentários de código devem estar em inglês, mas mantenha comentários existentes que sirvam como auxiliares de UI.",

    template_title: "Irá verificar os tokens e criar um novo conjunto de tokens",
    template_suggest: "Sugestão:",
    textarea_placelholder: "Digite aqui seu prompt",
    btn_cancel: "Cancelar",
    btn_confirm: "Confirmar",

}

const message_en = {
    prompt_title: "Objective:Create a new css in LESS.",
    prompt_system_1: "Use LESS to craft a new style based on the source provided below, incorporating user suggestions.",
    prompt_system_2: "Develop an isolated LESS file, employing tokens as outlined in the model below.",
    prompt_system_3: "Expected Output Format: Return the newly created CSS in the LESS language, in a single block without the token listing. Code comments should be in English, but keep existing comments that serve as UI aids.",
    template_title: "Will check the tokens and create a new set of tokens",
    template_suggest: "Suggestion:",
    textarea_placelholder: "Type your prompt here",
    btn_cancel: "Cancel",
    btn_confirm: "Confirm"
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en-us': message_en,
    'pt-br': message_pt
}
/// **collab_i18n_end**

@customElement('aim-action-style-new-100554')
export class AimActionStyleNew extends AimActionBase {

    private msg: MessageType = messages['en-us'];

    public getRules(): AimActionRules {
        return {
            levels: [3],
            tags: ["*serviceDsStyle*"]
        }
    }

    public assistant = "gpt3_less";

    public title = "New Style";

    @query('textarea')
    textarea: HTMLTextAreaElement | undefined;

    language = 'english';

    private handleCancel() {
        this.dispatchEvent(new CustomEvent('add-task', {
            detail: { cancel: 'true' }, bubbles: true, composed: true
        }));
    }

    private taskRoot: cbe.ITaskRoot | undefined;

    private handleAdd(): void {

        this.taskRoot = {
            mode: 'initializing',
            title: 'verify css and create',
            widget: myName,
            children: [],
            args: this.textarea?.value || '',
            trace: [new Date().toISOString() + ': trask created at ']
        }
        tasks.unshift(this.taskRoot);
        this.prepareTask1(this.taskRoot);
        this.dispatchEvent(new CustomEvent('finished-add-task-root', {
            detail: this.taskRoot, bubbles: true, composed: true
        }));
    }

    private setResultInEditor(value: string, root: cbe.ITaskRoot) {

        const activeOpService = getActiveOpServiceIfIsValid(this);
        if (!activeOpService) {
            window.collabMessages.add('The service in the opposite position does not refer to this action', 'error')
            return false;
        };
        const isValid = isValidRef(root, activeOpService);
        if (!isValid) {
            window.collabMessages.add(`Invalid Ref`, 'error')
            return false;
        };
        activeOpService.setEditorSource(value);
        return true;
    }

    private onSuggestClick(e: MouseEvent) {
        if (!this.textarea) return;
        let text: string = '';
        const target = e.target as HTMLElement;
        const txtEl = target.querySelector('span');
        if (!txtEl) text = target.innerText;
        else text = txtEl.innerText;
        this.textarea.value = text;
    }

    private prompts = [
        'Adicionar uma animação de entrada',
        'Adicionar uma personalização no scrollbar, deixando mais minimalista',
    ]

    renderAdd(): TemplateResult { // from abstract

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <p> ${this.msg.template_title} </p>
        <div>
            <label>${this.msg.template_suggest}</label>
            <div class="prompt-suggestion">
                ${this.prompts.map((prompt) => html`
                    <span @click=${this.onSuggestClick}>
                        <span >${prompt}</span>
                    </span>
                `)}
            </div>
        <div>

        <div>
            <label>Prompt:</label>
            <textarea rows="5" placeholder="${this.msg.textarea_placelholder} style="width:100%"></textarea>
        </div>

        <div class="buttonGroup">
          <button @click="${this.handleCancel}">${this.msg.btn_cancel}</button>
          <button @click="${this.handleAdd}">${this.msg.btn_confirm}</button>
        </div>
    `;
    }


    private getPrompt(source: string, user: string) {

        const prompt = `
${this.msg.prompt_title}

System:
1. ${this.msg.prompt_system_1}
2  ${this.msg.prompt_system_2}

User:
1. ${user}

${this.msg.prompt_system_3}
        
${source}`;

        return prompt;
    }


    prepareTask1(taskRoot: cbe.ITaskRoot): void {

        // create task to get typescript source from another side
        this.mode = taskRoot.mode = 'in progress';
        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: 'get less source',
            widget: '_100554_aimTaskDsStyles',
            trace: [],
            nextStep: this.prepareTask2.name // danger, loop
        });

    }

    prepareTask2(taskFinishResult: ITaskFinish): void {

        // call LLM on server with prompt
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
        this.addTaskAndWaitForCompletion(taskFinishResult.taskRoot, {
            mode: 'initializing',
            title: 'exec prompt',
            widget: '_100554_aimTaskExecLLM',
            ref: child.ref,
            agent: this.assistant,
            prompt: this.getPrompt(source, taskFinishResult.taskRoot.args || ''),
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
            widget: '_100554_aimTaskResultLess',
            ref: child.ref,
            trace: [],
            _tempResult: result,
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
            this.setResultInEditor(result || '', taskRoot);
        }

        this.mode = taskFinishResult.taskRoot.mode = taskChild.mode;
        this.requestUpdate();
        updateTaskOnServer(taskFinishResult.taskIndex);
    }

}


export function isValidRef(taskRoot: cbe.ITaskRoot, activeOpService: ServiceDsStyles) {
    const actualRef = activeOpService.getActualRef();
    const taskWithRef = taskRoot.children.find((task) => task.widget === "_100554_aimTaskDsStyles");
    if (!taskWithRef) return false;
    return taskWithRef.ref === actualRef;
}

export function getActiveOpServiceIfIsValid(el: HTMLElement) {
    const info = getInfoMyService(el);
    if (!info) return undefined;
    const activeServiceOp: ServiceDsStyles = info.actServiceOp;
    if (activeServiceOp.tagName !== 'SERVICE-DS-STYLES-100554') return undefined;
    if (!activeServiceOp.isComponent) return undefined;
    return activeServiceOp;
}


