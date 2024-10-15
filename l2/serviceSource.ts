/// <mls shortName="serviceSource" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit'
import { ServiceBase, IService, IToolbarContent, IMenu, IMenuTitle } from './_100554_serviceBase';
import { getEventName } from './_100554_collabPageElement'
import { formatHtml, sync } from './_100554_collabDOMSync';
import { getAddNewFileDetails, removeTokensFromSource, getTokensLess } from './_100554_enhancementStyle';

@customElement('service-source-100554')
export class ServiceSource100554 extends ServiceBase {

    constructor() {
        super();
        mls.events.addListener(2, 'WidgetAction', this.onWidgetActionEvents.bind(this));
        mls.events.addListener(2, 'FileAction', this.onMLSEvents.bind(this));
        mls.events.addListener(2, 'MonacoAction', (ev) => this.onMonacoEvents(ev));
        mls.events.addListener(2, 'ProjectLoaded', (ev) => this.onProjectLoadedEvents(ev));
        mls.events.addListener(2, 'DomAction', (ev) => this.syncDom(ev));
        mls.events.addListener(2, 'CreateModelHTML' as any, (ev) => this.checkToCreateModelHTML(ev));
        this.initMonaco_GlobalEditor();
    }

    @property({ type: String }) msize = '';
    @property({ type: Boolean }) panelRightOpened = false;
    @property({ type: String }) mode: IModes = 'icTs';
    private MINWIDTHTPANELRIGHT = 500;

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
        this.mode = op as IModes;
        if (op === 'icTs') this.showActiveModel();
        if (op === 'icHTML') this.createOrShowModelHtmlOrCss(mls.l2.editor.editors[this.confE].shortName, mls.l2.editor.editors[this.confE].project, true, '.html');
        if (op === 'icStyle') this.createOrShowModelHtmlOrCss(mls.l2.editor.editors[this.confE].shortName, mls.l2.editor.editors[this.confE].project, true, '.less');
    }

    public onClickTitle = () => {
        this.openService('_100554_serviceProject', this.position, 2, { activeTab: 'Explore' });
    }

    public details: IService = {
        icon: '&#xf121',
        state: 'background',
        tooltip: 'Source',
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
            icHTML: 'HTML;f13b',
            icStyle: 'Style;f38b'

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
        this.updatedMSizeEditor();
    }

    //---------- Handling Editor --------

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

    public setEditorValueByLineTs(val: string, line: number) {
        if (!this._ed1) return false;
        const { shortName, project } = mls.l2.editor.editors[this.confE];
        const uri = this.getUri(`_${project}_${shortName}`, '.ts');
        if (this.menu.setIconActive) this.menu.setIconActive('icTs');
        let model = monaco.editor.getModel(uri);
        if (!model) return false;
        this.setValueInModelInSpecificLine(val, line);

    }

    public setEditorValueByLineHtml(val: string, line: number) {
        if (!this._ed1) return false;
        const { shortName, project } = mls.l2.editor.editors[this.confE];
        const uri = this.getUri(`_${project}_${shortName}`, '.html');
        if (this.menu.setIconActive) this.menu.setIconActive('icHTML');
        let model = monaco.editor.getModel(uri);
        if (!model) return false;
        this.setValueInModelInSpecificLine(val, line);
    }

    public replaceEditorLineHTML(val: string, line: number) {
        if (!this._ed1) return false;
        const { shortName, project } = mls.l2.editor.editors[this.confE];
        const uri = this.getUri(`_${project}_${shortName}`, '.html');
        if (this.menu.setIconActive) this.menu.setIconActive('icHTML');
        let model = monaco.editor.getModel(uri);
        if (!model) return false;
        this.replaceLineValueInModelInSpecificLine(val, line);
    }

    public searchLineByStringTs(search: string): number | undefined {
        if (!this._ed1) return;
        const { shortName, project } = mls.l2.editor.editors[this.confE];
        const uri = this.getUri(`_${project}_${shortName}`, '.ts');
        let model = monaco.editor.getModel(uri);
        if (!model) return;
        const matches = model.findMatches(search, false, false, false, null, true);
        if (!matches || matches.length === 0) return;
        return matches[0].range.startLineNumber;
    }

    public goToLine(line: number) {
        if (!this._ed1) return;
        const model = this._ed1.getModel();
        if (!model) return;
        const content = model.getLineContent(line);
        const range = new monaco.Range(line, 1, line, content.length + 1);
        this._ed1.setSelection(range);
        this._ed1.revealLineInCenter(line);
    }

    public setEditorHTMLValue(val: string) {
        if (!this._ed1) return false;
        const { shortName, project } = mls.l2.editor.editors[this.confE];
        const uri = this.getUri(`_${project}_${shortName}`, '.html');
        let model = monaco.editor.getModel(uri);
        if (!model) return false;
        this.setValueInModeKeepingUndo(model, val, false);
    }

    public getEditorHTMLValue(): string {
        if (!this._ed1) return '';
        const { shortName, project } = mls.l2.editor.editors[this.confE];
        const uri = this.getUri(`_${project}_${shortName}`, '.html');
        let model = monaco.editor.getModel(uri);
        if (!model) return '';
        return model.getValue();
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

    private setValueInModelInSpecificLine(content: string, line: number) {
        if (!this._ed1) return;
        this._ed1.executeEdits('my-source', [
            {
                range: new monaco.Range(line, 1, line, 1),
                text: `${content}\n`,
                forceMoveMarkers: true
            }
        ]);
        this._ed1.revealLineInCenter(line);
        this.formatMonaco();
    }

    private replaceLineValueInModelInSpecificLine(content: string, line: number) {
        if (!this._ed1) return;
        const model = this._ed1.getModel();
        if (!model) return;
        const lineLength = model.getLineLength(5);
        this._ed1.executeEdits('my-source', [
            {
                range: new monaco.Range(line, 1, line, lineLength + 1),
                text: content,
                forceMoveMarkers: true
            }
        ]);
        this._ed1.revealLine(line);
        this.formatMonaco();
    }

    private formatMonaco() {
        if (!this._ed1) return;
        this._ed1.trigger('anyString', 'editor.action.formatDocument', null);
    }

    //---------------------------------------------

    @query('mls-editor-100529')
    private c2: HTMLElement | undefined;


    public last: mls.IActual | undefined = undefined;
    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;
    private mConfEditor: monaco.editor.ITextModel | undefined;
    private confE2(positionToolbar: string) { return `l${this.level}_${positionToolbar}`; }

    get confE() { return `l${this.level}_${this.position}`; }
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


    private openRepo() {
        if (!this.menu.lastIcon) return false;
        const { shortName, project } = mls.l2.editor.editors[this.confE];
        const obj: { [key: string]: string } = {
            icTs: '.ts',
            icHTML: '.html',
            icStyle: '.less',
        };
        const ext = obj[this.menu.lastIcon];
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
        const obj = {
            icTs: '.ts',
            icHTML: '.html',
            icStyle: '.less',
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
    private async readProjectTypescriptAndCompile(project: number, shortName: string, needCompile: boolean = true): Promise<void> {
        // load all typescripts dependencies (in development) of project , except shortName
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
                && (mls.istrace || storFile.inLocalStorage)
                && storFile.shortName !== shortName) {
                promises.push(this.createModelTS2(storFile, false, false));
            }
        }

        const info = await mls.stor.localDB.readPrjInfo(100554);
        if (info && info.indexModules && info.indexModules !== '') {
            promises.push(this.createProjectModel(project, info.indexModules));
        }

        if (mls.istrace) console.time('creating models');
        await Promise.all(promises);
        if (mls.istrace) console.timeEnd('creating models');

        if (window.traceLivecicle) console.info('firing: mls.l2.editor.compileAllProjectIfNeed ', project);
        if (needCompile) await mls.l2.editor.compileAllProjectIfNeed(project, true);
    }

    private async createProjectModel(prj: number, contentTS: string): Promise<mls.l2.editor.IMFile> {

        let model1 = mls.l2.editor.get({ project: prj, shortName: '' });
        if (model1) return model1;

        const ftype = ".d.ts";
        const modelsBase = await this.createModel(prj, '', '.d.ts', contentTS)
        if (!modelsBase) throw new Error(`invalid mls.editor.models for file: _${prj}_.d.ts`);

        model1 = {
            changed: false, // not changed in this section, but storFile.changed is about all sections
            error: false,
            project: prj,
            shortName: '',
            extension: ftype,
            model: modelsBase.model,
            storFile: undefined as any,
            originalCRC: undefined,
            originalProject: undefined,
            originalShortName: undefined,
            codeLens: [],
        };
        mls.l2.editor.add(model1);
        return model1;
    }

    private async deleteFile(storFile: mls.stor.IFileInfo) {
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        const activeModel = mls.l2.editor.editors[this.confE];
        if (activeModel.project === storFile.project && activeModel.shortName === storFile.shortName) await this.createModelTS_testFile(); // show test file
        mls.l2.editor.remove(storFile);
        this.removeEventsStorFile(storFile);
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

    private removeEventsStorFile(storFile: mls.stor.IFileInfo): void {
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
            await this.readProjectTypescriptAndCompile(projectLoadedInfo.project, '', projectLoadedInfo.needCompile);
        } catch (e) {
            console.error('Error on serviceSource_onProjectLoadedEvents: ', e);
        }
    }


    private isNewFile: boolean = false;
    private onMLSEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {

        if (ev.level !== 2 || (ev.type !== 'FileAction')) return;
        if (!ev.desc) return;
        const fileAction = JSON.parse(ev.desc) as mls.events.IFileAction;
        if (fileAction.position !== this.position) return;

        let keyFiles: string; // set on getStorFile 
        let keyFilesHTML: string; // set on getStorFile 
        let keyFilesCss: string; // set on getStorFile 

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

        const getStorFileCss = (): mls.stor.IFileInfo | undefined => {
            keyFilesCss = mls.stor.getKeyToFiles(fileAction.project, fileAction.level, fileAction.shortName, fileAction.folder, '.less');
            return mls.stor.files[keyFilesCss];
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
            const storFileHTML = getStorFileHTML();
            const storFileCss = getStorFileCss();
            await this.openFiles(storFileHTML, storFile, storFileCss, fileAction.position);
            this.updatedMSizeEditor();

        };

        const onDelete = async (): Promise<void> => {
            const storFile = getStorFile();
            const storFileHTML = getStorFileHTML();
            const storFileCss = getStorFileCss();
            await this.deleteFiles(storFileHTML, storFile, storFileCss);
            await mls.stor.localDB.removePrjInfo(storFile.project);
        };

        const onUndo = async (): Promise<void> => {
            const storFile = getStorFile();
            const storFileHTML = getStorFileHTML();
            const storFileCss = getStorFileCss();
            await this.undoFiles(storFileHTML, storFile, storFileCss, keyFilesHTML, keyFiles, keyFilesCss);
        };

        const onRename = async (): Promise<void> => {
            const storFile = getStorFile();
            const storFileHTML = getStorFileHTML();
            const storFileCss = getStorFileCss();
            await this.renameFiles(storFileHTML, storFile, storFileCss, fileAction.newProject as number, fileAction.newshortName as string, fileAction);
            await mls.stor.localDB.removePrjInfo(storFile.project);
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

    private async deleteFiles(storFileHTML: mls.stor.IFileInfo | undefined, storFileTS: mls.stor.IFileInfo, storFileCss: mls.stor.IFileInfo | undefined) {
        for await (let storFile of [storFileHTML, storFileTS, storFileCss]) {
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
            level: this.level as mls.Level,
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
        await this.createOrShowModelHtmlOrCss(newShortName, newProject, false, '.html');
        await this.createOrShowModelHtmlOrCss(newShortName, newProject, false, '.less');
        this.showActiveModel();
        this.isNewFile = false;
    }

    private async openFiles(storFileHTML: mls.stor.IFileInfo | undefined, storFileTS: mls.stor.IFileInfo, storFileCss: mls.stor.IFileInfo | undefined, position: 'left' | 'right') {

        await this.createModelTS_loading();
        this.activeThisService();
        this.closeMenu();
        const fileModel = mls.l2.editor.get(storFileTS);
        if (!fileModel) {
            await this.createModelTS2(storFileTS, true, true);
            this.showActiveModel();
            await this.readProjectTypescriptAndCompile(storFileTS.project, storFileTS.shortName, true)
        } else {
            mls.l2.editor.editors[this.confE] = fileModel;
            mls.l2.editor.forceModelUpdate(fileModel.model);
            this.showActiveModel();
        }

        [storFileCss, storFileTS, storFileHTML].forEach((storF) => {
            if (storF && !storF.inLocalStorage && storF.isLocalVersionOutdated) storF.isLocalVersionOutdated = false;
        });

        this.saveLocalStorageLastOpen(storFileTS, position);
        if (!this._ed1) return;
        this.restaureViewState();
    }


    private async renameFiles(storFileHTML: mls.stor.IFileInfo | undefined, storFileTS: mls.stor.IFileInfo, storFileCss: mls.stor.IFileInfo | undefined, newProject: number, newShortName: string, oldFileAction: mls.events.IFileAction) {

        await this.createModelTS_loading();
        this.activeThisService();

        let mfile = mls.l2.editor.get(storFileTS);
        if (!mfile) mfile = await this.createModelTS2(storFileTS, false, true);
        this.renameAllFiles(mfile, storFileTS, storFileHTML, storFileCss, newProject, newShortName);

        mls.l2.editor.editors[this.confE] = mfile;

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
            level: this.level as mls.Level,
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
                this.removeEventsStorFile(storFile);
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


    private async undoFiles(storFileHTML: mls.stor.IFileInfo | undefined, storFileTS: mls.stor.IFileInfo, storFileCss: mls.stor.IFileInfo | undefined, keyFileHTML: string, keyFileTS: string, keyFileCss: string) {

        for await (let data of [{ storFile: storFileHTML, keyFiles: keyFileHTML }, { storFile: storFileCss, keyFiles: keyFileCss }, { storFile: storFileTS, keyFiles: keyFileTS }]) {

            if (!data.storFile) continue;
            if (data.storFile.status === 'deleted') {
                data.storFile.status = 'changed';

                continue;
            }

            if (data.storFile.status === 'renamed') {
                throw new Error('not implemented');
            }

            if (data.storFile.extension === '.ts') {
                // clear memory changes and localstor changes
                const imFile = mls.l2.editor.editors[this.confE];
                if (imFile.project === data.storFile.project && imFile.shortName === data.storFile.shortName) await this.createModelTS_testFile(); // show test files
                mls.l2.editor.remove(data.storFile);
            }

            this.removeEventsStorFile(data.storFile);
            await mls.stor.localStor.setContent(data.storFile, { contentType: 'string', content: null });

            if (data.storFile.status === 'new') {
                delete mls.stor.files[data.keyFiles];
                // mls.events.fireFileAction('statusOrErrorChanged', data.storFile, this.position);
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

            if (data.storFile.extension === '.less' || data.storFile.extension === '.html') {
                const uri = this.getUri(`_${data.storFile.project}_${data.storFile.shortName}`, data.storFile.extension);
                const model = monaco.editor.getModel(uri);
                if (model) model.dispose();
            }

        };

        await this.createModelTS2(storFileTS, false, true);
        mls.events.fireFileAction('statusOrErrorChanged', storFileTS, this.position);

    }

    private activeThisService(): void {
        this.openMe();
        mls.editor.setActiveInstance(this.level, this.position);
    }

    private closeMenu() {
        if (this.menu.closeMenu) this.menu.closeMenu()
    }

    private async updateModelStatus(mfile: mls.l2.editor.IMFile, changed: boolean): Promise<void> {
        if (mfile.project === 0) changed = true; // always in localstorage
        mfile.changed = changed;

        const cr: mls.l2.editor.ICompilerResult = await mls.l2.editor.getCompilerResultTS({ project: mfile.project, shortName: mfile.shortName }, true);
        let hasError = cr.errors.length > 0;
        mfile.error = hasError;
        const key = mls.stor.getKeyToFiles(mfile.project, this.level, mfile.shortName, '', mfile.extension);
        const storFile: mls.stor.IFileInfo = mls.stor.files[key];

        if (!hasError) {
            const enhancementInstance: mls.l2.enhancement.IEnhancementInstance | undefined = await mls.l2.enhancement.getEnhancementInstance(mfile).catch((e) => undefined);
            if (enhancementInstance) await enhancementInstance.onAfterChange(mfile);
            hasError = storFile.hasError;
        }

        await this.changeStatusFile(mfile, storFile, cr.tripleSlashMLS?.variables, hasError);
    }

    private async changeStatusFile(mfile: mls.l2.editor.IMFile, storFile: mls.stor.IFileInfo, variables: mls.common.tripleslash.ITripleSlashVariables | undefined, hasError: boolean): Promise<void> {
        if (!storFile) return; // new file dont have storFile ???
        const oldStatus = storFile.status;
        storFile.hasError = hasError;
        const sameContent: boolean = mfile.originalCRC === mls.common.crc.crc32(mfile.model.getValue()).toString(16);
        if (sameContent) {
            if (storFile.status !== 'new') storFile.status = 'nochange';
            await mls.stor.localStor.setContent(storFile, { content: null }); // clear localstorage
        } else {
            if (storFile.status !== 'renamed' && (storFile.status !== 'new')) storFile.status = 'changed';
            await mls.stor.localStor.setContent(storFile, await this.getValueInfo(mfile));
        }
        if (oldStatus !== storFile.status) {
            mls.events.fireFileAction('statusOrErrorChanged', storFile, this.position);
        }
    }

    private renameAllFiles(mfile: mls.l2.editor.IMFile, storFile: mls.stor.IFileInfo, storFileHTML: mls.stor.IFileInfo | undefined, storFileCss: mls.stor.IFileInfo | undefined, newProject: number, newShortName: string): void {

        if (storFile.hasError) throw new Error('Error on rename, clear errors before rename');
        if (!this.isNewNameValid(newShortName)) throw new Error('Error on rename, new shortName is a invalid name');

        const newSts: mls.cbe.IPath = { shortName: newShortName, project: newProject };

        this.renameHTMLOrCssFile(mfile, storFileHTML as mls.stor.IFileInfo, newProject, newShortName, '.html');
        this.renameHTMLOrCssFile(mfile, storFileCss as mls.stor.IFileInfo, newProject, newShortName, '.less');

        if (!mls.l2.editor.rename(mfile, newSts)) throw new Error('Error on rename mls.l2.editor.mfiles');
        if (!mls.stor.renameFile(storFile, newSts)) throw new Error('Error on rename mls.stor.files');
        mls.common.tripleslash.changeVariable(mfile, 'shortName', newShortName);
        mls.common.tripleslash.changeVariable(mfile, 'project', newProject.toString());
        if (storFile.status === 'new') return;
        storFile.status = 'renamed';
    }

    private isNewNameValid(newShortName: string): boolean {
        if (newShortName.length === 0 || newShortName.length > 255) return false;
        const invalidCharacters = /[_\/{}\t\[\]\*$@#=\-+!|?,<>=.;^~º°""''``áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/;
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
        this.updatedMSizeEditor();
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

    private timeHtmlChangeCursor: number = 0;
    private lastIdSelected: string | null = null;
    private async initMonaco_Editor(): Promise<void> {

        const addEventsEditor = () => {
            if (!this._ed1) return;
            this._ed1.onDidFocusEditorWidget(() => {
                if (this.menu.lastIcon === 'icHTML') return;
                mls.editor.setActiveInstance(this.level, this.position);
            });


            this._ed1.onDidChangeCursorPosition((e) => {

                this._ed1?.updateOptions({ readOnly: false });

                clearTimeout(this.timeHtmlChangeCursor);
                if (!this._ed1) return;
                if (this.menu.lastIcon === 'icStyle') {
                    const position = e.position;
                    const { lineNumber } = position;
                    const isReadOnlyArea = this.isReadOnlyArea(lineNumber);
                    this._ed1.updateOptions({ readOnly: isReadOnlyArea });
                    return;
                }

                if (!this._ed1 || this.menu.lastIcon !== 'icHTML') return;
                const model = this._ed1.getModel();
                const position = e.position;
                if (!model) return;

                this.timeHtmlChangeCursor = setTimeout(() => {
                    const lineContent = model.getLineContent(position.lineNumber);
                    if (lineContent.includes('id="')) {
                        const idValue = this.extractIdValue(lineContent);
                        if (this.lastIdSelected === idValue) return;
                        this.lastIdSelected = idValue;
                        if (idValue && this.lastOrigin === 'editor') {
                            mls.events.fire(2, 'WidgetAction' as any, `{"op":"SelectWidget", "id":"${idValue}", "origin":"editor"}`);
                        } else {
                            this.lastOrigin = 'editor';
                        }
                    }
                }, 500)

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

    private extractIdValue(line: string): string | null {
        const idRegex = /id="([^"]*)"/;
        const match = line.match(idRegex);
        return match ? match[1] : null;
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

    private getUri(shortFN: string, ftype: '.ts' | '.d.ts' | '.html' | '.less'): monaco.Uri {
        return monaco.Uri.parse(`file://server/${shortFN}${ftype}`);
    }

    private async createModelTS_testFile() {
        const shortName = 'testFile';
        const project = 0; // localstorage project
        const defaultTS = `/// <mls shortName="${shortName}" project="${project}" enhancement="_blank" />\n// typescript example`;
        await this.createModelTS1(shortName, project, defaultTS, true);
    }

    onFirtModel = true;
    private async createModelTS_loading() {
        const shortName = 'loading';
        const project = 0; // localstorage project
        const defaultTS = 'wait...';
        const mfile = await this.createModelTS1(shortName, project, defaultTS, true);
        if (this.onFirtModel && this._ed1) {
            this.onFirtModel = false;
            this._ed1.setModel(mfile.model);
        }
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

    private async createModelTS1(shortName: string, project: number, defaultTS: string, activateModel: boolean): Promise<mls.l2.editor.IMFile> {
        // create new file or load project 0 file
        const level = 2;
        const extension = '.ts';
        if (project > 1) await mls.stor.server.loadProjectInfoIfNeeded(project);
        const key = mls.stor.getKeyToFiles(project, level, shortName, '', extension);
        let storFile: mls.stor.IFileInfo | undefined = mls.stor.files[key];
        // if (storFile && project !== 0) throw new Error('Error on createModelTS1, model already exists: ' + key);
        if (!storFile) {
            storFile = await mls.stor.addOrUpdateFile({ project, level, shortName, extension, versionRef: new Date().toISOString(), folder: '' });
            if (!storFile) throw new Error('Invalid storFile');
            storFile.status = 'new';
        }
        let model1 = mls.l2.editor.get({ project, shortName });
        if (!model1) {
            const src: string = storFile ? (await storFile.getContent(defaultTS)) as string || defaultTS : defaultTS;
            const ftype = src.split("\n")[0].indexOf(' type="definition"') > 0 ? ".d.ts" : ".ts";
            const uri = this.getUri(`_${project}_${shortName}`, ftype);
            model1 = mls.l2.editor.get({ project, shortName });
            if (model1) return model1; // created in another instance
            //const model = monaco.editor.createModel(src, 'typescript', uri);

            const modelBase = await this.createModel(project, shortName, ftype, src);
            if (!modelBase) throw new Error(`invalid mls.editor.models for file: _${project}_${shortName}${ftype}`);
            const model = modelBase.model;

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
        let mfile = mls.l2.editor.get({ project, shortName });
        if (mfile) return mfile;

        const modelBase = await this.createModel(project, shortName, '.ts');
        if (!modelBase) throw new Error(`invalid mls.editor.models for file: _${project}_${shortName}.ts`);
        mfile = {
            changed: false, // not changed in this section, but storFile.changed is about all sections
            error: false,
            project,
            shortName,
            extension,
            model: modelBase.model,
            storFile,
            originalCRC: modelBase.originalCRC,
            originalProject: modelBase.originalProject,
            originalShortName: modelBase.originalShortName,
            codeLens: [],
        };

        mls.l2.editor.add(mfile);
        this.addEventsModelTS(storFile, mfile);

        const extFiles: Array<'.html' | '.less'> = ['.html', '.less'];
        for await (let ext of extFiles) {
            const keyFile1 = mls.stor.getKeyToFiles(storFile.project, 2, storFile.shortName, '', ext);
            let storFile1 = mls.stor.files[keyFile1];
            if (!storFile1) storFile1 = await this.createOrShowModelHtmlOrCss(shortName, project, false, ext);
            await this.getOrCreateModelHtmlOrCss(storFile1.shortName, storFile1.project, ext, storFile1);
        }

        if (compile) await this.updateModelStatus(mfile, false);
        if (activedModel) mls.l2.editor.editors[this.confE] = mfile;
        return mfile;

    }


    private async createModel(project: number, shortName: string, ext: '.ts' | '.d.ts' | '.html' | '.less', content?: string): Promise<mls.editor.IModelBase | undefined> {

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
        if (ext === '.html' && storFile) model = mls.editor.createModelHTML(storFile, src);
        else if (ext === '.ts' && storFile) model = mls.editor.createModelTS(storFile, src);
        else if (ext === '.d.ts') model = mls.editor.createModelProjectDefinition(project, src);
        else if (ext === '.less' && storFile) {
            const lessTokens = await getTokensLess('Default');
            const lineTokens = `\n\n//Start Less Tokens\n${lessTokens}\n//End Less Tokens\n`;
            src = src.concat(lineTokens);
            model = mls.editor.createModelStyle(storFile, src);
        }

        if (!model) throw new Error(`Model invalid`);
        if (ext !== '.d.ts') {
            model.originalCRC = originalCRC;
            model.originalProject = originalProject;
            model.originalShortName = originalShortName;
        }
        return model;

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
        if (!storFile) throw new Error('Invalid storFile');

        const uri = this.getUri(shortName, extension);
        let model = monaco.editor.getModel(uri);
        if (model) {
            this.mConfEditor = model;
        } // else this.mConfEditor = monaco.editor.createModel(src, 'typescript', uri);

        else {
            const modelBase = await this.createModel(project, shortName, '.ts', src);
            if (!modelBase) throw new Error(`invalid mls.editor.models for file: _${project}_${shortName}.ts`);
            model = modelBase.model;
            this.mConfEditor = model;
        }


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
        return `/// <mls shortName="config_monaco_editor" project="0" enhancement="_blank" />
		
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
                const path = mls.baseMonaco + '../themes/' + mls.editor.themeName + '.json';
                mls.api.base.get(path, {}, (data: string) => {
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

    // HTML LESS


    private async createOrShowModelHtmlOrCss(shortName: string, project: number, open: boolean, mode: '.html' | '.less', fileInfo?: mls.stor.IFileInfoValue): Promise<mls.stor.IFileInfo> {

        const key = mls.stor.getKeyToFiles(project, this.level, shortName, '', mode);
        let storFile = mls.stor.files[key];
        if (!storFile) {
            if (mode === '.less') {
                const newLess = await this.prepareInitialLess(shortName, project);
                await this.createHtmlOrCssFile(project, shortName, newLess, mode);
            } else {
                await this.createHtmlOrCssFile(project, shortName, `<h1>_${project}_${shortName}</h1>`, mode);
            }
            storFile = mls.stor.files[key];
        }

        const uri = this.getUri(`_${project}_${shortName}`, mode);
        let model = monaco.editor.getModel(uri);

        if (!model) model = await this.getOrCreateModelHtmlOrCss(shortName, project, mode, storFile, fileInfo);
        if (open && this._ed1) {
            this._ed1.setModel(model);
            this.updatedMSizeEditor();
        }

        if (mode === '.html' && this._ed1 && this._ed1.getModel()?.id !== model.id) {
            mls.events.fireFileAction('modeCreated', storFile, this.position);
            this.registerProviderHTML();
        }

        return storFile;

    }

    private async prepareInitialLess(shortName: string, project: number) {

        const details = await getAddNewFileDetails();
        const tag = convertFileNameToTag(`_${project}_${shortName}`);
        const newStyle = details[0].example
            .replace('[shortName]', shortName)
            .replace('[project]', project.toString())
            .replace('[tag]', tag)

        return newStyle;
    }

    private async createHtmlOrCssFile(project: number, shortName: string, content: string, extension: string) {
        const params = {
            project,
            level: 2,
            shortName,
            extension,
            versionRef: '0',
            folder: ''
        };
        const file = await mls.stor.addOrUpdateFile(params);
        if (!file) throw new Error('Invalid storFile');
        file.status = 'new';
        const fileInfo: mls.stor.IFileInfoValue = {
            content,
            contentType: 'string',
        };
        await mls.stor.localStor.setContent(file, fileInfo);
    }


    private async getOrCreateModelHtmlOrCss(shortName: string, project: number, ext: '.html' | '.less', storFile: mls.stor.IFileInfo, fileInfo?: mls.stor.IFileInfoValue,): Promise<monaco.editor.ITextModel> {

        let mfile = mls.l2.editor.get({ project, shortName });
        if (!mfile) throw new Error('Invalid mfile')

        const uri = this.getUri(`_${project}_${shortName}`, ext);
        let language = ext.substring(1, ext.length);
        const modelName = `model${ext === '.html' ? 'HTML' : 'LESS'}`

        let model = monaco.editor.getModel(uri);
        if (model) {
            if (this.visible === 'true') mls.events.fire([2, 3, 4, 5, 6, 7], 'ModelHTMLCreated' as any, JSON.stringify(storFile));
            return model;
        }

        const content = fileInfo ? fileInfo.content : await storFile.getContent();
        if (content instanceof Blob) throw new Error('less file must be string');
        if (!content) throw new Error('less file is undefined');

        const modelBase = await this.createModel(project, shortName, ext);
        if (!modelBase) throw new Error(`invalid mls.editor.models for file: _${project}_${shortName}${ext}`);
        if (this.visible === 'true') mls.events.fire([2, 3, 4, 5, 6, 7], 'ModelHTMLCreated' as any, JSON.stringify(storFile));

        model = modelBase.model;

        if (mfile) (mfile as any)[modelName] = model;

        (model as any)['position'] = this.position;
        const originalCRC = fileInfo ? fileInfo?.originalCRC : mls.common.crc.crc32(content as string).toString(16);
        (model as any)['originalCRC'] = originalCRC;
        (storFile as any)['originalCRC'] = storFile.inLocalStorage ? 'undefined' : mls.common.crc.crc32(model.getValue()).toString(16);

        if (storFile.status === 'renamed' && fileInfo) {
            this.setEventsModelHTMLOrCss(mfile, model, storFile, fileInfo.originalShortName as string, fileInfo.originalProject as number, ext);
            model.setValue(fileInfo.content as string);
        } else {
            this.setEventsModelHTMLOrCss(mfile, model, storFile, storFile.shortName, storFile.project, ext);
        }
        return model;
    }

    private setEventsModelHTMLOrCss(mfile: mls.l2.editor.IMFile, model: monaco.editor.ITextModel, storFile: mls.stor.IFileInfo, shortName: string, project: number, ext: '.html' | '.less'): void {
        storFile.onAction = (action: mls.stor.IFileInfoAction) => this.afterUpdateHtmlOrCss(storFile, model);
        storFile.getValueInfo = () => this.getValueInfoHtmlOrCss(
            model,
            shortName,
            project,
            (storFile as any)['originalCRC']
        );

        if (!model) return;
        model.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => this.onModelHtmlOrCssChange(e, mfile, storFile, model, ext));
    }

    private async afterUpdateHtmlOrCss(storFile: mls.stor.IFileInfo, model: monaco.editor.ITextModel) {

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

    private getValueInfoHtmlOrCss = async (activeModel: monaco.editor.ITextModel, originalShortName: string, originalProject: number, originalCRC: string): Promise<mls.stor.IFileInfoValue> => {
        const rc: mls.stor.IFileInfoValue = {
            content: activeModel.getValue(),
            contentType: 'string',
            originalShortName,
            originalProject,
            originalCRC
        };
        return rc;
    }

    private _onChangedContentHtmlOrCss: number | undefined = undefined;

    private onModelHtmlOrCssChange(e: monaco.editor.IModelContentChangedEvent, mfile: mls.l2.editor.IMFile, storFile: mls.stor.IFileInfo, model: monaco.editor.ITextModel, ext: '.html' | '.less'): void {

        // some changes is to simulate changes to force compile
        clearTimeout(this._onChangedContentHtmlOrCss);
        this._onChangedContentHtmlOrCss = window.setTimeout(async () => {

            let modelValue = model.getValue();
            if (ext === '.less') {
                const enhancementInstanceLess: mls.l2.enhancement.IEnhancementInstance | undefined = await import('./_100554_enhancementStyle')
                if (enhancementInstanceLess) await enhancementInstanceLess.onAfterChange(mfile);
                modelValue = removeTokensFromSource(modelValue);
                mls.l2.editor.forceModelUpdate(mfile.model);
            }

            const sameContent: boolean = (storFile as any)['originalCRC'] === mls.common.crc.crc32(modelValue).toString(16);
            if (sameContent) {
                if (storFile.status !== 'new' && storFile.status !== 'renamed') storFile.status = 'nochange';
                if (storFile.status !== 'renamed') await mls.stor.localStor.setContent(storFile, { content: null }); // clear localstorage
            } else {
                if (storFile.status !== 'renamed' && (storFile.status !== 'new')) storFile.status = 'changed';
                await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: modelValue });
            }
            if (mls.istrace) console.info('fire model html');

            if (this.isHTMLSystemChange) {
                this.isHTMLSystemChange = false;
                return;
            }


            let position: 'left' | 'right';
            if (mls.l2.editor.editors[this.confE2('left')]?.model.id === mfile.model.id) position = 'left';
            else position = 'right';
            mls.events.fireFileAction('statusOrErrorChanged', storFile, position);

        }, 400);
    };

    private async renameHTMLOrCssFile(mfile: mls.l2.editor.IMFile, storFile: mls.stor.IFileInfo, newProject: number, newShortName: string, ext: '.html' | '.less') {

        if (!storFile) return;


        const newSts: mls.cbe.IPath = { shortName: newShortName, project: newProject };

        await this.getOrCreateModelHtmlOrCss(storFile.shortName, storFile.project, ext, storFile);
        if (!storFile.getValueInfo) return;
        const valueInfo = await storFile.getValueInfo();
        const { status } = storFile;
        if (!mls.stor.renameFile(storFile, newSts)) throw new Error('Error on rename mls.stor.files');
        const key = mls.stor.getKeyToFiles(newProject, this.level, newShortName, '', ext);
        const newStorFile = mls.stor.files[key];
        newStorFile.status = 'renamed';

        //if (storFile.status === 'new') return;
        //storFile.status = 'renamed';

        // 

        setTimeout(async () => {
            const file = await this.createOrShowModelHtmlOrCss(newStorFile.shortName, newStorFile.project, false, ext, valueInfo);
            if (ext === '.less') {
                const modelStyle = (mfile as any)['modelLESS'];
                this.tripleslashChangeVariable(modelStyle, 'shortName', newShortName);
                this.tripleslashChangeVariable(modelStyle, 'project', newProject.toString());
            }
            await mls.stor.localStor.setContent(newStorFile, valueInfo);
            if (status === 'new') file.status = status;
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

    private isReadOnlyArea(lineNumber: number): boolean {
        const obj = this.getIntervalLinesReadOnly();
        if (!obj) return false;
        if (!obj.end || !obj.start) return false;
        if (lineNumber >= obj.start && lineNumber <= obj.end) return true;
        return false;
    }

    private getIntervalLinesReadOnly(): { start: number | undefined, end: number | undefined } | undefined {
        if (!this._ed1) return;
        const model = this._ed1.getModel();
        if (!model) return;
        const [startLine] = model.findMatches(`//Start Less Tokens`, true, false, false, null, true);
        const [endLine] = model.findMatches(`//End Less Tokens`, true, false, false, null, true);
        return {
            end: endLine ? endLine.range.startLineNumber : undefined,
            start: startLine ? startLine.range.startLineNumber : undefined
        };
    }

    private updatedMSizeEditor() {
        this.c2?.setAttribute('msize', this.msize);
    }

    updated(changedProperties: any) {
        if (changedProperties.has('msize')) {
            const [w, h, t, l] = this.msize.split(',');
            if (w) this.panelRightOpened = (+w) >= this.MINWIDTHTPANELRIGHT;
            if (!this.visible) return;
            this.updatedMSizeEditor();
        }
    }

    firstUpdated(changedProperties: any) {
        super.firstUpdated(changedProperties);
        this.registerProviderHTML();
    }

    render() {
        this.style.display = 'block';
        return html`
             <collab-spliter-vertical-var-fixed-100554 msize=${this.msize} withresize="false" fixedheight="100" complementcolor="#1e1e1e">
                <collab-spliter-horizontal-var-fixed-100554
                    slot="top"
                    complementcolor="#1e1e1e"
                    fixedwidth="30%"
                    fixedvisible=${this.mode !== 'icStyle' ? 'hidden' : `${this.panelRightOpened === true ? 'visible' : 'closed'}`} 
                >
                    <mls-editor-100529 slot="left"></mls-editor-100529>
                    <div slot="right" style="height:100%;"></div>
                    
                </collab-spliter-horizontal-var-fixed-100554>

                <div slot="bottom">
                    ${this.renderPrompt()}
                </div>
        </collab-spliter-vertical-var-fixed-100554>`

    }

    renderPrompt() {
        const shortName = mls.l2.editor.editors[this.confE]?.shortName || '';
        const project = mls.l2.editor.editors[this.confE]?.project || 0;
        if (!shortName || !project) return html``;
        const key = mls.editor.getKeyModel(project, shortName);
        if (this.mode === 'icTs') return html`
            <aim-prompt-typescript-100554
                rendermode="editor" modelkey="${key}">
            </aim-prompt-typescript-100554>`;
        if (this.mode === 'icStyle') return html`
            <aim-prompt-style-100554
                rendermode="editor" modelkey="${key}">
            </aim-prompt-style-100554>`;
        if (this.mode === 'icHTML') return html`
            <aim-prompt-html-100554
                rendermode="editor" modelkey="${key}">
            </aim-prompt-html-100554>`;
        return html``;
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

            const key = mls.l2.getKey(
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


    //--------------WidgetAction--------------

    private lastScenario = '';
    private lastOrigin = 'editor';
    private onWidgetActionEvents(ev: mls.events.IEvent) {

        if (this.position === 'right') return;
        if (ev.level !== this.level) return;
        if (!ev.desc) return;

        const json = JSON.parse(ev.desc);

        switch (json.op) {
            case 'SelectWidget':
                break;
            case 'SelectLine':
                this.selectLineinHTML(json.line, json.origin);
                break;
            case 'OpenScenario':
                this.openScenario(json);
                break;
            case 'CreateOrSetEvent':
                this.createOrSetEvent(json);
                break;
            case 'CreateOrSetEventPR':
                this.createOrSetEventPR(json);
                break;
            default:
                console.info('Erro: opção invalida');

        }

    }

    private selectLineinHTML(line: number, origin: 'preview' | 'editor') {
        if (this.menu.lastIcon !== 'icHTML' || !this._ed1) return;
        this.lastOrigin = origin;
        if (origin === 'editor') return;
        this.goToLine(line);
    }

    private openScenario(json: any) {

        (window as any).infoScenarioInsertOrCreateEvent = {
            id: json.id,
            value: json.value
        };

        this.lastScenario = json.widget;
        this.addScenario(json.widget);

    }

    private closeScenario() {

        if (!this.lastScenario) return;
        this.removeScenario(this.lastScenario);

    }

    private createOrSetEvent(json: any) {

        //{"op":"CreateOrSetEvent", "id":"test", "event":"click", "device":"desktop"}
        let isExistEVentInHTML = this.isEventExist(json.id, json.event);
        let isExistEVentInTS = false;
        const nameFc = getEventName(json.event, json.id, json.device);
        if (isExistEVentInHTML) {

            const line = this.searchLineByStringTs(nameFc);
            if (line && this.menu.setIconActive) {
                isExistEVentInTS = true;
                this.menu.setIconActive('icTs');
                this.goToLine(line);
            }

        }

        if (!isExistEVentInTS) {

            if (!isExistEVentInHTML) this.setEventInHTml(json.id, json.event);
            setTimeout(() => {
                const str = `private ${nameFc}(){\n//Edit here your event ${json.event} code\n\n}`;
                const line = this.searchLineByStringTs('/// **collab_events_start**');
                if (!line) throw new Error('Not found collab_events_start');
                this.setEditorValueByLineTs(str, line + 1);
            }, 500);

        }

        this.closeScenario();

    }

    private createOrSetEventPR(json: any) {

        //{"op":"CreateOrSetEvent", "id":"test", "event":"click", "device":"desktop", "func":""}
        let isExistEventInHTML = this.isEventExist(json.id, json.event);
        let isExistEventInTS = false;
        const nameFc = getEventName(json.event, json.id, json.device);

        if (isExistEventInHTML) {
            const line = this.searchLineByStringTs(nameFc);
            if (line && this.menu.setIconActive) {
                isExistEventInTS = true;
                this.menu.setIconActive('icTs');
                this.goToLine(line);
            }
        }

        if (!isExistEventInTS) {
            if (!isExistEventInHTML) this.setEventInHTml(json.id, json.event);
            setTimeout(() => {
                const str = `private ${nameFc}${json.func}`;
                const line = this.searchLineByStringTs('/// **collab_events_start**');
                if (!line) throw new Error('Not found collab_events_start');
                this.setEditorValueByLineTs(str, line + 1);
            }, 500);
        }

        this.closeScenario();

    }

    private isEventExist(id: string, event: string): boolean {

        let isExist = false;
        const strHtml = this.getEditorHTMLValue();
        const html = document.createElement('div');
        html.innerHTML = strHtml;
        const el = html.querySelector('#' + id) as HTMLElement;
        if (el && el.dataset && el.dataset.event) {
            const events = el.dataset.event.split(' ');
            isExist = events.includes(event);
        }
        return isExist;

    }

    private setEventInHTml(id: string, event: string) {

        const strHtml = this.getEditorHTMLValue();
        const html = document.createElement('div');
        html.innerHTML = strHtml;

        const el = html.querySelector('#' + id) as HTMLElement;
        if (!el) return;
        if (el.dataset && el.dataset.event) {

            const events = el.dataset.event.split(' ');
            if (!events.includes(event)) {
                events.push(event);
                el.dataset.event = events.join(' ');
            }

        } else {

            el.setAttribute('data-event', event);

        }

        if (!this._ed1) return;
        const { shortName, project } = mls.l2.editor.editors[this.confE];
        const uri = this.getUri(`_${project}_${shortName}`, '.html');
        if (this.menu.setIconActive) this.menu.setIconActive('icHTML');
        let model = monaco.editor.getModel(uri);
        if (!model) return;
        model.setValue(html.innerHTML);

    }

    private registerProviderHTML() {
        monaco.languages.registerDocumentFormattingEditProvider('html', {
            provideDocumentFormattingEdits: (model) => {
                const value = model.getValue();
                const formattedValue = formatHtml(value);
                return [{
                    range: model.getFullModelRange(),
                    text: formattedValue
                }];
            }
        });
    }

    private isHTMLSystemChange: boolean = false;
    private syncDom: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {
        if (this.position === 'right') return;
        try {
            this.isHTMLSystemChange = true;
            sync();

        } catch (e) {
            console.error('Error on syncDom: ', e);
        }
    }

    private async checkToCreateModelHTML(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        if (this.position === 'right') return;
        try {
            const iPath: mls.cbe.IPath = JSON.parse(ev.desc);
            if (!iPath || !iPath.project || !iPath.shortName) return;
            const keyStorFile = mls.stor.getKeyToFiles(iPath.project, 2, iPath.shortName, '', '.html');
            const storFile = mls.stor.files[keyStorFile];
            if (!storFile) throw new Error('Invalid stor file for path:' + keyStorFile)
            await this.getOrCreateModelHtmlOrCss(storFile.shortName, storFile.project, '.html', storFile);
        } catch (err: any) {
            throw new Error(err);
        }
    }


}

type IModes = 'icTs' | 'icStyle' | 'icHTML';