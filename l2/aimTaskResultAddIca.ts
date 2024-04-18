/// <mls shortName="aimTaskResultAddIca" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { initCollabShowCodeDiff100554, CollabShowCodeDiff } from './_100554_collabShowCodeDiff';
import { getActiveOpServiceIfIsValid, isValidRef } from './_100554_aimActionAddIca';
import { ServiceSource100554 } from './_100554_serviceSource';


@customElement('aim-task-result-add-ica-100554')
export class AimTaskResulAddIca extends AimTaskBase {

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

        const methodsToImplements = this.getFcToImplements(this.result);

        return html`
        <details @click=${this.handleClick}>
            <summary>View TS Result</summary>
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

            <div style=${this.isAccept ? 'display: block' : 'display:none'}>
                <div>
                    <div>Deseja gerar o .HTML para o componente ?</div>
                    <div style='margin: 10px;'>
                        
                        <div class="buttonGroup">
                            <button @click="${this.handleCancelAcceptHTML}">Não</button>
                            <button @click="${this.handleConfirmAcceptHTML}">Sim</button>
                        </div>
                    </div> 
                </div> 
            </div>

            <div style=${this.isTryAgain ? 'display: block' : 'display:none'}>
                <div>
                    <ul>
                        ${methodsToImplements.map((met) => html`
                            <li>${met}</li>
                        `)}
                    </ul>
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
                const match = regex.exec(fcLine);
                const fcName = match ? match[1] : null;
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