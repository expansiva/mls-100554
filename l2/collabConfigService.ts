/// <mls shortName="collabConfigService" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IService } from './_100554_serviceBase';

@customElement('collab-config-service-100554') 
export class CollabConfig100554 extends LitElement {

    @property({ type: String }) currentScenario: 'list' | 'add' = 'list';

    @property({ type: String }) error: string = '';

    @property({ type: String }) positionToolbar: string = 'left';

    @property({ type: Number }) actualLevel: number = -1;

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
        this.setInfos();
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
                ((item: IService) => item.name) as any,
                ((service: IService, index: any) => {
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
                ((item: IService) => item.name) as any,
                ((service: IService, index: any) => {
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
                            <div style="display: flex; justify-content: center; align-items: center;">
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
                }) as any
            )}
        </ul>
        `

    }

    private infos:{ toolbar: undefined | HTMLElement } = {} as any;
    private setInfos() {

        this.infos.toolbar = this.closest('mls-container-split-100529') as HTMLElement;
        if (!this.infos.toolbar || !(this.infos.toolbar as any).leftPanel || !(this.infos.toolbar as any).leftPanel.level) return;
        let level = (this.infos.toolbar as any).leftPanel.level;
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

        this.userServices[indexOri].className = el.value as any;

        if (el.parentElement) el.parentElement.style.display = 'none';
        this.userServices = [...this.userServices] as IService[];

        this.fireChangeClassName(indexOri, el.value);

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

        userArray.splice(userArray.length - 1 , 0, obj);
        avaliableArray.splice(indexOri, 1);

        this.userServices = userArray;
        this.avaliableServices = avaliableArray;

        this.fireAddService(this.userServices.length - 2);

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

        this.userServices = [...this.userServices] as IService[];

        this.fireMoveService(indexOri, indexDest);

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

                if (!info || (info.levels && !info.levels.includes(this.actualLevel))) continue;


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

        if (!this.infos || !this.infos.toolbar || !(this.infos as any).toolbar['getAvaliableServices'] ) {
			return [];
		}

        return (this.infos as any).toolbar['getAvaliableServices'](this.positionToolbar) || [];

    }

    private async getUserServices() {

        if (!this.infos || !this.infos.toolbar || !(this.infos as any).toolbar['getUserServices'] ) {
			return [];
		}

        return (this.infos as any).toolbar['getUserServices'](this.positionToolbar) || [];

    }

    /******Toolbar *******/

    private saveConfig(): void {

        if (!this.infos || !this.infos.toolbar || !(this.infos as any).toolbar['updateServices']) return;
        
        (this.infos as any).toolbar['updateServices'](this.userServices, this.positionToolbar);

    }

    private fireChangeClassName(index: number, cls: string): void {

        if (!this.infos || !this.infos.toolbar || !(this.infos as any).toolbar['updateClassName']) return;

		!(this.infos as any).toolbar['updateClassName'](index, cls, this.positionToolbar);

		
    }

    private fireAddService(index: number): void {

        if (!this.infos || !this.infos.toolbar || !(this.infos as any).toolbar['addService']) return;

		!(this.infos as any).toolbar['addService'](this.userServices[index], this.positionToolbar);

		
    }

    private fireRemoveService(index: number): void {

        if (!this.infos || !this.infos.toolbar || !(this.infos as any).toolbar['removeService']) return;

		!(this.infos as any).toolbar['removeService'](index, this.positionToolbar);

		
    }

    private fireMoveService(indexOri: number, indexDest: number): void {

        if (!this.infos || !this.infos.toolbar || !(this.infos as any).toolbar['moveService']) return;

		!(this.infos as any).toolbar['moveService'](indexOri, indexDest, this.positionToolbar);

		
    }


}
