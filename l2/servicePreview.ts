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

    private info:any = {};

    constructor() {
        super();
        initServicePreviewView;
        this.setEvents();
        console.info('passou')
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    private levels = [1, 2, 3, 4, 5, 6, 7];

    public details: IService = {
        icon: '&#xf5b8',
        name: 'Preview 2',
        mode: 'H',
        position: 'all',
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
    }

    private showInitial(): boolean {
        return true;
    }

    onServiceClick(visible: boolean, reinit: boolean) {

        if (visible && reinit) {

        }
    }

    private preview() {
        
    }

    // -------------- EVENTS -------------------

    private setEvents() {

        mls.events.addListener(2, 'FileAction', this.onMLSEvents.bind(this));

    }

    
    private timeEvent: number = -1;
    private async onMLSEvents(ev: mls.events.IEvent): Promise<void> {

        try {

            if (ev.level !== +(this.level as any) || (ev.type !== 'FileAction')) return;

            const fileAction = JSON.parse(ev.desc as any) as mls.events.IFileAction;


            if (fileAction.position === this.position || !['open', 'statusOrErrorChanged', 'changed', 'new'].includes(fileAction.action) || fileAction.project === 0) return;

            clearTimeout(this.timeEvent);
            this.timeEvent = setTimeout(async () => {

                await this.onMLSEvents2(fileAction);

            }, 500);

        } catch (e) {

            console.info(e);

        }

    }

    private async onMLSEvents2(fileAction: mls.events.IFileAction) {

        const visible = this.visible === 'true';

        if (['open', 'new'].includes(fileAction.action)) {

            const mfile = mls.l2.editor.get({ project: fileAction.project, shortName: fileAction.shortName });

            if (!mfile) {
                this.activeMe('H', false);
                return;
            }

            const mmodule = await mls.l2.enhancement.getEnhancementInstance(mfile);
            if (!mmodule) {
                this.activeMe('H', false);
                return;
            }

            //att

        } else if (visible && ['statusOrErrorChanged', 'changed'].includes(fileAction.action)) {

            const mfile = mls.l2.editor.get({ project: fileAction.project, shortName: fileAction.shortName });

            this.setError('');
            if (mfile && mfile.storFile.hasError) {
                this.setError('File has error');
                return;
            }

            //att
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

}




