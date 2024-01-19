/// <mls shortName="serviceSelectDs" project="100554" enhancement="_100554_enhancementLit" groupName="services" />

import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';


@customElement('service-select-ds-100554')
export class ServiceSelectDs100554 extends ServiceBase {

    constructor() {
        super();

        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf15b',
        name: 'Select Ds',
        mode: 'A',
        position: 'left',
        readOnly: true,
        tooltip: 'Select Ds',
        className: undefined,
        tags: [],
        levels: [3]
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
            opSelect: 'Select',
            opAdd: 'Add',
        },
        icons: {},
        actionDefault: 'opSelect', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }


    @state()
    state: IState = { history: [], actualProject: undefined, ds: [], dsSelected: undefined };


    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        this._onServiceClick(visible, reinit, el)
    }

    private async _onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible && reinit) {
        
        }

    }

    private showHelper(): boolean {
        return true;
    }

    private showAdd(): boolean {
        if (this.menu.setMode) this.menu.setMode('editor');
        return true;
    }


    private setEvents() {
        mls.events.addEventListener([3], ['DSChanged'] as any, (ev) => {
            this.toogleBadge(true, '_100554_serviceSave')
        });

        mls.events.addEventListener([5], ['ProjectSelected'], (ev) => {
            // this.loadService();
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
            const key = mls.stor.getKeyToFiles(project, 3, ds.dsName, `ds/${ds.dsName}`, '.json');
            const file = mls.stor.files[key];
            const inLc = file && file.inLocalStorage;
            const outdated = file && file.isLocalVersionOutdated;
            const obj: IDSInfo = {
                dsInfo: ds,
                inLocalStorage: inLc,
                outdated,
            };
            this.state.ds.push(obj);
        });
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

        console.info('openAdd')

    }

    private async onItemClick(item: mls.l5.IPrjDesignSystem) {
        console.info('onItemClick')

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
            this.loading = false;
        }
    }

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        await super.firstUpdated(changedProperties);
        if (!this.state.actualProject || !this.state.dsSelected) return;
        const dss = mls.l5.ds.list(this.state.actualProject);
        const dsInfo = dss[this.state.dsSelected];
        if (!dsInfo) return;
        this.onItemClick(dsInfo);
    }

    render() {

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
                <span style="display:${this.state.ds.length > 0 ? 'none' : 'block'}">No design system in this project, please click add to start a create a new design system.</span>
                <ul class="serviceListList">
                    ${this.state.ds.map(ds => html`
                        <li
                        @click=${(e: MouseEvent) => { e.preventDefault(); this.onItemClick(ds.dsInfo) }}
                        class= "${ds.dsInfo.dsIndex === this.state?.dsSelected ? 'selected' : ''}"
                        >
                            <div>
                                <span>${ds.dsInfo.dsName + ' (' + ds.dsInfo.dsIndex.toString() + ')'}</span>
                                <i  class="fa fa-location-dot"
                                    title="in local storage" 
                                    style="display:${ds.inLocalStorage ? 'block' : 'none'}">
                                </i>
                                <i class="fa fa-unbalanced" 
                                   title="need conciliation"
                                   style="display:${ds.outdated ? 'block' : 'none'}">
                                </i>
                                <i class="fa fa-rotate-left" 
                                   title="clear"
                                   style="display:${ds.inLocalStorage ? 'block' : 'none'}"
                                   @click=${(e: MouseEvent) => { e.preventDefault(); this.restoreDs(ds.dsInfo) }}
                                >
                                </i>
                            </div>
                            <span class="fa-solid fa-chevron-right"></span>
                        </li>
                    `)}
                    
                </ul>
            </div>
            <div class="serviceListAddDs">
                <a href="#" @click=${(e: MouseEvent) => { e.preventDefault(); this.openAdd() }}> Add new design system </a>
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
    dsInfo: mls.l5.IPrjDesignSystem
}
