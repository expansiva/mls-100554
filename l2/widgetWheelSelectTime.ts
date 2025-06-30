/// <mls shortName="widgetWheelSelectTime" project="100554" enhancement="_100554_enhancementLit" groupName="other">
import { html, repeat, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputSelectOneBase } from './_100554_icaFormsInputSelectOneBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
labelHour: 'Hora',
labelMinute: 'Minuto',
labelPeriod: 'AM/PM',
}
const message_en = {
labelHour: 'Hour',
labelMinute: 'Minute',
labelPeriod: 'AM/PM',
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
'en': message_en,
'pt': message_pt
}
/// **collab_i18n_end**
/**
* Widget de seleção em roleta com três colunas configuráveis para hora, minuto e AM/PM.
* Baseado em ica-forms-input-select-one.
* Permite seleção instantânea ao deslizar/scrollar.
*/
@customElement('widget-wheel-select-time-100554')
export class WidgetWheelSelectTime extends IcaFormsInputSelectOneBase {
private myMessage: MessageType = messages['en'];
/**
* Valor selecionado atualmente, atualizado instantaneamente ao deslizar ou scrollar.
* @example selectedvalue="{{ui.form.horario}}"
*/
@propertyDataSource({ type: String }) selectedvalue: string | undefined;
/**
* Array configurável contendo as opções para cada coluna (hora, minuto, AM/PM).
* @example options="[['01','02'],['00','15','30','45'],['AM','PM']]"
*/
@propertyDataSource({ type: Array }) options: string[][] = [[], [], []];
/**
* Configuração das três colunas para seleção: hora, minuto e AM/PM.
* @example columns="['hour','minute','period']"
*/
@propertyDataSource({ type: Array }) columns: string[] = ['hour', 'minute', 'period'];
/**
* Indica se o widget está desabilitado.
* @example disabled="true"
*/
@propertyDataSource({ type: Boolean }) disabled: boolean = false;
/**
* Indica se o widget está somente leitura.
* @example readonly="true"
*/
@propertyDataSource({ type: Boolean }) readonly: boolean = false;
/**
* Texto do rótulo exibido para o widget.
* @example label="Selecione o horário"
*/
@propertyCompositeDataSource({ type: String }) label: string = '';
/**
* Texto de dica para o usuário.
* @example hint="Escolha um horário disponível"
*/
@propertyCompositeDataSource({ type: String }) hint: string = '';
/**
* Mensagem de erro exibida quando a validação falha.
* @example errormessage="Horário inválido"
*/
@propertyCompositeDataSource({ type: String }) errormessage: string = '';
/**
* Atributo aria-label para acessibilidade.
* @example ariaLabel="Selecionar horário"
*/
@propertyDataSource({ type: String }) ariaLabel: string = '';
// Implementação da propriedade abstrata 'required' da base
@propertyDataSource({ type: Boolean }) required: boolean = false;
private get __options(): string[][] {
return Array.isArray(this.options) && this.options.length === 3 ? this.options : [[], [], []];
}
private get __columns(): string[] {
return Array.isArray(this.columns) && this.columns.length === 3 ? this.columns : ['hour', 'minute', 'period'];
}
private get __selectedIndexes(): number[] {
if (!this.selectedvalue) return [0, 0, 0];
const [h, m, p] = this.selectedvalue.split(':');
const hourIdx = this.__options[0].indexOf(h ?? '');
const minIdx = this.__options[1].indexOf(m ?? '');
const perIdx = this.__options[2].indexOf(p ?? '');
return [hourIdx >= 0 ? hourIdx : 0, minIdx >= 0 ? minIdx : 0, perIdx >= 0 ? perIdx : 0];
}
private onWheel(colIdx: number, e: WheelEvent) {
if (this.disabled || this.readonly) return;
e.preventDefault();
const opts = this.__options[colIdx];
if (!opts.length) return;
const idxs = this.__selectedIndexes;
let idx = idxs[colIdx];
if (e.deltaY > 0) idx = Math.min(opts.length - 1, idx + 1);
else if (e.deltaY < 0) idx = Math.max(0, idx - 1);
idxs[colIdx] = idx;
this.updateSelectedValue(idxs);
}
private onKeyDown(colIdx: number, e: KeyboardEvent) {
if (this.disabled || this.readonly) return;
const opts = this.__options[colIdx];
if (!opts.length) return;
const idxs = this.__selectedIndexes;
let idx = idxs[colIdx];
if (e.key === 'ArrowUp') { idx = Math.max(0, idx - 1); e.preventDefault(); }
if (e.key === 'ArrowDown') { idx = Math.min(opts.length - 1, idx + 1); e.preventDefault(); }
idxs[colIdx] = idx;
this.updateSelectedValue(idxs);
}
private onTouchStartY: number | null = null;
private onTouchMove(colIdx: number, e: TouchEvent) {
if (this.disabled || this.readonly) return;
const opts = this.__options[colIdx];
if (!opts.length) return;
const idxs = this.__selectedIndexes;
let idx = idxs[colIdx];
const touch = e.touches[0];
if (this.onTouchStartY === null) {
this.onTouchStartY = touch.clientY;
return;
}
const delta = touch.clientY - this.onTouchStartY;
if (Math.abs(delta) > 30) {
if (delta > 0) idx = Math.max(0, idx - 1);
else idx = Math.min(opts.length - 1, idx + 1);
idxs[colIdx] = idx;
this.updateSelectedValue(idxs);
this.onTouchStartY = touch.clientY;
}
}
private onTouchEnd() {
this.onTouchStartY = null;
}
private updateSelectedValue(idxs: number[]) {
const h = this.__options[0][idxs[0]] ?? '';
const m = this.__options[1][idxs[1]] ?? '';
const p = this.__options[2][idxs[2]] ?? '';
this.selectedvalue = `${h}:${m}:${p}`;
this.requestUpdate();
}
render() {
const idxs = this.__selectedIndexes;
return html`
<div class="wheel-select-root" aria-label="${this.ariaLabel}" ?aria-disabled="${this.disabled}" ?aria-readonly="${this.readonly}">
${this.label ? html`<label class="wheel-label">${this.label}</label>` : ''}
<div class="wheel-select-columns">
${repeat(
this.__columns,
((col: string, i: number) => col) as () => string,
// Add scrollable class if more than 4 items in the column
((col: string, colIdx: number) => html`
<div class="wheel-column${this.__options[colIdx].length > 4 ? ' scrollable' : ''}" tabindex="0"
@wheel="${(e: WheelEvent) => this.onWheel(colIdx, e)}"
@keydown="${(e: KeyboardEvent) => this.onKeyDown(colIdx, e)}"
@touchstart="${(e: TouchEvent) => { this.onTouchStartY = e.touches[0].clientY; }}"
@touchmove="${(e: TouchEvent) => this.onTouchMove(colIdx, e)}"
@touchend="${() => this.onTouchEnd()}"
role="listbox"
aria-label="${col === 'hour' ? this.myMessage.labelHour : col === 'minute' ? this.myMessage.labelMinute : this.myMessage.labelPeriod}"
>
<ul class="wheel-list">
${repeat(
this.__options[colIdx],
((opt: string) => opt) as () => string,
((opt: string, optIdx: number) => html`
<li class="wheel-item${idxs[colIdx] === optIdx ? ' selected' : ''}" role="option" aria-selected="${idxs[colIdx] === optIdx}">
${opt}
</li>
`) as () => TemplateResult<1>
)}
</ul>
</div>
`) as () => TemplateResult<1>
)}
</div>
${this.hint ? html`<div class="wheel-hint">${this.hint}</div>` : ''}
${this.errormessage ? html`<div class="wheel-error">${this.errormessage}</div>` : ''}
</div>
`;
}
}
