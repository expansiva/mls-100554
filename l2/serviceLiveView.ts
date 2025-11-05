/// <mls shortName="serviceLiveView" project="100554" enhancement="_100554_enhancementLitService" />

import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';
import { collab_eye, collab_plus } from './_100554_collabIcons';
import { openService } from './_100554_libCommom';

import { DISTFOLDER, buildModule } from './_100554_libLiveView';

interface ITab {
    moduleName: string,
    modulePath: string,
    project: number,
    pageInitial: string,
    actualPage: string,
    icon: string,
    target: string,
}

/// **collab_i18n_start**
const message_pt = {
    newTab: 'Nova aba',
}

const message_en = {
    newTab: 'new Tab',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-live-view-100554')
export class ServiceLiveView100554 extends ServiceBase {

    /*
    @property() project?: number = 102019;
    @property() moduleName?: string = 'mdm';
    */
    private msg: MessageType = messages['en'];

    @state() actualTab: number = 0;
    @query('.liveview-container') container?: HTMLElement;

    private tabs: ITab[] = [];

    // private iframe?: HTMLIFrameElement;
    private liveViewReady = false;

    get iframe(): HTMLIFrameElement | null {
        return this.querySelector(`iframe[tab-index="${this.actualTab}"]`);
    }

    public details: IService = {
        icon: '&#xf06e',
        state: 'foreground',
        position: 'right',
        tooltip: 'Live View',
        visible: true,
        widget: '_100554_serviceLiveView',
        level: [7]
    };

    public onClickMain(op: string): void {
        if (this.menu.setMode) this.menu.setMode('initial');
    }

    public onClickTabs = (op: number): void => {
        this.actualTab = op;
        // this.toogleLoading(false);
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tools: {
            /* add: {
                type: 'cycle',
                onlyMenu: false,
                selected: 0,
                options: [
                    { text: this.msg.newTab, icon: collab_plus.strings[0] },
                ]
            }*/
        },
        tabs: {
            group: 'Mode',
            type: 'full',
            selected: 0,
            options: [
                { text: 'Module', icon: collab_eye.strings[0].trim() },
            ]
        },
        onClickTabs: this.onClickTabs.bind(this),
        onClickMain: this.onClickMain.bind(this),

    };

    async onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (visible && this.iframe?.contentDocument) {
            const tabActual = this.tabs[this.actualTab];
            if (!tabActual) return;
            this.toogleLoading(true);
            const needUpdate = await buildModule(tabActual.project, tabActual.moduleName);
            if (needUpdate) {
                const actual7 = mls.actual[7];
                if (!actual7 || !actual7.project) return;
                const fullName = mls.actual[7].getFullName();
                const info = mls.l2.getPath(fullName);
                this.tabs = [...[]];
                this.requestUpdate();
                await this.updateComplete;
                await this.setInitialTabInfos(info.project, info.shortName, info.folder);
            }
            // this.toogleLoading(false);
        }
    }

    async firstUpdated() {
        const actual7 = mls.actual[7];
        if (!actual7 || !actual7.project) return;
        const fullName = mls.actual[7].getFullName();
        const info = mls.l2.getPath(fullName);
        await this.setInitialTabInfos(info.project, info.shortName, info.folder);
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
			<div class="liveview-container">
                ${this.tabs.map((tab, index) => {
            return html`
                <iframe
                    tab-index=${index}
                    style="width:100%; height:100%; border:none;display:none;"
                    class="${this.actualTab === index ? '' : 'closed'}"
                    src="/_100554_servicePreview"
                    @load=${this.load}>
                </iframe>
            `
        })}
                
			</div>
		`;
    }

    private setEvents(): void {

        window.top?.addEventListener('message', async (event) => {
            const { type, target, project, moduleName, pageName, modulePath } = event.data;
            if (type !== 'loadPage') return;
            if (!this.liveViewReady) return;
            try {
                this.checkToLoadPage(pageName, moduleName, modulePath, project, target);
            } catch (err) {
                console.error('Erro ao carregar página no LiveView:', err);
            }
        });

    }

    private async checkToLoadPage(pageName: string, moduleName: string, modulePath: string, project: number, target: string) {

        let tabActual = this.tabs[this.actualTab];
        const _target = !target ? moduleName : target;

        if (!_target) {
            tabActual = this.tabs[0];
            this.actualTab = 0;
            await this.openTab();
        }

        const oldProject = tabActual.project;

        if (tabActual.project !== project || tabActual.moduleName !== moduleName) {
            this.toogleLoading(true);
            await buildModule(project, moduleName);
            await this.setActualTabInfos(project, pageName, modulePath, moduleName, _target);
        } else if (_target !== '') {
            await this.setActualTabInfos(project, pageName, modulePath, moduleName, _target);
        }

        if (oldProject !== project) {
            await this.injectGlobalStyle(true);
            await this.injectScriptRunTime(true);
        }

        this.toogleLoading(false);
        this.loadPage(pageName);
    }

    private async setInitialTabInfos(project: number, pageInitial: string, modulePath: string) {

        const keyToImportProject = `./_${project}_project`;
        const moduleProject = await import(`./${keyToImportProject}`);
        if (!moduleProject) return;
        const moduleConfig = moduleProject.modules.find((item: any) => item.path === modulePath);
        if (!moduleConfig) return;
        this.tabs = [{
            actualPage: '',
            moduleName: moduleConfig.name,
            modulePath: moduleConfig.path,
            pageInitial,
            project: project,
            icon: moduleConfig.icon,
            target: moduleConfig.target || moduleConfig.name
        }];

        this.tabs = [...this.tabs];
        await this.requestUpdate();

        if (this.menu && this.menu.tabs && this.menu.refresh) {
            this.menu.tabs.options[0].text = this.tabs[0].moduleName;
            this.menu.tabs.options[0].icon = this.tabs[0].icon;
            this.menu.refresh();
        }
        openService('_100554_serviceApps', 'left', 7);

    }

    private async setActualTabInfos(project: number, pageInitial: string, modulePath: string, moduleName: string, target: string) {

        const _target = !target ? moduleName : target;

        if (_target !== '') {
            const tabIndex = this.tabs.findIndex((tab) => tab.target === _target);
            if (tabIndex > -1) {
                this.actualTab = tabIndex;
                await this.openTab();
            }
            else this.addTab(pageInitial, '', moduleName, modulePath, project, _target)
        }

        const tabActual = this.tabs[this.actualTab];
        const keyToImportProject = `./_${project}_project`;
        const moduleProject = await import(`./${keyToImportProject}`);
        if (!moduleProject) return;
        const moduleConfig = moduleProject.modules.find((item: any) => item.path === modulePath);

        tabActual.actualPage = pageInitial;
        tabActual.project = project;
        tabActual.moduleName = moduleConfig.name;
        tabActual.modulePath = modulePath;
        tabActual.icon = moduleConfig.icon;
        tabActual.pageInitial = pageInitial;
        this.tabs = [...this.tabs];
        await this.requestUpdate();

        if (this.menu && this.menu.tabs && this.menu.refresh) {
            this.menu.tabs.options[this.actualTab].text = tabActual.target;
            this.menu.tabs.options[this.actualTab].icon = tabActual.icon;
            this.menu.refresh();
        }
    }

    private async openTab() {
        if (this.menu && this.menu.tabs && this.menu.refresh) {
            this.menu.tabs.selected = this.actualTab;
            this.menu.refresh();
        };
        this.tabs = [...this.tabs];
        await this.requestUpdate();
    }

    private async addTab(actualPage: string, icon: string, moduleName: string, modulePath: string, project: number, target: string) {

        const defaultTab: ITab = {
            actualPage,
            icon,
            moduleName,
            modulePath,
            pageInitial: actualPage,
            project,
            target: target || moduleName
        }

        this.tabs.push({ ...defaultTab });
        if (this.menu && this.menu.tabs && this.menu.refresh) {
            this.menu.tabs.options.push({
                text: defaultTab.target,
                icon: defaultTab.icon,
            })
            this.menu.tabs.selected = this.tabs.length - 1;
            this.menu.refresh();
        };
        this.actualTab = this.tabs.length - 1;
        this.tabs = [...this.tabs];
        await this.requestUpdate();

    }

    private async load() {

        const tabActual = this.tabs[this.actualTab];
        if (!this.iframe) return;
        this.setEvents();

        const doc = this.iframe?.contentDocument;
        if (!doc) return;

        const head = doc.querySelector('head') || doc.createElement('head');
        if (!head.parentElement) doc.documentElement.appendChild(head);

        const base = doc.createElement('base');
        base.href = document.baseURI;
        head.appendChild(base);

        let body = doc.querySelector('body');
        if (!body) {
            body = doc.createElement('body');
            doc.documentElement.appendChild(body);
        }

        if (!doc.getElementById('app')) {
            const app = doc.createElement('div');
            app.id = 'app';
            body.appendChild(app);
        }

        const pre = doc.body.querySelector('pre');
        if (pre) pre.remove();
        const meta = this.iframe.contentDocument?.querySelector('meta[name="color-scheme"]');
        if (meta) meta.remove();
        
        this.addScript();
        this.addStyleApp();
        this.iframe.style.display = '';

        try {
            this.toogleLoading(true);
            await buildModule(tabActual.project, tabActual.moduleName);
            await this.injectGlobalStyle();
            await this.injectScriptRunTime();
            this.liveViewReady = true;
            if (!tabActual.actualPage && tabActual.pageInitial) {
                this.loadPage(tabActual.pageInitial);
            }
        } catch (err: any) {
            this.setError(err.message);

        } finally {
            this.toogleLoading(false);
        }

    }

    private toogleLoading(show: boolean) {
        const divApp = this.container;  // this.iframe?.contentDocument?.querySelector('#app');
        if (!divApp) return;
        if (show) divApp.classList.add('loading');
        else divApp.classList.remove('loading');
    }

    private async loadPage(pageName: string) {

        if (!this.iframe?.contentWindow) {
            console.warn('[LiveView] iframe ainda não disponível.');
            return;
        }

        const tabActual = this.tabs[this.actualTab];
        const folder = DISTFOLDER + '/' + tabActual.modulePath;
        const keyStorFileHTML = mls.stor.getKeyToFiles(tabActual.project, 2, pageName, folder, '.html');
        const keyStorFileJs = mls.stor.getKeyToFiles(tabActual.project, 2, pageName, folder, '.js');

        const storFileHTML = mls.stor.files[keyStorFileHTML];
        const storFileJs = mls.stor.files[keyStorFileJs];

        const versionHtml = storFileHTML?.versionRef || '0';
        const versionJs = storFileJs?.versionRef || '0';

        try {
            this.toogleLoading(true);
            const cacheJs = await mls.stor.cache.getFileFromCache(tabActual.project, folder, pageName, '.js', versionJs);
            const cacheHtml = await mls.stor.cache.getFileFromCache(tabActual.project, folder, pageName, '.html', versionHtml);
            if (!cacheHtml) {
                const contentHtml = await storFileHTML.getContent();
                if (contentHtml && typeof contentHtml === 'string') {
                    await mls.stor.cache.addIfNeed({
                        project: tabActual.project,
                        folder: folder,
                        content: contentHtml,
                        extension: '.html',
                        shortName: pageName,
                        version: versionHtml,
                        contentType: 'text/plain'
                    });
                }
            }

            if (!cacheJs) {
                const contentJs = await storFileJs.getContent();
                if (contentJs && typeof contentJs === 'string') {
                    await mls.stor.cache.addIfNeed({
                        project: tabActual.project,
                        folder: folder,
                        content: contentJs,
                        extension: '.js',
                        shortName: pageName,
                        version: versionJs,
                        contentType: 'application/javascript'
                    });
                }
            }

            const htmlUrl: string = `/local/_${tabActual.project}_wwwroot/${tabActual.modulePath}/${pageName}.html?v=${versionHtml}`;
            const jsUrl: string = `/local/_${tabActual.project}_wwwroot/${tabActual.modulePath}/${pageName}.js?v=${versionJs}`;

            this.clearOldPageScripts();
            await Promise.all([
                this.injectHTML(htmlUrl),
                this.injectJS(jsUrl)
            ]);
            if (this.iframe) {
                this.iframe.style.display = '';
            }
            this.toogleLoading(false);
            
        } catch (err: any) {
            this.setError(err.message);
            this.toogleLoading(false);
        } 
    }

    private APP_ID = 'app';

    private clearOldPageScripts() {
        if (!this.iframe || !this.iframe.contentDocument || !this.iframe.contentDocument.body) return;
        const oldScript = this.iframe.contentDocument.body.querySelector('#liveview-page-script');
        if (oldScript) oldScript.remove();
    }

    private async injectHTML(htmlUrl: string) {
        if (!this.iframe || !this.iframe.contentDocument) return;
        const html = await fetch(htmlUrl).then(res => res.text());
        const app = this.iframe.contentDocument.getElementById(this.APP_ID);
        if (app) app.innerHTML = html;
    }

    private async injectJS(jsUrl: string) {
        if (!this.iframe || !this.iframe.contentDocument) return;
        const script = this.iframe.contentDocument.createElement('script');
        script.type = 'module';
        script.src = jsUrl;
        script.id = 'liveview-page-script';
        this.iframe.contentDocument.body.appendChild(script);
    }

    private async injectScriptRunTime(forceRecompile: boolean = false) {
        if (!this.iframe || !this.iframe.contentDocument) return;
        const tabActual = this.tabs[this.actualTab];
        const doc = this.iframe.contentDocument;
        const body = doc.body;
        const url = `/local/_${tabActual.project}_wwwroot/collabRunTime`;

        let scriptRunTime = doc.getElementById('collab-runtime-script');
        if (forceRecompile && scriptRunTime) {
            scriptRunTime.remove();
            scriptRunTime = null
        }

        if (!scriptRunTime) {
            const script = doc.createElement('script');
            script.id = 'collab-runtime-script';
            script.src = `${url}`;
            script.type = 'module';
            script.defer = true;
            body.appendChild(script);
            await new Promise((resolve, reject) => {
                script.onload = () => resolve(true);
                script.onerror = (e) => reject(e);
            });
        }

    }

    private async injectGlobalStyle(forceRecompile: boolean = false) {
        if (!this.iframe || !this.iframe.contentDocument) return;
        const tabActual = this.tabs[this.actualTab];
        const shortName = 'globalStyle'
        const keyStorFile = mls.stor.getKeyToFiles(tabActual.project, 2, shortName, DISTFOLDER, '.css');
        const storFile = mls.stor.files[keyStorFile];
        const version = storFile?.versionRef || '0';

        const url = `/local/_${tabActual.project}_wwwroot/${shortName}.css?v=${version}`;
        const res = await fetch(url);
        const cssText = await res.text();
        let styleGlobalEl = this.iframe.contentDocument.getElementById('styleGlobal');
        if (forceRecompile && styleGlobalEl) {
            styleGlobalEl.remove();
            styleGlobalEl = null;
        }

        if (!styleGlobalEl) {
            const styleG = document.createElement('style');
            styleG.id = 'styleGlobal';
            styleG.textContent = cssText;
            this.iframe.contentDocument.head.appendChild(styleG);
        }
    }

    private functionReplaceAnchor(e: MouseEvent) {

        e.stopPropagation();
        e.preventDefault();

        let anchor = (e.target as HTMLAnchorElement);
        if (!anchor.getAttribute('href')) {
            anchor = (e.target as HTMLAnchorElement).closest('a') as HTMLAnchorElement;
        }
        const href = anchor.href;
        let pageName = href ? href.replace('https://collab.codes/', '') : '';
        this.loadPage(pageName);

    }

    private addStyleApp() {
        const style = document.createElement('style');
        style.id = 'iframe-style';
        style.textContent = `
        html, body {
            height: 100%;
        }`;
        this.iframe?.contentDocument?.head.appendChild(style);

    }

    private addScript() {
        if (!this.iframe || !this.iframe.contentDocument || !this.iframe.contentWindow) return;
        const s = document.createElement('script') as HTMLScriptElement;
        s.textContent = `
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (a) {
                functionReplaceAnchor(e);
            }
        });`;
        (this.iframe.contentWindow as any).functionReplaceAnchor = this.functionReplaceAnchor.bind(this);
        this.iframe.contentDocument?.body.appendChild(s);
    }


}


