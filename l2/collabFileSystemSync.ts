/// <mls fileReference="_100554_/l2/collabFileSystemSync.ts" enhancement="_100554_/l2/enhancementLit" />

export type CollabFsChangeKind = 'browserOnly' | 'localOnly' | 'modified' | 'unsupported';

interface CollabFsFileHandleLike {
    kind: 'file';
    name: string;
    getFile(): Promise<File>;
}

interface CollabFsDirectoryHandle {
    kind: 'directory';
    name: string;
    entries(): AsyncIterableIterator<[string, CollabFsDirectoryHandle | CollabFsFileHandleLike]>;
}

interface CollabFsLocalFile {
    path: string;
    content?: string;
    size: number;
    lastModified: number;
}

interface CollabFsAccessProgress {
    current: number;
    path: string;
}

export interface CollabFsManifest {
    schemaVersion: 1;
    project: number;
    selectedAt: string;
    lastSyncAt: string;
    syncMode: 'manual';
    files: Record<string, CollabFsManifestFile>;
}

export interface CollabFsManifestFile {
    path: string;
    versionRef: string;
    browserHash?: string;
    diskHash?: string;
    diskSize?: number;
    diskLastModified?: number;
    lastDirection: 'browser-to-fs' | 'linked';
}

export interface CollabFsBrowserEntry {
    path: string;
    key: string;
    file: mls.stor.IFileInfo;
    content?: string;
    hash?: string;
    versionRef: string;
    unsupported: boolean;
}

export interface CollabFsLocalEntry {
    path: string;
    content?: string;
    hash?: string;
    size: number;
    lastModified: number;
}

export interface CollabFsChange {
    path: string;
    kind: CollabFsChangeKind;
    file?: mls.stor.IFileInfo;
    browserContent?: string;
    localContent?: string;
    browserHash?: string;
    localHash?: string;
    message?: string;
}

export interface CollabFsScanResult {
    project: number;
    browserCount: number;
    localCount: number;
    unsupportedCount: number;
    changes: CollabFsChange[];
    scannedAt: string;
}

export interface CollabFsPullResult {
    written: number;
    deleted: number;
    skipped: number;
    manifest: CollabFsManifest;
}

export interface CollabFsDiffLine {
    type: 'context' | 'added' | 'removed';
    text: string;
}

export interface CollabFsProgress {
    phase: 'browser' | 'local' | 'compare' | 'write' | 'delete' | 'manifest';
    current: number;
    total?: number;
    path?: string;
}

interface CollabFsSyncAdapter {
    listTextFiles(directory: CollabFsDirectoryHandle, onProgress?: (progress: CollabFsAccessProgress) => void, options?: { readContent?: boolean }): Promise<CollabFsLocalFile[]>;
    readTextFile(directory: CollabFsDirectoryHandle, path: string): Promise<string | null>;
    writeTextFile(directory: CollabFsDirectoryHandle, path: string, content: string): Promise<void>;
    removeFile(directory: CollabFsDirectoryHandle, path: string): Promise<void>;
}

const MANIFEST_FILE = '.collab-fs.json';
const KNOWN_EXTENSIONS = [
    '.defs.ts',
    '.test.ts',
    '.tsx',
    '.ts',
    '.html',
    '.less',
    '.css',
    '.json',
    '.md',
    '.js',
    '.jsx',
    '.vue',
    '.sql',
    '.txt',
    '.yml',
    '.yaml',
];

export class CollabFileSystemSync {

    constructor(private adapter: CollabFsSyncAdapter) { }

    public async validateFirstSync(project: number, handle: CollabFsDirectoryHandle, onProgress?: (progress: CollabFsProgress) => void): Promise<void> {
        const manifest = await this.readManifest(handle);
        if (manifest) {
            if (manifest.project !== project) {
                throw new Error(`Selected folder belongs to project ${manifest.project}, not ${project}.`);
            }
            return;
        }

        if (handle.name === 'mls-base') {
            throw new Error(`Select the project folder mls-${project}. Selecting mls-base will be supported in a later phase.`);
        }

        const browserEntries = await this.getBrowserEntries(project, onProgress, { readContent: false });
        const allLocalFiles = await this.adapter.listTextFiles(handle, (progress) => {
            onProgress?.({ phase: 'local', current: progress.current, path: progress.path });
        }, { readContent: false });
        const localControlled = await this.getLocalEntriesFromFiles(allLocalFiles, onProgress, { readContent: false });
        const nonControlled = allLocalFiles.filter((file) => file.path !== MANIFEST_FILE && !this.parseLocalPath(file.path, project));

        if (allLocalFiles.filter((file) => file.path !== MANIFEST_FILE).length === 0) return;
        if (nonControlled.length > 0) {
            throw new Error(`Selected folder has files outside the project layout. First link requires an empty or identical folder.`);
        }

        const supportedBrowserEntries = browserEntries.filter((entry) => !entry.unsupported);
        if (localControlled.length !== supportedBrowserEntries.length) {
            throw new Error(`Selected folder has ${localControlled.length} project files, but browser has ${supportedBrowserEntries.length}.`);
        }

        const localMap = this.mapByPath(localControlled);
        for (let i = 0; i < supportedBrowserEntries.length; i++) {
            const browserEntry = await this.hydrateBrowserEntry(supportedBrowserEntries[i]);
            onProgress?.({ phase: 'compare', current: i + 1, total: supportedBrowserEntries.length, path: browserEntry.path });
            const localEntryBase = localMap.get(browserEntry.path);
            const localEntry = localEntryBase ? await this.hydrateLocalEntry(handle, localEntryBase) : undefined;
            if (!localEntry || localEntry.hash !== browserEntry.hash) {
                throw new Error(`Selected folder differs from the opened project at ${browserEntry.path}.`);
            }
        }
    }

    public async ensureManifest(project: number, handle: CollabFsDirectoryHandle, onProgress?: (progress: CollabFsProgress) => void): Promise<CollabFsManifest> {
        const existing = await this.readManifest(handle);
        if (existing && existing.project === project) return existing;

        const browserEntries = await this.getBrowserEntries(project, onProgress, { readContent: false });
        const localEntries = await this.getLocalEntries(handle, onProgress, { readContent: false });
        return this.writeManifest(project, handle, browserEntries, localEntries, 'linked', existing?.selectedAt);
    }

    public async scan(project: number, handle: CollabFsDirectoryHandle, onProgress?: (progress: CollabFsProgress) => void): Promise<CollabFsScanResult> {
        const manifest = await this.readManifest(handle);
        const browserEntries = await this.getBrowserEntries(project, onProgress, { readContent: false });
        const localEntries = await this.getLocalEntries(handle, onProgress, { readContent: false });
        const browserMap = this.mapByPath(browserEntries);
        const localMap = this.mapByPath(localEntries);
        const paths = Array.from(new Set([...browserMap.keys(), ...localMap.keys()])).sort();
        const changes: CollabFsChange[] = [];

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            onProgress?.({ phase: 'compare', current: i + 1, total: paths.length, path });
            const browserEntry = browserMap.get(path);
            const localEntry = localMap.get(path);

            if (browserEntry?.unsupported) {
                changes.push({
                    path,
                    kind: 'unsupported',
                    file: browserEntry.file,
                    message: 'Only text files are supported in this MVP.',
                });
                continue;
            }

            if (browserEntry && !localEntry) {
                changes.push({
                    path,
                    kind: 'browserOnly',
                    file: browserEntry.file,
                    browserContent: browserEntry.content,
                    browserHash: browserEntry.hash,
                });
                continue;
            }

            if (!browserEntry && localEntry) {
                changes.push({
                    path,
                    kind: 'localOnly',
                    localContent: localEntry.content,
                    localHash: localEntry.hash,
                });
                continue;
            }

            if (browserEntry && localEntry && this.isUnchangedByManifest(manifest, browserEntry, localEntry)) {
                continue;
            }

            if (browserEntry && localEntry) {
                const hydratedBrowser = await this.hydrateBrowserEntry(browserEntry);
                const hydratedLocal = await this.hydrateLocalEntry(handle, localEntry);
                if (hydratedBrowser.hash === hydratedLocal.hash) continue;
                changes.push({
                    path,
                    kind: 'modified',
                    file: hydratedBrowser.file,
                    browserContent: hydratedBrowser.content,
                    localContent: hydratedLocal.content,
                    browserHash: hydratedBrowser.hash,
                    localHash: hydratedLocal.hash,
                });
            }
        }

        return {
            project,
            browserCount: browserEntries.filter((entry) => !entry.unsupported).length,
            localCount: localEntries.length,
            unsupportedCount: browserEntries.filter((entry) => entry.unsupported).length,
            changes,
            scannedAt: new Date().toISOString(),
        };
    }

    public async pullToFs(project: number, handle: CollabFsDirectoryHandle, onProgress?: (progress: CollabFsProgress) => void): Promise<CollabFsPullResult> {
        const browserEntries = await this.getBrowserEntries(project, onProgress, { readContent: true });
        const localEntries = await this.getLocalEntries(handle, onProgress, { readContent: false });
        const browserMap = this.mapByPath(browserEntries.filter((entry) => !entry.unsupported));
        let written = 0;
        let deleted = 0;
        let skipped = 0;

        for (let i = 0; i < browserEntries.length; i++) {
            const browserEntry = browserEntries[i];
            if (browserEntry.unsupported) {
                skipped++;
                continue;
            }
            onProgress?.({ phase: 'write', current: written + 1, total: browserEntries.length, path: browserEntry.path });
            await this.adapter.writeTextFile(handle, browserEntry.path, browserEntry.content || '');
            written++;
        }

        const localDeleteEntries = localEntries.filter((localEntry) => !browserMap.has(localEntry.path));
        for (let i = 0; i < localDeleteEntries.length; i++) {
            const localEntry = localDeleteEntries[i];
            onProgress?.({ phase: 'delete', current: i + 1, total: localDeleteEntries.length, path: localEntry.path });
            if (browserMap.has(localEntry.path)) continue;
            await this.adapter.removeFile(handle, localEntry.path).catch(() => undefined);
            deleted++;
        }

        onProgress?.({ phase: 'manifest', current: 1, total: 1, path: MANIFEST_FILE });
        const localAfterPull = await this.getLocalEntries(handle, onProgress, { readContent: false });
        const manifest = await this.writeManifest(project, handle, browserEntries, localAfterPull, 'browser-to-fs');
        return { written, deleted, skipped, manifest };
    }

    public async readManifest(handle: CollabFsDirectoryHandle): Promise<CollabFsManifest | null> {
        const content = await this.adapter.readTextFile(handle, MANIFEST_FILE).catch(() => null);
        if (!content) return null;
        try {
            const parsed = JSON.parse(content) as CollabFsManifest;
            if (parsed.schemaVersion !== 1 || typeof parsed.project !== 'number') return null;
            return parsed;
        } catch (err) {
            return null;
        }
    }

    public buildDiff(localContent: string, browserContent: string, maxLines: number = 500): CollabFsDiffLine[] {
        const oldLines = localContent.split('\n');
        const newLines = browserContent.split('\n');
        const rows = Math.min(oldLines.length + 1, 300);
        const cols = Math.min(newLines.length + 1, 300);

        if (oldLines.length >= rows || newLines.length >= cols) {
            return this.buildSimpleDiff(oldLines, newLines, maxLines);
        }

        const table: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
        for (let i = rows - 2; i >= 0; i--) {
            for (let j = cols - 2; j >= 0; j--) {
                table[i][j] = oldLines[i] === newLines[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
            }
        }

        const result: CollabFsDiffLine[] = [];
        let i = 0;
        let j = 0;
        while (i < oldLines.length && j < newLines.length && result.length < maxLines) {
            if (oldLines[i] === newLines[j]) {
                result.push({ type: 'context', text: oldLines[i] });
                i++;
                j++;
            } else if (table[i + 1]?.[j] >= table[i]?.[j + 1]) {
                result.push({ type: 'removed', text: oldLines[i++] });
            } else {
                result.push({ type: 'added', text: newLines[j++] });
            }
        }
        while (i < oldLines.length && result.length < maxLines) result.push({ type: 'removed', text: oldLines[i++] });
        while (j < newLines.length && result.length < maxLines) result.push({ type: 'added', text: newLines[j++] });
        if (result.length >= maxLines) result.push({ type: 'context', text: '... diff truncated ...' });
        return result;
    }

    private buildSimpleDiff(oldLines: string[], newLines: string[], maxLines: number): CollabFsDiffLine[] {
        const result: CollabFsDiffLine[] = [];
        const max = Math.max(oldLines.length, newLines.length);
        for (let i = 0; i < max && result.length < maxLines; i++) {
            const oldLine = oldLines[i];
            const newLine = newLines[i];
            if (oldLine === newLine) result.push({ type: 'context', text: oldLine || '' });
            else {
                if (oldLine !== undefined) result.push({ type: 'removed', text: oldLine });
                if (newLine !== undefined) result.push({ type: 'added', text: newLine });
            }
        }
        if (result.length >= maxLines) result.push({ type: 'context', text: '... diff truncated ...' });
        return result;
    }

    private async getBrowserEntries(
        project: number,
        onProgress?: (progress: CollabFsProgress) => void,
        options: { readContent?: boolean } = { readContent: true }
    ): Promise<CollabFsBrowserEntry[]> {
        const entries: CollabFsBrowserEntry[] = [];
        const files = Object.values(mls.stor.files)
            .filter((file) => this.isBrowserFileMappable(file, project))
            .sort((a, b) => this.getBrowserPath(a).localeCompare(this.getBrowserPath(b)));

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const path = this.getBrowserPath(file);
            onProgress?.({ phase: 'browser', current: i + 1, total: files.length, path });
            const content = options.readContent ? await this.getBrowserTextContent(file) : undefined;
            const unsupported = typeof content !== 'string';
            const text = typeof content === 'string' ? content : '';
            entries.push({
                path,
                key: mls.stor.getKeyToFile(file),
                file,
                content: options.readContent ? text : undefined,
                hash: options.readContent ? await this.hashContent(text) : undefined,
                versionRef: file.versionRef || '',
                unsupported: options.readContent ? unsupported : false,
            });
        }

        return entries;
    }

    private async getBrowserTextContent(file: mls.stor.IFileInfo): Promise<string | null> {
        const modelBase = mls.editor.getModel(file) as mls.editor.IModelBase | undefined;
        if (modelBase?.model?.getValue) return modelBase.model.getValue();
        const content = await file.getContent('');
        if (content === null || content === undefined) return '';
        if (typeof content === 'string') return content;
        return null;
    }

    private async getLocalEntries(
        handle: CollabFsDirectoryHandle,
        onProgress?: (progress: CollabFsProgress) => void,
        options: { readContent?: boolean } = { readContent: true }
    ): Promise<CollabFsLocalEntry[]> {
        const files = await this.adapter.listTextFiles(handle, (progress) => {
            onProgress?.({ phase: 'local', current: progress.current, path: progress.path });
        }, options);
        return this.getLocalEntriesFromFiles(files, onProgress, options);
    }

    private async getLocalEntriesFromFiles(
        files: CollabFsLocalFile[],
        onProgress?: (progress: CollabFsProgress) => void,
        options: { readContent?: boolean } = { readContent: true }
    ): Promise<CollabFsLocalEntry[]> {
        const entries: CollabFsLocalEntry[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!this.parseLocalPath(file.path, 0)) continue;
            onProgress?.({ phase: 'local', current: i + 1, total: files.length, path: file.path });
            entries.push({
                ...file,
                hash: options.readContent ? await this.hashContent(file.content || '') : undefined,
            });
        }
        return entries;
    }

    private async hydrateBrowserEntry(entry: CollabFsBrowserEntry): Promise<CollabFsBrowserEntry> {
        if (entry.content !== undefined && entry.hash !== undefined) return entry;
        const content = await this.getBrowserTextContent(entry.file);
        const unsupported = typeof content !== 'string';
        const text = typeof content === 'string' ? content : '';
        return {
            ...entry,
            content: text,
            hash: await this.hashContent(text),
            unsupported,
        };
    }

    private async hydrateLocalEntry(handle: CollabFsDirectoryHandle, entry: CollabFsLocalEntry): Promise<CollabFsLocalEntry> {
        if (entry.content !== undefined && entry.hash !== undefined) return entry;
        const content = await this.adapter.readTextFile(handle, entry.path) || '';
        return {
            ...entry,
            content,
            hash: await this.hashContent(content),
        };
    }

    private async writeManifest(
        project: number,
        handle: CollabFsDirectoryHandle,
        browserEntries: CollabFsBrowserEntry[],
        diskEntries: Array<CollabFsBrowserEntry | CollabFsLocalEntry>,
        lastDirection: 'browser-to-fs' | 'linked',
        selectedAt?: string
    ): Promise<CollabFsManifest> {
        const diskMap = this.mapByPath(diskEntries);
        const now = new Date().toISOString();
        const files: Record<string, CollabFsManifestFile> = {};

        for (const browserEntry of browserEntries) {
            if (browserEntry.unsupported) continue;
            const diskEntry = diskMap.get(browserEntry.path);
            files[browserEntry.path] = {
                path: browserEntry.path,
                versionRef: browserEntry.versionRef,
                browserHash: browserEntry.hash,
                diskHash: diskEntry?.hash || '',
                diskSize: 'size' in (diskEntry || {}) ? (diskEntry as CollabFsLocalEntry).size : undefined,
                diskLastModified: 'lastModified' in (diskEntry || {}) ? (diskEntry as CollabFsLocalEntry).lastModified : undefined,
                lastDirection,
            };
        }

        const manifest: CollabFsManifest = {
            schemaVersion: 1,
            project,
            selectedAt: selectedAt || now,
            lastSyncAt: now,
            syncMode: 'manual',
            files,
        };
        await this.adapter.writeTextFile(handle, MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
        return manifest;
    }

    private isBrowserFileMappable(file: mls.stor.IFileInfo, project: number): boolean {
        if (!file || file.project !== project || file.status === 'deleted') return false;
        if (!Number.isInteger(file.level) || file.level < 1 || file.level > 7) return false;
        if (!file.shortName || !file.extension || !file.extension.startsWith('.')) return false;
        return this.isSafeRelativePath(this.getBrowserPath(file));
    }

    private isUnchangedByManifest(
        manifest: CollabFsManifest | null,
        browserEntry: CollabFsBrowserEntry,
        localEntry: CollabFsLocalEntry
    ): boolean {
        const item = manifest?.files[browserEntry.path];
        if (!item) return false;
        if (browserEntry.file.inLocalStorage || browserEntry.file.status !== 'nochange') return false;
        if (mls.editor.getModel(browserEntry.file)) return false;
        if (item.versionRef !== browserEntry.versionRef) return false;
        if (item.diskSize === undefined || item.diskLastModified === undefined) return false;
        return item.diskSize === localEntry.size && item.diskLastModified === localEntry.lastModified;
    }

    private getBrowserPath(file: mls.stor.IFileInfo): string {
        return `l${file.level}/${file.folder ? `${file.folder}/` : ''}${file.shortName}${file.extension}`;
    }

    private parseLocalPath(path: string, project: number): mls.stor.IFileInfoBase | null {
        if (!this.isSafeRelativePath(path) || path === MANIFEST_FILE) return null;
        const parts = path.split('/');
        const levelPart = parts[0];
        if (!/^l[1-7]$/.test(levelPart)) return null;
        const fileName = parts[parts.length - 1];
        const extension = KNOWN_EXTENSIONS.find((ext) => fileName.endsWith(ext));
        if (!extension) return null;
        const shortName = fileName.slice(0, fileName.length - extension.length);
        if (!shortName) return null;
        return {
            project,
            level: Number(levelPart.slice(1)),
            folder: parts.length > 2 ? parts.slice(1, parts.length - 1).join('/') : '',
            shortName,
            extension,
        };
    }

    private isSafeRelativePath(path: string): boolean {
        const parts = path.split('/');
        return Boolean(path) && !path.startsWith('/') && !path.includes('\\') && !parts.some((part) => part === '..' || part === '');
    }

    private mapByPath<T extends { path: string }>(entries: T[]): Map<string, T> {
        return new Map(entries.map((entry) => [entry.path, entry]));
    }

    private async hashContent(content: string): Promise<string> {
        if (globalThis.crypto?.subtle) {
            const data = new TextEncoder().encode(content);
            const digest = await crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
        }

        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            hash = ((hash << 5) - hash + content.charCodeAt(i)) | 0;
        }
        return String(hash);
    }

}
