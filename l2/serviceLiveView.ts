/// <mls shortName="serviceLiveView" project="100554" enhancement="_100554_enhancementLitService" />

import { html, nothing, unsafeHTML } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';
import { openService, getProjectConfig, getProjectModuleConfig } from './_100554_libCommom';
import { convertFileNameToTag } from './_100554_utilsLit';
import './_100554_collabNav4Menu';

/// **collab_i18n_start**
const message_pt = {
    noFindModule: 'Nenhum modulo configurado.',
}

const message_en = {
    noFindModule: 'No modules configured',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


@customElement('service-live-view-100554')
export class ServiceLiveView100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    private get liveView(): any | null {
        if (!this.liveViewTag) return null;
        return this.querySelector(this.liveViewTag) as any | null;
    }

    private startInstance: any;
    private startServerInstance: any;
    private buildInstance: any;

    @state() private liveViewTag?: string;

    public details: IService = {
        icon: '&#xf06e',
        state: 'foreground',
        position: 'right',
        tooltip: 'Live View',
        visible: true,
        widget: '_100554_serviceLiveView',
        level: [7]
    };

    public menu: IServiceMenu = {
        enabled: false,
        title: '',
        main: {},
        tools: {},
        tabs: undefined,
    };

    async onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible && this.liveView?.iframe?.contentDocument) {

            const tabActual = this.liveView.tabs[this.liveView.actualTab];
            if (!tabActual) return;
            this.loading = true;
            const needUpdate = await this.buildInstance?.buildModule(tabActual.project, tabActual.moduleName);
            this.loading = false;

            if (needUpdate) {
                const actual7 = mls.actual[7];
                if (!actual7 || !actual7.project) return;
                const fullName = mls.actual[7].getFullName();
                const info = mls.l2.getPath(fullName);
                await this.liveView.init(info.project, info.shortName, info.folder);
            }
        }

    }

    async connectedCallback() {

        super.connectedCallback();
        const moduleConfig = await getProjectConfig(mls.actualProject as number);
        if (!moduleConfig || !moduleConfig.masterFrontEnd) return;
        const info = mls.l2.getPath(moduleConfig.masterFrontEnd.liveView)
        await import(`./${moduleConfig.masterFrontEnd.liveView}`);
        this.buildInstance = await import(`./${moduleConfig.masterFrontEnd.build}`);
        this.startInstance = await import(`./${moduleConfig.masterFrontEnd.start}`);

        if (moduleConfig.masterBackEnd && moduleConfig.masterBackEnd.start) {
            this.startServerInstance = await import(`./${moduleConfig.masterBackEnd.start}`);
        }

        this.liveViewTag = convertFileNameToTag(info);

    }

    async updated(_changedProperties: Map<PropertyKey, unknown>) {

        if (_changedProperties.has('liveViewTag') && _changedProperties.get('liveViewTag') !== '') {

            const actual7 = mls.actual[7];
            if (!actual7 || !actual7.project) {
                const projectConfig = await getProjectConfig(mls.actualProject as number);
                if (!projectConfig) return;
                const firstModule = projectConfig.modules[0];
                if (!firstModule) return;
                const moduleConfig = await getProjectModuleConfig(firstModule.path, mls.actualProject as number);
                if (!moduleConfig) return;
                const page = moduleConfig.initialPage;
                mls.actual[7].setFullName(`_${mls.actualProject}_${firstModule.path}/${page}`);
            }

            openService('_100554_serviceApps', 'left', 7);
            const fullName = mls.actual[7].getFullName();
            const info = mls.l2.getPath(fullName);
            this.liveView.setAttribute('mode', 'develpoment');
            await this.liveView.updatedCompleted;

            if (this.startInstance.start && typeof this.startInstance.start === 'function') {
                await this.startInstance.start();
            }

            if (this.startServerInstance && typeof this.startServerInstance.start === 'function') {
                await this.startServerInstance.start(info.project, 'all');
            }

            this.liveView?.init(info.project, info.shortName, info.folder);

        }
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (!this.liveViewTag) return html`<h3>${this.msg.noFindModule}<h3>`;
        const htmlString = `<${this.liveViewTag}></${this.liveViewTag}>`;
        return html`${unsafeHTML(htmlString)}`;
    }

}


