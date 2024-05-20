/// <mls shortName="aimActionVerifyInternationalization" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer, getInfoMyService } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';
import { ISourceTypescriptData } from './_100554_aimTaskGetSourceLanguageTypescript';
import { initAimSelectWidget100554 } from './_100554_aimSelectWidget';

const myName = '_100554_aimActionVerifyInternationalization';

/// **collab_i18n_start**
const message_pt = {
    "action_title": "verificar textos para internacionalização",
    "btn_cancel": "Cancelar",
    "btn_confirm": "Confirmar",
}

const message_en = {
    "action_title": "verify text internationalization",
    "btn_cancel": "Cancel",
    "btn_confirm": "Confirm",
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('aim-action-verify-internationalization-100554')
export class AimActionVerifyInternationalization extends AimActionBase {

    constructor() {
        super();
        initAimSelectWidget100554();
    }

    private msg: MessageType = messages['en'];

    public getRules(): AimActionRules {
        return {
            levels: [2, 5],
            tags: ["*serviceSource*", "*"]
        }
    }
    public assistant = "gpt3_typescript";
    public title = "Check Internationalization";

    private info: { level: number, position: string, actServiceOp: any } | undefined;

    render() {
        this.info = getInfoMyService(this);
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return super.render();
    }

    language = 'english';

    private handleCancel() {
        this.dispatchEvent(new CustomEvent('add-task', {
            detail: { cancel: 'true' }, bubbles: true, composed: true
        }));
    }

    private handleAddL5(e: CustomEvent): void {
        const files: string[] = e.detail;
        const { project } = mls.actual[5];
        if (!project) throw new Error('Invalid project');
        for (const file of files) {
            this.addTask(project, file);
        }
    }

    private handleAdd(): void {
        if (!this.info || (this.info.actServiceOp && this.info.actServiceOp.tagName !== 'SERVICE-SOURCE-100554')) {
            throw new Error('Invalid service opposite side');
        }
        const position = this.info.position === 'left' ? 'right' : 'left';
        if (!(mls.actual[2] as any)[position]) throw new Error('Invalid File in mls.actual[2]')
        const { project, shortName } = (mls.actual[2] as any)[position];
        this.addTask(project, shortName);
    }

    addTask(project: number, shortName: string) {
        const ref: ITaskRootArgs = {
            fileName: `_${project}_${shortName}`
        }

        const taskRoot: cbe.ITaskRoot = {
            mode: 'initializing',
            title: this.msg.action_title,
            widget: myName,
            children: [],
            args: JSON.stringify(ref),
            trace: [new Date().toISOString() + ': trask created at ']
        }
        tasks.unshift(taskRoot);
        this.prepareTask1(taskRoot, ref.fileName);
        this.dispatchEvent(new CustomEvent('finished-add-task-root', {
            detail: taskRoot, bubbles: true, composed: true
        }));
    }

    renderAdd(): TemplateResult { // from abstract

        if (!this.info) throw new Error('Invalid Service Info');
        const level = this.info.level;
        if (![2, 5].includes(level)) throw new Error('Invalid level');

        return html`
        ${level === 2
                ? html`
                <p> ${this.msg.action_title}</p>
                <br>
                <div class="buttonGroup">
                <button @click="${this.handleCancel}">${this.msg.btn_cancel}</button>
                <button @click="${this.handleAdd}">${this.msg.btn_confirm}</button>
                </div>
            `: html`
                <aim-select-widget-100554
                    @select-widget-confirm=${this.handleAddL5}
                    @select-widget-cancel=${this.handleCancel}

                ></aim-select-widget-100554>
            `

            }

    `;
    }

    getPrompt(source: string) {
        const prompt = `Analisar o source abaixo e retornar uma 'tabela' com as colunas: texto, todas as strings que devem ser internacionalizadas(mensagens de erro, mensagens informativas, textos de interface do usuário, etc..). 

        *Ignorar variáveis, urls. 
        *Não retornar explicações

Source: ${source}`;
        return prompt;
    }

    prepareTask1(taskRoot: cbe.ITaskRoot, ref: string): void {

        // create task to get typescript source from another side
        this.mode = taskRoot.mode = 'in progress';
        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: 'get typescript source',
            widget: '_100554_aimTaskGetSourceLanguageTypescript',
            ref,
            trace: [],
            nextStep: this.prepareTask2.name // danger, loop
        });
    }

    prepareTask2(taskFinishResult: ITaskFinish): void {

        // call LLM on server with prompt
        const child = taskFinishResult.taskChild;
        if (taskFinishResult.status === 'error') {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            return;
        }

        const data: ISourceTypescriptData = JSON.parse(taskFinishResult.result);
        if (!data.source) {
            this.mode = taskFinishResult.taskRoot.mode = child.mode = 'error';
            child.trace.push('invalid finish , no internationalization find in this file');
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
            prompt: this.getPrompt(data.source),
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
            ref: child.ref,
            widget: '_100554_aimTaskResultTable',
            trace: [],
            _tempResult: result,
            nextStep: this.endTasks.name // danger, loop
        });
        this.requestUpdate();
    }

    endTasks(taskFinishResult: ITaskFinish): void {
        const child = taskFinishResult.taskChild;
        if (taskFinishResult.status === 'error') child.mode = 'error';
        else child.mode = 'processed';
        this.mode = taskFinishResult.taskRoot.mode = child.mode;
        this.requestUpdate();
        updateTaskOnServer(taskFinishResult.taskIndex);
    }

}

export interface ITaskRootArgs {
    fileName: string
}
