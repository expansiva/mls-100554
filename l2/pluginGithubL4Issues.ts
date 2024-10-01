/// <mls shortName="pluginGithubL4Issues" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult, LitElement, repeat } from 'lit';
import { query, property, customElement } from 'lit/decorators.js';
import { getMyKeysBranch } from './_100554_libCommom';
import { PluginBaseModule } from './_100554_pluginBaseModule';


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


    private owner: string = '';
    private repo: string = '';
    private branch: string = '';
    private repositoryId: string = '';
    private error: string = '';

    private viewIssue: IIssues | undefined;
    private comments: IComments[] = [];

    @property() scenary: string = 'list';
    @property() myIssues: IIssues[] = [];


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

        if (this.scenary === 'list') return this.renderList();

        if (this.scenary === 'show') return this.renderShow();

        return html``;
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
                    this.myIssues, ((key: IIssues) => key.id) as any,
                    ((k: IIssues, index: any) => {

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
            <buttonnewissues>New issue</buttonnewissues>
        </div>
        `
    }

    renderListItem(item: IIssues, idx: number) {

        return html`
        <contentlistitem @click="${this.clickIssues}" .info=${item} filter="${item.title}">
            <div>
                <h3>${item.title}</h3>
                <contentlabels>
                    ${repeat(
            item.labels, ((key: ILabel) => key.name) as any,
            ((k: ILabel, index: any) => {

                return html`<contentlabel style="background:#${k.color}">${k.name}</contentlabel>`;

            }) as any
        )}
                </contentlabels>
            </div>
            <span>
                #${item.numberIssues} opened on ${new Date(item.createdAt).toLocaleString()} by ${item.author}
            </span>
        </contentlistitem>
        `
    }


    //-- SHOW

    renderShow() {

        if (!this.viewIssue) return html``;

        return html
            `
            
            <contentshow>
                <div>
                    <backbutton back="list" @click=${this.backButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/></svg>
                    </backbutton>
                    <h3>${this.viewIssue.title}</h3>
                    <contentlabels>
                        ${repeat(this.viewIssue.labels, (
                            (key: ILabel) => key.name) as any,
                            (
                                (k: ILabel, index: any) => {
                                    return html`<contentlabel style="background:#${k.color}">${k.name}</contentlabel>`;
                                }
                            ) as any
                        )}
                    </contentlabels>
                    
                </div>
                <span>
                    #${this.viewIssue.numberIssues} opened on ${new Date(this.viewIssue.createdAt).toLocaleString()} by ${this.viewIssue.author}
                </span>
                <contentshowcomments>
                    ${this.renderComments(this.viewIssue)}
                    ${repeat(this.comments, (
                        (key: IComments) => key.id) as any,
                        (
                            (k: IComments, index: any) => {
                                return this.renderComments(k);
                            }
                        ) as any
                    )}
                </contentshowcomments>
                <contentnewcomment> 
                    <h4>Add a comment</h4>
                    <textarea>
                    </textarea>
                    <div>
                        <button>Comment</button>
                    </div>
                </contentnewcomment>
            </contentshow>
        `;
    }

    renderComments(item: IComments) {
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
        await this.setRepositoryId();
        await this.getIssues();

    }

    private backButton(e: MouseEvent) {

        let el = e.target as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'backbutton') {
            el = el.closest('backbutton') as HTMLElement;
        }

        if (!el || !el.getAttribute('back')) return;

        this.scenary = el.getAttribute('back') as string;
    }

    private clickIssues(e: MouseEvent) {

        let el = e.target as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'contentlistitem') {
            el = el.closest('contentlistitem') as HTMLElement;
        }

        if (!el || !(el as any).info) return;

        this.getIssue((el as any).info);

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


    //------IO----------

    private async getIssues() {

        try {

            if (!this.owner || !this.repo) throw new Error('Not found owner project')

            const q = `
                query repository {
                    repository(owner: "${this.owner}", name: "${this.repo}") {
		                id
			            issues(last: 100) {
                            edges {
                                node {
                                    id
                                    number
                                    createdAt
                                    title
                                    bodyText
                                    state
                                    url
                                    author{
                                        login
                                        avatarUrl
                                    }
                                    labels(last:20){
                                        nodes{
                                            color
                                            name
                                        }
                                    }
                                }
                            }
                        } 
                    }
                }
            `;

            const ret = await this.qlFetch(q);

            const issues: IIssues[] = []

            if (!ret || !ret.repository || !ret.repository.issues || !ret.repository.issues.edges) {
                return
            }

            ret.repository.issues.edges.forEach((i: any) => {


                if (!i || !i.node) return;
                const issue = {} as IIssues;
                issue.id = i.node.id;
                issue.numberIssues = i.node.number;
                issue.createdAt = i.node.createdAt;
                issue.title = i.node.title;
                issue.bodyText = i.node.bodyText;
                issue.state = i.node.state;
                issue.url = i.node.url;
                issue.author = i.node.author.login;
                issue.avatarUrl = i.node.author.avatarUrl;
                issue.labels = i.node.labels.nodes;

                issues.push(issue);

            });

            this.myIssues = issues.sort((a, b) => {
                return b.numberIssues - a.numberIssues;
            });
        } catch (e) {
            console.info(e)
        }


    }

    private async getIssue(issue: IIssues) {

        try {

            if (!this.owner || !this.repo) throw new Error('Not found owner project')

            const q = `
                query {
                    repository(owner: "${this.owner}", name: "${this.repo}") {
                        issue(number: ${issue.numberIssues}) {
                            comments(last:100){
                                nodes{
                                    createdAt
                                    id
                                    bodyText
                                    author{
                                        login,
                                        avatarUrl
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            const ret = await this.qlFetch(q);

            const comments: IComments[] = []

            if (!ret || !ret.repository || !ret.repository.issue || !ret.repository.issue.comments || !ret.repository.issue.comments.nodes) {
                return
            }

            ret.repository.issue.comments.nodes.forEach((i: any) => {


                if (!i) return;
                const com = {} as IComments;
                com.id = i.id;
                com.createdAt = i.createdAt;
                com.bodyText = i.bodyText;
                com.author = i.author.login;
                com.avatarUrl = i.author.avatarUrl;
                comments.push(com);

            });

            this.comments = comments;
            this.viewIssue = issue;

            this.scenary = 'show';

        } catch (e) {
            console.info(e)
        }


    }

    private async initInfoProject() {

        const prj = mls.actual[5].project;
        if (!prj) return;

        const info = getMyKeysBranch(prj);
        if (!info) return;

        this.branch = info.branch;
        this.owner = "santiagoExpansiva"; //info.owner;
        this.repo = "testGit"; //info.repo;

    }

    private async setRepositoryId() {

        try {

            if (!this.owner || !this.repo) throw new Error('Not found owner project')

            const q = `
                query { 
                    repository(owner: "${this.owner}", name: "${this.repo}") { id } 
                }
            `;

            const ret = await this.qlFetch(q);

            if (!ret || !ret.repository || !ret.repository.id) {
                this.error = 'Not found repositoryId';
                return;
            }

            this.repositoryId = ret.repository.id;

        } catch (e) {
            console.info(e)
        }


    }


    private qlFetch(query: string, variables?: {}): Promise<any> {

        return new Promise<any>(async (resolve, reject) => {

            try {

                const info = await this.myFetch(query, variables);

                if (!info || info.status !== 200) {
                    reject(new Error('Erro status: ' + info.status + '; ' + info.ret.message));
                    return;
                }

                if (info.ret.errors) {
                    reject(new Error('Erro' + info.ret.errors[0].message));
                    return;
                }

                resolve(info.ret.data);

            } catch (er) {

                reject(er);

            }


        });
    }


    private myFetch(query: string, variables?: {}): Promise<{ status: number, ret: any }> {

        return new Promise<{ status: number, ret: any }>((resolve, reject) => {

            try {

                const body: { query: string, variables?: {} } = { query };

                if (variables) body.variables = variables;
                let status = 0;
                fetch('https://api.github.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: 'bearer ' + this.mKey
                    },
                    body: JSON.stringify(body)

                }).then((r) => {
                    status = r.status;
                    return r.json();
                }).then((data) => {
                    resolve({ status, ret: data });
                }).catch((e) => reject(e));

            } catch (er) {

                reject(er);

            }

        });

    }


    //----------CSS--------------------

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
        }

        contentlistissues{
            display: flex;
            flex-direction: column;
            padding: .5rem;
        }

        contentlistitem{
            cursor:pointer;
            display: flex;
            flex-direction: column;
            margin-bottom: 1rem;
            border-bottom: 1px solid var(--bg-secondary-color);
            padding-bottom: .5rem;
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
            display:block;
            padding-top: 2rem;
            border-top: 1px solid var(--bg-secondary-color);
            margin-top: .5rem;
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
        }

        contentnewcomment h4{
            margin: 0;
            color: var(--text-primary-color-lighter);
            font-size: 1.1rem;
        }
    `;


}

interface IIssues {
    id: string,
    numberIssues: number,
    createdAt: string,
    title: string,
    bodyText: string,
    state: string,
    url: string,
    author: string,
    avatarUrl: string,
    labels: ILabel[]

}

interface ILabel {
    color: string,
    name: string
}

interface IComments {
    createdAt: string,
    id: string,
    bodyText: string,
    author: string
    avatarUrl: string
}