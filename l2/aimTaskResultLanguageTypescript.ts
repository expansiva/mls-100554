/// <mls shortName="aimTaskResultLanguageTypescript" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { ITaskFileInfo } from "./_100554_aimAddLanguageBase";

@customElement('aim-task-result-language-typescript-100554')
export class AimTaskResultLanguageTypescript extends AimTaskBase {

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
        const { project, shortName } = mls.l2.getPath(args.fileName);
        const models: mls.editor.IModels | undefined = mls.editor.getModels(project, shortName);
        if (!models || !models.ts) {
            this.taskChild.trace.push(new Date().toISOString() + `: no model ts find to this file: ${args.fileName}`);
            this.notifyCompleteByStatus('error', '');
            return;
        }
        const model = models.ts.model;

        const result = this.taskChild._tempResult;
        if (!result) {
            this.taskChild.trace.push(new Date().toISOString() + ': no result find is taskchild');
            this.notifyCompleteByStatus('error', '');
            return;
        }

        if (!args.detailsi18n) {
            this.taskChild.trace.push(new Date().toISOString() + ': no detailsi18n find is args');
            this.notifyCompleteByStatus('error', '');
            return;
        }

        const ts = this.extractScript(result);
        const startLineNumber = args.detailsi18n.startLine + 1;
        const startColumn = 1;
        const endLineNumber = args.detailsi18n.endLine - 1;;
        const endColumn = model.getLineMaxColumn(endLineNumber);
        const newText = ts;
        const editOperation = {
            range: new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn),
            text: newText,
            forceMoveMarkers: true
        };
        model.pushEditOperations([], [editOperation], () => null);
        this.notifyCompleteByStatus('ok', '');

    }

    private extractScript(src: string) {
        const regex = /```typescript([\s\S]+?)```/g;
        const matches = src.match(regex);
        const contents = [];

        let ret = src;

        if (matches) {
            for (const m of matches) {
                const conteudo = m.replace(/```typescript|```/g, '').trim();
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