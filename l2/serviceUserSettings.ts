/// <mls shortName="serviceUserSettings" project="100554" enhancement="_100554_enhancementLitService" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

/// **collab_i18n_start**
const message_pt = {
    languageLabel: 'Linguagens',
    alterarLabel: 'Alterar',
    themeLabel: 'Tema',
    themeOptDark: 'Escuro',
    themeOptLight: 'Claro',
    themeOptDf: 'Padrão',
}

const message_en = {
    languageLabel: 'Languages',
    alterarLabel: 'Change',
    themeLabel: 'Theme',
    themeOptDark: 'Dark',
    themeOptLight: 'Light',
    themeOptDf: 'Default',

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

    @property() actualLanguage: ILanguage = 'pt-BR'
    @property() actualTheme: string = 'default';

    @query('.select-language') selectLanguage: HTMLSelectElement | undefined;
    @query('.select-theme') selectTheme: HTMLSelectElement | undefined;


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
        let userTheme = this.getUserTheme();
        if (!userTheme) userTheme = this.getUserThemeOS();
        this.actualTheme = userTheme;

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

    private handleChangeLanguageClick() {
        if (!this.selectLanguage) return;
        const language = this.selectLanguage.value as ILanguage;
        this.setUserLanguage(language);
        location.reload();
    }

    private handleChangeThemeClick() {
        if (!this.selectTheme) return;
        const theme = this.selectTheme.value as ILanguage;
        this.setUserTheme(theme);
        location.reload();
    }

    private setUserTheme(theme: string) {
        localStorage.setItem('_100554_serviceUserSettings_theme', theme);
    }

    private getUserTheme() {
        return localStorage.getItem('_100554_serviceUserSettings_theme');
    }

    private getUserThemeOS() {
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isDarkMode ? 'dark' : 'light';
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
                    <button style="margin-top:1rem" @click=${this.handleChangeLanguageClick}>${this.myMessage.alterarLabel}</button>
                </div>
            </details>
            <details> 
                <summary>${this.myMessage.themeLabel}</summary>
                <div>
                    <select style="width:200px" .value=${this.actualTheme} class="select-theme">
                        <option value="default">${this.myMessage.themeOptDf}</option>
                        <option value="dark">${this.myMessage.themeOptDark}</option>
                        <option value="light">${this.myMessage.themeOptLight}</option>
                    </select>
                    <button style="margin-top:1rem" @click=${this.handleChangeThemeClick}>${this.myMessage.alterarLabel}</button>
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
