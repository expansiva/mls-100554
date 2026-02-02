/// <mls fileReference="_100554_/l2/aiAgentCustom.ts" enhancement="_blank" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { collab_trash } from '/_100554_/l2/collabIcons.js';
import { updateHTML } from '/_100554_/l2/collabDOMSync.js';

@customElement('ai-agent-custom-100554')
export class CollabFCATree extends CollabLitElement {

    @query('#agentName') agentName: HTMLInputElement | undefined;
    @query('#threadId') threadId: HTMLInputElement | undefined;
    @query('#userId') userId: HTMLInputElement | undefined;
    @query('#result') result: HTMLElement | undefined;
    @query('#selModels') selModels: HTMLSelectElement | undefined;


    @property({ reflect: true })
    private prompts: mls.msg.IAMessageInputType[] = [];

    @property({ reflect: true })
    private inputs: IInputs[] = [];

    @property({ reflect: true })
    private user: { userId: string, threads: string[] } = { userId: "", threads: [] };

    @property({ reflect: true })
    private inLoader: boolean = true;

    private models = [
        { k: "gpt-4.1-nano", v: "cost" },
        { k: "reasoner", v: "reasoner" },        
        { k: "image", v: "image" },
        { k: "code", v: "code" },
        { k: "gpt-4.1-mini", v: "executor" },
        { k: "writer", v: "writer" },
        { k: "grok-2-latest", v: "latency" },
        { k: "translate", v: "translate" },
    ];


    //--------------COMPONENT---------------

    firstUpdated() {
        this.loadPrompts();
    }

    render() {


        return html`
            <div class="containerLoading" style="${this.inLoader ? "" : "display:none"}">
                <div class="loading-container">
                    <div class="spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>

            <div class="header" style="${this.inLoader ? "display:none" : ""}">
                <div class="groupInputs">
                    <div>
                        <label>Agent name:</label>
                        <input type="text" value="agentJohn" id="agentName"></input>
                    </div>
                    <div>
                        <label>Thread:</label>
                        ${this.renderThreads()}
                    </div>
                    <div>
                        <label>UserId:</label>
                        <input type="text" id="userId" .value="${this.user.userId}"></input>
                    </div>
                </div>
                <div style=" margin-top: 16px;">
                    ${this.renderModels()}
                    <button @click="${this.saveHTML}">Save</button>
                    <button style="background-color: #348e0f;" @click="${this.start}">Start</button>
                </div>
            </div>
            <details style="${this.inLoader ? "display:none" : ""}">
                <summary> Prompts </summary>
                <div class="container">
                    ${repeat(this.prompts, ((key: mls.msg.IAMessageInputType) => key.type + Date.now()) as any, ((p: mls.msg.IAMessageInputType, idx: number) => { return this.renderPrompt(p, idx) }) as any)}
                </div>
                <button style="background-color: #348e0f;" @click="${this.addMessage}">
                    Add Message
                </button>
            </details>
            <details style="${this.inLoader ? "display:none" : ""}">
                <summary> Inputs </summary>
                <div class="container">
                    ${repeat(this.inputs, ((key: IInputs) => key.text + Date.now()) as any, ((i: IInputs) => { return this.renderInput(i) }) as any)}
                </div>
            </details>
            <hr/>
            <details open style="${this.inLoader ? "display:none" : ""}">
                <summary> Output </summary>
                <div id="result">
                </div>
            </details>
        `
    }


    renderPrompt(prompt: mls.msg.IAMessageInputType, idx: number) {

        let pp = prompt.content.trim();
        if (idx === 0 && this.selModels) { //* <!-- modelType: reasoner -->
            pp = `//* <!-- modelType: ${this.selModels.value} -->\n${pp}`
        }
        return html`
            <div class="prompt ${prompt.type}">
                <div class="pheader">
                    <div class="type">
                        ${this.renderSelect(prompt)}
                    </div>
                    <div class="trash" @click="${() => this.trashClick(prompt)}">${collab_trash}</div>
                </div>
                <textarea class="content" @blur="${(e: InputEvent) => this.promptEvent(e, prompt)}">${pp}</textarea>
            </div>
        `;
    }

    renderSelect(prompt: mls.msg.IAMessageInputType) {
        return html`
            <select .value=${prompt.type.trim()} @change=${(e: Event) => this.updateSelect(e, prompt)}>
                <option value="system">System</option>
                <option value="human">Human</option>
                <option value="ai">AI</option>
            </select>
        `
    }

    renderInput(ipt: IInputs) {
        return html`
            <div class="input">
                <label>${ipt.text}</label>
                <input type="text" .info="${ipt}" @blur="${(e: InputEvent) => this.inputEvent(e, ipt)}" .value="${ipt.value}" placeholder="Enter variable value..."></input>
            </div>
        `;
    }

    renderModels() {

        return html`
            <select class="model" id="selModels" @change=${(e: Event) => this.requestUpdate()}>
                ${repeat(this.models, ((key: any) => key.k) as any, ((i: any) => html`<option value="${i.v}">${i.k}</option>`) as any)}
            </select>
        `

    }

    renderThreads() {

        return html`
            <select id="threadId">
                ${repeat(this.user.threads, ((key: any) => key) as any, ((i: any) => html`<option value="${i}">${i}</option>`) as any)}
            </select>
        `

    }

    //------------IMPLEMENTS--------------

    private async loadPrompts() {


        const myPP: mls.msg.IAMessageInputType[] = [];
        const myIp: IInputs[] = [];
        Array.from(this.children).forEach((c) => {

            const tp = c.getAttribute('type') as any;
            const pp = c.innerHTML;
            if (!tp || !pp) return;

            const p: mls.msg.IAMessageInputType = {
                type: tp,
                content: pp
            }
            c.remove();

            const placeholders = this.getPlaceholders(p.content);
            placeholders.forEach((i) => myIp.push({ text: i, value: '' }))

            myPP.push(p);

        });

        const info = await this.getIdUSer();
        this.user = info;
        this.prompts = myPP;
        this.inputs = myIp;
        this.inLoader = false;
    }

    private getPlaceholders(text: string) {
        const regex = /{{\s*[^}]+?\s*}}/g;
        return text.match(regex) || [];
    }

    private async getIdUSer(): Promise<{ userId: string, threads: string[] }> {

        let ret: { userId: string, threads: string[] } = {
            userId: "",
            threads: []
        }

        const info = await mls.api.msgGetUserUpdate({ userId: "" });
        ret.userId = info.user.userId || "";
        ret.threads = info.user.threads || [];

        return ret;
    }

    private trashClick(pp: mls.msg.IAMessageInputType) {

        const myPP: mls.msg.IAMessageInputType[] = [];
        const myIp: IInputs[] = [];
        this.prompts.forEach((p, idx) => {

            if (p.content !== pp.content || p.type !== pp.type) {
                myPP.push({ ...p });
                const placeholders = this.getPlaceholders(p.content);
                placeholders.forEach((i) => myIp.push({ text: i, value: '' }))
            }

        });

        this.prompts = myPP;
        this.inputs = myIp;

    }

    private addMessage() {
        const myPP = [...this.prompts];
        myPP.push({
            type: "system",
            content: ""
        });

        this.prompts = myPP;
    }


    private promptEvent(e: InputEvent, prompt: mls.msg.IAMessageInputType) {

        const el = e.target as HTMLTextAreaElement;
        if (!el) return;
        const myIp: IInputs[] = [];

        this.prompts.forEach((p) => {
            if (p.content === prompt.content && p.type === prompt.type) p.content = el.value;

            const placeholders = this.getPlaceholders(p.content);
            placeholders.forEach((i) => myIp.push({ text: i, value: '' }))
        });

        this.inputs = myIp;

    }

    private updateSelect(e: Event, prompt: mls.msg.IAMessageInputType) {

        const el = e.target as HTMLSelectElement;
        if (!el) return;

        this.prompts.forEach((p) => {
            if (p.content === prompt.content && p.type === prompt.type) p.type = el.value as any;

        });

    }

    private inputEvent(e: InputEvent, ipt: IInputs) {

        const el = e.target as HTMLInputElement;
        if (!el) return;

        this.inputs.forEach((i) => {
            if (i.text === ipt.text) i.value = el.value;

        });


    }

    private async start() {

        if (!this.result) {
            console.info('not found result');
            return;
        }

        if (!this.agentName || !this.agentName.value) {
            this.result.innerHTML = 'Not found agentName'
            return;
        }

        if (!this.threadId || !this.threadId.value) {
            this.result.innerHTML = 'Not found threadId'
            return;
        }

        if (!this.userId || !this.userId.value) {
            this.result.innerHTML = 'Not found userId'
            return;
        }

        const myPP = this.prompts.map(obj => ({ ...obj })) as mls.msg.IAMessageInputType[] ;

        myPP.forEach((p, idx) => {

            this.inputs.forEach((i) => {

                p.content = p.content.replace(i.text, i.value);


            });

            if (idx === 0 && this.selModels) {
                p.content = `<!-- modelType: ${this.selModels.value} -->\n${p.content}`
            }

        });

        try {

            this.inLoader = true;
            const args: mls.msg.RequestAddMessageAI = {
                action: "addMessageAI",
                threadId: this.threadId.value,
                userId: this.userId.value,
                taskTitle: "Custom: " + this.agentName.value,
                userMessage: "Custom: " + this.agentName.value,
                agentName: this.agentName.value,
                inputAI: myPP,
            };

            const value = await mls.api.msgAddMessageAI(args);
            this.result.innerText = JSON.stringify(value, null, 2);
            console.info(value);
            this.inLoader = false;

        } catch (e: any) {
            this.inLoader = false;
            this.result.innerText = e;

        }

    }

    private saveHTML() {

        let txt = '<ai-agent-custom-100554>';
        this.prompts.forEach((p) => {
            txt = txt + `
            <promptcustom type="${p.type}">
                ${p.content}
            </promptcustom>
            `
        });
        txt = txt + '</ai-agent-custom-100554>';

        updateHTML(txt);
    }

}

interface IInputs {
    text: string,
    value: string
}