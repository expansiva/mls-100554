/// <mls shortName="serviceSourceL1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu, IOptions } from '/_100554_/l2/serviceBase.js';
import { initState } from '/_100554_/l2/collabState.js';
import { propertyDataSource } from '/_100554_/l2/collabDecorators.js';
import {  collab_typescript, collab_file_code } from '/_100554_/l2/collabIcons.js';
import { createAgent } from '/_100554_/l2/agentFix.js';
import { getTemporaryContext } from '/_100554_/l2/aiAgentHelper.js';
import {  getUserId, createThread } from '/_102025_/l2/collabMessagesHelper.js';
import { saveOpenedFile, getLastOpenedFiles, OpenedFileL2, getBaseTemplate } from '/_100554_/l2/libCommom.js';
import { createAllModels, readProjectTypescriptAndCompile, createModel } from '/_100554_/l2/collabLibModel.js';
import { IReqCreateStorFile, createStorFile } from '/_100554_/l2/collabLibStor.js';
import { getThreadByName } from '/_102025_/l2/collabMessagesIndexedDB.js';

import { CollabSpliterVerticalVarFixed100554 } from '/_100554_/l2/collabSpliterVerticalVarFixed.js';
import '/_100554_/l2/collabSpliterVerticalVarFixed.js';
import '/_100554_/l2/collabSpliterHorizontalVarFixed.js';
import '/_100554_/l2/cssHelperIndex.js';

/// **collab_i18n_start**
const message_pt = {
    historyOpen: 'Aberto',
    historyClose: 'Fechado',
}

const message_en = {
    historyOpen: 'Closed',
    historyClose: 'Opened',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-source-l1-100554')
export class ServiceSource100554 extends ServiceBase {

    constructor() {
        super();
        mls.events.addListener(1, 'FileAction', this.onMLSEvents.bind(this));
        this.initMonaco_GlobalEditor();
    }

    private baseProject = 100554;

    @property({ type: String }) msize = '';
    @property({ type: String }) activeModels: mls.editor.IModels | undefined;
    @property() isModeHistory: boolean = false;

    @property({ type: String }) mode: IModes = 'icTs';
    @property({ type: String }) textOverlayLoading: string = '';

    @property({ type: String }) currentHistorySourceWithoutSave: string | undefined = undefined;
    @property({ type: String }) previousHistorySourceWithoutSave: string | undefined = undefined;

    @propertyDataSource({ type: String }) currentHistorySource: string | undefined = undefined;;
    @propertyDataSource({ type: String }) previousHistorySource: string | undefined = undefined;;
    @propertyDataSource({ type: String }) historyLanguage: 'typescript' | 'html' | 'less' | 'defs' = 'typescript';
    @propertyDataSource({ type: String }) selectedMode: 'icTs' | 'icDefs' | 'History' | undefined;
    @propertyDataSource() lockMap = new Map<string, boolean>();

    private viewState: IViewState = {};
    private msg: MessageType = messages['en'];
    private modeToExt: { [key: string]: 'ts' | 'defs' } = {
        icTs: 'ts',
        icDefs: 'defs',
    }

    public onClickMain(op: string) {
        if (op === 'opHistory') this.showHistory();
        else if (this.menu.setMode) this.menu.setMode('initial');
    }

    public onClickTabs = (op: number): void => {
        this.saveViewState();

        this.mode = EToolsSource[op] as IModes;
        this.selectedMode = EToolsSource[op] as IModes;

        if (this.isModeHistory && this.menu.selectTool) this.menu.selectTool('History');

        if (op === EToolsSource.icTs) {
            this.showActiveModel();
            this.updateActionBasedOnError('ts', this.activeModels?.ts?.model.id);
            if (this._ed1) this.highlightReviewLines(this._ed1);

        }
        if (op === EToolsSource.icDefs) {
            if (!this.activeModels || !this.activeModels.defs || !this.activeModels.defs.storFile) {
                this.createModelIfNeed('.defs.ts', op);
                return;
            }
            this.showThisModel(this.activeModels?.defs);
            this.updateActionBasedOnError('defs', this.activeModels?.defs?.model.id);
        }
    }

    private async createModelIfNeed(ext: string, op: number) {

        try {
            if (!this.activeModels || !this.activeModels.ts) return;

            const { project, shortName, folder, level } = this.activeModels.ts.storFile;

            const key = mls.stor.getKeyToFiles(project, 1, shortName, folder, ext);
            let stor = mls.stor.files[key];

            if (!stor) {

                let template = await getBaseTemplate({ folder, shortName, project, extension: ext });

                const param: IReqCreateStorFile = {
                    project,
                    shortName,
                    folder,
                    level,
                    extension: ext,
                    source: template,
                    status: 'new'
                }

                await createStorFile(param, true, true, false);

            } else {
                await createModel(stor, true, false);
            }

            this.activeModels = mls.editor.getModels(project, shortName, folder, level);

            if (op === EToolsSource.icDefs) {
                if (!this.activeModels || !this.activeModels.defs || !this.activeModels.defs.storFile) return;
                this.showThisModel(this.activeModels?.defs);
                this.updateActionBasedOnError('defs', this.activeModels?.defs?.model.id);
            }

        } catch (e) {

        }

    }

    public onClickTitle = () => {
        this.openService('_100554_serviceProject', this.position, 1, { activeTab: 'Explore' });
    }

    public onClickTools(op: string): void {
        if (op === 'History') return this.toogleHistory();
        else throw new Error('Invalid option')
    }

    public details: IService = {
        icon: '&#xf121',
        state: 'background',
        tooltip: 'Source L1',
        visible: true,
        position: "all",
        widget: '_100554_serviceSourceL1',
        level: [1]
    }

    public menu: IServiceMenu = {
        title: {
            icon: '&#xf053',
            text: 'L2 - Loading...'
        },
        main: {
            opHistory: 'History',
            opView: 'View on repository',
        },
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: 0,
            options: [
                { text: 'Typescript', icon: collab_typescript.strings[0].trim() },
                { text: 'Defs', icon: collab_file_code.strings[0].trim() },
            ]
        },
        tools: {
            History: {
                type: 'cycle',
                selected: 0,
                options: [
                    { text: this.msg.historyOpen, icon: 'f017' },
                    { text: this.msg.historyClose, icon: 'f057' },
                ]
            },
        },
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
        onClickTools: this.onClickTools.bind(this),
        onClickTitle: this.onClickTitle.bind(this),
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
        if (this.menu.setTabActive) this.menu.setTabActive(EToolsSource.icTs);
        await this.updateComplete;
        this.updatedMSizeEditor();

        if (mls.actual[1][this.position]) {
            this.openActualL2(this.position);
        } else if (!this.activeModels && this.position === 'left') this.openLastFile(this.level, this.position);

    }


    private async openActualL2(position: 'left' | 'right') {

        this.loading = true;
        const storFile = mls.actual[1][position];
        if (!storFile) {
            return;
        }
        const { project, shortName, folder, level } = storFile;
        let models = mls.editor.getModels(project, shortName, folder, level);
        if (!models || !models.ts) models = await createAllModels(storFile);
        if (!models) return;
        this.activeModels = models;
        await readProjectTypescriptAndCompile(project, '', true)
        if (models && models.ts) mls.editor.forceModelUpdate(models.ts.model);
        this.loading = false;
        setTimeout(() => {
            this.showActiveModel();
        }, 500);

    }

    public inCreate: Record<string, Promise<void> | undefined> = {};




    //---------- Handling Editor --------

    public getEditorValue() {
        if (!this._ed1) return '';
        const model = this._ed1.getModel();
        if (!model) return '';
        return model.getValue();
    }

    public formatMonaco() {
        if (!this._ed1) return;
        this._ed1.trigger('anyString', 'editor.action.formatDocument', null);
    }

    //---------------------------------------------

    @query('mls-editor-100529') private editorEl: HTMLElement | undefined;
    @query('mls-editor-100529.history') private editorHistoryEl: HTMLElement | undefined;
    @query('.overlay-loading') public overlayLoading: HTMLElement | undefined;

    @query('collab-spliter-vertical-var-fixed-100554') private verticalSpliter: CollabSpliterVerticalVarFixed100554 | undefined;
    @query('collab-spliter-horizontal-var-fixed-100554') private horizontalSpliter: HTMLElement | undefined;

    public last: mls.IActual | undefined = undefined;
    public _ed1: monaco.editor.IStandaloneCodeEditor | undefined;
    private _edDiff: monaco.editor.IStandaloneDiffEditor | undefined;

    private mConfEditor: monaco.editor.ITextModel | undefined;
    private confE2(positionToolbar: string) { return `l${this.level}_${positionToolbar}`; }

    get confE() { return `l${this.level}_${this.position}`; }
    get confETS() { return this.confE + '_TS'; }
    get confEJS() { return this.confE + '_JS'; }

    private saveViewState() {
        const activeModel = this.activeModels;
        if (!activeModel) return;
        if (!this._ed1 || !this.mode || !activeModel || !activeModel.ts) return;

        const mode: 'ts' | 'defs' = this.modeToExt[this.mode];
        const keyViewState = `${activeModel.ts.storFile.project}_${activeModel.ts.storFile.level}_${activeModel.ts.storFile.shortName}`;
        if (!this.viewState[keyViewState]) {
            this.viewState[keyViewState] = {
                ts: null,
                defs: null
            }
        }
        this.viewState[keyViewState][mode] = this._ed1.saveViewState();
    }

    private restaureViewState() {
        const activeModel = this.activeModels;
        if (!activeModel) return;
        if (!this._ed1 || !this.mode || !activeModel || !activeModel.ts) return;

        const mode: 'ts' | 'html' | 'style' | 'test' | 'defs' = this.modeToExt[this.mode];
        const keyViewState = `${activeModel.ts.storFile.project}_${activeModel.ts.storFile.level}_${activeModel.ts.storFile.shortName}`;
        if (this.viewState[keyViewState] && this.viewState[keyViewState][mode]) this._ed1.restoreViewState(this.viewState[keyViewState][mode]);
    }

    private toogleHistory() {
        this.updatedMSizeEditor();
        this.isModeHistory = this.menu.tools.History.selected === 1;
        if (!this.isModeHistory && this.menu.setTabActive) {
            this.menu.setTabActive(EToolsSource[this.mode]);
        } else {
            this.getHistories();
        }

        this.verticalSpliter?.updatePanelsMSize();
    }

    private async getHistories() {

        this.setHistories('Loading...', '', 'text');

        const mode: 'ts' | 'defs' = this.modeToExt[this.mode];
        if (!this.activeModels || !this.activeModels[mode]) {
            console.error('No active model');
            return;
        }
        const storFile = this.activeModels[mode]?.storFile;
        const model = this.activeModels[mode]?.model;

        if (!storFile) {
            console.error('No storfile');
            return;
        };

        if (!model) {
            console.error(`No model for ${mode} file`);
            return;
        };

        const oldStatus = storFile.inLocalStorage;
        storFile.inLocalStorage = false;
        let originalValue: string | Blob | null = '';
        if (storFile.status !== 'new') {
            originalValue = await storFile.getContent();
        }
        if (typeof originalValue !== 'string') {
            console.error('invalid content')
            return;
        }
        storFile.inLocalStorage = oldStatus;
        this.previousHistorySourceWithoutSave = originalValue;
        this.currentHistorySourceWithoutSave = model.getValue();
        const editorType: { [key: string]: string } = {
            '.ts': 'typescript',
            '.defs.ts': 'typescript',
        }
        this.setHistories(this.previousHistorySourceWithoutSave || '', this.currentHistorySourceWithoutSave || '', editorType[storFile.extension]);
    }

    private openRepo() {
        if (!this.menu.tabs) return;
        if (this.menu.tabs.selected === undefined) return false;
        if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.storFile) return false;

        const { shortName, project, folder } = this.activeModels.ts.storFile;
        const obj: { [key: string]: string } = {
            0: '.ts',
            4: '.defs.ts',

        };
        const ext = obj[this.menu.tabs.selected];
        const keyToFile = mls.stor.getKeyToFiles(project, 1, shortName, folder, ext);
        const file = mls.stor.files[keyToFile];
        if (!file) {
            (window as any).collabMessages.add('Invalid File', 'information');
            throw new Error('invalid file');
        }
        const driver = mls.stor.others.getDefaultDriver(project);
        if (!driver) {
            (window as any).collabMessages.add('Driver not found', 'information');
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

        if (!this.menu.tabs || !this.activeModels || !this.activeModels.ts || !this.activeModels.ts.storFile) return;
        const { shortName, project, folder } = this.activeModels.ts.storFile;

        const div = document.createElement('div');
        const scr = document.createElement('script');
        const i2 = `/_${this.baseProject}_${'mlsHistoryList'}`;
        scr.type = 'module';
        scr.id = i2.replace('/', '');
        scr.src = i2;
        div.appendChild(scr);
        const obj: { [key: number]: string } = {
            0: '.ts',
            4: '.defs.ts',

        };

        const wc = document.createElement('mls-history-list-100554');
        wc.setAttribute('project', project.toString());
        wc.setAttribute('folder', folder);
        wc.setAttribute('shortName', shortName);
        wc.setAttribute('level', '1');
        if (this.menu.tabs.selected !== undefined) wc.setAttribute('extension', obj[this.menu.tabs.selected]);
        wc.setAttribute('position', this.position);
        div.appendChild(wc);
        if (this.menu.setMode) this.menu.setMode('page', div);
    }

    private mapExt: Record<string, keyof typeof mls.editor.models[string]> = {
        '.ts': 'ts',
        '.defs.ts': 'defs'
    };

    private onMLSEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {

        if (ev.level !== 1 || (ev.type !== 'FileAction')) return;
        if (!ev.desc) return;
        const fileAction = JSON.parse(ev.desc) as mls.events.IFileAction;
        if (fileAction.position !== this.position) return;

        const onOpen = async (): Promise<void> => {

            this.loading = true;
            const keyFiles = mls.stor.getKeyToFiles(fileAction.project, fileAction.level, fileAction.shortName, fileAction.folder, fileAction.extension);
            const storFile = mls.stor.files[keyFiles];
            await this.openFiles(storFile, fileAction.position);
            mls.events.fireFileAction('statusOrErrorChanged', storFile, this.position);
            this.updatedMSizeEditor();
            this.toogleIconsError(this.position);
            const pageActual = this.getActualL1File();
            if (pageActual) {
                const isLocked = this.isEditorLocked(pageActual);
                if (isLocked) this.lockEditorForFile(pageActual);
                else this.unlockEditorForFile(pageActual);
                this.toogleOverlayLoading(isLocked, 'Executing agent Fix...');
            }
            if (this.horizontalSpliter && (this.horizontalSpliter as any).resizeItens) (this.horizontalSpliter as any).resizeItens();
            this.loading = false;
        };

        const onEditorEvents = async (): Promise<void> => {

            this.loading = true;
            const keyModel = mls.editor.getKeyModel(fileAction.project, fileAction.shortName, fileAction.folder, 1);
            const models = mls.editor.models[keyModel];
            const prop = this.mapExt[fileAction.extension];
            if (!models || !models[prop]) this.setError('[onEditorEvents] Not found model');
            await this.fireEditorEvents(models[prop] as mls.editor.IModelBase, prop as any);
            this.loading = false;
        };

        const onUpdatedOnServer = async (): Promise<void> => {

        };

        const onEditorChanged = async (): Promise<void> => {

            const keyFiles = mls.stor.getKeyToFiles(fileAction.project, fileAction.level, fileAction.shortName, fileAction.folder, fileAction.extension);
            const storFile = mls.stor.files[keyFiles];
            if (!storFile) return;

        };

        if (mls.istrace) console.time('onAction_1_' + fileAction.action + '_' + fileAction.position);

        await this.initMonaco();
        switch (fileAction.action as any) {
            case 'open': await onOpen(); break;
            case 'editorEvents': await onEditorEvents(); break;
            case 'updatedOnServer': await onUpdatedOnServer(); break;
            case 'editorChanged': await onEditorChanged(); break;
            default: {
                // console.error('invalid action: ' + fileAction.action);
            }
        }
        if (mls.istrace) console.timeEnd('onAction_1_' + fileAction.action + '_' + fileAction.position);
    }


    private async fireEditorEvents(modelBase: mls.editor.IModelBase, mode: "defs" | "ts"): Promise<void> {

        if (!modelBase) this.setError('[fireEditorEvents] Not found model');
        const position = this.getPosition(modelBase.model.id, mode)

        this.toogleIconsError(position);
        this.updateActionBasedOnError(mode, modelBase.model.id);

    }

    private async openFiles(
        storFileBase: mls.stor.IFileInfo,
        position: 'left' | 'right') {

        try {

            //await this.createModelTS_loading();
            this.activeThisService();
            this.closeMenu();

            let keyTs = mls.stor.getKeyToFiles(storFileBase.project, 1, storFileBase.shortName, storFileBase.folder, '.ts');

            let keyDefs = mls.stor.getKeyToFiles(storFileBase.project, 1, storFileBase.shortName, storFileBase.folder, '.defs.ts');

            const storFiles = {
                ts: mls.stor.files[keyTs],
                defs: mls.stor.files[keyDefs],
            };

            let fileModels = mls.editor.getModels(storFileBase.project, storFileBase.shortName, storFileBase.folder, storFileBase.level);

            [storFiles.ts, storFiles.defs].forEach((storF) => {
                if (storF && !storF.inLocalStorage && storF.isLocalVersionOutdated) storF.isLocalVersionOutdated = false;
            });

            if (storFiles.ts) this.saveLocalStorageLastOpen(storFiles.ts, position);


            this.activeModels = fileModels;
            mls.editor.editors[this.position] = fileModels;
            this.showActiveModel();
            if (!this._ed1) return;
            if (fileModels && fileModels.ts) mls.editor.forceModelUpdate(fileModels.ts.model);
            this.restaureViewState();


        } catch (e: any) {

            this.loading = false;
            this.setError(e.message);

        }

    }

    private activeThisService(): void {
        this.openMe();
        mls.editor.setActiveInstance(this.level, this.position);
    }

    private closeMenu() {
        if (this.menu.closeMenu) this.menu.closeMenu()
    }

    public delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private showThisModel(modelBase: mls.editor.IModelBase | undefined) {
        if (!modelBase) return;
        if (this._ed1 && modelBase.model) this._ed1.setModel(modelBase.model);
        this.restaureViewState();
        this.updatedMSizeEditor();
    }

    private showActiveModel(): boolean {

        if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.storFile) return false;
        const { shortName, project, folder } = this.activeModels.ts.storFile;

        const model = this.activeModels.ts.model;
        mls.editor.editors[this.position] = this.activeModels;

        if (model.isDisposed()) return false;

        if (!this._ed1 || !this.menu.getLastMode) return false;
        const key = folder ? `_${project}_${folder}/${shortName}` : `_${project}_${shortName}`;
        const changedFile: boolean = this.menu.title !== key;
        (this.menu.title as IOptions).text = key;
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
        this.restaureViewState();
        this._formatIfNeeded(model as FormattableModel);

        return true;
    }

    private async initMonaco() {
        if (!this._ed1) {
            await this.initMonaco_Editor();
            await this.initMonaco_EditorDiff();
            if (this.serviceContent && typeof this.serviceContent.layout === 'function') this.serviceContent.layout();
        }
    }

    private monacoGlobalInitialized = false;
    private async initMonaco_GlobalEditor(): Promise<void> {
        
        this.loadMonacoConfigurations();
    
        if (this.monacoGlobalInitialized) return;
        this.monacoGlobalInitialized = true;
        //this.updateMonacoGlobalTheme();
        mls.editor.InitMonaco();
    }

    private async initMonaco_Editor(): Promise<void> {

        if (!this.editorEl) return;

        this._ed1 = monaco.editor.create(this.editorEl, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);

        (this.editorEl as any)['mlsEditor'] = this._ed1;
        mls.editor.instances[this.confE] = this._ed1;
        mls.editor.InitEditor(this._ed1);
        await this.createModelConf('// loading ...');
    }

    private actionAgentFix: monaco.IDisposable | undefined;

    private addFixAction() {

        if (!this._ed1) return;
        this.actionAgentFix = (this._ed1).addAction({
            id: "action-agent-fix",
            label: "Fix(agentFix)",
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM // Ctrl+M
            ],

            contextMenuGroupId: "Fix",
            contextMenuOrder: 1.5,
            run: (ed: monaco.editor.IStandaloneCodeEditor) => {
                this.fireAgentFix();
            }
        });
    }

    private lockEditorForFile(page: string) {
        this.lockMap.set(page, true);
        if (this._ed1) this._ed1.updateOptions({ readOnly: true });
    }

    private isEditorLocked(fileId: string): boolean {
        return this.lockMap.get(fileId) === true;
    }

    private unlockEditorForFile(fileId: string) {
        this.lockMap.set(fileId, false);
        this._ed1?.updateOptions({ readOnly: false });
    }

    private removeFixAction() {
        if (!this._ed1) return;
        const actions: Map<string, any> = (this._ed1 as any)._actions;
        if (actions && actions.has('action-agent-fix')) actions.delete('action-agent-fix');
        if (this.actionAgentFix) this.actionAgentFix.dispose();
    }

    private updateActionBasedOnError(mode: 'ts' | 'defs', modelId: string | undefined) {

        if (this._ed1?.getModel()?.id !== modelId) return;
        if (!this._ed1) return;
        if (!this.activeModels) return;
        this.removeFixAction();

        if (mode === 'defs') return;

        const markers = this.activeModels[mode] ? monaco.editor.getModelMarkers({ resource: this.activeModels[mode]?.model.uri }) : [];
        const markersErrors = markers.some(marker => marker.severity === monaco.MarkerSeverity.Error);
        let compileErrors: boolean = false;

        if (mode === 'ts') {
            compileErrors = ((this.activeModels.ts?.compilerResults?.errors?.length || 0) > 0)
        }

        let hasErrors = compileErrors || markersErrors;
        if (hasErrors) {
            this.addFixAction();
        }

    }

    private getActualL1File() {
        if (!mls.actual[1] || !(mls.actual[1])[this.position]) return;
        const actual = (mls.actual[1])[this.position];
        if (!actual) return;
        const { project, shortName, folder } = actual;
        if (!project || !shortName) return;
        const page = folder ? `_${project}_${folder}/${shortName}` : `_${project}_${shortName}`
        return page;
    }

    private async fireAgentFix() {

        const page = this.getActualL1File();
        if (!page) return;
        //const pref = loadChatPreferences();

        const modeBy = {
            'icTs': 'typescript',
            'icDefs': '',
        }

        const data = { page, prompt: 'Fix errors in files', position: this.position, mode: modeBy[this.mode] }


        let thread = await getThreadByName(page);
        if (!thread) {
            thread = await createThread(page, [], 'company');
        }

        if (!thread) return `Error: Not found thread: ${page}`;

        const userId = getUserId();
        const threadId = thread.threadId;
        if (!userId) return;
        this.lockEditorForFile(page);
        this.toogleOverlayLoading(true, 'Executing agent Fix...');
        const context = getTemporaryContext(threadId, userId, '@@ agentFix ' + JSON.stringify(data));
        const agent = createAgent();
        await agent.beforePrompt(context);

    }

    private toogleOverlayLoading(show: boolean, msg?: string) {
        if (!this.overlayLoading) return;
        if (show) {
            this.overlayLoading.style.display = 'flex';
            this.textOverlayLoading = msg || '';

        } else {
            this.overlayLoading.style.display = 'none';
            this.textOverlayLoading = '';

        }
    }

    private initMonaco_EditorDiff() {
        if (!this.editorHistoryEl) return;
        const opt = {
            ...mls.editor.conf[this.confE] as monaco.editor.IEditorOptions,
            automaticLayout: true,
            renderSideBySide: false
        };
        this._edDiff = monaco.editor.createDiffEditor(this.editorHistoryEl, opt);
        (this.editorHistoryEl as any)['mlsEditor'] = this._edDiff;
        this.setHistories('no file A', 'no file B', 'typescript');

    }

    private setHistories(srcOriginal: string, srcModified: string, language: string) {
        const modelOriginal = this.createOrGetModelHistory(language, srcOriginal, 'original');
        const modelModified = this.createOrGetModelHistory(language, srcModified, 'modified');
        if (!this._edDiff) return;
        this._edDiff.updateOptions({ readOnly: true });
        this._edDiff.setModel({
            original: modelOriginal,
            modified: modelModified,
        });
    }

    private createOrGetModelHistory(editorType: string, src: string, tp: string) {
        const shortFN = `SourceHistory_${this.position}_${tp}`
        const uri = monaco.Uri.parse(`file://server/${shortFN}.ts`);
        let model1 = monaco.editor.getModel(uri);
        if (!model1) model1 = monaco.editor.createModel(src, editorType, uri);
        else {
            model1.setValue(src);
            monaco.editor.setModelLanguage(model1, editorType);
        }
        return model1;
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

    private getUri(storFile: mls.stor.IFileInfo, ftype: '.ts' | '.defs.ts'): monaco.Uri {
        return monaco.Uri.parse(`file://server/_${storFile.project}_${storFile.level}_${storFile.folder ? storFile.folder + '_' : ''}${storFile.shortName}${ftype}`);
    }

    private async createModel(project: number, shortName: string, ext: '.ts' | '.defs.ts', content?: string): Promise<mls.editor.IModelBase | undefined> {

        try {

            let src: string | Blob | null | undefined = undefined;
            let haveInfo: boolean = false;
            let info: mls.stor.IFileInfoValue | null = null;
            let storFile: mls.stor.IFileInfo | undefined;


            const keyToFile = mls.stor.getKeyToFiles(project, 1, shortName, '', ext);
            storFile = mls.stor.files[keyToFile];
            if (!storFile) throw new Error(`Invalid file: ${ext}`);
            if (storFile.project !== 0) {
                info = storFile.getValueInfo ? await storFile.getValueInfo() : null;
                haveInfo = !!info && !!info.content;
            }
            if (!content) {
                src = haveInfo ? info?.content : await storFile.getContent();
            } else src = content;



            if (src instanceof Blob) throw new Error(`${ext} file must be string`);
            if (!src) throw new Error(`${ext} file is undefined`);

            let originalCRC = haveInfo ? info?.originalCRC : mls.common.crc.crc32(src).toString(16);

            const originalProject: number | undefined = haveInfo ? info?.originalProject : undefined;
            const originalShortName: string | undefined = haveInfo ? info?.originalShortName : undefined;

            let model: mls.editor.IModelBase | undefined;

            if (ext === '.ts' && storFile) model = mls.editor.createModelTS(storFile, src);
            else if (ext === '.defs.ts' && storFile) model = mls.editor.createModelDefs(storFile, src);

            if (!model) throw new Error(`Model invalid`);

            model.originalCRC = originalCRC;
            model.originalProject = originalProject;
            model.originalShortName = originalShortName;


            (model as any).needFormat = true;
            return model;
        } catch (e: any) {
            this.setError(e.message);
        }
    }

    private async createModelConf(src: string) {
        if (mls.istrace) console.log(`ServiceSource, createModelConf_${this.position}, ${!!this.mConfEditor}`);
        if (this.mConfEditor) return;
        const shortName = this.confE + '_service_source.confEditor';
        const level = 1;
        const project = 0;
        const extension = '.ts';
        const storFile = await mls.stor.addOrUpdateFile({ project, level, shortName, extension, versionRef: new Date().toISOString(), folder: '' });
        if (!storFile) throw new Error('Invalid storFile');

        const uri = this.getUri(storFile, extension);
        let model = monaco.editor.getModel(uri);
        if (model) {
            this.mConfEditor = model;
        } else {
            const modelBase = await this.createModel(project, shortName, '.ts', src);
            if (!modelBase) throw new Error(`invalid mls.editor.models for file: _${project}_${shortName}.ts`);
            model = modelBase.model;
            this.mConfEditor = model;
        }

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
            const mmodel = mls.editor.getModelById(this.mConfEditor.id);
            if (!mmodel || !mmodel.storFile) return; // not in model
            const ok = await mls.l2.typescript.compileAndPostProcess(mmodel, false, true);
            if (!ok) return;
            if (mode === 'confEditor'
                && (mmodel as mls.editor.IModelTS).compilerResults?.prodJS)
                this.setConfEditorFromJavascript((mmodel as mls.editor.IModelTS).compilerResults?.prodJS || '', src);
        }, 500);
    }

    private loadConfEditorFromLocalStorage() {
        const info = this.getLocalStorageInfo();
        const json = info.confEditor;
        mls.editor.loadConfFromJSON(json);
    }

    private saveConfEditorToLocalStorage() {
        const info = this.getLocalStorageInfo();
        info.confEditor = JSON.stringify(mls.editor.conf);
        this.saveLocalStorageInfo(info);
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

    private _formatIfNeeded(model: FormattableModel) {
        if (model.needFormat && this._ed1) {
            this.formatMonaco();
            model.needFormat = false;
        }
    }

    private getPosition(modeIld: string, tp: 'ts'| 'defs' ): 'left' | 'right' | 'all' {
        let position: 'left' | 'right' | 'all';
        const idLeft = mls.editor.editors.left?.[tp]?.model.id;
        const idRight = mls.editor.editors.right?.[tp]?.model.id;
        const idActive = modeIld;
        if (idLeft === idActive && idRight === idActive) position = 'all';
        else if (idLeft === idActive) position = 'left';
        else position = 'right';
        return position;
    }

    private getLocalStorageInfo(): ILocalStorageServiceSource {
        const ls = localStorage.getItem('serviceSource');
        if (ls) return JSON.parse(ls);

        const oldConfigEditor: string | null = localStorage.getItem('mlsConfEditor');

        const rc = {
            confTheme: { light: 'VS', dark: 'VS Dark' },
            confEditor: oldConfigEditor ? oldConfigEditor : '',
            lastOpened: {},
        };

        if (oldConfigEditor) {
            this.saveLocalStorageInfo(rc);
            localStorage.removeItem('mlsConfEditor');
        }

        return rc;
    }

    private saveLocalStorageInfo(data: ILocalStorageServiceSource): void {
        localStorage.setItem('serviceSource', JSON.stringify(data));
    }

    private updatedMSizeEditor() {
        this.editorEl?.setAttribute('msize', this.msize);
        this.editorHistoryEl?.setAttribute('msize', this.msize);
    }

    private toogleIconsError(position: 'left' | 'right' | 'all') {
        const servicesToChange: ServiceSource100554[] = [];

        if (position === 'all') {
            const serviceL: ServiceSource100554 = mls.services[`${'100554_serviceSourceL1'}_right`];
            const serviceR: ServiceSource100554 = mls.services[`${'100554_serviceSourceL1'}_left`];
            if (serviceL) servicesToChange.push(serviceL);
            if (serviceR) servicesToChange.push(serviceR);
        }
        else {
            const service: ServiceSource100554 = mls.services[`${'100554_serviceSourceL1'}_${position}`];
            if (service) servicesToChange.push(service);
        }

        servicesToChange.forEach((serv) => {
            if (!serv.menu || !serv.menu.toggleErrorTab || !serv.activeModels) return;
            if (serv.activeModels.html && serv.activeModels.html.storFile) serv.menu.toggleErrorTab(EToolsSource.icHTML, serv.activeModels.html.storFile.hasError);
            if (serv.activeModels.ts && serv.activeModels.ts.storFile) serv.menu.toggleErrorTab(EToolsSource.icTs, serv.activeModels.ts.storFile.hasError);
            if (serv.activeModels.style && serv.activeModels.style.storFile) serv.menu.toggleErrorTab(EToolsSource.icStyle, serv.activeModels.style.storFile.hasError);
            if (serv.activeModels.test && serv.activeModels.test.storFile) serv.menu.toggleErrorTab(EToolsSource.icTest, serv.activeModels.test.storFile.hasError);
            if (serv.activeModels.defs && serv.activeModels.defs.storFile) serv.menu.toggleErrorTab(EToolsSource.icDefs, serv.activeModels.defs.storFile.hasError);
        });

    }

    private currentReviewDecorationIds: monaco.editor.IEditorDecorationsCollection | undefined;

    private highlightReviewLines(editor: monaco.editor.IStandaloneCodeEditor) {
        const model = editor.getModel();
        if (!model) return;

        const decorations: monaco.editor.IModelDeltaDecoration[] = [];

        for (let i = 1; i <= model.getLineCount(); i++) {
            const lineContent = model.getLineContent(i);
            if (lineContent.includes('// REVIEW: Warning') || lineContent.includes('<!-- REVIEW: Warning')) {
                decorations.push({
                    range: new monaco.Range(i, 1, i, 1),
                    options: {
                        isWholeLine: true,
                        className: 'review-warning-line-highlight',
                        overviewRuler: {
                            color: 'rgba(255, 165, 0, 0.8)',
                            position: monaco.editor.OverviewRulerLane.Right,
                        },

                        hoverMessage: { value: lineContent.trim() },
                    },
                });
            }

            if (lineContent.includes('// REVIEW: Error') || lineContent.includes('<!-- REVIEW: Error')) {
                decorations.push({
                    range: new monaco.Range(i, 1, i, 1),
                    options: {
                        isWholeLine: true,
                        className: 'review-error-line-highlight',
                        overviewRuler: {
                            color: 'rgba(255, 0, 0, 0.6)',
                            position: monaco.editor.OverviewRulerLane.Right,
                        },
                        hoverMessage: { value: lineContent.trim() },
                    },
                });
            }
        }

        if (this.currentReviewDecorationIds && (this.currentReviewDecorationIds as any)._decorationIds) editor.removeDecorations((this.currentReviewDecorationIds as any)._decorationIds)
        this.currentReviewDecorationIds = editor.createDecorationsCollection(decorations);
    }


    private changeMode(mode: IModes | IModesH) {
        if (!this.menu || !this.menu.setTabActive || !this.menu.selectTool || this.mode === mode) return;
        if (mode.startsWith('ic')) {
            if (this.isModeHistory) this.menu.selectTool('History');
            this.menu.setTabActive(EToolsSource[mode as IModes]);
        } else {
            this.menu.selectTool(mode);
        }
    }

    private saveLocalStorageLastOpen(storFile: mls.stor.IFileInfo, position: 'left' | 'right') {
        const data: OpenedFileL2 = {};
        if (storFile.folder) data[position] = `_${storFile.project}_${storFile.folder}/${storFile.shortName}`;
        else data[position] = `_${storFile.project}_${storFile.shortName}`;
        saveOpenedFile(storFile.project, 2, data);
    }

    private async openLastFile(level: number, position: 'left' | 'right') {

        this.loading = true;
        const actualProject = mls.actualProject;
        if (!actualProject) return;
        const lastOpenedFile = getLastOpenedFiles(actualProject);
        const lastL1 = lastOpenedFile[level] as OpenedFileL2;
        if (!lastL1) {
            this.openService('_100554_serviceProject', position, this.level);
            return;
        }
        const lastL1ByPosition = lastL1[position];
        if (!lastL1ByPosition) {
            this.openService('_100554_serviceProject', position, this.level);
            return;
        }

        const { project, shortName, folder } = mls.l2.getPath(lastL1ByPosition);
        const keyStorFile = mls.stor.getKeyToFiles(project, 1, shortName, folder, '.ts');
        const storFile = mls.stor.files[keyStorFile];
        if (!storFile) {
            this.openService('_100554_serviceProject', position, this.level);
            return;
        }
        let models = mls.editor.getModels(project, shortName, folder, 1);
        if (!models || !models.ts) models = await createAllModels(storFile);
        if (!models) return;
        this.activeModels = models;
        await readProjectTypescriptAndCompile(actualProject, '', true)
        if (models && models.ts) mls.editor.forceModelUpdate(models.ts.model);
        this.loading = false;
        setTimeout(() => {
            this.showActiveModel();
        }, 500);

    }

    public getActualRef(): string {
        if (!this.menu.tabs) return '';
        try {
            let ret = '';
            if (!mls.actual[1] || !(mls.actual[1] as any)[this.position]) return ret;
            const actual = (mls.actual[1] as any)[this.position];
            const ext = '.ts' ;
            if (!actual) return ret;
            ret = mls.stor.getKeyToFiles(actual.project, 1, actual.shortName, actual.folder, ext);
            return ret;

        } catch (e) {
            return '';
        }

    }


    //--------------WidgetAction--------------

    


    updated(changedProperties: any) {
        super.updated(changedProperties);
    }

    connectedCallback() {


        initState('serviceSourceL1', {
            left: {
                selectedMode: 'icTS',
                historyLanguage: 'typescript',
                service: mls.services['100554_serviceSourceL1_left'],
                lockMap: new Map<string, boolean>()
            },
            right: {
                selectedMode: 'icTS',
                historyLanguage: 'typescript',
                service: mls.services['100554_serviceSourceL1_right'],
                lockMap: new Map<string, boolean>()
            },
        });

        this.setAttribute('selectedMode', `{{serviceSourceL1.${this.position}.selectedMode}}`);
        this.setAttribute('historyLanguage', `{{serviceSourceL1.${this.position}.historyLanguage}}`);
        this.setAttribute('lockMap', `{{serviceSourceL1.${this.position}.lockMap}}`);
        super.connectedCallback();

    }

    firstUpdated(changedProperties: any) {
        super.firstUpdated(changedProperties);
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        this.style.display = 'block';
        return html`
             <div class="overlay-loading"> <span>${this.textOverlayLoading} <span class="loader"></span> </span> </div>
             <collab-spliter-vertical-var-fixed-100554 msize=${this.msize} withresize="false" fixedheight="100" complementcolor="#1e1e1e">
                
                    <mls-editor-100529 style=${this.isModeHistory ? 'display:none;' : 'display:block;'} slot="left"></mls-editor-100529>
                    <mls-editor-100529 style=${this.isModeHistory ? 'display:block;' : 'display:none;'} class="history" slot="left"></mls-editor-100529>
                    <css-helper-index-100554 state="{{ less.${this.position} }}" slot="right" position=${this.position} style="height:100%;"></css-helper-index-100554>
                    
                </collab-spliter-horizontal-var-fixed-100554>

                <div slot="bottom"></div>
        </collab-spliter-vertical-var-fixed-100554>`

    }

}

enum EToolsSource {
    'icTs' = 0,
    'icDefs' = 1,
    'icStyle' = 2,
    'icTest' = 3,
    'icHTML' = 4,
}

export type FormattableModel = monaco.editor.ITextModel & { needFormat: boolean };

interface IViewState {
    [file: string]: IViewStates
}

interface IViewStates {
    ts: monaco.editor.ICodeEditorViewState | null,
    defs: monaco.editor.ICodeEditorViewState | null,

}

interface ILocalStorageServiceSource {
    confTheme: { dark: string, light: string },
    confEditor: string,
    lastOpened: {
        [key: string]: { extension: string, folder: string, level: number, project: number, shortName: string }
    }
}

type IModes = 'icTs' | 'icDefs';
type TExtensions = '.ts' | '.defs.ts'
type IModesH = 'History';