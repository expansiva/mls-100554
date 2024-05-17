/// <mls shortName="serviceDsComponentDetails" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { IEventDSWidgetsChangedParams } from './_100554_serviceDsComponentsList';
import { initCollabInputTag, CollabInputTag } from './_100554_collabInputTag';

/// **collab_i18n_start**
const message_pt = {
    noComponentSelected: 'Nenhum componente selecionado',
    component: 'Componente',
    editStyle: 'Editar estilo',
    removeComponent: 'Remover componente',
    group: 'Grupo',
    tags: 'Tags',
}

const message_en = {
    noComponentSelected: 'No component selected',
    component: 'Component',
    editStyle: 'Edit style',
    removeComponent: 'Remove component',
    group: 'Group',
    tags: 'Tags',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('service-ds-component-details-100554')
export class ServiceDsComponentDetails100554 extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    constructor() {
        super();
        mls.events.addListener(3, 'DSWidgetsChanged', (ev) => this.onDsWidgetsChanged(ev));
        mls.events.addListener(3, 'DSWidgetsSelected', (ev) => this.onDsWidgetsSelected());
        mls.events.addListener(3, 'DSWidgetsUnSelected', (ev) => this.onDsWidgetsUnSelected());
        initCollabInputTag();

    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf1b3',
        state: 'foreground',
        position: 'right',
        tooltip: 'Details Component',
        visible: false,
        tags: ['ds_components'],
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

    @property()
    private group: string | undefined;
    
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
        if (!data.value) return;
        this.state = { ...data.value };
        this.group = data.value.group;
    }

    private onEditStyleClick() {
        if (!this.state) return;
        this.openService('_100554_serviceDsStyles', 'left', 3);
        mls.actual[0].setFullName(this.state.name);
        const info = mls.actual[0];
        const rc = {
            emitter: 'right',
            less: '',
            isComponent: true,
            widget: `_${info.project}_${info.path}`,
            helper: '_100554_servicePreview',
            origemLevel: +this.level,
            dsindex: mls.actual[3].mode
        };
        mls.events.fire(3, 'DSStyleChanged', JSON.stringify(rc), 500);
    }

    private async removeComponent() {
        if (!this.state) return;
        const { project } = mls.actual[5];
        const { mode } = mls.actual[3];

        if (project === undefined || mode === undefined) return;
        const ds = mls.l3.getDSInstance(project, mode);
        await ds.init();
        await ds.components.remove(this.state.name);
        this.state = undefined;
        const params: IEventDSWidgetsChangedParams = {
            op: 'update',
            position: this.position,
            value: undefined
        }
        mls.events.fire(3, 'DSWidgetsChanged', JSON.stringify(params), 300);
    }

    private async updateComponent() {
        if (!this.state) return;
        const { project } = mls.actual[5];
        const { mode } = mls.actual[3];

        if (project === undefined || mode === undefined) return;
        const ds = mls.l3.getDSInstance(project, mode);
        await ds.init();
        await (ds.components as any)['update'](this.state.name, this.state);
        const params: IEventDSWidgetsChangedParams = {
            op: 'update',
            position: this.position,
            value: undefined
        }
        mls.events.fire(3, 'DSWidgetsChanged', JSON.stringify(params), 300);
    }


    private timeoutGroup: number | undefined;

    private handleInputChangeGroup(event: Event) {
        if (!event || !this.state) return;
        const target = event.target as HTMLInputElement;
        if (!target) return;
        if (target.value === '') return;
        
        this.state.group = target.value as any;
        this.group = target.value as any;
    
        if (this.timeoutGroup) clearTimeout(this.timeoutGroup);
        this.timeoutGroup = setTimeout(() => {
            this.updateComponent();
        }, 1000);
        
    }

    private handleInputChangeTags(value: string) {
        if (!this.state) return;
        this.state.tags = value.split(',');
        this.updateComponent();
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang]

        return html`
        ${!this.state
                ?
                html`<h4>${this.msg.noComponentSelected}!</h4>`
                :
                html`
                <section>
                    <p> ${this.msg.component}: ${this.state?.name}</p>
                    <div class="actions">
                        <button class="edit" @click=${() => this.onEditStyleClick()}>${this.msg.editStyle}</button>
                        <button class="remove" @click=${() => this.removeComponent()}>${this.msg.removeComponent}</button>
                    </div>

                    <div>
                        <label>${this.msg.group}:</label>
                        <br>
                        <input .value=${this.group} @input="${this.handleInputChangeGroup}"></input>
                    </div>
                    <div>
                        <label>${this.msg.tags}:</label>
                        <collab-input-tag-100554 .onValueChanged=${(value: string) => { this.handleInputChangeTags(value) }} .value=${this.state.tags.join(',')}></collab-input-tag-100554>
                    </div>
                <section>
                
                `
            }
        `;
    }
}
