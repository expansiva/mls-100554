/// <mls fileReference="_100554_/l2/collabFileSystemAccess.ts" enhancement="_100554_/l2/enhancementLit" />

type CollabFsPermissionMode = 'read' | 'readwrite';

type CollabFsPermissionDescriptor = {
    mode: CollabFsPermissionMode;
}

type CollabFsWritable = {
    write(data: string | Blob | BufferSource): Promise<void>;
    close(): Promise<void>;
}

export type CollabFsFileHandle = {
    kind: 'file';
    name: string;
    getFile(): Promise<File>;
    createWritable(): Promise<CollabFsWritable>;
}

export type CollabFsDirectoryHandle = {
    kind: 'directory';
    name: string;
    entries(): AsyncIterableIterator<[string, CollabFsDirectoryHandle | CollabFsFileHandle]>;
    getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<CollabFsDirectoryHandle>;
    getFileHandle(name: string, options?: { create?: boolean }): Promise<CollabFsFileHandle>;
    removeEntry(name: string, options?: { recursive?: boolean }): Promise<void>;
    queryPermission?(descriptor: CollabFsPermissionDescriptor): Promise<PermissionState>;
    requestPermission?(descriptor: CollabFsPermissionDescriptor): Promise<PermissionState>;
}

declare global {
    interface Window {
        showDirectoryPicker?: (options?: { mode?: CollabFsPermissionMode }) => Promise<CollabFsDirectoryHandle>;
    }
}

export interface CollabFsLocalFile {
    path: string;
    content: string;
    size: number;
    lastModified: number;
}

const DB_NAME = 'collabFileSystem100554';
const DB_VERSION = 1;
const STORE_HANDLES = 'directoryHandles';

export class FileSystemAccessAdapter {

    public isSupported(): boolean {
        return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function' && typeof indexedDB !== 'undefined';
    }

    public async showDirectoryPicker(): Promise<CollabFsDirectoryHandle> {
        if (!window.showDirectoryPicker) throw new Error('File System Access API is not available in this browser.');
        return window.showDirectoryPicker({ mode: 'readwrite' });
    }

    public async ensurePermission(handle: CollabFsDirectoryHandle, mode: CollabFsPermissionMode = 'readwrite'): Promise<boolean> {
        const descriptor = { mode };
        if (handle.queryPermission && await handle.queryPermission(descriptor) === 'granted') return true;
        if (!handle.requestPermission) return false;
        return await handle.requestPermission(descriptor) === 'granted';
    }

    public async saveHandle(project: number, handle: CollabFsDirectoryHandle): Promise<void> {
        const db = await this.openDB();
        try {
            const tx = db.transaction(STORE_HANDLES, 'readwrite');
            const done = this.transactionDone(tx);
            const store = tx.objectStore(STORE_HANDLES);
            await this.requestToPromise(store.put({
                key: this.getProjectKey(project),
                project,
                handle,
                name: handle.name,
                updatedAt: new Date().toISOString(),
            }));
            await done;
        } finally {
            db.close();
        }
    }

    public async getHandle(project: number): Promise<CollabFsDirectoryHandle | null> {
        const db = await this.openDB();
        try {
            const tx = db.transaction(STORE_HANDLES, 'readonly');
            const store = tx.objectStore(STORE_HANDLES);
            const result = await this.requestToPromise<any>(store.get(this.getProjectKey(project)));
            return result?.handle || null;
        } finally {
            db.close();
        }
    }

    public async listTextFiles(directory: CollabFsDirectoryHandle): Promise<CollabFsLocalFile[]> {
        const files: CollabFsLocalFile[] = [];
        await this.walkTextFiles(directory, '', files);
        files.sort((a, b) => a.path.localeCompare(b.path));
        return files;
    }

    public async readTextFile(directory: CollabFsDirectoryHandle, path: string): Promise<string | null> {
        const handle = await this.getFileHandleByPath(directory, path, false);
        if (!handle) return null;
        const file = await handle.getFile();
        return file.text();
    }

    public async writeTextFile(directory: CollabFsDirectoryHandle, path: string, content: string): Promise<void> {
        this.assertSafePath(path);
        const handle = await this.getFileHandleByPath(directory, path, true);
        if (!handle) throw new Error(`Unable to create file ${path}`);
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
    }

    public async removeFile(directory: CollabFsDirectoryHandle, path: string): Promise<void> {
        this.assertSafePath(path);
        const parts = path.split('/').filter(Boolean);
        if (parts.length < 1) return;
        const fileName = parts.pop();
        if (!fileName) return;
        let current = directory;
        for (const part of parts) {
            current = await current.getDirectoryHandle(part);
        }
        await current.removeEntry(fileName, { recursive: false });
    }

    private async walkTextFiles(directory: CollabFsDirectoryHandle, prefix: string, files: CollabFsLocalFile[]): Promise<void> {
        for await (const [name, handle] of directory.entries()) {
            if (handle.kind === 'directory') {
                if (this.shouldIgnoreDirectory(name)) continue;
                await this.walkTextFiles(handle, prefix ? `${prefix}/${name}` : name, files);
                continue;
            }

            const path = prefix ? `${prefix}/${name}` : name;
            if (this.shouldIgnoreFile(path)) continue;

            const file = await handle.getFile();
            const content = await file.text();
            files.push({
                path,
                content,
                size: file.size,
                lastModified: file.lastModified,
            });
        }
    }

    private async getFileHandleByPath(directory: CollabFsDirectoryHandle, path: string, create: boolean): Promise<CollabFsFileHandle | null> {
        this.assertSafePath(path);
        const parts = path.split('/').filter(Boolean);
        if (parts.length < 1) return null;
        const fileName = parts.pop();
        if (!fileName) return null;

        let current = directory;
        for (const part of parts) {
            current = await current.getDirectoryHandle(part, { create });
        }
        return current.getFileHandle(fileName, { create });
    }

    private assertSafePath(path: string): void {
        const parts = path.split('/');
        if (!path || path.startsWith('/') || path.includes('\\') || parts.some((part) => part === '..' || part === '')) {
            throw new Error(`Unsafe local path: ${path}`);
        }
    }

    private shouldIgnoreDirectory(name: string): boolean {
        return name === '.git' ||
            name === 'node_modules' ||
            name === 'dist' ||
            name === 'distFrontend' ||
            name === '.cache';
    }

    private shouldIgnoreFile(path: string): boolean {
        const name = path.split('/').pop() || '';
        return name === '.DS_Store' || name.endsWith('.tmp') || name.endsWith('~');
    }

    private getProjectKey(project: number): string {
        return `project:${project}`;
    }

    private openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_HANDLES)) db.createObjectStore(STORE_HANDLES, { keyPath: 'key' });
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private transactionDone(tx: IDBTransaction): Promise<void> {
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
    }

}
