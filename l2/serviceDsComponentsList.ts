/// <mls shortName="serviceDsComponentsList" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-ds-components-list-100554')
export class ServiceDsComponentsList100554 extends ServiceBase {
    constructor() {
        super();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf229',
        name: 'Details Ds',
        mode: 'B',
        position: 'right',
        tooltip: 'Details Design System',
        tags: [],
        levels: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opResume') return true;
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Details',
        actions: {
            opOverview: 'Resume',
        },
        icons: {},
        actionDefault: 'opResume', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }


    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        this._onServiceClick(visible, reinit, el)
    }

    async _onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible && reinit) {
        }
    }

    setEvents() {

    }

    render() {
        return html`<p> Hello</p>`;
    }
}
