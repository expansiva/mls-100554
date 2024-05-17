/// <mls shortName="serviceDsStyleColumn" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

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
    columnsCount: 'Contagem de coluna',
    columnsWidth: 'Largura das colunas',
    columnsGap: 'Lacuna de colunas',
    columnsRule: 'Regra de Coluna',
    columnSpan: 'Espanço da coluna',
    breakInside: 'Quebre por dentro'
}

const message_en = {
    columnsCount: 'Columns Count',
    columnsWidth: 'Columns Width',
    columnsGap: 'Columns Gap',
    columnsRule: 'Columns Rule',
    columnSpan: 'Column Span',
    breakInside: 'Break Inside'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-ds-style-column-100554')
export class ServiceDsStyleColumn extends ServiceBase {

    private msg: MessageType = messages['en'] ;

    private myUpp = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleColumn';

    constructor() {
        super();
        initCollabDSInputRange();
        initCollabDsInputSelectColor();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf0db',
        state: 'foreground',
        position: 'right',
        tooltip: 'Column',
        visible: false,
        tags: ['ds_styles'],
        widget: '_100554_serviceDsStyleColumn',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
    }

    public menu: IMenu = {
        title: 'Column',
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
        this.msg = messages[lang]

        return html`${this.renderColumn()}${this.renderGallery()}`;
    }

    renderColumn() {
        return html`
            <div>
                
                <div class="groupEdit">
                    <span>${this.msg.columnsCount}</span>
                    <collab-ds-input-range-100554 prop="column-count" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.columnsWidth}</span>
                    <collab-ds-input-range-100554 prop="column-width" value="0px" .arraySelect=${this.tpMeasures}  @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.columnsGap}</span>
                    <collab-ds-input-range-100554 prop="column-gap" value="0px" .arraySelect=${this.tpMeasures}  @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.columnsRule}</span>
                    <collab-ds-input-select-color-100554 prop="column-rule" valueInput="0px" .arrayInputSelect=${this.tpMeasures} .arraySelect=${this.tpBorder} valueSelect="none" group="border" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-select-color-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.columnSpan}</span>
                    <select @change="${() => this.onChangeProp2("column-span")}" style="width:150px" prop="column-span">
                        <option value=""></option>
                        <option value="row">Row</option>
                        <option value="row-reverse">Row Reverse</option>
                        <option value="column">Column</option>
                        <option value="column-reverse">Column Reverse</option>
                    </select>   
                </div>
                <div class="groupEdit">
                    <span>${this.msg.breakInside}</span>
                    <select @change="${() => this.onChangeProp2("break-inside")}" style="width:150px" prop="break-inside">
                        <option value=""></option>
                        <option value="none">none</option>
                        <option value="auto">auto</option>
                        <option value="avoid">avoid</option>
                        <option value="avoid-page">avoid-page</option>
                        <option value="avoid-column">avoid-column</option>
                        <option value="avoid-region">avoid-region</option>
                        <option value="inherit">inherit</option>
                        <option value="initial">initial</option>
                        <option value="unset">unset</option>
                    </select>   
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
                        <h5 style="width:235px;height:160px;font-size:60%;border: 1px solid #c3c3c3; padding:1rem;${css}" @click="${this.clickGallery}" .gallery=${css}>Lorem ipsum dolor sit amet, consectetur adipisicing elit,sed do eiusmod tempor incididunt ut labore et dolore magnaaliqua.</h5>
                        `;
                    }) as any
                )}
            </div>
        
        `
    }

    //-------------IMPLEMENTS--------------

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private tpBorder = ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset', 'hidden', 'inherit', 'initial', 'unset'];
    
    private timeonChangeProp = -1;
    private onChangeProp(obj: IBlockLessLine) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            this.emitEvent(obj);
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
        '',
        'column-count: 2;',
        'column-count: 2; column-gap: 20px; column-rule-width: 1px; column-rule-style: dashed;',
        'column-count: 3;',
        'column-count: 2; column-rule-width: 1px; column-rule-style: solid;'

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
