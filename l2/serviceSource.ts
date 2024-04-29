/// <mls shortName="serviceSource" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit'
import { ServiceBase, IService, IToolbarContent, IMenu, IMenuTitle } from './_100554_serviceBase';

@customElement('service-source-100554')
export class ServiceSource100554 extends ServiceBase {

    constructor() {
        super();
        mls.events.addListener(2, 'FileAction', this.onMLSEvents.bind(this));
        mls.events.addListener(2, 'MonacoAction', (ev) => this.onMonacoEvents(ev));
        mls.events.addListener(2, 'ProjectLoaded', (ev) => this.onProjectLoadedEvents(ev));
        this.initMonaco_GlobalEditor();
    }

    @property({ type: String })
    msize = '';

    createRenderRoot() {
        return this;
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opTS2') return true;
        if (op === 'opTheme') return this.showPageTheme();
        if (op === 'opMonacoConfig') return this.showConfEditor();
        if (op === 'opMonacoReset') return this.showMonacoReset();
        if (op === 'opHistory') return this.showHistory();
        if (op === 'opView') return this.openRepo();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        if (op === 'icTs') this.showActiveModel();
        if (op === 'icHTML') this.createOrShowModelHTML(true);
    }

    public onClickTitle = () => {
        this.openService('_100554_serviceListFiles', this.position, 2);
    }

    public details: IService = {
        icon: '&#xf121',
        state: 'background',
        tooltip: 'Source 2',
        visible: true,
        position: "all",
        widget: '_100554_serviceSource',
        level: [2]
    }

    public menu: IMenu = {
        title: {
            icon: '&#xf053',
            text: 'L2 - widget1'
        },
        actions: {
            opTheme: 'Editor - Themes',
            opMonacoConfig: 'Editor - config',
            opMonacoReset: 'Editor - reset',
            opHistory: 'History',
            opView: 'View on repository',
        },
        icons: {
            icTs: 'Typescript;f121',
            icHTML: 'HTML;f1c9'
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'icTs',
        setMode: undefined, // child will set this
        updateTitle: undefined, // child will set this
        getLastMode: undefined, // child will set this
        lastIcon: undefined, // child will set this
        setIconActive: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon,
        onClickTitle: this.onClickTitle
    }

    public onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        this._onServiceClick(visible, reinit, el)
    }

    private async _onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (!visible) {
            this.saveViewState();
            return;
        }
        await this.initMonaco();
        if (this.menu.setIconActive) this.menu.setIconActive('icTs');
        this.c2?.setAttribute('msize', this.msize);
    }

    public getEditorValue() {
        if (!this._ed1) return '';
        const model = this._ed1.getModel();
        if (!model) return '';
        return model.getValue();
    }

    public setEditorValue(val: string) {
        if (!this._ed1) return false;
        const { shortName, project } = mls.l2.editor.editors[this.confE];
        const uri = this.getUri(`_${project}_${shortName}`, '.ts');
        let model = monaco.editor.getModel(uri);
        if (!model) return false;
        this.setValueInModeKeepingUndo(model, val, true);
    }

    public setEditorHTMLValue(val: string) {
        if (!this._ed1) return false;
        const { shortName, project } = mls.l2.editor.editors[this.confE];
        const uri = this.getUri(`_${project}_${shortName}`, '.html');
        let model = monaco.editor.getModel(uri);
        if (!model) return false;
        this.setValueInModeKeepingUndo(model, val, false);
    }

    @query('mls-editor-100529')
    private c2: HTMLElement | undefined;

    public last: mls.IActual | undefined = undefined;
    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;

    private mConfEditor: monaco.editor.ITextModel | undefined;
    get confE() { return `l${this.level}_${this.position}`; }
    private confE2(positionToolbar: string) { return `l${this.level}_${positionToolbar}`; }
    get confETS() { return this.confE + '_TS'; }
    get confEJS() { return this.confE + '_JS'; }

    private saveViewState() {
        if (!this._ed1) return;
        const activeModel = mls.l2.editor.editors[this.confE];
        if (!activeModel) return;
        (activeModel as any)[`${this.position}_viewState`] = this._ed1.saveViewState();
    }

    private restaureViewState() {
        if (!this._ed1) return;
        const activeModel = mls.l2.editor.editors[this.confE];
        if (!activeModel) return;
        const viewState = (activeModel as any)[`${this.position}_viewState`];
        if (viewState) this._ed1.restoreViewState(viewState);
    }

    private setValueInModeKeepingUndo(model: monaco.editor.ITextModel, val: string, checkFirstLine: boolean) {
        let fullRange = model.getFullModelRange();
        let newText = val;

        if (checkFirstLine && !(val.trim().startsWith('/// <mls shortName'))) {
            const firstLine = model.getLineContent(1);
            newText = firstLine + '\n' + newText;
        }

        const lines = newText.split('\n');
        const operations = [{
            range: fullRange,
            text: '',
            forceMoveMarkers: true
        }, {
            range: { startLineNumber: 1, startColumn: 1 },
            text: lines.join('\n'),
            forceMoveMarkers: true
        }];

        model.pushEditOperations([], operations as any, () => []);
        this._ed1?.setPosition({ lineNumber: 1, column: 1 });

    }

    private openRepo() {
        const { shortName, project } = mls.l2.editor.editors[this.confE];
        const ext = this.menu.lastIcon === 'icTs' ? '.ts' : '.html';
        const keyToFile = mls.stor.getKeyToFiles(project, 2, shortName, '', ext);
        const file = mls.stor.files[keyToFile];
        if (!file) {
            window.collabMessages.add('Invalid File', 'information');
            throw new Error('invalid file');
        }
        const driver = mls.stor.others.getDefaultDriver(project);
        if (!driver) {
            window.collabMessages.add('Driver not found', 'information');
            throw new Error('Driver not found');
        }
        let url = '';

        url = driver.getUrl(file);
        window.open(url, '_blank');
        if (this.menu.closeMenu) this.menu.closeMenu();
        return true;
    }

    private showHistory() {
        this.showHistorie2();
        return true;
    }

    private async showHistorie2() {
        const { shortName, project } = mls.l2.editor.editors[this.confE];

        const div = document.createElement('div');
        const scr = document.createElement('script');
        const i2 = `/_${'100554'}_${'mlsHistoryList'}`;
        scr.type = 'module';
        scr.id = i2.replace('/', '');
        scr.src = i2;
        div.appendChild(scr);

        const ds = mls.l3.getDSInstance(100554, 0);
        if (ds) {
            await ds.init();
            ds.components.getCSS('_100554_mlsHistoryList').then((css) => {
                const style = document.createElement('style');
                style.textContent = css;
                div.appendChild(style);
            });
        }

        const obj = {
            icTs: '.ts',
            icHTML: '.html',
        };

        const wc = document.createElement('mls-history-list-100554');
        wc.setAttribute('project', project.toString());
        wc.setAttribute('shortName', shortName);
        wc.setAttribute('level', '2');
        if (this.menu.lastIcon) wc.setAttribute('extension', (obj as any)[this.menu.lastIcon]);
        wc.setAttribute('position', this.position);
        div.appendChild(wc);
        if (this.menu.setMode) this.menu.setMode('page', div);
    }

    private showPageTheme(): boolean {
        if (this.menu.setMode) this.menu.setMode('page', this.getGlobalPageSetTHeme());
        return true;
    }

    private showMonacoReset(): boolean {
        // reset editor configurations 
        (mls.editor.conf as any)[this.confE] = undefined;
        this.loadMonacoConfigurations();
        if (this.menu.setMode) this.menu.setMode('initial');
        this.updateMonacoConfigutarions();
        this.saveConfEditorToLocalStorage();
        return true;
    }

    private showConfEditor(): boolean {
        if (this.menu.setMode) this.menu.setMode('editor');
        this.setModelConfEditor();
        return true;
    }

    private static projectsLoaded: number[] = [];
    private async readAllProjectTypescriptAndCompile(project: number, shortName: string, needCompile: boolean = true): Promise<void> {
        // load all typescripts dependencies of project , except shortName
        if (ServiceSource100554.projectsLoaded.includes(project)) return;
        if (mls.istrace) console.log('loading files from project ' + project);
        ServiceSource100554.projectsLoaded.push(project);
        const promises: Promise<mls.l2.editor.IMFile>[] = [];
        const keys: string[] = Object.keys(mls.stor.files);

        if (window.traceLivecicle) console.info('creating: files model ', project);

        for (const key of keys) {
            const storFile = mls.stor.files[key];
            if (storFile.project === project
                && storFile.level === 2
                && storFile.extension === '.ts'
                && storFile.shortName !== shortName) {
                promises.push(this.createModelTS2(storFile, false, false));
            }
        }
        if (mls.istrace) console.time('creating models');
        await Promise.all(promises);
        if (mls.istrace) console.timeEnd('creating models');

        if (window.traceLivecicle) console.info('firing: mls.l2.editor.compileAllProjectIfNeed ', project);
        if (needCompile) await mls.l2.editor.compileAllProjectIfNeed(project, true);
    }

    private async deleteFile(storFile: mls.stor.IFileInfo) {
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        const activeModel = mls.l2.editor.editors[this.confE];
        if (activeModel.project === storFile.project && activeModel.shortName === storFile.shortName) await this.createModelTS_testFile(); // show test file
        mls.l2.editor.remove(storFile);
        this.removeEventsModelTS(storFile);
        const keyFiles = mls.stor.getKeyToFiles(storFile.project, storFile.level, storFile.shortName, storFile.folder, storFile.extension);
        delete mls.stor.files[keyFiles];
    }

    private async afterUpdate(storFile: mls.stor.IFileInfo) {
        const mmodel: mls.l2.editor.IMFile | undefined = mls.l2.editor.get(storFile);
        if (!mmodel) return;
        if (storFile.status === 'deleted') {
            this.deleteFile(storFile);
            return;
        }
        if (storFile.status === 'renamed') {
            mmodel.originalProject = undefined;
            mmodel.originalShortName = undefined;
            mmodel.originalCRC = mls.common.crc.crc32(mmodel.model.getValue()).toString(16);
        }
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        storFile.status = 'nochange';
    }

    private addEventsModelTS(storFile: mls.stor.IFileInfo, model1: mls.l2.editor.IMFile): void {
        storFile.onAction = (action: mls.stor.IFileInfoAction) => this.afterUpdate(storFile);
        storFile.getValueInfo = () => this.getValueInfo(model1);
        model1.model.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => this.onModelChange(e, model1, storFile));
    }

    private removeEventsModelTS(storFile: mls.stor.IFileInfo): void {
        storFile.onAction = undefined;
        storFile.getValueInfo = undefined;
    }

    private _onChangedContent: number | undefined = undefined;

    private onModelChange = (e: monaco.editor.IModelContentChangedEvent, activeModel: mls.l2.editor.IMFile, storFile: mls.stor.IFileInfo): void => {
        // some changes is to simulate changes to force compile
        clearTimeout(this._onChangedContent);
        this._onChangedContent = window.setTimeout(async () => {
            await this.updateModelStatus(activeModel, true);
            const ignoreChanges = (e.changes.length === 1 && e.changes[0].range.startLineNumber === 1 && e.changes[0].range.endLineNumber === 1 && e.changes[0].range.endColumn <= 2);
            if (ignoreChanges) return;
            let position: 'left' | 'right';
            if (mls.l2.editor.editors[this.confE2('left')]?.model.id === activeModel.model.id) {
                position = 'left';
            } else {
                position = 'right';
            }
            mls.events.fireFileAction('changed', storFile, position);
        }, 400);
    };

    private getValueInfo = async (activeModel: mls.l2.editor.IMFile): Promise<mls.stor.IFileInfoValue> => {
        const rc: mls.stor.IFileInfoValue = {
            content: activeModel.model.getValue(),
            contentType: 'string',
            originalShortName: activeModel.originalShortName,
            originalProject: activeModel.originalProject,
            originalCRC: activeModel.originalCRC
        };
        return rc;
    }

    private onMonacoEvents(ev: mls.events.IEvent): void {
        if (!ev.desc) return;
        const args: mls.events.IMonacoAction = JSON.parse(ev.desc);
        if (!args) return;
        const { action, filePosition, position, project, shortName } = args;
        if (position !== this.position) return;
        if (action === 'gotoPosition') {
            this.goToPosition(filePosition, position);
        }
        if (mls.istrace) console.info('received monaco actions', args);
    }

    private goToPosition(position: number, editorPosition: 'left' | 'right') {
        if (!this._ed1) return;
        const confInvert = `l${this.level}_${editorPosition === 'left' ? 'right' : 'left'}`;
        const offset = position - 1;
        const { lineNumber, column } = mls.l2.editor.editors[confInvert].model.getPositionAt(offset);
        this._ed1.revealPositionInCenter({ lineNumber, column }, monaco.editor.ScrollType.Immediate);
        const lineLength = mls.l2.editor.editors[confInvert].model.getLineContent(lineNumber).length + 1;
        const range = new monaco.Range(lineNumber, column, lineNumber, lineLength);
        this._ed1.setSelection(new monaco.Selection(range.startLineNumber, 0, range.startLineNumber, lineLength));
    }

    private onProjectLoadedEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {
        if (ev.level !== this.level) return;
        if (!ev.desc) return;
        try {
            const projectLoadedInfo = JSON.parse(ev.desc) as mls.events.IProjectLoaded;
            await this.readAllProjectTypescriptAndCompile(projectLoadedInfo.project, '', projectLoadedInfo.needCompile);
        } catch (e) {
            console.error('Error on serviceSource_onProjectLoadedEvents: ', e);
        }
    }

    private isNewFile: boolean = false;
    private onMLSEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {

        if (ev.level !== this.level || (ev.type !== 'FileAction')) return;
        if (!ev.desc) return;
        const fileAction = JSON.parse(ev.desc) as mls.events.IFileAction;
        if (fileAction.position !== this.position) return;
        let keyFiles: string; // set on getStorFile 
        let keyFilesHTML: string; // set on getStorFile 

        const getStorFile = (): mls.stor.IFileInfo => {
            keyFiles = mls.stor.getKeyToFiles(fileAction.project, fileAction.level, fileAction.shortName, fileAction.folder, fileAction.extension);
            const storFile = mls.stor.files[keyFiles];
            if (!storFile) throw new Error('Error on open, mls.stor.files dont exists, key:' + keyFiles);
            return storFile;
        };

        const getStorFileHTML = (): mls.stor.IFileInfo | undefined => {
            keyFilesHTML = mls.stor.getKeyToFiles(fileAction.project, fileAction.level, fileAction.shortName, fileAction.folder, '.html');
            return mls.stor.files[keyFilesHTML];
        };

        const onNew = async (): Promise<void> => {
            await this.newFiles(
                fileAction.newshortName as string,
                fileAction.newProject as number,
                fileAction.newEnhancement as string,
                fileAction.newTSSource as string
            );
        };

        const onOpen = async (): Promise<void> => {
            const storFile = getStorFile();
            const storFileHTML: mls.stor.IFileInfo | undefined = getStorFileHTML();
            await this.openFiles(storFileHTML, storFile, fileAction.position);
        };

        const onDelete = async (): Promise<void> => {
            const storFile = getStorFile();
            const storFileHTML: mls.stor.IFileInfo | undefined = getStorFileHTML();
            await this.deleteFiles(storFileHTML, storFile);
        };

        const onUndo = async (): Promise<void> => {
            const storFile = getStorFile();
            const storFileHTML = getStorFileHTML();
            await this.undoFiles(storFileHTML, storFile, keyFilesHTML, keyFiles);
        };

        const onRename = async (): Promise<void> => {
            const storFile = getStorFile();
            const storFileHTML = getStorFileHTML();
            await this.renameFiles(storFileHTML, storFile, fileAction.newProject as number, fileAction.newshortName as string, fileAction);
        };

        const onClone = async (): Promise<void> => {
            const storFile = getStorFile();
            await this.cloneFiles(storFile, fileAction.newProject as number, fileAction.newshortName as string, fileAction);
        };

        const onUpdatedOnServer = async (): Promise<void> => {
            await this.updatedOnServer();
        };

        if (mls.istrace) console.time('onAction_' + fileAction.action + '_' + fileAction.position);
        // if (fileAction.action !== 'preLoadProject') await this.initMonaco(false); // init if needed
        await this.initMonaco(); // init if needed
        switch (fileAction.action) {
            case 'new': await onNew(); break;
            case 'open': await onOpen(); break;
            case 'delete': await onDelete(); break;
            case 'undo': await onUndo(); break;
            case 'rename': await onRename(); break;
            case 'clone': await onClone(); break;
            case 'updatedOnServer': await onUpdatedOnServer(); break;
            default: {
                // console.error('invalid action: ' + fileAction.action);
            }
        }
        if (mls.istrace) console.timeEnd('onAction_' + fileAction.action + '_' + fileAction.position);
    }

    private async deleteFiles(storFileHTML: mls.stor.IFileInfo | undefined, storFileTS: mls.stor.IFileInfo) {
        for await (let storFile of [storFileHTML, storFileTS]) {
            if (!storFile) continue;
            if (storFile.status === 'new') this.deleteFile(storFile);
            else storFile.status = 'deleted';
            mls.events.fireFileAction('statusOrErrorChanged', storFile, this.position);
        }
    }

    private async cloneFiles(storFileTS: mls.stor.IFileInfo, newProject: number, newShortName: string, oldFileAction: mls.events.IFileAction) {
        await this.createModelTS_loading();
        this.activeThisService();
        await this.createModelTS_clone(storFileTS, newProject, newShortName);
        await this.createModelHTML_clone(storFileTS, newProject, newShortName);

        (mls.actual[this.level] as any)[this.position] = {
            project: newProject,
            shortName: newShortName
        }

        const fileAction: mls.events.IFileAction = {
            ...oldFileAction,
            project: newProject,
            shortName: newShortName,
            action: 'open',
            newProject: undefined,
            newshortName: undefined,
        }

        const ev: mls.events.IEvent = {
            level: this.level,
            type: 'FileAction',
            desc: JSON.stringify(fileAction)
        }

        this.onMLSEvents(ev);
    }

    private async newFiles(newShortName: string, newProject: number, newEnhancement: string, tsSource: string) {

        this.isNewFile = true;
        this.activeThisService();
        this.closeMenu();
        const newTSSource = tsSource
            || `/// <mls shortName="${newShortName}" project="${newProject}" enhancement="${newEnhancement}" />
				\n// typescript new file\n`;
        await this.createModelTS1(newShortName as string, newProject as number,
            newTSSource, true);
        await this.createOrShowModelHTML(false);
        this.showActiveModel();
        this.isNewFile = false;
    }

    private async openFiles(storFileHTML: mls.stor.IFileInfo | undefined, storFileTS: mls.stor.IFileInfo, position: 'left' | 'right') {

        await this.createModelTS_loading();
        this.activeThisService();
        this.closeMenu();
        const fileModel = mls.l2.editor.get(storFileTS);
        if (!fileModel) {
            await this.createModelTS2(storFileTS, true, true);
            this.showActiveModel();
            await this.readAllProjectTypescriptAndCompile(storFileTS.project, storFileTS.shortName, true).then(async () => {
                await this.createOrShowModelHTML(false);
            });
        } else {
            mls.l2.editor.editors[this.confE] = fileModel;
            mls.l2.editor.forceModelUpdate(fileModel.model);
            await this.createOrShowModelHTML(false);
            this.showActiveModel();
        }
        if (storFileTS && !storFileTS.inLocalStorage && storFileTS.isLocalVersionOutdated)
            storFileTS.isLocalVersionOutdated = false;

        if (storFileHTML && !storFileHTML.inLocalStorage && storFileHTML.isLocalVersionOutdated)
            storFileHTML.isLocalVersionOutdated = false;

        this.saveLocalStorageLastOpen(storFileTS, position);
        if (!this._ed1) return;
        this.restaureViewState();
    }


    private async renameFiles(storFileHTML: mls.stor.IFileInfo | undefined, storFileTS: mls.stor.IFileInfo, newProject: number, newShortName: string, oldFileAction: mls.events.IFileAction) {

        await this.createModelTS_loading();
        this.activeThisService();
        let model1 = mls.l2.editor.get(storFileTS);
        if (!model1) model1 = await this.createModelTS2(storFileTS, false, true);
        this.renameTSFile(model1, storFileTS, newProject, newShortName);

        mls.l2.editor.editors[this.confE] = model1;
        this.renameHTMLFile(storFileHTML as mls.stor.IFileInfo, newProject, newShortName);

        (mls.actual[this.level] as any)[this.position] = {
            project: newProject,
            shortName: newShortName
        }

        const fileAction: mls.events.IFileAction = {
            ...oldFileAction,
            project: newProject,
            shortName: newShortName,
            action: 'open',
            newProject: undefined,
            newshortName: undefined,
        }

        const ev: mls.events.IEvent = {
            level: this.level,
            type: 'FileAction',
            desc: JSON.stringify(fileAction)
        }
        this.onMLSEvents(ev);
    }

    private async updatedOnServer() {
        try {

            const keys = Object.keys(mls.stor.files);
            const arr: mls.stor.IFileInfo[] = [];
            let needMsg = false;
            keys.forEach((key) => {
                const f = mls.stor.files[key];
                if (!f) return;
                if (f.inLocalStorage || !f.isLocalVersionOutdated) return;
                arr.push(f);
            });

            await mls.l2.editor.compileAllProjectIfNeed(mls.actual[5].project as number, true, false);
            for await (const storFile of arr) {
                mls.l2.editor.remove(storFile);
                this.removeEventsModelTS(storFile);
                await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
                await this.createModelTS2(storFile, false, true);
                if (storFile.project === 100554) needMsg = true;
            }

            if (needMsg) {
                window.collabMessages.add("Files changed in server , please use F5 to reload", 'information', { autoClose: false, clearOnClose: false });
            }

        } catch (e) {
            console.info('Erro service source: onUpdatedOnServer')
        }
    }


    private async undoFiles(storFileHTML: mls.stor.IFileInfo | undefined, storFileTS: mls.stor.IFileInfo, keyFileHTML: string, keyFileTS: string) {

        for await (let data of [{ storFile: storFileHTML, keyFiles: keyFileHTML }, { storFile: storFileTS, keyFiles: keyFileTS }]) {

            if (!data.storFile) continue;
            if (data.storFile.status === 'deleted') {
                data.storFile.status = 'changed';
                mls.events.fireFileAction('statusOrErrorChanged', data.storFile, this.position);
                continue;
            }

            if (data.storFile.status === 'renamed') {
                throw new Error('not implemented');
            }

            if (data.storFile.extension === '.ts') {
                // clear memory changes and localstor changes
                const imFile = mls.l2.editor.editors[this.confE];
                if (imFile.project === data.storFile.project && imFile.shortName === data.storFile.shortName) await this.createModelTS_testFile(); // show test file
                mls.l2.editor.remove(data.storFile);
                this.removeEventsModelTS(data.storFile);
            }

            await mls.stor.localStor.setContent(data.storFile, { contentType: 'string', content: null });
            if (data.storFile.status === 'new') {
                delete mls.stor.files[data.keyFiles];
                mls.events.fireFileAction('statusOrErrorChanged', data.storFile, this.position);
                continue;
            }

            if (data.storFile.status === 'changed') {
                data.storFile.status = 'nochange';
                if (data.storFile.isLocalVersionOutdated && data.storFile.newVersionRefIfOutdated) {
                    data.storFile.versionRef = data.storFile.newVersionRefIfOutdated;
                    data.storFile.isLocalVersionOutdated = false;
                    data.storFile.newVersionRefIfOutdated = undefined;
                }
            } else {
                data.storFile.status = 'changed';
            }

            if (data.storFile.extension === '.ts') await this.createModelTS2(data.storFile, false, true);
            else {
                const uri = this.getUri(`_${data.storFile.project}_${data.storFile.shortName}`, '.html');
                const model = monaco.editor.getModel(uri);
                if (model) model.dispose();
                await this.createOrShowModelHTML(false);
            }

            mls.events.fireFileAction('statusOrErrorChanged', data.storFile, this.position);

        };

    }

    private activeThisService(): void {
        this.openMe();
        mls.editor.setActiveInstance(this.level, this.position);
    }

    private closeMenu() {
        if (this.menu.closeMenu) this.menu.closeMenu()
    }

    private async updateModelStatus(model1: mls.l2.editor.IMFile, changed: boolean): Promise<void> {
        if (model1.project === 0) changed = true; // always in localstorage
        model1.changed = changed;

        const cr: mls.l2.editor.ICompilerResult = await mls.l2.editor.getCompilerResultTS({ project: model1.project, shortName: model1.shortName }, true);
        let hasError = cr.errors.length > 0;
        model1.error = hasError;
        const key = mls.stor.getKeyToFiles(model1.project, this.level, model1.shortName, '', model1.extension);
        const storFile: mls.stor.IFileInfo = mls.stor.files[key];
        const d = { project: model1.project, shortName: model1.shortName, level: this.level, position: this.position };
        // mls.events.fire(2, 'TSSourceChanged', JSON.stringify(d));
        if (!hasError) {
            const enhancementInstance: mls.l2.enhancement.IEnhancementInstance | undefined = await mls.l2.enhancement.getEnhancementInstance(model1).catch((e) => undefined);
            if (enhancementInstance) await enhancementInstance.onAfterChange(model1);
            hasError = storFile.hasError;
        }
        await this.changeStatusFile(model1, storFile, cr.tripleSlashMLS?.variables, hasError);
    }

    private async changeStatusFile(model1: mls.l2.editor.IMFile, storFile: mls.stor.IFileInfo, variables: mls.common.tripleslash.ITripleSlashVariables, hasError: boolean): Promise<void> {
        if (!storFile) return; // new file dont have storFile ???
        const oldStatus = storFile.status;
        storFile.hasError = hasError;
        const sameContent: boolean = model1.originalCRC === mls.common.crc.crc32(model1.model.getValue()).toString(16);
        if (sameContent) {
            if (storFile.status !== 'new') storFile.status = 'nochange';
            await mls.stor.localStor.setContent(storFile, { content: null }); // clear localstorage
        } else {
            if (storFile.status !== 'renamed' && (storFile.status !== 'new')) storFile.status = 'changed';
            await mls.stor.localStor.setContent(storFile, await this.getValueInfo(model1));
        }
        if (oldStatus !== storFile.status) {
            mls.events.fireFileAction('statusOrErrorChanged', storFile, this.position);
        }
    }

    private renameTSFile(model1: mls.l2.editor.IMFile, storFile: mls.stor.IFileInfo, newProject: number, newShortName: string): void {
        if (storFile.hasError) throw new Error('Error on rename, clear errors before rename');
        if (!this.isNewNameValid(newShortName)) throw new Error('Error on rename, new shortName is a invalid name');
        const newSts: mls.l2.editor.IPath = { shortName: newShortName, project: newProject };
        if (!mls.l2.editor.rename(model1, newSts)) throw new Error('Error on rename mls.l2.editor.mfiles');
        if (!mls.stor.renameFile(storFile, newSts)) throw new Error('Error on rename mls.stor.files');
        mls.common.tripleslash.changeVariable(model1, 'shortName', newShortName);
        mls.common.tripleslash.changeVariable(model1, 'project', newProject.toString());
        if (storFile.status === 'new') return;
        storFile.status = 'renamed'; // poderia ficar na funÁ„o 
        // setTimeout(() => {
        // 	storFile.status = 'renamed';
        // }, 600); // after change editor, status change to 'changed'
    }

    private isNewNameValid(newShortName: string): boolean {
        if (newShortName.length === 0 || newShortName.length > 255) return false;
        const invalidCharacters = /[_\/{}\t\[\]\*$@#=\-+!|?,<>=.;^~∫∞""''``·‡‚„ÈËÍÌÔÛÙıˆ˙ÁÒ¡¿¬√…»Õœ”‘’÷⁄«—]/;
        return (!invalidCharacters.test(newShortName));
    }

    private showActiveModel(): boolean {

        let activeModel = mls.l2.editor.editors[this.confE];
        if (activeModel && activeModel.project === 0 && activeModel.shortName === 'testFile' && !this.isNewFile) {
            const ret = this.openLastFile(this.level, this.position);
            if (ret) activeModel = mls.l2.editor.editors[this.confE];
        }

        if (!this._ed1 || !activeModel || !this.menu.getLastMode) return false;
        const changedFile: boolean = this.menu.title !== activeModel.shortName;
        (this.menu.title as IMenuTitle).text = `_${activeModel.project}_${activeModel.shortName}`;
        const lastMode = this.menu.getLastMode();
        if (changedFile && lastMode !== 'initial') {
            // user choice another file, goto initial editor
            this._ed1.setModel(activeModel.model);
            if (this.menu.setMode) this.menu.setMode('initial');
        } else if (lastMode === 'initial') {
            this._ed1.setModel(activeModel.model);
            if (this.menu.updateTitle) this.menu.updateTitle();
        } else if (lastMode === 'editor') {
            // dont change model , ex TS Config
        } else if (lastMode === 'page') {
            // in page, ex About, prepare model to after close hamburger
            this._ed1.setModel(activeModel.model);
        }
        this.c2?.setAttribute('msize', this.msize);
        return true;
    }

    private async initMonaco() {
        if (!this._ed1) {
            await this.initMonaco_Editor();
            if (this.serviceContent && typeof this.serviceContent.layout === 'function') this.serviceContent.layout();
        }
    }

    private monacoGlobalInitialized = false;
    private async initMonaco_GlobalEditor(): Promise<void> {

        this.loadMonacoConfigurations();

        if (this.monacoGlobalInitialized) return;
        this.monacoGlobalInitialized = true;
        this.loadMonacoThemeFromLocalStorage();
        this.updateMonacoGlobalTheme();
        mls.editor.InitMonaco();

    }

    private async initMonaco_Editor(): Promise<void> {

        const addEventsEditor = () => {
            if (!this._ed1) return;
            this._ed1.onDidFocusEditorWidget(() => {
                if (this.menu.lastIcon === 'icHTML') return;
                mls.editor.setActiveInstance(this.level, this.position);
            });
        };

        if (!this.c2) return;

        this._ed1 = monaco.editor.create(this.c2, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);
        (this.c2 as any)['mlsEditor'] = this._ed1;
        mls.editor.instances[this.confE] = this._ed1;
        mls.editor.InitEditor(this._ed1);
        addEventsEditor();

        this.createModelTS_loading();
        this.createModelConf('// loading ...'); // model 
        // global routines dont need this._ed1
        await this.createModelTS_testFile();
    }

    private loadMonacoConfigurations() {
        if (!mls.editor.conf || Object.keys(mls.editor.conf).length === 0) {
            this.loadConfEditorFromLocalStorage();
        }
        if (mls.editor.conf[this.confE]) return;
        mls.editor.conf[this.confE] = {
            contextmenu: true,
            autoIndent: 'full',
            wordWrap: 'on',
            wrappingIndent: 'indent',
            tabCompletion: 'on',
            renderControlCharacters: false,
            showUnused: true,
            glyphMargin: true,
            // acceptSuggestionOnEnter: "off",  // "on", "smart" -> ex: "dd" , invalid work will be get for next suggestion, bad
            minimap: { enabled: false },
            useTabStops: true,
            scrollBeyondLastColumn: 2,
            scrollBeyondLastLine: false,
            formatOnType: true,
            fixedOverflowWidgets: true,
            codeLens: true,
            showFoldingControls: 'mouseover',
            suggestSelection: 'first',
            stickyScroll: { enabled: false, maxLineCount: 3 },
            stickyTabStops: true,
            fontSize: 20,
            automaticLayout: true,
        } as monaco.editor.IEditorOptions;
    }

    private getUri(shortFN: string, ftype: '.ts' | '.d.ts' | '.html'): monaco.Uri {
        return monaco.Uri.parse(`file://server/${shortFN}${ftype}`);
    }

    private async createModelTS_testFile() {
        const shortName = 'testFile';
        const project = 0; // localstorage project
        const defaultTS = `/// <mls shortName="${shortName}" project="${project}" enhancement="config_ts_web-component" />\n// typescript example`;
        await this.createModelTS1(shortName, project, defaultTS, true);
    }

    onFirtModel = true;
    private async createModelTS_loading() {
        const shortName = 'loading...';
        const project = 0; // localstorage project
        const defaultTS = 'wait...';
        const mfile = await this.createModelTS1(shortName, project, defaultTS, true);
        if (this.onFirtModel && this._ed1) {
            this.onFirtModel = false;
            this._ed1.setModel(mfile.model);
        }
        // await mls.l2.editor.getCompilerResultTS(mfile, true);
    }

    private async createModelTS_clone(storFile: mls.stor.IFileInfo, newProject: number, newShortName: string) {
        let model1 = mls.l2.editor.get(storFile);
        if (!model1) model1 = await this.createModelTS2(storFile, false, true);
        let defaultTS = model1.model.getValue();

        const baseTag = convertFileNameToTag(`_${storFile.project}_${storFile.shortName}`)
        const newTag = convertFileNameToTag(`_${newProject}_${newShortName}`);
        const regex = new RegExp(baseTag, 'g');

        defaultTS = defaultTS.replace(regex, newTag);
        defaultTS = this.changeClassName(defaultTS, newProject, newShortName);

        model1 = await this.createModelTS1(newShortName, newProject, defaultTS, true);
        mls.common.tripleslash.changeVariable(model1, 'shortName', newShortName);
        mls.common.tripleslash.changeVariable(model1, 'project', newProject.toString());
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

    private async createModelHTML_clone(storFile: mls.stor.IFileInfo, newProject: number, newShortName: string) {

        const { shortName, project } = storFile;
        const uri = this.getUri(`_${project}_${shortName}`, '.html');
        let model = monaco.editor.getModel(uri);
        let cont = '<h1>Edit this</h1>';
        let key = '';

        if (model) cont = model.getValue();
        else {
            key = mls.stor.getKeyToFiles(project, storFile.level, shortName, '', '.html');
            if (mls.stor.files[key]) cont = await mls.stor.files[key].getContent() as any;
        }

        const baseTag = convertFileNameToTag(`_${storFile.project}_${storFile.shortName}`)
        const newTag = convertFileNameToTag(`_${newProject}_${newShortName}`);
        const regex = new RegExp(baseTag, 'g');

        cont = cont.replace(regex, newTag);

        key = mls.stor.getKeyToFiles(newProject, storFile.level, newShortName, '', '.html');

        let file = mls.stor.files[key];

        if (!file) {

            file = await mls.stor.addOrUpdateFile({ project, level: storFile.level, shortName: newShortName, extension: '.html', versionRef: new Date().toISOString(), folder: '' });
            file.status = 'new';
        }

        const fileInfo: mls.stor.IFileInfoValue = {
            content: cont,
            contentType: 'string',
        };

        await mls.stor.localStor.setContent(file, fileInfo);

        await this.getOrCreateModelHTML(newShortName, newProject, file, fileInfo);

    }

    private async createModelTS1(shortName: string, project: number, defaultTS: string, activateModel: boolean): Promise<mls.l2.editor.IMFile> {
        // create new file or load project 0 file
        const level = 2;
        const extension = '.ts';
        if (project > 1) await mls.stor.server.loadProjectInfoIfNeeded(project);
        const key = mls.stor.getKeyToFiles(project, level, shortName, '', extension);
        let storFile = mls.stor.files[key];
        // if (storFile && project !== 0) throw new Error('Error on createModelTS1, model already exists: ' + key);
        if (!storFile) {
            storFile = await mls.stor.addOrUpdateFile({ project, level, shortName, extension, versionRef: new Date().toISOString(), folder: '' });
            storFile.status = 'new';
        }
        let model1 = mls.l2.editor.get({ project, shortName });
        if (!model1) {
            const src: string = storFile ? (await storFile.getContent(defaultTS)) as string || defaultTS : defaultTS;
            const ftype = src.split("\n")[0].indexOf(' type="definition"') > 0 ? ".d.ts" : ".ts";
            const uri = this.getUri(`_${project}_${shortName}`, ftype);
            model1 = mls.l2.editor.get({ project, shortName });
            if (model1) return model1; // created in another instance
            const model = monaco.editor.createModel(src, 'typescript', uri);
            model1 = {
                changed: true,
                error: false,
                project,
                shortName,
                extension,
                model,
                storFile,
                codeLens: [],
            };
            mls.l2.editor.add(model1);
            this.addEventsModelTS(storFile, model1);
        }
        await this.updateModelStatus(model1, false); // first compilation
        if (activateModel) mls.l2.editor.editors[this.confE] = model1;
        return model1;
    }

    private async createModelTS2(storFile: mls.stor.IFileInfo, activedModel: boolean, compile: boolean): Promise<mls.l2.editor.IMFile> {
        // load source from repository
        const { project, shortName, extension } = storFile;
        let model1 = mls.l2.editor.get({ project, shortName });
        if (model1) return model1;
        const info: mls.stor.IFileInfoValue | null = storFile.getValueInfo ? await storFile.getValueInfo() : null;
        const haveInfo: boolean | null = info && !!info.content;
        const src: string | Blob | null | undefined = haveInfo ? info?.content : await storFile.getContent();
        if (src instanceof Blob) throw new Error('ts file must be string');
        if (!src) throw new Error('ts file is undefined');;

        const originalCRC = haveInfo ? info?.originalCRC : mls.common.crc.crc32(src).toString(16);
        const originalProject: number | undefined = haveInfo ? info?.originalProject : undefined;
        const originalShortName: string | undefined = haveInfo ? info?.originalShortName : undefined;
        const ftype = src.split("\n")[0].indexOf(' type="definition"') > 0 ? ".d.ts" : ".ts";
        const uri = this.getUri(`_${project}_${shortName}`, ftype);
        const model = monaco.editor.createModel(src, 'typescript', uri);
        model1 = {
            changed: false, // not changed in this section, but storFile.changed is about all sections
            error: false,
            project,
            shortName,
            extension,
            model,
            storFile,
            originalCRC,
            originalProject,
            originalShortName,
            codeLens: [],
        };
        mls.l2.editor.add(model1);
        this.addEventsModelTS(storFile, model1);
        if (compile) {
            await this.updateModelStatus(model1, false);
        }
        if (activedModel) {
            mls.l2.editor.editors[this.confE] = model1;
        }
        return model1;
    }

    private setModelConfEditor() {
        if (!this._ed1 || !this.mConfEditor) return;
        const src = this.getConfEditorToTypescript();
        (this.mConfEditor as any)['mlsConf'] = 'confEditor';
        this.mConfEditor.setValue(src);
        this._ed1.setModel(this.mConfEditor);
    }

    private async createModelConf(src: string) {
        if (mls.istrace) console.log(`ServiceSource, createModelConf_${this.position}, ${!!this.mConfEditor}`);
        if (this.mConfEditor) return;
        const shortName = this.confE + '_service_source.confEditor';
        const level = 2;
        const project = 0;
        const extension = '.ts';
        const storFile = await mls.stor.addOrUpdateFile({ project, level, shortName, extension, versionRef: new Date().toISOString(), folder: '' });
        const uri = this.getUri(shortName, extension);

        const model = monaco.editor.getModel(uri);
        if (model) {
            this.mConfEditor = model;
        } else this.mConfEditor = monaco.editor.createModel(src, 'typescript', uri);

        mls.l2.editor.add({
            changed: false,
            error: false,
            model: this.mConfEditor,
            storFile,
            project: 0,
            shortName,
            extension,
            codeLens: [],
        });
        this.mConfEditor.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => {
            const mode = (this.mConfEditor as any)['mlsConf'];
            if (!mode || !this.mConfEditor) return;
            src = this.mConfEditor.getValue();
            this.compileSrcEditor(mode, src);
        });
    }

    timeout_compileConfEditor = 0;
    private compileSrcEditor(mode: 'confEditor', src: string) {
        // wait 500ms to get diagnostics
        clearTimeout(this.timeout_compileConfEditor);
        this.timeout_compileConfEditor = window.setTimeout(async () => {
            if (!this.mConfEditor) return;
            const mmodel = mls.l2.editor.find(this.mConfEditor.id);
            // console.info(`js compiled, model id=${this.mConfEditor.id}, model found=${!!mmodel}`);
            if (!mmodel) return; // not in model
            const rcc = await mls.l2.editor.getCompilerResultTS(mmodel, true);
            if (rcc.errors.length !== 0 || !rcc.prodJS) return;
            if (mode === 'confEditor') this.setConfEditorFromJavascript(rcc.prodJS, src);
        }, 500);
    }

    private loadConfEditorFromLocalStorage() {
        const json: string | null = localStorage.getItem('mlsConfEditor');
        if (json) {
            mls.editor.loadConfFromJSON(json);
        }
    }

    private saveConfEditorToLocalStorage() {
        localStorage.setItem('mlsConfEditor', JSON.stringify(mls.editor.conf));
    }

    private loadMonacoThemeFromLocalStorage(): void {
        if (!mls.editor.themeName) mls.editor.setThemeName(localStorage.getItem('mlsConfTheme'));
    }

    private saveMonacoGlobalThemeToLS(): void {
        localStorage.setItem('mlsConfTheme', mls.editor.themeName);
    }

    private getConfEditorToTypescript(): string {
        return `/// <mls shortName="config_monaco_editor" project="0" enhancement="config_config" />
		
mls.editor.conf['${this.confE}'] = ` + JSON.stringify(mls.editor.conf[this.confE], null, 2) + ';\n';
    }

    private setConfEditorFromJavascript(javastr: string, src: string): void {
        if (this.level < 1) return;
        const that = this;
        (function scope() {
            eval(javastr); // eslint-disable-line no-eval
            if (mls.editor.conf[that.confE] && typeof mls.editor.conf[that.confE] === 'object') {
                // mls.editor.loadConf(that.confETS, src);
                that.updateMonacoConfigutarions();
                that.saveConfEditorToLocalStorage();
            }
        }).call(this); // eval in context scopeDesenv https://stackoverflow.com/questions/8403108/calling-eval-in-particular-context
    }

    private async updateMonacoConfigutarions(): Promise<void> {
        if (this._ed1) this._ed1.updateOptions(mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);
    }

    private updateMonacoGlobalTheme(): boolean {
        let rc = true;
        if (mls.istrace) console.log(`service source, updating monaco theme: ${this.position}`);
        const internalThemes = ['VS', 'VS Dark', 'High Contrast (Dark)'];
        const internalThemes2 = ['vs', 'vs-dark', 'hc-black', 'hc-light'];
        let name2: string = ''; // name to use , internal name or mytheme
        try {
            const internalIndex = internalThemes.indexOf(mls.editor.themeName);
            if (internalIndex < 0) {
                // load and define theme
                name2 = 'mytheme';
                const path = (mls as any)['baseMonaco'] + '../themes/' + mls.editor.themeName + '.json';
                mls.api.get(path, {}, (data: string) => {
                    const json = JSON.parse(data);
                    monaco.editor.defineTheme(name2, json);
                    monaco.editor.setTheme(name2);
                });
            } else {
                name2 = internalThemes2[internalIndex];
                monaco.editor.setTheme(name2);
            }
        } catch (ex) {
            console.error('error on set theme ' + name2, ex);
            rc = false;
        }
        return rc;
    }

    private getGlobalPageSetTHeme(): HTMLDivElement {
        const div1 = document.createElement('div');
        div1.innerHTML = `<div>` // eslint-disable-line
            + `<p id='theme-actual'>Theme actual: ${mls.editor.themeName} </p><br>`
            + `<p>Set Theme (only 1 theme in all editors)</p>` // eslint-disable-line
            // eslint-disable-next-line
            + `<select class="hidden" id="theme-select" style="display: initial;"><option>select ...</option><option value="vs">VS</option><option value="vs-dark">VS Dark</option><option value="hc-black">High Contrast (Dark)</option><option value="active4d">Active4D</option><option value="all-hallows-eve">All Hallows Eve</option><option value="amy">Amy</option><option value="birds-of-paradise">Birds of Paradise</option><option value="blackboard">Blackboard</option><option value="brilliance-black">Brilliance Black</option><option value="brilliance-dull">Brilliance Dull</option><option value="chrome-devtools">Chrome DevTools</option><option value="clouds-midnight">Clouds Midnight</option><option value="clouds">Clouds</option><option value="cobalt">Cobalt</option><option value="cobalt2">Cobalt2</option><option value="dawn">Dawn</option><option value="dracula">Dracula</option><option value="dreamweaver">Dreamweaver</option><option value="eiffel">Eiffel</option><option value="espresso-libre">Espresso Libre</option><option value="github">GitHub</option><option value="idle">IDLE</option><option value="katzenmilch">Katzenmilch</option><option value="kuroir-theme">Kuroir Theme</option><option value="lazy">LAZY</option><option value="magicwb--amiga-">MagicWB (Amiga)</option><option value="merbivore-soft">Merbivore Soft</option><option value="merbivore">Merbivore</option><option value="monokai-bright">Monokai Bright</option><option value="monokai">Monokai</option><option value="night-owl">Night Owl</option><option value="oceanic-next">Oceanic Next</option><option value="pastels-on-dark">Pastels on Dark</option><option value="slush-and-poppies">Slush and Poppies</option><option value="solarized-dark">Solarized-dark</option><option value="solarized-light">Solarized-light</option><option value="spacecadet">SpaceCadet</option><option value="sunburst">Sunburst</option><option value="textmate--mac-classic-">Textmate (Mac Classic)</option><option value="tomorrow-night-blue">Tomorrow-Night-Blue</option><option value="tomorrow-night-bright">Tomorrow-Night-Bright</option><option value="tomorrow-night-eighties">Tomorrow-Night-Eighties</option><option value="tomorrow-night">Tomorrow-Night</option><option value="tomorrow">Tomorrow</option><option value="twilight">Twilight</option><option value="upstream-sunburst">Upstream Sunburst</option><option value="vibrant-ink">Vibrant Ink</option><option value="xcode-default">Xcode_default</option><option value="zenburnesque">Zenburnesque</option><option value="iplastic">iPlastic</option><option value="idlefingers">idleFingers</option><option value="krtheme">krTheme</option><option value="monoindustrial">monoindustrial</option></select>`;
        const sel = div1.querySelector('#theme-select') as HTMLSelectElement;
        if (!sel) return div1;
        sel.oninput = (ev: any) => {
            if (ev?.srcElement?.localName === 'select') {
                const el = (ev.srcElement as HTMLSelectElement);
                const actual = div1.querySelector('#theme-actual');
                if (el.selectedIndex < 1) return; // option 0 is select ...
                mls.editor.setThemeName(el.options?.[el.selectedIndex].text || 'default');
                this.saveMonacoGlobalThemeToLS();
                this.updateMonacoGlobalTheme();
                if (actual) actual.innerHTML = `Theme changed to: ${mls.editor.themeName}`;
            }
        };
        return div1;
    }

    private async createOrShowModelHTML(open: boolean, fileInfo?: mls.stor.IFileInfoValue): Promise<mls.stor.IFileInfo> {

        const { shortName, project } = mls.l2.editor.editors[this.confE];
        const uri = this.getUri(`_${project}_${shortName}`, '.html');
        let model = monaco.editor.getModel(uri);

        const key = mls.stor.getKeyToFiles(project, this.level, shortName, '', '.html');
        let storFileHTML = mls.stor.files[key];
        if (!storFileHTML) {
            await this.createHTMLFile(project, shortName, `<h1>_${project}_${shortName}</h1>`);
            storFileHTML = mls.stor.files[key];
        }

        if (!model) model = await this.getOrCreateModelHTML(shortName, project, storFileHTML, fileInfo);
        let src: string | Blob | null | undefined;

        const info: mls.stor.IFileInfoValue | null = storFileHTML.getValueInfo ? await storFileHTML.getValueInfo() : null;
        const haveInfo: boolean | null = info && !!info.content;
        src = haveInfo ? info?.content : "";
        if (!src) {
            src = await storFileHTML.getContent();
            if (!src) console.log('error on getContent, src is null');
        }
        if (src instanceof Blob) throw new Error('html file must be string');
        if (!src) src = "";
        const originalCRC = haveInfo ? info?.originalCRC : mls.common.crc.crc32(src as string).toString(16);
        (model as any)['originalCRC'] = originalCRC;
        if (src) model.setValue(src);
        if (open && this._ed1) this._ed1.setModel(model);
        return storFileHTML;
    }

    private async createHTMLFile(project: number, shortName: string, content: string) {
        const params = {
            project,
            level: 2,
            shortName,
            extension: '.html',
            versionRef: '0',
            folder: ''
        };
        const file = await mls.stor.addOrUpdateFile(params);
        file.status = 'new';
        const fileInfo: mls.stor.IFileInfoValue = {
            content,
            contentType: 'string',
        };
        await mls.stor.localStor.setContent(file, fileInfo);
    }

    private async getOrCreateModelHTML(shortName: string, project: number, storFileHTML: mls.stor.IFileInfo, fileInfo?: mls.stor.IFileInfoValue): Promise<monaco.editor.ITextModel> {

        const uri = this.getUri(`_${project}_${shortName}`, '.html');
        let model = monaco.editor.getModel(uri);
        if (model) return model;
        const content = fileInfo ? fileInfo.content : await storFileHTML.getContent();
        model = monaco.editor.createModel(content as string, 'html', uri);
        (model as any)['position'] = this.position;
        (storFileHTML as any)['originalCRC'] = storFileHTML.inLocalStorage ? 'undefined' : mls.common.crc.crc32(model.getValue()).toString(16);
        if (storFileHTML.status === 'renamed' && fileInfo) {
            this.setEventsModelHTML(model, storFileHTML, fileInfo.originalShortName as string, fileInfo.originalProject as number);
            model.setValue(fileInfo.content as string);
        } else {
            this.setEventsModelHTML(model, storFileHTML, storFileHTML.shortName, storFileHTML.project);
        }
        return model;
    }

    private setEventsModelHTML(model: monaco.editor.ITextModel, storFileHTML: mls.stor.IFileInfo, shortName: string, project: number): void {
        storFileHTML.onAction = (action: mls.stor.IFileInfoAction) => this.afterUpdateHTML(storFileHTML, model);
        storFileHTML.getValueInfo = () => this.getValueInfoHTML(
            model,
            shortName,
            project,
            (storFileHTML as any)['originalCRC']
        );

        if (model) model.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => this.onModelHTMLChange(e, storFileHTML, model));
    }

    private _onChangedContentHTML: number | undefined = undefined;

    private onModelHTMLChange = (e: monaco.editor.IModelContentChangedEvent, storFileHTML: mls.stor.IFileInfo, model: monaco.editor.ITextModel): void => {
        // some changes is to simulate changes to force compile
        clearTimeout(this._onChangedContentHTML);
        this._onChangedContentHTML = window.setTimeout(async () => {

            const sameContent: boolean = (storFileHTML as any)['originalCRC'] === mls.common.crc.crc32(model.getValue()).toString(16);
            if (sameContent) {
                if (storFileHTML.status !== 'new' && storFileHTML.status !== 'renamed') storFileHTML.status = 'nochange';
                if (storFileHTML.status !== 'renamed') await mls.stor.localStor.setContent(storFileHTML, { content: null }); // clear localstorage
            } else {
                if (storFileHTML.status !== 'renamed' && (storFileHTML.status !== 'new')) storFileHTML.status = 'changed';
                await mls.stor.localStor.setContent(storFileHTML, { contentType: 'string', content: model.getValue() });
            }
            mls.events.fireFileAction('statusOrErrorChanged', storFileHTML, (model as any)['position']);
        }, 400);
    };

    private async renameHTMLFile(storFileHTML: mls.stor.IFileInfo, newProject: number, newShortName: string) {

        if (!storFileHTML) return;
        const newSts: mls.l2.editor.IPath = { shortName: newShortName, project: newProject };
        await this.getOrCreateModelHTML(storFileHTML.shortName, storFileHTML.project, storFileHTML);
        if (!storFileHTML.getValueInfo) return;
        const valueInfo = await storFileHTML.getValueInfo();

        const { status } = storFileHTML;
        if (!mls.stor.renameFile(storFileHTML, newSts)) throw new Error('Error on rename mls.stor.files');
        const key = mls.stor.getKeyToFiles(newProject, this.level, newShortName, '', '.html');
        const newStorFileHTML = mls.stor.files[key];
        newStorFileHTML.status = 'renamed';
        await mls.stor.localStor.setContent(newStorFileHTML, valueInfo);
        setTimeout(async () => {
            const file = await this.createOrShowModelHTML(false, valueInfo);
            if (status === 'new') file.status = status;
        }, 500);

    }



    private getValueInfoHTML = async (activeModel: monaco.editor.ITextModel, originalShortName: string, originalProject: number, originalCRC: string): Promise<mls.stor.IFileInfoValue> => {
        const rc: mls.stor.IFileInfoValue = {
            content: activeModel.getValue(),
            contentType: 'string',
            originalShortName,
            originalProject,
            originalCRC
        };
        return rc;
    }

    private async afterUpdateHTML(storFile: mls.stor.IFileInfo, model: monaco.editor.ITextModel) {

        if (storFile.status === 'deleted') {
            await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
            const keyFiles = mls.stor.getKeyToFiles(storFile.project, storFile.level, storFile.shortName, storFile.folder, storFile.extension);
            delete mls.stor.files[keyFiles];
            return;
        }
        if (storFile.status === 'renamed') {
            (storFile as any)['originalCRC'] = mls.common.crc.crc32(model.getValue()).toString(16);
        }
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        storFile.status = 'nochange';
    }

    updated(changedProperties: any) {
        if (changedProperties.has('msize')) {
            if (!this.visible) return;
            this.c2?.setAttribute('msize', this.msize);
        }
    }

    render() {
        return html`
            <mls-editor-100529 ismls2="true"></mls-editor-100529>
        `
    }

    private saveLocalStorageLastOpen(storFile: mls.stor.IFileInfo, position: string) {
        try {

            let last = localStorage.getItem('_100554_serviceSource');
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

            localStorage.setItem('_100554_serviceSource', JSON.stringify(info));

        } catch (e) {
            localStorage.setItem('_100554_serviceSource', JSON.stringify({}));
        }

    }

    private openLastFile(level: number, position: string): boolean {

        try {
            let last = localStorage.getItem('_100554_serviceSource');
            last = last ? last : '{}';
            const info = JSON.parse(last);
            const keyLocal = 'last_' + level + '_' + position;
            if (!info[keyLocal]) return false;

            const key = mls.l2.editor.getKey(
                {
                    project: +info[keyLocal].project,
                    shortName: info[keyLocal].shortName
                }
            );

            const model = mls.l2.editor.mfiles[key];
            if (!model) return false

            mls.l2.editor.editors[this.confE] = model;
            mls.actual[this.level].setFullName(`_${info[keyLocal].project}_${info[keyLocal].shortName}`);
            (mls.actual[this.level] as any)[position] = {
                project: model.storFile.project,
                shortName: model.storFile.shortName,
                extension: model.storFile.extension,
                folder: model.storFile.folder
            }

            return true;

        } catch (e) {
            return false;
        }

    }

    public getActualRef(): string {

        try {
            let ret = '';
            if (!mls.actual[2] || !(mls.actual[2] as any)[this.position]) return ret;
            const actual = (mls.actual[2] as any)[this.position];
            const ext = this.menu.lastIcon === 'icTs' ? '.ts' : '.html';
            if (!actual) return ret;
            ret = mls.stor.getKeyToFiles(actual.project, 2, actual.shortName, actual.folder, ext);
            return ret;

        } catch (e) {
            return '';
        }

    }
}
