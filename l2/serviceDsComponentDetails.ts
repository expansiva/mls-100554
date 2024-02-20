/// <mls shortName="serviceDsComponentDetails" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { IEventDSWidgetsChangedParams } from './_100554_serviceDsComponentsList';
import { initCollabInputTag, CollabInputTag } from './_100554_collabInputTag';

@customElement('service-ds-component-details-100554')
export class ServiceDsComponentDetails100554 extends ServiceBase {

    constructor() {
        super();
        mls.events.addListener(3, 'DSWidgetsChanged', (ev) => this.onDsWidgetsChanged(ev));
        mls.events.addListener(3, 'DSWidgetsSelected', (ev) => this.onDsWidgetsSelected());
        mls.events.addListener(3, 'DSWidgetsUnSelected', (ev) => this.onDsWidgetsUnSelected());
        initCollabInputTag();

    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf02d',
        state: 'background',
        position: 'right',
        tooltip: 'Details Component',
        visible: false,
        widget: '_100554_serviceDsComponentDetails',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Details Component',
        actions: {
        },
        icons: {},
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    @property()
    private state: mls.l3.IComponentInfo | undefined;

    private onDsWidgetsSelected() {
        this.showNav2Item(true);
        if (this.visible === 'false') this.openMe();
    }

    private onDsWidgetsUnSelected() {
        this.showNav2Item(false);
    }

    private onDsWidgetsChanged(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const data: IEventDSWidgetsChangedParams = JSON.parse(ev.desc);
        if (data.position === this.position) return;

        console.info(data)
        this.state = data.value;
    }

    render() {
        return html`
        ${!this.state
                ?
                html`<h4> No component selected!</h4>`
                :
                html`
                <p> Widget: ${this.state?.name}</p>

                <div>
                    <label>Group</label>
                    <input .value=${this.state.group}></input>
                </div>
                <div>
                    <label>Tags</label>
                    <collab-input-tag-100554 .value=${this.state.tags.join(',')}></collab-input-tag-100554>
                </div>
                
                `
            }
        `;
    }
}
