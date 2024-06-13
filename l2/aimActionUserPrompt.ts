/// <mls shortName="aimActionUserPrompt" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult, unsafeHTML } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer, getUserConfigs } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';
import { convertFileNameToTag } from './_100554_utilsLit';
import { initCollabShowCodeSnippet100554 } from './_100554_collabShowCodeSnippet';

const myName = '_100554_aimActionUserPrompt';

/// **collab_i18n_start**
const message_pt = {
    btn_cancel: "Cancelar",
    btn_confirm: "Confirmar",
    template_title: "prompt para usuário",
    textarea_placelholder: "Entre com o prompt aqui",
    tryagain_placeholder: "Digite aqui seu prompt.",
    btn_confirmar: "Enviar novo prompt",
    btn_ok: "Finalizar",
    tasks: "Tarefas"
}

const message_en = {
    btn_cancel: "Cancel",
    btn_confirm: "Confirm",
    template_title: "prompt for user",
    textarea_placelholder: "Enter your prompt here",
    tryagain_placeholder: "Type your prompt here.",
    btn_confirmar: "Send new prompt",
    btn_ok: "Close",
    tasks: "Tasks"
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('aim-action-user-prompt-100554')
export class AimActionUserPrompt extends AimActionBase {

    constructor() {
        super();
        initCollabShowCodeSnippet100554();
    }

    private msg: MessageType = messages['en'];

    public getRules(): AimActionRules[] {
        return [{
            level: 5,
            tags: ["*"]
        }]
    }

    public assistant = "gpt3_typescript";
    public title = "User Prompt";
    private taskRoot: mls.cbe.ITaskRoot | undefined;

    @query('textarea.add') textareaAdd: HTMLTextAreaElement | undefined;
    @query('textarea.prompt') textareaPrompt: HTMLTextAreaElement | undefined;

    @property({ type: String, reflect: true }) modeInternal: mls.cbe.IMode | undefined;
    @property() isLoading: boolean = false;

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        if (this.mode === 'add') return this.renderAdd();
        return this.renderTaskRoot();
    }

    renderTaskRoot(): TemplateResult {
        const renderChild = (child: mls.cbe.ITaskChild, index: number) => {
            this.loadDynamicWidget(taskRoot, child, child.widget);
            if (child.mode !== 'processed'
                && child.mode !== 'error'
                && child.nextStep) this.prepareNextStep(child);
            const taskName = convertFileNameToTag(child.widget);

            const sHtml = `<${taskName} mode="${child.mode}" taskindex="${this.taskIndex}" childindex="${index}" />`
            return html`${unsafeHTML(sHtml)}`;
        }

        if (this.taskIndex < 0 || this.taskIndex >= tasks.length) return html`invalid task index`;

        const taskRoot = tasks[this.taskIndex];
        const index: number = Number(taskRoot.key?.split('/').pop()) || 0;
        const cost: number = taskRoot.cost || 0;
        const promptUser = this.getPromptUser(taskRoot);
        const ref = this.getRef(taskRoot);
        const lastUpdateDate = this.getLastUpdateDate(taskRoot);
        const configs = getUserConfigs();

        return html`
            <details>
                <summary>
                    <div class="action-title">
                        ${this.renderToolbar()} 
                        ${configs.cost ? html`<span title="Cost" class="ac ac-cost"> ${this.iconMoney} ${cost.toFixed(4)}</span>` : ''}
                        ${configs.sequencial ? html`<span title="Sequential" class="ac ac-id">${index.toString().padStart(5, '0')}</span>` : ''}
                        ${configs.countChild ? html`    <span title="Count Child" class="ac ac-count">${this.iconHash} ${taskRoot.children.length}</span>` : ''}
                        ${configs.title ? html`    <span title="Title" class="ac ac-title">${this.title}</span>` : ''}
                        ${configs.prompt ? html`    <span title="Prompt" class="ac ac-prompt"> ${this.iconPrompt} ${promptUser || '...'}</span>` : ''}
                        ${configs.user ? html`<span title="User" class="ac ac-user"> ${this.iconUser} ${taskRoot.userName} </span>` : ''}
                        ${configs.reference ? html`<span title="Reference" class="ac ac-ref"> ${this.iconRef} ${ref} </span>     ` : ''}
                        ${configs.lastUpdateDate ? html`<span title="Last update date " class="ac ac-date"> ${this.iconDate}  ${lastUpdateDate} </span>` : ''}                                         
                    </div>
                </summary>
                <details>
                    <summary>${this.msg.tasks}</summary>
                    ${taskRoot.children.map((child: mls.cbe.ITaskChild, index:number) => renderChild(child, index))}
                </details>
                <div style="padding: 1rem 3rem;background: #fcfcfc;">
                    ${this.renderResult()} 
                </div>
            </details>
        `;

        // <div style='margin-bottom: 5em;' />
    }

    private renderResult() {

        const taskRoot = tasks[this.taskIndex];
        const chat = this.prepareChat(taskRoot);
        return html`
            <div>
                ${chat.map((item) => {
            if (item.answer) {
                return html`
                    <div style="display: flex;flex-direction: column;align-items: flex-end;gap: .25rem;width: 100%;margin-top: 2rem;">
                        <div style="background:#f4f4f4;max-width: 70%; padding:1.25rem .625rem;border-radius: 1.5rem;">
                            ${item.answer}
                        </div>
                    </div>
                `
            } else {
                return html`
                    <div style="margin-top: 1rem;">
                        ${unsafeHTML(this.formatText(item.response.trim()))}
                    </div>
                `
            }
        })}
            </div>
            <hr>

            ${this.modeInternal === "waiting for user" ?
                html`
                <div style='margin: 10px;'>
                    <div>
                        <textarea class="prompt" rows="5" placeholder=${this.msg.tryagain_placeholder} style="width:100%"></textarea>
                    </div>
                    <br>
                    <div class="buttonGroup">
                        <button style=${this.isLoading ? "pointer-events:none" : "pointer-events:all"} @click="${this.handleOk}">${this.msg.btn_ok}</button>
                        <button style=${this.isLoading ? "pointer-events:none" : "pointer-events:all"} @click="${this.handleConfirm}">
                            ${this.msg.btn_confirmar}
                            ${this.isLoading ? this.iconClock : ''}
                        </button>
                    </div>
                </div> 
                    `
                : ''

            }
    
        `;
    }

    private prepareChat(taskRoot: mls.cbe.ITaskRoot): IChat[] {

        const rc: IChat[] = [];
        for (let i = 0; i < taskRoot.children.length; i++) {
            const item = taskRoot.children[i];
            const chatItemAnswer: IChat = {
                answer: '',
                response: '',
            };
            const chatItemResponse: IChat = {
                answer: '',
                response: '',
            };
            if (item.widget === '_100554_aimTaskExecLLM') {
                chatItemAnswer.answer = item.prompt || '';
                chatItemResponse.response = item.result || '';
                rc.push(chatItemAnswer);
                rc.push(chatItemResponse);
            }

        }
        return rc;

    }

    private formatText(text: string): string {
        // Regular expression to find code blocks within ```[language] ... ```
        const regex = /```(\w+)\n([\s\S]*?)\n```/g;

        // Replacement function for code blocks
        const replaceCodeBlock = (match: string, language: string, code: string): string => {
            return `<collab-show-code-snippet-100554 language="${language}">\n${code}\n</collab-show-code-snippet-100554>`;
        };

        // Replace code blocks with <collab-show-code-snippet-100554> tag
        let formattedText = text.replace(regex, replaceCodeBlock);
        return formattedText;
    }

    private handleConfirm() {
        let prompt: string = '';
        if (!this.textareaPrompt) return;
        prompt = this.textareaPrompt.value;
        if (!prompt) return;
        this.dispatchEvent(new CustomEvent('task-new-prompt', {
            detail: prompt, bubbles: true, composed: true
        }));

        this.textareaPrompt.value = '';
    }

    private handleOk() {
        this.dispatchEvent(new CustomEvent('task-new-prompt', {
            detail: '', bubbles: true, composed: true
        }));
    }

    private handleCancel() {
        this.dispatchEvent(new CustomEvent('add-task', {
            detail: { cancel: 'true' }, bubbles: true, composed: true
        }));
    }

    private async handleAdd() {

        if (!this.textareaAdd) return;
        const txtAreaValue: string = this.textareaAdd.value;
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

    private openMe() {

        const det = this.querySelector('details');
        if (det) det.open = true;

    }

    prepareTask1(taskRoot: mls.cbe.ITaskRoot): void {

        this.mode = taskRoot.mode = 'in progress';
        this.isLoading = true;
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
            nextStep: this.prepareTaskWaitUser.name // danger, loop
        });

        this.requestUpdate();
    }

    prepareTaskWaitUser(taskFinishResult: ITaskFinish): void {

        this.isLoading = false;
        this.openMe();
        const child = taskFinishResult.taskChild;
        if (taskFinishResult.status === "error" || taskFinishResult.status === "rejected") return this.endTasks(taskFinishResult);
        child.mode = this.modeInternal = 'waiting for user';

        const listener = (e: Event) => {
            const prompt = (e as CustomEvent).detail;
            if (!prompt) {
                this.modeInternal = 'processed';
                return this.endTasks(taskFinishResult);
            }
            const args: IArgsAddIca = {
                prompt
            };
            taskFinishResult.taskRoot.args = JSON.stringify(args);
            child.mode = 'processed';
            this.prepareTask1(taskFinishResult.taskRoot);
            this.removeEventListener('task-new-prompt', listener);
        }

        if (taskFinishResult.status === "ok") {
            this.addEventListener('task-new-prompt', listener);
        }

        this.requestUpdate();

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
            <textarea class="add" rows="5" placeholder=${this.msg.textarea_placelholder} style="width:100%"></textarea>
        </div>

        <div class="buttonGroup">
            <button @click="${this.handleCancel}">${this.msg.btn_cancel}</button>
            <button @click="${this.handleAdd}">${this.msg.btn_confirm}</button>
        </div>
`;
    }

}

interface IChat {
    answer: string,
    response: string
}

export interface IArgsAddIca {
    prompt: string,
}
