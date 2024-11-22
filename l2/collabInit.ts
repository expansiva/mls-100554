/// <mls shortName="collabInit" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';

@customElement('collab-init-100554')
export class CollabSelectOneWithDescription100554 extends CollabLitElement {

    private actualProject: number | undefined = 0;

    /**
     * Indicates if the user is anonymous based on the `isAnonymous` attribute.
     * @returns `true` if the user is anonymous; otherwise, `false`.
     */
    get isAnonymous(): boolean {
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
     * Initializes the system life cycle.
     * To show logs using: https://collab.codes/?traceLifeCycle=true
     */
    private async init() {

        this.setDrivers();
        const language = this.setAndGetBaseUrl();
        this.setHTMLLang(language);
        this.setTheme();
        this.setTokensCss();
        this.actualProject = this.setProjectActual();
        this.setOrgActual(this.actualProject);
        await this.loadProjectBase();
        await this.loadLastProject();
        const services = await this.getServices();
        this.enableNav(this.avatarUrl, language, services, this.isAnonymous);

    }

    /**
     * Loads and sets up collaboration drivers asynchronously.
     */
    private async setDrivers(): Promise<void> {
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
        if (window.traceLifeCycle) console.info('enableNav: collab-nav-1');

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

    /**
     * Retrieves the last selected project ID from localStorage.
     * @returns The last selected project ID as a number, or `undefined` if not found.
     */
    private getLastProjectSelected(): number | undefined {
        if (window.traceLifeCycle) console.info('getLastProjectSelected');
        const lhLastPrj = localStorage.getItem('l5-last-project');
        const lastPrj = lhLastPrj ? Number.parseInt(lhLastPrj, 10) : undefined;
        return lastPrj;
    }

    /**
     * Sets the actual project in the `mls` structure based on the last selected project.
     * @returns The last selected project ID as a number, or `undefined` if not found.
     */
    private setProjectActual(): number | undefined {
        if (window.traceLifeCycle) console.info('setProjectActual');
        const project = this.getLastProjectSelected();
        if (project) mls.actual[5].project = project || 0;
        return project;
    }

    /**
     * Sets the current organization in the `mls` structure based on the provided project ID.
     * @param project The project ID to determine the organization index.
     */
    private setOrgActual(project: number | undefined): void {
        if (window.traceLifeCycle) console.info(`setOrgActual for project: ${project}`);
        if (!project) return;
        const orgIndex = mls.l5.getProjectOrgIndex(project);
        mls.l5.setActualOrg(orgIndex);
    }

    /**
     * Asynchronously loads the base project information if it is not already loaded.
     * Utilizes the `mls.stor.server.loadProjectInfoIfNeeded` method with the base project ID.
     * @returns A promise that resolves when the base project information is loaded.
     */
    private async loadProjectBase() {
        if (window.traceLifeCycle) console.info(`loadProjectBase: ${this.baseProject}`);
        await mls.stor.server.loadProjectInfoIfNeeded(this.baseProject);
    }
    
    /**
     * Loads the information of the last accessed project if it exists.
     * If the `actualProject` is defined, it attempts to load the project's information
     * from the server using the `loadProjectInfoIfNeeded` method.
     * 
     * Optionally logs the lifecycle trace if the global `traceLifeCycle` is enabled.
     * 
     * @returns A promise that resolves when the project information has been loaded.
     */
    private async loadLastProject() {
        if (window.traceLifeCycle) console.info(`loadLastProject: ${this.actualProject}`);
        if (this.actualProject) await mls.stor.server.loadProjectInfoIfNeeded(this.actualProject);
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

    /**
     * Retrieves a list of services for the current project, either for anonymous users or regular users.
     * If the user is anonymous, it returns the `anonymousServices`. Otherwise, it loads project-specific
     * services by fetching and sorting the available menu actions for different levels and positions (Left/Right).
     * 
     * @returns A promise that resolves to an object containing an array of services, sorted by priority.
     * The services are categorized by levels and positions (Left/Right) and are returned as a semicolon-separated
     * string for each level.
     */
    private async getServices(): Promise<IServices> {

        if (window.traceLifeCycle) console.info(`init getServices`);

        if (this.isAnonymous) {
            if (window.traceLifeCycle) console.info(`getServices: Anonymous`);
            return this.anonymousServices;
        }

        let project: number = this.actualProject || 0;
        if (!project) project = this.baseProject;

        if (window.traceLifeCycle) console.info(`getServices using index project: ${project}`);

        await mls.plugin.loadAll(project, false);

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

    /**
     * Checks whether all the service positions (Left and Right) for each level are empty.
     * It iterates through the `rc` object and checks if both Left and Right arrays are empty for each level.
     * 
     * @param rc - An object that contains services categorized by levels and positions (Left/Right).
     * @returns A boolean indicating whether all positions (Left and Right) are empty. 
     *         Returns `true` if all positions are empty, `false` otherwise.
     */
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