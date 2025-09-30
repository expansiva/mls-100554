/// <mls shortName="pluginNavigationRenderOrganism" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, TemplateResult, LitElement } from 'lit';
import { customElement, state, property, query } from 'lit/decorators.js';
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import { collab_trash, collab_pencil, collab_bars, collab_info } from './_100554_collabIcons';
import { openService } from './_100554_libCommom';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { CollabPreviewL3 } from './_100554_collabPreviewL3';
import { ServiceBase } from './_100554_serviceBase';
import { setState } from './_100554_collabState';



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
        setTimeout(() => this.forceUpdate(), 500);
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
            case ('details'):
                return this.renderDetails();
        }

    }

    renderHeader(txt: string, btn: TemplateResult<1>, pos: string) {

        return html`
            <div class="headerNav ${pos}">
                <h1 style="display:none">${txt}</h1>
                ${btn}               
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
            <button class="btn-nav" title="add organism" @click="${() => this.dispatchEventAdd()}">
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

        const cls = item.el.id === this.activeId ? 'activeBranch' : '';

        let mySymbol = 'fa-cubes'
        if ((item.el as any).mySymbol) mySymbol = (item.el as any).mySymbol;

        const name = item.el.tagName.toLocaleLowerCase();

        let aux: any = '';

        if (item.isFather) {
            aux = html`
                <span 
                    class="mls-gpbtnslider-item"
                    @click="${(e: MouseEvent) => this.goToL2(e, item)}" 
                    title="edit"
                >
                Edit ${collab_pencil}</span>
            `;
        }

        return html`
            <li>
                <div 
                    .info=${item}
                    id="${item.el.tagName.toLocaleLowerCase() + idx}"                      
                    class="header ${cls} activegpbtnslider" 
                    @click="${(e: MouseEvent) => this.selectItem(e, item)}" 
                    @mouseover="${(e: MouseEvent) => this.onMouseover(item)}"
                    @mouseout="${(e: MouseEvent) => this.onMouseout(item)}"   
                >
                    <info-item .info=${item}>
                        <span class="fa ${mySymbol}" style="margin-right:.5rem"></span>
                        <span class="infoname">
                            ${name}
                            <small class="showId">(${item.el.id})</small>
                        </span>
                        <span class="groupHiddenListIcon" .info=${item}  @click="${this.clickGroupHidden}">
                        </span>
                    </info-item>
                    <div class="groupHiddenList" >
                        ${aux}
                        <span class="mls-gpbtnslider-item" @click="${() => this.goToScenary('details')}" title="details">
                            Details ${collab_info}
                    
                        </span>
                        <span class="mls-gpbtnslider-item" @click="${() => this.dispatchEventStyle()}" title="style">
                            Element Style <svg width="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3L344 320c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                    
                        </span>

                        <span class="mls-gpbtnslider-item" @click="${() => this.dispatchEventGlobalStyle()}" title="style">
                            Project Style <svg width="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z"/></svg>
                    
                        </span>
                        
                        
                        <span class="mls-gpbtnslider-item" @click="${() => this.dispatchEventProperty()}" title="properties">
                            Properties <svg xmlns="http://www.w3.org/2000/svg" width="15px" viewBox="0 0 512 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"/></svg>
                        </span>
                        <span class="mls-gpbtnslider-item" @click="${this.delEl}" title="remove">
                            Delete ${collab_trash}
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

    private dispatchEventAdd() {
        this.dispatchEvent(
            new CustomEvent('on-add-click', {
                bubbles: true,
                composed: true
            })
        );
    }

    private dispatchEventProperty() {
        this.dispatchEvent(
            new CustomEvent('on-property-click', {
                bubbles: true,
                composed: true
            })
        );
    }

    private dispatchEventGlobalStyle() {
        const key = mls.stor.getKeyToFiles(mls.actualProject || 0, 2, 'project', '', '.ts');

        const f = mls.stor.files[key];
        if (!f) return;
        mls.actual[2].left = f;
        mls.actual[2].setFullName(`_${mls.actualProject}_project`);
        openService('_100554_serviceSource', 'left', 2);
    }

    private dispatchEventStyle() {
        this.dispatchEvent(
            new CustomEvent('on-style-click', {
                bubbles: true,
                composed: true
            })
        );
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

        const reentrance = async (array: IInfoElChildren[], element: HTMLElement) => {

            let info: IInfoElChildren | undefined;
            if (element.getAttribute(this.atributeBase) && !lessTags.includes(element.tagName.toLocaleLowerCase())) {
                info = { el: element as HTMLElement, id: element.id, children: [] as any, isFather: false };
                array.push(info);
            } else if (tag === element.tagName.toLocaleLowerCase()) {
                await (element as any).updateComplete;
                info = { el: element as HTMLElement, id: element.id, children: [] as any, isFather: true };
                array.push(info);
            }

            const children = element.shadowRoot ? Array.from(element.shadowRoot.children) : Array.from(element.children);

            for (let i = 0; i < children.length; i++) {
                const child = children[i] as HTMLElement;
                await reentrance(info ? info.children : array, child as HTMLElement)
            }

        }

        await reentrance(ret, scope);



        return ret;
        //return this.mockup();

    }

    private mockup(): IInfoElChildren[] {

        const array: IInfoElChildren[] = [];

        for (let i = 0; i < 4; i++) {

            const d = document.createElement('div');
            d.id = 'el_' + i;

            const info = { el: d as HTMLElement, id: d.id, children: [] as any, isFather: false };
            array.push(info);

        }

        return array;
    }

    private selectItem(e: MouseEvent, item: IInfoElChildren): void {

        e.stopPropagation();
        let target = e.target as HTMLElement;
        if (target && target.className.indexOf('header') < 0) {
            target = target.closest('.header') as HTMLElement;
        }

        if (!target) return;
        if (this.elPreviewL3) this.elPreviewL3.selectElement(item.el);
        this.activeId = item.id;
        /*if (target.classList.contains('activeBranch')) {
            this.dispatchEventStyle();
        }*/

        const els = this.querySelectorAll('.activeBranch');
        els.forEach((el) => el.classList.remove('activeBranch'));
        target.classList.add('activeBranch');

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

    private goToL2(e: MouseEvent, item: IInfoElChildren) {
        const fileInfo = convertTagToFileName(item.el.tagName.toLowerCase());
        if (!fileInfo) return;
        const { folder, project, shortName } = fileInfo;

        const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');
        const f = mls.stor.files[key];
        if (!f) return;

        mls.actual[2].setFullName(folder ? `_${project}_${folder}/${shortName}` : `_${project}_${shortName}`);

        mls.actual[2].left = f;

        openService('_100554_serviceSource', 'left', 2);
    }


    


}

type TScenary = 'list' | 'details'

interface IInfoElChildren {
    el: HTMLElement,
    id: string,
    children: IInfoElChildren[],
    isFather: boolean
}