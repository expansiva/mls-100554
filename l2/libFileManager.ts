/// <mls shortName="libFileManager" project="100554" enhancement="_blank" />


//------------ EXPORT ----------------

export async function readAllProjectAndCompile(project: number, shortName: string, needCompile: boolean = true): Promise<void> {

    return _readAllProjectAndCompile(project, shortName, needCompile);
}

export function getStorFile(file: { project: number, shortName: string, enhancement: string, extension: string, level: number, folder: string }): mls.stor.IFileInfo {

    return _getStorFile(file);
}

export async function createModel(storFile: mls.stor.IFileInfo, compile: boolean): Promise<mls.l2.editor.IMFile> {

    return await _createModel(storFile, compile);
}

export async function createNewFileWithModel(src: string, file: { project: number, shortName: string, enhancement: string, extension: string }): Promise<mls.l2.editor.IMFile> {
    return await _createNewFileWithModel(src, file);
}

export async function deleteFileWithModel(file: { project: number, shortName: string, enhancement: string, extension: string, level: number, folder: string }): Promise<void> {

    return await _deleteFileWithModel(file);
}

export async function undoFileWithModel(file: { project: number, shortName: string, enhancement: string, extension: string, level: number, folder: string }): Promise<void> {

    return await _undoFileWithModel(file);

}

export async function renameFileWithModel(file: { project: number, shortName: string, enhancement: string, extension: string, level: number, folder: string, newProject: number, newShortName: string, }): Promise<void> {

    return await _renameFileWithModel(file);

}

export async function cloneFileWithModel(file: { project: number, shortName: string, enhancement: string, extension: string, level: number, folder: string, newProject: number, newShortName: string, }): Promise<void> {

    return await _cloneFileWithModel(file);

}


//-------------IMPLEMENTATION---------

function getUri(shortFN: string, ftype: '.ts' | '.d.ts' | '.html'): monaco.Uri {
    return monaco.Uri.parse(`file://server/${shortFN}${ftype}`);
}

async function _readAllFileExtensionAndCompile(project: number, extension: string, needCompile: boolean = true): Promise<void> {


    if (mls.istrace) console.log('loading files from project ' + project);

    const keys: string[] = Object.keys(mls.stor.files);
    for await (const key of keys) {

        try {

            const storFile = mls.stor.files[key];
            if (storFile.project === project && storFile.level === 2
                && storFile.extension !== extension) continue;

            await _createModel(storFile, false);

        } catch (e) {

            console.info('Error readAllFileExtensionAndCompile:' + key);

        }


    }

    if (needCompile) await mls.l2.editor.compileAllProjectIfNeed(project, true);

    return;
}

const projectsLoaded: number[] = [];
async function _readAllProjectAndCompile(project: number, shortName: string, needCompile: boolean = true): Promise<void> {

    // load all typescripts dependencies of project , except shortName
    if (projectsLoaded.includes(project)) return;

    if (mls.istrace) console.log('loading files from project ' + project);

    projectsLoaded.push(project);

    const promises: Promise<mls.l2.editor.IMFile>[] = [];

    const keys: string[] = Object.keys(mls.stor.files);
    for (const key of keys) {

        const storFile = mls.stor.files[key];
        if (storFile.project === project
            && storFile.level === 2
            && storFile.shortName !== shortName) {
            promises.push(_createModel(storFile, false));
        }
    }

    await Promise.all(promises);

    if (needCompile) await mls.l2.editor.compileAllProjectIfNeed(project, true);

    return;
}

const code = {
    '.ts': 'typescript',
    '.html': 'html',
}

const baseSrc = {
    '.ts': `/// <mls shortName="[shortName]" project="[project]" enhancement="[enhancement]" />
				\n// typescript new file\n`,
    '.html': '<fca-text>Edit this.</fca-text>',
}

function _getStorFile(file: { project: number, shortName: string, enhancement: string, extension: string, level: number, folder: string }): mls.stor.IFileInfo {

    const keyFiles = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, file.extension);
    const storFile = mls.stor.files[keyFiles];
    if (!storFile) throw new Error('Error on getStorFile, mls.stor.files dont exists, key:' + keyFiles);
    return storFile;
};

async function _createNewFileWithModel(src: string, file: { project: number, shortName: string, enhancement: string, extension: string }): Promise<mls.l2.editor.IMFile> {

    let newSource = src;
    if (!newSource && file.extension === '.ts') {
        newSource = baseSrc[file.extension].replace('[shortName]', file.shortName).replace('[project]', file.project.toString()).replace('[enhancement]', file.enhancement);
    } else if (!newSource) {
        newSource = (baseSrc as any)[file.extension];
    }

    const model = await createFileAndModel(newSource, file);

    return model;

};

async function _deleteFileWithModel(file: { project: number, shortName: string, enhancement: string, extension: string, level: number, folder: string }): Promise<void> {


    const storFile = _getStorFile(file);

    if (storFile.status === 'new') {
        fcDeleteFile(storFile);
    } else storFile.status = 'deleted';

    return;

};

async function _undoFileWithModel(file: { project: number, shortName: string, enhancement: string, extension: string, level: number, folder: string }): Promise<void> {

    const storFile = _getStorFile(file);

    if (storFile.status === 'deleted') {
        storFile.status = 'changed';
        return;
    }

    if (storFile.status === 'renamed') {
        throw new Error('not implemented');
    }

    mls.l2.editor.remove(storFile);
    removeEventsModel(storFile);

    const keyFiles = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, file.extension);

    await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });

    if (storFile.status === 'new') {
        delete mls.stor.files[keyFiles];
        return;
    }

    if (storFile.status === 'changed') {
        storFile.status = 'nochange';
        if (storFile.isLocalVersionOutdated && storFile.newVersionRefIfOutdated) {
            storFile.versionRef = storFile.newVersionRefIfOutdated;
            storFile.isLocalVersionOutdated = false;
            storFile.newVersionRefIfOutdated = undefined;
        }

    } else {
        storFile.status = 'changed';
    }

    await createModel(storFile, true);
    return;

};

async function _renameFileWithModel(file: { project: number, shortName: string, enhancement: string, extension: string, level: number, folder: string, newProject: number, newShortName: string, }): Promise<void> {

    const storFile = _getStorFile(file);

    const aux = storFile.extension === '.ts' ? '' : storFile.extension;
    const model1: mls.l2.editor.IMFile | undefined = mls.l2.editor.get({ project: storFile.project, shortName: storFile.shortName + aux });

    if (!model1) throw new Error('Error renameFile: not found mfile');

    // N„o esta preparado para o .html;
    renameFileWithModel2(model1, storFile, file.newProject, file.newShortName);

    return;

};

async function _cloneFileWithModel(file: { project: number, shortName: string, enhancement: string, extension: string, level: number, folder: string, newProject: number, newShortName: string, }): Promise<void> {

    const storFile = _getStorFile(file);
    const aux = storFile.extension === '.ts' ? '' : storFile.extension;
    let model1: mls.l2.editor.IMFile | undefined = mls.l2.editor.get({ project: storFile.project, shortName: storFile.shortName + aux });
    if (!model1) throw new Error('Error cloneFile, not found mfile');

    const src = model1.model.getValue();

    const newFile = {
        project: file.newProject,
        shortName: file.newShortName,
        enhancement: file.enhancement,
        extension: file.extension,
        level: file.level,
        folder: file.folder,
    }

    model1 = await _createNewFileWithModel(src, newFile);
    mls.common.tripleslash.changeVariable(model1, 'shortName', file.newShortName);
    mls.common.tripleslash.changeVariable(model1, 'project', file.newProject.toString());

    return;
};

function renameFileWithModel2(model1: mls.l2.editor.IMFile, storFile: mls.stor.IFileInfo, newProject: number, newShortName: string): void {

    if (storFile.hasError) throw new Error('Error on rename, clear errors before rename');

    if (!isNewNameValid(newShortName)) throw new Error('Error on rename, new shortName is a invalid name');

    const newFile: mls.l2.editor.IPath = { shortName: newShortName, project: newProject };

    if (!mls.l2.editor.rename(model1, newFile)) throw new Error('Error on rename mls.l2.editor.mfiles');

    if (!mls.stor.renameFile(storFile, newFile)) throw new Error('Error on rename mls.stor.files');

    mls.common.tripleslash.changeVariable(model1, 'shortName', newShortName);
    mls.common.tripleslash.changeVariable(model1, 'project', newProject.toString());

    if (storFile.status === 'new') return;

    storFile.status = 'renamed'; // poderia ficar na funÁ„o 
    // setTimeout(() => {
    // 	storFile.status = 'renamed';
    // }, 600); // after change editor, status change to 'changed'

}

async function createFileAndModel(src: string, file: { project: number, shortName: string, enhancement: string, extension: string }): Promise<mls.l2.editor.IMFile> {

    // create new file or load project 0 file
    const level = 2;

    if (file.project > 1) await mls.stor.server.loadProjectInfoIfNeeded(file.project);

    const key = mls.stor.getKeyToFiles(file.project, level, file.shortName, '', file.extension);

    let storFile = mls.stor.files[key];

    if (storFile && file.project !== 0) throw new Error('Error on createFileAndModel, model already exists: ' + key);

    if (!storFile) {
        storFile = await mls.stor.addOrUpdateFile({ project: file.project, level, shortName: file.shortName, extension: file.extension, versionRef: new Date().toISOString(), folder: '' });
        storFile.status = 'new';
    }

    const aux = file.extension === '.ts' ? '' : file.extension;
    let model1 = mls.l2.editor.get({ project: file.project, shortName: file.shortName + aux });

    if (!model1) {

        const srcModel: string = storFile ? (await storFile.getContent(src)) as string || src : src;

        const ftype = srcModel.split("\n")[0].indexOf(' type="definition"') > 0 ? ".d.ts" : file.extension;

        const uri = getUri(`_${file.project}_${file.shortName}`, ftype as any);

        model1 = mls.l2.editor.get({ project: file.project, shortName: file.shortName + aux });

        if (model1) return model1; // created in another instance

        const model = monaco.editor.createModel(src, (code as any)[storFile.extension], uri);
        model1 = {
            changed: true,
            error: false,
            project: file.project,
            shortName: file.shortName + aux,
            extension: file.extension,
            model,
            storFile,
            codeLens: [],
        };
        mls.l2.editor.add(model1);
        addEventsModel(storFile, model1);
    }

    if (storFile.extension === '.ts') {
        await updateModelStatus(model1, false); // first compilation
    }

    return model1;
}


async function _createModel(storFile: mls.stor.IFileInfo, compile: boolean): Promise<mls.l2.editor.IMFile> {

    // load source from repository
    const { project, shortName, extension } = storFile;

    const aux = storFile.extension === '.ts' ? '' : storFile.extension;
    let model1 = mls.l2.editor.get({ project: storFile.project, shortName: storFile.shortName + aux });
    if (model1) return model1;

    const info: mls.stor.IFileInfoValue | null = storFile.getValueInfo ? await storFile.getValueInfo() : null;

    const haveInfo: boolean = (info && !!info.content) || (info !== null && !!info.content);

    const src: string | Blob | null = haveInfo && info !== null ? info.content : await storFile.getContent();

    if (src instanceof Blob || src === null) throw new Error('ts file must be string');

    const originalCRC = haveInfo && info !== null ? info.originalCRC : mls.common.crc.crc32(src).toString(16);

    const originalProject: number | undefined = haveInfo && info !== null ? info.originalProject : undefined;

    const originalShortName: string | undefined = haveInfo && info !== null ? info.originalShortName : undefined;

    const ftype = src.split("\n")[0].indexOf(' type="definition"') > 0 ? ".d.ts" : storFile.extension;

    const uri = getUri(`_${project}_${shortName}`, ftype as any);

    const model = monaco.editor.createModel(src, (code as any)[storFile.extension], uri);

    model1 = {
        changed: false, // not changed in this section, but storFile.changed is about all sections
        error: false,
        project,
        shortName: shortName + aux,
        extension,
        model,
        storFile,
        originalCRC,
        originalProject,
        originalShortName,
        codeLens: [],
    };

    mls.l2.editor.add(model1);

    addEventsModel(storFile, model1);

    if (compile && storFile.extension === '.ts') {
        await updateModelStatus(model1, false);
    }

    return model1;
}

function addEventsModel(storFile: mls.stor.IFileInfo, model1: mls.l2.editor.IMFile): void {

    storFile.onAction = (action: mls.stor.IFileInfoAction) => afterUpdate(storFile);

    storFile.getValueInfo = () => getValueInfo(model1);

    model1.model.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => onModelChange(e, model1, storFile));
}

function isNewNameValid(newShortName: string): boolean {
    if (newShortName.length === 0 || newShortName.length > 255) return false;
    const invalidCharacters = /[_\/{}\t\[\]\*$@#=\-+!|?,<>=.;^~∫∞""''``·‡‚„ÈËÍÌÔÛÙıˆ˙ÁÒ¡¿¬√…»Õœ”‘’÷⁄«—]/;
    return (!invalidCharacters.test(newShortName));
}

async function afterUpdate(storFile: mls.stor.IFileInfo) {

    let { project, shortName } = storFile;

    shortName = storFile.extension !== '.ts' ? shortName + storFile.extension : shortName;

    if (!project || !shortName) return;

    const aux = storFile.extension === '.ts' ? '' : storFile.extension;
    const mmodel: mls.l2.editor.IMFile | undefined = mls.l2.editor.get({ project: storFile.project, shortName: storFile.shortName + aux });

    if (!mmodel) return;

    if (storFile.status === 'deleted') {
        fcDeleteFile(storFile);
        return;
    }

    if (storFile.status === 'renamed') {
        mmodel.originalProject = undefined;
        mmodel.originalShortName = undefined;
        mmodel.originalCRC = mls.common.crc.crc32(mmodel.model.getValue()).toString(16);
    }

    await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });

    storFile.status = 'nochange';
}

async function getValueInfo(activeModel: mls.l2.editor.IMFile): Promise<mls.stor.IFileInfoValue> {

    const rc: mls.stor.IFileInfoValue = {
        content: activeModel.model.getValue(),
        contentType: 'string',
        originalShortName: activeModel.originalShortName,
        originalProject: activeModel.originalProject,
        originalCRC: activeModel.originalCRC
    };
    return rc;
}

let _onChangedContent: number = -1;
function onModelChange(e: monaco.editor.IModelContentChangedEvent, activeModel: mls.l2.editor.IMFile, storFile: mls.stor.IFileInfo): void {

    // some changes is to simulate changes to force compile
    clearTimeout(_onChangedContent);
    _onChangedContent = window.setTimeout(async () => {

        if (storFile.extension === '.ts') {

            await updateModelStatus(activeModel, true);

            const ignoreChanges = (e.changes.length === 1 && e.changes[0].range.startLineNumber === 1 && e.changes[0].range.endLineNumber === 1 && e.changes[0].range.endColumn <= 2);
            if (ignoreChanges) return;

        } else {

            await changeStatusFile(activeModel, storFile, {}, false);

        }


        //mls.events.fireFileAction('changed', storFile, 'left');
        //mls.events.fireFileAction('changed', storFile, 'right');

    }, 400);
};



async function updateModelStatus(model1: mls.l2.editor.IMFile, changed: boolean): Promise<void> {

    if (model1.project === 0) changed = true; // always in localstorage
    model1.changed = changed;

    const cr: mls.l2.editor.ICompilerResult = await mls.l2.editor.getCompilerResultTS({ project: model1.project, shortName: model1.shortName }, true);

    let hasError = cr.errors.length > 0;
    model1.error = hasError;

    const key = mls.stor.getKeyToFiles(model1.project, model1.storFile.level, model1.shortName, '', model1.extension);

    const storFile: mls.stor.IFileInfo = mls.stor.files[key];


    if (!hasError) {
        const enhancementInstance: mls.l2.enhancement.IEnhancementInstance | undefined = await mls.l2.enhancement.getEnhancementInstance(model1).catch((e) => undefined);
        if (enhancementInstance) await enhancementInstance.onAfterChange(model1);
        hasError = storFile.hasError;
    }

    await changeStatusFile(model1, storFile, cr.tripleSlashMLS?.variables, hasError);

}

async function changeStatusFile(model1: mls.l2.editor.IMFile, storFile: mls.stor.IFileInfo, variables: mls.common.tripleslash.ITripleSlashVariables, hasError: boolean): Promise<void> {

    if (!storFile) return; // new file dont have storFile ???

    const oldStatus = storFile.status;
    storFile.hasError = hasError;

    const sameContent: boolean = model1.originalCRC === mls.common.crc.crc32(model1.model.getValue()).toString(16);

    if (sameContent) {
        if (storFile.status !== 'new') storFile.status = 'nochange';
        await mls.stor.localStor.setContent(storFile, { content: null }); // clear localstorage
    } else {
        if (storFile.status !== 'renamed' && (storFile.status !== 'new')) storFile.status = 'changed';
        await mls.stor.localStor.setContent(storFile, await getValueInfo(model1));
    }

    if (oldStatus !== storFile.status) {
        mls.events.fireFileAction('statusOrErrorChanged', storFile, 'left');
        mls.events.fireFileAction('statusOrErrorChanged', storFile, 'right');
    }
}

async function fcDeleteFile(storFile: mls.stor.IFileInfo) {

    await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });

    //mls.l2.editor.remove(storFile);
    const aux = storFile.extension === '.ts' ? '' : storFile.extension;
    const key = `_${storFile.project}_${storFile.shortName + aux}`;
    if (mls.l2.editor.mfiles[key]) {
        if (mls.l2.editor.mfiles[key].model) mls.l2.editor.mfiles[key].model.dispose();
        delete mls.l2.editor.mfiles[key];
    }


    removeEventsModel(storFile);

    const keyFiles = mls.stor.getKeyToFiles(storFile.project, storFile.level, storFile.shortName, storFile.folder, storFile.extension);

    delete mls.stor.files[keyFiles];

}

function removeEventsModel(storFile: mls.stor.IFileInfo): void {
    storFile.onAction = undefined;
    storFile.getValueInfo = undefined;
}
