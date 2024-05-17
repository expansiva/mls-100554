/// <mls shortName="serviceDetailsDs" project="100554" enhancement="_100554_enhancementLit" groupName="services" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

/// **collab_i18n_start**
const message_pt = {
    resume: 'Resumo',
    name: 'Nome',
    createdBy: 'Criado por',
    lastUpdated:'Última atualização',
    lastUpdatedBy: 'Última atualização por',
    documentation: 'Documentação',
    tokens:'Tokens',
    assets: 'Ativos',
    components: 'Componentes',
    style:'Estilo'
}

const message_en = {
    resume: 'Resume',
    name: 'Name',
    createdBy: 'Created By',
    lastUpdated:'Last Updated',
    lastUpdatedBy: 'Last updated by',
    documentation: 'Documentation',
    tokens:'Tokens',
    assets: 'Assets',
    components: 'Components',
    style:'Style'
    
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en-us': message_en,
    'pt-br': message_pt
}
/// **collab_i18n_end**

@customElement('service-details-ds-100554')
export class ServiceDetailsDs100554 extends ServiceBase {

    private myMessage: MessageType = messages['en-us'] ;

    constructor() {
        super();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf229',
        state: 'background',
        tooltip: 'Details Design System',
        visible: true,
        position: "right",
        widget: '_100554_serviceDetailsDs',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opOverview') return this.showOverview();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Details',
        actions: {
            opOverview: 'Resume',
        },
        icons: {},
        actionDefault: 'opOverview', // call after close icon clicked
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

    @property()
    state: IState = { assets: 0, components: 0, createdBy: '', documentation: 0, lastUpdated: '', lastUpdatedBy: '', name: '', style: 0, tokens: 0 };

    setEvents() {
        mls.events.addEventListener([3], ['DSSelected'], (ev) => {
            if (!this.serviceItemNav) return;
            this.serviceItemNav.setAttribute('mode', 'A');
            this.openMe();
        });
    }

    private ds: mls.l3.DesignSystemIO | undefined;

    showOverview(): boolean {
        return true;
    }

    private async init() {
        const { mode } = mls.actual[3];
        const { project } = mls.actual[5];
        if (mode === undefined || project === undefined) return;
        this.ds = mls.l3.getDSInstance(project, mode);
        await this.ds.init();
        this.setResume(project, mode);
    }

    private async setResume(project: number, index: number) {
        const dsInfo = mls.l5.getProjectDesingSystems(project);
        const { dsName } = dsInfo[index];
        if (!this.ds) return;
        this.state.name = dsName;
        this.state.createdBy = this.ds.createdBy;
        this.state.lastUpdated = this.getLastModifiedFormated(this.ds.lastUpdated);
        this.state.lastUpdatedBy = this.ds.lastUpdatedBy;

        this.state.components = Object.keys(this.ds.components.list).length;
        this.state.assets = this.getAssetsLenght(project, dsName);
        this.state.documentation = Object.keys(this.ds.docs.list).length;
        this.state.tokens = Object.keys(this.ds.tokens.list).length;
        this.state.style = await this.getStyleLines();
    }

    private async getStyleLines(): Promise<number> {
        if (!this.ds) return 0;
        const style = await this.ds.css.list.definitions.getContent();
        const lenght = style.split('\n').length;
        return lenght;
    }
    private getAssetsLenght(project: number, nameDs: string): number {
        const listFiles = mls.stor.files;
        const onlyProjects = Object.keys(listFiles).filter((file) => listFiles[file].project === project);
        const l3files = onlyProjects.filter((item) => {
            const { level, folder } = listFiles[item];
            return (level === 3 && folder.startsWith(`ds/${nameDs}/assets`));
        });
        return l3files.length;
    }

    private getLastModifiedFormated(dt: string): string {

        let lastUpdated: string;
        const dateToday = new Date();
        const dtLastWrite = new Date(dt);
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;

        function dateDiffInDays(a: Date, b: Date) {
            // Discard the time and time-zone information.
            const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
            return Math.floor((utc2 - utc1) / _MS_PER_DAY);
        }

        const diffDays = dateDiffInDays(dtLastWrite, dateToday);
        const moreThanTwoDays = diffDays > 1;

        if (diffDays === 0) lastUpdated = 'today';
        else if (diffDays < 30) lastUpdated = `${diffDays} ${moreThanTwoDays ? 'days' : 'day'} ago`;
        else {
            const lastWriteYear = dtLastWrite.getFullYear();
            const lastWriteMounth: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 = dtLastWrite.getMonth() as any;
            const lastWriteDay = dtLastWrite.getDate();
            const mounthFilter = {
                0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'June', 6: 'July', 7: 'Aug', 8: 'Sept', 9: 'Oct', 10: 'Nov', 11: 'Dec',
            };
            lastUpdated = `on ${lastWriteYear}, ${lastWriteDay} ${mounthFilter[lastWriteMounth]} `;
        }
        return lastUpdated;
    }

    private onLinkClick(service: string) {
        this.openService(service, 'left', 3);
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.myMessage = messages[lang]
        this.init();
        return html`
            <div class="mls-ds-resume">
                <details open="open">
                    <summary>${this.myMessage.resume}</summary>
                    <ul>
                        <li>
                            <i class="fa fa-file-signature"></i>
                            <span>${this.myMessage.name}:</span>
                            <span>${this.state.name}</span>
                        </li>
                        <li>
                            <i class="fa fa-user"></i>
                            <span>${this.myMessage.createdBy}:</span>
                            <span>${this.state.createdBy}</span>
                        </li>
                        <li>
                            <i class="fa fa-calendar-days"></i>
                            <span>${this.myMessage.lastUpdated}:</span>
                            <span>${this.state.lastUpdated}</span>
                        </li>
                        <li>
                            <i class="fa fa-regular fa-user"></i>
                            <span>${this.myMessage.lastUpdatedBy}:</span>
                            <span>${this.state.lastUpdatedBy}</span>
                        </li>
                        <li>
                            <i class="fa fa-book"></i>
                            <span>${this.myMessage.documentation}:</span>
                            <a href="#"  @click=${(e: MouseEvent) => { e.preventDefault(); this.onLinkClick('_100554_serviceDsDocList') }}> ${this.state.documentation} docs </a>
                        </li>
                        <li>
                            <i class="fa fa-list-check"></i>
                            <span>${this.myMessage.tokens}:</span>
                            <a href="#" @click=${(e: MouseEvent) => { e.preventDefault(); this.onLinkClick('_100554_serviceDsTokens') }}>${this.state.tokens} tokens</a>
                        </li>
                        <li>
                            <i class="fa fa-folder-tree"></i>
                            <span>${this.myMessage.assets}:</span>
                            <a href="#" @click=${(e: MouseEvent) => { e.preventDefault(); this.onLinkClick('_100529_service_assets') }}>${this.state.assets} assets </a>
                        </li>
                        <li>
                            <i class="fa fa-cubes"></i>
                            <span>${this.myMessage.components}:</span>
                            <a href="#"" @click=${(e: MouseEvent) => { e.preventDefault(); this.onLinkClick('_100554_serviceDsComponentsList') }}>${this.state.components} components </a>
                        </li>
                        <li>
                            <i class="fa fa-pen-nib"></i>
                            <span>${this.myMessage.style}:</span>
                            <a href="#""  @click=${(e: MouseEvent) => { e.preventDefault(); this.onLinkClick('_100529_service_styles') }}>${this.state.style} lines</a>
                        </li>
                    </ul>
                </details>
            </div>
        `;
    }
}

interface IState {
    name: string | undefined,
    createdBy: string | undefined,
    lastUpdated: string | undefined,
    lastUpdatedBy: string | undefined,
    documentation: number | undefined,
    tokens: number | undefined,
    assets: number | undefined,
    components: number | undefined,
    style: number | undefined,

}