/// <mls shortName="serviceLiveView" project="100554" enhancement="_100554_enhancementLitService" />

import { html, nothing, unsafeHTML } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_100554_/l2/serviceBase.js';
import { openService, getProjectConfig, getProjectModuleConfig } from '/_100554_/l2/libCommom.js';
import { convertFileNameToTag } from '/_100554_/l2/utilsLit.js';
import '/_100554_/l2/collabNav4Menu.js';

/// **collab_i18n_start**
const message_pt = {
    noFindModule: 'Nenhum modulo configurado.',
    noFindBuild: 'Nenhum arquivo "build" encontrado.',
    noFindStart: 'Nenhum arquivo "start" encontrado.',
}

const message_en = {
    noFindModule: 'No modules configured',
    noFindBuild: 'No find "build" file.',
    noFindStart: 'No find "start" file.',
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
                this.loading = true;
                await this.liveView.init(info.project, info.shortName, info.folder);
                this.loading = false;
            }
        }

    }

    async connectedCallback() {

        super.connectedCallback();
        const moduleConfig = await getProjectConfig(mls.actualProject as number);
        if (!moduleConfig || !moduleConfig.masterFrontEnd) return;
        const infoLiveView = mls.l2.getPath(moduleConfig.masterFrontEnd.liveView);
        const infoBuild = mls.l2.getPath(moduleConfig.masterFrontEnd.build);
        const infoStart = mls.l2.getPath(moduleConfig.masterFrontEnd.start);

        const storFileLiveView = mls.stor.files[mls.stor.getKeyToFiles(infoLiveView.project, 2, infoLiveView.shortName, infoLiveView.folder, '.ts')];
        const storFileBuild = mls.stor.files[mls.stor.getKeyToFiles(infoBuild.project, 2, infoBuild.shortName, infoBuild.folder, '.ts')];
        const storFileStart = mls.stor.files[mls.stor.getKeyToFiles(infoStart.project, 2, infoStart.shortName, infoStart.folder, '.ts')];

        if (storFileLiveView) await import(`/${moduleConfig.masterFrontEnd.liveView}`);
        if (storFileBuild) this.buildInstance = await import(`/${moduleConfig.masterFrontEnd.build}`);
        if (storFileStart) this.startInstance = await import(`/${moduleConfig.masterFrontEnd.start}`);

        if (moduleConfig.masterBackEnd && moduleConfig.masterBackEnd.start) {
            const infoBuildBE = mls.l2.getPath(moduleConfig.masterBackEnd.start);
            const storFileStartBE = mls.stor.files[mls.stor.getKeyToFiles(infoBuildBE.project, 2, infoBuildBE.shortName.replace('.js', '').replace('.ts', ''), infoBuildBE.folder.replace('/l2', ''), '.ts')];
            if (storFileStartBE) this.startServerInstance = await import(`/${moduleConfig.masterBackEnd.start}`);
        }

        if (infoLiveView.shortName) this.liveViewTag = convertFileNameToTag(infoLiveView);


    }

    async updated(_changedProperties: Map<PropertyKey, unknown>) {

        super.updated(_changedProperties);

        if (_changedProperties.has('liveViewTag') && _changedProperties.get('liveViewTag') !== '') {

            this.loading = true;

            const projectConfig = await getProjectConfig(mls.actualProject as number);

            const actual7 = mls.actual[7];
            if (!actual7 || !actual7.project) {

                if (!projectConfig) {
                    this.loading = false;
                    return;
                }
                const firstModule = projectConfig.modules[0];
                if (!firstModule) {
                    this.loading = false;
                    return;
                };
                const moduleConfig = await getProjectModuleConfig(firstModule.path, mls.actualProject as number);
                if (!moduleConfig) {
                    this.loading = false;
                    return;
                };
                const page = moduleConfig.initialPage;

                mls.actual[7].setFullName(`_${mls.actualProject}_${firstModule.path}/${page}`);
            }

            // openService('_100554_serviceCollabMessages', 'left', 7, { mode: 'Apps ' });
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

            await this.buildInstance?.buildModule(info.project, info.folder);
            await this.liveView?.init(info.project, info.shortName, info.folder);
            this.loading = false;

        }
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (!this.liveViewTag) return html`<h3>${this.msg.noFindModule}<h3>`;
        else if (!this.startInstance) return html`<h3>${this.msg.noFindStart}<h3>`;
        else if (!this.buildInstance) return html`<h3>${this.msg.noFindBuild}<h3>`;

        const htmlString = `<${this.liveViewTag}></${this.liveViewTag}>`;
        return html`${unsafeHTML(htmlString)}`;
    }

}


