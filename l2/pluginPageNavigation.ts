/// <mls shortName="pluginPageNavigation" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { collab_trash, collab_pencil, collab_bars } from './_100554_collabIcons';
import { convertTagToFileName, convertFileNameToTag } from './_100554_utilsLit';
import { selectLevel, openService } from './_100554_libCommom';
import { formatHtml, setValueInModeKeepingUndo } from './_100554_collabDOMSync';
import { CollabPreviewL4 } from './_100554_collabPreviewL4';

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
            return html`
                <div 
                    .info=${item}
                    id="${item.tagName + idx}"                      
                    class="header ${cls}" 
                    @dblclick="${(e: MouseEvent) => this.editEl(e, item)}"
                    @click="${(e: MouseEvent) => this.selectItem(e, item)}"  
                    @mouseover="${() => this.onMouseover(item)}"
                    @mouseout="${() => this.onMouseout(item)}"   
                >
                    
                    <info-item .info=${item}>
                        <span class="move-icon" title="Mover">
                            ${collab_bars}
                        </span>
                        <span class="fa ${mySymbol}" style="margin-right:.5rem"></span>
                        ${this.slugToTitle(item.tagName)}
                    </info-item>

                    <div class="groupHiddenList" .info=${item}  @click="${this.clickGroupHidden}">
                        ${item.isOrganism ? html`
                            <span 
                                class="mls-gpbtnslider-item"
                                @click="${(e: MouseEvent) => this.editEl(e, item)}" 
                                title="edit"
                            >
                            ${collab_pencil}</span>
                        
                        `
                    : ''}
                    
                        <span
                            class="mls-gpbtnslider-item"
                            @click="${this.delEl}" 
                            title="remove"
                        >${collab_trash}</span>
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
                    @touchend=${(e: TouchEvent) => this.onTouchEnd(e, item, parentArray)}
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

    private getActualFileL4() {
        const { folder, project, shortName } = mls.l2.getPath(`_${mls.actual[4].project}_${mls.actual[4].path}`);

        if (!project || !shortName) return undefined;

        const keyStorFile = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.html');
        const keyModels = mls.editor.getKeyModel(project, shortName, folder);

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
        el.classList.toggle('activegpbtnslider');
    }

    private delEl(e: MouseEvent) {
        e.stopPropagation();
        //setTimeout(() => { this.requestUpdate(); }, 100);
    }

    private editEl(e: MouseEvent, item: IInfoElChildren) {
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
        this.dragItem = item;
        this.dragParentArray = parentArray;
    }

    private onTouchEnd(e: TouchEvent, targetItem: IInfoElChildren, parentArray: IInfoElChildren[]) {

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

    private onTouchMove(e: TouchEvent) {
        e.preventDefault();
        const touch = e.touches[0];
        const elemUnderFinger = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!elemUnderFinger) return;
        const target = elemUnderFinger.closest('li.nav-item') as any;
        if (!target) return;
        const item = target.item;

        const rect = target.getBoundingClientRect();
        const y = touch.clientY - rect.top;
        this.configOverEvent(target, item, y);

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
            if(e) e.dataTransfer!.dropEffect = 'none';
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

}

interface IInfoElChildren {
    el: HTMLElement | null,
    elDomNavigator: HTMLElement | null,
    id: string,
    isOrganism: boolean,
    tagName: string,
    children: IInfoElChildren[]
}