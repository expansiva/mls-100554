/// <mls shortName="serviceDsStyleBackground" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["collab-ds-input-range-100554"]
 * }
 */

import { html, css, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';

/// **collab_i18n_start**
const message_pt = {
    gallery: 'Galeria',
    background: 'Background',
    angle: 'Anglo',
    color: 'Cor',
    transparency: 'Transparencia',
    stop: 'Parar',
    add: 'Add',
    del: 'Del'
}


const message_en = {
    gallery: 'Gallery',
    background: 'Background',
    angle: 'Angle',
    color: 'Color',
    transparency: 'Transparency',
    stop: 'Stop',
    add: 'Add',
    del: 'Del'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('service-ds-style-background-100554')
export class ServiceDsStyleBackground extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    private myUpp = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() css: string = '';

    @property() helper: string = '_100554_serviceDsStyleBackground';

    @property() info: IMyInfoBackground = { tp: 'background', aux: '', itens: [] };

    constructor() {
        super();
        this.setEvents();

    }

    public details: IService = {
        icon: '&#xf043',
        state: 'foreground',
        position: 'right',
        tooltip: 'Background',
        visible: false,
        tags: ['ds_styles'],
        widget: '_100554_serviceDsStyleBackground',
        level: [3],
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

            this.fireEventAboutMe();

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

            obj.value.forEach((i: any) => {

                if (!this.shadowRoot || !i.key) return;
                const value = i.value;
                const prop = i.key;

                if (!['background','background-color'].includes(prop)) return;
                this.configString('background:'+value);

            })
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

    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang]

        return html`<div class="container">${this.renderBody()}</div>`;
    }

    renderBody() {
        return html`
            <div class="showtransparent"></div>
            <div class="showres" style="${this.css}"></div>
            <div class="showConfigContainer" >
                
                <div class="showConfig" >
                    ${this.renderConfig()}
                    ${this.renderItens()}
                </div>
                <div class="showConfig" style="border-left: 1px solid #dfe1e6;" >
                    <h4 style="text-align:center;margin-bottom:1rem">${this.msg.gallery }</h4>
                    ${this.renderGallery()}
                </div>
            </div>

        `;
    }

    renderConfig() {

        if (this.info.tp === 'background') {
            return html`
                <div class="showConfigItem">
                    <div class="active" style="border: 1px solid #d0cccc; font-size: 80%; padding: 0.2rem; border-radius: 5px; width:130px; text-align:center; cursor:pointer">${this.msg.background }</div>
                </div>
            `
        } else if (this.info.tp !== '') {

            return html`
                <div class="showConfigItem" style="flex-direction:row; margin-bottom:10px">
                    <div class="${this.info.tp === 'linear-gradient' ? 'active' : ''}" style="border: 1px solid #d0cccc; font-size: 80%; padding: 0.2rem; border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-right:0px; width:130px; text-align:center; cursor:pointer" @click="${() => this.changeType('linear-gradient')}">Linear-gradient</div>
                    <div class="${this.info.tp === 'radial-gradient' ? 'active' : ''}" style="border: 1px solid #d0cccc; font-size: 80%; padding: 0.2rem; border-top-right-radius: 5px; border-bottom-right-radius: 5px; width:130px; text-align:center; cursor:pointer" @click="${() => this.changeType('radial-gradient')}">Radial-gradient</div>
                </div>
                ${this.renderAux()}
            `

        } else {
            return html``;
        }

    }

    renderAux() {

        if (this.info.tp !== 'linear-gradient') return html``;

        return html`
            <div class="showConfigItem" style="flex-direction:row;  margin-bottom:10px">
                <span style="width:50px;text-align:center;font-size:80%; color:#6d6d6d;">${this.msg.angle}:</span>
                <input type="number" style="width:50px;text-align:center;font-size:80%; color:#6d6d6d; " .value=${this.onlyNumber(this.info.aux)} prop="aux" @input="${(e: InputEvent) => this.onChangeAux('aux')}"/>
            </div>
        `

    }

    renderItens() {
        return html`
            <div class="showConfigItem">
                <div style="display:flex; gap:.5rem; font-size:80%; color:#6d6d6d;margin-bottom:.5rem">
                    <div style="width:50px;text-align:center; ">${this.msg.color }</div> 
                    <div style="width:132px;text-align:center;">${this.msg.transparency }</div> 
                    <div style="width:60px;text-align:center;" >${this.msg.stop }</div>
                    <div style="width:50px;text-align:center; cursor:pointer" @click="${this.add}">${this.msg.add }</div>
                </div>  
                ${repeat(this.info.itens, ((key: any) => key.value) as any,
            ((i: any, index: any) => {
                return html`
                        <div style="display:flex; gap:.5rem;margin-bottom:.5rem" index="${index}" class="groupEdit">
                            <input type="color" .value="${i.value}" style="width:50px" prop="color" index="${index}" @change="${(e: InputEvent) => this.onChangeProp(index)}"/> 
                            <input type="range" min="0" max="100" .value="${i.transp}" style="width:132px" prop="transp" index="${index}" @input="${(e: InputEvent) => this.onChangeProp(index)}"/> 
                            <input type="number" style="width:50px" min="0" max="100" .value="${i.stop}" prop="stop" index="${index}" @input="${(e: InputEvent) => this.onChangeProp(index)}"></input>
                            <div style="width:50px;text-align:center;font-size:80%; color:#6d6d6d;cursor:pointer" @click="${(e: any) => this.del(index)}">${this.msg.del }</div>
                        </div>    
                    `;
            }) as any
        )}
            </div>
        `
    }

    renderGallery() {
        return html`
            <div style="display:flex; gap:.5rem; flex-wrap:wrap">
            ${repeat(this.arrayGallery, ((key: any) => key) as any,
            ((css: any, index: any) => {
                return html`<div style="width:40px; border-radius:5px; height:30px; cursor:pointer;${css}" @click="${this.clickGallery}" .gallery=${css}></div>`;
            }) as any
        )}
            </div>
        `;
    }

    //-------------IMPLEMENTS--------------

    private clickGallery(e: MouseEvent): void {

        const el = e.target as any;
        if (!el) return;
        const css = el['gallery'];
        this.configString(css);
        this.mountMyValue();
    }

    private onlyNumber(str: string): string {
        const regexNum = /(\d+(?:\.\d+)?)/;
        const res = str.match(regexNum);
        return res && (res as any)[0] ? (res as any)[0] as string : '';
    }

    private changeType(tp: string): void {

        if (this.info.tp === tp) return;

        if (tp === 'linear-gradient') {
            this.info.tp = 'linear-gradient';
            this.info.aux = '90deg';
        } else if (tp === 'radial-gradient') {
            this.info.tp = 'radial-gradient';
            this.info.aux = 'circle';
        }

        this.mountMyValue();

    }

    private add(): void {

        this.info.itens.push({ value: '#000000', transp: '100', stop: '100' })
        if (this.info.itens.length >= 2 && this.info.tp === 'background') {
            this.info.tp = 'linear-gradient';
            this.info.aux = '84deg';
        }

        this.mountMyValue();
    }

    private del(index: number): void {

        this.info.itens.splice(index, 1);
        if (this.info.itens.length <= 1 && this.info.tp !== 'background') {
            this.info.tp = 'background';
            this.info.aux = '';
        }
        this.mountMyValue();
    }

    private configString(str: string): void {

        this.css = str;

        this.info = { tp: '', aux: '', itens: [] };

        if (str.indexOf('linear-gradient') >= 0) {
            this.info.tp = 'linear-gradient';
        } else if (str.indexOf('radial-gradient') >= 0) {
            this.info.tp = 'radial-gradient';
        } else {
            this.info.tp = 'background';
        }

        if (this.info.tp === 'background') {

            let cl = str.split(':')[1];
            if (cl.indexOf('rgb') >= 0) cl = this.rgbaToHex(cl).vl;
            this.info.itens = [{ value: cl, transp: '100', stop: '' }]
        } else {

            let ar: string[] = [];
            str = str.substr(str.indexOf('('));
            str = this.changeStr(str);

            ar = str.split(',');
            const auxCount = 100 / (ar.length - 1);
            ar.forEach((i, idx) => {

                if (idx === 0) {
                    this.info.aux = i;
                    return;
                }


                if (i.indexOf('#') >= 0 || i.indexOf('abgr') >= 0 || i.indexOf('bgr') >= 0) {

                    let vl = '';
                    let start = (auxCount * idx) + '';
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

    private hexToRgba(hex: string, alpha = 1): string {
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
            newst = newst.replace(/ ,/g, ',').replace(/, /g, ',').replace(/,/g, ';');
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

    private onChangeAux(prop: string) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {

            if (!this.shadowRoot) return;
            const el = this.shadowRoot.querySelector('*[prop="' + prop + '"]') as HTMLInputElement;
            this.info.aux = el.value + 'deg';
            this.mountMyValue();

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
            text = this.hexToRgba(this.info.itens[0].value, +this.info.itens[0].transp / 100);
        } else if (this.info.itens.length > 0) {
            text = `${this.info.tp}( ${this.info.aux},`
            this.info.itens.forEach((i, idx) => {

                const aux = idx === this.info.itens.length - 1 ? '' : ',';
                text = text + ` ${this.hexToRgba(i.value, +i.transp / 100)} ${i.stop}%${aux}`
            });

            text = text + ')';

        }

        this.css = aux + text;
        this.info = Object.assign({}, this.info);
        this.emitEvent({ key: 'background', value: text });

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
            value: [obj, {key:'background-color', value: ''}],
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

    private arrayGallery = [
        'background: radial-gradient(circle, rgb(2, 0, 36) 36%, rgb(60, 70, 193) 66%);',
        'background: linear-gradient(342deg, rgba(34, 193, 195, 0.76) 50%, rgba(45, 253, 121, 0.24) 100%);',
        'background: radial-gradient(circle, rgb(63, 94, 251) 0%, rgb(252, 70, 107) 100%);',
        'background: linear-gradient(342deg, rgb(131, 58, 180) 0%, rgb(253, 29, 29) 50%, rgb(252, 176, 69) 100%);',
        'background: radial-gradient(circle, rgb(238, 174, 202) 0%, rgb(148, 187, 233) 100%);',
        'background: linear-gradient(135deg, rgba(30, 87, 153,1) 0%, rgba(41, 137, 216,1) 50%, rgba(32, 124, 202,1) 51%, rgba(125, 185, 232,1) 100%)',
        'background: linear-gradient(135deg, rgba(76, 76, 76,1) 0%, rgba(89, 89, 89,1) 12%, rgba(102, 102, 102,1) 25%, rgba(71, 71, 71,1) 39%, rgba(44, 44, 44,1) 50%, rgba(0, 0, 0,1) 51%, rgba(17, 17, 17,1) 60%, rgba(43, 43, 43) 76%, rgba(28, 28, 28,1) 91%, rgba(19, 19, 19,1) 100%)',
        'background: linear-gradient(135deg, rgba(243, 197, 189,1) 0%, rgba(232, 108, 87,1) 50%, rgba(234, 40, 3,1) 51%, rgba(255, 102, 0,1) 75%, rgba(199, 34, 0,1) 100%)',
        'background: linear-gradient(90deg, rgba(2, 0, 36,1) 0%, rgba(9, 9, 121,1) 35%, rgba(0, 212, 255,1) 100%)',
        'background: linear-gradient(0deg, rgba(34, 193, 195,1) 0%, rgba(253, 187, 45,1) 100%)',
        'background: linear-gradient(90deg, rgba(131, 58, 180,1) 0%, rgba(253, 29, 29,1) 50%, rgba(252, 176, 69,1) 100%)',
        'background: linear-gradient(310deg, rgba(5, 25, 55, 1) 0%, rgba(0, 77, 122,1) 20%, rgba(0, 135, 147, 1) 40%, rgba(0, 191 ,114, 1) 60%, rgba(168, 235 ,18, 1) 80%)',
        'background: linear-gradient(270deg, rgba(112, 225, 245, 1), rgba(255, 209, 148, 1))',
        'background: linear-gradient(90deg, rgba(85, 98, 112, 1), rgba(255, 107, 107, 1))',
        'background: linear-gradient(90deg, rgba(120, 2, 6,1), rgba(6, 17, 97,1))',
        'background: linear-gradient(120deg, rgba(45, 195, 195,1), rgba(158, 17, 17,1))',
        'background: linear-gradient(90deg, rgba(255, 78, 80,1), rgba(249, 212, 35,1))',
        'background: linear-gradient(90deg, rgba(255,239,0,1) 0%, rgba(127,164,8,1) 35%, rgba(0,212,255,1) 100%)',
        'background: rgba(240, 236, 227,1)',
        'background: rgba(223, 211, 195, 1)',
        'background: rgba(199, 177, 152,1)',
        'background: rgba(221, 221, 221,1)',
        'background: rgba(243, 225, 225, 1)',
        'background: rgba(249, 249, 249, 1)',
        'background: rgba(252, 247, 187, 1)',
        'background: rgba(255, 236, 199, 1)',
        'background: rgba(181, 144, 202, 1)',
        'background: rgba(166, 177, 225, 1)',
        'background: rgba(229, 138, 138, 1)',
        'background: rgba(212, 235, 208, 1)',
        'background: rgba(186, 223, 219, 1)',
        'background: rgba(255, 241, 172, 1)',
        'background: rgba(249, 188, 221, 1)',
        'background: rgba(56, 81, 112, 1)',
        'background: rgba(238, 238, 238, 1)',

    ];
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
