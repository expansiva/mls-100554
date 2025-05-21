/// <mls shortName="widgetDefaultTextRich" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaApresentationTextRichBase } from './_100554_icaApresentationTextRichBase';
import { propertyCompositeDataSource, propertyDataSource } from './_100554_collabDecorators';
import type { IConfig } from './_100554_icaApresentationTextRichBase';
/// **collab_i18n_start**
const message_pt = {
label: 'Texto',
hint: 'Digite ou edite o texto com formatação rica.',
edit: 'Editar',
save: 'Salvar',
cancel: 'Cancelar',
errormsg: 'Conteúdo inválido.'
}
const message_en = {
label: 'Text',
hint: 'Type or edit the rich formatted text.',
edit: 'Edit',
save: 'Save',
cancel: 'Cancel',
errormsg: 'Invalid content.'
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
'en': message_en,
'pt': message_pt
}
/// **collab_i18n_end**

/**
 * Bloco de texto com formatação rica, editável ou somente visualizável.
 * Suporta negrito, itálico, listas, links e outras formatações básicas.
 * @example
 * <widget-default-text-rich-100554 content="<b>Olá</b>" config="{\"editable\":true}"></widget-default-text-rich-100554>
 */
@customElement('widget-default-text-rich-100554')
export class WidgetDefaultTextRich extends IcaApresentationTextRichBase {
/**
 * Conteúdo do texto com formatação rica (HTML ou similar).
 * @example
 * content = '<b>Olá</b>'
 */
@propertyCompositeDataSource({ type: String })
content: string | undefined;

/**
 * Configuração do componente, incluindo se é editável.
 * @example
 * config = '{"editable":true}'
 */
@propertyDataSource({ type: String })
config: string | undefined;

/**
 * Rótulo opcional para o bloco de texto.
 * @example
 * label = 'Descrição'
 */
@propertyCompositeDataSource({ type: String })
label: string | undefined;

/**
 * Dica ou ajuda para o usuário sobre o conteúdo ou edição do texto.
 * @example
 * hint = 'Use negrito para destacar.'
 */
@propertyCompositeDataSource({ type: String })
hint: string | undefined;

/**
 * Mensagem de erro para validação do conteúdo, se aplicável.
 * @example
 * errormessage = 'Campo obrigatório.'
 */
@propertyCompositeDataSource({ type: String })
errormessage: string | undefined;

/**
 * Indica se o conteúdo está somente para leitura, alternativa ao editable.
 * @example
 * readonly = true
 */
@propertyDataSource({ type: Boolean })
readonly: boolean = false;

/**
 * Define se o campo deve receber foco automaticamente ao carregar.
 * @example
 * autofocus = true
 */
@propertyDataSource({ type: Boolean })
autofocus: boolean = false;

private _editing: boolean = false;
private _draft: string = '';
private _lang: string = 'pt';
private get _msg(): MessageType {
return messages[this._lang] || messages['en'];
}
private get _isEditable(): boolean {
let editable = false;
if (this.config) {
try {
const cfg: IConfig = JSON.parse(this.config);
editable = !!cfg.editable;
} catch { editable = false; }
}
if (this.readonly) return false;
return editable;
}
private _onEdit() {
this._editing = true;
this._draft = this.content || '';
this.requestUpdate();
}
private _onCancel() {
this._editing = false;
this._draft = '';
this.requestUpdate();
}
private _onSave() {
this.content = this._draft;
this._editing = false;
this.requestUpdate();
}
private _onInput(e: InputEvent) {
const target = e.target as HTMLDivElement;
this._draft = target.innerHTML;
}
render() {
return html`
<div part="container">
${this.label ? html`<label part="label">${this.label}</label>` : nothing}
${this.hint ? html`<div part="hint">${this.hint}</div>` : nothing}
${this._editing ? html`
<div part="editor-wrapper">
<div
part="editor"
contenteditable="true"
.role="textbox"
.aria-multiline="true"
.aria-label=${this.label || this._msg.label}
@input=${this._onInput.bind(this)}
.autofocus=${this.autofocus}
>${this._draft}</div>
<div part="editor-actions">
<button part="save-btn" type="button" @click=${this._onSave.bind(this)}>${this._msg.save}</button>
<button part="cancel-btn" type="button" @click=${this._onCancel.bind(this)}>${this._msg.cancel}</button>
</div>
</div>
` : html`
<div part="content" aria-label=${this.label || this._msg.label} tabindex="0">
${this.content ? html`<div .innerHTML=${this.content}></div>` : html`<span part="placeholder">-</span>`}
</div>
${this._isEditable ? html`<button part="edit-btn" type="button" @click=${this._onEdit.bind(this)}>${this._msg.edit}</button>` : nothing}
`}
${this.errormessage ? html`<div part="error">${this.errormessage}</div>` : nothing}
</div>
`;
}
}
