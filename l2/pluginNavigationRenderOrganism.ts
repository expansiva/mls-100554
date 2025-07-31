/// <mls shortName="pluginNavigationRenderOrganism" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';

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

@customElement('plugin-navigation-render-organism-100554')
export class PluginNavigationRenderOrganism extends PluginBaseModule {

    private msg: MessageType = messages['en'];
    private atributeBase = 'id';

    constructor() {
        super();
        this.setEvents();
    }

    private setEvents(): void {
        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected'], (ev) => this.onlevelChange(ev));

        mls.events.addListener(3, 'L3EditEvents' as any, this.onL3EditEvents.bind(this));

    }

    private onL3EditEvents(ev: mls.events.IEvent) {

        if (!ev.desc ||  ev.level !== 3) return;

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
        this.activeId = info.id;
    }

    private onNavigation(info: any) {
        console.info('foi')
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

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        const ar = this.getComponents();
        this.fireEventMode('edit');
        if (ar && ar.length > 0) return this.createNavigation(ar);
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

    renderItemTree(item: IInfoElChildren, idx: string) {

        const cls = item.el.id === this.activeId || item.el.hasAttribute('clb_mode') ? 'activeBranch' : '';

        let mySymbol = 'fa-cubes'
        if ((item.el as any).mySymbol) mySymbol = (item.el as any).mySymbol;

        return html`
            <li>
                <div 
                    .info=${item}
                    id="${item.el.tagName.toLocaleLowerCase() + idx}"                      
                    class="header ${cls}" 
                    @click="${(e: MouseEvent) => this.selectItem(e, item)}"    
                >
                    <info-item .info=${item}>
                        <span class="fa ${mySymbol}" style="margin-right:.5rem"></span>
                        ${item.el.tagName.toLocaleLowerCase()}<small>(${item.el.id})</small>
                    </info-item>
                    <div class="groupHiddenList" .info=${item}  @click="${this.clickGroupHidden}" >
                        <span class="mls-gpbtnslider-item fa fa-trash" @click="${this.delEl}" title="remove"></span>
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

        this.requestUpdate();

    }

    private getComponents(): IInfoElChildren[] {
        const lessTags = ['script', 'style', 'body', 'head', 'html'];
        let ret: IInfoElChildren[] = [];
        const scope = window.preview?.iframe?.contentDocument?.body;
        if (!scope) return ret;

        const reentrance = (array: IInfoElChildren[], element: HTMLElement) => {

            let info: IInfoElChildren | undefined;
            if (element.getAttribute(this.atributeBase) && !lessTags.includes(element.tagName.toLocaleLowerCase())) {
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

        this.fireSelectEdit(item.id);

    }

    private clickGroupHidden(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        el.classList.toggle('activegpbtnslider');

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
    private fireSelectEdit(id:string) {
        clearTimeout(this.timeFireSelectEdit);
        this.timeFireSelectEdit = setTimeout(() => {
            const param = {
                'position': 'left',
                'action': 'select',
                'id':id,
            }
            mls.events.fire(3, 'L3EditEvents' as any, JSON.stringify(param));
        }, 500);

    }

}

interface IInfoElChildren {
    el: HTMLElement,
    id: string,
    children: IInfoElChildren[]
}