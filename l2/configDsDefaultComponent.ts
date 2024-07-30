/// <mls shortName="configDsDefaultComponent" project="100554" enhancement="_blank" groupName="other" />
import { IDS, Common } from './_100554_configDsDefaultCommon';
import {
    DesignSystemIO,
    ComponentIO,
    TokenIO,
    CssIO,
    IComponentInfos,
    IComponentInfo
} from './_100554_libDesignSystem';

import { Token } from './_100554_configDsDefaultTokens2';
import { Css } from './_100554_configDsDefaultCss';
import { Example } from './_100554_configDsDefaultExample';
import { Style } from './_100554_configDsDefaultStyle';
import { PreCompileLess } from './_100554_configDsDefaultPreCompileLess';

export class Component extends ComponentIO {

    constructor(dsIO: DesignSystemIO, ds: IDS) {
        super(dsIO);
        this.ds = ds;
        this.methods = new Common(ds, dsIO);
        this.tokens = new Token(dsIO, ds);
        this.css = new Css(dsIO, ds);
        this.prepareComponents();
        this.examples = new Example(this._ds, this.ds, this);
        this.styles = new Style(this._ds, this.ds, this);
    }

    private ds: IDS;
    private methods: Common;
    private tokens: TokenIO;
    private css: CssIO;

    public list: IComponentInfos = {};
    public add = (widget: IComponentInfo) => this._addComponent(widget);
    public update = (name: string, widget: IComponentInfo) => this._updateComponent(name, widget);

    public remove = (componentName: string) => this._removeComponent(componentName);
    public getCSS = (componentName: string, theme: string) => this._getComponentCSS(componentName, theme);
    public getGuidelinesIO = (componentName: string) => this._getGuidelinesIO(componentName);
    public setGuidelinesIO = (componentName: string, content: string) => this._setGuidelinesIO(componentName, content);

    public getStylesLess = (componentName: string, theme: string) => this._getComponentStylesLess(componentName, theme);
    public find = (componentName: string) => this._find(componentName);
    public examples: Example;
    public styles: Style;

    private prepareComponents() {
        this.list = {};
        this.ds.components.items.forEach((comp) => {
            const newComp = { ...comp };
            this.list[comp.name] = newComp;
        });
    }

    private _find(componentName: string): IComponentInfo | null {
        return this.list[componentName];
    }

    private async _addComponent(component: IComponentInfo): Promise<void> {

        const componentByName = this.find(component.name);
        if (componentByName) throw new Error(`component: ${component.name} already exists`);
        this.list[component.name] = component;

        try {
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on add component:' + err.message));
        }
    }

    private async _updateComponent(componentName: string, widget: IComponentInfo): Promise<void> {

        const componentByName = this.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);

        if (componentByName.name !== widget.name) throw new Error(`component: ${componentByName.name} cannot change name`);

        componentByName.tags = widget.tags;
        componentByName.docPath = widget.docPath;
        componentByName.l4MarketingRef = widget.l4MarketingRef;
        componentByName.group = widget.group;
        componentByName.tags = widget.tags;

        try {
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on add component:' + err.message));
        }

    }

    private async _removeComponent(componentName: string): Promise<void> {

        const componentByName = this.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);
        const { examples, styles } = componentByName;
        const promises: Promise<boolean>[] = [];

        for (const ex of examples) {
            if (!ex.reference) promises.push(ex.setJsonPExampleIO(null as any));
        }
        for (const st of styles) {
            if (!st.reference) promises.push(st.setStyleLessIO(null as any));
        }

        await Promise.all(promises);
        delete this.list[componentName];

        try {
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on add component:' + err.message));
        }

    }

    private async _getComponentStylesLess(componentName: string, theme: string): Promise<string> {
        const componentByName = this.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);

        const preCompileLess = new PreCompileLess();
        const promisesComponentsStylesLess = componentByName.styles.map(async (st) => st.getStyleLessIO());
        const resultsComponentsStylesLess = await Promise.all(promisesComponentsStylesLess);
        const allCss = resultsComponentsStylesLess.join('\n');

        const tokens = await this.tokens.getTokensLess(theme);
        const res = await preCompileLess.execute(allCss, tokens, theme, this.ds.tokens.items as any, ':root', false);
        return res;
    }

    private async _getComponentCSS(componentName: string, theme: string): Promise<string> {
        const componentByName = this.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);

        // const tokens = await this.tokens.getTokensLess();
        const less = await this._getComponentStylesLess(componentName, theme);
        const globalcss = await this.css.getStylesInLess(theme);
        const allLess = [globalcss, less].join('\n');

        try {

            const preCompileLess = new PreCompileLess();
            const compiledCss = await preCompileLess.compileLess(allLess);
            return compiledCss;
        } catch (err: any) {
            throw new Error(`Error on compile Less on component: ${componentName} : ${err.message}`);
        }

    }

    private async _setGuidelinesIO(componentName: string, content: string): Promise<void> {

        const componentByName = this.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);
        let guidelinesRef = componentByName.l4MarketingRef;
        const fullpath = this.methods.getDsComponentFilePath(componentName);

        if (!guidelinesRef) {
            const guidelineName = `${componentByName.name}_guidelines`;
            componentByName.l4MarketingRef = guidelineName;
            guidelinesRef = guidelineName;
            await this.methods.createNewFile(guidelinesRef, fullpath, 'html', content);
            await this.methods.setContentFileDsMain();
            return;
        }
        await this.methods.setContentFileDsMain();
        await this.methods.setContentFile(guidelinesRef, 'html', fullpath, content);
    }

    private async _getGuidelinesIO(componentName: string): Promise<string> {

        const componentByName = this.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);
        const fullpath = this.methods.getDsComponentFilePath(componentName);

        const guidelinesRef = componentByName.l4MarketingRef;
        if (!guidelinesRef) return '';
        return await this.methods.getContentFile(guidelinesRef, 'html', fullpath) as string;

    }

}