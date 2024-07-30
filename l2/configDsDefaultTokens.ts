/// <mls shortName="configDsDefaultTokens" project="100554" enhancement="_blank" groupName="other" />
import { IDS, Common, ITheme } from './_100554_configDsDefaultCommon';
import { PreCompileLess } from './_100554_configDsDefaultPreCompileLess';

export class Token extends mls.l3.Token {

    constructor(dsIO: mls.l3.DesignSystemIO, ds: IDS) {
        super(dsIO);
        this.ds = ds;
        this.dsIO = dsIO;
        this.methods = new Common(ds, dsIO);
        this.prepareTokens();
    }

    private ds: IDS;
    private dsIO: mls.l3.DesignSystemIO | any;
    private methods: Common;

    public add = (key: string, value: string, category: mls.l3.TokensCategories) => this._addToken(key, value, category);
    public update = (key: string, newValue: string) => this._updateToken(key, newValue);
    public remove = (key: string) => this._removeToken(key);
    public find = (key: string) => this._find(key);
    public list: mls.l3.ITokenInfos = {};

    public getTokensLess = () => this._getTokensLess();
    public getTokensCss = () => this._getTokensCss();

    public setTokenList = (tokens: mls.l3.ITokenInfo[]) => this._addTokenList(tokens);
    public getOriginalTokens = () => this._getOriginalTokens();
    public getThemeList = () => this._getThemeList();
    public getTheme = (themename: string) => this._getTheme(themename);
    public updateTheme = (themename: string, theme: ITheme) => this._updateTheme(themename, theme);
    public removeTheme = (themename: string) => this._removeTheme(themename);
    public setTheme = (themename: string, content: string) => this._setTheme(themename, content);

    private prepareTokens() {
        this.list = {};
       (this.ds.tokens.items as mls.l3.ITokenInfo[]).forEach((token) => {
            this.list[token.key] = token;
        });
    }

    private async _getOriginalTokens(): Promise<mls.l3.ITokenInfo[]> {
        const originalJson = await this.dsIO._getOriginalDsJSON();
        if (!originalJson) return this.methods.tokensInitial;

        return originalJson.tokens.items;
    }

    private _find(key: string): mls.l3.ITokenInfo | null {
        return this.list[key];
    }

    private async _getThemeList(): Promise<string[]> {
        const keyStarts = `${this._ds.project}_3_ds_cssthemes`;
        const themes = (Object.keys(mls.stor.files).filter((key) => key.startsWith(keyStarts))).map((theme) => mls.stor.files[theme].shortName);
        return themes;
    }

    private async _getTheme(themename: string): Promise<ITheme> {

        const fullpath = this.methods.getDsThemeFilePath();
        const key = mls.stor.getKeyToFiles(this._ds.project, 3, themename, fullpath, '.json');
        const jsonThemes = mls.stor.files[key];
        if (!jsonThemes) throw new Error('Theme name dont exist');
        const str = await this.methods.getContentFile(themename, 'json', fullpath);
        const theme: ITheme = JSON.parse(str as string);
        return theme;
    }

    private async _updateTheme(themename: string, theme: ITheme): Promise<void> {
        const fullpath = this.methods.getDsThemeFilePath();
        const key = mls.stor.getKeyToFiles(this._ds.project, 3, themename, fullpath, '.json');
        const jsonThemes = mls.stor.files[key];
        if (!jsonThemes) throw new Error('Theme dont exist');
        await this.methods.setContentFile(themename, 'json', fullpath, JSON.stringify(theme));
    }

    private async _removeTheme(themename: string) {
        const fullpath = this.methods.getDsThemeFilePath();
        const key = mls.stor.getKeyToFiles(this._ds.project, 3, themename, fullpath, '.json');
        const jsonThemes = mls.stor.files[key];
        if (!jsonThemes) throw new Error('Theme dont exist');
        try {
            await this.methods.setContentFile(themename, 'json', fullpath, null);
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on remove theme:' + err.message));
        }

    }

    private async _setTheme(themename: string, content: string): Promise<void> {
        const list = await this.getThemeList();
        if (list.includes(themename)) throw new Error('This name already used in another theme');
        const fullpath = this.methods.getDsThemeFilePath();
        const key = mls.stor.getKeyToFiles(this._ds.project, 3, themename, fullpath, '.json');
        const jsonThemes = mls.stor.files[key];
        if (!jsonThemes) {
            await this.methods.createNewFile(themename, fullpath, 'json', content);
            return;
        }
        await this.methods.setContentFile(themename, 'json', fullpath, content);

    }

    private _getTokensLess(): Promise<string> {
        const keys = Object.keys(this.list);
        const tokensLess = keys.map((item) => `@${this.list[item].key}: ${this.list[item].value};`).join('\n');
        return Promise.resolve(tokensLess);
    }

    private async _getTokensCss(prefix: ':host' | ':root' = ':root'): Promise<string> {
        const tokensLess = await this._getTokensLess();
        try {
            const preCompileLess = new PreCompileLess();
            const tokensCss = await preCompileLess.execute('', tokensLess, this.ds.tokens.items as mls.l3.ITokenInfo[], prefix); // mls.l2.compileLess(allLess);
            return tokensCss;
        } catch (err: any) {
            throw new Error(`Error on compile tokens Less: ${err.message}`);
        }
    }

    // private async createOrUpdateFileTokens() {

    //     if (!this.css) this.css = this.dsIO.css;
    //     const name = 'tokens';
    //     const tokensCss = await this.getTokensCss();
    //     const tokensItem = this.css.list[name];
    //     if (!tokensItem) await this.css.add(name, tokensCss);
    //     else await tokensItem.setContent(tokensCss);
    // }

    private async _addTokenList(tokens: mls.l3.ITokenInfo[]): Promise<void> {

        this.list = {};
        tokens.forEach((token) => {
            this.list[token.key] = token;
        });

        try {
            await this.methods.setContentFileDsMain();
            // await this.createOrUpdateFileTokens();
            return Promise.resolve();

        } catch (err: any) {
            return Promise.reject(new Error('Error on add new token:' + err.message));
        }
    }

    private async _addToken(key: string, value: string, category: mls.l3.TokensCategories): Promise<void> {

        const tokenByKey = this.find(key);
        if (tokenByKey) throw new Error(`token: ${key} already exists`);
        const token: mls.l3.ITokenInfo = {
            key,
            value,
            category
        };
        this.list[key] = token;
        try {
            await this.methods.setContentFileDsMain();
            // await this.createOrUpdateFileTokens();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on add new token:' + err.message));
        }
    }

    private async _updateToken(key: string, value: string): Promise<void> {

        const tokenByKey = this.find(key);
        if (!tokenByKey) throw new Error(`token: ${key} dont exists`);
        tokenByKey.value = value;

        try {
            this.list[key] = tokenByKey;
            await this.methods.setContentFileDsMain();
            // await this.createOrUpdateFileTokens();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on update token:' + err.message));
        }
    }

    private async _removeToken(key: string): Promise<void> {

        const tokenByKey = this.find(key);
        if (!tokenByKey) throw new Error(`token: ${key} dont exists`);
        delete this.list[key];

        try {
            await this.methods.setContentFileDsMain();
            // await this.createOrUpdateFileTokens();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on remove token:' + err.message));
        }
    }

}

