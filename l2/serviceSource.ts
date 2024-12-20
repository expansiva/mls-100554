/// <mls shortName="serviceSource" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit'
import { ServiceBase, IService, IToolbarContent, IMenu, IMenuTitle } from './_100554_serviceBase';
import { getEventName } from './_100554_collabPageElement'
import { formatHtml, sync } from './_100554_collabDOMSync';
import { removeTokensFromSource, getTokensLess } from './_100554_enhancementStyle';
import { LessCSS } from "./_100554_lessCSS";
import { getEnhancementName } from './_100554_libCommom';
import './_100554_collabSpliterVerticalVarFixed';
import './_100554_collabSpliterHorizontalVarFixed';
import './_100554_aimPromptTypescript';
import './_100554_cssHelperIndex';
import { globalState } from './_100554_icaState';
import { propertyDataSource } from './_100554_icaLitElement';

/// **collab_i18n_start**
const message_pt = {
    historyOpen: 'Abrir histórico',
    historyClose: 'Fechar histórico',
}

const message_en = {
    historyOpen: 'Open history',
    historyClose: 'Close history',
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
        mls.events.addListener(2, 'ProjectLoaded', (ev) => this.onProjectLoadedEvents(ev));
        mls.events.addListener(2, 'DomAction', (ev) => this.syncDom(ev));
        mls.events.addListener(2, 'CreateModelHTML' as any, (ev) => this.checkToCreateModelHTML(ev));
        this.initMonaco_GlobalEditor();
    }

    @property({ type: String }) msize = '';
    @property({ type: Boolean }) panelRightOpened = false;
    @property({ type: String }) activeModels: mls.editor.IModels | undefined;
    @property() isModeHistory: boolean = false;
    @property({ type: String }) mode: IModes = 'icTs';

    @property({ type: String }) currentHistorySourceWithoutSave: string | undefined;
    @property({ type: String }) previousHistorySourceWithoutSave: string | undefined;

    @propertyDataSource({ type: String }) currentHistorySource: string | undefined;
    @propertyDataSource({ type: String }) previousHistorySource: string | undefined;
    @propertyDataSource({ type: String }) historyLanguage: 'typescript' | 'html' | 'less' = 'typescript';
    @propertyDataSource({ type: String }) selectedMode: 'icTs' | 'icStyle' | 'icHTML' | 'btHistory' | undefined;

    private MINWIDTHTPANELRIGHT = 500;
    private lessCSS: LessCSS | undefined;
    private viewState: IViewState = {};
    private msg: MessageType = messages['en'];

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
        this.saveViewState();
        this.mode = op as IModes;
        this.selectedMode = op as IModes;

        if (this.isModeHistory && this.menu.selectButton) this.menu.selectButton('btHistory');
        if (op === 'icTs') this.showActiveModel();
        if (op === 'icHTML') {
            if (!this.activeModels || !this.activeModels.html || !this.activeModels.html.storFile) return;
            this.createOrShowModelHtmlOrCss(this.activeModels.html.storFile.shortName, this.activeModels.html.storFile.project, true, '.html');
        }
        if (op === 'icStyle') {
            if (!this.activeModels || !this.activeModels.html || !this.activeModels.html.storFile) return;
            this.createOrShowModelHtmlOrCss(this.activeModels.html.storFile.shortName, this.activeModels.html.storFile.project, true, '.less');
        }
    }

    public onClickTitle = () => {
        this.openService('_100554_serviceProject', this.position, 2, { activeTab: 'Explore' });
    }

    public onClickButton = (op: string, opMenu?: string): boolean => {
        if (op === 'btHistory') return this.toogleHistory();
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
        buttons: {
            btHistory: `${this.msg.historyOpen};${this.msg.historyClose};f017;f057`,
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
        onClickTitle: this.onClickTitle,
        onClickButton: this.onClickButton

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
        if (this.menu.setIconActive) this.menu.setIconActive('icTs');
        this.setValueInModelInSpecificLine(val, line);
    }

    public setEditorValueByLineHtml(val: string, line: number) {
        if (!this._ed1) return false;
        if (!this.activeModels || !this.activeModels.html || !this.activeModels.html.model) return false;
        if (this.menu.setIconActive) this.menu.setIconActive('icHTML');
        this.setValueInModelInSpecificLine(val, line);
    }

    public replaceEditorLineHTML(val: string, line: number) {
        if (!this._ed1) return false;
        if (!this.activeModels || !this.activeModels.html || !this.activeModels.html.model) return false;
        if (this.menu.setIconActive) this.menu.setIconActive('icHTML');
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

    @query('mls-editor-100529') private editorEl: HTMLElement | undefined;
    @query('mls-editor-100529.history') private editorHistoryEl: HTMLElement | undefined;

    @query('collab-spliter-vertical-var-fixed-100554') private verticalSpliter: HTMLElement | undefined;
    @query('collab-spliter-horizontal-var-fixed-100554') private horizontalSpliter: HTMLElement | undefined;

    public last: mls.IActual | undefined = undefined;
    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;
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
        const obj: { [key: string]: 'ts' | 'html' | 'style' } = {
            icTs: 'ts',
            icHTML: 'html',
            icStyle: 'style',
        };
        const mode: 'ts' | 'html' | 'style' = obj[this.mode];
        const keyViewState = `${activeModel.ts.storFile.project}_${activeModel.ts.storFile.shortName}`;
        if (!this.viewState[keyViewState]) {
            this.viewState[keyViewState] = {
                html: null,
                ts: null,
                style: null,
            }
        }
        this.viewState[keyViewState][mode] = this._ed1.saveViewState();
    }

    private restaureViewState() {
        const activeModel = this.activeModels;
        if (!activeModel) return;
        if (!this._ed1 || !this.mode || !activeModel || !activeModel.ts) return;
        const obj: { [key: string]: 'ts' | 'html' | 'style' } = {
            icTs: 'ts',
            icHTML: 'html',
            icStyle: 'style',
        };
        const mode: 'ts' | 'html' | 'style' = obj[this.mode];
        const keyViewState = `${activeModel.ts.storFile.project}_${activeModel.ts.storFile.shortName}`;
        if (this.viewState[keyViewState] && this.viewState[keyViewState][mode]) this._ed1.restoreViewState(this.viewState[keyViewState][mode]);
    }

    private toogleHistory(): boolean {
        this.isModeHistory = !this.isModeHistory;
        this.updatedMSizeEditor();
        if (!this.isModeHistory) {
            if (this.menu && this.menu.setIconActive) this.menu.setIconActive(this.mode);
        } else {
            this.getHistories();
        }
        return !this.isModeHistory;
    }


    private async getHistories() {

        if (this.previousHistorySource || this.currentHistorySource) {
            this.setHistories(this.previousHistorySource || '', this.currentHistorySource || '', this.historyLanguage);
            return;
        }

        this.setHistories('Loading...', '', 'text');

        const obj: { [key: string]: 'ts' | 'html' | 'style' } = {
            icTs: 'ts',
            icHTML: 'html',
            icStyle: 'style',
        };
        const mode: 'ts' | 'html' | 'style' = obj[this.mode];
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
        }
        this.setHistories(this.previousHistorySourceWithoutSave || '', this.currentHistorySourceWithoutSave || '', editorType[storFile.extension]);
    }

    private openRepo() {
        if (!this.menu.lastIcon) return false;
        if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.storFile) return false;

        const { shortName, project } = this.activeModels.ts.storFile;
        const obj: { [key: string]: string } = {
            icTs: '.ts',
            icHTML: '.html',
            icStyle: '.less',
        };
        const ext = obj[this.menu.lastIcon];
        const keyToFile = mls.stor.getKeyToFiles(project, 2, shortName, '', ext);
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
        if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.storFile) return;
        const { shortName, project } = this.activeModels.ts.storFile;

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
        const promises: Promise<mls.editor.IModels>[] = [];
        const keys: string[] = Object.keys(mls.stor.files);

        if ((window as any).traceLivecicle) console.info('creating: files model ', project);

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

        if (needCompile) {
            // await mls.l2.editor.compileAllProjectIfNeed(project, true);
            //await mls.l2.typescript.compileAll(project);
        }
    }

    private async createProjectModel(project: number, contentTS: string): Promise<mls.editor.IModels> {

        let projectModel = mls.editor.getModels(project, '');
        if (projectModel && projectModel.ts) return projectModel;
        const ftype = ".d.ts";
        const modelsBase = await this.createModel(project, '', ftype, contentTS)
        if (!modelsBase) throw new Error(`invalid mls.editor.models for file: _${project}_.d.ts`);
        return projectModel as mls.editor.IModels;

    }

    private async deleteFile(storFile: mls.stor.IFileInfo) {
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        mls.editor.deleteModels(storFile.project, storFile.shortName, true);
        this.removeEventsStorFile(storFile);
        const keyFiles = mls.stor.getKeyToFiles(storFile.project, storFile.level, storFile.shortName, storFile.folder, storFile.extension);
        delete mls.stor.files[keyFiles];
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

    private addEventsModelTS(storFile: mls.stor.IFileInfo, model1: mls.editor.IModelTS): void {

        storFile.onAction = (action: mls.stor.IFileInfoAction) => this.afterUpdate(storFile);
        storFile.getValueInfo = () => this.getValueInfo(model1);
        model1.model.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => this.onModelChange(e, model1, storFile));
    }

    private removeEventsStorFile(storFile: mls.stor.IFileInfo): void {
        storFile.onAction = undefined;
        storFile.getValueInfo = undefined;
    }

    private _onChangedContent: number | undefined = undefined;

    private onModelChange = (e: monaco.editor.IModelContentChangedEvent, activeModel: mls.editor.IModelTS, storFile: mls.stor.IFileInfo): void => {
        // some changes is to simulate changes to force compile

        clearTimeout(this._onChangedContent);
        this._onChangedContent = window.setTimeout(async () => {
            await this.updateModelStatus(activeModel, true);
            const ignoreChanges = (e.changes.length === 1 && e.changes[0].range.startLineNumber === 1 && e.changes[0].range.endLineNumber === 1 && e.changes[0].range.endColumn <= 2);
            if (ignoreChanges) return;
        }, 400);
    };

    private getValueInfo = async (activeModel: mls.editor.IModelTS): Promise<mls.stor.IFileInfoValue> => {
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
        const offset = position - 1;
        const model: monaco.editor.ITextModel | undefined = mls.editor.editors[editorPosition]?.ts?.model;
        if (!model) return;
        const { lineNumber, column } = model.getPositionAt(offset);
        this._ed1.revealPositionInCenter({ lineNumber, column }, monaco.editor.ScrollType.Immediate);
        const lineLength = model.getLineContent(lineNumber).length + 1;
        const range = new monaco.Range(lineNumber, column, lineNumber, lineLength);
        this._ed1.setSelection(new monaco.Selection(range.startLineNumber, 0, range.startLineNumber, lineLength));
    }

    private onProjectLoadedEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {
        if (ev.level !== this.level) return;
        if (!ev.desc) return;
        if (this.position === 'right') return;
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
            mls.events.fireFileAction('statusOrErrorChanged', storFile, this.position);
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
            await this.renameFiles(storFile, fileAction.newProject as number, fileAction.newshortName as string, fileAction);
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
        const modelTS = await this.createModelTS1(newShortName as string, newProject as number,
            newTSSource, true);
        await this.createOrShowModelHtmlOrCss(newShortName, newProject, false, '.html');
        await this.createOrShowModelHtmlOrCss(newShortName, newProject, false, '.less');
        this.showActiveModel();
        await mls.stor.localStor.setContent(modelTS.storFile, await this.getValueInfo(modelTS));
        this.isNewFile = false;
    }

    private async openFiles(storFileHTML: mls.stor.IFileInfo | undefined, storFileTS: mls.stor.IFileInfo, storFileCss: mls.stor.IFileInfo | undefined, position: 'left' | 'right') {

        await this.createModelTS_loading();
        this.activeThisService();
        this.closeMenu();

        let fileModels = mls.editor.getModels(storFileTS.project, storFileTS.shortName);


        if (!fileModels) {
            await this.createModelTS2(storFileTS, true, true);
            fileModels = mls.editor.getModels(storFileTS.project, storFileTS.shortName);
            if (!fileModels) console.info('No file models');
            this.activeModels = fileModels;
            mls.editor.editors[this.position] = fileModels;
            this.showActiveModel();
            await this.readProjectTypescriptAndCompile(storFileTS.project, storFileTS.shortName, true);
        } else {
            this.activeModels = fileModels;
            mls.editor.editors[this.position] = fileModels;
            const modelTs = this.activeModels.ts?.model;
            if (!modelTs) throw new Error('Invalid model TS');
            mls.editor.forceModelUpdate(modelTs);
            this.showActiveModel();
        }

        [storFileCss, storFileTS, storFileHTML].forEach((storF) => {
            if (storF && !storF.inLocalStorage && storF.isLocalVersionOutdated) storF.isLocalVersionOutdated = false;
        });

        this.saveLocalStorageLastOpen(storFileTS, position);
        if (!this._ed1) return;
        this.restaureViewState();
    }


    private async renameFiles(storFileTS: mls.stor.IFileInfo, newProject: number, newShortName: string, oldFileAction: mls.events.IFileAction) {

        await this.createModelTS_loading();
        this.activeThisService();

        let fileModels = mls.editor.getModels(storFileTS.project, storFileTS.shortName);
        if (!fileModels) fileModels = await this.createModelTS2(storFileTS, false, true);

        this.renameAllFiles(fileModels, newProject, newShortName);
        this.activeModels = fileModels;

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
        // try {

        //     const keys = Object.keys(mls.stor.files);
        //     const arr: mls.stor.IFileInfo[] = [];
        //     let needMsg = false;
        //     keys.forEach((key) => {
        //         const f = mls.stor.files[key];
        //         if (!f) return;
        //         if (f.inLocalStorage || !f.isLocalVersionOutdated) return;
        //         arr.push(f);
        //     });

        //     await mls.l2.editor.compileAllProjectIfNeed(mls.actual[5].project as number, true, false);
        //     for await (const storFile of arr) {
        //         mls.l2.editor.remove(storFile);
        //         this.removeEventsStorFile(storFile);
        //         await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        //         await this.createModelTS2(storFile, false, true);
        //         if (storFile.project === 100554) needMsg = true;
        //     }

        //     if (needMsg) {
        //         // window.collabMessages.add("Files changed in server , please use F5 to reload", 'information', { autoClose: false, clearOnClose: false });
        //     }

        // } catch (e) {
        //     console.info('Erro service source: onUpdatedOnServer')
        // }
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
                mls.editor.deleteModels(data.storFile.project, data.storFile.shortName, true);
            }

            this.removeEventsStorFile(data.storFile);
            await mls.stor.localStor.setContent(data.storFile, { contentType: 'string', content: null });

            if (data.storFile.status === 'new') {
                delete mls.stor.files[data.keyFiles];
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
        // mls.events.fireFileAction('statusOrErrorChanged', storFileTS, this.position);

    }

    private activeThisService(): void {
        this.openMe();
        mls.editor.setActiveInstance(this.level, this.position);
    }

    private closeMenu() {
        if (this.menu.closeMenu) this.menu.closeMenu()
    }

    private async updateModelStatus(modelBaseTS: mls.editor.IModelTS, changed: boolean): Promise<void> {

        if (!modelBaseTS.storFile) throw new Error('Invalid stor file');
        const { project, shortName } = modelBaseTS.storFile;
        modelBaseTS.storFile.hasError = false;
        const ok = await mls.l2.typescript.compileAndPostProcess(modelBaseTS, true, true);

        let hasError = ok === false;
        if (!hasError && this.activeModels && this.activeModels.ts) {
            const enhacementName = await getEnhancementName({ project, shortName }).catch((e) => undefined);
            if (enhacementName) {
                const path = mls.l2.getPath(enhacementName);
                const enhancementInstance: mls.l2.enhancement.IEnhancementInstance | undefined = await mls.l2.enhancement.getEnhancementModule(path).catch((e) => undefined);
                if (enhancementInstance) await enhancementInstance.onAfterChange(this.activeModels.ts);
            }

            hasError = modelBaseTS.storFile.hasError;
        }

        await this.changeStatusFile(modelBaseTS, modelBaseTS.storFile, modelBaseTS.compilerResults?.tripleSlashMLS?.variables, hasError);
    }

    private async changeStatusFile(modelBaseTS: mls.editor.IModelTS, storFile: mls.stor.IFileInfo, variables: mls.common.tripleslash.ITripleSlashVariables | undefined, hasError: boolean): Promise<void> {

        if (!storFile) return; // new file dont have storFile ???
        storFile.hasError = hasError;
        const sameContent: boolean = modelBaseTS.originalCRC === mls.common.crc.crc32(modelBaseTS.model.getValue()).toString(16);
        if (sameContent) {
            if (storFile.status !== 'new') storFile.status = 'nochange';
            await mls.stor.localStor.setContent(storFile, { content: null }); // clear localstorage
        } else {
            if (storFile.status !== 'renamed' && (storFile.status !== 'new')) storFile.status = 'changed';
            await mls.stor.localStor.setContent(storFile, await this.getValueInfo(modelBaseTS));
        }


        if (storFile.status !== 'nochange') {
            let position: 'left' | 'right';
            const idLeft = mls.editor.editors.left?.ts?.model.id;
            const idActive = modelBaseTS.model.id
            if (idLeft === idActive) position = 'left';
            else position = 'right';
            mls.events.fireFileAction('statusOrErrorChanged', storFile, position);
        }
    }

    private async renameFile(models: mls.editor.IModelBase | undefined, newProject: number, newShortName: string) {

        if (!models || !models.storFile) return;
        const newSts: mls.cbe.IPath = { shortName: newShortName, project: newProject };

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

    private renameAllFiles(models: mls.editor.IModels, newProject: number, newShortName: string): void {

        const { html, style, ts } = models;
        if (!ts) throw new Error('Invalid ts file to rename');
        if (!ts.storFile) throw new Error('Invalid stor file to rename');

        if (ts.storFile.hasError) throw new Error('Error on rename, clear errors before rename');
        if (!this.isNewNameValid(newShortName)) throw new Error('Error on rename, new shortName is a invalid name');

        this.renameFile(html, newProject, newShortName);
        this.renameFile(style, newProject, newShortName);
        this.renameFile(ts, newProject, newShortName);
    }

    private isNewNameValid(newShortName: string): boolean {
        if (newShortName.length === 0 || newShortName.length > 255) return false;
        const invalidCharacters = /[_\/{}\t\[\]\*$@#=\-+!|?,<>=.;^~º°""''``áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/;
        return (!invalidCharacters.test(newShortName));
    }

    private showActiveModel(): boolean {

        if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.storFile) return false;
        const { shortName, project, status } = this.activeModels.ts.storFile;

        if (!(mls.actual[2] as any)[this.position]) {
            this.openLastFile(this.level, this.position);
        }

        const model = this.activeModels.ts.model;
        mls.editor.editors[this.position] = this.activeModels;

        if (!this._ed1 || !this.menu.getLastMode) return false;
        const changedFile: boolean = this.menu.title !== shortName;
        (this.menu.title as IMenuTitle).text = `_${project}_${shortName}`;
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

        // if (status === 'new') mls.events.fireFileAction('statusOrErrorChanged', this.activeModels.ts.storFile, this.position);

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
                const model = this._ed1.getModel();

                if (this.menu.lastIcon === 'icStyle') {
                    const position = e.position;
                    const { lineNumber } = position;
                    const isReadOnlyArea = this.isReadOnlyArea(lineNumber);
                    this._ed1.updateOptions({ readOnly: isReadOnlyArea });
                    if (!isReadOnlyArea) {
                        if (this.lessCSS && this.lessCSS.setStateByLine && typeof this.lessCSS.setStateByLine === 'function') {
                            const content = model?.getLineContent(lineNumber) || '';
                            this.lessCSS.setStateByLine(lineNumber, content, 'editor');
                        }
                    }
                    return;
                }

                if (!this._ed1 || this.menu.lastIcon !== 'icHTML') return;
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

        if (!this.editorEl) return;

        this._ed1 = monaco.editor.create(this.editorEl, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);

        (this.editorEl as any)['mlsEditor'] = this._ed1;
        mls.editor.instances[this.confE] = this._ed1;
        mls.editor.InitEditor(this._ed1);
        addEventsEditor();

        this.createModelTS_loading();
        this.createModelConf('// loading ...'); // model 
        // global routines dont need this._ed1
        await this.createModelTS_testFile();
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

        const { project, shortName } = storFile;
        let fileModels = mls.editor.getModels(project, shortName);

        if (!fileModels || !fileModels.ts) fileModels = await this.createModelTS2(storFile, false, true);
        let modelTS = fileModels.ts;
        if (!modelTS) throw new Error('Invalid models ts');

        let defaultTS = modelTS.model.getValue();

        const baseTag = convertFileNameToTag(`_${storFile.project}_${storFile.shortName}`)
        const newTag = convertFileNameToTag(`_${newProject}_${newShortName}`);
        const regex = new RegExp(baseTag, 'g');

        defaultTS = defaultTS.replace(regex, newTag);
        defaultTS = this.changeClassName(defaultTS, newProject, newShortName);

        modelTS = await this.createModelTS1(newShortName, newProject, defaultTS, true);
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

    private async createModelTS1(shortName: string, project: number, defaultTS: string, activateModel: boolean): Promise<mls.editor.IModelTS> {

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


    private async createModelTS2(storFile: mls.stor.IFileInfo, activedModel: boolean, compile: boolean): Promise<mls.editor.IModels> {
        // load source from repository
        const { project, shortName, extension } = storFile;

        let fileModels = mls.editor.getModels(project, shortName);
        if (fileModels && fileModels.ts && fileModels.html && fileModels.style) return fileModels;

        let modelTS: mls.editor.IModelTS | undefined;
        if (!fileModels || !fileModels.ts) modelTS = await this.createModel(project, shortName, '.ts');
        else modelTS = fileModels.ts;
        if (!modelTS) throw new Error(`invalid mls.editor.models for file: _${project}_${shortName}.ts`);
        this.addEventsModelTS(storFile, modelTS);

        const extFiles: Array<'.html' | '.less'> = ['.html', '.less'];
        for await (let ext of extFiles) {
            const keyFile1 = mls.stor.getKeyToFiles(storFile.project, 2, storFile.shortName, '', ext);
            let storFile1 = mls.stor.files[keyFile1];
            if (!storFile1) storFile1 = await this.createOrShowModelHtmlOrCss(shortName, project, false, ext);
            await this.getOrCreateModelHtmlOrCss(storFile1);
        }

        if (compile) await this.updateModelStatus(modelTS, false);

        fileModels = mls.editor.getModels(project, shortName);
        if (activedModel) this.activeModels = fileModels;
        if (!fileModels) throw new Error(`Invalid models for file: _${project}_${shortName}.ts`);
        return fileModels;

    }

    private async createModel(project: number, shortName: string, ext: '.ts' | '.d.ts' | '.html' | '.less', content?: string): Promise<mls.editor.IModelBase | undefined> {

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
            if (ext === '.html' && storFile) model = mls.editor.createModelHTML(storFile, src);
            else if (ext === '.ts' && storFile) model = mls.editor.createModelTS(storFile, src);
            else if (ext === '.d.ts') model = mls.editor.createModelProjectDefinition(project, src);
            else if (ext === '.less' && storFile) {
                const lessTokens = await getTokensLess('Default');
                const lineTokens = `\n\n//Start Less Tokens\n${lessTokens}\n//End Less Tokens\n`;
                src = src.trim().concat(lineTokens);
                model = mls.editor.createModelStyle(storFile, src);
            }

            if (!model) throw new Error(`Model invalid`);
            if (ext !== '.d.ts') {
                model.originalCRC = originalCRC;
                model.originalProject = originalProject;
                model.originalShortName = originalShortName;
            }
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

        const uri = this.getUri(shortName, extension);
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

        if (!model) model = await this.getOrCreateModelHtmlOrCss(storFile, fileInfo);

        if (open && this._ed1 && this.activeModels) {
            this._ed1.setModel(model);
            this.restaureViewState();
            this.updatedMSizeEditor();
            if (mode === '.less') {
                this.initModelStyle(uri, model);
            }
        }

        if (mode === '.html' && this._ed1 && this._ed1.getModel()?.id !== model.id) {
            this.registerProviderHTML();
        }

        return storFile;

    }

    private initModelStyle(uri: monaco.Uri, model: monaco.editor.ITextModel) {

        if (!this._ed1) return;
        this.lessCSS = new LessCSS(uri.toString(), this._ed1, this.position);
        this.lessCSS.setEditor(this._ed1);
        const actualLine = this._ed1.getPosition();
        const lineNumber = this.lessCSS.lessAST.findFirstSelectorAfterRoot(this.lessCSS.lessAST.ast);
        if (lineNumber && actualLine && actualLine.lineNumber === 1) {
            const line = model.getLineContent(lineNumber)
            this._ed1.setSelection(
                new monaco.Selection(lineNumber, 1, lineNumber, line.length + 1)
            );
        }
    }

    private async prepareInitialLess(shortName: string, project: number) {

        const tag = convertFileNameToTag(`_${project}_${shortName}`);
        const example = `/// <mls shortName="[shortName]" project="[project]" enhancement="enhancementStyle" />
				\n[tag] {
                \n // Here your less
                \n}`
        const newStyle = example
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


    private async getOrCreateModelHtmlOrCss(storFile: mls.stor.IFileInfo, fileInfo?: mls.stor.IFileInfoValue): Promise<monaco.editor.ITextModel> {

        const { project, shortName, extension } = storFile;
        let fileModels = mls.editor.getModels(project, shortName);
        const typeModel = storFile.extension === '.html' ? 'html' : 'style';
        if (fileModels && fileModels[typeModel] && fileModels[typeModel]?.model) {
            if (this.visible === 'true' && typeModel === 'html') mls.events.fire([2, 3, 4, 5, 6, 7], 'ModelHTMLCreated' as any, JSON.stringify(storFile));
            return fileModels[typeModel]?.model as monaco.editor.ITextModel;
        }

        const content = fileInfo ? fileInfo.content : await storFile.getContent();
        if (content instanceof Blob) throw new Error('less file must be string');
        if (!content) throw new Error('less file is undefined');

        const ext = extension as '.html' | '.less';
        if (!['.html', '.less'].includes(ext)) throw new Error('Invalid extension');

        const modelBase = await this.createModel(project, shortName, ext);
        if (!modelBase) throw new Error(`invalid mls.editor.models for file: _${project}_${shortName}${ext}`);

        if (this.visible === 'true' && typeModel === 'html') mls.events.fire([2, 3, 4, 5, 6, 7], 'ModelHTMLCreated' as any, JSON.stringify(storFile));
        const { model } = modelBase;

        const originalCRC = fileInfo ? fileInfo?.originalCRC : mls.common.crc.crc32(content as string).toString(16);
        modelBase.originalCRC = originalCRC;

        if (storFile.status === 'renamed' && fileInfo) {
            this.setEventsModelHTMLOrCss(modelBase, fileInfo.originalShortName as string, fileInfo.originalProject as number, ext);
            model.setValue(fileInfo.content as string);
        } else {
            this.setEventsModelHTMLOrCss(modelBase, storFile.shortName, storFile.project, ext);
        }
        return model;
    }

    private setEventsModelHTMLOrCss(modelBase: mls.editor.IModelBase, shortName: string, project: number, ext: '.html' | '.less'): void {
        const { storFile, model, originalCRC } = modelBase;
        if (!storFile) throw new Error(`Invalid stor file for: ${project}_${shortName}`);
        storFile.onAction = (action: mls.stor.IFileInfoAction) => this.afterUpdateHtmlOrCss(storFile, model);
        storFile.getValueInfo = () => this.getValueInfoHtmlOrCss(
            model,
            shortName,
            project,
            originalCRC
        );

        if (!model) return;
        model.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => this.onModelHtmlOrCssChange(e, modelBase, storFile, model, ext));
    }

    private async afterUpdateHtmlOrCss(storFile: mls.stor.IFileInfo, model: monaco.editor.ITextModel) {

        if (storFile.status === 'deleted') {
            await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
            const keyFiles = mls.stor.getKeyToFiles(storFile.project, storFile.level, storFile.shortName, storFile.folder, storFile.extension);
            delete mls.stor.files[keyFiles];
            return;
        }
        if (storFile.status === 'renamed') {
            const models = mls.editor.getModels(storFile.project, storFile.shortName);
            if (storFile.extension === '.less' && models && models.style) {
                models.style.originalCRC = mls.common.crc.crc32(model.getValue()).toString(16);
            }
            if (storFile.extension === '.html' && models && models.html) {
                models.html.originalCRC = mls.common.crc.crc32(model.getValue()).toString(16);
            }

        }
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        storFile.status = 'nochange';
    }

    private getValueInfoHtmlOrCss = async (activeModel: monaco.editor.ITextModel, originalShortName: string, originalProject: number, originalCRC: string | undefined): Promise<mls.stor.IFileInfoValue> => {
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

    private onModelHtmlOrCssChange(e: monaco.editor.IModelContentChangedEvent, modelBase: mls.editor.IModelBase, storFile: mls.stor.IFileInfo, model: monaco.editor.ITextModel, ext: '.html' | '.less'): void {

        // some changes is to simulate changes to force compile
        clearTimeout(this._onChangedContentHtmlOrCss);
        this._onChangedContentHtmlOrCss = window.setTimeout(async () => {

            let modelValue = model.getValue();
            if (ext === '.less') {
                const enhancementInstanceLess = await import('./_100554_enhancementStyle')
                if (enhancementInstanceLess && this.activeModels) await enhancementInstanceLess.onAfterChange(this.activeModels);

                modelValue = removeTokensFromSource(modelValue);
                if (this.activeModels && this.activeModels.ts) {

                    if (this.activeModels.ts.compilerResults) {
                        this.activeModels.ts.compilerResults.modelNeedCompile = true;
                    }
                    await mls.l2.typescript.compileAndPostProcess(this.activeModels.ts, true, true);
                }

                const lastemitter = globalState._ica.less[this.position]?.emitter || 'editor';
                if (this.lessCSS && this._ed1) {

                    const uri = this.getUri(`_${modelBase.storFile.project}_${modelBase.storFile.shortName}`, '.less');
                    const lastSelector = this.lessCSS.selector;
                    this.lessCSS = new LessCSS(uri.toString(), this._ed1, this.position);
                    this.lessCSS.setEditor(this._ed1);
                    this.lessCSS.setSelector(lastSelector);
                    const monacoPosition = this._ed1.getPosition();
                    if (!monacoPosition) return;
                    const lineContent = model.getLineContent(monacoPosition.lineNumber);
                    this.lessCSS.setStateByLine(monacoPosition.lineNumber, lineContent, lastemitter);

                }
            }

            const sameContent: boolean = modelBase.originalCRC === mls.common.crc.crc32(modelValue).toString(16);
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
            let mode: 'html' | 'style' = ext === '.html' ? 'html' : 'style';
            const idLeft = mls.editor.editors.left?.[mode]?.model.id;
            const idActive = modelBase.model.id
            if (idLeft === idActive) position = 'left';
            else position = 'right';

            if (ext === '.html') mls.events.fireFileAction('statusOrErrorChanged', storFile, position);
            else mls.events.fire([2], ['styleChanged'] as any, JSON.stringify({ position, storFile }));

        }, 400);
    };

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
        this.editorEl?.setAttribute('msize', this.msize);
        this.editorHistoryEl?.setAttribute('msize', this.msize);
    }

    private changeMode(mode: IModes) {
        if (!this.menu || !this.menu.setIconActive || !this.menu.selectButton) return;
        if (mode.startsWith('ic')) {
            if (this.isModeHistory) {
                this.menu.selectButton('btHistory');
            }
            this.menu.setIconActive(mode);
        } else {
            this.menu.selectButton(mode);
        }
    }

    handleIcaStateChange(_key: string, _value: any) {
        const keyState = `serviceSource.${this.position}`;
        if (!_key.startsWith(keyState)) return;
        if (_key === `${keyState}.selectedMode` && ['icTs', 'icStyle', 'icHTML', 'btHistory'].includes(_value)) {
            this.changeMode(_value);
        }
        if (_key === `${keyState}.currentHistorySource` ||
            _key === `${keyState}.previousHistorySource` ||
            _key === `${keyState}.historyLanguage`
        ) {
            this.setHistories(this.previousHistorySource || '', this.currentHistorySource || '', this.historyLanguage)
        }
    }

    updated(changedProperties: any) {
        if (changedProperties.has('msize')) {
            const [w, h, t, l] = this.msize.split(',');
            if (w) this.panelRightOpened = (+w) >= this.MINWIDTHTPANELRIGHT;
            if (!this.visible) return;
            this.updatedMSizeEditor();
        }
    }
    connectedCallback() {
        if (!globalState._ica) globalState._ica = {};
        if (!globalState._ica.less) {
            globalState._ica.less = {
                left: {},
                right: {},
            }
        }
        if (!globalState._ica.serviceSource) {
            globalState._ica.serviceSource = {
                left: {
                    selectedMode: 'icTS',
                    currentHistorySource: '',
                    previousHistorySource: '',
                    historyLanguage: 'typescript',
                },
                right: {
                    selectedMode: 'icTS',
                    currentHistorySource: '',
                    previousHistorySource: '',
                    historyLanguage: 'typescript'
                },

            };
        }
        this.setAttribute('currentHistorySource', `{{serviceSource.${this.position}.currentHistorySource}}`)
        this.setAttribute('previousHistorySource', `{{serviceSource.${this.position}.previousHistorySource}}`)
        this.setAttribute('selectedMode', `{{serviceSource.${this.position}.selectedMode}}`);
        this.setAttribute('historyLanguage', `{{serviceSource.${this.position}.historyLanguage}}`);
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

                <div slot="bottom">
                    ${this.renderPrompt()}
                </div>
        </collab-spliter-vertical-var-fixed-100554>`

    }

    renderPrompt() {

        if (!this.activeModels || !this.activeModels.ts || !this.activeModels.ts.storFile) return html``;
        const { shortName, project } = this.activeModels.ts.storFile;
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


            const project = +info[keyLocal].project;
            const shortName = info[keyLocal].shortName;

            const models = mls.editor.getModels(project, shortName);
            if (!models) return false;

            this.activeModels = models;
            mls.actual[this.level].setFullName(`_${info[keyLocal].project}_${info[keyLocal].shortName}`);
            (mls.actual[this.level] as any)[position] = {
                project,
                shortName,
                extension: '.ts',
                folder: ''
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

        if (!this.activeModels || !this.activeModels.html || !this.activeModels.html.storFile || !this.activeModels.html.model) return;

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
        if (this.menu.setIconActive) this.menu.setIconActive('icHTML');
        if (!this.activeModels.html.model) return;
        this.activeModels.html.model.setValue(html.innerHTML);

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
            await this.getOrCreateModelHtmlOrCss(storFile);
        } catch (err: any) {
            throw new Error(err);
        }

    }

}


interface IViewState {
    [file: string]: IViewStates
}

interface IViewStates {
    ts: monaco.editor.ICodeEditorViewState | null,
    html: monaco.editor.ICodeEditorViewState | null,
    style: monaco.editor.ICodeEditorViewState | null,
}

type IModes = 'icTs' | 'icStyle' | 'icHTML';


