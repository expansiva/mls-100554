/// <mls shortName="serviceDsDocList" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-ds-doc-list-100554')
export class ServiceDsDocList100554 extends ServiceBase {
    constructor() {
        super();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf02d',
        name: 'Documentation List',
        mode: 'H',
        position: 'left',
        tooltip: 'Documentation List',
        tags: ['ds_docs'],
        levels: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opList') return true;
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'List',
        actions: {
            opList: 'List',
        },
        icons: {},
        actionDefault: 'opList', // call after close icon clicked
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
