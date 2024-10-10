/// <mls shortName="pluginGithubL4Project" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult, LitElement, repeat } from 'lit';
import { query, property, customElement } from 'lit/decorators.js';
import { getMyKeysBranch } from './_100554_libCommom';
import * as gitIO from './_100554_libGithubIo';
import 'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.3/Sortable.min.js';

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
    private viewIssue: gitIO.IItemProject | undefined;
    private sort: any[] = [];

    @property() scenary: string = 'list';
    @property() isLoader: boolean = true;
    @property() autoClick: string = 'false';



    @query('contentstatus') contentstatus: HTMLElement | undefined;
    @query('contentviewissue') contentviewissue: HTMLElement | undefined;

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

        if (this.isLoader) return this.renderLoader();

        if (this.scenary === 'list') return this.renderList();

        if (this.scenary === 'showStatus') return this.renderShow();

        return html``;
    }

    renderLoader(): TemplateResult {

        return html`<div class="contentloader">
            <div class="loader"></div>
        </div>`
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
                <svg xmlns="http://www.w3.org/2000/svg" style="width:15px;" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
            </div>
        </div>
        `
    }

    renderListItem(item: gitIO.IProject, idx: number) {

        return html`
        <contentlistitem @click="${this.clickItemProject}" .info=${item} filter="${item.title}">
            <div>
                <h3>${item.title}</h3>
            </div>
            <span>
                #${item.number} opened on ${new Date(item.createdAt).toLocaleString()} by ${item.author}
            </span>
        </contentlistitem>
        `
    }

    //---- HEADER

    renderHeader() {

        if (!this.viewProject) return html`Not found project`;

        return html`
        <contentheader>
            <div>
                <backbutton back="list" @click=${this.backButton}>
                    <svg style="width:15px;fill:#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/></svg>
                </backbutton>
                <h3>${this.viewProject.title}</h3>
            </div>
            <span>
                #${this.viewProject.number} opened on ${new Date(this.viewProject.createdAt).toLocaleString()} by ${this.viewProject.author}
            </span>
            <div style=" position: absolute; right: 5px; bottom: 0px; display: flex; gap: 1rem;">
                <viewtype show="show" @click="${this.clickChangeView}">
                    <svg style="width:15px;fill:#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96l0 32 576 0 0-32c0-35.3-28.7-64-64-64L64 32zM576 224L0 224 0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-192zM112 352l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"/></svg>
                </viewtype>
                <viewtype show="showStatus" @click="${this.clickChangeView}">
                    <svg style="width:15px;fill:#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 256l0-96 160 0 0 96L64 256zm0 64l160 0 0 96L64 416l0-96zm224 96l0-96 160 0 0 96-160 0zM448 256l-160 0 0-96 160 0 0 96zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z"/></svg>
                </viewtype>
            </div>
        </contentheader>
        `
    }

    //-- SHOW TAB

    renderShow(): TemplateResult {

        if (!this.viewProject) return html`Not found project`;

        return html`
            <contentshow>
                ${this.renderHeader()}
                ${this.renderTab()}
                ${this.renderViewIssue()}
            </contentshow>
        `

    }

    renderTab(): TemplateResult {

        if (!this.viewProject) return html`Not found project`;

        const item = this.viewProject.fields.find((i) => i.dataType === 'select' && i.name.toLocaleLowerCase() === 'status');

        if (!item || item.options.length <= 0) return html`Not found status collumn`;

        this.addItensStatus();

        return html`

            <contentstatus>
                <contentstatusitem>
                    <contentstatusitembody>
                        <h4>
                            No Status
                        </h4>
                        <contentst id="stnull" idfield="${item.id}" >
                        </contentst>
                    </contentstatusitembody>
                </contentstatusitem>
                ${repeat
                (item.options,
                    ((key: any) => key.id) as any,
                    ((k: any, index: any) => {

                        return html`
                            <contentstatusitem>
                                <contentstatusitembody>
                                    <h4>
                                        ${k.name}
                                    </h4>
                                    <contentst id="st${k.id}" idfield="${item.id}" namefield="${k.name}">
                                    </contentst>
                                </contentstatusitembody>
                            </contentstatusitem>
                        `

                    }) as any
                )}
            </contentstatus>
            
        `;

    }

    //----- ISSUE

    renderViewIssue(): TemplateResult {

        return html`
            <contentviewissue class="scroll-custom" style="display:none">
            </contentviewissue>
        
        `
    }


    //---------IMPLEMENTATION---------------

    private async setInfos() {

        await this.initInfoProject();
        if (!this.req) return;
        this.userInfo = await gitIO.getUserInfoIO(this.req);
        this.myProjcts = await gitIO.getProjects(this.req);

        await this.isAutoClick();
        this.isLoader = false;
        this.requestUpdate();

    }

    private async initInfoProject() {

        const prj = mls.actual[5].project;
        if (!prj) return;

        const info = getMyKeysBranch(prj);
        if (!info) return;

        this.req = {
            mkey: this.mKey,
            owner: info.owner,//"santiagoExpansiva", //info.owner,
            repo: info.repo,//"testGit", //info.repo,
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

    private async clickItemProject(e: MouseEvent) {

        let el = e.target as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'contentlistitem') {
            el = el.closest('contentlistitem') as HTMLElement;
        }

        if (!el || !(el as any).info || !this.req) return;

        this.isLoader = true;
        this.viewProject = (el as any).info;

        if (this.viewProject && this.viewProject.fields.length <= 0) {

            this.viewProject.fields = await gitIO.getProjectFields(this.req, this.viewProject.id);

        }

        if (this.viewProject) {
            this.itensShow = await gitIO.getIssuesInProjects(this.req, this.viewProject.id);
        }

        this.isLoader = false;
        this.scenary = 'showStatus';

    }

    private async isAutoClick() {

        if (this.autoClick !== 'true' || !this.req) return;

        this.isLoader = true;
        this.viewProject = this.myProjcts[0];

        if (this.viewProject && this.viewProject.fields.length <= 0) {

            this.viewProject.fields = await gitIO.getProjectFields(this.req, this.viewProject.id);

        }

        if (this.viewProject) {
            this.itensShow = await gitIO.getIssuesInProjects(this.req, this.viewProject.id);
        }

        this.isLoader = false;
        this.scenary = 'showStatus';

    }

    private addItensStatus(): void {

        if (!this.itensShow || !this.contentstatus) return;


        this.itensShow.forEach((i) => {

            if (!this.contentstatus) return;

            const find = i.fieldValues.find((f) => f.fieldName.toLowerCase() === 'status');

            let id = find ? find.value : 'null';

            const q = this.contentstatus.querySelector('#st' + id);
            if (!q) return;

            const item = document.createElement('itemstatusissues');
            let labels = '';
            let assign = '';

            item.onclick = async () => {
                try {

                    if (!this.req) return;

                    if (this.viewIssue && this.viewIssue.issue.id === i.issue.id) {
                        this.setViewIssue(true, false);
                        return;
                    }

                    this.viewIssue = i;
                    this.viewIssue.issue.comments = await gitIO.getIssueComments(this.req, this.viewIssue.issue);

                    this.setViewIssue(true, true);

                } catch (e) {
                    console.info(e)
                }
            };

            i.issue.labels.forEach((l) => {
                labels += `<contentlabel style="background:#${l.color}3b; color:#${l.color}; border: 1px solid #${l.color}">${l.name}</contentlabel>`
            })

            i.issue.assignees.forEach((a) => {
                assign += `<img src="${a.avatarUrl}" title="${a.login}"/>`
            })



            item.innerHTML = `
                <div style="display: flex; flex-wrap: wrap; gap: .2rem;">
                    ${labels}
                </div>
                <div>
                    ${i.issue.title}
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: .2rem;align-items: center; justify-content: flex-end;">
                    ${assign}
                </div>
            `;
            (item as any).info = i;
            q.appendChild(item);


        })

        this.setDragAndDrop(true);

    }

    private setViewIssue(view: boolean, reload: boolean) {

        if (!this.contentviewissue || !this.contentstatus || !this.viewIssue || !this.userInfo) return;

        if (!view) {
            this.contentviewissue.style.display = 'none';
            this.contentstatus.style.opacity = '';
            return
        }

        if (view && !reload) {
            this.contentviewissue.style.display = '';
            this.contentstatus.style.opacity = '0.2';
            return
        }

        let labels = '';
        let assign = '';
        let comments = '';

        this.viewIssue.issue.labels.forEach((l) => {
            labels += `<contentlabel style="background:#${l.color}3b; color:#${l.color}; border: 1px solid #${l.color};border-radius: 10px; padding: .2rem; font-size: 12px;">${l.name}</contentlabel>`
        })

        this.viewIssue.issue.assignees.forEach((a) => {
            assign += `<img style="width: 35px; border-radius: 50%;" src="${a.avatarUrl}" title="${a.login}"/>`
        })

        this.viewIssue.issue.comments.forEach((c) => {
            comments += `
                <div style="display: flex; flex-direction: column;">
                    <div style="display: flex; gap: .5rem; align-items: center; font-size: 15px;">
                        <img style="width: 35px; border-radius: 50%;" src="${c.avatarUrl}" title="${c.author}"/>
                        <label>
                            ${c.author}
                            ${new Date(c.createdAt).toLocaleString()}
                        </label>
                    </div>
                    <div style="margin-left: 43px; background: #22272b; width: 81%; padding: .2rem; border-radius: 5px;">
                        ${c.bodyText}
                    </div>
                </div>
            `
        })

        const shtml = `
            <div class="header">
                <div style=" display: flex; gap: .5rem; align-items: center;font-size: 20px;">
                    <a href="${this.viewIssue.issue.url}" style="display: flex;" target="_blank">
                        <svg style="width:20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
                    </a>
                    ${this.viewIssue.issue.title}
                </div>
            </div>
            <div style="display: flex; gap: 1.5rem; align-items: center; margin-top: 1rem; padding-left: 31px;">
                <div style="display: flex; flex-direction: column; gap: .3rem;height: 65px;">
                    <label style="font-size: 13px;">Members:</label>
                    <div style="display: flex; gap: .5rem; flex-wrap: wrap;">
                        ${assign}
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: .3rem;height: 65px;">
                    <label style="font-size: 13px;">Labels:</label>
                    <div style="display: flex; gap: .5rem; flex-wrap: wrap;">
                        ${labels}
                    </div>
                </div>
            </div>
            <div style="display: flex; margin-top: 1rem; flex-direction: column;">
                <div style="display: flex; gap: .5rem; font-size: 18px;">
                    <svg style="width:20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M448 64c0-17.7-14.3-32-32-32L32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32L32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32z"/></svg>
                    Description
                </div>
                <div style=" margin-left: 30px; border-radius: 10px; padding: .5rem; margin-top: .5rem;">
                    ${this.viewIssue.issue.bodyText}
                </div>
            </div>
            <div class="activity" style="display: flex; margin-top: 1rem; flex-direction: column;">
                <div style="display: flex; gap: .5rem; font-size: 18px;">
                    <svg style="width:20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"/></svg>
                    Activity
                </div>
                <div style=" border-radius: 10px; margin-top: .5rem;">
                    <div style="display:flex;gap: .5rem; flex-direction: row; align-items: center;">
                        <img style="width: 37px; border-radius: 50%;" src="${this.userInfo.avatarUrl}" title="${this.userInfo.login}">
                        <textarea class="textcomment" placeholder="Write a comment ..."></textarea>
                    </div>
                    <button class="button" style="margin-left: 44px; margin-top: .5rem;">
                        Save
                    </button>
                </div>
                <div style="display: flex; flex-direction: column; gap: .5rem; margin-top: 3rem;">
                    ${comments}
                </div>
            </div>
        `

        this.contentviewissue.innerHTML = shtml;

        const header = this.contentviewissue.querySelector('.header');
        const close = document.createElement('button');
        close.innerHTML = `<svg style="width: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`;
        close.onclick = () => this.setViewIssue(false, false);
        header?.appendChild(close);


        this.contentviewissue.style.display = '';
        this.contentstatus.style.opacity = '0.2';
    }

    private setDragAndDrop(active: boolean) {


        if (!active) {

            if (this.sort) {
                this.sort.forEach((i: any) => i.destroy())
            }

            return;
        }

        if ((window['Sortable' as any] as any)) {

            const columns = this.shadowRoot?.querySelectorAll('contentst');

            if (!columns) return;

            const func = async (evt: any) => {

                const namefield = evt.to.getAttribute('namefield');
                const idField = evt.to.getAttribute('idfield');
                const idIssue = evt.item.info.id;
                const idStatus = evt.to.id.replace('st', '');

                const find = (evt.item.info as gitIO.IItemProject).fieldValues.find((f: any) => f.fieldName.toLowerCase() === 'status');

                if (find) {
                    find.value = idStatus;
                    find.valueText = namefield;
                }

                try {

                    if (!this.req || !this.viewProject) throw new Error('Not found project');

                    await gitIO.updateFieldSelectProjects(this.req, this.viewProject.id, idIssue, idField, idStatus);

                } catch (e: any) {
                    this.error = e.message;
                }

            }

            Array.from(columns).forEach((i) => {
                this.sort.push(
                    (window['Sortable' as any] as any).create(i, {
                        group: 'shared',
                        sort: active,
                        onEnd: func,
                    })
                )
            });
        }



    }

    //-------CSS----------------------

    static styles = css`
        :host {
            font-family: var(--font-family-primary);
            display:block;
            height: 100%;
            background: #0d1117;
            font-size: var(--font-size-16);
            position:relative;
            color:#e8eaec;
            overflow:hidden;
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
            border: 1px solid #393939;
            box-shadow: #8b88881a 0px 4px 10px -3px;
        
        }

        contentlistitem:hover{
            box-shadow: #ffffff96 0px 2px 8px -4px;
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
            color: #969494;
        }


        

        contentheader{
            cursor:pointer;
            display: flex;
            flex-direction: column;
            padding: .5rem;
            position:relative;
            border-bottom: 1px solid #323030;
        }

        contentheader div{
            display: flex;
            justify-content: left;
            align-items: center;
            gap: .5rem;
        }

        contentheader h3{
            margin: 0;
            width: 100%;
            text-align: center;
        }

        contentheader span{
            font-size: 1rem;
            color: #969494;
            text-align: center;
        }




        contentstatus{
            display:flex;
            height: calc(100vh - 207px);
            padding: 1rem;
            width: calc(100% - 32px);
            overflow-x: auto;
            position: relative;
        }

        contentstatus contentstatusitem{
            display: block;
            flex-shrink: 0;
            align-self: flex-start;
            padding: 0 6px;
            height: 100%;
            white-space: nowrap;
            
        }

        contentstatus contentstatusitem img{
            width: 30px;
            border-radius: 50%;
        }

        contentstatus contentstatusitem contentstatusitembody{
            display: flex;
            position: relative;
            box-sizing: border-box;
            flex-direction: column;
            justify-content: flex-start;
            gap: .5rem;
            padding:.5rem;
            width: 280px;
            max-height: 100%;
            padding-bottom: 8px;
            border-radius: 12px;
            background-color: #101204;
            color: #9fadbc;
            vertical-align: top;
            white-space: normal;
            scroll-margin: 8px;
            
        }

        contentstatusitembody contentst{
            min-height: 80px;
            display: flex;
            flex-direction: column;
            gap: .5rem;
        }

        contentstatusitembody h4{
            margin: 0px;
            padding-left: .4rem;
            color: #ffffff;
            font-size: 13px;
        }

        itemstatusissues{
            display:flex;
            flex-direction: column;
            gap: .5rem;
            background: #22272b;
            padding: .5rem;
            border-radius: 10px;
            cursor:pointer;
        }

        itemstatusissues:hover{
            box-shadow:0px 0px 3px 0px #dad5d563;
        }

        itemstatusissues contentlabel{
            font-size: 10px;
            padding: .2rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }



        contentviewissue{
            background: #323940;
            display: block;
            max-width: 750px;
            width: 80%;
            position: absolute;
            top: 0px;
            padding: 1rem;
            border-radius: 10px;
            z-index: 99;
            transform: translate(15%, 78px);
            height: calc(100vh - 242px);
            overflow-y: auto;
        }

        contentviewissue .header{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        contentviewissue svg{
            fill:#969494;
        }

        contentviewissue .header button{
            background: transparent;
            border: none;
            cursor:pointer;
        }

        contentviewissue .textcomment{
            width: 80%;
            border-radius: 5px;
            padding: .5rem;
            background: #22272b;
            color: #fff;
        }

        contentviewissue .button{
            background: #1c8139;
            color: #fff;
            padding: .5rem;
            border: none;
            border-radius: 8px;
            cursor:pointer;
        }

        contentviewissue .button:hover{
            background: #22a547;
        }



        .contentloader{
            background: #f5f5f5;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .loader {
            width: 50px;
            height: 28px;
            --_g: no-repeat radial-gradient(farthest-side,#000 94%,#0000);
            background:
                var(--_g) 50%  0,
                var(--_g) 100% 0;
            background-size: 12px 12px;
            position: relative;
            animation: l23-0 1.5s linear infinite;
        }
        .loader:before {
            content: "";
            position: absolute;
            height: 12px;
            aspect-ratio: 1;
            border-radius: 50%;
            background: #000;
            left:0;
            top:0;
            animation: 
                l23-1 1.5s linear infinite,
                l23-2 0.5s cubic-bezier(0,200,.8,200) infinite;
        }
        @keyframes l23-0 {
            0%,31%  {background-position: 50% 0   ,100% 0}
            33%     {background-position: 50% 100%,100% 0}
            43%,64% {background-position: 50% 0   ,100% 0}
            66%     {background-position: 50% 0   ,100% 100%}
            79%     {background-position: 50% 0   ,100% 0}
            100%    {transform:translateX(calc(-100%/3))}
        }
        @keyframes l23-1 {
            100% {left:calc(100% + 7px)}
        }
        @keyframes l23-2 {
            100% {top:-0.1px}
        }
        
    `;
}