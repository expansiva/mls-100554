/// <mls shortName="pluginGithubL4Project" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult, LitElement, repeat } from 'lit';
import { query, property, customElement } from 'lit/decorators.js';
import { getMyKeysBranch } from './_100554_libCommom';
import * as gitIO from './_100554_libGithubIo';

export const pluginData: mls.plugin.IPluginData = {
    title: "GitHub Projects",
    getSvg(): TemplateResult {
        return svg`
        <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>        
    `;
    }
};

@customElement('plugin-github-l4-project-100554')
export class PluginGithubL4Project extends LitElement {

    private error: string = '';
    private userInfo: gitIO.IInfo | undefined;
    private req: gitIO.IReq | undefined;

    private myProjcts: gitIO.IProject[] = [];
    private viewProject: gitIO.IProject | undefined;
    private itensShow: gitIO.IItemProject[] | undefined;

    @property() scenary: string = 'list';

    @query('contentstatus') contentstatus: HTMLElement | undefined;

    get mKey(): string {

        const _mKey = localStorage.getItem('keyGitHub');
        if (!_mKey) throw new Error('Please configure your key git hub');
        return _mKey;

    }

    async prepare() {
        this.setInfos();
    }

    //----------COMPONENT--------------------

    firstUpdated() {
        this.setInfos();
    }

    render(): TemplateResult {

        if (this.error != '') return this.renderError();

        if (this.scenary === 'list') return this.renderList();

        if (this.scenary === 'showStatus') return this.renderShow();

        if (this.scenary === 'show') return this.renderShowCard();

        return html``;
    }

    renderError(): TemplateResult {

        return html`<h3 style="color:red">${this.error}</h3>`
    }

    //---LIST

    renderList(): TemplateResult {

        if (this.myProjcts.length <= 0) return html`<h3>No projects</h3>`;

        return html`
            ${this.renderListFilter()}
            <contentlistissues>
                ${repeat
                (this.myProjcts,
                    ((key: gitIO.IProject) => key.id) as any,
                    ((k: gitIO.IProject, index: any) => {

                        return this.renderListItem(k, index);

                    }) as any
                )}
            </contentlistissues>
        `
    }

    renderListFilter() {
        return html`
        <div style="display: flex; justify-content: center; margin-bottom: 2rem; align-items: center; gap: .5rem;">
            <div style="background:#fff;padding:.2rem;margin-bottom:1rem;margin-top:1rem; width:80%; border:1px solid #dfdfdf; border-radius:10px;display:flex;gap:.2rem">
                <input type="text" style="border:none;border-right:1px solid #dfdfdf;outline:none;height:25px; width:calc(100% - 30px)" placeholder="Filter issues ...">
                <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
            </div>
        </div>
        `
    }

    renderListItem(item: gitIO.IProject, idx: number) {

        return html`
        <contentlistitem @click="${this.clickItem}" .info=${item} filter="${item.title}">
            <div>
                <h3>${item.title}</h3>
            </div>
            <span>
                #${item.number} opened on ${new Date(item.createdAt).toLocaleString()} by ${item.author}
            </span>
        </contentlistitem>
        `
    }

    //-- SHOW TAB

    renderShow(): TemplateResult {

        if (!this.viewProject) return html`Not found project`;

        return html`
            <contentshow>
                ${this.renderHeader()}
                ${this.renderStatus()}
            </contentshow>
        `

    }

    renderHeader() {

        if (!this.viewProject) return html`Not found project`;

        return html`
        <contentheader>
            <div>
                <backbutton back="list" @click=${this.backButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/></svg>
                </backbutton>
                <h3>${this.viewProject.title}</h3>
            </div>
            <span>
                #${this.viewProject.number} opened on ${new Date(this.viewProject.createdAt).toLocaleString()} by ${this.viewProject.author}
            </span>
            <div style=" position: absolute; right: 5px; bottom: 0px; display: flex; gap: 1rem;">
                <viewtype show="show" @click="${this.clickChangeView}">
                    <svg style="width:15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96l0 32 576 0 0-32c0-35.3-28.7-64-64-64L64 32zM576 224L0 224 0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-192zM112 352l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"/></svg>
                </viewtype>
                <viewtype show="showStatus" @click="${this.clickChangeView}">
                    <svg style="width:15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 256l0-96 160 0 0 96L64 256zm0 64l160 0 0 96L64 416l0-96zm224 96l0-96 160 0 0 96-160 0zM448 256l-160 0 0-96 160 0 0 96zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z"/></svg>
                </viewtype>
            </div>
        </contentheader>
        `
    }

    renderStatus(): TemplateResult {

        if (!this.viewProject) return html`Not found project`;

        const item = this.viewProject.fields.find((i) => i.dataType === 'select');

        if (!item || item.options.length <= 0) return html``;

        if (this.itensShow && this.itensShow.length > 0) {
            setTimeout(() => {
                this.addValues();
            }, 500);
        }

        return html`
        <contentstatus>
            <contentstatusitem>
                <h4>
                    No Status
                </h4>
                <contentst id="stnostatus">
                </contentst>
            </contentstatusitem>
            ${repeat
                (item.options,
                    ((key: any) => key.id) as any,
                    ((k: any, index: any) => {

                        return html`
                        <contentstatusitem>
                            <h4>
                                ${k.name}
                            </h4>
                            <contentst id="st${k.id}">
                            </contentst>
                        </contentstatusitem>
                    `

                    }) as any
                )}
        </contentstatus>
        `
    }

    //-- SHOW CARD

    renderShowCard(): TemplateResult {

        if (!this.viewProject || !this.itensShow) return html`Not found project`;

        return html`
            ${this.renderHeader()}
            <contentshowCard>
                ${repeat
                (this.itensShow,
                    ((key: gitIO.IItemProject) => key.id) as any,
                    ((k: gitIO.IItemProject, index: any) => {

                        return this.renderShowCardItem(k);

                    }) as any
                )}
            </contentshowCard>
        
        
        `
    }

    renderShowCardItem(item:gitIO.IItemProject): TemplateResult { 

        return html`
            <contentshowCarditem>
                <div style=" display: flex; align-items: center; justify-content: space-between">
                    <h4>
                        ${item.title}
                        <togit url=${item.url} @click="${this.goToGit}">
                            <svg style="width: 20px; height: 20px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M439.6 236.1L244 40.5a28.9 28.9 0 0 0 -40.8 0l-40.7 40.6 51.5 51.5c27.1-9.1 52.7 16.8 43.4 43.7l49.7 49.7c34.2-11.8 61.2 31 35.5 56.7-26.5 26.5-70.2-2.9-56-37.3L240.2 199v121.9c25.3 12.5 22.3 41.9 9.1 55a34.3 34.3 0 0 1 -48.6 0c-17.6-17.6-11.1-46.9 11.3-56v-123c-20.8-8.5-24.6-30.7-18.6-45L142.6 101 8.5 235.1a28.9 28.9 0 0 0 0 40.8l195.6 195.6a28.9 28.9 0 0 0 40.8 0l194.7-194.7a28.9 28.9 0 0 0 0-40.8z"/></svg>
                        </togit>
                    </h4>
                </div>

                <contentshowCarditeminfo>
                    ${repeat
                    (item.fieldValues,
                        ((key: gitIO.IItemProjectValues) => key.fieldId) as any,
                        ((k: gitIO.IItemProjectValues, index: any) => {

                            return this.renderShowCardItemInfo(k);

                        }) as any
                    )}

                </contentshowCarditeminfo>
                <div style=" position: relative;">
                    <div>
                        <span style=" display: flex; gap: .5rem; padding-left: 1rem; font-size: 13px;">
                            <svg style="width: 16px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
                            ${new Date(item.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    ${this.renderassignner(item)}
                </div>
                
            </contentshowCarditem>

        `;

    }

    renderassignner(item: gitIO.IItemProject): TemplateResult { 

        console.info(item)
        if (!item.assignees ||item.assignees.length <= 0 ) return html``;

        return html`

            ${repeat
                (item.assignees,
                    ((key: gitIO.IItemProjectAssignees) => key.login) as any,
                    ((k: gitIO.IItemProjectAssignees, index: any) => {

                        return html`
                            <assignner>
                                <img src="${k.avatarUrl}" title="${k.login}" />
                            </assignner>
                        `;

                    }) as any
                )}
            
        `

    }

    renderShowCardItemInfo(field: gitIO.IItemProjectValues): TemplateResult { 

        if (field.fieldName === 'Title') return html``;
        return html`
            <div .info=${field}>
                <h5>${field.fieldName}:</h5>
                <span>${field.valueText}</span>
            </div>
        
        `

    }

    //---------IMPLEMENTATION---------------

    private async setInfos() {

        await this.initInfoProject();
        if (!this.req) return;
        this.userInfo = await gitIO.getUserInfoIO(this.req);
        this.myProjcts = await gitIO.getProjects(this.req);

        this.requestUpdate();

    }

    private async initInfoProject() {

        const prj = mls.actual[5].project;
        if (!prj) return;

        const info = getMyKeysBranch(prj);
        if (!info) return;

        this.req = {
            mkey: this.mKey,
            owner: "santiagoExpansiva", //info.owner,
            repo: "testGit", //info.repo,
            branch: info.branch,
        }
    }

    private backButton(e: MouseEvent) {

        let el = e.target as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'backbutton') {
            el = el.closest('backbutton') as HTMLElement;
        }

        if (!el || !el.getAttribute('back')) return;

        this.scenary = el.getAttribute('back') as string;
    }

    private goToGit(e: MouseEvent) {

        let el = e.target as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'togit') {
            el = el.closest('togit') as HTMLElement;
        }

        if (!el || !el.getAttribute('url')) return;

        window.open(el.getAttribute('url') as string, '_blank');
    }

    

    private clickChangeView(e: MouseEvent) {

        let el = e.target as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'viewtype') {
            el = el.closest('viewtype') as HTMLElement;
        }

        if (!el || !el.getAttribute('show')) return;

        this.scenary = el.getAttribute('show') as string;

    }

    private async clickItem(e: MouseEvent) {

        let el = e.target as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'contentlistitem') {
            el = el.closest('contentlistitem') as HTMLElement;
        }

        if (!el || !(el as any).info || !this.req) return;

        this.viewProject = (el as any).info;

        if (this.viewProject && this.viewProject.fields.length <= 0) {

            this.viewProject.fields = await gitIO.getProjectFields(this.req, this.viewProject.id);

        }

        if (this.viewProject) {
            this.itensShow = await gitIO.getIssuesInProjects(this.req, this.viewProject.id);
        }

        this.scenary = 'show';

    }

    private addValues(): void {

        if (!this.itensShow || !this.contentstatus) return;


        this.itensShow.forEach((i) => {

            if (!this.contentstatus) return;

            const find = i.fieldValues.find((f) => f.fieldName.toLowerCase() === 'status');

            const id = find ? find.value : 'nostatus';

            const q = this.contentstatus.querySelector('#st' + id);
            if (!q) return;

            const item = document.createElement('div');
            item.innerHTML = `issue: ${i.title}`

            q.appendChild(item);


        })

    }

    //-------CSS----------------------

    static styles = css`
        :host {
            font-family: @font-family-primary;
            display: block;
            height: calc(100% - 55px);
            overflow: auto;
            background: @bg-primary-color;
            font-size: @font-size-16;
        }   

        backbutton{
            width: 20px;
            display: flex;
            transform: rotate(180deg);
            cursor: pointer;
            position: absolute;
            left: 5px
        }

        

        contentlistissues{
            display: flex;
            flex-direction: column;
            padding: .5rem;
        }

        contentlistitem{
            cursor: pointer;
            display: flex;
            flex-direction: column;
            margin-bottom: 1rem;
            padding: .5rem;
            border-radius: 10px;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 15px -3px;
        
        }

        contentlistitem:hover{
            box-shadow: rgb(0 0 0 / 43%) 0px 5px 15px -3px
        }

        contentlistitem div{
            display: flex;
            justify-content: left;
            align-items: center;
            gap: .5rem;
        }

        contentlistitem h3{
            margin: 0;
        }

        contentlistitem span{
            font-size: 1rem;
            color: var(--grey-color-darker);
        }


        contentshow{
            display: flex;
            flex-direction: column;
            padding: .5rem;
        }

        contentheader{
            border-bottom: 1px solid var(--bg-secondary-color);
            margin-bottom: 1px;
            display: block;
            padding-bottom: .5rem;
            position: relative;
        }

        contentheader div{
            display: flex;
            justify-content: left;
            align-items: center;
            gap: .5rem;
        }

        contentheader h3{
            margin: 0;
            text-align: center;
            width:100%;
        }

        contentheader span{
            font-size: 1rem;
            color: var(--grey-color-darker);
            text-align: center;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }


        viewtype{
            cursor:pointer;
        }


        contentstatus{
            border-top: 1px solid var(--bg-secondary-color);
            margin-top: .5rem;
            display: flex;
            justify-content: space-around;
            height: calc(100vh - 170px);
        }

        contentstatusitem{
            display: flex;
            flex-direction: column;
            width: 33%;
            align-items: center;
            border: 1px solid var(--bg-secondary-color);
        }

        contentstatusitem h4{
            background: var(--grey-color-light);
            width: 100%;
            text-align: center;
            margin-top: 0px;
        }

        contentst{
            padding: .5rem;
            display: flex;
            gap: .5rem;
            width: 100%;
            justify-content: center;
        }

        contentst div{
            border: 1px solid var(--bg-secondary-color);
            padding: .5rem;
            border-radius: 10px;
            width: 85%;
        }





        contentshowcard{
            display: flex;
            gap: .5rem;
            padding: .5rem;
            align-items: center;
            justify-content: center;
        }

        contentshowcarditem{
            display: flex;
            flex-direction: column;
            gap: .5rem;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
            margin-bottom: 1rem;
            border: 3px dashed transparent;
            width: 350px;
        }

        contentshowcarditem h4{
            margin: 0;
            padding: 4px 13px;
            color: #ffffff;
            background-color: #7d868d;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        togit{
            display: flex;
            align-items: center;
            justify-content: center;
            cursor:pointer;
        }

        contentshowcarditeminfo{
            padding: 1rem;
        }

        contentshowcarditeminfo div{
            display:flex;
            gap:.5rem;
            justify-content: flex-start;
            align-items: center;
        }

        contentshowcarditeminfo div h5{
            margin:0px;
        }

        assignner img{
            height: 30px;
            width: 30px;
            border-radius: 50%;
            border: 1px solid #fff;
            display: grid;
            align-items: center;
            text-align: center;
            font-weight: bold;
            color: #fff;
            padding: 2px;
            position: absolute;
            right: 5px;
            bottom: 0px;
        }
        
    `;
}