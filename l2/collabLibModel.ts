/// <mls shortName="collabLibModel" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { getEnhancementName, getBaseTemplate } from '/_100554_/l2/libCommom.js';
import { setErrorOnModel } from '/_102027_/l2/utils.js';
import { getTokensLess, removeTokensFromSource } from '/_102027_/l2/designSystemBase.js';

export async function readProjectTypescriptAndCompile(project: number, shortName: string, needCompile: boolean = true) {

    if (projectsLoaded.includes(project)) return;
    if (mls.istrace) console.log('loading files from project ' + project);
    projectsLoaded.push(project);

    const promises: Promise<mls.editor.IModels | mls.editor.IModelBase | undefined>[] = [];
    const keys: string[] = Object.keys(mls.stor.files);

    if ((window as any).traceLivecicle) console.info('creating: files model ', project);

    const deps = mls.l5.getProjectDependencies(project, false);
    const projectWithDeps = [project, ...deps]

    for (const key of keys) {
        const storFile = mls.stor.files[key];
        if (projectWithDeps.includes(storFile.project)
            && storFile.level === 2
            && storFile.extension === '.ts'
            && (mls.istrace || storFile.inLocalStorage)
            && storFile.shortName !== shortName) {
            promises.push(createAllModels(storFile, false, false));
        }
    }

    const info = await mls.stor.localDB.readPrjInfo(baseProject);
    if (info && info.indexModules && info.indexModules !== '') {
        promises.push(_createProjectModel(baseProject, info.indexModules));
    }

    const prj = mls.actualProject;
    if (prj && prj !== baseProject && prj !== mls.stor.LOCALPROJECTNUMBER) {
        const actual = await mls.stor.localDB.readPrjInfo(prj);
        if (actual && actual.indexModules && actual.indexModules !== '') {
            promises.push(_createProjectModel(prj, actual.indexModules));
        }
    }

    if (mls.istrace) console.time('creating models');
    await Promise.all(promises);
    if (mls.istrace) console.timeEnd('creating models');

}

export async function readProjectTypescriptAndCompileL1(project: number, shortName: string, needCompile: boolean = true) {

    if (projectsLoadedL1.includes(project)) return;
    if (mls.istrace) console.log('loading files L1 from project ' + project);
    projectsLoadedL1.push(project);

    const promises: Promise<mls.editor.IModels | mls.editor.IModelBase | undefined>[] = [];
    const keys: string[] = Object.keys(mls.stor.files);

    if ((window as any).traceLivecicle) console.info('creating: files model ', project);

    for (const key of keys) {
        const storFile = mls.stor.files[key];
        if (storFile.project === mls.actualProject
            && storFile.level === 1
            && storFile.extension === '.ts'
            && storFile.shortName !== shortName) {
            promises.push(createModel(storFile, true, false));
        }
    }

    if (mls.istrace) console.time('creating models L1');
    await Promise.all(promises);
    if (mls.istrace) console.timeEnd('creating models L1');

}

export async function createAllModels(storFileBase: mls.stor.IFileInfo, needCompile: boolean = true, awaitCompile: boolean = false, createStorIfNeed: boolean = true): Promise<mls.editor.IModels | undefined> {

    const storFiles = await mls.stor.getFiles({ project: storFileBase.project, shortName: storFileBase.shortName, folder: storFileBase.folder, loadContent: true, });

    let fileModels = mls.editor.getModels(storFileBase.project, storFileBase.shortName, storFileBase.folder, storFileBase.level);

    if (storFiles.less && (!fileModels || !fileModels.style)) {
        await createModel(storFiles.less, needCompile, awaitCompile);
    } else if (createStorIfNeed && !storFiles.less && (!fileModels || !fileModels.style)) {
        storFiles.less = await createStorFiles(storFiles.ts, '.less');
        await createModel(storFiles.less, needCompile, awaitCompile);
    }

    if (storFiles.ts && (!fileModels || !fileModels.ts)) {
        await createModel(storFiles.ts, needCompile, awaitCompile);
    }

    if (storFiles.html && (!fileModels || !fileModels.html)) {
        await createModel(storFiles.html, needCompile, awaitCompile);
    } else if (createStorIfNeed && !storFiles.html && (!fileModels || !fileModels.html)) {
        storFiles.html = await createStorFiles(storFiles.ts, '.html');
        await createModel(storFiles.html, needCompile, awaitCompile);
    }

    if (storFiles.test && (!fileModels || !fileModels.test)) {
        await createModel(storFiles.test, needCompile, awaitCompile);
    } else if (createStorIfNeed && !storFiles.test && (!fileModels || !fileModels.test)) {
        storFiles.test = await createStorFiles(storFiles.ts, '.test.ts');
        await createModel(storFiles.test, needCompile, awaitCompile);
    }

    if (storFiles.defs && (!fileModels || !fileModels.defs)) {
        await createModel(storFiles.defs, needCompile, awaitCompile);
    } else if (createStorIfNeed && !storFiles.defs && (!fileModels || !fileModels.defs)) {
        storFiles.defs = await createStorFiles(storFiles.ts, '.defs.ts');
        await createModel(storFiles.defs, needCompile, awaitCompile);
    }

    fileModels = mls.editor.getModels(storFileBase.project, storFileBase.shortName, storFileBase.folder, storFileBase.level);

    return fileModels;

}

export async function createModel(storFile: mls.stor.IFileInfo, needCompile: boolean = true, awaitCompile: boolean = false): Promise<mls.editor.IModelBase | undefined> {

    let fileModels = mls.editor.getModels(storFile.project, storFile.shortName, storFile.folder, storFile.level);
    const prop = mapExt[storFile.extension];
    if (fileModels && fileModels[prop]) return fileModels[prop];

    const key = mls.editor.getKeyModel(storFile.project, storFile.shortName, storFile.folder, storFile.level) + storFile.extension;

    if (modelPromises.has(key)) {
        return modelPromises.get(key)!;
    }

    const promise = (async () => {
        if (storFile.project > 1 && storFile.project !== mls.stor.LOCALPROJECTNUMBER && storFile.project !== 102013) {
            await mls.stor.server.loadProjectInfoIfNeeded(storFile.project);
        }

        const src: string = storFile ? await storFile.getContent() as string : '';
        const ftype: Extesion = src.split("\n")[0].indexOf(' type="definition"') > 0 ? ".d.ts" : storFile.extension as Extesion;

        const modelBase = await _createModel(storFile, ftype, src);
        if (!modelBase) throw new Error(`[createModel] invalid mls.editor.models for file: _${storFile.project}_${storFile.shortName}${ftype}`);

        _addEventsModel(storFile, modelBase);

        if (needCompile && modelBase.storFile.extension.endsWith('.ts')) {
            const modelTs = modelBase as mls.editor.IModelTS;
            if (modelTs && modelTs.compilerResults) modelTs.compilerResults.modelNeedCompile = true;
            if (!awaitCompile) mls.l2.typescript.compileAndPostProcess(modelBase, true, true);
            else {
                await mls.l2.typescript.compileAndPostProcess(modelBase, true, true);
                const mts = (modelBase as mls.editor.IModelTS);
                if (mts.compilerResults && mts.compilerResults.errors.length <= 0) {
                    modelBase.storFile.hasError = false;
                }
            }
        }

        if (needCompile && modelBase.storFile.extension.endsWith('.less')) {
            if (!awaitCompile) mls.l2.less.compileStyle(modelBase);
            else {
                await mls.l2.less.compileStyle(modelBase);
                const mts = (modelBase as mls.editor.IModelStyle);
                if (mts.styleResults && mts.styleResults.errors.length <= 0) {
                    modelBase.storFile.hasError = false;
                }
            }
        }

        return modelBase;
    })();

    modelPromises.set(key, promise);

    try {
        const result = await promise;
        return result;
    } catch (e: any) {
        throw new Error('[createModel] ' + e.message);
    } finally {
        modelPromises.delete(key);
    }

}

//---------AUXILIARY FUNCTIONS AND DEFINITIONS-------------
const modelPromises = new Map<string, Promise<mls.editor.IModelBase | undefined>>();

const baseProject = 100554;
const projectsLoaded: number[] = [];
const projectsLoadedL1: number[] = [];

const mapExt: Record<string, keyof typeof mls.editor.models[string]> = {
    '.ts': 'ts',
    '.html': 'html',
    '.less': 'style',
    '.test.ts': 'test',
    '.defs.ts': 'defs'
};

type Extesion = '.ts' | '.d.ts' | '.html' | '.less' | '.test.ts' | '.defs.ts';

async function _createProjectModel(project: number, contentTS: string): Promise<mls.editor.IModels> {

    let projectModel = mls.editor.getModels(project, '', '', 2);
    if (projectModel && projectModel.ts) return projectModel;
    const ftype = ".d.ts";
    const info: mls.stor.IFileInfo = {
        project,
        shortName: '',
        folder: '',
        level: 2,
        extension: '.d.ts',
        versionRef: '',
        projectDependencies: null,
        isLocalVersionOutdated: false,
        inLocalStorage: false,
        status: 'nochange',
        hasError: false,
        getContent: function (this: mls.stor.IFileInfo, defaultValue?: string | Blob | null | undefined): Promise<string | Blob | null> {
            throw new Error('Function not implemented.');
        },
        getHistory: function (this: mls.stor.IFileInfo): Promise<mls.stor.IHistory[] | null> {
            throw new Error('Function not implemented.');
        },
        getHistoryContent: function (this: mls.stor.IFileInfo, ref: string): Promise<string | null> {
            throw new Error('Function not implemented.');
        },
        saveContentInCacheIfNeed: function (): Promise<string | null> {
            throw new Error('Function not implemented.');
        }
    }
    const modelsBase = await _createModel(info, ftype, contentTS)
    if (!modelsBase) throw new Error(`invalid mls.editor.models for file: _${info.project}_.d.ts`);

    return projectModel as mls.editor.IModels;

}

async function _createModel(storFile: mls.stor.IFileInfo, ext: Extesion, content?: string): Promise<mls.editor.IModelBase | undefined> {

    let src: string | Blob | null | undefined = undefined;
    let haveInfo: boolean = false;
    let info: mls.stor.IFileInfoValue | null = null;

    if (ext !== '.d.ts') {

        if (!storFile) throw new Error(`Invalid file: ${ext}`);

        if (storFile.project !== 0) {
            info = storFile.getValueInfo ? await storFile.getValueInfo() : null;
            haveInfo = !!info && !!info.content;
        }
        if (!content) {
            src = haveInfo ? info?.content : await storFile.getContent();
        } else src = content;

    } else {
        src = content || '';
    }

    if (src instanceof Blob) throw new Error(`${ext} file must be string`);
    if (!src) throw new Error(`${ext} file is undefined`);

    let originalCRC = haveInfo ? info?.originalCRC : mls.common.crc.crc32(src).toString(16);

    if (ext === '.less') {
        originalCRC = haveInfo ? info?.originalCRC : mls.common.crc.crc32(removeTokensFromSource(src).trim()).toString(16)
    }

    const originalProject: number | undefined = haveInfo ? info?.originalProject : undefined;
    const originalShortName: string | undefined = haveInfo ? info?.originalShortName : undefined;

    let model: mls.editor.IModelBase | undefined;
    if (ext === '.html' && storFile) model = mls.editor.createModelHTML(storFile, src);
    else if (ext === '.ts' && storFile) model = mls.editor.createModelTS(storFile, src);
    else if (ext === '.test.ts' && storFile) model = mls.editor.createModelTest(storFile, src);
    else if (ext === '.defs.ts' && storFile) model = mls.editor.createModelDefs(storFile, src);

    else if (ext === '.d.ts') model = mls.editor.createModelProjectDefinition(storFile.project, src);
    else if (ext === '.less' && storFile) {
        const lessTokens = await getTokensLess(storFile.project, 'Default');
        const lineTokens = `\n\n//Start Less Tokens\n${lessTokens}\n//End Less Tokens\n`;
        src = removeTokensFromSource(src);
        src = src.trim().concat(lineTokens);
        model = mls.editor.createModelStyle(storFile, src);
    }

    if (!model) throw new Error(`Model invalid`);
    if (ext !== '.d.ts') {
        model.originalCRC = originalCRC;
        model.originalProject = originalProject;
        model.originalShortName = originalShortName;
    }

    (model as any).needFormat = true;
    return model;

}

async function _addEventsModel(storFile: mls.stor.IFileInfo, model: mls.editor.IModelTS): Promise<void> {

    storFile.onAction = (action: mls.stor.IFileInfoAction) => _afterUpdate(storFile, model.model, mapExt[storFile.extension]);

    storFile.getValueInfo = () => _getValueInfo(model);

    model.model.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => _onModelChange(e, model, storFile));

}

async function _afterUpdate(storFile: mls.stor.IFileInfo, model: monaco.editor.ITextModel, tp: 'defs' | 'html' | 'style' | 'test' | 'ts') {

    if (storFile.status === 'deleted') {
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        const keyFiles = mls.stor.getKeyToFiles(storFile.project, storFile.level, storFile.shortName, storFile.folder, storFile.extension);
        delete mls.stor.files[keyFiles];
        return;
    }
    if (storFile.status === 'renamed') {
        const models = mls.editor.getModels(storFile.project, storFile.shortName, storFile.folder, storFile.level);
        if (!models || models[tp] === undefined) return;
        const modelByType = models[tp];
        if (!modelByType) return;
        modelByType.originalCRC = mls.common.crc.crc32(model.getValue()).toString(16);
    }

    storFile.status = 'nochange';
    await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });


}

async function _getValueInfo(activeModel: mls.editor.IModelBase): Promise<mls.stor.IFileInfoValue> {

    let content = activeModel.model.getValue();
    if (activeModel.storFile.extension === '.less') {
        content = removeTokensFromSource(content);
    }
    const rc: mls.stor.IFileInfoValue = {
        content,
        contentType: 'string',
        originalShortName: activeModel.originalShortName,
        originalProject: activeModel.originalProject,
        originalCRC: activeModel.originalCRC
    };
    return rc;
}

let _onChangedContent: number | undefined = undefined;
function _onModelChange(e: monaco.editor.IModelContentChangedEvent, activeModel: mls.editor.IModelBase, storFile: mls.stor.IFileInfo): void {
    // some changes is to simulate changes to force compile

    clearTimeout(_onChangedContent);
    _onChangedContent = window.setTimeout(async () => {


        switch (storFile.extension) {
            case ('.ts'):
                const ignoreChanges = (e.changes.length === 1 && e.changes[0].range.startLineNumber === 1 && e.changes[0].range.endLineNumber === 1 && e.changes[0].range.endColumn <= 2);
                await _updateModelStatusTS(activeModel, !ignoreChanges);
                break;
            case ('.html'):
                await _updateModelStatusHTML(activeModel, true);
                break;
            case ('.less'):
                await _updateModelStatusLess(activeModel, true);
                break;
            case ('.test.ts'):
                await _updateModelStatusTest(activeModel, true);
                break;
            case ('.defs.ts'):
                await _updateModelStatusDefs(activeModel, true);
                break;
            default: '';
        }

    }, 400);
};

async function _updateModelStatusHTML(modelBase: mls.editor.IModelBase, changed: boolean): Promise<void> {

    if (!modelBase.storFile) throw new Error('Invalid stor file');

    modelBase.storFile.hasError = false;

    await _checkSameContent(modelBase, modelBase.storFile);

    const position: 'left' | 'right' | 'all' = _getPosition(modelBase.model.id, mapExt[modelBase.storFile.extension]);

    _dispatchEventEditorEvents(position, modelBase.storFile);
    _dispatchEventStatusOrErrorChanged(position, modelBase.storFile);

}

async function _updateModelStatusLess(modelBase: mls.editor.IModelStyle, changed: boolean): Promise<void> {

    if (!modelBase.storFile) throw new Error('Invalid stor file');

    const position: 'left' | 'right' | 'all' = _getPosition(modelBase.model.id, mapExt[modelBase.storFile.extension]);

    const lastStatus = modelBase.styleResults ? modelBase.styleResults.errors.length > 0 : modelBase.storFile.hasError;

    modelBase.storFile.hasError = false;

    let modelValue = modelBase.model.getValue();

    let fileModels = mls.editor.getModels(modelBase.storFile.project, modelBase.storFile.shortName, modelBase.storFile.folder, modelBase.storFile.level);

    if (!fileModels) throw new Error('[_updateModelStatusLess] Not found file models')

    const enhancementInstanceLess = await import('/_100554_/l2/enhancementStyle.js')
    if (enhancementInstanceLess) await enhancementInstanceLess.onAfterChange(fileModels);

    mls.l2.less.compileStyle(modelBase);
    modelValue = removeTokensFromSource(modelValue);

    if (fileModels.ts) {
        if (fileModels.ts.compilerResults) {
            fileModels.ts.compilerResults.modelNeedCompile = true;
        }
        await mls.l2.typescript.compileAndPostProcess(fileModels.ts, true, true);
    }


    //_dispatchEventChanged(position, modelBase.storFile);
    await _checkSameContent(modelBase, modelBase.storFile);
    _dispatchEventChangedLess(position, modelBase.storFile)
    _dispatchEventEditorEvents(position, modelBase.storFile);
    if (lastStatus) _dispatchEventStatusOrErrorChanged(position, modelBase.storFile);

}

async function _updateModelStatusTest(modelBase: mls.editor.IModelStyle, changed: boolean): Promise<void> {

    const ok = await mls.l2.typescript.compileAndPostProcess(modelBase, false, true);
    let hasError = ok === false;
    modelBase.storFile.hasError = hasError;
    await _checkSameContent(modelBase, modelBase.storFile);
    let position = _getPosition(modelBase.model.id, 'test');

    _dispatchEventEditorEvents(position, modelBase.storFile);
    _dispatchEventChanged(position, modelBase.storFile);
    //_dispatchEventTsTestChanged(position, modelBase.storFile);


}

async function _updateModelStatusDefs(modelBase: mls.editor.IModelStyle, changed: boolean): Promise<void> {

    const ok = await mls.l2.typescript.compileAndPostProcess(modelBase, false, true);
    let hasError = ok === false;
    modelBase.storFile.hasError = hasError;
    await _checkSameContent(modelBase, modelBase.storFile);
    let position = _getPosition(modelBase.model.id, 'defs');
    _dispatchEventEditorEvents(position, modelBase.storFile);
    _dispatchEventChanged(position, modelBase.storFile);
    //_dispatchEventTsDefsChanged(position, modelBase.storFile);

}

async function _updateModelStatusTS(modelBase: mls.editor.IModelBase, changed: boolean): Promise<void> {

    if (!modelBase.storFile) throw new Error('Invalid stor file');
    const { project, shortName, folder } = modelBase.storFile;

    if (project === 0 && (shortName === 'loading' || shortName === 'testFile')) return;

    modelBase.storFile.hasError = false;


    const ok = await mls.l2.typescript.compileAndPostProcess(modelBase, true, true);

    let hasError = ok === false;
    if (!hasError) {

        const enhacementName = await getEnhancementName({ project, shortName, folder, level: 2 }).catch((e) => undefined);
        if (enhacementName && enhacementName !== "_blank") {
            const path = mls.l2.getPath(enhacementName);
            const enhancementInstance: mls.l2.enhancement.IEnhancementInstance | undefined = await mls.l2.enhancement.getEnhancementModule(path).catch((e) => { console.error('Error on getEnhancementModule: ' + e.message); return undefined });
            if (enhancementInstance) await enhancementInstance.onAfterChange(modelBase);
        }

        hasError = modelBase.storFile.hasError;

    }


    await _changeStatusFile(modelBase, modelBase.storFile, ((modelBase as mls.editor.IModelTS).compilerResults?.tripleSlashMLS?.variables) || undefined, hasError, changed);
}

async function _changeStatusFile(modelBase: mls.editor.IModelBase, storFile: mls.stor.IFileInfo, variables: mls.common.tripleslash.ITripleSlashVariables | undefined, hasError: boolean, changed: boolean): Promise<void> {

    if (!storFile) return; // new file dont have storFile ???
    const position: 'left' | 'right' | 'all' = _getPosition(modelBase.model.id, mapExt[storFile.extension]);

    storFile.hasError = hasError;

    _dispatchEventEditorEvents(position, modelBase.storFile);

    if (!hasError) monaco.editor.setModelMarkers(modelBase.model, 'markerSource', []);

    await _checkSameContent(modelBase, storFile);
    if (hasError) {
        _setErrorOnEditor(modelBase);
        _dispatchEventStatusOrErrorChanged(position, storFile);
        return;
    }

    if (changed) {
        _dispatchEventStatusOrErrorChanged(position, storFile);
    }
}

function _getPosition(modeIld: string, tp: 'ts' | 'html' | 'defs' | 'style' | 'test'): 'left' | 'right' | 'all' {
    let position: 'left' | 'right' | 'all';
    const idLeft = mls.editor.editors.left?.[tp]?.model.id;
    const idRight = mls.editor.editors.right?.[tp]?.model.id;
    const idActive = modeIld;
    if (idLeft === idActive && idRight === idActive) position = 'all';
    else if (idLeft === idActive) position = 'left';
    else position = 'right';
    return position;
}

async function _checkSameContent(modelBase: mls.editor.IModelBase, storFile: mls.stor.IFileInfo) {

    let sameContent: boolean = modelBase.originalCRC === mls.common.crc.crc32(modelBase.model.getValue()).toString(16);
    if (modelBase.storFile.extension === '.less') {
        sameContent = modelBase.originalCRC === mls.common.crc.crc32(removeTokensFromSource(modelBase.model.getValue()).trim()).toString(16);
    };

    if (sameContent) {
        if (storFile.status !== 'renamed' && (storFile.status !== 'new')) {
            storFile.status = 'nochange';
            await mls.stor.localStor.setContent(storFile, { content: null }); // clear localstorage
        }
    } else {
        if (storFile.status !== 'renamed' && (storFile.status !== 'new')) storFile.status = 'changed';
        storFile.updatedAt = new Date().toISOString();
        await mls.stor.localStor.setContent(storFile, await _getValueInfo(modelBase));
    }
}

function _setErrorOnEditor(modelBaseTS: mls.editor.IModelTS) {
    const errors = modelBaseTS.compilerResults?.errors;
    if (errors && errors.length > 0) {
        errors.forEach((err) => {
            if (err.start === 0 && err.file?.fileName === '') {
                setErrorOnModel(modelBaseTS.model, 1, 0, modelBaseTS.model.getLineContent(1).length, err.messageText as string, monaco.MarkerSeverity.Error)
            }
        })
    }
}

function _dispatchEventEditorEvents(position: 'left' | 'right' | 'all', storFile: mls.stor.IFileInfo) {
    if (position === 'all') {
        mls.events.fireFileAction('editorEvents' as any, storFile, 'left');
        mls.events.fireFileAction('editorEvents' as any, storFile, 'right');
        return;
    }
    mls.events.fireFileAction('editorEvents' as any, storFile, position);
}

function _dispatchEventStatusOrErrorChanged(position: 'left' | 'right' | 'all', storFile: mls.stor.IFileInfo) {
    if (position === 'all') {
        mls.events.fireFileAction('statusOrErrorChanged', storFile, 'left', 0);
        mls.events.fireFileAction('statusOrErrorChanged', storFile, 'right', 0);
        return;
    }
    mls.events.fireFileAction('statusOrErrorChanged', storFile, position, 0);
}

function _dispatchEventChanged(position: 'left' | 'right' | 'all', storFile: mls.stor.IFileInfo) {
    if (position === 'all') {
        mls.events.fireFileAction('editorChanged', storFile, 'left', 200);
        mls.events.fireFileAction('editorChanged', storFile, 'right', 200);
        return;
    }
    mls.events.fireFileAction('editorChanged', storFile, position, 200);
}

function _dispatchEventChangedLess(position: 'left' | 'right' | 'all', storFile: mls.stor.IFileInfo) {
    if (position === 'all') {
        mls.events.fire([2], ['styleChanged'] as any, JSON.stringify({ position: 'left', storFile }), 200);
        mls.events.fire([2], ['styleChanged'] as any, JSON.stringify({ position: 'right', storFile }), 200);
        return;
    }
    mls.events.fire([2], ['styleChanged'] as any, JSON.stringify({ position, storFile }), 200);
}

async function createStorFiles(fileBase: mls.stor.IFileInfo | undefined, ext: string): Promise<mls.stor.IFileInfo> {

    if (!fileBase) throw new Error('[createStorFiles] Invalid file base!');

    const { folder, shortName, project } = fileBase;

    let source = '';
    switch (ext) {
        case ('.ts'):
            source = await getBaseTemplate({ folder, shortName, project, extension: '.ts' }, '_100554_enhancementLit');
            break;
        case ('.html'):
            source = await getBaseTemplate({ folder, shortName, project, extension: '.html' });
            break;
        case ('.less'):
            source = await getBaseTemplate({ folder, shortName, project, extension: '.less' }, 'enhancementStyle');
            break;
        case ('.test.ts'):
            source = await getBaseTemplate({ folder, shortName, project, extension: '.test.ts' });
            break;
        case ('.defs.ts'):
            source = await getBaseTemplate({ folder, shortName, project, extension: '.defs.ts' });
            break;
    }

    const params = {
        project: fileBase.project,
        level: fileBase.level,
        shortName: fileBase.shortName,
        extension: ext,
        versionRef: '0',
        folder: fileBase.folder
    };

    const file = await mls.stor.addOrUpdateFile(params);
    if (!file) throw new Error('[createStorFile] Invalid storFile');

    file.status = 'new';
    const fileInfo: mls.stor.IFileInfoValue = {
        content: source,
        contentType: 'string'
    };

    await mls.stor.localStor.setContent(file, fileInfo);

    return file;

}
