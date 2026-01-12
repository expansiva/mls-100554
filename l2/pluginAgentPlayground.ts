/// <mls shortName="pluginAgentPlayground" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, unsafeHTML } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { loadChatPreferences, IChatPreferences, saveChatPreferences, getUserId, createThread } from '/_102025_/l2/collabMessagesHelper.js';
import { getThreadByName, listThreads } from '/_102025_/l2/collabMessagesIndexedDB.js';
import { IAgent } from '/_100554_/l2/aiAgentBase.js';
import { getTemporaryContext, getAllSteps } from '/_100554_/l2/aiAgentHelper.js';
import { updateHTML } from '/_100554_/l2/collabDOMSync.js';
import { collab_trash } from '/_100554_/l2/collabIcons.js';
import { setState } from '/_100554_/l2/collabState.js';
import { loadAgent, executeBeforePrompt } from '/_100554_/l2/aiAgentOrchestration.js';

@customElement('plugin-agent-playground-100554')

export class AgentTester extends CollabLitElement {

    private _agent = '';
    private inError = false;

    @property({ type: String }) agent = '';
    @query('.containerdraganddrop') containerdraganddrop: HTMLElement | undefined;
    @query('#selCompare') selCompare: HTMLSelectElement | undefined;

    @state() private activeJudge: boolean = false;
    @state() private msgSelectGroup: boolean = false;
    @state() private activeGroup: boolean = false;
    @state() private combinations: string[] = [];
    @state() private groups: string[] = [];
    @state() private actualGrup: string = '';
    @state() private loading: boolean = false;
    @state() private mode: string = 'input';
    @state() private result: string | string[] = '';
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
<label style=" margin-left: 1rem; margin-top: 5px; display: flex; align-items: center; justify-content: center; font-weight: 600;">
    <input type="checkbox" .checked=${this.activeGroup}  @change=${this._onCheckboxChange} />
    Compare mode
</label>
</div>

<div style="display:flex; gap:1rem;align-items: center;">
${this.renderGroupSelector()}
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
${this.renderGroups()}
<div class="containerinputs containerdraganddrop">
${repeat(this.prompts, ((key: Iprompts) => key.type + Date.now()) as any, ((p: Iprompts, idx: number) => { return this.renderPrompt(p, idx) }) as any)}
${this.renderButonAdd()}
</div>
`
    }

    renderGroups() {
        if (!this.activeGroup) return html``;
        return html`
      <div class="group">
        <select @change=${this.handleSelectChange}>
          <option value="">-- Select a group --</option>
          ${repeat(this.groups, ((key: string) => key + 'sel') as any, ((g: string) => {
            return html`<option value=${g} ?selected=${this.actualGrup === g}>${g}</option>`
        }) as any)}
          
        </select>

        <button @click=${this.addGroup}>Add</button>
        <button @click=${this.removeGroup} ?disabled=${!this.actualGrup}>Del</button>
        <button @click=${this.setDefaultGroup} ?disabled=${this.actualGrup === 'A'}>Promote to production</button>
      </div>
    `;
    }

    renderGroupSelector() {

        if (!this.activeGroup) return html``;
        return html`
      <div class="group-list">
        
        <label style="display: flex; align-items: center; justify-content: center; font-weight: 600;">
            <input type="checkbox" .checked=${this.activeJudge}  @change=${this._onCheckboxChangeJudge} />
            LLM judge
        </label>
            
        <div style="position:relative">
            <select id="selCompare" @change=${() => this.msgSelectGroup = false}>
            <option value="">-- Select to compare --</option>
            ${repeat(this.combinations, ((key: string) => key + 'comp') as any, ((g: string) => {
            return html`<option value=${g} ?selected=${this.actualGrup === g}>${g.replace(';', ' x ')}</option>`
        }) as any)}
            
            </select>
            <small style="color:red; position: absolute; top: 29px; left: 0;${this.msgSelectGroup ? '' : 'display:none'}">Select a comparison mode</small>
        </div>
      </div>
    `;
    }

    renderButonAdd() {
        return html`
<div style="display: flex; width: 99%; max-width: 900px; justify-content: flex-start; padding: .5rem; border-top: 1px solid #e0e0e0;">
<button class="action-btn dropdown-toggle" @click=${() => this.addPrompt('system')}><svg style="width: 14px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg> Message</button>
</div>
`
    }

    renderPrompt(prompt: Iprompts, idx: number) {
        if (this.actualGrup && this.actualGrup !== prompt.group) return html``;
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
        if (typeof this.result !== 'string') return this.renderCompare();

        const aux = this.inError ? 'color:red' : '';
        return html` <pre class="result" style="${aux}"> ${this.escape(this.result)} </pre > `
    }

    renderCompare() {
        if (typeof this.result === 'string') return html``;
        return html`
      <div class="compare-wrap">
        ${this.result.map(
            (text, idx) => html`
            <div class="pane">
              <div class="pane-header">Item ${idx + 1}</div>
              <div class="pane-content">${this.escape(text)}</div>
            </div>
          `
        )}
      </div>
    `;
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
        const agentName = `_${left.project}_/l2/${left.folder ? left.folder + '/' : ''}${left.shortName}`
        this._agent = agentName;


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
                openDetail: false,
                group: this.actualGrup
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
        this.msgSelectGroup = false;
        if (this.inEdit) {
            setTimeout(async () => {
                this.handlePlay();
            }, 1100);
            return;
        }
        try {

            const selectedGroups = this.selCompare && this.selCompare.value ? this.selCompare.value.split(';') : [];

            if (selectedGroups.length <= 0 && this.activeGroup) {
                this.msgSelectGroup = true;
                return;
            }

            if (selectedGroups.length <= 0 && !this.actualGrup) {

                const i = this.prompts.find((p: Iprompts) => p.type === 'memory');
                const message = i ? i.content : '';
                const response = await this._callAgent(this._agent, message, this.actualGrup);
                this.result = response;

            } else if (selectedGroups.length <= 0 && this.actualGrup) {

                const i = this.prompts.find((p: Iprompts) => p.type === 'memory' && this.actualGrup === p.group);
                const message = i ? i.content : '';
                const response = await this._callAgent(this._agent, message, this.actualGrup);
                this.result = response;

            } else if (selectedGroups.length > 0) {

                const arrayPromisse: Promise<string>[] = [];

                selectedGroups.forEach((gp) => {
                    const i = this.prompts.find((p: Iprompts) => p.type === 'memory' && this.actualGrup === gp);
                    const message = i ? i.content : '';
                    arrayPromisse.push(this._callAgent(this._agent, message, gp))
                })

                const ret = await Promise.all(arrayPromisse);

                if (this.activeJudge) {

                    let [ret1, ret2] = ret;
                    ret1 = ret1.split('responded:')?.pop()?.trim() || '';
                    ret2 = ret2.split('responded:')?.pop()?.trim() || '';
                    const obj1 = JSON.parse(ret1);
                    const obj2 = JSON.parse(ret2);
                    const allSteps1 = getAllSteps(obj1.task.iaCompressed.nextSteps);
                    const allSteps2 = getAllSteps(obj2.task.iaCompressed.nextSteps);
                    const obj = {
                        title1: selectedGroups[0],
                        context1: JSON.stringify(allSteps1[allSteps1.length - 1]),
                        title2: selectedGroups[1],
                        context2: JSON.stringify(allSteps2[allSteps2.length - 1]),
                    };

                    this.result = await this._callAgent('_100554_agentJudge', JSON.stringify(obj), '');


                } else {
                    this.result = ret
                }



            }

            this.selectTabResult();
        } catch (err) {
            this.result = `Error when testing agent: ${(err as Error).message}`;
            this.selectTabResult();
        } finally {
            this.loading = false;
        }
    }

    private timeSave = 0;
    private async handleSave(setDefault: boolean = false) {
        clearTimeout(this.timeSave);
        this.timeSave = setTimeout(() => {
            setState('preview.pausePreview', true);
            const aux = this.agent ? `agent="${this.agent}"` : '';

            let txt = `<plugin-agent-playground-100554 ${aux} style="display:none">`;
            this.prompts.forEach((p) => {
                txt = txt + ` <promptcustom type="${p.type}" group="${p.group}"> ${this.escapeAngleBrackets(p.content)} </promptcustom> `
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
            const group: string = i.getAttribute('group') || '';
            const cont = i.innerHTML.trim();

            if (group && !this.groups.includes(group)) this.groups.push(group);

            ret.push({
                type: tp,
                content: cont,
                openDetail: false,
                group
            });
        });

        this.getPar(this.groups);
        if (!this.actualGrup && this.groups.length > 0) {
            this.actualGrup = 'A';
        }
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

    private async _callAgent(agentName: string, message: string, group: string): Promise<string> {

        let pageName = mls.actual[mls.actualLevel].getFullName();
        if (mls.actualLevel === 2) {
            const info = mls.actual[2].left;
            if (!info) return `Agent "${agentName}" error: Not found file`;
            pageName = info.folder ? `_${info.project}_${info.folder}/${info.shortName}` : `${info.project}_${info.shortName}`;
        }

        let thread = await getThreadByName(pageName);
        if (!thread) {
            thread = await createThread(pageName, [], 'company');
        }

        if (!thread) return `Agent "${agentName}" error: Not found thread: ${pageName}`;

        const userId = getUserId();
        const threadId = thread.threadId;
        if (!userId) return `Agent "${agentName}" error: Not found userID`;
        let context;
        try {
            context = getTemporaryContext(threadId, userId, '@@' + agentName + ' ' + message);
        } catch (e: any) {
            this.inError = true;
            return `[pluginAgentPlayground] [getTemporaryContext] Agent "${agentName}" error: ${e.message}\n\n${JSON.stringify(context, null, 2)}`
        }
        try {
            
            const agent = await loadAgent(agentName);
            context.modeSingleStep = true;
            setState('playgroundAgent.modeCompare', group);
            if (!agent) throw new Error('Not found agent:' + agentName);
            executeBeforePrompt(agent, context);
            setState('playgroundAgent.modeCompare', undefined);
            return `[pluginAgentPlayground] Agent "${agentName}" responded:\n${JSON.stringify(context, null, 2)}`;
        } catch (e: any) {
            this.inError = true;
            return `[pluginAgentPlayground] Agent "${agentName}" error: ${e.message}\n\n${JSON.stringify(context, null, 2)}`
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

    private addGroup() {
        if (this.groups.length === 0) {

            this.prompts.forEach((p) => p.group = 'A');
            this.groups = ['A'];
            this.actualGrup = 'A';


        } else {
            const last = this.groups[this.groups.length - 1];
            const next = String.fromCharCode(last.charCodeAt(0) + 1);
            const filter = JSON.parse(JSON.stringify(this.prompts.filter((p) => p.group === 'A')));
            filter.forEach((i: Iprompts) => i.group = next);
            this.prompts = [...this.prompts, ...filter];
            this.groups = [...this.groups, next];
            this.getPar(this.groups)
        }

        setTimeout(() => { this.handleSave(true); }, 500);
    }

    private changeGrups(arr: Iprompts[], g1: string, g2: string): Iprompts[] {
        return this.sortGroup(arr.map(item => {
            if (item.group === g1) {
                return { ...item, group: g2 };
            }
            if (item.group === g2) {
                return { ...item, group: g1 };
            }
            return item;
        }));
    }

    private sortGroup(arr: Iprompts[]): Iprompts[] {
        return [...arr].sort((a, b) => a.group.localeCompare(b.group));
    }

    private setDefaultGroup() {
        this.prompts = this.changeGrups(this.prompts, 'A', this.actualGrup);
        this.actualGrup = 'A';
        setTimeout(() => { this.handleSave(true); }, 500);
    }

    private removeGroup() {
        if (this.actualGrup) {
            let saveDefault = false;
            this.groups = this.groups.filter(g => g !== this.actualGrup);
            this.prompts = this.prompts.filter(g => g.group !== this.actualGrup);
            this.actualGrup = '';

            setTimeout(() => { this.handleSave(saveDefault); }, 500);
        }
    }

    private handleSelectChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        this.actualGrup = target.value;
    }

    private getPar(arr: string[]) {
        let ret = [];

        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                ret.push(`${arr[i]};${arr[j]}`);
            }
        }

        this.combinations = ret;
    }

    private _onCheckboxChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.activeGroup = target.checked;
    }

    private _onCheckboxChangeJudge(e: Event) {
        const target = e.target as HTMLInputElement;
        this.activeJudge = target.checked;
    }
}
interface Iprompts {
    type: string,
    content: string,
    openDetail: boolean,
    group: string
}
