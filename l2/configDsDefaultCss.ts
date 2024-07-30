/// <mls shortName="configDsDefaultCss" project="100554" enhancement="_blank" groupName="other" />

import { IDS, Common } from './_100554_configDsDefaultCommon';
import {
      DesignSystemIO,
    CssIO,
    ICssInfos,
    ICssInfo
} from './_100554_libDesignSystem';
import { Token } from './_100554_configDsDefaultTokens2';
import { PreCompileLess } from './_100554_configDsDefaultPreCompileLess';

export class Css extends CssIO {

    constructor(dsIO: DesignSystemIO, ds: IDS) {
        super(dsIO);
        this.ds = ds;
        this.methods = new Common(ds, dsIO);
        this.tokens = new Token(dsIO, ds);
        this.prepareCss();
    }

    private ds: IDS;
    private methods: Common;
    private tokens: Token;

    public list: ICssInfos = {};
    public add = (name: string, content: string) => this._addCss(name, content);
    public setHTMLPreview = (content: string) => this._setHTMLPreview(content);
    public getHTMLPreview = () => this._getHTMLPreview();
    public find = (name: string) => this._find(name);
    public getStylesInLess = (theme: string) => this._getCssGlobalLess(theme);

    private prepareCss() {
        this.list = {};
        this.ds.css.items.forEach((css) => {
            this._addCss2(css);
        });
    }

    private _find(name: string): ICssInfo | null {
        return this.list[name];
    }

    private getExtension(name: string) {
        let ext: string = 'less';
        if (name === 'tokens') ext = 'css';
        return ext;
    }

    private async _addCss(name: string, content: string): Promise<void> {

        const cssByName = this.find(name);
        if (cssByName) throw new Error(`css file: ${name} already exists`);
        const shortName = name;
        const fullpath = this.methods.getDsCssFilePath();

        const css: ICssInfo = {
            name,
            getContent: (): Promise<string> => { return Promise.resolve('') },
            setContent: (): Promise<boolean> => { return Promise.resolve(true) }
        };
        try {
            await this.methods.createNewFile(shortName, fullpath, this.getExtension(name), content);
            this._addCss2(css);
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on create new css:' + err.message));
        }
    }

    private _addCss2(css: ICssInfo) {
        css.getContent = () => this.getCssContent(css);
        css.setContent = (newcontent: string | null) => this.setCssContent(css, newcontent);
        this.list[css.name] = css;
    }

    private cacheCss: any = {};

    private async getCssContent(css: ICssInfo): Promise<string> {

        const shortName = css.name;
        const ext = this.getExtension(shortName);

        const fullpath = this.methods.getDsCssFilePath();
        const key = shortName;

        const keyToFile = mls.stor.getKeyToFiles(this._ds.project, 3, shortName, fullpath, `.${ext}`);
        const file = mls.stor.files[keyToFile];

        if (file
            && file.status === 'nochange'
            && this.cacheCss[key] && file.versionRef === this.cacheCss[key].version
        ) {
            return this.cacheCss[key].content;
        }

        const content = await this.methods.getContentFile(shortName, ext, fullpath);
        this.cacheCss[key] = {
            content,
            version: file.versionRef
        };

        return content as string;
    }

    private async setCssContent(css: ICssInfo, content: string | null): Promise<boolean> {
        if (content === null) Promise.resolve(false);

        const lessTokens = await this.tokens.getTokensLess('Default');
        const fullpath = this.methods.getDsCssFilePath();
        const contentWithLessTokens = content + '\n' + lessTokens;
        const shortName = css.name;
        const ext = this.getExtension(shortName);

        await this.methods.setContentFile(shortName, ext, fullpath, content);
        // await this.methods.setContentFileDsMain();

        return new Promise((resolve, reject) => {
            mls.l2.compileLess(contentWithLessTokens).then(async (res) => {
                this.methods.setFileError(shortName, fullpath, ext, false);
                resolve(true);
            }).catch(async (err) => {
                this.methods.setFileError(shortName, fullpath, ext, true);
                reject(new Error(err.message));
            });
        });

    }

    private async _getCssGlobalLess(theme: string): Promise<string> {
        const preCompileLess = new PreCompileLess();
        const keys = Object.keys(this.list);
        const promisesDsLess = keys.map(async (css) => this.list[css].getContent());
        const resultsDsLess = await Promise.all(promisesDsLess);
        const lessStr = resultsDsLess.join('\n');
        const tokens = await this.tokens.getTokensLess(theme);
        const res = await preCompileLess.execute(lessStr, tokens, 'Default', this.ds.tokens.items as any, ':host', false);
        return res;

    }

    private async _setHTMLPreview(content: string): Promise<void> {

        const fullpath = this.methods.getDsCssFilePath();
        const key = mls.stor.getKeyToFiles(this._ds.project, 3, 'preview', fullpath, '.html');
        const previewFile = mls.stor.files[key];

        if (!previewFile) {
            await this.methods.createNewFile('preview', fullpath, 'html', content);
            return;
        }

        await this.methods.setContentFile('preview', 'html', fullpath, content);
    }

    private async _getHTMLPreview(): Promise<string> {

        const fullpath = this.methods.getDsCssFilePath();
        const key = mls.stor.getKeyToFiles(this._ds.project, 3, 'preview', fullpath, '.html');
        const previewFile = mls.stor.files[key];
        if (!previewFile) return '';
        const html = await this.methods.getContentFile('preview', 'html', fullpath);
        return html as string;

    }

}