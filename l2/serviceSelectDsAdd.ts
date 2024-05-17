/// <mls shortName="serviceSelectDsAdd" project="100554" enhancement="_100554_enhancementLit" groupName="internal" />

import { html, css, LitElement, classMap } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { ServiceBase } from './_100554_serviceBase';
import { CollabLitElement } from './_100554_collabLitElement';

export const initServiceSelectDsAdd = () =>{
    return true;
}

/// **collab_i18n_start**
const message_pt = {
    addNew: 'Adicionar um novo sistema de design',
    p1: 'Aqui você pode criar um novo sistema de design selecionando um sistema de design padrão vazio ou selecionando um modelo.',
    empty: 'Vazio',
    templates: 'Modelos',
    next: 'Próximo',
    project: 'Projeto',
    resume: 'Resumo',
    name: 'Nome',
    create: 'Criar Sistema de Design'
}

const message_en = {
    addNew: 'Add a new design system',
    p1: 'Here you can create a new design system selecting empty default design system or select a template.',
    empty: 'Empty',
    templates: 'Templates',
    next: 'Next',
    project: 'Project',
    resume: 'Resume',
    name: 'Name',
    create: 'Create Design System',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-select-ds-add-100554')
export class ServiceSelectDsAdd100554 extends CollabLitElement {

    private msg: MessageType = messages['en'];
    
    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property()
    state: IState = {
        dsAvaliables: [],
        copyFrom: {
            name: undefined,
            dsindex: undefined,
            project: undefined,
            widgetIOName: undefined,
        },
        name: undefined,
        project: undefined
    }

    @property({ type: String }) currentScenario: IScenaries = 'sc1';

    @property({ type: String }) mode: IMode = 'default';

    @query('#l5_ds_add_input_name')
    inputName: HTMLInputElement | undefined;

    service: ServiceBase | undefined;

    onBtnNext1Click() {

        if (this.mode === 'template') {
            this.changeScenario('sc2');
            this.fireEvent(0);
            return;
        }
        this.state.copyFrom.name = 'config_ds_default';
        this.state.copyFrom.dsindex = 0;
        this.state.copyFrom.project = 100529;
        this.state.copyFrom.widgetIOName = '_100529_config_ds_default';
        this.changeScenario('sc3');
    }

    onBtnNext2Click() {
        this.changeScenario('sc3');
    }

    onBtnNext3Click() {
        this.addDs();
    }

    onRadioClick(mode: IMode) {
        this.mode = mode;
    }

    changeScenario(scenario: IScenaries) {
        this.currentScenario = scenario
    }

    validateLettersAndNumbers(str: string) {
        const pattern = /^[A-Za-z0-9]+$/;
        return pattern.test(str);
    }

    async addDs() {

        if (!this.service || !this.inputName) return;
        this.service.setError('');
        this.service.loading = true;

        const isValidName = this.validateLettersAndNumbers(this.inputName.value);

        if (!this.inputName.value || !isValidName) {
            this.service.setError('Name invalid!');
            this.service.loading = false;
            return;
        }

        if (!this.state.project) {
            this.service.setError('Project invalid!');
            this.service.loading = false;
            return;
        }

        this.state.name = this.inputName.value;

        try {

            if (!this.state.copyFrom || !this.state.copyFrom.widgetIOName) return;
            const dsAdded = await mls.l5.ds.addDesignSystem(this.state.project, this.state.name, this.state.copyFrom.widgetIOName);
            (this.service as any).setLastDsSelected(dsAdded.dsIndex, this.state.project);
            this.service.loading = true;
            if (this.service.menu.setMenuActive) this.service.menu.setMenuActive('opSelect')
        } catch (err: any) {
            this.service.setError(err.message);
        } finally {
            this.service.loading = false;

        }
    }

    getDsAvaliable(): IDs[] {
        const projects: number[] = this.getProjectsInMemory();
        const rc: IDs[] = [];
        projects.forEach((prj) => {
            const dsByPrj: mls.l5.IPrjDesignSystem[] = mls.l5['getProjectDesingSystems'](prj);
            dsByPrj.forEach((info) => {
                rc.push({
                    dsindex: info.dsIndex,
                    name: info.dsName,
                    project: prj,
                    widgetIOName: info.widgetIOName
                });
            });
        });

        return rc;
    }

    getProjectsInMemory(): number[] {
        const projectInMemory: Set<number> = new Set();
        Object.entries(mls.stor.files).forEach((item) => {
            const [key, value] = item;
            projectInMemory.add(value.project);
        });
        return Array.from(projectInMemory);
    }

    fireEvent(index: number) {
        this.state.copyFrom = this.state.dsAvaliables[index];
        if (!this.state.copyFrom) return;
        const params = {
            service: ['_100529_service_styles_preview'],
            isAddShowPreview: true,
            dsInfoAddShowPreview: {
                index: this.state.dsAvaliables[index].dsindex,
                project: this.state.dsAvaliables[index].project
            }
        };

        mls.events.fire([3], ['DSStyleSelected'], JSON.stringify(params), 0);

    }

    renderScenario() {
        switch (this.currentScenario) {
            case 'sc1':
                return html`
                    ${this.renderSc1()}
                `
            case 'sc2':
                return html`
                    ${this.renderSc2()}
                `
            case 'sc3':
                return html`
                    ${this.renderSc3()}
                `
        }
    }

    renderSc1() {
        return html`
            <section id="service_selectds_section_1">
                    <h1>${this.msg.addNew}</h1>
                    <h4>${this.msg.p1}</h4>
                    <div class="ds-type-select">
                        <div class="ds-type-select-item ${classMap({ active: this.mode === 'default' })}">
                            <input
                             name="typeGroup"
                             type="radio"
                             checked="checked"
                             value="default"
                             @click=${(e: MouseEvent) => { this.onRadioClick('default') }}
                             >
                            <div>
                                <svg fill="#000000" height="40px" width="40px" version="1.1" id="XMLID_89_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve"> 
                                    <g id="template"> 	<g> 		<path d="M8,22H0V2h24v20H8z M2,20h4V7.9H2V20z M8,20h14V8H8V20z M6,6h16V4H2v2H6z"></path> 	
                                        </g> 
                                    </g> 
                                </svg>
                            </div>
                            <span >${this.msg.empty}</span>
                        </div>
                        <div class="ds-type-select-item ${classMap({ active: this.mode === 'template' })}" >
                            <input 
                                name="typeGroup" 
                                type="radio" 
                                value="template" 
                                @click=${(e: MouseEvent) => { this.onRadioClick('template') }}
                                >
                            <div >
                                <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                                    <path d="M20.9983 10C20.9862 7.82497 20.8897 6.64706 20.1213 5.87868C19.2426 5 17.8284 5 15 5H12C9.17157 5 7.75736 5 6.87868 5.87868C6 6.75736 6 8.17157 6 11V16C6 18.8284 6 20.2426 6.87868 21.1213C7.75736 22 9.17157 22 12 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> 
                                    <path d="M3 10V16C3 17.6569 4.34315 19 6 19M18 5C18 3.34315 16.6569 2 15 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3.51839 3.82475 3.22937 4.69989 3.10149 6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> 
                                </svg>
                            </div>
                            <span >${this.msg.templates}</span>
                        </div>
                    </div>
                    <hr >
                    <div class="next-action" >
                        <button @click=${(e: MouseEvent) => { e.preventDefault(); this.onBtnNext1Click() }} >${this.msg.next}</button>
                    </div>
                </section>`
    }

    renderSc2() {
        return html`
            <section>
                <div >
                    <label >${this.msg.templates}:</label>
                    <div >
                        <select @change=${(e: MouseEvent) => { this.fireEvent(+(e.target as HTMLSelectElement).value) }}> 
                            ${this.state.dsAvaliables.map((ds, index) => html`
                                <option value=${index}>${this.msg.project}: ${ds.project} Name: ${ds.name}</option>
                            `)}
                            </select>
                    </div>
                </div>
                <hr >
                <div >
                    <button @click=${(e: MouseEvent) => { e.preventDefault(); this.onBtnNext2Click() }}>${this.msg.next}</button>
                </div>
            </section>
        `
    }

    renderSc3() {
        return html`
            <section >
                <div>
                    <label >${this.msg.resume}:</label>
                    <ul >
                        <li>Project: ${this.state.project}</li>
                        <li>Template: ${this.state.copyFrom.project + '_' + this.state.copyFrom.name}</li>
                    </ul>
                    <label>${this.msg.name}:</label>
                    <div>
                        <input id="l5_ds_add_input_name" >
                    </div>
                    <hr >
                    <div >
                        <button @click=${(e: MouseEvent) => { e.preventDefault(); this.onBtnNext3Click() }}>${this.msg.create} </button>
                    </div>
                </div>
            </section>
        `
    }


    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        this.state.project = mls.actual[5].project;
        this.state.dsAvaliables = this.getDsAvaliable();
        return html`
            <section class="service-selectds-add">
                ${this.renderScenario()}
            </section>
        `
    }

}

type IScenaries = 'sc1' | 'sc2' | 'sc3';
type IMode = 'default' | 'template';

interface IDs {
    name: string | undefined,
    dsindex: number | undefined,
    project: number | undefined,
    widgetIOName: string | undefined,
}

interface IState {
    dsAvaliables: IDs[],
    copyFrom: IDs,
    name: string | undefined,
    project: number | undefined,
}
