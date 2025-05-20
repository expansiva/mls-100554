/// <mls shortName="wcTableSelect" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { propertyDataSource } from './_100554_collabDecorators';

@customElement('wc-table-select-100554')
export class WcTableSelect100554 extends LitElement {

    @propertyDataSource() selected: number | undefined;
    @propertyDataSource() data: any[] | undefined;
    @propertyDataSource() columns: string[] | undefined;
    @property() maxcolumn: number | undefined;
    @property() striped: boolean | undefined;
    @property() bordered: boolean | undefined;

    render() {

        if (!this.data || this.data.length === 0) return html``;
        return html`
            <table>
                <thead>
                    <tr>
                        ${this.renderHeader()}
                    </tr>
                </thead> 
                <tbody>
                    ${this.renderBody()}
                </tbody>
                
            </table>
        `;
    }


    renderHeader() {
        if (!this.data || this.data.length === 0) return html``; 
        if (!this.columns) this.columns = Object.keys(this.data[0]);
        return html`
            ${repeat(this.columns || [], ((key: string) => key) as any, ((k: any, index: any) => { return html`<th>${k}</th>` }) as any)}
        `
    }

    renderBody() {
        if (!this.data || this.data.length === 0) return html``;
        if (!this.columns) this.columns = Object.keys(this.data[0]);
        return html`
            ${repeat(this.data || [], ((key: any, idx: number) => 'it' + idx) as any, ((k: any, index: any) => { return html`<tr .info=${{ data: k, index: index }} @click=${this.selectItem}>${this.renderBodyItem(k, this.columns || [])}</tr>` }) as any)}
        `
    }

    renderBodyItem(item: any, h: string[]) {
        return html`
            ${repeat(h, ((key: string) => key) as any, ((k: any, index: any) => { return html`<td>${item[k]}</td>` }) as any)}
        `
    }


    //---------IMPLEMENTS---------


    private selectItem(e: MouseEvent) {

        let el = e.target as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'tr') {
            el = el.closest('tr') as HTMLElement;
        }

        if (!el) return;

        const info = (el as any).info;
        this.selected = info.index
        const event = new CustomEvent('item-selected', {
            detail: info,
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);

    }

}
