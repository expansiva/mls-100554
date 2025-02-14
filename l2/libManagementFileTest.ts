/// <mls shortName="libManagementFileTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * Adds a new test to the file, after the last test inside the collab_test_start and collab_test_end markers.
 *
 * @param {string} fileName - The name of the file to which the test will be added.
 * @param {string} test - The content of the test to be added.
 * @throws {Error} Throws an error if the file model or test model is invalid, or if the end marker is not found.
 */
export async function addTestInMonaco(fileName: string, test: string) {
    const models = mls.editor.models[fileName];
    if (!models) throw new Error(`Invalid model for file ${fileName}`);
    await createModelTestIfNeeded(fileName);
    const modelTsTest = models.test;
    if (!modelTsTest) throw new Error(`Invalid test model for file ${fileName}`);

    const model = modelTsTest.model;
    const content = checkIfNeedAddImports(model.getValue());
    const lines = content.split('\n');

    const endLineIndex = lines.length;
    if (endLineIndex === -1) throw new Error('End marker not found');

    model.setValue(`${content}\n${test}\n\n`);

}

/**
 * Retrieves a list of tests from the file, extracting the title and description for each test.
 *
 * @param {string} fileName - The name of the file to retrieve tests from.
 * @returns {Array<{title: string, description: string}>} A list of objects representing tests, with each object containing the `title` and `description` of the test.
 * @throws {Error} Throws an error if the file model or test model is invalid.
 */
export function getTestList(fileName: string) {
    const models = mls.editor.models[fileName];
    if (!models) throw new Error(`Invalid model for file ${fileName}`);
    const modelTsTest = models.test;
    if (!modelTsTest) throw new Error(`Invalid test model for file ${fileName}`);

    const model = modelTsTest.model;
    const content = model.getValue();

    const testPattern = /\/\*\*[\s\S]*?@title:\s*'([^']*)'[\s\S]*?@description:\s*'([^']*)'[\s\S]*?\*\//g;
    const tests = [];
    let match;

    while ((match = testPattern.exec(content)) !== null) {
        const [, title, description] = match;
        tests.push({ title, description });
    }

    return tests;
}

/**
 * Checks if the necessary imports are present in the file's content and adds them if missing.
 * The required imports are `describe` and `it` from `mocha`, and `expect` from `chai`.
 *
 * @param {string} content - The content of the file to check for imports.
 * @returns {string} The content of the file, with missing imports added at the beginning if necessary.
 */
function checkIfNeedAddImports(content: string): string {
    const requiredImports = [
        "import { addTest, setState, verifyState } from './_100554_libManagementCan';",
    ];

    const hasAllImports = requiredImports.every(importLine => content.includes(importLine));

    if (hasAllImports) {
        return content;
    }

    const importsToAdd = requiredImports.filter(importLine => !content.includes(importLine)).join('\n') + '\n';
    const firstLineEndIndex = content.indexOf('\n') + 1;
    const before = content.slice(0, firstLineEndIndex);
    const after = content.slice(firstLineEndIndex);

    return before + importsToAdd + after;
}

async function createModelTestIfNeeded(fileName: string) {
    const { project, shortName } = mls.l2.getPath(fileName);
    if (!mls.services['100554_serviceSource_left'] || typeof mls.services['100554_serviceSource_left'].createOrShowModelTsTest !== 'function') return;
    await mls.services['100554_serviceSource_left'].createOrShowModelTsTest(shortName, project, false);
}


