/// <mls shortName="collabPanelItem" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { convertTagToFileName, convertFileNameToTag } from '/_102027_/l2/utils';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js'; 

@customElement('collab-panel-item-100554')
export class CollabPanelItem extends CollabLitElement {

    @property({ type: String, reflect: true }) widget: string = '';
    @property({ type: String, reflect: true }) badge: string = '';
    @property({ type: String, reflect: true }) loading: string = 'loading';
    @property({ type: String, reflect: true }) mode: 'html' | 'tag' = 'html';

    private myInfo: mls.plugin.IPluginData | undefined;

    //---------COMPONENT-------------

    createRenderRoot() {
        return this;
    }

    firstUpdated() {

        this.setMyInfo();

    }

    render() {

        this.onclick = () => this.clickItem();

        let aux;
        if (this.badge) aux = unsafeHTML(`
            <collab-panel-item-badge>
                ${this.badge}
            </collab-panel-item-badge>
        `);

        this.setAttribute('filter', this.myInfo?.title + '');

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

    private clickItem(): void {

        if (!this.classList.contains('active')) {

            let parent = this.closest('collab-panel-100554') as HTMLElement;
            if (!parent) return;

            parent = parent.parentElement as HTMLElement;
            if (!parent) return;

            const elActive = parent.querySelector('.active');
            if (elActive) elActive.classList.remove('active');

            this.classList.add('active');
        }

        mls.actual[0].setFullName(this.widget);
        const options = {
            shortName: mls.actual[0].path,
            project: mls.actual[0].project,
            htmlText: ''
        }

        if (this.mode === 'tag') {

            const infoPathWidget = mls.l2.getPath(this.widget);
            const tag = convertFileNameToTag(infoPathWidget);
            options.htmlText = `<${tag}></${tag}>`
        }

        mls.events.fire(
            mls.actualLevel as any,
            'PluginDetails' as any,
            JSON.stringify(options),
            0
        );

    }

    private async setMyInfo() {
        if (!this.widget) return;
        const file = mls.l2.getPath(this.widget);
        const modulePlugin = await import('/' + `_${file.project}_/l2/${file.shortName}`);
        this.myInfo = modulePlugin.pluginData;
        this.setAttribute('loading', '');

    }

}