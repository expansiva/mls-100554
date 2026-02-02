/// <mls fileReference="_100554_/l2/driverTest.ts" group="other" enhancement="_100554_enhancementLit" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

@customElement('driver-test-100554')
export class DriverTest extends CollabLitElement {

    @property() drivername: string = '';
    private instance: any | undefined;

    @query('#iptDriver') iptDriver: HTMLInputElement | undefined;
    @query('#iptNameClass') iptClass: HTMLInputElement | undefined;
    @query('#selFc') selFc: HTMLSelectElement | undefined;
    @query('#showParam') showParam: HTMLElement | undefined;
    @query('#textlog') textlog: HTMLElement | undefined;




    //-------COMPONENT-----------
    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <h3>Test Driver</h3>
            
            <div class="blockdriver">
                <div style="display:flex; gap:.5rem;flex-direction:column;    align-items: end;">
                    <div class="fields">
                        <label>File:</label>
                        <input id="iptDriver" style="width:300px" type="text" value="${this.drivername}" @change="${this.changeDriver}">
                    </div>
                    <div class="fields">
                        <label>Class:</label>
                        <input id="iptNameClass" style="width:300px" type="text" value="${this.drivername}" @change="${this.changeDriver}">
                    </div>
                </div>
                <button @click="${this.load}">Load</button>
            </div>

            <div class="blockexec">
                <div style="display: flex;flex-direction: column;gap: .5rem;align-items: center;justify-content: center;">
                    <div class="fields">
                        <label> Functions:</label>
                        <select id="selFc" style="min-width:200px" @change="${this.changeFunction}">
                            <option value=""></option>
                            ${repeat(this.functions, ((f: IFunctions) => f.name) as any,
            ((fc: IFunctions, index: any) => {

                return html`<option value="${fc.name}" index="${index}">${fc.name}</option>`;

            }) as any
        )}
                        </select>
                        <button @click="${this.run}">Run</button>
                    </div>
                    <div>
                        <div id="showParam">
                        </div>
                        
                    </div>
                </div>

                <div class="log">
                    <h5>Log:</h5>
                    <div id="textlog"></div>
                </div>

            </div>

        `;
    }

    //---------IMPLEMENT---------

    private changeDriver() {

        this.classList.remove('load');

    }

    private async load() {

        if (!this.iptDriver || !this.textlog || !this.iptClass) return;

        this.textlog.innerText = '';

        if (!this.iptDriver.value) {
            alert('Inform a driver');
            return;
        }

        if (!this.iptClass.value) {
            alert('Inform a class driver');
            return;
        }

        try {
            const i = await import(`/${this.iptDriver.value}`);
            const cls = this.iptClass.value;
            if (!i[cls]) throw new Error('Invalid driver name');
            this.instance = new i[cls]();
            this.textlog.innerText = '\nLoad success driver';
            this.separeteLine();
            this.classList.add('load');


        } catch (e: any) {

            alert('Erro import driver');
            console.info(e.message);
        }


    }

    private separeteLine() {

        if (!this.textlog) return;
        this.textlog.innerText += '\n-----------------------------\n';
    }

    private async run(e: MouseEvent) {

        let start = Date.now();

        try {

            if (!this.selFc || !this.instance || !this.showParam || !this.textlog) return;

            this.textlog.innerText = '\nLoad success driver';
            this.separeteLine();

            const paramsels = this.showParam.querySelectorAll('*[hv]');
            const params: any = {};

            Array.from(paramsels).forEach((p) => {

                const tp = p.getAttribute('hv');
                const nm = p.getAttribute('param') as string;

                if (tp && ['ipt', 'sel', 'array'].includes(tp)) {
                    const vl = this.setValueFromEl(tp, p);
                    if (vl) params[nm] = vl;

                } else if (tp == 'object') {

                    const paramsobj = p.querySelectorAll(`*[object]`);
                    const vl: any = {};

                    Array.from(paramsobj).forEach((po) => {

                        const tp2 = po.getAttribute('chv') as string;
                        const nm2 = po.getAttribute('cparam') as string;

                        const ret = this.setValueFromEl(tp2, po);
                        if (ret) vl[nm2] = ret.vl;

                    })

                    if (Object.keys(vl).length > 0) {
                        params[nm] = { vl, imp: JSON.stringify(vl) };
                    }

                }

            });


            this.textlog.innerText += `\nPrepare function: ${this.selFc.value}`;
            this.textlog.innerText += `\nSet params:`;

            const paramsvl: any[] = [];

            Object.keys(params).forEach((p) => {

                if (!this.textlog) return;
                this.textlog.innerText += `\n__${p}: ${params[p].imp}`;
                paramsvl.push(params[p].vl);

            })
            this.separeteLine();

            start = Date.now();
            this.textlog.innerText += `\nStart function: ${this.dateToTime(start)}`;
            this.separeteLine();

            if (!this.instance[this.selFc.value]) {
                throw new Error(`Function ${this.selFc.value} not implemented`)
            }

            const ret = await this.instance[this.selFc.value](...paramsvl);
            console.info(ret);
            this.textlog.innerText += `\n\n ${JSON.stringify(ret)}\n\n`;
            this.separeteLine();

            const end = Date.now();
            this.textlog.innerText += `\nEnd function: ${this.dateToTime(end)}`;
            this.textlog.innerText += `\nExecution duration: ${this.diffTime(start, end)}`;


        } catch (e: any) {

            if (!this.textlog) return;

            this.textlog.innerText += `\nError: ${e.message}`;

            const end = Date.now();
            this.textlog.innerText += `\nExecution duration: ${end - start}`;

        }
    }

    private setValueFromEl(tp: string, p: Element): { vl: any, imp: string } | undefined {

        if (tp === 'ipt') {
            return { vl: (p as HTMLInputElement).value, imp: (p as HTMLInputElement).value };

        } else if (tp == 'sel') {

            if (!mls.stor.files[(p as HTMLSelectElement).value]) return;
            return { vl: mls.stor.files[(p as HTMLSelectElement).value], imp: (p as HTMLSelectElement).value };

        } else if (tp == 'array') {

            if (!mls.stor.files[(p as HTMLSelectElement).value]) return;
            return { vl: [mls.stor.files[(p as HTMLSelectElement).value]], imp: `[${(p as HTMLSelectElement).value}]` };

        }

    }

    private diffTime(st: number, end: number): string {

        const dataInicial = new Date(st);
        const dataFinal = new Date(end);

        const diferencaEmMilissegundos = dataFinal.getTime() - dataInicial.getTime();

        return `${diferencaEmMilissegundos} ms`;
    }

    private dateToTime(d: number): string {
        const date = new Date(d);

        const horas = date.getHours().toString().padStart(2, '0');
        const minutos = date.getMinutes().toString().padStart(2, '0');
        const segundos = date.getSeconds().toString().padStart(2, '0');
        const milissegundos = date.getMilliseconds().toString().padStart(3, '0');
        const timeString = `${horas}:${minutos}:${segundos}.${milissegundos}`;

        return timeString;
    }

    private changeFunction(e: MouseEvent) {

        if (!this.selFc || !this.showParam) return;

        const idx = this.selFc.selectedOptions[0].getAttribute('index');

        if (idx === null) return;

        const params = this.functions[+idx].parameters;

        this.showParam.innerHTML = '';

        params.forEach((p) => {

            if (!this.selFc || !this.showParam) return;
            this.showParam.appendChild(this.createItem(p));

        });


    }

    private createItem(p: IParameters): HTMLElement {

        const div = document.createElement('div');
        const l = document.createElement('label');

        (div as any).param = p;
        div.className = 'fields';
        l.innerText = p.name + ':';
        div.appendChild(l);

        if (['string', 'project'].includes(p.tp)) {

            const el = this.createElItem(p)
            if (el) div.appendChild(el);

        } else if (p.tp === 'fileinfo') {

            const el = this.createElItem(p)
            if (el) div.appendChild(el);

        } else if (p.tp === 'arrayfileinfo') {

            const el = this.createElItem(p)
            if (el) div.appendChild(el);

        } else if (p.tp === 'object') {

            div.className = 'fields obj';
            div.setAttribute('hv', 'object');
            div.setAttribute('param', p.name);
            p.parameters?.forEach((pc) => {

                const div2 = document.createElement('div');
                const l2 = document.createElement('label');

                (div2 as any).param = pc;
                div2.className = 'fields';
                l2.innerText = pc.name + ':';
                div2.appendChild(l2);

                const el = this.createElItem(pc, true)
                if (el) {
                    el.setAttribute('object', p.name);
                    div2.appendChild(el);
                    div.appendChild(div2);
                }

            })

        }

        return div;

    }

    private createElItem(p: IParameters, isObj: boolean = false): HTMLElement | undefined {

        const aux = isObj ? 'c' : '';

        if (['string', 'project'].includes(p.tp)) {

            const inp = document.createElement('input');
            inp.setAttribute(aux + 'hv', 'ipt');
            inp.setAttribute(aux + 'param', p.name);
            if (p.tp === 'project') inp.value = mls.actualProject?.toString() as string;

            return inp;

        } else if (p.tp === 'fileinfo') {

            const sel = document.createElement('select');
            sel.setAttribute(aux + 'hv', 'sel');
            sel.setAttribute(aux + 'param', p.name);

            Object.keys(mls.stor.files).forEach((i) => {

                const f = mls.stor.files[i];
                if (f.project !== mls.actualProject) return;

                const opt = document.createElement('option');
                opt.value = i;
                opt.innerText = i;

                sel.appendChild(opt);
            })


            return sel;

        } else if (p.tp === 'arrayfileinfo') {

            const sel = document.createElement('select');
            sel.setAttribute(aux + 'hv', 'array');
            sel.setAttribute(aux + 'param', p.name);

            Object.keys(mls.stor.files).forEach((i) => {

                const f = mls.stor.files[i];
                if (f.project !== mls.actualProject) return;

                const opt = document.createElement('option');
                opt.value = i;
                opt.innerText = i;

                sel.appendChild(opt);
            })


            return sel;

        }

        return undefined;

    }

    private functions: IFunctions[] = [
        {
            name: 'getContents',
            parameters: [
                {
                    name: 'project',
                    tp: 'project',
                },
                {
                    name: 'fileInfos',
                    tp: 'arrayfileinfo',
                }
            ]
        },
        {
            name: 'setContents',
            parameters: [
                {
                    name: 'project',
                    tp: 'project',
                },
                {
                    name: 'fileInfos',
                    tp: 'arrayfileinfo',
                },
                {
                    name: 'comments',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'loadFilesInfo',
            parameters: [
                {
                    name: 'project',
                    tp: 'project',
                }
            ]
        },
        {
            name: 'getHistory',
            parameters: [
                {
                    name: 'fileInfo',
                    tp: 'fileinfo',
                }
            ]
        },
        {
            name: 'getHistoryContent',
            parameters: [
                {
                    name: 'fileInfo',
                    tp: 'fileinfo',
                },
                {
                    name: 'ref',
                    tp:'string'
                }
            ]
        },
        {
            name: 'getUrl',
            parameters: [
                {
                    name: 'fileInfo',
                    tp: 'fileinfo',
                },
            ]
        },
        {
            name: 'getVersionFromFiles',
            parameters: [
                {
                    name: 'options',
                    tp: 'object',
                    parameters: [
                        {
                            name: 'owner',
                            tp: 'string',
                        },
                        {
                            name: 'repo',
                            tp: 'string',
                        },
                        {
                            name: 'branchName',
                            tp: 'string',
                        },
                        {
                            name: 'files',
                            tp: 'arrayfileinfo',
                        },
                    ]
                }

            ]
        },
        {
            name: 'checkBranchExistence',
            parameters: [
                {
                    name: 'owner',
                    tp: 'string',
                },
                {
                    name: 'repo',
                    tp: 'string',
                },
                {
                    name: 'branchName',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'createNewBranch',
            parameters: [
                {
                    name: 'option',
                    tp: 'object',
                    parameters: [
                        {
                            name: 'owner',
                            tp: 'string',
                        },
                        {
                            name: 'repo',
                            tp: 'string',
                        },
                        {
                            name: 'branch',
                            tp: 'string',
                        },
                        {
                            name: 'newBranch',
                            tp: 'string',
                        },
                    ]
                }
            ]
        },
        {
            name: 'createPullRequest',
            parameters: [
                {
                    name: 'options',
                    tp: 'object',
                    parameters: [
                        {
                            name: 'owner',
                            tp: 'string',
                        },
                        {
                            name: 'repo',
                            tp: 'string',
                        },
                        {
                            name: 'branch',
                            tp: 'string',
                        },
                        {
                            name: 'title',
                            tp: 'string',
                        },
                        {
                            name: 'description',
                            tp: 'string',
                        },
                    ]
                }
            ]
        },
        {
            name: 'reviewPullRequest',
            parameters: [
                {
                    name: 'options',
                    tp: 'object',
                    parameters: [
                        {
                            name: 'owner',
                            tp: 'string',
                        },
                        {
                            name: 'repo',
                            tp: 'string',
                        },
                        {
                            name: 'branch',
                            tp: 'string',
                        },
                        {
                            name: 'idRequest',
                            tp: 'string',
                        },
                        {
                            name: 'isApproved',
                            tp: 'string',
                        },
                    ]
                }
            ]
        },
        {
            name: 'listPullRequests',
            parameters: [
                {
                    name: 'owner',
                    tp: 'string',
                },
                {
                    name: 'repo',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'listForks',
            parameters: [
                {
                    name: 'owner',
                    tp: 'string',
                },
                {
                    name: 'repo',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'listBranches',
            parameters: [
                {
                    name: 'owner',
                    tp: 'string',
                },
                {
                    name: 'repo',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'getUserInfo',
            parameters: []
        },
        {
            name: 'getOrganizations',
            parameters: [
                {
                    name: 'login',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'createRepository',
            parameters: [
                {
                    name: 'login',
                    tp: 'string',
                },
                {
                    name: 'repo',
                    tp: 'string',
                },
                {
                    name: 'organization',
                    tp: 'string',
                },
                {
                    name: 'description',
                    tp: 'string',
                },
                {
                    name: 'visibility',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'deleteRepository',
            parameters: [
                {
                    name: 'repo',
                    tp: 'string',
                },
                {
                    name: 'organization',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'createFork',
            parameters: [
                {
                    name: 'login',
                    tp: 'string',
                },
                {
                    name: 'repoOri',
                    tp: 'string',
                },
                {
                    name: 'orgOri',
                    tp: 'string',
                },
                {
                    name: 'orgDest',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'renameRepository',
            parameters: [
                {
                    name: 'owner',
                    tp: 'string',
                },
                {
                    name: 'repo',
                    tp: 'string',
                },
                {
                    name: 'newName',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'createFileInRepo',
            parameters: [
                {
                    name: 'owner',
                    tp: 'string',
                },
                {
                    name: 'repo',
                    tp: 'string',
                },
                {
                    name: 'path',
                    tp: 'string',
                },
                {
                    name: 'content',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'changeVisibility',
            parameters: [
                {
                    name: 'owner',
                    tp: 'string',
                },
                {
                    name: 'repo',
                    tp: 'string',
                },
                {
                    name: 'visibility',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'verifyRepositoryNew',
            parameters: [
                {
                    name: 'owner',
                    tp: 'string',
                },
                {
                    name: 'repo',
                    tp: 'string',
                },
                {
                    name: 'user',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'verifyPermission',
            parameters: [
                {
                    name: 'owner',
                    tp: 'string',
                },
                {
                    name: 'repo',
                    tp: 'string',
                },
                {
                    name: 'login',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'addVariable',
            parameters: [
                {
                    name: 'name',
                    tp: 'string',
                },
                {
                    name: 'value',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'updateVariable',
            parameters: [
                {
                    name: 'name',
                    tp: 'string',
                },
                {
                    name: 'value',
                    tp: 'string',
                }
            ]
        },
        {
            name: 'listVariables',
            parameters: []
        },
        {
            name: 'delVariable',
            parameters: [
                {
                    name: 'name',
                    tp: 'string',
                }
            ]
        }

        
    ]

}

interface IFunctions {
    name: string,
    parameters: IParameters[]
}

interface IParameters {
    name: string,
    tp: 'string' | 'project' | 'fileinfo' | 'arrayfileinfo' | 'object',
    parameters?: IParameters[]
}