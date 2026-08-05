/// <mls fileReference="_100554_/l2/serviceReportBug.ts" enhancement="_100554_/l2/enhancementLit" />

import { html } from 'lit'; 
import { customElement, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_102027_/l2/serviceBase.js';

/// **collab_i18n_start**
const message_pt = {
    title: 'Reportar Bug',
    emptyHint: 'Aperte Ctrl+Shift+B na tela onde o problema aconteceu para capturar o estado e o print.',
    description: 'O que você tentou fazer quando o erro aconteceu?',
    descriptionPlaceholder: 'Descreva os passos que levaram ao erro...',
    sendTo: 'Enviar para',
    selectDestination: 'Selecione a pessoa ou sala...',
    noThreads: 'Nenhuma conversa encontrada — abra o Collab Messages ao menos uma vez.',
    noMatches: 'Nenhuma conversa corresponde ao filtro.',
    send: 'Enviar bug',
    sending: 'Enviando...',
    sent: 'Bug enviado — o JSON completo também está no console do navegador.',
    sendFailed: 'Falha ao enviar',
    viewTitle: 'Visualização de bug (somente leitura)',
    viewClose: 'Fechar visualização',
    viewInvalid: 'Não foi possível ler o JSON do bug.',
    viewScreenshotUnavailable: 'Print não incluído na mensagem (ver console.log de quem reportou).',
    screenshot: 'Print da tela',
    noScreenshot: 'Print não capturado (permissão negada ou não suportado).',
    context: 'Contexto (mls)',
    network: 'Últimas requisições',
    console: 'Mensagens do console',
    capturedAt: 'Capturado em',
    user: 'Usuário',
    newCapture: 'Nova captura',
    colField: 'Campo',
    colValue: 'Valor',
    colMethod: 'Método',
    colRequest: 'Requisição',
    colStatus: 'Status',
    colTime: 'Tempo',
    colWhen: 'Hora',
    colType: 'Tipo',
    colMessage: 'Mensagem',
}

const message_en = {
    title: 'Report Bug',
    emptyHint: 'Press Ctrl+Shift+B on the screen where the problem happened to capture the state and screenshot.',
    description: 'What were you trying to do when the error happened?',
    descriptionPlaceholder: 'Describe the steps that led to the error...',
    sendTo: 'Send to',
    selectDestination: 'Select the person or room...',
    noThreads: 'No conversations found — open Collab Messages at least once.',
    noMatches: 'No conversation matches the filter.',
    send: 'Send bug',
    sending: 'Sending...',
    sent: 'Bug sent — the full JSON is also in the browser console.',
    sendFailed: 'Failed to send',
    viewTitle: 'Bug view (read-only)',
    viewClose: 'Close view',
    viewInvalid: 'Could not parse the bug JSON.',
    viewScreenshotUnavailable: 'Screenshot not included in the message (see the reporter\'s console.log).',
    screenshot: 'Screenshot',
    noScreenshot: 'Screenshot not captured (permission denied or not supported).',
    context: 'Context (mls)',
    network: 'Last requests',
    console: 'Console messages',
    capturedAt: 'Captured at',
    user: 'User',
    newCapture: 'New capture',
    colField: 'Field',
    colValue: 'Value',
    colMethod: 'Method',
    colRequest: 'Request',
    colStatus: 'Status',
    colTime: 'Time',
    colWhen: 'When',
    colType: 'Type',
    colMessage: 'Message',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

// ---------------------------------------------------------------------------
// Module-level state: survives level switches and service re-instantiation.
// ---------------------------------------------------------------------------

interface IConsoleEntry { ts: string; level: string; text: string }
interface INetworkEntry { ts: string; method: string; url: string; status: number | string; durationMs: number }

interface IMlsSnapshot {
    actualProject?: number;
    actualLevel?: number;
    actualService?: string;
    actualPosition?: string;
    actualModule?: string;
    actual: Array<{ level: number; project?: number; path?: string; left?: IFileRef; right?: IFileRef }>;
}

interface IFileRef { project?: number; shortName?: string; folder?: string; extension?: string }

interface IBugSnapshot {
    capturedAt: string;
    user: string;
    href: string;
    userAgent: string;
    viewport: string;
    mls: IMlsSnapshot;
    console: IConsoleEntry[];
    network: INetworkEntry[];
    screenshot?: string;
}

const CONSOLE_CAP = 200;
const CONSOLE_ENTRY_MAX_CHARS = 2000;
const NETWORK_CAP = 30;
const NETWORK_SEND = 10;
const SCREENSHOT_JPEG_QUALITY = 0.7;
const SHORTCUT = { key: 'B', ctrl: true, shift: true };

const consoleBuffer: IConsoleEntry[] = [];
const networkBuffer: INetworkEntry[] = [];
let lastSnapshot: IBugSnapshot | undefined;
let activeInstance: ServiceReportBug100554 | undefined;
let capturing = false;

function nowIso(): string { return new Date().toISOString(); }

function pushCapped<T>(buffer: T[], entry: T, cap: number): void {
    buffer.push(entry);
    if (buffer.length > cap) buffer.splice(0, buffer.length - cap);
}

function safeText(args: unknown[]): string {
    const text = args.map((a) => {
        if (typeof a === 'string') return a;
        if (a instanceof Error) return `${a.message}\n${a.stack || ''}`;
        try { return JSON.stringify(a); } catch { return String(a); }
    }).join(' ');
    return text.length > CONSOLE_ENTRY_MAX_CHARS ? `${text.slice(0, CONSOLE_ENTRY_MAX_CHARS)}[truncated]` : text;
}

function installConsoleInterceptor(): void {
    const methods = ['log', 'info', 'warn', 'error', 'debug', 'trace', 'dir', 'table', 'assert', 'count', 'group', 'groupCollapsed'];
   /* methods.forEach((method) => {
        const c = console as any;
        if (typeof c[method] !== 'function') return;
        const original = c[method].bind(console);
        c[method] = (...args: unknown[]) => {
            try { pushCapped(consoleBuffer, { ts: nowIso(), level: method, text: safeText(args) }, CONSOLE_CAP); } catch { }
            original(...args);
        };
    });*/
}

function installNetworkInterceptor(): void {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
        const started = performance.now();
        try {
            const res = await originalFetch(input, init);
            pushCapped(networkBuffer, { ts: nowIso(), method, url, status: res.status, durationMs: Math.round(performance.now() - started) }, NETWORK_CAP);
            return res;
        } catch (err) {
            pushCapped(networkBuffer, { ts: nowIso(), method, url, status: 'failed', durationMs: Math.round(performance.now() - started) }, NETWORK_CAP);
            throw err;
        }
    };

    const XHR = XMLHttpRequest.prototype as any;
    const originalOpen = XHR.open;
    const originalSend = XHR.send;
    XHR.open = function (method: string, url: string, ...rest: any[]) {
        this.__bugReport = { method: (method || 'GET').toUpperCase(), url: String(url) };
        return originalOpen.call(this, method, url, ...rest);
    };
    XHR.send = function (...args: any[]) {
        const info = this.__bugReport;
        if (info) {
            const started = performance.now();
            this.addEventListener('loadend', () => {
                pushCapped(networkBuffer, {
                    ts: nowIso(), method: info.method, url: info.url,
                    status: this.status || 'failed', durationMs: Math.round(performance.now() - started)
                }, NETWORK_CAP);
            });
        }
        return originalSend.apply(this, args);
    };
}

function installShortcutListener(): void {
    window.addEventListener('keydown', (ev: KeyboardEvent) => {
        if (!ev.ctrlKey || !ev.shiftKey || ev.key.toUpperCase() !== SHORTCUT.key) return;
        ev.preventDefault();
        ev.stopPropagation();
        captureAndOpen();
    }, true);
}

function installOpenViewListener(): void {
    // Fired by collab-messages-rich-preview-text-102025 when the user clicks
    // "Open" on a ```BUG code block in the chat.
    window.addEventListener('collab-bug-report-open', ((ev: CustomEvent<{ json: string }>) => {
        if (!activeInstance) return;
        activeInstance.openView(ev.detail?.json || '');
    }) as EventListener);
}

function installAll(): void {
    const w = window as any;
    if (w.__collabBugReportInstalled) return;
    w.__collabBugReportInstalled = true;
    installConsoleInterceptor();
    installNetworkInterceptor();
    installShortcutListener();
    installOpenViewListener();
}

// ---------------------------------------------------------------------------
// Capture
// ---------------------------------------------------------------------------

function serializeFileRef(f: any): IFileRef | undefined {
    if (!f) return undefined;
    return { project: f.project, shortName: f.shortName, folder: f.folder, extension: f.extension };
}

function snapshotMls(): IMlsSnapshot {
    const g = mls as any;
    const actual = ((g.actual || []) as any[]).map((a) => ({
        level: a.level,
        project: a.project,
        path: a.path,
        left: serializeFileRef(a.left),
        right: serializeFileRef(a.right),
    }));
    return {
        actualProject: g.actualProject,
        actualLevel: g.actualLevel,
        actualService: g.actualService,
        actualPosition: g.actualPosition,
        actualModule: g.actualModule,
        actual,
    };
}

async function captureScreenshot(): Promise<string | undefined> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) return undefined;
    let stream: MediaStream | undefined;
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false,
            preferCurrentTab: true,
        } as any);
        const video = document.createElement('video');
        video.srcObject = stream;
        video.muted = true;
        await video.play();
        await new Promise((r) => requestAnimationFrame(r));
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return undefined;
        ctx.drawImage(video, 0, 0);
        return canvas.toDataURL('image/jpeg', SCREENSHOT_JPEG_QUALITY);
    } catch {
        return undefined; // user denied the prompt — report goes on without the screenshot
    } finally {
        stream?.getTracks().forEach((t) => t.stop());
    }
}

function getUserSafe(): string {
    try { return mls.getActualUser(); } catch { return 'unknown'; }
}

// ---------------------------------------------------------------------------
// Destinations and send (collabMessages) — loaded on demand so the messages
// framework is not pulled into every level by this background service.
// ---------------------------------------------------------------------------

interface IDestination { threadId: string; name: string; group: string }

async function loadDestinations(): Promise<IDestination[]> {
    try {
        const idb = await import('/_102025_/l2/collabMessagesIndexedDB.js');
        const threads: any[] = await idb.getAllThreads();
        const rank = (name: string) => name.startsWith('@') ? 0 : name.startsWith('#') ? 1 : 2;
        return threads
            .filter((t) => t.status === 'active')
            .map((t) => ({ threadId: t.threadId, name: t.name, group: t.group }))
            .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
    } catch {
        return [];
    }
}

async function sendToThread(threadId: string, content: string): Promise<void> {
    const helper = await import('/_102025_/l2/collabMessagesHelper.js');
    await helper.addMessage(threadId, content);
}

async function captureAndOpen(): Promise<void> {
    if (capturing) return;
    capturing = true;
    try {
        // Screenshot FIRST: the screen still shows the state where the bug happened.
        const screenshot = await captureScreenshot();
        lastSnapshot = {
            capturedAt: nowIso(),
            user: getUserSafe(),
            href: location.href,
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            mls: snapshotMls(),
            console: consoleBuffer.slice(),
            network: networkBuffer.slice(-NETWORK_SEND),
            screenshot,
        };
        if (activeInstance) {
            activeInstance.refreshSnapshot();
            activeInstance.showNav2Item(true);
            activeInstance.openMe();
        }
    } finally {
        capturing = false;
    }
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@customElement('service-report-bug-100554')
export class ServiceReportBug100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    @state() private snapshot: IBugSnapshot | undefined;
    @state() private description = '';
    @state() private sent = false;
    @state() private sending = false;
    @state() private sendError = '';
    @state() private destinations: IDestination[] = [];
    @state() private selectedThreadId = '';
    @state() private destinationFilter = '';
    @state() private showSuggestions = false;
    @state() private highlightedIndex = -1;
    @state() private viewData: (IBugSnapshot & { description?: string }) | undefined;
    @state() private viewError = false;

    constructor() {
        super();
        installAll();
    }

    public details: IService = {
        icon: '&#xf188',
        state: 'background',
        tooltip: 'Report Bug',
        visible: true,
        position: 'all',
        widget: '_100554_serviceReportBug',
        level: [0, 1, 2, 3, 4, 5, 6, 7]
    }

    public menu: IServiceMenu = {
        title: 'Report Bug',
        main: {},
        tabs: undefined,
        tools: {},
    }

    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super.connectedCallback();
        activeInstance = this;
        this.snapshot = lastSnapshot;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (activeInstance === this) activeInstance = undefined;
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (visible) {
            this.snapshot = lastSnapshot;
            this.loadDestinations();
        }
    }

    public refreshSnapshot() {
        this.snapshot = lastSnapshot;
        this.description = '';
        this.sent = false;
        this.sending = false;
        this.sendError = '';
        this.viewData = undefined;
        this.viewError = false;
        this.loadDestinations();
    }

    public openView(json: string) {
        this.viewError = false;
        try {
            const data = JSON.parse(json);
            this.viewData = {
                capturedAt: data.capturedAt || '-',
                user: data.user || '-',
                href: data.href || '-',
                userAgent: data.userAgent || '-',
                viewport: data.viewport || '-',
                mls: data.mls || { actual: [] },
                console: Array.isArray(data.console) ? data.console : [],
                network: Array.isArray(data.network) ? data.network : [],
                screenshot: data.screenshot,
                description: data.description,
            };
        } catch {
            this.viewData = undefined;
            this.viewError = true;
        }
        this.showNav2Item(true);
        this.openMe();
    }

    private closeView() {
        this.viewData = undefined;
        this.viewError = false;
        this.snapshot = lastSnapshot;
    }

    private async loadDestinations() {
        this.destinations = await loadDestinations();
        if (this.selectedThreadId && !this.destinations.some((d) => d.threadId === this.selectedThreadId)) {
            this.selectedThreadId = '';
            this.destinationFilter = '';
        }
    }

    private get filteredDestinations(): IDestination[] {
        const filter = this.destinationFilter.trim().toLowerCase();
        if (!filter) return this.destinations;
        return this.destinations.filter((d) => d.name.toLowerCase().includes(filter));
    }

    private selectDestination(d: IDestination) {
        this.selectedThreadId = d.threadId;
        this.destinationFilter = d.name;
        this.showSuggestions = false;
        this.highlightedIndex = -1;
    }

    private onFilterInput(e: Event) {
        this.destinationFilter = (e.target as HTMLInputElement).value;
        this.selectedThreadId = '';
        this.showSuggestions = true;
        this.highlightedIndex = -1;
    }

    private onFilterBlur() {
        // Delay so a click on a suggestion lands before the list closes.
        setTimeout(() => { this.showSuggestions = false; this.highlightedIndex = -1; }, 150);
    }

    private onFilterKeyDown(e: KeyboardEvent) {
        const items = this.filteredDestinations;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.showSuggestions = true;
            this.highlightedIndex = Math.min(this.highlightedIndex + 1, items.length - 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        } else if (e.key === 'Enter') {
            if (this.showSuggestions && this.highlightedIndex >= 0 && items[this.highlightedIndex]) {
                e.preventDefault();
                this.selectDestination(items[this.highlightedIndex]);
            }
        } else if (e.key === 'Escape') {
            this.showSuggestions = false;
            this.highlightedIndex = -1;
        }
    }

    private buildPayload() {
        if (!this.snapshot) return undefined;
        return { description: this.description, ...this.snapshot };
    }

    private buildMessageContent(payload: IBugSnapshot & { description: string }): string {
        const json = JSON.stringify({
            ...payload,
            screenshot: payload.screenshot ? `[jpeg base64 - ${payload.screenshot.length} chars - ver console.log]` : undefined,
        }, null, 2);
        return `Bug: ${payload.capturedAt} — ${payload.user}\n\`\`\`BUG\n${json}\n\`\`\``;
    }

    private async onSend() {
        const payload = this.buildPayload();
        if (!payload || !this.selectedThreadId || this.sending) return;
        // Full payload (screenshot included) stays available in the browser console.
        console.log('[serviceReportBug] payload:', payload);
        this.sending = true;
        this.sendError = '';
        try {
            await sendToThread(this.selectedThreadId, this.buildMessageContent(payload));
            this.sent = true;
        } catch (err: any) {
            this.sendError = err?.message || String(err);
        } finally {
            this.sending = false;
        }
    }

    private renderEmpty() {
        return html`<div class="rb-empty">${this.msg.emptyHint}</div>`;
    }

    private renderMlsContext(m: IMlsSnapshot) {
        const rows: Array<[string, string]> = [
            ['actualProject', String(m.actualProject ?? '-')],
            ['actualLevel', String(m.actualLevel ?? '-')],
            ['actualService', m.actualService || '-'],
            ['actualPosition', m.actualPosition || '-'],
            ['actualModule', m.actualModule || '-'],
        ];
        return html`
            <table class="rb-table">
                <thead>
                    <tr><th>${this.msg.colField}</th><th>${this.msg.colValue}</th></tr>
                </thead>
                <tbody>
                    ${rows.map(([k, v]) => html`<tr><td>${k}</td><td>${v}</td></tr>`)}
                    ${m.actual.filter((a) => a.project || a.left || a.right).map((a) => html`
                        <tr>
                            <td>actual[${a.level}]</td>
                            <td>prj ${a.project ?? '-'}${a.left?.shortName ? ` | L: ${a.left.shortName}` : ''}${a.right?.shortName ? ` | R: ${a.right.shortName}` : ''}</td>
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }

    private renderNetwork(entries: INetworkEntry[]) {
        return html`
            <table class="rb-table">
                <thead>
                    <tr>
                        <th>${this.msg.colMethod}</th>
                        <th>${this.msg.colRequest}</th>
                        <th>${this.msg.colStatus}</th>
                        <th>${this.msg.colTime}</th>
                    </tr>
                </thead>
                <tbody>
                    ${entries.map((n) => html`
                        <tr class="${typeof n.status === 'number' && n.status < 400 ? '' : 'rb-error'}">
                            <td>${n.method}</td>
                            <td class="rb-url" title="${n.url}">${n.url}</td>
                            <td>${n.status}</td>
                            <td>${n.durationMs}ms</td>
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }

    private renderConsole(entries: IConsoleEntry[]) {
        return html`
            <div class="rb-console">
                <div class="rb-console-header">
                    <span class="rb-col-when">${this.msg.colWhen}</span>
                    <span class="rb-col-type">${this.msg.colType}</span>
                    <span>${this.msg.colMessage}</span>
                </div>
                ${entries.map((c) => html`
                    <div class="rb-line rb-${c.level}">
                        <span class="rb-col-when">${c.ts.slice(11, 19)}</span>
                        <span class="rb-col-type">${c.level}</span>
                        <span class="rb-col-text">${c.text}</span>
                    </div>
                `)}
            </div>
        `;
    }

    private renderDataSections(s: IBugSnapshot) {
        return html`
            <div class="rb-section">
                <h4>${this.msg.screenshot}</h4>
                ${s.screenshot && s.screenshot.startsWith('data:image')
                    ? html`<img class="rb-screenshot" src="${s.screenshot}" alt="screenshot" />`
                    : html`<div class="rb-empty">${s.screenshot ? this.msg.viewScreenshotUnavailable : this.msg.noScreenshot}</div>`}
            </div>

            <div class="rb-section">
                <h4>${this.msg.context}</h4>
                ${this.renderMlsContext(s.mls)}
            </div>

            <div class="rb-section">
                <h4>${this.msg.network} (${s.network.length})</h4>
                ${this.renderNetwork(s.network)}
            </div>

            <div class="rb-section">
                <h4>${this.msg.console} (${s.console.length})</h4>
                ${this.renderConsole(s.console)}
            </div>
        `;
    }

    private renderView(s: IBugSnapshot & { description?: string }) {
        return html`
            <div class="rb-view-banner">
                <span>${this.msg.viewTitle}</span>
                <button class="rb-view-close" @click=${() => this.closeView()}>${this.msg.viewClose}</button>
            </div>
            <div class="rb-meta">${this.msg.capturedAt}: ${s.capturedAt} — ${this.msg.user}: ${s.user}</div>

            <div class="rb-section">
                <label class="rb-label">${this.msg.description}</label>
                <div class="rb-view-description">${s.description || '-'}</div>
            </div>

            ${this.renderDataSections(s)}
        `;
    }

    private renderSnapshot(s: IBugSnapshot) {
        return html`
            <div class="rb-meta">${this.msg.capturedAt}: ${s.capturedAt} — ${this.msg.user}: ${s.user}</div>

            <div class="rb-section">
                <label class="rb-label">${this.msg.description}</label>
                <textarea class="rb-description" rows="4" placeholder="${this.msg.descriptionPlaceholder}"
                    .value=${this.description}
                    @input=${(e: Event) => { this.description = (e.target as HTMLTextAreaElement).value; }}></textarea>

                <label class="rb-label">${this.msg.sendTo}</label>
                ${this.destinations.length === 0
                    ? html`<div class="rb-empty">${this.msg.noThreads}</div>`
                    : html`
                        <div class="rb-filter-select">
                            <input class="rb-select" type="text" autocomplete="off"
                                placeholder="${this.msg.selectDestination}"
                                .value=${this.destinationFilter}
                                @input=${(e: Event) => this.onFilterInput(e)}
                                @focus=${() => { this.showSuggestions = true; }}
                                @blur=${() => this.onFilterBlur()}
                                @keydown=${(e: KeyboardEvent) => this.onFilterKeyDown(e)} />
                            ${this.showSuggestions ? html`
                                <div class="rb-suggestions">
                                    ${this.filteredDestinations.length === 0
                                        ? html`<div class="rb-suggestion rb-suggestion-empty">${this.msg.noMatches}</div>`
                                        : this.filteredDestinations.map((d, index) => html`
                                            <div class="rb-suggestion ${index === this.highlightedIndex ? 'highlighted' : ''} ${d.threadId === this.selectedThreadId ? 'selected' : ''}"
                                                @mousedown=${(e: MouseEvent) => e.preventDefault()}
                                                @click=${() => this.selectDestination(d)}>
                                                ${d.name} <span class="rb-suggestion-group">(${d.group})</span>
                                            </div>
                                        `)}
                                </div>
                            ` : ''}
                        </div>`}

                <button class="rb-send"
                    ?disabled=${this.sent || this.sending || !this.description.trim() || !this.selectedThreadId}
                    @click=${() => this.onSend()}>${this.sending ? this.msg.sending : this.msg.send}</button>
                ${this.sent ? html`<div class="rb-sent">${this.msg.sent}</div>` : ''}
                ${this.sendError ? html`<div class="rb-send-error">${this.msg.sendFailed}: ${this.sendError}</div>` : ''}
            </div>

            ${this.renderDataSections(s)}
        `;
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        if (this.viewData) {
            return html`<div class="rb-root">${this.renderView(this.viewData)}</div>`;
        }
        return html`
            <div class="rb-root">
                ${this.viewError ? html`<div class="rb-send-error">${this.msg.viewInvalid}</div>` : ''}
                ${this.snapshot ? this.renderSnapshot(this.snapshot) : this.renderEmpty()}
            </div>
        `;
    }
}
