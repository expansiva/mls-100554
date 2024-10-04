/// <mls shortName="cssTokens" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { selectLevel, forceServiceInstance, openService } from './_100554_libCommom';

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

export const pluginData: mls.plugin.IPluginData = {
    title: "Tokens",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
    `;
    }
};


export class PluginCssTokens extends PluginBaseModule {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    private msg: MessageType = messages['en'];

    @property({ type: Boolean }) autoPrepare: boolean = false;

    @property() position: 'left' | 'right' = 'left';

    @property() level: number = 0;

    @property() key: string = '';

    @property() prop: string = '';

    async prepare() {

    }

    render() {
        return html`<div>Pallete</div>`;
    }


}