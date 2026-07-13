/// <mls fileReference="_100554_/l2/moduleToBeAST.ts" enhancement="_blank"/>

import { collabImport } from '/_102027_/l2/collabImport.js';
import { createStorFile, IReqCreateStorFile } from "/_102027_/l2/libStor.js";

const shortName = 'moduleToBe';

export async function getModuleToBeInfo(project: number, moduleName: string) {
    const folder = moduleName;
    const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');
    const storFile = mls.stor.files[key];
    if (!storFile) return { ok: false, message: `No found file '${shortName}' in project:${project}` };
    const moduleToBeInstance = await collabImport({
        folder: moduleName,
        project,
        shortName,
        extension: ".ts",
    });

    if (!moduleToBeInstance) return { ok: false, message: `No found file '${shortName}' in project:${project}` };
    if (!moduleToBeInstance.toBe) return { ok: false, message: `File dont have exported const 'toBe' in file: moduleToBe` };
    if (!moduleToBeInstance.toBePages) return { ok: false, message: `File dont have exported const 'toBePages' in file: moduleToBe` };

    return {
        ok: true,
        toBe: moduleToBeInstance.toBe,
        toBePages: moduleToBeInstance.toBePages
    }

}

export async function saveModuleToBe(project: number, moduleName: string, toBe: Object | undefined, toBePage: Object | undefined) {

    const folder = moduleName;
    const enhancement = '_blank';
    const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');
    const storFile = mls.stor.files[key];
    if (!storFile) {
        const ts = `
/// <mls shortName="${shortName}" project="${project}" folder="${folder}" enhancement="_blank" />

export const toBe = ${toBe ? JSON.stringify(toBe, null, 2) : {}};

export const toBePages = ${toBe ? JSON.stringify(toBePage, null, 2) : {}};

`;
        const param = {
            shortName: shortName,
            project: project,
            folder: folder || '',
            level: 2,
            source: ts

        } as IReqCreateStorFile;

        

        await createStorFile(param, true , true);

        return { ok: true };

    }

    const modelTS = await storFile.getOrCreateModel();
    if (!modelTS) return { ok: false, message: "No models found" };
    const model = modelTS.model;

    const moduleToBeInstance = await collabImport({
        folder: "",
        project,
        shortName,
        extension: ".ts",
    });

    if (!moduleToBeInstance) return { ok: false, message: `file not found: '${shortName}' ` };
    const newModelToBe = toBe || moduleToBeInstance.toBe;
    const newModelTobePages = toBe || moduleToBeInstance.toBePages;

    const newText = `
    /// <mls shortName="project" project="${project}" enhancement="_blank" groupName="other" />

    export const toBe = ${JSON.stringify(newModelToBe, null, 2)};

    export const toBePages = ${JSON.stringify(newModelTobePages, null, 2)};

    `
    model.setValue(newText.trim());
    await mls.l2.typescript.compileAndPostProcess(modelTS, false, true);
    return { ok: true };

}