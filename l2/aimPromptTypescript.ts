/// <mls shortName="aimPromptTypescript" project="100554" enhancement="_100554_enhancementLit" />

import { html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { collab_arrow_up_long } from './_100554_collabIcons';
import { readTasks } from "./_100554_aimHelper"
import './_100554_aimPromptExample';
import './_100554_aimActionUpdateLit';
import './_100554_aimList';
import { IcaLitElement, propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';
import { add as addActionUpdateLit } from './_100554_aimActionUpdateLit';

const dataForDetails: mls.events.IPluginDetail = {
    project: 100554,
    shortName: 'aimPromptTypescript'
}
const modelType: mls.editor.ModelType = 'ts';
const languageid: string = 'typescript';

/// **collab_i18n_start**
const message_pt = {
    btnSend: 'Enviar',
    placeHolder: 'Digite sua pergunta...' 
}

const message_en = {
    btnSend: 'Send',
    placeHolder: 'Enter your question...'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt,
}
/// **collab_i18n_end**

@customElement('aim-prompt-typescript-100554')
export class AimPromptTypeScript extends IcaLitElement {

    private msg: MessageType = messages['en'];

    /**
     * This widget can be used in 4 contexts:
     * - in the editor -> renderMode = 'editor'
     * - in service detail -> renderMode = 'detail'
     * - in preview (default) -> renderMode = 'desenv'
     */
    @property({ type: "string" }) renderMode: 'editor' | 'detail' | 'desenv' = "desenv";

    /**
     * Model key used to find the file and model.
     * Example: _100111_file1 (without extension).
     * If modelKey === "", show input.
     */
    @property ({ type: "string" }) modelKey = "";

    /**
     * Text being edited.
     */
    @property({ type: "string", reflect: true }) text = "";
    @property({ type: Boolean }) isLoaded = false;    

    async connectedCallback() {
        super.connectedCallback();
        await readTasks();
        this.isLoaded = true;
    }

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (!this.isLoaded) {
            return html`<p>Loading...</p>`;
        }
        if (this.renderMode === "desenv") {
            return html`${this.renderChoiceModelKey()}
            <hr>
            ${this.renderTask()}`;
        }

        this.validateModelKey();
        console.log('isButtonDisabled', this.isError, this.text.trim().length)
        const isButtonDisabled = this.isError || this.text.trim() === '';
        
        return html
            `
            <div class="aim-prompt-search-container">
                <textarea
                    rows="1"
                    autocomplete="off"
                    .value="${this.text}"
                    placeholder=${this.msg.placeHolder}
                    class="aim-prompt-search-input"
                    id="searchInput"
                    @focus="${this.handleFocus}"
                    @input="${this.refreshHeight}"
                ></textarea>
                <button class="search-button"
                  @click="${this.handleClick}"
                  ?disabled="${isButtonDisabled}">
                ${collab_arrow_up_long}</button>
            </div>`;
    }

    isError: boolean = true;

    renderChoiceModelKey(): TemplateResult {
        // Only if in desenv
        // User inputs the modelKey.
        // After validation, show input in red if there is an error.
        if (this.renderMode !== "desenv") return html``;

        this.validateModelKey();
        const borderColor = this.isError ? 'border-color: red;' : '';

        return html`
            <div class="model-key-container">
                <label for="modelKeyInput">File reference:</label>
                <input
                    id="modelKeyInput"
                    type="text"
                    readonly
                    disabled
                    class="model-key-input"
                    style="${borderColor}"
                    value="${this.getActualWidget()}"
                    @input="${(e: Event) => this.modelKey = (e.target as HTMLInputElement).value}"
                />
                ${this.isError ? html`<p class="error-message">source not loaded in editor</p>` : ''}
            </div>
        `;
    }

    renderTask(): TemplateResult {
        if (this.taskid <= 0) return html``;

        return html`
        <br>
        <hr>
        <aim-list-100554>
            <aim-action-update-lit-100554 mode="processed" taskindex="${this.taskid}" title="Prompt for ${this.modelKey}">
            </aim-action-update-lit-100554>
        </aim-list-100554>
        <br>`;
    }

    getActualWidget(): string {
        const actualLeft: any = (mls.actual[2] as any) ?.left;
        return `_${actualLeft?.project}_${actualLeft?.shortName}`;
    }

    validateModelKey(): void {
        this.isError = (!mls.editor.models[this.getActualWidget()]?.ts);
    }

    private handleFocus(event: KeyboardEvent) {
        if (this.isInIframe() || this.isInDetail()) return;
        mls.events.fire(mls.actualLevel, 'PluginDetails', JSON.stringify(dataForDetails))
    }

    private refreshHeight() {
        const textarea = this.parentElement?.querySelector("#searchInput") as HTMLTextAreaElement | null;
        if (!textarea) throw new Error('field searchInput not found');
        this.text = textarea.value;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }        

    taskid: number = -1;

    private async handleClick() {
        const textarea = this.parentElement?.querySelector("#searchInput") as HTMLTextAreaElement | null;
        if (!textarea) throw new Error('field searchInput not found');
        this.validateModelKey();
        if (this.isError && textarea.value.length < 5) return;

        const fileRef = this.modelKey;
        let error: string = "";
        let prompt: string = await this.getPrompt(textarea.value);
        try {
            prompt = await this.getPrompt(textarea.value);
        } catch (e: any | Error) {
            error = e.message || "An unknown error occurred";
        }

        this.taskid = addActionUpdateLit({
            title: `${fileRef} ${modelType}`,
            prompt,
            error,
            modelType: modelType,
            fileRef
        });

        textarea.value = error;
        this.refreshHeight();
        this.requestUpdate();
    }

    private isInIframe() {
        return window.self !== window.top;
    }

    private isInDetail(): boolean {
        let element: HTMLElement | null = this;
        while (element.parentElement) {
            element = element.parentElement;
            if (element.tagName.toLowerCase() === 'service-detail-100554') {
                return true;
            }
        }  
        return false;
    }

    private async getPrompt(userPrompt: string): Promise<string> {
        const model = mls.editor.models[this.modelKey]?.ts;
        if (!model || !model.model) throw new Error('invalid reference: ' + this.modelKey);

        const source = model.model.getValue();
        if (source.length < 10) throw new Error('invalid ${languageid} file');
        userPrompt = this.verifyPromptWithCmd(userPrompt);
        return `
        ${userPrompt}

        \`\`\` ${languageid}
        ${source}
        \`\`\`
        `;
        
    }

    verifyPromptWithCmd(userPrompt: string): string {
        if (userPrompt.trim() === "/review") {
            return `
            Review the code below and add comments directly on the relevant lines of the code.
. Add comments immediately after the observed issue, starting with "// review: [moderate | critical]".
. Use Clean Code principles to analyze: clarity, meaningful names, simplicity, organization, maintainability, and best practices.
. Validate function and variable names, and check if the code adheres to the Single Responsibility Principle.
. Suggest improvements without altering the structure of the code.
. Provide suggestions only for issues classified as moderate or critical.
. Return comments in language: ${navigator.language}`
        }
        return userPrompt;
    }

}