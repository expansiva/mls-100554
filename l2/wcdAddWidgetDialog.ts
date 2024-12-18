/// <mls shortName="wcdAddWidgetDialog" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { WCDOverlayMethods } from './_100554_wcdTypes';
import { CollabLitElement } from './_100554_collabLitElement'
import { globalWcd } from './_100554_wcdState';

/// **collab_i18n_start**
const message_pt = {
    add: 'Adicionar',
    placeholder:'digite palavras chaves para buscar o widget, e pressione Enter',
}

const message_en = {
    add: 'Add',
    placeholder: 'type keywords to search widget, and press Enter'
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('wcd-add-widget-dialog-100554')
export class WcdAddWidgetDialog100554 extends CollabLitElement {

    private msg: MessageType = messages['en'];
    private lastIca: HTMLElement | undefined;
    private lastHeight: string | undefined;
    private allWidgets: IWidgets[] = [];

    @query('#prompt-input') prompt: HTMLInputElement | undefined;

    @property() error: string = '';
    @property() listWidgets: IWidgets[] = [];

    //-------COMPONENT----------

    disconnectedCallback() {
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (globalWcd.elICA) globalWcd.elICA.style.height = this.lastHeight || '';
        else if (this.lastIca)  this.lastIca.style.height = this.lastHeight || '';
        super.disconnectedCallback();
    }

    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
        if (this.prompt) this.prompt.focus();
        this.getWidgets();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('listWidgets')) {
            this.recalculeIcaHeight();
        }
    }

    render() {

        this.lastIca = globalWcd.elICA;
        if (!this.lastHeight) this.lastHeight = globalWcd.elICA?.style.height;
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (this.error) return this.renderError();

        return this.renderWidgets();
    }

    renderHeader() {
        return html`
        <div class="prompt-content">
            <input type="text" id="prompt-input" @keydown=${this.handleKeyDown.bind(this)}  placeholder=${this.msg.placeholder}/>
        </div>
        `
    }

    renderError() {
        return html`
            ${this.renderHeader()}
            <h3>${this.error}</h3>
        
        `
    }

    renderWidgets() {
        return html`
            ${this.renderHeader()}
            <gallery>
                ${repeat(this.listWidgets, ((key: IWidgets) => key.nome) as any, ((k: IWidgets, index: any) => { return this.renderItemGallery(k, index); }) as any)}
            </gallery>
        
        `
    }

    renderItemGallery(item: IWidgets, idx: number) {

        return html`
            <gallery-item @click="${this.add}" .info=${item}>
                ${unsafeHTML(item.svg)}
                ${item.nome}
            </gallery-item>
        `;
        
    }



    //------IMPLEMENTS----------

    private async handleKeyDown(event: KeyboardEvent) {
        event.stopPropagation();
        if (event.key === 'Enter') {    
            this.filter(this.prompt?.value);
        }
    }

    private filter(filter: string = '') {

        const f = this.allWidgets.filter((f) => f.nome.toLowerCase().indexOf(filter) >= 0);
        this.listWidgets = f;
        
    }

    private add(e:MouseEvent) {

        let el = e.target as HTMLElement;
        if (el.tagName !== 'gallery-item') {
            el = el.closest('gallery-item') as HTMLElement;
        }

        if (!el || !(el as any).info) return;
        const info = (el as any).info as IWidgets;

        console.info('add: ' + info.nome);

    }

    private recalculeIcaHeight() {
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (!globalWcd.elICA) throw new Error('Invalid window.wcdState.elICA');
        const height = this.getBoundingClientRect()?.height;
        if (this.lastHeight === undefined) this.lastHeight = (globalWcd.elICA as any).style.height;
        (globalWcd.elICA as any).style.height = height + 'px';
    }

    private getWidgets() {

        const x = [
            {
                nome: 'Input',
                cat: 'Form',
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>`,
                exDefault: '<input-100554 type="text">Input</input-100554>'
            },
            {
                nome: 'Text',
                cat: 'Apresentation',
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l128 0 0 352c0 17.7 14.3 32 32 32s32-14.3 32-32l0-352 128 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 32 32 32z"/></svg>`,
                exDefault: '<text-100554>Text</text-100554>'
            },
            {
                nome: 'Button',
                cat: 'Action',
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 192l176 0L176 0 160 0C71.6 0 0 71.6 0 160l0 32zm0 32L0 352c0 88.4 71.6 160 160 160l64 0c88.4 0 160-71.6 160-160l0-128-192 0L0 224zm384-32l0-32C384 71.6 312.4 0 224 0L208 0l0 192 176 0z"/></svg>`,
                exDefault: '<button-100554>button</button-100554>'
            }

        ];

        
        this.allWidgets = [...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x];

        this.listWidgets = [...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x, ...x];
        
    }

}

interface IWidgets{
    nome: string,
    cat: string,
    svg: string,
    exDefault: string,
}