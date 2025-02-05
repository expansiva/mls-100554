/// <mls shortName="collabProcessTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';

@customElement('collab-process-test-100554')
export class CollabProcessTest extends CollabLitElement {

    @property({ type: String }) script: string = '';

    render() {

        return html`
            <h3>Process Test</h3>
            <div>
                <label>Title</label>
                <input type="text" />
                <button>Save</button>
            </div>
            <div>
                <textarea .value="${atob(this.script)}" spellcheck="false">
                </textarea>
            </div>
        `;
    }
}