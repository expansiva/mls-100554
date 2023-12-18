/// <mls shortName="serviceCollab" project="100554" enhancement="_100541_enhancementLit" groupName="service" />

import { html, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService } from './_100554_serviceBase';
import { IMenu } from './_100554_mlsToolbarService';

@customElement('service-collab-100554')
export class ServiceCollab extends ServiceBase {

    @property({ type: String }) html: string | null = null;

    @query('.service-collab-container')
    private container: HTMLDivElement | undefined;

    public details: IService = {
        icon: '&#xf1e6',
        name: 'Collab',
        mode: 'A',
        position: 'left',
        readOnly: false,
        tooltip: 'Collab',
        className: undefined,
        tags: [],
        levels: [0, 1, 2, 3, 4, 5, 6, 7]
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


    private isUserLoaded(): boolean {
        const user = localStorage.getItem('loginUser');
        return !!user;
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.getHTMLFile();
        this.requestUpdate(); // Trigger a re-render
    }

    async getHTMLFile() {
        if (!this.isUserLoaded()) {
            this.html = 'In Development';
            return;
        }
        mls.actual[0].setFullName(this.listComponentsMLS2[this.level as mls.events.Level]);
        const { project, path } = mls.actual[0];

        if (window.location.href.startsWith('https://multilevelstudio.com/mls2.html')) {
            mls.l4.updatePage(this.container as HTMLDivElement, project, path, true);
        } else {
            fetch(`./${path}.html`)
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error('Failed to fetch the HTML');

                })
                .then((html) => {
                    this.html = html;
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }


    onServiceClick(visible: boolean, reinit: boolean) {

    }

    private listComponentsMLS2 = {
        0: '_100529_mlsStartL0',
        1: '_100529_mlsStartL1',
        2: '_100529_mlsStartL2',
        3: '_100529_mlsStartL3',
        4: '_100529_mlsStartL4',
        5: '_100529_mlsStartL5',
        6: '_100529_mlsStartL6',
        7: '_100529_mlsStartL7',
    }


    render() {
        return html`
            <mls-toolbar-service-100554 widget="service-collab-100554"></mls-toolbar-service-100554>
            <div class="service-collab-container">
                ${unsafeHTML(this.html || '')}
            </div>
        `
    }
}
