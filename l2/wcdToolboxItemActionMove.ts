/// <mls shortName="wcdToolboxItemActionMove" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IActionsToolbox } from './_100554_icaGlobal';
import { WCDToolbox } from './_100554_wcdToolbox';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

//version 4
@customElement('wcd-toolbox-item-action-move-100554')
export class WCDToolboxItemActionMove extends LitElement {

    public myParent: WCDToolbox | undefined;
    public elMain: HTMLElement | undefined;
    public elFCA: IcaLitElementBase | undefined;
    private myElements: IcaLitElementBase[] | undefined;

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

    public beforeRemove(): void {

        if (!this.myElements) return;
        document.body.onmouseup = () => { };
        this.myElements.forEach((i) => {
            this.changeStateDrop(i);
        });

    }

    private clearDrag(): void {

        if (!this.myElements) return;
        this.myElements.forEach((i) => {
            this.changeStateDrop(i);
        });

    }

    private stopDragging(e: MouseEvent): void {

        try {
            e.stopPropagation();
            if (!this.myParent || !this.elFCA) return;

            const myGrandFather = this.myParent.parentElement as IcaLitElementBase;

            document.body.style.cursor = '';

            const aux = this.getAux(e.target as HTMLElement);
            if (!aux || !(aux as any).elBase) {
                this.clearDrag();
                return;
            }

            const elBase = (aux as any).elBase;

            const oldParent = myGrandFather.getIcaParent(this.elFCA);
            const newParent = myGrandFather.getIcaParent(elBase);

            let father = elBase.parentElement as HTMLElement;
            father = father ? father : document.body as HTMLElement

            const move = aux.tagName.toLocaleLowerCase();

            const newEl: any = this.elFCA.cloneNode(true);
            /// newEl.myInnerHTML = this.elFCA.myInnerHTML; ver questão filhos

            switch (move) {
                case 'wcd-dragdrop-aux-before':
                    father.insertBefore(newEl, elBase);
                    this.elFCA.remove();
                    break;
                case 'wcd-dragdrop-aux-after':
                    father.insertBefore(newEl, elBase.nextSibling);
                    this.elFCA.remove();
                    break;
                case 'wcd-dragdrop-aux-in':
                    const elIn = elBase.querySelector(elBase.widget);
                    if (elIn) elIn.appendChild(this.elFCA);
                    break;
                default:
                    '';
            }

            // if (oldParent) oldParent.updateMyInnerHtmlIfNeed(false);
            // if (newParent) newParent.updateMyInnerHtmlIfNeed(false);
            //else {
                newEl.setAttribute('rendertype', 'edit');
                setTimeout(() => {
                    newEl.click();
                }, 100)

            //}

            setTimeout(() => {
                if (this.myParent) mls.events.fire((+(this.myParent.level as any)) as any, 'WCDEventChange' as any, `{"op":"Navigation"}`);
            }, 500)


            this.clearDrag();


        } catch (err) {

            this.clearDrag();
        }

    }

    private getAux(el: HTMLElement): HTMLElement | undefined {

        if (el.tagName.toLocaleLowerCase().startsWith('wcd-dragdrop-aux-')) {
            return el;
        }

        const parent = el.parentElement;
        if (!parent) return;

        const tag = parent.tagName.toLowerCase();

        if (tag.startsWith('wcd-dragdrop-aux-')) {

            return parent;

        }

        return this.getAux(parent);
    }

    private initClick(e: MouseEvent): void {

        if (!this.elMain || !this.elFCA || !this.myParent || !document.defaultView) return;

        //WCD's father will always be an FCA
        const myGrandFather = this.myParent.parentElement as IcaLitElementBase;

        const scope = myGrandFather.getMyScope();
        if (!scope) return;

        this.myElements = myGrandFather.getICAComponents(scope);

        this.myElements = this.onlyNeedAddTag(this.myElements);

        this.myElements.forEach((i) => {
            this.changeStateDrag(i, scope, myGrandFather);
        });

        if (!this.myParent.shadowRoot) return;
        Array.from(this.myParent.shadowRoot.children).forEach((i) => {

            const tag = i.tagName.toLocaleLowerCase();
            if (tag !== 'wcd-toolbox-item-action-move-100554') i.remove();

        })

    }

    
    private onlyNeedAddTag(array: IcaLitElementBase[]): IcaLitElementBase[] {

        const a: IcaLitElementBase[] = [];

        for (let i = 0; i <= array.length; i++) {

            const elBase = array[i];
            const next = array[i + 1];
            if (!next) {
                a.push(elBase);
                continue;
            }

            const parent = next.getIcaParent(next);

            if (!parent && (!next.parentElement || next.parentElement.tagName !== 'BODY')) continue;
            if (next.parentElement && next.parentElement.tagName === 'BODY') a.push(elBase)
            else if (parent !== elBase) a.push(elBase);


        }

        return a;
    }

    private changeStateDrag(elBase: IcaLitElementBase, elScope: HTMLElement, elMove: IcaLitElementBase): void {

        if (!elBase) return;
        if (elBase.getAttribute('renderType') === 'editactive' || !this.myParent) return;

        const valid = elBase.allowCommand('move', elScope, elMove);

        if (!valid.before && !valid.after && !valid.inside) return;

        const content = document.createElement('wcd-dragdrop-aux');

        content.style.position = 'absolute';
        content.style.display = 'flex';
        content.style.gap = '1rem';
        content.style.justifyContent = 'center';
        content.style.alignItems = 'center';
        content.style.background = '#0c66e461';

        const before = document.createElement('wcd-dragdrop-aux-before');
        const after = document.createElement('wcd-dragdrop-aux-after');
        const inn = document.createElement('wcd-dragdrop-aux-in');

        before.onclick = (e: MouseEvent) => this.stopDragging(e);
        after.onclick = (e: MouseEvent) => this.stopDragging(e);
        inn.onclick = (e: MouseEvent) => this.stopDragging(e);

        (before as any).elBase = elBase;
        (after as any).elBase = elBase;
        (inn as any).elBase = elBase;

        const cssItens = `width:18px; height:18px; border-radius:50%;box-shadow: 0 0 4px 1px rgba(57,76,96,.15), 0 0 0 1px rgba(43,59,74,.3); background:#fff; display:flex;justify-content:center; align-items: center; cursor:pointer `

        before.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>`;
        before.title = 'Before';
        before.style.cssText = cssItens;

        after.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`;
        after.title = 'after';
        after.style.cssText = cssItens;

        inn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M32 64C14.3 64 0 49.7 0 32S14.3 0 32 0l96 0c53 0 96 43 96 96l0 306.7 73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 402.7 160 96c0-17.7-14.3-32-32-32L32 64z"/></svg>`;
        inn.title = 'in';
        inn.style.cssText = cssItens;

        if (valid.before) content.appendChild(before);
        if (valid.after) content.appendChild(after);
        if (valid.inside) content.appendChild(inn);

        elBase.style.position = 'relative';

        this.myParent.updateSize(elBase, content, true);

        elBase.appendChild(content);

    }

    private changeStateDrop(elBase: IcaLitElementBase): void {

        if (!elBase) return;
        if (elBase.getAttribute('renderType') === 'editactive') return;

        elBase.style.position = '';
        const content = elBase.querySelector(':scope > wcd-dragdrop-aux');
        if (!content) return;
        content.remove();


    }

}

export const getTemplate = (mode: string = '', position: string = ''): IActionsToolbox => {

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
        isDblClick: false
    }
}