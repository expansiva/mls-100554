/// <mls shortName="collabConfigService" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';

/// **collab_i18n_start**
const message_pt = {
    addService: 'Adicionar Serviço',
    back: 'Voltar',
    hidden: 'Oculto',
    style: 'Estilo'
}

const message_en = {
    addService: 'Add Service',
    back: 'Back',
    hidden: 'Hidden',
    style: 'Style'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-config-service-100554')
export class CollabConfig100554 extends CollabLitElement {

    private msg: MessageType = messages['en'];
    
    @property({ type: String }) currentScenario: 'list' | 'add' = 'list';

    @property({ type: String }) error: string = '';

    @property({ type: String }) positionToolbar: ICollabServicePosition = 'left';

    @property({ type: Number }) actualLevel: number = -1;

    @property({ type: Array }) userServices: ICollabService3[] = [];

    @property({ type: Array }) avaliableServices: ICollabService3[] = [];

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

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
        this.setInfos();
        await this.getServices();
    }

    private renderHeader() {
        return html`
        
        <div class="header">
            
            ${this.currentScenario === 'list' ?
                html`
                    <button @click="${this.goToScenaryAdd}">${this.msg.addService}</button>
                `
                : html`
                    <button @click="${this.goToScenaryList}">${this.msg.back}</button>
                `
            }
            ${this.error ?
                html`
                    <div style="color:red">${this.error}</div>
                `
                : html``
            }
            <div style="font-size:90%; display: flex; justify-content: center; align-items: center; padding-right: 0.5rem;">
                <span style="margin-right:5px">Position:</span>
                ${this.positionToolbar === 'left' ?
                html`<input type="radio" value="left" id="leftradioopt" name="radioOpt" checked 
                @click="${this.onclickPositionLeft}" />
                <label for="leftradioopt" style="margin-right:5px">left</label>
                <input type="radio" value="right" id="rightradioopt" name="radioOpt" @click="${this.onclickPositionRight}"/>
                <label for="rightradioopt">right</label>` :
                html`<input type="radio" value="left" id="leftradioopt" name="radioOpt"  
                @click="${this.onclickPositionLeft}" />
                <label for="leftradioopt" style="margin-right:5px">left</label>
                <input type="radio" value="right" id="rightradioopt" name="radioOpt" @click="${this.onclickPositionRight}" checked/>
                <label for="rightradioopt">right</label>`
            }
                
            </div>
        </div>
        `
    }

    private onclickPositionLeft(): void {
        this.positionToolbar = 'left';
        this.getServices();
    }

    private onclickPositionRight(): void {
        this.positionToolbar = 'right';
        this.getServices();
    }

    private renderListAddServices() {
        return html`
        <ul class="listView">
            ${repeat(
            this.avaliableServices,
            ((item: IService) => item.icon) as any,
            ((service: IService, index: any) => {
                return html`
                        <li>
                            <div class="groupInfos" style="justify-content:start;">
                                <div>#${index + 1}</div>
                                <div>
                                    ${service.tooltip}
                                </div>
                            </div>
                            <div class="groupInfos" style="justify-content:end;">
                                <div>
                                    <a myIndex="${index}" @click="${this.activeService}">Active</a>
                                </div>
                            </div>
                        </li>
                    `
            }) as any
        )}    
        </ul>
        `

    }

    private renderListServices() {

        return html`
        <ul class="listView">
            ${repeat(
            this.userServices,
            ((item: IService) => item.widget) as any,
            ((service: IService, index: any) => {
                return html`
                    <li>
                        <div class="groupInfos" style="justify-content:start;">
                            <div>#${index + 1}</div>
                            <div>
                                ${service.tooltip}
                                <span class="badge" style="display:${service.visible ? 'none' : 'inline-block'}">${this.msg.hidden}<span>
                            </div>
                        </div>
                        <div class="groupInfos" style="justify-content:end;display:flex; gap:1rem;">
                            <div style="display: flex; justify-content: center; align-items: center;">
                                <span class="fa fa-ellipsis-vertical" style="cursor:pointer" @click="${this.openHiddenConfigs}"></span>
                                <span class="groupHidden" style="display:none">
                                    <a myIndex="${index}" @click="${this.desactiveService}">Desactivate</a>
                                    <span style="margin: 0px 1rem">|</span>
                                    <label>${this.msg.style}</label>
                                    <select  myIndex="${index}" @change="${this.changeClassName}"> 
                                        <option value="" ?selected="${service && !['separator-left', 'separator-right'].includes(service.classname as any)}"></option>
                                        <option value="separator-left" ?selected="${service.classname === 'separator-left'}">separator-left</option>
                                        <option value="separator-right" ?selected="${service.classname === 'separator-right'}">separator-right</option>
                                    </select>
                                    
                                </span>
                            </div>
                            <div>
                                <span class="fa fa-arrow-up-long" style="cursor:pointer" move="up" myIndex="${index}" @click="${this.moveElement}"></span>
                                <span class="fa fa-arrow-down-long" style="cursor:pointer" move="down" myIndex="${index}" @click="${this.moveElement}"></span>
                            </div>
                        </div>
                    </li>
                    `
            }) as any
        )}
        </ul>
        `
    }

    private infos: IInfo = {} as IInfo;
    private setInfos() {
        this.infos.nav = this.closest('collab-nav-3')?.previousElementSibling as ICollab2Nav;
        if (!this.infos.nav) return;
        const level = this.infos.nav.getAttribute('level');
        this.actualLevel = level ? +level : -1;
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
        this.userServices = [...this.userServices] as IService[];
        this.fireChangeClassName(indexOri, el.value as ICollabServiceClass);
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
        if (!obj || obj.isStatic) {
            this.error = 'This service cannot be deactivated!'
            setTimeout(() => { this.error = '' }, 3000);
            return;
        };

        avaliableArray.push(obj);
        userArray.splice(indexOri, 1);

        this.userServices = userArray;
        this.avaliableServices = avaliableArray;

        this.fireRemoveService(indexOri);

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
        this.userServices = userArray;
        this.avaliableServices = avaliableArray;
        this.fireAddService(obj);

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

        const objTo = this.userServices[indexDest];
        const objFrom = this.userServices[indexOri];

        if (objTo.isStatic) {
            this.error = 'This service cannot be moved to this position!'
            setTimeout(() => { this.error = '' }, 3000);
            return;
        }
        if (!objFrom) return;
        if (objFrom.isStatic) {
            this.error = 'This service is static, cannot be moved'
            setTimeout(() => { this.error = '' }, 3000);
            return;
        }

        if (indexOri < indexDest) {
            this.userServices.splice((indexDest + 1), 0, objFrom);
            this.userServices.splice(indexOri, 1);
        } else {
            this.userServices.splice(indexDest, 0, objFrom);
            this.userServices.splice((indexOri + 1), 1);
        }

        this.userServices = [...this.userServices];

        this.fireMoveService(indexOri, indexDest);

    }

    private async getServices() {
        
            const arrayUserServices = await this.getUserServices();
            const arrayAvaliableServices = await this.getAvaliableServices();
            this.userServices = arrayUserServices[this.actualLevel][this.positionToolbar];
            this.avaliableServices = arrayAvaliableServices[this.actualLevel][this.positionToolbar];
        
    }

    private async getAvaliableServices() {
        if (!this.infos.nav) return [];
        const avaliableServices = await this.infos.nav.getAvaliableServices();
        return avaliableServices;
    }

    private async getUserServices() {
        if (!this.infos.nav) return [];
        const avaliableServices = this.infos.nav.getUserServices();
        return avaliableServices;
    }

    private async fireChangeClassName(index: number, cls: ICollabServiceClass) {
        if (!this.infos.nav) return;
        await this.infos.nav.updateClassName(index, cls, this.actualLevel, this.positionToolbar);
    }

    private async fireAddService(service: ICollabService3) {
        if (!this.infos.nav) return;
        await this.infos.nav.addService(service, this.actualLevel, this.positionToolbar);
    }

    private async fireRemoveService(index: number) {
        if (!this.infos.nav) return;
        await this.infos.nav.removeService(index, this.actualLevel, this.positionToolbar);
    }

    private async fireMoveService(indexOri: number, indexDest: number) {
        if (!this.infos.nav) return;
        await this.infos.nav.moveService(indexOri, indexDest, this.actualLevel, this.positionToolbar);
    }

}

interface IInfo {
    nav: ICollab2Nav
}

interface ICollab2Nav extends HTMLElement {
    getAvaliableServices(): Promise<ICollabServiceData>,
    getUserServices(): ICollabServiceData,
    addService(service: ICollabService3, level: number, position: ICollabServicePosition): Promise<void>
    removeService(index: number, level: number, position: ICollabServicePosition): Promise<void>
    moveService(fromIndex: number, toIndex: number, level: number, position: ICollabServicePosition): Promise<void>
    updateClassName(index: number, newClass: ICollabServiceClass | undefined, level: number, position: ICollabServicePosition): Promise<void>
}

interface ICollabServiceData {
    [key: number]: ICollabService2
}

interface ICollabService2 {
    left: ICollabService3[],
    right: ICollabService3[],
}

interface ICollabService3 {
    widget: string,
    state: ICollabServiceState,
    icon: string,
    tooltip: string,
    visible: boolean,
    classname?: ICollabServiceClass,
    isStatic?: boolean,
}

export interface IService {
    widget: string,
    state: ICollabServiceState,
    icon: string,
    tooltip: string,
    visible: boolean,
    position: "left" | "right" | "all",
    level: number[],
    classname?: ICollabServiceClass,
    isStatic?: boolean,
}

type ICollabServicePosition = "left" | "right"
type ICollabServiceState = "foreground" | "background"
type ICollabServiceClass = "separator-left" | "separator-right"