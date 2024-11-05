/// <mls shortName="serviceWorkspace" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

import './_100554_pluginGithubL4Project';
import './_100554_pluginGithubL4Issues';

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

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        this.activeTab = op;
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    public menu: IMenu = {
        title: '',
        actions: {
        },
        icons: {

            ITasks: 'Project;f0ae',
            IBackLog: 'Issues;e5a0',
            IRequirements: 'Requirements;f0a6',
            IChat: 'Chat;f086'

        },
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        iconDefault: 'ITasks',
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon,
        getLastMode: undefined,
        updateTitle: undefined
    }

    //------------COMPONENT-----------------

    firstUpdated() {

    }

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