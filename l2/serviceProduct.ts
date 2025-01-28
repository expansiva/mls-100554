/// <mls shortName="serviceProduct" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';

import './_100554_pluginGithubL4Project';
import './_100554_pluginGithubL4Issues';

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
        if (this.menu.setMode) this.menu.setMode('initial');
    }

    public onClickTabs(index: number) {
        this.activeTab = ISceneries[index]
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: 0,
            options: [
                { text: 'Requirements', icon: 'f0a6' },
            ]
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),

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
            case 'IRequirements':
                return this.renderRequirements();
            default:
                return html``;
        }
    }

    renderRequirements() {
        return html`
        <plugin-github-l4-issues-100554 labelfilter="feature request">
        </plugin-github-l4-issues-100554>`
    }


    //----------IMPLEMENTS------------------

}

enum ISceneries {
    'IRequirements' = 0
}