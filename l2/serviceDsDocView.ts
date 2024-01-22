/// <mls shortName="serviceDsDocView" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-ds-doc-view-100554')
export class ServiceDsDocView100554 extends ServiceBase {

    constructor() {
        super();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf06e',
        name: 'Documentation View',
        mode: 'H',
        position: 'right',
        tooltip: 'Documentation View',
        tags: ['ds_docs'],
        levels: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opView') return true;
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'View',
        actions: {
            opView: 'View',
        },
        icons: {},
        actionDefault: 'opView', // call after close icon clicked
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
        mls.events.addEventListener([3], ['DSDocPageClicked'], (ev) => {
            // this.onDSDocPageClicked(ev);
        });

        mls.events.addEventListener([this.level], ['DSDocSelected'], (ev) => {
            if (!this.serviceItemNav) return;
            this.serviceItemNav.setAttribute('mode', 'A');
            this.openMe();    
        });

        mls.events.addEventListener([this.level], ['DSDocUnSelected'], (ev) => {
            if (!this.serviceItemNav) return;
            this.serviceItemNav.setAttribute('mode', 'H');
        });
    }

    render() {
        return html`
            <div style="padding: 1rem; display:none;">
                <div style="display:flex; gap:1rem; justify-content: center;">
                    <button id="btnAddChildServiceL3SeeDocumentation" class="btn-docs">
                        <span>Add Child</span>
                        <i class="fa fa-plus"></i>
                    </button>
                    <button id="btnDelServiceL3SeeDocumentation" class="btn-docs">
                        <span>Remove this</span>
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                <div style="width:100%; display: flex; align-items: center;">
                    <h1 id="titleServiceL3SeeDocumentation" style="width:calc(100% - 35px)"></h1>
                </div>
                <editor-quill-docs-100554 opened="false"></editor-quill-docs-100554>
            </div>
        `;
    }
}
