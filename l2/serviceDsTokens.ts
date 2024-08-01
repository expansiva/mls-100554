/// <mls shortName="serviceDsTokens" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu, IMenuTitle } from './_100554_serviceBase';
import { getDSInstance, list as listDs, DesignSystemIO, IToken, TokensCategories } from './_100554_libDesignSystem';
import { collab_trash } from './_100554_collabIcons';

/// **collab_i18n_start**
const message_pt = {
    theme: "Tema",
    addNewTheme: 'Adicionar novo tema',
    newThemeName: "Nome",
    newThemeDesc: "Descrição",
    btnAddNewTheme: 'Salvar',
    btnAddNewThemeIA: 'Criar com IA',
    back: 'Voltar',
    errorNewThemeName: 'O nome do tema não pode estar em branco',
}

const message_en = {
    theme: "Theme",
    addNewTheme: 'Add new theme',
    newThemeName: "Name",
    newThemeDesc: "Description",
    btnAddNewTheme: 'Save',
    btnAddNewThemeIA: 'Create with AI',
    back: 'Back',
    errorNewThemeName: 'Theme name cannot be blank',
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
    @property({ type: String }) currentScenario: IScenaries = 'editor';
    @property({ type: String }) themes: IThemes[] = [];
    @query("#new-theme-name") inpName: HTMLInputElement | undefined;
    @query("#new-theme-desc") inpDesc: HTMLTextAreaElement | undefined;

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
        tags: [],
        widget: '_100554_serviceDsTokens',
        level: [3]
    }

    public onClickIcon = (op: string): void => {
        if (op === 'icTypography') this.showTypography();
        if (op === 'icGlobal') this.showGlobal();
        if (op === 'icColor') this.showColors();
    }

    public onClickTitle = () => {
        this._onClickTitle();
    }

    public menu: IMenu = {
        title: {
            icon: '&#xf054',
            text: 'Theme'
        },
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
        onClickTitle: this.onClickTitle,
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
        global: {} as monaco.editor.ITextModel,
        typography: {} as monaco.editor.ITextModel,
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

    private fireEvent() {
        const params: IEditorChangedEventsObj = {
            emitter: 'left',
            value: this.actualTheme
        };
        mls.events.fire([this.level], ['DSColorChanged'], JSON.stringify(params), 1000);

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
        this.fireEvent();

    }

    private onEditorTypoChange(changes: monaco.editor.IModelContentChange[]) {
        const [change] = changes;
        if (!change) return;
        const tokens = this.getEditorsTokens();
        if (!this.dsInstance || !this.dsInstance.tokens) return;
        this.dsInstance.tokens.setTokens(this.actualTheme, tokens.color, tokens.typography, tokens.global);
        this.fireEvent();

    }

    private onEditorGlobalChange(changes: monaco.editor.IModelContentChange[]) {
        const [change] = changes;
        if (!change) return;
        const tokens = this.getEditorsTokens();
        if (!this.dsInstance || !this.dsInstance.tokens) return;
        this.dsInstance.tokens.setTokens(this.actualTheme, tokens.color, tokens.typography, tokens.global);
        this.fireEvent();
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

    private _onClickTitle() {

        if (this.currentScenario === 'select') {
            this.currentScenario = 'editor';
            this.currentScenario = 'select';
            (this.menu.title as IMenuTitle).icon = `&#xf054`;
            if (this.menu.updateTitle) this.menu.updateTitle();
            return;
        }
        this.currentScenario = 'select';
        (this.menu.title as IMenuTitle).icon = `&#xf053`;
        if (this.menu.updateTitle) this.menu.updateTitle();
    }

    private getThemes() {
        if (!this.dsInstance || !this.dsInstance.tokens) return [];
        const list = this.dsInstance.tokens.list;
        const themes: IThemes[] = [];
        Object.keys(list).forEach((theme) => {

            const themeItem: IThemes = {
                themeName: theme,
                description: list[theme].description,
                pallete: []
            };

            Object.keys(list[theme].color).forEach((token) => {
                themeItem.pallete.push(list[theme].color[token]);
            });
            themes.push(themeItem);
        });

        return themes;

    }

    private clearInputs() {
        if (this.inpDesc) this.inpDesc.value = '';
        if (this.inpName) this.inpName.value = '';
    }

    private async onSaveThemeClick() {
        const name = this.inpName?.value;
        const desc = this.inpDesc?.value || '';

        if (!name) {
            this.setError(this.msg.errorNewThemeName)
            return;
        }

        if (!this.dsInstance || !this.dsInstance.tokens) return;
        try {
            await this.dsInstance.tokens.addTheme(name, desc);
            this.clearInputs();
            this.themes = this.getThemes();
            this.requestUpdate();
        } catch (err: any) {
            this.setError(err.message)

        }

    }

    private async onSelectTheme(theme: string) {
        this.tokensColors = {};
        this.tokensGlobal = {};
        this.tokensTypo = {};
        this.actualTheme = theme;
        this.currentScenario = 'editor';
        (this.menu.title as IMenuTitle).text = `${this.msg.theme}:${this.actualTheme}`;
        (this.menu.title as IMenuTitle).icon = `&#xf054`;
        if (this.menu.updateTitle) this.menu.updateTitle();
    }

    private async deleteTheme(ev: MouseEvent, theme: string) {
        ev.stopPropagation();
        if (!this.dsInstance || !this.dsInstance.tokens) return;
        try {
            await this.dsInstance.tokens.removeTheme(theme);
            if (this.actualTheme === theme) this.actualTheme = 'Default';
            this.themes = this.getThemes();
            this.requestUpdate();
        } catch (err: any) {
            this.setError(err.message)
        }
    }

    updated(changedProperties: any) {
        if (changedProperties.has('msize')) {
            if (!this.visible) return;
            this.setMsizeEditor();
        }

        if (changedProperties.has('currentScenario') && this.currentScenario === 'editor') {
            this.createEditor();
            this.showColors();
        }
    }

    firstUpdated(changedProperties: any) {
        super.firstUpdated(changedProperties);
        (this.menu.title as IMenuTitle).text = `${this.msg.theme}:${this.actualTheme}`;
        (this.menu.title as IMenuTitle).icon = `&#xf054`;
        if (this.menu.updateTitle) this.menu.updateTitle();
    }

    renderEditor() {
        return html`<mls-editor-100529 ismls2="true"></mls-editor-100529>`
    }

    renderSelect() {

        this.themes = this.getThemes();
        return html`<div class="select-theme">
            <div>
                ${this.themes.map((theme) => {
            return html`
                    <div class="theme-item" @click=${() => { this.onSelectTheme(theme.themeName) }}>
                        ${theme.themeName !== 'Default' ? html`<span class="remove" @click=${(e: MouseEvent) => this.deleteTheme(e, theme.themeName)}>${collab_trash}</span>` : html``} 
                        <span>${theme.themeName}</span>
                        <span class="desc">${theme.description}</span>

                        <div class="pallete">
                            ${theme.pallete.map((color) => {
                return html`<div class="pallete-item" style="background-color:${color};"></div>`
            })}
                        </div>
                    </div>`
        })}
            </div>
            <details>
                <summary>${this.msg.addNewTheme}</summary>
                <form>
                    <label>${this.msg.newThemeName}</label>
                    <input id="new-theme-name"></input>
                    <label>${this.msg.newThemeDesc}</label>
                    <textarea id="new-theme-desc"></textarea>
                </form>

                <div class="select-theme-action">
                    <button @click=${this.onSaveThemeClick}>${this.msg.btnAddNewTheme}</button>
                    <button>${this.msg.btnAddNewThemeIA}</button>
                </div>
            
            </details>
            
        </div>`
    }

    renderScenario() {
        switch (this.currentScenario) {
            case 'editor':
                return html`${this.renderEditor()}`
            case 'select':
                return html`
                    ${this.renderSelect()}
                `
        }
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <section>
                ${this.renderScenario()}
            </section>
            <style>${this.styles}</style>
        `
    }

    private styles = `
        .select-theme {
            padding: 1rem;
        }
        .select-theme details > div{
            padding:1rem;
        }
        .select-theme details input {
            display: block;
            width:100%;
            font-size: 1rem;
            line-height: 1.5;
            color: #000000;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            outline: none;
        }

        .select-theme details textarea {
            display: block;
            width:100%;
            font-size: 1rem;
            line-height: 1.5;
            color: #000000;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            outline: none;
        }

        .select-theme details > div button:hover{
            background-color: var(--grey-color-light);
        }

        .select-theme details > div button {
            background-color: var(--bg-secondary-color-lighter);
            border-radius: 8px;
            border:none;
            box-shadow: 0px 1px 3px 0px var(--grey-color);
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap:.2rem;
            font-weight: 700;
            align-items: center;
            height: 40px;
            transition: height 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
            padding: 0.5rem;
            color: var(--text-primary-color);
            cursor:pointer;
        }
        
        .select-theme .select-theme-action {
            margin-top:1rem;
            display:flex;
            justify-content:center;
            gap:1rem;
        }
        .select-theme .theme-item {
            position:relative;
            border-bottom: 1px solid #cecece;
        }
        .select-theme .theme-item .remove{
            position:absolute;
            cursor:pointer;
            top:5px;
            right:0;
        }
        
        .select-theme .theme-item .desc {
            font-size: var(--font-size-16);
            display:block;
        }
        .select-theme .theme-item .pallete {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
            padding-bottom: 1rem;
            gap: 0.1rem;
        }
        .select-theme .theme-item .pallete .pallete-item {
            cursor:pointer;
            background-color: #535353;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        .select-theme .theme-item .pallete:hover {
            opacity: .7
        }
    `
}


type IScenaries = 'editor' | 'select';

interface IThemes {
    themeName: string,
    description: string,
    pallete: string[]
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
