/// <mls shortName="tsTestASTTeste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TsTestAst, ICANIntegration, ICANTest } from "./_100554_tsTestAST";

@customElement('ts-test-a-s-t-teste-100554')
export class LessASTTest100554 extends LitElement {

    fileName = '_100554_tsTestASTTeste'
    model1 = mls.editor.models[this.fileName].test;
    fileToTest = '_100554_tsTestAST.test.ts';


    render() {
        return html`<p>testing file: ${this.fileToTest}</p>
         <pre style="position: relative;white-space: pre-wrap;">test: <br>${this.exeTest()}</pre>
         `;
    }

    exeTest = (): string => {
        if (!this.model1) return "undefined;";
        const editor = mls.services['100554_serviceSource_left']._ed1;
        if (!editor) return `No find editor`;
        const testAST = new TsTestAst(this.model1, editor);
        const testAst = this.test1(testAST);
        const testGetIntegrations = this.test2(testAST);
        const testGetTests = this.test3(testAST);
        const testAddTest = this.test4(testAST, 'new Test');
        const testAddTestSameTitle = this.test4(testAST, 'Test add 2');
        const testAddIntegration = this.test5(testAST, 'adicionar usuario com todos os parametros');


        return `result test1: ${testAst} \n\n
${'*'.repeat(100)}\n
result test2 - get integrations: ${testGetIntegrations}  \n\n\n
${'*'.repeat(100)}\n
result test3 - get tests: ${testGetTests}  \n\n\n
${'*'.repeat(100)}\n
result test4 - add test: ${testAddTest}  \n\n\n
${'*'.repeat(100)}\n
result test5 - add test already existing: ${testAddTestSameTitle}  \n\n\n
${'*'.repeat(100)}\n
result test6 - add integration: ${testAddIntegration}  \n\n\n
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
            title,
            params: { user: 'Guilherme ' }
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


    test5 = (testAST: TsTestAst, name: string) => {
        const integrationNew: ICANIntegration = {
            functionName: 'fcIntegrationNew',
            name,
            enabled: true,
            page: 'tsTestASTTeste',
            params: { user: 'Guilherme ', phone: '129999999', cep: '14403923' }
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
}