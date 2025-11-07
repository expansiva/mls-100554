/// <mls shortName="serviceLiveView" project="100554" enhancement="_100554_enhancementLitService" />

import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';
import { openService } from './_100554_libCommom';
import { buildModule } from './_100554_libLiveView';
import './_100554_collabNav4Menu';
import './_100554_collabAuraLiveView';
import { CollabAuraLiveView100554 } from './_100554_collabAuraLiveView';

@customElement('service-live-view-100554')
export class ServiceLiveView100554 extends ServiceBase {

    @query('collab-aura-live-view-100554') liveView?: CollabAuraLiveView100554;

    public details: IService = {
        icon: '&#xf06e',
        state: 'foreground',
        position: 'right',
        tooltip: 'Live View',
        visible: true,
        widget: '_100554_serviceLiveView',
        level: [7]
    };

    public onClickMain(op: string): void {
        if (this.menu.setMode) this.menu.setMode('initial');
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tools: {},
        tabs: undefined,
        onClickMain: this.onClickMain.bind(this),
    };

    async onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (visible && this.liveView?.iframe?.contentDocument) {
            const tabActual = this.liveView.tabs[this.liveView.actualTab];
            if (!tabActual) return;
            this.loading = true;
            const needUpdate = await buildModule(tabActual.project, tabActual.moduleName);
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

    async firstUpdated() {
        const actual7 = mls.actual[7];
        if (!actual7 || !actual7.project) return;
        openService('_100554_serviceApps', 'left', 7);
        const fullName = mls.actual[7].getFullName();
        const info = mls.l2.getPath(fullName);
        this.liveView?.init(info.project, info.shortName, info.folder);
    }

    render() {
        return html`
			<collab-aura-live-view-100554 mode="develpoment"></collab-aura-live-view-100554>
		`;
    }

}


