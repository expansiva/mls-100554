/// <mls shortName="serviceExploreProjects" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

/// **collab_i18n_start**
const message_pt = {
    inDevelopment: 'Em Desenvolvimento'
}

const message_en = {
    inDevelopment: 'in development'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-explore-projects-100554')
export class ServiceExploreProjects100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    private inFullscreen: boolean = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property()
    name: string = 'Somebody';


    //----------CONFIG SERVICE------------------

    public details: IService = {
        icon: '&#xf0b1',
        state: 'background',
        position: 'left',
        tooltip: 'Explore Projects',
        visible: true,
        widget: '_100554_serviceExploreProjects',
        level: [6]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Explore Projects',
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

        if (visible) {

            if (!this.inFullscreen) {
                this.setFullScreen(6, 'left')
                this.inFullscreen = true;
            }

        } else if (!visible) {

            if (this.inFullscreen) {
                this.setFullScreen(6, 'default')
                this.inFullscreen = false;
            }

        }

    }

    //----------EVENTS---------------------

    private setEvents() {
        mls.events.addEventListener([6], ['ProjectExplore'] as any, (details) => {
            this.openService('_100554_serviceExploreProjects', 'left', 6);
        });
    }


    //----------COMPONENT------------------

    connectedCallback() {
        this.setEvents();
    }

    render() {
        return html`<h2> ${this.msg.inDevelopment} !</h2>`;
    }

    //----------IMPLEMENTS------------------

}
