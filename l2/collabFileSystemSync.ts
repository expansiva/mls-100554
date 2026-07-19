/// <mls fileReference="_100554_/l2/collabFileSystemSync.ts" enhancement="_100554_/l2/enhancementLit" />

import { createStorFile, deleteFile } from '/_102027_/l2/libStor.js';

export type CollabFsChangeKind =
    'browserOnly' |
    'localOnly' |
    'modified' |
    'unsupported' |
    'browserModified' |
    'diskModified' |
    'bothModified' |
    'diskOnly' |
    'diskDeleted' |
    'browserDeleted';

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
    content?: string | Blob;
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
    lastDirection: CollabFsManifestDirection;
}

export interface CollabFsBrowserEntry {
    path: string;
    key: string;
    file: mls.stor.IFileInfo;
    content?: string | Blob;
    hash?: string;
    versionRef: string;
    unsupported: boolean;
}

export interface CollabFsLocalEntry {
    path: string;
    content?: string | Blob;
    hash?: string;
    size: number;
    lastModified: number;
}

export interface CollabFsChange {
    path: string;
    kind: CollabFsChangeKind;
    file?: mls.stor.IFileInfo;
    browserContent?: string | Blob;
    localContent?: string | Blob;
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

export interface CollabFsPushResult {
    created: number;
    updated: number;
    deleted: number;
    skipped: number;
    manifest: CollabFsManifest;
}

export interface CollabFsFirstSyncValidation {
    empty: boolean;
}

export interface CollabFsPullPlan {
    write: string[];
    delete: string[];
    conflict: string[];
    keepLocal: string[];
}

export interface CollabFsPushPlan {
    create: string[];
    update: string[];
    delete: string[];
    blocked: string[];
}

export interface CollabFsDiffLine {
    type: 'context' | 'added' | 'removed';
    text: string;
}

export interface CollabFsProgress {
    phase: 'browser' | 'local' | 'compare' | 'write' | 'delete' | 'push' | 'manifest';
    current: number;
    total?: number;
    path?: string;
}

type CollabFsManifestDirection = 'browser-to-fs' | 'fs-to-browser' | 'linked';

interface CollabFsSyncAdapter {
    listTextFiles(directory: CollabFsDirectoryHandle, onProgress?: (progress: CollabFsAccessProgress) => void, options?: { readContent?: boolean }): Promise<CollabFsLocalFile[]>;
    readTextFile(directory: CollabFsDirectoryHandle, path: string): Promise<string | null>;
    readFileContent(directory: CollabFsDirectoryHandle, path: string): Promise<string | Blob | null>;
    writeFile(directory: CollabFsDirectoryHandle, path: string, content: string | Blob): Promise<CollabFsLocalFile>;
    writeTextFile(directory: CollabFsDirectoryHandle, path: string, content: string): Promise<void>;
    removeFile(directory: CollabFsDirectoryHandle, path: string): Promise<void>;
    trashFile(directory: CollabFsDirectoryHandle, path: string, trashFolder: string): Promise<void>;
}

const MANIFEST_FILE = '.collab-fs.json';
const TRASH_ROOT = '.collab-fs-trash';
const PULL_WRITE_CONCURRENCY = 5;
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
    '.mjs',
    '.js',
    '.jsx',
    '.vue',
    '.sql',
    '.txt',
    '.yml',
    '.yaml',
    '.style',
    '.svg',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.avif',
    '.ico',
    '.ttf',
    '.woff',
    '.woff2',
    '.webm',
    '.mp4',
    '.mov',
];

export class CollabFileSystemSync {

    constructor(private adapter: CollabFsSyncAdapter) { }

    public async validateFirstSync(project: number, handle: CollabFsDirectoryHandle, onProgress?: (progress: CollabFsProgress) => void): Promise<CollabFsFirstSyncValidation> {
        const manifest = await this.readManifest(handle);
        if (manifest) {
            if (manifest.project !== project) {
                throw new Error(`Selected folder belongs to project ${manifest.project}, not ${project}.`);
            }
            return { empty: false };
        }

        if (handle.name === 'mls-base') {
            throw new Error(`Select the project folder mls-${project}. Selecting mls-base will be supported in a later phase.`);
        }

        const allLocalFiles = await this.adapter.listTextFiles(handle, (progress) => {
            onProgress?.({ phase: 'local', current: progress.current, path: progress.path });
        }, { readContent: false });
        const localFilesToValidate = allLocalFiles.filter((file) => this.isProjectLayoutPath(file.path));
        if (localFilesToValidate.length === 0) return { empty: true };

        const localControlled = await this.getLocalEntriesFromFiles(localFilesToValidate, onProgress, { readContent: false });
        const nonControlled = localFilesToValidate.filter((file) => !this.parseLocalPath(file.path, project));

        if (nonControlled.length > 0) {
            throw new Error(
                `Selected folder has files outside the project layout. Expected files like l2/name.ts or l5/project.json. ` +
                `Examples: ${this.formatPathExamples(nonControlled)}. First link requires an empty or identical folder.`
            );
        }

        const browserEntries = await this.getBrowserEntries(project, onProgress, { readContent: false });
        const supportedBrowserEntries = browserEntries.filter((entry) => !entry.unsupported);
        if (localControlled.length !== supportedBrowserEntries.length) {
            const browserPaths = new Set(supportedBrowserEntries.map((entry) => entry.path));
            const localPaths = new Set(localControlled.map((entry) => entry.path));
            const onlyLocal = localControlled.filter((entry) => !browserPaths.has(entry.path));
            const onlyBrowser = supportedBrowserEntries.filter((entry) => !localPaths.has(entry.path));
            throw new Error(
                `Selected folder has ${localControlled.length} project files, but browser has ${supportedBrowserEntries.length}. ` +
                `Only local: ${this.formatPathExamples(onlyLocal)}. Only browser: ${this.formatPathExamples(onlyBrowser)}.`
            );
        }

        const localMap = this.mapByPath(localControlled);
        for (let i = 0; i < supportedBrowserEntries.length; i++) {
            const browserEntry = await this.hydrateBrowserEntry(supportedBrowserEntries[i]);
            onProgress?.({ phase: 'compare', current: i + 1, total: supportedBrowserEntries.length, path: browserEntry.path });
            const localEntryBase = localMap.get(browserEntry.path);
            const localEntry = localEntryBase ? await this.hydrateLocalEntry(handle, localEntryBase) : undefined;
            if (!localEntry || localEntry.hash !== browserEntry.hash) {
                throw new Error(
                    `Selected folder differs from the opened project at ${browserEntry.path}. ` +
                    `Local size: ${localEntry?.size ?? 'missing'}, browser versionRef: ${browserEntry.versionRef || '-'}`
                );
            }
        }

        return { empty: false };
    }

    public async ensureManifest(project: number, handle: CollabFsDirectoryHandle, onProgress?: (progress: CollabFsProgress) => void): Promise<CollabFsManifest> {
        const existing = await this.readManifest(handle);
        if (existing && existing.project === project) return existing;

        const browserEntries = await this.getBrowserEntries(project, onProgress, { readContent: true });
        const localEntries = await this.getLocalEntries(handle, onProgress, { readContent: false });
        return this.writeManifest(project, handle, browserEntries, localEntries, 'linked', existing?.selectedAt);
    }

    public async scan(project: number, handle: CollabFsDirectoryHandle, onProgress?: (progress: CollabFsProgress) => void): Promise<CollabFsScanResult> {
        const manifest = await this.readManifest(handle);
        const browserEntries = await this.getBrowserEntries(project, onProgress, { readContent: false });
        const localEntries = await this.getLocalEntries(handle, onProgress, { readContent: false });
        const browserMap = this.mapByPath(browserEntries);
        const localMap = this.mapByPath(localEntries);
        const manifestPaths = Object.keys(manifest?.files || {});
        const paths = Array.from(new Set([...browserMap.keys(), ...localMap.keys(), ...manifestPaths])).sort();
        const changes: CollabFsChange[] = [];

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            onProgress?.({ phase: 'compare', current: i + 1, total: paths.length, path });
            const browserEntry = browserMap.get(path);
            const localEntry = localMap.get(path);
            const manifestFile = manifest?.files[path];

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
                    kind: manifestFile ? (await this.hasBrowserChangedSinceManifest(manifestFile, browserEntry) ? 'bothModified' : 'diskDeleted') : 'browserOnly',
                    file: browserEntry.file,
                    browserContent: browserEntry.content,
                    browserHash: browserEntry.hash,
                });
                continue;
            }

            if (!browserEntry && localEntry) {
                const localChanged = await this.hasLocalChangedSinceManifest(handle, manifestFile, localEntry);
                changes.push({
                    path,
                    kind: manifestFile ? (localChanged ? 'bothModified' : 'browserDeleted') : 'diskOnly',
                    localContent: localEntry.content,
                    localHash: localEntry.hash,
                });
                continue;
            }

            if (browserEntry && localEntry) {
                if (!manifestFile && this.isUnchangedByManifest(manifest, browserEntry, localEntry)) continue;

                const browserChanged = await this.hasBrowserChangedSinceManifest(manifestFile, browserEntry);
                const localChanged = await this.hasLocalChangedSinceManifest(handle, manifestFile, localEntry);
                if (!browserChanged && !localChanged) continue;

                const hydratedBrowser = await this.hydrateBrowserEntry(browserEntry);
                const hydratedLocal = await this.hydrateLocalEntry(handle, localEntry);
                if (hydratedBrowser.hash === hydratedLocal.hash) continue;
                changes.push({
                    path,
                    kind: this.getModifiedKind(Boolean(manifestFile), browserChanged, localChanged),
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

    // Classifies scan changes into what a Pull would safely apply vs. keep untouched.
    // write: bring browser version down to disk. delete: browser removed it and disk is unchanged.
    // conflict: disk has local work (or both sides changed) - keep the local file as-is.
    // keepLocal: brand new local file with no browser counterpart - keep it for a later Push.
    // Note: diskDeleted (file removed on disk while the browser stayed unchanged) is intentionally
    // NOT a Pull action - a deletion on disk means "delete it", so it is propagated by Push, and
    // Pull no longer resurrects it. Restoring a deleted file is available per-file in the details.
    public planPull(changes: CollabFsChange[]): CollabFsPullPlan {
        const plan: CollabFsPullPlan = { write: [], delete: [], conflict: [], keepLocal: [] };
        for (const change of changes) {
            if (change.kind === 'browserOnly' || change.kind === 'browserModified') plan.write.push(change.path);
            else if (change.kind === 'browserDeleted') plan.delete.push(change.path);
            else if (change.kind === 'diskModified' || change.kind === 'bothModified' || change.kind === 'modified') plan.conflict.push(change.path);
            else if (change.kind === 'diskOnly' || change.kind === 'localOnly') plan.keepLocal.push(change.path);
        }
        return plan;
    }

    // Classifies scan changes into what a Push would apply. blocked lists browser-side changes
    // that must be pulled first (Push stays blocked while any exist).
    public planPush(changes: CollabFsChange[]): CollabFsPushPlan {
        const plan: CollabFsPushPlan = { create: [], update: [], delete: [], blocked: [] };
        for (const change of changes) {
            if (change.kind === 'diskOnly' || change.kind === 'localOnly') plan.create.push(change.path);
            else if (change.kind === 'diskModified') plan.update.push(change.path);
            else if (change.kind === 'diskDeleted') plan.delete.push(change.path);
            else if (this.isBrowserSideChange(change)) plan.blocked.push(change.path);
        }
        return plan;
    }

    public async pullToFs(project: number, handle: CollabFsDirectoryHandle, onProgress?: (progress: CollabFsProgress) => void): Promise<CollabFsPullResult> {
        // Classify first so we never overwrite locally-changed files or delete brand new local files.
        const scanResult = await this.scan(project, handle, onProgress);
        const plan = this.planPull(scanResult.changes);
        const conflictPaths = new Set(plan.conflict);
        const deletablePaths = new Set(plan.delete);
        // Files deleted on disk are left untouched by Pull (never resurrected); Push propagates them.
        const diskDeletedPaths = scanResult.changes.filter((change) => change.kind === 'diskDeleted').map((change) => change.path);
        const keepPaths = new Set([...conflictPaths, ...diskDeletedPaths]);
        const trashFolder = `${TRASH_ROOT}/${this.buildTrashStamp()}`;

        const manifest = await this.readManifest(handle);
        const browserEntries = await this.getBrowserEntries(project, onProgress, { readContent: false });
        const localEntries = await this.getLocalEntries(handle, onProgress, { readContent: false });
        const localMap = this.mapByPath(localEntries);
        this.applyManifestHashesToLocalMap(manifest, localMap);
        const hydratedBrowserEntries: CollabFsBrowserEntry[] = new Array(browserEntries.length);
        let written = 0;
        let deleted = 0;
        let skipped = 0;

        for (let start = 0; start < browserEntries.length; start += PULL_WRITE_CONCURRENCY) {
            const batch = browserEntries.slice(start, start + PULL_WRITE_CONCURRENCY);
            const batchResult = await Promise.all(batch.map(async (browserEntry, index) => {
                const current = start + index + 1;
                onProgress?.({ phase: 'browser', current, total: browserEntries.length, path: browserEntry.path });
                const localEntry = localMap.get(browserEntry.path);
                const manifestFile = manifest?.files[browserEntry.path];
                // Conflicts and disk-deleted files are kept untouched on disk (never resurrected).
                if (keepPaths.has(browserEntry.path) || this.shouldSkipPullWrite(manifest, browserEntry, localEntry)) {
                    return {
                        browserEntry: this.withManifestBrowserHash(browserEntry, manifestFile),
                        localEntry,
                        written: false,
                        skipped: true,
                    };
                }

                const hydratedEntry = await this.hydrateBrowserEntry(browserEntry);
                if (hydratedEntry.unsupported) {
                    return {
                        browserEntry: hydratedEntry,
                        localEntry,
                        written: false,
                        skipped: true,
                    };
                }

                onProgress?.({ phase: 'write', current, total: browserEntries.length, path: hydratedEntry.path });
                const writtenLocal = await this.adapter.writeFile(handle, hydratedEntry.path, hydratedEntry.content || '');
                return {
                    browserEntry: hydratedEntry,
                    localEntry: {
                        ...writtenLocal,
                        hash: hydratedEntry.hash,
                    },
                    written: true,
                    skipped: false,
                };
            }));

            for (let i = 0; i < batchResult.length; i++) {
                const result = batchResult[i];
                const browserEntry = result.browserEntry;
                hydratedBrowserEntries[start + i] = browserEntry;
                if (result.localEntry) localMap.set(browserEntry.path, result.localEntry);
                if (result.written) written++;
                else if (result.skipped || browserEntry.unsupported) skipped++;
            }
        }

        // Only delete files the browser deleted while the local copy stayed unchanged.
        // New local files (diskOnly) and conflicts are never deleted by a Pull.
        const localDeleteEntries = localEntries.filter((localEntry) => deletablePaths.has(localEntry.path));
        for (let i = 0; i < localDeleteEntries.length; i++) {
            const localEntry = localDeleteEntries[i];
            onProgress?.({ phase: 'delete', current: i + 1, total: localDeleteEntries.length, path: localEntry.path });
            await this.adapter.trashFile(handle, localEntry.path, trashFolder).catch(() => undefined);
            localMap.delete(localEntry.path);
            deleted++;
        }

        onProgress?.({ phase: 'manifest', current: 1, total: 1, path: MANIFEST_FILE });
        // Preserve manifest entries for conflicts and disk-deleted files so they stay detectable next scan.
        const nextManifest = await this.writeManifest(project, handle, hydratedBrowserEntries, Array.from(localMap.values()), 'browser-to-fs', manifest?.selectedAt, { previous: manifest, paths: keepPaths });
        return { written, deleted, skipped, manifest: nextManifest };
    }

    public async pushToBrowser(project: number, handle: CollabFsDirectoryHandle, onProgress?: (progress: CollabFsProgress) => void): Promise<CollabFsPushResult> {
        const scanResult = await this.scan(project, handle, onProgress);
        const blockingChanges = scanResult.changes.filter((change) => this.isBrowserSideChange(change));
        if (blockingChanges.length > 0) {
            throw new Error(`Push blocked. Pull to FS first or resolve browser changes: ${this.formatPathExamples(blockingChanges, 5)}.`);
        }

        const localEntries = await this.getLocalEntries(handle, onProgress, { readContent: false });
        const localMap = this.mapByPath(localEntries);
        const browserEntries = await this.getBrowserEntries(project, onProgress, { readContent: false });
        const browserMap = this.mapByPath(browserEntries.filter((entry) => !entry.unsupported));
        const pushChanges = scanResult.changes.filter((change) => this.isDiskSideChange(change));
        let created = 0;
        let updated = 0;
        let deleted = 0;
        let skipped = 0;

        for (let i = 0; i < pushChanges.length; i++) {
            const change = pushChanges[i];
            onProgress?.({ phase: 'push', current: i + 1, total: pushChanges.length, path: change.path });

            if (change.kind === 'diskDeleted') {
                const browserEntry = browserMap.get(change.path);
                if (!browserEntry) {
                    skipped++;
                    continue;
                }
                await deleteFile(browserEntry.file);
                this.fireBrowserFileChanged(browserEntry.file);
                deleted++;
                continue;
            }

            const localEntryBase = localMap.get(change.path);
            if (!localEntryBase) {
                skipped++;
                continue;
            }

            const localEntry = await this.hydrateLocalEntry(handle, localEntryBase);
            const browserEntry = browserMap.get(change.path);
            if (browserEntry) {
                await this.updateBrowserFile(browserEntry.file, localEntry.content || '');
                updated++;
                continue;
            }

            await this.createBrowserFile(project, change.path, localEntry.content || '');
            created++;
        }

        onProgress?.({ phase: 'manifest', current: 1, total: 1, path: MANIFEST_FILE });
        const browserEntriesAfterPush = await this.getBrowserEntries(project, onProgress, { readContent: true });
        const localAfterPush = await this.getLocalEntries(handle, onProgress, { readContent: false });
        const manifest = await this.writeManifest(project, handle, browserEntriesAfterPush, localAfterPush, 'fs-to-browser');
        return { created, updated, deleted, skipped, manifest };
    }

    // Resolves a single file by picking a winning side and making the other match it — including
    // deletions. keep='browser' means the browser wins: write its content to disk, or if the browser
    // deleted it, delete the local file too. keep='disk' means the disk wins: push its content to the
    // browser, or if the file was deleted on disk, delete it in the browser. The manifest baseline is
    // updated (or the entry removed on deletion) so the state does not reappear on the next scan.
    public async resolveConflict(
        project: number,
        handle: CollabFsDirectoryHandle,
        path: string,
        keep: 'browser' | 'disk',
        onProgress?: (progress: CollabFsProgress) => void
    ): Promise<void> {
        const browserEntries = await this.getBrowserEntries(project, onProgress, { readContent: false });
        const browserEntry = browserEntries.find((entry) => entry.path === path);
        const localContent = await this.adapter.readFileContent(handle, path).catch(() => null);

        if (keep === 'browser') {
            if (browserEntry) {
                const hydrated = await this.hydrateBrowserEntry(browserEntry);
                if (hydrated.unsupported) throw new Error(`Unsupported file: ${path}`);
                onProgress?.({ phase: 'write', current: 1, total: 1, path });
                const written = await this.adapter.writeFile(handle, path, hydrated.content || '');
                await this.upsertManifestEntry(handle, project, {
                    path,
                    versionRef: hydrated.versionRef,
                    browserHash: hydrated.hash,
                    diskHash: hydrated.hash,
                    diskSize: written.size,
                    diskLastModified: written.lastModified,
                    lastDirection: 'browser-to-fs',
                });
                return;
            }
            // Browser deleted it: mirror the deletion on disk.
            onProgress?.({ phase: 'delete', current: 1, total: 1, path });
            if (localContent !== null) {
                await this.adapter.trashFile(handle, path, `${TRASH_ROOT}/${this.buildTrashStamp()}`).catch(() => undefined);
            }
            await this.removeManifestEntry(handle, path);
            return;
        }

        if (localContent !== null) {
            const diskHash = await this.hashContent(localContent);
            onProgress?.({ phase: 'push', current: 1, total: 1, path });
            let file: mls.stor.IFileInfo;
            if (browserEntry) {
                await this.updateBrowserFile(browserEntry.file, localContent);
                file = browserEntry.file;
            } else {
                file = await this.createBrowserFile(project, path, localContent);
            }
            await this.upsertManifestEntry(handle, project, {
                path,
                versionRef: file.versionRef || '',
                browserHash: diskHash,
                diskHash,
                diskSize: localContent instanceof Blob ? localContent.size : new TextEncoder().encode(localContent).length,
                diskLastModified: Date.now(),
                lastDirection: 'fs-to-browser',
            });
            return;
        }

        // Disk deleted it: mirror the deletion in the browser.
        onProgress?.({ phase: 'push', current: 1, total: 1, path });
        if (browserEntry) {
            await deleteFile(browserEntry.file);
            this.fireBrowserFileChanged(browserEntry.file);
        }
        await this.removeManifestEntry(handle, path);
    }

    private async upsertManifestEntry(handle: CollabFsDirectoryHandle, project: number, entry: CollabFsManifestFile): Promise<void> {
        const existing = await this.readManifest(handle);
        const now = new Date().toISOString();
        const manifest: CollabFsManifest = (existing && existing.project === project)
            ? existing
            : { schemaVersion: 1, project, selectedAt: now, lastSyncAt: now, syncMode: 'manual', files: {} };
        manifest.files[entry.path] = entry;
        manifest.lastSyncAt = now;
        await this.adapter.writeTextFile(handle, MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
    }

    private async removeManifestEntry(handle: CollabFsDirectoryHandle, path: string): Promise<void> {
        const existing = await this.readManifest(handle);
        if (!existing || !existing.files[path]) return;
        delete existing.files[path];
        existing.lastSyncAt = new Date().toISOString();
        await this.adapter.writeTextFile(handle, MANIFEST_FILE, `${JSON.stringify(existing, null, 2)}\n`);
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

    private async hasBrowserChangedSinceManifest(manifestFile: CollabFsManifestFile | undefined, browserEntry: CollabFsBrowserEntry): Promise<boolean> {
        if (!manifestFile) return true;
        const clean = !browserEntry.file.inLocalStorage && browserEntry.file.status === 'nochange';
        // Fast path: same versionRef and a clean file means unchanged.
        if (manifestFile.versionRef === browserEntry.versionRef && clean) return false;
        // No baseline hash to compare against: fall back to the versionRef/status heuristic.
        if (!manifestFile.browserHash) return manifestFile.versionRef !== browserEntry.versionRef || !clean;
        // Otherwise trust content: a versionRef bump alone (common for generated files) is not a change.
        const hydratedBrowser = await this.hydrateBrowserEntry(browserEntry);
        return hydratedBrowser.hash !== manifestFile.browserHash;
    }

    private async hasLocalChangedSinceManifest(
        handle: CollabFsDirectoryHandle,
        manifestFile: CollabFsManifestFile | undefined,
        localEntry: CollabFsLocalEntry | undefined
    ): Promise<boolean> {
        if (!manifestFile) return true;
        if (!localEntry) return true;
        if (manifestFile.diskSize === localEntry.size && manifestFile.diskLastModified === localEntry.lastModified) return false;

        const expectedHash = manifestFile.diskHash || manifestFile.browserHash;
        if (!expectedHash) return false;
        const hydratedLocal = await this.hydrateLocalEntry(handle, localEntry);
        return hydratedLocal.hash !== expectedHash;
    }

    private getModifiedKind(hasManifest: boolean, browserChanged: boolean, localChanged: boolean): CollabFsChangeKind {
        if (!hasManifest) return 'modified';
        if (browserChanged && localChanged) return 'bothModified';
        if (browserChanged) return 'browserModified';
        return 'diskModified';
    }

    private isBrowserSideChange(change: CollabFsChange): boolean {
        return change.kind === 'browserOnly' ||
            change.kind === 'browserModified' ||
            change.kind === 'browserDeleted' ||
            change.kind === 'bothModified' ||
            change.kind === 'modified';
    }

    private isDiskSideChange(change: CollabFsChange): boolean {
        return change.kind === 'diskOnly' ||
            change.kind === 'diskModified' ||
            change.kind === 'diskDeleted' ||
            change.kind === 'localOnly';
    }

    private applyManifestHashesToLocalMap(manifest: CollabFsManifest | null, localMap: Map<string, CollabFsLocalEntry>): void {
        if (!manifest) return;
        for (const [path, item] of Object.entries(manifest.files)) {
            const localEntry = localMap.get(path);
            if (!localEntry || localEntry.hash) continue;
            localMap.set(path, {
                ...localEntry,
                hash: item.diskHash || item.browserHash,
            });
        }
    }

    private shouldSkipPullWrite(
        manifest: CollabFsManifest | null,
        browserEntry: CollabFsBrowserEntry,
        localEntry: CollabFsLocalEntry | undefined
    ): boolean {
        if (!localEntry) return false;
        return this.isUnchangedByManifest(manifest, browserEntry, localEntry);
    }

    private withManifestBrowserHash(entry: CollabFsBrowserEntry, manifestFile: CollabFsManifestFile | undefined): CollabFsBrowserEntry {
        if (entry.hash || !manifestFile?.browserHash) return entry;
        return {
            ...entry,
            hash: manifestFile.browserHash,
        };
    }

    private async createBrowserFile(project: number, path: string, content: string | Blob): Promise<mls.stor.IFileInfo> {
        const fileBase = this.parseLocalPath(path, project);
        if (!fileBase) throw new Error(`Cannot map local path to browser file: ${path}`);
        if (content instanceof Blob) {
            const file = await mls.stor.addOrUpdateFile({
                project: fileBase.project,
                level: fileBase.level,
                shortName: fileBase.shortName,
                folder: fileBase.folder,
                extension: fileBase.extension,
                versionRef: '0',
            });
            if (!file) throw new Error(`Cannot create browser file: ${path}`);
            file.status = 'new';
            file.updatedAt = new Date().toISOString();
            await mls.stor.localStor.setContent(file, { content, contentType: 'blob' });
            this.fireBrowserFileChanged(file);
            return file;
        }

        const file = await createStorFile({
            project: fileBase.project,
            level: fileBase.level,
            shortName: fileBase.shortName,
            folder: fileBase.folder,
            extension: fileBase.extension,
            source: content,
            status: 'new',
        }, this.shouldCreateModel(fileBase), true, this.shouldCreateModel(fileBase));
        this.fireBrowserFileChanged(file);
        return file;
    }

    private async updateBrowserFile(file: mls.stor.IFileInfo, content: string | Blob): Promise<void> {
        file.status = file.status === 'new' ? 'new' : 'changed';
        file.updatedAt = new Date().toISOString();
        await mls.stor.localStor.setContent(file, { content, contentType: content instanceof Blob ? 'blob' : 'string' });
        if (content instanceof Blob) {
            this.fireBrowserFileChanged(file);
            return;
        }

        const existingModel = mls.editor.getModel(file) as mls.editor.IModelBase | undefined;
        if (existingModel?.model && !existingModel.model.isDisposed()) {
            if (existingModel.model.getValue() !== content) existingModel.model.setValue(content);
            if (this.shouldCreateModel(file)) await this.compileModelIfNeeded(existingModel);
            else mls.editor.forceModelUpdate(existingModel.model);
        } else if (this.shouldCreateModel(file) && file.getOrCreateModel) {
            const model = await file.getOrCreateModel().catch(() => undefined) as mls.editor.IModelBase | undefined;
            if (model?.model && !model.model.isDisposed()) {
                if (model.model.getValue() !== content) model.model.setValue(content);
                await this.compileModelIfNeeded(model);
            }
        }

        this.fireBrowserFileChanged(file);
    }

    private shouldCreateModel(file: mls.stor.IFileInfoBase): boolean {
        return file.level === 2 && file.extension === '.ts';
    }

    private async compileModelIfNeeded(model: mls.editor.IModelBase): Promise<void> {
        if (!this.shouldCreateModel(model.storFile)) return;
        const modelTS = model as mls.editor.IModelTS;
        if (modelTS.compilerResults) modelTS.compilerResults.modelNeedCompile = true;
        const ok = await mls.l2.typescript.compileAndPostProcess(modelTS, true, true);
        model.storFile.hasError = ok === false;
    }

    private fireBrowserFileChanged(file: mls.stor.IFileInfo): void {
        mls.events.fireFileAction('statusOrErrorChanged', file, 'left', 0);
        mls.events.fireFileAction('statusOrErrorChanged', file, 'right', 0);
        mls.events.fireFileAction('editorChanged', file, 'left', 200);
        mls.events.fireFileAction('editorChanged', file, 'right', 200);
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
            const content = options.readContent ? await this.getBrowserContent(file) : undefined;
            const unsupported = options.readContent ? !(typeof content === 'string' || content instanceof Blob) : false;
            const readableContent = typeof content === 'string' || content instanceof Blob ? content : '';
            entries.push({
                path,
                key: mls.stor.getKeyToFile(file),
                file,
                content: options.readContent ? readableContent : undefined,
                hash: options.readContent ? await this.hashContent(readableContent) : undefined,
                versionRef: file.versionRef || '',
                unsupported,
            });
        }

        return entries;
    }

    private async getBrowserContent(file: mls.stor.IFileInfo): Promise<string | Blob | null> {
        const modelBase = mls.editor.getModel(file) as mls.editor.IModelBase | undefined;
        if (modelBase?.model?.getValue) return modelBase.model.getValue();
        const content = await file.getContent('');
        if (content === null || content === undefined) return '';
        if (typeof content === 'string' || content instanceof Blob) return content;
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
        const content = await this.getBrowserContent(entry.file);
        const unsupported = !(typeof content === 'string' || content instanceof Blob);
        const readableContent = typeof content === 'string' || content instanceof Blob ? content : '';
        return {
            ...entry,
            content: readableContent,
            hash: await this.hashContent(readableContent),
            unsupported,
        };
    }

    private async hydrateLocalEntry(handle: CollabFsDirectoryHandle, entry: CollabFsLocalEntry): Promise<CollabFsLocalEntry> {
        if (entry.content !== undefined && entry.hash !== undefined) return entry;
        const content = await this.adapter.readFileContent(handle, entry.path) || '';
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
        lastDirection: CollabFsManifestDirection,
        selectedAt?: string,
        preserve?: { previous: CollabFsManifest | null, paths: Set<string> }
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

        // Keep the prior baseline for preserved paths (conflicts), or drop unmanaged ones,
        // so a freshly recomputed entry can't hide the conflict on the next scan.
        if (preserve) {
            for (const path of preserve.paths) {
                const previousFile = preserve.previous?.files[path];
                if (previousFile) files[path] = previousFile;
                else delete files[path];
            }
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

    private isIgnoredRootFile(path: string): boolean {
        return path === MANIFEST_FILE || path === '.DS_Store';
    }

    private isProjectLayoutPath(path: string): boolean {
        return /^l[1-7]\//.test(path);
    }

    private formatPathExamples(entries: Array<{ path: string }>, limit: number = 8): string {
        if (entries.length === 0) return '-';
        const paths = entries.slice(0, limit).map((entry) => entry.path);
        const suffix = entries.length > limit ? `, ... +${entries.length - limit}` : '';
        return paths.join(', ') + suffix;
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

    private buildTrashStamp(): string {
        return new Date().toISOString().replace(/[:.]/g, '-');
    }

    private async hashContent(content: string | Blob): Promise<string> {
        if (globalThis.crypto?.subtle) {
            const data = content instanceof Blob ? await content.arrayBuffer() : new TextEncoder().encode(content);
            const digest = await crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
        }

        if (content instanceof Blob) return `${content.size}:${content.type}`;
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            hash = ((hash << 5) - hash + content.charCodeAt(i)) | 0;
        }
        return String(hash);
    }

}
