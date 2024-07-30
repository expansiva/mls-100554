/// <mls shortName="configDsDefaultStyle" project="100554" enhancement="_blank" groupName="other" />
import { IDS, Common } from './_100554_configDsDefaultCommon';
import { Token } from './_100554_configDsDefaultTokens';

export class Style extends mls.l3.Style {

    constructor(dsIO: mls.l3.DesignSystemIO, ds: IDS, component: mls.l3.Component) {
        super(dsIO);
        this.ds = ds;
        this.methods = new Common(ds, dsIO);;
        this.component = component;
        this.token = new Token(dsIO, ds);
        this.prepareStyles();
    }

    public list: mls.l3.IComponentsStyleInfos = {};
    public add = (componentName: string, stylename: string, less: string, reference?: mls.l3.IDSRef) => this._addComponentStyle(componentName, stylename, less, reference);
    public rename = (componentName: string, styleName: string, newName: string) => this._renameComponentStyle(componentName, styleName, newName);
    public remove = (componentName: string, styleName: string) => this._removeComponentStyle(componentName, styleName);
    public find = (componentName: string, styleName: string) => this._find(componentName, styleName);

    private ds: IDS;
    private methods: Common;
    private component: mls.l3.Component;
    private token: mls.l3.Token;

    private prepareStyles() {
        this.list = {};
        this.ds.components.items.forEach((comp) => {
            comp.styles.forEach((style) => {
                this._addComponentStyle2(this.component.list[comp.name], style);
            });
        });
    }

    private getKeyComponentStyle(componentName: string, styleName: string) {
        return `${componentName}_${styleName}`;
    }

    private _find(componentName: string, exampleName: string): mls.l3.IComponentsStyle | null {
        const key = this.getKeyComponentStyle(componentName, exampleName);
        return this.list[key];
    }

    private async _addComponentStyle(componentName: string, stylename: string, less: string, reference?: mls.l3.IDSRef): Promise<void> {

        const componentByName = this.component.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);
        const styleByName = this.find(componentName, stylename);
        if (styleByName) throw new Error(`style with name: ${stylename} already exists in component: ${componentName}`);

        const fullpath = this.methods.getDsComponentStyleFilePath(componentName);
        const newStyle: mls.l3.IComponentsStyle = {
            stylename,
            reference,
            setStyleLessIO: (): Promise<boolean> => { return Promise.resolve(true) },
            getStyleLessIO: (): Promise<string> => { return Promise.resolve('') },
        };

        this._addComponentStyle2(componentByName, newStyle);
        try {
            await this.methods.createNewFile(stylename, fullpath, 'less', less);
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on add style:' + err.message));
        }
    }

    private _addComponentStyle2(component: mls.l3.IComponentInfo, style: mls.l3.IComponentsStyle) {
        style.setStyleLessIO = (content: string) => this._setStyleLessIO(style, component.name, content);
        style.getStyleLessIO = () => this._getStyleLessIO(style, component.name);
        const key = this.getKeyComponentStyle(component.name, style.stylename);
        this.list[key] = style;
    }

    private async _removeComponentStyle(componentName: string, stylename: string): Promise<void> {

        const componentByName = this.component.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);
        const styleByName = this.find(componentName, stylename);
        if (!styleByName) throw new Error(`style: ${stylename} dont exists`);

        const fullpath = this.methods.getDsComponentStyleFilePath(componentName);
        try {
            if (!styleByName.reference) await this.methods.setContentFile(styleByName.stylename, 'less', fullpath, null);
            const key = this.getKeyComponentStyle(componentName, stylename);
            delete this.list[key];
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on remove style:' + err.message));
        }
    }

    private async _renameComponentStyle(componentName: string, stylename: string, newName: string): Promise<void> {

        const componentByName = this.component.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);
        const styleByName = this.find(componentName, stylename);
        if (!styleByName) throw new Error(`style: ${stylename} dont exists`);

        const fullpath = this.methods.getDsComponentStyleFilePath(componentName);
        const oldName = stylename;
        const styleNewName = this.find(componentName, newName);
        if (styleNewName) throw new Error(`style with name: ${newName} already exists in component: ${componentName}`);

        styleByName.stylename = newName;

        try {
            await this.methods.renameContentFile(oldName, 'less', fullpath, newName);
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on rename style :' + err.message));
        }
    }

    private async _getStyleLessIO(style: mls.l3.IComponentsStyle, componentName: string): Promise<string> {
        const shortName = style.stylename;
        const fullpath = this.methods.getDsComponentStyleFilePath(componentName);
        const content = await this.methods.getContentFile(shortName, 'less', fullpath);
        return content as string;
    }

    private async _setStyleLessIO(style: mls.l3.IComponentsStyle, componentName: string, content: string): Promise<boolean> {
        const shortName = style.stylename;
        const fullpath = this.methods.getDsComponentStyleFilePath(componentName);

        if (content === null) {
            await this._removeComponentStyle(componentName, style.stylename);
            return true;
        }

        const lessTokens = await this.token.getTokensLess();

        const contentWithLessTokens = content + '\n' + lessTokens;
        await this.methods.setContentFile(shortName, 'less', fullpath, content);
        // await this.methods.setContentFileDsMain();
        return new Promise((resolve, reject) => {
            mls.l2.compileLess(contentWithLessTokens).then(async (res) => {
                this.methods.setFileError(shortName, fullpath, 'less', false);
                resolve(true);
            }).catch((err) => {
                this.methods.setFileError(shortName, fullpath, 'less', true);
                reject(new Error(err.message));
            });
        });

    }

}