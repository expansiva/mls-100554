/// <mls shortName="collabLogLine" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { collab_check, collab_circle_notch, collab_triangle_exclamation } from './_100554_collabIcons';

@customElement('collab-log-line-100554')
export class CollabLogLine100554 extends LitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() text: string = '';

    @property() status: ILogStatus = 'inprogress';

    private iconsByStatus: IIconsByStatus = {
        inprogress: collab_circle_notch,
        error: collab_triangle_exclamation,
        finish: collab_check,
        waiting: collab_circle_notch
    }

    render() {
        if (!this.text) return html``;
        return html`
        <div status=${this.status}>
            <div>${this.iconsByStatus[this.status]}</div>
            <span>${this.text}</span>
        </div>`;
    }
}

export type ILogStatus = 'waiting' | 'inprogress' | 'finish' | 'error'
export type IIconsByStatus = {
    [key in ILogStatus]: string;
};
