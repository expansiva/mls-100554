/// <mls shortName="wcdAddWidgetDialog" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { WCDOverlayMethods, IListWidgetBase } from '/_100554_/l2/wcdTypes.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js'
import { globalWcd } from '/_100554_/l2/wcdState.js';
import { executeFromTag, getOverlay } from '/_100554_/l2/wcdCommandAdd.js';
import { convertFileNameToTag } from '/_100554_/l2/utilsLit.js';
import { getGroups } from '/_100554_/l2/icaBaseDescription.js';
import { loadPluginProject } from '/_100554_/l2/libCommom.js';


/// **collab_i18n_start**
const message_pt = {
    add: 'Adicionar',
    placeholder: 'digite palavras chaves para buscar o widget, e pressione Enter',
    suggestion: 'Sugestões'
}

const message_en = {
    add: 'Add',
    placeholder: 'type keywords to search widget, and press Enter',
    suggestion: 'Suggestion'
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('wcd-add-widget-dialog-100554')
export class WcdAddWidgetDialog100554 extends CollabLitElement {

    private msg: MessageType = messages['en'];
    private lastIca: HTMLElement | undefined;
    private lastHeight: string | undefined;
    private allWidgets: IWidgets[] = [];

    @query('#prompt-input') prompt: HTMLInputElement | undefined;

    @property() error: string = '';
    @property() listWidgets: IWidgets[] = [];

    private rootBread: string = 'root';
    @property({ type: Array }) actualBreadCrumb: string[] = [];
    @property({ type: String }) actualMode: IActualModeGroup = 'root';

    //-------COMPONENT----------

    disconnectedCallback() {
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (globalWcd.elICA) globalWcd.elICA.style.height = this.lastHeight || '';
        else if (this.lastIca) this.lastIca.style.height = this.lastHeight || '';
        super.disconnectedCallback();
    }

    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
        if (this.prompt) this.prompt.focus();
        this.getWidgets();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('listWidgets')) {
            this.recalculeIcaHeight();
        }
    }

    render() {

        this.lastIca = globalWcd.elICA;
        if (!this.lastHeight) this.lastHeight = globalWcd.elICA?.style.height;
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (this.error) return this.renderError();

        return this.renderWidgets();
    }

    renderHeader() {
        return html`
        <div class="prompt-content">
            <input type="text" id="prompt-input" @keydown=${this.handleKeyDown.bind(this)}  placeholder=${this.msg.placeholder}/>
        </div>
        `
    }

    renderError() {
        return html`
            ${this.renderHeader()}
            <h3>${this.error}</h3>
        
        `
    }

    renderWidgets() {
        return html`
            ${this.renderHeader()}
            ${this.renderBreadCrumb()}
            <gallery>
                ${repeat(this.listWidgets, ((key: IWidgets) => key.nome) as any, ((k: IWidgets, index: any) => { return this.renderItemGallery(k, index); }) as any)}
            </gallery>
            ${this.renderGroups()}
        
        `
    }

    renderItemGallery(item: IWidgets, idx: number) {

        return html`
            <gallery-item @click="${this.add}" .info=${item} title="${item.nome}">
                ${unsafeHTML(item.svg)}
                <span>${item.nome}</span>
            </gallery-item>
        `;

    }

    private renderGroups() {

        switch (this.actualMode) {
            case 'root':
                return this.renderGroupsRoot();
            case 'subgroup':
                return this.renderSubGroups();
            case 'finalgroup':
                return this.renderFinalGruops();
            default:
                return html``;
        }
    }

    private renderGroupsRoot() {
        const groups = getGroups();

        return html`
        <div class="group-container">

            ${repeat(Object.keys(groups), ((key: string) => 'gp_' + key) as any,
            ((k: string, index: any) => {
                return html`
                    <div class="group-item" @click=${() => { this.onClickRootGroup(k) }}>
                        <span class="group-title">${k}</span>
                    </div>`
            }) as any)}
                
        </div>
        `
    }

    private renderSubGroups() {

        const [, rootSelected] = this.actualBreadCrumb;
        const groups = getGroups();

        return html`
        <div class="group-container">
            ${Object.keys(groups[rootSelected]).map((subGroup) => {
            return html`
            <div class="group-item" @click=${() => { this.onClickSubGroup(rootSelected, subGroup) }}>
                <span class="group-title">${subGroup}</span>
                
            </div>
        `
        })}
        </div>
        `
    }

    private renderFinalGruops() {
        const [, rootSelected, subGroupSelected] = this.actualBreadCrumb;
        const groups = getGroups();

        return html`
        <div class="group-container">
            ${groups[rootSelected][subGroupSelected].map((finalGroup) => {

            return html`
                <div class="group-item" @click=${() => { this.onClickFinalGroup(rootSelected, subGroupSelected, finalGroup) }}>
                    <span class="group-title">${finalGroup}</span>
                    
                </div>
            `
        })}
        </div>
        `
    }

    private renderBreadCrumb() {
        if (this.actualBreadCrumb.length === 0) return html``;
        return html`
            <div class="breadcrumb">
                ${this.actualBreadCrumb.map((breadItem, index) => {

            const isLast = index === this.actualBreadCrumb.length - 1;
            return html`
            ${isLast
                    ? html`
                    <span @click=${(e: MouseEvent) => this.onBreadClick(breadItem, e)}>
                        ${breadItem}${!isLast ? ' > ' : ''}
                    </span>`
                    : html`
                    <a href="#" @click=${(e: MouseEvent) => this.onBreadClick(breadItem, e)}>
                        ${breadItem}${!isLast ? ' > ' : ''}
                    </a>`
                }
            `
        })}
            </div>
        `
    }




    //------IMPLEMENTS----------

    private onBreadClick(breadItem: string, e: MouseEvent) {
        e.preventDefault();
        const index = this.actualBreadCrumb.findIndex((item) => item === breadItem);
        if (index < 0) throw new Error('Invalid breadcrumb item');
        this.actualBreadCrumb = this.actualBreadCrumb.slice(0, index + 1);
        if (index === 0) {
            this.actualMode = 'root';
            this.listWidgets = this.allWidgets.filter((i) => i.priority === 0);
            if (this.listWidgets.length === 0) {
                this.listWidgets = this.allWidgets.filter((i) => i.priority === 1);
            }
        }
        if (index === 1) this.actualMode = 'subgroup';
        if (index === 2) this.actualMode = 'finalgroup';
        this.requestUpdate();
    }

    private onClickRootGroup(rootGroup: string) {
        this.actualBreadCrumb = [this.rootBread, rootGroup];
        this.actualMode = 'subgroup';
        this.listWidgets = this.allWidgets.filter((i) => i.cat.indexOf(this.actualBreadCrumb.join('').replace('root', '')) >= 0);
        this.requestUpdate();
    }

    private onClickSubGroup(rootGroup: string, subGroup: string) {
        this.actualBreadCrumb = [this.rootBread, rootGroup, subGroup];
        this.actualMode = 'finalgroup';
        this.listWidgets = this.allWidgets.filter((i) => i.cat.indexOf(this.actualBreadCrumb.join('').replace('root', '')) >= 0);
        this.requestUpdate();
    }

    private onClickFinalGroup(rootGroup: string, subGroup: string, finalGroup: string) {
        this.actualBreadCrumb = [rootGroup, subGroup, finalGroup];
        this.actualMode = 'empty';
        this.listWidgets = this.allWidgets.filter((i) => i.tagBase.indexOf(this.actualBreadCrumb.join('-')) >= 0);
        this.requestUpdate();
    }


    private async handleKeyDown(event: KeyboardEvent) {
        event.stopPropagation();
        if (event.key === 'Enter') {
            this.filter(this.prompt?.value);
        }
    }

    private filter(filter: string = '') {

        const f = this.allWidgets.filter((f) => {
            if (filter === '') return f.priority === 0;
            return f.nome.toLowerCase().indexOf(filter) >= 0
        });
        this.listWidgets = f;

    }

    private async add(e: MouseEvent) {

        let el = e.target as HTMLElement;
        if (el.tagName !== 'gallery-item') {
            el = el.closest('gallery-item') as HTMLElement;
        }

        if (!el || !(el as any).info) return;
        const info = (el as any).info as IWidgets;

        if (!info) return;

        await executeFromTag(info.tagBase, info.tagMain);

    }

    private recalculeIcaHeight() {
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (!globalWcd.elICA) throw new Error('Invalid window.wcdState.elICA');
        const height = this.getBoundingClientRect()?.height;
        if (this.lastHeight === undefined) this.lastHeight = (globalWcd.elICA as any).style.height;
        (globalWcd.elICA as any).style.height = height + 'px';
    }

    private async getWidgets() {

        const elOverlay = getOverlay();
        if (!elOverlay) return;

        const project = mls.actualProject;
        if (!project) return;

        const listIndex = await loadPluginProject(project, 'l3AddWidget', false);

        const list = elOverlay.listWidgetsBase;

        this.allWidgets = await this.configList(listIndex, list);

        if (list.length > 0) {
            this.listWidgets = this.allWidgets.filter((i) => i.priority === 0);
        } else {
            this.listWidgets = this.allWidgets.filter((i) => i.priority <= 1);
        }

    }

    private async configList(allWidgets: mls.plugin.MenuAction[], list: IListWidgetBase[]): Promise<IWidgets[]> {

        const ret: IWidgets[] = [];
        for await (const item of allWidgets) {

            const i = await this.configListItem(item);
            if (i) ret.push(i);

        }

        for (const item of list) {

            ret.forEach((i) => {

                if (i.widget === item.name) {
                    i.priority = 0;
                }
            })

        }

        return ret;

    }

    private async configListItem(item: mls.plugin.MenuAction): Promise<IWidgets | undefined> {

        try {

            mls.actual[0].setFullName(item.widget);

            const moduleClass = await import('/' + item.widget);
            const [cls] = Object.keys(moduleClass);
            let extendName = Object.getPrototypeOf((moduleClass)[cls]).name as string;
            if (extendName.endsWith('Base')) extendName = extendName.replace('Base', '');

            if (!extendName) return;

            const tag = convertFileNameToTag({ project: 100554, shortName: extendName });
            const pathInfoWidget = mls.l2.getPath(item.widget)
            const tagW = convertFileNameToTag({ project: pathInfoWidget.project, shortName: pathInfoWidget.shortName, folder: pathInfoWidget.folder });

            const i = {
                nome: mls.actual[0].path,
                cat: extendName,
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M290.8 48.6l78.4 29.7L288 109.5 206.8 78.3l78.4-29.7c1.8-.7 3.8-.7 5.7 0zM136 92.5l0 112.2c-1.3 .4-2.6 .8-3.9 1.3l-96 36.4C14.4 250.6 0 271.5 0 294.7L0 413.9c0 22.2 13.1 42.3 33.5 51.3l96 42.2c14.4 6.3 30.7 6.3 45.1 0L288 457.5l113.5 49.9c14.4 6.3 30.7 6.3 45.1 0l96-42.2c20.3-8.9 33.5-29.1 33.5-51.3l0-119.1c0-23.3-14.4-44.1-36.1-52.4l-96-36.4c-1.3-.5-2.6-.9-3.9-1.3l0-112.2c0-23.3-14.4-44.1-36.1-52.4l-96-36.4c-12.8-4.8-26.9-4.8-39.7 0l-96 36.4C150.4 48.4 136 69.3 136 92.5zM392 210.6l-82.4 31.2 0-89.2L392 121l0 89.6zM154.8 250.9l78.4 29.7L152 311.7 70.8 280.6l78.4-29.7c1.8-.7 3.8-.7 5.7 0zm18.8 204.4l0-100.5L256 323.2l0 95.9-82.4 36.2zM421.2 250.9c1.8-.7 3.8-.7 5.7 0l78.4 29.7L424 311.7l-81.2-31.1 78.4-29.7zM523.2 421.2l-77.6 34.1 0-100.5L528 323.2l0 90.7c0 3.2-1.9 6-4.8 7.3z"/></svg>`,
                tagBase: tag,
                tagMain: tagW,
                priority: item.priority,
                widget: item.widget
            } as IWidgets;

            return i;

        } catch (e) {

            console.info(e);
            return;

        }

    }

    private extractAttr(file: string, src: string): { shortName: string, project: string, enhancement: string, groupName: string } {

        const firstLine = src.split('\n')[0].trim();


        const rgx = /^\/\/\/\s*<mls\s([^>]+)\/>/;
        const match = firstLine.match(rgx);

        if (!match) {
            throw new Error('File dont have <mls>: ' + file);
        }


        const attrs: any = {};
        const rgxAttr = /(\w+)="([^"]+)"/g;
        let attMatch;
        while ((attMatch = rgxAttr.exec(match[1])) !== null) {
            const key = attMatch[1];
            const value = attMatch[2];
            attrs[key] = value;
        }

        return attrs;

    }

}

type IActualModeGroup = 'root' | 'subgroup' | 'finalgroup' | 'empty'

interface IWidgets {
    nome: string,
    cat: string,
    svg: string,
    tagBase: string,
    tagMain: string,
    priority: number,
    widget: string,
}