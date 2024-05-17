/// <mls shortName="serviceDsColors" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

/// **collab_i18n_start**
const message_pt = {
    themes: 'Temas',
    deleteThisTheme: 'Deletar este tema',
    updateThisTheme: 'Atualizar este tema',
    revertTokensToOriginal: 'Reverter tokens para o original',
    addTheme: 'Adicionar tema',
    themeName: 'Nome do tema',
    description: 'Descrição',
    confirm: 'Confirmar',
    cancel: 'Cancelar'

}

const message_en = {
    themes: 'Themes',
    deleteThisTheme: 'Delete this theme',
    updateThisTheme: 'Update this theme',
    revertTokensToOriginal: 'Revert tokens to original',
    addTheme: 'Add theme',
    themeName: 'Theme name',
    description: 'Description',
    confirm: 'Confirm',
    cancel: 'Cancel'
}
type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('service-ds-colors-100554')
export class ServiceDsColors100554 extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    constructor() {
        super();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf53f',
        state: 'foreground',
        tooltip: 'Colors',
        visible: false,
        position: "right",
        tags: ['ds_tokens'],
        widget: '_100554_serviceDsColors',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opHelper') return this.showHelper();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Colors',
        actions: {
            opHelper: 'Colors',
        },
        icons: {},
        actionDefault: 'opHelper', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }


    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        this._onServiceClick(visible, reinit, el)
    }

    async _onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible && reinit) {
        }
    }

    private showHelper(): boolean {
        return true;
    }

    setEvents() {
        mls.events.addEventListener([3], ['DSColorChanged'], (ev) => {
            const visible = this.visible === 'true';
            if (!visible) return;
            this.onDSColorChanged(ev);
        });

        mls.events.addEventListener([3], ['DSTokenSelected'], (ev) => {
            this.showNav2Item(true);
        });

        mls.events.addEventListener([3], ['DSTokenUnSelected'], (ev) => {
            this.showNav2Item(false);
        });
    }

    private actualTokens: IThemesTokens | undefined;

    private themes: IThemesTokens = {};


    @property()
    showAddContainer: boolean = false;

    @property()
    private themeList: string[] = [];

    @property()
    private newDataTokens: any = {};

    private defaultThemeList: string[] = [];

    private userThemeList: string[] = [];

    private selectedTheme: string = 'default';

    private ds: mls.l3.DesignSystemIO | undefined;

    private keysName: any = {
        default: '',
        lightAiry: 'Light and Airy',
        minimalist: 'Minimalist Monochrome',
        vibrantenergetic: 'Vibrant and Energetic',
        pasteldream: 'Pastel Dream',
        retrovibes: 'Retro Vibes',
        nature: 'Nature-Inspired',
        urbanchic: 'Urban Chic',
        sunsetgradient: 'Sunset Gradient',
        oceandepths: 'Ocean Depths',
    }

    @query('#service_color_add')
    service_color_add: HTMLElement | undefined;

    @query('#service_color_delete')
    service_color_delete: HTMLElement | undefined;

    @query('#service_color_update')
    service_color_update: HTMLElement | undefined;

    @query('#service_color_revert')
    service_color_revert: HTMLElement | undefined;

    @query('#service_color_inp_themedesc')
    service_color_inp_themedesc: HTMLInputElement | undefined;

    @query('#service_color_inp_themename')
    service_color_inp_themename: HTMLInputElement | undefined;

    @query('#select_theme')
    select_theme: HTMLSelectElement | undefined;

    private async init() {

        const { project } = mls.actual[5];
        const { mode } = mls.actual[3];

        if (project === undefined || mode === undefined) return;

        this.ds = mls.l3.getDSInstance(project, mode);
        if (!this.ds) return;
        await this.ds.init();
        this.getThemes();

        this.updateActualTokens();
        if (this.actualTokens) this.getColorsItem(this.actualTokens['default']);


    }

    async connectedCallback() {
        super.connectedCallback();
        this.loading = true;
        await this.init();
        this.loading = false;
    }

    private setTooltip() {
        if (!this.tooltipEl) return;
        if (this.tooltipEl) this.tooltipEl.tooltip(this.service_color_add as HTMLElement);
        if (this.tooltipEl) this.tooltipEl.tooltip(this.service_color_delete as HTMLElement);
        if (this.tooltipEl) this.tooltipEl.tooltip(this.service_color_update as HTMLElement);
        if (this.tooltipEl) this.tooltipEl.tooltip(this.service_color_revert as HTMLElement);
    }

    private async getThemes() {
        this.themeList = await this.getAllThemes();
        this.themeList.unshift('default');
        this.themes = { ...this.mythemes };
    }

    private async getAllThemes(): Promise<string[]> {
        this.defaultThemeList = this.getThemesDefault();
        this.userThemeList = await this.getUserThemes();
        const mergedThemes = this.mergeThemes(this.userThemeList, this.defaultThemeList);
        return mergedThemes;
    }

    private getThemesDefault(): string[] {
        return Object.keys(this.mythemes);
    }

    private async getUserThemes(): Promise<string[]> {
        const themes: string[] = await (this.ds?.tokens as any)['getThemeList']();
        return themes;
    }

    private mergeThemes(userThemes: string[], defaultThemes: string[]): string[] {
        return [...userThemes, ...defaultThemes];
    }

    private getTokens(tokens: mls.l3.ITokenInfo[]): IThemesTokens {
        const themes: IThemesTokens = {};
        tokens.forEach((token) => {
            const themeName = 'default';
            if (!themes[themeName]) {
                themes[themeName] = {
                    isdefault: true,
                    tokens: [],
                    description: ''
                };
            }
            themes[themeName].tokens.push(token);
        });
        return themes;
    }

    private onDSColorChanged(ev: mls.events.IEvent) {

        console.info('onDSColorChanged')

        if (!ev.desc) return;

        const params: IEditorChangedEventsObj = JSON.parse(ev.desc);
        if (params.emitter !== 'left') return;
        const [key, value, mode] = params.value.split(';');
        if (mode === 'line') {
            this.scrollToKey(key);
            return;
        }
        if (mode === 'helper') return;
        this.updateActualTokens();
        this.scrollToKey(key);
        if (mode === 'refresh') return;
        this.onChangeTokens();

    }

    private scrollToKey(key: string) {
        if (key.startsWith('[')) return;
        setTimeout(() => {

            if (!this.shadowRoot) return;
            const allelements = this.shadowRoot.querySelectorAll('mls-l3-color-item');
            allelements.forEach((el) => el.classList.remove('active'));
            let element = this.shadowRoot.querySelector(`mls-l3-color-item[key="${key}"]`);
            if (!element) element = this.shadowRoot.querySelector(`mls-l3-color-item[keydark="${key}"]`);
            if (!element) return;
            // element.scrollIntoView({
            //     behavior: 'smooth',
            //     block: 'center',
            // });
            element.classList.add('active');
        }, 300);
    }

    private updateActualTokens() {
        if (!this.ds) return;
        const tokens = this.ds.tokens.list;
        const arrTokens = Object.keys(tokens).map((tok) => tokens[tok]);
        const onlyColorsTokens = arrTokens.filter((tok) => tok.category === 'color');
        this.actualTokens = this.getTokens(onlyColorsTokens);
    }

    private getColorsItem(data: IThemes) {
        this.newDataTokens = {};
        data.tokens.forEach((token) => {
            if (!token.key || !token.value) return;
            const isDark = token.key.startsWith('_dark-');
            const key = isDark ? token.key.substring(6, token.key.length) : token.key;
            if (!this.newDataTokens[key]) this.newDataTokens[key] = { light: '', dark: '' };
            this.newDataTokens[key][isDark ? 'dark' : 'light'] = token.value;
        });

    }

    private async onChangeTokens(fireEvent: boolean = false) {

        this.setError('');
        if (!this.actualTokens) return;


        if (this.selectedTheme === 'default') {
            this.getColorsItem(this.actualTokens['default']);
            return;
        }

        if (this.selectedTheme && !this.themes[this.selectedTheme] && this.ds) {

            const theme: ITheme = await (this.ds.tokens as any)['getTheme'](this.selectedTheme);
            theme.isdefault = false;
            this.themes[this.selectedTheme] = theme;
        }

        if (!fireEvent) {
            if (!this.actualTokens) return;
            this.getColorsItem(this.actualTokens['default']);
            return;
        }

        this.getColorsItem(this.themes[this.selectedTheme]);
        const allTokens = this.themes[this.selectedTheme].tokens;

        this.actualTokens['default'] = { ...this.themes[this.selectedTheme] };

        const params: IEditorChangedEventsObj = {
            emitter: 'right',
            value: JSON.stringify(allTokens) + ';;helper'
        };
        // mls.events.fire([3], ['DSColorChanged'], JSON.stringify(params), 0);

    }


    private onChangeTheme(e: MouseEvent) {
        this.setError('');
        const target = e.target as HTMLSelectElement;
        const theme = target.value;
        this.selectedTheme = theme;
        this.onChangeTokens(true);
    }

    private handleAddThemeClick() {
        this.setError('');
        this.showAddContainer = true;
    }

    private onCancelAction() {
        this.showAddContainer = false;
    }

    private async onConfirmAction() {

        this.setError('');
        const onlyLetterNumbers = /^[a-zA-Z0-9]+$/;
        if (!this.service_color_inp_themename || !this.service_color_inp_themedesc) return;
        if (!onlyLetterNumbers.test(this.service_color_inp_themename.value)) {
            this.setError('Theme name accept only letters and numbers!');
            return;
        }
        await this.saveTheme(this.service_color_inp_themename.value, this.service_color_inp_themedesc.value);
        this.onCancelAction();
    }

    private async updateTheme() {
        this.setError('');
        if (this.themes[this.selectedTheme]?.isdefault || this.selectedTheme === 'default') {
            this.setError('This is a system theme, cannot be updated!');
            return;
        }
        if (!this.actualTokens || !this.ds) return;

        this.toogleIconOnAction(this.service_color_update as HTMLElement, true);
        const theme: ITheme = {
            description: this.themes[this.selectedTheme]?.description || '',
            tokens: this.actualTokens['default'].tokens
        } as ITheme;
        await (this.ds.tokens as any)['updateTheme'](this.selectedTheme, theme);
        this.themes[this.selectedTheme].description = theme.description;
        this.themes[this.selectedTheme].tokens = theme.tokens;
        this.toogleIconOnAction(this.service_color_update as HTMLElement, false);

    }


    private async deleteTheme() {
        this.setError('');
        if (this.themes[this.selectedTheme]?.isdefault || this.selectedTheme === 'default') {
            this.setError('This is a system theme, cannot be deleted!');
            return;
        }
        if (!this.ds) return;

        this.toogleIconOnAction(this.service_color_update as HTMLElement, true);
        await (this.ds.tokens as any)['removeTheme'](this.selectedTheme);
        this.selectedTheme = 'default';
        await this.getThemes();
        this.toogleIconOnAction(this.service_color_delete as HTMLElement, false);

    }

    private async saveTheme(themename: string, description: string) {
        if (!this.actualTokens || !this.ds) return;
        const { tokens } = this.actualTokens['default'];
        const newTheme: ITheme = {
            description,
            tokens
        } as ITheme;
        await (this.ds.tokens as any)['setTheme'](themename, JSON.stringify(newTheme));
        await this.getThemes();
    }

    private async revertTokensColors() {
        this.setError('');
        this.toogleIconOnAction(this.service_color_revert as HTMLElement, true);
        if (!this.ds || !this.actualTokens) return;
        try {
            const tokens: mls.l3.ITokenInfo[] = await (this.ds.tokens as any)['getOriginalTokens']();
            const tokensColors = tokens.filter((tok) => tok.category === 'color');
            this.actualTokens['default'].tokens = tokensColors;

            if (this.select_theme) this.select_theme.value = 'default'
            this.getColorsItem(this.actualTokens['default']);
            const params: IEditorChangedEventsObj = {
                emitter: 'right',
                value: JSON.stringify(tokensColors) + ';;helper'
            };

            // mls.events.fire([3], ['DSColorChanged'], JSON.stringify(params), 0);
        } catch (err: any) {
            this.setError(err.message);
        } finally {
            this.toogleIconOnAction(this.service_color_revert as HTMLElement, false);
        }
    }


    private toogleIconOnAction(el: HTMLElement, force: boolean) {
        const parent = el.closest('.action-item');
        if (!parent) return;
        if (force) parent.classList.add('clicked');
        else {
            setTimeout(() => {
                parent.classList.remove('clicked');
            }, 1000);
        }
    }

    handleClickColorItem(el: HTMLElement) {
        this.setActive(el);
        const input = el.querySelector('input') as HTMLElement;
        if (!input) return;
        input.click();
    }

    handleInputColorItem(key: string, e: MouseEvent) {
        const target = e.target as HTMLInputElement;
        const container = target.closest('div');
        const value = target.value;
        if (!container) return;

        container.style.backgroundColor = value;
        const params: IEditorChangedEventsObj = {
            emitter: 'right',
            value: `${key};${value};helper`
        };
        mls.events.fire([3], ['DSColorChanged'], JSON.stringify(params), 0);

    }

    private setActive(element: HTMLElement) {
        const mlscolor = element.closest('mls-l3-color');
        if (!mlscolor) return;
        const allelements = mlscolor.querySelectorAll('mls-l3-color-item');
        allelements.forEach((el) => el.classList.remove('active'));
        const actualItem = element.closest('mls-l3-color-item');
        if (actualItem) actualItem.classList.add('active');
    }


    firstUpdated(changedProperties: any) {
        super.firstUpdated(changedProperties);
        this.setTooltip();
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang]

        return html`
            <div class="service_tokens_color">
                <fieldset>
                    <legend>${this.msg.themes}</legend>
                    <div class="header">
                        <div class="row-primary ${this.showAddContainer ? 'disabled' : ''}">
                            <div>
                                <label>${this.msg.themes}</label>
                                <select id="select_theme" @change=${(e: MouseEvent) => { this.onChangeTheme(e) }}>
                                    ${this.themeList.map(theme => html`
                                        <option value="${theme}">${this.keysName[theme] || theme}</option>
                                    `)}
                                </select>
                            </div>
                            <div class="actions">
                                <div 
                                id="service_color_add" 
                                data-tooltip="Add new theme" 
                                class="action-item"
                                @click=${() => { this.handleAddThemeClick(); }}>
                                    <i class="fa fa-plus"></i>
                                </div>
                                <div id="service_color_update" data-tooltip="${this.msg.deleteThisTheme}" class="action-item" @click=${() => { this.updateTheme() }} >
                                    <i class="fa fa-floppy-disk"></i>
                                </div>
                                <div id="service_color_delete" data-tooltip="${this.msg.updateThisTheme}" class="action-item" @click=${() => { this.deleteTheme(); }}>
                                    <i class="fa fa-trash"></i>
                                </div>
                                <div id="service_color_revert" data-tooltip="${this.msg.revertTokensToOriginal}" class="action-item" @click=${() => { this.revertTokensColors(); }}>
                                    <i class="fa fa-undo"></i>
                                </div>
                            </div>
                        </div>
                        <div class="row-form" style="${this.showAddContainer ? 'display:block' : 'display:none;'}">
                            <fieldset>
                                <legend>${this.msg.addTheme}</legend>
                                <label>${this.msg.themeName}:</label>
                                <input id="service_color_inp_themename">
                                <label>${this.msg.description}:</label>
                                <textarea id="service_color_inp_themedesc" maxlength="200"></textarea>
                            </fieldset>
                            <div>
                                <div id="service_color_confirm" class="action-item" @click=${() => { this.onConfirmAction() }}>
                                    <i class="fa fa-check" title="${this.msg.confirm}"></i>
                                </div>
                                <div id="service_color_cancel" class="action-item" @click=${() => { this.onCancelAction(); }}>
                                    <i class="fa fa-xmark" title="${this.msg.cancel}"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Colors</legend>
                    <div>
                        <mls-l3-color class="ds-colors-section">
                            <div class="desc"></div>
                            <div class="colors-container">
                                ${Object.entries(this.newDataTokens).map(item => {
            const [keyname, values] = item;
            const val: { light: string, dark: string } = values as { light: string, dark: string };
            return html`
                    <mls-l3-color-item key=${keyname}>
                        <div class="ds-colors-section-item">
                            <div class="thumbnail">
                                <div
                                    data-tooltip="${val.light}" 
                                    style="background-color: ${val.light}"
                                    @click=${(e: MouseEvent) => { this.handleClickColorItem(e.target as HTMLElement) }}
                                    >
                                    <input
                                        type="color"
                                        @input=${(e: MouseEvent) => { this.handleInputColorItem(keyname, e) }}
                                        value="${val.light}">
                                </div>
                                <div
                                    data-tooltip="${val.dark}" 
                                    style="background-color: ${val.dark}"
                                    @click=${(e: MouseEvent) => { this.handleClickColorItem(e.target as HTMLElement) }}
                                >
                                    <input
                                    type="color"
                                    @input=${(e: MouseEvent) => { this.handleInputColorItem(keyname, e) }}
                                    value="${val.dark}">
                                </div>
                            </div>
                            <span class="color-token-name">${keyname}</span>
                        </div>
                    
                    </mls-l3-color-item>`
        })}
                            </div>
                        </mls-l3-color>
                    </div>
                </fieldset>
            </div>
        `;
    }

    private mythemes: IThemesTokens = {
        lightAiry: {
            isdefault: true,
            description: 'This theme uses light and soft tones to create a sense of lightness and space.',
            tokens: [
                { key: 'text-primary-color-lighter', value: '#91a9d3', category: 'color' },
                { key: 'text-primary-color', value: '#1890FF', category: 'color' },
                { key: 'text-primary-color-darker', value: '#0C53B7', category: 'color' },
                { key: 'text-secondary-color-lighter', value: '#F0F5FF', category: 'color' },
                { key: 'text-secondary-color', value: '#096DD9', category: 'color' },
                { key: 'text-secondary-color-darker', value: '#054A91', category: 'color' },
                { key: 'bg-primary-color-lighter', value: '#F4F8FF', category: 'color' },
                { key: 'bg-primary-color', value: '#E6F7FF', category: 'color' },
                { key: 'bg-primary-color-darker', value: '#D6E4FF', category: 'color' },
                { key: 'bg-secondary-color-lighter', value: '#F0F5FF', category: 'color' },
                { key: 'bg-secondary-color', value: '#BAE7FF', category: 'color' },
                { key: 'bg-secondary-color-darker', value: '#91D5FF', category: 'color' },
                { key: 'grey-color-lighter', value: '#F5F5F5', category: 'color' },
                { key: 'grey-color-light', value: '#D9D9D9', category: 'color' },
                { key: 'grey-color', value: '#BFBFBF', category: 'color' },
                { key: 'grey-color-dark', value: '#8C8C8C', category: 'color' },
                { key: 'grey-color-darker', value: '#595959', category: 'color' },
                { key: 'error-color', value: '#FF4D4F', category: 'color' },
                { key: 'success-color', value: '#52C41A', category: 'color' },
                { key: 'warning-color', value: '#FAAD14', category: 'color' },
                { key: 'info-color', value: '#1890FF', category: 'color' },
                { key: 'active-color', value: '#1890FF', category: 'color' },
                { key: 'link-color', value: '#1890FF', category: 'color' },
                { key: 'link-hover-color', value: '#40A9FF', category: 'color' },
                { key: '_dark-text-primary-color-lighter', value: '#e7ebee', category: 'color' },
                { key: '_dark-text-primary-color', value: '#1890FF', category: 'color' },
                { key: '_dark-text-primary-color-darker', value: '#40A9FF', category: 'color' },
                { key: '_dark-text-secondary-color-lighter', value: '#002140', category: 'color' },
                { key: '_dark-text-secondary-color', value: '#096DD9', category: 'color' },
                { key: '_dark-text-secondary-color-darker', value: '#40A9FF', category: 'color' },
                { key: '_dark-bg-primary-color-lighter', value: '#001529', category: 'color' },
                { key: '_dark-bg-primary-color', value: '#002140', category: 'color' },
                { key: '_dark-bg-primary-color-darker', value: '#002855', category: 'color' },
                { key: '_dark-bg-secondary-color-lighter', value: '#001529', category: 'color' },
                { key: '_dark-bg-secondary-color', value: '#002140', category: 'color' },
                { key: '_dark-bg-secondary-color-darker', value: '#002855', category: 'color' },
                { key: '_dark-grey-color-lighter', value: '#F5F5F5', category: 'color' },
                { key: '_dark-grey-color-light', value: '#D9D9D9', category: 'color' },
                { key: '_dark-grey-color', value: '#BFBFBF', category: 'color' },
                { key: '_dark-grey-color-dark', value: '#8C8C8C', category: 'color' },
                { key: '_dark-grey-color-darker', value: '#595959', category: 'color' },
                { key: '_dark-error-color', value: '#FF4D4F', category: 'color' },
                { key: '_dark-success-color', value: '#52C41A', category: 'color' },
                { key: '_dark-warning-color', value: '#FAAD14', category: 'color' },
                { key: '_dark-info-color', value: '#1890FF', category: 'color' },
                { key: '_dark-active-color', value: '#1890FF', category: 'color' },
                { key: '_dark-link-color', value: '#1890FF', category: 'color' },
                { key: '_dark-link-hover-color', value: '#40A9FF', category: 'color' }
            ]
        }
    }
}

interface IServiceElement extends HTMLElement {
    instance: {
        onDSColorChanged: Function
    }
}

interface IEditorChangedEventsObj {
    emitter: 'right' | 'left' | 'right-get',
    value: string,
}

interface IThemesTokens {
    [theme: string]: ITheme
}

interface IThemes {
    description: string,
    tokens: mls.l3.ITokenInfo[]
}
interface ITheme {
    description: string,
    isdefault: boolean,
    tokens: mls.l3.ITokenInfo[]
}
