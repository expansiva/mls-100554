/// <mls shortName="serviceFca" project="100554" enhancement="_100554_enhancementLitService" groupName="service" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-fca-100554')
export class ServiceFca100554 extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf15b',
        state: 'foreground',
        position: 'right',
        tooltip: 'Service Example',
        visible: true,
        widget: '_100554_serviceFca',
        level: [5]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Example',
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
        return html`<p> Hello, ${ this.name } !</p>`;
    }
}
