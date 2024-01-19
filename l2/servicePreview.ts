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

    private lastMode: string = 'icPreviewD';

    private info: any = {};

    constructor() {
        super();
        initServicePreviewView;
        this.setEvents();
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
        this.lastMode = op;
        if (op === 'icPreviewD') this.preview('d');
        if (op === 'icPreviewM') this.preview('m');
    }

    public menu: IMenu = {
        title: 'Save',
        actions: {
        },
        icons: {
            icPreviewD: 'Desktop;f390',
            icPreviewM: 'Mobile;f3cf'
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'icPreviewD',
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon
    }

    onServiceClick(visible: boolean, reinit: boolean) {

        if (visible && this.menu.setIconActive) {
            this.menu.setIconActive(this.lastMode);
        }
    }



    // -------------- EVENTS -------------------

    private setEvents() {

        mls.events.addListener(2, 'FileAction', this.onMLSFileAction.bind(this));

    }

    private timeEvent: number = -1;
    private async onMLSFileAction(ev: mls.events.IEvent): Promise<void> {

        try {

            if (this.visible === 'false' || !this.visible) return;

            if (ev.level !== +this.level || (ev.type !== 'FileAction')) return;

            const fileAction = JSON.parse(ev.desc as any) as mls.events.IFileAction;

            const eventsValid = ['open', 'statusOrErrorChanged', 'changed', 'new'];

            if (
                fileAction.position === this.position ||
                !eventsValid.includes(fileAction.action)
            ) return;

            clearTimeout(this.timeEvent);
            this.timeEvent = setTimeout(async () => {

                this.onServiceClick(true, false);

            }, 500);

        } catch (e) {

            console.info(e);

        }

    }

    private activeMe(status: string, click: boolean): void {

        if (!this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', status);
        if (click) this.serviceItemNav.click();

    }

    // -------------- COMPONENT ---------------

    render() {
        return html``;
    }

    // -------------- IMPLEMENTS-----------------

    private async preview(mode: string) {

        if (!mls.actual[2].project) return true;

        const doc = document.createElement('service-preview-view-100554');
        doc.setAttribute('page', mls.actual[2].getFullName());
        doc.setAttribute('level', this.level as any);
        doc.setAttribute('mode', mode);
        (doc as any).father = this;
        if (this.menu.setMode) this.menu.setMode('page', doc);
        return true;

    }

}




