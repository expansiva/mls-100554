/// <mls shortName="serviceDsAssetsEditor" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { IAssetsEventSelectedParams, IAssetsEventChangedParams } from './_100554_serviceDsAssets'

@customElement('service-ds-assets-editor-100554')
export class ServiceDsAssetsEditor100554 extends ServiceBase {

    constructor() {
        super();
        this.setEvents();
    }

    static modelCount: number;

    public details: IService = {
        icon: '&#xf121',
        state: 'foreground',
        tooltip: 'Assets Editor',
        visible: false,
        position: "right",
        tags: ['ds_assets'],
        widget: '_100554_serviceDsAssetsEditor',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opEditor') return this.showEditor();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Assets Editor',
        actions: {
            opEditor: 'Editor',
        },
        icons: {},
        actionDefault: 'opEditor', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        this._onServiceClick(visible, reinit, el)
    }

    async _onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible) {
            this.createEditor();
            this.showEditor2();
            setTimeout(() => {
                if (el && typeof el.layout === 'function') el.layout();
            }, 100)
        }
    }

    private setEvents() {
        mls.events.addEventListener([this.level], ['DSAssetsUnSelected'], (ev) => {
            this.onDsAssetsUnSelected(ev);
        });

        mls.events.addEventListener([this.level], ['DSAssetsChanged'], (ev) => {
            this.onDsAssetsChanged(ev);
        });

    }

    createRenderRoot() {
        return this;
    }

    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;

    private model: monaco.editor.ITextModel | undefined;

    private data: IAssetsEventChangedParams | undefined;

    @property({ type: String })
    msize = '';

    @query('mls-editor-100529')
    private c2: HTMLElement | undefined;

    private editorTypeByExtensions: any = {
        '.json': 'json',
        '.txt': 'plaintext',
        '.ts': 'typescript',
        '.js': 'javascript',
        '.css': 'css',
        '.less': 'less',
        '.html': 'html',
        '.java': 'java',
        '.scss': 'scss',
        '.xml': 'xml',
    }

    private onDsAssetsUnSelected(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const params: IAssetsEventSelectedParams = JSON.parse(ev.desc)
        if (params.service.includes('_100554_serviceDsAssetsEditor')) return;
        this.showNav2Item(false);
    }

    private onDsAssetsChanged(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const params: IAssetsEventChangedParams = JSON.parse(ev.desc);

        if (params.position === 'right') return;
        if (params.info.helper.includes('_100554_serviceDsAssetsEditor')) {
            this.data = params;
            this.showNav2Item(true);
            this.openMe();
        } else this.showNav2Item(false);
    }

    private createEditor(): void {

        if (!this.c2) return;
        if (this._ed1) {
            this.setInitialModels('Loading...', 'textplain');
            this.setMsizeEditor();
            return;
        }

        this._ed1 = monaco.editor.create(this.c2, mls.editor.conf['l3_assets_visualization_editor'] as monaco.editor.IEditorOptions);
        (this.c2 as any)['mlsEditor'] = this._ed1;
        this.setMsizeEditor();
    }

    private getUri(shortFN: string): monaco.Uri {
        ServiceDsAssetsEditor100554.modelCount = ServiceDsAssetsEditor100554.modelCount + 1 || 1;
        return monaco.Uri.parse(`file://server/${shortFN}_${ServiceDsAssetsEditor100554.modelCount}.ts`);
    }

    private setInitialModels(src: string, mode: string) {
        const uri = this.getUri('l3_assets_visualization_editor');
        this.model = monaco.editor.getModel(uri) as monaco.editor.ITextModel;
        let val = src;
        if (mode === 'json') val = JSON.stringify(JSON.parse(src), null, 2);
        if (this.model) this.model.setValue(src);
        else this.model = monaco.editor.createModel(val, mode, uri);
    }

    private setMsizeEditor() {
        if (!this.visible) return;
        this.c2?.setAttribute('msize', this.msize);
    }

    private showEditor(): boolean {
        this.menu.title = 'Editor';
        this.showEditor2();
        return true;
    }

    private async showEditor2() {
        const obj = await this.getValue();
        if (!obj || !this._ed1) return;
        this.setInitialModels(obj.value, obj.mode);
        this._ed1.setModel(this.model as monaco.editor.ITextModel);
        return true;
    }

    private async getValue(): Promise<IGetValueRet | undefined> {
        if (!this.data) return;
        if (!this.data.info.filesSelectedArr) return undefined;

        const [fileSelected] = this.data.info.filesSelectedArr;
        if (!fileSelected) return undefined;

        const { folder, extension, level, project, shortName } = fileSelected;
        const keyFile = mls.stor.getKeyToFiles(project, level, shortName, folder, extension);
        const value = await mls.stor.files[keyFile]?.getContent();
        const mode = this.editorTypeByExtensions[extension] ? this.editorTypeByExtensions[extension] : 'plaintext';

        return new Promise((resolve, reject) => {
            if (typeof value === 'string') {
                resolve({ value, mode });
                return;
            }
            const file = value as File;
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                resolve({ value: reader.result as string, mode });
            });
            reader.readAsBinaryString(file);
        });
    }


    updated(changedProperties: any) {
        if (changedProperties.has('msize')) {
            if (!this.visible) return;
            this.setMsizeEditor();
        }
    }

    render() {
        return html`<mls-editor-100529 ismls2="true"></mls-editor-100529>`;
    }
}

interface IGetValueRet {
    mode: string,
    value: string
}