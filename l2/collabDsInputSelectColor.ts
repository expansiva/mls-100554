/// <mls shortName="collabDsInputSelectColor" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export function initCollabDsInputSelectColor(){};
@customElement('collab-ds-input-select-color-100554')
export class CollabDsInputSelectColor extends LitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    get value() { return this.configGetValue(); };

    set value(str) { this.configSetValue(str) };

    public arrayInputSelect: string[] = [];

    public arraySelect: string[] = [];

    @property() valueInput: string = '';

    @property() valueSelect: string = '';

    @property() valueColor: string = '';

    @property() prop: string = '';

    @property() useInput: string = 'true';

    @property() useSelect: string = 'true';

    @property() useColor: string = 'true';

    render() {

        return html`    
            ${this.useInput === 'true' ? this.renderInput() : ''}
            ${this.useSelect === 'true' ? this.renderSelect() : ''}
            ${this.useColor === 'true' ? this.renderColor() : ''}
        `
    }

    renderInput() {
        return html`
            <div>
                <input type="search" .value="${this.onlyNumber(this.valueInput)}" @input="${this.allChange}">
                <select @change="${this.allChange}" .value="px">
                    ${repeat( this.arrayInputSelect, ((key: any) => key) as any,
                        ((k: any, index: any) => {

                            return html`<option value="${k}">${k}</option>`;

                        }) as any
                    )}
                </select>
            </div>
        `
    }

    renderSelect() { 
        return html`
            <select @change="${this.allChange}" .value="px" prop="${this.prop}">
                    ${repeat( this.arraySelect, ((key: any) => key) as any,
                        ((k: any, index: any) => {

                            return html`<option value="${k}">${k}</option>`;

                        }) as any
                    )}
            </select>
        `
    }

    renderColor() { 
        return html`
            <input type="color" .value="${this.valueColor}" @input="${this.allChange}">
        `
    }

    updated() {
        if (!this.shadowRoot) return;
        const sel = this.shadowRoot.querySelector('div select') as HTMLSelectElement;
        if (sel) sel.value = this.onlyTxt(this.valueInput); 

        const sel2 = this.shadowRoot.querySelector('select[prop]') as HTMLSelectElement;
        if (sel2) sel2.value = this.onlyTxt(this.valueSelect); 
    }

    //---------IMPLEMENTS-------------

    private configGetValue(): string{

        let ret = '';

        if (this.useInput === 'true' && this.valueInput) ret = this.valueInput;
        else if (this.useInput === 'true') ret = '0px';

        if (this.useSelect === 'true' && this.valueSelect) ret += ' '+this.valueSelect;
        else if (this.useSelect === 'true') ret = ' none';

        if (this.useColor === 'true' && this.valueColor) ret += ' '+this.valueColor;
        else if (this.useColor === 'true') ret = ' #ffffff';

        return ret.trim();

    }

    private configSetValue(str:string){

        if (!str) return;
        const array = str.split(' ');
        
        if (this.useInput === 'true' && array.length >= 1) {
            this.valueInput = array[0];
            array.splice(0, 1);
        }

        if (this.useSelect === 'true' && array.length >= 1) {
            this.valueSelect = array[0];
            array.splice(0, 1);
        }

        if (this.useColor === 'true' && array.length >= 1) {
            this.valueColor = array[0];
            array.splice(0, 1);
        }
        
    }

    private onlyNumber(str: string): string {
        const regexNum = /\d+/;
        const res = str.match(regexNum);
        return res && (res as any)[0] ? (res as any)[0] as string : '';
    }

    private onlyTxt(str: string): string {
        const regexStr = /[a-zA-Z]+/;
        const res = str.match(regexStr);
        return res && (res as any)[0] ? (res as any)[0] as string : '';
    }

    private allChange(e: InputEvent): void {

        e.stopPropagation();

        if (!this.shadowRoot) return;
        const parent = this.shadowRoot;

        let input = parent.querySelector('input[type="search"]') as HTMLInputElement;

        let sel = parent.querySelector('select') as HTMLSelectElement;

        let sel2 = parent.querySelector('select[prop]') as HTMLSelectElement;

        let color = parent.querySelector('input[type="color"]') as HTMLInputElement;

        const ret = [];

        if (this.useInput) {
            this.valueInput = input.value + sel.value;
            ret.push({ tp: 'input', value: input.value + sel.value });
        }

        if (this.useSelect) {
            this.valueSelect = sel2.value;
            ret.push({ tp: 'select', value: sel2.value });
        }

        if (this.useColor) {
            this.valueColor = color.value;
            ret.push({ tp: 'color', value: color.value });
        }

        this.fireEvents(
            {
                key: this.prop,
                value: ret
            }
        );

    }

    private fireEvents(obj: any): void {

        obj.target = this;
        const onChangePropEvento = new CustomEvent('onchange', {
            bubbles: true,
            detail: obj,
        });

        this.dispatchEvent(onChangePropEvento);
    }
}
