/// <mls shortName="collabIcaConfigAttributes" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ServiceBase } from '/_100554_/l2/serviceBase.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

export const initCollabICATree = '';

/// **collab_i18n_start**
const message_pt = {
    noItens: 'Nenhum item ICA foi encontrado!'
}

const message_en = {
    noItens: 'No ICA items were found!',

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('collab-ica-config-attributes-100554')
export class CollabICAAttributes extends CollabLitElement {

    private msg: MessageType = messages['en'];

    public myParent: ServiceBase | undefined;

    public myAttributes: {key:string, value:string}[] = [];

    constructor() {
        super();
        
    }

    //--------------COMPONENT---------------

    createRenderRoot() {
        return this;
    }

    shouldUpdate(changedProperties: Map<string | number | symbol, unknown>): boolean {
        super.shouldUpdate(changedProperties);
        this.setServicePreview();
        return true;
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        this.getMyAttributes();

        if (this.myAttributes && this.myAttributes.length > 0) return this.createItens();
        return html`<h3 style="padding:1rem">${this.msg.noItens}<h3>`;
    }

    createItens() {

        const obj = html`
            <ul>
                ${repeat(this.myAttributes,((key: {key:string}, idx: number) => key.key + idx) as any, 
                    ((item: {key:string, value:string}, index: any) => {

                        return this.renderItem(item, index);

                    }) as any
                )}
            </ul>
        `;

        return obj;

    }

    renderItem(item:{key:string, value:string}, idx: string) {

        return html`
            <li>
                <span>${item.key}</span>
                <input type="text" value="${item.value}"></input>
            </li>
        `;

    }

    //-------- IMPLEMENTATION --------------

    public forceUpdate(): void {
        this.requestUpdate();

    }

    private servicePreview: HTMLElement | undefined;
    private setServicePreview(): void {
        if (this.servicePreview || !this.myParent) return;

        const nav3 = this.myParent.nav3Service;
        if (!nav3) return;

        const wc = (nav3 as any).getActiveInstance('right');
        if (!wc) return;

        if (wc.tagName.toLowerCase() === 'service-preview-100554') {
            this.servicePreview = wc;
        }

    }

    private getMyAttributes():void {

        this.myAttributes = [];

        if(!this.servicePreview || !(this.servicePreview as any).serviceContent) return;
        const pvv = (this.servicePreview as any).serviceContent.querySelector('service-preview-view-100554') as HTMLElement;

        if(!pvv || !pvv.shadowRoot) return;

       const iframe = pvv.shadowRoot.querySelector('iframe') as HTMLIFrameElement;
       
       if(!iframe || !iframe.contentDocument) return;
       
       const wcd = iframe.contentDocument.body.querySelector('wcd-toolbox-100554') as HTMLElement;
       if(!wcd) return ;
       
       const parent = wcd.parentElement as any;
       
        if (!parent || !parent.info) return;

        const attrs = parent.info.element.getAtributtes();

        const ret:{key:string, value:string}[] = [];

        attrs.forEach((i:string) => {
            ret.push({
                key: i,
                value: parent.info.element.getAttribute(i)
            })
        });
       
       this.myAttributes = ret;
    }

}