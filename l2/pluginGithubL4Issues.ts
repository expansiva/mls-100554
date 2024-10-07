/// <mls shortName="pluginGithubL4Issues" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult, LitElement, repeat } from 'lit';
import { query, property, customElement } from 'lit/decorators.js';
import { getMyKeysBranch } from './_100554_libCommom';
import * as gitIO from './_100554_libGithubIo';

//import { PluginBaseModule } from './_100554_pluginBaseModule';


export const pluginData: mls.plugin.IPluginData = {
    title: "GitHub Issues",
    getSvg(): TemplateResult {
        return svg`
        <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>        
    `;
    }
};

@customElement('plugin-github-l4-issues-100554')
export class PluginGithubL4Issues extends LitElement {

    private repositoryId: string = '';
    private error: string = '';
    private userInfo: gitIO.IInfo | undefined;
    private labelId: string = '';
    private req: gitIO.IReq | undefined;

    private viewIssue: gitIO.IIssues | undefined;
    private comments: gitIO.IComments[] = [];

    @property() scenary: string = 'list';
    @property() myIssues: gitIO.IIssues[] = [];
    @property() isLoader: boolean = true;

    @query('contentlistissues') contentlistissues: HTMLElement | undefined;


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

        if (this.scenary === 'show') return this.renderShow();

        if (this.scenary === 'new') return this.renderNewIssue();

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


    //-- LIST

    renderList(): TemplateResult {

        if (this.myIssues.length <= 0) return html`<h3>No issues</h3>`;

        return html`
            ${this.renderListFilter()}
            <contentlistissues>
                ${repeat(
            this.myIssues, ((key: gitIO.IIssues) => key.id) as any,
            ((k: gitIO.IIssues, index: any) => {

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
                <input type="text" @input="${this.filter}"style="border:none;border-right:1px solid #dfdfdf;outline:none;height:25px; width:calc(100% - 30px)" placeholder="Filter issues ...">
                <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
            </div>
            <buttonnewissues @click="${this.clickScenaryNew}">New issue</buttonnewissues>
        </div>
        `
    }

    renderListItem(item: gitIO.IIssues, idx: number) {

        return html`
        <contentlistitem @click="${this.clickIssues}" .info=${item} filter="${item.title}">
            <div>
                <h3>${item.title}</h3>
                <contentlabels>
                    ${repeat(item.labels,
                    ((key: gitIO.ILabel) => key.name) as any,
                    ((k: gitIO.ILabel, index: any) => {
                        return html`<contentlabel style="background:#${k.color}">${k.name}</contentlabel>`;

                    }) as any
                )}
                </contentlabels>
            </div>
            <span>
                #${item.numberIssues} opened on ${new Date(item.createdAt).toLocaleString()} by ${item.author}
            
                <contentthumb style="float:right">
                    <svg style="width:15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z"/></svg>
                    (${item.reactionsTU})
                </contentthumb>
            </span>
        </contentlistitem>
        `
    }

    //-- New ISSUE

    renderNewIssue() {

        if (!this.userInfo) return html``;

        return html`
            <contentnewissue>

                <backbutton back="list" style="align-items: self-end;" @click=${this.backButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/></svg>
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
                    <div>
                        <buttonnewissues @click="${this.addNewIssue}">Add new issue</buttonnewissues>
                    </div>
                </div>
                
            </contentnewissue>
        `

    }


    //-- SHOW

    renderShow() {

        if (!this.viewIssue || !this.userInfo) return html``;

        return html
            `
            
            <contentshow>
                <div>
                    <backbutton back="list" @click=${this.backButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/></svg>
                    </backbutton>
                    <h3>${this.viewIssue.title}</h3>
                    <contentlabels>
                        ${repeat(this.viewIssue.labels,
                            ((key: gitIO.ILabel) => key.name) as any,
                            ((k: gitIO.ILabel, index: any) => {
                                return html`<contentlabel style="background:#${k.color}">${k.name}</contentlabel>`;
                            }) as any
                        )}
                    </contentlabels>
                </div>
                <span style="margin-left:42px;">
                    #${this.viewIssue.numberIssues} opened on ${new Date(this.viewIssue.createdAt).toLocaleString()} by ${this.viewIssue.author}

                    ${this.renderThumbsUp()}
                </span>
                <contentshowcomments>
                    ${this.renderComments(this.viewIssue)}
                    ${repeat(this.comments,
                        ((key: gitIO.IComments) => key.id) as any,
                        ((k: gitIO.IComments, index: any) => {
                            return this.renderComments(k);
                        }) as any
                    )}
                </contentshowcomments>
                <contentnewcomment> 
                    <h4>Add a comment</h4>
                    <textarea>
                    </textarea>
                    <div>
                        <button @click="${this.clickNewComment}">Comment</button>
                    </div>
                </contentnewcomment>
            </contentshow>
        `;
    }

    renderThumbsUp() {

        if (!this.viewIssue || !this.userInfo) return html``;

        const react = this.viewIssue.reactions.find((i) => i.user === this.userInfo?.login);
        if (react) {

            return html`
                <votethumbsup .issue=${this.viewIssue} .react=${react} @click="${this.removeVote}">
                    <svg style="width:15px; fill:#e4e42e" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z"/></svg>(${this.viewIssue.reactionsTU})
                </votethumbsup>
            `;
            
        }

        return html`
            <votethumbsup @click="${this.addVote}">
                <svg style="width:15px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z"/></svg>(${this.viewIssue.reactionsTU})
            </votethumbsup>
        `;
        
    }

    renderComments(item: gitIO.IComments) {
        return html`
            <itemcomment>
                <commentavatar>
                    <img src="${item.avatarUrl}" title="${item.author}">
                </commentavatar>
                <boxcomment>
                    <boxcommentheader>
                        <h4>${item.author}</h4>
                        <span>
                            ${new Date(item.createdAt).toLocaleString()}
                        </span>
                    </boxcommentheader>

                    <boxcommentbody>
                        ${item.bodyText}
                    </boxcommentbody>
                </boxcomment>
            </itemcomment>
        `;
    }

    //----------IMPLEMENTATION--------------------

    private async setInfos() {

        await this.initInfoProject();
        if (!this.req) return;

        this.userInfo = await gitIO.getUserInfoIO(this.req);
        this.repositoryId =  await gitIO.getRepositoryId(this.req);
        this.myIssues =  await gitIO.getIssues(this.req);
        this.labelId = await gitIO.getLabelIdOrAdd(this.req, this.repositoryId);
        this.isLoader = false;

    }

    private clickScenaryNew() {
        this.scenary = 'new';
    }

    private async removeVote(e: MouseEvent) {

        if (!this.viewIssue || !this.userInfo || !this.req) return;

        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'votethumbsup') {
            el = el.closest('votethumbsup') as HTMLElement;
        }

        if (!el || !(el as any).react) return;

        const isRemove = await gitIO.removeReact(
            this.req,
            this.viewIssue.id,
            (el as any).react.id
        );

        if (!isRemove) return;

        this.viewIssue.reactionsTU--;

        let idx = -1;
        this.viewIssue.reactions.forEach((i, index) => {

            if (i.user === this.userInfo?.login) idx = index;

        });

        if (idx >= 0) {
            this.viewIssue.reactions.splice(idx, 1);
        }

        this.requestUpdate();
    }

    private async addVote(e: MouseEvent) {

        if (!this.viewIssue || !this.userInfo || !this.req) return;

        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'votethumbsup') {
            el = el.closest('votethumbsup') as HTMLElement;
        }

        if (!el) return;

        const idAdd = await gitIO.addReact(this.req, this.viewIssue.id);

        if (!idAdd) return;

        this.viewIssue.reactionsTU++;

        this.viewIssue.reactions.push({
            id: idAdd,
            user: this.userInfo.login
        });

        this.requestUpdate();
    }

    private backButton(e: MouseEvent) {

        let el = e.target as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'backbutton') {
            el = el.closest('backbutton') as HTMLElement;
        }

        if (!el || !el.getAttribute('back')) return;

        this.scenary = el.getAttribute('back') as string;
    }

    private async clickIssues(e: MouseEvent) {

        let el = e.target as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'contentlistitem') {
            el = el.closest('contentlistitem') as HTMLElement;
        }

        if (!el || !(el as any).info || !this.req) return;

        this.comments = await gitIO.getIssue(this.req, (el as any).info as gitIO.IIssues);
        this.viewIssue = (el as any).info;
        this.scenary = 'show';

    }

    private async addNewIssue(e: MouseEvent) {

        let el = e.target as HTMLElement;

        el = el.closest('contentnewissue') as HTMLElement;

        if (!el) return;

        const eltitle = el.querySelector('#inputtitle') as HTMLInputElement;
        const eldesc = el.querySelector('#inputdesc') as HTMLInputElement;

        if (!eltitle || !eldesc) return;

        if (!eltitle.value || !eldesc.value || !this.req || !this.repositoryId || !this.userInfo) {
            alert('Fill in all the information!');
            return;
        }

        this.isLoader = true;
        const issue = await gitIO.addNewIssueIO(
            this.req,
            this.userInfo,
            this.repositoryId,
            this.labelId,
            eltitle.value,
            eldesc.value
        );

        if (!issue) {
            this.error = 'Erro to add issue';
            return;
        }

        this.myIssues.unshift(issue);
        this.isLoader = false;
        this.scenary = 'list';


    }

    private timeFilter = 0;
    private filter(e: KeyboardEvent) {
        const el = e.target as HTMLInputElement;

        clearTimeout(this.timeFilter)
        this.timeFilter = setTimeout(() => {

            const val = el.value.toLocaleLowerCase();
            const all = this.contentlistissues?.querySelectorAll('contentlistitem');
            if (!all) return;

            Array.from(all).forEach((i) => {

                (i as HTMLElement).style.display = '';
                const f = i.getAttribute('filter') as string;
                if (f.toLocaleLowerCase().indexOf(val) < 0) {
                    (i as HTMLElement).style.display = 'none';
                }

            });

        }, 500);
    }

    private async clickNewComment(e: MouseEvent) {

        let el = e.target as HTMLElement;
        if (!el) return;
        el = el.closest('contentnewcomment')?.querySelector('textarea') as HTMLTextAreaElement;

        if (!el || !this.req || !this.viewIssue) return;

        const v = (el as HTMLTextAreaElement).value;
        (el as HTMLTextAreaElement).value = '';
        if (!v) return;

        this.isLoader = true;

        const com = await gitIO.addComment(this.req, this.viewIssue, v);

        if (!com) {
            this.error = 'Erro add comment';
            return;

        }

        this.comments.push(com);
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

    //----------CSS--------------------

    static styles = css`
    
        :host {
            font-family: var(--font-family-primary);
            display:block;
            height: 100%;
            overflow: auto;
            background: var(--bg-primary-color);
            font-size: var(--font-size-16);
        }   

        backbutton{
            width: 20px;
            display: flex;
            transform: rotate(180deg);
            cursor: pointer;
            margin-right:15px
        }

        buttonnewissues{
            background: #1c8139;
            color: #fff;
            padding: .5rem;
            border: none;
            border-radius: 8px;
            display: flex;
            height: 17px;
            justify-content: center;
            align-items: center;
            font-size: 1rem;
            cursor:pointer;
        }

        buttonnewissues:hover{
            background:#22a547
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

        contentlabels{
            display: flex;
            align-items: center;
            gap: .5rem;
        }

        contentlabels contentlabel{
            border-radius: 18px;
            min-width: 49px;
            display: flex;
            justify-content: center;
            font-size: .95rem;
            color: #fff;
            padding: 0 .5rem;
        }




        contentshow{
            cursor:pointer;
            display: flex;
            flex-direction: column;
            padding: .5rem;
        }

        contentshow votethumbsup{
            float:right;
            cursor:pointer;
        }

        contentshow div{
            display: flex;
            justify-content: left;
            align-items: center;
            gap: .5rem;
        }

        contentshow h3{
            margin: 0;
        }

        contentshow span{
            font-size: 1rem;
            color: var(--grey-color-darker);
        }

        contentshowcomments{
            height: calc(-363px + 100vh);
            overflow-y: auto;
            display: block;
            padding-top: 2rem;
            border-top: 1px solid var(--bg-secondary-color);
            margin-top: 0.5rem;
            border-bottom: 1px solid var(--bg-secondary-color);
        }

        contentshowcomments itemcomment{
            display: flex;
            gap: .5rem;
            margin-bottom: 2rem;
        }

        contentshowcomments commentavatar{
            display: block;
        }

        contentshowcomments commentavatar img{
            width: 35px;
            border-radius: 50%;
            border: 1px solid var(--bg-secondary-color);
        }

        contentshowcomments boxcomment{
            display: block;
            width: 100%;
            border-radius: 10px;
            border: 1px solid #ddf4ff;
        }

        contentshowcomments boxcommentheader{
            display: flex;
            align-items: center;
            gap: .8rem;
            background: #ddf4ff;
            padding-left: .5rem;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            position:relative;
        }

        contentshowcomments boxcommentheader::before{   
            position: absolute;
            width: 6px;
            content: ' ';
            height: 12px;
            top: 8px;
            left: -8px;
            background: #ddf4ff;
            clip-path: polygon(0 50%, 100% 100%, 100% 0);
        }

        contentshowcomments boxcommentheader h4{
            margin: 0px;
        }

        contentshowcomments boxcommentbody{
            padding: 1rem;
            display: block;
        }

        contentnewcomment{
            display: flex;
            flex-direction: column;
            padding: 1rem;
            justify-content: center;
            gap: .5rem;
        }

        contentnewcomment textarea{
            border: 1px solid #ddddde;
            width: 100%;
            border-radius: 4px;
            height: 150px;
            outline: none;
            padding: .5rem;
        }

        contentnewcomment div{
            display: flex;
            align-items: end;
            justify-content: end;
            gap: .5rem;
        }

        contentnewcomment button{
            background: #1c8139;
            color: #fff;
            padding: .5rem;
            border: none;
            border-radius: 8px;
            cursor:pointer;
        }

        contentnewcomment button:hover{
            background: #22a547;
        }

        contentnewcomment h4{
            margin: 0;
            color: var(--text-primary-color-lighter);
            font-size: 1.1rem;
        }





        contentnewissue{
            display: flex;
            justify-content: center;
            gap: .5rem;
            padding-top: 1rem;
        }

        contentnewissue input{
            width: 100%;
            border-radius: 5px;
            outline: none;
            padding-left: .2rem;
            height: 25px;
            border: 1px solid var(--bg-secondary-color-darker);
        }

        contentnewissue textarea{
            width: 100%;
            border-radius: 5px;
            outline: none;
            padding-left: .2rem;
            height: 120px;
            border: 1px solid var(--bg-secondary-color-darker);
        }

        contentnewissue h4{
            margin:0px;
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

