/// <mls shortName="collabProcessTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html} from 'lit';
import { customElement, property,query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { saveTest } from './_100554_libCommom';

@customElement('collab-process-test-100554')
export class CollabProcessTest extends CollabLitElement {

    @property({ type: String }) script: string = '';
    @query('#textareascript') textareascript: HTMLTextAreaElement | undefined;
    @query('#inputtitletest') inputtitletest: HTMLInputElement | undefined;

    render() {
        return html`
            <h3>Process Test</h3>
            <div>
                <label>Title</label>
                <input type="text" id="inputtitletest"/>
                <button @click="${this.onSave}">Save</button>
            </div>
            <div>
                <textarea id="textareascript" .value="${atob(this.script)}" spellcheck="false">
                </textarea>
            </div>
        `;
    }


    // -------IMPLEMENTATION--------

    private async onSave() {

        if (!this.textareascript || !this.inputtitletest || !this.textareascript.value || !this.inputtitletest.value || !(mls.actual[2] as any).left) {
            alert('Need more information');
            return;
        }

        const f = (mls.actual[2] as any).left;
        const file = mls.stor.getKeyToFiles(f.project, 2, f.shortName, f.folder, '.html');
        const ret = await saveTest(file, this.textareascript.value, this.inputtitletest.value);

        if (ret !== 'ok') alert(ret);
        else {
            this.textareascript.value = '';
            this.inputtitletest.value = '';
            alert('Test saved!');
        }
        
    }
}