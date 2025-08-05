/// <mls shortName="collabImport" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

interface CollabImportOptions {
    project: number;
    shortName: string;
    folder: string;
}

const moduleRegistry = new Map<string, {
    version: string;
    modulePromise: Promise<any>;
}>();

const staticImports = new Set<string>(); // Tracks modules imported outside dev mode

export async function collabImport(opts: CollabImportOptions): Promise<any> {

    const moduleId = opts.folder ? `${opts.project}-${opts.folder}/${opts.shortName}` : `${opts.project}-/${opts.shortName}`;
    const isDev = await fileInDevelopment(opts);

    if (!isDev) {
        const url = getUrlFromFileInfo(opts, null);
        staticImports.add(moduleId);
        return import(/* @vite-ignore */ url);

    }

    const version = await getFileVersion(opts);
    const cached = moduleRegistry.get(moduleId);

    if (cached && cached.version === version) {
        return cached.modulePromise;
    }

    const url = getUrlFromFileInfo(opts, version);
    const modulePromise = import(/* @vite-ignore */ url);

    moduleRegistry.set(moduleId, { version, modulePromise });
    return modulePromise;
}

async function fileInDevelopment(opts: CollabImportOptions): Promise<boolean> {
    const keyToStorFile = mls.stor.getKeyToFiles(opts.project, 2, opts.shortName, opts.folder, '.ts');
    const storFile = mls.stor.files[keyToStorFile];
    return !!storFile?.inLocalStorage;
}

async function getFileVersion(opts: CollabImportOptions): Promise<string> {
    const modelKey = mls.editor.getKeyModel(opts.project, opts.shortName, opts.folder);
    const model = mls.editor.models[modelKey];
    if (!model || !model.ts) return '';
    const crcActual = mls.common.crc.crc32(model.ts.model.getValue()).toString(16);
    return crcActual === model.ts.originalCRC ? '' : crcActual;
}

function getUrlFromFileInfo(opts: CollabImportOptions, version: string | null): string {
    const base = opts.folder ? `/_${opts.project}_${opts.folder}/${opts.shortName}` : `/_${opts.project}_${opts.shortName}`;
    return version ? `${base}?t=${version}` : base;
}
