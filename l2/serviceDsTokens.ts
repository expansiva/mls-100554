/// <mls shortName="serviceDsTokens" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { getDSInstance, list as listDs, DesignSystemIO, IToken, TokensCategories } from './_100554_libDesignSystem';

/// **collab_i18n_start**
const message_pt = {
}

const message_en = {
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-ds-tokens-100554')
export class ServiceDsTokens100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    constructor() {
        super();
    }

    @property({ type: String }) msize = '';
    @property({ type: String }) actualTheme = 'Default';


    createRenderRoot() {
        return this;
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf0ae',
        state: 'foreground',
        tooltip: 'Tokens',
        visible: true,
        position: "left",
        tags: ['ds_tokens'],
        widget: '_100554_serviceDsTokens',
        level: [3]
    }

    public onClickIcon = (op: string): void => {
        if (op === 'icTypography') this.showTypography();
        if (op === 'icGlobal') this.showGlobal();
        if (op === 'icColor') this.showColors();
    }

    public menu: IMenu = {
        title: 'Tokens',
        actions: {

        },
        icons: {
            icColor: 'Colors;f53f',
            icTypography: 'Typography;f031',
            icGlobal: 'Global;f065'
        },
        actionDefault: '',
        iconDefault: 'icColor',
        setMode: undefined,
        onClickLink: undefined,
        onClickIcon: this.onClickIcon,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        this._onServiceClick(visible, reinit, el)
    }

    async _onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible) {
            const params: IEventsSelectedObj = { isComponent: false, service: [] };
            mls.events.fire([3], ['DSTokenSelected'], JSON.stringify(params), 1000);
            if (el && typeof el.layout === 'function') el.layout();
        } else {
            const params: IEventsSelectedObj = { isComponent: false, service: [] };
            mls.events.fire([3], ['DSTokenUnSelected'], JSON.stringify(params), 0);
        }

    }
    firstUpdated(changedProperties: any) {
        super.firstUpdated(changedProperties);
        this.createEditor();
    }

    public getActualRef() {
        return `_100554_serviceDsTokens_${this.actualTypeTokens}`
    }

    public async setEditorSource(tokens: string, tokensType: string) {

        if (!this.models[tokensType]) return;
        const model: monaco.editor.ITextModel = this.models[tokensType];
        const fullRange = model.getFullModelRange();
        const lines = tokens.trim().split('\n');
        const operations = [{
            range: fullRange,
            text: '',
            forceMoveMarkers: true
        }, {
            range: { startLineNumber: 1, startColumn: 1 },
            text: lines.join('\n'),
            forceMoveMarkers: true
        }];

        model.pushEditOperations([], operations as any, () => []);

        return;

    }

    public getEditorSource() {
        const model = this._ed1?.getModel();
        const val = model?.getValue() || '';
        return val;
    }

    public static modelCount: number;

    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;

    private timeoutChangesEditorColor: number = 0;

    private timeoutChangesEditorTypography: number = 0;

    private timeoutChangesEditorGlobal: number = 0;

    @query('mls-editor-100529')
    private c2: HTMLElement | undefined;

    private models: IModels = {
        resume: {} as monaco.editor.ITextModel,
        color: {} as monaco.editor.ITextModel,
        custom: {} as monaco.editor.ITextModel,
        typography: {} as monaco.editor.ITextModel,
    }

    private lastLine: ILines = {
        resume: undefined,
        color: undefined,
        custom: undefined,
        typography: undefined,
    }


    private dsInstance: DesignSystemIO | undefined;

    private async setTokens(theme: string) {
        const { tokensColors, tokensGlobal, tokensTypo } = await this.getTokens(theme);
        this.setInitialModels(tokensColors, 'color');
        this.setInitialModels(tokensGlobal, 'global');
        this.setInitialModels(tokensTypo, 'typography');
    }

    private tokensColors: IToken = {};
    private tokensTypo: IToken = {};
    private tokensGlobal: IToken = {};

    private actualTypeTokens: string = 'color';

    private async getTokens(theme: string) {

        const { project } = mls.actual[5];
        const { mode } = mls.actual[3];
        if (project === undefined || mode === undefined) throw new Error('No project or design system selected');

        const dss = await listDs(project);
        const dsInfo = dss[mode];
        if (!dsInfo) return { tokensColors: '', tokensTypo: '', tokensGlobal: '', resumeTokens: '' };

        this.dsInstance = await getDSInstance(project, mode);
        await this.dsInstance.init();
        if (!this.dsInstance.tokens) throw new Error('No tokens finded');

        const list = this.dsInstance.tokens.list;
        const tokens = list[theme];
        this.tokensColors = tokens.color;
        this.tokensTypo = tokens.typography;
        this.tokensGlobal = tokens.global;

        const strColors = Object.entries(this.tokensColors).map((entry) => {
            const [key, value] = entry;
            return `@${key}: ${value};`
        }).join('\n');

        const strTypo = Object.entries(this.tokensTypo).map((entry) => {
            const [key, value] = entry;
            return `@${key}: ${value};`
        }).join('\n');

        const strGlobal = Object.entries(this.tokensGlobal).map((entry) => {
            const [key, value] = entry;
            return `@${key}: ${value};`
        }).join('\n');

        return {
            tokensColors: strColors,
            tokensTypo: strTypo,
            tokensGlobal: strGlobal,
        };

    }

    private createEditor(): void {
        if (this.c2) this._ed1 = monaco.editor.create(this.c2, mls.editor.conf['tokens'] as monaco.editor.IEditorOptions);
        (this.c2 as any)['mlsEditor'] = this._ed1;
        if (this.serviceContent) {
            this.serviceContent.layout();
            this.setMsizeEditor();
        }
    }

    private getUri(shortFN: string): monaco.Uri {
        ServiceDsTokens100554.modelCount = ServiceDsTokens100554.modelCount + 1 || 1;
        return monaco.Uri.parse(`file://server/${shortFN}_${ServiceDsTokens100554.modelCount}.ts`);
    }

    private setInitialModels(src: string, model: string) {
        const uri = this.getUri('l3_tokens');
        this.models[model] = monaco.editor.getModel(uri) as monaco.editor.ITextModel;
        if (this.models[model]) this.models[model].setValue(src);
        else this.models[model] = monaco.editor.createModel(src, 'less', uri);
    }


    private showGlobal() {
        this.actualTypeTokens = 'global';
        if (!this._ed1) return;
        this._ed1.setModel(this.models['global']);
        this._ed1.updateOptions({ readOnly: false });
        this._ed1.getModel()?.onDidChangeContent((event) => {
            this.timeoutChangesEditorGlobal = setTimeout(() => {
                if (this.timeoutChangesEditorGlobal) clearTimeout(this.timeoutChangesEditorGlobal);
                this.onEditorGlobalChange(event.changes);
            }, 1000);
        });

    }

    private showTypography() {
        this.actualTypeTokens = 'typography'
        if (!this._ed1) return;
        this._ed1.setModel(this.models['typography']);
        this._ed1.updateOptions({ readOnly: false });
        this._ed1.getModel()?.onDidChangeContent((event) => {
            this.timeoutChangesEditorTypography = setTimeout(() => {
                if (this.timeoutChangesEditorTypography) clearTimeout(this.timeoutChangesEditorTypography);
                this.onEditorTypoChange(event.changes);
            }, 1000);
        });

    }

    private async showColors() {
        this.actualTypeTokens = 'color';
        if (Object.keys(this.tokensColors).length === 0) {
            await this.setTokens(this.actualTheme);
        }
        if (!this._ed1) return;
        this._ed1.setModel(this.models['color']);
        this._ed1.updateOptions({ readOnly: false });
        this._ed1.getModel()?.onDidChangeContent((event) => {
            this.timeoutChangesEditorColor = setTimeout(() => {
                if (this.timeoutChangesEditorColor) clearTimeout(this.timeoutChangesEditorColor);
                this.onEditorColorChange(event.changes);
            }, 500);
        });

    }

    private onEditorColorChange(changes: monaco.editor.IModelContentChange[]) {
        const [change] = changes;
        if (!change) return;
        if (!this._ed1) return;
        const model = this._ed1.getModel();
        if (!model) return;
        const tokens = this.getEditorsTokens();
        if (!this.dsInstance || !this.dsInstance.tokens) return;
        this.dsInstance.tokens.setTokens(this.actualTheme, tokens.color, tokens.typography, tokens.global);

    }

    private onEditorTypoChange(changes: monaco.editor.IModelContentChange[]) {
        const [change] = changes;
        if (!change) return;
        const tokens = this.getEditorsTokens();
        if (!this.dsInstance || !this.dsInstance.tokens) return;
        this.dsInstance.tokens.setTokens(this.actualTheme, tokens.color, tokens.typography, tokens.global);
    }

    private onEditorGlobalChange(changes: monaco.editor.IModelContentChange[]) {
        const [change] = changes;
        if (!change) return;
        const tokens = this.getEditorsTokens();
        if (!this.dsInstance || !this.dsInstance.tokens) return;
        this.dsInstance.tokens.setTokens(this.actualTheme, tokens.color, tokens.typography, tokens.global);
    }

    private getEditorsTokens() {
        const typography: IToken = this.getEditorJsonKeyValue('typography');
        const color: IToken = this.getEditorJsonKeyValue('color');
        const global: IToken = this.getEditorJsonKeyValue('global');
        return {
            color,
            global,
            typography,
        };
    }

    private getEditorJsonKeyValue(model: TokensCategories): IToken {
        const editorValue = this.models[model].getValue().trim().split('\n');
        const tokens: IToken = {};
        editorValue.forEach((line: any) => {
            const { key, value } = this.convertTokenLineEditorToKeyValue(line);
            if (!key) return;
            tokens[key] = value;
        })
        return tokens;
    }

    private convertTokenLineEditorToKeyValue(content: string): mls.l3.ITokenInfo {
        //@mls-bg-primary: #383838;
        const rc: mls.l3.ITokenInfo = {} as mls.l3.ITokenInfo;
        if (!content.startsWith('@') || !content.endsWith(';')) return rc;
        const [key, value] = (content.substring(1, content.length - 1)).split(':');
        rc.key = key.trim();
        rc.value = value.trim();
        return rc;
    }

    private setMsizeEditor() {
        if (!this.visible) return;
        this.c2?.setAttribute('msize', this.msize);
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

interface IEditorChangedEventsObj {
    emitter: 'right' | 'left' | 'right-get',
    value: string,
}

interface IEventsSelectedObj {
    service: string[]
    isComponent: boolean
}

type IModels = Record<string, monaco.editor.ITextModel>
type ILines = Record<string, number | undefined>
