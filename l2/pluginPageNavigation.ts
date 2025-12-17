/// <mls shortName="pluginPageNavigation" project="100554" enhancement="_100554_enhancementLit" groupName="other" />     

import { html, repeat } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';
import { collab_trash, collab_pencil, collab_bars } from '/_100554_/l2/collabIcons.js';
import { convertTagToFileName, convertFileNameToTag } from '/_100554_/l2/utilsLit.js';
import { selectLevel, openService } from '/_100554_/l2/libCommom.js';
import { formatHtml, setValueInModeKeepingUndo } from '/_100554_/l2/collabDOMSync.js';
import { CollabPreviewL4 } from '/_100554_/l2/collabPreviewL4.js';
import { openCollabMessage } from '/_100554_/l2/aiAgentHelper.js';

/// **collab_i18n_start**
const message_pt = {
    noItens: 'Nenhum item foi encontrado!'
}

const message_en = {
    noItens: 'No items were found!',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-page-navigation-100554')
export class PluginNavigationRenderOrganism extends PluginBaseModule {

    private msg: MessageType = messages['en'];
    private atributeBase = 'id';
    private elPreviewL4: CollabPreviewL4 | undefined;

    @state() nodes: IInfoElChildren[] = [];

    constructor() {
        super();
        this.setEvents();
    }

    private domNavigator?: HTMLElement;

    private setEvents(): void {
        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected'], (ev) => this.onlevelChange(ev));

        mls.events.addListener(4, 'L4EditEvents' as any, this.onL4EditEvents.bind(this));
    }

    private onL4EditEvents(ev: mls.events.IEvent) {

        if (!ev.desc || ev.level !== 4) return;

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

    private onSelect(info: any) {
        if (!info.id) return;

        const els = this.querySelectorAll('.activeBranch');
        els.forEach((el) => el.classList.remove('activeBranch'));
        this.activeId = info.id;
    }

    private onNavigation(info: any) {
        this.requestUpdate();
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
        this.nodes = await this.getComponents();
        this.tabIndex = 0;
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        if (this.nodes && this.nodes.length > 0) return this.createNavigation(this.nodes);
        return html`<h3 style="padding:1rem">${this.msg.noItens}<h3>`;
    }

    createNavigation(array: IInfoElChildren[]) {
        const obj = html`
            
            <ul>
                ${repeat(array, ((key: IInfoElChildren, idx: number) => key.id) as any,
            ((item: IInfoElChildren, index: any) => { return this.renderItemTree(item, index); }) as any
        )}
            </ul>
        `;

        return obj;

    }
    renderItemTree(item: IInfoElChildren, idx: string, parentArray: IInfoElChildren[] = this.nodes) {

        const cls = (item.elDomNavigator && this.activeId && item.elDomNavigator.id === this.activeId) ? 'activeBranch' : '';
        let mySymbol = 'fa-cubes';
        const info = this.getActualFileL4();

        const draggable = item.tagName !== info?.tagName;

        const renderHeader = () => {
            //@dblclick="${(e: MouseEvent) => this.editEl(e, item)}"
            return html`
                <div  
                    .info=${item}
                    id="${item.tagName + idx}"                      
                    class="header ${cls} activegpbtnslider" 
                    
                    @click="${(e: MouseEvent) => this.selectItem(e, item)}"  
                    @mouseover="${() => this.onMouseover(item)}"
                    @mouseout="${() => this.onMouseout(item)}"   
                >
                    
                    <info-item .info=${item}>
                        <span class="move-icon" title="Mover">
                            ${collab_bars}
                        </span>
                        <span class="fa ${mySymbol}" style="margin-right:.5rem"></span>
                        <span class="infoname">${this.slugToTitle(item.tagName)}</span>
                        <span class="groupHiddenListIcon" .info=${item}  @click="${this.clickGroupHidden}">
                        </span>
                    </info-item>

                    <div class="groupHiddenList" .info=${item}>
                        ${item.isOrganism ? html`
                            <span 
                                class="mls-gpbtnslider-item"
                                @click="${(e: MouseEvent) => this.editEl(e, item)}" 
                                title="edit"
                            >
                            Edit ${collab_pencil}</span>
                        
                        `
                    : ''}
                    
                        <span class="mls-gpbtnslider-item"  title="style" @click="${(e: MouseEvent) => this.goToL2(e, item)}">
                            Page Style <svg width="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3L344 320c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                    
                        </span>

                        <span class="mls-gpbtnslider-item" @click="${(e:MouseEvent) => this.openCollabMessage(e, item)}" title="collabMessage">
                    Collab Message <svg width="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2s0 0 0 0s0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.2-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9c0 0 0 0 0 0s0 0 0 0l-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"/></svg>
                </span>

                        <span class="mls-gpbtnslider-item" @click="${(e:MouseEvent) => this.dispatchEventGlobalStyle(e)}"  title="style">
                            Project Style <svg width="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z"/></svg>
                    
                        </span>
                    
                        <span
                            class="mls-gpbtnslider-item"
                            @click="${this.goToImprove}" 
                            title="remove"
                        >Improve <svg width="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M320 0c17.7 0 32 14.3 32 32l0 64 120 0c39.8 0 72 32.2 72 72l0 272c0 39.8-32.2 72-72 72l-304 0c-39.8 0-72-32.2-72-72l0-272c0-39.8 32.2-72 72-72l120 0 0-64c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224l16 0 0 192-16 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-16 0 0-192 16 0z"/></svg>
                        </span>
                        <span
                            class="mls-gpbtnslider-item"
                            @click="${this.delEl}" 
                            title="remove"
                        >Delete ${collab_trash}</span>
                    </div>
                </div>
                <ul>
                    ${repeat(
                        item.children,
                        ((c: IInfoElChildren, idx: number) => c.tagName + item.elDomNavigator?.id + idx) as any,
                        ((i: IInfoElChildren, idxI: number) => this.renderItemTree(i, idx + '_' + idxI, item.children)) as any
                    )}
                </ul>
            `
        }

        if (draggable) {
            return html`
                <li 
                    class="nav-item"
                    .item=${item}
                    draggable=${draggable} 
                    @dragstart=${(e: DragEvent) => this.onDragStart(e, item, parentArray)}
                    @dragover=${(e: DragEvent) => this.onDragOver(e, item)}
                    @dragleave=${(e: DragEvent) => this.onDragLeave(e)}
                    @drop=${(e: DragEvent) => this.onDrop(e, item, parentArray)}
                    @dragend=${() => this.onDragEnd()}

                    @touchstart=${(e: TouchEvent) => this.onTouchStart(e, item, parentArray)}
                    @touchmove=${(e: TouchEvent) => this.onTouchMove(e)}
                    @touchend=${(e: TouchEvent) => this.onTouchEnd(e)}
                >
                    ${renderHeader()} 
            </li>`;
        } else {
            return html`<li class="nav-item">${renderHeader()}</li>`;
        }
    }

    //-------- IMPLEMENTATION --------------

    public forceUpdate(): void {
        this.requestUpdate();
    }

    private openCollabMessage(e:MouseEvent, item: IInfoElChildren) {
        e.stopPropagation();
        if (!item || !item.tagName) return;

        const info = convertTagToFileName(item.tagName);

        if (!info || !info.project) return;

        const key = mls.stor.getKeyToFiles(info.project, 2, info.shortName, info.folder, '.ts');

        if (!mls.stor.files[key]) return;

        openCollabMessage(mls.stor.files[key]);
    }

    private getActualFileL4() {
        const { folder, project, shortName } = mls.l2.getPath(`_${mls.actual[4].project}_${mls.actual[4].path}`);

        if (!project || !shortName) return undefined;

        const keyStorFile = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.html');
        const keyModels = mls.editor.getKeyModel(project, shortName, folder, 2);

        const storFile = mls.stor.files[keyStorFile];
        const models = mls.editor.models[keyModels];

        const tagName = convertFileNameToTag({ shortName, project, folder });
        return {
            storFile,
            models,
            tagName
        }
    }

    private async getComponents(): Promise<IInfoElChildren[]> {

        const storFile = this.getActualFileL4()?.storFile;
        if (!storFile) return [];
        const content = await storFile.getContent();
        if (!content || typeof content !== 'string') return [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        this.domNavigator = doc.body;
        if (!this.domNavigator) return [];
        return this.getComponents2(this.domNavigator);

    }

    private getComponents2(scope: HTMLElement) {
        const excludeTags = ['script', 'style', 'body', 'head', 'html'];
        let ret: IInfoElChildren[] = [];

        const reentrance = (array: IInfoElChildren[], element: HTMLElement) => {

            let info: IInfoElChildren | undefined;
            if (!excludeTags.includes(element.tagName.toLocaleLowerCase())) {

                const el = element.id ? scope.querySelector(`#${element.id}`) as HTMLElement : null;
                const isOrganism = element.tagName.includes('-') && element.tagName.toLocaleLowerCase().includes('organism-')
                info = { el, id: element.id, children: [], tagName: element.tagName.toLowerCase(), isOrganism, elDomNavigator: element };
                array.push(info);
            }
            const children = Array.from(element.children);
            for (let i = 0; i < children.length; i++) {
                const child = children[i] as HTMLElement;
                reentrance(info ? info.children : array, child as HTMLElement)
            }
        }

        reentrance(ret, scope);
        return ret;
    }
 
    private selectItem(e: MouseEvent, item: IInfoElChildren): void {

        e.stopPropagation();
        let target = e.target as HTMLElement;
        if (target && (typeof target.className !== 'string' || target.className.indexOf('header') < 0)) {
            target = target.closest('.header') as HTMLElement;
        }

        if (!target) return;

        const active = this.querySelector('.activeBranch') as HTMLElement;
        if (active && active === target) {
            return;
        }

        if (active) active.classList.remove('activeBranch');
        target.classList.add('activeBranch')
        item.el?.scrollIntoView({
            behavior: "auto",
            block: "start",
            inline: "nearest"
        });

        if (!this.elPreviewL4 || !this.elPreviewL4.selectElement || !this.elPreviewL4.isConnected) this.setElPreview();

        if (!this.elPreviewL4 || !this.elPreviewL4.selectElement || !item.el) return;

        this.elPreviewL4.selectElement(item.id);



    }

    private clickGroupHidden(e: MouseEvent) {
        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;

        const father = el.closest('.header');
        if (!father) return;

        father.classList.toggle('activegpbtnslider');
    }

    private delEl(e: MouseEvent) {
        e.stopPropagation();
        //setTimeout(() => { this.requestUpdate(); }, 100);
    }

    private goToImprove(e: MouseEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent('item-selected', {
                bubbles: true,
                composed: true
            })
        );
        return;
    }

    private dispatchEventGlobalStyle(e: MouseEvent) {
        e.stopPropagation();

        const key = mls.stor.getKeyToFiles(mls.actualProject || 0, 2, 'project', '', '.ts');

        const f = mls.stor.files[key];
        if (!f) return;
        mls.actual[2].left = f;
        mls.actual[2].setFullName(`_${mls.actualProject}_project`);
        openService('_100554_serviceSource', 'left', 2);
    }

    private editEl(e: MouseEvent, item: IInfoElChildren) {
        e.stopPropagation();
        const fileInfo = convertTagToFileName(item.tagName.toLowerCase());
        if (!fileInfo) return;
        const { folder, project, shortName } = fileInfo;
        mls.actual[3].setFullName(folder ? `_${project}_${folder}/${shortName}` : `_${project}_${shortName}`);
        selectLevel(3);
        setTimeout(() => { openService('_100554_serviceOrganism', 'left', 3, { "tab": "navigation" }); }, 500)
    }


    private onMouseover(item: IInfoElChildren) {

        if (!this.elPreviewL4 || !this.elPreviewL4.setHover || !this.elPreviewL4.isConnected) this.setElPreview();

        if (!this.elPreviewL4 || !this.elPreviewL4.setHover || !item.el) return;

        this.elPreviewL4.setHover(item.id, true);
    }

    private onMouseout(item: IInfoElChildren) {
        if (!this.elPreviewL4 || !this.elPreviewL4.setHover || !this.elPreviewL4.isConnected) this.setElPreview();

        if (!this.elPreviewL4 || !this.elPreviewL4.setHover || !item.el) return;

        this.elPreviewL4.setHover(item.id, false);
    };

    private setElPreview() {
        const scope = window.preview?.iframe?.contentDocument?.body;
        if (!scope) return;
        this.elPreviewL4 = scope.querySelector('collab-preview-l4-100554') as CollabPreviewL4;
    }

    private slugToTitle(slug: string): string {
        return slug
            .replace(/^.*--/, "")
            .replace(/-\d+$/, "")
            .replace(/-/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    private dragItem?: IInfoElChildren;
    private dragParentArray?: IInfoElChildren[];
    private dropPosition: 'before' | 'after' | 'inside' | 'invalid' = 'after';
    private dragOverTarget?: HTMLElement;

    private onDragStart(e: DragEvent, item: IInfoElChildren, parentArray: IInfoElChildren[]) {
        e.stopPropagation();
        this.dragItem = item;
        this.dragParentArray = parentArray;
        e.dataTransfer!.effectAllowed = 'move';
        e.dataTransfer!.setDragImage(new Image(), 0, 0);
    }

    private onTouchStart(e: TouchEvent, item: IInfoElChildren, parentArray: IInfoElChildren[]) {
        e.stopPropagation();
        this.dragItem = item;
        this.dragParentArray = parentArray;
    }

    private onTouchEnd(e: TouchEvent) {
        e.preventDefault();

        if (!this.dragItem || !this.dragParentArray || !this.dragOverTarget) {
            this.onDragEnd();
            return;
        }

        // Recupera o alvo do último onTouchMove
        const info: IInfoElChildren | undefined = (this.dragOverTarget.querySelector(".header") as any)?.info;
        if (!info) {
            this.onDragEnd();
            return;
        }

        const parentArray = this.findParentArray(info, this.nodes);
        if (!parentArray) {
            this.onDragEnd();
            return;
        }

        const fakeEvent = {
            preventDefault() { },
            stopPropagation() { }
        } as unknown as DragEvent;

        this.onDrop(fakeEvent, info, parentArray);

        this.onDragEnd(); // limpa bordas e estado
    }

    private findParentArray(target: IInfoElChildren, array: IInfoElChildren[]): IInfoElChildren[] | null {
        for (const item of array) {
            if (item === target) return array;
            const found = this.findParentArray(target, item.children);
            if (found) return found;
        }
        return null;
    }

    private onTouchMove(e: TouchEvent) {
        e.preventDefault();
        if (!this.dragItem) return;

        const touch = e.touches[0];
        const elemUnderFinger = document.elementFromPoint(touch.clientX, touch.clientY);

        if (!elemUnderFinger) return;

        const liTarget = elemUnderFinger.closest("li.nav-item") as HTMLElement | null;
        if (!liTarget) return;

        const info: IInfoElChildren | undefined = (liTarget.querySelector(".header") as any)?.info;
        if (!info) return;

        const rect = liTarget.getBoundingClientRect();
        const y = touch.clientY - rect.top;

        const third = rect.height / 3;
        let position: 'before' | 'after' | 'inside' | 'invalid';

        if (y < third) position = 'before';
        else if (y > rect.height - third) position = 'after';
        else position = 'inside';

        if (position === 'inside' && info.isOrganism) {
            position = 'after';
        }

        if (this.isDescendant(this.dragItem, info)) {
            position = 'invalid';
        }

        this.dropPosition = position;
        this.dragOverTarget = liTarget;

        const borderTarget = liTarget.querySelector('.header') as HTMLElement;
        if (!borderTarget) return;
        borderTarget.style.borderTop = '';
        borderTarget.style.borderBottom = '';
        borderTarget.style.border = '';

        liTarget.style.cursor = 'grab';

        if (position === 'before') {
            borderTarget.style.borderTop = '1px solid blue';
        } else if (position === 'after') {
            borderTarget.style.borderBottom = '1px solid blue';
        } else if (position === 'inside') {
            borderTarget.style.border = '1px solid blue';
        } else if (position === 'invalid') {
            borderTarget.style.border = '1px solid red';
            liTarget.style.cursor = 'not-allowed';
        }

    }

    private onDragOver(e: DragEvent, targetItem: IInfoElChildren) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer!.dropEffect = 'move';

        const liTarget = e.currentTarget as HTMLElement;
        const rect = liTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        this.configOverEvent(liTarget, targetItem, y);

    }

    private configOverEvent(liTarget: HTMLElement, targetItem: IInfoElChildren, y: number, e?: DragEvent) {

        const rect = liTarget.getBoundingClientRect();

        const third = rect.height / 3;
        let position: 'before' | 'after' | 'inside' | 'invalid';

        if (y < third) position = 'before';
        else if (y > rect.height - third) position = 'after';
        else position = 'inside';

        if (position === 'inside' && targetItem.isOrganism) {
            position = 'after';
        }

        if (this.isDescendant(this.dragItem, targetItem)) {
            position = 'invalid';
        }

        this.dropPosition = position;
        this.dragOverTarget = liTarget;
        const borderTarget = liTarget.querySelector('.header') as HTMLElement;
        if (!borderTarget) return;
        borderTarget.style.borderTop = '';
        borderTarget.style.borderBottom = '';
        borderTarget.style.border = '';

        liTarget.style.cursor = 'grab';

        if (position === 'before') {
            borderTarget.style.borderTop = '1px solid blue';
        } else if (position === 'after') {
            borderTarget.style.borderBottom = '1px solid blue';
        } else if (position === 'inside') {
            borderTarget.style.border = '1px solid blue';
        } else if (position === 'invalid') {
            borderTarget.style.border = '1px solid red';
            if (e) e.dataTransfer!.dropEffect = 'none';
            liTarget.style.cursor = 'not-allowed';
        }
    }


    private onDragLeave(e: DragEvent) {
        const liTarget = e.currentTarget as HTMLElement;
        const borderTarget = liTarget.querySelector('.header') as HTMLElement;
        if (!borderTarget) return;
        borderTarget.style.borderTop = '';
        borderTarget.style.borderBottom = '';
        borderTarget.style.border = '';
    }
    private onDrop(e: DragEvent, targetItem: IInfoElChildren, parentArray: IInfoElChildren[]) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.dragItem || !this.dragParentArray || !this.domNavigator) return;
        if (this.dragItem === targetItem || this.isDescendant(this.dragItem, targetItem)) {
            console.warn('Não é permitido mover um pai para dentro do filho');
            this.onDragEnd();
            return;
        }

        const fromIndex = this.dragParentArray.indexOf(this.dragItem);
        if (fromIndex > -1) {
            this.dragParentArray.splice(fromIndex, 1);
        }

        const domDragEl = this.dragItem.elDomNavigator;
        const domTargetEl = targetItem.elDomNavigator;

        if (this.dropPosition === 'inside') {
            targetItem.children.push(this.dragItem);

            if (domDragEl && domTargetEl) {
                domTargetEl.appendChild(domDragEl);
            }
        } else {
            let toIndex = parentArray.indexOf(targetItem);
            if (this.dropPosition === 'after') {
                toIndex++;
            }
            parentArray.splice(toIndex, 0, this.dragItem);

            if (domDragEl && domTargetEl && domDragEl !== domTargetEl) {
                const parentDom = domTargetEl.parentElement;
                if (parentDom) {
                    if (this.dropPosition === 'before') {
                        parentDom.insertBefore(domDragEl, domTargetEl);
                    } else {
                        parentDom.insertBefore(domDragEl, domTargetEl.nextSibling);
                    }
                }
            }
        }

        this.prepareHTMLAndSync();
        this.onDragEnd();
    }

    private onDragEnd() {
        this.dragItem = undefined;
        this.dragParentArray = undefined;
        this.dragOverTarget = undefined;
        this.querySelectorAll('li >.header').forEach(el => {
            (el as HTMLElement).style.borderTop = '';
            (el as HTMLElement).style.borderBottom = '';
            (el as HTMLElement).style.border = '';
        });
    }

    private isDescendant(parent: IInfoElChildren | undefined, child: IInfoElChildren): boolean {
        if (!parent) return false;
        if (!parent.children || parent.children.length === 0) return false;
        for (const c of parent.children) {
            if (c === child) return true;
            if (this.isDescendant(c, child)) return true;
        }
        return false;
    }

    private prepareHTMLAndSync() {

        this.requestUpdate();
        const rootEl = this.domNavigator;
        if (!rootEl) return;
        const newHtml = formatHtml(rootEl.outerHTML);
        const actualInfo = this.getActualFileL4();

        if (actualInfo && actualInfo.models && actualInfo.models.html) {
            actualInfo.models.html.model.setValue(newHtml);
            setValueInModeKeepingUndo(actualInfo.models && actualInfo.models.html.model, newHtml);
            mls.events.fireFileAction('editorChanged', actualInfo.models.html.storFile, 'left', 0);
        }

    }

    private goToL2(e: MouseEvent, item: IInfoElChildren) {
        if (!item.el) return;
        const fileInfo = mls.l2.getPath(mls.actual[4].getFullName());
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

interface IInfoElChildren {
    el: HTMLElement | null,
    elDomNavigator: HTMLElement | null,
    id: string,
    isOrganism: boolean,
    tagName: string,
    children: IInfoElChildren[]
}