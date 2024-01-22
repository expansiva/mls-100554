/// <mls shortName="serviceLevelManager" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { readAllProjectAndCompile } from './_100554_libFileManager';

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
            await readAllProjectAndCompile(projectLoadedInfo.project, '', projectLoadedInfo.needCompile);

        } catch (e) {
            console.error('Error on serviceSource_onProjectLoadedEvents: ', e);
        }

    }

    

    
}
