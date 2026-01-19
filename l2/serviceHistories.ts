/// <mls shortName="serviceHistories" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_100554_/l2/serviceBase.js';

/// **collab_i18n_start**
const message_pt = {
    loading: 'Carregando...',
    noHistoriesSelected: 'Nenhum historico selecionado',
}

const message_en = {
    loading: 'Loading...',
    noHistoriesSelected: 'No histories selected',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-histories-100554')
export class ServiceHistories100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    private renderSideBySide = false;

    constructor() {
        super();
        mls.events.addEventListener([2, 5], ['HistoriesSelected' as any], (ev) => this.onSelectHistories(ev));
        mls.events.addEventListener([2], ['ToolBarSelected'], (ev) => { this.onToolbarSelected(ev); });
    }

    @property({ type: String })
    msize = '';

    createRenderRoot() {
        return this;
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        this._onServiceClick(visible, reinit, el)
    }

    public details: IService = {
        icon: '&#xf15c',
        state: 'background',
        tooltip: 'Histories',
        visible: false,
        position: "all",
        widget: '_100554_serviceHistories',
        level: [2, 5]
    }

    public onClickMain(op: string) {
        if (op === 'opHistories') this.showStart();
        else if (op === 'opSide') this.showSideBySide(true);
        else if (op === 'opOnlyOne') this.showSideBySide(false);
        else if (this.menu.setMode) this.menu.setMode('initial');

    }

    public menu: IServiceMenu = {
        title: 'Histories',
        main: {
            opHistories: 'Start',
            opSide: 'Side by Side',
            opOnlyOne: 'Inline Diff'
        },
        tabs: undefined,
        tools: {},
        mainDefault: 'opHistories',
        onClickMain: this.onClickMain.bind(this),
    }

    @query('mls-editor-100529')
    private c2: HTMLElement | undefined;

    public static modelCount: number;

    private _ed1: monaco.editor.IStandaloneDiffEditor | undefined;

    private fileInfo: mls.stor.IFileInfo | undefined;

    private hashOriginal: string = "";

    private hashModified: string = "";

    private histories: IHistoriesContent = {};

    get confE() { return `l${this.level}_${this.position}_histories`; }

    private showStart() {
        return true;
    }

    private onToolbarSelected(ev: mls.events.IEvent) {
        if (!ev || !ev.desc) return;
        const params: { level: number, position: string, from: string, to: string } = ev.desc ? JSON.parse(ev.desc) : {};
        const item = this.serviceItemNav;
        if (!item) return;
        if (!['_100529_service_Source'].includes(params.to) && this.visible === 'true' && this.position !== params.position) this.showNav2Item(false);
    }

    private async onSelectHistories(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const params: IEventParams = JSON.parse(ev.desc);
        if (params.position === this.position) return;

        if (!this.serviceItemNav) return;
        this.loading = true;
        this.showNav2Item(true);
        this.openMe();

        const editorType: { [key: string]: string } = {
            '.ts': 'typescript',
            '.test.ts': 'typescript',
            '.html': 'html',
            '.less': 'less',
        }

        if (params.action) {
            this.setInitialHistories('loading...', 'loading...', 'typescript');
        } else {

            const key = mls.stor.getKeyToFiles(params.project, params.level, params.shortName, params.folder, params.extension);
            const storFile = mls.stor.files[key];
            if (!storFile) {
                this.loading = false;
                return;
            }
            this.fileInfo = storFile;
            this.hashModified = params.hashModified;
            this.hashOriginal = params.hashOriginal;

            this.renderSideBySide = false;

            let src2: string = '';
            if (this.hashModified === 'local') {
                const info = this.fileInfo.getValueInfo ? await this.fileInfo.getValueInfo() : undefined;
                src2 = info && info.content ? info.content as string : (await this.fileInfo.getContent()) as string;
            } else {
                src2 = this.hashModified ? await this.getHistories(this.hashModified) : '';
            }

            const src1 = this.hashOriginal ? await this.getHistories(this.hashOriginal) : '';
            this.setInitialHistories(src1, src2, editorType[params.extension]);

        }

        this.updateEditor();
        this.setMsizeEditor();
        this.loading = false;

    }

    private showSideBySide(show: boolean) {
        this.renderSideBySide = show;
        this.updateEditor();
        return true;
    }

    private async getHistories(hash: string): Promise<string> {
        if (this.histories[hash]) return this.histories[hash];
        if (!this.fileInfo) return '';
        const content = await this.fileInfo.getHistoryContent(hash);
        if (content) this.histories[hash] = content;
        return this.histories[hash];
    }


    private setInitialHistories(srcOriginal: string, srcModified: string, language: string) {
        const modelOriginal = this.createOrGetModel(language, srcOriginal, 'original');
        const modelModified = this.createOrGetModel(language, srcModified, 'modified');
        if (!this._ed1) return;
        this._ed1.updateOptions({ readOnly: true });
        this._ed1.setModel({
            original: modelOriginal,
            modified: modelModified,
        });
    }

    private createOrGetModel(editorType: string, src: string, tp: string) {
        const uri = this.getUri(`${this.constructor.name}_${this.position}_${tp}`);
        let model1 = monaco.editor.getModel(uri);

        if (!model1) {
            model1 = monaco.editor.createModel(src, editorType, uri);
        }
        return model1;
    }

    private getUri(shortFN: string): monaco.Uri {
        ServiceHistories100554.modelCount = ServiceHistories100554.modelCount + 1 || 1;
        return monaco.Uri.parse(`file://server/${shortFN}_${ServiceHistories100554.modelCount}.ts`);
    }

    private createEditor(): void {
        if (!this.c2 || this._ed1) return;
        const opt = {
            automaticLayout: true,
            renderSideBySide: this.renderSideBySide
        };
        this._ed1 = monaco.editor.createDiffEditor(this.c2, opt);
        (this.c2 as any)['mlsEditor'] = this._ed1;
        this.setMsizeEditor();
    }

    private updateEditor() {
        if (!this._ed1) return;
        this._ed1.updateOptions({
            renderSideBySide: this.renderSideBySide
        });

        const originalEditor = this._ed1.getOriginalEditor();
        const modifiedEditor = this._ed1.getModifiedEditor();

        originalEditor.setPosition({ lineNumber: 1, column: 1 });
        modifiedEditor.setPosition({ lineNumber: 1, column: 1 });

        originalEditor.revealLine(1);
        modifiedEditor.revealLine(1);
    }

    private setMsizeEditor() {
        if (!this.visible) return;
        this.c2?.setAttribute('msize', this.msize);
    }

    private async _onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible) {
            this.createEditor();
            this.setInitialHistories(this.msg.loading, this.msg.loading, 'text');
            if (!this.fileInfo) this.setInitialHistories(this.msg.noHistoriesSelected, this.msg.noHistoriesSelected, 'text');
            setTimeout(() => {
                if (el && typeof el.layout === 'function') el.layout();
            }, 100)
        }
    }


    updated(changedProperties: any) {
        if (changedProperties.has('msize')) {
            if (!this.visible) return;
            this.setMsizeEditor();
        }
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <mls-editor-100529 ismls2="true"></mls-editor-100529>
        `
    }
}

interface IHistoriesContent {
    [key: string]: string
}

interface IEventParams {
    project: number,
    shortName: string,
    extension: string,
    level: number,
    position: 'left' | 'right',
    folder: string,
    hashOriginal: string,
    hashModified: string,
    renderSideBySide?: boolean,
    action?: string
}
