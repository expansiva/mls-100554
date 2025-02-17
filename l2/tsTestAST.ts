/// <mls shortName="tsTestAST" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { MonacoDriver } from "./_100554_tsTestMonaco";

/**
 * Represents an AST node.
 * @typedef {Object} ASTNode
 * @property {string} type - The type of the AST node (e.g., 'Program', 'FunctionDeclaration').
 * @property {string} [name] - The name of the node (e.g., function name).
 * @property {any} [value] - The value associated with the node (e.g., function body or array content).
 * @property {ASTNode[]} [children] - An array of child nodes.
 * @property {number} [startLine] - The start line of the node in the source code.
 * @property {number} [endLine] - The end line of the node in the source code.
 */

type ASTNode = {
    type: string;
    name?: string;
    value?: any;
    children?: ASTNode[];
    startLine?: number;
    endLine?: number;
};


/**
 * Class to parse a TypeScript test file and generate an AST.
 */
export class TsTestAst {
    public ast: ASTNode | undefined;
    public modelTest: mls.editor.IModelTest | undefined;
    public monacoDriver: MonacoDriver;
    public editor: monaco.editor.IStandaloneCodeEditor;


    /**
     * Creates an instance of TsTestAst.
     * @param {mls.editor.IModelTest} modelTest - The Monaco editor model test instance.
     */
    constructor(modelTest: mls.editor.IModelTest, editor: monaco.editor.IStandaloneCodeEditor) {
        this.modelTest = modelTest;
        this.editor = editor;
        this.monacoDriver = new MonacoDriver(editor);
        this.parse();
    }

    /**
     * Parses the TypeScript code from the model test and returns the AST.
     * @returns {ASTNode | undefined} The generated AST, or undefined if parsing fails.
     */
    parse = (): ASTNode | undefined => {
        if (!this.modelTest?.model) return;
        const value = this.modelTest.model.getValue();
        this.ast = this.parseTypeScript(value);
        return this.ast;
    }

    /**
     * Gets the integrations from the parsed AST.
     * @returns {any[]} The integrations parsed from the AST.
     */
    getIntegrations() {
        return this._getIntegrations();
    }

    /**
     * Gets the tests from the parsed AST.
     * @returns {any[]} The tests parsed from the AST.
     */
    getTests() {
        return this._getTests();
    }

    /**
     * Adds a new test to the AST and inserts it into the test array in the Monaco editor.
     * @param {ICANTest} test - The test object to be added.
     * @param {Function} fcTest - The test function to be associated with the test.
     * @returns {boolean} True if the test was added successfully, false otherwise.
     * @throws {Error} Throws an error if the test already exists or if there are issues with the AST.
     */
    addTest(test: ICANTest, fcTest: Function) {
        return this._addTest(test, fcTest);
    }

    /**
     * Adds a new integration to the test file.
     * @param {ICANIntegration} integration - The integration to be added.
     * @param {Function} fc - The function associated with the integration.
     * @returns {boolean} Returns true if the integration was successfully added.
     */
    addIntegration(integration: ICANIntegration, fc: Function) {
        return this._addIntegration(integration, fc);
    }

    /**
     * Parses TypeScript code into an AST.
     * @param {string} code - The TypeScript code to parse.
     * @returns {ASTNode} The generated AST from the code.
     */
    private parseTypeScript(code: string): ASTNode {
        const ast: ASTNode = { type: 'Program', children: [] };
        const totalLines = code.split('\n').length;
        ast.startLine = 1;
        ast.endLine = totalLines;
        const arr = this.parseArrays(code);
        const fcs = this.parseFunctionNames(code);
        ast.children = [...arr, ...fcs];
        return ast;
    }

    /**
     * Parses arrays from TypeScript code and returns an array of AST nodes.
     * @param {string} code - The TypeScript code to parse.
     * @returns {ASTNode[]} An array of AST nodes representing the arrays in the code.
     */
    private parseArrays(code: string): ASTNode[] {
        const rc: ASTNode[] = [];
        const arrayRegex = /export\s+const\s+(\w+)\s*:\s*[\w\[\]<,>\s]*=\s*(\[[\s\S]*?\])/g;
        let match;
        while ((match = arrayRegex.exec(code)) !== null) {
            const arrayName = match[1];
            const arrayContent = match[2];

            const startLine = code.substring(0, match.index).split('\n').length;
            const endLine = startLine + arrayContent.split('\n').length - 1;

            rc.push({
                type: 'ArrayDeclaration',
                name: arrayName,
                value: arrayContent,
                startLine,
                endLine
            });
        }

        return rc;
    }


    /**
     * Parses function names from TypeScript code and returns an array of function declarations as AST nodes.
     * @param {string} code - The TypeScript code to parse.
     * @returns {ASTNode[]} An array of AST nodes representing function declarations in the code.
     */
    private parseFunctionNames(code: string): ASTNode[] {
        const functionRegex = /(?:export\s+)?function\s+(\w+)\s*\(/gm;
        let match;
        const rc: ASTNode[] = [];

        while ((match = functionRegex.exec(code)) !== null) {

            const functionName = match[1];
            const startLine = code.substring(0, match.index).split('\n').length;
            const functionStartIndex = match.index + match[0].length;
            let openBraceIndex = code.indexOf('{', functionStartIndex);
            const functionBody = code.substring(openBraceIndex);

            let depth = 0;
            let endIndex = 0;
            for (let i = 0; i < functionBody.length; i++) {
                const char = functionBody[i];

                if (char === '{') {
                    depth++;
                } else if (char === '}') {
                    depth--;
                }

                if (depth === 0) {
                    endIndex = openBraceIndex + i + 1;
                    break;
                }
            }

            const endLine = code.substring(0, endIndex).split('\n').length;

            rc.push({
                type: 'FunctionDeclaration',
                name: functionName,
                startLine,
                endLine
            });
        }

        return rc;
    }

    /**
     * Parses and retrieves the integrations from the AST's children.
     * @returns {any[]} The parsed integrations.
     * @throws {Error} Throws an error if parsing the integrations fails.
     */
    private _getIntegrations(): ICANIntegration[] {
        if (!this.ast) return [];
        const integrationsAst = this.ast.children?.find((item) => item.type === 'ArrayDeclaration' && item.name === 'integrations');
        if (!integrationsAst || !integrationsAst.value) return [];
        const validJson = integrationsAst.value.replace(/'/g, '"');
        try {
            const rc = eval(validJson);
            return rc;
        } catch (err: any) {
            throw new Error('Error on parse integrations')
        }
    }

    /**
     * Parses and retrieves the tests from the AST's children.
     * @returns {any[]} The parsed tests.
     * @throws {Error} Throws an error if parsing the tests fails.
     */
    private _getTests(): ICANTest[] {
        if (!this.ast) return [];
        const testsAst = this.ast.children?.find((item) => item.type === 'ArrayDeclaration' && item.name === 'tests');
        if (!testsAst || !testsAst.value) return [];
        const validJson = testsAst.value.replace(/'/g, '"');
        try {
            const rc = eval(validJson);
            return rc;
        } catch (err: any) {
            throw new Error('Error on parse test')
        }
    }

    /**
     * Internal method to add a test to the AST and update the Monaco editor.
     * @param {ICANTest} test - The test object to add.
     * @param {Function} fcTest - The test function to add.
     * @returns {boolean} True if the test was successfully added.
     * @throws {Error} Throws an error if the test already exists or AST information is missing.
     */
    private _addTest(test: ICANTest, fcTest: Function) {

        this.ast = this.parse();
        const tests = this._getTests();
        const alreadyExist = tests.find((t) => t.title === test.title);
        if (alreadyExist) throw new Error(`Test with title "${test.title}" already exists.`);
        tests.push(test);
        const testNode = this.ast?.children?.find((item) => item.type === 'ArrayDeclaration' && item.name === 'tests');
        if (!this.modelTest) throw new Error('Invalid test model');
        if (!testNode) throw new Error('Your test file must be a declaration for test "export const tests: ICANTest[] = [];" ');
        if (!testNode.startLine || !testNode.endLine) throw new Error('Missing information on AST "startLine" or "endLine"');

        let newTest = JSON.stringify(tests, null, 2)
            .replace(/"(\w+)":/g, '$1:');

        newTest = `export const tests: ICANTest[] = ${newTest} \n`;

        this.monacoDriver.replaceLines(this.modelTest.model, testNode.startLine, testNode.endLine, newTest);
        this.monacoDriver.finishEdit(this.modelTest.model);

        this._addFunction(fcTest);
        this.ast = this.parse() // refresh ast
        this._formatEditor(this.modelTest.model);
        return true;
    }

    /**
     * Deletes a test from the AST and updates the Monaco editor.
     * @param {string} testName - The name of the test to delete.
     * @throws {Error} Throws an error if the test does not exist or deletion fails.
     */
    private _deleteTest(testName: string) {

    }

    /**
     * Adds a new integration to the AST and updates the Monaco editor.
     * @param {ICANIntegrations} integration - The integration object to add.
     * @param {Function} fcIntegration - The integration function to add.
     * @throws {Error} Throws an error if the integration already exists or if AST information is missing.
     */
    private _addIntegration(integration: ICANIntegration, fcIntegration: Function) {
        this.ast = this.parse();
        const integrations = this._getIntegrations();
        const alreadyExist = integrations.find((t) => t.name === integration.name);
        if (alreadyExist) throw new Error(`Integration with name "${integration.name}" already exists.`);
        integrations.push(integration);
        const integrationNode = this.ast?.children?.find((item) => item.type === 'ArrayDeclaration' && item.name === 'integrations');
        if (!this.modelTest) throw new Error('Invalid test model');
        if (!integrationNode) throw new Error('Your test file must be a declaration for integrations "export const integrations: ICANIntegrations[] = [];" ');
        if (!integrationNode.startLine || !integrationNode.endLine) throw new Error('Missing information on AST "startLine" or "endLine"');

        let newIntegration = JSON.stringify(integrations, null, 2)
            .replace(/"(\w+)":/g, '$1:');

        newIntegration = `export const integrations: ICANIntegration[] = ${newIntegration} \n`;

        this.monacoDriver.replaceLines(this.modelTest.model, integrationNode.startLine, integrationNode.endLine, newIntegration);
        this.monacoDriver.finishEdit(this.modelTest.model);

        this._addFunction(fcIntegration);
        this.ast = this.parse() // refresh ast
        this._formatEditor(this.modelTest.model);
        return true;
    }

    /**
     * Deletes an integration from the AST and updates the Monaco editor.
     * @param {string} integrationName - The name of the integration to delete.
     * @throws {Error} Throws an error if the integration does not exist or deletion fails.
     */
    private _deleteIntegration(integrationName: string) {

    }

    /**
     * Adds a new function to the AST and updates the Monaco editor.
     * @param {Function} fc - The function to add.
     * @returns {boolean} True if the function was successfully added.
     * @throws {Error} Throws an error if AST information is missing or the test model is invalid.
     */
    private _addFunction(fc: Function) {

        if (!this.modelTest) throw new Error('Invalid test model');
        this.ast = this.parse();
        if (!this.ast) throw new Error('Invalid ast');
        const fcString = fc.toString();
        const { startLine, endLine } = this.ast;
        if (!startLine || !endLine) throw new Error('Missing information on AST "startLine" or "endLine"');
        this.monacoDriver.insertLine(this.modelTest.model, endLine + 1, fcString);
        this.monacoDriver.finishEdit(this.modelTest.model);
        return true;
    }

    private _formatEditor(model: monaco.editor.ITextModel) {
        if (!this.editor) return;
        if (this.editor.getModel()?.id !== model.id) return;
        this.editor.trigger('anyString', 'editor.action.formatDocument', null);
    }
}


export interface ICANTest {
    title: string,
    functionName: string,
    params: Record<string, any>
}

export interface ICANIntegration {
    enabled: boolean,
    name: string,
    page: string,
    functionName: string,
    params: Record<string, any>
}