/// <mls shortName="servicePreview" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { IcaLitElement } from './_100554_icaLitElement';
import { IWCDParams } from '_100554_serviceIca'
import { getDSInstance, DesignSystemIO } from './_100554_libDesignSystem';
import { getConfigProject } from './_100554_libProjectConfig';
import { globalState } from './_100554_icaState';
import { convertTagToFileName } from './_100554_utilsLit';
import './_100554_collabConsole';
import './_100554_servicePreviewView';

/// **collab_i18n_start**
const message_pt = {
    theme: 'Tema',
    variations: 'Linguagem',
    editStyle: 'Editar estilo',
    pause: 'Parar preview',
    dark: ' escuro',
    light: 'claro',
    help: 'Ajuda',
    consoleA: 'Abrir console',
    consoleD: 'Fechar console',
}

const message_en = {
    theme: 'Theme',
    variations: 'Language',
    editStyle: 'Edit style',
    pause: 'Pause preview',
    dark: 'dark',
    light: 'light',
    help: 'Help',
    consoleA: 'Open console',
    consoleD: 'Close console',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-preview-100554')
export class ServicePreview100554 extends ServiceBase {

    @property() itens: any = undefined;
    @property() msize: string = '';
    @property() error: string = '';
    @property() watch: boolean = true;
    @property() enabledConsole: boolean = false;
    @property() light: boolean = true;
    @property() lang: string = 'en';

    private msg: MessageType = messages['en'];

    private lastMode: string = 'icPreviewD';

    private lastLevel: number = -1;

    private elPreview: HTMLElement | undefined = undefined;

    private themes: string[] = ['Default'];

    private actualTheme = 'Default';

    private ds: DesignSystemIO | undefined;

    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;

    private monacoeditor: HTMLElement | undefined;

    private languages: ILanguage = {}

    private levels = [1, 2, 3, 4, 5, 6, 7];

    private timeEvent: number = -1;

    get confE() { return `l${this.level}_${this.position}`; }

    constructor() {
        super();
        window.preview = {
            editor: undefined,
            iframe: undefined
        };
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf06e',
        state: 'foreground',
        position: 'right',
        tooltip: 'Preview',
        visible: true,
        widget: '_100554_servicePreview',
        level: [1, 2, 3, 4, 5, 6, 7]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opAboutWCD') return this.opAboutWCD();
        if (op === 'opResultHTML') return this.showEditorHTML();
        if (op === 'opResultJS') return this.showResultJS();

        return false;
    }

    public onClickIcon = (op: string): void => {
        this._ed1?.updateOptions({ readOnly: false });
        if (op === 'icPreviewD') this.preview('desktop');
        if (op === 'icPreviewM') this.preview('mobile');
        this.lastMode = op;
    }

    public onClickButton = (op: string, opMenu?: string): boolean => {

        if (op === 'btWatch') return this.toogleWatch();
        if (op === 'btConsole') return this.toogleConsole();
        if (op === 'btHelp') return this.onHelpClick();
        if (op === 'btTheme') return this.onBtThemeClick();

        if (['btVariations', 'btTokens'].includes(op)) {
            this.actButton(op, opMenu);
            return true;
        }
        else throw new Error('Invalid option')
    }

    public async actButton(op: string, opMenu?: string) {
        await this.fireWcdChanges();
        if (op === 'btVariations') return this.onBtVariationsClick(opMenu);
        if (op === 'btTokens') return this.onBtTokensClick(opMenu);
    }

    public menu: IMenu = {
        title: 'Preview',
        actions: {
            opAboutWCD: 'About this WCD',
            opResultHTML: 'Result HTML',
            opResultJS: 'Result Javascript',
        },
        icons: {
            icPreviewD: 'Desktop;f390',
            icPreviewM: 'Mobile;f3cf'
        },
        buttons: {
            btTheme: `${this.msg.light};${this.msg.dark};f185;f186`,
            btTokens: this.msg.theme + ';f53f:menu:Default,',
            btVariations: this.msg.variations + ';f1ab:menu-flags:Default,Portugues,Espanhol,Russo',
            btWatch: this.msg.pause + ';Update Preview;f04c;f04b',
            btConsole: `${this.msg.consoleA};${this.msg.consoleD};f120;f410`,
            btHelp: this.msg.help + ';f059',
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'icPreviewD',
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon,
        onClickButton: this.onClickButton

    }

    public onServiceClick(visible: boolean, reinit: boolean) {

        if (visible && !reinit && this.menu.setIconActive) {
            this.menu.setIconActive(this.lastMode);

        } else if (visible && reinit && this.elPreview && this.menu.setIconActive && this.lastLevel == this.level) {
            this.menu.setIconActive(this.lastMode);

        } if (this.elPreview) {

            this.lastLevel = this.level;
            this.elPreview.setAttribute('level', this.level.toString());
        } else {
            this.preview(this.lastMode);
        }
    }

    // -------------- EVENTS -------------------

    private setEvents() {

        mls.events.addEventListener([2, 3, 4, 5, 6, 7], ['ModelHTMLCreated'] as any, (ev: mls.events.IEvent) => {
            this.onModelHTMLCreated(ev);
        });

        mls.events.addListener(2, 'FileAction', this.onMLSFileAction.bind(this));
        mls.events.addListener(2, 'styleChanged' as any, this.onStyleChanged.bind(this));

    }

    private onReloader(): void {
        clearTimeout(this.timeEvent);
        this.timeEvent = setTimeout(async () => {
            this.onServiceClick(true, false);
            mls.events.fire((+(this.level as any)) as any, 'WCDEventChange' as any, `{"op":"Navigation"}`);
        }, 500);
    }

    private onModelHTMLCreated(ev: mls.events.IEvent): void {
        try {
            if (!ev.desc) return;
            if (ev.level !== this.level) return;
            const iPath: mls.cbe.IPath = JSON.parse(ev.desc);
            if (!iPath || !iPath.project || !iPath.shortName) return;
            const keyStorFile = mls.stor.getKeyToFiles(iPath.project, 2, iPath.shortName, '', '.html');
            const storFile = mls.stor.files[keyStorFile];
            if (!storFile) throw new Error('Invalid stor file for path:' + keyStorFile);
            this.setModel(storFile);
        } catch (err: any) {
            throw new Error(err);
        }
    }

    private onStyleChanged() {
        if (this.elPreview) {
            this.lastLevel = this.level;
            this.elPreview.setAttribute('stylechanged', 'true');
            this.elPreview.setAttribute('actualtheme', this.actualTheme);
        }
    }

    private async onMLSFileAction(ev: mls.events.IEvent): Promise<void> {

        try {

            if (this.visible === 'false' || !this.visible) return;
            if (ev.level !== 2 || (ev.type !== 'FileAction')) return;
            const fileAction = JSON.parse(ev.desc as any) as mls.events.IFileAction;
            const eventsValid = ['open', 'statusOrErrorChanged', 'changed', 'new', 'modeCreated'];

            if (
                fileAction.position === this.position ||
                !eventsValid.includes(fileAction.action)
            ) return;

            const keyToFileInfo = mls.stor.getKeyToFiles(fileAction.project, 2, fileAction.shortName, fileAction.folder, '.html');
            const storFileHTML = mls.stor.files[keyToFileInfo];

            if (fileAction.action === 'open') this.setModel(storFileHTML);

            if (mls.istrace) console.info('is preview repaint:' + this.watch);
            if (fileAction.action === 'open' && this.watch) {
                this.loading = true;
                //this.onReloader();
                return;
            }

            if (this.watch) {
                this.elPreview = undefined;
                this.loading = false;
                this.onReloader();
            }

        } catch (e) {
            console.info(e);
        }

    }


    // -------------- COMPONENT ---------------

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html``;
    }

    async firstUpdated() {
        this.createEditor();
        const darkOrLight = this.getDarkLight();
        if (darkOrLight === 'dark' && this.menu.selectButton) this.menu.selectButton('btTheme');
        this.setLanguages();
        this.setTheme();

    }

    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
        const hasMsize = changedProperties.has('msize');
        if (hasMsize) {
            const msize = changedProperties.get('msize');
            if (!msize || typeof msize !== 'string' || !this.monacoeditor) return;
            this.monacoeditor.setAttribute('msize', msize);
            if (this.pluginResultJS) this.pluginResultJS.setAttribute('msize', msize);
        }
    }

    // -------------- IMPLEMENTS-----------------

    private opAboutWCD() {

        if (!this.menu.setMode) return false
        const el = document.createElement("div") as HTMLElement;
        el.style.padding = '1rem';

        if (!window['preview'] || !window['preview'].iframe || !window['preview'].iframe.contentWindow || !(window['preview'].iframe.contentWindow as any).wcdState) {
            el.innerHTML = `<h3>Not found any information about this page</h3>`;
            this.menu.setMode('page', el);
            return true;
        };

        const info = (window['preview'].iframe.contentWindow as any).wcdState;
        const elOverlay = window['preview'].iframe.contentDocument?.body.querySelector('*[modeoverlay]');

        let txt = '<h3>About this page</h3><ul>';

        if (elOverlay && elOverlay.getAttribute('modeoverlay')) {
            const n = elOverlay.getAttribute('modeoverlay') as string;
            txt += `<li><b>Overlay:</b> ${convertTagToFileName(n)}</li>`;
        }

        if (info.elICA) {
            txt += `<li><b>Select:</b> ${convertTagToFileName(info.elICA.tagName.toLowerCase())}</li>`;
        }

        if (info.elMain) {
            txt += `<li><b>Element render:</b> ${convertTagToFileName(info.elMain.tagName.toLowerCase())}</li>`;
        }

        if (info.myParent) {
            txt += `<li><b>Main wcd:</b> ${convertTagToFileName(info.myParent.tagName.toLowerCase())}</li>`;
        }

        if (info.wcdItens && info.wcdItens.length > 0) {
            txt += `<li><b>Wcd itens:</b>`;
            info.wcdItens.forEach((it: any) => {
                txt += `<br/>${convertTagToFileName(it.tagName.toLowerCase())}`;
            })
            txt += `</li>`;
        }

        txt += `</ul>`;

        el.innerHTML = txt;

        this.menu.setMode('page', el);
        return true;

    }

    private showEditorHTML() {
        if (this.menu.setMode) {
            this.menu.setMode('page', this.monacoeditor);
            this._ed1?.updateOptions({ readOnly: true });
            this._ed1?.layout();
            this.monacoeditor?.setAttribute('msize', this.msize);

        }
        return true;
    }

    private pluginResultJS: HTMLElement | undefined;
    private showResultJS() {
        import('./_100554_pluginPreviewResultJs');
        if (this.menu.setMode) {
            this.pluginResultJS = document.createElement('plugin-preview-result-js-100554');
            this.pluginResultJS.setAttribute('msize', this.msize);
            this.menu.setMode('page', this.pluginResultJS);
            this.menu.title = 'Result Javascript';
            if (this.menu.updateTitle) this.menu.updateTitle();
        }
        return true;
    }


    private getIframePreviewHTML(): HTMLHtmlElement | undefined {
        if (!window.preview.iframe) throw new Error('Preview no created yet');
        const htmlEl = window.preview.iframe
            ?.contentDocument
            ?.querySelector('html') as HTMLHtmlElement;
        return htmlEl;
    }

    private onBtVariationsClick(opMenu: string | undefined) {

        if (!opMenu) return true;
        const htmlEl: HTMLHtmlElement | undefined = this.getIframePreviewHTML();
        if (htmlEl) htmlEl.lang = this.languages[opMenu].acronym;
        this.lang = this.languages[opMenu].acronym;
        const variation = Object.keys(this.languages).indexOf(opMenu);

        globalState.globalVariation = !isNaN(variation) ? variation : 0;
        if (window.top) (window.top.window as any).globalVariation = !isNaN(variation) ? variation : 0;

        if (this.level === 7) this.requestUpdateAllIcaComponentsInPage();
        else this.onReloader();
        return true;
    }

    private onBtThemeClick() {
        this.light = !this.light;
        const htmlEl: HTMLHtmlElement | undefined = this.getIframePreviewHTML();
        if (htmlEl) {
            if (this.light) htmlEl.removeAttribute('data-theme');
            else htmlEl.setAttribute('data-theme', 'dark');
        }
        this.onStyleChanged();
        return this.light;
    }

    private onBtTokensClick(opMenu: string | undefined) {
        if (!opMenu) return true;
        this.actualTheme = opMenu;
        this.onStyleChanged();
        return true;
    }

    private toogleWatch(): boolean {
        this.elPreview = undefined;
        this.watch = !this.watch;
        if (this.watch) {
            this.onReloader();
        }
        return this.watch;
    }

    private toogleConsole(): boolean {
        this.enabledConsole = !this.enabledConsole;
        const collabConsole = this.parentElement?.querySelector('collab-console-100554') as HTMLElement;
        if (!collabConsole) return this.enabledConsole;
        collabConsole.style.display = this.enabledConsole ? 'block' : 'none';
        return !this.enabledConsole;
    }

    private onHelpClick(): boolean {
        this.openService('_100554_serviceIca', 'left', 4);
        const params: IWCDParams = {
            level: 4,
            op: 'AboutICA',
            position: 'left',
            wdcPath: '',
        }
        mls.events.fire([4], ['WCDEvent'] as any, JSON.stringify(params), 300);
        return true;
    }


    private createEditor() {
        if (!this.monacoeditor) {
            this.monacoeditor = document.createElement('mls-editor-100529');
            this.monacoeditor.setAttribute('ismls2', 'true');
            const [width, height] = this.msize.split(',');
            this.monacoeditor.style.width = width + 'px';
            this.monacoeditor.style.height = height + 'px';
        }
        if (this._ed1) return;

        this._ed1 = monaco.editor.create(this.monacoeditor, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            noImplicitAny: true
        });
        (this.monacoeditor as any)['mlsEditor'] = this._ed1;
        window.preview.editor = this._ed1;
    }

    private async createModelIfNeeded(storFile: mls.stor.IFileInfo): Promise<monaco.editor.ITextModel | null> {
        if (!storFile) throw new Error('Invalid storFile');
        const uri = this.getUri(`_${storFile.project}_${storFile.shortName}`, '.html');
        let model = monaco.editor.getModel(uri);
        if (model) return model;
        if (this.level !== 2) mls.events.fire(2, ['CreateModelHTML'] as any, JSON.stringify(storFile));
        return model;
    }

    private async setModel(storFile: mls.stor.IFileInfo) {
        const model = await this.createModelIfNeeded(storFile);
        if (!this._ed1 || !model) return;
        this._ed1.setModel(model);
    }

    private getUri(shortFN: string, ftype: '.ts' | '.d.ts' | '.html'): monaco.Uri {
        return monaco.Uri.parse(`file://server/${shortFN}${ftype}`);
    }

    private getDarkLight() {
        const theme = localStorage.getItem('_100554_serviceUserSettings_theme') || 'light';
        return theme;
    }

    private async setLanguages() {
        const { project } = mls.actual[5];
        if (!project) {
            this.languages = {
                'English_en': { acronym: 'en', name: 'English' }
            }
        } else {
            const config = await getConfigProject(project);

            if (!config || !config.languages || config.languages.length === 0) {
                this.languages = {
                    'English_en': { acronym: 'en', name: 'English' }
                }
            } else {
                config.languages.forEach((entry, index) => {
                    this.languages[`${entry.name}_${entry.language}`] = {
                        acronym: entry.language,
                        name: entry.name,
                    }
                });
            }
        }


        if (this.menu.buttons) this.menu.buttons.btVariations = this.msg.variations + `;f1ab:menu-flags:${Object.keys(this.languages).join(',')}`;
        if (this.menu.refresh) this.menu.refresh();
    }

    private async setTheme() {
        const dsIndex = mls.actual[3].mode && +this.level !== 2 ? mls.actual[3].mode : 0;
        this.ds = await getDSInstance(mls.actual[5].project as any, dsIndex);
        await this.ds.init();
        if (!this.ds || !this.ds.tokens) return;
        this.themes = Object.keys(this.ds.tokens.list);
        if (this.menu.buttons) this.menu.buttons.btTokens = this.msg.theme + `;f53f:menu:${this.themes.join(',')}`;
        if (this.menu.refresh) this.menu.refresh();
    }

    private async preview(mode: string) {

        if (!(mls.actual[2] as any).left) return true;
        const fullname = `_${(mls.actual[2] as any).left.project}_${(mls.actual[2] as any).left.shortName}`;
        this.menu.title = 'Preview: ' + fullname;
        if (this.menu.updateTitle) this.menu.updateTitle();
        await this.fireWcdChanges();
        this.lastMode = mode;
        this.lastLevel = this.level;

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = this.style.height;

        const doc = document.createElement('service-preview-view-100554');
        doc.setAttribute('page', fullname);
        doc.setAttribute('level', this.level as any);
        doc.setAttribute('mode', mode);
        doc.setAttribute('actualtheme', this.actualTheme);
        doc.setAttribute('lang', this.lang);
        doc.style.flex = '1';
        (doc as any).father = this;
        this.elPreview = doc;
        container.appendChild(doc);

        const consoleEl = document.createElement('collab-console-100554');
        consoleEl.style.display = this.enabledConsole ? 'block' : 'none';
        container.appendChild(consoleEl);
        
        if (this.menu.setMode) this.menu.setMode('page', container);
        return true;
    }

    private async fireWcdChanges() {

        const iframe = window.preview.iframe;
        if (!iframe) return;

        const wcd = iframe.contentDocument?.body.querySelector('wcd-toolbox-100554') as any;

        if (!wcd) return;

        await wcd.beforeDelete();

        return;
    }

    private requestUpdateAllIcaComponentsInPage() {
        if (!window.preview.iframe) throw new Error('Preview no created yet');
        const body = window.preview.iframe
            ?.contentDocument
            ?.querySelector('body');

        if (!body) return;
        const elements = this.findAllElementsIca(body)
        if (!elements) return;

        elements.forEach((el) => {
            if (el.tagName.split('-').length > 1 && (el as IcaLitElement).globalVariation !== undefined) {
                (el as IcaLitElement).globalVariation = globalState.globalVariation;
            }
        });
    }

    private findAllElementsIca(el: HTMLElement): HTMLElement[] {
        let elements: HTMLElement[] = [];
        let elToSearch: Element | ShadowRoot = el;

        function traverseShadowRoot(element: HTMLElement) {

            if (element.tagName.toLowerCase().startsWith('ica')) {
                elements.push(element);
                return;
            }
            if (element.shadowRoot) {
                element.shadowRoot.querySelectorAll('*').forEach((item) => {
                    traverseShadowRoot(item as HTMLElement);
                });
            } else {
                const children = Array.from(element.children);
                if (children.length > 0) {
                    children.forEach(child => traverseShadowRoot(child as HTMLElement));
                }
            }
        }

        if (el.shadowRoot) elToSearch = el.shadowRoot;
        elToSearch.querySelectorAll('*').forEach((item) => {
            traverseShadowRoot(item as HTMLElement);
        });

        return elements;
    }

}

interface ILanguage {
    [key: string]: { acronym: string, name: string }
}
