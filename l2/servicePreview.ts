/// <mls shortName="servicePreview" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IServiceMenu, IOptions } from './_100554_serviceBase';
import { StateLitElement } from './_100554_stateLitElement';
import { getTokens } from './_100554_designSystemBase';
import { getConfigProject } from './_100554_libProjectConfig';
import { createPath } from './_100554_libCommom';

import { globalState, setState, initState, getState } from './_100554_collabState';
import { convertTagToFileName } from './_100554_utilsLit';
import { collab_record, collab_trash, collab_file_pen, collab_play, collab_test, collab_xmark } from './_100554_collabIcons';
import { CollabState } from './_100554_collabState';
import { TsTestAst } from './_100554_tsTestAST';
import { loadChatPreferences } from './_100554_collabMessageHelper';
import { getUserIdLocalStorage, getTemporaryContext } from './_100554_aiAgentHelper';
import { PROJECTAGENTDEFAULT } from './_100554_collabMessageHelper';
import { IAgent } from './_100554_aiAgentBase';

import './_100554_collabConsole';
import './_100554_collabResultTest';
import './_100554_servicePreviewView';
import './_100554_pluginPreviewInsights';
import './_100554_collabMessagesPrompt';
import './_100554_collabSpliterVerticalVarFixed';
import './_100554_collabSpliterHorizontalVarFixed';

/// **collab_i18n_start**
const message_pt = {
    theme: 'Tema',
    variations: 'Linguagem',
    editStyle: 'Editar estilo',
    pause: 'Preview pausado',
    run: 'Preview executando',
    dark: ' escuro',
    light: 'claro',
    help: 'Ajuda',
    consoleA: 'Console fechado',
    consoleD: 'Console aberto',
    testA: 'Teste não iniciado',
    testB: 'Teste gravando',
    testRun: 'Executar',
    testDelete: 'Excluir',
    testEdit: 'Editar',
    runAllTest: 'Todos os testes'
}

const message_en = {
    theme: 'Theme',
    variations: 'Language',
    editStyle: 'Edit style',
    pause: 'Preview paused',
    run: 'Preview running',
    dark: 'dark',
    light: 'light',
    help: 'Help',
    consoleA: 'Console closed',
    consoleD: 'Console open',
    testA: 'Test not started',
    testB: 'Test recording',
    testRun: 'Run',
    testDelete: 'Delete',
    testEdit: 'Edit',
    runAllTest: 'All testes'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-preview-100554')
export class ServicePreview100554 extends ServiceBase {

    @property() itens: any = undefined;
    @property() msize: string = '';
    @property() error: string = '';
    @property() watch: boolean = true;
    @property() enabledConsole: boolean = false;
    @property() enabledTest: boolean = false;
    @property() light: boolean = true;
    @property() lang: string = 'en';
    @property() page: string = '';

    @query('#preview-container') previewContent: HTMLElement | undefined;

    private msg: MessageType = messages['en'];

    private lastMode: number = EPreview.icPreviewD;

    private lastModePreview: string = 'desktop';

    private lastLevel: number = -1;

    private elPreview: HTMLElement | undefined = undefined;

    private themes: string[] = ['Default'];

    private actualTheme = 'Default';

    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;

    private monacoeditor: HTMLElement | undefined;

    private languages: ILanguage = {}

    private timeEvent: number = -1;

    get confE() { return `l${this.level}_${this.position}`; }

    constructor() {
        super();
        window.preview = {
            editor: undefined,
            iframe: undefined,
        };
        initState('preview', { pausePreview: false, service: this });
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf06e',
        state: 'foreground',
        position: 'right',
        tooltip: 'Preview',
        visible: true,
        widget: '_100554_servicePreview',
        level: [1, 2, 3, 4, 5, 6, 7]
    }

    public onClickMain(op: string) {
        if (op === 'opAboutWCD') this.opAboutWCD();
        else if (op === 'opResultHTML') this.showEditorHTML();
        else if (op === 'opResultJS') this.showResultJS();
        else if (op === 'opResultTSTest') this.showResultTestJS();
    }

    public onClickTabs(index: number) {
        this._ed1?.updateOptions({ readOnly: false });
        if (index === EPreview.icPreviewD) this.preview('desktop');
        else if (index === EPreview.icPreviewM) this.preview('mobile');
        else if (index === EPreview.icPreviewI) this.preview('insights');
        this.lastMode = index;
    }

    public onClickTools(op: string) {

        if (op === 'watchPreview') this.toogleWatch();
        else if (op === 'editTextL3') this.toogleEditTextL3();
        else if (op === 'devConsole') this.toogleConsole();
        else if (op === 'help') this.onHelpClick();
        else if (op === 'test') this.onBtTestClick();
        else if (op === 'testList') this.onBtTestListClick();
        else if (op === 'darkLight') this.onBtDarkLightClick();
        else if (['languages', 'theme'].includes(op)) { this.actButton(op); }
        else throw new Error('Invalid option')
    }

    public async actButton(op: string) {
        await this.fireWcdChanges();
        if (op === 'languages') return this.onBtLanguageClick();
        if (op === 'theme') return this.onBtThemeClick();
    }

    public onClickTitle = () => {
        this._onClickTitle();
    }

    public menu: IServiceMenu = {
        title: '',
        main: {
            opAboutWCD: 'About this WCD',
            opResultHTML: 'Result HTML',
            opResultJS: 'Result Typescript',
            opResultTSTest: 'Result Typescript Test',
        },
        tabs: {
            group: 'Mode',
            type: 'full',
            selected: 0,
            options: [
                { text: 'Desktop', icon: 'f390' },
                { text: 'Mobile', icon: 'f3cf' },
                { text: 'Insights', icon: 'f0eb' },
            ]
        },
        tools: {
            test: {
                type: 'cycle',
                selected: 0,
                onlyMenu: true,
                options: [
                    { text: this.msg.testA, icon: collab_record.strings[0] },
                    { text: this.msg.testB, icon: collab_record.strings[0] },
                ]
            },
            testList: {
                type: 'tree-dropdown',
                icon: collab_test.strings[0].trim(),
                //onlyMenu: true,
                selected: [],
                options: []
            },
            darkLight: {
                type: 'cycle',
                selected: 0,
                options: [
                    { text: this.msg.light, icon: 'f185' },
                    { text: this.msg.dark, icon: 'f186' },
                ]
            },
            theme: {
                type: 'dropdown',
                icon: 'f53f',
                onlyMenu: true,
                selected: 0,
                options: []
            },
            languages: {
                type: 'dropdown',
                selected: 0,
                options: []
            },
            watchPreview: {
                type: 'cycle',
                selected: 0,
                options: [
                    { text: this.msg.run, icon: 'f04c' },
                    { text: this.msg.pause, icon: 'f04b' },
                ]
            },
            devConsole: {
                type: 'cycle',
                selected: 0,
                onlyMenu: true,
                options: [
                    { text: this.msg.consoleA, icon: 'f120' },
                    { text: this.msg.consoleD, icon: 'f410' },
                ]
            },
            help: {
                type: 'link',
                onlyMenu: true,
                options: [
                    { text: this.msg.help, icon: 'f059' },
                ]
            },

        },
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
        onClickTools: this.onClickTools.bind(this),
        onClickTitle: this.onClickTitle.bind(this),

    }

    public onServiceClick(visible: boolean, reinit: boolean) {

        if (!visible) return;

        if (this.elPreview) {
            this.lastLevel = this.level;
            this.elPreview.setAttribute('level', this.level.toString());
            this.changeTools();
        } else {

            this.onReloader();
        }
    }

    // -------------- EVENTS -------------------

    private changeTools() {

        this.changeToolsLevel3();
        if (this.menu.refresh) this.menu.refresh();

    }

    private changeToolsLevel3() {

        if (this.level !== 3 && this.menu.tools.editTextL3) {
            delete this.menu.tools.editTextL3;
            return;
        }

        if (this.level !== 3) return

        this.menu.tools.editTextL3 = {
            type: 'cycle',
            selected: 0,
            options: [
                { text: "Edit", icon: 'f31c' },
                { text: "Save", icon: 'f0c7' },
            ]
        }


    }

    private elEditL3: HTMLElement | undefined;
    private async toogleEditTextL3() {

        if (!this.elPreview) return;
        const iframe = this.elPreview.querySelector('iframe') as HTMLIFrameElement;

        if (!iframe || !iframe.contentDocument || !iframe.contentDocument.body) return;

        const body = iframe.contentDocument.body;

        if (this.menu.tools.editTextL3.selected === 0) {
            if (this.elEditL3 && (this.elEditL3 as any).save) {
                const ret = await (this.elEditL3 as any).save();
                if (!ret) this.preview(this.lastModePreview);

            } else this.preview(this.lastModePreview);
            return;
        }

        this.elEditL3 = document.createElement('collab-l3-edit-text-100554');
        body.appendChild(this.elEditL3);

        if (!body.querySelector('#_100554_collabL3EditText')) {
            const script = document.createElement('script') as HTMLScriptElement;
            script.type = 'module';
            script.id = '_100554_collabL3EditText';
            script.src = '/_100554_collabL3EditText';
            body.appendChild(script);
        }

    }

    private setEvents() {

        mls.events.addEventListener([2, 3, 4, 5, 6, 7], ['ModelHTMLCreated'] as any, (ev: mls.events.IEvent) => { this.onModelHTMLCreated(ev); });
        mls.events.addEventListener([2, 5], ['FileAction'], this.onMLSFileAction.bind(this));
        mls.events.addListener(2, 'styleChanged' as any, this.onStyleChanged.bind(this));
        //mls.events.addListener(2, 'tsTestChanged' as any, this.onTsTestChanged.bind(this));
        mls.events.addEventListener([0, 1, 2, 3, 4, 5, 6, 7], ['LevelChanged'] as any, this.onLevelChange.bind(this));
        mls.events.addListener(3, 'L3EditEvents' as any, this.onL3EditEvents.bind(this));

    }

    private onL3EditEvents(ev: mls.events.IEvent) {

        if (!ev.desc || ev.level !== this.level || ev.level !== 3) return;

        const info = JSON.parse(ev.desc);
        if (!info || !info.action || !info.position || info.position === 'right') return;

        switch (info.action) {
            case ('modeEdit'):
                this.onActiveModeEdit(true);
                break;
            case ('modePreview'):
                this.onActiveModeEdit(false);
                break;
        }

    }

    private onActiveModeEdit(active: boolean) {

        if (!this.menu.tools.editTextL3 || !this.menu.selectTool) return;

        if (active && this.menu.tools.editTextL3.selected === 0) {
            this.menu.selectTool('editTextL3');
        } else if (!active && this.menu.tools.editTextL3.selected === 1) {
            this.menu.selectTool('editTextL3');
        }

        if (active && this.elPreview) {

            const iframe = this.elPreview.querySelector('iframe') as HTMLIFrameElement;

            if (!iframe || !iframe.contentDocument || !iframe.contentDocument.body) return;
            const body = iframe.contentDocument.body;
            const el = document.querySelector('collab-l3-edit-text-100554');
            if (el) return;
            this.elEditL3 = document.createElement('collab-l3-edit-text-100554');
            body.appendChild(this.elEditL3);

            if (!body.querySelector('#_100554_collabL3EditText')) {
                const script = document.createElement('script') as HTMLScriptElement;
                script.type = 'module';
                script.id = '_100554_collabL3EditText';
                script.src = '/_100554_collabL3EditText';
                body.appendChild(script);
            }
        }

    }

    private onReloader(): void {
        clearTimeout(this.timeEvent);
        this.timeEvent = setTimeout(async () => {
            this.preview(this.lastModePreview);
            mls.events.fire((+(this.level as any)) as any, 'L3EditEvents' as any, `{"action":"navigation", "position":"right"}`, 500);
        }, 500);
    }

    private onModelHTMLCreated(ev: mls.events.IEvent): void {
        try {
            if (!ev.desc) return;
            if (ev.level !== this.level) return;
            const iPath: mls.cbe.IPath = JSON.parse(ev.desc);
            if (!iPath || !iPath.project || !iPath.shortName) return;
            const keyStorFile = mls.stor.getKeyToFiles(iPath.project, 2, iPath.shortName, '', '.html');
            const storFile = mls.stor.files[keyStorFile];
            if (!storFile) throw new Error('Invalid stor file for path:' + keyStorFile);

            if ((iPath as any).position && (iPath as any).position === 'left') this.setModel(storFile);
        } catch (err: any) {
            throw new Error(err);
        }
    }

    private lastStatusHasError: boolean = false;
    private onStyleChanged() {

        if (this.elPreview) {
            this.lastLevel = this.level;

            if (this.actualFile) {

                const keyToFileInfo = mls.stor.getKeyToFiles(this.actualFile.project, 2, this.actualFile.shortName, this.actualFile.folder, '.less');

                const less = mls.stor.files[keyToFileInfo];
                if (less && !less.hasError && this.lastStatusHasError) {

                    if (this.watch) {
                        this.elPreview = undefined;
                        this.updateLoadingToFalseIfNoTasksRunning();
                        this.onReloader();
                        this.lastStatusHasError = false;
                        return;
                    }

                } else if (less && less.hasError) {
                    this.lastStatusHasError = true;
                }

            }

            this.elPreview.setAttribute('stylechanged', 'true');
            this.elPreview.setAttribute('actualtheme', this.actualTheme);
        }
    }

    private onLevelChange(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const data: { to: number, from: number } = JSON.parse(ev.desc);

        this.setTitleByLevel();

        if (data.to === 7 || data.from === 7) {
            if (this.watch) {
                this.onReloader();
            }
        }

    }

    private onTsTestChanged() {
        if (this.watch) {
            this.elPreview = undefined;
            this.updateLoadingToFalseIfNoTasksRunning();
            this.setTest();
            this.onReloader();
        }
    }

    private actualFile: mls.stor.IFileInfo | undefined;
    private async onMLSFileAction(ev: mls.events.IEvent): Promise<void> {

        try {

            if (![2, 5].includes(ev.level) || (ev.type !== 'FileAction') || !ev.desc) return;
            const fileAction = JSON.parse(ev.desc) as mls.events.IFileAction;
            // if ((this.visible === 'false') && !((fileAction.action as any) === 'openBackground')) return;
            const eventsValid = ['open', 'openBackground', 'statusOrErrorChanged', 'changed', 'new', 'modeCreated', 'editorChanged'];

            if (
                fileAction.position === this.position ||
                !eventsValid.includes(fileAction.action)
            ) return;

            const keyToFileInfo = mls.stor.getKeyToFiles(fileAction.project, 2, fileAction.shortName, fileAction.folder, '.html');
            const storFileHTML = mls.stor.files[keyToFileInfo];

            if (fileAction.action === 'editorChanged', fileAction.extension === '.test.ts') {
                this.onTsTestChanged();
                return;
            }

            if (fileAction.action === 'open' || (fileAction.action as any) === 'openBackground') {
                setState('preview.pausePreview', false);

                this.setModel(storFileHTML);

                this.actualFile = storFileHTML;

                if (!this.watch && this.menu.selectTool) {
                    this.menu.selectTool('watchPreview');
                }
            }

            if (mls.istrace) console.info('is preview repaint:' + this.watch);


            if (fileAction.action as any === 'openBackground') {
                this.elPreview = undefined;
                this.preview('desktop')
                return;
            }

            if (fileAction.action === 'open') {
                this.loading = true;
                return;
            }

            if (this.menu && this.menu.closeMenu) this.menu.closeMenu();

            const rp = getState('preview.pausePreview');
            if (this.watch && !rp) {
                this.elPreview = undefined;
                this.updateLoadingToFalseIfNoTasksRunning();
                this.setTest();
                this.onReloader();
            }

        } catch (e) {
            console.info(e);
        }

    }


    // -------------- COMPONENT ---------------

    render2() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
        <collab-spliter-vertical-var-fixed-100554 msize=${this.msize} withresize="false" fixedheight="100" complementcolor="var(--bg-primary-color)">
                <div slot="top" style="height:100%;" id="preview-container"></div>
                <div slot="bottom">
                    <collab-messages-prompt-100554 acceptAutoCompleteAgents="true" scope="l${this.level}_preview"  .onSend=${this.handleSend.bind(this)}></collab-messages-prompt-100554>
                </div>
            </collab-spliter-vertical-var-fixed-100554>`;
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
        <collab-spliter-vertical-var-fixed-100554 msize=${this.msize} withresize="false" fixedheight="100" complementcolor="var(--bg-primary-color)">

                <collab-spliter-horizontal-var-fixed-100554
                    slot="top"
                    complementcolor="var(--bg-primary-color);"
                    fixedwidth="30%"
                    fixedvisible= "closed" 
                >
                    <div slot="left" style="height:100%;" id="preview-container"></div>
                    <div slot="right" style="height:100%;" id="preview-details"></div>
                </collab-spliter-horizontal-var-fixed-100554>
                <div slot="bottom">
                    <collab-messages-prompt-100554 acceptAutoCompleteAgents="true" scope="l${this.level}_preview"  .onSend=${this.handleSend.bind(this)}></collab-messages-prompt-100554>
                </div>
            </collab-spliter-vertical-var-fixed-100554>`;
    }

    async handleSend(value: string, opt: { isSpecialMention: boolean, agentName: string }) {

        if (!this.page) {
            this.setError('Erro page not selected');
            return;
        }

        if (!opt.isSpecialMention || !opt.agentName) {
            this.setError('Please select a agent first ex: @@Improve');
            return;
        }

        if (!value) {
            this.setError('Error: Invalid prompt');
            return;
        }

        this.loading = true;

        if (opt.agentName === 'agentReview') {
            const modes = ['typescript', 'html', 'less'];
            await Promise.all(
                modes.map(mode => {
                    const payload = { page: this.page, prompt: value, position: 'left', mode };
                    return this.fireCollab(opt.agentName, JSON.stringify(payload));
                })
            ).catch((err) => {
                this.setError('Error on send message:' + err.message);
            })
            return;
        }

        try {
            await this.fireCollab(opt.agentName, JSON.stringify({ page: this.page, prompt: value, position: 'left' }));
        } catch (err: any) {
            this.setError('Error on send message:' + err.message);
        }

    }

    private onTaskChange = async (e: Event) => {

        if (this.tasksInProgress.size === 0) return;
        const customEvent = e as CustomEvent;
        const message: mls.msg.Message = customEvent.detail.context.message;
        const task: mls.msg.TaskData = customEvent.detail.context.task;
        const { content, createAt, senderId, threadId } = message;
        const createAt2 = customEvent.detail.oldContextCreateAt ? customEvent.detail.oldContextCreateAt : createAt;

        let contextChangedByPage = Array.from(this.tasksInProgress).find((item) => {
            const [key, value] = item;
            return key === this.page
        });

        if (!contextChangedByPage) return;

        const tasks = this.tasksInProgress.get(this.page);
        if (!tasks) return;
        let contextChanged = Array.from(tasks).find((item) =>
            item.message.content === content &&
            item.message.senderId === senderId &&
            item.message.createAt === createAt2 &&
            item.message.threadId === threadId
        );


        if (contextChanged && task && (task.status === 'failed' || task.status === 'done')) {
            tasks.delete(contextChanged);
            if (tasks.size === 0) this.tasksInProgress.delete(this.page);
        }

        if (!this.tasksInProgress.get(this.page) || this.tasksInProgress.get(this.page)?.size === 0) this.updateLoadingToFalseIfNoTasksRunning();

    };


    private updateLoadingToFalseIfNoTasksRunning() {
        if (this.tasksInProgress.size === 0) this.loading = false;
        const actual = this.tasksInProgress.get(this.page);
        if (!actual) this.loading = false;
        else if (actual.size === 0) this.loading = false;
    }

    private tasksInProgress: Map<string, Set<mls.msg.ExecutionContext>> = new Map();
    private async fireCollab(agentName: string, prompt: string) {

        const pref = loadChatPreferences();
        if (!pref.threadMaintenance) {
            this.setError('Please configure your maintenance thread at: CollabMessage > Settings > Chat Preferences');
            return;
        }

        const userId = getUserIdLocalStorage();
        const threadId = pref.threadMaintenance;
        if (!userId) return;

        const moduleAgent = await import(`/_${PROJECTAGENTDEFAULT}_${agentName}`);
        if (!moduleAgent || !moduleAgent.createAgent || typeof moduleAgent.createAgent !== 'function') throw new Error('Invalid agent');
        const agent: IAgent = moduleAgent.createAgent();
        const context = getTemporaryContext(threadId, userId, prompt);

        if (!this.tasksInProgress.get(this.page)) this.tasksInProgress.set(this.page, new Set());
        const actual = this.tasksInProgress.get(this.page);
        if (actual) actual.add(context);

        await agent.beforePrompt(context);

    }

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        this.createEditor();
        const darkOrLight = this.getDarkLight();
        if (darkOrLight === 'dark' && this.menu.selectTool) this.menu.selectTool('darkLight');
        this.setLanguages();
        this.setTheme();
        this.setTest();
        this.configureButtonsRight(false);
        window.addEventListener('task-change', this.onTaskChange);

    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('task-change', this.onTaskChange);
    }

    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
        const hasMsize = changedProperties.has('msize');
        if (hasMsize) {
            const msize = changedProperties.get('msize');
            if (!msize || typeof msize !== 'string' || !this.monacoeditor) return;
            this.monacoeditor.setAttribute('msize', msize);
            if (this.pluginResultJS) this.pluginResultJS.setAttribute('msize', msize);
            if (this.pluginResultTestJS) this.pluginResultTestJS.setAttribute('msize', msize);
            const pageOverlay = window.preview.iframe?.contentDocument?.body.querySelector('*[modeoverlay]');
            if (!pageOverlay) return;
            const pageOverlayName = pageOverlay.getAttribute('modeoverlay');
            if (!pageOverlayName) return;
            const wcdOverlay = pageOverlay.querySelector(pageOverlayName);
            if (wcdOverlay) wcdOverlay.setAttribute('msize', msize);

        }
    }

    // -------------- IMPLEMENTS-----------------

    private configureButtonsRight(enabled: boolean) {
        const buttonsR = this.nav3Service?.querySelector('collab-nav-3-menu .tools') as HTMLElement;
        if (!buttonsR) return;
        buttonsR.style.opacity = enabled ? '1' : '.2';
        buttonsR.style.pointerEvents = enabled ? 'all' : 'none';
    }

    private opAboutWCD() {

        if (!this.menu.setMode) return;
        const el = document.createElement("div") as HTMLElement;
        el.style.padding = '1rem';

        if (!window['preview'] || !window['preview'].iframe || !window['preview'].iframe.contentWindow || !(window['preview'].iframe.contentWindow as any).wcdState) {
            el.innerHTML = `<h3>Not found any information about this page</h3>`;
            this.menu.setMode('page', el);
            return;
        };

        const info = (window['preview'].iframe.contentWindow as any).wcdState;
        const elOverlay = window['preview'].iframe.contentDocument?.body.querySelector('*[modeoverlay]');

        let txt = '<h3>About this page</h3><ul>';

        if (elOverlay && elOverlay.getAttribute('modeoverlay')) {
            const n = elOverlay.getAttribute('modeoverlay') as string;
            txt += `<li><b>Overlay:</b> ${convertTagToFileName(n)}</li>`;
        }

        if (info.elICA) {
            txt += `<li><b>Select:</b> ${convertTagToFileName(info.elICA.tagName.toLowerCase())}</li>`;
        }

        if (info.elMain) {
            txt += `<li><b>Element render:</b> ${convertTagToFileName(info.elMain.tagName.toLowerCase())}</li>`;
        }

        if (info.myParent) {
            txt += `<li><b>Main wcd:</b> ${convertTagToFileName(info.myParent.tagName.toLowerCase())}</li>`;
        }

        if (info.wcdItens && info.wcdItens.length > 0) {
            txt += `<li><b>Wcd itens:</b>`;
            info.wcdItens.forEach((it: any) => {
                txt += `<br/>${convertTagToFileName(it.tagName.toLowerCase())}`;
            })
            txt += `</li>`;
        }

        txt += `</ul>`;

        el.innerHTML = txt;

        this.menu.setMode('page', el);
        return;

    }

    private showEditorHTML() {
        if (this.menu.setMode) {
            this.menu.setMode('page', this.monacoeditor);
            this._ed1?.updateOptions({ readOnly: true });
            this._ed1?.layout();
            this.monacoeditor?.setAttribute('msize', this.msize);

        }
        return true;
    }

    private pluginResultJS: HTMLElement | undefined;
    private showResultJS() {
        import('./_100554_pluginPreviewResultJs');
        if (this.menu.setMode) {
            this.pluginResultJS = document.createElement('plugin-preview-result-js-100554');
            this.pluginResultJS.setAttribute('msize', this.msize);
            this.menu.setMode('page', this.pluginResultJS);
            this.menu.title = 'Result Typescript';
            if (this.menu.updateTitle) this.menu.updateTitle();
        }
        return true;
    }

    private pluginResultTestJS: HTMLElement | undefined;
    private showResultTestJS() {
        import('./_100554_pluginPreviewResultTestJs');
        if (this.menu.setMode) {
            this.pluginResultTestJS = document.createElement('plugin-preview-result-test-js-100554');
            this.pluginResultTestJS.setAttribute('msize', this.msize);
            this.menu.setMode('page', this.pluginResultTestJS);
            this.menu.title = 'Result Test Typescript';
            if (this.menu.updateTitle) this.menu.updateTitle();
        }
        return true;
    }

    private getIframePreviewHTML(): HTMLHtmlElement | undefined {
        if (!window.preview.iframe) throw new Error('Preview no created yet');
        const htmlEl = window.preview.iframe
            ?.contentDocument
            ?.querySelector('html') as HTMLHtmlElement;
        return htmlEl;
    }

    private actualTestList: {
        text: string;
        functionName: string;
        index: number,
        options: {
            text: string;
            icon: string;
        }[];
    }[] = []

    private astTSTest: TsTestAst | undefined;

    private async setTest() {

        this.refreshAST();
        if (!this.astTSTest) return;

        const fileTests = this.astTSTest.getTests();

        const opts = fileTests.flatMap(item =>
            item.params.map((_, indexParam) => ({
                text: item.params.length > 1 ? `${item.functionName}(${indexParam})` : item.functionName,
                functionName: item.functionName,
                index: indexParam,
                options: [
                    { text: this.msg.testRun, icon: collab_play.strings[0] },
                    { text: this.msg.testDelete, icon: collab_trash.strings[0] },
                    { text: this.msg.testEdit, icon: collab_file_pen.strings[0] },
                ]
            }))
        );

        const optAllTests = [{
            text: this.msg.runAllTest,
            functionName: '',
            index: -1,
            options: [
                { text: this.msg.testRun, icon: collab_play.strings[0] }
            ]

        }]

        const rcOpts = opts.length > 0 ? [...optAllTests, ...opts] : opts;

        this.actualTestList = rcOpts;

        if (opts.length >= 0 && this.menu.tools.testList) {
            this.menu.tools.testList.options = rcOpts;
        }

        this.menu.refresh?.('tools');
    }


    private onBtTestClick() {

        if (!this.menu || !this.menu.tools || !this.menu.tools.test || this.menu.tools.test.selected === undefined) return;
        const selectedTest = this.menu.tools.test.selected;

        if (selectedTest === ERecord.Play) {
            const iframe = window.preview.iframe;
            if (!iframe || !iframe.contentWindow || !(iframe.contentWindow as any).globalStateManagment) return;
            const ica = (iframe.contentWindow as any).globalStateManagment;
            ica.clearHistory();

        } else if (selectedTest === ERecord.Stop) {
            const iframe = window.preview.iframe;
            if (!iframe || !iframe.contentWindow || !(iframe.contentWindow as any).globalStateManagment) return;
            const ica = (iframe.contentWindow as any).globalStateManagment
            const script = this.getScriptTest(ica);

            this.fireEventsDetails(script);
        }

    }

    private fireEventsDetails(script: { func: string, exe: any } | undefined) {

        if (!script) return;

        const options = {
            shortName: undefined,
            project: undefined,
            htmlText: `<collab-process-test-100554 
                script=${btoa(script.func)}
            ></collab-process-test-100554>`,
            arguments: script
        }

        mls.events.fire(
            mls.actualLevel as any,
            'PluginDetails' as any,
            JSON.stringify(options),
            0
        );
    }

    private addTestResultItem(title: string, status: string, clear = true) {
        const item = document.createElement('collab-result-test-100554');
        item.setAttribute('testName', title);
        item.setAttribute('status', status);
        const collabResult = this.parentElement?.querySelector('collab-result-container-100554') as HTMLElement;
        if (clear) collabResult.querySelectorAll('collab-result-test-100554').forEach((item) => item.remove());
        collabResult.appendChild(item);
        this.openTestResults();
        return item;
    }

    private async runTest(actualData: any, clear: boolean) {
        if (!this.astTSTest) throw new Error('Invalid AST');
        const testItem = this.addTestResultItem(actualData.functionName, 'running', clear);
        try {
            const result = await this.astTSTest.runTest(actualData.functionName, actualData.index);
            testItem.setAttribute('resultStatus', 'pass');
            testItem.setAttribute('result', result);
        } catch (err: any) {
            testItem.setAttribute('resultStatus', 'failed');
            testItem.setAttribute('result', err.message);
            throw new Error();
        } finally {
            testItem.setAttribute('status', 'finished');
        }
    }


    private async runAllTests() {
        for (let i = 0; i < this.actualTestList.length; i++) {
            const data = this.actualTestList[i];
            if (data.index === -1) continue;
            if (!data.functionName) continue;

            try {
                await this.runTest(data, i === 1 ? true : false);
            } catch (error) {
                break;
            }
        }
    }


    private async onBtTestListClick() {

        if (!(mls.actual[2] as any).left) return;
        if (!this.menu || !this.menu.tools || !this.menu.tools.testList) return;
        const selectedIndex = this.menu.tools.testList.selected as number[];
        const [testIndex, actionIndex] = selectedIndex;
        const actualData = this.actualTestList[testIndex];

        if (actionIndex === ETestActions.Run) {

            this.refreshAST();
            if (!this.astTSTest) throw new Error('Invalid AST');

            if (actualData.index === -1) {
                this.runAllTests();
                return;
            }

            this.runTest(actualData, true);

        } else if (actionIndex === ETestActions.Delete) {

            await this.deleteTest(actualData.functionName, actualData.index);
            this.setTest();

        } else if (actionIndex === ETestActions.Edit) {

            if (!actualData) {
                this.error = 'Invalid test';
                return;
            }

            if (this.level !== 2) this.selectLevel(2);

            setTimeout(() => { setState('serviceSource.left.selectedMode', 'icTest'); }, 200)
            setTimeout(() => { this.astTSTest?.goToTest(actualData.functionName) }, 200)
        }
    }

    private async deleteTest(testName: string, indexParams: number) {
        this.refreshAST();
        if (!this.astTSTest) throw new Error('Invalid AST');
        try {
            this.astTSTest.deleteTest(testName, indexParams)
        } catch (err: any) {
            this.error = err.message;
        }
    }

    private refreshAST() {
        if (!this.actualFile) return false;
        const fileName = `_${this.actualFile.project}_${this.actualFile.shortName}`;
        const models = mls.editor.models[fileName];
        if (!models) {
            this.error = `No found models for file: ${fileName}`;
            return false;
        }
        if (!models.test) {
            this.error = `No found model test in file: ${fileName}`;
            return false;
        }
        const editor = mls.services['100554_serviceSource_left']._ed1;
        this.astTSTest = new TsTestAst(models.test, editor);
    }

    private onBtLanguageClick() {

        if (this.menu.tools.languages.selected === undefined) return;
        const opMenu = this.menu.tools.languages.options[this.menu.tools.languages.selected as number].text;
        const htmlEl: HTMLHtmlElement | undefined = this.getIframePreviewHTML();
        if (htmlEl) htmlEl.lang = this.languages[opMenu].acronym;
        this.lang = this.languages[opMenu].acronym;
        const variation = Object.keys(this.languages).indexOf(opMenu);

        globalState.globalVariation = !isNaN(variation) ? variation : 0;
        if (window.top) (window.top.window as any).globalVariation = !isNaN(variation) ? variation : 0;

        if (this.level === 7) this.requestUpdateAllIcaComponentsInPage();
        else this.onReloader();
        return true;
    }

    private onBtDarkLightClick() {

        this.light = !this.light;
        if (!(mls.actual[2] as any).left || !this.watch) return this.light;
        const htmlEl: HTMLHtmlElement | undefined = this.getIframePreviewHTML();
        if (htmlEl) {
            if (this.light) htmlEl.removeAttribute('data-theme');
            else htmlEl.setAttribute('data-theme', 'dark');
        }
        this.onStyleChanged();
        return this.light;
    }

    private onBtThemeClick() {
        if (this.menu.tools.theme.selected === undefined) return;
        const opMenu = this.menu.tools.theme.options[this.menu.tools.theme.selected as number].text;
        this.actualTheme = opMenu;
        this.onStyleChanged();
        return true;
    }

    private toogleWatch() {
        setState('preview.pausePreview', false);
        this.elPreview = undefined;
        this.watch = this.menu.tools.watchPreview.selected === 0;
        if (this.watch) this.onReloader();
    }

    private toogleConsole() {
        this.enabledConsole = this.menu.tools.devConsole.selected === 1;
        const collabConsole = this.parentElement?.querySelector('collab-console-100554') as HTMLElement;
        if (!collabConsole) return;

        collabConsole.style.display = this.enabledConsole ? 'block' : 'none';
        collabConsole.setAttribute('mode', this.enabledConsole ? 'enabled' : 'disabled');

    }

    private openTestResults() {
        this.enabledTest = true;
        const collabResult = this.parentElement?.querySelector('collab-result-container-100554') as HTMLElement;
        if (!collabResult) return;
        collabResult.style.display = 'flex';
    }

    private closeTestResults() {
        this.enabledTest = false;
        const collabResult = this.parentElement?.querySelector('collab-result-container-100554') as HTMLElement;
        if (!collabResult) return;
        collabResult.style.display = 'none';
    }

    private onHelpClick() {
        this.openService('_100554_serviceOrganism', 'left', 3);
    }

    private createEditor() {
        if (!this.monacoeditor) {
            this.monacoeditor = document.createElement('mls-editor-100529');
            this.monacoeditor.setAttribute('ismls2', 'true');
            const [width, height] = this.msize.split(',');
            this.monacoeditor.style.width = width + 'px';
            this.monacoeditor.style.height = height + 'px';
        }
        if (this._ed1) return;

        this._ed1 = monaco.editor.create(this.monacoeditor, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            noImplicitAny: true
        });

        (this.monacoeditor as any)['mlsEditor'] = this._ed1;
        window.preview.editor = this._ed1;
    }

    private async createModelIfNeeded(storFile: mls.stor.IFileInfo): Promise<monaco.editor.ITextModel | null> {
        if (!storFile) {
            //throw new Error('Invalid storFile');
            return null;
        }
        const uri = this.getUri(`_${storFile.project}_${storFile.shortName}`, '.html');
        let model = monaco.editor.getModel(uri);
        if (model) return model;
        if (this.level !== 2) mls.events.fire(2, ['CreateModelHTML'] as any, JSON.stringify(storFile));
        return model;
    }

    private async setModel(storFile: mls.stor.IFileInfo) {
        const model = await this.createModelIfNeeded(storFile);
        if (!this._ed1 || !model) return;
        this._ed1.setModel(model);
    }

    private getUri(shortFN: string, ftype: '.ts' | '.d.ts' | '.html'): monaco.Uri {
        return monaco.Uri.parse(`file://server/${shortFN}${ftype}`);
    }

    private getDarkLight() {
        const theme = localStorage.getItem('_100554_serviceUserSettings_theme') || 'light';
        return theme;
    }

    private async setLanguages() {
        const project = mls.actualProject;
        if (!project) {
            this.languages = {
                'English': { acronym: 'en', name: 'English' }
            }
        } else {
            const config = await getConfigProject(project);

            if (!config || !config.languages || config.languages.length === 0) {
                this.languages = {
                    'English': { acronym: 'en', name: 'English' }
                }
            } else {
                config.languages.forEach((entry, index) => {
                    this.languages[`${entry.name}`] = {
                        acronym: entry.language,
                        name: entry.name,
                    }
                });
            }
        }

        const languagesOptions = Object.keys(this.languages).map((lg) => {
            const obj = this.languages[lg];
            const newOpt: IOptions = {
                text: obj.name,
                class: `collab-flags ${obj.acronym}`
            }
            return newOpt;
        });

        if (this.menu.tools.languages) this.menu.tools.languages.options = languagesOptions;
        if (this.menu.refresh) this.menu.refresh();
    }

    private async setTheme() {

        const project = mls.actualProject;
        if (!project) return;
        const tokens = await getTokens(project)
        this.themes = tokens.map((item) => item.themeName);
        const themesOptions = this.themes.map((th) => {
            const newOpt: IOptions = {
                text: th,
            }
            return newOpt;
        });

        if (this.menu.tools.theme) this.menu.tools.theme.options = themesOptions;
        if (this.menu.refresh) this.menu.refresh();
    }

    private createTestElement() {
        const testResultEl = document.createElement('collab-result-container-100554');
        const testResultElActions = document.createElement('div');
        const actionClose = document.createElement('i');
        actionClose.className = 'fa fa-times';
        actionClose.style.color = '#000000';
        actionClose.onclick = () => {
            this.closeTestResults();
        }
        testResultElActions.appendChild(actionClose);
        testResultEl.style.display = this.enabledTest ? 'block' : 'none';
        testResultEl.appendChild(testResultElActions);

        return testResultEl;
    }

    private async fireWcdChanges() {
        const iframe = window.preview.iframe;
        if (!iframe) return;
        const wcd = iframe.contentDocument?.body.querySelector('wcd-toolbox-100554') as any;
        if (!wcd) return;
        await wcd.beforeDelete();
        return;
    }

    private requestUpdateAllIcaComponentsInPage() {
        if (!window.preview.iframe) throw new Error('Preview no created yet');
        const body = window.preview.iframe
            ?.contentDocument
            ?.querySelector('body');

        if (!body) return;
        const elements = this.findAllElementsIca(body)
        if (!elements) return;

        elements.forEach((el) => {
            if (el.tagName.split('-').length > 1 && (el as StateLitElement).globalVariation !== undefined) {
                (el as StateLitElement).globalVariation = globalState.globalVariation;
            }
        });
    }

    private findAllElementsIca(el: HTMLElement): HTMLElement[] {
        let elements: HTMLElement[] = [];
        let elToSearch: Element | ShadowRoot = el;

        function traverseShadowRoot(element: HTMLElement) {

            if (element.tagName.toLowerCase().startsWith('ica')) {
                elements.push(element);
                return;
            }
            if (element.shadowRoot) {
                element.shadowRoot.querySelectorAll('*').forEach((item) => {
                    traverseShadowRoot(item as HTMLElement);
                });
            } else {
                const children = Array.from(element.children);
                if (children.length > 0) {
                    children.forEach(child => traverseShadowRoot(child as HTMLElement));
                }
            }
        }

        if (el.shadowRoot) elToSearch = el.shadowRoot;
        elToSearch.querySelectorAll('*').forEach((item) => {
            traverseShadowRoot(item as HTMLElement);
        });

        return elements;
    }


    getScriptTest(ica: CollabState): { func: string, exe: any } | undefined {

        const stateHistories = ica.getHistory();
        if (stateHistories.length <= 0) return undefined;

        const params: Record<string, IParams> = {};
        const keysCont: Record<string, number> = {};

        let lastParam = '';

        stateHistories.forEach((stateHistory, index) => {

            const paramKey = stateHistory.key.split('.').pop();
            const paramType = typeof stateHistory.value;
            const paramValue = this.processValue(stateHistory.value);

            if (!paramKey) return;
            if (stateHistory.system) {
                lastParam = paramKey;
                return;
            }

            let resultKey = paramKey;
            if (!keysCont[paramKey]) keysCont[paramKey] = 0;

            if (params[paramKey] && lastParam && lastParam !== resultKey) {
                keysCont[paramKey] += 1;
                resultKey = `${paramKey}_${keysCont[paramKey]}`;
            }

            params[resultKey] = {
                paramValue,
                paramType,
                paramOri: stateHistory.key,
                history: stateHistory
            };


            (stateHistory as any).paramKey = resultKey;
            lastParam = resultKey;

        });


        const lines: string[] = [];

        let lastPath = '';
        let lastKey = '';

        let lastInteraction = '';
        let lastIndex = -1;


        stateHistories.forEach((history) => {

            const interationType = history.system ? "System" : "User";
            const vl = this.processValue(history.value);
            let row = '';

            if (!history.system) {

                const param = this.getParam(params, (history as any).paramKey);
                if (!param) return;
                row = `setState('${history.key}', args.${param})`;

            } else {

                row = `verifyState('${history.key}', ${vl})`;
                if (typeof vl === "string") row = `verifyState('${history.key}', '${vl}')`;
            }

            if (lastInteraction === interationType && lastPath === history.key && lastKey === (history as any).paramKey && lastIndex >= 0) {

                lines[lastIndex] = row;

            } else {
                lines.push(row);
                lastInteraction = interationType;
                lastPath = history.key;
                lastKey = (history as any).paramKey;
                lastIndex = lines.length - 1;
            }

        });

        const exe: any = {
            functionName: '',
            description: '',
            page: '',
            enabled: true,
            schema: {}
        };

        Object.keys(params).forEach((k) => {

            const p = params[k];
            if (!p) return;
            exe.schema[k] = { type: p.paramType, value: p.paramValue };

        });

        let name = '';
        if (mls.actual[2]) name = (mls.actual[2] as any).left.shortName;
        if (name !== '') name = `watchState('[pathTo].labelError', '[Expected Value]');`;

        const func = `export function @funcname(args: Record<string, any>): string {\n${name}\n${lines.join(';\n')}\nreturn 'ok';\n}`

        return { func, exe };

    }

    getParam(params: any, key: string) {
        const keys = Object.keys(params);
        let ret = '';
        keys.forEach((i) => {
            if (i !== key) return;
            ret = i;
        });
        return ret;
    }

    processValue(vl: any): string | number {
        if (typeof vl === "string" || typeof vl === "number") {
            return vl;
        }
        return JSON.stringify(vl);
    }


    // Title changes

    private async preview(mode: string) {
        const actual = mls.actual[mls.actualLevel];
        switch (actual.level) {
            case 2:
                this.previewL2(mode)
                break;
            case 3:
                this.previewByLevel(mode, actual.level)
                break;
            case 4:
                this.previewByLevel(mode, actual.level)
                break;
            case 5:
                this.previewByLevel(mode, actual.level)
                break;
            case 6:
                this.previewByLevel(mode, actual.level)
                break;
            case 7:
                this.previewByLevel(mode, actual.level)
                break;

        }

    }


    private previewL2(mode: string) {
        if (!mls.actual[2].left) {
            this.clearPreview();
            return;
        }
        const { project, shortName, folder } = mls.actual[2].left;
        const fullname = createPath(project, shortName, folder);
        this.createPreview(mode, fullname);
    }

    private previewByLevel(mode: string, level: number) {
        if (!mls.actual[level]) {
            this.clearPreview();
            return;
        };
        const { project, path } = mls.actual[level];
        if (!project || !path) {
            this.clearPreview();
            return;
        };
        const fullname = `${ project }_${path}`;
        this.createPreview(mode, fullname);
    }

    private clearPreview() {
        if (this.previewContent) {
            this.previewContent.innerHTML = ''
            return;
        }

    }

    private async createPreview(mode: string, fullName: string) {

        if (!fullName || !this.watch) return;
        this.setTitleByLevel();

        if (this.menu.updateTitle) this.menu.updateTitle();
        await this.fireWcdChanges();

        this.lastModePreview = mode;
        this.lastLevel = this.level;
        this.page = fullName;

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';


        if (mode === 'insights') {
            const insights = document.createElement('plugin-preview-insights-100554');
            container.appendChild(insights);
            insights.setAttribute('page', fullName);
            insights.setAttribute('level', this.level.toString());
            this.configureButtonsRight(false);

        } else {
            const doc = document.createElement('service-preview-view-100554');
            doc.setAttribute('page', fullName);
            doc.setAttribute('level', this.level.toString());
            doc.setAttribute('mode', mode);
            doc.setAttribute('actualtheme', this.actualTheme);
            doc.setAttribute('lang', this.lang);
            doc.style.flex = '1';
            (doc as any).father = this;
            this.elPreview = doc;
            container.appendChild(doc);

            const consoleEl = document.createElement('collab-console-100554');
            consoleEl.setAttribute('mode', 'disabled');
            consoleEl.style.display = this.enabledConsole ? 'block' : 'none';
            container.appendChild(consoleEl);

            const testResultEl = this.createTestElement();
            container.appendChild(testResultEl);

            const iframe = this.querySelector('iframe') as HTMLIFrameElement;
            if (iframe && iframe.contentDocument) iframe.contentDocument.body.innerHTML = '';
            this.configureButtonsRight(true);
            mls.events.fire(3, 'WCDEventChange' as any);
        }

        if (!this.previewContent) return;
        this.previewContent.innerHTML = '';
        this.previewContent.appendChild(container);
        return true;
    }

    private _onClickTitle() {

        const actual = mls.actual[mls.actualLevel];
        switch (actual.level) {
            case 2:
                this.selectLevel(3);
                break;
            case 3:
                this.selectLevel(4);
                break;
            case 4:
                this.selectLevel(5);
                break;
            case 5:
                this.selectLevel(6);
                break;
            case 6:
                this.selectLevel(7);
                break;
            case 7:
                this.selectLevel(4);
                break;
            default:
                break;
        }

    }

    private setTitleByLevel() {

        const actual = mls.actual[mls.actualLevel];
        switch (actual.level) {
            case 2:
                this.menu.title = `< ${mls.actual[3].path || 'No organism selected'}`;
                break;
            case 3:
                this.menu.title = `< ${mls.actual[4].path || 'No page selected'}`;
                break;
            case 4:
                this.menu.title = `< Module`;
                break;
            case 5:
                this.menu.title = `< Project ${mls.actualProject}`;
                break;
            case 6:
                this.menu.title = '< Projects';
                break;
            case 7:
                this.menu.title = `${mls.actual[7].path} >>` || 'No page selected >>';
                break;
            default:
                this.menu.title = '';
                break;
        }

        if (this.menu.updateTitle) this.menu.updateTitle();
    }


}


interface IParams {
    paramValue: string | number,
    paramType: string,
    paramOri: string,
    history: {
        timestamp: number;
        system: boolean;
        key: string;
        value: any;
    }
}

enum ERecord {
    "Stop" = 0,
    "Play" = 1,
}

enum ETestActions {
    "Run" = 0,
    "Delete" = 1,
    "Edit" = 2
}
interface ILanguage {
    [key: string]: { acronym: string, name: string }
}

enum EPreview {
    'icPreviewD' = 0,
    'icPreviewM' = 1,
    'icPreviewI' = 2,
}     