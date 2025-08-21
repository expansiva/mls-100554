/// <mls shortName="pluginNavigationRenderOrganism" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, TemplateResult, LitElement } from 'lit';
import { customElement, state, property, query } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit';
import { executeAgentByFile } from './_100554_aiAgentHelper'
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { CollabPreviewL3 } from './_100554_collabPreviewL3';
import { ServiceBase } from './_100554_serviceBase';

/// **collab_i18n_start** 
const message_pt = {
    noItens: 'Nenhum item foi encontrado!',
    msg1: 'Describe the new element to add inside the organism (e.g., button, text, nav).',
    msg2: 'Type what to create inside the organism, like "add button" or "add text".',
}

const message_en = {
    noItens: 'No items were found!',
    msg1: 'Describe the new element to add inside the organism (e.g., button, text, nav).',
    msg2: 'Type what to create inside the organism, like "add button" or "add text".'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-navigation-render-organism-100554')
export class PluginNavigationRenderOrganism extends PluginBaseModule {

    private msg: MessageType = messages['en'];
    private atributeBase = 'id';
    private elPreviewL3: CollabPreviewL3 | undefined;

    @property() service: ServiceBase | undefined;
    @property() scenary: TScenary = 'list';
    @property() els: IInfoElChildren[] = [];

    @query('#iptModule') iptModule: HTMLSelectElement | undefined;
    @query('#iptOrganism') iptOrganism: HTMLInputElement | undefined;
    @query('#iptPrompt') iptPrompt: HTMLInputElement | undefined;

    constructor() {
        super();
        this.setEvents();
    }

    private setEvents(): void {
        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected'], (ev) => this.onlevelChange(ev));

        mls.events.addListener(3, 'L3EditEvents' as any, this.onL3EditEvents.bind(this));

        mls.events.addListener(3, 'FineshPreview' as any, this.fineshPreview.bind(this));

    }

    private onL3EditEvents(ev: mls.events.IEvent) {

        if (!ev.desc || ev.level !== 3) return;

        const info = JSON.parse(ev.desc);

        if (!info || !info.action || !info.position || info.position === 'left') return;

        switch (info.action) {
            case ('select'):
                this.onSelect(info);
                break;
            case ('navigation'):
                this.onNavigation(info);
                break;

        }

    }

    private async fineshPreview(ev: mls.events.IEvent) {

        if (ev.level !== 3) return;
        this.forceUpdate();

    }

    private onSelect(info: any) {
        if (!info.id) return;
        this.activeId = info.id;
    }

    private onNavigation(info: any) {
        this.forceUpdate();
    }

    private onlevelChange(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const j = JSON.parse(ev.desc);
        if (j.level === 3) {
            this.forceUpdate();
        }
    }

    //-------COMPONENT----------

    @state() activeId = '';
    private tryRender = 0;

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.init();
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        this.setElPreview();

        switch (this.scenary) {
            case ('list'):
                return this.renderNav();
            case ('prop'):
                return this.renderProperties();
            case ('details'):
                return this.renderDetails();
            case ('add'):
                return this.renderAdd();
        }

    }

    renderHeader(txt: string, btn: TemplateResult<1>, pos: string) {

        return html`
            <div class="headerNav ${pos}">
                <h1>${txt}</h1>
                ${btn}               
            </div>
        `
    }

    renderProperties() {
        let btn = html`
            <button class="btn-nav" title="add organism" @click="${() => this.goToScenary('list')}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            </button>
        `;
        return html`
            ${this.renderHeader('Properties', btn, 'left')}
            <h3>In developed</h3>
        `
    }

    renderAdd() {
        let btn = html`
            <button class="btn-nav" title="add organism" @click="${() => this.goToScenary('list')}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            </button>
        `;

        const { project, path } = mls.actual[3];
        const info = mls.l2.getPath(`_${project}_${path}`);

        return html`
            ${this.renderHeader('Add', btn, 'left')}
        
            <div class="form-container">

                <div class="form-group">
                    <label for="project">Projetc</label>
                    <input type="text" disabled .value="${mls.actualProject}"/>
                </div>

                <div class="form-group">
                    <label for="module">Module</label>
                    <input type="text" disabled .value="${info.folder}"/>
                </div>

                <div class="form-group">
                    <label for="organism">Organism</label>
                    <input type="text" disabled .value="${info.shortName}"/>
                </div>

                <div class="form-group">
                    <label for="prompt">Prompt</label>
                    <textarea id="iptPrompt" placeholder="Write your prompt..."></textarea>
                    <div style=" display: flex ; flex-direction: column;">
                        <small>${this.msg.msg1}</small>
                        <small>${this.msg.msg2}</small>
                    </div>
                </div>

                <button class="btn-save" @click=${this.createFile}>Save</button>
            </div>
        `
    }

    renderDetails() {
        let btn = html`
            <button class="btn-nav" title="add organism" @click="${() => this.goToScenary('list')}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            </button>
        `;
        return html`
            ${this.renderHeader('Details', btn, 'left')}
            <h3>In developed</h3>
        `
    }

    renderNav() {

        let btn = html`
            <button class="btn-nav" title="add organism" @click="${() => this.goToScenary('add')}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
            </button>
        `;

        return html`
            ${this.renderHeader(mls.actual[3].getFullName(), btn, 'right')}
            ${this.renderNav2()}
        `
    }

    renderNav2() {
        if (this.els && this.els.length > 0) return this.createNavigation(this.els);
        return html`<h3 style="padding:1rem">${this.msg.noItens}<h3>`;
    }

    createNavigation(array: IInfoElChildren[]) {

        const obj = html`
            <div class="contentNav">
            <ul>
                ${repeat(array, ((key: IInfoElChildren, idx: number) => key.id) as any,
            ((item: IInfoElChildren, index: any) => { return this.renderItemTree(item, index); }) as any
        )}
            </ul>
            </div>
        `;

        return obj;

    }

    renderItemTree(item: IInfoElChildren, idx: string) {

        const cls = item.el.id === this.activeId || item.el.hasAttribute('clb_mode') ? 'activeBranch' : '';

        let mySymbol = 'fa-cubes'
        if ((item.el as any).mySymbol) mySymbol = (item.el as any).mySymbol;

        //const name = item.el.tagName.length > 30 ? item.el.tagName.toLocaleLowerCase().substring(0, 29) + '...' : item.el.tagName.toLocaleLowerCase();

        const name = item.el.tagName.toLocaleLowerCase();

        return html`
            <li>
                <div 
                    .info=${item}
                    id="${item.el.tagName.toLocaleLowerCase() + idx}"                      
                    class="header ${cls}" 
                    @click="${(e: MouseEvent) => this.selectItem(e, item)}" 
                    @mouseover="${(e: MouseEvent) => this.onMouseover(item)}"
                    @mouseout="${(e: MouseEvent) => this.onMouseout(item)}"   
                >
                    <info-item .info=${item}>
                        <span class="fa ${mySymbol}" style="margin-right:.5rem"></span>
                        ${name}
                        <small>(${item.el.id})</small>
                    </info-item>
                    <div class="groupHiddenList" .info=${item}  @click="${this.clickGroupHidden}" >
                        
                        <span class="mls-gpbtnslider-item" @click="${() => this.goToScenary('details')}" title="details">
                            <svg xmlns="http://www.w3.org/2000/svg" width="7px" viewBox="0 0 192 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224 32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0 0-192-32 0c-17.7 0-32-14.3-32-32z"/></svg>
                        </span>
                        <span class="mls-gpbtnslider-item" @click="${this.delEl}" title="remove">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13px" viewBox="0 0 448 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                        </span>
                        <span class="mls-gpbtnslider-item" @click="${() => this.goToScenary('prop')}" title="properties">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15px" viewBox="0 0 512 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"/></svg>
                        </span>
                    </div>
                </div>
                <ul>
                    ${repeat(item.children, ((c: IInfoElChildren, idx: number) => c.el.tagName + idx) as any, ((i: any, idxI: any) => { return this.renderItemTree(i, idx + '_' + idxI); }) as any)}
                </ul>
            </li>
        `;

    }

    //-------- IMPLEMENTATION --------------

    public forceUpdate(): void {
        this.init();
    }

    private async init() {
        setTimeout(async () => { this.els = await this.getComponents(); }, 500)
    }

    private goToScenary(scenary: TScenary) {
        this.scenary = scenary;
    }

    private tryRenderAgain() {

        if (this.tryRender === 10) return;
        this.tryRender++;
        setTimeout(() => this.forceUpdate(), 800);

    }

    private setElPreview() {
        const scope = window.preview?.iframe?.contentDocument?.body;
        if (!scope) return;
        this.elPreviewL3 = scope.querySelector('collab-preview-l3-100554') as CollabPreviewL3;
    }

    private async getComponents(): Promise<IInfoElChildren[]> {
        const lessTags = ['script', 'style', 'body', 'head', 'html'];
        let ret: IInfoElChildren[] = [];
        const scope = window.preview?.iframe?.contentDocument?.body;
        if (!scope) return ret;

        const infoFile = mls.l2.getPath(mls.actual[3].getFullName());
        const tag = convertFileNameToTag(infoFile);

        const root = scope.querySelector(tag) as LitElement;
        if (root) await root.updateComplete;

        const reentrance = (array: IInfoElChildren[], element: HTMLElement) => {

            let info: IInfoElChildren | undefined;
            if (element.getAttribute(this.atributeBase) && !lessTags.includes(element.tagName.toLocaleLowerCase())) {
                info = { el: element as HTMLElement, id: element.id, children: [] as any };
                array.push(info);
            } else if (tag === element.tagName.toLocaleLowerCase()) {
                info = { el: element as HTMLElement, id: element.id, children: [] as any };
                array.push(info);
            }

            if (element.shadowRoot) {
                const children = Array.from(element.shadowRoot.children);

                for (let i = 0; i < children.length; i++) {
                    const child = children[i] as HTMLElement;
                    reentrance(info ? info.children : array, child as HTMLElement)
                }

            } else {
                const children = Array.from(element.children);
                for (let i = 0; i < children.length; i++) {
                    const child = children[i] as HTMLElement;
                    reentrance(info ? info.children : array, child as HTMLElement)
                }
            }

        }

        reentrance(ret, scope);

        return ret;

    }

    private selectItem(e: MouseEvent, item: IInfoElChildren): void {

        e.stopPropagation();
        let target = e.target as HTMLElement;
        if (target && target.className.indexOf('header') < 0) {
            target = target.closest('.header') as HTMLElement;
        }

        if (!target) return;

        const active = this.querySelector('.activeBranch') as HTMLElement;
        if (active && active === target) {
            return;
        }

        if (active) active.classList.remove('activeBranch');
        target.classList.add('activeBranch')

        if (this.elPreviewL3) this.elPreviewL3.selectElement(item.el);

    }

    private clickGroupHidden(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;

        const father = el.closest('.header');
        if (!father) return;

        father.classList.toggle('activegpbtnslider');

        if (!(el as any).info) return;

        let lock = 'fa-lock-open';
        const isGroup = (el as any).info.el.getAttribute('isFCAGroup');
        if (isGroup || isGroup === 'true') {
            lock = 'fa-lock';
        }

        const group = el.querySelector('.classLock') as HTMLElement;
        if (group) {
            group.classList.remove('fa-lock');
            group.classList.remove('fa-lock-open');
            group.title = lock === 'fa-lock' ? 'lock' : 'lock open';
            group.classList.add(lock);

        }

    }

    private delEl(e: MouseEvent) {

        e.stopPropagation();
        setTimeout(() => { this.requestUpdate(); }, 100);

    }

    private onMouseover(item: IInfoElChildren) {
        this.highlightElement(item.el);
    }

    private onMouseout(item: IInfoElChildren) {
        this.unhighlightElement(item.el);
    };

    private highlightElement(el: HTMLElement) {
        if (!this.elPreviewL3 || !this.elPreviewL3.setHover) return;
        this.elPreviewL3.setHover(el, true);
    }

    private unhighlightElement(el: HTMLElement) {
        if (!this.elPreviewL3 || !this.elPreviewL3.setHover) return;
        this.elPreviewL3.setHover(el, false);
    }

    private async createFile() {

        try {

            this.showLoad(true);

            if (!this.iptPrompt || !this.iptPrompt.value) {
                throw new Error('Enter the prompt');
            }

            const path = mls.actual[3].getFullName();
            if (!path) throw new Error('Not found path');
            const info = mls.l2.getPath(path);

            const key = mls.stor.getKeyToFiles(info.project, 2, info.shortName, info.folder, '.ts');
            if (!mls.stor.files[key]) throw new Error('Not found storFile');

            const pp = { page: path, prompt: this.iptPrompt.value, position: 'left' };

            await this.fireImprove(mls.stor.files[key], JSON.stringify(pp));
            mls.events.fireFileAction('statusOrErrorChanged', mls.stor.files[key], 'left', 0);
            this.scenary = 'list';
            this.iptPrompt.value = '';
            this.showLoad(false);

        } catch (e: any) {

            this.showError('[createFile]' + e.message);
            this.showLoad(false);
        }

    }

    private async fireImprove(file: mls.stor.IFileInfo, prompt: string) {
        await executeAgentByFile('agentImprovePrototypeOrganism', prompt, file);

    }

    private showLoad(active: boolean) {

        setTimeout(() => {
            if (!this.service) return;
            this.service.loading = active
        }, 500);
    }

    private showError(msg: string) {
        if (!this.service) return;
        this.service.setError(msg);
    }


}

type TScenary = 'prop' | 'list' | 'details' | 'add';

interface IInfoElChildren {
    el: HTMLElement,
    id: string,
    children: IInfoElChildren[]
}