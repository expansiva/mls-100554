/// <mls shortName="widgetInputDateMaskedMinimal" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputDateBase } from './_100554_icaFormsInputDateBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    invalidDate: 'Data inválida',
    invalidPeriod: 'Data fora do período permitido',
    placeholder: 'dd/mm/aaaa'
}
const message_en = {
    invalidDate: 'Invalid date',
    invalidPeriod: 'Date out of allowed period',
    placeholder: 'dd/mm/yyyy'
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

/**
 * Widget minimalista para entrada de data com máscara no formato dd/mm/aaaa, validação de formato e período, sem calendário pop-up, ideal para formulários rápidos e mobile-first.
 */
@customElement('widget-input-date-masked-minimal-100554')
export class WidgetInputDateMaskedMinimal extends IcaFormsInputDateBase {
    /**
     * Nome do campo para binding de dados
     * @example name="dataNascimento"
     */
    @propertyCompositeDataSource({ type: String })
    name: string | undefined;

    /**
     * Valor da data no formato dd/mm/aaaa
     * @example value="31/12/2025"
     */
    @propertyDataSource({ type: String })
    value: string | undefined;

    /**
     * Máscara para entrada no formato dd/mm/aaaa
     * @example mask="99/99/9999"
     */
    @propertyDataSource({ type: String })
    mask: string | undefined = '99/99/9999';

    /**
     * Texto placeholder para o campo de data
     * @example placeholder="dd/mm/aaaa"
     */
    @propertyDataSource({ type: String })
    placeholder: string | undefined;

    /**
     * Data mínima permitida no formato ISO (aaaa-mm-dd)
     * @example minvalue="1900-01-01"
     */
    @propertyDataSource({ type: String })
    minvalue: string | undefined;

    /**
     * Data máxima permitida no formato ISO (aaaa-mm-dd)
     * @example maxvalue="2025-12-31"
     */
    @propertyDataSource({ type: String })
    maxvalue: string | undefined;

    /**
     * Mensagem de erro exibida quando a data é inválida
     * @example errormessage="Data inválida"
     */
    @propertyDataSource({ type: String })
    errormessage: string | undefined;

    /**
     * Define se o campo é somente leitura
     * @example readonly={true}
     */
    @propertyDataSource({ type: Boolean })
    readonly: boolean = false;

    /**
     * Define se o campo está desabilitado
     * @example disabled={true}
     */
    @propertyDataSource({ type: Boolean })
    disabled: boolean = false;

    /**
     * Define se o campo recebe foco automático
     * @example autofocus={true}
     */
    @propertyDataSource({ type: Boolean })
    autofocus: boolean = false;

    /**
     * Valida a data imediatamente após alteração
     * @example validateonchange={true}
     */
    @propertyDataSource({ type: Boolean })
    validateonchange: boolean = true;

    /**
     * Exibe erro visual imediato quando a data é inválida
     * @example showErrorVisual={true}
     */
    @propertyDataSource({ type: Boolean })
    showErrorVisual: boolean = false;

    /**
     * Dica do campo
     * @example hint="Informe sua data de nascimento"
     */
    @propertyCompositeDataSource({ type: String })
    hint: string | undefined;

    /**
     * Rótulo do campo
     * @example label="Data de nascimento"
     */
    @propertyCompositeDataSource({ type: String })
    label: string | undefined;

    /**
     * Campo obrigatório
     * @example required={true}
     */
    @propertyDataSource({ type: Boolean })
    required: boolean = false;

    /**
     * Expressão regular para validação do formato
     * @example pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$"
     */
    @propertyDataSource({ type: String })
    pattern: string | undefined = '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$';

    private error: string = '';
    private _lang: string = 'pt';
    private get _msg(): MessageType {
        return messages[this._lang] || messages['pt'];
    }

    private _input?: HTMLInputElement;

    private _onInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this._input = input;
        let val = input.value;
        val = this._applyMask(val);
        input.value = val;
        this.value = val;
        if (this.validateonchange) {
            this._validate(val);
        }
        this.requestUpdate();
    }

    private _onBlur() {
        if (this.validateonchange) {
            this._validate(this.value);
            this.requestUpdate();
        }
    }

    private _applyMask(val: string): string {
        // Remove tudo que não for número
        let digits = val.replace(/\D/g, '');
        let masked = '';
        for (let i = 0, j = 0; i < (this.mask ? this.mask.length : 10) && j < digits.length; i++) {
            if (this.mask && this.mask[i] === '9') {
                masked += digits[j];
                j++;
            } else if (this.mask) {
                masked += this.mask[i];
            }
        }
        return masked;
    }

    private _validate(val?: string) {
        this.error = '';
        if (!val || val.length < 10) {
            this.error = this.errormessage || this._msg.invalidDate;
            return;
        }
        const regex = new RegExp(this.pattern || '');
        if (!regex.test(val)) {
            this.error = this.errormessage || this._msg.invalidDate;
            return;
        }
        const [d, m, y] = val.split('/').map(Number);
        const date = new Date(y, m - 1, d);
        if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
            this.error = this.errormessage || this._msg.invalidDate;
            return;
        }
        if (this.minvalue) {
            const min = new Date(this.minvalue);
            if (date < min) {
                this.error = this._msg.invalidPeriod;
                return;
            }
        }
        if (this.maxvalue) {
            const max = new Date(this.maxvalue);
            if (date > max) {
                this.error = this._msg.invalidPeriod;
                return;
            }
        }
    }

    render() {
        const showError = this.showErrorVisual && !!this.error;
        return html`
<div class="input-date-minimal-root">
<label>${this.label}</label>
<input
class="input-date-minimal${showError ? ' input-date-minimal--error' : ''}"
type="text"
inputmode="numeric"
autocomplete="off"
maxlength="10"
placeholder=${ifDefined(this.placeholder || this._msg.placeholder)}
name=${ifDefined(this.name)}
.value=${this.value || ''}
?readonly=${this.readonly.toString() === 'true'}
?disabled=${this.disabled.toString() === 'true'}
?autofocus=${this.autofocus}
@input=${this._onInput}
@blur=${this._onBlur}
aria-invalid=${showError ? 'true' : 'false'}
aria-describedby="${showError ? 'error-message' : ''}"
/>
${showError ? html`<div id="error-message" class="input-date-minimal__error">${this.error}</div>` : ''}
</div>
`;
    }
}
