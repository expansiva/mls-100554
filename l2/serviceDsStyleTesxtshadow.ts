/// <mls shortName="serviceDsStyleTesxtshadow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["collab-ds-input-range-100554"]
 * }
 */

import { html, css, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initCollabDSInputRange } from './_100554_collabDsInputRange';
import { initCollabDsInputSelectColor } from './_100554_collabDsInputSelectColor';

/// **collab_i18n_start**
const message_pt = {
    textShadow: 'Sombra do texto',
    xOffset: 'X Offset',
    yOffset: 'Y Offset',
    blur: 'Desfoque',
    color: 'Cor',
}

const message_en = {
    textShadow: 'Text Shadow',
    xOffset: 'X Offset',
    yOffset: 'Y Offset',
    blur: 'Blur',
    color: 'Color',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-ds-style-tesxtshadow-100554')
export class ServiceDsStyleTextShadow extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    private myUpp = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleTesxtshadow';

    constructor() {
        super();
        initCollabDSInputRange();
        initCollabDsInputSelectColor();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#x54',
        state: 'foreground',
        position: 'right',
        tooltip: 'Text Shadow',
        visible: false,
        tags: ['ds_styles'],
        widget: '_100554_serviceDsStyleTesxtshadow',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
    }

    public menu: IMenu = {
        title: 'Shadow',
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

    private setValues(ar: IBlockLessLine[]): void{

        
        if (!this.shadowRoot) return;

        const textShadowLine = ar.find((item) => item.key === 'text-shadow');
		if (!textShadowLine) return;

        this.myUpp = true;

		let { value } = textShadowLine;

		let vColor = '';
		if (value.indexOf('rgb') >= 0) {

			vColor = value.substr(value.indexOf('rgb'), value.indexOf(')') + 1);
			value = value.replace(vColor, '').trim();

		} else if (value.indexOf('#') >= 0) {

			vColor = value.substr(value.indexOf('#'), value.indexOf(' ') + 1).trim();
			value = value.replace(vColor, '').trim();

		} else if (/[a-z]/.test(value.substr(0, 1))) {

			vColor = value.substr(value.indexOf(value.substr(0, 2)), value.indexOf(' ') + 1).trim();
			value = value.replace(vColor, '').trim();

		}

        const arrayValues = value.split(' ');

        const elX = this.shadowRoot.querySelector('*[prop="x"]') as HTMLInputElement;
        const elY = this.shadowRoot.querySelector('*[prop="y"]') as HTMLInputElement;
        const elC = this.shadowRoot.querySelector('*[prop="color"]') as HTMLInputElement;
        const elB = this.shadowRoot.querySelector('*[prop="blur"]') as HTMLInputElement;

        if (elX && arrayValues.length > 0) elX.value = arrayValues[0]
        else elX.value = '';

        if (elY && arrayValues.length > 1) elY.value = arrayValues[1]
        else elY.value = '';

        if (elB && arrayValues.length > 2) elB.value = arrayValues[2]
        else elB.value = '';

        if (elC) elC.value = vColor;
        
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

        return html`${this.renderColumn()}${this.renderGallery()}`;
    }

    renderColumn() {
        return html`
            <div>
                <h5>${this.msg.textShadow}</h5>
                <div class="groupEdit">
                    <span>${this.msg.xOffset}</span>
                    <collab-ds-input-range-100554 prop="x" value="0px" .arraySelect=${this.tpMeasures}  @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.yOffset}</span>
                    <collab-ds-input-range-100554 prop="y" value="0px" .arraySelect=${this.tpMeasures}  @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.blur}</span>
                    <collab-ds-input-range-100554 prop="blur" value="0px" .arraySelect=${this.tpMeasures}  @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.color}</span>
                    <collab-ds-input-select-color-100554 prop="color" useInput="false" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-select-color-100554>
                </div>
                
            </div>
        `;
    }

    renderGallery() {

        return html`
            <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; padding: 1rem; flex-wrap: wrap; cursor:pointer">
                ${repeat(this.arrayGallery, ((key: any) => key) as any,
                    ((css: any, index: any) => {
                        return html`
                        <h5 style="${css}" @click="${this.clickGallery}" .gallery=${css}>Text</h5>
                        `;
                    }) as any
                )}
            </div>
        
        `
    }

    //-------------IMPLEMENTS--------------

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    
    private timeonChangeProp = -1;
    private onChangeProp(obj: IBlockLessLine) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            this.mountValue();
        }, 500);
    }

    private mountValue(): void {

        if (!this.shadowRoot) return;

        const elX = this.shadowRoot.querySelector('*[prop="x"]') as HTMLInputElement;
        const elY = this.shadowRoot.querySelector('*[prop="y"]') as HTMLInputElement;
        const elC = this.shadowRoot.querySelector('*[prop="color"]') as HTMLInputElement;
        const elB = this.shadowRoot.querySelector('*[prop="blur"]') as HTMLInputElement;

        let value = '';

        if (elC) value += elC.value;

        if (elX) value += ' ' + elX.value;

        if (elY) value += ' ' + elY.value;

        if (elB) value += ' ' + elB.value;

        const change: IBlockLessLine = {
            key: 'text-shadow',
            value
        };

        this.emitEvent(change);
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

    private clickGallery(e: MouseEvent): void {

        const el = e.target as HTMLElement;
        if (!el) return;
        const css = (el as any).gallery;
        //if (!css) return;

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

        if (changes.length <= 0) changes.push({ key: 'text-shadow', value: '' });

        this.setValues(changes);

        mls.events.fire([3], ['DSStyleChanged'], JSON.stringify(rc));

    }

    private arrayGallery = [
        '',
        'text-shadow: 2px 2px;',
        'text-shadow: 2px 2px 5px;',
        'text-shadow: 0 0 3px',
        'text-shadow: 3px 3px 3px;',
        'text-shadow: 3px -3px 3px;'

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
