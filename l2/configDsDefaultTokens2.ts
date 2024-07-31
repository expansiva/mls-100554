/// <mls shortName="configDsDefaultTokens2" project="100554" enhancement="_blank" groupName="other" />

import { IDS, Common, initialTokensColor, initialTokensGlobal, initialtokensTypography } from './_100554_configDsDefaultCommon';
import {
    DesignSystemIO,
    TokenIO,
    IToken,
    ITokens,
    ITokenInfo,
    TokensCategories
} from './_100554_libDesignSystem';

import { PreCompileLess } from './_100554_configDsDefaultPreCompileLess';

export class Token extends TokenIO {

    constructor(dsIO: DesignSystemIO, ds: IDS) {
        super(dsIO);
        this.ds = ds;
        this.methods = new Common(ds, dsIO);
        this.prepareTokens();
    }

    private ds: IDS;
    private methods: Common;

    public add = (key: string, value: string, theme: string, category: TokensCategories) => this._addToken(key, value, theme, category);
    public update = (key: string, newValue: string, theme: string) => this._updateToken(key, newValue, theme);
    public remove = (key: string, theme: string) => this._removeToken(key, theme);
    public find = (key: string, theme: string) => this._find(key, theme);
    public addTheme = (theme: string) => this._addTheme(theme);
    public removeTheme = (theme: string) => this._removeTheme(theme);
    public list: ITokenInfo = {};
    public getTokensLess = (theme: string) => this._getTokensLess(theme);
    public getTokensCss = (theme: string) => this._getTokensCss(theme);
    public setTokens = (theme: string, tokensColor: IToken, tokensTypography: IToken, tokensGlobal: IToken) => this._setTokens(theme, tokensColor, tokensTypography, tokensGlobal);

    private prepareTokens() {
        this.list = {};
        (this.ds.tokens.items as ITokens[]).forEach((token) => {
            if (!this.list[token.themeName]) {
                this.list[token.themeName] = {
                    color: {},
                    global: {},
                    typography: {},
                }
            }
            Object.keys(token.global).forEach((key) => {
                this.list[token.themeName]['global'][key] = token.global[key];
            });
            Object.keys(token.color).forEach((key) => {
                this.list[token.themeName]['color'][key] = token.color[key];
            });
            Object.keys(token.typography).forEach((key) => {
                this.list[token.themeName]['typography'][key] = token.typography[key];
            });
        });
    }

    private _find(key: string, theme: string): IFindToken | null {
        const cats = Object.keys(this.list[theme]);
        let tokenInfo: IFindToken | null = null;
        for (let cat of cats) {
            const value = this.list[theme][cat as TokensCategories][key];
            if (!value) continue;
            tokenInfo = {
                categorie: cat as TokensCategories,
                value
            };
        }

        return tokenInfo;
    }

    private _getTokensLess(theme: string): Promise<string> {
        const tokenByTheme = this.list[theme];
        if (!tokenByTheme) throw new Error(`no find theme: ${theme}`);
        let tokensLess = '';
        tokensLess += Object.keys(tokenByTheme.color).map((key) => {
            let token = '';
            if (!key.startsWith('_dark-')) token = `@${key}: ${tokenByTheme.color[key]};`
            return token;
        }).filter((item) => !!item).join('\n')
        tokensLess += '\n' + Object.keys(tokenByTheme.typography).map((key) => `@${key}: ${tokenByTheme.typography[key]};`).join('\n');
        tokensLess += '\n' + Object.keys(tokenByTheme.global).map((key) => `@${key}: ${tokenByTheme.global[key]};`).join('\n');
        return Promise.resolve(tokensLess);
    }

    private async _getTokensCss(theme: string): Promise<string> {
        const tokensLess = await this._getTokensLess(theme);
        try {
            const preCompileLess = new PreCompileLess();
            const tokensCss = await preCompileLess.execute('', tokensLess, theme, this.ds.tokens.items as ITokens[], ':root');
            return tokensCss;
        } catch (err: any) {
            throw new Error(`Error on compile tokens Less: ${err.message}`);
        }
    }

    private async _addToken(key: string, value: string, theme: string, category: TokensCategories): Promise<void> {

        if (!this.list[theme]) throw new Error(`theme: ${theme} dont exists`);
        const tokenByKey = this.find(key, theme);
        if (tokenByKey) throw new Error(`token: ${key} already exists in theme: ${theme}`);
        this.list[theme][category][key] = value;
        try {
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on add new token:' + err.message));
        }
    }


    private async _updateToken(key: string, value: string, theme: string): Promise<void> {

        if (!this.list[theme]) throw new Error(`theme: ${theme} dont exists`);
        const tokenByKey = this.find(key, theme);
        if (!tokenByKey) throw new Error(`token: ${key} dont exists in theme: ${theme}`);

        try {
            this.list[theme][tokenByKey.categorie][key] = value;
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on update token:' + err.message));
        }
    }

    private async _removeToken(key: string, theme: string): Promise<void> {

        const tokenByKey = this.find(key, theme);
        if (!tokenByKey) throw new Error(`token: ${key} dont exists in theme: ${theme}`);
        delete this.list[theme][tokenByKey.categorie][key];
        try {
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on remove token:' + err.message));
        }
    }

    private async _addTheme(theme: string): Promise<void> {

        if (this.list[theme]) throw new Error(`theme: ${theme} already exists`);
        this.list[theme] = {
            color: initialTokensColor,
            global: initialTokensGlobal,
            typography: initialtokensTypography,
        }

        try {
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on remove token:' + err.message));
        }

    }

    private async _removeTheme(theme: string): Promise<void> {

        if (!this.list[theme]) throw new Error(`theme: ${theme} dont exists`);
        delete this.list[theme];

        try {
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on remove token:' + err.message));
        }

    }

    private async _setTokens(theme: string, tokensColor: IToken, tokensTypography: IToken, tokensGlobal: IToken) {

        if (!this.list[theme]) throw new Error(`theme: ${theme} dont exists`);

        this.list[theme].color = tokensColor;
        this.list[theme].typography = tokensTypography;
        this.list[theme].global = tokensGlobal;

        try {
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on set tokens:' + err.message));
        }
    }

}
interface IFindToken {
    categorie: TokensCategories,
    value: string,
}
