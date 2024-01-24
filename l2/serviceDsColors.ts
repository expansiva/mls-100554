/// <mls shortName="serviceDsColors" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-ds-colors-100554')
export class ServiceDsColors100554 extends ServiceBase {
    constructor() {
        super();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf53f',
        name: 'Colors',
        mode: 'H',
        position: 'right',
        tooltip: 'Colors',
        tags: ['ds_tokens'],
        levels: [3]
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
            // if (this.onDSColorChanged) this.onDSColorChanged(ev);
        });

        mls.events.addEventListener([this.level], ['DSTokenSelected'], (ev) => {
            if (!this.serviceContent) return;
            this.serviceContent.setAttribute('mode', 'A');
        });

        mls.events.addEventListener([this.level], ['DSTokenUnSelected'], (ev) => {
            if (!this.serviceContent) return;
            this.serviceContent.setAttribute('mode', 'H');
        });
    }

    private actualTokens: IThemesTokens | undefined;

    private themes: IThemesTokens = {};

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

    private async init() {

        const { project } = mls.actual[5];
        const { mode } = mls.actual[3];

        if (project === undefined || mode === undefined) return;

        this.ds = mls.l3.getDSInstance(project, mode);
        if (!this.ds) return;
        await this.ds.init();
        this.getThemes();

        console.info(this.actualTokens)
        if (this.actualTokens) this.getColorsItem(this.actualTokens['default']);

        // this.setTooltip();

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

    private scrollToKey(key: string) {
        if (key.startsWith('[')) return;
        setTimeout(() => {
            const allelements = document.querySelectorAll('mls-l3-color-item');
            allelements.forEach((el) => el.classList.remove('active'));
            let element = document.querySelector(`mls-l3-color-item[key="${key}"]`);
            if (!element) element = document.querySelector(`mls-l3-color-item[keydark="${key}"]`);
            if (!element) return;
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
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

        this.actualTokens['default'] = this.themes[this.selectedTheme];

        const params: IEditorChangedEventsObj = {
            emitter: 'right',
            value: JSON.stringify(allTokens) + ';;helper'
        };
        mls.events.fire([3], ['DSColorChanged'], JSON.stringify(params), 0);

    }

    private onChangeTheme(e: MouseEvent) {
        this.setError('');
        const target = e.target as HTMLSelectElement;
        const theme = target.value;
        this.selectedTheme = theme;
        this.onChangeTokens(true);
    }

    render() {
        return html`
            <div class="service_tokens_color">
                <fieldset>
                    <legend>Themes</legend>
                    <div class="header">
                        <div class="row-primary">
                            <div>
                                <label>Themes</label>
                                <select @change=${(e: MouseEvent) => { this.onChangeTheme(e) }}>
                                    ${this.themeList.map(theme => html`
                                        <option value="${theme}">${this.keysName[theme] || theme}</option>
                                    `)}
                                </select>
                            </div>
                            <div class="actions">
                                <div id="service_color_add" data-tooltip="Add new theme" class="action-item">
                                    <i class="fa fa-plus"></i>
                                </div>
                                <div id="service_color_update" data-tooltip="Delete this theme" class="action-item">
                                    <i class="fa fa-floppy-disk"></i>
                                </div>
                                <div id="service_color_delete" data-tooltip="Update this theme" class="action-item">
                                    <i class="fa fa-trash"></i>
                                </div>
                                <div id="service_color_revert" data-tooltip="Revert tokens to original" class="action-item">
                                    <i class="fa fa-undo"></i>
                                </div>
                            </div>
                        </div>
                        <div class="row-form" style="display:none;">
                            <fieldset>
                                <legend>Add Theme</legend>
                                <label>Theme Name:</label>
                                <input id="service_color_inp_themename">
                                <label>Description:</label>
                                <textarea id="service_color_inp_themedesc" maxlength="200"></textarea>
                            </fieldset>
                            <div>
                                <div id="service_color_confirm" class="action-item">
                                    <i class="fa fa-check" title="Confirm"></i>
                                </div>
                                <div id="service_color_cancel" class="action-item">
                                    <i class="fa fa-times" title="Cancel"></i>
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
                                        <mls-l3-color-item>
                                            <div class="ds-colors-section-item">
                                                <div class="thumbnail">
                                                    <div data-tooltip="${val.light}" style="background-color: ${val.light}">
                                                        <input type="color" value="${val.light}">
                                                    </div>
                                                    <div data-tooltip="${val.dark}" style="background-color: ${val.dark}">
                                                        <input type="color" value="${val.dark}">
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
