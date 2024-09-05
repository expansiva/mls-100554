/// <mls shortName="configDsDefaultExample" project="100554" enhancement="_blank" groupName="other" />

import { IDS, Common } from './_100554_configDsDefaultCommon';
import {
    ExampleIO,
    ComponentIO,
    DesignSystemIO,
    IComponentsExampleInfos,
    IComponentsExample,
    IComponentInfo,
    IDSRef
} from './_100554_libDesignSystem';

export class Example implements ExampleIO {

    constructor(dsIO: DesignSystemIO, ds: IDS, component: ComponentIO) {
        this._ds = dsIO;
        this.ds = ds;
        this.methods = new Common(ds, dsIO);
        this.component = component;
        this.prepareExamples();
    }

    private ds: IDS;

    private methods: Common;
    private component: ComponentIO;
    
    public _ds: DesignSystemIO;
    public list: IComponentsExampleInfos = {};
    public add = (componentName: string, exampleName: string, description: string, exampleJsonP: string, reference?: mls.l3.IDSRef) => this._addComponentExample(componentName, exampleName, description, exampleJsonP, reference);
    public update = (componentName: string, exampleName: string, description: string) => this._updateExample(componentName, exampleName, description); // need add
    public rename = (componentName: string, exampleName: string, newName: string) => this._renameExample(componentName, exampleName, newName);
    public remove = (componentName: string, exampleName: string) => this._removeComponentExample(componentName, exampleName);
    public find = (componentName: string, exampleName: string) => this._find(componentName, exampleName)

    private prepareExamples() {
        this.list = {};
        this.ds.components.items.forEach((comp) => {
            comp.examples.forEach((style) => {
                this._addComponentExample2(this.component.list[comp.name], style);
            });
        });
    }

    private getKeyComponentExample(componentName: string, exampleName: string) {
        return `${componentName}_${exampleName}`;
    }

    private _find(componentName: string, exampleName: string): IComponentsExample | null {
        const key = this.getKeyComponentExample(componentName, exampleName);
        return this.list[key];
    }

    private async _addComponentExample(componentName: string, exampleName: string, description: string, exampleJsonP: string, reference?: IDSRef): Promise<void> {

        const componentByName = this.component.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);
        const exampleByTitle = this.find(componentName, exampleName);
        if (exampleByTitle) throw new Error(`example with name: ${exampleName} already exists in component: ${componentName}`);

        const fullpath = this.methods.getDsComponentExampleFilePath(componentName);
        const newExample: IComponentsExample = {
            exampleName,
            description,
            getEl: (): Promise<HTMLElement> => { return Promise.resolve(document.createElement('div')) },
            getJsonPExampleIO: (): Promise<string> => { return Promise.resolve('') },
            reference: reference as mls.l3.IDSRef,
            setJsonPExampleIO: (): Promise<boolean> => { return Promise.resolve(true) },
        };

        this._addComponentExample2(componentByName, newExample);

        try {
            await this.methods.createNewFile(exampleName, fullpath, 'txt', exampleJsonP);
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on add example:' + err.message));
        }
    }

    private _addComponentExample2(component: IComponentInfo, example: IComponentsExample) {
        example.getEl = () => this._getExampleEl(example);
        example.getJsonPExampleIO = () => this._getJsonPExampleIO(example, component.name);
        example.setJsonPExampleIO = (content: string | null) => this._setJsonPExampleIO(example, component.name, content);
        const key = this.getKeyComponentExample(component.name, example.exampleName)
        this.list[key] = example;
    }

    private async _updateExample(componentName: string, exampleName: string, description: string): Promise<void> {

        const componentByName = this.component.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);
        const exampleByName = this.find(componentName, exampleName);
        if (!exampleByName) throw new Error(`example dont's exists in component: ${componentName}`);

        exampleByName.description = description;

        try {
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on add example:' + err.message));
        }
    }

    private async _renameExample(componentName: string, exampleName: string, newName: string): Promise<void> {

        const componentByName = this.component.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);
        const exampleByName = this.find(componentName, exampleName);
        if (!exampleByName) throw new Error(`example dont's exists in component: ${componentName}`);

        const fullpath = this.methods.getDsComponentExampleFilePath(componentName);
        const oldTitle = exampleName;
        const exampleByTitle = this.find(componentName, newName);
        if (exampleByTitle) throw new Error(`example with name: ${newName} already exists in component: ${componentName}`);
        exampleByName.exampleName = newName;

        try {
            await this.methods.renameContentFile(oldTitle, 'txt', fullpath, newName);
            await this.methods.setContentFileDsMain();
            this.prepareExamples();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on add example:' + err.message));
        }
    }

    private async _removeComponentExample(componentName: string, exampleName: string): Promise<void> {

        const componentByName = this.component.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);
        const exampleByName = this.find(componentName, exampleName)
        if (!exampleByName) throw new Error(`example dont's exists in component: ${componentName}`);
        const fullpath = this.methods.getDsComponentExampleFilePath(componentName);

        try {
            if (!exampleByName.reference) await this.methods.setContentFile(exampleByName.exampleName, 'txt', fullpath, null);
            const key = this.getKeyComponentExample(componentName, exampleName);
            delete this.list[key];
            await this.methods.setContentFileDsMain();
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on remove style:' + err.message));
        }
    }

    private async _getExampleEl(example: IComponentsExample): Promise<HTMLElement> {
        const jsonp = await example.getJsonPExampleIO();
        const node = (window as any).l2_html.BaseHtml.createAndDeserialize(jsonp);
        const elExample = node.renderHTML();
        return elExample;
    }

    private async _getJsonPExampleIO(example: IComponentsExample, componentName: string): Promise<string> {
        const shortName = example.exampleName;
        const fullpath = this.methods.getDsComponentExampleFilePath(componentName);
        const content = await this.methods.getContentFile(shortName, 'txt', fullpath);
        return content as string;
    }

    private async _setJsonPExampleIO(example: IComponentsExample, componentName: string, content: string | null): Promise<boolean> {

        const componentByName = this.component.find(componentName);
        if (!componentByName) throw new Error(`component: ${componentName} dont exists`);

        const shortName = example.exampleName;
        const fullpath = this.methods.getDsComponentExampleFilePath(componentName);

        if (content === null) {
            await this._removeComponentExample(componentName, example.exampleName);
            return true;
        }
        await this.methods.setContentFile(shortName, 'txt', fullpath, content);
        await this.methods.setContentFileDsMain();
        return true;
    }

}