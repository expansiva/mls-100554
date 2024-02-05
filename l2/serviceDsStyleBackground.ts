/// <mls shortName="serviceDsStyleBackground" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["collab-ds-input-range-100554"]
 * }
 */

import { html, css, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';

@customElement('service-ds-style-background-100554')
export class ServiceDsStyleBackground extends ServiceBase {

    private myUpp = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() css: string = '';

    @property() helper: string = '_100554_serviceDsStyleBackground';

    @property() info: IMyInfoBackground = { tp: '', aux: '', itens: [] };

    constructor() {
        super();
        this.setEvents();

    }

    public details: IService = {
        icon: '&#xf0db',
        name: 'Background',
        mode: 'B',
        position: 'right',
        readOnly: false,
        tooltip: 'Background',
        className: undefined,
        tags: [],
        levels: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
    }

    public menu: IMenu = {
        title: 'Background',
        actions: {
        },
        icons: {
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: '',
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon
    }

    onServiceClick(visible: boolean, reinit: boolean) {

        if (visible || reinit) {

            //this.fireEventAboutMe();

        }
    }

    //-------------EVENTS--------------

    private setEvents(): void {
        mls.events.addEventListener([3], ['DSStyleChanged'], (ev) => {
            this.onstylechanged(ev.desc as any);
        });

        mls.events.addEventListener([3], ['DSStyleSelected'], (ev) => {
            this.onDSStyleSelected(ev);
        });

        mls.events.addEventListener([3], ['DSStyleUnSelected'], (ev) => {
            this.onDSStyleUnSelected(ev);
        });

        mls.events.addEventListener([3], ['DSStyleCursorChanged'], (ev) => {
            this.onDSStyleCursorChanged(ev);
        });


    }

    private onstylechanged(desc: string) {

        const obj: IEventsObj = JSON.parse(desc);
        if (obj.emitter === 'left' && this.visible === 'true' && obj.value.length > 0) {

            //this.setValues(obj.value);
        }

    }

    private onDSStyleSelected(ev: mls.events.IEvent) {

        const params: IEventsSelectedObj = ev.desc ? JSON.parse(ev.desc) : [];
        if (params.service.length > 0 && !params.service.includes(this.helper) || !this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', 'A');
        this.showNav2Item(true);

    }

    private onDSStyleUnSelected(ev: mls.events.IEvent) {
        const params: IEventsSelectedObj = ev.desc ? JSON.parse(ev.desc) : [];
        if (params.service.includes(this.helper) || !this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', 'H');
        this.showNav2Item(false);
    }

    private onDSStyleCursorChanged(ev: mls.events.IEvent) {
        const rc: ICursorChangeEventsObj = JSON.parse(ev.desc as any);
        if (rc.helper === this.helper) {
            if (this.visible === 'true' || !this.serviceItemNav) return;
            this.serviceItemNav.click();
        }
    }

    //-------------COMPONENT-----------

    connectedCallback() {
        super.connectedCallback();
        this.updateMyMessages();
        this.configString('background: linear-gradient(84deg, rgba(2,0,36,1) 36%, rgba(60,70,193,0.5) 66%);')

    }

    render() {
        return html`<div class="container">${this.renderBody()}</div>`;
    }

    renderBody() {
        return html`
            <div class="showtransparent"></div>
            <div class="showres" style="${this.css}"></div>
            <div class="showConfig" >
                ${this.renderItens()}
            </div>

        `;
    }

    renderItens() {
        return html`
            <div style="display:flex; gap:.5rem; font-size:80%; color:#6d6d6d;margin-bottom:.5rem">
                <div style="width:50px;text-align:center; ">Color</div> 
                <div style="width:132px;text-align:center;">Transparency</div> 
                <div style="width:60px;text-align:center;" >Stop</div>
                <div style="width:50px;text-align:center; cursor:pointer" @click="${this.add}">Add</div>
            </div>  
            ${repeat(this.info.itens, ((key: any) => key.value) as any,
            ((i: any, index: any) => {
                return html`
                    <div style="display:flex; gap:.5rem;margin-bottom:.5rem" index="${index}" class="groupEdit">
                        <input type="color" .value="${i.value}" style="width:50px" prop="color" index="${index}" @change="${(e: InputEvent) => this.onChangeProp(index)}"/> 
                        <input type="range" min="0" max="100" .value="${i.transp}" style="width:132px" prop="transp" index="${index}" @input="${(e: InputEvent) => this.onChangeProp(index)}"/> 
                        <input type="number" style="width:50px" min="0" max="100" .value="${i.stop}" prop="stop" index="${index}" @input="${(e: InputEvent) => this.onChangeProp(index)}"></input>
                        <div style="width:50px;text-align:center;font-size:80%; color:#6d6d6d;cursor:pointer" @click="${(e:any)=> this.del(index)}">Del</div>
                    </div>    
                `;
            }) as any
        )}
        
        `
    }

    //-------------IMPLEMENTS--------------

    private add(): void {

        this.info.itens.push({value:'#ffffff', transp:'100', stop:'100'})
        if (this.info.itens.length >= 2 && this.info.tp === 'background') {
            this.info.tp = 'linear-gradient';
            this.info.aux = '84deg';
        }

        this.mountMyValue();
    }

    private del(index:number): void {

        this.info.itens.splice(index, 1);
        if (this.info.itens.length <= 1 && this.info.tp !== 'background') {
            this.info.tp = 'background';
            this.info.aux = '';
        }
        this.mountMyValue();
    }

    private configString(str: string): void {

        this.css = str;

        if (str.indexOf('linear-gradient') > 0) {
            this.info.tp = 'linear-gradient';
        } else if (str.indexOf('radial-gradient')) {
            this.info.tp = 'radial-gradient';
        } else {
            this.info.tp = 'background';
        }

        if (this.info.tp === 'background') {
            this.info.itens = [{ value: str.split(':')[1], transp: '100', stop: '' }]
        } else {

            let ar: string[] = [];
            str = str.substr(str.indexOf('('));
            str = this.changeStr(str);

            ar = str.split(',');

            ar.forEach((i, idx) => {

                if (idx === 0) {
                    this.info.aux = i;
                    return;
                }


                if (i.indexOf('#') >= 0 || i.indexOf('abgr') >= 0 || i.indexOf('bgr') >= 0) {

                    let vl = '';
                    let start = '0';
                    const a2 = i.trim().split(' ');
                    if (a2.length > 0) vl = a2[0].replace('abgr', 'rgba').replace('bgr', 'rgb').replace(/;/g, ',');

                    if (a2.length > 1) start = a2[1].replace('%', '');

                    if (vl === '') return;

                    let vlI = { vl: vl, transp: '100' };

                    if (vl.indexOf('rgb') >= 0) {
                        vlI = this.rgbaToHex(vl);
                    }

                    if (!this.info.itens) this.info.itens = [{ value: vlI.vl, transp: vlI.transp, stop: start }]
                    else this.info.itens.push({ value: vlI.vl, transp: vlI.transp, stop: start });
                }

            });

        }

    }

    private rgbaToHex(rgbaString: string): { vl: string, transp: string } {
        const match = rgbaString.match(/(\d+(?:\.\d+)?)/g);

        if (!match) {
            return { vl: '', transp: '' };
        }

        const r = parseInt(match[0], 10);
        const g = parseInt(match[1], 10);
        const b = parseInt(match[2], 10);
        const a = match[3] ? (+match[3] * 100).toString() : '100';

        // Converte os componentes RGB para hexadecimal
        const toHex = (component: number) => {
            const hex = component.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        // Converte os componentes para hexadecimal
        const hexR = toHex(r);
        const hexG = toHex(g);
        const hexB = toHex(b);

        const hexColor = `#${hexR}${hexG}${hexB}`;

        return { vl: hexColor, transp: a };
    }

    private hexToRgba(hex:string, alpha = 1): string {
        // Remove o '#' se estiver presente
        hex = hex.replace(/^#/, '');

        // Converte para r, g, b
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        // Retorna a string RGBA
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    private changeStr(s: string): string {

        if (s.indexOf('rgba') >= 0 || s.indexOf('rgb') >= 0) {

            let tp = s.indexOf('rgba') >= 0 ? 'rgba' : 'rgb';
            let tpR = s.indexOf('rgba') >= 0 ? 'abgr' : 'bgr';
            let newst = '';
            let oldstr = '';
            let st = s.indexOf(tp);
            let ste = -1;

            st = s.substr(st).indexOf('(') + st;
            ste = s.substr(st).indexOf(')') + st;
            newst = s.slice(st, ste);
            oldstr = newst;
            newst = newst.replace(/,/g, ';');
            s = s.replace(oldstr, newst).replace(tp, tpR)

            return this.changeStr(s);

        } else {

            if (s.indexOf('(') === 0) s = s.substr(1);
            if (s.lastIndexOf(')') === s.length - 1) s = s.substring(0, s.length - 1);
            if (s.lastIndexOf(');') === s.length - 2) s = s.substring(0, s.lastIndexOf(');'));
            return s;

        }

    }

    private timeonChangeProp = -1;
    private onChangeProp(index: string) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            if (!this.shadowRoot) return;
            const el = this.shadowRoot.querySelector('.groupEdit[index="' + index + '"]')
            if (!el) return;
            this.changeValues(el as HTMLDivElement, index);
        }, 500);
    }

    private changeValues(el: HTMLDivElement, idx: string): void {


        const elC = el.querySelector('input[prop="color"]') as HTMLInputElement;
        const elT = el.querySelector('input[prop="transp"]') as HTMLInputElement;
        const elS = el.querySelector('input[prop="stop"]') as HTMLInputElement;

        if (!elC || !elT || !elS || !this.info.itens[idx as any]) return;

        this.info.itens[idx as any].value = elC.value;
        this.info.itens[idx as any].transp = elT.value;
        this.info.itens[idx as any].stop = elS.value;

        this.info.itens.sort((a: any, b: any) => a.stop - b.stop);

        this.mountMyValue();

    }

    private mountMyValue(): void {

        const aux = 'background:';
        let text = '';

        if (this.info.tp === 'background' && this.info.itens.length > 0) {
            text =  this.hexToRgba(this.info.itens[0].value, +this.info.itens[0].transp / 100);
        } else if(this.info.itens.length > 0){
            text = `${this.info.tp}( ${this.info.aux},`
            this.info.itens.forEach((i, idx) => {
                
                const aux = idx === this.info.itens.length - 1 ? '' : ',';
                text = text + ` ${this.hexToRgba(i.value, +i.transp / 100)} ${i.stop}%${aux}`
            });

            text = text + ')';
            
        }

        this.css = aux + text;
        this.info = Object.assign({}, this.info);

    }


    private fireEventAboutMe(): void {
        const rc = {
            emitter: 'right-get',
        };

        mls.events.fire([3], ['DSStyleChanged'], JSON.stringify(rc), 500);
    }

    private emitEvent(obj: IBlockLessLine) {

        if (this.myUpp) return;
        const rc: IEventsObj = {
            emitter: this.position,
            value: [obj],
            helper: this.helper
        };

        if (typeof mls !== 'object') return;
        mls.events.fire([3], ['DSStyleChanged'], JSON.stringify(rc));

    }

    private timeLoader = -1;
    private showLoader(loader: boolean): void {

        clearTimeout(this.timeLoader);
        this.timeLoader = setTimeout(() => {
            this.loading = loader;
        }, 200);

    }

    private updateMyMessages() {

        if (!window['message' as any]) return;
        const m = window['message' as any] as any;

        if (m.columnsCount) this.myMsg.columnsCount = m.columnsCount;


    }

    private myMsg = {
        columnsCount: 'Columns Count',

    }
}

interface ICursorChangeEventsObj {
    emitter: 'left'
    helper: string,
}

interface IEventsSelectedObj {
    service: string[]
    isComponent: boolean
}

interface IEventsObj {
    emitter: 'right' | 'left' | 'right-get',
    helper: string,
    value: IBlockLessLine[],
}

interface IMyInfoBackground {
    tp: string,
    aux: string,
    itens: { value: string, transp: string, stop: string }[]
}

interface IBlockLessLine {
    key: string,
    value: string,
}
