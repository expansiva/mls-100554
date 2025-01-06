/// <mls shortName="pluginNewFileWCD" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit';
import { IcaLitElement } from './_100554_icaLitElement';
import { getMessageKey } from "./_100554_collabLitElement";
import { propertyDataSource } from './_100554_icaLitElement';
import { ServiceBase } from './_100554_serviceBase';
import { IDetails, createNewFile, changeTagName, changeClassName, changeWidget } from "./_100554_pluginNewFileBase";
import { openService } from './_100554_libCommom'
import './_100554_wcCode';
import { getDescriptionsRootGroup, getDescriptionsSubGroup, getDescriptionsFinalGroup, getFormComponentsDescription, getAttributeDefinitions, getAttributeDefinitionsLit, getFormComponentsEvents, getEventDescription, getAttributeDefinitionsDesc } from './_100554_icaBaseDescription';

/// **collab_i18n_start**
const message_pt = {
    title: 'Criar um web component usando Lit, ICA e AI',
    description: "Criar um web component em lit 3 ,que será utilizado em páginas.\n O Lit é um framework para criar web componentes rápidos e com atualizações dinâmicas sem ter que repintar toda a tela.\n Após criar o arquivo use a inteligência artificial para preparar o web component.",
    project: "Projeto",
    shortName: "Nome",
    btnCreate: 'Criar arquivo',
    btnAnalyse: 'Analisar requerimentos',
    loading: 'Criando arquivo...',
    error: 'Nome do arquivo em branco ou invalido',
    descriptionSelect: "<-- por favor selecione ao lado",
    headerSelect: "1. Selecione o grupo e sub-grupos abaixo",
    headerDescription: "2. Abaixo descreva o componente, os requisitos e outras informações para a AI",
    headerConfirm: "3. Confirme",
}

const message_en = {
    description: "Create a web component in Lit 3 that will be used on pages.\n Lit is a framework for creating fast web components with dynamic updates without repainting the entire screen.\n After creating the file, use artificial intelligence to prepare the web component.",
    title: 'Create a Web Component Using Lit, ICA, and AI',
    project: "Project",
    shortName: "ShortName",
    btnCreate: 'Create File',
    btnAnalyse: 'Analyze Requirements',
    loading: 'Creating File...',
    error: 'Blank or invalid file name',
    descriptionSelect: "<-- Please select on the side",
    headerSelect: "1. Select the group and subgroups below",
    headerDescription: "2. Describe the component, requirements, and additional information for the AI",
    headerConfirm: "3. Confirm",
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

const lang = getMessageKey(messages);
let msg: MessageType = messages[lang];

export const details: IDetails = {
    title: msg.title,
    description: msg.description,
    tags: ["lit", "html", "component"],
}

 @customElement('plugin-new-file-w-c-d-100554')
 export class PluginNewFileWCD100554 extends IcaLitElement {

     @propertyDataSource() shortName: string | undefined;

    @propertyDataSource({ attribute: true }) project: number | undefined;

    @property() position: string = 'left';

     @property() loading: boolean = false;

     @property() inProgress: boolean = false;

    @property() aimActionSuggest: string = '_100554_aimActionAddIca';

    private service = this.closest('service-detail-100554') as ServiceBase;
    private PROPERTIES = "//**properties**"
    private JSDOC = "//**jsdoc**"
    private template: string = `
 import { html, css } from 'lit'; 
 import { customElement, property } from 'lit/decorators.js';
 import { IcaLitElement } from './_100554_icaLitElement';

 ${this.JSDOC}
 @customElement('[tagName]')
 export class [className] extends IcaLitElement {
    
    ${this.PROPERTIES}

    render() {
         return html\`<p> Hello, world !</p>\`;
     }
 }`;


    private enhancement: string = `_100554_enhancementLit`;

    private groupName: string = `other`;

     private getTemplate(): string {
         this.groupName = `${this.selectedGroup1} / ${this.selectedGroup2} / ${this.selectedGroup3}`; 
         let newExample = this.template;
         const project = this.project || 100554;
         const shortName = this.shortName || 'test1';
        newExample = changeTagName(newExample, convertFileNameToTag(`_${project}_${shortName}`));
        newExample = changeClassName(newExample, project, shortName);
        newExample = changeWidget(newExample, project, shortName);

         function getType(search: string, attributesLit: string[]): string {
             search = search.trim();
             for (const line of attributesLit) {
                 if (line.includes(` ${search}: `)) {
                     const typeMatch = line.match(/type:\s*(\w+)/);
                     if (typeMatch) {
                         return typeMatch[1];
                     }                    
                }
             }
             return "?";
         }

        // get properties
         const propertiesLit: string[] = getAttributeDefinitionsLit(this.selectedGroup1, this.selectedGroup2, this.selectedGroup3);
         newExample = newExample.replace(`${this.PROPERTIES}`, propertiesLit.join("\n"));

         const events: string[] = getFormComponentsEvents(this.selectedGroup1, this.selectedGroup2, this.selectedGroup3).split(",")
         const eventsWithDesc: string[] = events.map( (item: string) => `\t* @fires ${item} - ${getEventDescription(this.selectedGroup1, this.selectedGroup2, this.selectedGroup3, item)}`)
         const attributes: string[] = getAttributeDefinitions(this.selectedGroup1, this.selectedGroup2, this.selectedGroup3);
         const attributesWithDesc: string[] = attributes.map((item: string) => `\t* @attr { ${getType(item, propertiesLit)} } ${item} - ${getAttributeDefinitionsDesc(item)}`)

         let jsDoc = `
         /**
         *  ${this.prompt.split("\n").join("\n\t* ")}
         *
         * **groupName**:
         * **${this.selectedGroup1}**: ${this.descriptionGroup1}
         * **${this.selectedGroup2}**: ${this.descriptionGroup2}
         * **${this.selectedGroup3}**: ${this.descriptionGroup3}
         *
         * **Attributes**:
         ${attributesWithDesc.join("\n")}
         *
         * **Events**:
         ${eventsWithDesc.join("\n")}}
         *
         */`
         newExample = newExample.replace(`${this.JSDOC}`, jsDoc);
         const stepsForAI = `
         // steps for AI
// Step 1: Analyze Requirements
// - Understand the purpose of the component: an input field for email with validations.
// - Identify key features:
//   1. Validate email format and ensure the domain exists.
//   2. Reject invalid characters based on a regex pattern.
// - Note: CSS will be written in a separate LESS file.
// - Note: Each web component should have an HTML file for documentation and usage examples.

// Step 2: Implement Attributes
// - Define attributes as @property decorators for reactivity.
// - Include attributes such as:
//   - name, hint, label, required, disabled, readonly, maxlength, minlength, placeholder, pattern, etc.
// - Configure default values where necessary.
// - Ensure that each attribute is functional and linked to the component's state.

// Step 3: Implement Render
// - Create the HTML structure for the email input component:
//   - Add an input field (type="email").
//   - Bind attributes to the input field (e.g., placeholder, required).
//   - Add labels and error messages dynamically based on properties.
// - Use the Lit 'html' function to define the template.
// - Ensure accessibility with proper 'aria-*' attributes.
// - Add hooks for events such as '@input' and '@blur'.

// Step 4: Implement Events
// - Set up event listeners for interactions:
//   - '@input': Update the value dynamically as the user types.
//   - '@blur': Trigger validation when the field loses focus.
//   - '@invalid': Display error messages for failed validations.
// - Use debounce logic for '@input' to delay updates by 500ms to prevent excessive re-renders.
// - Update internal state ('this.value', 'this.validationMessage') based on user input and validation results.

// Step 5: Implement Validations
// - Add validation logic for the email input:
//   - Validate email format using regex or the 'pattern' attribute.
//   - Check if the domain is valid (optionally use external APIs for domain existence).
// - Display error messages using 'errormessage' or 'validationMessage'.
// - Ensure validations run efficiently and are triggered by specific events ('@blur', '@input').

// Step 6: Add Tests and Debugging
// - Manually and programmatically test the component:
//   - Test all attributes (e.g., placeholder, required, maxlength) with different values.
//   - Simulate user interactions (e.g., typing, focus, blur).
// - Validate the component's behavior in real scenarios:
//   - Input valid/invalid emails, empty values, etc.
//   - Test integration with forms and external CSS.
// - Debug any issues and refine the implementation as necessary.

// Step 7: Document and Finalize
// - Create an HTML documentation file for the component:
//   - Describe the component's purpose, attributes, events, and usage examples.
//   - Include example scenarios for consumers.
// - Finalize the LESS file:
//   - Write styles to enhance the visual appearance and align with design guidelines.
//   - Ensure that the CSS is scoped and doesn't leak to other components.
// - Ensure the TypeScript, LESS, and HTML documentation are packaged correctly for reuse.         `;

         return `/// <mls shortName="${shortName}" project="${project}" enhancement="${this.enhancement}" groupName="${this.groupName}" />\n${newExample}\n${stepsForAI}`;;
     }

     private async handleAnalyze(e: Event) {
         this.inProgress = true;
         setTimeout(() => {
             this.inProgress = false;
         }, 2000);        
    }

    private async handleAddFile() {
        if (!this.project || !this.shortName) {
            this.service.setError(msg.error)
            return;
        };
        this.loading = true;
        try {
            await createNewFile(this.project, this.position, this.shortName, this.enhancement, this.getTemplate(), false);
            if (this.service) {
                openService('_100554_serviceAim', 'right', 2);
                const opInstance = this.service.nav3Service?.getActiveInstance('right');
                if (opInstance) {
                    opInstance.setAttribute('actiontoopen', this.aimActionSuggest)
                }
            }

        } catch (e: any) {
            this.loading = false;
        }
    }

     render() {
        const selectedGroup3 = this.selectedGroup3 !== 'none';

        return html`
            ${this.loading ?
                html`<div>${msg.loading}</div>`
                :
                html`   
                <div>
                    <h2>${msg.title} </h2>
                    <hr>
                    ${this.renderChoicesGroup()}
                    ${this.renderDescription()}
                    <hr>
                    ${this.renderConfirm()}
                    <hr>
                    ${selectedGroup3 ? 
                    html `<wc-code-100554 language="typescript" text="${this.getTemplate()}"></wc-code-100554>`
                    : ""}

                
                </div>`
            }
        `
     }

     updated(changedProperties: Map<string | number | symbol, unknown>) {
         super.updated(changedProperties);

         const select2 = this.querySelector("#select2") as HTMLSelectElement;
         if (select2) {
             select2.value = this.selectedGroup2 || "none";
         }
         const select3 = this.querySelector("#select3") as HTMLSelectElement;
         if (select3) {
             select3.value = this.selectedGroup3 || "none";
         }
     }

     renderConfirm(): TemplateResult {
         return html`
            <h3>${msg.headerConfirm}</h3>
            <div>
                <span> <b>${msg.project}:</b> ${this.project}</span>
                <span> <b>${msg.shortName}:</b> ${this.shortName}</span>    
            </div>
            <div style="margin-top:1rem;">   
                <button
                  class="${this.inProgress ? 'analyze inprogress' : 'analyze'}"
                  @click=${this.handleAnalyze}>${msg.btnAnalyse}
                </button>
                <button
                  class="${this.inProgress ? 'create inprogress' : 'create'}"
                  @click=${this.handleAddFile}>${msg.btnCreate}
                </button>
            </div>
         `;
     }

     renderDescription(): TemplateResult {
         return html`
         <hr>
         <h3>${msg.headerDescription}</h3>
        <textarea 
            name="prompt" 
            rows="10" 
            placeholder="prompt"
            @input=${this.handleInput}
        ></textarea>
         `;
     }

     private debounceTimer?: number;
     private prompt: string = "";
     handleInput(event: Event): void {
         const target = event.target as HTMLTextAreaElement;
         const newValue = target.value;
         if (this.debounceTimer) {
             clearTimeout(this.debounceTimer);
         }
         this.debounceTimer = window.setTimeout(() => {
             this.prompt = newValue;
             this.requestUpdate();
         }, 500);
     }

     renderChoicesGroup(): TemplateResult {
         const group1: string[] = getDescriptionsRootGroup();
         const selectedGroup1 = this.selectedGroup1 || '';
         const group2: string[] = selectedGroup1 ? getDescriptionsSubGroup(this.selectedGroup1) : [];
         const selectedGroup2 = this.selectedGroup2 || '';
         const group3: string[] = selectedGroup2 ? getDescriptionsFinalGroup(selectedGroup1, selectedGroup2) : [];
         const selectedGroup3 = this.selectedGroup3 || '';

         const descriptionSelect = msg.descriptionSelect;


         return html`
         <h3>${msg.headerSelect}</h3>
        <div class='rowSelect'>
            <select
            size="1"
            tabindex="1"
            @focus=${(e: Event) => this.enableDropdown(e.target as HTMLSelectElement)}
            @blur=${(e: Event) => this.disableDropdown(e.target as HTMLSelectElement)}
            @change=${(e: Event) => this.handleGroup1Change((e.target as HTMLSelectElement).value)}>
                <option value="" ?selected=${!selectedGroup1}></option>
                ${group1.map(item => html`<option value="${item}" ?selected=${item === selectedGroup1}>${item}</option>`)}
            </select>
            <span class="step-indicator">1/3</span>
            <p>${this.descriptionGroup1}</p>
        </div>
        ${group2.length
                 ? html`
        <div class='rowSelect'>
            <select id="select2"
            tabindex="2"
            size="1"
            @focus=${(e: Event) => this.enableDropdown(e.target as HTMLSelectElement)}
            @blur=${(e: Event) => this.disableDropdown(e.target as HTMLSelectElement)}
            @change=${(e: Event) => this.handleGroup2Change((e.target as HTMLSelectElement).value)}>
        <option value="" ?selected=${!selectedGroup2}></option>
            <option value="none"></option>
                 ${group2.map(item => html`<option value="${item}">${item}</option>`)}
            </select>
            <span class="step-indicator">2/3</span>
            <p>${this.descriptionGroup2}</p>
            </div>
            `
                 : ''}
        ${group3.length
                 ? html`
        <div class='rowSelect'>
            <select id="select3"
            tabindex="3"
            size="1"
            @focus=${(e: Event) => this.enableDropdown(e.target as HTMLSelectElement)}
            @blur=${(e: Event) => this.disableDropdown(e.target as HTMLSelectElement)}
            @change=${(e: Event) => this.handleGroup3Change((e.target as HTMLSelectElement).value)}>
                <option value="none"></option>
                ${group3.map(item => html`<option value="${item}">${item}</option>`)}
            </select>
            <span class="step-indicator">3/3</span>
            <p>${this.descriptionGroup3}</p>
            </div>
            `
                 : ''}
    `;

     }

     enableDropdown(target: HTMLSelectElement) {
         target.size = 5;
     }

     disableDropdown(target: HTMLSelectElement) {
         target.size = 1;
     }

     selectedGroup1: string = "";
     selectedGroup2: string = "none";
     selectedGroup3: string = "none";
     descriptionGroup1: string = "";
     descriptionGroup2: string = "";
     descriptionGroup3: string = "";

     handleGroup1Change(value: string) {
         this.selectedGroup1 = value;
         this.selectedGroup2 = "none"; 
         this.selectedGroup3 = "none";
         this.descriptionGroup1 = this.selectedGroup1 ? getFormComponentsDescription(this.selectedGroup1, null, null) : msg.descriptionSelect;
         this.descriptionGroup2 = msg.descriptionSelect
         this.requestUpdate();
     }

     handleGroup2Change(value: string) {
         this.selectedGroup2 = value;
         this.selectedGroup3 = "none"; 
         this.descriptionGroup2 = this.selectedGroup2 !== "none" ? getFormComponentsDescription(this.selectedGroup1, this.selectedGroup2, null) : msg.descriptionSelect;
         this.descriptionGroup3 = msg.descriptionSelect
         this.requestUpdate();
     }

     handleGroup3Change(value: string) {
         this.selectedGroup3 = value;
         this.descriptionGroup3 = this.selectedGroup3 !== "none" ? getFormComponentsDescription(this.selectedGroup1, this.selectedGroup2, this.selectedGroup3) : msg.descriptionSelect;
         this.requestUpdate();
     }
}


