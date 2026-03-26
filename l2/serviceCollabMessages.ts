/// <mls fileReference="_100554_/l2/serviceCollabMessages.ts" enhancement="_100554_/l2/enhancementLit"/>

import { html, } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_100554_/l2/serviceBase.js';
import { setStorageAdapter } from '/_102029_/l2/storageAdapter.js';
import * as collabMessagesIndexedDb from '/_102025_/l2/collabMessagesIndexedDB.js';
import { openElementInServiceDetails } from '/_102027_/l2/libCommom.js';
import { checkIfNotificationUnread } from '/_102025_/l2/collabMessagesSyncNotifications.js';

import '/_102025_/l2/collabMessages.js';

@customElement('service-collab-messages-100554')
export class ServiceCollabMessages extends ServiceBase {

    @property() activeTab: string = '';
    @property() msize: string = '';

    @query('collab-messages-102025') collabMessagesEl?: HTMLElement;

    public details: IService = {
        icon: '&#xf086',
        state: 'background',
        position: 'right',
        tooltip: 'Messages',
        visible: true,
        widget: '_100554_serviceCollabMessages',
        level: [0, 2, 3, 5]
    }

    public onClickMain(op: string): void {
        if (op === 'opAboutThis') this.showAboutThis();

    }

    public menu: IServiceMenu = {
        enabled: false,
        title: '',
        main: {},
        tools: {},
        tabs: undefined,
        onClickMain: this.onClickMain.bind(this),
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    async connectedCallback() {
        super.connectedCallback();
        this.setEvents();
        this.bootstrapCollabMessages()
    }

    disconnectedCallback() {
        this.removeEvents();
    }

    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties)
        this.checkNotificationPending();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        if (changedProperties.has('msize')) {
            if (!this.visible || !this.collabMessagesEl) return;
            const [w, h] = this.msize.split(',');
            this.collabMessagesEl.style.height = `${h}px`
        }
        super.updated(changedProperties)
    }

    render() {
        return html`<collab-messages-102025 mode="collab" ></collab-messages-102025>`;
    }

    private bootstrapCollabMessages() {
        setStorageAdapter(collabMessagesIndexedDb);
    }

    private setEvents() {
        mls.events.addEventListener([0, 1, 2, 3, 4, 5, 6, 7], ['collabMessages'] as any, this.onCollabEventsCollabMessages.bind(this));
        window.addEventListener('task-details-click', this.onTaskDetailsClick);
        window.addEventListener('thread-notification', this.onThreadReceivedNotification.bind(this));

    }

    private removeEvents() {
        mls.events.removeEventListener([0, 1, 2, 3, 4, 5, 6, 7], ['collabMessages'] as any, this.onCollabEventsCollabMessages.bind(this));
        window.removeEventListener('task-details-click', this.onTaskDetailsClick);
        window.removeEventListener('thread-notification', this.onThreadReceivedNotification.bind(this));


    }

    private async onTaskDetailsClick(e: Event) {
        const customEvent = e as CustomEvent;
        if (!customEvent.detail) return;
        const { messageId, taskId, task, message } = customEvent.detail;
        await import('/_100554_/l2/pluginTaskInfo.js');
        const el = document.createElement('plugin-task-info-100554');
        el.setAttribute('messageId', messageId);
        if (task && task.PK) el.setAttribute('taskId', task.PK);
        (el as any)['task'] = task;
        (el as any)['message'] = message;
        openElementInServiceDetails(el);
    }

    private async checkNotificationPending() {
        const hasPendingMessages = await checkIfNotificationUnread();
        if (hasPendingMessages) {
            this.toogleBadge(true, '_100554_serviceCollabMessages');
        }
    }

    private onThreadReceivedNotification(e: Event) {
        const customEvent = e as CustomEvent;
        this.toogleBadge(customEvent.detail, '_100554_serviceCollabMessages');
    }

    private async onCollabEventsCollabMessages(ev: mls.events.IEvent) {

        /*
        if (!ev.desc) return;
        this.threadToOpen = '';
        this.taskToOpen = '';

        try {
            const data: ICollabMessageEvent = JSON.parse(ev.desc);
            if (data.type === 'thread-open') {
                if (!data.threadId) return;
                const thread = await getThread(data.threadId);
                if (!thread) return;
                if (data.taskId) this.taskToOpen = data.taskId;

                openService('_102025_serviceCollabMessages', 'left', ev.level);
                const group = thread.group;
                this.threadToOpen = thread.threadId;
                if (group !== this.activeTab) this.activeTab = group as ITabType;
            }
        } catch (err: any) {
            console.error(err.message)
        }*/

    }


    private showAboutThis(): boolean {

        const div = document.createElement('div');
        div.style.padding = '1rem';

        let name = 'nothing selected';

        switch (this.activeTab) {
            case 'CRM':
                name = 'collab-messages-chat-102025';
                break;
            case 'TASK':
                name = 'collab-messages-tasks-102025';
                break;
            case 'APPS':
                name = 'collab-messages-apps-102025';
                break;
            case 'MOMENTS':
                name = 'collab-messages-moments-102025';
                break;
            case 'CONNECT':
                name = 'collab-messages-chat-102025';
                break;
            default:
                name = 'nothing selected';
        }

        div.innerHTML = `
        
            <h3>About this content</h3>
            <ul>
                <li>Reference: ${name}</li>
                <li>Level: ${this.level}</li>
                <li>Position: ${this.position}</li>
            </ul>
        `;

        if (this.menu.setMode) this.menu.setMode('page', div);
        return true;

    }
}
