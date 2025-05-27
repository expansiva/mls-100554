/// <mls shortName="widgetInputCreditCardMasked" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputMaskedBase } from './_100554_icaFormsInputMaskedBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';

/// **collab_i18n_start**
const message_pt = {
    invalidCard: 'Número de cartão inválido',
    placeholder: 'Número do cartão',
};
const message_en = {
    invalidCard: 'Invalid card number',
    placeholder: 'Card number', 
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**

const CARD_TYPES = [
    {
        name: 'hipercard',
        pattern: /^(606282|3841)/,
        mask: '9999 9999 9999 9999',
        icon: 'hipercard',
        lengths: [16]
    },
    
    {
        name: 'elo',
        pattern: /^(4011|4312|4389|4514|4576|5041|5066|5090|6277|6362|6504|6505|6509|6516|6550)/,
        mask: '9999 9999 9999 9999',
        icon: 'elo',
        lengths: [16]
    },
    {
        name: 'visa',
        pattern: /^4/, //Visa: 4xxx
        mask: '9999 9999 9999 9999',
        icon: 'visa',
        lengths: [16]
    },
    {
        name: 'mastercard',
        pattern: /^(5[1-5]|2[2-7])/, //MasterCard: 51 - 55, 2221-2720
        mask: '9999 9999 9999 9999',
        icon: 'mastercard',
        lengths: [16]
    },
    {
        name: 'amex',
        pattern: /^3[47]/, //Amex: 34, 37
        mask: '9999 999999 99999',
        icon: 'amex',
        lengths: [15]
    },
    {
        name: 'diners',
        pattern: /^3(0[0-5]|[68])/, //Diners: 300 - 305, 36, 38
        mask: '9999 999999 9999',
        icon: 'diners',
        lengths: [14]
    },
    {
        name: 'discover',
        pattern: /^6(?:011|5)/, //Discover: 6011, 65
        mask: '9999 9999 9999 9999',
        icon: 'discover',
        lengths: [16]
    },
    
];

function detectCardType(value: string) {
    if (value.length < 3) return undefined;
    const clean = value.replace(/\\D/g, '');
    for (const type of CARD_TYPES) {
        if (type.pattern.test(clean)) {
            return type;
        }
    }
    return undefined;
}

function luhnCheck(card: string): boolean {
    const arr = (card + '').replace(/\\D/g, '').split('').reverse().map(x => parseInt(x));
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        let val = arr[i];
        if (i % 2) {
            val *= 2;
            if (val > 9) val -= 9;
        }
        sum += val;
    }
    return sum % 10 === 0;
}

@customElement('widget-input-credit-card-masked-100554')
/**
 * Widget para entrada de número de cartão de crédito com máscara automática, validação Luhn e exibição do ícone da bandeira.
 * Ideal para checkouts e formulários de pagamento.
 */
export class WidgetInputCreditCardMasked extends IcaFormsInputMaskedBase {

    private myMessage: MessageType = messages['en'];

    /**
     * Nome do campo para binding do valor
     * @example name=\"creditCard\"
     */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;

    @propertyCompositeDataSource({ type: String }) required: boolean | undefined;

    /**
     * Número do cartão de crédito com máscara aplicada
     * @example value=\"4111 1111 1111 1111\"
     */
    @propertyDataSource({ type: String }) value: string | undefined;

    /**
     * Texto do rótulo exibido acima do campo
     * @example label=\"Número do cartão\"
     */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;

    /**
     * Texto de placeholder exibido no campo
     * @example placeholder=\"0000 0000 0000 0000\"
     */
    @propertyCompositeDataSource({ type: String }) placeholder: string | undefined;

    /**
     * Texto de ajuda ou dica para o usuário
     * @example hint=\"Digite o número do cartão sem espaços\"
     */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined;

    /**
     * Máscara dinâmica aplicada conforme o padrão do cartão
     * @example mask=\"9999 9999 9999 9999\"
     */
    @propertyDataSource({ type: String }) mask: string | undefined;

    /**
     * Define se o campo é somente leitura
     * @example readonly=\"true\"
     */
    @propertyDataSource({ type: String }) readonly: boolean | undefined;

    /**
     * Define se o campo está desabilitado
     * @example disabled=\"true\"
     */
    @propertyDataSource({ type: String }) disabled: boolean | undefined;

    /**
     * Mensagem de erro exibida quando o número do cartão é inválido
     * @example errormessage=\"Número de cartão inválido\"
     */
    @propertyDataSource({ type: String }) errormessage: string | undefined;

    /**
     * Flag para ativar validação Luhn em tempo real
     * @example validateLuhn=\"true\"
     */
    @propertyDataSource({ type: String }) validateLuhn: string | undefined;

    /**
     * Bloqueia caracteres inválidos durante a digitação
     * @example blockInvalidChars=\"true\"
     */
    @propertyDataSource({ type: String }) blockInvalidChars: string | undefined;

    /**
     * Autocomplete do campo
     * @example autocomplete=\"cc-number\"
     */
    @propertyDataSource({ type: String }) autocomplete: string | undefined;

    private error: string = '';
    private cardType: any = undefined;
    private iconCardType: string | undefined;

    private get __placeholder() {
        return this.placeholder || this.myMessage.placeholder;
    }

    private get __mask() {
        if (this.mask) return this.mask;
        if (this.cardType) return this.cardType.mask;
        return '9999 9999 9999 9999';
    }

    private get _iconCardType() {
        if (this.iconCardType) return this.iconCardType;
        if (this.cardType) return this.cardType.icon;
        return 'generic';
    }

    private get _showError() {
        return !!this.error;
    }

    private handleInput(e: Event) {
        let val = (e.target as HTMLInputElement).value;
        if (this.blockInvalidChars === 'true') {
            val = val.replace(/[^0-9 ]/g, '');
        }
        const detected = detectCardType(val);
        this.cardType = detected;
        this.iconCardType = detected ? detected.icon : undefined;
        this.mask = detected ? detected.mask : '9999 9999 9999 9999';
        this.value = this.applyMask(val, this.mask);
        if (this.validateLuhn === 'true' && this.value) {
            const clean = this.value.replace(/\\D/g, '');
            if (detected && detected.lengths.includes(clean.length)) {
                if (!luhnCheck(clean)) {
                    this.error = this.errormessage || this.myMessage.invalidCard;
                } else {
                    this.error = '';
                }
            } else {
                this.error = '';
            }
        } else {
            this.error = '';
        }
        this.requestUpdate();
    }

    private applyMask(value: string, mask: string): string {
        const clean = value.replace(/\\D/g, '');
        let masked = '';
        let idx = 0;
        for (let i = 0; i < mask.length && idx < clean.length; i++) {
            if (mask[i] === '9') {
                masked += clean[idx];
                idx++;
            } else {
                masked += mask[i];
            }
        }
        return masked;
    }

    render() {
        return html`
 <div class=\"ccim_field\">
 ${this.label ? html`<label class=\"ccim_label\">${this.label}</label>` : ''}
 <div class=\"ccim_input_wrapper ${this._showError ? 'ccim_input_error' : ''}\">
 <input
 class=\"ccim_input\"
 type=\"text\"
 inputmode=\"numeric\"
 autocomplete=${ifDefined(this.autocomplete || 'cc-number')}
 name=${ifDefined(this.name)}
 .placeholder=${this.__placeholder}
 .value=${this.value || ''}
 ?readonly=${this.readonly?.toString() === 'true'}
 ?disabled=${this.disabled?.toString() === 'true'}
 @input=${this.handleInput.bind(this)}
 maxlength=${this.__mask.replace(/[^9]/g, '').length + this.__mask.replace(/9/g, '').length}
 />
 <span class=\"ccim_icon ccim_icon--${this._iconCardType}\"></span>
 </div>
 ${this.hint ? html`<div class=\"ccim_hint\">${this.hint}</div>` : ''}
 ${this._showError ? html`<div class=\"ccim_error\">${this.error}</div>` : ''}
 </div>
 `;
    }
}