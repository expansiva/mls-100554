/// <mls shortName="agentCreateWidget" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { AgentBase, IAgentBase } from './_100554_iaAgentBase';

export class agentCreateWidget extends AgentBase implements IAgentBase {

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
Você é um programador responsável pela criação de um novo componente (widget) no sistema.

Com base no prompt original do usuário, sua tarefa é:
1. Com base no json enviado pelo usuário, criar um novo componente nestas especificações
2. Se os dados forem suficientes, preparar a chamada para o agente "agentCreateNewWidget".
3. Se faltar qualquer informação, retornar uma "clarificationMessage".
`
            },
            {
                type: 'system',
                content: `
## Formato de saida

Você deve retornar o código em typescript, como no exemplo abaixo. 
Observação: não deve retornar nenhum código LESS ou CSS, pois isso será feito posteriormente.

* Arquivo TS

/// <mls shortName="wcInputNumber" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, ifDefined, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaFormsInputNumberBase } from './_100554_icaFormsInputNumberBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';

@customElement('wc-input-number-100554')
export class WCInputNumber extends IcaFormsInputNumberBase {

    @propertyDataSource({ type: String }) value: number | undefined;

    @property({ type: String }) name: string | undefined;

    @property({ type: String }) placeholder: string | undefined;

    @propertyCompositeDataSource({ type: String }) label: string | undefined;

    @property({ type: String }) pattern: string | undefined;

    @property({ type: String }) errormessage: string | undefined;

    @property({ type: Number }) maxvalue: number | undefined;

    @property({ type: Number }) minvalue: number | undefined;

    @property({ type: Number }) step: number | undefined;

    @property({ type: Boolean }) required: boolean = false;

    @property({ type: Boolean }) disabled: boolean = false;

    @property({ type: Boolean }) readonly: boolean = false;

    @property({ type: Boolean }) autofocus: boolean = false;

    @propertyCompositeDataSource({ type: String }) hint: string = '';

    @property({ type: String }) inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' = 'none';

    @query('.input_control') input: HTMLInputElement | undefined;

    error: string = '';

    render() {
        return html\`
        <label class="form-control-label" for="input">
          \${this.label}
        </label>

        <input
            id="input"
            class="input_control"
            type="number"
            name=\${ifDefined(this.name)}
            ?disabled=\${this.disabled}
            ?readonly=\${this.readonly}
            ?required=\${this.required}
            min=\${ifDefined(this.minvalue)}    
            max=\${ifDefined(this.maxvalue)}
            step=\${ifDefined(this.step as number)}
            .value=\${this.value}
            ?autofocus=\${this.autofocus}
            pattern=\${ifDefined(this.pattern)}
            inputmode=\${ifDefined(this.inputmode)}
            @input=\${this.handleChange}
        />

        <div class="form_error_message">\${this.error}</div>
        \`;
    }

    private handleChange() {
        if (!this.input) return;
        let newval = +this.input.value;
        if (!isNaN(newval)
            && (this.minvalue === undefined || (newval >= this.minvalue))
            && (this.maxvalue === undefined || (newval <= this.maxvalue))
        ) {
            this.value = newval;
            this.error = '';
            this.requestUpdate();
        } else {
            this.error = this.errormessage || '';
            this.requestUpdate();
        }
    }
}
`
            },
            {
                type: 'human',
                content: prompt || ''
            },
        ]

    }

}