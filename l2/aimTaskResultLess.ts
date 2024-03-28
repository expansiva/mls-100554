/// <mls shortName="aimTaskResultLess" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { getInfoMyService } from "./_100554_aimHelper";
import { initCollabShowCodeSnippet100554, CollabShowCodeSnippet100554 } from './_100554_collabShowCodeSnippet';
import { initCollabShowCodeDiff100554, CollabShowCodeDiff } from './_100554_collabShowCodeDiff';
import { ServiceDsStyles } from "_100554_serviceDsStyles";

@customElement('aim-task-result-less-100554')
export class AimTaskResultLess extends AimTaskBase {

    constructor() {
        super();
        initCollabShowCodeSnippet100554();
        initCollabShowCodeDiff100554();
    }

    @query('collab-show-code-snippet-100554')
    codeSnippet: CollabShowCodeSnippet100554 | undefined;

    @query('collab-show-code-diff-100554')
    codeDiff: CollabShowCodeDiff | undefined;

    private result: string = '';

    public onInitializing(): void { // from abstract
        this.notifyCompleteByStatus('ok', '');
    }

    firstUpdated(a: any) {
        super.firstUpdated(a);
        if (this.codeSnippet) this.codeSnippet.textIn = this.result;
    }

    private async setStyleDiff() {
        if (!this.codeDiff) return;
        const activeOpService = this.getActiveOpServiceIfIsValid();
        if (!activeOpService) {
            this.codeDiff.setInitialHistories('', this.result);
            return;
        };
        const value = activeOpService.getEditorComponentSource();
        this.codeDiff.setInitialHistories(value.trim(), this.result.trim());
    }

    private onToogleDetails(event: Event) {
        let detailsElement = event.target as HTMLDetailsElement;
        detailsElement = detailsElement.closest('details') as HTMLDetailsElement;
        if (!detailsElement) return;
        if (!detailsElement.open) {
            this.setStyleDiff();
        }
    }

    renderBody(taskRoot: cbe.ITaskRoot, child: cbe.ITaskChild) {

        const title = child.title;
        const body = child._tempResult || '';
        const { contentLess, contentsAfterLess, contentsBeforeLess } = this.extractBlocks(body);
        this.result = contentLess;

        return html`
        <details open>
            <summary>${title}</summary>
            <div>${contentsBeforeLess}</div>
            <div style='margin: 10px'>
                <collab-show-code-snippet-100554 language="less" withAccept="true" .onAccept=${this.onAccept.bind(this)}></collab-show-code-snippet-100554>
            </div> 
            <div>${contentsAfterLess}</div>
        </details>

        <details @click=${this.onToogleDetails}>
            <summary>${title}- Diff</summary>
            <div style='margin-top: 10px;height:400px;'>
            <collab-show-code-diff-100554 editorType="less" alias="100554_aimTaskResultLess">
            </collab-show-code-diff-100554>
            </div> 
        </details>

        `;
    }

    private onAccept() {

        const activeOpService = this.getActiveOpServiceIfIsValid();
        if (!activeOpService) {
            window.collabMessages.add('The service in the opposite position does not refer to this action', 'error')
            return;
        };
        const taskWithRef = this.taskRoot.children.find((task) => task.widget === "_100554_aimTaskDsStyles");
        if (!taskWithRef || !taskWithRef.ref) {
            window.collabMessages.add('This action dont have any file ref', 'error')
            return;
        };

        const actualRef = activeOpService.getActualRef();
        if (taskWithRef.ref !== actualRef) {
            window.collabMessages.add(`The current reference: ${actualRef},  does not match the action reference:${taskWithRef.ref}`
                , 'error')
            return;
        };

        activeOpService.setEditorSource(this.result);
    }

    private getActiveOpServiceIfIsValid() {
        const info = getInfoMyService(this);
        if (!info) return undefined;
        const activeServiceOp: ServiceDsStyles = info.actServiceOp;
        if (activeServiceOp.tagName !== 'SERVICE-DS-STYLES-100554') return undefined;
        if (!activeServiceOp.isComponent) return undefined;
        return activeServiceOp;
    }

    private extractBlocks(src: string) {
        const regex = /^(.*?)```less(.*)```(.*)/s;
        const matches = src.match(regex);
        let contentLess = '';
        let contentsBeforeLess = '';
        let contentsAfterLess = '';
        if (matches) {
            contentsBeforeLess = matches[1] || '';
            contentLess = matches[2] || '';
            contentsAfterLess = matches[3] || '';
        }
        return { contentLess, contentsAfterLess, contentsBeforeLess }
    }


    private extractLess(src: string) {
        const regex = /```less([\s\S]+?)```/g;
        const matches = src.match(regex);
        const contents = [];

        if (matches) {
            for (const m of matches) {
                const conteudo = m.replace(/```less|```/g, '').trim();
                contents.push(conteudo);
            }
        }

        return contents;
    }


}
