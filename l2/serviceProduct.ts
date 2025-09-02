/// <mls shortName="serviceProduct" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';

import './_100554_widgetMindMapL4';

@customElement('service-product-100554')
export class ServiceWorkspace100554 extends ServiceBase {

    @property() msize: string = '';

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() activeTab: string = 'ITasks';

    //----------SERVICE--------------------
    public details: IService = {
        icon: '&#xf6ff',
        state: 'foreground',
        position: 'left',
        tooltip: 'Product',
        visible: true,
        widget: '_100554_serviceProduct',
        level: [1, 2, 3, 4, 5, 6, 7]
    }

    public onClickMain(op: string) {
        if (op === 'opAboutThis') this.showAboutThis();
        else if (this.menu.setMode) this.menu.setMode('initial');
        
    }

    public onClickTabs(index: number) {
        this.activeTab = ISceneries[index]
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    public menu: IServiceMenu = {
        title: '',
        main: {
            opAboutThis: 'About this content',
        },
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: 0,
            options: [
                { text: 'MindMap', icon: 'f5dc' },
            ]
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),

    }

    private showAboutThis(): boolean {

        const div = document.createElement('div');
        div.style.padding = '1rem';

        let name = 'nothing selected';

        switch (this.activeTab) {
            case 'IMindMap':
                name = 'widget-mind-map-l4-100554';
                break;
            default:
                name = 'nothing selected';
        }

        div.innerHTML = `
        
            <h3>About this content</h3>
            <ul>
                <li>Reference: ${name}</li>
                <li>Level: ${this.level}</li>
                <li>Position: ${this.position}</li>
            </ul>
		

        `;

        if (this.menu.setMode) this.menu.setMode('page', div);
        return true;
        
    }

    //------------COMPONENT-----------------

    updated(changedProperties: any) {
        super.updated(changedProperties);
        if (!this.visible) return;
        const [w, h] = this.msize.split(',');
    }

    render() {
        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {
        switch (this.activeTab) {
            case 'IMindMap':
                return this.renderMindMap();
            default:
                return html``;
        }
    }

    renderMindMap() {
        return html`
        <widget-mind-map-l4-100554></widget-mind-map-l4-100554>`
    }


    //----------IMPLEMENTS------------------

}

enum ISceneries {
    'IMindMap' = 0
}