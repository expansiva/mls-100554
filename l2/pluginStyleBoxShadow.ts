/// <mls shortName="pluginStyleBoxShadow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import './_100554_collabDsInputSelectColor';
import './_100554_collabDsInputRange';
import { IcaLitElement, propertyDataSource } from './_100554_icaLitElement';
import { getMessageKey } from './_100554_collabLitElement';
import './_100554_collabDsInputSelectColor';
import './_100554_collabDsInputRange';
import { ICSSState } from './_100554_lessCSS';
import { globalState } from './_100554_icaState';
import { convertColorToHex } from './_100554_libCommom';


/// **collab_i18n_start**
const message_pt = {
    advanced: 'Avançado',
    offSetX: 'X Offset',
    offSetY: 'Y Offset',
    blur: 'Blur ',
    spread: 'Spread',
    color: 'Cor',
    description: 'Um plugin versátil para manter e aplicar propriedades de transformação CSS. Gerencie facilmente transformações de escala, rotação, inclinação e tradução para criar elementos de UI dinâmicos e interativos com precisão'
}

const message_en = {
    advanced: 'Advanced',
    offSetX: 'X Offset',
    offSetY: 'Y Offset',
    blur: 'Blur ',
    spread: 'Spread',
    color: 'Color',
    description: 'A versatile plugin for maintaining and applying CSS transform properties. Easily manage scale, rotate, skew, and translate transformations to create dynamic and interactive UI elements with precision.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const tags = ['box-shadow'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style-box-shadow-100554')
export class PluginStyleBoxShadow extends IcaLitElement {

    @property() showFull: string = 'true';
    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';

    @property() boxShadow: string | undefined;
    @property() color: string | undefined;
    @property() spread: string | undefined;
    @property() boxBlur: string | undefined;
    @property() offsetY: string | undefined;
    @property() offsetX: string | undefined;
    @property() shadowMode: 'inset' | 'outset' = 'outset';

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private msg: MessageType = messages['en'];

    handleIcaStateChange(_key: string, _value: ICSSState) {
        if (_key !== `less.${this.position}` || !_value || !_value.key) return;
        if (_value.emitter === 'helper') return;
        if (!tags.includes(_value.key)) return;
        this._onIcaStateChange();
    }

    private _onIcaStateChange() {
        if (!this.state || !this.state.lessCSS) return;
        const rule = this.findCSSRuleInIframe(this.state.lessCSS.selector);
        if (!rule) return;
        this.setValues(rule);
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

    private setValues2() {

        let value = this.boxShadow || '';
        if (!value) return;

        let vColor = '';
        if (value.indexOf('rgb') >= 0) {
            vColor = value.substring(value.indexOf('rgb'), value.indexOf(')') + 1);
            value = value.replace(vColor, '').trim();
        } else if (value.indexOf('#') >= 0) {
            vColor = value.substring(value.indexOf('#'), value.indexOf(' ') + 1).trim();
            value = value.replace(vColor, '').trim();
        } else if (/[a-z]/.test(value.substring(0, 1))) {
            vColor = value.substring(value.indexOf(value.substring(0, 2)), value.indexOf(' ') + 1).trim();
            value = value.replace(vColor, '').trim();
        }

        const arrayValues = value.split(' ');
        this.offsetX = arrayValues.length > 0 ? arrayValues[0] : '';
        this.offsetY = arrayValues.length > 1 ? arrayValues[1] : '';
        this.boxBlur = arrayValues.length > 2 ? arrayValues[2] : '';
        this.spread = arrayValues.length > 3 ? arrayValues[3] : '';
        this.color = vColor;
        if (value.indexOf('inset') >= 0) this.shadowMode = 'inset';

    }

    private setValues(rule: CSSStyleRule) {

        if (rule.style) {
            for (let i = 0; i < rule.style.length; i++) {
                const propertyName = rule.style[i];
                if (propertyName === 'box-shadow') {
                    const propertyValue = rule.style.getPropertyValue(propertyName);
                    const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(propertyName);
                    if (!convertedProp) return;
                    (this as any)[convertedProp] = propertyValue;
                }
            }
        }

        this.setValues2();


    }

    private mountValue(): void {
        let value = '';
        value += this.offsetX ? this.offsetX : '0px';
        value += this.offsetY ? ' ' + this.offsetY : ' 0px';
        value += this.boxBlur ? ' ' + this.boxBlur : ' 0px';
        value += this.spread ? ' ' + this.spread : ' 0px';
        value += this.color ? ' ' + this.color : '';
        value += this.shadowMode ? this.shadowMode === 'outset' ? '' : ' ' + this.shadowMode : '';
        if (!this.offsetX || !this.offsetY) value = '';
        this.boxShadow = value;
        this.setState();
    }

    private setState() {
        globalState._ica.less[this.position].emitter = 'helper';
        const styles: CSSStyleDeclaration = globalState._ica.less[this.position].lessCSS.styles;
        styles.boxShadow = this.boxShadow || '';
    }

    private timeonChangeProp = -1;

    private handleChange(e: KeyboardEvent) {
        clearTimeout(this.timeonChangeProp);
        const el = e.detail ? (e.detail as any).target : e.target as HTMLInputElement;
        const prop = el.getAttribute('prop');
        if (!prop) return;
        this.timeonChangeProp = setTimeout(() => {
            (this as any)[prop] = el.value;
            this.mountValue();
        }, 100);
    }


    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            ${this.showFull === 'true' ?
                html`
                    ${this.renderGallery()}
                    ${this.renderBoxShadow()}

                ` :
                html`
                    ${this.renderGallery()}
                `
            }
        `;

    }

    renderBoxShadow() {
        return html`
            <div class="group">
                <div class="group-edit">
                    <input type="radio" prop="shadowMode" ?checked=${this.shadowMode === 'outset'} id="outset" name="rgHcTypeBoxShadow" value="outset" @change=${this.handleChange}>
                    <label for="outset" >outset</label>
                    <input type="radio" prop="shadowMode" ?checked=${this.shadowMode === 'inset'} id="inset" name="rgHcTypeBoxShadow" value="inset" @change=${this.handleChange}>
                    <label for="inset" >inset</label>
                </div>
                <span>${this.msg.offSetX}</span>
                <div class="group-edit">
                    <collab-ds-input-range-100554
                    @onchange=${this.handleChange} 
                    prop="offsetX"
                    value=${this.offsetX} 
                    .arraySelect=${this.tpMeasures}  
                    ></collab-ds-input-range-100554>
                </div>
                <span>${this.msg.offSetY}</span>
                <div class="group-edit">
                    <collab-ds-input-range-100554
                    @onchange=${this.handleChange} 
                    prop="offsetY"
                    value=${this.offsetY} 
                    .arraySelect=${this.tpMeasures}  
                    ></collab-ds-input-range-100554>
                </div>
                <span>${this.msg.blur}</span>
                <div class="group-edit">
                    <collab-ds-input-range-100554
                    @onchange=${this.handleChange} 
                    prop="boxBlur"
                    value=${this.boxBlur} 
                    .arraySelect=${this.tpMeasures}  
                    ></collab-ds-input-range-100554>
                </div>
                <span>${this.msg.spread}</span>
                <div class="group-edit">
                    <collab-ds-input-range-100554
                    @onchange=${this.handleChange} 
                    prop="spread"
                    value=${this.spread} 
                    .arraySelect=${this.tpMeasures}  
                    ></collab-ds-input-range-100554>
                </div>
                <span>${this.msg.color}</span>
                <div class="group-edit">
                    <collab-ds-input-select-color-100554 
                        prop="color" 
                        useInput="false"
                        useSelect="false" 
                        _valueColor=${convertColorToHex(this.color || '')}
                        @onchange=${this.handleChange}
                    ></collab-ds-input-select-color-100554>
                </div>
            </div>
        `;
    }

    renderGallery() {
        return html`
            <div class="gallery">
                ${repeat(this.gallery, ((key: any) => key) as any,
            ((galleryItem: IGallery, index: number) => {
                return html`<div class="gallery-item" style="${galleryItem.style}" @click=${() => { this.onGalleryClick(galleryItem) }}></div>`;
            }) as any
        )}
            </div>
        
        `
    }

    private async onGalleryClick(item: IGallery) {
        this.boxShadow = item.state.boxShadow;
        this.setValues2();
        await this.updateComplete;
        this.setState();
    }

    private gallery: IGallery[] = [
        {
            state: { boxShadow: '0 10px 10px -5px;' },
            style: 'box-shadow: 0 10px 10px -5px;'
        },
        {
            state: { boxShadow: '0 0 10px 5px' },
            style: 'box-shadow: 0 0 10px 5px;'
        },
        {
            state: { boxShadow: '5px 5px 20px' },
            style: 'box-shadow: 5px 5px 20px;'
        },
        {
            state: { boxShadow: '5px -5px' },
            style: 'box-shadow: 5px -5px;'
        },
        {
            state: { boxShadow: '5px 5px' },
            style: 'box-shadow: 5px 5px;'
        },
        {
            state: { boxShadow: '-5px -5px 10px' },
            style: 'box-shadow: -5px -5px 10px;'
        },
        {
            state: { boxShadow: '5px 5px 10px' },
            style: 'box-shadow: 5px 5px 10px;'
        },
        {
            state: { boxShadow: 'inset 0 0 10px' },
            style: 'box-shadow: inset 0 0 10px;'
        },
        {
            state: { boxShadow: '0 0 10px' },
            style: 'box-shadow: 0 0 10px;'
        },
    ];

}

interface IGallery {
    style: string,
    state: {
        boxShadow: string,
    }
}