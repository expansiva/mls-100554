/// <mls shortName="tsTestASTTeste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TsTestAst, ICANIntegration, ICANTest } from "/_100554_/l2/tsTestAST.js";

@customElement('ts-test-a-s-t-teste-100554')
export class LessASTTest100554 extends LitElement {


    fileName = '_100554_tsTestASTTeste'
    model1 = mls.editor.models[this.fileName].test;
    fileToTest = '_100554_tsTestAST.test.ts';

    @property() result: string = '';

    render() {
        return html`<p>testing file: ${this.fileToTest}</p>
         <button @click=${this.exeTest}>Run all Test</button>

         <pre style="position: relative;white-space: pre-wrap;">Result: <br> ${this.result} </pre>
         
         `;
    }

    exeTest = () => {
        if (!this.model1) return this.result = "undefined;";
        const editor = mls.services['100554_serviceSource_left']._ed1;
        if (!editor) return this.result = `No find editor`;
        const testAST = new TsTestAst(this.model1, editor);
        console.info({ testAST })

        const testAst = this.test1(testAST);
        const testGetIntegrations = this.test2(testAST);
        const testGetTests = this.test3(testAST);

        // const testAddTest = '';
        // const testAddTestSameTitle = '';
        // const testAddIntegration= '';
        // const testDeleteTest = '';

        const testAddTest = this.test4(testAST, 'new Test');
        const testAddTestSameTitle = this.test4(testAST, 'Test add 2');
        const testAddIntegration = this.test5(testAST, 'adicionar usuario com todos os parametros');
        const testDeleteTest = this.test6(testAST, 'Test add');

        this.result = `result test1: ${testAst} \n\n
${'*'.repeat(100)}\n
result test - get integrations: ${testGetIntegrations}  \n\n\n
${'*'.repeat(100)}\n
result test - get tests: ${testGetTests}  \n\n\n
${'*'.repeat(100)}\n
result test - add test: ${testAddTest}  \n\n\n
${'*'.repeat(100)}\n
result test - add test already existing: ${testAddTestSameTitle}  \n\n\n
${'*'.repeat(100)}\n
result test - add integration: ${testAddIntegration}  \n\n\n
${'*'.repeat(100)}\n
result test - delete test: ${testDeleteTest}  \n\n\n
${'*'.repeat(100)}\n

        `;
    }


    test1 = (testAST: TsTestAst) => {
        const rc = testAST.parse();
        console.info(rc);
        return JSON.stringify(rc, null, 2);
    }

    test2 = (testAST: TsTestAst) => {
        const rc = testAST.getIntegrations();
        console.info(rc);
        return JSON.stringify(rc, null, 2);
    }

    test3 = (testAST: TsTestAst) => {
        const rc = testAST.getTests();
        console.info(rc);
        return JSON.stringify(rc, null, 2);
    }

    test4 = (testAST: TsTestAst, title: string) => {
        const testNew: ICANTest = {
            functionName: 'fcTestNew',
            params: [{
                user: 'String', value: 'Guilherme'
            }]
        };

        const fc = function fcTestNew() {
            console.info('Implements here');
        }

        try {
            const rc = testAST.addTest(testNew, fc);
            console.info(rc);
            return `${rc}`
        } catch (err: any) {
            return `${err.message}`

        }

    }

    test5 = (testAST: TsTestAst, description: string) => {
        const integrationNew: ICANIntegration = {
            functionName: 'fcIntegrationNew',
            description,
            enabled: true,
            page: 'tsTestASTTeste',
            schema: {
                user: { type: 'String', description: 'The user name' },
                phone: { type: 'String', description: 'The user phone number' },
                cep: { type: 'Number', description: 'The user cep', optional: true },
            }
        };

        const fc = function fcIntegrationNew() {
            console.info('Implements here');
        }

        try {
            const rc = testAST.addIntegration(integrationNew, fc);
            console.info(rc);
            return `${rc}`
        } catch (err: any) {
            return `${err.message}`

        }

    }

    test6 = (testAST: TsTestAst, name: string) => {
        try {
            const rc = testAST.deleteTest(name);
            return `${rc}`
        } catch (err: any) {
            return `${err.message}`
        }

    }
}