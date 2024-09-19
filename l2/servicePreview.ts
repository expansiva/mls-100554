/// <mls shortName="servicePreview" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initServicePreviewView } from './_100554_servicePreviewView';
import { initServicePreviewAddStyle } from './_100554_servicePreviewAddStyle';
import { IcaLitElement } from './_100554_icaLitElement';
import { IWCDParams } from '_100554_serviceIca'
import { getDSInstance, DesignSystemIO } from './_100554_libDesignSystem';
import { getConfigProject } from './_100554_libProjectConfig';

/// **collab_i18n_start**
const message_pt = {
    theme: 'Tema',
    variations: 'Variação',
    editStyle: 'Editar estilo',
    pause: 'Parar preview',
    dark: ' escuro',
    light: 'claro',
    help: 'Ajuda'
}

const message_en = {
    theme: 'Theme',
    variations: 'Variation',
    editStyle: 'Edit style',
    pause: 'Pause preview',
    dark: 'dark',
    light: 'light',
    help: 'Help'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-preview-100554')
export class ServicePreview100554 extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() itens: any = undefined;

    @property() msize: string = '';

    @property() error: string = '';

    @property() watch: boolean = true;

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

    private languages: { [key: number]: string } = {}

    private levels = [1, 2, 3, 4, 5, 6, 7];

    private timeEvent: number = -1;

    get confE() { return `l${this.level}_${this.position}`; }

    constructor() {
        super();
        window.preview = {
            editor: undefined,
            iframe: undefined
        };
        initServicePreviewView;
        initServicePreviewAddStyle;
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
        if (op === 'opResultHTML') return this.showEditorHTML();
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
        if (op === 'btEditStyle') return this.editStyles();
        if (op === 'btHelp') return this.onHelpClick();
        if (op === 'btVariations') return this.onBtVariationsClick(opMenu);
        if (op === 'btTheme') return this.onBtThemeClick();
        if (op === 'btTokens') return this.onBtTokensClick(opMenu);
        else throw new Error('Invalid option')
    }

    public menu: IMenu = {
        title: 'Preview',
        actions: {
            opResultHTML: 'Result HTML'
        },
        icons: {
            icPreviewD: 'Desktop;f390',
            icPreviewM: 'Mobile;f3cf'
        },
        buttons: {
            btTheme: `${this.msg.light};${this.msg.dark};f185;f186`,
            btTokens: this.msg.theme + ';f53f:menu:Default,',
            btVariations: this.msg.variations + ';f1ab:menu:0 - Default,1 - Portugues,2 - Espanhol,3 - Russo',
            btEditStyle: this.msg.editStyle + ';f0d0',
            btWatch: this.msg.pause + ';Update Preview;f04c;f04b',
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

        mls.events.addEventListener([3], ['DSStyleChanged', 'DSTokensChanged'] as any, async (ev) => {
            this.onDSStyleOrTokensChanged(ev);
        });

        mls.events.addEventListener([3], ['DSThemeChanged'] as any, async (ev) => {
            this.onDsThemeChanged(ev);
        });
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

    private onDSStyleOrTokensChanged(ev: mls.events.IEvent): void {
        const rc: any = JSON.parse(ev.desc as any);
        if (
            rc.emitter === 'right' ||
            rc.emitter === 'right-get' ||
            (rc.emitter === 'left' && rc.helper)) return;

        if (this.watch) this.onStyleChanged();
    }

    private onStyleChanged() {
        if (this.elPreview) {
            this.lastLevel = this.level;
            this.elPreview.setAttribute('stylechanged', 'true');
            this.elPreview.setAttribute('actualtheme', this.actualTheme);
        }
    }

    private async onDsThemeChanged(ev: mls.events.IEvent): Promise<void> {
        const rc: any = JSON.parse(ev.desc as any);
        if (rc.emitter !== 'left' || this.visible === 'false') return;
        this.actualTheme = rc.value || 'Default';
        if (this.watch) this.onStyleChanged();
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

            if (fileAction.action === 'open') {
                this.setModel(storFileHTML);
            }

            if (mls.istrace) console.info('is preview repaint:' + this.watch);
            if (fileAction.action === 'open' && this.watch) {

                this.loading = true;
                return;
            }
            if (this.watch) {

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
        }
    }

    // -------------- IMPLEMENTS-----------------

    private showEditorHTML() {
        if (this.menu.setMode) {
            this.menu.setMode('page', this.monacoeditor);
            this._ed1?.updateOptions({ readOnly: true });
            this._ed1?.layout();
            this.monacoeditor?.setAttribute('msize', this.msize);

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
        const variation = opMenu.substring(0, 1);
        if (htmlEl) htmlEl.lang = this.languages[+variation];
        this.lang = this.languages[+variation];
        window.globalVariation = !isNaN(+variation) ? +variation : 0;
        if (window.top) window.top.window.globalVariation = !isNaN(+variation) ? +variation : 0;
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
        this.watch = !this.watch;
        if (this.watch) {
            this.onReloader();
        }
        return this.watch;
    }

    private editStyles(): boolean {
        this.openService('_100554_serviceDsStyles', 'left', 3);
        return true;
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
        await mls.events.fire(2, ['CreateModelHTML'] as any, JSON.stringify(storFile), 500);
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
        if (!project) throw new Error('Invalid project');
        const config = await getConfigProject(project);
        if (!config || !config.languages || Object.keys(config.languages).length === 0) {
            this.languages = {
                0: 'en'
            }
        } else {
            Object.entries(config.languages).forEach((entry) => {
                const [key, value] = entry;
                this.languages[+key] = value.language;
            });
        }
        if (this.menu.buttons) this.menu.buttons.btVariations = this.msg.variations + `;f1ab:menu:${Object.keys(this.languages).map((item) => `${item} - ${this.languages[+item]}`).join(',')}`;
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
        
        const doc = document.createElement('service-preview-view-100554');
        doc.setAttribute('page', fullname);
        doc.setAttribute('level', this.level as any);
        doc.setAttribute('mode', mode);
        doc.setAttribute('actualtheme', this.actualTheme);
        doc.setAttribute('lang', this.lang);

        (doc as any).father = this;
        this.elPreview = doc;
        if (this.menu.setMode) this.menu.setMode('page', doc);
        this.lastLevel = this.level;
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
                (el as IcaLitElement).globalVariation = window.globalVariation;
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
