/// <mls shortName="configDsDefaultCommon" project="100554" enhancement="_blank" groupName="other" />
import { DesignSystemIO, ITokens, TokensCategories } from './_100554_libDesignSystem';
export class Common {

    constructor(ds: IDS | undefined, dsIO: DesignSystemIO) {
        this.ds = ds;
        this.dsIO = dsIO;
    }

    private ds: IDS | undefined;

    private dsIO: DesignSystemIO;

    public getUser(): string {
        return (mls.api as any)['common'].getCookie("loginUser") || '';
    }

    public getDateNow(): string {
        return new Date().toISOString();
    }

    public getDsMlsFilePath(): string {
        if (!this.ds) throw new Error('Design system not loaded yet');
        return `ds/${this.ds.name}`;
    }

    public getDocsMlsFilePath(): string {
        if (!this.ds) throw new Error('Design system not loaded yet');
        return `ds/${this.ds.name}/docs`;
    }

    public getDsCssFilePath(): string {
        if (!this.ds) throw new Error('Design system not loaded yet');
        return `ds/${this.ds.name}/css`;
    }

    public getDsComponentFilePath(componentName: string): string {
        if (!this.ds) throw new Error('Design system not loaded yet');
        const comp = componentName.replace(/_/g, '-');
        return `ds/${this.ds.name}/components/${comp}`;
    }

    public getDsComponentExampleFilePath(componentName: string): string {
        if (!this.ds) throw new Error('Design system not loaded yet');
        const comp = componentName.replace(/_/g, '-');
        return `ds/${this.ds.name}/components/${comp}/examples`;
    }

    public getDsComponentStyleFilePath(componentName: string): string {
        if (!this.ds) throw new Error('Design system not loaded yet');
        const comp = componentName.replace(/_/g, '-');
        return `ds/${this.ds.name}/components/${comp}/styles`;
    }

    public getStorFileName(shortName: string, folder: string, extension: string): string {
        return mls.stor.getKeyToFiles(this.dsIO.project, 3, shortName, folder, extension);
    }

    public updateLastModified() {
        if (!this.ds) return;
        this.ds.last_updated_by = this.getUser();
        this.ds.last_updated = this.getDateNow();
    }

    public async createNewFile(shortName: string, folder: string, extension: string, content: string | Blob | null) {
        if (!extension.startsWith('.')) extension = '.' + extension;
        await this.getFileWithNewStatus(shortName, folder, extension, 'new', content);

    }

    public async setContentFileDsMain() {
        if (!this.ds) throw new Error('Design system not loaded yet');
        this.updateLastModified();
        this.mergeJSON();
        const fullpath = this.getDsMlsFilePath();
        const content = JSON.stringify(this.ds);
        return this.setContentFile(this.ds.name, 'json', fullpath, content);
    }

    private mergeJSON() {

        if (!this.ds ||
            !this.dsIO.assets ||
            !this.dsIO.tokens ||
            !this.dsIO.components ||
            !this.dsIO.assets ||
            !this.dsIO.css ||
            !this.dsIO.docs
        ) return;


        const assetsKeys = Object.keys(this.dsIO.assets.list);
        const tokensKeys = Object.keys(this.dsIO.tokens.list);
        const componentsKeys = Object.keys(this.dsIO.components.list);
        const examplesKeys = Object.keys(this.dsIO.components.examples.list);
        const stylesKeys = Object.keys(this.dsIO.components.styles.list);
        const cssKeys = Object.keys(this.dsIO.css.list);
        const docsKeys = Object.keys(this.dsIO.docs.list);

        this.ds.docs.items = [];
        this.ds.css.items = [];
        this.ds.components.items = [];
        this.ds.tokens.items = [];
        this.ds.assets.items = [];

        docsKeys.forEach((keyDoc) => {
            if (!this.ds || !this.dsIO.docs) return;
            this.ds.docs.items.push(this.dsIO.docs.list[+keyDoc]);
        });
        cssKeys.forEach((keyCss) => {
            if (!this.ds || !this.dsIO.css) return;
            this.ds.css.items.push(this.dsIO.css.list[keyCss]);
        });
        assetsKeys.forEach((keyAsset) => {
            if (!this.ds || !this.dsIO.assets) return;
            this.ds.assets.items.push(this.dsIO.assets.list[keyAsset]);
        });
        tokensKeys.forEach((theme) => {

            if (!this.ds || !this.dsIO.tokens) return;
            const list = this.dsIO.tokens.list;
            if (!this.ds) return;
            let obj: ITokens | undefined = (this.ds.tokens.items as ITokens[]).find((item) => { item.themeName == theme });
            if (!obj) {
                obj = {
                    color: {},
                    global: {},
                    typography: {},
                    themeName: theme,
                    description: list[theme].description
                }
            }

            const cats = Object.keys(list[theme]);
            cats.forEach((cat) => {
                if (obj && !obj[cat as TokensCategories] && cat !== 'description') {
                    obj[cat as TokensCategories] = {}
                }
                const tokens = Object.keys(list[theme][cat as TokensCategories]);

                tokens.forEach((tok) => {
                    if (!obj || cat === 'description') return;
                    obj[cat as TokensCategories][tok] = list[theme][cat as TokensCategories][tok]
                });
            });

            this.ds.tokens.items.push(obj);

        });

        componentsKeys.forEach((keyComp) => {
            if (!this.ds || !this.dsIO.components) return;

            const comp = this.dsIO.components.list[keyComp];
            comp.examples = [];
            comp.styles = [];

            examplesKeys.forEach((keyEx) => {
                if (!this.dsIO.components) return;
                const parts = keyEx.split('_');
                const compName = '_' + [parts[1], parts[2]].join('_');
                if (compName === keyComp) comp.examples.push(this.dsIO.components.examples.list[keyEx]);
            });

            stylesKeys.forEach((keySty) => {
                if (!this.dsIO.components) return;
                const parts = keySty.split('_');
                const compName = '_' + [parts[1], parts[2]].join('_');
                if (compName === keyComp) comp.styles.push(this.dsIO.components.styles.list[keySty]);
            });
            this.ds.components.items.push(comp);

        });
    }

    public async setContentFile(shortName: string, extension: string, fullpath: string, content: string | Blob | null) {

        let file: mls.stor.IFileInfo;
        if (!extension.startsWith('.')) extension = '.' + extension;
        if (!content) file = await this.getFileWithNewStatus(shortName, fullpath, extension, 'deleted', content);
        else file = await this.getFileWithNewStatus(shortName, fullpath, extension, 'changed', content);
        mls.events.fire(3, 'DSChanged' as any);
        return true;

    }

    public async renameContentFile(shortName: string, extension: string, fullpath: string, newName: string) {
        await this.getFileWithNewStatus(shortName, fullpath, extension, 'renamed', null, newName);
        return true;
    }

    public async getFileWithNewStatus(
        shortName: string,
        folder: string,
        extension: string,
        newStatus: mls.stor.IFileInfoStatus,
        content: string | Blob | null,
        newName?: string
    ): Promise<mls.stor.IFileInfo> {

        if (!extension.startsWith('.')) extension = '.' + extension;
        const key = mls.stor.getKeyToFiles(this.dsIO.project, 3, shortName, folder, extension);
        let file = mls.stor.files[key];

        if (!file && newStatus !== 'new') throw new Error('Invalid status for nonexistent file');
        const actualStatus = file ? file.status : 'nochange';
        let sameContent: boolean = false;
        let oldValueInfo: mls.stor.IFileInfoValue | undefined;

        if (file && file.getValueInfo) {
            oldValueInfo = await file.getValueInfo();
            if (typeof content === 'string') sameContent = oldValueInfo.originalCRC === mls.common.crc.crc32(content).toString(16);
            file.getValueInfo = () => this._getValueInfo(file, oldValueInfo?.originalShortName, oldValueInfo?.originalFolder, oldValueInfo?.originalProject, oldValueInfo?.originalCRC);
            file.onAction = (action: mls.stor.IFileInfoAction) => this._onAction(action, file);
        }

        if (newStatus === 'new') file = await this.onChangeStatusToNew(shortName, extension, folder, content);
        else if (newStatus === 'changed' && actualStatus === 'new') file = await this.onChangeStatusNewToChanged(file, content);
        else if (newStatus === 'deleted' && actualStatus === 'new') file = await this.onChangeStatusNewToDeleted(file);
        else if (newStatus === 'renamed' && actualStatus === 'new' && newName) file = await this.onChangeStatusNewToRenamed(file, newName, folder, extension);
        else if (newStatus === 'renamed' && actualStatus === 'renamed' && newName) file = await this.onChangeStatusRenamedToRenamed(file, newName, file.folder, file.extension);
        else if (newStatus === 'changed' && actualStatus === 'renamed') file = await this.onChangeStatusRenamedToChanged(file, content);
        else if (newStatus === 'renamed' && newName) file = await this.onChangeStatusToRenamed(file, newName, file.folder);
        else if (newStatus === 'deleted') file = await this.onChangeStatusToDeleted(file);

        else {
            const contentType = typeof content === 'string' ? 'string' : 'blob';
            const fileInfo: mls.stor.IFileInfoValue = {
                content,
                contentType,
                originalCRC: oldValueInfo?.originalCRC
            };
            file.status = newStatus;

            if (sameContent && newStatus === 'changed') {
                file.status = 'nochange';
                await mls.stor.localStor.setContent(file, { content: null }); // clear localstorage
                file.inLocalStorage = false;
                return file;
            }

            await mls.stor.localStor.setContent(file, fileInfo);
        }

        file.inLocalStorage = true;
        return file;

    }

    public async onChangeStatusToNew(shortName: string, extension: string, folder: string, content: string | Blob | null): Promise<mls.stor.IFileInfo> {

        const params = {
            project: this.dsIO.project,
            level: 3,
            shortName,
            extension,
            versionRef: '0',
            folder
        };
        const file = await mls.stor.addOrUpdateFile(params);
        if (!file) throw new Error('Error on update or add File');
        file.status = 'new';

        file.getValueInfo = () => this._getValueInfo(file);
        file.onAction = (action: mls.stor.IFileInfoAction) => this._onAction(action, file);
        const contentType = typeof content === 'string' ? 'string' : 'blob';
        const fileInfo: mls.stor.IFileInfoValue = {
            content,
            contentType,
        };
        await mls.stor.localStor.setContent(file, fileInfo);
        return file;
    }

    public async onChangeStatusNewToDeleted(file: mls.stor.IFileInfo): Promise<mls.stor.IFileInfo> {
        file.status = 'nochange';
        const fileInfo: mls.stor.IFileInfoValue = {
            content: null,
            contentType: undefined,
        };
        await mls.stor.localStor.setContent(file, fileInfo);
        const keyOld = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, file.extension);
        delete mls.stor.files[keyOld];
        return file;
    }

    public async onChangeStatusNewToChanged(file: mls.stor.IFileInfo, content: string | Blob | null): Promise<mls.stor.IFileInfo> {
        const contentType = typeof content === 'string' ? 'string' : 'blob';
        const fileInfo: mls.stor.IFileInfoValue = {
            content,
            contentType,
        };
        file.status = 'new';
        await mls.stor.localStor.setContent(file, fileInfo);
        return file;
    }

    public async onChangeStatusRenamedToRenamed(file: mls.stor.IFileInfo, newName: string, folder: string, extension: string): Promise<mls.stor.IFileInfo> {

        if (!file.getValueInfo) throw new Error('Invalid getValueInfo');
        const oldValueInfo = await file.getValueInfo();
        const fileInfoOld: mls.stor.IFileInfoValue = { content: null, contentType: undefined };
        const keyOld = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, file.extension);
        const keyRenamed = mls.stor.getKeyToFiles(this.dsIO.project, 3, newName, folder, extension);

        const params = {
            project: this.dsIO.project,
            level: file.level,
            shortName: newName,
            extension,
            versionRef: file.versionRef,
            folder
        };

        await mls.stor.addOrUpdateFile(params);
        const newFile = mls.stor.files[keyRenamed];
        newFile.status = 'renamed';
        newFile.inLocalStorage = true;
        newFile.getValueInfo = () => this._getValueInfo(file, newName, folder, this.dsIO.project, '');
        newFile.onAction = (action: mls.stor.IFileInfoAction) => this._onAction(action, newFile);

        const fileInfoValue: mls.stor.IFileInfoValue = {
            content: oldValueInfo.content,
            contentType: oldValueInfo.contentType,
            originalFolder: oldValueInfo.originalFolder,
            originalProject: oldValueInfo.originalProject,
            originalShortName: oldValueInfo.originalShortName,
        };

        await mls.stor.localStor.setContent(newFile, fileInfoValue);
        await mls.stor.localStor.setContent(file, fileInfoOld);
        delete mls.stor.files[keyOld];
        return newFile;

    }

    public async onChangeStatusRenamedToChanged(file: mls.stor.IFileInfo, content: string | Blob | null): Promise<mls.stor.IFileInfo> {

        if (!file.getValueInfo) throw new Error('Invalid getValueInfo');
        const valueInfo = await file.getValueInfo();
        const fileInfo: mls.stor.IFileInfoValue = {
            ...valueInfo,
            content
        };
        file.status = 'renamed';
        await mls.stor.localStor.setContent(file, fileInfo);
        return file;
    }

    public async onChangeStatusNewToRenamed(file: mls.stor.IFileInfo, newName: string, folder: string, extension: string): Promise<mls.stor.IFileInfo> {

        const oldContent = await file.getContent();
        const fileInfoOld: mls.stor.IFileInfoValue = { content: null, contentType: undefined };
        await mls.stor.localStor.setContent(file, fileInfoOld);
        const keyOld = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, file.extension);
        delete mls.stor.files[keyOld];

        const keyRenamed = mls.stor.getKeyToFiles(this.dsIO.project, 3, newName, folder, extension);
        const params = {
            project: this.dsIO.project,
            level: 3,
            shortName: newName,
            extension,
            versionRef: '0',
            folder
        };

        await mls.stor.addOrUpdateFile(params);
        const newFile = mls.stor.files[keyRenamed];
        newFile.status = 'new';
        newFile.inLocalStorage = true;
        const fileInfoValue: mls.stor.IFileInfoValue = {
            content: oldContent,
            contentType: 'string',
        };
        newFile.onAction = (action: mls.stor.IFileInfoAction) => this._onAction(action, newFile);
        await mls.stor.localStor.setContent(newFile, fileInfoValue);
        return newFile;
    }

    public async onChangeStatusToRenamed(file: mls.stor.IFileInfo, newName: string, newFolder: string): Promise<mls.stor.IFileInfo> {

        if (!file.getValueInfo) throw new Error('Invalid getValueInfo');
        const oldValueInfo = await file.getValueInfo();
        const keyOld = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, file.extension);

        const params = {
            project: this.dsIO.project,
            level: 3,
            shortName: newName,
            extension: file.extension,
            versionRef: file.versionRef,
            folder: newFolder
        };

        const fileInfoValue: mls.stor.IFileInfoValue = {
            content: oldValueInfo.content,
            originalFolder: file.folder,
            originalProject: file.project,
            originalShortName: file.shortName,
            contentType: oldValueInfo.contentType
        };

        await mls.stor.addOrUpdateFile(params);
        const keyNewFile = mls.stor.getKeyToFiles(this.dsIO.project, 3, newName, newFolder, params.extension);
        const newFile = mls.stor.files[keyNewFile];
        newFile.status = 'renamed';
        newFile.inLocalStorage = true;
        newFile.getValueInfo = () => this._getValueInfo(file, fileInfoValue.originalShortName, fileInfoValue.originalFolder, fileInfoValue.originalProject, '');
        newFile.onAction = (action: mls.stor.IFileInfoAction) => this._onAction(action, newFile);

        await mls.stor.localStor.setContent(newFile, fileInfoValue);
        delete mls.stor.files[keyOld];
        return newFile;

    }

    public async onChangeStatusToDeleted(file: mls.stor.IFileInfo): Promise<mls.stor.IFileInfo> {
        if (!file.getValueInfo) throw new Error('Invalid getValueInfo');
        const fileInfo = await file.getValueInfo();
        file.status = 'deleted';
        await mls.stor.localStor.setContent(file, fileInfo);
        return file;
    }

    public async _getValueInfo(
        file: mls.stor.IFileInfo,
        originalShortName?: string,
        originalFolder?: string,
        originalProject?: number,
        originalCRC?: string,
    ): Promise<mls.stor.IFileInfoValue> {

        file.inLocalStorage = file.status !== 'nochange';
        const content = await file.getContent();
        const contentType = typeof content === 'string' ? 'string' : 'blob';
        const obj: mls.stor.IFileInfoValue = {
            content,
            contentType,
            originalShortName,
            originalFolder,
            originalProject,
            originalCRC,
        };
        return obj;
    }

    public async _onAction(action: mls.stor.IFileInfoAction, storFile: mls.stor.IFileInfo): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            if (action === 'aftersave') {
                storFile.status = 'nochange';
                storFile.inLocalStorage = false;
                const fileInfoValue: mls.stor.IFileInfoValue = {
                    content: null,
                    contentType: undefined,
                };
                mls.stor.localStor.setContent(storFile, fileInfoValue);
            }
            return resolve();
        });
    }

    public async getContentFile(shortName: string, extension: string, fullpath: string, forceOriginal: boolean = false): Promise<string | Blob | null> {

        if (!extension.startsWith('.')) extension = '.' + extension;
        const fileKey = this.getStorFileName(shortName, fullpath, extension);
        const file = mls.stor.files[fileKey];
        if (!file) return null;

        const inLc = file.inLocalStorage;
        if (forceOriginal) file.inLocalStorage = false;
        if (!file.inLocalStorage) {
            const content = await file.getContent();
            return content;
        }

        if (!file.getValueInfo) return null;
        const contentInfo = await file.getValueInfo();
        file.inLocalStorage = inLc;
        return contentInfo.content as string;
    }

    public setFileError(shortName: string, fullpath: string, extension: string, error: boolean): void {
        if (!extension.startsWith('.')) extension = '.' + extension;
        const fileKey = this.getStorFileName(shortName, fullpath, extension);
        const file = mls.stor.files[fileKey];
        if (!file) throw new Error('Invalid file');
        file.hasError = error;
    }

    public cssInitial: string = `h1 {\n\t//Here your definition for h1\n\tcolor: @text-primary-color; \n}`;

    public docInitial: string = '<p><br></p><p>This page is the introduction to your Design System . Use this page to welcome people to your system.</p><p><br></p><p>In design system you can define:</p><p><br></p><ul><li>Tokens</li><li>Docs</li><li>Fonts</li><li>Colors</li><li>Sizes</li><li>Components</li></ul><p><br></p><p>After you define the design system, you can use to create a new website.</p><p><br></p><p>To start editing you design system,you can click in<span style="color: rgb(204, 224, 245);"> \'starting edit\'.</span> Now you can start adding a docs page click in <span style="color: rgb(204, 224, 245);">\'add Page\'.</span></p><p>If you need add a new component click in <span style="color: rgb(204, 224, 245);">\'add Component\'</span> and configure all you need.</p><p><br></p><p>After make all changes, click em <span style="color: rgb(204, 224, 245);">\'finish editing\'</span> to save your changes.</p><p><br></p><p><br></p>'

    public tokensInitial: mls.l3.ITokenInfo[] = [
        { key: 'text-primary-color-lighter', value: '#535353', category: 'color' },
        { key: 'text-primary-color', value: '#403f3f', category: 'color' },
        { key: 'text-primary-color-darker', value: '#000000', category: 'color' },
        { key: 'text-secondary-color-lighter', value: '#408EC8', category: 'color' },
        { key: 'text-secondary-color', value: '#1C91CD', category: 'color' },
        { key: 'text-secondary-color-darker', value: '#0F6FA9', category: 'color' },
        { key: 'bg-primary-color-lighter', value: '#c7c7c7', category: 'color' },
        { key: 'bg-primary-color', value: '#ededed', category: 'color' },
        { key: 'bg-primary-color-darker', value: '#fafafa', category: 'color' },
        { key: 'bg-secondary-color-lighter', value: '#F9F9F9', category: 'color' },
        { key: 'bg-secondary-color', value: '#E6E6E6', category: 'color' },
        { key: 'bg-secondary-color-darker', value: '#C0C0C0', category: 'color' },
        { key: 'grey-color-lighter', value: '#F9FAFB', category: 'color' },
        { key: 'grey-color-light', value: '#F2F2F2', category: 'color' },
        { key: 'grey-color', value: '#E6E6E6', category: 'color' },
        { key: 'grey-color-dark', value: '#D3D3D3', category: 'color' },
        { key: 'grey-color-darker', value: '#C0C0C0', category: 'color' },
        { key: 'error-color', value: '#FF4D4F', category: 'color' },
        { key: 'success-color', value: '#52C41A', category: 'color' },
        { key: 'warning-color', value: '#FAAD14', category: 'color' },
        { key: 'info-color', value: '#1890FF', category: 'color' },
        { key: 'active-color', value: '#1890FF', category: 'color' },
        { key: 'link-color', value: '#1890FF', category: 'color' },
        { key: 'link-hover-color', value: '#40A9FF', category: 'color' },
        { key: '_dark-text-primary-color-lighter', value: '#FFFFFF', category: 'color' },
        { key: '_dark-text-primary-color', value: '#fafafa', category: 'color' },
        { key: '_dark-text-primary-color-darker', value: '#f5f5f5', category: 'color' },
        { key: '_dark-text-secondary-color-lighter', value: '#5294c7', category: 'color' },
        { key: '_dark-text-secondary-color', value: '#56a8d1', category: 'color' },
        { key: '_dark-text-secondary-color-darker', value: '#bddef3', category: 'color' },
        { key: '_dark-bg-primary-color-lighter', value: '#666666', category: 'color' },
        { key: '_dark-bg-primary-color', value: '#404040', category: 'color' },
        { key: '_dark-bg-primary-color-darker', value: '#262626', category: 'color' },
        { key: '_dark-bg-secondary-color-lighter', value: '#636363', category: 'color' },
        { key: '_dark-bg-secondary-color', value: '#666060', category: 'color' },
        { key: '_dark-bg-secondary-color-darker', value: '#4b3f3f', category: 'color' },
        { key: '_dark-grey-color-lighter', value: '#2B2B2B', category: 'color' },
        { key: '_dark-grey-color-light', value: '#414141', category: 'color' },
        { key: '_dark-grey-color', value: '#575757', category: 'color' },
        { key: '_dark-grey-color-dark', value: '#6D6D6D', category: 'color' },
        { key: '_dark-grey-color-darker', value: '#969494', category: 'color' },
        { key: '_dark-error-color', value: '#f9676a', category: 'color' },
        { key: '_dark-success-color', value: '#63d42b', category: 'color' },
        { key: '_dark-warning-color', value: '#eead2b', category: 'color' },
        { key: '_dark-info-color', value: '#0b81ef', category: 'color' },
        { key: '_dark-active-color', value: '#0b81ef', category: 'color' },
        { key: '_dark-link-color', value: '#0b81ef', category: 'color' },
        { key: '_dark-link-hover-color', value: '#3f9fee', category: 'color' },

        // Typography
        { key: 'font-base-unit', value: '0.25rem', category: 'typography' },
        { key: 'font-family-primary', value: 'sans-serif', category: 'typography' },
        { key: 'font-family-secondary', value: 'serif', category: 'typography' },
        { key: 'font-size-12', value: 'calc(@font-base-unit * 3)', category: 'typography' },
        { key: 'font-size-16', value: 'calc(@font-base-unit * 4)', category: 'typography' },
        { key: 'font-size-20', value: 'calc(@font-base-unit * 5)', category: 'typography' },
        { key: 'font-size-24', value: 'calc(@font-base-unit * 6)', category: 'typography' },
        { key: 'font-size-40', value: 'calc(@font-base-unit * 10)', category: 'typography' },
        { key: 'font-size-48', value: 'calc(@font-base-unit * 12)', category: 'typography' },
        { key: 'font-size-64', value: 'calc(@font-base-unit * 16)', category: 'typography' },
        { key: 'line-height-base-unit', value: '1', category: 'typography' },
        { key: 'line-height-small', value: 'calc(@line-height-base-unit * 1.1)', category: 'typography' },
        { key: 'line-height-medium', value: 'calc(@line-height-base-unit * 1.3)', category: 'typography' },
        { key: 'line-height-large', value: 'calc(@line-height-base-unit * 1.5)', category: 'typography' },
        { key: 'font-weight-lighter', value: '100', category: 'typography' },
        { key: 'font-weight-light', value: '200', category: 'typography' },
        { key: 'font-weight-normal', value: '400', category: 'typography' },
        { key: 'font-weight-bold', value: '700', category: 'typography' },
        { key: 'font-weight-bolder', value: '900', category: 'typography' },
        // Breakpoints
        { key: 'breakpoint-small', value: '544px', category: 'custom' },
        { key: 'breakpoint-medium', value: '768px', category: 'custom' },
        { key: 'breakpoint-large', value: '1012px', category: 'custom' },

        // Animations
        { key: 'transition-slow', value: '0.2s', category: 'custom' },
        { key: 'transition-normal', value: '0.3s', category: 'custom' },
        { key: 'transition-fast', value: '0.4s', category: 'custom' },

        // sizes
        { key: 'space-base-unit', value: '0.25rem', category: 'custom' },
        { key: 'space-8', value: 'calc(@space-base-unit * 2)', category: 'custom' },
        { key: 'space-16', value: 'calc(@space-base-unit * 4)', category: 'custom' },
        { key: 'space-24', value: 'calc(@space-base-unit * 6)', category: 'custom' },
        { key: 'space-32', value: 'calc(@space-base-unit * 8)', category: 'custom' },
        { key: 'space-40', value: 'calc(@space-base-unit * 10)', category: 'custom' },
        { key: 'space-48', value: 'calc(@space-base-unit * 12)', category: 'custom' },
        { key: 'space-64', value: 'calc(@space-base-unit * 16)', category: 'custom' },

    ]

}

export const initialTokensColor = {
    "text-primary-color-lighter": "#535353",
    "text-primary-color": "#403f3f",
    "text-primary-color-darker": "#000000",
    "text-secondary-color-lighter": "#408EC8",
    "text-secondary-color": "#1C91CD",
    "text-secondary-color-darker": "#0F6FA9",
    "bg-primary-color-lighter": "#ffffff",
    "bg-primary-color": "#ffffff",
    "bg-primary-color-darker": "#fafafa",
    "bg-secondary-color-lighter": "#F9F9F9",
    "bg-secondary-color": "#E6E6E6",
    "bg-secondary-color-darker": "#C0C0C0",
    "grey-color-lighter": "#F9FAFB",
    "grey-color-light": "#F2F2F2",
    "grey-color": "#E6E6E6",
    "grey-color-dark": "#D3D3D3",
    "grey-color-darker": "#C0C0C0",
    "error-color": "#FF4D4F",
    "success-color": "#52C41A",
    "warning-color": "#FAAD14",
    "info-color": "#1890FF",
    "active-color": "#1890FF",
    "link-color": "#1890FF",
    "link-hover-color": "#40A9FF",
    "_dark-text-primary-color-lighter": "#FFFFFF",
    "_dark-text-primary-color": "#e6edf3",
    "_dark-text-primary-color-darker": "#8d96a0",
    "_dark-text-secondary-color-lighter": "#5294c7",
    "_dark-text-secondary-color": "#56a8d1",
    "_dark-text-secondary-color-darker": "#bddef3",
    "_dark-bg-primary-color-lighter": "#666666",
    "_dark-bg-primary-color": "#0d1117",
    "_dark-bg-primary-color-darker": "#262626",
    "_dark-bg-secondary-color-lighter": "#636363",
    "_dark-bg-secondary-color": "#161b22",
    "_dark-bg-secondary-color-darker": "#4b3f3f",
    "_dark-grey-color-lighter": "#2B2B2B",
    "_dark-grey-color-light": "#414141",
    "_dark-grey-color": "#575757",
    "_dark-grey-color-dark": "#6D6D6D",
    "_dark-grey-color-darker": "#969494",
    "_dark-error-color": "#f9676a",
    "_dark-success-color": "#63d42b",
    "_dark-warning-color": "#eead2b",
    "_dark-info-color": "#0b81ef",
    "_dark-active-color": "#0b81ef",
    "_dark-link-color": "#0b81ef",
    "_dark-link-hover-color": "#3f9fee"
};
export const initialTokensGlobal = {
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
};
export const initialtokensTypography = {
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
};


export interface IDS {
    name: string,
    last_updated_by: string,
    last_updated: string,
    created_by: string,
    reference: mls.l3.IDSRef | undefined,
    docs: {
        items: mls.l3.IDocInfo[]
    },
    tokens: {
        items: ITokens[]
    },
    assets: {
        items: mls.l3.IAssetsInfo[]
    },
    components: {
        items: mls.l3.IComponentInfo[]
    },
    css: {
        items: mls.l3.ICssInfo[]
    }
}

