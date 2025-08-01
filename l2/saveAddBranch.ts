/// <mls shortName="saveAddBranch" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, repeat, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getMyKeysBranch } from './_100554_libCommom';

export const initServiceSaveaddBranch = () => {
}

@customElement('save-add-branch-100554')
export class ServiceSaveAddBRanch extends LitElement {

    @property() hint: string | undefined;

    public callBack: Function | undefined;

    private owner: string = '';
    private repo: string = '';
    private branch: string = '';
    private branchMain: { name: string }[] = [];

    private listForks: mls.stor.others.IFork[] = []

    private error: string = '';

    private driver: mls.stor.others.DriverIOBase | undefined;

    private mode: string = 'list';

    // -------------  WEBCOMPONENT -------------

    connectedCallback() {
        super.connectedCallback();
        this.init();
    }

    render() {

        if (this.mode === 'list') {
            return this.renderModeList();
        } else {
            return this.renderModeAdd();
        }

    }

    renderModeList() {
        return html`
            <div class="contentAllBranch">
                <div style="display:flex; gap:1rem; font-size:.95rem; padding-bottom: .5rem; position: relative">

                    <div>
                        <span style="font-weight:600">Owner:</span>
                        <span>${this.owner}</span> 
                    </div>
                    <div>
                        <span style="font-weight:600">Repo:</span>
                        <span>${this.repo}</span> 
                    </div>
                    <div>
                        <span style="font-weight:600">Branch:</span>
                        <span>${this.branch}</span> 
                    </div>
                </div>
                <div class="clsHeader">
                    
                    <div class="contentInput">
                        <input placeholder="Filter..."></input>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                        </button>
                    </div>
                    <button class="btn" @click="${this.addClick}">
                        <svg style=" width: 15px;" xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                        New Branch
                    </button>
                </div>
                ${this.renderBranchs()}
                ${this.renderForks()}
            </div>
        `;
    }

    renderModeAdd() {
        return html`
        <div class="contentAllBranch">
            <div style="display:flex; gap:1rem; font-size:.95rem; padding-bottom: .5rem; position: relative">

                <div>
                    <span style="font-weight:600">Owner:</span>
                    <span>${this.owner}</span> 
                </div>
                <div>
                    <span style="font-weight:600">Repo:</span>
                    <span>${this.repo}</span> 
                </div>
                <div>
                    <span style="font-weight:600">Branch:</span>
                    <span>${this.branch}</span> 
                </div>
            </div>
            <div class="grp_form">
                <div>
                    <labe>New Branch:</label>
                    <input type="text"></input>
                </div>
                <div class="grp_btn">
                    <button class="btn" style="padding:.5rem" @click="${this.addBranch}">
                        <svg style=" width: 15px;" xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                        Add
                    </button>

                    <button class="btn" style="background:#ff6b00; padding:.5rem" @click="${this.cancel}">
                        <svg style="width:15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#fff"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/></svg>
                        Cancel
                    </button>
                </div>
                <div class="load" style="display:none">
                    <svg class="spinner" style=" width: 60px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>
                </div>
                <div style="color:red;">
                    ${this.error}
                </div>
            </div>
        </div>
        `
    }

    renderBranchs() {
        return html`
        <h4>Branches</h4>
        <ul>
            ${repeat(this.branchMain, ((key: any) => key) as any,
            ((item: any, index: any) => {

                return this.renderItem(item, index);

            }) as any
        )}
        </ul>`;
    }

    renderForks() {

        if (this.listForks.length <= 0) return html``;

        return html`
        <h4>Forks</h4>
        <ul>
            ${repeat(this.listForks, ((key: any) => key) as any,
            ((item: any, index: any) => {

                return this.renderItemFork(item, index);

            }) as any
        )}
        </ul>`;
    }

    renderItem(obj: { name: string }, index: number) {
        return html`
            <li @click="${this.setItem}" .info=${obj}>
                <input type="radio" id="item-${index}" name="optBranch" value="${obj.name}">
                <label for="item-${index}">
                    ${obj.name}
                </label>
            
            </li>
        
        `
    }

    renderItemFork(obj: mls.stor.others.IFork, index: number) {
        return html`
            <li @click="${this.setItemFork}" .info=${obj}>
                <input type="radio" id="item-${index}" name="optFork" value="${obj.nameWithOwner}">
                <label for="item-${index}">
                    ${obj.nameWithOwner}
                </label>
            
            </li>
        
        `
    }

    // ------------- IMPLEMENTATION -------------

    private async init() {
        const prj = mls.actualProject;
        if (!prj) return;

        if (!this.driver)
            this.driver = mls.stor.others.getDefaultDriver(prj);

        const info = getMyKeysBranch(prj)
        this.branch = info.branch;
        this.owner = info.owner;
        this.repo = info.repo;;

        this.getInfosRepo();
    }

    private cancel(): void {
        this.mode = 'list';
        this.error = '';
        this.requestUpdate();
    }

    private addClick(): void {
        this.mode = 'add';
        this.requestUpdate();
    }

    private async addBranch(e: MouseEvent) {

        const el = e.target as HTMLElement;
        if (!el) return;

        const g = el.closest('.grp_form');
        if (!g) return;

        const ipt = g.querySelector('input');
        if (!ipt) return;

        if (ipt.value === '') {
            this.error = 'Erro: invalid name';
            this.requestUpdate();
            return;
        }

        const load = g.querySelector('.load') as HTMLElement;
        if (!load) return;

        load.style.display = '';
        try {

            await this.addNewBranch(ipt.value);
            this.mode = 'list';
            ipt.value = '';
            load.style.display = 'none';
            this.getInfosRepo();

        } catch (e: any) {
            this.error = 'Erro: ' + e.message;
            console.info(e);
            load.style.display = 'none';
            this.requestUpdate();
        }

    }

    private async addNewBranch(name: string) {

        if (!this.driver) throw new Error('Not found driver');

        if (!name) throw new Error('Name invalid');

        const prj = mls.actualProject;
        if (!prj) throw new Error('Project invalid');

        await this.driver.createNewBranch({ owner: this.owner, repo: this.repo, branch: this.branch, newBranch: name });

    }

    private async getInfosRepo() {

        if (!this.driver) return;

        const ret = await this.driver.listBranches(this.owner, this.repo);
        const fork = await this.driver.listForks(this.owner, this.repo);

        this.listForks = fork;
        this.branchMain = ret;
        this.requestUpdate();
    }

    private setItem(e: MouseEvent) {

        e.stopPropagation();
        e.preventDefault();

        const el = e.target as HTMLElement;
        if (!el) return;

        const li = el.closest('li') as any;
        if (!li) return;

        if (!this.callBack) return;
        this.callBack(li.info);
    }

    private setItemFork(e: MouseEvent) {

        e.stopPropagation();
        e.preventDefault();

        const el = e.target as HTMLElement;
        if (!el) return;

        const li = el.closest('li') as any;
        if (!li) return;

        if (!this.callBack) return;
        this.callBack(li.info);
    }

    // -------------  CSS -------------

    static styles = css`
        :host {
            padding: 1rem; 
        }

        .contentAllBranch{
            padding: 1rem; 
            position:relative;
        }

        .clsHeader{
            display:flex;
            gap:.5rem;
        }

        .btn{
            background: #007bff; 
            color: #fff;
            border:none;
            border-radius:5px;
            display:flex;
            justify-content: center; 
            align-items: center;
            gap:.3rem;
            cursor:pointer;
            
        }

        .contentInput{
            display: flex; 
            justify-content: start; 
            align-items: center; 
            border: 1px solid #ced4da; 
            border-radius:5px; 
            width:calc(100% - 140px);
            height:25px;
    
        }

        .contentInput input{
            border:none; 
            width:calc(100% - 30px);
            outline: none;
        }

        .contentInput button{
            width:25.5px; 
            border:none; 
            border-radius:0px;
            height:25px;
        }

        ul{
            list-style: none;
            margin: 0px;
            padding: 0px;
            padding-left: .5rem;
        }

        ul li{
            display:flex;
            justify-content: start; 
            align-items: center; 
            gap:.3rem;
        }

        ul li label{
            display:flex;
            justify-content: start; 
            align-items: center; 
            gap:.3rem;
            cursor:pointer;
            font-size:.98rem;
        }

        .grp_form{
            padding:1rem;
            padding-top:3rem;
            display:flex;
            flex-direction:column;
            gap:.8rem;
            justify-content:center;
            align-items:center;
            border:1px solid #dfdfdf;
            border-radius:5px;
        }

        .grp_form input{
            border-radius:5px;
            border: 1px solid #dfdfdf;
            height: 23px;
            width: 250px;
            outline: none;
        }

        .grp_btn{
            display:flex;
            gap:1rem
        }

        .load{
            position:absolute;
            width:100%;
            height:100%;
            display:flex;
            justify-content:center;
            align-items:center;
            background:#dfdfdf;
            margin-top:10px;

        }

        .spinner {
            animation: spin 2s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `;
}