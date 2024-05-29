/// <mls shortName="aimTaskResultUserPrompt" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { initCollabShowCodeSnippet100554 } from './_100554_collabShowCodeSnippet';

/// **collab_i18n_start**
const message_pt = {
    tryagain_placeholder: "Digite aqui seu prompt.",
    btn_confirmar: "Confirmar",
    btn_cancelar: "Cancelar",
    btn_yes: "Sim",
    btn_no: "Não",
}

const message_en = {
    tryagain_placeholder: "Type your prompt here.",
    btn_confirmar: "Confirm",
    btn_cancelar: "Cancel",
    btn_yes: "Yes",
    btn_no: "No"
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('aim-task-result-user-prompt-100554')
export class AimTaskResulUserPrompt extends AimTaskBase {

    constructor() {
        super();
        initCollabShowCodeSnippet100554();
    }

    private msg: MessageType = messages['en'];

    @query('textarea')
    textarea: HTMLTextAreaElement | undefined;

    @property({ type: String, reflect: true }) modeInternal: cbe.IMode | undefined;

    private result: string = '';

    public onInitializing(): void { // from abstract
        if (this.taskChild.mode !== 'error' && this.taskChild.mode !== 'processed') {
            this.taskRoot.mode = this.taskChild.mode = 'waiting for user';
        }

        this.openMe();

    }

    renderBody(taskRoot: cbe.ITaskRoot, child: cbe.ITaskChild) {

        this.modeInternal = this.taskRoot.mode;
        const body = child.result || '';
        this.result = body;

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
                        <textarea rows="5" placeholder=${this.msg.tryagain_placeholder} style="width:100%"></textarea>
                    </div>
                    <br>
                    <div class="buttonGroup">
                        <button @click="${this.handleCancel}">${this.msg.btn_cancelar}</button>
                        <button @click="${this.handleConfirm}">${this.msg.btn_confirmar}</button>
                    </div>
                </div> 
                    `
                : ''

            }
    
        `;
    }

    private prepareChat(taskRoot: cbe.ITaskRoot): IChat[] {

        const rc: IChat[] = [];
        for (let i = 0; i < taskRoot.children.length; i++) {
            const item = taskRoot.children[i];
            const chatItem: IChat = {
                answer: '',
                response: '',
            };
            if (item.widget === '_100554_aimTaskExecLLM') chatItem.answer = item.prompt || ''
            else if (item.widget === '_100554_aimTaskResultUserPrompt') chatItem.response = item.result || ''
            rc.push(chatItem);
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

    private openMe() {
        const det = this.closest('details');
        const detInternal = this.querySelector('details');
        if (det) det.open = true;
        if (detInternal) detInternal.open = true;
    }

    private closeMe() {
        const det = this.querySelector('details');
        if (det) det.open = false;
    }

    private handleCancel() {
        this.notifyCompleteByStatus('ok', this.result);
    }

    private handleConfirm() {
        let prompt: string = '';
        if (this.textarea) prompt = this.textarea.value;
        this.notifyCompleteByStatus('userEvent', this.result, prompt);
        this.closeMe();
    }
}

interface IChat {
    answer: string,
    response: string
}