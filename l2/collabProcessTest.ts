/// <mls fileReference="_100554_/l2/collabProcessTest.ts" enhancement="_100554_enhancementLit" />

import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { TsTestAst } from "/_100554_/l2/tsTestAST.js";

@customElement('collab-process-test-100554')
export class CollabProcessTest extends CollabLitElement {

    @property({ type: String }) script: string = '';
    @property({ type: String }) labelError: string = '';
    @property({ type: String }) labelOk: string = '';

    @query('#txtScript') txtScript: HTMLTextAreaElement | undefined;
    @query('#iptnamefunc') iptnamefunc: HTMLInputElement | undefined;
    @query('#checkintegration') checkintegration: HTMLInputElement | undefined;

    render() {
        return html`
            <h3>Process Test</h3>
            <div style="display:flex; gap:.5rem">
                <div>
                    <label style="width: 145px;">Name func:</label>
                    <input id="iptnamefunc" type="text" @blur="${this.changeNameFunc}"></input>
                </div> 
                <div>
                    <label style="width: 163px;">Create integration:</label>
                    <input id="checkintegration" type="checkbox" ></input>
                </div>              
                <button @click="${this.onSave}">Save</button>
            </div>
            <div class="error"> ${this.labelError}</div>
            <div class="success"> ${this.labelOk}</div>
            <div>
                <textarea id="txtScript" .value="${this.script ? this.decodeHtmlEntities(decodeURIComponent(atob(this.script))) : ''}"spellcheck="false">
                </textarea>
            </div>
        

        `;
    }

    private decodeHtmlEntities(str: string) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = str;
        return textarea.value;
    }



    // -------IMPLEMENTATION--------

    private changeNameFunc(e: Event) {

        if (!this.iptnamefunc || this.iptnamefunc.value == '') {
            this.labelError = 'The function name was not provided!'
            return;
        }

        if (!this.txtScript) {
            this.labelError = 'Not found script';
            return;
        }

        const vl = this.iptnamefunc?.value.trim();
        this.txtScript.value = this.txtScript.value.replace(/@funcname/g, vl);


    }

    private async onSave() {

        if (!this.iptnamefunc || this.iptnamefunc.value == '') {
            this.labelError = 'The function name was not provided!'
            return;
        }

        if (!this.txtScript) {
            this.labelError = 'Not found script';
            return;
        }

        const args = (this.parentElement as any).args;
        if (!args) {
            this.labelError = 'Not found args'
            return;
        }

        args.exe.functionName = this.iptnamefunc.value.trim();
        const params = this.createObjeTest(args.exe);

        this.addInEditor({ args: params, script: this.txtScript.value, integration: args.exe });



    }

    private createObjeTest(info: any): { functionName: string, params: any[] } {

        const ret = {
            functionName: info.functionName,
            params: []
        }

        const ex: any = {};
        Object.keys(info.schema).forEach((k) => {

            if (ex[k]) return;

            ex[k] = info.schema[k].value;
            delete info.schema[k].value;

        });

        (ret.params as any).push(ex);
        return ret;

    }

    private addInEditor(params: { args: any, script: string, integration: any }) {

        try {

            const editor = mls.services['100554_serviceSource_left']._ed1;
            if (!editor) throw new Error('Not found editor');


            const info = (mls.actual[2] as any).left;
            const key = mls.editor.getKeyModel(info.project, info.shortName, info.folder, 2);

            const model = mls.editor.models[key];
            if (!model || !model.test) throw new Error('Not found model');

            const testAST = new TsTestAst(model.test, editor);

            testAST.addTest(params.args, params.script);

            if (this.checkintegration && this.checkintegration.checked) {
                testAST.addIntegration(params.integration, '');
            }

            const sev = this.closest('service-detail-100554') as any;
            if (!sev) return
            sev.openService('_100554_servicePreview', 'right', sev.level);

        } catch (e) {
            console.info(e);

        }
    }


}