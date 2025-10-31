/// <mls shortName="serviceLiveView" project="100554" enhancement="_100554_enhancementLitService" />

import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';
import { collab_eye, collab_plus } from './_100554_collabIcons';
import { DISTFOLDER, buildModule } from './_100554_libLiveView';

interface ITab {
    moduleName: string,
    modulePath: string,
    project: number,
    pageInitial: string,
    actualPage: string,
    icon: string
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

    private tabs: ITab[] = [];

    private iframe?: HTMLIFrameElement;
    private liveViewReady = false;

    public details: IService = {
        icon: '&#xf15b',
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
    }
    public onClickTools(op: string) {

        if (op === 'add') this.addTab();
        else throw new Error('Invalid option')
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tools: {
            add: {
                type: 'cycle',
                onlyMenu: false,
                selected: 0,
                options: [
                    { text: this.msg.newTab, icon: collab_plus.strings[0] },
                ]
            }
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
        onClickTools: this.onClickTools.bind(this),

    };

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    async firstUpdated() {
        const actual7 = mls.actual[7];
        if (!actual7 || !actual7.project) return;
        const fullName = mls.actual[7].getFullName();
        const info = mls.l2.getPath(fullName)
        const keyToImportProject = `./_${actual7.project}_project`;
        const moduleProject = await import(`./${keyToImportProject}`);
        if (!moduleProject) return;
        const moduleConfig = moduleProject.modules.find((item: any) => item.path === info.folder);

        this.tabs = [{
            actualPage: '',
            moduleName: moduleConfig.name,
            modulePath: moduleConfig.path,
            pageInitial: info.shortName,
            project: actual7.project,
            icon: moduleConfig.icon
        }];

        this.tabs = [...this.tabs];
        await this.requestUpdate();

        if (this.menu && this.menu.tabs && this.menu.refresh) {
            this.menu.tabs.options[0].text = this.tabs[0].moduleName;
            this.menu.tabs.options[0].icon = this.tabs[0].icon;
            this.menu.refresh();
        }

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

    private async addTab() {

        const defaultTab = this.tabs[0];
        this.tabs.push({ ...defaultTab });
        if (this.menu && this.menu.tabs && this.menu.refresh) {
            this.menu.tabs.options.push({
                text: defaultTab.moduleName,
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
        await buildModule(tabActual.project, tabActual.moduleName);

        this.iframe = this.querySelector(`iframe[tab-index="${this.actualTab}"]`) as HTMLIFrameElement;
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

        this.injectGlobalStyle();
        this.injectScriptRunTime();

        const meta = this.iframe.contentDocument?.querySelector('meta[name="color-scheme"]');
        if (meta) meta.remove();
        this.addScript();
        this.liveViewReady = true;


        if (!tabActual.actualPage && tabActual.pageInitial) {
            this.loadPage(tabActual.pageInitial);
        }

    }

    private setEvents(): void {

        this.iframe?.contentWindow?.addEventListener('message', async (event) => {

            const { type, htmlUrl, jsUrl } = event.data;
            if (type !== 'loadPage' || !htmlUrl || !jsUrl) return;
            try {
                this.clearOldPageScripts();
                await Promise.all([
                    this.injectHTML(htmlUrl),
                    this.injectJS(jsUrl)
                ]);
                if (this.iframe) this.iframe.style.display = '';
            } catch (err) {
                console.error('Erro ao carregar página no LiveView:', err);
            }
        });

    }

    public async loadPage(pageName: string) {
        console.info(pageName)
        if (!this.iframe?.contentWindow) {
            console.warn('[LiveView] iframe ainda não disponível.');
            return;
        }
        const tabActual = this.tabs[this.actualTab];
        const folder = DISTFOLDER + '_' + tabActual.modulePath;
        const keyStorFileHTML = mls.stor.getKeyToFiles(tabActual.project, 2, pageName, folder, '.html');
        const keyStorFileJs = mls.stor.getKeyToFiles(tabActual.project, 2, pageName, folder, '.js');

        const storFileHTML = mls.stor.files[keyStorFileHTML];
        const storFileJs = mls.stor.files[keyStorFileJs];

        const folderCache = DISTFOLDER + '/' + tabActual.modulePath;
        const versionHtml = storFileHTML?.versionRef || '0';
        const versionJs = storFileJs?.versionRef || '0';
        const cacheJs = await mls.stor.cache.getFileFromCache(tabActual.project, folderCache, pageName, '.js', versionJs);
        const cacheHtml = await mls.stor.cache.getFileFromCache(tabActual.project, folderCache, pageName, '.html', versionHtml);

        if (!cacheHtml) {
            const contentHtml = await storFileHTML.getContent();
            if (contentHtml && typeof contentHtml === 'string') {
                await mls.stor.cache.addIfNeed({
                    project: tabActual.project,
                    folder:folderCache,
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
                    folder:folderCache,
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

        this.iframe.contentWindow.postMessage({
            type: 'loadPage',
            htmlUrl,
            jsUrl,
        }, '*');

    }

    private APP_ID = 'app';

    private clearOldPageScripts() {
        const oldScript = document.getElementById('liveview-page-script');
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

    private async injectScriptRunTime() {
        if (!this.iframe || !this.iframe.contentDocument) return;
        const tabActual = this.tabs[this.actualTab];
        const doc = this.iframe.contentDocument;
        const body = doc.body;
        const url = `/local/_${tabActual.project}_wwwroot/collabRunTime`;

        if (!doc.getElementById('collab-runtime-script')) {
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

            console.log('✅ Script runtime injetado com sucesso');
        } else {
            console.log('⚠️ Script runtime já injetado');
        }

    }

    private async injectGlobalStyle() {
        if (!this.iframe || !this.iframe.contentDocument) return;
        const tabActual = this.tabs[this.actualTab];
        const shortName = 'globalStyle'
        const keyStorFile = mls.stor.getKeyToFiles(tabActual.project, 2, shortName, DISTFOLDER, '.css');
        const storFile = mls.stor.files[keyStorFile];
        const version = storFile?.versionRef || '0';

        const url = `/local/_${tabActual.project}_wwwroot/${shortName}.css?v=${version}`;
        const res = await fetch(url);
        const cssText = await res.text();
        if (!this.iframe.contentDocument.getElementById('styleGlobal')) {
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
        this.loadPage(pageName)

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


