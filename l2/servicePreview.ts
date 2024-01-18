/// <mls shortName="servicePreview" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["service-preview-view-100554"]
 * }
 */

import { html, css, unsafeHTML, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initServicePreviewView } from './_100554_servicePreviewView';
@customElement('service-preview-100554')
export class ServicePreview100554 extends ServiceBase {

    @property() itens: any = undefined;

    @property() error: string = '';

    private info: any = {};

    constructor() {
        super();
        initServicePreviewView;
        this.setEvents();
        console.info('inicializou os eventos')
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    private levels = [1, 2, 3, 4, 5, 6, 7];

    public details: IService = {
        icon: '&#xf5b8',
        name: 'Preview 2',
        mode: 'B',
        position: 'right',
        readOnly: false,
        tooltip: 'Preview 2',
        className: undefined,
        tags: [],
        levels: [1, 2, 3, 4, 5, 6, 7]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        if (op === 'icPreview') this.preview();
    }

    public menu: IMenu = {
        title: 'Save',
        actions: {
        },
        icons: {
            icPreview: 'Preview;f06e'
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'icPreview',
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
		onClickIcon: this.onClickIcon
    }

    private showInitial(): boolean {
        return true;
    }

    onServiceClick(visible: boolean, reinit: boolean) {

        if (visible && reinit) {

        }
    }

    private preview() {
        
        const doc = document.createElement('service-preview-view-100554');
        doc.setAttribute('page', '_100554_ateste');
        doc.setAttribute('level', '2');
        
        if (this.menu.setMode) this.menu.setMode('page', doc);
        return true;
    }

    // -------------- EVENTS -------------------

    private setEvents() {

        mls.events.addEventListener([2], ['ToolBarSelected'], (ev) => this.onToolBarSelected(ev));

    }

    private onToolBarSelected(ev: mls.events.IEvent) {
        console.info('passou');
        if (!ev || !ev.desc) return;
        const params: { level: number, position: string, from: string, to: string } = ev.desc ? JSON.parse(ev.desc) : {};

        if (![2].includes(params.level) || this.position === params.position) {
            return;
        }

        if (!['_100529_service_Source'].includes(params.to)) {

            this.activeMe('H', false);
        } else {
            this.activeMe('A', true);
        }

    };


    private activeMe(status: string, click: boolean): void {

        if (!this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', status);
        if (click) this.serviceItemNav.click();

    }

    // -------------- COMPONENT ---------------

    render() {
        return html``;
    }

}




