/// <mls shortName="aimActionTokensNew" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';

const myName = '_100554_aimActionTokensNew';


@customElement('aim-action-tokens-new-100554')
export class AimActionTokensNew extends AimActionBase {

    public getRules(): AimActionRules {
        return {
            levels: [3],
            tags: ["*serviceDsTokens*"]
        }
    }
    public assistant = "gpt3_typescript";
    public title = "New Tokens";

    @query('textarea')
    textarea: HTMLTextAreaElement | undefined;

    language = 'english';

    private handleCancel() {
        this.dispatchEvent(new CustomEvent('add-task', {
            detail: { cancel: 'true' }, bubbles: true, composed: true
        }));
    }

    private handleAdd(): void {

        if (this.textarea) {
            (window as any)['aim-action-tokens-new-100554'] = this.textarea.value;
        }
        const taskRoot: cbe.ITaskRoot = {
            mode: 'initializing',
            title: 'verify tokens and create a new set',
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

    private onSuggestClick(e: MouseEvent) {
        if (!this.textarea) return;
        let text: string = '';
        const target = e.target as HTMLElement;
        const txtEl = target.querySelector('span');
        if (!txtEl) text = target.innerText;
        else text = txtEl.innerText;
        this.textarea.value = text;
    }

    private prompts = [
       'Criar um conjunto de tokens com tema minimalista',
       'Criar um conjunto de tokens com tema retro',
       'Criar um conjunto de tokens com cores mais vibrantes',
       'Criar um conjunto de tokens com cores neutras',
    ]

    renderAdd(): TemplateResult { // from abstract
        return html`
        <p> Irá verificar os tokens e criar um novo conjunto de tokens </p>

        <div>
            <label>Sugestão:</label>
            <div class="prompt-suggestion">
                ${this.prompts.map((prompt)=> html`
                    <span @click=${this.onSuggestClick}>
                        <span >${prompt}</span>
                    </span>
                `)}
            
            </div>
        <div>

        <div>
            <label>Prompt:</label>
            <textarea rows="5" placeholder="Digite aqui seu prompt" style="width:100%"></textarea>
        </div>
        <br>
        <div class="buttonGroup">
          <button @click="${this.handleCancel}">Cancelar</button>
          <button @click="${this.handleAdd}">Confirmar</button>
        </div>
    `;
    }


    getPrompt(source: string) {
        let user = '';
        if ((window as any)['aim-action-tokens-new-100554']) {
            user = (window as any)['aim-action-tokens-new-100554'];
            (window as any)['aim-action-tokens-new-100554'] = undefined;
        }
        const prompt = `
Objective: Criar um conjunto de tokens em LESS.
\n
\n
System:\n
1. Usando less, CSS, criar um novo conjunto de tokens less, baseado nos tokens existentes \n
2. Criar os tokens conforme o modelo abaixo, mantendo as chaves e alterando os valores \n\n
User:\n
1. ${user}
\n
\n
Expected Output Format:
\n
\n
Retorna o novo conjunto de tokens em LESS, em um único bloco, sem comentários novos no código, e manter comentários existentes que servem como auxiliar na UI.\n

\n\n${source}\n`;
        return prompt;
    }

    prepareTask1(taskRoot: cbe.ITaskRoot): void {
        // create task to get typescript source from another side
        this.mode = taskRoot.mode = 'in progress';
        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: 'get tokens source',
            widget: '_100554_aimTaskDsTokens',
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
            widget: '_100554_aimTaskResultTokens',
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