/// <mls shortName="aimTaskBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, unsafeHTML, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { executePrompt, tasks, ITaskFinish } from "./_100554_aimHelper";
import { AimBase } from "./_100554_aimBase";

@customElement('aim-task-base-100554')
export abstract class AimTaskBase extends AimBase {

    @property({ type: Number }) public childIndex = -1;
    public taskRoot: cbe.ITaskRoot = {
        mode: 'error',
        title: 'invalid task index: ' + this.taskIndex,
        widget: '',
        children: [],
        trace: ['invalid task index on AimTaskBase']
    };
    public taskChild: cbe.ITaskChild = {
        mode: 'error',
        title: 'invalid child index: ' + this.childIndex,
        widget: '',
        trace: ['invalid child index on AimTaskBase']
    }

    createRenderRoot() {
        return this; // dont use shadow root
    }

    public abstract onInitializing(): void;

    render() {
        return this.renderTaskStatus()
    }

    renderTaskStatus() {
        this.initTaskRootAndTaskChild();
        if (this.mode === 'initializing' &&
            this.taskChild.mode === 'initializing') {
            this.onInitializing(); // don't wait, avoid exe 2x
        }

        return html`
      <details>
        <summary> ${this.renderToolbar()} ${this.taskChild?.title}</summary>
          ${this.renderBody(this.taskRoot, this.taskChild)}
      </details>
    `;
    }

    public initTaskRootAndTaskChild() {
        if (this.taskIndex < 0 || this.taskIndex >= tasks.length) {
            this.taskRoot = {
                mode: 'error',
                title: 'invalid task index: ' + this.taskIndex,
                widget: '',
                children: [],
                trace: ['invalid task index on AimTaskBase']
            }
        } else {
            this.taskRoot = tasks[this.taskIndex];
            if (this.childIndex < 0 || this.childIndex >= this.taskRoot.children.length) {
                this.taskRoot.mode = 'error';
                this.taskChild = {
                    mode: 'error',
                    title: 'invalid child index: ' + this.childIndex,
                    widget: '',
                    trace: ['invalid child index on AimTaskBase, taskRoot.length=' + this.taskRoot.children.length]
                }
            } else {
                this.taskChild = this.taskRoot.children[this.childIndex];
            }
        }
    }

    renderBody(taskRoot: cbe.ITaskRoot, child: cbe.ITaskChild) {
        const promptTitle = `prompt len=${child.prompt?.length}, tokens=${child.promptTokens}`;
        let resultTitle = 'no result yeat';

        if (child.result) resultTitle = `result len=${child.result.length}, tokens=${child.resultTokens}`;

        return html`
            ${child.prompt ? this.renderDetails(promptTitle, child.prompt) : ''}
            ${child.result ? this.renderDetails(resultTitle, child.result) : ''}
            ${child ? this.renderTraceList('trace', child) : ''}
        `;
    }

    renderDetails(title: string, body: string): TemplateResult {
        return html`
      <details>
        <summary>${title}</summary>
        <pre style="white-space: break-spaces;">${body}</pre> 
      </details>
    `;
    }

    renderTraceList(title: string, child: cbe.ITaskChild) {
        const traceString = JSON.stringify(child, null, 2);
        const root = { ...this.taskRoot }
        root.children = []
        const traceRootString = JSON.stringify(root, null, 2);
        return html`
      <details>
        <summary>${title}</summary>
        <ul>
          ${child.trace.map(item => html`<li>${this.locateDateTimeInTrace(item)}</li>`)}
        </ul>
        <p>Trace Object:</p>
        <pre>${traceString}</pre>
        <p>Trace root Object:</p>
        <pre>${traceRootString}</pre>
      </details>
    `;
    }

    locateDateTimeInTrace(line: string): string {
        const [isoDatePart, ...descriptionParts] = line.split('Z:');
        const description = descriptionParts.join('Z:');
        try {
            const date = new Date(`${isoDatePart}Z`);
            if (isNaN(date.getTime())) return description;
            const localDate = date.toLocaleString();
            return `${localDate}: ${description}`;
        } catch (error) {
            console.error(isoDatePart, error);
            return line;
        }
    }

    sendFinishedNotification(detail: ITaskFinish) {
        this.dispatchEvent(new CustomEvent('task-finished', {
            detail, bubbles: true, composed: true
        }));
    }

    notifyCompleteByStatus(status: 'ok' | 'error' | 'rejected' | 'userEvent', result: string, prompt?: string) {
        this.sendFinishedNotification({
            status,
            result,
            newPrompt: prompt,
            taskIndex: this.taskIndex,
            childIndex: this.childIndex,
            taskRoot: this.taskRoot,
            taskChild: this.taskChild,
        });
    }

}
