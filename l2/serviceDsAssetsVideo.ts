/// <mls shortName="serviceDsAssetsVideo" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';


@customElement('service-ds-assets-video-100554')
export class ServiceDsAssetsVideo100554 extends ServiceBase {

    constructor() {
        super();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf53f',
        name: 'Colors',
        mode: 'H',
        position: 'right',
        tooltip: 'Colors',
        tags: ['ds_tokens'],
        levels: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opHelper') return this.showInitial();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Colors',
        actions: {
            opHelper: 'Colors',
        },
        icons: {},
        actionDefault: 'opHelper', // call after close icon clicked
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

    private setEvents() {

    }

        private showInitial(): boolean {
        this.menu.title = 'Assets';
        return true;
    }


    render() {
        return html`<p> Hello!</p>`;
    }
}
