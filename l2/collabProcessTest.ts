/// <mls shortName="collabProcessTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { addTest, updateTest } from './_100554_libCommom';

@customElement('collab-process-test-100554')
export class CollabProcessTest extends CollabLitElement {

    @property({ type: String }) script: string = '';
    @property({ type: String }) mode: 'new' | 'edit' = 'new';
    @property({ type: String }) title: string = '';
    @property({ type: String }) indexEdit: string = '';

    @property({ type: String }) labelError: string = '';
    @property({ type: String }) labelOk: string = '';



    @query('#txtScript') txtScript: HTMLTextAreaElement | undefined;

    render() {
        return html`
            <h3>Process Test</h3>
            <div>
                <button @click="${this.onSave}">Save</button>
            </div>
            <div class="error"> ${this.labelError}</div>
            <div class="success"> ${this.labelOk}</div>
            <div>
                <textarea id="txtScript" .value="${this.script ? this.decodeHtmlEntities(decodeURIComponent(atob(this.script))) : ''}"spellcheck="false">
                </textarea>
            </div>
        

        `;
    }

    private decodeHtmlEntities(str: string) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = str;
        return textarea.value;
    }



    // -------IMPLEMENTATION--------

    private actualTestList: string[] = [];

    private async onSave() {

        if (this.mode === 'new') {
            this.onNew();
            return;
        }

        if (this.mode === 'edit') {
            this.onEdit();
        }

    }

    private async onEdit() {
        this.clearMsg();
        if (!this.txtScript || !this.txtScript.value || !(mls.actual[2] as any).left) {
            this.labelError = 'Need more information';
            return;
        }

        const { project, shortName } = (mls.actual[2] as any).left;
        const key = mls.stor.getKeyToFiles(project, 2, shortName, '', '.html');
        try {
            await updateTest(key, this.title, this.txtScript.value);
            this.labelOk = 'Test updated sucessfully';
        } catch (err: any) {
            this.labelError = err.message;
        }

    }

    private clearMsg() {
        this.labelError = '';
        this.labelOk = '';
    }

    private async onNew() {

        this.clearMsg();
        if (!this.txtScript || !this.txtScript.value || !(mls.actual[2] as any).left) {
            this.labelError = 'Need more information';
            return;
        }

        const actualFile = (mls.actual[2] as any).left;
        const file = mls.stor.getKeyToFiles(actualFile.project, 2, actualFile.shortName, actualFile.folder, '.html');

        try {
            await addTest(file, this.txtScript.value);
            this.labelOk = 'Test saved sucessfully';

        } catch (err: any) {
            this.labelError = err.message;
        }

    }
}