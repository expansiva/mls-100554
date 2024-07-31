/// <mls shortName="configDsDefault" project="100554" enhancement="_blank" groupName="other" />
import { IDS, Common } from './_100554_configDsDefaultCommon';
import { Doc } from './_100554_configDsDefaultDocs';
import { Token } from './_100554_configDsDefaultTokens2';
import { Asset } from './_100554_configDsDefaultAssets';
import { Css } from './_100554_configDsDefaultCss';
import { Component } from './_100554_configDsDefaultComponent';
import { list, DesignSystemIO, IDSRef } from './_100554_libDesignSystem';

export class _100554_configDsDefault extends DesignSystemIO {

    constructor(project: number, dsindex: number) {
        super();
        this.project = project;
        this.dsindex = dsindex;
    }

    public project: number = 0;
    public dsindex: number = 0;;
    public createdBy: string = '';
    public lastUpdated: string = '';;
    public lastUpdatedBy: string = '';;

    public init = () => this._init();
    public dispose = () => this._dispose();
    public remove = () => this._remove();

    public create = (project: number, dsindex: number, createdAt: string, reference: mls.l3.IDSRef | any) => this._createDs(project, dsindex, createdAt, reference);
    public _getOriginalDsJSON = () => this.__getOriginalDsJSON();

    private ds: IDS | undefined = undefined;

    public docs: Doc | undefined;
    public components: Component | undefined;
    public tokens: Token | undefined;
    public assets:Asset | undefined;
    public css: Css | undefined;

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

        if (!mainDsFile) return;

        this.ds = JSON.parse(mainDsFile as string);
        if (!this.ds) return;

        this.methods = new Common(this.ds, this as any);
        this.createdBy = this.ds.created_by;
        this.lastUpdated = this.ds.last_updated;
        this.lastUpdatedBy = this.ds.last_updated_by;

        this.docs = new Doc(this as any, this.ds);
        this.tokens = new Token(this as any, this.ds);
        this.assets = new Asset(this as any, this.ds);
        this.css = new Css(this as any, this.ds);
        this.components = new Component(this as any, this.ds);

    }

    private async _createDs(project: number, dsindex: number, createdAt: string, reference: IDSRef): Promise<void> {

        const projectDsDetails: mls.l5_common.DesignSystem[] = await list(project);
        const dsInfo = projectDsDetails[dsindex];
        this.methods = new Common(this.ds, this as any);

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

    private async createEmptyDS(dsInfo: mls.l5_common.DesignSystem, user: string, reference: IDSRef) {
        const newDs: IDS = {
            name: dsInfo.dsName,
            created_by: user,
            last_updated: this.methods.getDateNow(),
            last_updated_by: user,
            reference,
            assets: { items: [] },
            components: { items: [] },
            docs: { items: [] },
            tokens: { items: [] },
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

    private async _remove(): Promise<void> {

    }

}