/// <mls shortName="aimActionAddIca" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';
import { getInfoMyService } from "./_100554_aimHelper";
import { getFormComponentsPrompt, getAttributeDefinitions } from './_100554_icaBaseDescription';
import { initIcaSelectGroup } from './_100554_icaSelectGroup';

const myName = '_100554_aimActionAddIca';

@customElement('aim-action-add-ica-100554')
export class AimActionAddIca extends AimActionBase {

    constructor() {
        super();
        initIcaSelectGroup();
        this.childThis = this;
    }

    public getRules(): AimActionRules {
        return {
            levels: [2],
            tags: ["*serviceSource*"]
        }
    }

    public assistant = "gpt3_typescript";

    public title = "New Component";

    @query('textarea') textarea: HTMLTextAreaElement | undefined;
    @property({ type: Boolean }) showPrompt: boolean = false;
    @property({ type: String }) actualSuggest: string = '';
    @property({ type: Array }) actualAttributes: string[] = [];

    language = 'english';

    private taskRoot: cbe.ITaskRoot | undefined;

    private handleCancel() {
        this.clear();
        this.dispatchEvent(new CustomEvent('add-task', {
            detail: { cancel: 'true' }, bubbles: true, composed: true
        }));
    }

    private handleAdd(): void {

        if (this.textarea) (window as any)['aim-action-add-ica-user'] = this.textarea.value;
        (window as any)['aim-action-add-ica-attr'] = this.actualAttributes;

        this.taskRoot = {
            mode: 'initializing',
            title: 'verify group and create new component',
            widget: myName,
            children: [],
            trace: [new Date().toISOString() + ': trask created at ']
        }
        tasks.unshift(this.taskRoot);
        this.prepareTask1(this.taskRoot);
        this.dispatchEvent(new CustomEvent('finished-add-task-root', {
            detail: this.taskRoot, bubbles: true, composed: true
        }));

    }

    private onGroupChanged(e: CustomEvent) {
        const groups: string[] = e.detail.selection;
        if (groups.length === 3) {
            const [root, subgroup, finalgroup] = groups;
            this.showPrompt = true;
            this.actualSuggest = getFormComponentsPrompt(root, subgroup, finalgroup);
            this.actualAttributes = getAttributeDefinitions(root, subgroup, finalgroup);
        } else {
            this.clear();
        }
    }

    private clear() {
        this.showPrompt = false;
        this.actualSuggest = ''
        this.actualAttributes = [];
    }

    renderAdd(): TemplateResult { // from abstract
        return html`
        <p> ${this.messages.template_title}</p>
        <ica-select-group-100554 @selection-changed=${this.onGroupChanged} ></ica-select-group-100554>

        ${this.showPrompt
                ? html`
            <ul>
                ${this.actualAttributes.map((attr) => {
                    return html`<li>${attr}</li>`
                })}
            </ul>

            <div>
                <label>Prompt:</label>
                <textarea .value=${this.actualSuggest} rows="5" placeholder=${this.messages.textarea_placelholder} style="width:100%"></textarea>
            </div>

            <div class="buttonGroup">
            <button @click="${this.handleCancel}">${this.messages.btn_cancel}</button>
            <button @click="${this.handleAdd}">${this.messages.btn_confirm}</button>
            </div>
        `
                : ''
            }`;
    }

    private getPrompt() {

        let user = '';
        let attr:string[] = [];
        if ((window as any)['aim-action-add-ica-user']) {
            user = (window as any)['aim-action-add-ica-user'];
            (window as any)['aim-action-add-ica-user'] = undefined;
        }

        if ((window as any)['aim-action-add-ica-attr']) {
            attr = (window as any)['aim-action-add-ica-attr'];
            (window as any)['aim-action-add-ica-attr'] = undefined;
        }

        const prompt = `
            ${this.messages.prompt_title}\n
            ${this.messages.prompt_specifications}?\n
            ${this.messages.prompt_framework}\n
            ${this.messages.prompt_language}\n
            ${this.messages.prompt_property}:\n ${attr.join('\n')}\n\n
            ${this.messages.prompt_user}:\n: ${user}\n\n
            ${this.messages.prompt_comments}\n
            ${this.messages.prompt_objective}\n\n
            `;

        return prompt;
    }

    prepareTask1(taskRoot: cbe.ITaskRoot): void {
        // create task to get typescript source from another side
        this.mode = taskRoot.mode = 'in progress';
        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: 'exec prompt',
            widget: '_100554_aimTaskExecLLM',
            agent: this.assistant,
            prompt: this.getPrompt(),
            trace: [],
            nextStep: this.prepareTask2.name // danger, loop
        });
    }

    prepareTask2(taskFinishResult: ITaskFinish): void {

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
            widget: '_100554_aimTaskResultCode',
            trace: [],
            _tempResult: result,
            nextStep: this.endTasks.name // danger, loop
        });

        this.requestUpdate();
    }


    endTasks(taskFinishResult: ITaskFinish): void {

        const { taskChild, taskRoot, status, result } = taskFinishResult;
        if (status === 'error') taskChild.mode = 'error';
        else if (status === 'rejected') taskChild.mode = 'processed';
        else if (status === 'ok') {
            taskChild.mode = 'processed';
            // this.setResultInEditor(result || '', taskRoot);
        }

        this.mode = taskFinishResult.taskRoot.mode = taskChild.mode;
        this.requestUpdate();
        updateTaskOnServer(taskFinishResult.taskIndex);
    }

    messages = {
        "prompt_title": "Create a well-typed web component using TypeScript and Lit 3 according to the requirements provided. This component should be crafted for an experienced developer, emphasizing clarity and efficiency in the code. There is no need for extensive explanations, but ensure any in-code comments are written in English. The component should integrate the specified properties and adhere to the user's request as outlined.",
        "prompt_specifications": "Specifications",
        "prompt_framework": "Framework: Utilize Lit 3 for the component development, leveraging its reactive update cycle and efficient rendering capabilities.",
        "prompt_language": "Language: The component must be written in TypeScript, ensuring strong typing for properties, functions, and any other relevant constructs. This will enhance code quality and maintainability.",
        "prompt_property": "Properties:",
        "prompt_user": "User:",
        "prompt_comments": "Comments: Ensure all comments within the code are concise and written in English. These should guide the developer through any complex logic or important considerations without overburdening the code with unnecessary explanations.",
        "prompt_objective": "The goal is to design a component that not only meets the functional requirements but also aligns with best practices in web development, offering scalability, ease of integration, and a user-friendly interface.",
        "template_title": "I will check the selected group and prompt and create a new Lit Component",
        "textarea_placelholder": "Enter your prompt here",
        "btn_cancel": "Cancel",
        "btn_confirm": "Confirm",


    }

}
