/// <mls shortName="serviceProduct" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js'; 
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase'; 

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

            IRequirements:'Requirements;f0a6',
            IProject: 'Project;f0ae',
            

        },
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        iconDefault: 'IRequirements',
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
            case 'IProject':
                return this.renderProject();
            case 'IRequirements':
                return this.renderRequirements();
            default:
                return html``;
        }
    }

    renderProject() {
        return html`
        <plugin-github-l4-project-100554>
        </plugin-github-l4-project-100554>`
    }

    renderRequirements() {
        return html`
        <plugin-github-l4-issues-100554 labelfilter="feature request">
        </plugin-github-l4-issues-100554>`
    }

    
    //----------IMPLEMENTS------------------
    
}