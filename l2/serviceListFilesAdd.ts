/// <mls shortName="serviceListFilesAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('service-list-files-add-100554')
export class ServiceListFilesAdd100554 extends LitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() arEnhacements: {text:string, value:string}[] = [];

    @property() level: number = -1;

    @property() position: string = '';

    connectedCallback() {
        super.connectedCallback();
        this.init();
    }

    render() {
        return html`
            ${this.renderDefinition()}
            ${this.renderInfo()}
        `;
    }

    renderDefinition() {
    
        return html`
        <sectionListAddDef>
            <div class="grpInputServiceListNewFile">
                <label>${this.myMsg.project}:</label>
                <input type="text" disabled value="${mls.actual[5].project?.toString()}"/>
            </div>
            <div class="grpInputServiceListNewFile">
                <label>${this.myMsg.shortName}:</label>
                <input type="text"/>
                <span></span>
            </div>
            <div class="grpInputServiceListNewFile">
                <label>${this.myMsg.type}:</label>
                <select style="height:100px" multiple="multiple">
                    <option value="blank">Blank</option>
                    ${repeat(
                        this.arEnhacements,
                        ((item: any) => item.value) as any,
                        ((i: any, index: any) => {

                            return this.renderOpt(i)

                        }) as any
                    )}
                </select>
            </div>
            <div class="grpInputServiceListNewFile">
                <label>${this.myMsg.group}:</label>
                <input value="other" type="text"/>
            </div>
            <div class="grpButtonServiceListNewFile">
                <button class="btnCancelServiceListNewFile">${this.myMsg.cancel}</button>
                <button class="btnAddServiceListNewFile">${this.myMsg.add}</button>
            </div>
        </sectionListAddDef>
        `
    }

    renderInfo() {

        return html`
        <sectionListInfoDef>
            <fieldset>
                <legend>${this.myMsg.description}:</legend>
                <div id="fsDescServiceListNewFile" style="height:120px"></div>
            </fieldset>
            <fieldset>
                <legend>${this.myMsg.example}:</legend>
                <textarea id="fsExServiceListNewFile" disabled style="width:100%;" rows="5" ></textarea>
            </fieldset>
        </sectionListInfoDef>
        
        `

    }

    renderOpt(opt: { text: string, value: string }) {
        return html`<option value="${opt.value}"> ${opt.text}</option>`
    }

    //--------------- IMPLEMENTS----------------

    private async init() {

        try {

            this.showLoader(true);
            this.updateMyMessages();
            this.setEnhacement();
            this.showLoader(false);

        } catch (e) {

            this.showLoader(false);

        }


    }

    private showLoader(loader: boolean): void {

        if (!this.shadowRoot || !this.shadowRoot.parentElement) return
        (this.shadowRoot.parentElement as any).loader = loader;

    }

    private setEnhacement(): void {
    
        const array:{text:string, value:string}[] = [];
        const keys = Object.keys(mls.stor.files);
        keys.forEach((i) => {

            const f = mls.stor.files[i];
            if (f.level !== +this.level || !f.shortName.startsWith('enhancement') || f.extension !== '.ts' ) return;

            const opt = {
                text: `${f.project}_${f.shortName}`,
                value: i
            }

            array.push(opt);

        });

        this.arEnhacements = [...array];

    }

    private updateMyMessages() {

        if (!window['message' as any]) return;
        const m = window['message' as any] as any;

        if (m.project) this.myMsg.project = m.project;
        if (m.shortName) this.myMsg.shortName = m.shortName;
        if (m.type) this.myMsg.type = m.type;
        if (m.group) this.myMsg.group = m.group;
        if (m.cancel) this.myMsg.cancel = m.cancel;
        if (m.add) this.myMsg.add = m.add;
        if (m.description) this.myMsg.description = m.description;
        if (m.example) this.myMsg.example = m.example;

    }

    private myMsg = {
        project: 'Project',
        shortName: 'Short Name',
        type: 'Type',
        group: 'Group',
        cancel: 'Cancel',
        add: 'Add',
        description: 'Description',
        example: 'Example'
    }

}

