/// <mls shortName="serviceCollabMessages" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { addCoachMark, ICoachMarks } from './_100554_coachMarks';
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    crm: 'CRM',
    tasks: 'Tasks',
    docs: 'Docs',
    connect: 'Conectar',
    apps: 'Apps',

    titleTasks: 'Todas as tarefas de AI, últimas',
    chats: 'Chats',
    project: 'Projeto',
    titleProject: 'Salas com referencias ao projeto atual',
    titleDocs: 'Salas com documentações e guias',
    add: 'Adicionar',
    titleAdd: 'por favor selecione abaixo para adicionar',
    notFoundReference: 'Referência não encontrada',
    noActionsToAdd: 'Nenhuma ação para adicionar',
    selectColumnsYouWant: 'Selecione as colunas que deseja visualizar',
    save: 'Salvar',
    cancel: 'Cancelar'
}
const message_en = {
    loading: 'Loading...',
    crm: 'CRM',
    tasks: 'Tasks',
    docs: 'Docs',
    connect: 'Connect',
    apps: 'Apps',

    titleTasks: 'All AI Tasks, last',
    chats: 'Chats',
    project: 'Project',
    titleProject: 'Rooms with references to the current project',
    titleDocs: 'Rooms with documentation and guides',
    add: 'Add',
    titleAdd: 'please select below to add',
    notFoundReference: 'Not found reference',
    noActionsToAdd: 'No Actions to Add',
    selectColumnsYouWant: 'Select the columns you want to view',
    save: 'Save',
    cancel: 'Cancel'
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


@customElement('service-collab-messages-100554')
export class ServiceCollabMessages100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    @property() activeTab: ITabType = 'CRM';

    public details: IService = {
        icon: '&#xf086',
        state: 'foreground',
        position: 'all',
        tooltip: 'Collab Chat',
        visible: true,
        widget: '_100554_serviceAim',
        level: [0, 2, 3, 5]
    }

    public onClickTabs(index: number) {
        if (this.activeTab === ETabs[index]) return;
        this.activeTab = ETabs[index] as ITabType;
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tools: {},
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: ETabs.CRM,
            options: [
                { text: this.msg.crm, icon: 'f095' },
                { text: this.msg.tasks, icon: 'f0ae' },
                { text: this.msg.docs, icon: 'f02d' },
                { text: this.msg.connect, icon: 'f0c1' },
                { text: this.msg.apps, icon: 'f7d9' },
            ]
        },
        onClickTabs: this.onClickTabs.bind(this),

    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        if (this.menu.setTabActive) this.menu.setTabActive(ETabs[this.activeTab]);

        switch (this.activeTab) {
            case 'CRM':
                return this.renderCRM();
            case 'Tasks':
                return this.renderTasks()
            case 'Apps':
                return this.renderApps();
            case 'Docs':
                return this.renderDocs();
            case 'Connect':
                return this.renderConnect();
            default:
                return html``;
        }
    }

    renderCRM() {

        return html`CRM`
    }

    renderTasks() {
        const infoMark: ICoachMarks = {
            key: "serviceCollabMessageTasks",
            transparency: "normal",
            fontSize: "1.1em",
            timeClose: 12,
            steps: [
                {
                    elementRef: `collab-nav-3-menu li[data-tooltip="Tasks"]`,
                    text: 'Teste',
                    position: "bottom",
                    marginV: 25,
                    marginH: 25,
                    arrow: "up",
                    duration: 3,
                    autoClose: true
                },
            ]
        }
        addCoachMark(infoMark);

        return html`Tasks`
    }

    renderApps() {
        return html`Apps`
    }

    renderDocs() {
        return html`Docs`
    }

    renderConnect() {
        return html`Connect`
    }


}

enum ETabs {
    'CRM' = 0,
    'Tasks' = 1,
    'Docs' = 2,
    'Connect' = 3,
    'Apps' = 4,
}

type ITabType = 'CRM' | 'Tasks' | 'Docs' | 'Connect' | 'Apps';

