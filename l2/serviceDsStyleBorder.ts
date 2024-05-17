/// <mls shortName="serviceDsStyleBorder" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["collab-ds-input-range-100554","collab-ds-input-select-color-100554"]
 * }
 */

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initCollabDSInputRange } from './_100554_collabDsInputRange';
import { initCollabDsInputSelectColor } from './_100554_collabDsInputSelectColor';

/// **collab_i18n_start**
const message_pt = {
    border: 'Borda',
    top: 'Topo',
    left: 'Esquerda',
    bottom: 'Baixo',
    right: 'Direita',
    borderRadius: 'Raio da borda',
    topLeft: 'Topo/Esquerda',
    topRight: 'Topo/Direita',
    bottomLeft: 'Baixo/Esquerda',
    bottomRight: 'Baixo/Direita',
}

const message_en = {
    border: 'Border',
    top: 'Top',
    left: 'Left',
    bottom: 'Bottom',
    right: 'Right',
    borderRadius: 'Border Radius',
    topLeft: 'Top/Left',
    topRight: 'Top/Right',
    bottomLeft: 'Bottom/Left',
    bottomRight: 'Bottom/Right',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-ds-style-border-100554')
export class ServiceDsStyleBorder extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    private myUpp = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleBorder';

    constructor() {
        super();
        initCollabDSInputRange();
        initCollabDsInputSelectColor();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf853',
        state: 'foreground',
        position: 'right',
        tooltip: 'Border',
        visible: false,
        tags: ['ds_styles'],
        widget: '_100554_serviceDsStyleBorder',
        level: [3]

    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
    }

    public menu: IMenu = {
        title: 'Border',
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
        if (visible) {
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

            this.setValues(obj.value);

        }



    }

    private setValues(ar: IBlockLessLine[]): void {

        this.myUpp = true;
        ar.forEach((i: any) => {

            if (!this.shadowRoot || !i.key) return;
            const value = i.value;
            const prop = i.key;

            if (prop === 'border') {
                this.uppProp(value, 'border');
            } else if (prop === 'border-radius') {
                this.uppProp(value, 'radius');
            } else {

                const el = this.shadowRoot.querySelector('*[prop="' + prop + '"]') as HTMLInputElement;
                if (el) el.value = value;

            }

        });
        this.myUpp = false;

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
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang]

        return html`${this.renderBorder()}${this.renderRadius()}${this.renderGallery()}`;
    }

    renderBorder() {
        return html`
            <div>
                <h5 style="display:flex; gap:1.5rem" >${this.msg.border}<input type="checkbox" prop="border"></h5>
                <div class="groupEdit">
                    <span>${this.msg.top}</span>
                    <collab-ds-input-select-color-100554 prop="border-top" valueInput="0px" .arrayInputSelect=${this.tpMeasures} .arraySelect=${this.tpBorder} valueSelect="none" group="border" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-select-color-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.left}</span>
                    <collab-ds-input-select-color-100554 prop="border-left" valueInput="0px" .arrayInputSelect=${this.tpMeasures} .arraySelect=${this.tpBorder} valueSelect="none" group="border" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-select-color-100554>   
                </div>
                <div class="groupEdit">
                    <span>${this.msg.bottom}</span>
                    <collab-ds-input-select-color-100554 prop="border-bottom" valueInput="0px" .arrayInputSelect=${this.tpMeasures} .arraySelect=${this.tpBorder} valueSelect="none" group="border" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-select-color-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.right}</span>
                    <collab-ds-input-select-color-100554 prop="border-right" valueInput="0px" .arrayInputSelect=${this.tpMeasures} .arraySelect=${this.tpBorder} valueSelect="none" group="border" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-select-color-100554>
                </div>
            </div>
        `
    }
 
    renderRadius() {
        return html`
            <div>
                <h5 style="display:flex; gap:1.5rem" >${this.msg.borderRadius}<input type="checkbox" prop="radius"></h5>
                <div class="groupEdit">
                    <span>${this.msg.topLeft}</span>
                    <collab-ds-input-range-100554 prop="border-top-left-radius" value="0px" .arraySelect=${this.tpMeasures}  group="radius" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.topRight}</span>
                    <collab-ds-input-range-100554 prop="border-top-right-radius" value="0px" .arraySelect=${this.tpMeasures} group="radius" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>    
                </div>
                <div class="groupEdit">
                    <span>${this.msg.bottomLeft}</span>
                    <collab-ds-input-range-100554 prop="border-bottom-left-radius" value="0px" .arraySelect=${this.tpMeasures} group="radius" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554> 
                </div>
                <div class="groupEdit">
                    <span>${this.msg.bottomRight}</span>
                    <collab-ds-input-range-100554 prop="border-bottom-right-radius" value="0px" .arraySelect=${this.tpMeasures} group="radius" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554> 
                </div>
                
            </div>
        `
    }

    renderGallery() {

        return html`
            <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; padding: 1rem; flex-wrap: wrap; cursor:pointer">
                ${repeat(this.arrayGallery, ((key: any) => key) as any,
            ((css: any, index: any) => {
                return html`<h5 style="${css}" @click="${this.clickGallery}" .gallery=${css}>Item</h5>`;
            }) as any
        )}
            </div>
        
        `
    }

    //-------------IMPLEMENTS--------------

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private tpBorder = ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset', 'hidden']

    private timeonChangeProp = -1;
    private onChangeProp(e: KeyboardEvent) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            const el = (e.detail as any).target as HTMLInputElement;
            this.beforeEmitEvent(el, e.detail as any);
        }, 500);
    }

    private beforeEmitEvent(el: HTMLInputElement, obj: IBlockLessLine) {

        if (!this.shadowRoot) return;
        const group = el ? el.getAttribute('group') as string : '';
        const elGroup = this.shadowRoot.querySelector(`input[prop="${group}"]`) as HTMLInputElement;
        let isGroup = false;
        if (elGroup) isGroup = elGroup.checked;

        if (isGroup) {

            this.uppProp(el.value, group);
            return;
        }

        this.emitEvent({
            key: el.getAttribute('prop') as string,
            value: el.value,
        })

    }

    private uppProp(value: string, group: string): void {

        if (!this.shadowRoot) return;

        const info: any = {
            border: {
                p1: 'border-top',
                p2: 'border-left',
                p3: 'border-right',
                p4: 'border-bottom',
            },
            radius: {
                p1: 'border-top-left-radius',
                p2: 'border-top-right-radius',
                p3: 'border-bottom-left-radius',
                p4: 'border-bottom-right-radius',
            },
        }

        const prop = group === 'border' ? group : 'border-radius';

        const elP1 = this.shadowRoot.querySelector(`*[prop="${info[group].p1}"]`) as HTMLInputElement;
        const elP2 = this.shadowRoot.querySelector(`*[prop="${info[group].p2}"]`) as HTMLInputElement;
        const elP3 = this.shadowRoot.querySelector(`*[prop="${info[group].p3}"]`) as HTMLInputElement;
        const elP4 = this.shadowRoot.querySelector(`*[prop="${info[group].p4}"]`) as HTMLInputElement;

        const ar: HTMLInputElement[] = [];

        if (elP1) ar.push(elP1);
        if (elP2) ar.push(elP2);
        if (elP3) ar.push(elP3);
        if (elP4) ar.push(elP4);

        console.info(ar);

        ar.forEach((i) => {
            i.value = value;
        });

        this.emitEvent({
            key: prop,
            value: elP1.value,
        })

    }

    private fireEventAboutMe(): void {

        console.info('fireEventAboutMe')
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

    private clickGallery(e: MouseEvent): void {

        const el = e.target as HTMLElement;
        if (!el) return;
        const css = (el as any).gallery;
        if (!css) return;

        const commands: string[] = css.split(';');
        const changes: any[] = [];
        commands.forEach((item) => {

            const [key, value] = item.split(':');
            if (!key) return;

            changes.push({
                key: key.trim(),
                value: value.trim()
            });

        });

        const rc: IEventsObj = {
            emitter: 'right',
            value: changes,
            helper: this.helper
        };

        this.setValues(changes);

        mls.events.fire([3], ['DSStyleChanged'], JSON.stringify(rc));

    }

    private arrayGallery = [
        'border-left: 1px solid #000000; border-right: 1px solid #000000; border-top: 1px solid #000000;',
        'border-left: 1px solid #000000; border-right: 1px solid #000000; border-bottom: 1px solid #000000;',
        'border: 5px dashed #32557f;',
        'border: 4px solid transparent; background: linear-gradient(white, white) padding-box, repeating-linear-gradient(-45deg, #f69ec4 0, #f69ec4 12.5%, transparent 0, transparent 25%, #7eb4e2 0, #7eb4e2 37.5%, transparent 0, transparent 50%) 0 / 15px 15px;',
        'border: 10px solid transparent; border-width: 10px 0; background-color: #7eb4e2; background-color: hsla(0, 0%, 0%, 0); background-image: linear-gradient(#7eb4e2, #32557f), linear-gradient(to bottom right, transparent 50.5%, #7eb4e2 50.5%), linear-gradient(to bottom left, transparent 50.5%, #7eb4e2 50.5%), linear-gradient(to top right, transparent 50.5%, #32557f 50.5%), linear-gradient(to top left, transparent 50.5%, #32557f 50.5%); background-repeat: repeat, repeat-x, repeat-x, repeat-x, repeat-x; background-position: 0 0, 10px 0, 10px 0, 10px 100%, 10px 100%; background-size: auto auto, 20px 20px, 20px 20px, 20px 20px, 20px 20px; background-clip: padding-box, border-box, border-box, border-box, border-box; background-origin: padding-box, border-box, border-box, border-box, border-box;',
        'border: 4px solid transparent; background: linear-gradient(#000, #000) padding-box, radial-gradient(farthest-corner at 50% 50%, #00C9A7, #845EC2) border-box;',
        'border: 4px solid transparent; background: linear-gradient(#000, #000) padding-box, linear-gradient(to bottom left, #f83600, #f9d423) border-box;',
        'border: 4px solid transparent; background: linear-gradient(#000, #000) padding-box, linear-gradient(#f9f047, #0fd850) border-box;',
        'border-left: 4px solid #e85f99; border-right: 4px solid #f18867; border-top: 4px solid #65587f; border-bottom: 4px solid #50bda1;',
        'border: 5px dashed #FF5722; background: linear-gradient(to top, green, 5px, transparent 5px), linear-gradient(to right, green, 5px, transparent 5px), linear-gradient(to bottom, green, 5px, transparent 5px), linear-gradient(to left, green, 5px, transparent 5px); background-origin: border-box;',
        'box-shadow: 0 0 0 4px #009688;border: 4px solid #009688;outline: dashed 4px white;',
        'border: 8px groove;',
        'border-top: 2px solid #3C514D;border-bottom: 3px dashed #3C514D;border-left: 5px double #212410;border-right: 3px dotted rgb(223,112,0);'

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

interface IBlockLessLine {
    key: string,
    value: string,
}