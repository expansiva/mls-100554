/// <mls shortName="aimActionAddIca" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';
import { getInfoMyService } from "./_100554_aimHelper";
import { getFormComponentsPrompt, getAttributeDefinitions } from './_100554_icaBaseDescription';
import { initIcaSelectGroup, IcaSelectGroup } from './_100554_icaSelectGroup';


const myName = '_100554_aimActionAddIca';

@customElement('aim-action-add-ica-100554')
export class AimActionAddIca extends AimActionBase {

    constructor() {
        super();
        initIcaSelectGroup();
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
    @query('ica-select-group-100554') selectGroup: IcaSelectGroup | undefined;

    @property({ type: Boolean }) showPrompt: boolean = false;
    @property({ type: String }) actualSuggest: string = '';
    @property({ type: Array }) actualAttributes: string[] = [];
    actualGroups: string[] = [];


    language = 'english';

    private taskRoot: cbe.ITaskRoot | undefined;

    private handleCancel() {
        this.clear();
        this.selectGroup?.clear();
        this.dispatchEvent(new CustomEvent('add-task', {
            detail: { cancel: 'true' }, bubbles: true, composed: true
        }));
    }

    private handleAdd(): void {

        if (this.textarea) (window as any)['aim-action-add-ica-user'] = this.textarea.value;

        (window as any)['aim-action-add-ica-file-info'] = {
            group: this.actualGroups,
            attr: this.actualAttributes,
        };

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
            this.actualGroups = groups;
        } else {
            this.clear();
        }
    }

    private clear() {
        this.showPrompt = false;
        this.actualSuggest = ''
        this.actualAttributes = [];
        this.actualGroups = [];
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
                <label><b>Prompt:</b></label>
                <textarea .value=${this.actualSuggest} rows="5" placeholder=${this.messages.textarea_placelholder} style="width:100%"></textarea>
            </div>

        `
                : ''}
        <div class="buttonGroup">
            <button @click="${this.handleCancel}">${this.messages.btn_cancel}</button>
            ${this.showPrompt ? html`<button @click="${this.handleAdd}">${this.messages.btn_confirm}</button>` : ''}
        </div>

            `;
    }

    private getPrompt(source: string) {

        let user = '';

        if ((window as any)['aim-action-add-ica-user']) {
            user = (window as any)['aim-action-add-ica-user'];
            (window as any)['aim-action-add-ica-user'] = undefined;
        }

        // const prompt = `
        //     ${this.messages.prompt_title}\n
        //     ${this.messages.prompt_specifications}:\n
        //     ${this.messages.prompt_framework}\n
        //     ${this.messages.prompt_language}\n
        //     ${this.messages.prompt_user}:\n ${user}\n\n
        //     ${this.messages.prompt_comments}\n
        //     ${this.messages.prompt_objective}\n
        //     ${this.messages.prompt_expected_output}\n\n
        //     Source: ${source}
        // `;

        const prompt = `
System: Using typescript and lit 3, complete text between --completion_str-- and --completion_end--, using the source below.

User: ${user}

Expected Output Format: Return the newly created component in the TS language, in a single block. Code comments should be in English, but keep existing comments.

Source: ${source}
`

        return prompt;
    }

    prepareTask1(taskRoot: cbe.ITaskRoot): void {

        let obj = {};
        if ((window as any)['aim-action-add-ica-file-info']) {
            obj = (window as any)['aim-action-add-ica-file-info'];
            (window as any)['aim-action-add-ica-file-info'] = undefined;
        }

        this.mode = taskRoot.mode = 'in progress';
        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: 'prepare source',
            widget: '_100554_aimTaskPrepareIcaSource',
            prompt: JSON.stringify(obj),
            trace: [],
            nextStep: this.prepareTask2.name // danger, loop
        });
    }

    prepareTask2(taskFinishResult: ITaskFinish): void {

        const child = taskFinishResult.taskChild;
        if (taskFinishResult.status === 'error') {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            return;
        }
        const source = taskFinishResult.result;
        if (!source) {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            child.trace.push('invalid finish , must be notify finish with result field');
            this.requestUpdate();
            return;
        }
        child.mode = 'processed';

        this.addTaskAndWaitForCompletion(taskFinishResult.taskRoot, {
            mode: 'initializing',
            title: 'exec prompt',
            widget: '_100554_aimTaskExecLLM',
            ref: child.ref,
            agent: this.assistant,
            prompt: this.getPrompt(source),
            trace: [],
            nextStep: this.prepareTask3.name // danger, loop
        });
    }

    prepareTask3(taskFinishResult: ITaskFinish): void {

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
        "prompt_property": "Properties: Using properties with according with source below",
        "prompt_user": "User",
        "prompt_comments": "Comments: Ensure all comments within the code are concise and written in English. These should guide the developer through any complex logic or important considerations without overburdening the code with unnecessary explanations.",
        "prompt_objective": "The goal is to design a component that not only meets the functional requirements but also aligns with best practices in web development, offering scalability, ease of integration, and a user-friendly interface.",
        "prompt_expected_output": "Expected output format: Return the newly created component in the TS language, in a single block. Code comments should be in English, but keep existing comments",

        "template_title": "Irá verificar o grupo selecionado e criar um novo componente Lit",
        "textarea_placelholder": "Entre com o prompt aqui",
        "btn_cancel": "Cancelar",
        "btn_confirm": "Confirmar",


    }

}
