/// <mls shortName="ateste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabMessages } from './_100554_collabMessages';

@customElement('ateste-100554')
export class SimpleGreeting extends LitElement {
    static styles = css`p { color: red }`;

    @property()
    language: string = 'en-US';

    @property()
    name: string = '';

    shouldUpdate(changedProperties: Map<string, string>): boolean {
    

        if (changedProperties.get('language')) {

            this.setLanguage();
            

        } 

        return true;

    }

    firstUpdated() {
        this.setLanguage();
    }

    render() {
        return html`<p>  ${this.name} !</p>`;
    }

    private async setLanguage() {

        await CollabMessages.setLanguage(this.language as any);
        this.name = CollabMessages.messages.todayIs(new Date(Date.now()))
        
    }
}