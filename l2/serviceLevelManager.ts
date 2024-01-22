/// <mls shortName="serviceLevelManager" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { createModel } from './_100554_libFileManager';

@customElement('service-level-manager-100554')
export class ServiceManager100554 extends ServiceBase {

    constructor() {
        super();
        this.setEvents();
    }


    public details: IService = {
        icon: '&#xf5b8',
        name: 'Manager',
        mode: 'B',
        position: 'right',
        readOnly: false,
        tooltip: 'Manager',
        className: undefined,
        tags: [],
        levels: [7]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {

    }

    public menu: IMenu = {
        title: 'Manager',
        actions: {
        },
        icons: {
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: '',
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon
    }

    onServiceClick(visible: boolean, reinit: boolean) {
        if (visible && this.menu.setIconActive) {

        }
    }

    render() {
        return html``;
    }

    //----------- EVENTS-------------

    private setEvents() {

        /*mls.events.addEventListener(
            [2],
            ['ProjectLoaded'],
            (ev) => this.onProjectLoadedEvents(ev)
        );*/

    }

    private async onProjectLoadedEvents(ev: mls.events.IEvent): Promise<void> {

        try {

            const projectLoadedInfo = JSON.parse(ev.desc as any) as mls.events.IProjectLoaded;
            await this.readAllProjectTypescriptAndCompile(projectLoadedInfo.project, '', projectLoadedInfo.needCompile);

        } catch (e) {
            console.error('Error on serviceSource_onProjectLoadedEvents: ', e);
        }

    }

    private projectsLoaded: number[] = [];
    private async readAllProjectTypescriptAndCompile(project: number, shortName: string, needCompile: boolean = true): Promise<void> {

        // load all typescripts dependencies of project , except shortName
        if (this.projectsLoaded.includes(project)) return;

        if (mls.istrace) console.log('loading files from project ' + project);

        this.projectsLoaded.push(project);

        const promises: Promise<mls.l2.editor.IMFile>[] = [];

        const keys: string[] = Object.keys(mls.stor.files);
        for (const key of keys) {

            const storFile = mls.stor.files[key];
            if (storFile.project === project
                && storFile.level === 2
                && storFile.shortName !== shortName) {
                promises.push(createModel(storFile, false));
            }
        }

        await Promise.all(promises);

        if (needCompile) await mls.l2.editor.compileAllProjectIfNeed(project, true);
    }

    
}
