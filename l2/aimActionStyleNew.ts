/// <mls shortName="aimActionStyleNew" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { tasks, ITaskFinish, updateTaskOnServer } from './_100554_aimHelper';
import { AimActionBase, AimActionRules } from './_100554_aimActionBase';

const myName = '_100554_aimActionStyleNew';

@customElement('aim-action-style-new-100554')
export class AimActionStyleNew extends AimActionBase {

    public getRules(): AimActionRules {
        return {
            levels: [3],
            tags: ["*serviceDsStyle*"]
        }
    }
    public assistant = "gpt3_typescript";
    public title = "New Style";

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
            (window as any)['aim-action-style-new-100554'] = this.textarea.value;
        }
        const taskRoot: cbe.ITaskRoot = {
            mode: 'initializing',
            title: 'verify css and create',
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
        'Adicionar uma animação de entrada',
        'Adicionar uma personalização no scrollbar, deixando mais minimalista',
    ]

    renderAdd(): TemplateResult { // from abstract
        return html`
        <p> Irá verificar os tokens e criar um novo conjunto de tokens </p>

        <div>
            <label>Sugestão:</label>
            <div class="prompt-suggestion">
                ${this.prompts.map((prompt) => html`
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

        <div class="buttonGroup">
          <button @click="${this.handleCancel}">Cancelar</button>
          <button @click="${this.handleAdd}">Confirmar</button>
        </div>
    `;
    }


    getPrompt(source: string) {
        let user = '';
        if ((window as any)['aim-action-style-new-100554']) {
            user = (window as any)['aim-action-style-new-100554'];
            (window as any)['aim-action-style-new-100554'] = undefined;
        }
        const prompt = `
Objective: Criar um novo css em LESS.
\n
\n
System:\n
1. Usando less, CSS, criar um novo estilo conforme modelo abaixo, e sugestões do usuário \n
2. Criar um Less isolado, utilizando os tokens conforme modelo abaixo\n
User:\n
1. ${user}\n\n
\n
\n
Expected Output Format:
\n
\n
Retorna o novo css criado na linguagem LESS, em um único bloco e sem a listagem de tokens, comentários no código em ingles, manter comentários existentes que servem como auxiliar na UI.\n

\n\n${source}\n`;
        return prompt;
    }

    prepareTask1(taskRoot: cbe.ITaskRoot): void {
        // create task to get typescript source from another side
        this.mode = taskRoot.mode = 'in progress';
        this.addTaskAndWaitForCompletion(taskRoot, {
            mode: 'initializing',
            title: 'get less source',
            widget: '_100554_aimTaskDsStyles',
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
            widget: '_100554_aimTaskResultLess',
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
