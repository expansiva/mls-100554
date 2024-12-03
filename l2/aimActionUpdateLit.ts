/// <mls shortName="aimActionUpdateLit" project="100554" enhancement="_100554_enhancementLit" />

import { html, css, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer, extractScript } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';

const myName = '_100554_aimActionUpdateLit';

export class AimActionUpdateLit extends AimActionBase {

    public getRules(): AimActionRules[] {
        return [{
            level: 2,
            tags: []
        }]
    }

    public assistant = "gpt_ts";
    title = 'user Prompt';
    language = 'english';

    private handleCancel() {
        this.dispatchEvent(new CustomEvent('add-task', {
            detail: { cancel: 'true' }, bubbles: true, composed: true
        }));
    }

    renderAdd(): TemplateResult { // from abstract
        return html``;
    }

    // public function
    // return task created or -1
    public add(args: IAdd): number {
        if (!!args.error || !args.prompt) {
            console.error(' error on prompt: ', args.error);
            return -1;
        }

        const taskRoot: mls.cbe.ITaskRoot = {
            mode: 'initializing',
            title: args.title,
            widget: myName,
            children: [],
            args: JSON.stringify(args),
            trace: [new Date().toISOString() + ': trask created at ']
        }
        const taskid: number = tasks.push(taskRoot) - 1;
        this.mode = taskRoot.mode = 'in progress';
        this.prepareTaskExe(args, taskRoot);
        return taskid;
    }

    prepareTaskExe(args: IAdd,taskRoot: mls.cbe.ITaskRoot): void {
        // call LLM on server with prompt
        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: args.title || 'exec prompt',
            ref: args.fileRef,
            widget: '_100554_aimTaskExecLLM',
            agent: this.assistant,
            prompt: args.prompt,
            trace: [],
            nextStep: this.prepareTaskResult.name // danger, loop
        });
    }

    prepareTaskResult(taskFinishResult: ITaskFinish): void {
        // show result
        const child = taskFinishResult.taskChild;
        const result: string = child.result || '';
        if (taskFinishResult.status === 'error' || !result) {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            return;
        }
        child.mode = 'processed';
        this.addTaskAndWaitForCompletion(taskFinishResult.taskRoot, {
            mode: 'initializing',
            title: 'result',
            widget: '_100554_aimTaskResultText',
            trace: [],
            _tempResult: result,
            nextStep: this.endTasks.name // danger, loop
        });
        this.requestUpdate();
        const args: IAdd = JSON.parse(taskFinishResult.taskRoot.args || '');
        this.updateModelTS(result, args.fileRef, taskFinishResult.taskRoot.key || '', args.modelType);
    }

    endTasks(taskFinishResult: ITaskFinish): void {
        const child = taskFinishResult.taskChild;
        if (taskFinishResult.status === 'error') child.mode = 'error';
        else child.mode = 'processed';
        this.mode = taskFinishResult.taskRoot.mode = child.mode;
        this.requestUpdate();
        updateTaskOnServer(taskFinishResult.taskIndex);
    }

    async updateModelTS(newContent: string, fileRef: string, key: string, modelType: mls.editor.ModelType) {
        if (!fileRef || !fileRef.startsWith('_')) throw new Error('Invalid fileRef in taskRoot:' + key + ', fileRef:' + fileRef);
        const ts = extractScript(newContent, /```typescript([\s\S]+?)```/g);
        let eModel = mls.editor.models[fileRef];
        if (!eModel || !eModel.ts) {
            await this.loadModelTS(fileRef);
            eModel = mls.editor.models[fileRef]
        }
        if (!eModel || !eModel.ts) throw new Error('invalid fileRef in taskRoot, model dont exists: ' + fileRef);
        if (modelType !== 'ts') throw new Error('invalid modelType in taskRoot, must be "ts": ' + key);
        const model = eModel.ts?.model;
        this.updateModelWithUndo(model, ts);
    }

    updateModelWithUndo = (model: monaco.editor.ITextModel, value: string) => {
        if (!model || model.isDisposed()) {
            throw new Error('Invalid model');
        }
        if (typeof value !== 'string') {
            throw new Error('Invalid value. Expected a string');
        }

        model.pushEditOperations(
            [],
            [{
                range: model.getFullModelRange(),
                text: value,
                forceMoveMarkers: true
            }],
            () => null
        );
    };    

    async loadModelTS(fileRef: string) {
        // fileRef, ex _[project]_shortName
        mls.actual[0].setFullName(fileRef);
        const key = mls.stor.getKeyToFiles(
            mls.actual[0].project || 0,
            2, /* level */
            mls.actual[0].path || '',
            '', /** folder */
            '.ts' /** extension */
        );
        const file = mls.stor.files[key]; 
        if (!file) throw new Error('file dont exists: key=' + key);
        const content = await file.getContent('') || '';
        if (typeof content !== 'string') throw new Error('invalid file string in key ' + key);
        mls.editor.createModelTS(file, content);
    }

}

export interface IAdd {
    title: string,
    prompt: string,
    error: string,
    modelType: mls.editor.ModelType,
    fileRef: string,
}

const tag = convertFileNameToTag(myName);
if (!customElements.get(tag)) {
    customElements.define(tag, AimActionUpdateLit);
}

const cl = new AimActionUpdateLit();
export const add = (args: IAdd): number => cl.add(args);
