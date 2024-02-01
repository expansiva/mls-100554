/// <mls shortName="collabDsInputRange" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export function initCollabDSInputRange() { };
@customElement('collab-ds-input-range-100554')
export class CollabDSInputRange extends LitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public arraySelect: string[] = [];

    @property() useSelect: string = 'true';

    @property() value: string = '';

    @property() prop: string = '';

    min: number = 0;

    max: number = 100;

    render() {
        return html`
            ${this.renderInput()}
            ${this.renderSelect()}
            
        `
    }

    renderInput() {
        return html`
            <input type="range" .value="${this.onlyNumber(this.value)}" min="${this.min}" max="${this.max}"   @input="${(e:InputEvent) => this.changeRange(e)}"></input>
        `;
    }

    renderSelect() {
        return html`
            <div>
                <input type="search" .value="${this.onlyNumber(this.value)}" @input="${this.changeInput}"> </input>
                <select @change="${this.changeSelect}" style="${this.useSelect === 'false' ? 'display:none' : ''}">
                    ${repeat(this.arraySelect, ((key: any) => key) as any,
            ((k: any, index: any) => {

                return html`<option value="${k}">${k}</option>`;

            }) as any
        )}
                </select>
            </div>
        `;
    }

    updated() {
        if (!this.shadowRoot) return;
        const sel = this.shadowRoot.querySelector('select') as HTMLSelectElement;
        if (!sel) return;
        sel.value = this.onlyTxt(this.value);
    }

    //---------IMPLEMENTS-------------

    private onlyNumber(str: string): string {
        const regexNum = /(\d+(?:\.\d+)?)/;
        const res = str.match(regexNum);
        return res && (res as any)[0] ? (res as any)[0] as string : '';
    }

    private onlyTxt(str: string): string {
        const regexStr = /[a-zA-Z]+/;
        const res = str.match(regexStr);
        return res && (res as any)[0] ? ((res as any)[0] as string).replace('.', '') : '';
    }

    private changeRange(e: InputEvent): void {
        this.allChange(e, 'range')
    }

    private changeInput(e: InputEvent): void {
        this.allChange(e, 'input')
    }

    private changeSelect(e: InputEvent): void {
        this.allChange(e, 'sel')
    }

    private allChange(e: InputEvent, mode: string): void {

        e.stopPropagation();

        if (!this.shadowRoot) return;
        const parent = this.shadowRoot;

        let input = parent.querySelector('input[type="search"]') as HTMLInputElement;

        let range = parent.querySelector('input[type="range"]') as HTMLInputElement;

        let sel = parent.querySelector('select') as HTMLSelectElement;

        if (!input || !sel || !range) return;

        if (mode === 'range') {

            input.value = range.value;

        } else if (mode === 'input') {

            const tot = this.onlyNumber(input.value);
            const max = range.max;
            if (!max || max < tot) range.max = tot;
            range.value = tot;

        }

        this.value = input.value + sel.value;
        this.fireEvents(
            {
                key: this.prop,
                value: input.value + sel.value
            }
        );

    }

    private fireEvents(obj: any): void {

        obj.target = this;
        const onChangePropEvento = new CustomEvent('onchange', {
            bubbles: true,
            detail: obj
        });

        this.dispatchEvent(onChangePropEvento);
    }


}
