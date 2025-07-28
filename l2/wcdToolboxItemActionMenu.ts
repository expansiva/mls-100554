/// <mls shortName="wcdToolboxItemActionMenu" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { convertFileNameToTag } from './_100554_utilsLit';
import { globalWcd } from './_100554_wcdState';


@customElement('wcd-toolbox-item-action-menu-100554')
export class WcdToolboxItemActionMenu extends WcdToolboxItemBase {

    public args: string | undefined;
    public myInfos: IWCDMenu100554 | undefined;

    @query('wcd-toolbox-items-menu') elItens: HTMLElement | undefined;
    //----------COMPONENT---------------

    createRenderRoot() {
        return this;
    }



    render() {

        this.setMyArgs();
        if (!this.myInfos || this.myInfos.itens === undefined) return html``;
        setTimeout(() => { this.loadItens() }, 200)
        this.style.zIndex = '9999';
        return html`
        <style>${this.css}</style>
        <wcd-toolbox-items-menu>
        </wcd-toolbox-items-menu>
            
        `;

    }


    //-----------IMPLEMENTATION-----------

    private setMyArgs() {

        try {
            if (this.args && this.args !== '') {
                this.myInfos = JSON.parse(this.args) as IWCDMenu100554;
            }

        } catch (e) {

            this.myInfos = undefined;

        }

    }

    private async loadItens() {

        if (!this.myInfos || this.myInfos.itens === undefined) return;

        for await (const item of this.myInfos.itens) {

            await this.loadItem(item);
        }

    }

    private isLoad: string[] = [];
    private async loadItem(item: IWCDMenuItem100554) {

        try {

            if (!item.item.startsWith('_') || !item.level || (this.myParent && this.myParent.level && !item.level.includes(+this.myParent.level))) return;


            let file = item.item;

            if (file === '_100554_wcdToolboxItemActionAdd' && item.args === 'child' && globalWcd.elICA && !(globalWcd.elICA as any).allowAddChild) return;

            if (!this.isLoad.includes(file)) {
                if (!file.startsWith('./')) file = './' + file;
                await import(file);
            }

            const infoPathItem = mls.l2.getPath(item.item);
            const tag = convertFileNameToTag(infoPathItem)
            const el = document.createElement(tag);
            (el as any).args = item.args;
            el.style.cssText = `
                border:none!important;
                border-radius:0px!important; 
                background:transparent!important;
            `

            const f = document.createElement('wcd-toolbox-item-menu');
            f.appendChild(el);

            if (this.elItens) this.elItens.appendChild(f);

        } catch (e) {
            return '';
        }

    }


    //--------CSS------------------------

    private css = `

        wcd-toolbox-item-action-menu-100554{
            display:block;
            border:1px solid #d3cece;
            padding:.3rem;
            border-radius:5px;
            background:#fff;
        }

        wcd-toolbox-items-menu{
            display:flex;
            height:18px;
            gap: .5rem;
            justify-content: center;
            align-items: center;
            
        }

        wcd-toolbox-item-menu{
            height: 18px;
            padding: .2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            
        }

        wcd-toolbox-item-menu:hover{
            background:#e1e1e1;
        }

        
    `

}

interface IWCDMenu100554 {
    itens: IWCDMenuItem100554[],
    subItens: IWCDMenuItem100554[]
}

interface IWCDMenuItem100554 {
    item: string,
    args: string,
    level: number[]
}