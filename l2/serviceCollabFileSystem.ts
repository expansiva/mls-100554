/// <mls fileReference="_100554_/l2/serviceCollabFileSystem.ts" enhancement="_100554_/l2/enhancementLit" />

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_102027_/l2/serviceBase.js';
import { CollabFsDirectoryHandle, FileSystemAccessAdapter } from '/_100554_/l2/collabFileSystemAccess.js';
import { CollabFileSystemSync, CollabFsChange, CollabFsProgress, CollabFsScanResult } from '/_100554_/l2/collabFileSystemSync.js';
import { openElementInServiceDetails } from '/_100554_/l2/libCommom.js';


/// **collab_i18n_start**
const message_en = {
    title: 'Local FS',
    unsupported: 'Use a Chromium browser for local filesystem access.',
    noProject: 'No project selected.',
    linkTitle: 'Link a local folder',
    linkBody: "Pick an empty folder for this project. Don't reuse a folder that's a git working copy — sync manages files directly.",
    selectFolder: 'Select folder',
    connected: 'Connected',
    project: 'Project',
    folder: 'Folder',
    lastSync: 'Last sync',
    files: 'Files',
    never: 'never',
    changeFolder: 'Change',
    disconnect: 'Disconnect',
    scanChanges: 'Scan changes',
    scanHint: 'Scan to see what to pull or push.',
    scanning: 'Scanning…',
    clean: 'Clean. No changes.',
    rescan: 'Scan again',
    toPull: 'to pull',
    toPush: 'to push',
    conflictsLabel: 'conflict',
    groupBrowser: 'From browser — Pull to apply',
    groupDisk: 'From disk — Push to apply',
    groupConflict: 'Conflicts — kept on disk',
    groupSkipped: 'Skipped',
    bAdded: 'added',
    bChanged: 'changed',
    bDeleted: 'deleted',
    bNew: 'new',
    bConflict: 'conflict',
    bSkipped: 'skipped',
    pull: 'Pull',
    push: 'Push',
    pushBlocked: 'Push blocked. Pull to FS first.',
    confirmPullTitle: 'Pull to FS',
    confirmPushTitle: 'Push to Browser',
    cWrite: 'written to disk from the browser',
    cTrash: 'moved to .collab-fs-trash',
    cConflictKept: 'conflict(s) kept untouched',
    cKeepLocal: 'new local file(s) kept',
    cCreate: 'created in the browser',
    cUpdate: 'updated in the browser',
    cDelete: 'deleted in the browser',
    confirm: 'Confirm',
    cancel: 'Cancel',
    folderLinked: 'Folder linked. Scan to see changes.',
    pullCanceled: 'Pull canceled.',
    pushCanceled: 'Push canceled.',
    nothingToPull: 'Nothing to pull.',
    nothingToPush: 'Nothing to push.',
    disconnected: 'Folder disconnected.',
    resWritten: 'written',
    resTrashed: 'trashed',
    resSkipped: 'skipped',
    resCreated: 'created',
    resUpdated: 'updated',
    resDeleted: 'deleted',
    pBrowser: 'Reading browser',
    pLocal: 'Reading local',
    pCompare: 'Comparing',
    pWrite: 'Writing local',
    pDelete: 'Removing local',
    pPush: 'Loading browser',
    pManifest: 'Updating manifest',
    mSelectFolder: 'Select folder',
    mScan: 'Scan changes',
    mPull: 'Pull to FS',
    mPush: 'Push to Browser',
    mAbout: 'About this content',
};

const message_pt: typeof message_en = {
    title: 'Local FS',
    unsupported: 'Use um navegador Chromium para acessar o sistema de arquivos local.',
    noProject: 'Nenhum projeto selecionado.',
    linkTitle: 'Conectar uma pasta local',
    linkBody: 'Escolha uma pasta vazia para este projeto. Não reutilize uma pasta que seja um repositório git — a sincronização gerencia os arquivos diretamente.',
    selectFolder: 'Selecionar pasta',
    connected: 'Conectado',
    project: 'Projeto',
    folder: 'Pasta',
    lastSync: 'Última sync',
    files: 'Arquivos',
    never: 'nunca',
    changeFolder: 'Trocar',
    disconnect: 'Desconectar',
    scanChanges: 'Verificar mudanças',
    scanHint: 'Verifique para ver o que enviar ou trazer.',
    scanning: 'Verificando…',
    clean: 'Limpo. Sem mudanças.',
    rescan: 'Verificar de novo',
    toPull: 'p/ trazer',
    toPush: 'p/ enviar',
    conflictsLabel: 'conflito',
    groupBrowser: 'Do browser — Pull aplica',
    groupDisk: 'Do disco — Push aplica',
    groupConflict: 'Conflitos — mantidos no disco',
    groupSkipped: 'Ignorados',
    bAdded: 'novo',
    bChanged: 'alterado',
    bDeleted: 'removido',
    bNew: 'novo',
    bConflict: 'conflito',
    bSkipped: 'ignorado',
    pull: 'Pull',
    push: 'Push',
    pushBlocked: 'Push bloqueado. Faça Pull to FS primeiro.',
    confirmPullTitle: 'Pull to FS',
    confirmPushTitle: 'Push to Browser',
    cWrite: 'gravados no disco a partir do browser',
    cTrash: 'movidos para .collab-fs-trash',
    cConflictKept: 'conflito(s) mantidos intactos',
    cKeepLocal: 'arquivo(s) novo(s) locais mantidos',
    cCreate: 'criados no browser',
    cUpdate: 'atualizados no browser',
    cDelete: 'removidos no browser',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    folderLinked: 'Pasta conectada. Verifique as mudanças.',
    pullCanceled: 'Pull cancelado.',
    pushCanceled: 'Push cancelado.',
    nothingToPull: 'Nada para trazer.',
    nothingToPush: 'Nada para enviar.',
    disconnected: 'Pasta desconectada.',
    resWritten: 'gravados',
    resTrashed: 'p/ lixeira',
    resSkipped: 'ignorados',
    resCreated: 'criados',
    resUpdated: 'atualizados',
    resDeleted: 'removidos',
    pBrowser: 'Lendo browser',
    pLocal: 'Lendo local',
    pCompare: 'Comparando',
    pWrite: 'Gravando local',
    pDelete: 'Removendo local',
    pPush: 'Carregando browser',
    pManifest: 'Atualizando manifesto',
    mSelectFolder: 'Selecionar pasta',
    mScan: 'Verificar mudanças',
    mPull: 'Pull to FS',
    mPush: 'Push to Browser',
    mAbout: 'Sobre este conteúdo',
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt,
};
/// **collab_i18n_end**

const PREF_KEY = 'serviceCollabFileSystem100554';

const BROWSER_KINDS: CollabFsChange['kind'][] = ['browserOnly', 'browserModified', 'browserDeleted'];
const DISK_KINDS: CollabFsChange['kind'][] = ['diskOnly', 'localOnly', 'diskModified', 'diskDeleted'];
const CONFLICT_KINDS: CollabFsChange['kind'][] = ['bothModified', 'modified'];
const SKIPPED_KINDS: CollabFsChange['kind'][] = ['unsupported'];

type PendingConfirm =
    | { kind: 'pull'; pull: ReturnType<CollabFileSystemSync['planPull']> }
    | { kind: 'push'; push: ReturnType<CollabFileSystemSync['planPush']> };

@customElement('service-collab-file-system-100554')
export class ServiceCollabFileSystem100554 extends ServiceBase {

    @state() private supported = true;
    @state() private busy = false;
    @state() private project = 0;
    @state() private folderName = '';
    @state() private statusMessage = '';
    @state() private progressMessage = '';
    @state() private changes: CollabFsChange[] = [];
    @state() private selectedPath = '';
    @state() private scanResult: CollabFsScanResult | null = null;
    @state() private scanned = false;
    @state() private detailsOpen = false;
    @state() private pendingConfirm: PendingConfirm | null = null;
    @state() private lastSyncAt = '';
    @state() private linkedFileCount = 0;

    private msg: MessageType = messages['en'];
    private adapter = new FileSystemAccessAdapter();
    private sync = new CollabFileSystemSync(this.adapter);
    private handle: CollabFsDirectoryHandle | null = null;
    private lastProgressAt = 0;

    public details: IService = {
        icon: '&#xf07b',
        state: 'foreground',
        position: 'left',
        tooltip: 'Local FS',
        visible: true,
        widget: '_100554_serviceCollabFileSystem',
        level: [5]
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tabs: undefined,
        tools: {},
        onClickMain: this.onClickMain.bind(this),
    }

    constructor() {
        super();
        this.msg = messages[this.getMessageKey(messages)];
        this.menu.main = {
            opSelectFolder: this.msg.mSelectFolder,
            opScan: this.msg.mScan,
            opPull: this.msg.mPull,
            opPush: this.msg.mPush,
            opAboutThis: this.msg.mAbout,
        };
        this.supported = this.adapter.isSupported();
        this.setEvents();
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        await this.loadProjectHandle();
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (!visible) return;
        void this.loadProjectHandle();
    }

    public onClickMain(op: string): void {
        if (op === 'opSelectFolder') void this.selectFolder();
        else if (op === 'opScan') void this.scan();
        else if (op === 'opPull') this.requestPull();
        else if (op === 'opPush') this.requestPush();
        else if (op === 'opAboutThis') this.showAboutThis();
        else if (this.menu.setMode) this.menu.setMode('initial');
    }

    render() {
        const m = this.msg;
        return html`
            <section class="collab-fs-shell">
                <header class="collab-fs-header">
                    <div>
                        <h2>${m.title}</h2>
                        <p>${this.renderHeaderStatus()}</p>
                    </div>
                    <span class="collab-fs-project">mls-${this.project || '-'}</span>
                </header>

                ${this.renderBody()}
                ${this.renderNotice()}
            </section>
        `;
    }

    private renderBody() {
        if (!this.supported || !this.project) return html``;
        if (!this.handle) return this.renderFirstRun();
        return html`
            ${this.renderConnection()}
            ${this.pendingConfirm
                ? this.renderConfirmPanel()
                : (this.scanned ? this.renderScanned() : this.renderScanCta())}
        `;
    }

    private renderFirstRun() {
        const m = this.msg;
        return html`
            <div class="collab-fs-firstrun">
                <i class="collab-fs-firstrun-icon">&#xf07b;</i>
                <p class="collab-fs-firstrun-title">${m.linkTitle}</p>
                <p class="collab-fs-muted">${m.linkBody}</p>
                <button class="primary block" @click=${() => this.selectFolder()} ?disabled=${this.busy}>${m.selectFolder}</button>
            </div>
        `;
    }

    private renderConnection() {
        const m = this.msg;
        return html`
            <div class="collab-fs-connection">
                <div class="collab-fs-connection-row">
                    <span class="collab-fs-dot"></span>
                    <span class="collab-fs-connection-text">mls-${this.project} <span class="arrow">&rarr;</span> ${this.folderName || '-'}</span>
                    <button class="icon" aria-label="${m.connected}" @click=${() => this.detailsOpen = !this.detailsOpen}>
                        ${this.detailsOpen ? '▴' : '▾'}
                    </button>
                </div>
                ${this.detailsOpen ? this.renderDetails() : html``}
            </div>
        `;
    }

    private renderDetails() {
        const m = this.msg;
        return html`
            <div class="collab-fs-details-panel">
                <dl>
                    <div><dt>${m.project}</dt><dd>mls-${this.project}</dd></div>
                    <div><dt>${m.folder}</dt><dd>${this.folderName || '-'}</dd></div>
                    <div><dt>${m.lastSync}</dt><dd>${this.formatLastSync()}</dd></div>
                    <div><dt>${m.files}</dt><dd>${this.scanResult?.browserCount ?? this.linkedFileCount}</dd></div>
                </dl>
                <div class="collab-fs-details-actions">
                    <button @click=${() => this.selectFolder()} ?disabled=${this.busy}>${m.changeFolder}</button>
                    <button class="danger" @click=${() => this.disconnect()} ?disabled=${this.busy}>${m.disconnect}</button>
                </div>
            </div>
        `;
    }

    private renderScanCta() {
        const m = this.msg;
        return html`
            <div class="collab-fs-scan-cta">
                <button class="primary block" @click=${() => this.scan()} ?disabled=${this.busy}>
                    ${this.busy ? m.scanning : m.scanChanges}
                </button>
                <p class="collab-fs-muted center">${m.scanHint}</p>
            </div>
        `;
    }

    private renderScanned() {
        const m = this.msg;
        if (this.changes.length === 0) {
            return html`
                <div class="collab-fs-clean">
                    <p>${m.clean}</p>
                    <button @click=${() => this.scan()} ?disabled=${this.busy}>${m.rescan}</button>
                </div>
            `;
        }

        const pull = this.sync.planPull(this.changes);
        const push = this.sync.planPush(this.changes);
        const pullCount = pull.write.length + pull.delete.length;
        const pushCount = push.create.length + push.update.length + push.delete.length;
        const pushBlocked = push.blocked.length > 0;

        return html`
            <div class="collab-fs-metrics">
                <div><span class="num">${pullCount}</span><span class="lbl">${m.toPull}</span></div>
                <div><span class="num">${pushCount}</span><span class="lbl">${m.toPush}</span></div>
                <div><span class="num">${pull.conflict.length}</span><span class="lbl">${m.conflictsLabel}</span></div>
                <button class="icon rescan" aria-label="${m.rescan}" @click=${() => this.scan()} ?disabled=${this.busy}>&#x21BB;</button>
            </div>

            <div class="collab-fs-list">
                ${this.renderGroup(m.groupBrowser, BROWSER_KINDS)}
                ${this.renderGroup(m.groupDisk, DISK_KINDS)}
                ${this.renderGroup(m.groupConflict, CONFLICT_KINDS)}
                ${this.renderGroup(m.groupSkipped, SKIPPED_KINDS)}
            </div>

            <div class="collab-fs-actions">
                <button class="primary" @click=${() => this.requestPull()} ?disabled=${this.busy || pullCount === 0}>
                    <span class="dir">&darr;</span> ${m.pull} &middot; ${pullCount}
                </button>
                <button @click=${() => this.requestPush()} ?disabled=${this.busy || pushCount === 0 || pushBlocked}>
                    <span class="dir">&uarr;</span> ${m.push} &middot; ${pushCount}
                </button>
            </div>
            ${pushBlocked ? html`<p class="collab-fs-muted center">${m.pushBlocked}</p>` : html``}
        `;
    }

    private renderGroup(title: string, kinds: CollabFsChange['kind'][]) {
        const items = this.changes.filter((change) => kinds.includes(change.kind));
        if (items.length === 0) return html``;
        return html`
            <p class="collab-fs-group-title">${title}</p>
            ${items.map((change) => html`
                <button
                    class="collab-fs-change ${this.selectedPath === change.path ? 'selected' : ''}"
                    @click=${() => this.openChangeDetails(change)}
                >
                    <span class="kind ${this.getBadgeClass(change.kind)}">${this.getBadgeLabel(change.kind)}</span>
                    <span class="path">${change.path}</span>
                    ${CONFLICT_KINDS.includes(change.kind) ? html`<i class="warn">&#x26A0;</i>` : html``}
                </button>
            `)}
        `;
    }

    private renderConfirmPanel() {
        const p = this.pendingConfirm;
        if (!p) return html``;
        const m = this.msg;
        const title = p.kind === 'pull' ? m.confirmPullTitle : m.confirmPushTitle;
        const lines = p.kind === 'pull' ? this.pullConfirmLines(p.pull) : this.pushConfirmLines(p.push);
        return html`
            <div class="collab-fs-confirm">
                <h3>${title}</h3>
                <ul>${lines.map((line) => html`<li>${line}</li>`)}</ul>
                <div class="collab-fs-confirm-actions">
                    <button @click=${() => this.confirmCancel()} ?disabled=${this.busy}>${m.cancel}</button>
                    <button class="primary" @click=${() => this.confirmExecute()} ?disabled=${this.busy}>${m.confirm}</button>
                </div>
            </div>
        `;
    }

    private pullConfirmLines(plan: ReturnType<CollabFileSystemSync['planPull']>): string[] {
        const m = this.msg;
        const lines = [`${plan.write.length} ${m.cWrite}`, `${plan.delete.length} ${m.cTrash}`];
        if (plan.conflict.length) lines.push(`${plan.conflict.length} ${m.cConflictKept}`);
        if (plan.keepLocal.length) lines.push(`${plan.keepLocal.length} ${m.cKeepLocal}`);
        return lines;
    }

    private pushConfirmLines(plan: ReturnType<CollabFileSystemSync['planPush']>): string[] {
        const m = this.msg;
        return [`${plan.create.length} ${m.cCreate}`, `${plan.update.length} ${m.cUpdate}`, `${plan.delete.length} ${m.cDelete}`];
    }

    private renderHeaderStatus() {
        const m = this.msg;
        if (!this.supported) return m.unsupported;
        if (this.busy) return this.progressMessage || this.statusMessage || m.scanning;
        if (!this.project) return m.noProject;
        if (this.folderName) return this.folderName;
        return m.linkTitle;
    }

    private renderNotice() {
        if (!this.statusMessage || this.busy) return html``;
        return html`<div class="collab-fs-notice">${this.statusMessage}</div>`;
    }

    private getBadgeClass(kind: CollabFsChange['kind']): string {
        if (BROWSER_KINDS.includes(kind)) return 'b-browser';
        if (kind === 'diskOnly' || kind === 'localOnly') return 'b-new';
        if (kind === 'diskModified' || kind === 'diskDeleted') return 'b-disk';
        if (CONFLICT_KINDS.includes(kind)) return 'b-conflict';
        return 'b-skip';
    }

    private getBadgeLabel(kind: CollabFsChange['kind']): string {
        const m = this.msg;
        if (kind === 'browserOnly') return m.bAdded;
        if (kind === 'diskOnly' || kind === 'localOnly') return m.bNew;
        if (kind === 'diskDeleted' || kind === 'browserDeleted') return m.bDeleted;
        if (kind === 'diskModified' || kind === 'browserModified') return m.bChanged;
        if (CONFLICT_KINDS.includes(kind)) return m.bConflict;
        return m.bSkipped;
    }

    private openChangeDetails(change: CollabFsChange): void {
        this.selectedPath = change.path;
        const div = document.createElement('div');
        div.className = 'collab-fs-detail-page';
        div.style.padding = '0.75rem';
        div.appendChild(this.createDetailStyle());

        const title = document.createElement('h3');
        title.textContent = change.path;
        div.appendChild(title);

        const meta = document.createElement('div');
        meta.className = 'collab-fs-detail-meta';
        meta.textContent = this.getDetailText(change);
        div.appendChild(meta);

        if (change.kind === 'unsupported') {
            this.appendMuted(div, change.message || 'Unsupported file.');
            this.openDetailsRight(div);
            return;
        }

        if (change.localContent === undefined && change.browserContent === undefined) {
            this.appendMuted(div, 'Diff not loaded. Scan used metadata for speed.');
            this.openDetailsRight(div);
            return;
        }

        if (change.localContent as any instanceof Blob || change.browserContent as any instanceof Blob) {
            this.appendMuted(div, 'Binary file. Text diff is not available.');
            this.openDetailsRight(div);
            return;
        }

        const localContent = typeof change.localContent === 'string' ? change.localContent : '';
        const browserContent = typeof change.browserContent === 'string' ? change.browserContent : '';
        this.openMonacoDiffRight(change, localContent, browserContent);
    }

    private openMonacoDiffRight(change: CollabFsChange, localContent: string, browserContent: string): void {
        const sourceOriginal = this.isDiskSideChange(change) ? browserContent : localContent;
        const sourceModified = this.isDiskSideChange(change) ? localContent : browserContent;
        this.openService('_100554_serviceHistories', 'right', 5);
        void mls.events.fire([5], ['HistoriesSelected' as any], JSON.stringify({
            project: this.project || this.getProject(),
            level: 5,
            shortName: 'collabFileSystem',
            folder: '',
            extension: this.getExtensionFromPath(change.path),
            position: 'left',
            hashOriginal: '',
            hashModified: '',
            sourceOriginal,
            sourceModified,
            language: this.getLanguageFromPath(change.path),
        }), 0);
    }

    private isDiskSideChange(change: CollabFsChange): boolean {
        return change.kind === 'diskOnly' ||
            change.kind === 'diskModified' ||
            change.kind === 'diskDeleted' ||
            change.kind === 'localOnly';
    }

    private getExtensionFromPath(path: string): string {
        const known = ['.defs.ts', '.test.ts', '.tsx', '.ts', '.html', '.less', '.css', '.json', '.md', '.js', '.jsx', '.vue', '.sql', '.txt', '.style', '.svg'];
        return known.find((extension) => path.endsWith(extension)) || '.txt';
    }

    private getLanguageFromPath(path: string): string {
        const extension = this.getExtensionFromPath(path);
        if (extension === '.ts' || extension === '.tsx' || extension === '.defs.ts' || extension === '.test.ts') return 'typescript';
        if (extension === '.js' || extension === '.jsx') return 'javascript';
        if (extension === '.html' || extension === '.vue') return 'html';
        if (extension === '.less') return 'less';
        if (extension === '.css' || extension === '.style') return 'css';
        if (extension === '.json') return 'json';
        if (extension === '.md') return 'markdown';
        if (extension === '.sql') return 'sql';
        if (extension === '.svg') return 'xml';
        return 'text';
    }

    private openDetailsRight(element: HTMLElement): void {
        this.openService('_100554_serviceDetail', 'right', 5);
        void openElementInServiceDetails(element);
    }

    private createDetailStyle(): HTMLStyleElement {
        const style = document.createElement('style');
        style.textContent = `
            .collab-fs-detail-page {
                box-sizing: border-box;
                color: var(--text-primary-color, inherit);
                height: 100%;
                overflow: auto;
            }
            .collab-fs-detail-page h3 {
                margin: 0 0 0.5rem;
                overflow-wrap: anywhere;
                font-size: 1rem;
            }
            .collab-fs-detail-meta,
            .collab-fs-muted {
                color: var(--text-primary-color-lighter, #8b949e);
                font-size: 0.8rem;
            }
        `;
        return style;
    }

    private appendMuted(container: HTMLElement, text: string): void {
        const p = document.createElement('p');
        p.className = 'collab-fs-muted';
        p.textContent = text;
        container.appendChild(p);
    }

    private getDetailText(change: CollabFsChange): string {
        if (change.kind === 'browserOnly') return 'Pull to FS creates this file locally.';
        if (change.kind === 'localOnly' || change.kind === 'diskOnly') return 'Push to Browser creates this file in the browser.';
        if (change.kind === 'diskDeleted') return 'Push to Browser marks this file deleted in the browser. Pull to FS restores it locally.';
        if (change.kind === 'browserDeleted') return 'Browser deleted this file. Push is blocked until Pull to FS or conflict resolution.';
        if (change.kind === 'diskModified') return 'Push to Browser imports the local file.';
        if (change.kind === 'browserModified') return 'Browser changed this file. Push is blocked until Pull to FS.';
        if (change.kind === 'bothModified') return 'Both sides changed. Push is blocked for this conflict.';
        return 'Pull to FS replaces the local file with the browser version.';
    }

    private async selectFolder(): Promise<void> {
        await this.runExclusive(async () => {
            const project = this.getProject();
            if (!project) throw new Error(this.msg.noProject);
            if (!this.supported) throw new Error(this.msg.unsupported);

            const selectedHandle = await this.adapter.showDirectoryPicker();
            if (!await this.adapter.ensurePermission(selectedHandle)) throw new Error('Folder permission was not granted.');
            const handle = await this.resolveSelectedProjectHandle(project, selectedHandle);
            if (!await this.adapter.ensurePermission(handle)) throw new Error('Folder permission was not granted.');

            this.folderName = handle.name;
            this.reportProgress({ phase: 'local', current: 0, path: handle.name });
            const validation = await this.sync.validateFirstSync(project, handle, this.reportProgress.bind(this));
            if (!validation.empty) await this.sync.ensureManifest(project, handle, this.reportProgress.bind(this));
            if (selectedHandle.name === 'mls-base') await this.adapter.saveBaseHandle(selectedHandle);
            await this.adapter.saveHandle(project, handle);

            this.project = project;
            this.handle = handle;
            this.savePreferences(project, handle.name);
            this.resetScanState();
            this.detailsOpen = false;
            await this.refreshManifestInfo();
            this.statusMessage = this.msg.folderLinked;
        });
    }

    private async disconnect(): Promise<void> {
        await this.runExclusive(async () => {
            const project = this.getProject();
            if (project) await this.adapter.removeHandle(project);
            localStorage.removeItem(PREF_KEY);
            this.handle = null;
            this.folderName = '';
            this.detailsOpen = false;
            this.resetScanState();
            this.statusMessage = this.msg.disconnected;
        });
    }

    private async scan(): Promise<void> {
        await this.runExclusive(async () => {
            await this.scanCurrent();
            this.scanned = true;
        });
    }

    private requestPull(): void {
        if (this.busy || !this.handle || !this.scanned) return;
        const plan = this.sync.planPull(this.changes);
        if (plan.write.length + plan.delete.length === 0) {
            this.statusMessage = this.msg.nothingToPull;
            return;
        }
        this.pendingConfirm = { kind: 'pull', pull: plan };
    }

    private requestPush(): void {
        if (this.busy || !this.handle || !this.scanned) return;
        const plan = this.sync.planPush(this.changes);
        if (plan.blocked.length > 0) {
            this.statusMessage = this.msg.pushBlocked;
            return;
        }
        if (plan.create.length + plan.update.length + plan.delete.length === 0) {
            this.statusMessage = this.msg.nothingToPush;
            return;
        }
        this.pendingConfirm = { kind: 'push', push: plan };
    }

    private confirmCancel(): void {
        const kind = this.pendingConfirm?.kind;
        this.pendingConfirm = null;
        this.statusMessage = kind === 'pull' ? this.msg.pullCanceled : this.msg.pushCanceled;
    }

    private async confirmExecute(): Promise<void> {
        const pending = this.pendingConfirm;
        if (!pending) return;
        this.pendingConfirm = null;
        if (pending.kind === 'pull') await this.runPull();
        else await this.runPush();
    }

    private async runPull(): Promise<void> {
        await this.runExclusive(async () => {
            const project = this.getProject();
            if (!project) throw new Error(this.msg.noProject);
            if (!this.handle) throw new Error('No folder selected.');
            if (!await this.adapter.ensurePermission(this.handle)) throw new Error('Folder permission was not granted.');

            const result = await this.sync.pullToFs(project, this.handle, this.reportProgress.bind(this));
            await mls.events.fire([5], ['CollabFileSystem' as any], JSON.stringify({
                action: 'pullToFs',
                project,
                written: result.written,
                deleted: result.deleted,
                skipped: result.skipped,
            }), 0);
            await this.scanCurrent();
            const m = this.msg;
            this.statusMessage = `${result.written} ${m.resWritten} · ${result.deleted} ${m.resTrashed} · ${result.skipped} ${m.resSkipped}`;
        });
    }

    private async runPush(): Promise<void> {
        await this.runExclusive(async () => {
            const project = this.getProject();
            if (!project) throw new Error(this.msg.noProject);
            if (!this.handle) throw new Error('No folder selected.');
            if (!await this.adapter.ensurePermission(this.handle)) throw new Error('Folder permission was not granted.');

            const result = await this.sync.pushToBrowser(project, this.handle, this.reportProgress.bind(this));
            await mls.events.fire([5], ['CollabFileSystem' as any], JSON.stringify({
                action: 'pushToBrowser',
                project,
                created: result.created,
                updated: result.updated,
                deleted: result.deleted,
                skipped: result.skipped,
            }), 0);
            await this.scanCurrent();
            const m = this.msg;
            this.statusMessage = `${result.created} ${m.resCreated} · ${result.updated} ${m.resUpdated} · ${result.deleted} ${m.resDeleted} · ${result.skipped} ${m.resSkipped}`;
        });
    }

    private async scanCurrent(): Promise<void> {
        const project = this.getProject();
        if (!project) throw new Error(this.msg.noProject);
        if (!this.handle) throw new Error('No folder selected.');
        if (!await this.adapter.ensurePermission(this.handle)) throw new Error('Folder permission was not granted.');

        this.project = project;
        const result = await this.sync.scan(project, this.handle, this.reportProgress.bind(this));
        this.scanResult = result;
        this.changes = result.changes;
        this.selectedPath = this.changes[0]?.path || '';
        this.lastSyncAt = new Date().toISOString();
        this.statusMessage = '';
    }

    private async loadProjectHandle(): Promise<void> {
        const previousProject = this.project;
        const project = this.getProject();
        this.supported = this.adapter.isSupported();

        if (!this.supported) {
            this.statusMessage = this.msg.unsupported;
            return;
        }

        if (project !== previousProject) this.resetScanState();
        this.project = project;

        if (!project) {
            this.statusMessage = this.msg.noProject;
            return;
        }

        const handle = await this.getStoredProjectHandle(project);
        this.handle = handle;
        this.folderName = handle?.name || this.readPreferences(project)?.folderName || '';
        if (!handle) {
            this.resetScanState();
            return;
        }
        await this.refreshManifestInfo();
    }

    private resetScanState(): void {
        this.scanned = false;
        this.changes = [];
        this.scanResult = null;
        this.selectedPath = '';
        this.pendingConfirm = null;
        this.lastSyncAt = '';
        this.linkedFileCount = 0;
    }

    private async refreshManifestInfo(): Promise<void> {
        if (!this.handle) return;
        const manifest = await this.sync.readManifest(this.handle).catch(() => null);
        if (!manifest) return;
        this.lastSyncAt = manifest.lastSyncAt || '';
        this.linkedFileCount = Object.keys(manifest.files || {}).length;
    }

    private formatLastSync(): string {
        if (!this.lastSyncAt) return this.msg.never;
        const date = new Date(this.lastSyncAt);
        if (Number.isNaN(date.getTime())) return this.msg.never;
        return date.toLocaleString();
    }

    private async resolveSelectedProjectHandle(project: number, handle: CollabFsDirectoryHandle): Promise<CollabFsDirectoryHandle> {
        if (handle.name !== 'mls-base') return handle;
        return handle.getDirectoryHandle(`mls-${project}`, { create: true });
    }

    private async getStoredProjectHandle(project: number): Promise<CollabFsDirectoryHandle | null> {
        const projectHandle = await this.adapter.getHandle(project);
        if (projectHandle) return projectHandle;

        const baseHandle = await this.adapter.getBaseHandle();
        if (!baseHandle || !await this.adapter.ensurePermission(baseHandle)) return null;
        const expectedName = `mls-${project}`;
        const handle = await baseHandle.getDirectoryHandle(expectedName, { create: false }).catch(() => null);
        if (!handle) return null;
        await this.adapter.saveHandle(project, handle);
        this.savePreferences(project, handle.name);
        return handle;
    }

    private getProject(): number {
        return mls.actualProject || 0;
    }

    private savePreferences(project: number, folderName: string): void {
        localStorage.setItem(PREF_KEY, JSON.stringify({ project, folderName, updatedAt: new Date().toISOString() }));
    }

    private readPreferences(project: number): { project: number, folderName: string } | null {
        const raw = localStorage.getItem(PREF_KEY);
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw);
            return parsed.project === project ? parsed : null;
        } catch (err) {
            return null;
        }
    }

    private async runExclusive(action: () => Promise<void>): Promise<void> {
        if (this.busy) return;
        this.busy = true;
        this.progressMessage = '';
        this.lastProgressAt = 0;
        try {
            await action();
        } catch (err) {
            this.statusMessage = err instanceof Error ? err.message : String(err);
        } finally {
            this.progressMessage = '';
            this.busy = false;
        }
    }

    private reportProgress(progress: CollabFsProgress): void {
        const now = Date.now();
        if (now - this.lastProgressAt < 100 && progress.current !== progress.total) return;
        this.lastProgressAt = now;
        this.progressMessage = this.formatProgress(progress);
        this.statusMessage = this.progressMessage;
    }

    private formatProgress(progress: CollabFsProgress): string {
        const m = this.msg;
        const count = progress.total ? `${progress.current}/${progress.total}` : `${progress.current}`;
        const path = progress.path ? ` - ${progress.path}` : '';
        if (progress.phase === 'browser') return `${m.pBrowser} ${count}${path}`;
        if (progress.phase === 'local') return `${m.pLocal} ${count}${path}`;
        if (progress.phase === 'compare') return `${m.pCompare} ${count}${path}`;
        if (progress.phase === 'write') return `${m.pWrite} ${count}${path}`;
        if (progress.phase === 'delete') return `${m.pDelete} ${count}${path}`;
        if (progress.phase === 'push') return `${m.pPush} ${count}${path}`;
        return `${m.pManifest} ${count}${path}`;
    }

    private setEvents(): void {
        mls.events.addEventListener([5], ['ProjectSelected' as any], () => this.loadProjectHandle());
        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected' as any], () => {
            if (this.visible === 'true') this.loadProjectHandle();
        });
    }

    private showAboutThis(): boolean {
        const m = this.msg;
        const div = document.createElement('div');
        div.style.padding = '1rem';
        div.innerHTML = `
            <h3>${m.title}</h3>
            <ul>
                <li>${m.project}: mls-${this.project || '-'}</li>
                <li>${m.folder}: ${this.folderName || '-'}</li>
            </ul>
        `;
        if (this.menu.setMode) this.menu.setMode('page', div);
        return true;
    }

}
