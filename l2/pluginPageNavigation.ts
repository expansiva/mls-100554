/// <mls shortName="pluginPageNavigation" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { collab_trash, collab_pencil, collab_bars } from './_100554_collabIcons';
import { convertTagToFileName, convertFileNameToTag } from './_100554_utilsLit';
import { selectLevel, openService } from './_100554_libCommom';
import { formatHtml, setValueInModeKeepingUndo } from './_100554_collabDOMSync';

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

    @state() nodes: IInfoElChildren[] = [];

    constructor() {
        super();
        this.setEvents();
    }

    private domNavigator?: HTMLElement;

    private setEvents(): void {
        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected'], (ev) => this.onlevelChange(ev));
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

        const cls = item.elDomNavigator?.id === this.activeId || item.elDomNavigator?.hasAttribute('clb_mode') ? 'activeBranch' : '';
        let mySymbol = 'fa-cubes';

        return html`
        <li 
            class="nav-item"
            draggable="true"
            @dragstart=${(e: DragEvent) => this.onDragStart(e, item, parentArray)}
            @dragover=${(e: DragEvent) => this.onDragOver(e, item)}
            @dragleave=${(e: DragEvent) => this.onDragLeave(e)}
            @drop=${(e: DragEvent) => this.onDrop(e, item, parentArray)}
            @dragend=${() => this.onDragEnd()}
        >
            <div 
                .info=${item}
                id="${item.tagName + idx}"                      
                class="header ${cls}" 
                @click="${(e: MouseEvent) => this.selectItem(e, item)}" 
                @mouseover="${() => this.onMouseover(item)}"
                @mouseleave="${() => this.onMouseout(item)}"   
            >
                <span class="move-icon" title="Mover">
                    ${collab_bars}
                </span>
                <info-item .info=${item}>
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
                    ((c: IInfoElChildren, idx: number) => c.tagName + idx) as any,
                    ((i: IInfoElChildren, idxI: number) => this.renderItemTree(i, idx + '_' + idxI, item.children)) as any
                )}
            </ul>
        </li>
    `;
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
        this.unhighlightElement();
        setTimeout(() => {
            this.highlightElement(item);
        }, 100)
        this.fireSelectEdit(item.id);

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
        openService('_100554_serviceOrganism', 'left', 3);
    }


    private onMouseover(item: IInfoElChildren) {

        setTimeout(() => {
            this.highlightElement(item);
        }, 50);
    }

    private onMouseout(item: IInfoElChildren) {
        this.unhighlightElement();
    };

    private elOverlay: HTMLElement | undefined;
    private createOverlay() {
        const div = document.createElement("collab-aux-overlay");
        div.style.outlineOffset = '-2px';
        div.style.position = 'absolute';
        div.style.backgroundColor = 'rgb(0 183 255 / 22%)';
        div.style.zIndex = '99999';
        const scope = window.preview?.iframe?.contentDocument?.body;
        if (!scope) return div;
        scope.appendChild(div);
        return div;
    }

    private highlightElement(item: IInfoElChildren) {
        if (!item.el) return;
        const scope = window.preview?.iframe?.contentDocument?.body;

        if (!this.elOverlay) this.elOverlay = this.createOverlay();
        if (!this.elOverlay.isConnected) {
            if (scope) scope.appendChild(this.elOverlay);
        }

        if (item.id && scope) {
            const elPreview = scope.querySelector(`#${item.id}`) as HTMLElement;
            if (!elPreview) return;
            item.el = elPreview;
        }

        const rect = item.el.getBoundingClientRect();
        this.elOverlay.style.display = 'block';
        this.elOverlay.style.top = `${rect.top + window.scrollY}px`;
        this.elOverlay.style.left = `${rect.left + window.scrollX}px`;
        this.elOverlay.style.width = `${rect.width}px`;
        this.elOverlay.style.height = `${rect.height}px`;

    }

    private unhighlightElement() {
        if (this.elOverlay) this.elOverlay.style.display = 'none';
    }

    private timeFireEventMode = 0;
    private fireEventMode(mode: 'edit' | 'noEdit') {
        clearTimeout(this.timeFireEventMode);
        this.timeFireEventMode = setTimeout(() => {
            const param = {
                'position': 'left',
                'action': mode === 'edit' ? 'modeEdit' : 'modePreview'
            }
            mls.events.fire(3, 'L3EditEvents' as any, JSON.stringify(param));
        }, 500);

    }

    private timeFireSelectEdit = 0;
    private fireSelectEdit(id: string) {
        clearTimeout(this.timeFireSelectEdit);
        this.timeFireSelectEdit = setTimeout(() => {
            const param = {
                'position': 'left',
                'action': 'select',
                'id': id,
            }
            mls.events.fire(3, 'L3EditEvents' as any, JSON.stringify(param));
        }, 500);

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
    private dropPosition: 'before' | 'after' | 'inside' = 'after';
    private dragOverTarget?: HTMLElement;

    private onDragStart(e: DragEvent, item: IInfoElChildren, parentArray: IInfoElChildren[]) {
        e.stopPropagation();
        this.dragItem = item;
        this.dragParentArray = parentArray;
        e.dataTransfer!.effectAllowed = 'move';
        e.dataTransfer!.setDragImage(new Image(), 0, 0);
    }

    private onDragOver(e: DragEvent, targetItem: IInfoElChildren) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer!.dropEffect = 'move';

        const liTarget = e.currentTarget as HTMLElement;
        const rect = liTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;

        const third = rect.height / 3;
        let position: 'before' | 'after' | 'inside';

        if (y < third) {
            position = 'before';
        } else if (y > rect.height - third) {
            position = 'after';
        } else {
            position = 'inside';
        }

        if (position === 'inside' && targetItem.isOrganism) {
            position = 'after';
        }

        this.dropPosition = position;
        this.dragOverTarget = liTarget;
        const borderTarget = liTarget.querySelector('.header') as HTMLElement;
        if (!borderTarget) return;
        borderTarget.style.borderTop = '';
        borderTarget.style.borderBottom = '';
        borderTarget.style.border = '';

        if (position === 'before') {
            borderTarget.style.borderTop = '1px solid blue';
        } else if (position === 'after') {
            borderTarget.style.borderBottom = '1px solid blue';
        } else if (position === 'inside') {
            borderTarget.style.border = '1px solid blue';
        }

        console.info(position)
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
        if (this.dragItem === targetItem) return;

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