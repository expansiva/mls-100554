/// <mls shortName="wcdToolboxItemActionCodeLanguage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { IcaApresentationTextCodeBase } from './_100554_icaApresentationTextCodeBase';
import { IcaLitElementBaseMethods } from '_100554_icaTypes';
import { WCDToolboxMethodos } from '_100554_wcdTypes';
import { dispatchEventConciliate } from './_100554_wcdCommandBase';

@customElement('wcd-toolbox-item-action-code-language-100554')
export class WcdToolboxItemActionCodeLanguage extends WcdToolboxItemBase {

    public myParent: WCDToolboxMethodos | undefined;
    public elMain: HTMLElement | undefined;
    public elICA: IcaLitElementBaseMethods | undefined;
    public args: string | undefined;

    @property() languages: string[] = [];
    @property() actualLanguage: string = ''

    private async getLanguagesAvaliables() {
        if (!this.elICA) return;
        const wc = this.elICA.children[0] as IcaApresentationTextCodeBase;
        if (!wc || !(wc instanceof IcaApresentationTextCodeBase)) throw new Error('Invalid wc rendering in ica');
        if (!wc.languages) throw new Error('Invalid wc languages in component');
        this.languages = wc.languages || [];
        await this.updateComplete
        this.actualLanguage = wc.language || '';
    }

    private handleChange(e: MouseEvent) {
        if (!this.elICA) return;
        const target = e.target as HTMLSelectElement;
        const val = target.value;
        this.elICA.setAttribute('language', val);
        dispatchEventConciliate();
    }

    private handleClick(e: MouseEvent) {
        e.stopPropagation();
    }

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        this.getLanguagesAvaliables();
    }

    render() {
        return html`<select style="border: none;outline:none;" .value=${this.actualLanguage} @click=${this.handleClick} @change=${this.handleChange}>${this.languages.map((item) => html`<option value=${item}>${item}</option>`)}</select>`
    }


}
