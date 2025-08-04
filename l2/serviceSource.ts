/// <mls shortName="serviceSource" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu, IOptions } from './_100554_serviceBase';
import { formatHtml, sync } from './_100554_collabDOMSync';
import { removeTokensFromSource } from './_100554_enhancementStyle';
import { getTokensLess } from './_100554_designSystemBase';
import { LessCSS } from "./_100554_lessCSS";
import { initState, getState } from './_100554_collabState';
import { propertyDataSource } from './_100554_collabDecorators';
import { collab_html, collab_typescript, collab_less, collab_fileTest, collab_file_code } from './_100554_collabIcons';
import { createAgent } from './_100554_agentFix';
import { getUserIdLocalStorage, getTemporaryContext } from './_100554_aiAgentHelper';
import { loadChatPreferences } from './_100554_collabMessageHelper';
import { saveOpenedFile, getLastOpenedFiles, OpenedFileL2 } from './_100554_libCommom';
import { createAllModels, readProjectTypescriptAndCompile } from './_100554_collabLibModel';

import { CollabSpliterVerticalVarFixed100554 } from './_100554_collabSpliterVerticalVarFixed';
import './_100554_collabSpliterVerticalVarFixed';
import './_100554_collabSpliterHorizontalVarFixed';
import './_100554_cssHelperIndex';

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

@customElement('service-source-100554')
export class ServiceSource100554 extends ServiceBase {

    constructor() {
        super();
        mls.events.addListener(2, 'WidgetAction', this.onWidgetActionEvents.bind(this));
        mls.events.addListener(2, 'FileAction', this.onMLSEvents.bind(this));
        mls.events.addListener(2, 'MonacoAction', (ev) => this.onMonacoEvents(ev));
        mls.events.addListener(2, 'DomAction', (ev) => this.syncDom(ev));
        mls.events.addListener(2, 'LessChangedEditor' as any, (ev) => this.lessChangedEditor(ev));
        //mls.events.addListener(2, 'CreateModelHTML' as any, (ev) => this.checkToCreateModelHTML(ev));
        this.initMonaco_GlobalEditor();
    }

    private baseProject = 100554;

    @property({ type: String }) msize = '';
    @property({ type: Boolean }) panelRightOpened = false;
    @property({ type: String }) activeModels: mls.editor.IModels | undefined;
    @property() isModeHistory: boolean = false;

    @property({ type: String }) mode: IModes = 'icTs';
    @property({ type: String }) textOverlayLoading: string = '';

    @property({ type: String }) currentHistorySourceWithoutSave: string | undefined = undefined;
    @property({ type: String }) previousHistorySourceWithoutSave: string | undefined = undefined;

    @propertyDataSource({ type: String }) currentHistorySource: string | undefined = undefined;;
    @propertyDataSource({ type: String }) previousHistorySource: string | undefined = undefined;;
    @propertyDataSource({ type: String }) historyLanguage: 'typescript' | 'html' | 'less' | 'defs' = 'typescript';
    @propertyDataSource({ type: String }) selectedMode: 'icTs' | 'icStyle' | 'icHTML' | 'icTest' | 'icDefs' | 'History' | undefined;
    @propertyDataSource() lockMap = new Map<string, boolean>();

    private MINWIDTHTPANELRIGHT = 500;
    public lessCSS: LessCSS | undefined;
    private viewState: IViewState = {};
    private msg: MessageType = messages['en'];
    private modeToExt: { [key: string]: 'ts' | 'html' | 'style' | 'test' | 'defs' } = {
        icTs: 'ts',
        icHTML: 'html',
        icStyle: 'style',
        icTest: 'test',
        icDefs: 'defs',
    }

    public onClickMain(op: string) {
        if (op === 'opTS2') return;
        else if (op === 'opTheme') this.showPageTheme();
        else if (op === 'opMonacoConfig') this.showConfEditor();
        else if (op === 'opMonacoReset') this.showMonacoReset();
        else if (op === 'opHistory') this.showHistory();
        else if (op === 'opView') this.openRepo();
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
        if (op === EToolsSource.icHTML) {
            if (!this.activeModels || !this.activeModels.html || !this.activeModels.html.storFile) return;
            this.showThisModel(this.activeModels?.html);
            this.updateActionBasedOnError('html', this.activeModels?.html?.model.id);
            if (this._ed1) this.highlightReviewLines(this._ed1);
        }
        if (op === EToolsSource.icStyle) {
            if (!this.activeModels || !this.activeModels.html || !this.activeModels.html.storFile) return;
            this.showThisModel(this.activeModels?.style);
            this.updateActionBasedOnError('style', this.activeModels?.style?.model.id);
            if (this._ed1) this.highlightReviewLines(this._ed1);

        }

        if (op === EToolsSource.icTest) {
            if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.storFile) return;
            this.showThisModel(this.activeModels?.test);
            this.updateActionBasedOnError('test', this.activeModels?.test?.model.id);
        }

        if (op === EToolsSource.icDefs) {
            if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.storFile) return;
            this.showThisModel(this.activeModels?.defs);
            this.updateActionBasedOnError('defs', this.activeModels?.defs?.model.id);
        }
    }

    public onClickTitle = () => {
        this.openService('_100554_serviceProject', this.position, 2, { activeTab: 'Explore' });
    }

    public onClickTools(op: string): void {
        if (op === 'History') return this.toogleHistory();
        else throw new Error('Invalid option')
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

    public menu: IServiceMenu = {
        title: {
            icon: '&#xf053',
            text: 'L2 - widget1'
        },
        main: {
            opTheme: 'Editor - Themes',
            opMonacoConfig: 'Editor - config',
            opMonacoReset: 'Editor - reset',
            opHistory: 'History',
            opView: 'View on repository',
        },
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: 0,
            options: [
                { text: 'Typescript', icon: collab_typescript.strings[0].trim() },
                { text: 'HTML', icon: collab_html.strings[0].trim() },
                { text: 'Style', icon: collab_less.strings[0].trim() },
                { text: 'Test', icon: collab_fileTest.strings[0].trim() },
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
        this.updatedMSizeEditor();

        //if (!this.activeModels) this.openLastFile(this.level, this.position);

        if (this.editorEl) {
            const bgEl = this.editorEl.querySelector('.monaco-editor-background');
            if (bgEl) {
                const bg = getComputedStyle(bgEl).backgroundColor;
                if (bg && this.horizontalSpliter && this.verticalSpliter) {
                    this.horizontalSpliter.setAttribute('complementcolor', bg);
                    this.verticalSpliter.setAttribute('complementcolor', bg);
                }
            }
        }
    }

    public inCreate: Record<string, Promise<void> | undefined> = {};




    //---------- Handling Editor --------

    public getEditorValue() {
        if (!this._ed1) return '';
        const model = this._ed1.getModel();
        if (!model) return '';
        return model.getValue();
    }

    public setEditorValue(val: string) {
        if (!this._ed1) return false;
        if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.model) return false;
        this.setValueInModeKeepingUndo(this.activeModels.ts.model, val, true);
    }

    public setEditorValueByLineTs(val: string, line: number) {
        if (!this._ed1) return false;
        if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.model) return false;
        if (this.menu.setTabActive) this.menu.setTabActive(EToolsSource.icTs);
        this.setValueInModelInSpecificLine(val, line);
    }

    public setEditorValueByLineHtml(val: string, line: number) {
        if (!this._ed1) return false;
        if (!this.activeModels || !this.activeModels.html || !this.activeModels.html.model) return false;
        if (this.menu.setTabActive) this.menu.setTabActive(EToolsSource.icHTML);
        this.setValueInModelInSpecificLine(val, line);
    }

    public replaceEditorLineHTML(val: string, line: number) {
        if (!this._ed1) return false;
        if (!this.activeModels || !this.activeModels.html || !this.activeModels.html.model) return false;
        if (this.menu.setTabActive) this.menu.setTabActive(EToolsSource.icHTML);
        this.replaceLineValueInModelInSpecificLine(val, line);
    }

    public searchLineByStringTs(search: string): number | undefined {
        if (!this._ed1) return;
        if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.model) return;
        const matches = this.activeModels.ts.model.findMatches(search, false, false, false, null, true);
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
        if (!this.activeModels || !this.activeModels.html || !this.activeModels.html.model) return false;
        this.setValueInModeKeepingUndo(this.activeModels.html.model, val, false);
    }

    public getEditorHTMLValue(): string {
        if (!this._ed1) return '';
        if (!this.activeModels || !this.activeModels.html || !this.activeModels.html.model) return '';
        return this.activeModels.html.model.getValue();
    }

    public setValueInModeKeepingUndo(model: monaco.editor.ITextModel, val: string, checkFirstLine: boolean) {
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

        if (this._ed1?.getModel()?.id === model.id) {
            this.highlightReviewLines(this._ed1);
            if ((model.getLanguageId() === 'typescript') && this.activeModels?.ts && this.activeModels.ts.compilerResults) {
                setTimeout(() => {
                    if (this.activeModels?.ts?.compilerResults) this.activeModels.ts.compilerResults.modelNeedCompile = true;
                    mls.editor.forceModelUpdate(model);
                }, 500)

            }
        }

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

        const mode: 'ts' | 'html' | 'style' | 'test' | 'defs' = this.modeToExt[this.mode];
        const keyViewState = `${activeModel.ts.storFile.project}_${activeModel.ts.storFile.shortName}`;
        if (!this.viewState[keyViewState]) {
            this.viewState[keyViewState] = {
                html: null,
                ts: null,
                style: null,
                test: null,
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
        const keyViewState = `${activeModel.ts.storFile.project}_${activeModel.ts.storFile.shortName}`;
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

        const mode: 'ts' | 'html' | 'style' | 'test' | 'defs' = this.modeToExt[this.mode];
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
            '.html': 'html',
            '.less': 'less',
            '.test.ts': 'typescript',
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
            1: '.html',
            2: '.less',
            3: '.test.ts',
            4: '.defs.ts',

        };
        const ext = obj[this.menu.tabs.selected];
        const keyToFile = mls.stor.getKeyToFiles(project, 2, shortName, folder, ext);
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
        const { shortName, project } = this.activeModels.ts.storFile;

        const div = document.createElement('div');
        const scr = document.createElement('script');
        const i2 = `/_${this.baseProject}_${'mlsHistoryList'}`;
        scr.type = 'module';
        scr.id = i2.replace('/', '');
        scr.src = i2;
        div.appendChild(scr);
        const obj: { [key: number]: string } = {
            0: '.ts',
            1: '.html',
            2: '.less',
            3: '.test.ts',
            4: '.defs.ts',

        };

        const wc = document.createElement('mls-history-list-100554');
        wc.setAttribute('project', project.toString());
        wc.setAttribute('shortName', shortName);
        wc.setAttribute('level', '2');
        if (this.menu.tabs.selected !== undefined) wc.setAttribute('extension', obj[this.menu.tabs.selected]);
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
        const offset = position - 1;
        const model: monaco.editor.ITextModel | undefined = mls.editor.editors[editorPosition]?.ts?.model;
        if (!model) return;
        const { lineNumber, column } = model.getPositionAt(offset);
        this._ed1.revealPositionInCenter({ lineNumber, column }, monaco.editor.ScrollType.Immediate);
        const lineLength = model.getLineContent(lineNumber).length + 1;
        const range = new monaco.Range(lineNumber, column, lineNumber, lineLength);
        this._ed1.setSelection(new monaco.Selection(range.startLineNumber, 0, range.startLineNumber, lineLength));
    }

    private mapExt: Record<string, keyof typeof mls.editor.models[string]> = {
        '.ts': 'ts',
        '.html': 'html',
        '.less': 'style',
        '.test.ts': 'test',
        '.defs.ts': 'defs'
    };

    private onMLSEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {

        if (ev.level !== 2 || (ev.type !== 'FileAction')) return;
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
            const pageActual = this.getActualL2File();
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
            const keyModel = mls.editor.getKeyModel(fileAction.project, fileAction.shortName, fileAction.folder);
            const models = mls.editor.models[keyModel];
            const prop = this.mapExt[fileAction.extension];
            if (!models || !models[prop]) this.setError('[onEditorEvents] Not found model');
            await this.fireEditorEvents(models[prop] as mls.editor.IModelBase, prop);
            this.loading = false;
        };

        const onUpdatedOnServer = async (): Promise<void> => {

        };

        if (mls.istrace) console.time('onAction_' + fileAction.action + '_' + fileAction.position);

        await this.initMonaco(); // init if needed
        switch (fileAction.action as any) {
            case 'open': await onOpen(); break;
            case 'editorEvents': await onEditorEvents(); break;
            case 'updatedOnServer': await onUpdatedOnServer(); break;
            default: {
                // console.error('invalid action: ' + fileAction.action);
            }
        }
        if (mls.istrace) console.timeEnd('onAction_' + fileAction.action + '_' + fileAction.position);
    }

    private async lessChangedEditor(ev: mls.events.IEvent): Promise<void> {

        if (!ev.desc || ev.level !== 2) return;

        const info = JSON.parse(ev.desc);
        if (info.position !== this.position) return;

        const keyModel = mls.editor.getKeyModel(info.storFile.project, info.storFile.shortName, info.storFile.folder);
        const models = mls.editor.models[keyModel];
        if (!models || !models.style) this.setError('[lessChangedEditor] Not found model');

        const lastemitter = getState(`less.${info.position}.emitter`) || 'editor';

        if (this.lessCSS && this._ed1) {
            const uri = this.getUri(info.storFile, '.less');
            const lastSelector = this.lessCSS.selector;
            this.lessCSS = new LessCSS(uri.toString(), this._ed1, info.position as 'left' | 'right');
            this.lessCSS.setEditor(this._ed1);
            this.lessCSS.setSelector(lastSelector);
            const monacoPosition = this._ed1.getPosition();
            if (!monacoPosition) return;
            const lineContent = models?.ts?.model.getLineContent(monacoPosition.lineNumber);
            this.lessCSS.setStateByLine(monacoPosition.lineNumber, lineContent || '', lastemitter);
        }

    }

    private async fireEditorEvents(modelBase: mls.editor.IModelBase, mode: "html" | "defs" | "ts" | "style" | "test"): Promise<void> {

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

            const storFiles = await mls.stor.getFiles({ project: storFileBase.project, shortName: storFileBase.shortName, folder: storFileBase.folder, loadContent: true, });

            let fileModels = mls.editor.getModels(storFileBase.project, storFileBase.shortName, storFileBase.folder);

            [storFiles.ts, storFiles.html, storFiles.less, storFiles.test, storFiles.defs].forEach((storF) => {
                if (storF && !storF.inLocalStorage && storF.isLocalVersionOutdated) storF.isLocalVersionOutdated = false;
            });

            if (storFiles.ts) this.saveLocalStorageLastOpen(storFiles.ts, position);

            if (fileModels && fileModels.ts) mls.editor.forceModelUpdate(fileModels.ts.model);

            this.activeModels = fileModels;
            mls.editor.editors[this.position] = fileModels;
            this.showActiveModel();
            if (!this._ed1) return;
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
        this.initProviders(modelBase);
        this.restaureViewState();
        this.updatedMSizeEditor();
    }

    private initProviders(modelBase: mls.editor.IModelBase) {

        if (!modelBase) return;
        const uri = this.getUri(modelBase.storFile, modelBase.storFile.extension as any);
        switch (modelBase.storFile.extension) {
            case ('.less'):
                this.initModelStyle(uri, modelBase.model);
                break;
            case ('.html'):
                this.registerProviderHTML();
                break;
            default: '';
        }

    }

    private async initModelStyle(uri: monaco.Uri, model: monaco.editor.ITextModel) {

        if (!this._ed1) return;
        console.info('initModelStyle', this.position);
        this.lessCSS = new LessCSS(uri.toString(), this._ed1, this.position);
        this.lessCSS.setEditor(this._ed1);
        const actualLine = this._ed1.getPosition();
        const lineNumber = this.lessCSS.lessAST.findFirstSelectorAfterRoot(this.lessCSS.lessAST.ast);
        if (lineNumber && actualLine && actualLine.lineNumber === 1) {
            const line = model.getLineContent(lineNumber)
            this._ed1.setSelection(
                new monaco.Selection(lineNumber, 1, lineNumber, line.length + 1)
            );
            const enhancementInstanceLess = await import('./_100554_enhancementStyle')
            if (enhancementInstanceLess && this.activeModels) await enhancementInstanceLess.onAfterChange(this.activeModels);
        }

    }

    private showActiveModel(): boolean {

        if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.storFile) return false;
        const { shortName, project, status } = this.activeModels.ts.storFile;

        const model = this.activeModels.ts.model;
        mls.editor.editors[this.position] = this.activeModels;

        if (model.isDisposed()) return false;

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
        this.loadMonacoThemeFromLocalStorage();
        this.updateMonacoGlobalTheme();
        mls.editor.InitMonaco();
    }

    private timeHtmlChangeCursor: number = 0;
    private lastIdSelected: string | null = null;
    private lastLineNumber: number | null = null;
    private async initMonaco_Editor(): Promise<void> {

        const addEventsEditor = () => {
            if (!this._ed1) return;
            this._ed1.onDidFocusEditorWidget(() => {
                if (!this.menu.tabs) return '';
                if (this.menu.tabs.selected === EToolsSource.icHTML) return;
                mls.editor.setActiveInstance(this.level, this.position);
            });

            this._ed1.onDidChangeModelContent(() => {
                if (this._ed1) this.highlightReviewLines(this._ed1);
            });


            this._ed1.onDidChangeCursorPosition((e) => {

                const currentLineNumber = e.position.lineNumber;
                if (currentLineNumber === this.lastLineNumber) return;
                this.lastLineNumber = currentLineNumber;

                this._ed1?.updateOptions({ readOnly: false });
                clearTimeout(this.timeHtmlChangeCursor);
                if (!this._ed1 || !this.menu.tabs) return;
                const model = this._ed1.getModel();

                if (this.menu.tabs.selected === EToolsSource.icStyle) {
                    const position = e.position;
                    const { lineNumber } = position;
                    const isReadOnlyArea = this.isReadOnlyArea(lineNumber);
                    this._ed1.updateOptions({ readOnly: isReadOnlyArea });
                    if (!isReadOnlyArea) {
                        if (this.lessCSS && this.lessCSS.setStateByLine && typeof this.lessCSS.setStateByLine === 'function') {
                            const content = model?.getLineContent(lineNumber) || '';
                            setTimeout(() => {
                                this.lessCSS?.setStateByLine(lineNumber, content, 'editor');
                            }, 100);
                        }
                    }
                    return;
                }


                if (!this._ed1 || this.menu.tabs.selected !== EToolsSource.icHTML) return;
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

            monaco.editor.onDidChangeMarkers(async (uris) => {
                if (this.mode !== 'icStyle' || !this.activeModels || !this.activeModels.style) return;
                const uriActual = this.activeModels.style.model.uri.toString();
                if (uris.some(uri => uri.toString() === uriActual)) {
                    const enhancementInstanceLess = await import('./_100554_enhancementStyle');
                    if (enhancementInstanceLess && this.activeModels) await enhancementInstanceLess.onAfterMarkersChange(this.activeModels);
                }
            });
        };

        if (!this.editorEl) return;

        this._ed1 = monaco.editor.create(this.editorEl, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);

        (this.editorEl as any)['mlsEditor'] = this._ed1;
        mls.editor.instances[this.confE] = this._ed1;
        mls.editor.InitEditor(this._ed1);
        addEventsEditor();

        //this.createModelTS_loading();
        await this.createModelConf('// loading ...'); // model 
        // global routines dont need this._ed1
        //await this.createModelTS_testFile();
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

    private updateActionBasedOnError(mode: 'ts' | 'html' | 'style' | 'defs' | 'test', modelId: string | undefined) {

        if (this._ed1?.getModel()?.id !== modelId) return;
        if (!this._ed1) return;
        if (!this.activeModels) return;
        this.removeFixAction();

        if (mode === 'test' || mode === 'defs') return;

        const markers = this.activeModels[mode] ? monaco.editor.getModelMarkers({ resource: this.activeModels[mode]?.model.uri }) : [];
        const markersErrors = markers.some(marker => marker.severity === monaco.MarkerSeverity.Error);
        let compileErrors: boolean = false;

        if (mode === 'ts') {
            compileErrors = ((this.activeModels.ts?.compilerResults?.errors?.length || 0) > 0)
        } else if (mode === 'style') {
            compileErrors = ((this.activeModels.style?.styleResults?.errors?.length || 0) > 0)
        }

        let hasErrors = compileErrors || markersErrors;
        if (hasErrors) {
            this.addFixAction();
        }

    }

    private getActualL2File() {
        if (!mls.actual[2] || !(mls.actual[2] as any)[this.position]) return;
        const actual = (mls.actual[2] as any)[this.position];
        const { project, shortName } = actual;
        if (!project || !shortName) return;
        const page = `_${project}_${shortName}`
        return page;
    }


    private async fireAgentFix() {

        const page = this.getActualL2File();
        if (!page) return;
        const pref = loadChatPreferences();

        const modeBy = {
            'icTs': 'typescript',
            'icHTML': 'html',
            'icStyle': 'less',
            'icTest': '',
            'icDefs': '',
        }

        const data = { page, prompt: 'Fix errors in files', position: this.position, mode: modeBy[this.mode] }
        if (!pref.threadMaintenance) {
            this.setError('Please configure your maintenance thread at: CollabMessage > Settings > Chat Preferences');
            return;
        }

        const userId = getUserIdLocalStorage();
        const threadId = pref.threadMaintenance;
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

    private getUri(storFile:mls.stor.IFileInfo, ftype: '.ts' | '.d.ts' | '.html' | '.less' | '.test.ts' | '.defs.ts'): monaco.Uri {
        return monaco.Uri.parse(`file://server/_${storFile.project}_${storFile.folder ? storFile.folder + '_' : ''}${storFile.shortName}${ftype}`);
    }

    private async createModel(project: number, shortName: string, ext: '.ts' | '.d.ts' | '.html' | '.less' | '.test.ts' | '.defs.ts', content?: string): Promise<mls.editor.IModelBase | undefined> {

        try {

            let src: string | Blob | null | undefined = undefined;
            let haveInfo: boolean = false;
            let info: mls.stor.IFileInfoValue | null = null;
            let storFile: mls.stor.IFileInfo | undefined;

            if (ext !== '.d.ts') {
                const keyToFile = mls.stor.getKeyToFiles(project, 2, shortName, '', ext);
                storFile = mls.stor.files[keyToFile];
                if (!storFile) throw new Error(`Invalid file: ${ext}`);
                if (storFile.project !== 0) {
                    info = storFile.getValueInfo ? await storFile.getValueInfo() : null;
                    haveInfo = !!info && !!info.content;
                }
                if (!content) {
                    src = haveInfo ? info?.content : await storFile.getContent();
                } else src = content;

            } else {
                src = content || '';
            }

            if (src instanceof Blob) throw new Error(`${ext} file must be string`);
            if (!src) throw new Error(`${ext} file is undefined`);

            let originalCRC = haveInfo ? info?.originalCRC : mls.common.crc.crc32(src).toString(16);

            if (ext === '.less') {
                originalCRC = mls.common.crc.crc32(removeTokensFromSource(src)).toString(16)
            }

            const originalProject: number | undefined = haveInfo ? info?.originalProject : undefined;
            const originalShortName: string | undefined = haveInfo ? info?.originalShortName : undefined;

            let model: mls.editor.IModelBase | undefined;
            if (ext === '.html' && storFile) model = mls.editor.createModelHTML(storFile, src);
            else if (ext === '.ts' && storFile) model = mls.editor.createModelTS(storFile, src);
            else if (ext === '.test.ts' && storFile) model = mls.editor.createModelTest(storFile, src);
            else if (ext === '.defs.ts' && storFile) model = mls.editor.createModelDefs(storFile, src);

            else if (ext === '.d.ts') model = mls.editor.createModelProjectDefinition(project, src);
            else if (ext === '.less' && storFile) {
                const lessTokens = await getTokensLess(project, 'Default');
                const lineTokens = `\n\n//Start Less Tokens\n${lessTokens}\n//End Less Tokens\n`;
                src = removeTokensFromSource(src);
                src = src.trim().concat(lineTokens);
                model = mls.editor.createModelStyle(storFile, src);
            }

            if (!model) throw new Error(`Model invalid`);
            if (ext !== '.d.ts') {
                model.originalCRC = originalCRC;
                model.originalProject = originalProject;
                model.originalShortName = originalShortName;
            }

            (model as any).needFormat = true;
            return model;
        } catch (e: any) {
            this.setError(e.message);
        }
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

    private getActualTheme(): 'dark' | 'light' {
        const html = this.closest('html');
        if (!html) return 'light';
        const dataTheme = html.getAttribute('data-theme') as 'dark' | 'light' | null;
        return dataTheme || 'light';
    }

    private loadMonacoThemeFromLocalStorage(): void {
        const info = this.getLocalStorageInfo();
        const theme = this.getActualTheme();
        if (!mls.editor.themeName) mls.editor.setThemeName(info.confTheme[theme]);
    }

    private saveMonacoGlobalThemeToLS(): void {
        const info = this.getLocalStorageInfo();
        const theme = this.getActualTheme();
        info.confTheme[theme] = mls.editor.themeName;
        this.saveLocalStorageInfo(info);

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


    private _formatIfNeeded(model: FormattableModel) {
        if (model.needFormat && this._ed1) {
            this.formatMonaco();
            model.needFormat = false;
        }
    }

    private getPosition(modeIld: string, tp: 'ts' | 'html' | 'defs' | 'style' | 'test'): 'left' | 'right' | 'all' {
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
        this.editorEl?.setAttribute('msize', this.msize);
        this.editorHistoryEl?.setAttribute('msize', this.msize);
    }

    private toogleIconsError(position: 'left' | 'right' | 'all') {
        const servicesToChange: ServiceSource100554[] = [];

        if (position === 'all') {
            const serviceL: ServiceSource100554 = mls.services[`${'100554_serviceSource'}_right`];
            const serviceR: ServiceSource100554 = mls.services[`${'100554_serviceSource'}_left`];
            if (serviceL) servicesToChange.push(serviceL);
            if (serviceR) servicesToChange.push(serviceR);
        }
        else {
            const service: ServiceSource100554 = mls.services[`${'100554_serviceSource'}_${position}`];
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
        const lastL2 = lastOpenedFile[2] as OpenedFileL2;
        if (!lastL2) {
            this.openService('_100554_serviceProject', position, this.level)
            return;
        }
        const lastL2ByPosition = lastL2[position];

        if (!lastL2ByPosition) return;
        const { project, shortName, folder } = mls.l2.getPath(lastL2ByPosition);
        const keyStorFile = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');
        const storFile = mls.stor.files[keyStorFile];
        if (!storFile) return;
        let models = mls.editor.getModels(project, shortName, folder);
        if (!models) {
            models = await createAllModels(storFile)
        }
        if (!models) return;

        this.activeModels = models;
        await readProjectTypescriptAndCompile(actualProject, '', true)
        if (models && models.ts) mls.editor.forceModelUpdate(models.ts.model);
        this.loading = false;
        this.showActiveModel();

    }

    public getActualRef(): string {
        if (!this.menu.tabs) return '';
        try {
            let ret = '';
            if (!mls.actual[2] || !(mls.actual[2] as any)[this.position]) return ret;
            const actual = (mls.actual[2] as any)[this.position];
            const ext = this.menu.tabs.selected === EToolsSource.icTs ? '.ts' : '.html';
            if (!actual) return ret;
            ret = mls.stor.getKeyToFiles(actual.project, 2, actual.shortName, actual.folder, ext);
            return ret;

        } catch (e) {
            return '';
        }

    }


    //--------------WidgetAction--------------

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
            default:
                console.info('Erro: opção invalida');
        }
    }

    private selectLineinHTML(line: number, origin: 'preview' | 'editor') {
        if (!this.menu.tabs) return;
        if (this.menu.tabs.selected !== EToolsSource.icHTML || !this._ed1) return;
        this.lastOrigin = origin;
        if (origin === 'editor') return;
        this.goToLine(line);
    }

    private registerProviderHTML() {
        monaco.languages.registerDocumentFormattingEditProvider('html', {
            provideDocumentFormattingEdits: async (model) => {
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



    // Ica States

    handleIcaStateChange(_key: string, _value: any) {

        const keyState = `serviceSource.${this.position}`;
        if (!_key.startsWith(keyState)) return;

        if (_key === `${keyState}.selectedMode` && ['icTs', 'icStyle', 'icHTML', 'icTest', 'History'].includes(_value)) {
            this.changeMode(_value);
        }

        if (_key === `${keyState}.lockMap` && _value) {
            const pageActual = this.getActualL2File();
            if (pageActual) {
                const isLocked = this.isEditorLocked(pageActual);
                if (isLocked) this.lockEditorForFile(pageActual);
                else this.unlockEditorForFile(pageActual);
                this.toogleOverlayLoading(isLocked, 'Executing agent Fix...');
            }
        }
    }

    // Lit rendering

    updated(changedProperties: any) {
        super.updated(changedProperties);
        if (changedProperties.has('msize')) {
            const [w, h, t, l] = this.msize.split(',');
            if (w) this.panelRightOpened = (+w) >= this.MINWIDTHTPANELRIGHT;
            if (!this.visible) return;
            this.updatedMSizeEditor();
        }
    }

    connectedCallback() {

        initState('less', {
            left: {},
            right: {}
        });

        initState('serviceSource', {
            left: {
                selectedMode: 'icTS',
                historyLanguage: 'typescript',
                service: mls.services['100554_serviceSource_left'],
                lockMap: new Map<string, boolean>()
            },
            right: {
                selectedMode: 'icTS',
                historyLanguage: 'typescript',
                service: mls.services['100554_serviceSource_right'],
                lockMap: new Map<string, boolean>()
            },
        });

        this.setAttribute('selectedMode', `{{serviceSource.${this.position}.selectedMode}}`);
        this.setAttribute('historyLanguage', `{{serviceSource.${this.position}.historyLanguage}}`);
        this.setAttribute('lockMap', `{{serviceSource.${this.position}.lockMap}}`);
        super.connectedCallback();

    }

    firstUpdated(changedProperties: any) {
        super.firstUpdated(changedProperties);
        this.registerProviderHTML();
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        this.style.display = 'block';
        return html`
             <div class="overlay-loading"> <span>${this.textOverlayLoading} <span class="loader"></span> </span> </div>
             <collab-spliter-vertical-var-fixed-100554 msize=${this.msize} withresize="false" fixedheight="100" complementcolor="#1e1e1e">
                <collab-spliter-horizontal-var-fixed-100554
                    slot="top"
                    complementcolor="#1e1e1e"
                    fixedwidth="30%"
                    fixedvisible=${this.mode !== 'icStyle' || this.isModeHistory ? 'hidden' : `${this.panelRightOpened === true ? 'visible' : 'closed'}`} 
                >
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
    'icHTML' = 1,
    'icStyle' = 2,
    'icTest' = 3,
    'icDefs' = 4,
}

export type FormattableModel = monaco.editor.ITextModel & { needFormat: boolean };

interface IViewState {
    [file: string]: IViewStates
}

interface IViewStates {
    ts: monaco.editor.ICodeEditorViewState | null,
    html: monaco.editor.ICodeEditorViewState | null,
    style: monaco.editor.ICodeEditorViewState | null,
    test: monaco.editor.ICodeEditorViewState | null,
    defs: monaco.editor.ICodeEditorViewState | null,

}

interface ILocalStorageServiceSource {
    confTheme: { dark: string, light: string },
    confEditor: string,
    lastOpened: {
        [key: string]: { extension: string, folder: string, level: number, project: number, shortName: string }
    }
}

type IModes = 'icTs' | 'icStyle' | 'icHTML' | 'icTest' | 'icDefs';
type TExtensions = '.ts' | '.d.ts' | '.html' | '.less' | '.test.ts' | '.defs.ts'
type IModesH = 'History';