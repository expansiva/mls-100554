/// <mls shortName="saveAddBranch" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, repeat, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export const initServiceSaveaddBranch = () => {
}

@customElement('save-add-branch-100554')
export class ServiceSaveAddBRanch extends LitElement {

    @property() hint: string | undefined;

    public callBack: Function | undefined;

    private owner: string = '';
    private repo: string = '';
    private branch: string = '';

    private driver: mls.stor.others.DriverIOBase | undefined;

    private branchMain: { name: string }[]  = [];

    // -------------  WEBCOMPONENT -------------

    connectedCallback() {
        super.connectedCallback();
        this.init(); 
    }

    render() {
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
                    <button class="btn">
                        <svg style=" width: 15px;" xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                        New Branch
                    </button>
                </div>
                ${this.renderBranchs()}
            </div>
        `; 
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

    renderItem(obj: { name: string }, index:number) {
        return html`
            <li @click="${this.setItem}" .info=${obj}>
                <input type="radio" id="item-${index}" name="optBranch" value="${obj.name}">
                <label for="item-${index}">
                    ${obj.name}
                </label>
            
            </li>
        
        `
    }

    // ------------- IMPLEMENTATION -------------

    private async init() {
        const prj = mls.actual[5].project;
        if (!prj) return;

        if (!this.driver)
            this.driver = mls.stor.others.getDefaultDriver(prj);

        const info = await mls.l5.getProjectConf(prj);

        let str = info.projectURL.split('/');
        str = str.filter((item: string) => item.trim() !== "");

        this.branch = str[0];
        this.owner = str[1];
        this.repo = str[2];

        this.getInfosRepo();
    }

    private async getInfosRepo() {

        if (!this.driver) return;

        const ret = await (this.driver as any).getListBranch(this.owner, this.repo);

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

    // -------------  CSS -------------

    static styles = css`
        :host {
            padding: 1rem; 
        }

        .contentAllBranch{
            padding: 1rem; 
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
    `;
}