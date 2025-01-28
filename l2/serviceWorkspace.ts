/// <mls shortName="serviceWorkspace" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';

import './_100554_pluginGithubL4Project';
import './_100554_pluginGithubL4Issues';
import './_100554_pluginConfigLinks';

@customElement('service-workspace-100554')
export class ServiceWorkspace100554 extends ServiceBase {

    @property() msize: string = '';

    @property() activeTab: string = 'ITasks';

    //----------SERVICE--------------------
    public details: IService = {
        icon: '&#xf4ce',
        state: 'foreground',
        position: 'left',
        tooltip: 'Workspace',
        visible: true,
        widget: '_100554_serviceWorkspace',
        level: [1, 2, 3, 4, 5, 6, 7]
    }

    public onClickMain(op: string) {
        if (this.menu.setMode) this.menu.setMode('initial');
    }

    public onClickTabs(index: number) {
        this.activeTab = ISceneries[index];
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    public menu: IServiceMenu = {
        title: '',
        main: {
        },
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: 0,
            options: [
                { text: 'Links', icon: 'f0c1' },
                { text: 'Project', icon: 'f0ae' },
                { text: 'Issues', icon: 'e5a0' },
                { text: 'Requirements', icon: 'f0a6' },
                { text: 'Chat', icon: 'f086' },

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
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        if (name === 'msize') {
            const [width, height, top, left] = this.msize.split(',');
            if (height) this.style.height = height + 'px';
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }

    render() {
        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {
        switch (this.activeTab) {
            case 'ILinks':
                return this.renderLinks();
            case 'ITasks':
                return this.renderTasks();
            case 'IBackLog':
                return this.renderBackLog();
            case 'IRequirements':
                return this.renderRequirements();
            case 'IChat':
                return this.renderChat();
            default:
                return html``;
        }
    }

    createRenderRoot() {
        return this;
    }

    renderLinks() {
        return html`
        <plugin-config-links-100554 autoPrepare>
        </plugin-config-links-100554>`
    }

    renderTasks() {
        return html`
        <plugin-github-l4-project-100554 autoclick="true">
        </plugin-github-l4-project-100554>`
    }

    renderBackLog() {
        return html`
        <plugin-github-l4-issues-100554>
        </plugin-github-l4-issues-100554>`
    }

    renderRequirements() {
        return html`
        <plugin-github-l4-issues-100554 labelfilter="feature request">
        </plugin-github-l4-issues-100554>`
    }

    renderChat() {
        return html`
        <div style="padding:2rem">
            Here are the plugins that manage communication with the team, such as slack channels - under development
        </div>`
    }

    //----------IMPLEMENTS------------------


}

enum ISceneries {
    'ILinks' = 0,
    'ITasks' = 1,
    'IBackLog' = 2,
    'IRequirements' = 3,
    'IChat' = 4,
}