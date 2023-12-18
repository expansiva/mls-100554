/// <mls shortName="collabConfigService" project="100554" enhancement="_100541_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IService } from './_100554_serviceBase';
import { getDepedencesByHtml } from './_100554_libCompile';

@customElement('collab-config-service-100554')
export class CollabConfig100554 extends LitElement {

    @property({ type: String }) currentScenario: 'list' | 'add' = 'list';

    @property({ type: String }) error: string = '';

    @property({ type: Array }) userServices: IService[] = [];

    @property({ type: Array }) avaliableServices: IService[] = [];

    createRenderRoot() {
        return this;
    }

    render() {

        this.style.height = '100%';
        return html`
        <div class="bodyServiceConfig">
            ${this.currentScenario === 'list' ?
                html`
                    ${this.renderHeader()}
                    ${this.renderListServices()}
                `
                : html`
                    ${this.renderHeader()}
                    ${this.renderListAddServices()} 
                `
            }
        </div>`;
    }

    async connectedCallback() {
        super.connectedCallback();
        // set loading
        await this.getServices();
        // remove loading
    }

    private renderHeader() {
        return html`
        <div class="header">
            ${this.currentScenario === 'list' ?
                html`
                    <button @click="${this.goToScenaryAdd}">Add Service</button>
                `
                : html`
                    <button @click="${this.goToScenaryList}">Back</button>
                `
            }
            ${this.error ?
                html`
                    <div style="color:red">${this.error}</div>
                `
                : html``
            }
        </div>
        `
    }

    private renderListAddServices() {
        return html`
        <ul class="listView">
            ${this.avaliableServices.map((service, index) => {
            return html`
                <li>
                    <div class="groupInfos" style="justify-content:start;">
                        <div>#${index + 1}</div>
                        <div>
                            <span class="fa" .innerHTML="${service.icon}"></span> 
                            ${service.name}
                        </div>
                    </div>
                    <div class="groupInfos" style="justify-content:end;">
                        <div>
                            <a myIndex="${index}" @click="${this.activeService}">Active</a>
                        </div>
                    </div>
                </li>
                `
        })}
        </ul>
        `

    }

    private renderListServices() {

        return html`
        <ul class="listView">
            ${this.userServices.map((service, index) => {
            return html`
                <li>
                    <div class="groupInfos" style="justify-content:start;">
                        <div>#${index + 1}</div>
                        <div>
                            <span class="fa" .innerHTML="${service.icon}"></span> 
                            ${service.name}
                        </div>
                    </div>
                    <div class="groupInfos" style="justify-content:end;display:flex; gap:1rem;">
                        <div>
                            <span class="fa" style="cursor:pointer" @click="${this.openHiddenConfigs}">&#xf142</span>
                            <span class="groupHidden" style="display:none">
                                <a myIndex="${index}" @click="${this.desactiveService}">Desactivate</a>
                                <span style="margin: 0px 1rem">|</span>
                                <label>Style</label>
                                <select  myIndex="${index}" @change="${this.changeClassName}"> 
                                <option value="" ?selected="${service && !['separator-left', 'separator-right'].includes(service.className as any)}"></option>
                                <option value="separator-left" ?selected="${service.className === 'separator-left'}">separator-left</option>
                                <option value="separator-right" ?selected="${service.className === 'separator-right'}">separator-right</option>
                                </select>
                            </span>
                        </div>
                        <div>
                            <span class="fa" style="cursor:pointer" move="up" myIndex="${index}" @click="${this.moveElement}">&#xf176</span>
                            <span class="fa" style="cursor:pointer" move="down" myIndex="${index}" @click="${this.moveElement}">&#xf175</span>
                        </div>
                    </div>
                </li>
                `
        })}
        </ul>
        `

    }

    private goToScenaryAdd() {
        this.currentScenario = 'add';
    }

    private goToScenaryList() {
        this.currentScenario = 'list';
    }

    private openHiddenConfigs(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;

        const elHidden = el.parentElement?.querySelector('.groupHidden') as HTMLElement;
        if (!elHidden) return;

        const state = elHidden.style.display === '' ? 'none' : '';
        elHidden.style.display = state;

    }

    private changeClassName(e: InputEvent): void {

        const el = e.target as HTMLSelectElement;
        if (!el) return;

        const indexs = el.getAttribute('myIndex');
        let indexOri = indexs ? +indexs : -1;

        if (!this.userServices[indexOri]) return;

        this.userServices[indexOri].className = el.value as any;

        // Avisa alteração
        //this.father['updateClassName'](index, el.value);

        if (el.parentElement) el.parentElement.style.display = 'none';
        this.userServices = [...this.userServices] as IService[];

    }

    private desactiveService(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;

        const indexs = el.getAttribute('myIndex');
        let indexOri = indexs ? +indexs : -1;

        const userArray = [...this.userServices];
        const avaliableArray = [...this.avaliableServices];

        const obj = userArray[indexOri];
        if (!obj || obj.readOnly) {

            this.error = 'This service cannot be deactivated!'
            setTimeout(() => { this.error = '' }, 3000);
            return;
        };

        avaliableArray.push(obj);
        userArray.splice(indexOri, 1);

        // Avisa alteração

        this.userServices = userArray;
        this.avaliableServices = avaliableArray;

    }

    private activeService(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;

        const indexs = el.getAttribute('myIndex');
        let indexOri = indexs ? +indexs : -1;

        const userArray = [...this.userServices];
        const avaliableArray = [...this.avaliableServices];

        const obj = avaliableArray[indexOri];
        if (!obj) return;

        userArray.push(obj);
        avaliableArray.splice(indexOri, 1);

        // Avisa alteração

        this.userServices = userArray;
        this.avaliableServices = avaliableArray;

    }

    private moveElement(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;

        const move = el.getAttribute('move');
        const indexs = el.getAttribute('myIndex');
        let indexOri = indexs ? +indexs : -1;
        let indexDest = -1;

        if (indexOri < 0 || (move === 'up' && indexOri === 0) || (move === 'down' && indexOri === this.userServices.length - 1)) return;

        indexDest = move === 'up' ? indexOri - 1 : indexDest = indexOri + 1;

        if (indexDest === indexOri) return;

        const obj = this.userServices[indexOri];
        if (!obj) return;

        if (indexOri < indexDest) {
            this.userServices.splice((indexDest + 1), 0, obj);
            this.userServices.splice(indexOri, 1);
        } else {
            this.userServices.splice(indexDest, 0, obj);
            this.userServices.splice((indexOri + 1), 1);
        }

        // Avisa alteração
        // this.father['moveService'](indexOri, indexDest);

        this.userServices = [...this.userServices] as IService[];

    }

    private async getServices() {

        try {

            const arrayUserServices = await this.getUserServices();
            const arrayAvaliableServices = await this.getAvaliableServices();

            await this.getMls2Services(arrayUserServices, arrayAvaliableServices);

            this.userServices = arrayUserServices;
            this.avaliableServices = arrayAvaliableServices;

        } catch (e) {

            this.error = 'Error load services';

        }



    }

    private async getMls2Services(user: IService[], avaliable: IService[]) {

        for await (const i of Object.keys(mls.stor.files)) {

            try {

                const f = mls.stor.files[i];
                if (!f || f.hasError || f.project !== mls.actual[5].project || f.extension !== '.ts' || !f.shortName.startsWith('service')) continue;

                const v = this.verifyExist(f, user, avaliable);
                if (v.act || v.inact) continue;

                const mf = mls.l2.editor.get({ project: f.project, shortName: f.shortName });
                if (!mf) continue;

                let info: any;
                if (!mf.compilerResults || (mf.compilerResults && !mf.compilerResults.prodJS)) {

                    if (mf.compilerResults) mf.compilerResults.modelNeedCompile = true;
                    await mls.l2.editor.getCompilerResultTS(mf, true);

                }

                info = this.getInfosClassService(mf.model.getValue());

                if (!info /*|| (info.levels && !info.levels.includes(this.actualLevel))*/) continue;


                const obj = {

                    active: false,
                    className: info.className,
                    icon: info.icon,
                    mode: info.mode,
                    name: info.name,
                    path: `_${f.project}_${f.shortName}`,
                    position: info.position,
                    readOnly: info.readOnly,
                    ref: `_${f.project}_${f.shortName}`,
                    tooltip: info.tooltip,
                    visible: info.visible,
                    shortcut: '',
                    tags: info.tags,
                    isMls2: true

                };

                avaliable.push(obj as any);

            } catch (e) {
                console.info(e);
                continue;
            }

        };

    }

    private verifyExist(f: mls.stor.IFileInfo, user: IService[], avaliable: IService[]): { act: boolean, inact: boolean } {

        const ret = { act: false, inact: false }

        const act = user.find((i: any) => i.path === `_${f.project}_${f.shortName}`);
        const inact = avaliable.find((i: any) => i.path === `_${f.project}_${f.shortName}`);

        ret.act = !!act;
        ret.inact = !!inact;

        return ret;


    }

    private getInfosClassService(content: string) {

        const startMarker = 'public details:';
        const endMarker = '}';
        const startIndex = content.indexOf(startMarker);
        if (startIndex !== -1) {
            const endIndex = content.indexOf(endMarker, startIndex);
            if (endIndex !== -1) {
                let detailsBlock = content.substring(startIndex + startMarker.length, endIndex + 1).trim();
                const ssindex = detailsBlock.indexOf('{');
                detailsBlock = detailsBlock.substring(ssindex, detailsBlock.length).trim();
                let result = {};
                eval('result = ' + detailsBlock);
                return result;
            }
        }

        return null;

    }

    private async getAvaliableServices() {

        return [] as any;

    }

    private async getUserServices() {

        return [
            {
                "name": " Start",
                "active": true,
                "readOnly": true,
                "ref": "_100529_service_start",
                "path": "_100529_service_start",
                "className": "",
                "mode": "A",
                "icon": "&#xf059",
                "tooltip": " Start",
                "position": "left",
                "isStatic": true
            },
            {
                "name": "Select Page",
                "active": true,
                "readOnly": true,
                "ref": "_100529_service_List",
                "path": "_100529_service_List",
                "className": "",
                "mode": "A",
                "icon": "&#xf15b",
                "tooltip": "Select Page",
                "position": "all"
            },
            {
                "name": "Save",
                "active": false,
                "readOnly": true,
                "ref": "_100529_service_save",
                "path": "_100529_service_save",
                "className": "",
                "mode": "B",
                "icon": "&#xf0c7",
                "tooltip": "Save",
                "position": "all"
            },
            {
                "name": "Source",
                "active": false,
                "readOnly": true,
                "ref": "_100529_service_Source",
                "path": "_100529_service_Source",
                "className": "",
                "mode": "B",
                "icon": "&#xf121",
                "tooltip": " Source",
                "position": "all",
                "tags": [
                    "preview"
                ]
            },
            {
                "name": "Results",
                "active": false,
                "readOnly": true,
                "ref": "_100529_service_results",
                "path": "_100529_service_results",
                "className": "",
                "mode": "B",
                "icon": "&#xf1c9",
                "tooltip": " Results",
                "position": "all"
            }
        ] as any;

    }


}
