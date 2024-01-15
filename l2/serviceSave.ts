/// <mls shortName="serviceSave" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


/**
 * @mlsComponentDetails {"webComponentDependencies": ["mls-toolbar-service-100554"]}
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService } from './_100554_serviceBase';
import { IMenu, initToolbar } from './_100554_mlsToolbarService';

@customElement('service-save-100554')
export class ServiceSave extends ServiceBase {

    constructor() {
        super();
        initToolbar();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf15b',
        name: 'Save',
        mode: 'A',
        position: 'all',
        readOnly: false,
        tooltip: 'Save',
        className: undefined,
        tags: [],
        levels: [5,4,2]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opAbout') return this.showAbout();
        if (op === 'opSave') return this.showInitial();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Save',
        actions: {
            opAbout: 'About',
            opSave: 'Save',
        },
        icons: {},
        actionDefault: 'opSave', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
    }

    private showInitial(): boolean {
        return true;
    }

    private showAbout(): boolean {
        const div1 = document.createElement('div');
        div1.innerHTML = '<h1>About this Service</h1>'
        if (this.menu.setMode) this.menu.setMode('page', div1);
        return true;
    }

    onServiceClick(visible: boolean, reinit: boolean) {

        if (visible && reinit) {
            
        }
    }

    
    render() {

        return html`
            <mls-toolbar-service-100554 .mlsService=${this} widget="service-save-100554">
            </mls-toolbar-service-100554>
            <section>
            teste
            </section>
        `
    }


}