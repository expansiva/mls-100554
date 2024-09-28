/// <mls shortName="serviceWorkspace" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-workspace-100554')
export class ServiceWorkspace100554 extends ServiceBase {

    @property() msize: string = '';

    static styles = css``;

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

            ITasks: 'Tasks;f0ae',
            IBackLog: 'BackLog;e5a0',
            IRequirements:'Requirements;f0a6',
            IChat:'Chat;f086'

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

    renderTasks() {
        return html`
        <div style="padding:2rem">
            Here are the plugins that integrate or manage the project's current tasks - under development
        </div>`
    }

    renderBackLog() {
        return html`
        <div style="padding:2rem">
            Here are the plugins that integrate or manage the project's issues and requests - under development
        </div>`
    }

    renderRequirements() {
        return html`
        <div style="padding:2rem">
            Here the plugins that manage requirements, organized by categories such as "Functional", "Non-Functional", "Technical" or by priorities such as "MoSCoW" - in development
        </div>`
    }

    renderChat() {
        return html`
        <div style="padding:2rem">
            Here are the plugins that manage communication with the team, such as slack channels - under development
        </div>`
    }

    //----------IMPLEMENTS------------------

    
}