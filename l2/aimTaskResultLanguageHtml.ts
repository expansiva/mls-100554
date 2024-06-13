/// <mls shortName="aimTaskResultLanguageHtml" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { ITaskFileInfo } from "./_100554_aimAddLanguageBase";
import { initCollabShowCodeDiff100554, CollabShowCodeDiff } from './_100554_collabShowCodeDiff';

@customElement('aim-task-result-language-html-100554')
export class AimTaskResultLanguageTypescript extends AimTaskBase {

    constructor() {
        super();
        initCollabShowCodeDiff100554();
    }

    @query('collab-show-code-diff-100554')
    codeDiff: CollabShowCodeDiff | undefined;

    public onInitializing(): void { // from abstract
        this.changeFile(this.taskRoot);
    }

    changeFile(taskRoot: mls.cbe.ITaskRoot) {

        if (!taskRoot.args) {
            this.taskChild.trace.push(new Date().toISOString() + ': taskroot args is missing');
            this.notifyCompleteByStatus('error', '');
            return;
        }
        const args: ITaskFileInfo = JSON.parse(taskRoot.args);

        const mfile = mls.l2.editor.mfiles[args.fileName];
        if (!mfile && !((mfile as any).modelHTML)) {
            this.taskChild.trace.push(new Date().toISOString() + ': no mfile find to this file');
            this.notifyCompleteByStatus('error', '');
            return;
        }

        const result = this.taskChild._tempResult;
        if (!result) {
            this.taskChild.trace.push(new Date().toISOString() + ': no result find is taskchild');
            this.notifyCompleteByStatus('error', '');
            return;
        }

        const html = this.extractHtml(result);

        const model: monaco.editor.ITextModel = (mfile as any).modelHTML;
        this.original = model.getValue();

        const startLineNumber = 1;
        const startColumn = 1;
        const endLineNumber = model.getLineCount();
        const endColumn = model.getLineMaxColumn(endLineNumber);
        const newText = html;
        const editOperation = {
            range: new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn),
            text: newText,
            forceMoveMarkers: true
        };
        model.pushEditOperations([], [editOperation], () => null);
        this.notifyCompleteByStatus('ok', '');

    }

    private extractHtml(src: string) {
        const regex = /```html([\s\S]+?)```/g;
        const matches = src.match(regex);
        const contents = [];

        let ret = src;

        if (matches) {
            for (const m of matches) {
                const conteudo = m.replace(/```html|```/g, '').trim();
                contents.push(conteudo);
            }

            ret = contents[0];
        }

        return ret;
    }


    private result: string = '';
    private original: string = '';

    private alreadyInit: boolean = false;
    handleClick(taskRoot: mls.cbe.ITaskRoot) {
        this.setValues(taskRoot);
        if (this.alreadyInit) return;
        this.codeDiff?.init();
        this.alreadyInit = true;
    }

    private async setValues(taskRoot: mls.cbe.ITaskRoot) {

        if (!taskRoot.args) return;
        const args: ITaskFileInfo = JSON.parse(taskRoot.args);

        if (!this.codeDiff) return;
        this.codeDiff.actualTextResult = this.result.trim();
        this.codeDiff.actualTextDiffModified = this.result.trim();
        this.codeDiff.actualTextDiffOriginal = args.html;
    }

    renderBody(taskRoot: mls.cbe.ITaskRoot, child: mls.cbe.ITaskChild) {

        const body = child._tempResult || '';
        const h = this.extractHtml(body);
        this.result = h;

        return html`
        <details @click=${() => this.handleClick(taskRoot)}>
            <summary>Result</summary>
            <div>
                <div style='margin: 10px;'>
                    <collab-show-code-diff-100554
                        language="html"
                        withdiff  
                    ></collab-show-code-diff-100554>
                </div> 
            </div>
        </details>
        `;
    }


    onIconClick(action: string): void {
        console.error('dont implemented')
    }
}