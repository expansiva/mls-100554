/// <mls shortName="wcdToolboxItemActionMenu" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, unsafeHTML } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { convertFileNameToTag } from './_100554_utilsLit';


@customElement('wcd-toolbox-item-action-menu-100554')
export class WcdToolboxItemActionMenu extends WcdToolboxItemBase {

    public args: string | undefined;
    public myInfos: IWCDMenu100554 | undefined;

    
    //----------COMPONENT---------------

    createRenderRoot() {
        return this;
    }

    

    render() {
        
        this.setMyArgs();
        if (!this.myInfos || this.myInfos.itens === undefined ) return html``;
        this.style.zIndex = '9999';
        return html`
        <style>${this.css}</style>
        <wcd-toolbox-itemmenu>
            ${repeat(this.myInfos.itens,
                ((key: IWCDMenuItem100554, idx: number) => 'i' + idx) as any,
                ((item: IWCDMenuItem100554, index: number) => {

                    return this.renderItem(item, index);

                }) as any
            )}
        </wcd-toolbox-itemmenu>
            
        `;

    }

    renderItem(item: IWCDMenuItem100554, index: number) {
        const tag = this.loadItemAndReturnTag(item.item)
        return html`
            <${tag} .args=${item.arg}>
            </${tag}>
        `
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

    private isLoad:string[] = [];
    private async loadItemAndReturnTag(file: string) {

        try {

            if (this.isLoad.includes(file)) return'';


            if (!file.startsWith('./')) file = './' + file;
            await import(file);
            return convertFileNameToTag(file.replace('./', ''))
            
        } catch (e) {
            return '';
        }
        
    }

    
    //--------CSS------------------------

    private css = `

        wcd-toolbox-item-action-menu-100554{
            display:block;
            height:17px;
            border:1px solid #d3cece;
            padding:.2rem;
            border-radius:5px;
            background:#fff;
        }

        wcd-toolbox-itemmenu{
            display:flex;
            height:20px;
            gap:.3rem;
            
        }

        

        wcd-toolbox-itemmenu a:hover{
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
    arg: string,
}