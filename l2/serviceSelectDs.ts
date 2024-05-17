/// <mls shortName="serviceSelectDs" project="100554" enhancement="_100554_enhancementLit" groupName="services" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { initServiceSelectDsAdd } from './_100554_serviceSelectDsAdd'
import { collab_file, collab_undo, collab_location_dot, collab_unbalanced } from './_100554_collabIcons'

/// **collab_i18n_start**
const message_pt = {
    noDesignSystem: 'Nenhum sistema de design neste projeto, por favor clique em adicionar para começar a criar um novo sistema de design.',
    addNew: 'Adicionar novo sistema de design'
}

const message_en = {
    noDesignSystem: 'No design system in this project, please click add to start a create a new design system.',
    addNew: 'Add new design system ',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-select-ds-100554')
export class ServiceSelectDs100554 extends ServiceBase {

    private msg: MessageType = messages['en'];
     
    constructor() {
        super();
        initServiceSelectDsAdd();
        this.setEvents();
    }


    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf15b',
        state: 'foreground',
        tooltip: 'Select Ds',
        visible: true,
        position: "left",
        widget: '_100554_serviceSelectDs',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opSelect') return this.showHelper();
        if (op === 'opAdd') return this.showAdd();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Select Design System',
        actions: {
            opAdd: 'Add',
        },
        icons: {},
        actionDefault: 'opSelect', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }


    @property()
    state: IState = { history: [], actualProject: undefined, ds: [], dsSelected: undefined };


    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        this._onServiceClick(visible, reinit, el)
    }

    private async _onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    private showHelper(): boolean {
        return true;
    }

    private showAdd(): boolean {
        const sectionAdd = document.createElement('service-select-ds-add-100554');
        (sectionAdd as any)['service'] = this;
        if (this.menu.setMode) this.menu.setMode('page', sectionAdd);
        return true;
    }

    private setEvents() {
        mls.events.addEventListener([3], ['DSChanged'] as any, (ev) => {
            this.toogleBadge(true, '_100554_serviceSave')
        });

        mls.events.addEventListener([5], ['ProjectSelected'], (ev) => {
            if (!ev.desc) return;
            const data: IParamsEvent = JSON.parse(ev.desc);
            if (data.value) {
                this.state.actualProject = data.value;
                this.requestUpdate();
                setTimeout(() => {
                    this.fireOpenDetails();
                }, 1000)
            }

        });
    }

    public init() {
        this.clearState();
        this.setProjectActual();
        if (!this.state.actualProject) return;
        this.getDs();
    }

    private clearState() {
        this.state.history = [];
        this.state.ds = [];
        this.state.actualProject = undefined;
        this.state.dsSelected = undefined;
    }

    private setProjectActual() {
        this.state.actualProject = mls.actual[5].project;
    }

    private checkIsALocalStorageChanges(): boolean {
        let haschangesLocal: boolean = false;
        Object.entries(mls.stor.files).forEach((entry) => {
            const [key, item] = entry;
            if (item.level === 3 && item.inLocalStorage) haschangesLocal = true;
        });
        return haschangesLocal;
    }

    private async initDsSelected(dsindex: number) {
        const { project } = mls.actual[5];
        if (!project) return;
        const dsInstance = mls.l3.getDSInstance(project, dsindex);
        await dsInstance.init();
    }

    private getLastDsSelectedList(): ILastDsSelected {
        const str = localStorage.getItem('collab-last-ds-selected');
        if (!str) return {};
        const obj = JSON.parse(str);
        return obj;
    }

    private getLastDsSelectedByProject(project: number): number | undefined {
        if (!project) return undefined;
        const list = this.getLastDsSelectedList();
        return list[project] || undefined;
    }

    public setLastDsSelected(dsindex: number, project: number) {
        if (!dsindex || !project) return;
        const list = this.getLastDsSelectedList();
        list[project] = dsindex;
        localStorage.setItem('collab-last-ds-selected', JSON.stringify(list));
    }

    private getDs() {
        const { project } = mls.actual[5];
        if (!project) throw new Error('Please, select a project');
        const dsList = mls.l5.ds.list(project);

        dsList.forEach((ds) => {

            const filesInDs = Object.entries(mls.stor.files).map((entry) => {
                const [key, value] = entry;
                if (key.startsWith(`${project}_3_ds_${ds.dsName}`)) return value;
            }).filter(value => value !== undefined);

            const inLc = filesInDs.find((file) => (file as mls.stor.IFileInfo).inLocalStorage === true);
            const outdated = filesInDs.find((file) => (file as mls.stor.IFileInfo).isLocalVersionOutdated === true && (file as mls.stor.IFileInfo).status !== 'new');

            const obj: IDSInfo = {
                dsInfo: ds,
                inLocalStorage: !!inLc,
                outdated: !!outdated,
                files: filesInDs as mls.stor.IFileInfo[]
            }

            this.state.ds.push(obj);
        });

        this.state = this.state;
    }

    private _fireEventDsSelected(dsindex: number) {
        const params: IParamsEvent = {
            emitter: 'left',
            value: dsindex
        };
        mls.actual[3].mode = dsindex;
        mls.events.fire(3, ['DSSelected'], JSON.stringify(params), 500);

    }

    openAdd() {
        if (this.menu.setMenuActive) this.menu.setMenuActive('opAdd')
    }

    private async onItemClick(item: mls.l5.IPrjDesignSystem) {
        this.loading = true;
        this.serviceContent?.setAttribute('error', '');

        try {
            await this.initDsSelected(item.dsIndex);
            this._fireEventDsSelected(item.dsIndex);
            if (this.state.actualProject) this.setLastDsSelected(item.dsIndex, this.state.actualProject);
            this.state.dsSelected = item.dsIndex;
        } catch (err: any) {
            this.setError(err.message);
        } finally {
            this.loading = false;

        }
    }


    public async restoreDs(item: mls.l5.IPrjDesignSystem) {
        if (!this.state.actualProject) return;
        const ds = mls.l3.getDSInstance(this.state.actualProject, item.dsIndex);
        this.loading = true;
        this.setError('');

        try {
            await ds.init();
            await ds.dispose();
            this.init();
            this.onItemClick(item);
            this.toogleBadge(this.checkIsALocalStorageChanges(), '_100554_serviceSave');
        } catch (err: any) {
            this.setError(err.message);
        } finally {
            setTimeout(() => {
                this.loading = false;
            }, 100)
        }
    }

    fireOpenDetails() {
        if (!this.state.actualProject || !this.state.dsSelected) return;
        const dss = mls.l5.ds.list(this.state.actualProject);
        const dsInfo = dss[this.state.dsSelected];
        if (!dsInfo) return;
        this.onItemClick(dsInfo);
    }

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        await super.firstUpdated(changedProperties);
        this.fireOpenDetails();
    }

    private async restoreFile(storFile: mls.stor.IFileInfo) {
        if (storFile.status === 'changed') {
            storFile.status = 'nochange';
            if (storFile.isLocalVersionOutdated && storFile.newVersionRefIfOutdated) {
                storFile.versionRef = storFile.newVersionRefIfOutdated;
                storFile.isLocalVersionOutdated = false;
                storFile.newVersionRefIfOutdated = undefined;
            }
        }
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        this.requestUpdate();
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        this.init();
        if (this.state.actualProject) {
            let lastDsIndex = this.getLastDsSelectedByProject(this.state.actualProject);
            if (!lastDsIndex) lastDsIndex = 0;
            this.state.dsSelected = lastDsIndex;
        }


        return html`
        <div class="l5-ds-list">
            <div class="filter-container">
                <input type="text" placeholder="Filter">
            </div>
            <div class="serviceListDs">
                <span style="display:${this.state.ds.length > 0 ? 'none' : 'block'}">${this.msg.noDesignSystem}</span>
                <ul class="serviceListList">
                    ${this.state.ds.map(ds => html`
                        <li>
                            <details>
                                <summary
                                class= "${ds.dsInfo.dsIndex === this.state?.dsSelected ? 'selected' : ''}"
                                @click=${(e: MouseEvent) => { this.onItemClick(ds.dsInfo) }}>
                                    <span>${ds.dsInfo.dsName + ' (' + ds.dsInfo.dsIndex.toString() + ')'}</span>
                                    <span style="display:inline-flex;gap:.6rem; align-items:center;">
                                        <span
                                            title="in local storage" 
                                            style="display:${ds.inLocalStorage ? 'block' : 'none'}">
                                        ${collab_location_dot}
                                        </span>
                                        <span
                                            title="need conciliation"
                                            style="display:${ds.outdated ? 'block' : 'none'}">
                                        ${collab_unbalanced}
                                        </span>
                                        <span
                                            title="undo all"
                                            style="margin-left:.5rem;display:${ds.inLocalStorage ? 'block' : 'none'}"
                                            @click=${(e: MouseEvent) => { e.preventDefault(); this.restoreDs(ds.dsInfo) }}
                                        >${collab_undo}</span>
                                    </span>

                                </summary>
                                <div>
                                    <ul>
                                        ${ds.files.filter(f => f.inLocalStorage).map(file => html`
                                        <li>
                                            <span>${collab_file} ${file.folder.replace(`ds/${ds.dsInfo.dsName}`, '...') + '/' + file.shortName + file.extension}</span>
                                            <span>
                                                <span title="in local storage"> ${collab_location_dot}</span>
                                                <span title="need conciliation" style="display:${file.isLocalVersionOutdated && file.status !== 'new' ? 'inline-block' : 'none'}">
                                                    ${collab_unbalanced}
                                                </span>
                                                <span
                                                    title="undo"
                                                    style="margin-left:.5rem; display:${(file.extension === '.less' || file.extension === '.txt') && file.status !== 'new' ? 'inline-block' : 'none'}"
                                                    @click=${(e: MouseEvent) => { e.preventDefault(); this.restoreFile(file) }}
                                                > ${collab_undo}</span>
                                            </span>
                                                    
                                        
                                        </li>


                                        `)}
                                    

                                    </ul>
                                <div>
                                
                            </details>
                        
                        </li>
                    `)}
                    
                </ul>
            </div>
            <div class="serviceListAddDs">
                <a href="#" @click=${(e: MouseEvent) => { e.preventDefault(); this.openAdd() }}> ${this.msg.addNew}</a>
            </div>
        </div>`;
    }
}

interface IParamsEvent {
    emitter: 'right' | 'left',
    value: number
}

interface IState {
    history: IHistory,
    ds: IDSInfo[]
    dsSelected: number | undefined,
    actualProject: number | undefined
}

interface IHistory {
    [key: number]: mls.l5.IPrjDesignSystem[]
}

interface ILastDsSelected {
    [key: string]: number
}

interface IDSInfo {
    inLocalStorage: boolean,
    outdated: boolean,
    dsInfo: mls.l5.IPrjDesignSystem,
    files: mls.stor.IFileInfo[]
}
