/// <mls shortName="agentCreateHtmlExample" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { AgentBase, IAgentBase } from './_100554_iaAgentBase';

export class agentPlannerNewPage extends AgentBase implements IAgentBase {

    public task: mls.msg.TaskData | undefined;
    public visibility: 'public' | 'private' = 'private';

    public getPrompt(prompt: string | undefined): mls.msg.IAMessageInputType[] {
        return this.getMyImputs(prompt || '');
    }

    public async afterPrompt(payload: mls.msg.AIPayload[] | null | undefined): Promise<void> {
        return this._afterPrompt(payload);
    }

    //---------IMPLEMENTS-------------

    private async _afterPrompt(payload: mls.msg.AIPayload[] | null | undefined): Promise<void> {

    }

    private getMyImputs(prompt: string): mls.msg.IAMessageInputType[] {

        return [
            {
                type: 'system',
                content: `
Você é um programador especialista em desenvolvimento de componentes WEB com Lit versão 3

A partir do código typescript passado pelo usuário, você deve gerar um HTML de saída, simulando a inclusão do componente em uma página

Se faltar qualquer informação, retornar uma "clarificationMessage".
`
            },
            {
                type: 'system',
                content: `
## Exemplo de saída

Para o código de entrada abaixo

\`\`\`ts
/// <mls shortName="wcInputDateRange" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, ifDefined, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement'

@customElement('wc-input-date-range-100554')
export class WCInputDateRange extends IcaLitElement {

    @property({ type: String }) name: string = '';

    @property({ type: String }) label: string = '';

    @property({ type: String }) widget: string = '';

    @property({ type: String }) pattern: string = '';

    @property({ type: String }) errormessage: string = '';

    @property({ type: Number }) maxvalue: number | undefined;

    @property({ type: Number }) minvalue: number | undefined;

    @property({ type: Boolean }) required: boolean = false;

    @property({ type: Boolean }) disabled: boolean = false;

    @property({ type: Boolean }) readonly: boolean = false;

    @property({ type: Boolean }) autofocus: boolean = false;

    @property({ type: String }) hint: string = '';

    @property({ type: String }) inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' = 'none';

    @property({ type: String }) valueInitial: string = '';

    @property({ type: String }) valueFinal: string = '';

    @property({ type: String }) separatorText: string = '';

    @query('.input_control.initial') inputInitial: HTMLInputElement | undefined;

    @query('.input_control.final') inputFinal: HTMLInputElement | undefined;


    error: string = '';

    render() {
        return html\`
        <label class="form-control-label">
          \${this.label}
        </label>
        <div class="input_container">
            <input
                class="input_control initial"
                type="date"
                name=\${ifDefined(this.name)}
                ?disabled=\${this.disabled}
                ?readonly=\${this.readonly}
                ?required=\${this.required}
                min=\${ifDefined(this.minvalue)}    
                .value=\${this.valueInitial}
                ?autofocus=\${this.autofocus}
                pattern=\${ifDefined(this.pattern)}
                inputmode=\${ifDefined(this.inputmode)}
                @input=\${this.handleChange}
            />

            <span>\${this.separatorText}</span>

            <input
                class="input_control final"
                type="date"
                name=\${ifDefined(this.name)}
                ?disabled=\${this.disabled}
                ?readonly=\${this.readonly}
                ?required=\${this.required}
                min=\${ifDefined(this.valueInitial)}
                max=\${ifDefined(this.maxvalue)}
                .value=\${this.valueFinal}
                ?autofocus=\${this.autofocus}
                pattern=\${ifDefined(this.pattern)}
                inputmode=\${ifDefined(this.inputmode)}
            />
        </div>
        <small class="form_hint">\${this.hint}</small>

        <div class="form_error_message">\${this.error}</div>
        \`;
    }


    private handleChange() {
        if (!this.inputFinal || !this.inputInitial) return;

        let maxValue = this.inputInitial.value;

        this.inputFinal.min = maxValue;

        if (this.inputFinal.value < maxValue) {
            this.inputFinal.value = maxValue;
        }
    }
}
\`\`\`

deve gerar o seguinte exemplo

<div>
<wc-input-date-range-100554 
    name=""
    label=""
    widget=""
    pattern=""
    errormessage=""
    maxvalue=""
    minvalue=""
    required="false"
    disabled="false"
    readonly="false"
    autofocus="false"
    hint=""
    inputmode="none"
    valueInitial=""
    valueFinal=""
    separatorText=""
    ></wc-input-date-range-100554>
</div>

outro exemlo de saída seria

<div>
<wc-input-date-range-100554 
    name="txtInterval"
    label="Período de viagem"
    errormessage="data inválida"
    hint="selecione um interválo válido de datas"
    inputmode="none"
    valueInitial="2025-02-01"
    valueFinal="2025-02-28"
    separatorText="até"
    >
</wc-input-date-range-100554>
</div>
`
            },
            {
                type: 'system',
                content: `
## Regras adicionais

- gerar pelo menos dois exemplos
`
            },
            {
                type: 'human',
                content: prompt || ''
            },
        ]

    }

}