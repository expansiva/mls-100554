/// <mls shortName="pluginExploreStories" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';
import { selectLevel, forceServiceInstance, openService } from '/_100554_/l2/libCommom.js';

/// **collab_i18n_start**
const message_pt = {
    draft: 'Rascunho',
    published: 'Publicados',
    noPragraph: "Nenhum paragrafo encontrado",
    editDraft: 'Editar rascunho',
    delDraft: 'Deletar rascunho'
}

const message_en = {
    draft: 'Draft',
    published: 'Published',
    noPragraph: "Didn't find any paragraphs",
    editDraft: 'Edit draft',
    delDraft: 'Delete draft'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const pluginData: mls.plugin.IPluginData = {
    title: "Stories",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
    `;
    }
};

export class PluginExploreStories extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    private project = 1;

    @property() position: 'left' | 'right' = 'left';

    @property() level: number = 0;

    @property({ type: Boolean }) autoPrepare: boolean = false;

    @property({ type: Array }) files: IItensFiles[] = [];

    @property() activeTab: ITabType = 'icDraft';

    async prepare() {
        this.init();
    }

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        if (!this.autoPrepare) return;
        this.prepare();
        forceServiceInstance(2, '_100554_serviceSource');

    }

    render() {
        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {
        switch (this.activeTab) {
            case 'icDraft':
                return this.renderDraft();
            case 'icPublished':
                return this.renderPublished();
            default:
                return html``;
        }
    }

    renderDraft() {
        return html`
                <ul>
                    ${this.renderList()}
                </ul>
        
            </div>
        `;
    }

    renderPublished() {
        return html``;
    }

    renderList() {

        return html`
            ${this.files.length <= 0 ? '' :
                html`
                    ${repeat(
                    this.files,
                    ((item: IItensFiles) => item.name) as any,
                    ((file: IItensFiles, index: any) => {

                        return this.renderLiItem(file, index, false)

                    }) as any
                )}
                `
            }
        `;
    }

    renderLiItem(file: IItensFiles, index: number, inHistory: boolean) {

        const aux = file.file.status === 'deleted' ? "text-decoration: line-through; color: #cf0707;" : '';
        return html`
            <li @click="${this.clickLi}" .myFile=${file.file} .nameFilter="${file.name}">
                <div class="elContent">
                    <h3 style="${aux}">${file.name}</h3>
                    <span>${file.desc}</span>
                    <menuitems @click="${this.clickMenu}" @mouseleave="${this.blurMenu}" @mouseover="${this.overMenu}">
                        <menuicon>
                            <svg xmlns='http://www.w3.org/2000/svg' style="fill:#8f8f8ffa"  viewBox='0 0 512 512'><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path  d='M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z'/></svg>
                        </menuicon>
                        <menubox>
                            <menuitem @click="${this.clickOptOpen}">${this.msg.editDraft}</menuitem>
                            <menuitem @click="${this.clickOptDel}">${this.msg.delDraft}</menuitem>
                        </menubox>
                    </menuitems>
                </div>
            </li>
        `;

    }

    private async init() {
        this.project = mls.actualProject as number;
        await this.getFiles();
    }

    private async getFiles() {
        try {
            const arraySf: IItensFiles[] = await this.getFilesProject();
            this.files = [...arraySf];
        } catch (e) {
            console.info(e);
        }
    }


    private async getFilesProject() {

        if (!window['mls']) return [];
        const arraySf: IItensFiles[] = [];
        const ext = '.html'

        for await (const i of Object.keys(mls.stor.files).sort()) {

            const sf = mls.stor.files[i];

            if (
                sf.project !== this.project || sf.shortName.toLocaleLowerCase().indexOf('page') < 0 ||
                sf.extension !== ext
            ) continue;

            const keyTS = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.ts');

            const fTS = mls.stor.files[keyTS];
            if (!fTS) continue;

            const content = await fTS.getContent() as string;

            if (content.indexOf('extends') < 0) continue;
            const start = content.indexOf('extends') + 'extends'.length;
            const end = content.substring(start, content.length).indexOf('{');
            const extendsPage = content.substr(start, end);
            if (extendsPage.toLocaleLowerCase().indexOf('page') < 0) continue;

            const div = document.createElement('div');
            div.innerHTML = await sf.getContent() as string;

            let name = div.querySelector('.story-title')?.getAttribute('text') || sf.shortName;

            let desc = div.querySelector('.story-desc')?.getAttribute('text') || this.msg.noPragraph;

            arraySf.push({
                desc,
                name,
                file: sf
            });

        }

        return arraySf;

    }

    private clickLi(e: MouseEvent) {
        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'li')
            el = el.closest('li') as HTMLElement;
        if (!el) return;
        openService('_100554_servicePreview', 'right', +this.level);
        this.fireEvents('open', (el as any).myFile, {});
    }

    private clickMenu(e: MouseEvent) {

        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'menuitems')
            el = el.closest('menuitems') as HTMLElement;
        if (!el) return;

        if (el.getAttribute('mode') === 'open') {
            el.setAttribute('mode', '');
        } else el.setAttribute('mode', 'open');

    }


    private timeBlur = 0;
    private blurMenu(e: MouseEvent) {

        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'menuitems')
            el = el.closest('menuitems') as HTMLElement;
        if (!el || !el.getAttribute('mode')) return;

        this.timeBlur = setTimeout(() => {
            el.setAttribute('mode', '');
        }, 800)


    }

    private overMenu(e: MouseEvent) {

        if (!this.timeBlur) return;
        clearTimeout(this.timeBlur);

    }

    private clickOptOpen(e: MouseEvent) {

        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'li')
            el = el.closest('li') as HTMLElement;
        if (!el) return;
        selectLevel(2);
        this.fireEvents('open', (el as any).myFile, {});

    }

    private clickOptDel(e: MouseEvent) {

        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'li')
            el = el.closest('li') as HTMLElement;
        if (!el) return;

        this.fireEvents('delete', (el as any).myFile, {});
        setTimeout(() => {
            this.requestUpdate();
        }, 800)

    }


    private fireEvents(action: string, file: mls.stor.IFileInfo, info: any, timeout: number = 0): void {

        const params = {} as mls.events.IFileAction;

        (params.action as any) = action;
        params.level = file.level;
        params.project = file.project;
        params.shortName = file.shortName;
        params.extension = '.ts';
        params.folder = file.folder;
        params.position = this.position;

        if (info && info.shortName) {
            params.newshortName = info.shortName;
            params.newProject = info.project;
            params.newfolder = file.folder;
        }

        if (['open'].includes(action)) {

            mls.actual[2].setFullName(`_${file.project}_${file.shortName}`);
            (mls.actual[2] as any)[this.position] = {
                project: file.project,
                shortName: file.shortName,
                extension: '.ts',
                folder: file.folder,
            } as any;

        }

        mls.events.fire([2], ['FileAction'], JSON.stringify(params), timeout);

    }

}

if (!customElements.get('plugin-explore-stories-100554')) {
    customElements.define('plugin-explore-stories-100554', PluginExploreStories);
}

type ITabType = 'icDraft' | 'icPublished';

interface IItensFiles {
    file: mls.stor.IFileInfo,
    name: string,
    desc: string,
}

