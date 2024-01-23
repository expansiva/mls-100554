/// <mls shortName="serviceDsDocView" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { initEditorQuillDocs, EditorQuillDocs100554 } from './_100554_editorQuillDocs'
import { IDocData } from './_100554_serviceDsDocList'
@customElement('service-ds-doc-view-100554')
export class ServiceDsDocView100554 extends ServiceBase {

    constructor() {
        super();
        initEditorQuillDocs();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property()
    doc: IDocData | undefined;

    @query('editor-quill-docs-100554')
    editor: EditorQuillDocs100554 | undefined;

    public details: IService = {
        icon: '&#xf06e',
        name: 'Documentation View',
        mode: 'B',
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
            this.onDSDocPageClicked(ev);
        });

        mls.events.addEventListener([3], ['DSDocSelected'], (ev) => {
            console.info('DSDocSelected view')

            if (!this.serviceItemNav) return;

            this.serviceItemNav.setAttribute('mode', 'A');
            this.openMe();
        });

        mls.events.addEventListener([3], ['DSDocUnSelected'], (ev) => {
            if (!this.serviceItemNav) return;
            this.serviceItemNav.setAttribute('mode', 'H');
        });
    }

    onDSDocPageClicked(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        this.doc = JSON.parse(ev.desc);
        if (this.editor && this.doc) this.editor.text = this.doc.content;
    }

    render() {
        return html`
            ${!this.doc ?
                html`
                <h4> No documentation selected!</h4>
                ` :
                html`
                <div style="padding: 1rem;">
                    <div style="display:flex; gap:1rem; justify-content: center;">
                        <button class="btn-docs">
                            <span>Add Child</span>
                            <i class="fa fa-plus"></i>
                        </button>
                        <button class="btn-docs">
                            <span>Remove this</span>
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                    <div style="width:100%; display: flex; align-items: center;">
                        <h1>${this.doc.title}</h1>
                    </div>
                    <editor-quill-docs-100554 opened="false"></editor-quill-docs-100554>
                </div>
            `}            
        `;
    }
}
