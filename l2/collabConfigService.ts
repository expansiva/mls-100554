/// <mls shortName="collabConfigService" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IService } from './_100554_serviceBase';

@customElement('collab-config-service-100554')
export class CollabConfig100554 extends LitElement {

    @property({ type: String }) currentScenario: 'list' | 'add' = 'list';

    @property({ type: String }) error: string = '';

    @property({ type: Array }) userServices: IService[] = this.getUserServices();

    @property({ type: Array }) avaliableServices: IService[] = [];

    render() {

        this.style.height = '100%';
        return html`
        <div class="bodyServiceConfig">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
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

    createRenderRoot() {
        return this;
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

    private goToScenaryAdd() {
        this.currentScenario = 'add';
    }

    private goToScenaryList() {
        this.currentScenario = 'list';
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

    private getUserServices(): IService[] {

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

        ] as any[];

    }


}
