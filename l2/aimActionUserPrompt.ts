/// <mls shortName="aimActionUserPrompt" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';

const myName = '_100554_aimActionUserPrompt';

/// **collab_i18n_start**
const message_pt = {
    btn_cancel: "Cancelar",
    btn_confirm: "Confirmar",
    template_title: "prompt para usuário",
    textarea_placelholder: "Entre com o prompt aqui",
}

const message_en = {
    btn_cancel: "Cancel",
    btn_confirm: "Confirm",
    template_title: "prompt for user",
    textarea_placelholder: "Enter your prompt here",
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('aim-action-user-prompt-100554')
export class AimActionUserPrompt extends AimActionBase {

    private msg: MessageType = messages['en'];

    public getRules(): AimActionRules {
        return {
            levels: [5],
            tags: ["*servicePlugins*"]
        }
    }

    public assistant = "gpt3_typescript";
    public title = "User Prompt";
    private taskRoot: cbe.ITaskRoot | undefined;

    @query('textarea') textarea: HTMLTextAreaElement | undefined;

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

    private async handleAdd() {

        if (!this.textarea) return;
        const txtAreaValue: string = this.textarea.value;
        const args: IArgsAddIca = {
            prompt: txtAreaValue
        };

        this.taskRoot = {
            mode: 'initializing',
            title: 'prompt livre para o usuario',
            widget: myName,
            children: [],
            args: JSON.stringify(args),
            trace: [new Date().toISOString() + ': trask created at ']
        }
        tasks.unshift(this.taskRoot);
        this.prepareTask1(this.taskRoot);

        this.dispatchEvent(new CustomEvent('finished-add-task-root', {
            detail: this.taskRoot, bubbles: true, composed: true
        }));
    }

    prepareTask1(taskRoot: cbe.ITaskRoot): void {

        this.mode = taskRoot.mode = 'in progress';
        if (!taskRoot.args) {
            this.mode = taskRoot.mode = 'error';
            taskRoot.trace.push('invalid taskroot args');
            return;
        }
        const args: IArgsAddIca = JSON.parse(taskRoot.args);

        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: 'execute prompt',
            widget: '_100554_aimTaskExecLLM',
            agent: this.assistant,
            prompt: args.prompt,
            trace: [],
            nextStep: this.prepareTask2.name // danger, loop
        });

        this.requestUpdate();
    }


    prepareTask2(taskFinishResult: ITaskFinish): void {

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
            widget: '_100554_aimTaskResultUserPrompt',
            trace: [],
            result: result,
            nextStep: this.prepareTask3.name // danger, loop
        });
        this.requestUpdate();
    }

    prepareTask3(taskFinishResult: ITaskFinish) {

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
            prompt: taskFinishResult.newPrompt as string,
            trace: [],
            nextStep: this.prepareTask2.name // looping exec prompt
        });

    }

    endTasks(taskFinishResult: ITaskFinish): void {
        const { taskChild, taskRoot, status, result } = taskFinishResult;
        if (status === 'error') taskChild.mode = 'error';
        else taskChild.mode = 'processed';
        this.mode = taskFinishResult.taskRoot.mode = taskChild.mode;
        this.requestUpdate();
        updateTaskOnServer(taskFinishResult.taskIndex);
    }

    renderAdd(): TemplateResult { // from abstract

        return html`
        <p> ${this.msg.template_title}</p>

        <div>
            <label><b>Prompt:</b></label>
            <textarea rows="5" placeholder=${this.msg.textarea_placelholder} style="width:100%"></textarea>
        </div>

        <div class="buttonGroup">
            <button @click="${this.handleCancel}">${this.msg.btn_cancel}</button>
            <button @click="${this.handleAdd}">${this.msg.btn_confirm}</button>
        </div>
`;
    }

}

export interface IArgsAddIca {
    prompt: string,
}
