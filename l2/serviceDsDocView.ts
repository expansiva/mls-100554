/// <mls shortName="serviceDsDocView" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { initEditorQuillDocs, EditorQuillDocs100554 } from './_100554_editorQuillDocs'
import { IDocData } from './_100554_serviceDsDocList'
import { collab_plus, collab_trash } from './_100554_collabIcons'

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

    @query('.title')
    docTitle: HTMLElement | undefined;

    public details: IService = {
        icon: '&#xf06e',
        state: 'background',
        tooltip: 'Documentation View',
        visible: false,
        position: "right",
        widget: '_100554_serviceDsDocView',
        level: [3]
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

    private setEvents() {
        mls.events.addEventListener([3], ['DSDocPageClicked'], (ev) => {
            this.onDSDocPageClicked(ev);
        });

        mls.events.addEventListener([3], ['DSDocSelected'], (ev) => {
            if (!this.serviceItemNav) return;
            this.serviceItemNav.setAttribute('mode', 'A');
            this.showNav2Item(true);
            this.openMe();
        });

        mls.events.addEventListener([3], ['DSDocUnSelected'], (ev) => {
            if (!this.serviceItemNav) return;
            this.serviceItemNav.setAttribute('mode', 'H');
            this.showNav2Item(false);
        });
    }

    private async onDSDocPageClicked(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        this.doc = JSON.parse(ev.desc);
        if (!this.editor) {
            await this.waitForEditorLoad();
        }
        if (this.editor && this.doc) this.editor.text = this.doc.content;
    }

    private waitForEditorLoad():Promise<void> {
        return new Promise((resolve, reject) => {
            const intervalId = setInterval(() => {
                if (this.editor) {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 1000);

            setTimeout(() => {
                clearInterval(intervalId);
                reject('Editor not found');
            }, 5000);
        });
    }

    private fireComunication(op: 'Open' | 'Add' | 'Change' | 'Update' | 'Delete'): void {

        this.setError('');

        if (!this.doc) {
            this.setError('No documentation selected.');
            return;
        }

        if (op === 'Delete' && this.doc.hasChildren) {
            this.setError('Please, remove the subitens first.');
            return;
        }

        if (!this.docTitle || !this.editor) return;
        this.doc.title = this.docTitle.innerText;
        this.doc.content = this.editor.text;
        this.doc.op = op;
        const json = JSON.stringify(this.doc);
        mls.events.fire([3], ['DSDocPageChanged'], json);
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
                        <button class="btn-docs" @click=${() => { this.fireComunication('Add') }}>
                            <span>Add Child</span>
                            ${collab_plus}
                        </button>
                        <button class="btn-docs" @click=${() => { this.fireComunication('Delete') }}>
                            <span>Remove this</span>
                            ${collab_trash}
                        </button>
                    </div>
                    <div style="width:100%; display: flex; align-items: center;">
                        <h1 contenteditable class="title" @blur=${() => { this.fireComunication('Update') }}>${this.doc.title}</h1>
                    </div>
                    <editor-quill-docs-100554 opened="false" .cbFinishEdit=${() => { this.fireComunication('Change') }}></editor-quill-docs-100554>
                </div>
            `}            
        `;
    }
}
