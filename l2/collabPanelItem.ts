/// <mls shortName="collabPanelItem" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { convertTagToFileName } from './_100554_utilsLit';

@customElement('collab-panel-item-100554')
export class CollabPanelItem extends LitElement {

    @property({ type: String, reflect: true }) widget: string  = '';
    @property({ type: String, reflect: true }) badge: string = '';
    @property({ type: String, reflect: true }) loading: string  = 'loading';

    private myInfo: mls.plugin.IPluginData | undefined;

    //---------COMPONENT-------------

    createRenderRoot() {
        return this;
    }

    firstUpdated() {

        this.setMyInfo();
        
    }

    render() {

        let aux;
        if (this.badge) aux = unsafeHTML(`
            <collab-panel-item-badge>
                ${this.badge}
            </collab-panel-item-badge>
        `);

        this.setAttribute('filter', this.myInfo?.title +'');

        return html`
            <collab-panel-item class="${this.loading}">
                ${aux}
                <collab-panel-item-svg>
                    ${this.myInfo?.getSvg()}
                </collab-panel-item-svg>
                <collab-panel-item-info>
                    ${this.myInfo?.title}
                </collab-panel-item-info>
            </collab-panel-item>
        `;
    }

    //---------IMPLEMENT-------------

    private async setMyInfo() {
        if (!this.widget) return;

        const file = convertTagToFileName(this.widget);
        const modulePlugin = await import('./' + file);

        this.myInfo = modulePlugin.pluginData;
        this.setAttribute('loading', '');
        
    }

}