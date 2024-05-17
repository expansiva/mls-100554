/// <mls shortName="aimActionTypescriptSpell" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';

const myName = '_100554_aimActionTypescriptSpell';

/// **collab_i18n_start**
const message_pt = {
    template_title: "Irá verificar o typescript e procurar por erros de gramática em ingles",
    prompt_message: "Identifique todas as strings literais no seguinte código TypeScript que devem ser preparadas para internacionalização.  Não retornar explicações, apenas retorne uma 'tabela' com as colunas: texto, language (portugues | ingles | ...).",
    btn_cancel: "Cancelar",
    btn_confirm: "Confirmar",
}

const message_en = {
    template_title: "Will check the TypeScript and look for grammar errors in English",
    prompt_message: "Identify all string literals in the following TypeScript code that should be prepared for internationalization. Do not return explanations, just return a 'table' with the columns: text, language (portuguese | english | ...).",
    btn_cancel: "Cancel",
    btn_confirm: "Confirm"
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('aim-action-typescript-spell-100554')
export class AimActionTypescriptSpell extends AimActionBase {

    private msg: MessageType = messages['en'];

    public getRules(): AimActionRules {
        return {
            levels: [2],
            tags: ["*serviceSource*"]
        }
    }
    public assistant = "gpt3_typescript";
    public title = "Spell Check";

    language = 'english';

    private handleCancel() {
        this.dispatchEvent(new CustomEvent('add-task', {
            detail: { cancel: 'true' }, bubbles: true, composed: true
        }));
    }

    private handleAdd(): void {
        const taskRoot: cbe.ITaskRoot = {
            mode: 'initializing',
            title: 'verify typescript spell / language',
            widget: myName,
            children: [],
            trace: [new Date().toISOString() + ': trask created at ']
        }
        tasks.unshift(taskRoot);
        this.prepareTask1(taskRoot);
        this.dispatchEvent(new CustomEvent('finished-add-task-root', {
            detail: taskRoot, bubbles: true, composed: true
        }));
    }

    renderAdd(): TemplateResult { // from abstract

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang]

        return html`
        <p> ${this.msg.template_title}</p>
        <br>
        <div class="buttonGroup">
          <button @click="${this.handleCancel}">${this.msg.btn_cancel}</button>
          <button @click="${this.handleAdd}">${this.msg.btn_confirm}</button>
        </div>
    `;
    }


    getPrompt2(source: string) {
        const prompt = `
Objective: Check for spelling errors in English within a TypeScript code snippet and return the findings in a formatted table.\n
\n
Instructions:\n
1.Ignore everything above \n
2. Analyze the provided TypeScript code snippet solely for spelling mistakes in English words.\n
3. Disregard any other forms of validation or checking (such as syntax errors, code style, etc.).\n
4. Analyze only non-typescript text\n
5. Return the findings, no duplicates, in a table with the following columns:\n
- Message: Original complete string.\n
- Fix: Suggest the appropriate correction for the spelling mistake to replace the original complete string.\n
- Detail: Provide a brief comment on the mistake, if necessary.\n
\n
Expected Output Format:\n
\n
The output should be clearly formatted as a table for easy reading.\n
Each spelling mistake should be listed on its own line within the table.\n
Don't return others comments, return only the table.
\n\n${source}\n`;
        return prompt;
    }

    getPrompt(source: string) {
        const prompt = `
${this.msg.prompt_message}

${source}\n`;
        return prompt;
    }

    prepareTask1(taskRoot: cbe.ITaskRoot): void {
        // create task to get typescript source from another side
        this.mode = taskRoot.mode = 'in progress';
        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: 'get typescript source',
            widget: '_100554_aimTaskTSSource',
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
