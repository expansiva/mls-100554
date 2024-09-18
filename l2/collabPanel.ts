/// <mls shortName="collabPanel" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import './_100554_collabPanelItem';
@customElement('collab-panel-100554')
export class CollabPanel extends LitElement {

    @query('details') detail: HTMLDetailsElement | undefined;

    @property({ type: Boolean, reflect: true }) open = true;
    @property({ reflect: true }) icon = '';

    public myData: mls.plugin.MenuAction[] = [];

    //---------COMPONENT-------------

    createRenderRoot() {
        return this;
    }

    render() {

        if (!this.myData || this.myData.length === 0) {
            return html`<h3 style="margin-left:1rem">Not found plugins</h3>`
        }

        const category = this.myData[0].category;

        if(!this.icon) this.icon = this.open ? unsafeHTML(this.minus) : unsafeHTML(this.plus);

        return html`
            <details open="${this.open}">
                <summary @click=${this.changeSummary}>
                    <paneltitle>${category}</paneltitle>
                    <panelicon>${this.icon}</panelicon>
                </summary>
                <collab-panel-content>
                    ${repeat(this.myData, (
                        (key: mls.plugin.MenuAction, idx: number) => key.widget + idx) as any,
                        ((item: mls.plugin.MenuAction, index: any) => {

                            return this.renderItem(item, index);

                        }) as any
                    )}
                </collab-panel-content>
            </details>
            <style>${this.myCss}</style>
        `;
    }

    renderItem(item: mls.plugin.MenuAction, index: number) {

        return html`
            <collab-panel-item-100554 widget="${item.widget}">
            </collab-panel-item-100554>
        `
    }
    

    //---------IMPLEMENT-------------

    private changeSummary(): void {
    
        this.icon = !this.detail?.open ? unsafeHTML(this.minus) : unsafeHTML(this.plus);
    }

    private minus = '<svg xmlns="http://www.w3.org/2000/svg" style="width:15px"  viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>';

    private plus = '<svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>'

    private myCss = `
        collab-panel-100554{
            width: 97%;
            padding:.5rem;
            background:#fff;
            border-radius:3px;
            display:block;
        }

        collab-panel-100554 details{
            width:calc100%;

        }

        collab-panel-100554 summary{
            width:calc(100% - 15px);
            display:flex;
            user-select:none;
            text-transform: uppercase;
            font-weight: 600;
            cursor:pointer;
        }

        collab-panel-100554 paneltitle{
            width: calc(100% - 17px);
            display:block;
            padding-left: 1rem;
        }

        collab-panel-100554 panelicon{
            width: width:15px;
            display:block;
        }

        collab-panel-100554 collab-panel-content{
            display: flex;
            gap: 1rem;
            width: calc(100% - 35px);
            padding: 1rem;
            flex-wrap: wrap;
        }
        
        collab-panel-item-100554.active {
            text-decoration: underline;
        }

        collab-panel-item-100554 {
            display:block;
            min-width:7em;
            min-height:40px;
            cursor:pointer;
            padding-right: 2em;
        }

        collab-panel-item-100554 collab-panel-item{
            display:flex;
            width:100%;
            height:100%;
            align-items: center;
            position:relative;
        }

        collab-panel-item-100554 collab-panel-item-svg{
            display:flex;
            padding:4px;
            align-items: center;
            justify-content:center;
            
        }

        collab-panel-item-100554 collab-panel-item-info{
            display:block;
            padding:.5rem 0 ;
            color: #6b6be6;
        }

        collab-panel-item-100554 collab-panel-item-badge{
            position:absolute;
            top: 26px;
            left: -1px;
            background:red;
            color:#fff;
            font-size:.7rem;
            padding:.2rem;
            border-radius:50%;
            width:1rem;
            display:flex;
            justify-content:center;
            align-items:center;
        }

        collab-panel-item-100554 .loading {
            background-color:  #ededed;
            background: linear-gradient(
                100deg,
                rgba(255, 255, 255, 0) 40%,
                rgba(255, 255, 255, .5) 50%,
                rgba(255, 255, 255, 0) 60%
            )  #ededed;
            background-size: 200% 100%;
            background-position-x: 180%;
            animation: 1s loading ease-in-out infinite;
        }

        @keyframes loading {
            to {
                background-position-x: -20%;
            }
        }
    
    `

}