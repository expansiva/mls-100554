/// <mls shortName="projectAST" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

// Adds a new module with the given name to the modules array in the editor content.
export function addModule(model: monaco.editor.ITextModel | undefined, moduleName: string) {

    if (!model) return { ok: false, message: "No model found in editor" };

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

export function removeModule(model: monaco.editor.ITextModel | undefined, moduleName: string) {
    if (!model) return { ok: false, message: "No model found in editor" };

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

