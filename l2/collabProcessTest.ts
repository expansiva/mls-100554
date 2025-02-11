/// <mls shortName="collabProcessTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { getTestByFile, saveTest, updateTest, ILocalTestItem } from './_100554_libCommom';

@customElement('collab-process-test-100554')
export class CollabProcessTest extends CollabLitElement {

    @property({ type: String }) script: string = '';
    @property({ type: String }) mode: 'new' | 'edit' = 'new';
    @property({ type: String }) title: string = '';
    @property({ type: String }) indexEdit: string = '';

    @query('#txtScript') txtScript: HTMLTextAreaElement | undefined;
    @query('#inputTitle') inputTitle: HTMLInputElement | undefined;

    render() {
        return html`
            <h3>Process Test</h3>
            <div>
                <div class="input-container">
                    <label>Title</label>
                    <input type="text" .value=${this.title} id="inputTitle"/>
                </div>
                <button @click="${this.onSave}">Save</button>
            </div>
            <div>
                <textarea id="txtScript" .value="${this.script ? atob(this.script) : ''}" spellcheck="false">
                </textarea>
            </div>
        `;
    }


    // -------IMPLEMENTATION--------

    private actualTestList: ILocalTestItem[] = [];

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
        if (!this.txtScript || !this.inputTitle || !this.txtScript.value || !this.inputTitle.value || !(mls.actual[2] as any).left) {
            alert('Need more information');
            return;
        }
        const { project, shortName } = (mls.actual[2] as any).left;
        this.actualTestList = await getTestByFile(project, shortName, '.html');
        const actualData = this.actualTestList[+this.indexEdit];
        if (!actualData) return;
        actualData.title = this.inputTitle.value;
        actualData.script = this.txtScript.value;
        try {
            const key = mls.stor.getKeyToFiles(project, 2, shortName, '', '.html');
            await updateTest(key, +this.indexEdit, this.txtScript.value, this.inputTitle.value);
            alert('Test updated!');
        } catch (err: any) {
            alert(err.message);
        }

    }

    private async onNew() {

        if (!this.txtScript || !this.inputTitle || !this.txtScript.value || !this.inputTitle.value || !(mls.actual[2] as any).left) {
            alert('Need more information');
            return;
        }

        const actualFile = (mls.actual[2] as any).left;
        const file = mls.stor.getKeyToFiles(actualFile.project, 2, actualFile.shortName, actualFile.folder, '.html');
        const ret = await saveTest(file, this.txtScript.value, this.inputTitle.value);

        if (ret !== 'ok') alert(ret);
        else {
            this.txtScript.value = '';
            this.inputTitle.value = '';
            alert('Test saved!');
        }
    }
}