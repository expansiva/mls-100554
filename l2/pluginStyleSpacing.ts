/// <mls shortName="pluginStyleSpacing" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { IcaLitElement, propertyDataSource } from './_100554_icaLitElement';
import { getMessageKey } from './_100554_collabLitElement';
import './_100554_collabDsInputSelectColor';
import './_100554_collabDsInputRange';
import { ICSSState } from './_100554_lessCSS';
import { globalState } from './_100554_icaState';
import {
    collab_lock,
    collab_lock_open,
    collab_margin_bottom,
    collab_margin_top,
    collab_margin_left,
    collab_margin_right,
    collab_padding_bottom,
    collab_padding_top,
    collab_padding_left,
    collab_padding_right,


} from './_100554_collabIcons'

/// **collab_i18n_start**
const message_pt = {
    all: 'Group',
    margin: 'Margin',
    padding: 'Padding',
    top: 'Superior',
    left: 'Esquerda',
    bottom: 'Inferior',
    right: 'Direita',
    description: 'Este plugin permite ajustar margens e preenchimentos (margin e padding) de maneira simples e intuitiva. Ideal para desenvolvedores que buscam precisão no espaçamento dos elementos, ele facilita a definição de distâncias internas e externas para garantir um layout consistente e bem estruturado.'

}

const message_en = {
    all: 'Group',
    margin: 'Margin',
    padding: 'Padding',
    top: 'Top',
    left: 'Left',
    bottom: 'Bottom',
    right: 'Right',
    description: 'This plugin enables easy and intuitive adjustments of margins and paddings. Ideal for developers seeking precise element spacing, it streamlines the setup of inner and outer distances to ensure a consistent and well-structured layout.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['margin*', 'padding*'];
export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}


@customElement('plugin-style-spacing-100554')
export class PluginStyleSpacing extends IcaLitElement {

    private msg: MessageType = messages['en'];

    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';

    @property() showFull: string = 'true';
    @property() marginLocked: boolean = false;
    @property() paddingLocked: boolean = false;

    @property() marginLeft: string | undefined;
    @property() marginRight: string | undefined;
    @property() marginTop: string | undefined;
    @property() marginBottom: string | undefined;
    @property() paddingLeft: string | undefined;
    @property() paddingRight: string | undefined;
    @property() paddingTop: string | undefined;
    @property() paddingBottom: string | undefined;


    @query('#helper-border-radius-lock') inputLockP: HTMLInputElement | undefined;
    @query('#helper-border-lock') inputLockM: HTMLInputElement | undefined;
    @queryAll('collab-ds-input-range-100554[group="margin"]') marginInputs: HTMLInputElement[] | undefined;
    @queryAll('collab-ds-input-range-100554[group="padding"]') paddingInputs: HTMLInputElement[] | undefined;

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    handleIcaStateChange(_key: string, _value: ICSSState) {
        if (_key !== `less.${this.position}` || !_value) return;
        if (_value.emitter === 'helper') return;
        this._onIcaStateChange();
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`

        ${this.showFull === 'true' ?
                html`
                ${this.renderGallery()}
                ${this.renderMargin()}
                ${this.renderPadding()}
            ` :
                html`
                ${this.renderGallery()}
            `
            }
        `;
    }

    renderMargin() {
        return html`
            <h5 class="helper-group-title" >${this.msg.margin}</h5>
            <div class="helper-group-lock">
                <input id="helper-border-lock" type="checkbox" @change=${this.handleChangeLockMargin}>
                <label for="helper-border-lock"> ${this.msg.all}</label>
                <i>${this.marginLocked ? collab_lock : collab_lock_open}</i>
            </div>

            <div class="group">

                <div class="group-edit">
                    <i data-tooltip="${this.msg.top}">${collab_margin_top}</i>
                    <collab-ds-input-range-100554
                        prop="margin-top"
                        value=${this.marginTop}
                        .arraySelect=${this.tpMeasures} 
                        group="margin"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeMargin(e)}"
                    ></collab-ds-input-range-100554>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.left}" >${collab_margin_left}</i>
                    <collab-ds-input-range-100554
                        prop="margin-left"
                        value="${this.marginLeft}"
                        .arraySelect=${this.tpMeasures} 
                        group="margin" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeMargin(e)}"
                    ></collab-ds-input-range-100554>   
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.bottom}">${collab_margin_bottom}</i>
                    <collab-ds-input-range-100554
                        prop="margin-bottom"
                        value=${this.marginBottom}
                        .arraySelect=${this.tpMeasures} 
                        group="margin" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeMargin(e)}"
                    ></collab-ds-input-range-100554>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.right}">${collab_margin_right}</i>
                    <collab-ds-input-range-100554
                        prop="margin-right"
                        value=${this.marginRight}
                        .arraySelect=${this.tpMeasures} 
                        group="margin" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeMargin(e)}"
                    ></collab-ds-input-range-100554>

                </div>
            </div>

        `
    }

    renderPadding() {
        return html`
            <h5 class="helper-group-title" >${this.msg.padding}</h5>
                <div class="helper-group-lock">
                <input id="helper-border-radius-lock" type="checkbox" @change=${this.handleChangeLockPadding}>
                <label for="helper-border-radius-lock"> ${this.msg.all}</label>
                <i>${this.paddingLocked ? collab_lock : collab_lock_open}</i>
            </div>

            <div class="group">

                <div class="group-edit">
                    <i data-tooltip="${this.msg.top}">${collab_padding_top}</i>
                    <collab-ds-input-range-100554
                        prop="padding-top"
                        value=${this.paddingTop}
                        .arraySelect=${this.tpMeasures}  
                        group="padding"
                        @onchange="${(e: KeyboardEvent) => this.handleChangePadding(e)}"
                    ></collab-ds-input-range-100554>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.left}">${collab_padding_left}</i>
                    <collab-ds-input-range-100554
                        prop="padding-left"
                        value=${this.paddingLeft}
                        .arraySelect=${this.tpMeasures} 
                        group="padding"
                        @onchange="${(e: KeyboardEvent) => this.handleChangePadding(e)}"
                    ></collab-ds-input-range-100554>    

                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.bottom}">${collab_padding_bottom}</i>
                    <collab-ds-input-range-100554
                        prop="padding-bottom"
                        value=${this.paddingBottom}
                        .arraySelect=${this.tpMeasures} 
                        group="padding"
                        @onchange="${(e: KeyboardEvent) => this.handleChangePadding(e)}"
                    ></collab-ds-input-range-100554> 

                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.right}">${collab_padding_right}</i>
                    <collab-ds-input-range-100554
                        prop="padding-right"
                        value=${this.paddingRight}
                        .arraySelect=${this.tpMeasures} 
                        group="padding"
                        @onchange="${(e: KeyboardEvent) => this.handleChangePadding(e)}"
                    ></collab-ds-input-range-100554> 
                </div>
            </div>

        `
    }

    renderGallery() {
        return html`
            <div class="gallery">
                ${repeat(this.gallery, ((key: string) => key) as any,
            ((galleryItem: IGallery, index: number) => {
                return html`
                <div class="box" @click=${() => { this.onGalleryClick(galleryItem) }}>
                    <div style="${galleryItem.style}"></div>
                </div>`;
            }) as any
        )}
            </div>
        
        `
    }

    private _onIcaStateChange() {
        if (!this.state || !this.state.lessCSS) return;
        const rule = this.findCSSRuleInIframe(this.state.lessCSS.selector);
        if (!rule) return;
        this.setValues(rule);
    }

    private timeonChangeMargin = -1;

    private handleChangeMargin(e: KeyboardEvent) {

        clearTimeout(this.timeonChangeMargin);
        const el = (e.detail as any).target as HTMLInputElement;
        const prop = el.getAttribute('prop');
        if (!prop) return;
        const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(prop);
        this.timeonChangeMargin = setTimeout(() => {
            if (!this.marginLocked) {
                if (!convertedProp) return;
                (this as any)[convertedProp] = el.value;
                this.setState();
                return;
            }
            this.marginInputs?.forEach((inp) => {
                if (inp === el) return;
                inp.value = el.value;
            });
            this.marginBottom = this.marginLeft = this.marginRight = this.marginTop = el.value;
            this.setState();

        }, 100);
    }

    private timeonChangePadding = -1;
    private handleChangePadding(e: KeyboardEvent) {

        clearTimeout(this.timeonChangePadding);
        const el = (e.detail as any).target as HTMLInputElement;
        const prop = el.getAttribute('prop');
        if (!prop) return;
        const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(prop);
        this.timeonChangePadding = setTimeout(() => {
            if (!this.paddingLocked) {
                if (!convertedProp) return;
                (this as any)[convertedProp] = el.value;
                this.setState();
                return;
            }
            this.paddingInputs?.forEach((inp) => {
                if (inp === el) return;
                inp.value = el.value;
            });
            this.paddingBottom = this.paddingLeft = this.paddingRight = this.paddingTop = el.value;
            this.setState();

        }, 100);
    }

    private handleChangeLockPadding() {
        if (!this.inputLockP) return;
        this.paddingLocked = this.inputLockP.checked;
    }

    private handleChangeLockMargin() {
        if (!this.inputLockM) return;
        this.marginLocked = this.inputLockM.checked;
    }

    private setState() {

        const allMargin = [this.marginTop, this.marginLeft, this.marginBottom, this.marginRight];
        const areMarginsAllEqual = allMargin.every(value => value === allMargin[0]);
        const areMarginPairsEqual = (this.marginTop === this.marginBottom) && (this.marginLeft === this.marginRight);
        const allPadding = [this.paddingTop, this.paddingLeft, this.paddingBottom, this.paddingRight];
        const arePaddingsAllEqual = allPadding.every(value => value === allPadding[0]);
        const arePaddingPairsEqual = (this.paddingTop === this.paddingBottom) && (this.paddingLeft === this.paddingRight);

        let marginValue: any;
        let paddingValue: any;

        if (areMarginsAllEqual) marginValue = this.marginTop;
        else if (areMarginPairsEqual) marginValue = `${this.marginTop} ${this.marginRight}`;
        else {
            marginValue = {
                marginTop: this.marginTop,
                marginRight: this.marginRight,
                marginBottom: this.marginBottom,
                marginLeft: this.marginLeft,
            };
        }

        if (arePaddingsAllEqual) paddingValue = this.paddingTop;
        else if (arePaddingPairsEqual) paddingValue = `${this.paddingTop} ${this.paddingRight}`;
        else {
            paddingValue = {
                paddingTop: this.paddingTop,
                paddingRight: this.paddingRight,
                paddingBottom: this.paddingBottom,
                paddingLeft: this.paddingLeft,
            };
        }

        this.updateMargins(marginValue);
        this.updatePadding(paddingValue);

    }

    updateMargins(margin: string | { [key: string]: string }) {

        globalState._ica.less[this.position].emitter = 'helper';

        const styles = globalState._ica.less[this.position].lessCSS.styles;
        if (typeof margin === 'string') {
            styles.marginTop = styles.marginRight = styles.marginBottom = styles.marginLeft = '';
            styles.margin = margin;
        } else {
            styles.margin = '';
            styles.marginTop = margin.marginTop || '';
            styles.marginRight = margin.marginRight || '';
            styles.marginBottom = margin.marginBottom || '';
            styles.marginLeft = margin.marginLeft || '';
        }

    }

    updatePadding(padding: string | { [key: string]: string }) {

        globalState._ica.less[this.position].emitter = 'helper';

        const styles = globalState._ica.less[this.position].lessCSS.styles;
        if (typeof padding === 'string') {
            styles.paddingTop = styles.paddingRight = styles.paddingBottom = styles.paddingLeft = '';
            styles.padding = padding;
        } else {
            styles.padding = '';
            styles.paddingTop = padding.paddingTop || '';
            styles.paddingRight = padding.paddingRight || '';
            styles.paddingBottom = padding.paddingBottom || '';
            styles.paddingLeft = padding.paddingLeft || '';
        }

    }


    private setValues(rule: CSSStyleRule): void {

        if (rule.style) {
            for (let i = 0; i < rule.style.length; i++) {
                const propertyName = rule.style[i];
                if (propertyName.startsWith('margin-') || propertyName.startsWith('padding-')) {
                    const propertyValue = rule.style.getPropertyValue(propertyName);
                    const el = this.querySelector(`collab-ds-input-range-100554[prop="${propertyName}"]`) as HTMLInputElement;
                    const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(propertyName);
                    if (!convertedProp) return;
                    (this as any)[convertedProp] = propertyValue;
                    if (el) el.defaultValue = propertyValue;
                }
            }
        }

    }

    private findCSSRuleInIframe(ruleSelector: string): CSSStyleRule | null {

        const json = this.state?.lessCSS?.lessAST.ast[ruleSelector];
        if (!json) return null;

        const properties = Object.entries(json)
            .filter(([key]) => !key.startsWith('_'))
            .sort(([, a], [, b]) => (a as { line: number }).line - (b as { line: number }).line);

        let ruleText = properties.map(([key, item]) => `${key}: ${(item as { value: string }).value};`).join(' ');
        const selector = ruleSelector;
        const cssStyleSheet = new CSSStyleSheet();
        const ruleIndex = cssStyleSheet.insertRule(`${selector} { ${ruleText} }`, 0);
        const cssStyleRule = cssStyleSheet.cssRules[ruleIndex];
        return cssStyleRule as CSSStyleRule;

    }

    private onGalleryClick(item: IGallery) {
        this.marginBottom = item.state.marginBottom;
        this.marginTop = item.state.marginTop;
        this.marginLeft = item.state.marginLeft;
        this.marginRight = item.state.marginRight;
        this.setState();
    }

    private gallery: IGallery[] = [
        { style: 'margin: 10px', state: { marginBottom: '10px', marginTop: '10px', marginLeft: '10px', marginRight: '10px' } },
        { style: 'margin: 10px 0', state: { marginBottom: '10px', marginTop: '10px', marginLeft: '0', marginRight: '0' } },
        { style: 'margin: 0 10px', state: { marginBottom: '0', marginTop: '0', marginLeft: '10px', marginRight: '10px' } },
        { style: 'margin-left: 10px', state: { marginBottom: '', marginTop: '', marginLeft: '10px', marginRight: '' } },
        { style: 'margin-right: 10px', state: { marginBottom: '', marginTop: '', marginLeft: '', marginRight: '10px' } },
        { style: 'margin-top: 10px', state: { marginBottom: '', marginTop: '10px', marginLeft: '', marginRight: '' } },
        { style: 'margin-bottom: 10px', state: { marginBottom: '10px', marginTop: '', marginLeft: '', marginRight: '' } },

    ];



}

interface IGallery {
    style: string,
    state: {
        marginBottom: string,
        marginTop: string,
        marginLeft: string,
        marginRight: string,
    }
}