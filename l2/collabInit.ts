/// <mls shortName="collabInit" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';

@customElement('collab-init-100554')
export class CollabSelectOneWithDescription100554 extends CollabLitElement {

    private actualProject: number | undefined = 0;

    /**
     * Indicates if the user is anonymous based on the `isAnonymous` attribute.
     * @returns `true` if the user is anonymous; otherwise, `false`.
     */
    get isAnonymoys(): boolean {
        return this.getAttribute('isAnonymous') === 'true';
    }

    /**
     * Retrieves the avatar URL from the `avatarUrl` attribute.
     * @returns The URL of the avatar, or an empty string if not defined.
     */
    get avatarUrl(): string {
        return this.getAttribute('avatarUrl') || '';
    }


    /**
     * Retrieves the base Project from the `baseProject` attribute.
     * @returns The URL of the avatar, or an empty string if not defined.
     */
    get baseProject(): number {
        return +(this.getAttribute('baseProject') || 100554);
    }

    /**
     * Lit lifecycle method called after the component is first updated.
     * Initializes the component's configuration.
     */
    firstUpdated() {
        this.init();
    }


    render() {
        return html``;
    }

    /**
     * Initializes the configuration for the component, setting drivers, theme, language, and tokens.
     */
    private async init() {
        this.setDriver();
        const language = this.setAndGetBaseUrl();
        this.setHTMLLang(language);
        this.setTheme();
        this.setTokensCss();
        this.actualProject = this.setProjectActual();
        this.setOrgActual(this.actualProject);
        const services = await this.getServices()
        this.enableNav(this.avatarUrl, language, services, this.isAnonymoys);
    }

    /**
     * Loads and sets up collaboration drivers asynchronously.
     */
    private async setDriver(): Promise<void> {
        if (window.traceLifeCycle) console.info('loading: drivers collab');
        await this.instanceDriverGitHub();
    }

    /**
     * Instantiates and registers the GitHub collaboration driver asynchronously.
     */
    private async instanceDriverGitHub(): Promise<void> {
        if (window.traceLifeCycle) console.info('loading: driver github');
        const { DriverGitHub } = await import('./_100554_driverGithub');
        const instanceGitHub = new DriverGitHub();
        const driverInstanceGitHub = mls.stor.others.getDriver(instanceGitHub.project, instanceGitHub.shortName);
        if (!driverInstanceGitHub) mls.stor.others.addDriver(instanceGitHub);
    }

    /**
     * Sets the base URL for the project and retrieves the user's language.
     * @returns The user's language (e.g., 'en-US', 'pt-BR').
     */
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

    /**
     * Retrieves the user's preferred language or defaults to 'en-US'.
     * @returns The user's language.
     */
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
    }

    /**
     * Retrieves the browser's language setting.
     * @returns The browser's language.
     */
    private getNavigatorLanguage(): string {
        const lg = navigator.language ? navigator.language : '';
        return lg;
    }

    /**
     * Sets the `lang` attribute of the HTML `<html>` element.
     * @param lang The language code to set (e.g., 'en-US').
     */
    private setHTMLLang(lang: string): void {
        if (window.traceLifeCycle) console.info('setting: htmlLang');
        const htmlEl = document.documentElement;
        if (htmlEl) htmlEl.lang = lang;
    }

    /**
     * Sets the theme for the application based on user settings or OS preferences.
     */
    private setTheme(): void {
        if (window.traceLifeCycle) console.info('setting: theme');
        const theme = this.getTheme();
        const htmlEl = document.documentElement;
        if (theme === 'dark' && htmlEl) {
            htmlEl.setAttribute('data-theme', 'dark');
        }
    }

    /**
     * Retrieves the theme from user settings or defaults to the OS preference.
     * @returns The theme ('dark' or 'light').
     */
    private getTheme(): string {
        let theme = localStorage.getItem('_100554_serviceUserSettings_theme');
        if (!theme || theme === 'default') {
            theme = this.getUserThemeOS();
        }
        return theme;
    }

    /**
     * Retrieves the user's OS theme preference.
     * @returns The OS theme preference ('dark' or 'light').
     */
    private getUserThemeOS(): string {
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isDarkMode ? 'dark' : 'light';
    }

    /**
     * Sets CSS tokens for light and dark themes by retrieving data from a cache.
     */
    private async setTokensCss(): Promise<void> {
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
    }

    /**
     * Configures navigation settings, including avatar and status, for the collaboration interface.
     * @param avatarUrl The URL of the avatar.
     * @param language The user's language.
     * @param isAnonymous Indicates whether the user is anonymous.
     */
    private enableNav(avatarUrl: string, language: string, services: IServices, isAnonymous: boolean): void {
        const collabNav1 = document.querySelector('collab-nav-1') as ICollabNav1;
        if (!collabNav1) return;
        if (avatarUrl) collabNav1.changeIconToImage(7, avatarUrl, { text: language, img: this.flags[language] });
        const state = isAnonymous ? 'anonymous' : 'enabled';
        if (window.traceLifeCycle) console.info(`setting: status collab-nav-1 : ${state}`);
        collabNav1.services = services;
        collabNav1.setAttribute('status', state);
    }

    private flags: { [key: string]: string } = {
        'en-US': './l3/_100529_/images/estados-unidos.png',
        'pt-BR': './l3/_100529_/images/brasil.png',
    };

    private getLastProjectSelected(): number | undefined {
        const lhLastPrj = localStorage.getItem('l5-last-project');
        const lastPrj = lhLastPrj ? Number.parseInt(lhLastPrj, 10) : undefined;
        return lastPrj;
    }

    private setProjectActual() {
        const project = this.getLastProjectSelected();
        if (project) mls.actual[5].project = project || 0;
        return project;
    }

    private setOrgActual(project: number | undefined) {
        if (!project) return;
        const orgIndex = mls.l5.getProjectOrgIndex(project);
        mls.l5.setActualOrg(orgIndex);
    }

    private anonymousServices: IServices = {
        services: [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ';_100554_serviceDetail,',
        ]
    }

    private async getServices(): Promise<IServices> {

        if (this.isAnonymoys) {
            return this.anonymousServices;
        }

        let project: number = this.actualProject || 0;
        if (!project) project = this.baseProject;

        await mls.plugin.loadAll(project, true);

        const levels = [0, 1, 2, 3, 4, 5, 6, 7];
        const rc: ITempServices = {
            0: { Left: [], Right: [] },
            1: { Left: [], Right: [] },
            2: { Left: [], Right: [] },
            3: { Left: [], Right: [] },
            4: { Left: [], Right: [] },
            5: { Left: [], Right: [] },
            6: { Left: [], Right: [] },
            7: { Left: [], Right: [] },
        };

        const positions: ['Left', 'Right'] = ['Left', 'Right'];

        levels.forEach((level) => {
            positions.forEach((position) => {
                const scope = `l${level}Services${position}`;
                const services = mls.plugin.getAllMenuActions(project, { scope } as any);
                const sorted = services.sort((a: mls.plugin.MenuAction, b: mls.plugin.MenuAction) => (a.priority || 1) - (b.priority || 1));
                sorted.forEach((service: mls.plugin.MenuAction) => {
                    if (service && service.widget) {
                        rc[level][position].push(service.widget);
                    }
                });
            });
        });

        const rc2: string[] = ['', '', '', '', '', '', '', ''];

        const areAllPositionsEmpty = this.areAllPositionsEmpty(rc);
        if (areAllPositionsEmpty) {
            return {
                services: [],
            };
        }

        Object.entries(rc).forEach((entry) => {
            const [level, value] = entry;
            const left = value.Left.join(',');
            const right = value.Right.join(',');
            rc2[+level] = left + ';' + right;
        });

        return {
            services: rc2,
        };
    }

    private areAllPositionsEmpty(rc: ITempServices): boolean {
        for (const level in rc) {
            var hasBarProperty = Object.prototype.hasOwnProperty.call(rc, "level");
            if (hasBarProperty) {
                const { Left, Right } = rc[level];
                if (Left.length > 0 || Right.length > 0) {
                    return false;
                }
            }
        }
        return true;
    }


}

interface ICollabNav1 extends HTMLElement {
    changeIconToImage: (level: number, avatarUrl: string, additional?: { text: string, img?: string }) => void
    services: IServices
}

interface IServices {
    services: string[],
}

interface ITempServices {
    [key: number]: ITempServicesItem
}

interface ITempServicesItem {
    Left: string[],
    Right: string[]
}
interface IUserSettings {
    language: string,
}