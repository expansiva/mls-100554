/// <mls shortName="collabPanel" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, UnsafeHTMLDirective, repeat, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import '/_100554_/l2/collabPanelItem.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';


@customElement('collab-panel-100554')
export class CollabPanel extends CollabLitElement {

    @query('details') detail: HTMLDetailsElement | undefined;
    @property({ type: Boolean, reflect: true }) open = true;
    @property({ reflect: true }) icon?: any;

    public myData: IPluginMenuAction[] = [];

    //---------COMPONENT-------------

    createRenderRoot() {
        return this;
    }

    render() {

        if (!this.myData || this.myData.length === 0) {
            return html`<h3 style="margin-left:1rem">Not found plugins</h3>`
        }

        const category = this.myData[0].category;

        if (!this.icon) this.icon = this.open ? unsafeHTML(this.minus) : unsafeHTML(this.plus);

        return html`
            <details open="${this.open}">
                <summary @click=${this.changeSummary}>
                    <paneltitle>${category}</paneltitle>
                    <panelicon>${this.icon}</panelicon>
                </summary>
                <collab-panel-content>
                    ${repeat(this.myData, (
            (key: IPluginMenuAction, idx: number) => key.widget + idx) as any,
            ((item: IPluginMenuAction, index: any) => {

                return this.renderItem(item, index);

            }) as any
        )}
                </collab-panel-content>
            </details>
        `;
    }

    renderItem(item: IPluginMenuAction, index: number) {

        return html`
            <collab-panel-item-100554 widget=${item.widget} mode=${item.mode}>
            </collab-panel-item-100554>
        `
    }


    //---------IMPLEMENT-------------

    private changeSummary(): void {

        this.icon = !this.detail?.open ? unsafeHTML(this.minus) : unsafeHTML(this.plus);
    }

    private minus = '<svg xmlns="http://www.w3.org/2000/svg" style="width:15px"  viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>';

    private plus = '<svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>'


}


interface IPluginMenuAction extends mls.plugin.MenuAction {
    mode: 'html' | 'tag'
}