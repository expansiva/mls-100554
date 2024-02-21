/// <mls shortName="serviceProjectDetails" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-project-details-100554')
export class ServiceProjectDetails100554 extends ServiceBase {

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

    private getDetailsProject(project: number) {
        const details = mls.l5.getProjectSettings(project);
        if (!this.actualProjectDetails) this.actualProjectDetails = {} as IProjectDetails;
        this.actualProjectDetails.designSystems = details.designSystems ? details.designSystems.length : 0;
        this.actualProjectDetails.name = details.name;
        this.actualProjectDetails.projectDriver = details.projectDriver;
        this.actualProjectDetails.projectURL = details.projectURL;
        this.actualProjectDetails.files = Object.keys(mls.stor.files).filter((item => item.startsWith(project.toString()))).length;

    }

    private onProjectSelected(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const data: IProjectSelectedParams = JSON.parse(ev.desc);
        this.getDetailsProject(data.value);
    }

    render() {

        return html`
            ${!this.actualProjectDetails
                ?
                html`<h4> No project selected!</h4>`
                :
            html`
                <section class="section-details">
                    <details open>
                        <summary>Resume</summary>
                        <ul>
                            <li>Name: ${this.actualProjectDetails.name}</li>
                            <li>ProjectDriver: ${this.actualProjectDetails.projectDriver}</li>
                            <li>ProjectURL: ${this.actualProjectDetails.projectURL}</li>
                            <li>DesignSystems: ${this.actualProjectDetails.designSystems}</li>
                            <li>Files: ${this.actualProjectDetails.files}</li>
                        </ul>
                    </details>
                </section>

                `
            }`
    }
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
