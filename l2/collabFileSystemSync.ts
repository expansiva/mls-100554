/// <mls fileReference="_100554_/l2/collabFileSystemSync.ts" enhancement="_100554_/l2/enhancementLit" />

import { CollabFsDirectoryHandle, CollabFsLocalFile, FileSystemAccessAdapter } from '/_100554_/l2/collabFileSystemAccess.js';

export type CollabFsChangeKind = 'browserOnly' | 'localOnly' | 'modified' | 'unsupported';

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
    browserHash: string;
    diskHash: string;
    lastDirection: 'browser-to-fs' | 'linked';
}

export interface CollabFsBrowserEntry {
    path: string;
    key: string;
    file: mls.stor.IFileInfo;
    content: string;
    hash: string;
    versionRef: string;
    unsupported: boolean;
}

export interface CollabFsLocalEntry {
    path: string;
    content: string;
    hash: string;
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

    constructor(private adapter: FileSystemAccessAdapter) { }

    public async validateFirstSync(project: number, handle: CollabFsDirectoryHandle): Promise<void> {
        const manifest = await this.readManifest(handle);
        if (manifest) {
            if (manifest.project !== project) {
                throw new Error(`Selected folder belongs to project ${manifest.project}, not ${project}.`);
            }
            return;
        }

        const browserEntries = await this.getBrowserEntries(project);
        const allLocalFiles = await this.adapter.listTextFiles(handle);
        const localControlled = await this.getLocalEntries(handle);
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
        for (const browserEntry of supportedBrowserEntries) {
            const localEntry = localMap.get(browserEntry.path);
            if (!localEntry || localEntry.hash !== browserEntry.hash) {
                throw new Error(`Selected folder differs from the opened project at ${browserEntry.path}.`);
            }
        }
    }

    public async ensureManifest(project: number, handle: CollabFsDirectoryHandle): Promise<CollabFsManifest> {
        const existing = await this.readManifest(handle);
        if (existing && existing.project === project) return existing;

        const browserEntries = await this.getBrowserEntries(project);
        const localEntries = await this.getLocalEntries(handle);
        return this.writeManifest(project, handle, browserEntries, localEntries, 'linked', existing?.selectedAt);
    }

    public async scan(project: number, handle: CollabFsDirectoryHandle): Promise<CollabFsScanResult> {
        const browserEntries = await this.getBrowserEntries(project);
        const localEntries = await this.getLocalEntries(handle);
        const browserMap = this.mapByPath(browserEntries);
        const localMap = this.mapByPath(localEntries);
        const paths = Array.from(new Set([...browserMap.keys(), ...localMap.keys()])).sort();
        const changes: CollabFsChange[] = [];

        for (const path of paths) {
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

            if (browserEntry && localEntry && browserEntry.hash !== localEntry.hash) {
                changes.push({
                    path,
                    kind: 'modified',
                    file: browserEntry.file,
                    browserContent: browserEntry.content,
                    localContent: localEntry.content,
                    browserHash: browserEntry.hash,
                    localHash: localEntry.hash,
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

    public async pullToFs(project: number, handle: CollabFsDirectoryHandle): Promise<CollabFsPullResult> {
        const browserEntries = await this.getBrowserEntries(project);
        const localEntries = await this.getLocalEntries(handle);
        const browserMap = this.mapByPath(browserEntries.filter((entry) => !entry.unsupported));
        let written = 0;
        let deleted = 0;
        let skipped = 0;

        for (const browserEntry of browserEntries) {
            if (browserEntry.unsupported) {
                skipped++;
                continue;
            }
            await this.adapter.writeTextFile(handle, browserEntry.path, browserEntry.content);
            written++;
        }

        for (const localEntry of localEntries) {
            if (browserMap.has(localEntry.path)) continue;
            await this.adapter.removeFile(handle, localEntry.path).catch(() => undefined);
            deleted++;
        }

        const manifest = await this.writeManifest(project, handle, browserEntries, browserEntries, 'browser-to-fs');
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

    private async getBrowserEntries(project: number): Promise<CollabFsBrowserEntry[]> {
        const entries: CollabFsBrowserEntry[] = [];
        const files = Object.values(mls.stor.files)
            .filter((file) => this.isBrowserFileMappable(file, project))
            .sort((a, b) => this.getBrowserPath(a).localeCompare(this.getBrowserPath(b)));

        for (const file of files) {
            const path = this.getBrowserPath(file);
            const content = await this.getBrowserTextContent(file);
            const unsupported = typeof content !== 'string';
            const text = typeof content === 'string' ? content : '';
            entries.push({
                path,
                key: mls.stor.getKeyToFile(file),
                file,
                content: text,
                hash: await this.hashContent(text),
                versionRef: file.versionRef || '',
                unsupported,
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

    private async getLocalEntries(handle: CollabFsDirectoryHandle): Promise<CollabFsLocalEntry[]> {
        const files = await this.adapter.listTextFiles(handle);
        const entries: CollabFsLocalEntry[] = [];
        for (const file of files) {
            if (!this.parseLocalPath(file.path, 0)) continue;
            entries.push({
                ...file,
                hash: await this.hashContent(file.content),
            });
        }
        return entries;
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
