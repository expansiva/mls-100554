/// <mls shortName="serviceResultsDocs" project="100554" enhancement="_100554_enhancementLit" groupName="internal" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getJson, IMembersResult } from './_100554_jsDocLib'

/// **collab_i18n_start**
const message_pt = {
    onlyWithJsdocs: 'Apenas com JSDoc'
}

const message_en = {
    onlyWithJsdocs: 'Only with JSDoc',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('service-results-docs-100554')
export class ServiceResultDocs100554 extends LitElement {

    private msg: MessageType = messages['en'] ;
    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property()
    shortName: string = '';

    @property()
    project: number = 0;

    @property()
    level: number = 0;

    @property()
    position: 'left' | 'right' = 'left';

    @property({ type: Boolean, }) loading: boolean = true;

    @property({ type: Boolean, }) onlyWithComents: boolean = false;

    private data: IMembersResult[] = [];

    async connectedCallback() {
        super.connectedCallback();
        await this.getJsDoc();
        this.loading = false;
    }

    async getJsDoc() {

        this.data = getJson('', this.onlyWithComents);
        return;
        // if (!this.shortName || !this.project) return;
        // const mfile = mls.l2.editor.get({ shortName: this.shortName, project: this.project });
        // if (!mfile) return;
        // if (!mfile.compilerResults?.devDoc) {
        //     if (mfile.compilerResults) mfile.compilerResults.modelNeedCompile = true;
        //     await mls.l2.editor.getCompilerResultTS(mfile);
        // }
        // this.data = getJson(mfile.compilerResults?.devDoc || '', this.onlyWithComents);
        // console.info(this.data)
    }


    private goToItem(sel: string, position: number): void {
        this.querySelector('[data-doc="' + sel + '"]')?.scrollIntoView();
        const params: mls.events.IMonacoAction = {
            action: 'gotoPosition',
            extension: '.ts',
            filePosition: position,
            folder: '',
            level: this.level,
            shortName: this.shortName,
            project: this.project,
            position: this.position
        };
        console.info({ goToItem: position })
        mls.events.fire([this.level as mls.events.Level], ['MonacoAction'], JSON.stringify(params));
    }


    render() {

        return html`
            <div class="docs_container">
                <div class="doc-menu" style="min-width: 200px; overflow: auto;">
                    <div class="check-container">
                        <input id="service_results_docs_check" type="checkbox">
                        <label for="service_results_docs_check">${this.msg.onlyWithJsdocs}</label>
                    </div>
                    <div>
                        ${this.data.map(groups => html`
                            <div>
                                <span class="groups">${groups.name}</span>
                                <div>
                                    ${groups.members?.map(subgroup => html`
                                        <div class="subgroup">${subgroup.name}</div>
                                    `)}
                                </div>
                            </div>
                        `)}
                    </div>
                </div>

            
            </div>
        `;
    }
}
