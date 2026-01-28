/// <mls shortName="collabInit" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

let on1CompileMonaco = true;
export async function initCompileMonaco(project: number): Promise<boolean> {
    if (!on1CompileMonaco) return true;
    try {
        await mls.editor.InitMonaco();

        const depsActualProject = mls.l5.getProjectDependencies(project, false);
        const deps = [project, ...depsActualProject];
        for await (let prj of deps) {
            if ([100529, 100131].includes(prj)) continue;

            const prjModel = mls.editor.getModels(prj, '', '', 2);
            if ((!prjModel || !prjModel.ts) && prj !== mls.stor.LOCALPROJECTNUMBER) {
                const info = await mls.stor.localDB.readPrjInfo(prj);
                if (info.indexModules) mls.editor.createModelProjectDefinition(prj, info.indexModules);
            }
        }

        on1CompileMonaco = false;
    } catch (err: any) {
        throw new Error(err.message);
    }
    return true;
}


@customElement('collab-init-100554')
export class CollabInit extends LitElement {

    private actualProject: number | undefined = 0;

    /**
     * Indicates if the user is anonymous based on the cookie loginUser
     * @returns `true` if the user is anonymous; otherwise, `false`.
     */
    get isAnonymous(): boolean {
        const cookieUser = mls.api.common.getCookie('loginUser');
        return cookieUser === 'anonymous' || !cookieUser;
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
        this.initCoachMark();
        this.setTheme();
        this.setTokensCss();
        await this.loadProjectBase();

        this.actualProject = await this.setProjectActual();
        this.setOrgActual(this.actualProject);
        await this.loadLastProject();
        await this.setLastOpenedFiles();
        await this.setDefaultFiles();
        await this.setLastModule();
        this.showMessagesIfNeeded();
        this.initNotificationIfEnabled();
        const services = await this.getServices();
        this.checkURLParams();
        this.setEvents();
        this.enableNav(this.avatarUrl, language, services, this.isAnonymous);

    }

    private setEvents() {
        mls.events.addEventListener(
            [0, 1, 2, 3, 4, 5, 6, 7],
            ['LevelChanged'] as any,
            this.onLevelChanged.bind(this)
        );
    }

    private onLevelChanged(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const data: { to: number, from: number } = JSON.parse(ev.desc);

        const handler = this.levelHandlers[data.to];
        if (handler) handler(data);
    }

    private firstAccessLevels: Record<number, boolean> = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i, true]));

    private levelHandlers: Record<number, (data: { to: number, from: number }) => void> = {
        2: this.onLevelChangedToL2.bind(this),
    };

    private onLevelChangedToL2(data: { to: number, from: number }) {
        if (!this.firstAccessLevels[2]) return;
        this.firstAccessLevels[2] = false;
        const page = top?.document.querySelector('collab-page');
        if (!page) return;
        const toolbar = page.querySelector(`collab-nav-2[toolbarposition="left"]`) as HTMLElement;
        (toolbar as any).state[2].left = '_100554_serviceSource';
    }
    /**
     * Loads and sets up collaboration drivers asynchronously.
     */
    private async setDrivers(): Promise<void> {
        if (window.traceLifeCycle) console.info('loading: drivers collab');
        await this.instanceDriverGitHub();
        await this.instanceDriverGitLab();
    }

    /**
     * Instantiates and registers the GitHub collaboration driver asynchronously.
     */
    private async instanceDriverGitHub(): Promise<void> {
        if (window.traceLifeCycle) console.info('loading: driver github');
        const { DriverGitHub } = await import('/_100554_/l2/driverGithub.js');
        const instanceGitHub = new DriverGitHub();
        const driverInstanceGitHub = mls.stor.others.getDriver('github');
        if (!driverInstanceGitHub) mls.stor.others.addDriver(instanceGitHub, 'github');
    }

    /**
     * Instantiates and registers the GitLab collaboration driver asynchronously.
     */
    private async instanceDriverGitLab(): Promise<void> {
        if (window.traceLifeCycle) console.info('loading: driver gitlab');
        const { DriverGitLab } = await import('/_100554_/l2/driverGitlab.js');
        const instanceGitLab = new DriverGitLab();
        const driverInstanceGitLab = mls.stor.others.getDriver('gitlab');
        if (!driverInstanceGitLab) mls.stor.others.addDriver(instanceGitLab, 'gitlab');
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

    private async initCoachMark() {
        try {
            const module = await import('/_100554_/l2/collabManagerCoachMarks.js');
            if (!module || !module.initManagerCoachMark || typeof module.initManagerCoachMark !== 'function') return;
            module.initManagerCoachMark();
        } catch (err: any) {
            console.error('Error on listen initCoachMark' + err.message)
        }
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
        try {
            const module = await import('/_100554_/l2/designSystemBase.js');
            if (!module || !module.getTokensCss || typeof module.getTokensCss !== 'function') return;
            const tokensCss = await module.getTokensCss(this.baseProject, 'Default');
            const style = document.createElement('style');
            style.textContent = tokensCss;
            style.id = 'collab-tokens';
            document.head.appendChild(style);
        } catch (err: any) {
            console.error('Error on listen initCoachMark' + err.message)
        }

    }

    /**
     * Configures navigation settings, including avatar and status, for the collaboration interface.
     * @param avatarUrl The URL of the avatar.
     * @param language The user's language.
     * @param isAnonymous Indicates whether the user is anonymous.
     */
    private enableNav(avatarUrl: string, language: string, services: IServices, isAnonymous: boolean): void {
        if (window.traceLifeCycle) console.info('enableNav: collab-nav-1');

        const collabNav1 = document.querySelector('collab-nav-1') as IHTMLCollabNav1;
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
    private async getLastProjectSelected(): Promise<number | undefined> {
        if (window.traceLifeCycle) console.info('getLastProjectSelected');

        try {
            const lib = await import('/_100554_/l2/libCommom.js');
            if (!lib || !lib.getProjectDetails || !lib.setProjectDetails) return;
            const info = lib.getProjectDetails();
            const lastPrj = info ? info.project : this.baseProject;
            lib.setProjectDetails(lastPrj);
            return lastPrj;
        } catch (err: any) {
            console.error(err.message);
            return undefined;
        }

    }

    /**
     * Sets the actual project in the `mls` structure based on the last selected project.
     * @returns The last selected project ID as a number, or `undefined` if not found.
     */
    private async setProjectActual(): Promise<number | undefined> {
        if (window.traceLifeCycle) console.info('setProjectActual');
        const project = await this.getLastProjectSelected();

        mls.setActualProject(project === undefined || project < 0 ? 100554 : project);
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
        const depsBaseProject = mls.l5.getProjectDependencies(this.baseProject, false);
        const deps = [...depsBaseProject];
        for await (let prj of deps) {
            await mls.stor.server.loadProjectInfoIfNeeded(prj);
        }
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
        if (!this.actualProject) return;
        const depsActualProject = mls.l5.getProjectDependencies(this.actualProject, false);
        const deps = [this.actualProject, ...depsActualProject];
        for await (let prj of deps) {
            if (this.actualProject && this.actualProject !== mls.stor.LOCALPROJECTNUMBER) await mls.stor.server.loadProjectInfoIfNeeded(prj);
        }
        initCompileMonaco(this.actualProject);
    }

    private async setLastOpenedFiles() {

        if (!this.actualProject) return;
        try {
            const lib = await import('/_100554_/l2/libCommom.js');
            if (!lib || !lib.getLastOpenedFiles) return;

            const lastFiles = lib.getLastOpenedFiles(this.actualProject);
            Object.entries(lastFiles).forEach(([levelStr, value]) => {
                const level = +levelStr;
                const actual = mls.actual[level];
                if (!actual) return;

                if (typeof value === 'string') {
                    actual.setFullName(value);
                    return;
                }

                if (level === 2 && typeof value === 'object' && value !== null) {
                    this.restoreSideFile(value.left, level, 'left', actual);
                    this.restoreSideFile(value.right, level, 'right', actual);
                }
            });
        } catch (err: any) {
            console.error(err.message);
        }

    }

    private FILEL6 = 'projects';
    private FILEL5 = 'modules';
    private async setDefaultFiles() {
        if (!this.actualProject) return;

        try {

            const lib = await import('/_100554_/l2/libCommom.js');
            if (!lib || !lib.findStorFileInProjectsOrDeps) return;
            const defaultL6 = lib.findStorFileInProjectsOrDeps(this.actualProject, 2, this.FILEL6, '', '.ts');
            const defaultL5 = lib.findStorFileInProjectsOrDeps(this.actualProject, 2, this.FILEL5, '', '.ts');
            if (defaultL6) mls.actual[6].setFullName(`_${defaultL6.project}_${defaultL6.shortName}`);
            if (defaultL5) mls.actual[5].setFullName(`_${defaultL5.project}_${defaultL5.shortName}`);

        } catch (err: any) {
            console.error(err.message);
        }
    }

    private restoreSideFile(
        filename: string | undefined,
        level: number,
        side: 'left' | 'right',
        actual: any
    ) {
        if (!filename) return;
        const path = mls.l2.getPath(filename);
        const key = mls.stor.getKeyToFiles(path.project, level, path.shortName, path.folder, '.ts');
        const file = mls.stor.files[key];
        if (!file) return;
        actual[side] = file;
    }

    private async setLastModule() {
        if (!this.actualProject) return;
        try {
            const lib = await import('/_100554_/l2/libCommom.js');
            if (!lib || !lib.getLastModule) return;
            const modules = lib.getLastModule();
            if (!modules || !modules[+this.actualProject]) return;
            mls.setActualModule(modules[+this.actualProject]);
        } catch (err: any) {
            console.error(err.message);
        }

    }

    /**
     * Checks for the presence of a `<collab-sticky-notification>` element on the page.
     * If found, it invokes the `show()` method on the element to display notifications.
     */
    private showMessagesIfNeeded() {
        const collabMessages = document.querySelector('collab-sticky-notification') as IHTMLCollabMessages;
        if (collabMessages) collabMessages.show();
    }

    /**
     * Checks the URL parameters and performs actions based on their values.
     * - If the user is anonymous, opens the login dialog.
     * - If the `details` parameter is `privacyPolicy`, opens the privacy policy details.
     * - If the `details` parameter is `termsOfService`, opens the terms of service details.
     *
     */
    private checkURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const details = urlParams.get('details');
        if (details === 'privacyPolicy') return this.openPolicyPrivacy();
        if (details === 'termsOfService') return this.openTerms();
        if (this.isAnonymous) return this.openLogin();
    }

    /**
     * Opens the privacy policy in the service Details.
    */
    private openPolicyPrivacy() {
        this.setDetailsInitialPlugin('_100554_pluginSystemPrivacyPolicy');
    }

    /**
     * Opens the terms of use in the service Details.
    */
    private openTerms() {
        this.setDetailsInitialPlugin('_100554_pluginSystemTermsOfService');
    }

    /**
     * Opens the login screen in the service Details.
    */
    private openLogin() {
        this.setDetailsInitialPlugin('_100554_pluginCollabLogin');
    }

    /**
     * Sets up the initial plugin for the details view by modifying the state of the application's
     * toolbar and navigation components.
     *
     */
    private setDetailsInitialPlugin(plugin: string) {
        Promise.all(['collab-nav-2', 'collab-nav-3'].map((wc) => customElements.whenDefined(wc))).then(async () => {
            const page = document.querySelector('collab-page');
            const toolbar = page?.querySelector(`collab-nav-2[toolbarposition="right"]`) as IHTMLCollabNav2;
            const nav3 = page?.querySelector('collab-nav-3[toolbarposition="right"]') as IHTMLCollabNav3;
            if (!toolbar || !nav3) return;
            nav3.args = { widget: plugin };
            toolbar.state[7].right = '_100554_serviceDetail';
        })
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

        let project: number = 100554;//this.actualProject || 0;
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

    private async initNotificationIfEnabled() {

        try {
            let preferences: string | null | undefined;
            const module = await import('/_102025_/l2/collabMessagesHelper.js');
            if (!module || !module.loadNotificationPreferences) preferences = null;
            if (preferences !== 'granted' && Notification.permission !== 'granted') return;
            const moduleSync = await import('/_102025_/l2/collabMessagesSyncNotifications.js');
            if (!moduleSync || !moduleSync.listenToThreadEvents || typeof moduleSync.listenToThreadEvents !== 'function') return;
            moduleSync.listenToThreadEvents();
        } catch (err: any) {
            console.error('Error on listen notifications' + err.message)
        }

    }

}


interface IHTMLCollabNav1 extends HTMLElement {
    changeIconToImage: (level: number, avatarUrl: string, additional?: { text: string, img?: string }) => void
    services: IServices
}

interface IHTMLCollabNav2 extends HTMLElement {
    state: ICollabState

}
interface ICollabState {
    [key: number]: ICollabState2
}

interface ICollabState2 {
    left: string,
    right: string,
}

interface IHTMLCollabNav3 extends HTMLElement {
    args: Record<string, string>
}

interface IHTMLCollabMessages extends HTMLElement {
    show: () => void,
    close: () => void
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