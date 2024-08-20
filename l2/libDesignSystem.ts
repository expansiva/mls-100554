/// <mls shortName="libDesignSystem" project="100554" enhancement="_blank" groupName="other" />
import { getConfigProject } from './_100554_libProjectConfig'
const instanceCache: IDSInstanceCache = {};

export async function list(project: number) {
    const config = await getConfigProject(project);
    if(!config) return [];
    const ds: mls.l5_common.DesignSystem[] = config.designSystems || [];
    return ds;
}

export async function getDSInstance(project: number, dsindex: number): Promise<DesignSystemIO> {
    const instance = await _getDsInstance(project, dsindex);
    return instance;
}

async function _getDsInstance(project: number, dsindex: number): Promise<DesignSystemIO> {
    const dsProjectList = await list(project);
    const dsInfo = dsProjectList[dsindex];
    if (!dsInfo) throw new Error(`Design system: ${dsindex} dont exist in project: ${project}`);
    //const instance: DesignSystemIO = mls.l3['getOrCreateDSInstanceIO'](project, dsindex, dsInfo.widgetIOName);
    const instance: DesignSystemIO = await getOrCreateDSInstanceIO(project, dsindex, '_100554_configDsDefault');
    if (!instance) throw new Error('Invalid ds instance!');
    return instance;
}

export async function getOrCreateDSInstanceIO(project: number, dsindex: number, widgetIOName: string): Promise<DesignSystemIO> {
    const dskey = getKeyDs(project, dsindex);
    if (!instanceCache[dskey]) {
        const importKey = './' + widgetIOName;
        const dsImport = await import(importKey);
        const instance: DesignSystemIO = new (dsImport as any)[widgetIOName](project, dsindex);
        instanceCache[dskey] = instance;
    }
    return instanceCache[dskey];
};

function getKeyDs(project: number, dsindex: number): string {
    const key = `_${project}_${dsindex}`;
    return key;
};


interface IDSInstanceCache {
    [key: string]: DesignSystemIO;
}

interface IProjectConfigCache {
    [key: number]: {
        versionRef: string;
        config: mls.l5_common.ProjectConfig;
    }
}

export abstract class DesignSystemIO {
    abstract project: number;
    abstract dsindex: number;
    abstract createdBy: string;
    abstract lastUpdated: string;
    abstract lastUpdatedBy: string;
    abstract docs: DocIO | undefined;
    abstract tokens: TokenIO | undefined;
    abstract css: CssIO | undefined;
    abstract assets: AssetIO | undefined;
    abstract components: ComponentIO | undefined;
    abstract init: () => Promise<void>;
    abstract remove: () => Promise<void>;
    abstract create: (project: number, dsindex: number, createdAt: string, reference?: IDSRef) => Promise<void>;
    abstract dispose: () => Promise<void>;
}

export abstract class TokenIO {
    constructor(ds: DesignSystemIO) {
        this._ds = ds;
    };
    _ds: DesignSystemIO;
    abstract list: ITokenInfo;
    abstract add: (key: string, value: string, theme: string, category: TokensCategories) => Promise<void>;
    abstract getTokensLess: (theme: string) => Promise<string>;
    abstract getTokensCss: (theme: string) => Promise<string>;
    abstract update: (key: string, newValue: string, theme: string) => Promise<void>;
    abstract remove: (key: string, theme: string) => Promise<void>;
    abstract addTheme: (theme: string, description: string) => Promise<void>;
    abstract removeTheme: (theme: string) => Promise<void>;
    abstract setTokens: (theme: string, tokensColor: IToken, tokensTypography: IToken, tokensGlobal: IToken) => Promise<void>;
}

export abstract class DocIO {
    constructor(ds: DesignSystemIO) {
        this._ds = ds;
    }
    _ds: DesignSystemIO;
    abstract list: IDocInfos;
    abstract find: (id: number) => IDocInfo | null;
    abstract add: (parentID: number, title: string, content: string) => Promise<number>;
    abstract update: (id: number, parentID: number, title: string, content: string) => Promise<void>;
    abstract remove: (id: number) => Promise<void>;
}
export abstract class AssetIO {
    constructor(ds: DesignSystemIO) {
        this._ds = ds;
    }
    _ds: DesignSystemIO;
    abstract list: IAssetInfos;
    abstract add: (path: string, shortname: string, tags: string[], description: string, assetType: mls.l3.AssetsGroupType, content: File, reference?: mls.l3.IDSRef) => Promise<void>;
    abstract remove: (path: string, shortname: string) => Promise<void>;
    abstract update: (path: string, shortname: string, tags: string[], description: string, assetType: mls.l3.AssetsGroupType) => Promise<void>;
    abstract find: (path: string, shortname: string) => IAssetsInfo | null;
}

export abstract class CssIO {
    constructor(ds: DesignSystemIO) {
        this._ds = ds;
    }
    _ds: DesignSystemIO;
    abstract list: ICssInfos;
    abstract getStylesInLess: (theme: string) => Promise<string>;
    abstract add: (name: string, content: string) => Promise<void>;
}
export abstract class ComponentIO {
    constructor(ds: DesignSystemIO) {
        this._ds = ds;
    }
    _ds: DesignSystemIO;
    abstract list: IComponentInfos;
    abstract examples: ExampleIO;
    abstract styles: StyleIO;
    abstract add: (widget: IComponentInfo) => Promise<void>;
    abstract remove: (componentName: string) => Promise<void>;
    abstract getCSS: (componentName: string, theme: string) => Promise<string>;
    abstract getStylesLess: (componentName: string, theme: string) => Promise<string | null>;
    abstract find: (componentName: string) => IComponentInfo | null;
}
export abstract class ExampleIO {
    constructor(ds: DesignSystemIO) {
        this._ds = ds;
    }
    _ds: DesignSystemIO;
    abstract list: IComponentsExampleInfos;
    abstract add: (componentName: string, exampleName: string, description: string, exampleJsonP: string, reference?: mls.l3.IDSRef) => Promise<void>;
    abstract rename: (componentName: string, exampleName: string, newExampleName: string) => Promise<void>;
    abstract remove: (componentName: string, exampleName: string) => Promise<void>;
    abstract find: (componentName: string, exampleName: string) => IComponentsExample | null;
}
export abstract class StyleIO {
    constructor(ds: DesignSystemIO) {
        this._ds = ds;
    }
    _ds: DesignSystemIO;
    abstract list: IComponentsStyleInfos;

    abstract add: (componentName: string, classname: string, less: string, reference?: mls.l3.IDSRef) => Promise<void>;
    abstract rename: (componentName: string, styleName: string, newName: string) => Promise<void>;
    abstract remove: (componentName: string, styleName: string) => Promise<void>;
    abstract find: (componentName: string, styleName: string) => IComponentsStyle | null;
}

export interface IDSRef {
    project: number;
    dsindex: number;
    referenceAt?: Date;
    index?: number;
}

export type ITokenInfo = {
    [key: string]: ITokenInfo2;
}

export type ITokenInfo2 = {
    // [key in TokensCategories]: IToken;
    color: IToken,
    typography: IToken,
    global: IToken,
    description: string

};

export type IToken = {
    [key: string]: string
}

export type TokensCategories = 'color' | 'typography' | 'global';

export interface ITokens {
    themeName: string,
    description: string,
    color: IToken,
    typography: IToken,
    global: IToken
}

export interface IDocInfos {
    [id: number]: IDocInfo;
}

export interface IDocInfo {
    id: number;
    parentID: number;
    title: string;
    getContent: (this: IDocInfo) => Promise<string>;
    setContent: (this: IDocInfo, content: string | null) => Promise<boolean>;
}

export interface IAssetInfos {
    [fullpath: string]: IAssetsInfo;
}
export interface IAssetsInfo {
    path: string;
    shortname: string;
    type: AssetsGroupType;
    src: string;
    description: string;
    tags: string[];
    content: string;
    reference: IDSRef;
}

export interface ICssInfos {
    [name: string]: ICssInfo;
}
export interface ICssInfo {
    name: string;
    getContent: (this: ICssInfo) => Promise<string>;
    setContent: (this: ICssInfo, content: string | null) => Promise<boolean>;
}

export interface IComponentsStyleInfos {
    [stylename: string]: IComponentsStyle;
}
export interface IComponentsStyle {
    stylename: string;
    reference?: IDSRef;
    getStyleLessIO: (this: IComponentsStyle) => Promise<string>;
    setStyleLessIO: (this: IComponentsStyle, content: string) => Promise<boolean>;
}

export interface IComponentInfos {
    [name: string]: IComponentInfo;
}
export interface IComponentInfo {
    name: string;
    l4MarketingRef: string;
    widgetExampleRef: IWCGeneratorExampleInfo;
    docPath: string;
    group: ComponentsGroups;
    tags: string[];
    reference: IDSRef;
    examples: IComponentsExample[];
    styles: IComponentsStyle[];
}
export interface IWCGeneratorExampleInfo {
    tagname: string;
    path: string;
}
export interface IComponentsExampleInfos {
    [exampleName: string]: IComponentsExample;
}
export interface IComponentsExample {
    exampleName: string;
    description: string;
    reference: IDSRef;
    getEl: (this: IComponentsExample) => Promise<HTMLElement>;
    getJsonPExampleIO: (this: IComponentsExample) => Promise<string>;
    setJsonPExampleIO: (this: IComponentsExample, content: string) => Promise<boolean>;
}

export type AssetsGroupType = 'image' | 'video' | 'icon' | 'lib' | 'other';
export type ComponentsGroups = 'selectOne' | 'selectMultiple' | 'action' | 'layout' | 'midia' | 'navigation';
