/// <mls shortName="aimActionStyleNew" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';
import { getInfoMyService } from "./_100554_aimHelper";
import { ServiceDsStyles } from "_100554_serviceDsStyles";

const myName = '_100554_aimActionStyleNew';

@customElement('aim-action-style-new-100554')
export class AimActionStyleNew extends AimActionBase {

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

        if (this.textarea) {
            (window as any)['aim-action-style-new-100554'] = this.textarea.value;
        }
        this.taskRoot = {
            mode: 'initializing',
            title: 'verify css and create',
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
        return html`
        <p> Irá verificar os tokens e criar um novo conjunto de tokens </p>
        <div>
            <label>Sugestão:</label>
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
            <textarea rows="5" placeholder="Digite aqui seu prompt" style="width:100%"></textarea>
        </div>

        <div class="buttonGroup">
          <button @click="${this.handleCancel}">Cancelar</button>
          <button @click="${this.handleAdd}">Confirmar</button>
        </div>
    `;
    }


    private getPrompt(source: string, user: string) {

        const prompt = `
            Objective: Criar um novo css em LESS.
            \n
            \n
            System:\n
            1. Use LESS to craft a new style based on the source provided below, incorporating user suggestions.
            2 .Develop an isolated LESS file, employing tokens as outlined in the model below.
            User:\n
            1. ${user}\n\n
            \n
            \n
            Expected Output Format:
            \n
            \n
            Return the newly created CSS in the LESS language, in a single block without the token listing. Code comments should be in English, but keep existing comments that serve as UI aids.\n
            \n\n${source}\n`;
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

        let user = '';
        if ((window as any)['aim-action-style-new-100554']) {
            user = (window as any)['aim-action-style-new-100554'];
            (window as any)['aim-action-style-new-100554'] = undefined;
        }

        this.addTaskAndWaitForCompletion(taskFinishResult.taskRoot, {
            mode: 'initializing',
            title: 'exec prompt',
            widget: '_100554_aimTaskExecLLM',
            agent: this.assistant,
            prompt: this.getPrompt(source, user),
            trace: [],
            nextStep: this.prepareTask3.name // danger, loop
        });
    }

    prepareTask3(taskFinishResult: ITaskFinish): void {

        console.info(taskFinishResult)
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
            widget: '_100554_aimTaskResultLess',
            trace: [],
            _tempResult: result,
            nextStep: this.prepareTask4.name // danger, loop
        });

        // this.requestUpdate();
    }

    prepareTask4(taskFinishResult: ITaskFinish): void {

        console.info(taskFinishResult)

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
            agent: this.assistant,
            prompt: this.getPrompt(source, taskFinishResult.newPrompt),
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


