/// <mls shortName="widgetInputStringMultiline" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputStringBase, IAutoCapitalize, IAutocorrect } from './_100554_icaFormsInputStringBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    lines: 'linhas',
}
const message_en = {
    lines: 'lines',
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
/**
* Campo de texto multilinha (textarea) com suporte a redimensionamento vertical, altura mínima ajustável e contagem de linhas digitadas.
*/
@customElement('widget-input-string-multiline-100554')
export class WidgetInputStringMultiline extends IcaFormsInputStringBase {
    /** Nome do campo para binding de dados. Exemplo: name="descricao" */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /** Texto de ajuda ou dica para o usuário. Exemplo: hint="Digite sua mensagem" */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined;
    /** Valor do texto, aceita binding dinâmico. Exemplo: value="{{ui.form.descricao}}" */
    @propertyDataSource({ type: String }) value: string | undefined;
    /** Texto do rótulo do campo. Exemplo: label="Descrição" */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    /** Define se o campo é obrigatório. Exemplo: required */
    @propertyDataSource({ type: Boolean }) required: boolean = false;
    /** Define se o campo está desabilitado. Exemplo: disabled */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /** Número máximo de caracteres permitidos. Exemplo: maxlength="200" */
    @propertyDataSource({ type: Number }) maxlength: number | undefined;
    /** Número mínimo de caracteres permitidos. Exemplo: minlength="10" */
    @propertyDataSource({ type: Number }) minlength: number | undefined;
    /** Texto de placeholder exibido quando vazio. Exemplo: placeholder="Digite aqui" */
    @propertyCompositeDataSource({ type: String }) placeholder: string | undefined;
    /** Expressão regular para validação do texto. Exemplo: pattern="[A-Za-z ]+" */
    @propertyDataSource({ type: String }) pattern: string | undefined;
    /** Mensagem exibida em caso de erro de validação. Exemplo: errormessage="Campo obrigatório" */
    @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
    /** Define se o campo recebe foco automático. Exemplo: autofocus */
    @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
    /** Configura capitalização automática do texto. Exemplo: autocapitalize="sentences" */
    @propertyDataSource({ type: String }) autocapitalize: IAutoCapitalize = 'off';
    /** Ativa correção automática do texto. Exemplo: autocorrect="on" */
    @propertyDataSource({ type: String }) autocorrect: IAutocorrect | undefined;
    /** Sugestões de preenchimento automático. Exemplo: autocomplete="on" */
    @propertyDataSource({ type: String }) autocomplete: string | undefined;
    /** Mensagem de validação customizada. Exemplo: validationmessage="Mensagem inválida" */
    @propertyDataSource({ type: String }) validationmessage: string | undefined;
    /** Tempo em ms para debouncing da entrada. Exemplo: debounce="300" */
    @propertyDataSource({ type: String }) debounce: string | undefined;
    /** Define se o campo é somente leitura. Exemplo: readonly */
    @propertyDataSource({ type: Boolean }) readonly: boolean = false;
    /** Número de linhas visíveis no textarea. Exemplo: rows="4" */
    @propertyDataSource({ type: Number }) rows: number = 3;
    /** Altura mínima do textarea em pixels ou CSS. Exemplo: minHeight="80px" */
    @propertyDataSource({ type: String }) minHeight: string = '64px';
    /** Permite redimensionamento vertical do textarea. Exemplo: resizable */
    @propertyDataSource({ type: Boolean }) resizable: boolean = true;
    /** Contagem dinâmica de linhas digitadas. */
    @propertyDataSource({ type: Number }) lineCount: number = 0;
    private myMessage: MessageType = messages['en'];
    private error: string = '';
    
    private handleInput(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        const val = target.value;
        this.value = val;
        this.lineCount = val.split(/\r?\n/).length;
        if (this.maxlength !== undefined && val.length > this.maxlength) {
            this.error = this.errormessage || '';
        } else {
            this.error = '';
        }
        this.requestUpdate();
    }
    render() {
        const minHeightStyle = this.minHeight ? `min-height:${this.minHeight};` : '';
        const resizeStyle = this.resizable ? 'resize:vertical;' : 'resize:none;';
        return html`
<div class="widget-input-string-multiline">
${this.label ? html`<label class="form-control-label">${this.label}</label>` : ''} 
<textarea
class="input_control"
name=${ifDefined(this.name)}
.rows=${this.rows}
?disabled=${this.disabled.toString() === 'true'}
?readonly=${this.readonly.toString() === 'true'}
?required=${this.required.toString() === 'true'}
maxlength=${ifDefined(this.maxlength)}
minlength=${ifDefined(this.minlength)}
placeholder=${ifDefined(this.placeholder)}
pattern=${ifDefined(this.pattern)}
autofocus=${this.autofocus}
autocapitalize=${ifDefined(this.autocapitalize)}
autocorrect=${ifDefined(this.autocorrect)}
autocomplete=${ifDefined(this.autocomplete)}
style="${minHeightStyle}${resizeStyle}"
.value=${this.value}
@input=${this.handleInput.bind(this)}
></textarea>
${this.hint ? html`<div class="form_hint">${this.hint}</div>` : ''}
<div class="form_line_count">${this.lineCount} ${this.myMessage.lines}</div>
${this.error ? html`<div class="form_error_message">${this.error}</div>` : ''}
</div>
`;
    }
}
