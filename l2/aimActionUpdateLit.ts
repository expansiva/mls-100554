/// <mls shortName="aimActionUpdateLit" project="100554" enhancement="_100554_enhancementLit" />

import { html, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer, getInfoMyService } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';

const myName = '_100554_aimActionUpdateLit';

/// **collab_i18n_start**
const message_pt = {
    title: 'Permitir atualizar o lit do file selecionado',
    prompt: 'Prompt',
    cancel: 'Cancelar',
    confirm: 'Confirmar'
}

const message_en = {
    title: 'Allow updating the lit of the selected file',
    prompt: 'Prompt',
    cancel: 'Cancel',
    confirm: 'Confirm'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en-us': message_en,
    'pt-br': message_pt
}
/// **collab_i18n_end**

@customElement('aim-action-update-lit-100554')
export class AimActionUpdateLit extends AimActionBase {

    private msg: MessageType = messages['en-us'];

    @query('textarea')
    textarea: HTMLTextAreaElement | undefined;

    public getRules(): AimActionRules {
        return {
            levels: [2],
            tags: ["*serviceSource*"]
        }
    }

    public assistant = "gpt3_typescript";
    public title = "Update Lit";

    language = 'english';

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return super.render();
    }

    private handleCancel() {
        this.dispatchEvent(new CustomEvent('add-task', {
            detail: { cancel: 'true' }, bubbles: true, composed: true
        }));
    }

    private handleAdd(): void {

        const taskRoot: cbe.ITaskRoot = {
            mode: 'initializing',
            title: 'update Lit',
            widget: myName,
            children: [],
            args: this.textarea?.value || '',
            trace: [new Date().toISOString() + ': trask created at ']
        }
        tasks.unshift(taskRoot);
        this.prepareTask1(taskRoot);
        this.dispatchEvent(new CustomEvent('finished-add-task-root', {
            detail: taskRoot, bubbles: true, composed: true
        }));
    }

    renderAdd(): TemplateResult { // from abstract

        return html`
        <p style="margin-bottom:0rem">${this.msg.title}</p>
        <br>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label>${this.msg.prompt}</label>
          <textarea></textarea>
        </div>
        <br>
        <div class="buttonGroup">
          <button @click="${this.handleCancel}">${this.msg.cancel}</button>
          <button @click="${this.handleAdd}">${this.msg.confirm}</button>
        </div>
    `;
    }

    getPrompt(source: string, user: string) {

        const prompt = ` 
        Objective: Usando typescript, lit 3, alterar o código abaixo seguindo as instruções.\n\n
        System:\n
        1. Manter a linha 1 (tripe slash) que é de controle\n
        2. Fazer e manter comentários no código em ingles\n\n
        User:\n
        1. ${user}\n\n
        Expected Output Format:\n
            Retornar o novo source inteiro em um unico bloco\n\n

        Source:\n ${source} \n`;
        return prompt;
    }

    prepareTask1(taskRoot: cbe.ITaskRoot): void {
        // create task to get typescript source from another side
        this.mode = taskRoot.mode = 'in progress';
        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: 'get typescript source',
            widget: '_100554_aimTaskTSSource',
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
            agent: this.assistant,
            prompt: this.getPrompt(source, taskFinishResult.taskRoot.args || ''),
            trace: [],
            nextStep: this.prepareTask3.name // danger, loop
        });
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
            widget: '_100554_aimTaskResultCode',
            trace: [],
            _tempResult: result,
            nextStep: this.endTasks.name // danger, loop
        });
        this.requestUpdate();
    }

    endTasks(taskFinishResult: ITaskFinish): void {
        const child = taskFinishResult.taskChild;
        if (taskFinishResult.status === 'error') child.mode = 'error';
        else child.mode = 'processed';
        this.mode = taskFinishResult.taskRoot.mode = child.mode;
        this.requestUpdate();
        updateTaskOnServer(taskFinishResult.taskIndex);
    }

}
