/// <mls shortName="wcAuxCommand" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

@customElement('wc-aux-command-100554')
export class WcAuxCommand100554 extends StateLitElement {

    private elView: HTMLElement | undefined;
    private boundFireKeydown: (event: KeyboardEvent) => void = () => { };

    @property() idElView: string | undefined;
    @property() caracter: string | undefined;
    @property() itens: IAuxCommand[] = [];

    //--------COMPONENT---------

    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super.connectedCallback();
        this.boundFireKeydown = this.fireKeydown.bind(this);
        this.setDefinition();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('idElView')) {
            this.setDefinition();
        }
    }

    render() {
        return html` 
            <contentauxcommand> 
            ${repeat( this.itens,
                ((item: IAuxCommand) => item.group) as any,
                ((i: IAuxCommand, index: any) => this.renderGroup(i, index)) as any
            )}
            </contentauxcommand>
        `;
    }

    renderGroup(item: IAuxCommand, idx: number) {

        return html`
            <ul>
                <li class="headergroup">${item.group}</li>
                ${repeat( item.itens,
                    ((item: IAuxCommandItens) => item.value) as any,
                    ((i: IAuxCommandItens, index: any) => this.renderItem(i, index)) as any
                )}
            </ul>
        `
    }

    renderItem(item: IAuxCommandItens, idx: number) {

        return html`
            <li @click="${this.clickItem}" .item=${item}>
                ${item.icon ? unsafeHTML('<blkicon>'+item.icon+'</blkicon>') : ''}
                <label>${item.label}</label>
            </li>
        `
    }

    //--------IMPLEMENTS-------

    private setDefinition() {

        if (this.elView) {
            this.elView.removeEventListener('keydown', this.boundFireKeydown);
            this.elView = undefined;
        }

        this.elView = window[this.idElView as any] as any as HTMLElement;

        if (this.elView) this.elView.addEventListener('keydown', this.boundFireKeydown);

        this.onmouseleave = () => this.mouseLeave();

    }

    private mouseLeave() {
        this.classList.remove('active');
    }

    private fireKeydown(e: KeyboardEvent) {

        if (e.key !== this.caracter) {
            this.classList.remove('active');
            return;
        }

        this.classList.add('active');

        const position = this.getElementPosition();
        if (!position || !this.elView) return;

        this.style.position = 'absolute';
        this.style.top = (position.y + 0) + 'px';
        this.style.left = position.x + 'px';

    }

    private getElementPosition(): { x: number; y: number } | undefined {

        if (!this.elView) return undefined;

        const rect = this.elView.getBoundingClientRect();
        return { x: rect.left, y: rect.bottom };
    }

    private clickItem(e: MouseEvent) {

        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'li') {
            el = el.closest('li') as HTMLElement;
        }

        if (!el || !(el as any).item) return;

        this.classList.remove('active');

        const event = new CustomEvent('clickitem', {
            detail: (el as any).item,
            bubbles: false,
            composed: false,
        });

        this.dispatchEvent(event);

    }

}

export interface IAuxCommand { 
    group: string,
    itens: IAuxCommandItens[]
}

export interface IAuxCommandItens {
    label: string,
    value: string,
    icon: string
}