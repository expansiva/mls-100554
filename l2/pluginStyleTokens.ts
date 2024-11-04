/// <mls shortName="pluginStyleTokens" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { propertyDataSource } from './_100554_icaLitElement';
import { getDSInstance, DesignSystemIO } from './_100554_libDesignSystem';
import { IBlockLessLine } from './_100554_enhancementStyle';

/// **collab_i18n_start**
const message_pt = {

}

const message_en = {

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const tags = ['color:@*', 'background-color:@*', 'background:@*'];
export const description = 'A specialized plugin for managing color design tokens. Easily define, organize, and apply color palettes to ensure consistency across your designs, enhancing accessibility and visual appeal in your projects.';

@customElement('plugin-style-tokens-100554')
export class PluginCssTokens extends IcaLitElement {

    private msg: MessageType = messages['en'];

    @propertyDataSource() state: IStateStyle | undefined;

    @property() position: 'left' | 'right' = 'left';

    @property() level: number = 0;

    @property({ reflect: true }) prop: string = '';

    @property({ reflect: true }) value: string = '';

    @property() theme: string = 'Default';

    @property() tokens: Record<string, Record<string, Record<string, string>>> = {};

    private dsInstance: DesignSystemIO | undefined;

    private async initDsInstance() {
        const { project } = mls.actual[5];
        if (project === undefined) throw new Error('No project selected!');
        this.dsInstance = await getDSInstance(project, 0);
        if (!this.dsInstance) return;
        await this.dsInstance.init();
    }

    private async getTokensColor() {
        await this.initDsInstance();
        if (!this.dsInstance || !this.dsInstance.tokens) return '';
        if (!this.dsInstance) return '';
        const resumeTokensByTheme = this.dsInstance.tokens.list[this.theme];
        if (!resumeTokensByTheme) return undefined;
        const tokensColorKeys = Object.keys(resumeTokensByTheme.color);
        const filter = this.value.startsWith('@') ? this.value.substring(1, this.value.length) : this.value;
        const res = tokensColorKeys.filter((key) => !key.startsWith('_dark') && key.indexOf(filter) > -1).map((key2) => {
            return {
                key: key2,
                value: resumeTokensByTheme.color[key2]
            }
        })
        return this.groupColorsByState(res);
    }

    private groupColorsByState(items: { key: string, value: string }[]) {
        const grouped: Record<string, Record<string, Record<string, string>>> = {};

        items.forEach(item => {

            const match = item.key.match(/^(.*?)(-(hover|focus|disabled))?$/);
            const baseKey = match ? match[1].replace(/-(lighter|darker|dark|light)/, '') : item.key;
            const state = match && match[3] ? match[3] : 'default';

            const variation = item.key.includes('lighter')
                ? 'lighter'
                : item.key.includes('darker')
                    ? 'darker'
                    : item.key.includes('dark')
                        ? 'dark'
                        : item.key.includes('light')
                            ? 'light'
                            : 'default';

            if (!grouped[baseKey]) {
                grouped[baseKey] = {};
            }

            if (!grouped[baseKey][state]) {
                grouped[baseKey][state] = { dark: "", light: "", lighter: "", darker: "", default: "" };
            }

            grouped[baseKey][state][variation] = item.value;
        });

        return grouped;
    }

    handleColorClick(key: string, value: string) {
        console.info({ key, value });
    }

    setTooltip() {
        const doc: Document = this.ownerDocument || document;
        const tooltipEl = doc.querySelector('collab-tooltip') as any;
        this.querySelectorAll('.token-item').forEach((item) => {
            if (tooltipEl && tooltipEl.tooltip) tooltipEl.tooltip(item);
        })

    }

    async getTokens() {
        const tokens = await this.getTokensColor();
        if (tokens) this.tokens = tokens;
    }

    updated(changedProperties: any) {
        if (changedProperties.has('tokens')) {
            this.setTooltip();
        }
        if (changedProperties.has('value')) {
            this.getTokens();
        }
    }

    async firstUpdated(a: any) {
        super.firstUpdated(a)
        this.getTokens();
    }

    handleIcaStateChange(key: string, value: IStateStyle) {

        if (key !== 'style' || !value || value.position !== this.position) return;
        const { lineKey, lineValue } = value;
        this.prop = lineKey;
        this.value = lineValue;

    }

    render() {

        return html`
            <div>
                ${Object.keys(this.tokens).map((cat) => html`
                <div class="tokens-container">
                    ${cat}
                    <div class="tokens-content">
                    ${Object.keys(this.tokens[cat]).map((state) => html`
                        <div class="token">
                        ${Object.keys(this.tokens[cat][state]).map((variation) => {
            return this.tokens[cat][state][variation] ? html`
                            <div
                                @click=${() => { this.handleColorClick(`${cat}${variation !== 'default' ? '-' + variation : ''}${state !== 'default' ? '-' + state : ''}`, this.tokens[cat][state][variation]) }} 
                                class="token-item${this.value === '@' + (cat + (variation !== 'default' ? '-' + variation : '' + (state !== 'default' ? '-' + state : ''))) ? ' selected' : ''} "
                                data-tooltip="${cat}${variation !== 'default' ? '-' + variation : ''}${state !== 'default' ? '-' + state : ''}"
                                style="background-color: ${this.tokens[cat][state][variation]};border-color: ${this.tokens[cat][state][variation]}">
                            
                            </div>
                            ` : html``;
        })}
                        </div>
                    `)}
                    </div>
                </div>
                `)}
            </div>
            `;

    }


}

interface IStateStyle {
    lines: IBlockLessLine[]
    selector: string
    lineNumber: number
    lineKey: string
    lineValue: string,
    position: 'left' | 'right'
}