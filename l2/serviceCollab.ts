/// <mls shortName="serviceCollab" project="100554" enhancement="_100541_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService } from './_100554_serviceBase';
import { IMenu } from './_100554_mlsToolbarService';

@customElement('service-collab-100554')
export class ServiceCollab extends ServiceBase {
    
    public details: IService = {
        icon: '&#xf1e6',
        name: 'Collab',
        mode: 'A',
        position: 'left',
        readOnly: false,
        tooltip: 'Collab',
        className: undefined,
        tags: [],
        levels: [5]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opAbout') return this.showAbout();
        if (op === 'opInitial') return this.showInitial();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Plugins',
        actions: {
            opAbout: 'About',
            opInitial: 'Plugins',
        },
        icons: {},
        actionDefault: 'opInitial', // call after close icon clicked
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

    }


    render() {
        return html`<p> Hello !</p>`;
    }
}
