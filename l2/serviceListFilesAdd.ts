/// <mls shortName="serviceListFilesAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit'; 
import { customElement, property } from 'lit/decorators.js';

@customElement('service-list-files-add-100554')
export class SimpleGreeting extends LitElement {
    
    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() arEnhacements: mls.stor.IFileInfo[] = [];

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
                <input type="text"/>
            </div>
            <div class="grpInputServiceListNewFile">
                <label>${this.myMsg.shortName}:</label>
                <input type="text"/>
                <span></span>
            </div>
            <div class="grpInputServiceListNewFile">
                <label>${this.myMsg.type}:</label>
                <select style="height:100px" multiple="multiple"></select>
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
                <textarea id="fsExServiceListNewFile" style="width:100%;" rows="5" ></textarea>
            </fieldset>
        </sectionListInfoDef>
        
        `
        
    }

    //--------------- IMPLEMENTS----------------

    private async init() {

        try {

            this.showLoader(true);
            this.updateMyMessages();
            this.showLoader(false);
            
        } catch (e) {

            this.showLoader(false);

        }
        
        
    }

    private showLoader(loader: boolean): void {

        

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
