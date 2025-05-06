/// <mls shortName="aimPrompt" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { collab_arrow_up_long } from './_100554_collabIcons';
import { StateLitElement } from './_100554_stateLitElement';
import './_100554_aimPromptExample';

const message_pt = {
    btnSend: 'Enviar',
    placeHolder: 'Digite sua pergunta...' 
}

const message_en = {
    btnSend: 'Send',
    placeHolder: 'Enter your question...'
}

const message_fr = {
    btnSend: 'Envoyer',
    placeHolder: 'Entrez votre question...'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt,
    'fr': message_fr
}

@customElement('aim-prompt-100554')
export class AimPrompt extends StateLitElement { 

    static styles = css`[[mls_getDefaultDesignSystem]]`; 

    private msg: MessageType = messages['en'];
    @property({ type: "string", reflect: true }) text = "";

    dataForDetails: mls.events.IPluginDetail | any = {
        project: 100554,
        shortName: 'aimPrompt'
    }

    render() { 
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
            <div class="aim-prompt-search-container">
                <textarea
                    rows="1"
                    autocomplete="off"
                    .value="${this.text}"
                    placeholder="${this.msg.placeHolder}"
                    class="aim-prompt-search-input"
                    id="searchInput"
                    @focus="${this.handleFocus}"
                    @input="${this.handleInput}"
                ></textarea>
                <button class="search-button" @click="${this.handleClick}">
                ${collab_arrow_up_long}</button>
            </div>`;
    }

    EVENTPROMPTNAME = "promptChange";

    private handleClick() {
        const textarea = this.parentElement?.querySelector("#searchInput") as HTMLTextAreaElement | null;
        if (!textarea) throw new Error('field searchInput not found');
        const url = this.getModelFromLastPromptDetails()?.uri.toString() || '';
        window.parent.postMessage(JSON.stringify({
            eventName: this.EVENTPROMPTNAME,
            url,
            text: textarea.value
        }), window.parent.location.origin);
    }

    firstUpdated() {
        this.listenPromptChange();
    }

    private listenPromptChange() {
        window.addEventListener("message", (event: MessageEvent) => {
            if ((event.origin !== window.location.origin) ||
                (typeof event.data !== 'string') ||
                (!event.data.includes(this.EVENTPROMPTNAME))
            ) return;
            try {
                const receivedData = JSON.parse(event.data);
                event.preventDefault();
                this.exePrompt(receivedData.text || '', receivedData.url || '');
            } catch (e) {
                console.warn("invalid message:", event.data);
            }
        }, false);
    }

    private exePrompt(prompt: string, url: string) {
        if (!url || !url.startsWith('file://server/')) throw new Error('invalid exec prompt url:' + url);
        if (!prompt || !prompt.trim()) return;
        const uri = new monaco.Uri();
        const model = monaco.editor.getModel(monaco.Uri.parse(url));
        if (!model) throw new Error('model not found, url=' + url);

        const language = model.getLanguageId();
        const text = model.getValue();

        console.log('prompt2: ', prompt, ", url:", url, ", language:", language, ", text len:", text.length);
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

    private handleFocus(event: KeyboardEvent) {
        if (this.isInIframe() || this.isInDetail()) return;
        this.setLastPromptDetails();
        mls.events.fire(mls.actualLevel, 'PluginDetails', JSON.stringify(this.dataForDetails))
    }

    private handleInput(event: Event) {
        const textarea = event.target as HTMLTextAreaElement;
        this.text = textarea.value
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
    
    handleCollabStateChange(changedKey: string, value: any) {
        if (changedKey === "aimPrompt_text") {
            console.log('handleCollabStateChange', value)
            this.text = value;
        }
    }

    private setLastPromptDetails() {
        console.log('setLastPromptDetails')
        const globalState = (window.parent as any).globalState ||= {};
        const service = globalState.service ||= {};
        const aimPrompt = service.aimPrompt ||= {};
        const w = window.parent;
        const m: typeof mls = (w as any).mls;
        aimPrompt.actualLevel = m.actualLevel;        
        aimPrompt.actualPosition = m.actualPosition;
        aimPrompt.actualService = m.actualService;
        aimPrompt.actualNav3 = m.actualNav3;
        const a = m.actual[m.actualLevel];
        aimPrompt.fileRef = `_${a.project}_${a.path}`
    }

    private getModelFromLastPromptDetails(): monaco.editor.ITextModel | undefined {
        const key = (window.parent as any).globalState?.service?.aimPrompt?.fileRef;
        if (!key) throw new Error('invalid globalState last prompt details, fileRef');
        const nav3 = (window.parent as any).globalState?.service?.aimPrompt?.actualNav3;
        if (!nav3) throw new Error('invalid globalState last prompt details, nav3');
        const m: mls.editor.IModels | undefined = (window.parent as any).mls.editor.models[key];
        if (!m) throw new Error('invalid globalState, model doesn\'t exist');
        if (nav3 === "Typescript") return m.ts?.model;
        if (nav3 === "HTML") return m.html?.model;
        if (nav3 === "Style") return m.style?.model;
        return undefined;        
    }
}