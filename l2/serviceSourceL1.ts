/// <mls shortName="serviceSourceL1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit'
import { getEnhancementName } from './_100554_libCommom';
import { ServiceBase, IService, IToolbarContent, IServiceMenu, IOptions, ITools } from './_100554_serviceBase';

@customElement('service-source-l1-100554')
export class ServiceSourceL1100554 extends ServiceBase {

    //--------PROPERTS-----------
    @query('mls-editor-100529') private editorEl: HTMLElement | undefined;
    @property({ type: String }) activeModels: mls.editor.IModels | undefined;
    @property({ type: String }) msize = '';


    //--------VARIABLES-----------

    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;
    private isNewFile: boolean = false;


    //-----------INIT------------

    get getKeyEditor() { return 'l1_left' };
    get confE() { return `l${this.level}_${this.position}`; }

    constructor() {
        super();
        this.setEvents();

    }

    //-----------SERVICE--------------
    public details: IService = {
        icon: '&#xf121',
        state: 'background',
        tooltip: 'Source L1',
        visible: true,
        position: "all",
        widget: '_100554_serviceSourceL1',
        level: [1]
    }

    public onClickTitle = () => {
        this.openService('_100554_serviceProject', this.position, 1, { activeTab: 'Explore' });
    }

    public menu: IServiceMenu = {
        title: {
            icon: '&#xf053',
            text: 'L2 - widget1'
        },
        main: {},
        tabs: undefined,
        tools: {},
        onClickMain: () => { },
        onClickTabs: () => { },
        onClickTools: () => { },
        onClickTitle: this.onClickTitle.bind(this),
    }

    public onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null): void {

        if (!visible) {
            return;
        }

        this.initMonaco();
    }

    //--------COMPONENT-------------

    updated(changedProperties: any) {
        super.updated(changedProperties);
        if (changedProperties.has('msize')) {
            if (!this.visible) return;
            this.updatedMSizeEditor();
        }
    }
    connectedCallback() {
        super.connectedCallback();
    }

    firstUpdated(changedProperties: any) {
        super.firstUpdated(changedProperties);
    }

    render() {

        this.style.display = 'block';
        return html`
            <mls-editor-100529 slot="left"></mls-editor-100529>
        `

    }

    //---------EVENTS---------------

    private setEvents() {
        mls.events.addListener(1, 'FileAction', this.onMLSEvents.bind(this));
    }

    private onMLSEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {

        if (ev.level !== 1 || (ev.type !== 'FileAction')) return;
        if (!ev.desc) return;
        const fileAction = JSON.parse(ev.desc) as mls.events.IFileAction;
        if (fileAction.position !== this.position) return;
        const eventsValid = ['new', 'open', 'delete', 'undo', 'rename', 'clone'];

        if (!eventsValid.includes(fileAction.action)) return;

        await this.initMonaco(); // init if needed
        switch (fileAction.action) {
            case 'new': await this.onNew(fileAction); break;
            case 'open': await this.onOpen(fileAction); break;
            case 'delete': await this.onDelete(fileAction); break;
            case 'undo': await this.onUndo(fileAction); break;
            case 'rename': await this.onRename(fileAction); break;
            case 'clone': await this.onClone(fileAction); break;
            case 'updatedOnServer': break;
            default: ''
        }

        if (mls.istrace) console.timeEnd('onAction_' + fileAction.action + '_' + fileAction.position);

    }


    //---------IMPLEMENTATION---------

    private getUri(shortFN: string, ftype: '.ts' | '.d.ts' | '.html' | '.less' | '.test.ts'): monaco.Uri {
        return monaco.Uri.parse(`file://server/${shortFN}${ftype}`);
    }

    private updatedMSizeEditor() {
        this.editorEl?.setAttribute('msize', this.msize);
    }

    private async initMonaco() {
        if (!this._ed1) {
            await this.initMonaco_Editor();
        }
    }

    private async initMonaco_Editor(): Promise<void> {

        if (!this.editorEl) return;

        this._ed1 = monaco.editor.create(this.editorEl, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);

        (this.editorEl as any)['mlsEditor'] = this._ed1;
        mls.editor.instances[this.confE] = this._ed1;
        mls.editor.InitEditor(this._ed1);

    }

    private getStorFile(fileAction: mls.events.IFileAction): mls.stor.IFileInfo {

        const keyFiles = mls.stor.getKeyToFiles(fileAction.project, fileAction.level, fileAction.shortName, fileAction.folder, fileAction.extension);
        const storFile = mls.stor.files[keyFiles];
        if (!storFile) throw new Error('Error on open, mls.stor.files dont exists, key:' + keyFiles);
        return storFile;

    }

    private activeThisService(): void {
        this.openMe();
        mls.editor.setActiveInstance(this.level, this.position);
    }

    private async onNew(fileAction: mls.events.IFileAction) {

        this.loading = true;
        this.isNewFile = true;

        this.activeThisService();

        const newBeSource = fileAction.newTSSource
            || `/// <mls shortName="${fileAction.newshortName}" project="${fileAction.newProject}" enhancement="${fileAction.newEnhancement}" />
				\n// typescript new file\n`;

        const modelBE = await this.createModelBE1(fileAction.newshortName as string, fileAction.newProject as number,
            newBeSource, true);

        this.showActiveModel();

        await mls.stor.localStor.setContent(modelBE.storFile, await this.getValueInfo(modelBE));

        this.isNewFile = false;
        this.loading = false;
    }

    private async onOpen(fileAction: mls.events.IFileAction) {

        this.loading = true;
        const storFile = this.getStorFile(fileAction);

        await this.openFiles(storFile, fileAction.position);
        this.updatedMSizeEditor();
        this.loading = false;
    }

    private async onDelete(fileAction: mls.events.IFileAction) {

        const storFile = this.getStorFile(fileAction);
        if (!storFile) return;

        if (storFile.status === 'new') this.deleteFile(storFile);
        else storFile.status = 'deleted';

        const st = { ...storFile, level: 1 };
        mls.events.fireFileAction('statusOrErrorChanged', st, this.position);

        await mls.stor.localDB.removePrjInfo(storFile.project);
    }

    private async onUndo(fileAction: mls.events.IFileAction) {

        const storFile = this.getStorFile(fileAction);
        const keyFile = mls.stor.getKeyToFiles(fileAction.project, fileAction.level, fileAction.shortName, fileAction.folder, fileAction.extension);

        if (!storFile || !keyFile) return;

        if (storFile.status === 'deleted') {
            storFile.status = 'changed';
            return;
        }

        if (storFile.status === 'renamed') {
            throw new Error('not implemented');
        }

        if (storFile.extension === '.ts') {
            mls.editor.deleteModels(storFile.project, storFile.shortName, true);
        }

        this.removeEventsStorFile(storFile);
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });

        if (storFile.status === 'new') {
            delete mls.stor.files[keyFile];
            return;
        }

        if (storFile.status === 'changed') {
            storFile.status = 'nochange';
            if (storFile.isLocalVersionOutdated && storFile.newVersionRefIfOutdated) {
                storFile.versionRef = storFile.newVersionRefIfOutdated;
                storFile.isLocalVersionOutdated = false;
                storFile.newVersionRefIfOutdated = undefined;
            }
        } else {
            storFile.status = 'changed';
        }

        const models = await this.createModelBE2(storFile, false, true);
        if (models.ts) await this.updateModelStatus(models.ts, false);
    }

    private async onRename(fileAction: mls.events.IFileAction) {

        const storFile = this.getStorFile(fileAction);
        if (!storFile) return;

        this.activeThisService();

        let fileModels = mls.editor.getModels(fileAction.project, fileAction.shortName);

        if (!fileModels) fileModels = await this.createModelBE2(storFile, false, true);

        this.renameFile(fileModels.ts, fileAction.newProject as number, fileAction.newshortName as string);

        this.activeModels = fileModels;

        (mls.actual[this.level] as any)[this.position] = {
            project: fileAction.newProject,
            shortName: fileAction.newshortName as string
        }

        const fileActionr: mls.events.IFileAction = {
            ...fileAction,
            project: fileAction.newProject as number,
            shortName: fileAction.newshortName as string,
            action: 'open',
            newProject: undefined,
            newshortName: undefined,
        }

        const ev: mls.events.IEvent = {
            level: this.level as mls.Level,
            type: 'FileAction',
            desc: JSON.stringify(fileActionr)
        }

        this.onMLSEvents(ev);

        await mls.stor.localDB.removePrjInfo(storFile.project);
    }

    private async onClone(fileAction: mls.events.IFileAction) {

        const storFile = this.getStorFile(fileAction);
        if (!storFile) return;

        this.activeThisService();
        await this.createModelBE_clone(storFile, fileAction.newProject as number, fileAction.newshortName as string);

        (mls.actual[this.level] as any)[this.position] = {
            project: fileAction.newProject,
            shortName: fileAction.newshortName
        }

        const fileActionr: mls.events.IFileAction = {
            ...fileAction,
            project: fileAction.newProject as number,
            shortName: fileAction.newshortName as string,
            action: 'open',
            newProject: undefined,
            newshortName: undefined,
        }

        const ev: mls.events.IEvent = {
            level: this.level as mls.Level,
            type: 'FileAction',
            desc: JSON.stringify(fileActionr)
        }

        this.onMLSEvents(ev);
    }

    private async createModelBE_clone(storFile: mls.stor.IFileInfo, newProject: number, newShortName: string) {

        const { project, shortName } = storFile;
        let fileModels = mls.editor.getModels(project, shortName);

        if (!fileModels || !fileModels.ts) fileModels = await this.createModelBE2(storFile, false, true);
        let modelTS = fileModels.ts;
        if (!modelTS) throw new Error('Invalid models ts');

        let defaultTS = modelTS.model.getValue();

        const baseTag = convertFileNameToTag({ project: storFile.project, shortName: storFile.shortName })
        const newTag = convertFileNameToTag({ project: newProject, shortName: newShortName });
        const regex = new RegExp(baseTag, 'g');

        defaultTS = defaultTS.replace(regex, newTag);
        defaultTS = this.changeClassName(defaultTS, newProject, newShortName);

        modelTS = await this.createModelBE1(newShortName, newProject, defaultTS, true);
        this.tripleslashChangeVariable(modelTS.model, 'shortName', newShortName);
        this.tripleslashChangeVariable(modelTS.model, 'project', newProject.toString());
    }

    private changeClassName(source: string, project: number, shortname: string): string {

        const regex = /export\s+class\s+(\w+)\s+extends/g;
        const match = regex.exec(source);
        const newClassName = shortname.charAt(0).toUpperCase() + shortname.substring(1, shortname.length) + project.toString();
        if (match) {
            const originalTag = match[1];
            const replacedSource = source.replace(originalTag, newClassName);
            return replacedSource;
        }
        return source;

    }

    private async renameFile(models: mls.editor.IModelBase | undefined, newProject: number, newShortName: string) {

        if (!models || !models.storFile) return;
        const newSts: mls.cbe.IPath = { shortName: newShortName, project: newProject, folder: models.storFile.folder };

        if (!models.storFile.getValueInfo) return;
        const valueInfo = await models.storFile.getValueInfo();
        const { status } = models.storFile;

        const ext = models.storFile.extension;
        if (!mls.stor.renameFile(models.storFile, newSts)) throw new Error('Error on rename mls.stor.files');
        const key = mls.stor.getKeyToFiles(newProject, this.level, newShortName, '', ext);
        const newStorFile = mls.stor.files[key];
        newStorFile.status = 'renamed';

        const oldKey = `_${models.storFile.project}_${models.storFile.shortName}`;
        const newKey = `_${newProject}_${newShortName}`;
        if (mls.editor.models[oldKey]) {
            mls.editor.models[newKey] = mls.editor.models[oldKey];
            delete mls.editor.models[oldKey];
        }

        setTimeout(async () => {
            if (ext === '.less' || ext === '.ts') {

                await mls.l2.less.parseTripleSlash(models);
                this.tripleslashChangeVariable(models.model, 'shortName', newShortName);
                this.tripleslashChangeVariable(models.model, 'project', newProject.toString());
            }
            await mls.stor.localStor.setContent(newStorFile, valueInfo);
            if (!models.storFile) return;
            if (status === 'new') models.storFile.status = status;
        }, 500);
    }

    private tripleslashChangeVariable = (
        model: monaco.editor.ITextModel,
        variableName: string,
        newValue: string
    ): boolean => {
        const lines: string[] = (model.getValue() || '').split('\n');
        const line = lines[0];
        if (!line.startsWith('/// <')) throw new Error('line must start with "/// <" (triple slash and xml');

        const regex = new RegExp(`(${variableName}\\s*=\\s*["'])([^"']*)`, "i");
        const match = line.match(regex);

        if (!match) return false;

        lines[0] = line.replace(regex, `$1${newValue}`);
        model.setValue(lines.join(('\n')));
        return true;
    }



    private async openFiles(storFileTS: mls.stor.IFileInfo, position: 'left' | 'right') {

        try {

            this.activeThisService();

            let fileModels = mls.editor.getModels(storFileTS.project, storFileTS.shortName);

            if (!fileModels) {
                await this.createModelBE2(storFileTS, true, true);
                fileModels = mls.editor.getModels(storFileTS.project, storFileTS.shortName);
                if (!fileModels) console.info('No file models');
                this.activeModels = fileModels;
                (mls.editor.editors as any)[this.getKeyEditor] = fileModels;
                this.showActiveModel();
                const modelTs = this.activeModels?.ts?.model;
                if (!modelTs) throw new Error('Invalid model TS');
                mls.editor.forceModelUpdate(modelTs);

            } else {
                this.activeModels = fileModels;
                (mls.editor.editors as any)[this.getKeyEditor] = fileModels;
                const modelTs = this.activeModels.ts?.model;
                if (!modelTs) throw new Error('Invalid model TS');
                mls.editor.forceModelUpdate(modelTs);
                this.showActiveModel();
            }

            this.saveLocalStorageLastOpen(storFileTS, position);
            if (!this._ed1) return;

        } catch (e: any) {

            this.loading = false;
            this.setError(e.message);

        }

    }

    private saveLocalStorageLastOpen(storFile: mls.stor.IFileInfo, position: string) {
        try {

            let last = localStorage.getItem('_100554_serviceSourceL1');
            last = last ? last : '{}';
            const info = JSON.parse(last);
            const keyLocal = 'last_' + this.level + '_' + position;

            if (info[keyLocal]) {
                info[keyLocal].project = storFile.project;
                info[keyLocal].shortName = storFile.shortName;
                info[keyLocal].extension = storFile.extension;
                info[keyLocal].level = storFile.level;
                info[keyLocal].folder = storFile.folder;
            } else {
                info[keyLocal] = {
                    project: storFile.project,
                    shortName: storFile.shortName,
                    extension: storFile.extension,
                    level: storFile.level,
                    folder: storFile.folder,
                }
            }

            localStorage.setItem('_100554_serviceSourceL1', JSON.stringify(info));

        } catch (e) {
            localStorage.setItem('_100554_serviceSourceL1', JSON.stringify({}));
        }

    }

    private async createModelBE1(shortName: string, project: number, defaultTS: string, activateModel: boolean): Promise<mls.editor.IModelTS> {

        const level = 2;
        const extension = '.ts';

        if (project > 1) await mls.stor.server.loadProjectInfoIfNeeded(project);

        const key = mls.stor.getKeyToFiles(project, level, shortName, '', extension);
        let storFile: mls.stor.IFileInfo | undefined = mls.stor.files[key];

        if (!storFile) {
            storFile = await mls.stor.addOrUpdateFile({ project, level, shortName, extension, versionRef: new Date().toISOString(), folder: '' });
            if (!storFile) throw new Error('Invalid storFile');
            storFile.status = 'new';
        }

        let fileModels = mls.editor.getModels(project, shortName);
        if (fileModels && fileModels.ts) return fileModels.ts;

        const src: string = storFile ? (await storFile.getContent(defaultTS)) as string || defaultTS : defaultTS;
        const ftype = src.split("\n")[0].indexOf(' type="definition"') > 0 ? ".d.ts" : ".ts";

        const modelBase = await this.createModel(project, shortName, ftype, src);

        if (!modelBase) throw new Error(`invalid mls.editor.models for file: _${project}_${shortName}${ftype}`);

        this.addEventsModelTS(storFile, modelBase);

        await this.updateModelStatus(modelBase, false); // first compilation
        fileModels = mls.editor.getModels(project, shortName);
        if (activateModel) this.activeModels = fileModels;
        return modelBase as mls.editor.IModelTS;
    }

    private async createModelBE2(storFile: mls.stor.IFileInfo, activedModel: boolean, compile: boolean): Promise<mls.editor.IModels> {
        // load source from repository

        const { project, shortName, extension } = storFile;

        let fileModels = mls.editor.getModels(project, shortName);
        if (fileModels && fileModels.ts && fileModels.html && fileModels.style) return fileModels;

        let modelTS: mls.editor.IModelTS | undefined;
        if (!fileModels || !fileModels.ts) modelTS = await this.createModel(project, shortName, '.ts');
        else modelTS = fileModels.ts;
        if (!modelTS) throw new Error(`invalid mls.editor.models for file: _${project}_${shortName}.ts`);
        this.addEventsModelTS(storFile, modelTS);

        if (compile) await this.updateModelStatus(modelTS, false);

        fileModels = mls.editor.getModels(project, shortName);
        if (activedModel) this.activeModels = fileModels;
        if (!fileModels) throw new Error(`Invalid models for file: _${project}_${shortName}.ts`);
        return fileModels;

    }

    private addEventsModelTS(storFile: mls.stor.IFileInfo, model1: mls.editor.IModelTS): void {

        storFile.onAction = (action: mls.stor.IFileInfoAction) => this.afterUpdate(storFile);
        storFile.getValueInfo = () => this.getValueInfo(model1);
        model1.model.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => this.onModelChange(e, model1, storFile));
    }

    private _onChangedContent: number | undefined = undefined;
    private onModelChange(e: monaco.editor.IModelContentChangedEvent, activeModel: mls.editor.IModelTS, storFile: mls.stor.IFileInfo) {
        // some changes is to simulate changes to force compile

        clearTimeout(this._onChangedContent);
        this._onChangedContent = window.setTimeout(async () => {

            const ignoreChanges = (e.changes.length === 1 && e.changes[0].range.startLineNumber === 1 && e.changes[0].range.endLineNumber === 1 && e.changes[0].range.endColumn <= 2);

            await this.updateModelStatus(activeModel, !ignoreChanges);
        }, 400);
    };

    private async updateModelStatus(modelBaseBE: mls.editor.IModelTS, changed: boolean): Promise<void> {

        if (!modelBaseBE.storFile) throw new Error('Invalid stor file');
        const { project, shortName, folder } = modelBaseBE.storFile;

        if (project === 0 && (shortName === 'loading' || shortName === 'testFile')) return;
        modelBaseBE.storFile.hasError = false;
        const ok = await mls.l2.typescript.compileAndPostProcess(modelBaseBE, true, true);

        let hasError = ok === false;
        if (!hasError && this.activeModels && this.activeModels.ts) {

            const enhacementName = await getEnhancementName({ project, shortName, folder }).catch((e) => undefined);
            if (enhacementName) {
                const path = mls.l2.getPath(enhacementName);
                const enhancementInstance: mls.l2.enhancement.IEnhancementInstance | undefined = await mls.l2.enhancement.getEnhancementModule(path).catch((e) => { console.error('Error on getEnhancementModule: ' + e.message); return undefined });
                if (enhancementInstance) await enhancementInstance.onAfterChange(this.activeModels.ts);
            }

            hasError = modelBaseBE.storFile.hasError;

        }

        await this.changeStatusFile(modelBaseBE, modelBaseBE.storFile, modelBaseBE.compilerResults?.tripleSlashMLS?.variables, hasError, changed);
    }

    private async afterUpdate(storFile: mls.stor.IFileInfo) {

        const models = mls.editor.getModels(storFile.project, storFile.shortName);
        if (!models || !models.ts) return;

        if (storFile.status === 'deleted') {
            this.deleteFile(storFile);
            return;
        }
        if (storFile.status === 'renamed') {
            models.ts.originalCRC = mls.common.crc.crc32(models.ts.model.getValue()).toString(16);
            models.ts.originalProject = undefined;
            models.ts.originalShortName = undefined;
        }
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        storFile.status = 'nochange';
    }

    private async changeStatusFile(modelBaseBE: mls.editor.IModelTS, storFile: mls.stor.IFileInfo, variables: mls.common.tripleslash.ITripleSlashVariables | undefined, hasError: boolean, changed: boolean): Promise<void> {

        if (!storFile) return; // new file dont have storFile ???
        storFile.hasError = hasError;
        const sameContent: boolean = modelBaseBE.originalCRC === mls.common.crc.crc32(modelBaseBE.model.getValue()).toString(16);


        if (sameContent) {
            if (storFile.status !== 'new') {
                storFile.status = 'nochange';
                await mls.stor.localStor.setContent(storFile, { content: null }); // clear localstorage
            }
        } else {
            if (storFile.status !== 'renamed' && (storFile.status !== 'new')) storFile.status = 'changed';
            await mls.stor.localStor.setContent(storFile, await this.getValueInfo(modelBaseBE));
        }

        if (changed) {
            const position = 'left';
            const st = { ...storFile, level: 1 };
            mls.events.fireFileAction('statusOrErrorChanged', st, position);
        }
    }

    private async deleteFile(storFile: mls.stor.IFileInfo) {
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        mls.editor.deleteModels(storFile.project, storFile.shortName, true);
        this.removeEventsStorFile(storFile);
        const keyFiles = mls.stor.getKeyToFiles(storFile.project, storFile.level, storFile.shortName, storFile.folder, storFile.extension);
        delete mls.stor.files[keyFiles];
    }

    private removeEventsStorFile(storFile: mls.stor.IFileInfo): void {
        storFile.onAction = undefined;
        storFile.getValueInfo = undefined;
    }

    private async getValueInfo(activeModel: mls.editor.IModelTS): Promise<mls.stor.IFileInfoValue> {
        const rc: mls.stor.IFileInfoValue = {
            content: activeModel.model.getValue(),
            contentType: 'string',
            originalShortName: activeModel.originalShortName,
            originalProject: activeModel.originalProject,
            originalCRC: activeModel.originalCRC
        };
        return rc;
    }

    private async createModel(project: number, shortName: string, ext: '.ts' | '.d.ts' | '.html' | '.less' | '.test.ts', content?: string): Promise<mls.editor.IModelBase | undefined> {

        try {
            let src: string | Blob | null | undefined = undefined;
            let haveInfo: boolean = false;
            let info: mls.stor.IFileInfoValue | null = null;
            let storFile: mls.stor.IFileInfo | undefined;

            if (ext !== '.d.ts') {
                const keyToFile = mls.stor.getKeyToFiles(project, 2, shortName, '', ext);
                storFile = mls.stor.files[keyToFile];
                if (!storFile) throw new Error(`Invalid file: ${ext}`);
                if (!content) {
                    info = storFile.getValueInfo ? await storFile.getValueInfo() : null;
                    haveInfo = !!info && !!info.content;
                    src = haveInfo ? info?.content : await storFile.getContent();
                } else src = content;

            } else {
                src = content || '';
            }

            if (src instanceof Blob) throw new Error(`${ext} file must be string`);
            if (!src) throw new Error(`${ext} file is undefined`);

            const originalCRC = haveInfo ? info?.originalCRC : mls.common.crc.crc32(src).toString(16);
            const originalProject: number | undefined = haveInfo ? info?.originalProject : undefined;
            const originalShortName: string | undefined = haveInfo ? info?.originalShortName : undefined;

            let model: mls.editor.IModelBase | undefined;

            if (ext === '.ts' && storFile) model = mls.editor.createModelTS(storFile, src);
            else if (ext === '.d.ts') model = mls.editor.createModelProjectDefinition(project, src);

            if (!model) throw new Error(`Model invalid`);

            model.originalCRC = originalCRC;
            model.originalProject = originalProject;
            model.originalShortName = originalShortName;

            return model;
        } catch (e: any) {
            this.setError(e.message);
        }
    }

    private showActiveModel(): boolean {

        if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.storFile) return false;

        const { shortName, project, status } = this.activeModels.ts.storFile;

        const model = this.activeModels.ts.model;
        (mls.editor.editors as any)[this.getKeyEditor] = this.activeModels;

        if (!this._ed1 || !this.menu.getLastMode) return false;
        const changedFile: boolean = this.menu.title !== shortName;
        (this.menu.title as IOptions).text = `_${project}_${shortName}`;
        const lastMode = this.menu.getLastMode();
        if (changedFile && lastMode !== 'initial') {
            // user choice another file, goto initial editor
            this._ed1.setModel(model);
            if (this.menu.setMode) this.menu.setMode('initial');
        } else if (lastMode === 'initial') {
            this._ed1.setModel(model);
            if (this.menu.updateTitle) this.menu.updateTitle();
        } else if (lastMode === 'editor') {
            // dont change model , ex TS Config
        } else if (lastMode === 'page') {
            // in page, ex About, prepare model to after close hamburger
            this._ed1.setModel(model);
        }
        this.updatedMSizeEditor();

        return true;
    }



}