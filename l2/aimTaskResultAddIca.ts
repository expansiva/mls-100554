/// <mls shortName="aimTaskResultAddIca" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { initCollabShowCodeDiff100554, CollabShowCodeDiff } from './_100554_collabShowCodeDiff';
import { getActiveOpServiceIfIsValid } from './_100554_aimActionAddIca';
import { ServiceSource100554 } from './_100554_serviceSource';

/// **collab_i18n_start**
const message_pt = {
    title_result: "Ver typescript resultado",
    tryagain_title_1: "Métodos para implementar",
    tryagain_title_2: "Por favor digite as mudanças necessárias abaixo.",
    tryagain_placeholder: "Digite aqui seu prompt.",
    accept_answer: "Deseja gerar o .HTML para o componente ?",
    btn_confirmar: "Confirmar",
    btn_cancelar: "Cancelar",
    btn_yes: "Sim",
    btn_no: "Não",
}

const message_en = {
    title_result: "View TypeScript Result",
    tryagain_title_1: "Methods to implement",
    tryagain_title_2: "Please type the necessary changes below.",
    tryagain_placeholder: "Type your prompt here.",
    accept_answer: "Do you want to generate the .HTML for the component?",
    btn_confirmar: "Confirm",
    btn_cancelar: "Cancel",
    btn_yes: "Yes",
    btn_no: "No"
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en-us': message_en,
    'pt-br': message_pt
}
/// **collab_i18n_end**

@customElement('aim-task-result-add-ica-100554')
export class AimTaskResulAddIca extends AimTaskBase {

    private msg: MessageType = messages['en-us'];

    constructor() {
        super();
        initCollabShowCodeDiff100554();
    }

    @query('collab-show-code-diff-100554')
    codeDiff: CollabShowCodeDiff | undefined;

    @query('#details_result')
    detailsResult: HTMLDetailsElement | undefined;

    @query('textarea')
    textarea: HTMLTextAreaElement | undefined;

    @property({ type: Boolean }) withDiff = false;

    @property({ type: Boolean, reflect: true }) isTryAgain = false;

    @property({ type: Boolean, reflect: true }) isAccept = false;

    @property({ type: String, reflect: true }) modeInternal: cbe.IMode | undefined;

    private result: string = '';

    public onInitializing(): void { // from abstract

        if (this.taskChild.mode !== 'error' && this.taskChild.mode !== 'processed') {
            this.modeInternal = this.taskRoot.mode = this.taskChild.mode = 'waiting for user';
        }
        this.openMe();

    }

    private async setValues() {

        if (!this.codeDiff) return;
        this.codeDiff.actualTextResult = this.result.trim();
        this.codeDiff.actualTextDiffModified = this.result.trim();
        const activeOpService: ServiceSource100554 = getActiveOpServiceIfIsValid(this) as ServiceSource100554;
        if (!activeOpService) return;

        this.withDiff = false;
        if (this.withDiff) this.codeDiff.setAttribute('withdiff', 'true');

        if (this.modeInternal === 'waiting for user') {
            this.codeDiff.setAttribute('withaccept', 'true');
            this.codeDiff.setAttribute('withreject', 'true');
            this.codeDiff.setAttribute('withtryagain', 'true');
        }

        const value = activeOpService.getEditorValue();
        this.codeDiff.actualTextDiffOriginal = value.trim();

    }

    private alreadyInit: boolean = false;
    handleClick(e: Event) {
        this.setValues();
        if (this.alreadyInit) return;
        this.codeDiff?.init();
        this.alreadyInit = true;
    }

    renderBody(taskRoot: cbe.ITaskRoot, child: cbe.ITaskChild) {

        const body = child.result || '';
        const { contentTS, contentsAfterTS, contentsBeforeTS } = this.extractBlocks(body);
        this.result = contentTS;

        return html`
        <details @click=${this.handleClick}>
            <summary>${this.msg.title_result}</summary>
            <div style=${(!this.isTryAgain && !this.isAccept) ? 'display: block' : 'display:none'}>
                <div>${contentsBeforeTS}</div>
                <div style='margin: 10px;'>
                    <collab-show-code-diff-100554
                        language="typescript"
                        .onAccept=${this.onAccept.bind(this)}
                        .onTryAgain=${this.onTryAgain.bind(this)}
                        .onReject=${this.onReject.bind(this)}      
                    ></collab-show-code-diff-100554>
                </div> 
                <div>${contentsAfterTS}</div>
            </div>
            ${this.isAccept ? this.renderAccept() : ''}
            ${this.isTryAgain ? this.renderTryAgain() : ''}


        </details>
        `;
    }

    private renderAccept() {
        return html`
            <div>
                <div>
                    <div>${this.msg.accept_answer}</div>
                    <div style='margin: 10px;'>
                        <div class="buttonGroup">
                            <button @click="${this.handleCancelAcceptHTML}">${this.msg.btn_no}</button>
                            <button @click="${this.handleConfirmAcceptHTML}">${this.msg.btn_yes}</button>
                        </div>
                    </div> 
                </div> 
            </div>
        `
    }

    private renderTryAgain() {
        const methodsToImplements = this.getFcToImplements(this.result);
        return html`
            <div>
                <div>
                    <label>${this.msg.tryagain_title_1}</label>
                    <div class="prompt-suggestion">
                        ${methodsToImplements.map((prompt) => html`
                            <span @click=${this.onSuggestClick}>
                                <span >${prompt}</span>
                            </span>
                        `)}
                    </div>
                    <div>${this.msg.tryagain_title_2}</div>
                    <div style='margin: 10px;'>
                        <div>
                            <label>Prompt:</label>
                            <textarea rows="5" placeholder=${this.msg.tryagain_placeholder} style="width:100%"></textarea>
                        </div>
                        <br>
                        <div class="buttonGroup">
                            <button @click="${this.handleCancelTryAgain}">${this.msg.btn_cancelar}</button>
                            <button @click="${this.handleConfirmTryAgain}">${this.msg.btn_confirmar}</button>
                        </div>
                    </div> 
                </div> 
            </div>
            `
    }

    private onSuggestClick(e: MouseEvent) {
        if (!this.textarea) return;
        let text: string = '';
        const target = e.target as HTMLElement;
        const txtEl = target.querySelector('span');
        if (!txtEl) text = target.innerText;
        else text = txtEl.innerText;
        this.textarea.value = 'implement  ' + text;
    }

    private getFcToImplements(result: string) {
        const lines = result.split('\n');
        const methods = [];
        for (let i = 0; i <= lines.length; i++) {
            const line = lines[i];
            if (!line) continue;
            if (line.includes('**implement_here**')) {
                const previLine = i - 1;
                if (i < 0) continue;
                const fcLine = lines[previLine];
                const regex = /^\s*(\w+)\s*\(/;
                const regex2 = /(?:private\s+)?(\b\w+\b)\s*\(/g;
                const match = regex.exec(fcLine);
                let fcName = match ? match[1] : null;
                if (!fcName) {
                    const match2 = regex2.exec(fcLine);
                    fcName = match2 ? match2[1] : null;
                }
                if (fcName) methods.push(fcName);
            }
        };
        return methods;
    }

    private closeMe() {
        const det = this.querySelector('details');
        if (det) det.open = false;
    }

    private openMe() {
        const det = this.closest('details');
        if (det) det.open = true;
    }

    private handleCancelTryAgain() {
        this.isTryAgain = false;
    }

    private handleConfirmTryAgain() {

        let prompt: string = '';
        if (this.textarea) prompt = this.textarea.value;
        this.isTryAgain = false;
        this.notifyCompleteByStatus('userEvent', this.result, prompt);
        this.closeMe();
    }

    private handleCancelAcceptHTML() {
        this.notifyCompleteByStatus('ok', this.result);
        this.modeInternal = 'processed';
        this.isAccept = false;
        this.closeMe();
    }

    private handleConfirmAcceptHTML() {
        this.isAccept = false;
        this.notifyCompleteByStatus('userEvent', this.result, '[html]');
    }

    private onAccept() {
        if (this.detailsResult) this.detailsResult.open = false;
        this.isAccept = true;
    }

    private onReject() {
        this.notifyCompleteByStatus('rejected', '');
        this.modeInternal = 'processed';
        this.closeMe();
    }

    private onTryAgain(e: Event) {
        if (this.detailsResult) this.detailsResult.open = false;
        this.isTryAgain = true;
    }

    private extractBlocks(src: string) {
        const regex = /^(.*?)```typescript(.*)```(.*)/s;
        const matches = src.match(regex);
        let contentTS = '';
        let contentsBeforeTS = '';
        let contentsAfterTS = '';
        if (matches) {
            contentsBeforeTS = matches[1] || '';
            contentTS = matches[2] || '';
            contentsAfterTS = matches[3] || '';
        }
        return { contentTS, contentsAfterTS, contentsBeforeTS }
    }

}