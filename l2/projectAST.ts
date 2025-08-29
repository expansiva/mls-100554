/// <mls shortName="projectAST" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { createModel } from './_100554_collabLibModel';

// Adds a new module with the given name to the modules array in the editor content.
export async function addModule(project: number, moduleName: string, forceCreateModel: boolean = false) {

    const modelTS = await getModel(project, forceCreateModel);
    if (!modelTS) return { ok: false, message: "No models found" };
    const model = modelTS.model;

    const code = model.getValue();
    const modules = parseModulesArray(code);

    if (!modules) return { ok: false, message: "Could not parse modules array" };

    // Checks if the module already exists by name.
    if (modules.some((m: any) => m.name === moduleName))
        return { ok: false, message: "Module already exists" };

    // Adds the new module to the array.
    modules.push({ name: moduleName });

    // Regenerates the array text with 2-space indentation.
    // Converts JSON output to JS-like syntax with single quotes and no quotes on keys.
    const newArrayText = JSON.stringify(modules, null, 2)
        .replace(/\"([^"]+)\":/g, '$1:') // remove quotes from keys
        .replace(/\"/g, "'");            // convert double quotes to single quotes

    // Finds the position of the original array text in the code.
    const regex = /export\s+const\s+modules\s*=\s*(\[[\s\S]*?\]);/m;
    const match = regex.exec(code);
    if (!match) return { ok: false, message: "Could not find modules array" };

    // Replaces the old array with the new formatted array.
    const start = match.index + match[0].indexOf(match[1]);
    const end = start + match[1].length;
    const fullText = model.getValue();

    const newText =
        fullText.slice(0, start) +
        newArrayText +
        fullText.slice(end);

    model.setValue(newText);
    return { ok: true };
}

export async function removeModule(project: number, moduleName: string, forceCreateModel: boolean = false) {

    const modelTS = await getModel(project, forceCreateModel);
    if (!modelTS) return { ok: false, message: "No models found" };
    const model = modelTS.model;

    const code = model.getValue();
    const modules = parseModulesArray(code);

    if (!modules) return { ok: false, message: "Could not parse modules array" };
    const index = modules.findIndex((m: any) => m.name === moduleName);
    if (index === -1) {
        return { ok: false, message: "Module not found" };
    }

    modules.splice(index, 1);

    const newArrayText = JSON.stringify(modules, null, 2)
        .replace(/\"([^"]+)\":/g, '$1:') // remove quotes from keys
        .replace(/\"/g, "'");            // convert double quotes to single quotes

    const regex = /export\s+const\s+modules\s*=\s*(\[[\s\S]*?\]);/m;
    const match = regex.exec(code);
    if (!match) return { ok: false, message: "Could not find modules array" };

    const start = match.index + match[0].indexOf(match[1]);
    const end = start + match[1].length;
    const fullText = model.getValue();

    const newText =
        fullText.slice(0, start) +
        newArrayText +
        fullText.slice(end);

    model.setValue(newText);
    return { ok: true };
}


// Parses the `modules` array from the code string using JavaScript evaluation.
// Returns the array or null if parsing fails.
function parseModulesArray(code: string): any[] | null {
    try {
        // Extracts only the array content (text between brackets)
        const regex = /export\s+const\s+modules\s*=\s*(\[[\s\S]*?\]);/m;
        const match = regex.exec(code);
        if (!match) return null;

        const arrayCode = match[1];

        // Uses Function constructor to safely evaluate the array as JavaScript.
        const fn = new Function(`return ${arrayCode};`);
        return fn();
    } catch {
        return null;
    }
}

async function getModel(project: number, forceCreateModel: boolean = false): Promise<mls.editor.IModelTS  | undefined> {
    const shortName = 'project';
    const folder = '';
    const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');
    const keyModels = mls.editor.getKeyModel(project, shortName, folder)
    const storFile = mls.stor.files[key];
    if (!storFile) return;
    let models = mls.editor.models[keyModels];
    if (!models || !models.ts && forceCreateModel) {
        const modelTS = await createModel(storFile);
        return modelTS;
    };
    return models.ts;
}

