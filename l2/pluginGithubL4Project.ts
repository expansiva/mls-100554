/// <mls shortName="pluginGithubL4Project" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, svg, TemplateResult, repeat, unsafeHTML } from 'lit';
import { query, property, customElement } from 'lit/decorators.js';
import { getMyKeysBranch } from './_100554_libCommom';
import * as gitIO from './_100554_libGithubIo';
import { CollabLitElement } from './_100554_collabLitElement';

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
export class PluginGithubL4Project extends CollabLitElement {

    private repositoryId: string = '';
    
    private userInfo: gitIO.IInfo | undefined;
    private req: gitIO.IReq | undefined;

    private myLabels: gitIO.ILabel[] = [];
    private myUsers: gitIO.IAssignees[] = [];

    private myProjcts: gitIO.IProject[] = [];
    private viewProject: gitIO.IProject | undefined;
    private itensShowProject: gitIO.IItemProject[] | undefined;
    private idFieldStatus: string | undefined;

    private sort: any[] = [];

    @property() error: string = '';
    @property() scenary: string = 'list';
    @property() isLoader: boolean = true;
    @property() autoClick: string = 'false';
    @property() viewIssue: gitIO.IItemProject | undefined;
    @property() addInStatus: string | undefined;
    @property() listIssues: gitIO.IIssues[] | undefined;

    @query('contentstatus') contentstatus: HTMLElement | undefined;
    @query('contentviewissue') contentviewissue: HTMLElement | undefined;


    async prepare() {
        this.setInfos();
    }

    //----------COMPONENT--------------------

    firstUpdated() {
        this.setInfos();
    }

    createRenderRoot() {
        return this;
    }

    render(): TemplateResult {

        if (this.error != '') return this.renderError();

        if (this.isLoader) return this.renderLoader();

        if (this.scenary === 'list') return this.renderList();

        if (this.scenary === 'showStatus') return this.renderShow();

        if (this.scenary === 'listAddIssues') return this.renderListIssues();

        return html``;
    }

    renderLoader(): TemplateResult {

        return html`<div class="contentloader">
            <div class="loader"></div>
        </div>`
    }

    renderError(): TemplateResult {
 
        return html`<h3 style=" padding: 2rem; text-align: center;">${this.error}</h3>`
    }

    //---LIST

    renderList(): TemplateResult {

        if (this.myProjcts.length <= 0) return html`<h3>No projects</h3>`;

        return html`
            ${this.renderListFilter()}
            <contentlistissues>
                ${repeat(this.myProjcts, (
            (key: gitIO.IProject) => key.id) as any, (
                (k: gitIO.IProject, index: any) => {
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
                ${unsafeHTML(this.myIcons.back)}
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
                    ${unsafeHTML(this.myIcons.back2)}
                </backbutton>
                <h3>
                    <span class="showinfo" style="margin-left:1rem">
                        <span class="infohv">
                            ${this.viewProject.title}
                        </span>
                        <span class="infotxt">
                            #${this.viewProject.number} opened on ${new Date(this.viewProject.createdAt).toLocaleString()} by ${this.viewProject.author}
                        </span>
                    </span>
                </h3>
            </div>
            
            <div style=" position: absolute; right: 7px; bottom: 0px; display: flex; gap: 1rem; transform: translate(0, -37%);">
            
                <viewtype @click="${this.listAllIssues}">
                    ${unsafeHTML(this.myIcons.plus)}
                </viewtype>
                <viewtype style="display:none" show="show" @click="${this.clickChangeView}">
                    ${unsafeHTML(this.myIcons.card)}
                </viewtype>
                <viewtype style="display:none" show="showStatus" @click="${this.clickChangeView}">
                    ${unsafeHTML(this.myIcons.table)}
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
                ${this.renderAddIssue()}
            </contentshow>
        `

    }

    renderTab(): TemplateResult {

        if (!this.viewProject) return html`Not found project`;

        const item = this.viewProject.fields.find((i) => i.dataType === 'select' && i.name.toLocaleLowerCase() === 'status');

        if (!item || item.options.length <= 0) return html`Not found status collumn`;

        const info = this.organizeItens();

        setTimeout(() => { this.setDragAndDrop(true) }, 100);

        this.idFieldStatus = item.id;

        return html`

            <contentstatus>
                <contentstatusitem>
                    <contentstatusitembody>
                        <h4>
                            No Status
                            <span style="cursor:pointer" @click="${() => { this.addIssuesin('null') }}">${unsafeHTML(this.myIcons.plus)}</span>
                        </h4>
                        <contentst id="stnull" idfield="${item.id}" >
                            ${this.renderTaksTab(info ? info['null'] : [])}
                        </contentst>
                    </contentstatusitembody>
                </contentstatusitem>
                ${repeat(item.options, (
            (key: any) => key.id) as any, (
                (k: any, index: any) => {
                    return html`
                            <contentstatusitem>
                                <contentstatusitembody>
                                    <h4>
                                        ${k.name}
                                        <span style="cursor:pointer" @click="${() => { this.addIssuesin(k.id) }}">${unsafeHTML(this.myIcons.plus)}</span>
                                    </h4>
                                    <contentst id="st${k.id}" idfield="${item.id}" namefield="${k.name}">
                                        ${this.renderTaksTab(info ? info[k.id] : [])}
                                    </contentst>
                                </contentstatusitembody>
                            </contentstatusitem>
                        `
                }) as any
        )}
            </contentstatus>
            
        `;

    }

    renderTaksTab(array: gitIO.IItemProject[] | undefined): TemplateResult {

        if (!array) return html``;

        return html`
            ${repeat(array, (
            (key: gitIO.IItemProject) => key.id) as any, (
                (p: gitIO.IItemProject, index: any) => {
                    return this.renderTaskTab(p)

                }) as any
        )}
        `;

    }

    renderTaskTab(p: gitIO.IItemProject): TemplateResult {
        return html`
            <itemstatusissues .info=${p} @click=${this.showViewIssue}>
                <div style="display: flex; flex-wrap: wrap; gap: .2rem;">
                    ${repeat(p.issue.labels, ((key: gitIO.ILabel) => key.id) as any, ((l: gitIO.ILabel, index: any) => {
            return html`
                                <contentlabel style="background:#${l.color}3b; color:#${l.color}; border: 1px solid #${l.color}">${l.name}</contentlabel>
                                `
        }) as any)}
                    
                </div>
                <div>
                    ${p.issue.title}
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: .2rem;align-items: center; justify-content: flex-end;">

                    ${repeat(p.issue.assignees, ((key: gitIO.IAssignees) => key.avatarUrl) as any, ((a: gitIO.IAssignees, index: any) => {
            return html`
                                <img src="${a.avatarUrl}" title="${a.login}">
                                `
        }) as any)}
                    
                </div>
            </itemstatusissues>
        `;
    }

    //----- ISSUE

    renderViewIssue(): TemplateResult {

        if (!this.viewIssue || !this.userInfo) return html``;

        return html`
            <contentviewissue class="scroll-custom" >
                <div class="header">
                    <div style=" display: flex; gap: .5rem; align-items: center;font-size: 20px;">
                        <a href="${this.viewIssue.issue.url}" style="display: flex;" target="_blank">
                            ${unsafeHTML(this.myIcons.git)}
                        </a>
                        ${this.viewIssue.issue.title}
                        
                    </div>
                    <button @click="${this.clickCloseIssue}">
                        ${unsafeHTML(this.myIcons.close)}
                    </button>
                </div>
                <div style="display:flex">
                    ${this.renderViewMain()}
                    ${this.renderViewOptions()}
                </div>
            </contentviewissue>
        
        `
    }

    renderViewMain(): TemplateResult {

        if (!this.viewIssue || !this.userInfo) return html``;

        return html`
            <div style="width:75%">
                <div style="display: flex; gap: 1.5rem; align-items: center; margin-top: 1rem; padding-left: 31px;">
                    <div style="display: flex; flex-direction: column; gap: .3rem;height: 65px;">
                        <label style="font-size: 13px;">Members:</label>
                        <div style="display: flex; gap: .5rem; flex-wrap: wrap;">
                            ${repeat(this.viewIssue.issue.assignees, ((key: gitIO.IAssignees) => key.avatarUrl) as any, ((a: gitIO.IAssignees, index: any) => {
            return html`<img style="width: 37px; border-radius: 50%;" src="${a.avatarUrl}" title="${a.login}"/>`
        }) as any)}
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: .3rem;height: 65px;">
                        <label style="font-size: 13px;">Labels:</label>
                        <div style="display: flex; gap: .5rem; flex-wrap: wrap;">
                            ${repeat(this.viewIssue.issue.labels, ((key: gitIO.ILabel) => key.id) as any, ((l: gitIO.ILabel, index: any) => {
            return this.renderLabelsInTask(l)
        }) as any)}
                        </div>
                    </div>
                </div>
                <div style="display: flex; margin-top: 1rem; flex-direction: column;">
                    <div style="display: flex; gap: .5rem; font-size: 18px;">
                        ${unsafeHTML(this.myIcons.bars)}
                        Description
                    </div>
                    <div style=" margin-left: 30px; border-radius: 10px; padding: .5rem; margin-top: .5rem;">
                        ${unsafeHTML(this.viewIssue.issue.bodyText)}
                    </div>
                </div>
                <div class="activity" style="display: flex; margin-top: 1rem; flex-direction: column;">
                    <div style="display: flex; gap: .5rem; font-size: 18px;">
                        ${unsafeHTML(this.myIcons.list)}
                        Activity
                    </div>
                    <div style=" border-radius: 10px; margin-top: .5rem;">
                        <div style="display:flex;gap: .5rem; flex-direction: row; align-items: center;">
                            <img style="width: 37px; border-radius: 50%;" src="${this.userInfo.avatarUrl}" title="${this.userInfo.login}">
                            <textarea class="textcomment" placeholder="Write a comment ..."></textarea>
                        </div>
                        <button class="button" @click="${this.clickSaveComment}" style="margin-left: 44px; margin-top: .5rem;">
                            Save
                        </button>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: .5rem; margin-top: 3rem;">
                        ${repeat(this.viewIssue.issue.comments, ((key: gitIO.IComments) => key.id) as any, ((c: gitIO.IComments, index: any) => {
            return this.renderComentsInTask(c)
        }) as any)}
                    </div>
                </div>
            </div>
        `;
    }

    renderViewOptions(): TemplateResult {
        if (!this.viewIssue || !this.userInfo) return html``;

        return html`
            <constentviewoptions>
                <div>
                    <h5 open="labels" @click="${this.openMyChild}">
                        ${unsafeHTML(this.myIcons.label)}
                        Labels
                    </h5>
                    <viewoptionitens child="labels" style="display:none;">
                        ${repeat(this.myLabels, ((key: gitIO.ILabel) => key.id) as any, ((l: gitIO.ILabel, index: any) => { return this.renderOptionsLabels(l) }) as any)}
                    </viewoptionitens>
                </div>
                <div>
                    <h5 open="members" @click="${this.openMyChild}">
                        ${unsafeHTML(this.myIcons.member)}
                        Members
                    </h5>
                    <viewoptionitens child="members" style="display:none;">
                        ${repeat(this.myUsers, ((key: gitIO.IAssignees) => key.login) as any, ((l: gitIO.IAssignees, index: any) => { return this.renderOptionsMembers(l) }) as any)}
                    </viewoptionitens>
                </div>
                <div>
                    <h5 @click="${this.removeIssueInProject}">
                        ${unsafeHTML(this.myIcons.trash)}
                        Delete
                    </h5>
                </div>
            </constentviewoptions>
        `;
    }

    renderOptionsLabels(l: gitIO.ILabel): TemplateResult {

        const find = this.viewIssue?.issue.labels.find((f) => f.id === l.id);
        if (find) return html`
            <label for="${l.id}" style="cursor:pointer;padding:2px; background:#${l.color}3b; color:#${l.color}">
                <input type="checkbox" @change="${this.changeLabel}" checked="true" id="${l.id}" value="${l.id}">
                ${l.name}
            </label>    
        `
        return html`
            <label for="${l.id}" style="cursor:pointer;padding:2px; background:#${l.color}3b; color:#${l.color}">
                <input type="checkbox" @change="${this.changeLabel}" id="${l.id}" value="${l.id}">
                ${l.name}
            </label>    
        `
    }

    renderOptionsMembers(l: gitIO.IAssignees): TemplateResult {

        const find = this.viewIssue?.issue.assignees.find((f) => f.login === l.login);

        if (find) return html`
            <label for="${l.login}" style="cursor: pointer;padding: 3px; font-size: 11px; display: flex; align-items: center; gap: .2rem;">
                <input type="checkbox" @change="${this.changeMembers}" checked="true" id="${l.login}" value="${l.login}">
                <img src="${l.avatarUrl}" style="width:20px; border-radius:50%" />
                ${l.login}
            </label>    
        `

        return html`
            <label for="${l.login}" style="cursor: pointer;padding: 3px; font-size: 11px; display: flex; align-items: center; gap: .2rem;">
                <input type="checkbox" @change="${this.changeMembers}" id="${l.login}" value="${l.login}">
                <img src="${l.avatarUrl}" style="width:20px; border-radius:50%" />
                ${l.login}
            </label>    
        `
    }

    renderComentsInTask(c: gitIO.IComments): TemplateResult {
        return html`
            <div style="display: flex; flex-direction: column;">
                <div style="display: flex; gap: .5rem; align-items: center; font-size: 15px;">
                    <img style="width: 35px; border-radius: 50%;" src="${c.avatarUrl}" title="${c.author}"/>
                    <label>
                        ${c.author}
                        ${new Date(c.createdAt).toLocaleString()}
                    </label>
                </div>
                <div style="margin-left: 43px; background: #22272b; width: 81%; padding: .2rem; border-radius: 5px;">
                    ${unsafeHTML(c.bodyText)}
                </div>
            </div>`
            ;
    }

    renderLabelsInTask(l: gitIO.ILabel): TemplateResult {
        return html`
        <contentlabel style="background:#${l.color}3b; color:#${l.color}; border: 1px solid #${l.color};border-radius: 10px; padding: .2rem; font-size: 12px;">
            ${l.name}
        </contentlabel>`
    }


    //-----ADD ISSUE

    renderAddIssue(): TemplateResult {

        if (!this.addInStatus || !this.userInfo) return html``;

        return html`
            <contentnewissue>

                <backbutton back="list" style="align-items: self-end;" @click=${() => { this.addInStatus = undefined }}>
                    ${unsafeHTML(this.myIcons.close)}
                </backbutton>

                <div style="width: 80%;">
                    <div style="margin-bottom:1rem">
                        <div style="display: flex;">
                            <h4>Add Title</h4>
                        </div>
                        <input id="inputtitle" type="text" />
                    </div>

                    <div>
                        <h4>Add a description</h4>
                        <textarea id="inputdesc"></textarea>
                    </div>
                    <div style="margin-top: 1rem;">
                        <buttonnewissues @click="${this.addIssue}">Add new issue</buttonnewissues>
                    </div>
                </div>
                
            </contentnewissue>

        `;

    }


    // Add List Issue

    renderListIssues(): TemplateResult {

        if (!this.listIssues || this.listIssues.length <= 0) {
            return html` <h3 style="padding:0rem 4rem">No issues</h3>`;
        }

        return html`
            <div style="padding:1rem">
                <backbutton back="showStatus" @click=${this.backButton}>
                    ${unsafeHTML(this.myIcons.back2)}
                </backbutton>
                <h3 style="text-align: center;margin:0px"> Issues </h3>
            </div>
            <contentlistissues>
                ${repeat(this.listIssues, ((key: gitIO.IIssues) => key.id) as any, ((k: gitIO.IIssues, index: any) => {
            return this.renderListItemIssues(k, index);
        }) as any
        )}
            </contentlistissues>
        `

    }

    renderListItemIssues(item: gitIO.IIssues, idx: number) {

        return html`
        <contentlistitem .info=${item} filter="${item.title}">
            <div>
                <h3>${item.title}</h3>
                <contentlabels>
                    ${repeat(item.labels, ((key: gitIO.ILabel) => key.name) as any, ((k: gitIO.ILabel, index: any) => {
            return html`
                            <contentlabel style="background:#${k.color}3b; color:#${k.color}; border: 1px solid #${k.color}">
                                ${k.name}
                            </contentlabel>`;
        }) as any)}
                </contentlabels>
            </div>
            <span>
                #${item.numberIssues} opened on ${new Date(item.createdAt).toLocaleString()} by ${item.author}  <span style="margin-left:1rem">project: ${!item.project ? 'none yet' : item.project.title}</span>
                <contentthumb style="float:right" title="add" @click="${this.addIssueInProject}">
                    ${unsafeHTML(this.myIcons.plus)}
                </contentthumb>
            </span>
        </contentlistitem>
        `
    }

    //---------IMPLEMENTATION---------------

    private async setInfos() {

        try {

            await this.initInfoProject();
            if (!this.req) return; 
            this.repositoryId = await gitIO.getRepositoryId(this.req);
            this.userInfo = await gitIO.getUserInfoIO(this.req);
            this.myProjcts = await gitIO.getProjects(this.req);
            this.myLabels = await gitIO.getLabels(this.req); 
            this.myUsers = await gitIO.getUsers(this.req);


            await this.isAutoClick();
            this.isLoader = false;
            this.requestUpdate();

        } catch (e: any) {
            this.error = e.message;
        }

    }

    private async initInfoProject() {

        const prj = mls.actualProject;
        if (!prj) return;

        const info = getMyKeysBranch(prj);
        if (!info) return;

        this.req = { 
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
        setTimeout(() => this.requestUpdate(), 100);
    }

    private clickChangeView(e: MouseEvent) {

        let el = e.target as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'viewtype') {
            el = el.closest('viewtype') as HTMLElement;
        }

        if (!el || !el.getAttribute('show')) return;

        this.scenary = el.getAttribute('show') as string;

    }

    private async addIssuesin(status: string) {
        this.addInStatus = status;

    }

    private async addIssueInProject(e: MouseEvent) {

        let el = e.target as HTMLElement;
        let parent = el.closest('contentlistitem');

        if (!parent || !(parent as any).info || !this.req || !this.viewProject) return;

        const { info } = parent as any;

        const isAdd = await gitIO.addIssueInProject(this.req, this.viewProject.id, info.id);

        if (isAdd) this.itensShowProject = await gitIO.getIssuesInProjects(this.req, this.viewProject.id);

        this.scenary = 'showStatus';

        setTimeout(() => { this.requestUpdate(); }, 100)

    }

    private async clickSaveComment(e: MouseEvent) {

        let el = e.target as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'button') {
            el = el.closest('button') as HTMLElement;
        }

        const input = el.parentElement?.querySelector('.textcomment') as HTMLTextAreaElement;

        if (!input || !this.req || !this.viewIssue) return;

        if (!input.value) {
            alert('Empty comment');
            return;
        }

        const comm = await gitIO.addComment(this.req, this.viewIssue.issue, input.value);

        input.value = '';

        if (comm) {
            this.viewIssue.issue.comments.push(comm);

            this.requestUpdate();
            return;
        }

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
            this.itensShowProject = await gitIO.getIssuesInProjects(this.req, this.viewProject.id);
        }

        this.isLoader = false;
        this.scenary = 'showStatus';
        setTimeout(() => { this.requestUpdate(); }, 100)

    }

    private async listAllIssues(e: MouseEvent) {

        try {

            if (!this.req) return;
            let listIssues: gitIO.IIssues[] = await gitIO.getIssues(this.req);

            listIssues = listIssues.filter((l) => l.project === undefined);

            this.listIssues = listIssues;
            this.scenary = 'listAddIssues'



        } catch (err: any) {
            console.info('listAllIssues:' + err.message)
        }

    }

    private async addIssue(e: MouseEvent) {

        try {

            let el = e.target as HTMLElement;

            if (el.tagName.toLocaleLowerCase() !== 'contentnewissue') {
                el = el.closest('contentnewissue') as HTMLElement;
            }

            if (!el || !this.req || !this.userInfo || !this.viewProject || !this.itensShowProject || !this.idFieldStatus) return;

            const title = el.querySelector('#inputtitle') as HTMLInputElement;
            const desc = el.querySelector('#inputdesc') as HTMLInputElement;

            if (!title || !desc || !title.value || !desc.value) {
                alert('fill in all fields');
                return;
            }

            this.isLoader = true;

            const issue = await gitIO.addNewIssueIO(this.req, this.userInfo, this.repositoryId, [], title.value, desc.value);

            title.value = '';
            desc.value = '';

            if (!issue) return;

            const isAdd = await gitIO.addIssueInProject(this.req, this.viewProject.id, issue.id);

            if (this.addInStatus && isAdd && this.addInStatus !== 'null') {
                await gitIO.updateFieldSelectProjects(this.req, this.viewProject.id, isAdd, this.idFieldStatus, this.addInStatus);
            }

            if (isAdd) this.itensShowProject = await gitIO.getIssuesInProjects(this.req, this.viewProject.id);


            this.addInStatus = undefined;
            this.isLoader = false;
            setTimeout(() => { this.requestUpdate(); }, 200)

        } catch (err: any) {
            this.isLoader = false;
            this.addInStatus = undefined;
            this.error = err.message;
        }


    }

    private changeLabel(e: MouseEvent) {

        if (!this.viewIssue) return;

        let el = e.target as HTMLInputElement;

        if (el.tagName.toLocaleLowerCase() !== 'input') {
            el = el.closest('input') as HTMLInputElement;
        }

        let item: gitIO.ILabel | undefined;


        this.myLabels.forEach((l, idx) => {
            if (l.id === el.id) {
                item = Object.assign({}, l);
            }
        });

        if (!item || !this.req) return;

        if (el.checked) {

            this.viewIssue.issue.labels.push(item);

            try {

                gitIO.addLabelInIssue(
                    this.req,
                    this.viewIssue.issue.id,
                    item.id
                );

            } catch (err: any) {
                console.info('changeLabel add error:' + err.message)

            }

        } else {

            let index = -1;

            this.viewIssue.issue.labels.forEach((l, idx) => {
                if (l.id === el.id) index = idx;
            });

            if (index >= 0) {

                this.viewIssue.issue.labels.splice(index, 1);

                try {

                    gitIO.removeLabelInIssue(
                        this.req,
                        this.viewIssue.issue.id,
                        item.id
                    );

                } catch (err: any) {
                    console.info('changeLabel remove error:' + err.message)

                }
            }

        }

        this.requestUpdate();
    }

    private changeMembers(e: MouseEvent) {

        if (!this.viewIssue) return;

        let el = e.target as HTMLInputElement;

        if (el.tagName.toLocaleLowerCase() !== 'input') {
            el = el.closest('input') as HTMLInputElement;
        }

        let item: gitIO.IAssignees | undefined;


        this.myUsers.forEach((l, idx) => {
            if (l.login === el.id) {
                item = Object.assign({}, l);
            }
        });

        if (!item || !this.req) return;

        if (el.checked) {

            this.viewIssue.issue.assignees.push(item);
            try {

                gitIO.addMemberInIssue(
                    this.req,
                    this.viewIssue.issue.id,
                    item.id
                );

            } catch (err: any) {
                console.info('changeMembers add error:' + err.message)

            }

        } else {

            let index = -1;

            this.viewIssue.issue.assignees.forEach((l, idx) => {
                if (l.login === el.id) index = idx;
            });

            if (index >= 0) {
                this.viewIssue.issue.assignees.splice(index, 1);
                try {

                    gitIO.removeMemberInIssue(
                        this.req,
                        this.viewIssue.issue.id,
                        item.id
                    );

                } catch (err: any) {
                    console.info('changeMembers add error:' + err.message)

                }
            }

        }

        this.requestUpdate();
    }

    private async removeIssueInProject(e: MouseEvent) {

        if (!this.viewIssue || !this.itensShowProject || !this.req || !this.viewProject) return;

        let indexDel = -1;
        this.itensShowProject.forEach((i, index) => {
            if (this.viewIssue && i.issue.id === this.viewIssue.issue.id) {
                indexDel = index;
            }
        });

        if (indexDel < 0) return;

        this.itensShowProject.splice(indexDel, 1);

        try {
            gitIO.removeIssueInProject(this.req, this.viewProject.id, this.viewIssue.id);
        } catch (e: any) {
            console.info('removeIssueInProject:' + e.message)
        }

        this.viewIssue = undefined;
        this.requestUpdate();
    }

    private async isAutoClick() {

        if (this.autoClick !== 'true' || !this.req) return;

        this.isLoader = true;
        this.viewProject = this.myProjcts[0];

        if (this.viewProject && this.viewProject.fields.length <= 0) {

            this.viewProject.fields = await gitIO.getProjectFields(this.req, this.viewProject.id);

        }

        if (this.viewProject) {
            this.itensShowProject = await gitIO.getIssuesInProjects(this.req, this.viewProject.id);
        }

        this.isLoader = false;
        this.scenary = 'showStatus';

    }

    //---- TAB MODE

    private organizeItens(): { [key: string]: gitIO.IItemProject[] } | undefined {

        if (!this.itensShowProject || !this.contentstatus) return;

        const ret: { [key: string]: gitIO.IItemProject[] } = {};

        this.itensShowProject.forEach((i) => {

            const find = i.fieldValues.find((f) => f.fieldName.toLowerCase() === 'status');

            let id = find ? find.value : 'null';

            if (ret[id]) {
                ret[id].push(i);
            } else {
                ret[id] = [i];
            }

        });

        return ret;
    }

    private async showViewIssue(e: MouseEvent) {
        try {

            let el = e.target as HTMLElement;

            if (el.tagName.toLocaleLowerCase() !== 'itemstatusissues') {
                el = el.closest('itemstatusissues') as HTMLElement;
            }

            const p: gitIO.IItemProject = el && (el as any).info ? (el as any).info : undefined;

            if (!p || !this.req) return;

            p.issue.comments = await gitIO.getIssueComments(this.req, p.issue);

            this.viewIssue = p;


        } catch (e) {
            console.info(e)
        }
    }

    private clickCloseIssue(e: MouseEvent) {
        this.viewIssue = undefined;
    }

    private openMyChild(e: MouseEvent) {

        let el = e.target as HTMLElement;
        let open: string | null | undefined = el.getAttribute('open');

        if (!open) {
            open = el.parentElement?.getAttribute('open');
            if (!open) return;
        }

        const elsOpen = this.querySelectorAll('*[child]');

        if (!elsOpen) return;

        Array.from(elsOpen).forEach((i) => {

            const my = i.getAttribute('child');

            if (my === open) {

                const st = (i as HTMLElement).style.display;
                (i as HTMLElement).style.display = st === 'none' ? '' : 'none';

            } else {
                (i as HTMLElement).style.display = 'none';
            }

        });

    }

    private setDragAndDrop(active: boolean) {


        if (!active) {

            if (this.sort) {
                this.sort.forEach((i: any) => i.destroy())
            }

            return;
        }

        if ((window['Sortable' as any] as any)) {

            const columns = this.querySelectorAll('contentst');

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

                    evt.item.remove();
                    this.requestUpdate();

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

    //-----ICONS------

    private myIcons = {
        plus: `<svg style="width:13px;fill:var(--github-color-primary)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>`,
        git: `<svg style="width:20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>`,
        bars: `<svg style="width:20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M448 64c0-17.7-14.3-32-32-32L32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32L32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32z"/></svg>`,
        list: `<svg style="width:20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"/></svg>`,
        close: `<svg style="width: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`,
        table: `<svg style="width:15px;fill:var(--github-color-primary)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 256l0-96 160 0 0 96L64 256zm0 64l160 0 0 96L64 416l0-96zm224 96l0-96 160 0 0 96-160 0zM448 256l-160 0 0-96 160 0 0 96zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z"/></svg>`,
        card: `<svg style="width:15px;fill:var(--github-color-primary)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96l0 32 576 0 0-32c0-35.3-28.7-64-64-64L64 32zM576 224L0 224 0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-192zM112 352l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"/></svg>`,
        back2: `<svg style="width:15px;fill:var(--github-color-primary)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/></svg>`,
        back: `<svg xmlns="http://www.w3.org/2000/svg" style="width:15px;" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>`,
        member: `<svg xmlns="http://www.w3.org/2000/svg" style="width:12px;" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>`,
        label: `<svg xmlns="http://www.w3.org/2000/svg" style="width:12px;" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 80L0 229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7L48 32C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>`,
        trash: `<svg xmlns="http://www.w3.org/2000/svg" style="width:12px;" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>`,
        eye: `<svg xmlns="http://www.w3.org/2000/svg" style="width:12px;fill:var(--github-color-primary)" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>`

    }
}