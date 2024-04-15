/// <mls shortName="aimActionBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, unsafeHTML, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit';
import { AimBase } from './_100554_aimBase';
import { tasks, ITaskFinish, getUserConfigs } from './_100554_aimHelper';

@customElement('aim-action-base-100554')
export abstract class AimActionBase extends AimBase {

    constructor() {
        super();
        this.addEventListener('task-finished', this.onTaskFinishedEvent);
    }

    public abstract getRules(): AimActionRules;
    public abstract assistant: string;
    public abstract title: string; /** ex: "Spell Check" */
    public abstract renderAdd(): TemplateResult;

    childThis: any = undefined; // call back next function

    render(): TemplateResult {
        if (this.mode === 'add') return this.renderAdd();
        return this.renderTaskRoot();
    }

    public onTaskFinishedEvent(e: any): void {
        
        if (!e.detail || (e.detail.childIndex < 0) || !e.detail.status) throw new Error('invalid task-finished event, childIndex="' + e.detail?.childIndex + '", status="' + e.detail?.status + '"');

        const st: string = e.detail.status;
        if (st !== 'ok' && st !== 'error' && st !== 'rejected' && st !== 'userEvent') throw new Error('invalid task-finished event, status=' + st);

        const status: 'ok' | 'error' | 'rejected' | 'userEvent' = st;
        const childIndex = e.detail.childIndex;
        const newPrompt = e.detail.newPrompt;

        if (typeof childIndex !== 'number') throw new Error('invalid task-finished event, childIndex=' + childIndex);
        const result = e.detail.result;
        if (typeof result !== 'string') throw new Error('invalid task-finished event, result=' + result);
        if (this.taskIndex < 0 || this.taskIndex >= tasks.length) throw new Error('invalid task-finished event, taskIndex=' + this.taskIndex + ', tasks length=' + tasks.length);

        const taskRoot = tasks[this.taskIndex];

        if (childIndex < 0 || childIndex >= taskRoot.children.length) throw new Error('invalid task-finished event, childIndex=' + childIndex + ', children length=' + taskRoot.children.length);
        const taskChild = taskRoot.children[childIndex];
        const taskFinishResult: ITaskFinish = { status, taskIndex: this.taskIndex, childIndex, result, taskRoot, taskChild, newPrompt };
        if (taskChild.mode === 'initializing') taskChild.mode = 'in progress';
        if (!this.childThis) throw new Error('invalid finished event, actionBase is not waiting for this event');
        const oriChildThis = this.childThis;
        this.childThis = null;
        if (!taskChild.nextStep) throw new Error('please define nextStep');
        const nextStep: Function | undefined = oriChildThis[taskChild.nextStep];
        if (typeof nextStep !== 'function') throw new Error('nextStep must be a function');
        nextStep.call(oriChildThis, taskFinishResult); // execute dynamic function
        oriChildThis.requestUpdate();
    }

    addTaskAndWaitForCompletion = (taskRoot: cbe.ITaskRoot, child: cbe.ITaskChild): void => {
        if (taskRoot.mode === 'error' || child.mode === 'error') return;
        this.prepareNextStep(child);
        taskRoot.children.push(child);
        tasks[this.taskIndex] = taskRoot;
    }

    prepareNextStep = (child: cbe.ITaskChild): void => {
        if (!child.nextStep) throw new Error('please define nextStep');
        const nextStep: Function | undefined = (this as any)[child.nextStep];
        if (typeof nextStep !== 'function') throw new Error('nextStep must be a function');
        verifyCyclicLoop(child.nextStep);
        this.childThis = this;
    }

    private getPromptUser(task: cbe.ITaskRoot): string {
        let ret = '';
        if (task.children.length <= 0) return ret;
        const child = task.children.find((i: cbe.ITaskChild) => i.widget === '_100554_aimTaskExecLLM');
        if (!child || !child.prompt) return ret;
        const regex = /User:(.*?)(?=\n\n\n|$)/s;
        const match = child.prompt.match(regex);
        if (match && match.length > 0) {
            ret = match[1].trim();
        }
        return ret;
    }

    private getRef(taskRoot: cbe.ITaskRoot): string {
        let ref: string = '';
        for (let task of taskRoot.children) {
            if (task.ref) {
                ref = task.ref;
                break;
            }
        }
        return ref;
    }

    private getLastUpdateDate(taskRoot: cbe.ITaskRoot): string {
        let lastDate: Date | undefined;

        taskRoot.children.forEach((task) => {
            task.trace.forEach((trace) => {
                const dt = this.getLocateDateTimeInTrace(trace);
                if (dt && !lastDate) lastDate = dt
                else if (dt && lastDate && dt > lastDate) lastDate = dt
            })
        })

        return lastDate ? lastDate.toLocaleString() : '';
    }

    private getLocateDateTimeInTrace(line: string): Date | undefined {
        const [isoDatePart, ...descriptionParts] = line.split('Z:');
        try {
            const date = new Date(`${isoDatePart}Z`);
            if (isNaN(date.getTime())) return undefined;
            return date;
        } catch (error) {
            console.error(isoDatePart, error);
        }
    }

    renderTaskRoot(): TemplateResult {
        const renderChild = (child: cbe.ITaskChild, index: number) => {
            this.loadDynamicWidget(taskRoot, child, child.widget);
            if (child.mode !== 'processed'
                && child.mode !== 'error'
                && child.nextStep) this.prepareNextStep(child);
            const taskName = convertFileNameToTag(child.widget);

            const sHtml = `<${taskName} mode="${child.mode}" taskindex="${this.taskIndex}" childindex="${index}" />`
            return html`${unsafeHTML(sHtml)}`;
        }

        if (this.taskIndex < 0 || this.taskIndex >= tasks.length) return html`invalid task index`;

        const taskRoot = tasks[this.taskIndex];
        const index: number = Number(taskRoot.key?.split('/').pop()) || 0;
        const cost: number = taskRoot.cost || 0;
        const promptUser = this.getPromptUser(taskRoot);
        const ref = this.getRef(taskRoot);
        const lastUpdateDate = this.getLastUpdateDate(taskRoot);
        const configs = getUserConfigs();

        return html`
            <details>
                <summary>
                    <div class="action-title">
                        ${this.renderToolbar()} 
                        ${configs.cost ? html`<span title="Cost" class="ac ac-cost"> ${this.iconMoney} ${cost.toFixed(4)}</span>` : ''}
                        ${configs.sequencial ? html`<span title="Sequential" class="ac ac-id">${index.toString().padStart(5, '0')}</span>` : ''}
                        ${configs.countChild ? html`    <span title="Count Child" class="ac ac-count">${this.iconHash} ${taskRoot.children.length}</span>` : ''}
                        ${configs.title ? html`    <span title="Title" class="ac ac-title">${this.title}</span>` : ''}
                        ${configs.prompt ? html`    <span title="Prompt" class="ac ac-prompt"> ${this.iconPrompt} ${promptUser || '...'}</span>` : ''}
                        ${configs.user ? html`<span title="User" class="ac ac-user"> ${this.iconUser} ${taskRoot.userName} </span>` : ''}
                        ${configs.reference ? html`<span title="Reference" class="ac ac-ref"> ${this.iconRef} ${ref} </span>     ` : ''}
                        ${configs.lastUpdateDate ? html`<span title="Last update date " class="ac ac-date"> ${this.iconDate}  ${lastUpdateDate} </span>` : ''}                                         
                    </div>

                    
                </summary>
                ${taskRoot.children.map((child, index) => renderChild(child, index))}
            </details>
        `;

        // <div style='margin-bottom: 5em;' />
    }

    async loadDynamicWidget(taskRoot: cbe.ITaskRoot, child: cbe.ITaskChild, widget: string): Promise<void> {
        const tryLoad = async (): Promise<boolean> => {
            if (!widget) return false;
            try {
                const componentModule = await import('./' + widget);
                if (!componentModule) return false;
            } catch (error) {
                return false;
            }
            return true;
        }
        if (await tryLoad() === false) {
            child.trace.push(`Error on load widget ${widget}`);
            taskRoot.mode = child.mode = 'error';
            // this.requestUpdate(); // looping here
        }
    }


}

/**
 * Verifies if the provided function name is part of the current call stack.
 * This can be useful to detect potential cyclic loops or recursive calls that are not intended.
 * It throws a simulated error to capture the call stack and analyzes it.
 * 
 * @param functionName The name of the function to check in the call stack.
 * @throws {Error} If the function name is found in the call stack, indicating a potential cyclic loop.
 */
function verifyCyclicLoop(functionName: string): void {
    try {
        // Simulate an error to capture the call stack
        throw new Error("Simulated error for stack trace");
    } catch (error) {
        if (error instanceof Error && error.stack) {
            // Normalize stack trace lines and look for the function name
            const stackLines = error.stack.split("\n").map(line => line.trim());
            const functionInStack = stackLines.some(line => line.includes(functionName));
            if (functionInStack) {
                throw new Error(`Detected potential cyclic loop involving function: ${functionName}`);
            }
        }
    }
}


/**
 * Rules to active this action
 * @param levels levels this Action is active, ex: [2]
 * @param tags tags this Action is active, ex: "typescript"
 */
export interface AimActionRules {
    levels: number[];
    tags: string[];
}

export interface ResponseFindActions {
    project: number,
    shortName: string,
    title: string,
    levelsValid: boolean,
    tagsValid: boolean
}

/**
 * find all Actions cf rules
 */
export const findActions = async (levelsToVerify: number[], tagsToVerify: string[]): Promise<ResponseFindActions[]> => {
    const rc: ResponseFindActions[] = [];
    const keys = Object.keys(mls.stor.files)
        .filter(key => key.endsWith('.ts') &&
            (key.indexOf('aimAction') > 0) &&
            (key.indexOf('aimActionBase') < 0));
    for (const fnKey of keys) {
        const storFile = mls.stor.files[fnKey];
        if (storFile.level !== 2 || storFile.hasError) continue;
        const jsName = `./_${storFile.project}_${storFile.shortName}`;
        const className = storFile.shortName.charAt(0).toUpperCase() + storFile.shortName.slice(1);
        try {
            const module = await import(jsName);
            if (!module ||
                !(module[className])) {
                console.error(`error, aim action invalid, js not found or class ${storFile.shortName} not found in module: ${fnKey}`);
                continue;
            }
            if (!(module[className].prototype instanceof AimActionBase)) {
                console.error(`error, aim action invalid, must be extends from AimActionBase: ${fnKey}`);
                continue;
            }
            const i1 = new module[className]() as AimActionBase; // class instance
            const rules: AimActionRules = i1.getRules();
            const regexps = rules.tags.map(tag => new RegExp(tag.replace(/\*/g, '.*')));
            rc.push({
                shortName: storFile.shortName,
                project: storFile.project,
                title: i1.title || '?',
                levelsValid: levelsToVerify.some(level => rules.levels.includes(level)),
                tagsValid: tagsToVerify
                    .some(tagToVerify => regexps
                        .some(regexp => regexp.test(tagToVerify)))
            });
        }
        catch (err: any) {
            console.error(`error, aim action invalid, abend: ${fnKey}: ${err?.message}`);
        }
    }

    return rc;
}


