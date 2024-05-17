/// <mls shortName="serviceDsStyleTypography" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["collab-ds-input-range-100554"]
 * }
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initCollabDSInputRange } from './_100554_collabDsInputRange';
import { initCollabDsInputSelectColor } from './_100554_collabDsInputSelectColor';

/// **collab_i18n_start**
const message_pt = {
    color: 'Cor',
    fontFamily: 'Família de fontes',
    fontWeight: 'Peso da fonte',
    fontStyle: 'Estilo da fonte',
    fontSize: 'Tamanho da fonte',
    letterSpacing: 'Espaçamento entre letras',
    wordSpacing: 'Espaçamento entre palavras',
    lineHeight: 'Altura da linha',
    textAlign: 'Alinhar texto',
    variant: 'Variante',
    transform: 'Transformar',
    decoration: 'Decoração',
    textOverflow: 'Text-overflow',
}

const message_en = {
    color: 'Color',
    fontFamily: 'Font Family',
    fontWeight: 'Font Weight',
    fontStyle: 'Font Style',
    fontSize: 'Font Size',
    letterSpacing: 'Letter Spacing',
    wordSpacing: 'Word Spacing',
    lineHeight: 'Line Height',
    textAlign: 'Text align',
    variant: 'Variant',
    transform: 'Transform',
    decoration: 'Decoration',
    textOverflow: 'Text-overflow',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('service-ds-style-typography-100554')
export class ServiceDsStyleTypography extends ServiceBase {

    private msg: MessageType = messages['en'];

    private myUpp = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleTypography';

    constructor() {
        super();
        initCollabDSInputRange();
        initCollabDsInputSelectColor();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf031',
        state: 'foreground',
        position: 'right',
        tooltip: 'Typography',
        visible: false,
        tags: ['ds_styles'],
        widget: '_100554_serviceDsStyleTypography',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
    }

    public menu: IMenu = {
        title: 'Typography',
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

            this.setValues(obj.value);

        }

    }

    private setValues(ar: IBlockLessLine[]): void {

        this.myUpp = true;
        ar.forEach((i: any) => {

            if (!this.shadowRoot || !i.key) return;
            const value = i.value;
            const prop = i.key;
            const el = this.shadowRoot.querySelector('*[prop="' + prop + '"]') as HTMLInputElement;
            if (el) el.value = value;

        })
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
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <div>
                <div class="groupEdit">
                    <span>${this.msg.color}</span>
                    <input type="color" prop="color" @change="${(e: any) => this.onChangeProp2('color')}"></input>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.fontFamily}</span>
                    <select style="width:160px" prop="font-family" @change="${(e: any) => this.onChangeProp2('font-family')}">
                        <option value=""></option>
                        <option value="COURIER">Courier</option>
                        <option value="VERDANA">Verdana</option>
                        <option value="ARIAL">Arial</option>
                        <option value="TIMES NEW ROMAN">Times new Roman</option>
                    </select>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.fontWeight}</span>
                    <select style="width:160px" prop="font-weight" @change="${(e: any) => this.onChangeProp2('font-weight')}">
                        <option value=""></option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                        <option value="600">600</option>
                        <option value="700">700</option>
                        <option value="800">800</option>
                        <option value="900">900</option>
                    </select>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.fontStyle}</span>
                    <select style="width:160px" prop="font-style" @change="${(e: any) => this.onChangeProp2('font-style')}">
                        <option value=""></option>
                        <option value="NULL">null</option>
                        <option value="NORMAL">normal</option>
                        <option value="ITALIC">italic</option>
                    </select>
                </div> 
                <div class="groupEdit">
                    <span>${this.msg.fontSize}</span>
                    <collab-ds-input-range-100554 prop="font-size" value="0px" .arraySelect=${this.tpMeasures}  group="radius" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit"> 
                    <span>${this.msg.letterSpacing}</span>
                    <collab-ds-input-range-100554 prop="letter-spacing" value="0px" .arraySelect=${this.tpMeasures}  group="radius" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit"> 
                    <span>${this.msg.wordSpacing}</span>
                    <collab-ds-input-range-100554 prop="word-spacing" value="0px" .arraySelect=${this.tpMeasures}  group="radius" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit"> 
                    <span>${this.msg.lineHeight}</span>
                    <collab-ds-input-range-100554 prop="line-height" value="0px" .arraySelect=${this.tpMeasures}  group="radius" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.textAlign}</span>
                    <select style="width:160px" prop="text-align" @change="${(e: any) => this.onChangeProp2('text-align')}">
                        <option value=""></option>
                        <option value="CENTER">center</option>
                        <option value="END">end</option>
                        <option value="INHERIT">inherit</option>
                        <option value="INITIAL">initial</option>
                        <option value="JUSTIFY">justify</option>
                        <option value="LEFT">left</option>
                        <option value="REVERT">revert</option>
                        <option value="RIGHT">right</option>
                        <option value="START">start</option>
                        <option value="UNSET">unset</option>
                    </select>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.variant}</span>
                    <select style="width:160px" prop="variant" @change="${(e: any) => this.onChangeProp2('variant')}">
                        <option value=""></option>
                        <option value="NORMAL">normal</option>
                        <option value="SMALL-CAPS">small-caps</option>
                    </select>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.transform}</span>
                    <select style="width:160px" prop="transform" @change="${(e: any) => this.onChangeProp2('transform')}">
                        <option value=""></option>
                        <option value="UPPERCASE">uppercase</option>
                        <option value="LOWERCASE">lowercase</option>
                        <option value="CAPITALIZE">capitalize</option>
                    </select>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.decoration}</span>
                    <select style="width:160px" prop="decoration" @change="${(e: any) => this.onChangeProp2('decoration')}">
                        <option value=""></option>
                        <option value="NORMAL">normal</option>
                        <option value="UNDERLINE">underline</option>
                        <option value="OVERLINE">overline</option>
                        <option value="LINE-THROUGH">line-through</option>
                    </select>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.textOverflow}</span>
                    <select style="width:160px" prop="text-overflow" @change="${(e: any) => this.onChangeProp2('text-overflow')}">
                        <option value=""></option>
                        <option value="ELLIPSIS">ellipsis</option>
                        <option value="CLIP">clip</option>
                        <option value="INITIAL">initial</option>
                    </select>
                </div>
            </div>
        `;
    }

    //-------------IMPLEMENTS--------------

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];


    private timeonChangeProp = -1;
    private onChangeProp(obj: IBlockLessLine) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            this.emitEvent((obj as any).detail);
        }, 500);
    }

    private onChangeProp2(prop: string) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            if (!this.shadowRoot) return;
            const el = this.shadowRoot.querySelector('*[prop="' + prop + '"]') as HTMLSelectElement;
            this.emitEvent({ key: prop, value: el.value });
        }, 500);
    }

    private fireEventAboutMe(): void {
        const rc = {
            emitter: 'right-get',
        };

        mls.events.fire([3], ['DSStyleChanged'], JSON.stringify(rc), 500);
    }

    private emitEvent(obj: IBlockLessLine) {

        if (this.myUpp) return;
        if ((obj as any).target) delete (obj as any).target;
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

