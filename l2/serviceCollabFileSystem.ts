/// <mls fileReference="_100554_/l2/serviceCollabFileSystem.ts" enhancement="_100554_/l2/enhancementLit" />

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_102027_/l2/serviceBase.js';
import { CollabFsDirectoryHandle, FileSystemAccessAdapter } from '/_100554_/l2/collabFileSystemAccess.js';
import { CollabFileSystemSync, CollabFsChange, CollabFsProgress, CollabFsScanResult } from '/_100554_/l2/collabFileSystemSync.js';
import { openElementInServiceDetails } from '/_100554_/l2/libCommom.js';

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
            opPush: 'Push to Browser',
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
        else if (op === 'opPush') void this.pushToBrowser();
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
                    <button class="primary" @click=${() => this.pushToBrowser()} ?disabled=${this.busy || !this.handle || !this.hasPushableChanges() || this.hasPushBlockingChanges()}>Push to Browser</button>
                </div>

                ${this.renderNotice()}
                ${this.renderSummary()}

                <div class="collab-fs-list">
                    ${this.renderChangesList()}
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
                        @click=${() => this.openChangeDetails(change)}
                    >
                        <span class="kind ${change.kind}">${this.getKindLabel(change.kind)}</span>
                        <span class="path">${change.path}</span>
                </button>
            `)}
        `;
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
            .collab-fs-diff {
                overflow: auto;
                margin: 0.75rem 0 0;
                border: 1px solid rgba(128, 128, 128, 0.35);
                background: rgba(128, 128, 128, 0.08);
                color: inherit;
                font-size: 0.8rem;
                line-height: 1.45;
            }
            .collab-fs-diff div {
                display: grid;
                grid-template-columns: 1.5rem minmax(0, 1fr);
                min-height: 1.35rem;
                white-space: pre;
            }
            .collab-fs-diff span {
                user-select: none;
                text-align: center;
            }
            .collab-fs-diff code {
                overflow: visible;
                font-family: monospace;
            }
            .collab-fs-diff .added {
                background: rgba(35, 134, 54, 0.22);
            }
            .collab-fs-diff .removed {
                background: rgba(248, 81, 73, 0.22);
            }
            .collab-fs-diff .added span {
                color: #2ea043;
            }
            .collab-fs-diff .removed span {
                color: #f85149;
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

    private getSelectedChange(): CollabFsChange | undefined {
        return this.changes.find((change) => change.path === this.selectedPath) || this.changes[0];
    }

    private getKindLabel(kind: CollabFsChange['kind']): string {
        if (kind === 'browserOnly') return 'add';
        if (kind === 'localOnly' || kind === 'diskOnly') return 'new';
        if (kind === 'diskDeleted') return 'delete';
        if (kind === 'browserDeleted') return 'browser';
        if (kind === 'diskModified') return 'fs';
        if (kind === 'browserModified') return 'browser';
        if (kind === 'bothModified') return 'conflict';
        if (kind === 'modified') return 'edit';
        return 'skip';
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
            if (!project) throw new Error('No project selected.');
            if (!this.supported) throw new Error('File System Access API is not available in this browser.');

            this.statusMessage = 'Waiting for folder selection.';
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

    private async pushToBrowser(): Promise<void> {
        await this.runExclusive(async () => {
            const project = this.getProject();
            if (!project) throw new Error('No project selected.');
            if (!this.handle) throw new Error('No folder selected.');
            if (!await this.adapter.ensurePermission(this.handle)) throw new Error('Folder permission was not granted.');

            const result = await this.sync.pushToBrowser(project, this.handle, this.reportProgress.bind(this));
            const message = `Push complete. ${result.created} created, ${result.updated} updated, ${result.deleted} deleted, ${result.skipped} skipped.`;
            await mls.events.fire([5], ['CollabFileSystem' as any], JSON.stringify({
                action: 'pushToBrowser',
                project,
                created: result.created,
                updated: result.updated,
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
        this.statusMessage = this.getScanStatusMessage(result);
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

        const handle = await this.getStoredProjectHandle(project);
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
        const count = progress.total ? `${progress.current}/${progress.total}` : `${progress.current}`;
        const path = progress.path ? ` - ${progress.path}` : '';
        if (progress.phase === 'browser') return `Lendo browser ${count}${path}`;
        if (progress.phase === 'local') return `Lendo local ${count}${path}`;
        if (progress.phase === 'compare') return `Comparando ${count}${path}`;
        if (progress.phase === 'write') return `Gravando local ${count}${path}`;
        if (progress.phase === 'delete') return `Removendo local ${count}${path}`;
        if (progress.phase === 'push') return `Carregando browser ${count}${path}`;
        return `Atualizando manifesto ${count}${path}`;
    }

    private getScanStatusMessage(result: CollabFsScanResult): string {
        if (result.changes.length === 0) return 'Clean.';
        if (this.hasPushBlockingChanges() && this.hasPushableChanges()) return 'Changes scanned. Push blocked by browser changes.';
        if (this.hasPushBlockingChanges()) return 'Changes scanned. Pull to FS available.';
        return 'Changes scanned. Push to Browser available.';
    }

    private hasPushableChanges(): boolean {
        return this.changes.some((change) =>
            change.kind === 'diskOnly' ||
            change.kind === 'diskModified' ||
            change.kind === 'diskDeleted' ||
            change.kind === 'localOnly'
        );
    }

    private hasPushBlockingChanges(): boolean {
        return this.changes.some((change) =>
            change.kind === 'browserOnly' ||
            change.kind === 'browserModified' ||
            change.kind === 'browserDeleted' ||
            change.kind === 'bothModified' ||
            change.kind === 'modified'
        );
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
