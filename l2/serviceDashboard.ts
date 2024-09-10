/// <mls shortName="serviceDashboard" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import './_100554_collabTiles';

@customElement('service-dashboard-100554')
export class ServiceDashboard100554 extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf201',
        state: 'foreground',
        position: 'left',
        tooltip: 'Service Dashboard',
        visible: true,
        widget: '_100554_serviceDashboard',
        level: [6]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Dashboard',
        actions: {
        },
        icons: {},
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    @property()
    name: string = 'Somebody';

    render() {
        return html`<collab-tiles-100554></collab-tiles-100554>`;
    }
}
