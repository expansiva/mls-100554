/// <mls shortName="serviceDsTokens" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

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
        this.setEvents();
    }

    @property({ type: String })
    msize = '';

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

    public onClickLink = (op: string): boolean => {
        if (op === 'opTypography') return this.showTypography();
        if (op === 'opCustom') return this.showCustom();
        if (op === 'opColors') return this.showColors();
        if (op === 'opColors2') return this.showColors2();
        if (op === 'opEditor') return this.showResume();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Tokens',
        actions: {
            opColors: 'Colors',
            opTypography: 'Typography',
            opCustom: 'Custom',
        },
        icons: {},
        actionDefault: 'opColors2', // call after close icon clicked
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
            const params: IEventsSelectedObj = { isComponent: false, service: ['_100529_service_styles_preview'] };
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

    private timeoutChangesEditorCustom: number = 0;

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


    private dsInstance: mls.l3.DesignSystemIO | undefined;

    private async setTokens() {
        const { resumeTokens, tokensColors, tokensCustom, tokensTypo } = await this.getTokens();
        this.setInitialModels(resumeTokens, 'resume');
        this.setInitialModels(tokensColors, 'color');
        this.setInitialModels(tokensCustom, 'custom');
        this.setInitialModels(tokensTypo, 'typography');
    }

    private tokensColors: mls.l3.ITokenInfo[] = [];
    private tokensTypo: mls.l3.ITokenInfo[] = [];
    private tokensCustom: mls.l3.ITokenInfo[] = [];

    private actualTypeTokens: string = 'color';

    private async getTokens() {

        const { project } = mls.actual[5];
        const { mode } = mls.actual[3];
        if (project === undefined || mode === undefined) throw new Error('No project or design system selected');

        const dss = mls.l5.ds.list(project);
        const dsInfo = dss[mode];
        if (!dsInfo) return { tokensColors: '', tokensTypo: '', tokensCustom: '', resumeTokens: '' };

        this.dsInstance = mls.l3.getDSInstance(project, mode);
        await this.dsInstance.init();

        const { list } = this.dsInstance.tokens;
        const tokens: mls.l3.ITokenInfo[] = [];
        Object.keys(list).forEach((tok) => {
            tokens.push(list[tok]);
        });
        this.tokensColors = tokens.filter((tok) => tok.category === 'color');
        this.tokensTypo = tokens.filter((tok) => tok.category === 'typography');
        this.tokensCustom = tokens.filter((tok) => tok.category === 'custom');

        const strColors = this.tokensColors.map((item) => `@${item.key}: ${item.value};`).join('\n');
        const strTypo = this.tokensTypo.map((item) => `@${item.key}: ${item.value};`).join('\n');
        const strCustom = this.tokensCustom.map((item) => `@${item.key}: ${item.value};`).join('\n');
        const resumeTokens = ['// Tokens Colors', strColors, '// Tokens Typography', strTypo, '//Tokens Custom', strCustom].join('\n');

        return {
            tokensColors: strColors,
            tokensTypo: strTypo,
            tokensCustom: strCustom,
            resumeTokens
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


    private showResume(): boolean {
        this.menu.title = 'Tokens - Resume';
        if (this.menu.updateTitle) this.menu.updateTitle();
        this.showResume2();
        return true;
    }

    private async showResume2() {

        this.actualTypeTokens = 'resume';

        const { resumeTokens } = await this.getTokens();
        this.setInitialModels(resumeTokens, 'resume');
        if (!this._ed1) return true;
        this._ed1.setModel(this.models['resume']);
        this._ed1.updateOptions({ readOnly: true });
        return true;
    }

    private showCustom(): boolean {

        this.actualTypeTokens = 'custom';
        if (this.menu.setMode) this.menu.setMode('editor');
        if (!this._ed1) return true;

        this._ed1.setModel(this.models['custom']);
        this._ed1.updateOptions({ readOnly: false });
        mls.events.fire([this.level], ['DSCustomClicked'], 'Custom Clicked');

        this._ed1.getModel()?.onDidChangeContent((event) => {
            this.timeoutChangesEditorCustom = setTimeout(() => {
                if (this.timeoutChangesEditorCustom) clearTimeout(this.timeoutChangesEditorCustom);
                this.onEditorCustomChange(event.changes);
            }, 1000);
        });

        return true;
    }

    private showTypography(): boolean {

        this.actualTypeTokens = 'typography'
        if (this.menu.setMode) this.menu.setMode('editor');
        if (!this._ed1) return true;

        this._ed1.setModel(this.models['typography']);
        this._ed1.updateOptions({ readOnly: false });
        this._ed1.getModel()?.onDidChangeContent((event) => {
            this.timeoutChangesEditorTypography = setTimeout(() => {
                if (this.timeoutChangesEditorTypography) clearTimeout(this.timeoutChangesEditorTypography);
                this.onEditorTypoChange(event.changes);
            }, 1000);
        });
        return true;

    }

    private showColors(): boolean {
        if (this.menu.setMode) this.menu.setMode('initial');
        return this.showColors2();
    }

    private showColors2(): boolean {

        this.actualTypeTokens = 'color';
        this.setTokens().then(() => {

            if (!this._ed1) return true;

            this._ed1.setModel(this.models['color']);
            this._ed1.updateOptions({ readOnly: false });
            const rc: mls.l3.ITokenInfo[] = this.getEditorJsonKeyValue('color');
            const params: IEditorChangedEventsObj = {
                emitter: 'left',
                value: `${JSON.stringify(rc)};${''};${this.isRightChange ? 'refresh' : 'editor'}`
            };

            mls.events.fire([this.level], ['DSColorChanged'], JSON.stringify(params), 1000);

            this._ed1.getModel()?.onDidChangeContent((event) => {
                this.timeoutChangesEditorColor = setTimeout(() => {
                    if (this.timeoutChangesEditorColor) clearTimeout(this.timeoutChangesEditorColor);
                    this.onEditorColorChange(event.changes);
                }, 500);
            });

            this._ed1.onDidChangeCursorPosition((event) => {
                this.onEditorColorLineChange(event.position.lineNumber);
            });

        });

        return true;

    }

    private lastLineColor: number | undefined = undefined;

    private onEditorColorLineChange(line: number) {
        if (this.isRightChange) {
            this.isRightChange = false;
            return;
        }
        if (this.lastLine && this.lastLineColor !== line) {
            this.lastLineColor = line;

            if (!this._ed1) return;
            const model = this._ed1.getModel();
            if (!model) return;
            const lineKeyValue = this.convertTokenLineEditorToKeyValue(model.getLineContent(line));
            const params = {
                emitter: 'left',
                value: `${lineKeyValue.key};${''};line`
            };
            mls.events.fire([this.level], ['DSColorChanged'], JSON.stringify(params), 0);
        }
    }

    private onEditorColorChange(changes: monaco.editor.IModelContentChange[]) {

        const [change] = changes;
        if (!change) return;

        const lineChange = change.range.startLineNumber;
        if (!this._ed1) return;
        const model = this._ed1.getModel();
        if (!model) return;
        const lineKeyValue = this.convertTokenLineEditorToKeyValue(model.getLineContent(lineChange));

        const tokens = this.getEditorsTokens();
        const colorsTokens = tokens.filter((item) => item.category === 'color');

        (this.dsInstance?.tokens as any)['setTokenList'](tokens); // passar função pra lib
        let params: IEditorChangedEventsObj;
        if (this.isRightChange) {
            this.isRightChange = false;
            params = {
                emitter: 'left',
                value: `${JSON.stringify(colorsTokens)};${''};refresh`
            };
        } else {
            params = {
                emitter: 'left',
                value: `${lineKeyValue.key || JSON.stringify(colorsTokens)};${''};editor`
            };
        }

        mls.events.fire([this.level], ['DSColorChanged'], JSON.stringify(params));

    }

    private onEditorTypoChange(changes: monaco.editor.IModelContentChange[]) {
        const [change] = changes;
        if (!change) return;
        const tokens = this.getEditorsTokens();
        const typoTokens = tokens.filter((item) => item.category === 'typography');
        (this.dsInstance?.tokens as any)['setTokenList'](tokens);
        const rc: mls.l3.ITokenInfo[] = this.getEditorJsonKeyValue('typography');
        const params: IEditorChangedEventsObj = {
            emitter: 'left',
            value: `${JSON.stringify(rc)};${''};${'editor'}`
        };
        mls.events.fire([this.level], ['DSTYPOChanged'], JSON.stringify(params), 1000);

    }

    private onEditorCustomChange(changes: monaco.editor.IModelContentChange[]) {
        const [change] = changes;
        if (!change) return;
        const tokens = this.getEditorsTokens();
        const customTokens = tokens.filter((item) => item.category === 'custom');
        (this.dsInstance?.tokens as any)['setTokenList'](tokens);

        const rc: mls.l3.ITokenInfo[] = this.getEditorJsonKeyValue('custom');
        const params: IEditorChangedEventsObj = {
            emitter: 'left',
            value: `${JSON.stringify(rc)};${''};${'editor'}`
        };
        mls.events.fire([this.level], ['DSCustomChanged'], JSON.stringify(params), 1000);
    }

    private getEditorsTokens(): mls.l3.ITokenInfo[] {
        const rcT: mls.l3.ITokenInfo[] = this.getEditorJsonKeyValue('typography');
        const rcC: mls.l3.ITokenInfo[] = this.getEditorJsonKeyValue('color');
        const rcCustom: mls.l3.ITokenInfo[] = this.getEditorJsonKeyValue('custom');
        return [...rcC, ...rcT, ...rcCustom];
    }

    private isRightChange = false;

    private async editEditorByDSColorChanged(desc: string) {

        const params: IEditorChangedEventsObj = JSON.parse(desc);
        if (params.emitter !== 'right') return;
        if (!this._ed1 || !this.dsInstance) return;

        const [key, value, mode] = params.value.split(';');
        if (mode !== 'helper' && mode !== 'line') return;

        this.isRightChange = true;
        const colorModel: monaco.editor.ITextModel = this.models['color'];

        if (key.startsWith('[')) {
            const allTokensColors = JSON.parse(key);
            this.tokensColors = allTokensColors;
            const allTokens = [...this.tokensColors, ...this.tokensTypo, ...this.tokensCustom];
            await (this.dsInstance?.tokens as any)['setTokenList'](allTokens);
            const { tokensColors } = await this.getTokens();
            colorModel.setValue(tokensColors);
            return;
        }

        if (mode === 'helper' && this._ed1.getModel()?.id !== colorModel.id) {
            await this.dsInstance.tokens.update(key, value);
            return;
        }

        const line = this._ed1.getModel()?.findMatches(`@${key}:`, true, false, false, null, true);
        if (!line || line.length === 0) return;

        const { startLineNumber, startColumn, endLineNumber } = line[0].range;
        const lineLength = colorModel.getLineContent(startLineNumber).length + 1;
        const range = new monaco.Range(startLineNumber, startColumn, endLineNumber, lineLength);
        const text = value ? `@${key}: ${value};` : null;

        if (mode === 'helper' && !text) {
            this._ed1.executeEdits('', [{ range: new monaco.Range(range.startLineNumber, 1, range.startLineNumber + 1, 1), text }]);
            return;
        }

        if (mode === 'helper') this._ed1.executeEdits('color', [{ range, text }]);
        if (this.lastLine['color'] === startLineNumber) return;
        this.lastLine['color'] = startLineNumber;
        this._ed1.setSelection(new monaco.Selection(range.startLineNumber, 0, range.startLineNumber, lineLength));
        this._ed1.revealLineInCenter(startLineNumber);

    }

    private getEditorJsonKeyValue(model: mls.l3.TokensCategories): mls.l3.ITokenInfo[] {

        const editorValue = this.models[model].getValue().trim().split('\n');
        let rc: mls.l3.ITokenInfo[] = (editorValue.map((line: any) => {
            const obj: mls.l3.ITokenInfo = {} as mls.l3.ITokenInfo;
            const { key, value } = this.convertTokenLineEditorToKeyValue(line);
            obj.key = key;
            obj.value = value;
            obj.category = model;
            return obj;
        }).filter((item: any) => item.key !== undefined));

        const filteredRc = rc.reduce((acc: mls.l3.ITokenInfo[], current) => {
            const x: any = acc.find((item: any) => item.key === current.key);
            return (!x || !x.key || !x.value) ? acc.concat([current]) : acc;
        }, []);

        return filteredRc;

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

    setEvents() {
        mls.events.addEventListener([3], ['DSColorChanged'], (ev) => {
            if (ev.desc) this.editEditorByDSColorChanged(ev.desc);
        });

        mls.events.addEventListener([this.level], ['DSTYPOClicked'], (ev) => {
            if (ev.desc !== 'right') return;
            this.onClickLink('opTypography');
        });

        mls.events.addEventListener([this.level], ['DSColorClicked'], (ev) => {
            if (ev.desc !== 'right') return;
            this.onClickLink('opColors');
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
