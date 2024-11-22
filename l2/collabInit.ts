/// <mls shortName="collabInit" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';


@customElement('collab-init-100554')
export class CollabSelectOneWithDescription100554 extends CollabLitElement {

    private actualProject: number = 0;

    get isAnonymoys(): boolean { return this.getAttribute('isAnonymous') === 'true' }

    get avatarUrl(): string { return this.getAttribute('avatarUrl') || '' }

    constructor() {
        super();
        this.actualProject = mls.actual[5].project || 0;
    }

    firstUpdated() {
        this.init();
    }

    render() {
        return html``;
    }

    /**
     * Initializes the configuration of life cycle for the system.
     */
    private init(): void {

        this.setDriver();
        const language = this.setAndGetBaseUrl();
        this.setHTMLLang(language);
        this.setTheme();
        this.setTokensCss();
        this.enableNav(this.avatarUrl, language, this.isAnonymoys)
    }

    /**
     * Asynchronous method responsible for loading and setting up collaboration drivers.
     */
    private async setDriver(): Promise<void> {
        if (window.traceLifeCycle) console.info('loading: drivers collab');

        await this.instanceDriverGitHub();
    }

    /**
     * Asynchronous method that imports, instantiates, and registers the GitHub driver in the system.
     * 
     */
    private async instanceDriverGitHub(): Promise<void> {
        if (window.traceLifeCycle) console.info('loading: driver github');
        const { DriverGitHub } = await import('./_100554_driverGithub');
        const instanceGitHub = new DriverGitHub();
        const driverInstanceGitHub = mls.stor.others.getDriver(instanceGitHub.project, instanceGitHub.shortName);
        if (!driverInstanceGitHub) mls.stor.others.addDriver(instanceGitHub);
    }

    private setAndGetBaseUrl(): string {
        if (window.traceLifeCycle) console.info('setting: baseUrl');
        const language = this.getUserLanguageOrDefault();
        const base = document.head.querySelector('base');
        if (!base) return language;
        const lastHref = base.href;
        const parts = lastHref.split('/');
        parts.pop();
        parts.pop();
        const newHref = parts.join('/') + '/' + language.split('-')[0] + '/';
        base.href = newHref;
        return language;
    }

    private getUserLanguageOrDefault(): string {
        const navigatorLanguage = this.getNavigatorLanguage();
        const acceptLanguages = ['en-US', 'pt-BR'];
        const defaultLang = acceptLanguages.includes(navigatorLanguage) ? navigatorLanguage : 'en-US';
        let rcLanguage: string = defaultLang;
        const userSettings = localStorage.getItem('userSettings');
        if (userSettings) {
            const data: IUserSettings = JSON.parse(userSettings);
            if (data.language && acceptLanguages.includes(data.language)) {
                rcLanguage = data.language;
            }
        }
        return rcLanguage;
    };

    private getNavigatorLanguage() {
        const lg = navigator.language ? navigator.language : '';
        return lg;
    };

    private setHTMLLang(lang: string) {
        if (window.traceLifeCycle) console.info('setting: htmlLang');
        const htmlEl = document.documentElement;
        if (htmlEl) htmlEl.lang = lang;
    };

    private setTheme() {
        if (window.traceLifeCycle) console.info('setting: theme');
        const theme = this.getTheme();
        const htmlEl = document.documentElement;
        if (theme === 'dark' && htmlEl) {
            htmlEl.setAttribute('data-theme', 'dark');
        }
    };

    private getTheme() {
        let theme = localStorage.getItem('_100554_serviceUserSettings_theme');
        if (!theme || theme === 'default') {
            theme = this.getUserThemeOS();
        }
        return theme;
    };

    private getUserThemeOS() {
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isDarkMode ? 'dark' : 'light';
    };

    private async setTokensCss() {
        if (window.traceLifeCycle) console.info('setting: tokens');

        const cacheDsName = '/local/_100554_ds/collabDesignsystem/collabDesignsystem.json';
        const themeName = 'Default';
        const cacheName = 'mls-v2';
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        const match = keys.filter((request) => request.url.includes(cacheDsName));
        if (!match || match.length === 0) return;
        const response = await cache.match(match[match.length - 1]);
        if (!response) return;
        const responseText = await response.text();
        if (!responseText || typeof responseText !== 'string') return;
        const ds = JSON.parse(responseText);
        const tokens = ds.tokens.items;
        if (!tokens || tokens.length === 0) return;
        const tokenByTheme = tokens.find((t: any) => t.themeName === themeName);
        if (!tokenByTheme) return;

        let cssLight = ':root {\n';
        let cssDark = '[data-theme="dark"] {\n';

        function convertValue(value: string): string {
            const tokenRegex = /@([a-zA-Z0-9-]+)/g;
            return value.replace(tokenRegex, (_, token) => `var(--${token})`);
        }

        function processCategory(category: any) {
            Object.entries(category).forEach(([key, value]) => {
                value = convertValue(value as string);
                if (key.startsWith('_dark-')) {
                    const tokenName = key.replace('_dark-', '');
                    cssDark += `\t--${tokenName}: ${value};\n`;
                } else {
                    cssLight += `\t--${key}: ${value};\n`;
                }
            });
        }

        if (tokenByTheme.color) processCategory(tokenByTheme.color);
        if (tokenByTheme.typography) processCategory(tokenByTheme.typography);
        if (tokenByTheme.global) processCategory(tokenByTheme.global);
        cssLight += '}\n';
        cssDark += '}\n';
        const all = cssLight + cssDark;

        const style = document.createElement('style');
        style.textContent = all;
        style.id = 'collab-tokens';
        document.head.appendChild(style);

    };

    private flags: { [key: string]: string } = {
        'en-US': './l3/_100529_/images/estados-unidos.png',
        'pt-BR': './l3/_100529_/images/brasil.png',
    };

    private enableNav(avatarUrl: string, language: string, isAnonymous: boolean) {

        const collabNav1 = document.querySelector('collab-nav-1') as ICollabNav1;
        if (!collabNav1) return;
        if (avatarUrl) collabNav1.changeIconToImage(7, avatarUrl, { text: language, img: this.flags[language] });
        const state = isAnonymous ? 'anonymous' : 'enabled';
        if (window.traceLifeCycle) console.info(`setting: status collab-nav-1 : ${state}`);
        collabNav1.setAttribute('status', state);

    };


}

interface ICollabNav1 extends HTMLElement {
    changeIconToImage: (level: number, avatarUrl: string, additional?: { text: string, img?: string }) => void
}

interface IUserSettings {
    language: string,
}