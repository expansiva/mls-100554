/// <mls shortName="aimTaskResultLanguageHtml" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { ITaskFileInfo } from "./_100554_aimAddLanguageBase";

@customElement('aim-task-result-language-html-100554')
export class AimTaskResultLanguageTypescript extends AimTaskBase {

    public onInitializing(): void { // from abstract
        this.changeFile(this.taskRoot);
    }

    changeFile(taskRoot: cbe.ITaskRoot) {

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
        const model = (mfile as any).modelHTML;
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


    onIconClick(action: string): void {
        console.error('dont implemented')
    }
}