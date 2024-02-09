/// <mls shortName="wcdToolboxItemActionMove" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IActionsToolbox } from './_100554_fcaGlobal';
import { WCDToolbox } from './_100554_wcdToolbox';

@customElement('wcd-toolbox-item-action-move-100554')
export class WCDToolboxItemActionMove extends LitElement {

    public myParent: WCDToolbox | undefined;
    public elMain: HTMLElement | undefined;

    createRenderRoot() {
        return this;
    }

    render() {

        return html``;

    }

    updated(changedProperties: any) {

        super.updated(changedProperties);

        this.onclick = (event) => { this.initClick(event); };

    }

    private initClick(e: MouseEvent): void {

        if (!this.elMain || !this.myParent || !document.defaultView) return;

        const myScope = this.myParent.parentElement;

        console.info(myScope);

    }

}

export const getTemplateActionMove = (mode: string, position: string): IActionsToolbox => {

    let ret: IActionsToolbox = templateActionMove.move as IActionsToolbox;
    if (position !== '') ret.position = position as any;

    return ret as IActionsToolbox;

}

const templateActionMove = {
    move: {
        position: 'p-m2',
        tp: 'action',
        format: '',
        title: 'Move',
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4V224H109.3l9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4H224V402.7l-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4V288H402.7l-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4H288V109.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"/></svg>',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-move-100554',
        cursor: 'pointer',
        attrs: undefined,
    }
}


/*
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { getParentFCA, updateHtmlTreeFCA } from './_100554_fcaGlobal';

@customElement('wcd-toolbox-item-action-move-100554')
export class WCDToolboxItemActionMove extends LitElement {

    public myFather: HTMLElement | undefined;
    public elMain: HTMLElement | undefined;


    createRenderRoot() {
        return this;
    }

    render() {

        return html``;

    }

    updated(changedProperties: any) {

        super.updated(changedProperties);
        let temporizador: number;

        (this as HTMLElement).addEventListener('mousedown', (event) => {
            temporizador = setTimeout(() => {
                this.initDragging(event);
            }, 300);
        });

        (this as HTMLElement).addEventListener('click',  (event) => {
            clearTimeout(temporizador);
            this.initClick(event);
        });
        //this.style.cursor = 'grab';

    }

    private initClick(e: MouseEvent): void {

        if (!this.elMain || !document.defaultView) return;
        document.body.style.cursor = 'grabbing';

        e.stopPropagation();
        const evento = new CustomEvent('onChange', {
            detail: { valor: `"${this.elMain.tagName.toLocaleLowerCase()}"`, startDrop: true },
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(evento);

        const getAux = (el: HTMLElement): HTMLElement | undefined => {

            if (el.tagName.toLocaleLowerCase().startsWith('wcd-dragdrop-aux-')) {
                return el;
            }

            const parent = el.parentElement;
            if (!parent) return;

            const tag = parent.tagName.toLowerCase();

            if (tag.startsWith('wcd-dragdrop-aux-')) {

                return parent;

            }

            return getAux(parent);
        }

        const fireEventStop = (el: HTMLElement) => {

            const evento = new CustomEvent('onChange', {
                detail: { valor: `"${el.tagName.toLocaleLowerCase()}"`, startDrop: false },
                bubbles: true,
                composed: true
            });

            this.dispatchEvent(evento);

        }

        const stopDragging = (e: MouseEvent) => {

            try {

                e.stopPropagation();
                if (!this.elMain || !this.myFather) return;

                document.body.removeEventListener('mouseup', stopDragging, false);

                document.body.style.cursor = '';

                const aux = getAux(e.target as HTMLElement);
                if (!aux) {
                    fireEventStop(this.elMain);
                    return;
                }

                const elBase = (aux as any).elBase;
                if (!elBase) {
                    fireEventStop(this.elMain);
                    return;
                }

                const oldParent = getParentFCA(this.elMain);
                const newParent = getParentFCA(elBase);

                let father = elBase.parentElement as HTMLElement;
                father = father ? father : document.body as HTMLElement

                const move = aux.tagName.toLocaleLowerCase();

                switch (move) {
                    case 'wcd-dragdrop-aux-before':
                        father.insertBefore(this.elMain, elBase);
                        break;
                    case 'wcd-dragdrop-aux-after':
                        father.insertBefore(this.elMain, elBase.nextSibling);
                        break;
                    case 'wcd-dragdrop-aux-in':
                        const elIn = elBase.querySelector(elBase.widget);
                        if (elIn) elIn.appendChild(this.elMain);
                        break;
                    default:
                        '';
                }

                if (oldParent) updateHtmlTreeFCA(oldParent as any);
                if (newParent) updateHtmlTreeFCA(newParent as any);

                fireEventStop(this.elMain);

            } catch (err) {

                const evento = new CustomEvent('onChange', {
                    detail: { valor: `"erro"`, startDrop: false },
                    bubbles: true,
                    composed: true
                });

                this.dispatchEvent(evento);
            }

        }

        document.body.addEventListener('mouseup', stopDragging, false);


    }

    private initDragging(e: MouseEvent): void {

        if (!this.elMain || !document.defaultView) return;
        document.body.style.cursor = 'grabbing';

        const evento = new CustomEvent('onChange', {
            detail: { valor: `"${this.elMain.tagName.toLocaleLowerCase()}"`, startDrop: true },
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(evento);

        const doDragging = (e: MouseEvent) => {

            if (!this.elMain || !this.myFather) return;


        }

        const getAux = (el: HTMLElement): HTMLElement | undefined => {

            if (el.tagName.toLocaleLowerCase().startsWith('wcd-dragdrop-aux-')) {
                return el;
            }

            const parent = el.parentElement;
            if (!parent) return;

            const tag = parent.tagName.toLowerCase();

            if (tag.startsWith('wcd-dragdrop-aux-')) {

                return parent;

            }

            return getAux(parent);
        }

        const fireEventStop = (el: HTMLElement) => {

            const evento = new CustomEvent('onChange', {
                detail: { valor: `"${el.tagName.toLocaleLowerCase()}"`, startDrop: false },
                bubbles: true,
                composed: true
            });

            this.dispatchEvent(evento);

        }

        const stopDragging = (e: MouseEvent) => {

            try {

                e.stopPropagation();
                if (!this.elMain || !this.myFather) return;

                document.body.removeEventListener('mousemove', doDragging, false);
                document.body.removeEventListener('mouseup', stopDragging, false);

                document.body.style.cursor = '';

                const aux = getAux(e.target as HTMLElement);
                if (!aux) {
                    fireEventStop(this.elMain);
                    return;
                }

                const elBase = (aux as any).elBase;
                if (!elBase) {
                    fireEventStop(this.elMain);
                    return;
                }

                const oldParent = getParentFCA(this.elMain);
                const newParent = getParentFCA(elBase);

                let father = elBase.parentElement as HTMLElement;
                father = father ? father : document.body as HTMLElement

                const move = aux.tagName.toLocaleLowerCase();

                switch (move) {
                    case 'wcd-dragdrop-aux-before':
                        father.insertBefore(this.elMain, elBase);
                        break;
                    case 'wcd-dragdrop-aux-after':
                        father.insertBefore(this.elMain, elBase.nextSibling);
                        break;
                    case 'wcd-dragdrop-aux-in':
                        const elIn = elBase.querySelector(elBase.widget);
                        if (elIn) elIn.appendChild(this.elMain);
                        break;
                    default:
                        '';
                }

                if (oldParent) updateHtmlTreeFCA(oldParent as any);
                if (newParent) updateHtmlTreeFCA(newParent as any);

                fireEventStop(this.elMain);

            } catch (err) {

                const evento = new CustomEvent('onChange', {
                    detail: { valor: `"erro"`, startDrop: false },
                    bubbles: true,
                    composed: true
                });

                this.dispatchEvent(evento);
            }

        }

        document.body.addEventListener('mousemove', doDragging, false);
        document.body.addEventListener('mouseup', stopDragging, false);
    }

}*/