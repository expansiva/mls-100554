/// <mls shortName="serviceUserSettings" project="100554" enhancement="_100554_enhancementLitService" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-user-settings-100554')
export class ServiceUserSettings100554 extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf15b',
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
    actualLanguage: string = 'pt'

    @query('.select-language')
    selectLanguage: HTMLSelectElement | undefined

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    private getUserSettings() {
        const userSettings = localStorage.getItem('userSettings');
        if (!userSettings) return;
        const data: IUserSettings = JSON.parse(userSettings);
        if (!data || !data.language) return;
        this.actualLanguage = data.language;
    }

    private setUserLanguage(language: string) {
        let data: IUserSettings
        const userSettings = localStorage.getItem('userSettings');
        if (userSettings) {
            data = JSON.parse(userSettings);
        } else {
            data = {
                language
            }
        }
        this.actualLanguage = language;
        localStorage.setItem('userSettings', JSON.stringify(data));
    }

    private handleChanceLanguageClick() {
        if (!this.selectLanguage) return;
        const language = this.selectLanguage.value;
        this.setUserLanguage(language);
        location.reload();
    }

    render() {

        this.getUserSettings();
        return html`<details> 
            <summary>Linguagens</summary>
            <div>
                <select class="select-language">
                    <option value="pt">pt-BR</option>
                    <option value="en">en-US</option>
                </select>
                <button @click=${this.handleChanceLanguageClick}>Alterar</button>
            </div>
        </details>`;
    }
}

interface IUserSettings {
    language: string,
}
