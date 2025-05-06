/// <mls shortName="wcClarificationPlannerNewWidget" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { postBackClarification } from "./_100554_aiAgentOrchestration";
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';

@customElement('wc-clarification-planner-new-widget-100554')
export class WcClarificationPlannerNewWidget100554 extends StateLitElement {

    private ICABASEPROJECT = 100554;

    @property() data?: ClarificationData;

    @property({ type: Boolean, reflect: true }) develpoment?: boolean = false;


    @query('#input_tagName') inputTag?: HTMLInputElement;
    @query('#widgetNameError') widgetNameError?: HTMLInputElement;

    render() {

        if (this.develpoment) this.setDevelpoment();
        return html`
        
        <div>
            ${this.data?.json.map((item) => {
            switch (item.sectionName) {
                case 'resume':
                    return this.renderResume(item);
                case 'parentClass':
                    return this.renderParentClass(item as ClarificationParentName);
                case 'widgetName':
                    return this.renderWidgetName(item as ClarificationWidgetName);
                case 'properties':
                    return this.renderProperties(item as ClarificationProperties);
                case 'requirements':
                    return this.renderRequirements(item as ClarificationRequirements);
            }
        })}
            <div class="buttons">
                <button class="cancel" @click=${this.handleCancel}>Cancelar</button>
                <button class="continue" @click=${this.handleOk}>Continuar</button>
            </div>

        </div>`;
    }

    private renderResume(item: ClarificationResume) {
        return html`
            <div class="section">
                <h2 class="title">${item.sectionName}</h2>
                <p class="desc">${item.description}</p>
            </div>
        `
    }

    private renderParentClass(item: ClarificationParentName) {
        item.widgetName = this.createParentName(item.widgetName);

        return html`
            <div class="section">
                <h2 class="title">${item.sectionName}</h2>
                <p class="desc">${item.description}</p>
                <div>
                    <label>Parent Class:</label>
                    <input
                        @input= ${(e: MouseEvent) => this.handleParentInput(e, item)} 
                        type="text"
                        .value=${item.widgetName}
                    ></input>
                </div>
            </div>
        `
    }

    private renderWidgetName(item: ClarificationWidgetName) {

        item.tagName = this.createTagName(item.tagName);
        return html`
            <div class="section">
                <h2 class="title">${item.sectionName}</h2>
                <p class="desc">${item.description}</p>
                <div>
                    <label>Widget:</label>
                    <input
                        type="text"
                        .value=${item.widgetName}
                        @input= ${(e: MouseEvent) => this.handleWidgetNameInput(e, item)} 
                    ></input>
                    <small style="color:red" id="widgetNameError"></small>
                </div>
                <div style="margin-top:.5rem">
                    <label>Tagname:</label>
                    <input
                        id="input_tagName"
                        type="text"
                        readonly
                        style="border:none"
                        @change=${(e: MouseEvent) => this.handleTagNameChange(e, item)}
                        .value=${item.tagName}
                    ></input>
                </div>
            </div>
        `
    }

    private renderProperties(item: ClarificationProperties) {
        return html`
            <div class="section">
                <h2 class="title">${item.sectionName}</h2>
                <p class="desc">${item.description}</p>
                <ul>
                    ${item.properties.map((prop) => html`<li><b>${prop.propertyName}:</b> ${prop.description} (Essencial: ${prop.isEssencial}</li>`)}
                </ul>
            </div>
        `
    }

    private renderRequirements(item: ClarificationRequirements) {
        return html`
            <div class="section">
                <h2 class="title">${item.sectionName}</h2>
                <p class="desc">${item.description}</p>
                
                <h3>Functional Requirements:</h3>
                ${item.functionalRequirements
                ? html`
                        <textarea
                            rows=${item.functionalRequirements.length}
                            .value = "- ${item.functionalRequirements.join('\n -')}"
                            @input=${(e: MouseEvent) => this.handleRqFunctionalInput(e, item)}
                        >
                        </textarea>
                    `
                : ''
            }

                <h3>Visual Requirements</h3>
                ${item.visualRequirements
                ? html`
                        <textarea
                            rows=${item.visualRequirements.length}
                            .value = "- ${item.visualRequirements.join('\n -')}"
                            @input=${(e: MouseEvent) => this.handleRqVisualInput(e, item)}
                        >
                        </textarea>
                    `
                : ''
            }

            </div>
        `
    }

    private createTagName(value: string) {
        const actual = mls.actual[5];
        const project = actual.project;
        if (!project) return value;
        return convertFileNameToTag(`_${project}_${value}`)
    }

    private createParentName(value: string) {
        return convertTagToFileName(`${value}-${this.ICABASEPROJECT}`).replace(`_${this.ICABASEPROJECT}_`, '') + 'Base'
    }

    private handleWidgetNameInput(e: MouseEvent, item: ClarificationWidgetName) {
        const target = e.target as HTMLTextAreaElement;

        const key = mls.stor.getKeyToFiles(this.ICABASEPROJECT, 2, target.value, '', '.ts');
        if (!this.widgetNameError) return;

        if (mls.stor.files[key]) {
            this.widgetNameError.innerHTML = "A widget with this name already exists";
            return;
        };

        if (!target.value.startsWith('widget')) {
            this.widgetNameError.innerHTML = "Component name must start with \"widget\"";
            return;
        }

        this.widgetNameError.innerHTML = "";
        item.widgetName = target.value;
        if (this.inputTag) {
            this.inputTag.value = this.createTagName(target.value);
            const event = new Event('change', { bubbles: true });
            this.inputTag.dispatchEvent(event);
        }
    }

    private handleTagNameChange(e: MouseEvent, item: ClarificationWidgetName) {
        const target = e.target as HTMLTextAreaElement;
        item.tagName = target.value;
    }

    private handleParentInput(e: MouseEvent, item: ClarificationParentName) {
        const target = e.target as HTMLTextAreaElement;
        item.widgetName = target.value;
    }

    private handleRqVisualInput(e: MouseEvent, item: ClarificationRequirements) {
        const target = e.target as HTMLTextAreaElement;
        item.visualRequirements = target.value.split('\n');
    }

    private handleRqFunctionalInput(e: MouseEvent, item: ClarificationRequirements) {
        const target = e.target as HTMLTextAreaElement;
        item.functionalRequirements = target.value.split('\n');
    }

    private handleCancel() {
        this.handleAction('cancel');
    }

    private handleOk() {
        let hasError = false;
        this.data?.json.map((item) => {

            if (item.sectionName === 'widgetName') {

                const key = mls.stor.getKeyToFiles(this.ICABASEPROJECT, 2, (item as ClarificationWidgetName).widgetName, '', '.ts');

                if (!this.widgetNameError) return;

                if (mls.stor.files[key]) {
                    this.widgetNameError.innerHTML = "A widget with this name already exists";
                    hasError = true;
                    return;
                };

                if (!(item as ClarificationWidgetName).widgetName.startsWith('widget')) {
                    this.widgetNameError.innerHTML = "Component name must start with \"widget\"";
                    hasError = true;
                    return;
                }

            }
            
        })

        if (hasError) return;
        this.handleAction('continue');
    }

    private async handleAction(action: 'cancel' | 'continue') {
        if (!this.data) return;
        console.info(this.data);
        await postBackClarification(action, this.data);
    }

    private setDevelpoment() {
        this.data = {
            clarificationMessage: '',
            stepId: 123,
            taskId: '123',
            json: [
                {
                    "sectionName": "resume",
                    "description": "Widget para seleção de intervalo de datas, com suporte a limites mínimos e máximos e bloqueio de datas específicas, ideal para reservas e agendamentos."
                },
                {
                    "sectionName": "parentClass",
                    "description": "Component for selecting date ranges, useful for period filters.",
                    "widgetName": "ica-forms-input-date-range"
                },
                {
                    "sectionName": "widgetName",
                    "description": "Nome do Widget",
                    "widgetName": "wcDataPickerRange",
                    "tagName": "wc-data-picker-range",
                },
                {
                    "sectionName": "properties",
                    "description": "Propriedades do widget",
                    "properties": [
                        { "propertyName": "startValue", "description": "Data inicial do intervalo selecionado", "isEssencial": "true" },
                        { "propertyName": "endValue", "description": "Data final do intervalo selecionado", "isEssencial": "true" },
                        { "propertyName": "minvalue", "description": "Data mínima permitida para seleção", "isEssencial": "false" },
                        { "propertyName": "maxvalue", "description": "Data máxima permitida para seleção", "isEssencial": "false" },
                        { "propertyName": "blockedDates", "description": "Lista de datas específicas bloqueadas para seleção (essencial)", "isEssencial": "true" },
                        { "propertyName": "label", "description": "Rótulo para o campo de seleção", "isEssencial": "false" },
                        { "propertyName": "hint", "description": "Dica para o usuário sobre o uso do widget", "isEssencial": "false" },
                        { "propertyName": "required", "description": "Define se o campo é obrigatório", "isEssencial": "false" },
                        { "propertyName": "disabled", "description": "Define se o widget está desabilitado", "isEssencial": "false" },
                        { "propertyName": "readonly", "description": "Define se o widget é somente leitura", "isEssencial": "false" },
                        { "propertyName": "autofocus", "description": "Define se o widget recebe foco automaticamente", "isEssencial": "false" },
                        { "propertyName": "pattern", "description": "Padrão para validação da data", "isEssencial": "false" },
                        { "propertyName": "errormessage", "description": "Mensagem exibida em caso de erro de validação", "isEssencial": "false" },
                        { "propertyName": "eventBinding", "description": "Eventos para interação com o widget", "isEssencial": "false" }
                    ]
                },
                {
                    "sectionName": "requirements",
                    "description": "Requisitos para este widget, altere se necessário",
                    "functionalRequirements": [
                        "Must support selection of a date range with start and end dates",
                        "Must allow setting minimum and maximum selectable dates",
                        "Must allow blocking specific dates from selection",
                        "Must provide clear validation and error messages",
                        "Must support keyboard navigation and accessibility standards",
                        "Must allow disabling and readonly modes",
                        "Must support localization (language, month and weekday labels)",
                        "Must allow navigation between months",
                        "Must highlight the current date",
                        "Must display selected date(s) with visual feedback",
                        "Must support both single and range date selection modes",
                        "Must allow customization of first day of the week"
                    ],
                    "visualRequirements": [
                        "Must render two consecutive months side by side",
                        "Must clearly differentiate between selected, hovered, and disabled dates",
                        "Must display weekdays headers aligned with their respective columns",
                        "Must use subtle color variation for past/future dates outside the current month",
                        "Must include controls for next/previous month navigation",
                        "Must include a clear call-to-action to close or confirm the selection"
                    ]
                }
            ]
        }
    }

}

interface ClarificationData {
    json: Clarification[],
    taskId: string,
    stepId: number,
    clarificationMessage: string
}

type Clarification = ClarificationResume | ClarificationWidgetName | ClarificationParentName | ClarificationProperties | ClarificationRequirements;

interface ClarificationBase {
    sectionName: string;
    description: string;
}

interface ClarificationResume extends ClarificationBase {
}

interface ClarificationWidgetName extends ClarificationBase {
    widgetName: string;
    tagName: string;
}

interface ClarificationParentName extends ClarificationBase {
    widgetName: string;
}

interface ClarificationProperties extends ClarificationBase {
    properties: {
        propertyName: string;
        description: string;
        isEssencial: string;
    }[];
}

interface ClarificationRequirements extends ClarificationBase {
    functionalRequirements: string[];
    visualRequirements?: string[];
}



