/// <mls shortName="icaLayoutFlowRow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from './_100554_icaTypes';
import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IWCDCommand } from './_100554_wcdTypes';
import { countElementsWithTagName } from './_100554_wcdGlobal';
import { dispatchEventConciliate } from './_100554_wcdCommandBase';

@customElement('ica-layout-flow-row-100554')
export abstract class IcaLayoutFlowRow extends IcaLitElementBase {

    public mySymbol = 'fa-server';

    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" },
            { name: "size" },
            { name: "title" }
        ]
    }

    public changeStateHtml(html: string): void {

    }

    public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand {
        if (cmd === 'move') return this.commandMove(scope, target);
        if (cmd === 'addChild') return this.commandAddchild();
        return { inside: false, before: false, after: false };
    }

    public allowAddChild = true;

    // ----------- IMPLEMENTATION ---------------

    private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand {

        const activeInMe = this.querySelector('*[renderType="editactive"]');

        const elMychildren = document.createElement('span') as HTMLElement;
        elMychildren.innerHTML = this.internalInnerHTML;
        if (activeInMe && elMychildren.children.length <= 1) return { inside: false, before: false, after: false }
        const myScope = this.getMyScope();
        if (myScope !== scope) return { inside: false, before: false, after: false };
        const tag = target.tagName.toLocaleLowerCase();
        let inside = false;

        if (tag === 'ica-row-100554') inside = false;
        if (!this.internalInnerHTML || this.internalInnerHTML === '') inside = true;
        if (this.internalInnerHTML.indexOf('ica-layout-flow-column-100554') < 0) inside = true;
        if (this.internalInnerHTML.indexOf('ica-layout-flow-column-100554') >= 0 && tag === 'ica-layout-flow-column-100554') inside = true;

        const parent = this.getIcaParent(this);
        const insideFather = parent && parent.tagName.startsWith('ICA-') ? parent.allowCommand('move', scope, target) : { inside: true };
        const before = insideFather.inside;
        const after = insideFather.inside;
        return { inside, before, after }

    }

    private commandAddchild(): IAllowCommand {
        
        this.addNewColumn();
        return { inside: false, before: false, after: false }

    }

    private addNewColumn() {

        console.info('add');
        const icaSectionTagName = 'ica-layout-flow-section-100554';

        if (!this.overlayRef || !this.overlayRef.parentElement) return;

        const overlay = this.overlayRef.parentElement as any;

        const elAdd = document.createElement('ica-layout-flow-column-100554');
        elAdd.setAttribute('widget', 'wc-column-100554');

        const elNew = document.createElement('ica-apresentation-text-text-100554');
        elNew.setAttribute('widget', 'wc-text-100554');
        elNew.setAttribute('type', 'p');
        elNew.setAttribute('text', '');

        const allTexts = countElementsWithTagName(overlay, icaSectionTagName);
        elNew.id = 'icaapText' + (allTexts + 1);

        const allColumn = countElementsWithTagName(overlay, icaSectionTagName);
        elAdd.id = 'icacolumn' + (allColumn + 1);

        elAdd.appendChild(elNew);

        const widget = this.widget;
        if (!widget) return;

        const elWidget = this.querySelector(widget);
        if (!elWidget) return;

        elWidget.appendChild(elAdd);


        const { x, y, height, width } = elAdd.getBoundingClientRect();
        overlay.myItens.push({ element: elAdd, depth: 0, x, y, height, width, opacity: elAdd.style.opacity });

        const n = elNew.getBoundingClientRect();
        overlay.myItens.push({ element: elNew, depth: 0, x: n.x, y: n.y, height: n.height, width: n.width, opacity: elNew.style.opacity });


        overlay.createOverlayItems()

        setTimeout(() => {
            overlay.selectItem(elNew);
            elNew.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        dispatchEventConciliate();
    }

}


