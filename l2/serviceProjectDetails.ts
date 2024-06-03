/// <mls shortName="serviceProjectDetails" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css, repeat, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

/// **collab_i18n_start**
const message_pt = {
    noProjectSelected: 'Nenhum projeto selecionado!',
    resume: 'Resumo',
    name: 'Nome',
    projectDriver: 'Driver do Projeto',
    projectURL: 'URL do Projeto',
    designSystems: 'Sistemas de Design',
    files: 'Arquivos',
    keyGithub: 'Chave do GitHub'
}

const message_en = {
    noProjectSelected: 'No project selected!',
    resume: 'Resume',
    name: 'Name',
    projectDriver: 'ProjectDriver',
    projectURL: 'ProjectURL',
    designSystems: 'DesignSystems',
    files: 'Files',
    keyGithub: 'Key Github',

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-project-details-100554')
export class ServiceProjectDetails100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    private showKey: boolean = false;

    constructor() {
        super();
        mls.events.addListener(5, 'ProjectSelected', (ev) => this.onProjectSelected(ev));

    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf15b',
        state: 'foreground',
        position: 'right',
        tooltip: 'Project Details',
        visible: true,
        widget: '_100554_serviceProjectDetails',
        level: [5]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Project',
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

    }

    @property()
    private actualProjectDetails: IProjectDetails | undefined;

    @property()
    private actualKeyGitHub: string | null | undefined;

    private async getDetailsProject(project: number) {
        //const details = mls.l5.getProjectSettings(project);
        const details = await mls.l5.getProjectConf(project);
        if (!this.actualProjectDetails) this.actualProjectDetails = {} as IProjectDetails;
        this.actualProjectDetails.designSystems = details.designSystems ? details.designSystems.length : 0;
        this.actualProjectDetails.name = details.name;
        this.actualProjectDetails.projectDriver = details.projectDriver;
        this.actualProjectDetails.projectURL = details.projectURL;
        this.actualProjectDetails.files = Object.keys(mls.stor.files).filter((item => item.startsWith(project.toString()))).length;

        this.actualKeyGitHub = localStorage?.getItem('keyGitHub');

        this.requestUpdate();

    }

    private onProjectSelected(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const data: IProjectSelectedParams = JSON.parse(ev.desc);
        this.getDetailsProject(data.value);
    }

    private getLastProject() {
        const lastPrjId = localStorage.getItem('l5-last-project');
        if (lastPrjId) this.getDetailsProject(+lastPrjId);
    }

    private handleChangeKey() {
        if (this.actualKeyGitHub) {
            localStorage?.setItem('keyGitHub', this.actualKeyGitHub as string);
        }
    }

    private handleInputChangeKey(value: string) {
        this.actualKeyGitHub = value;
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        this.getLastProject();
        return html`
            ${!this.actualProjectDetails
                ?
                html`<h4> ${this.msg.noProjectSelected}</h4>`
                :
                html`
                <section class="section-details">
                    <details open>
                        <summary>${this.msg.resume}</summary>
                        <ul>
                            <li>${this.msg.name}: ${this.actualProjectDetails.name}</li>
                            <li>${this.msg.projectDriver}: ${this.actualProjectDetails.projectDriver}</li>
                            <li>${this.msg.projectURL}: ${this.actualProjectDetails.projectURL}</li>
                            <li>${this.msg.designSystems}: ${this.actualProjectDetails.designSystems}</li>
                            <li>${this.msg.files}: ${this.actualProjectDetails.files}</li>
                        </ul>
                    </details>
                </section>
                <section
                    style=${this.actualProjectDetails.projectDriver === 'github' ? 'display: block' : 'display:none'} 
                    class="section-config-github">
                    <div>
                        <label>${this.msg.keyGithub}</label>
                        <div class="cls_key">
                            <input .value=${this.showString(this.actualKeyGitHub, this.showKey)} @input="${this.handleInputChangeKey}"></input rows=4>
                            <button @click="${this.clickShowEye}">${this.showKey ?unsafeHTML(this.iconEye) : unsafeHTML(this.iconEyeClose)}</button>
                        </div>
                        <button @click=${this.handleChangeKey}>Alterar</button>
                    </div>
                </section>
                <section class="cls_tree_branch">
                    ${this.renderCreateTreeFork()}
                </section>
                `
            }`
    }

    private renderCreateTreeFork() {
        return html`
            <details>
                <summary>Branchs:</summary>
                <ul>
                    <li>
                        owner
                        <ul>
                            <li>
                                <a href="">expansiva</a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul>
                    <li>
                        user
                        <ul>
                            <li>
                                santiagoExpansiva
                                <ul>
                                    <li>
                                        <a href="">mls-20001</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </details>
        `
    }

    private clickShowEye(e: MouseEvent) {

        e.stopPropagation();
        if (this.showKey) this.showKey = false;
        else this.showKey = true;

        this.requestUpdate();

    }

    private showString(input: string | null | undefined, show: boolean) {

        if (!input) return '';

        if (show) return input
        else return this.maskString(input);

    }

    private maskString(input:string) {
        return '*'.repeat(input.length);
    }

    private iconEye = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
    `;

    private iconEyeClose = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>
    `;

}

interface IProjectSelectedParams {
    emitter: 'left' | 'right',
    value: number
}

export interface IProjectDetails {
    name: string,
    projectDriver: string,
    projectURL: string,
    designSystems: number,
    files: number,
}
