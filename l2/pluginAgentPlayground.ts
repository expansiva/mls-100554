/// <mls shortName="pluginAgentPlayground" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { loadChatPreferences, IChatPreferences, saveChatPreferences, getUserId, createThread } from './_100554_collabMessageHelper';
import { getThreadByName } from './_100554_msgDBController';
import { IAgent } from './_100554_aiAgentBase';
import { getTemporaryContext } from './_100554_aiAgentHelper';
import { listThreads } from './_100554_msgDBController';
import { updateHTML } from './_100554_collabDOMSync';
import { collab_trash } from './_100554_collabIcons';
import { setState } from './_100554_collabState';
@customElement('plugin-agent-playground-100554')
export class AgentTester extends CollabLitElement {

    private _agent = '';
    private inError = false;

    @property({ type: String }) agent = '';
    @query('.containerdraganddrop') containerdraganddrop: HTMLElement | undefined;

    @state() private loading: boolean = false;
    @state() private mode: string = 'input';
    @state() private result: string = '';
    @state() private prompts: Iprompts[] = [];
    @state() private list: mls.msg.ThreadPerformanceCache[] = [];
    @state() private chatPreferences: IChatPreferences = {
        translationMode: 'icon',
        language: '',
        threadMaintenance: ''
    };

    private inEdit = false;

    connectedCallback() {
        super.connectedCallback();
        this.prompts = this.getPrompts();
        this.innerHTML = '';
        this.style.display = 'block';
    }

    disconnectedCallback() {
        setState('preview.pausePreview', false)
        super.disconnectedCallback();
    }

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        this.init();
        this.chatPreferences = loadChatPreferences();
        this.list = await listThreads();
    }

    render() {
        const aux = this.loading ? '' : 'none'
        return html`
<div class="overlay" style="display:${aux}">
<div class="spinner"></div>
Running...
</div>
<div class="actions">
${this.renderHead()}
</div>
<div style="height: calc(100% - 85px);">
<div class="tab-header">
<div class="tab-group-left">
<button
class="tab-button ${this.mode === 'input' ? 'active' : ''}" @click=${() => this.selectTabInput()} >
Inputs
</button>
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
<strong>Agent:</strong> ${this._agent}
</div>
<div>
<button class="action-btn" @click=${() => this.handlePlay()} title="play"><svg style="width: 13px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg></button>
</div>
`
    }

    renderMode() {
        switch (this.mode) {
            case 'input': return this.renderInputs();
            case 'result': return this.renderResult();
            case 'settings': return this.renderSettings();
            default: return this.renderInputs();
        }
    }

    renderInputs() {
        if (!this.prompts || this.prompts.length === 0)
            return html`
<div class="containerinputs">
<h3>No input found!</h3>
${this.renderButonAdd()}
</div>
`;
        return html`
<div class="containerinputs containerdraganddrop">
${repeat(this.prompts, ((key: Iprompts) => key.type + Date.now()) as any, ((p: Iprompts, idx: number) => { return this.renderPrompt(p, idx) }) as any)}
${this.renderButonAdd()}
</div>
`
    }

    renderButonAdd() {
        return html`
<div style="display: flex; width: 99%; max-width: 900px; justify-content: flex-start; padding: .5rem; border-top: 1px solid #e0e0e0;">
<button class="action-btn dropdown-toggle" @click=${() => this.addPrompt('system')}><svg style="width: 14px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg> Message</button>
</div>
`
    }

    renderPrompt(prompt: Iprompts, idx: number) {
        let pp = this.escape(prompt.content.trim());
        return html`
<details class="prompt ${prompt.type}" ?open=${prompt.openDetail}
@dragover=${(e: DragEvent) => this.handleDragOver(e, idx, e.currentTarget as HTMLElement)}
@dragleave=${(e: DragEvent) => this.handleDragLeave(e, e.currentTarget as HTMLElement)}
@drop=${(e: DragEvent) => this.handleDrop(e, e.currentTarget as HTMLElement)}
>
<summary @click=${(e: MouseEvent) => this.handleDetails(e, prompt)}>
${this.renderMove(idx)}
<div class="pheader">
<div class="type" style="display:flex; align-items: center;gap:.5rem">
${this.renderSelect(prompt)}
<span class="title">
${pp.substring(0, 50)}...
</span>
</div>
<div style="display:flex; gap:.5rem">
<div class="trash itenActions" @click="${(e: MouseEvent) => { e.stopPropagation(); this.trashClick(idx) }}">${collab_trash}</div>
<div class="chevron">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="width:10px"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
</div>
</div>
</div>
</summary>
<div>
<pre class="content" contenteditable="true" @blur="${(e: InputEvent) => this.promptEvent(e, idx)}" @paste=${this.handlePaste}>${pp}</pre>
</div>
</details>
`;
    }

    renderMove(idx: number) {
        return html`
<div class="moveelement"
draggable="true"
@dragstart=${(e: DragEvent) => this.handleDragStart(e, idx)}
>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512" style="width:6px"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512" style="width:6px"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
</div>
`
    }

    renderSelect(prompt: Iprompts) {
        return html`
<select .value=${prompt.type.trim()} @change=${(e: Event) => this.updateSelect(e, prompt)}>
<option value="system">System</option>
<option value="human">Human</option>
<option value="ai">AI</option>
<option value="memory">Memory</option>
</select>
`
    }
    renderResult() {
        const aux = this.inError ? 'color:red' : '';
        return html`
<pre class="result" style="${aux}">
${this.escape(this.result)}
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

    private init() {
        this.verifyProp()
    }

    private verifyProp() {

        if (this.agent) {
            this._agent = this.agent;
            return;
        }
        const left = (mls.actual[2] as any).left;
        if (!left) return;
        this._agent = `_${left.project}_${left.shortName}`;

    }

    private selectTabResult() {
        this.mode = 'result';
    }

    private selectTabInput() {
        this.mode = 'input';
    }

    private selectTabSettings() {
        this.mode = 'settings';
        setTimeout(() => {
            const select = this.renderRoot.querySelector('select#selectThread') as HTMLSelectElement;
            if (select) {
                select.value = this.chatPreferences?.threadMaintenance ?? '';
            }
        }, 300)
    }

    private updateSelect(e: Event, prompt: Iprompts) {
        const el = e.target as HTMLSelectElement;
        if (!el) return;
        this.prompts.forEach((p) => {
            if (p.content === prompt.content && p.type === prompt.type) p.type = el.value;
        });
        this.handleSave();
    }

    private handleDetails(e: MouseEvent, prompt: Iprompts) {
        let el = e.target as HTMLDetailsElement;
        if (!el || ['select', 'option'].includes(el.tagName.toLocaleLowerCase())) return;
        if (el.tagName.toLocaleLowerCase() !== 'details') el = el.closest('details') as HTMLDetailsElement;
        if (!el) return;

        this.prompts.forEach((p) => {
            if (p.content === prompt.content && p.type === prompt.type) p.openDetail = !el.open;
        });
    }

    private addPrompt(type: string) {
        this.prompts = [
            ...this.prompts,
            {
                type,
                content: '',
                openDetail: false
            }
        ];
    }

    private trashClick(idx: number) {
        this.prompts = this.prompts.filter((_, i) => i !== idx);
        this.handleSave();
    }

    private promptEvent(e: InputEvent, activeTabIndex: number) {
        this.inEdit = true;
        const target = e.target as HTMLPreElement;
        const newValue = this.getCleanPreContent(target);
        this.prompts = this.prompts.map((p, idx) =>
            idx === activeTabIndex ? { ...p, content: newValue, openDetail: true } : p
        );
        this.handleSave();
    }

    private getCleanPreContent(preElement: HTMLElement): string {
        const walker = document.createTreeWalker(preElement, NodeFilter.SHOW_COMMENT);
        const commentsToRemove: Comment[] = [];
        while (walker.nextNode()) {
            const node = walker.currentNode as Comment;
            commentsToRemove.push(node);
        }
        for (const comment of commentsToRemove) {
            comment.parentNode?.removeChild(comment);
        }
        return preElement.innerText.trim();
    }

    private async handlePlay() {
        this.loading = true;

        if (this.inEdit) {
            setTimeout(async () => {
                this.handlePlay();
            }, 1100);
            return;
        }
        try {
            const i = this.prompts.find((p: Iprompts) => p.type === 'memory');
            const message = i ? i.content : '';
            const response = await this._callAgent(this._agent, message);
            this.result = response;
            this.selectTabResult();
        } catch (err) {
            this.result = `Error when testing agent: ${(err as Error).message}`;
        } finally {
            this.loading = false;
        }
    }

    private timeSave = 0;
    private async handleSave() {
        clearTimeout(this.timeSave);
        this.timeSave = setTimeout(() => {
            setState('preview.pausePreview', true);
            const aux = this.agent ? `agent="${this.agent}"` : '';
            let txt = `<plugin-agent-playground-100554 ${aux} style="display:none">`;
            this.prompts.forEach((p) => {
                txt = txt + ` <promptcustom type="${p.type}"> ${this.escapeAngleBrackets(p.content)} </promptcustom> `
            });
            txt = txt + '</plugin-agent-playground-100554>';
            updateHTML(txt, false);
            this.inEdit = false;
            setTimeout(() => setState('preview.pausePreview', false), 2000)
        }, 500);
    }

    private getPrompts(): Iprompts[] {
        const ret: Iprompts[] = [];
        Array.from(this.children).forEach((i) => {
            if (i.tagName.toLocaleLowerCase() !== 'promptcustom') return;
            const tp: string = i.getAttribute('type') || 'system';
            const cont = i.innerHTML.trim();
            ret.push({
                type: tp,
                content: cont,
                openDetail: false
            });
        });
        return ret;
    }

    private handleThreadChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        this.chatPreferences = {
            ...this.chatPreferences,
            threadMaintenance: target.value
        };
        saveChatPreferences(this.chatPreferences);
    }

    private async _callAgent(agentName: string, message: string): Promise<string> {
        /*if (!this.chatPreferences.threadMaintenance) {
            return `Agent "${agentName}" error:
Please configure your maintenance thread at: CollabMessage > Settings > Chat Preferences`;
        }*/

        let pageName = mls.actual[mls.actualLevel].getFullName();
        if (mls.actualLevel === 2) {
            const info = mls.actual[2].left;
            if(!info) return `Agent "${agentName}" error: Not found file`;
            pageName = info.folder ? `_${info.project}_${info.folder}/${info.shortName}` : `${info.project}_${info.shortName}`;
        }

        let thread = await getThreadByName(pageName);
        if (!thread) {
            thread = await createThread(pageName, [], 'company');
        }

        if (!thread) return `Agent "${agentName}" error: Not found thread: ${pageName}`;
        
        const userId = getUserId();
        //const threadId = this.chatPreferences.threadMaintenance;
        const threadId = thread.threadId;
        if (!userId) return `Agent "${agentName}" error: Not found userID`;
        let context;
        try {
            const moduleAgent = await import(`./${agentName}`);
            if (!moduleAgent) return 'Not found agent:' + agentName;
            if (!moduleAgent.createAgent) return 'Not found createAgent:' + agentName;
            const agt = moduleAgent.createAgent() as IAgent;
            context = getTemporaryContext(threadId, userId, '@@' + agt.agentName + ' ' + message);
            context.modeSingleStep = true;
            await agt.beforePrompt(context);
            return `Agent "${agentName}" responded:\n${JSON.stringify(context, null, 2)}`;
        } catch (e: any) {
            this.inError = true;
            return `Agent "${agentName}" error: ${e.message}\n\n${JSON.stringify(context, null, 2)}`
        }
    }

    private escapeAngleBrackets(input: string): string {
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    private escape(input: string): string {
        return input
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }

    private draggedItem: number = -1;
    private dropTarget: number = -1;
    private dropPosition: 'above' | 'below' | null = null;
    private handleDragStart(event: DragEvent, idx: number) {
        event.stopPropagation();
        this.draggedItem = idx;
        const img = document.createElement('img');
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=';
        img.style.opacity = '0';
        event.dataTransfer?.setDragImage(img, 0, 0);
    }

    private handleDragOver(event: DragEvent | TouchEvent, idx: number, element: HTMLElement) {
        event.stopPropagation();
        event.preventDefault();
        if (this.draggedItem < 0) return;
        let clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY;
        const rect = element.getBoundingClientRect();
        const offsetY = clientY - rect.top;
        const height = rect.height;
        const details = element.closest('details');
        if (!details) return;
        if (offsetY < (height * 0.3) && details) {
            this.dropPosition = 'above';
            details.style.border = "";
            details.style.border = "";
            details.style.borderTop = "2px solid blue";
        } else if (offsetY > (height * 0.6) && details) {
            this.dropPosition = 'below';
            details.style.border = "";
            details.style.border = "";
            details.style.borderBottom = "2px solid blue";
        }
        this.dropTarget = idx;
    }

    private handleDragLeave(event: DragEvent, element: HTMLElement) {
        const details = element.closest('details');
        if (details) details.style.border = "";
        element.style.border = "";
    }

    private handleDrop(event: DragEvent, element: HTMLElement) {
        try {
            event.preventDefault();
            this.prompts = this.moveItemInArray();
        } catch (e: any) {
            console.info(e.message);
        } finally {
            element.style.border = "";
            const details = element.closest('details');
            if (details) details.style.border = "";
            this.draggedItem = -1;
            this.dropTarget = -1;
            this.dropPosition = null;
            setTimeout(() => { this.handleSave(); }, 500);
        }
    }

    private moveItemInArray(): Iprompts[] {
        if (this.draggedItem < 0 || this.dropTarget < 0 || this.dropPosition === null || this.draggedItem === this.dropTarget) {
            return this.prompts;
        }
        const updatedArray = [...this.prompts];
        const item = updatedArray.splice(this.draggedItem, 1)[0];
        let insertIndex = this.dropTarget;
        if (this.dropPosition === 'below') {
            insertIndex += 1;
        }
        if (this.draggedItem < this.dropTarget) {
            insertIndex -= 1;
        }
        updatedArray.splice(insertIndex, 0, item);
        return updatedArray;
    }

    private handlePaste(e: ClipboardEvent) {
        e.preventDefault();
        const text = (e.clipboardData || (window as any).clipboardData).getData('text');

        const selection = window.getSelection();
        if (!selection?.rangeCount) return;
        selection.deleteFromDocument();
        const range = selection.getRangeAt(0);
        range.insertNode(document.createTextNode(text));
        selection.collapseToEnd();
    }
}
interface Iprompts {
    type: string,
    content: string,
    openDetail: boolean
}
