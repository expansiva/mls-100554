/// <mls shortName="pluginPreviewInsights" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import {
  collab_code,
  collab_file_fragment,
  collab_file_half_dashed
} from '/_100554_/l2/collabIcons.js';
import { globalState } from '/_100554_/l2/collabState.js';
import { collabImport } from '/_100554_/l2/collabImport.js';
import { createModel } from '/_100554_/l2/collabLibModel.js';
import { ServiceSource100554 } from '/_100554_/l2/serviceSource.js';

import '/_100554_/l2/widgetDefsListEdit.js';


/// **collab_i18n_start**
const message_pt = {
  tecInsights: 'Insights técnicos',
  busInsights: 'Insights de negócio',
  settingsInsights: 'Configurações',
  insightFor: 'Insight para'

}
const message_en = {
  tecInsights: 'Technical Insights',
  busInsights: 'Business Insights',
  settingsInsights: 'Settings',
  insightFor: 'Insight for'

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
}
/// **collab_i18n_end**


@customElement('plugin-preview-insights-100554')
export class PluginPreviewInsights100554 extends StateLitElement {

  @property({ type: String }) page: string = '';
  @property({ type: String, converter: Number }) level: number = 0;

  @property({ type: String }) fileType?: mls.defs.ComponentType | undefined;

  @state() private asIs?: mls.defs.AsIs;
  @state() private loading: boolean = false;

  @state() private mode: 'technical' | 'business' | 'settings' = 'technical';

  private models: mls.editor.IModels | undefined = undefined;
  private msg: MessageType = messages['en'];

  updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('page') && this.page) {
      this.setInfos();
      this.requestUpdate()
    }

  }

  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];


    if (!this.asIs) return html`<div>Defs not found'</div>`
    const aux = this.loading ? '' : 'none'

    return html`
            <div class="overlay" style="display:${aux}">
                <div class="spinner"></div>
            </div>
            <div class="actions">
                ${this.renderHead()}
                
            </div>
            <div>
                <div class="tab-header">
                    <div class="tab-group-left">
                        <button
                            class="tab-button ${this.mode === 'technical' ? 'active' : ''}" @click=${() => this.setTabActive('technical')} >
                            ${this.msg.tecInsights}
                        </button>
                        <button
                            class="tab-button ${this.mode === 'business' ? 'active' : ''}" @click=${() => this.setTabActive('business')} >
                            ${this.msg.busInsights}

                        </button>
                        <button
                            class="tab-button ${this.mode === 'settings' ? 'active' : ''}" @click=${() => this.setTabActive('settings')} >
                            ${this.msg.settingsInsights}
                        </button>
                    </div>
                    <button @click=${this.saveDefs}>Save</button>
            </div>
        <div class="tab-content">
            ${this.renderMode()}
        </div>
    </div>`
  }

  renderHead() {
    return html`
            <div class="header" >
                <strong>${this.msg.insightFor} ${this.fileType} : </strong> ${this.page}
            </div>
                        `
  }


  renderMode() {
    switch (this.mode) {
      case 'business': return this.renderBusiness();
      case 'technical': return this.renderTechnical();
      case 'settings': return this.renderSettings();
      default: html`Invalid tab`
    }
  }

  renderSettings() {
    return html`
            <div class="settings">
                In development Settings
            </div>
        `
  }

  renderTechnical() {
    return html`
            <div class="technical">
                <h1>${collab_file_half_dashed}Meta</h1>
                <section>
                  ${this.renderMeta()}
                </section>
                <h1>${collab_file_fragment} References</h1>
                <section>
                  ${this.renderWidgets()}
                </section>
                <section>
                  ${this.renderStatesRO()}
                </section>
                <section>
                  ${this.renderStatesRW()}
                </section>
                <section>
                  ${this.renderStatesWO()}
                </section>

                <h1>${collab_code} Code Insights</h1>
                <section>
                  ${this.renderTodos()}
                </section>
                <section>
                  ${this.renderSecurityWarnings()}
                </section>
                <section>
                  ${this.renderUnusedImports()}
                </section>
                <section>
                  ${this.renderDeadCodeBlocks()}
                </section>
                <section>
                  ${this.renderAccessibility()}
                </section>
                <section>
                  ${this.renderi18nWarnings()}
                </section>                
            </div>
        `
  }

  renderWidgets() {

    return html`
    <h3>Widgets</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.asIs?.references?.webComponents || []}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveReferencesWidgets(e.detail.item)} 
    ></widget-defs-list-edit-100554>
    `
  }

  renderStatesRO() {
    return html`
    <h3>States RO (read-only)</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.asIs?.references?.statesRO}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveReferences('statesRO', e.detail.item)}
    ></widget-defs-list-edit-100554>
    `
  }

  renderStatesRW() {
    return html`
    <h3>States RW (read-write)</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.asIs?.references?.statesRW}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveReferences('statesRW', e.detail.item)}
    ></widget-defs-list-edit-100554>
    `
  }

  renderStatesWO() {
    return html`
    <h3>States WO</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.asIs?.references?.statesWO}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveReferences('statesWO', e.detail.item)}
    ></widget-defs-list-edit-100554>
    `
  }

  renderi18nWarnings() {
    return html`
    <h3>i18nWarnings</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.asIs?.codeInsights?.i18nWarnings}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveCodeInsights('i18nWarnings', e.detail.item)}
    ></widget-defs-list-edit-100554>
    `
  }

  renderAccessibility() {
    return html`
    <h3>Accessibility</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.asIs?.codeInsights?.accessibilityIssues}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveCodeInsights('accessibilityIssues', e.detail.item)}    
    ></widget-defs-list-edit-100554>
    `
  }

  renderTodos() {
    return html`
    <h3>Todos</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.asIs?.codeInsights?.todos}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveCodeInsights('todos', e.detail.item)}    
    ></widget-defs-list-edit-100554>
    `
  }

  renderSecurityWarnings() {
    return html`
    <h3>SecurityWarnings</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.asIs?.codeInsights?.securityWarnings}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveCodeInsights('securityWarnings', e.detail.item)}    
    ></widget-defs-list-edit-100554>
    `
  }

  renderDeadCodeBlocks() {
    return html`
    <h3>DeadCodeBlocks</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.asIs?.codeInsights?.deadCodeBlocks}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveCodeInsights('deadCodeBlocks', e.detail.item)}    
    ></widget-defs-list-edit-100554>
    `
  }


  renderUnusedImports() {
    return html`
    <h3>UnusedImports</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.asIs?.codeInsights?.securityWarnings}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveCodeInsights('securityWarnings', e.detail.item)}    
    ></widget-defs-list-edit-100554>
    `
  }

  renderMeta() {
    return html`
    <div class="meta-container">
      <div class="meta-item">
        <label>Group:</label>
        <input type="text" .value=${this.asIs?.meta.group || ''}></input>
      </div>
    </div>
    
    `
  }

  renderBusiness() {

    if (!this.asIs?.asIs.semantic.generalDescription) return html`No planning`;
    return html`
      <div class="business">
        <h1>Planning</h1>
          <div class="planning-info">
            <div class="field">
              <div class="label">📝 Description:</div>
              <div class="value">${this.asIs?.asIs.semantic.generalDescription || '—'}</div>
            </div>
          </div>
      </div>
        `
  }



  private onSaveCodeInsights(mode: 'todos' | 'performanceHints' | 'securityWarnings' | 'unusedImports' | 'deadCodeBlocks' | 'accessibilityIssues' | 'i18nWarnings', value: string[]) {

    if (!this.asIs || !this.asIs.codeInsights || !this.asIs.codeInsights[mode]) return;
    this.asIs.codeInsights[mode] = value;
    this.requestUpdate();
  }

  private onSaveReferences(mode: 'statesRO' | 'statesRW' | 'statesWO' | 'webComponents', value: string[]) {

    if (!this.asIs || !this.asIs.references || !this.asIs.references[mode]) return;
    this.asIs.references[mode] = value;
    this.requestUpdate();
  }

  private onSaveReferencesWidgets(value: string[]) {
    debugger;
    if (!this.asIs || !this.asIs.references) return;
    this.asIs.references.webComponents = value;
    this.requestUpdate();
  }

  private async setInfos() {

    if (!this.page) throw new Error(`Page not found: ${this.page}`);

    const { project, folder, shortName } = mls.l2.getPath(this.page);
    if (!project || !shortName) throw new Error(`Project or shortName invalids: ${this.page}`);
    const mkey = mls.editor.getKeyModel(project, shortName, folder, 2);
    this.models = mls.editor.models[mkey];

    const moduleDefs = await collabImport({ project, folder, shortName, extension: '.defs.ts' });
    if (!moduleDefs) throw new Error('Invalid module defs.ts:' + mkey);
    if (!moduleDefs.asis) throw new Error('Invalid const asIs in module .defs.ts:' + mkey);
    this.asIs = moduleDefs.asis;
    this.fileType = this.asIs?.meta.componentType;

  }

  private saveDefs() {
    if (!this.asIs) return;
    this.updateDefs(this.asIs);
  }

  private async updateDefs(defs: mls.defs.AsIs): Promise<void> {
    const fileReference: string = defs?.meta?.fileReference || "";
    let fileInfo = mls.stor.convertFileReferenceToFile(fileReference);
    if (!fileReference || fileInfo.project < 1) throw new Error(`Invalid step in update defs, incorrect meta fileRecerence: ${fileReference}`);

    const template = `/// <mls fileReference="${defs.meta.fileReference}" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = ${JSON.stringify(defs, null, 2)}
    `;

    const params = { ...fileInfo, content: template, versionRef: '0', extension: '.defs.ts' };
    await this.updateStorFile(params);

  }

  private async updateStorFile(params: { project: number, shortName: string, level: number, folder: string, content: string, extension: string, versionRef: string }): Promise<void> {

    const file = await mls.stor.addOrUpdateFile(params);
    if (!file) throw new Error('[agentDefs] Invalid storFile');
    const path = mls.stor.getKeyToFile(params);
    console.log(`[agentDefs] updating file: ${path}`);
    const models = mls.editor.getModels(params.project, params.shortName, params.folder, params.level);
    let modelDefs = models?.defs;
    if (!modelDefs) {
      modelDefs = await createModel(file, false, false);
    }
    if (!modelDefs) return;

    const serviceSource: ServiceSource100554 = globalState._ica?.serviceSource.left?.service;
    if (!serviceSource) throw new Error('Not found service source instance');
    serviceSource.setValueInModeKeepingUndo(modelDefs.model, params.content, false);

  }

  private setTabActive(tab: 'technical' | 'business' | 'settings') {
    this.mode = tab;
  }

}



