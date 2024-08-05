/// <mls shortName="serviceExploreStories" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

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

@customElement('service-explore-stories-100554')
export class ServiceExploreStories100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    private project = 1;

    @property()
    name: string = 'Somebody';

    @property({ type: Array }) files: IItensFiles[] = [];

    @property()
    activeTab: ITabType = 'icDraft';

    //----------CONFIG SERVICE------------------
    public details: IService = {
        icon: '&#xf15b',
        state: 'foreground',
        position: 'left',
        tooltip: 'Explore Stories',
        visible: true,
        widget: '_100554_serviceExploreStories',
        level: [5]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        this.activeTab = op as ITabType;
    }

    public menu: IMenu = {
        title: 'Explore Stories',
        actions: {
        },
        icons: {
            icDraft: this.msg.draft + ';f044',
            icPublished: this.msg.published + ';f1ea'
        },
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined,
        iconDefault: 'icDraft',
        onClickIcon: this.onClickIcon,
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    //----------COMPONENT------------------

    connectedCallback() {
        super.connectedCallback();
        this.init();

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
            <div class="scroll-custom">
                
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

        return html`
            <li  .myFile=${file.file} .nameFilter="${file.name}">
                <div class="elContent">
                    <h3>${file.name}</h3>
                    <span>${file.desc}</span>
                    <menuitems @click="${this.overMenu}" @mouseleave="${this.blurMenu}">
                        <menuicon></menuicon>
                        <menubox>
                            <menuitem>${this.msg.editDraft}</menuitem>
                            <menuitem>${this.msg.delDraft}</menuitem>
                        </menubox>
                    </menuitems>
                </div>
            </li>
        `;

    }

    //----------IMPLEMENTS------------------

    private async init() {

        this.project = mls.actual[5].project as number;
        this.showLoader(true);
        await this.getFiles();
        this.showLoader(false);

    }

    private setLoader = -1;
    private showLoader(loader: boolean): void {

        clearTimeout(this.setLoader);
        this.setLoader = setTimeout(() => {
            this.loading = loader;
        }, 200)


    }

    private async getFiles() {

        try {

            const arraySf: IItensFiles[] = await this.getFilesProject();
            this.files = [...arraySf];
            
        } catch (e) {

            console.info(e);

        }

    }

    private extensionLevel = {
        5: '.html'
    }

    private async getFilesProject() {

        if (!window['mls']) return [];
        const arraySf: IItensFiles[] = [];
        const ext = (this.extensionLevel as any)[this.level as any] as string;
    
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
            const end = content.substring(start,content.length).indexOf('{') ;
            const extendsPage = content.substr(start, end);
            if (extendsPage.toLocaleLowerCase().indexOf('page') < 0) continue;

            const div = document.createElement('div');
            div.innerHTML = await sf.getContent() as string;

            let name = div.querySelector('[type="h1"], [type="h2"], [type="h3"], [type="h4"], [type="h5"]')?.getAttribute('text') || sf.shortName;

            let desc = div.querySelector('[type="p"], [type="span"], [type="code"]')?.getAttribute('text') || this.msg.noPragraph;

            arraySf.push({
                desc,
                name,
                file:sf
            });

        }

        return arraySf;

    }

    private overMenu(e:MouseEvent) {

        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'menuitems')
            el = el.closest('menuitems') as HTMLElement;
        if (!el) return;

        el.setAttribute('mode', 'open');

    }

    private blurMenu(e:MouseEvent) {

        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'menuitems')
            el = el.closest('menuitems') as HTMLElement;
        if (!el) return;

        el.setAttribute('mode', '');

    }

}

type ITabType = 'icDraft' | 'icPublished';

interface IItensFiles{
    file: mls.stor.IFileInfo,
    name: string,
    desc: string,
}
