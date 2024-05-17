/// <mls shortName="serviceUserSettings" project="100554" enhancement="_100554_enhancementLitService" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

/// **collab_i18n_start**
const message_pt = {
    languageLabel: 'Linguagens',
    alterarLabel: 'Alterar',
}

const message_en = {
    languageLabel: 'Languages',
    alterarLabel: 'Change',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-user-settings-100554')
export class ServiceUserSettings100554 extends ServiceBase {

    private myMessage: MessageType = messages['en-us'];

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf4fe',
        state: 'foreground',
        position: 'right',
        tooltip: 'User Settings',
        visible: true,
        widget: '_100554_serviceUserSettings',
        level: [0]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'User Settings',
        actions: {
        },
        icons: {},
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    @property()
    actualLanguage: ILanguage = 'pt-BR'

    @query('.select-language')
    selectLanguage: HTMLSelectElement | undefined

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (visible && reinit) {
            this.requestUpdate();
        }
    }

    private getUserSettings() {
        const userSettings = localStorage.getItem('userSettings');
        if (!userSettings) {
            this.actualLanguage = 'default';
            return;
        }
        const data: IUserSettings = JSON.parse(userSettings);
        if (!data || !data.language) {
            this.actualLanguage = 'default';
            return;
        }
        this.actualLanguage = data.language as ILanguage;
    }

    private setUserLanguage(language: ILanguage) {
        let data: IUserSettings = { language: '' }
        const userSettings = localStorage.getItem('userSettings');
        if (userSettings) data = JSON.parse(userSettings);

        if (language === 'default') this.actualLanguage = this.getUserDefault();
        else this.actualLanguage = language;

        data.language = language;
        localStorage.setItem('userSettings', JSON.stringify(data));
    }

    private getNavigatorLanguage() {
        const lg = navigator.language ? navigator.language : '';
        return lg;
    };

    private getUserDefault(): ILanguage {
        const navigatorLanguage = this.getNavigatorLanguage();
        const acceptLanguages = ['en-US', 'pt-BR'];
        const defaultLang = acceptLanguages.includes(navigatorLanguage) ? navigatorLanguage : 'en-US';
        return defaultLang as ILanguage;
    }

    private handleChanceLanguageClick() {
        if (!this.selectLanguage) return;
        const language = this.selectLanguage.value as ILanguage;
        this.setUserLanguage(language);
        location.reload();
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.myMessage = messages[lang]
        this.getUserSettings();
        return html`
        <section>
            <details> 
                <summary>${this.myMessage.languageLabel}</summary>
                <div>
                    <select style="width:200px" .value=${this.actualLanguage} class="select-language">
                        <option value="default">Default</option>
                        <option value="pt-BR">pt-BR</option>
                        <option value="en-US">en-US</option>
                    </select>
                    <button style="margin-top:1rem" @click=${this.handleChanceLanguageClick}>${this.myMessage.alterarLabel}</button>
                </div>
            </details>
        </section>
        `;
    }
}

type ILanguage = 'pt-BR' | 'en-US' | 'default'
interface IUserSettings {
    language: string,
}
