/// <mls shortName="serviceDsDocList" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { collab_plus, collab_chevron_right } from './_100554_collabIcons';

/// **collab_i18n_start**
const message_pt = {
    loading: 'Carregando...',
    add: 'Adicionar'
}

const message_en = {
    loading: 'Loading...',
    add: 'Add'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('service-ds-doc-list-100554')
export class ServiceDsDocList100554 extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    constructor() {
        super();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;
    
    @property()
    list: IDocNode[] = [];

    @property()
    docIdSelected: number = 0

    @property({ type: Boolean, }) loading: boolean = true;

    @query('.list-docs-container')
    containerMain: HTMLElement | undefined;

    lastDsIndex: number | undefined;
    lastProject: number | undefined;
    dsInstance: mls.l3.DesignSystemIO | undefined;

    public details: IService = {
        icon: '&#xf02d',
        state: 'foreground',
        tooltip: 'Documentation List',
        visible: true,
        position: "left",
        tags: ['ds_docs'],
        widget: '_100554_serviceDsDocList',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opList') return true;
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'List',
        actions: {
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

        if (visible) mls.events.fire([3], ['DSDocSelected'], 'Doc Selected', 1000);
        else mls.events.fire([3], ['DSDocUnSelected'], 'Doc UnSelected', 0);

        if (reinit) {
            const { project } = mls.actual[5];
            const { mode } = mls.actual[3];
            if (this.lastProject !== project || this.lastDsIndex !== mode) {
                this.getState();
            }
        }
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.getState();
        this.loading = false;

        const firstItem = this.list[0].item?.id
        if (firstItem) this.selectDoc(firstItem);

    }

    setEvents() {
        mls.events.addEventListener([3], ['DSDocPageChanged'], (ev) => {
            this.onDocPageChanged(ev);
        });
    }

    async getState() {
        const allDocs = await this.getListDocs();
        this.list = this.createFolderStructure(allDocs);
    }

    async getListDocs(): Promise<mls.l3.IDocInfo[]> {
        const { project } = mls.actual[5];
        const { mode } = mls.actual[3];


        if (project === undefined || mode === undefined) return [];
        const dss = mls.l5.ds.list(project);
        this.lastDsIndex = mode;
        this.lastProject = project;
        const dsInfo = dss[mode];
        if (!dsInfo) return [];


        this.dsInstance = mls.l3.getDSInstance(project, mode);
        await this.dsInstance.init();
        this.list = [];
        const allItems: mls.l3.IDocInfo[] = [];

        Object.keys(this.dsInstance.docs.list).forEach((doc: any) => {
            if (!this.dsInstance) return;
            allItems.push(this.dsInstance.docs.list[doc]);
        });
        return allItems;
    }

    createFolderStructure(arr: mls.l3.IDocInfo[]): IDocNode[] {
        const map = new Map();
        const root: IDocNode = {
            id: 0,
            item: undefined,
            children: []
        };
        map.set(0, root);
        for (const obj of arr) {
            const { id, parentID } = obj;
            const folder: IDocNode = {
                id,
                item: obj,
                children: []
            };
            if (map.has(parentID)) {
                const parentFolder = map.get(parentID);
                parentFolder.children.push(folder);
                map.set(id, folder);
            }
        }
        return root.children;
    }

    private onDocPageChanged(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const st: IDocData = JSON.parse(ev.desc);
        if (st.op === 'Add') this.addDoc(st.id);
        if (st.op === 'Change') this.changedMe(st.id, st.content);
        if (st.op === 'Update') this.updateDoc(st.id, st.parentID, st.title);
        else if (st.op === 'Delete') this.removeDoc(st.id);
    }

    private async addDoc(parentID: number) {
        if (!this.dsInstance) return;
        const idx = await this.dsInstance.docs.add(parentID, 'NewDocument', 'Describe your new documentation here');
        await this.getState();
        this.selectDoc(idx);
    }

    private async changedMe(id: number, content: string) {
        if (!this.dsInstance) return;
        const doc = this.dsInstance.docs.list[id];
        if (!doc) return;
        doc.setContent(content);
    }

    private async updateDoc(id: number, parentID: number, title: string) {
        if (!this.dsInstance) return;
        await this.dsInstance.docs.update(id, parentID, title, '');
        this.getState();
    }

    private async removeDoc(id: number) {
        if (!this.dsInstance) return;
        if (!this.containerMain) return;
        const el = this.containerMain.querySelector(`details[docId = "${id}"]`);
        if (!el) return;
        const doc = this.dsInstance.docs.list[id];
        let nextEl = el.nextElementSibling || el.closest(`details[docId = "${doc.parentID}"]`);
        nextEl = nextEl || el.previousElementSibling;
        const nextElId = nextEl?.getAttribute('docId');
        await this.dsInstance.docs.remove(id);
        await this.getState();
        if (nextElId) this.selectDoc(+nextElId);

    }

    private async addNewDoc() {
        let selectedParentIndex = 0;
        this.addDoc(selectedParentIndex);
    }

    private selectDoc(id: number): void {
        setTimeout(() => {
            let docToSelect: HTMLElement | undefined;
            if (!this.containerMain) return;
            docToSelect = this.containerMain.querySelector(`details[docId = "${id}"]`) as HTMLElement;
            if (docToSelect) docToSelect.click();
        }, 100)

    }

    private onDetailsClick(doc: IDocNode, e: MouseEvent) {
        this.docIdSelected = doc.id;
        const target = e.target as HTMLElement;
        const details = target.closest('details') as HTMLDetailsElement;
        const summary = details.querySelector('summary') as HTMLElement;
        const isSelected = summary.classList.contains('selected');
        e.stopPropagation();

        if (details.open && !isSelected) e.preventDefault();
        if (isSelected) {
            return;
        }
        this.seeDocumentation(doc.item, doc.item?.title, doc.children.length > 0);

    }

    private async seeDocumentation(item: mls.l3.IDocInfo | undefined, title: string | undefined, hasChildren: boolean) {
        if (!item || !title) return;
        const text = await item.getContent();
        const obj: IDocData = {
            op: 'Open',
            title,
            content: text,
            id: item.id,
            parentID: item.parentID,
            hasChildren
        };

        mls.events.fire([3], ['DSDocPageClicked'], JSON.stringify(obj));
    }

    renderList(items: IDocNode[]): any {

        return items.map((doc) => html`
            <details
                class="${doc.children.length > 0 ? '' : 'nochildren'}"
                docId="${doc.id.toString()}"
                parentId="${doc.item?.parentID.toString()}"
                @click=${(e: MouseEvent) => { this.onDetailsClick(doc, e); }}
            >
                <summary class= "${doc.id === this.docIdSelected ? 'selected' : ''}" >
                    <div>
                        <p>${doc.item?.title}</p>
                        <span></span>
                        ${collab_chevron_right}
                    </div>
                </summary>
                ${doc.children.length > 0 ? html`<div style="padding-left:1rem">${this.renderList(doc.children)}<div>` : ''}
            </details>
            `);
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang]

        return html`
            <div>
                ${this.loading
                ? html`<p>${this.msg.loading}</p>`
                : html`
                <div>
                    <div class="list-docs-container">
                        ${this.renderList(this.list)}
                    </div>
                    <div class="list-docs-actions">
                        <button @click=${() => { this.addNewDoc(); }}>
                            <span>${this.msg.add}</span>
                            ${collab_plus}
                        </button>
                    </div>
                    

                </div>`
            }`;
    }

}

interface IServiceDocs {
    list: IDocNode[],
    docIdSelected: number
}

interface IDsSelectEvent {
    emitter: 'right' | 'left',
    value: number
}

export interface IDocData {
    op: 'Open' | 'Add' | 'Update' | 'Change' | 'Delete',
    title: string,
    content: string,
    id: number,
    parentID: number
    hasChildren: boolean,
}

interface IDocNode {
    id: number,
    item: mls.l3.IDocInfo | undefined,
    children: IDocNode[]
}
