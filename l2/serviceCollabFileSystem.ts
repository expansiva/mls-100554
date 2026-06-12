/// <mls fileReference="_100554_/l2/serviceCollabFileSystem.ts" enhancement="_100554_/l2/enhancementLit" />

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_102027_/l2/serviceBase.js';
import { CollabFsDirectoryHandle, FileSystemAccessAdapter } from '/_100554_/l2/collabFileSystemAccess.js';
import { CollabFileSystemSync, CollabFsChange, CollabFsDiffLine, CollabFsProgress, CollabFsScanResult } from '/_100554_/l2/collabFileSystemSync.js';

const PREF_KEY = 'serviceCollabFileSystem100554';

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
        main: {
            opSelectFolder: 'Select folder',
            opScan: 'Scan changes',
            opPull: 'Pull to FS',
            opAboutThis: 'About this content',
        },
        tabs: undefined,
        tools: {},
        onClickMain: this.onClickMain.bind(this),
    }

    constructor() {
        super();
        this.supported = this.adapter.isSupported();
        this.setEvents();
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        await this.loadProjectHandle(true);
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (!visible) return;
        void this.loadProjectHandle(true);
    }

    public onClickMain(op: string): void {
        if (op === 'opSelectFolder') void this.selectFolder();
        else if (op === 'opScan') void this.scan();
        else if (op === 'opPull') void this.pullToFs();
        else if (op === 'opAboutThis') this.showAboutThis();
        else if (this.menu.setMode) this.menu.setMode('initial');
    }

    render() {
        return html`
            <section class="collab-fs-shell">
                <header class="collab-fs-header">
                    <div>
                        <h2>Local FS</h2>
                        <p>${this.renderHeaderStatus()}</p>
                    </div>
                    <span class="collab-fs-project">mls-${this.project || '-'}</span>
                </header>

                <div class="collab-fs-actions">
                    <button @click=${() => this.selectFolder()} ?disabled=${this.busy || !this.supported}>Select folder</button>
                    <button @click=${() => this.scan()} ?disabled=${this.busy || !this.handle}>Scan Changes</button>
                    <button class="primary" @click=${() => this.pullToFs()} ?disabled=${this.busy || !this.handle}>Pull to FS</button>
                </div>

                ${this.renderNotice()}
                ${this.renderSummary()}

                <div class="collab-fs-workspace">
                    <div class="collab-fs-list">
                        ${this.renderChangesList()}
                    </div>
                    <div class="collab-fs-details">
                        ${this.renderDetails()}
                    </div>
                </div>
            </section>
        `;
    }

    private renderHeaderStatus() {
        if (!this.supported) return 'Browser unsupported';
        if (this.busy) return this.progressMessage || this.statusMessage || 'Working...';
        if (this.folderName) return this.folderName;
        return 'No folder selected';
    }

    private renderNotice() {
        if (!this.statusMessage) return html``;
        return html`<div class="collab-fs-notice">${this.statusMessage}</div>`;
    }

    private renderSummary() {
        const total = this.changes.length;
        const browserCount = this.scanResult?.browserCount || 0;
        const localCount = this.scanResult?.localCount || 0;
        const unsupportedCount = this.scanResult?.unsupportedCount || 0;
        return html`
            <div class="collab-fs-summary">
                <span>${total} changes</span>
                <span>${browserCount} browser</span>
                <span>${localCount} local</span>
                ${unsupportedCount > 0 ? html`<span>${unsupportedCount} skipped</span>` : html``}
            </div>
        `;
    }

    private renderChangesList() {
        if (!this.handle) return html`<div class="collab-fs-empty">Select a folder.</div>`;
        if (this.busy && this.changes.length === 0) return html`<div class="collab-fs-empty">Scanning...</div>`;
        if (this.changes.length === 0) return html`<div class="collab-fs-empty">No changes.</div>`;

        return html`
            ${this.changes.map((change) => html`
                <button
                    class="collab-fs-change ${this.selectedPath === change.path ? 'selected' : ''}"
                    @click=${() => this.selectedPath = change.path}
                >
                    <span class="kind ${change.kind}">${this.getKindLabel(change.kind)}</span>
                    <span class="path">${change.path}</span>
                </button>
            `)}
        `;
    }

    private renderDetails() {
        const change = this.getSelectedChange();
        if (!change) return html`<div class="collab-fs-empty">Select a file.</div>`;

        if (change.kind === 'unsupported') {
            return html`
                <h3>${change.path}</h3>
                <p class="collab-fs-muted">${change.message}</p>
            `;
        }

        if (change.localContent === undefined && change.browserContent === undefined) {
            return html`
                <h3>${change.path}</h3>
                <div class="collab-fs-detail-meta">${this.getDetailText(change)}</div>
                <p class="collab-fs-muted">Diff not loaded. Scan used metadata for speed.</p>
            `;
        }

        const localContent = change.localContent || '';
        const browserContent = change.browserContent || '';
        const lines = this.sync.buildDiff(localContent, browserContent);

        return html`
            <h3>${change.path}</h3>
            <div class="collab-fs-detail-meta">${this.getDetailText(change)}</div>
            <pre class="collab-fs-diff">${lines.map((line) => this.renderDiffLine(line))}</pre>
        `;
    }

    private renderDiffLine(line: CollabFsDiffLine) {
        const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ';
        return html`<div class="${line.type}"><span>${prefix}</span><code>${line.text || ' '}</code></div>`;
    }

    private getSelectedChange(): CollabFsChange | undefined {
        return this.changes.find((change) => change.path === this.selectedPath) || this.changes[0];
    }

    private getKindLabel(kind: CollabFsChange['kind']): string {
        if (kind === 'browserOnly') return 'add';
        if (kind === 'localOnly') return 'delete';
        if (kind === 'modified') return 'edit';
        return 'skip';
    }

    private getDetailText(change: CollabFsChange): string {
        if (change.kind === 'browserOnly') return 'Pull to FS creates this file locally.';
        if (change.kind === 'localOnly') return 'Pull to FS removes this local file.';
        return 'Pull to FS replaces the local file with the browser version.';
    }

    private async selectFolder(): Promise<void> {
        await this.runExclusive(async () => {
            const project = this.getProject();
            if (!project) throw new Error('No project selected.');
            if (!this.supported) throw new Error('File System Access API is not available in this browser.');

            this.statusMessage = 'Waiting for folder selection.';
            const handle = await this.adapter.showDirectoryPicker();
            if (!await this.adapter.ensurePermission(handle)) throw new Error('Folder permission was not granted.');

            this.folderName = handle.name;
            this.reportProgress({ phase: 'local', current: 0, path: handle.name });
            await this.sync.validateFirstSync(project, handle, this.reportProgress.bind(this));
            await this.sync.ensureManifest(project, handle, this.reportProgress.bind(this));
            await this.adapter.saveHandle(project, handle);

            this.project = project;
            this.handle = handle;
            this.savePreferences(project, handle.name);
            this.statusMessage = 'Folder linked.';
            await this.scanCurrent();
        });
    }

    private async scan(): Promise<void> {
        await this.runExclusive(() => this.scanCurrent());
    }

    private async pullToFs(): Promise<void> {
        await this.runExclusive(async () => {
            const project = this.getProject();
            if (!project) throw new Error('No project selected.');
            if (!this.handle) throw new Error('No folder selected.');
            if (!await this.adapter.ensurePermission(this.handle)) throw new Error('Folder permission was not granted.');

            const result = await this.sync.pullToFs(project, this.handle, this.reportProgress.bind(this));
            const message = `Pull complete. ${result.written} written, ${result.deleted} deleted, ${result.skipped} skipped.`;
            await mls.events.fire([5], ['CollabFileSystem' as any], JSON.stringify({
                action: 'pullToFs',
                project,
                written: result.written,
                deleted: result.deleted,
                skipped: result.skipped,
            }), 0);
            await this.scanCurrent();
            this.statusMessage = message;
        });
    }

    private async scanCurrent(): Promise<void> {
        const project = this.getProject();
        if (!project) throw new Error('No project selected.');
        if (!this.handle) throw new Error('No folder selected.');
        if (!await this.adapter.ensurePermission(this.handle)) throw new Error('Folder permission was not granted.');

        this.project = project;
        const result = await this.sync.scan(project, this.handle, this.reportProgress.bind(this));
        this.scanResult = result;
        this.changes = result.changes;
        this.selectedPath = this.changes[0]?.path || '';
        this.statusMessage = result.changes.length === 0 ? 'Clean.' : 'Changes scanned.';
    }

    private async loadProjectHandle(scanNow: boolean): Promise<void> {
        const project = this.getProject();
        this.project = project;
        this.supported = this.adapter.isSupported();

        if (!this.supported) {
            this.statusMessage = 'Use a Chromium browser for local filesystem access.';
            return;
        }

        if (!project) {
            this.statusMessage = 'No project selected.';
            return;
        }

        const handle = await this.adapter.getHandle(project);
        this.handle = handle;
        this.folderName = handle?.name || this.readPreferences(project)?.folderName || '';
        if (!handle) {
            this.statusMessage = 'No folder selected.';
            this.changes = [];
            this.scanResult = null;
            return;
        }

        if (scanNow) await this.runExclusive(() => this.scanCurrent());
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
        const count = progress.total ? `${progress.current}/${progress.total}` : `${progress.current}`;
        const path = progress.path ? ` - ${progress.path}` : '';
        if (progress.phase === 'browser') return `Lendo browser ${count}${path}`;
        if (progress.phase === 'local') return `Lendo local ${count}${path}`;
        if (progress.phase === 'compare') return `Comparando ${count}${path}`;
        if (progress.phase === 'write') return `Gravando local ${count}${path}`;
        if (progress.phase === 'delete') return `Removendo local ${count}${path}`;
        return `Atualizando manifesto ${count}${path}`;
    }

    private setEvents(): void {
        mls.events.addEventListener([5], ['ProjectSelected' as any], () => this.loadProjectHandle(true));
        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected' as any], () => {
            if (this.visible === 'true') this.loadProjectHandle(false);
        });
    }

    private showAboutThis(): boolean {
        const div = document.createElement('div');
        div.style.padding = '1rem';
        div.innerHTML = `
            <h3>Local FS</h3>
            <ul>
                <li>Project: mls-${this.project || '-'}</li>
                <li>Folder: ${this.folderName || '-'}</li>
                <li>Changes: ${this.changes.length}</li>
            </ul>
        `;
        if (this.menu.setMode) this.menu.setMode('page', div);
        return true;
    }

}
