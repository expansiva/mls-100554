/// <mls shortName="configDsDefault" project="100554" enhancement="_blank" groupName="other" />
import { IDS, Common } from './_100554_configDsDefaultCommon';
import { Doc } from './_100554_configDsDefaultDocs';
import { Token } from './_100554_configDsDefaultTokens2';
import { Asset } from './_100554_configDsDefaultAssets';
import { Css } from './_100554_configDsDefaultCss';
import { Component } from './_100554_configDsDefaultComponent';
import { PreCompileLess } from './_100554_configDsDefaultPreCompileLess';

import { list, DesignSystemIO, IDSRef, DocIO, CssIO, AssetIO, TokenIO, ComponentIO } from './_100554_libDesignSystem';

export class _100554_configDsDefault implements DesignSystemIO {

    constructor(project: number, dsindex: number) {
        this.project = project;
        this.dsindex = dsindex;
    }

    public project: number = 0;
    public dsindex: number = 0;
    public dsname: string = '';

    public createdBy: string = '';
    public lastUpdated: string = '';;
    public lastUpdatedBy: string = '';;

    public init = () => this._init();
    public dispose = () => this._dispose();
    public remove = () => this._remove();

    public create = (project: number, dsindex: number, createdAt: string, reference: mls.l3.IDSRef | any) => this._createDs(project, dsindex, createdAt, reference);
    public _getOriginalDsJSON = () => this.__getOriginalDsJSON();

    public getDesignSystemCss = (theme: string) => this._getDesignSystemCss(theme)

    private ds: IDS | undefined = undefined;

    public docs: DocIO | undefined;
    public components: ComponentIO | undefined;
    public tokens: TokenIO | undefined;
    public assets: AssetIO | undefined;
    public css: CssIO | undefined;

    private methods: Common = new Common(this.ds as IDS, this as any);


    private async _init() {

        if (this.ds) return;

        this.methods = new Common(this.ds, this as any);
        const projectDsDetails: mls.l5_common.DesignSystem[] = await list(this.project);
        const dsInfo = projectDsDetails[this.dsindex];
        // await this.prepareStorFiles(dsInfo.dsName);

        let mainDsFile;
        // mainDsFile = await this.methods.getContentFile(dsInfo.dsName, 'json', `ds/${dsInfo.dsName}`);
        mainDsFile = await this.methods.getContentFile(dsInfo.dsName, 'json', `ds/${dsInfo.dsName}`);

        if (!mainDsFile) {
            await this.createEmptyDS(dsInfo, 'Anonymous', undefined);
            mainDsFile = await this.methods.getContentFile(dsInfo.dsName, 'json', `ds/${dsInfo.dsName}`);
        };

        if (!mainDsFile) return;

        this.ds = JSON.parse(mainDsFile as string);
        if (!this.ds) return;

        this.methods = new Common(this.ds, this);
        this.dsname = this.ds.name;
        this.createdBy = this.ds.created_by;
        this.lastUpdated = this.ds.last_updated;
        this.lastUpdatedBy = this.ds.last_updated_by;

        this.docs = new Doc(this, this.ds);
        this.tokens = new Token(this, this.ds);
        this.assets = new Asset(this, this.ds);
        this.css = new Css(this, this.ds);
        this.components = new Component(this, this.ds);

    }

    private async _createDs(project: number, dsindex: number, createdAt: string, reference: IDSRef): Promise<void> {

        const projectDsDetails: mls.l5_common.DesignSystem[] = await list(project);
        const dsInfo = projectDsDetails[dsindex];
        this.methods = new Common(this.ds, this);

        const user: string = this.methods.getUser();
        const copyFromProjecy = 100554; // Collab WorksSpace

        const defaultProjectDsDetails: mls.l5_common.DesignSystem[] = await list(copyFromProjecy);
        const defaultDsInfo = defaultProjectDsDetails[0];

        if (!defaultDsInfo) {
            return this.createEmptyDS(dsInfo, user, reference); // Only first time, to create a first ds in system
        }

        return this.createDsByTemplate(defaultDsInfo, dsInfo, copyFromProjecy, user, reference);

    }

    private async createDsByTemplate(defaultDsInfo: mls.l5_common.DesignSystem, dsInfo: mls.l5_common.DesignSystem, project: number, user: string, reference: IDSRef) {

        await mls.stor.server.loadProjectInfoIfNeeded(project);

        let templateDs: IDS;
        try {

            const key = mls.stor.getKeyToFiles(project, 3, defaultDsInfo.dsName, `ds/${defaultDsInfo.dsName}`, '.json');
            const dsFile = mls.stor.files[key];
            if (!dsFile) throw new Error('Design system default dont exist');
            const mainDsFile = await dsFile.getContent();

            templateDs = JSON.parse(mainDsFile as string);
            templateDs.name = dsInfo.dsName;
            templateDs.created_by = user;
            templateDs.last_updated_by = user;
            templateDs.last_updated = this.methods.getDateNow();
            templateDs.created_by = user;
            await this.methods.createNewFile(templateDs.name, `ds/${templateDs.name}`, 'json', JSON.stringify(templateDs));
            await this.copyAllFilesDs(defaultDsInfo.dsName, project, templateDs.name);
            return Promise.resolve();

        } catch (err: any) {
            return Promise.reject(new Error('Error on create design system:' + err.message));
        }
    }

    private async createEmptyDS(dsInfo: mls.l5_common.DesignSystem, user: string, reference?: IDSRef) {
        const newDs: IDS = {
            name: dsInfo.dsName,
            created_by: user,
            last_updated: this.methods.getDateNow(),
            last_updated_by: user,
            reference,
            assets: { items: [] },
            components: { items: [] },
            docs: { items: [] },
            tokens: {
                items: [
                    {
                        "color": {
                            "text-primary-color-lighter": "#535353",
                            "text-primary-color-lighter-hover": "#5f5f5f",
                            "text-primary-color-lighter-focus": "#4a4a4a",
                            "text-primary-color-lighter-disabled": "#696969",
                            "text-primary-color": "#403f3f",
                            "text-primary-color-hover": "#4b4a4a",
                            "text-primary-color-focus": "#353434",
                            "text-primary-color-disabled": "#525151",
                            "text-primary-color-darker": "#000000",
                            "text-primary-color-darker-hover": "#1a1a1a",
                            "text-primary-color-darker-focus": "#0d0d0d",
                            "text-primary-color-darker-disabled": "#262626",
                            "text-secondary-color-lighter": "#408EC8",
                            "text-secondary-color-lighter-hover": "#4a9adb",
                            "text-secondary-color-lighter-focus": "#377bb0",
                            "text-secondary-color-lighter-disabled": "#629fd2",
                            "text-secondary-color": "#1C91CD",
                            "text-secondary-color-hover": "#2a9edb",
                            "text-secondary-color-focus": "#1786b7",
                            "text-secondary-color-disabled": "#55b4e1",
                            "text-secondary-color-darker": "#0F6FA9",
                            "text-secondary-color-darker-hover": "#1b7bb5",
                            "text-secondary-color-darker-focus": "#0c6495",
                            "text-secondary-color-darker-disabled": "#3a9ec1",
                            "bg-primary-color-lighter": "#ffffff",
                            "bg-primary-color-lighter-hover": "#f2f2f2",
                            "bg-primary-color-lighter-focus": "#e6e6e6",
                            "bg-primary-color-lighter-disabled": "#d9d9d9",
                            "bg-primary-color": "#ffffff",
                            "bg-primary-color-hover": "#f2f2f2",
                            "bg-primary-color-focus": "#e6e6e6",
                            "bg-primary-color-disabled": "#d9d9d9",
                            "bg-primary-color-darker": "#fafafa",
                            "bg-primary-color-darker-hover": "#f5f5f5",
                            "bg-primary-color-darker-focus": "#eeeeee",
                            "bg-primary-color-darker-disabled": "#e0e0e0",
                            "bg-secondary-color-lighter": "#F9F9F9",
                            "bg-secondary-color-lighter-hover": "#f4f4f4",
                            "bg-secondary-color-lighter-focus": "#efefef",
                            "bg-secondary-color-lighter-disabled": "#eaeaea",
                            "bg-secondary-color": "#E6E6E6",
                            "bg-secondary-color-hover": "#d9d9d9",
                            "bg-secondary-color-focus": "#cccccc",
                            "bg-secondary-color-disabled": "#bfbfbf",
                            "bg-secondary-color-darker": "#C0C0C0",
                            "bg-secondary-color-darker-hover": "#b3b3b3",
                            "bg-secondary-color-darker-focus": "#a6a6a6",
                            "bg-secondary-color-darker-disabled": "#999999",
                            "grey-color-lighter": "#F9FAFB",
                            "grey-color-light": "#F2F2F2",
                            "grey-color": "#E6E6E6",
                            "grey-color-dark": "#D3D3D3",
                            "grey-color-darker": "#C0C0C0",
                            "error-color": "#FF4D4F",
                            "error-color-hover": "#ff6666",
                            "error-color-focus": "#e63e3e",
                            "error-color-disabled": "#ff9999",
                            "success-color": "#52C41A",
                            "success-color-hover": "#66d93f",
                            "success-color-focus": "#4ca610",
                            "success-color-disabled": "#8cd78e",
                            "warning-color": "#FAAD14",
                            "warning-color-hover": "#fbbd34",
                            "warning-color-focus": "#e09a0e",
                            "warning-color-disabled": "#fdd55e",
                            "info-color": "#0a6dc9",
                            "info-color-hover": "#1b7edb",
                            "info-color-focus": "#006ab3",
                            "info-color-disabled": "#66a8e1",
                            "active-color": "#1890FF",
                            "active-color-hover": "#1a99ff",
                            "active-color-focus": "#0e80cc",
                            "active-color-disabled": "#66b3ff",
                            "link-color": "#1890FF",
                            "link-color-hover": "#1a99ff",
                            "link-color-focus": "#0e80cc",
                            "link-color-disabled": "#66b3ff",
                            "_dark-text-primary-color-lighter": "#FFFFFF",
                            "_dark-text-primary-color-lighter-hover": "#f2f2f2",
                            "_dark-text-primary-color-lighter-focus": "#e6e6e6",
                            "_dark-text-primary-color-lighter-disabled": "#d9d9d9",
                            "_dark-text-primary-color": "#e6edf3",
                            "_dark-text-primary-color-hover": "#d1d9e4",
                            "_dark-text-primary-color-focus": "#c3cfd8",
                            "_dark-text-primary-color-disabled": "#b0b8c4",
                            "_dark-text-primary-color-darker": "#8d96a0",
                            "_dark-text-primary-color-darker-hover": "#a1aab0",
                            "_dark-text-primary-color-darker-focus": "#7a828a",
                            "_dark-text-primary-color-darker-disabled": "#b1b7bd",
                            "_dark-text-secondary-color-lighter": "#5294c7",
                            "_dark-text-secondary-color-lighter-hover": "#63a2d8",
                            "_dark-text-secondary-color-lighter-focus": "#4787b2",
                            "_dark-text-secondary-color-lighter-disabled": "#78b0e0",
                            "_dark-text-secondary-color": "#56a8d1",
                            "_dark-text-secondary-color-hover": "#68b8e0",
                            "_dark-text-secondary-color-focus": "#4b9cc4",
                            "_dark-text-secondary-color-disabled": "#80c4e5",
                            "_dark-text-secondary-color-darker": "#bddef3",
                            "_dark-text-secondary-color-darker-hover": "#c7e3f5",
                            "_dark-text-secondary-color-darker-focus": "#a3c8e5",
                            "_dark-text-secondary-color-darker-disabled": "#d3e9f7",
                            "_dark-bg-primary-color-lighter": "#666666",
                            "_dark-bg-primary-color-lighter-hover": "#7a7a7a",
                            "_dark-bg-primary-color-lighter-focus": "#5c5c5c",
                            "_dark-bg-primary-color-lighter-disabled": "#808080",
                            "_dark-bg-primary-color": "#0d1117",
                            "_dark-bg-primary-color-hover": "#1a1f24",
                            "_dark-bg-primary-color-focus": "#0a0e13",
                            "_dark-bg-primary-color-disabled": "#2b3036",
                            "_dark-bg-primary-color-darker": "#262626",
                            "_dark-bg-primary-color-darker-hover": "#333333",
                            "_dark-bg-primary-color-darker-focus": "#1f1f1f",
                            "_dark-bg-primary-color-darker-disabled": "#404040",
                            "_dark-bg-secondary-color-lighter": "#636363",
                            "_dark-bg-secondary-color-lighter-hover": "#757575",
                            "_dark-bg-secondary-color-lighter-focus": "#4e4e4e",
                            "_dark-bg-secondary-color-lighter-disabled": "#808080",
                            "_dark-bg-secondary-color": "#161b22",
                            "_dark-bg-secondary-color-hover": "#1f2329",
                            "_dark-bg-secondary-color-focus": "#0f1418",
                            "_dark-bg-secondary-color-disabled": "#2c3238",
                            "_dark-bg-secondary-color-darker": "#4b3f3f",
                            "_dark-bg-secondary-color-darker-hover": "#5b4f4f",
                            "_dark-bg-secondary-color-darker-focus": "#3f2f2f",
                            "_dark-bg-secondary-color-darker-disabled": "#6a5c5c",
                            "_dark-grey-color-lighter": "#2B2B2B",
                            "_dark-grey-color-light": "#414141",
                            "_dark-grey-color": "#575757",
                            "_dark-grey-color-dark": "#6D6D6D",
                            "_dark-grey-color-darker": "#969494",
                            "_dark-error-color": "#f9676a",
                            "_dark-error-color-hover": "#ff7b7f",
                            "_dark-error-color-focus": "#e5565e",
                            "_dark-error-color-disabled": "#ff9b9e",
                            "_dark-success-color": "#63d42b",
                            "_dark-success-color-hover": "#75d93d",
                            "_dark-success-color-focus": "#55b825",
                            "_dark-success-color-disabled": "#8ade5f",
                            "_dark-warning-color": "#eead2b",
                            "_dark-warning-color-hover": "#f2b73d",
                            "_dark-warning-color-focus": "#d69c1f",
                            "_dark-warning-color-disabled": "#f5cd5c",
                            "_dark-info-color": "#0b81ef",
                            "_dark-info-color-hover": "#1a95f6",
                            "_dark-info-color-focus": "#0073d8",
                            "_dark-info-color-disabled": "#66b3ef",
                            "_dark-active-color": "#0b81ef",
                            "_dark-active-color-hover": "#1a95f6",
                            "_dark-active-color-focus": "#0073d8",
                            "_dark-active-color-disabled": "#66b3ef",
                            "_dark-link-color": "#0b81ef",
                            "_dark-link-color-hover": "#1a95f6",
                            "_dark-link-color-focus": "#0073d8",
                            "_dark-link-color-disabled": "#66b3ef"
                        },
                        "global": {
                            "breakpoint-small": "544px",
                            "breakpoint-medium": "768px",
                            "breakpoint-large": "1012px",
                            "transition-slow": "0.2s",
                            "transition-normal": "0.3s",
                            "transition-fast": "0.5s",
                            "space-base-unit": "0.25rem",
                            "space-8": "calc(@space-base-unit * 2)",
                            "space-16": "calc(@space-base-unit * 4)",
                            "space-24": "calc(@space-base-unit * 6)",
                            "space-32": "calc(@space-base-unit * 8)",
                            "space-40": "calc(@space-base-unit * 10)",
                            "space-48": "calc(@space-base-unit * 12)",
                            "space-64": "calc(@space-base-unit * 16)"
                        },
                        "typography": {
                            "font-base-unit": ".25rem",
                            "font-family-primary": "'Charlie Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                            "font-family-secondary": "serif",
                            "font-size-12": "calc(@font-base-unit * 3)",
                            "font-size-16": "calc(@font-base-unit * 4)",
                            "font-size-20": "calc(@font-base-unit * 5)",
                            "font-size-24": "calc(@font-base-unit * 6)",
                            "font-size-40": "calc(@font-base-unit * 10)",
                            "font-size-48": "calc(@font-base-unit * 12)",
                            "font-size-64": "calc(@font-base-unit * 16)",
                            "line-height-base-unit": "1",
                            "line-height-small": "calc(@line-height-base-unit * 1.1)",
                            "line-height-medium": "calc(@line-height-base-unit * 1.3)",
                            "line-height-large": "calc(@line-height-base-unit * 1.5)",
                            "font-weight-lighter": "100",
                            "font-weight-light": "200",
                            "font-weight-normal": "400",
                            "font-weight-bold": "700",
                            "font-weight-bolder": "900"
                        },
                        "themeName": "Default",
                        "description": "Tema padrão do projeto"
                    }

                ]
            },
            css: { items: [] }
        };

        try {
            await this.methods.createNewFile(newDs.name, `ds/${newDs.name}`, 'json', JSON.stringify(newDs)); // main json
            await this.methods.createNewFile('help', `ds/${newDs.name}/assets`, 'txt', 'Here upload your assets'); // main json
            await this._init();
            await this.docs?.add(0, 'getStarted', this.methods.docInitial); // doc initial
            await this.css?.add('definitions', this.methods.cssInitial); // css global
            return Promise.resolve();
        } catch (err: any) {
            return Promise.reject(new Error('Error on create design system:' + err.message));
        }
    }

    private async copyAllFilesDs(oldDsName: string, oldDsProject: number, newDsName: string): Promise<void> {
        const keys = Object.keys(mls.stor.files);
        for await (const key of keys) {
            if (key.startsWith(`${oldDsProject}_3_ds_${oldDsName}`) && !key.endsWith(`_3_ds_${newDsName}_${newDsName}.json`)) {
                const file = mls.stor.files[key];
                const content = await file.getContent();
                await this.methods.createNewFile(file.shortName, file.folder.replace(oldDsName, newDsName), file.extension, content);
            }
        }

    }

    private async _dispose(): Promise<void> {

        if (!this.ds) return;
        const key = `${this.project}_3_ds_${this.ds.name}_`;

        const filesKeys = Object.keys(mls.stor.files);
        const promises: Promise<boolean>[] = [];
        const promises2: Promise<mls.stor.IFileInfo | undefined>[] = [];

        for (const filesKey of filesKeys) {
            if (filesKey.startsWith(key)) {
                const file = mls.stor.files[filesKey];
                const fileInfoValue: mls.stor.IFileInfoValue = {
                    content: null,
                    contentType: undefined,
                };
                promises.push(mls.stor.localStor.setContent(file, fileInfoValue));
                if (file.status === 'new') delete mls.stor.files[filesKey];
                else {
                    mls.stor.files[filesKey].status = 'nochange';
                    mls.stor.files[filesKey].inLocalStorage = false;
                    promises2.push(mls.stor.addOrUpdateFile({
                        extension: file.extension,
                        folder: file.folder,
                        level: file.level,
                        project: file.project,
                        shortName: file.shortName,
                        versionRef: file.versionRef,
                    }));
                }

            }
        }
        await Promise.all(promises);
        await Promise.all(promises2);
        this.ds = undefined;

    }

    private async prepareStorFiles(dsname: string) {

        const filekeys = Object.keys(mls.stor.files);
        const dskey = `${this.project}_3_ds_${dsname}`;

        const readFiles = async () => {
            await Promise.all(filekeys.map(async (key) => {
                const file = mls.stor.files[key];
                if (key.startsWith(dskey)) {

                    file.onAction = (action: mls.stor.IFileInfoAction) => this.methods._onAction(action, file);
                    const info: mls.stor.IFileInfoValue | null = file.getValueInfo ? await file.getValueInfo() : null;
                    const haveInfo: boolean | null = info && !!info.content;
                    const src: string | Blob | null | undefined = haveInfo ? info?.content : await file.getContent();
                    let originalCRC: string | undefined;
                    if (typeof src === 'string') {
                        originalCRC = haveInfo ? info?.originalCRC : mls.common.crc.crc32(src).toString(16);
                    }
                    mls.stor.files[key].getValueInfo = () => this.methods._getValueInfo(file, undefined, undefined, undefined, originalCRC);
                }
            }));
        };

        await readFiles();

    }

    private async __getOriginalDsJSON(): Promise<IDS | undefined> {
        const projectDsDetails: mls.l5_common.DesignSystem[] = await list(this.project);
        const dsInfo = projectDsDetails[this.dsindex];
        let json: IDS | undefined;
        try {
            const mainDsFile = await this.methods.getContentFile(dsInfo.dsName, 'json', `ds/${dsInfo.dsName}`, true);
            json = JSON.parse(mainDsFile as string);
        } catch (err) {
            json = undefined;
        }
        return json;
    }

    private async _getDesignSystemCss(theme: string): Promise<string> {

        if (!this.css || !this.components) return '';
        const css = await this.css.getStylesInLess(theme);
        const allComponentsCss: string[] = [];

        for await (const component of Object.keys(this.components.list)) {
            try {
                const lessComponent = await this.components.getStylesLess(component, theme);
                if (lessComponent) {
                    allComponentsCss.push(`// widget: ${component} \n${lessComponent}\n`);
                }
            } catch (err) {
                console.info('err component:', component)
                continue;
            }
        }

        const allLess = `//global css\n${css}\n${allComponentsCss.join('\n')}`

        try {
            const preCompileLess = new PreCompileLess();
            const compiledCss = await preCompileLess.compileLess(allLess);
            return compiledCss;
        } catch (err: any) {
            throw new Error(`Error on compile all less : ${err.message}`);
        }


    }

    private async _remove(): Promise<void> {

    }

}