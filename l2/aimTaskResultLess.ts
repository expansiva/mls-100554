/// <mls shortName="aimTaskResultLess" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { initCollabShowCodeDiff100554, CollabShowCodeDiff } from './_100554_collabShowCodeDiff';
import { getActiveOpServiceIfIsValid, isValidRef } from './_100554_aimActionStyleNew';


@customElement('aim-task-result-less-100554')
export class AimTaskResultLess extends AimTaskBase {

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

    @property({ type: String, reflect: true }) modeInternal: cbe.IMode = 'waiting for user';


    private result: string = '';

    public onInitializing(): void { // from abstract

        if (this.taskChild.mode !== 'error' && this.taskChild.mode !== 'processed') {
            this.modeInternal = this.taskRoot.mode = this.taskChild.mode = 'waiting for user';
        }

    }

    private async setValues() {

        if (!this.codeDiff) return;
        this.codeDiff.actualTextResult = this.result.trim();
        this.codeDiff.actualTextDiffModified = this.result.trim();
        const activeOpService = getActiveOpServiceIfIsValid(this);

        if (!activeOpService) return;

        const isValid = isValidRef(this.taskRoot, activeOpService);
        this.withDiff = isValid;
        if (this.withDiff) this.codeDiff.setAttribute('withdiff', 'true');

        if (this.modeInternal === 'waiting for user') {
            this.codeDiff.setAttribute('withaccept', 'true');
            this.codeDiff.setAttribute('withreject', 'true');
            this.codeDiff.setAttribute('withtryagain', 'true');
        }

        const value = activeOpService.getEditorComponentSource();
        this.codeDiff.actualTextDiffOriginal = value.trim();


    }

    private alreadyInit: boolean = false;
    handleClick(e: Event) {
        if (this.alreadyInit) return;
        this.setValues();
        this.codeDiff?.init();
        this.alreadyInit = true;
    }

    renderBody(taskRoot: cbe.ITaskRoot, child: cbe.ITaskChild) {

        const body = child._tempResult || '';
        const { contentLess, contentsAfterLess, contentsBeforeLess } = this.extractBlocks(body);
        this.result = contentLess;

        return html`
        <details @click=${this.handleClick}>
            <summary>View Less Result</summary>
            <div style=${!this.isTryAgain ? 'display: block' : 'display:none'}>
                <div>${contentsBeforeLess}</div>
                <div style='margin: 10px;'>
                    <collab-show-code-diff-100554
                        language="less"
                        .onAccept=${this.onAccept.bind(this)}
                        .onTryAgain=${this.onTryAgain.bind(this)}
                        .onReject=${this.onReject.bind(this)}
                        ${this.withDiff ? 'withdiff' : ''}      
                    ></collab-show-code-diff-100554>
                </div> 
                <div>${contentsAfterLess}</div>
            </div>

            <div style=${this.isTryAgain ? 'display: block' : 'display:none'}>
                <div>
                    <div>Por favor digite as mudanças necessárias abaixo.</div>
                    <div style='margin: 10px;'>
                        <div>
                            <label>Prompt:</label>
                            <textarea rows="5" placeholder="Digite aqui seu prompt" style="width:100%"></textarea>
                        </div>
                        <br>
                        <div class="buttonGroup">
                            <button @click="${this.handleCancelTryAgain}">Cancelar</button>
                            <button @click="${this.handleConfirmTryAgain}">Confirmar</button>
                        </div>
                    </div> 
                </div> 
            </div>
        </details>
        `;
    }

    private closeMe() {
        const det = this.querySelector('details');
        if (det) det.open = false;
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

    private onAccept() {
        this.notifyCompleteByStatus('ok', this.result);
        this.modeInternal = 'processed';
        this.closeMe();
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
        const regex = /^(.*?)```less(.*)```(.*)/s;
        const matches = src.match(regex);
        let contentLess = '';
        let contentsBeforeLess = '';
        let contentsAfterLess = '';
        if (matches) {
            contentsBeforeLess = matches[1] || '';
            contentLess = matches[2] || '';
            contentsAfterLess = matches[3] || '';
        }
        return { contentLess, contentsAfterLess, contentsBeforeLess }
    }

}
