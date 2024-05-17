/// <mls shortName="aimTaskResultAddIcaPrompt" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";

/// **collab_i18n_start**
const message_pt = {
    tryagain_title_2: "O prompt é valido",
    tryagain_title_3: "O prompt enviado esta fora de contexto por favor digite um prompt referente a criação de um web component",
    tryagain_title_4: "O prompt precisa ser melhorado, por favor digite as mudanças necessárias abaixo.",
    tryagain_title_5: "Segue abaixo algumas sugestões para melhorar o seu prompt",
    error_message: "O prompt deve ser preenchido.",

    tryagain_placeholder: "Digite aqui seu prompt.",
    tryagain_processed: "Prompt já validado.",

    btn_confirmar: "Confirmar",
    btn_cancelar: "Cancelar",
}

const message_en = {
    tryagain_title_2: "The prompt is valid",
    tryagain_title_3: "The prompt sent is out of context, please type a prompt related to the creation of a web component",
    tryagain_title_4: "The prompt needs improvement, please type the necessary changes below.",
    tryagain_title_5: "Below are some suggestions to improve your prompt",
    error_message: "The prompt must be filled.",

    tryagain_placeholder: "Type your prompt here.",
    tryagain_processed: "Prompt already validated.",

    btn_confirmar: "Confirm",
    btn_cancelar: "Cancel"
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en-us': message_en,
    'pt-br': message_pt
}
/// **collab_i18n_end**

@customElement('aim-task-result-add-ica-prompt-100554')
export class AimTaskResulAddIcaPrompt extends AimTaskBase {

    private msg: MessageType = messages['en-us'];

    private result: number | undefined;

    @property({ type: String, reflect: true }) modeInternal: cbe.IMode | undefined;

    @property() hasError: boolean = false;

    @query('textarea')
    textarea: HTMLTextAreaElement | undefined;

    public onInitializing(): void { // from abstract

        if (this.taskChild.mode !== 'error' && this.taskChild.mode !== 'processed') {
            this.modeInternal = this.taskRoot.mode = this.taskChild.mode = 'waiting for user';
        }

        if (!this.taskChild.result) {
            this.taskChild.mode === 'error';
            this.notifyCompleteByStatus('error', '');
            return;
        }

        this.result = this.getResult(this.taskChild.result);

        if (this.result === 0) {
            this.notifyCompleteByStatus('ok', '');
            return;
        }

        this.openMe();
    }

    private getResult(str: string) {
        const firstStr = str.substring(0, 24).toLowerCase();
        if (firstStr.startsWith('sim')) return 0;
        if (firstStr.startsWith('nao')) return 1;
        if (firstStr.startsWith('forneça mais informações')) return 2;
    }

    renderBody(taskRoot: cbe.ITaskRoot, child: cbe.ITaskChild) {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        let prompt = taskRoot.args ? JSON.parse(taskRoot.args).prompt : ''
        
        const body = child.result || '';
        this.result = this.getResult(body);
        if (this.modeInternal !== 'waiting for user') return html`<div>${this.msg.tryagain_processed}</div>`
        return html`
         <div>
             ${this.result === 0
                ? html`<span>${this.msg.tryagain_title_2}</span>`
                : html`

                     ${this.result === 2
                        ? this.renderListSuggestions(body)
                        : ''
                    }

                     <div style='margin: 10px;'>
                         <label>${this.result === 2
                        ? this.msg.tryagain_title_4
                        : this.msg.tryagain_title_3
                    } </label>

                         <textarea
                         rows="5"
                         placeholder=${this.msg.tryagain_placeholder} 
                         .value="${prompt}"
                         style="width:100%"></textarea >
                         ${this.hasError ? html`<small style="color:red;"> ${this.msg.error_message}</small>` : ''}
                     </div>
                     <br>
                     <div class="buttonGroup">
                         <button @click="${this.handleCancelTryAgain}">${this.msg.btn_cancelar}</button>
                         <button @click="${this.handleConfirmTryAgain}">${this.msg.btn_confirmar}</button>
                     </div>
             `
            }            
         </div> 
         `
    }

    private renderListSuggestions(str: string) {

        return html`
        <span>${this.msg.tryagain_title_5}</span>
        <pre style="white-space: pre-line;">
            ${str}
        </pre>
    `
    }

    private closeMe() {
        const det = this.querySelector('details');
        if (det) det.open = false;
    }

    private openMe() {

        const detRoot = this.closest('details');
        setTimeout(() => {
            const detInternal2 = this.querySelector('details');
            if (detInternal2) detInternal2.open = true;
        }, 150);

        if (detRoot) detRoot.open = true;
    }

    private handleCancelTryAgain() {
        this.notifyCompleteByStatus('error', '');
    }

    private handleConfirmTryAgain() {

        let prompt: string = '';
        if (this.textarea) prompt = this.textarea.value;
        if (prompt === '') {
            this.hasError = true;
            return;
        }
        this.notifyCompleteByStatus('userEvent', '', prompt);
        this.closeMe();
    }
}

