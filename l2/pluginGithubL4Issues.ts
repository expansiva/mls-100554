/// <mls shortName="pluginGithubL4Issues" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult, LitElement, repeat, unsafeHTML } from 'lit';
import { query, property, customElement } from 'lit/decorators.js';
import { getMyKeysBranch } from '/_100554_/l2/libCommom.js';
import * as gitIO from '/_100554_/l2/libGithubIo.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js'; 

export const pluginData: mls.plugin.IPluginData = {
    title: "GitHub Issues",
    getSvg(): TemplateResult {
        return svg`
        <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>        
    `;
    }
};

@customElement('plugin-github-l4-issues-100554')
export class PluginGithubL4Issues extends CollabLitElement {

    private repositoryId: string = '';
    private userInfo: gitIO.IInfo | undefined;
    private labelId: gitIO.ILabelsCollab | undefined;
    private req: gitIO.IReq | undefined;

    private viewIssue: gitIO.IIssues | undefined;
    private comments: gitIO.IComments[] = [];

    @property() error: string = '';
    @property() scenary: string = 'list';
    @property() myIssues: gitIO.IIssues[] = [];
    @property() isLoader: boolean = true;
    @property() labelfilter: string = '';

    @query('contentlistissues') contentlistissues: HTMLElement | undefined;


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

        return html`<h3 style="color: var(--text-primary-color); padding: 2rem; text-align: center;">${this.error}</h3>`
    }


    //-- LIST

    renderList(): TemplateResult {

        if (this.myIssues.length <= 0) {

            return html`
            ${this.renderListFilter()}
            <h3 style="padding:0rem 4rem">No issues</h3>
            `;
        }

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
                <input type="text" @input="${this.filter}"style="border:none;border-right:1px solid #dfdfdf;outline:none;height:25px; width:calc(100% - 30px);background: #fff;" placeholder="Filter issues ...">
                <svg xmlns="http://www.w3.org/2000/svg" style="width:15px;fill:var(--github-color-sucess);" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
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
                return html`<contentlabel style="background:#${k.color}3b; color:#${k.color}; border: 1px solid #${k.color}">${k.name}</contentlabel>`;

            }) as any
        )}
                </contentlabels>
            </div>
            <span>
                #${item.numberIssues} opened on ${new Date(item.createdAt).toLocaleString()} by ${item.author}  <span style="margin-left:1rem">project: ${!item.project? 'none yet' : item.project.title}</span>
            
                <contentthumb style="float:right">
                    <svg style="width:15px;fill:var(--github-color-sucess);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z"/></svg>
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
                    <svg style="fill:var(--github-color-sucess);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/></svg>
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
                        <svg style="fill:var(--github-color-sucess);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/></svg>
                    </backbutton>
                    <h3>${this.viewIssue.title}</h3>
                    <contentlabels>
                        ${this.renderThumbsUp()}
                        ${repeat(this.viewIssue.labels,
                ((key: gitIO.ILabel) => key.name) as any,
                ((k: gitIO.ILabel, index: any) => {
                    return html`<contentlabel style="background:#${k.color}3b; color:#${k.color}; border: 1px solid #${k.color}">${k.name}</contentlabel>`;
                }) as any
            )}
                    </contentlabels>
                </div>
                <span style="margin-left:42px;">
                    #${this.viewIssue.numberIssues} opened on ${new Date(this.viewIssue.createdAt).toLocaleString()} by ${this.viewIssue.author}

                    
                </span>
                ${this.renderCogs()}
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

    renderCogs() {

        return html`
            <contentissuescogs>
                <span status="close" @click="${this.clickCogs}">
                    <svg style="width:15px; fill:var(--github-color-sucess);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
                </span>
                <contentissuescogsinfo style="display:none">
                    <div style="display:flex: gap:.5rem; align-items: center;">
                        <label>Priorities:</label>
                        <select @change="${this.changeLabelPrioriti}">
                            <option value=""></option>
                            <option value="${this.labelId?.low}">Low</option>
                            <option value="${this.labelId?.medium}">Medium</option>
                            <option value="${this.labelId?.high}">High</option>
                        </select>
                    </div>
                    <button>Close Issue</button>
                </contentissuescogsinfo>
            </contentissuescogs>
        
        `

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
                <svg style="width:15px; fill:var(--github-color-sucess);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z"/></svg>(${this.viewIssue.reactionsTU})
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
                        ${unsafeHTML(item.bodyText)}
                    </boxcommentbody>
                </boxcomment>
            </itemcomment>
        `;
    }

    //----------IMPLEMENTATION--------------------

    private async setInfos() {

        try {
            await this.initInfoProject();
            if (!this.req) return;

            this.userInfo = await gitIO.getUserInfoIO(this.req);
            this.repositoryId = await gitIO.getRepositoryId(this.req);
            this.myIssues = await gitIO.getIssues(this.req);
            this.filterMyIssues();
            this.labelId = await gitIO.getLabelIdOrAdd(this.req, this.repositoryId);
            this.isLoader = false;
        } catch (e: any) {
            this.error = e; 
        }

    }

    private clickCogs(e: MouseEvent) {

        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'span') {
            el = el.closest('span') as HTMLElement;
        }

        const parent = el.parentElement;
        const contentissuescogsinfo = parent?.querySelector('contentissuescogsinfo') as HTMLElement;

        if (!contentissuescogsinfo) return;

        if (el.getAttribute('status') === 'close') {
            el.setAttribute('status', 'open');
            contentissuescogsinfo.style.display = '';
        } else {
            el.setAttribute('status', 'close');
            contentissuescogsinfo.style.display = 'none';
        }

    }

    private async changeLabelPrioriti(e: MouseEvent) {

        if (!this.viewIssue || !this.req) return;

        let el = e.target as HTMLSelectElement;
        if (el.tagName.toLocaleLowerCase() !== 'select') {
            el = el.closest('select') as HTMLSelectElement;
        }

        if (el.value === '') return;

        let hasItem = false;
        let idLabelHas = '';
        let index = -1;
        this.viewIssue.labels.forEach((i, idx) => {

            if (['low', 'medium', 'high'].includes(i.name)) {
                idLabelHas = i.id;
                index = idx;
            }

            if (i.id === el.value) hasItem = true;
        })

        if (hasItem) return;

        this.isLoader = true;

        const info = await gitIO.addLabelInIssue(this.req, this.viewIssue.id, el.value);

        if (index >= 0) {

            this.viewIssue.labels.splice(index, 1);
            await gitIO.removeLabelInIssue(this.req, this.viewIssue.id, idLabelHas);

        }

        if (info) this.viewIssue.labels.push(info);

        this.isLoader = false;
        this.requestUpdate();

    }

    private filterMyIssues() {

        if (!this.labelfilter || !this.myIssues) return;

        const itens: gitIO.IIssues[] = [];
        this.myIssues.forEach((i) => {

            const find = i.labels.find((l) => l.name === this.labelfilter);
            if (!find) return;
            itens.push(Object.assign({}, i));

        });

        this.myIssues = itens;
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

        this.comments = await gitIO.getIssueComments(this.req, (el as any).info as gitIO.IIssues);
        this.viewIssue = (el as any).info;
        this.scenary = 'show';

    }

    private async addNewIssue(e: MouseEvent) {

        let el = e.target as HTMLElement;

        el = el.closest('contentnewissue') as HTMLElement;

        if (!el) return;

        const eltitle = el.querySelector('#inputtitle') as HTMLInputElement;
        const eldesc = el.querySelector('#inputdesc') as HTMLInputElement;

        if (!eltitle || !eldesc || !this.labelId) return;

        if (!eltitle.value || !eldesc.value || !this.req || !this.repositoryId || !this.userInfo) {
            alert('Fill in all the information!');
            return;
        }

        this.isLoader = true;
        const issue = await gitIO.addNewIssueIO(
            this.req,
            this.userInfo,
            this.repositoryId,
            [this.labelId.feature],
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


}