/// <mls shortName="collabTestAgent" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { loadChatPreferences,getUserId, IChatPreferences } from './_100554_collabMessageHelper';
import { IAgent } from './_100554_aiAgentBase';
import {  getTemporaryContext } from './_100554_aiAgentHelper';
import { listThreads } from './_100554_msgDBController';
import { updateHTML } from './_100554_collabDOMSync';

@customElement('collab-test-agent-100554')
export class AgentTester extends CollabLitElement {

    @property({ type: String }) agent = '';
    @property() isEdit: boolean = false;
    @state() private loading: boolean = false;
    @state() private mode: string = 'item';
    @state() private result: string = '';
    @state() private activeTabIndex: number = 0;
    @state() private prompts: mls.msg.IAMessageInputType[] = [];
    @state() private list: mls.msg.ThreadPerformanceCache[] = [];
    @state() private chatPreferences: IChatPreferences = {
        translationMode: 'icon',
        language: '',
        threadMaintenance: ''
    };

    connectedCallback() {
        super.connectedCallback();
        this.prompts = this.getPrompts();
        this.innerHTML = '';
        this.style.display = 'block';
    }

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        this.chatPreferences = loadChatPreferences();
        this.list = await listThreads();
    }

    render() {

        const aux = this.loading ? '' : 'none'
        return html`
        <div class="overlay" style="display:${aux}">
            <div class="spinner"></div>
            Executando...
        </div>
        
        <div class="actions">
            ${this.renderHead()}
        </div>
        
        <div style="height: calc(100% - 85px);">
            <div class="tab-header">
                <div class="tab-group-left">
                    ${this.prompts.map((prompt, index) => this.renderItemTab(prompt, index))}
                </div>
                <div class="tab-group-right">
                    <button
                        class="tab-button ${this.mode === 'result' ? 'active' : ''}" @click=${() => this.selectTabResult()} >
                        Result
                        
                    </button>
                    <button
                        class="tab-button ${this.mode === 'settings' ? 'active' : ''}" @click=${() => this.selectTabSettings()} >
                        Settings
                        
                    </button>
                </div>
            </div>
            <div class="tab-content">
                ${this.renderMode()}
                
            </div>
        </div>
      
    `;
    }

    renderHead() {
        return html`
        <div class="header">
            <strong>Agente:</strong> ${this.agent}
        </div>
        <div>
            <button class="action-btn" @click=${() => this.deletePrompt()} title="delete"><svg style="width: 14px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>
            <div class="dropdown">
                <button class="action-btn dropdown-toggle"><svg style="width: 14px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg></button>
                <div class="dropdown-menu">
                    <div @click=${() => this.addPrompt('system')}>Add Message System</div>
                    <div @click=${() => this.addPrompt('human')}>Add Message Human</div>
                    <div @click=${() => this.addPrompt('assistant')}>Add Message Assistant</div>
                    <div @click=${() => this.addPrompt('prompt')}>Add Message Prompt(for test)</div>
                </div>
            </div>
            <button class="action-btn" @click=${() => this.handlePlay()} title="play"><svg style="width: 13px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg></button>
            <button class="action-btn ${this.isEdit ? 'edit' : ''}" @click=${() => this.handleSave()} title="save"><svg style="width: 14px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm0 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 224c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg></button>
        </div>
        `
    }

    renderItemTab(prompt: mls.msg.IAMessageInputType, index: number) {
        return html`
        
            <button class="tab-button ${this.activeTabIndex === index ? 'active' : ''}" @click=${() => this.selectTab(index)} >
                ${prompt.type}
            </button>
        
        `
    }

    renderMode() {

        switch (this.mode) {
            case 'item': return this.renderItem();
            case 'result': return this.renderResult();
            case 'settings': return this.renderSettings();
            default: return this.renderItem();
        }

    }

    renderItem() { 

        if (this.prompts.length === 0) return html``;
        return html`
            <textarea .value="${this.prompts[this.activeTabIndex].content.trim()}"  @input="${(e: Event) => this.updatePromptContent(e)}"></textarea>
        `
    }

    renderResult() {
        return html`
        <pre class="result">
            ${this.result}
        </pre >
        `
    }

    renderSettings() {
        return html`
        <div class="settings">
            ${this.renderListThread()}
        </div>
        `
    }

    renderListThread() {
        return html`
            <label>Thread:</label>
            <select id="selectThread" @change=${this.handleThreadChange}>
                <option value=""></option>
                ${repeat(this.list, ((key: mls.msg.ThreadPerformanceCache) => key) as any, ((item: mls.msg.ThreadPerformanceCache) => {
            return html`<option value="${item.threadId}">${item.group}/ ${item.name}</option>`
        }) as any)}
            </select>
        `
    }

    //---------IMPLEMENTATION--------

    private selectTabResult() {
        this.activeTabIndex = -1;
        this.mode = 'result';
    }

    private selectTabSettings() {
        this.activeTabIndex = -1;
        this.mode = 'settings';

        setTimeout(() => {
            const select = this.renderRoot.querySelector('select#selectThread') as any;
            if (select) {
                select.value = this.chatPreferences?.threadMaintenance ?? '';
            }
        }, 300)


    }

    private selectTab(index: number) {
        this.mode = 'item';
        this.activeTabIndex = index;
    }

    private async handlePlay() {
        this.loading = true;

        try {
            this.selectTabResult();
            const i = this.prompts.find((p: any) => p.type === 'prompt');
            const message = i ? i.content : '';

            const response = await this._callAgent(this.agent, message);
            this.result = response;
        } catch (err) {
            this.result = `Erro ao testar agente: ${(err as Error).message}`;
        } finally {
            this.loading = false;
        }

    }

    private async handleSave() {

        let txt = `<collab-test-agent-100554 agent="${this.agent}" style="display:none">`;
        this.prompts.forEach((p) => {
            txt = txt + `
            <promptcustom type="${p.type}">
                ${p.content}
            </promptcustom>
            `
        });
        txt = txt + '</collab-test-agent-100554>';

        updateHTML(txt);

    }

    private addPrompt(type: string) {
        this.prompts = [
            ...this.prompts as any,
            {
                type,
                content: ''
            }
        ];
        this.activeTabIndex = this.prompts.length - 1;
        this.mode = 'item';
    }

    private deletePrompt() {
        this.prompts = this.prompts.filter((_, i) => i !== this.activeTabIndex);

        // Corrige o activeTabIndex
        if (this.activeTabIndex >= this.prompts.length) {
            this.activeTabIndex = this.prompts.length - 1;
        }
    }

    private updatePromptContent(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        const newValue = target.value;
        this.isEdit = true;
        this.prompts = this.prompts.map((p, idx) =>
            idx === this.activeTabIndex ? { ...p, content: newValue } : p
        );
    }

    private getPrompts(): mls.msg.IAMessageInputType[] {

        const ret: mls.msg.IAMessageInputType[] = [];

        Array.from(this.children).forEach((i) => {

            if (i.tagName.toLocaleLowerCase() !== 'promptcustom') return;

            const tp: any = i.getAttribute('type') || 'system';
            const cont = i.innerHTML.trim();
            ret.push({
                type: tp,
                content: cont
            });

        });

        return ret;
    }

    private handleThreadChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.chatPreferences = {
            ...this.chatPreferences,
            threadMaintenance: target.value
        };
    }

    private async _callAgent(agentName: string, message: string): Promise<string> {

        try {

            if (!this.chatPreferences.threadMaintenance) {

                return `Agente "${agentName}" error:
            Please configure your maintenance thread at: CollabMessage > Settings > Chat Preferences`;
            }

            const userId = getUserId();
            const threadId = this.chatPreferences.threadMaintenance;
            if (!userId) return `Agente "${agentName}" error:
            Not found userID`;


            const moduleAgent = await import(`./${agentName}`);
            if (!moduleAgent) throw new Error('Not found agent:' + agentName);
            if (!moduleAgent.createAgent) throw new Error('Not found createAgent:' + agentName);

            const agt = moduleAgent.createAgent() as IAgent;

            const context = getTemporaryContext(threadId, userId, '@@ ' + agt.agentName + ' ' + message);


            await agt.beforePrompt(context);


            return `Agente "${agentName}" respondeu:\n${JSON.stringify(context, null, 2)}`;

        } catch (e: any) {
            return `Agente "${agentName}" error:
            ${e.message}`
        }

    }
}