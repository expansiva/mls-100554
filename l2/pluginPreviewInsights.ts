/// <mls shortName="pluginPreviewInsights" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, repeat, ifDefined, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import {
  collab_file_pen,
  collab_bug_x12,
  collab_lightbulb,
  collab_trash,
  collab_plus,
  collab_triangle_exclamation,
  collab_rectangle_list,
  collab_code,
  collab_file_fragment,
  collab_file_half_dashed
} from './_100554_collabIcons';
import { globalState, getState, initState } from './_100554_collabState';
import { collabImport } from './_100554_collabImport';


import { ServiceSource100554 } from './_100554_serviceSource';

import './_100554_collabInputTag';
import './_100554_widgetDefsPlanningChecklistEdit';
import './_100554_widgetDefsListEdit';
import './_100554_widgetDefsObjectListEdit';
import './_100554_widgetDefsPluginListEdit'

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

  @property({ type: String }) fileType?: "page" | "widget" | "plugin" | "module" | "lib" | "table" | "organism" | "service" | "info" | undefined

  @state() private defs?: mls.l4.BaseDefs;
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


    if (!this.defs) return html`<div>Defs not found'</div>`
    // if (!this.models || !this.models.defs) return html`<div>${this.msg.notFoundModels}</div>`
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
                  ${this.renderPlugins()}
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
                <section>
                  ${this.renderImports()}
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
              <section>
                  ${this.renderCodeQualityMetrics()}
                </section>
                
            </div>
        `
  }

  renderWidgets() {

    return html`
    <h3>Widgets</h3>
    <widget-defs-object-list-edit-100554
      .listItem=${this.defs?.references?.widgets || []}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveReferencesWidgets(e.detail.widgets)} 
    ></widget-defs-object-list-edit-100554>
    `
  }

  renderPlugins() {
    return html`
    <h3>Plugins</h3>
    <widget-defs-plugin-list-edit-100554
      .listItem=${this.defs?.references?.plugins || []}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveReferencesPlugins(e.detail.plugins)}
    ></widget-defs-plugin-list-edit-100554>
    `
  }

  renderStatesRO() {
    return html`
    <h3>States RO (read-only)</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.defs?.references?.statesRO}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveReferences('statesRO', e.detail.item)}
    ></widget-defs-list-edit-100554>
    `
  }

  renderStatesRW() {
    return html`
    <h3>States RW (read-write)</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.defs?.references?.statesRW}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveReferences('statesRW', e.detail.item)}
    ></widget-defs-list-edit-100554>
    `
  }

  renderStatesWO() {
    return html`
    <h3>States WO</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.defs?.references?.statesWO}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveReferences('statesWO', e.detail.item)}
    ></widget-defs-list-edit-100554>
    `
  }

  renderImports() {
    return html`
    <h3>Imports</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.defs?.references?.imports}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveReferences('imports', e.detail.item)}
    ></widget-defs-list-edit-100554>
    `
  }

  renderCodeQualityMetrics() {
    const insights = this.defs?.codeInsights;
    if (!insights) return html``;

    const metrics = [
      { key: 'correctness', label: 'Correctness' },
      { key: 'errorHandling', label: 'Error Handling' },
      { key: 'readability', label: 'Readability' },
      { key: 'maintainability', label: 'Maintainability' },
    ];

    const getEmoji = (value: number) => {
      if (value <= 3) return '😞';
      if (value <= 6) return '😐';
      if (value <= 8) return '🙂';
      return '😄';
    };

    return html`

    <h3>Code Quality Metrics</h3>

    ${[insights.errorHandling, insights.correctness, insights.maintainability, insights.readability].every((item) => item === undefined)
        ? html`No metrics`
        :
        metrics.map(({ key, label }) => {
          const value = insights[key as keyof typeof insights] ?? 0;
          if (!value) return html``
          return html`
          <div class="metric">
            <label for="${key}">${label}:</label>
            <input
              type="number"
              id="${key}"
              name="${key}"
              min="0"
              max="10"
              .value=${value}
              readonly

            />
            <span class="emoji">${getEmoji(value as number)}</span>
          </div>
        `;
        })

      }



  `;
  }


  renderi18nWarnings() {
    return html`
    <h3>i18nWarnings</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.defs?.codeInsights?.i18nWarnings}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveCodeInsights('i18nWarnings', e.detail.item)}
    ></widget-defs-list-edit-100554>
    `
  }

  renderAccessibility() {
    return html`
    <h3>Accessibility</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.defs?.codeInsights?.accessibility}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveCodeInsights('accessibility', e.detail.item)}    
    ></widget-defs-list-edit-100554>
    `
  }

  renderTodos() {
    return html`
    <h3>Todos</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.defs?.codeInsights?.todos}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveCodeInsights('todos', e.detail.item)}    
    ></widget-defs-list-edit-100554>
    `
  }

  renderSecurityWarnings() {
    return html`
    <h3>SecurityWarnings</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.defs?.codeInsights?.securityWarnings}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveCodeInsights('securityWarnings', e.detail.item)}    
    ></widget-defs-list-edit-100554>
    `
  }

  renderDeadCodeBlocks() {
    return html`
    <h3>DeadCodeBlocks</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.defs?.codeInsights?.deadCodeBlocks}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveCodeInsights('deadCodeBlocks', e.detail.item)}    
    ></widget-defs-list-edit-100554>
    `
  }


  renderUnusedImports() {
    return html`
    <h3>UnusedImports</h3>
    <widget-defs-list-edit-100554
      .listItem=${this.defs?.codeInsights?.securityWarnings}
      @onSaveEditClick=${(e: CustomEvent) => this.onSaveCodeInsights('securityWarnings', e.detail.item)}    
    ></widget-defs-list-edit-100554>
    `
  }

  renderMeta() {
    return html`
    <div class="meta-container">
      <div class="meta-item">
        <label>Group:</label>
        <input type="text" .value=${this.defs?.meta.group || ''}></input>
      </div>
      <div class="meta-item">
        <label>Tags:</label>
        <collab-input-tag-100554 .onValueChanged=${this.onTagsChange} .tags=${this.defs?.meta.tags || []}></collab-input-tag-100554>
      </div>
    </div>
    
    `
  }

  renderBusiness() {

    if (!this.defs?.planning) return html`No planning`;
    return html`
      <div class="business">
        <h1>Planning</h1>
          <div class="planning-info">
            <div class="field">
              <div class="label">📝 Description:</div>
              <div class="value">${this.defs?.planning.generalDescription || '—'}</div>
            </div>
            <div class="field">
              <div class="label">🎯 Goal:</div>
              <div class="value">${this.defs?.planning.goal || '—'}</div>
            </div>
          </div>


          <section>
            ${this.renderUserStories()}
          </section>
          <section>
            ${this.renderUserRequestFeatures()}
          </section>
          <section>
            ${this.renderUserRequestsBugs()}
          </section>
          <section>
            ${this.renderUserRequestsEnhancements()}
          </section>
      </div>
        `
  }

  private renderUserStories() {
    return html`
      <h3>User Stories ${collab_file_pen} </h3>
      <div class="section user-stories">
        <div>
            ${this.defs?.planning?.userStories?.map((story, storyIdx) => {

      const { totalDone, totalPending } = story.derivedRequirements.reduce(
        (acc, item) => {
          if (item.done) acc.totalDone++;
          else acc.totalPending++;
          return acc;
        },
        { totalDone: 0, totalPending: 0 }
      );
      const total = story.derivedRequirements.length;

      return html`
              <div class="user-story">
                <details>
                  <summary>
                  <span class="${totalDone === total ? 'summary-done' : 'summary-pending'}"> ${totalDone === total ? '✔' : collab_triangle_exclamation} Done (${totalDone}/${total})</span> 
                    -
                    <span>${story.story} </span>
                    <span @click=${(e: MouseEvent) => this.removeStorie(e, storyIdx)}> ${collab_trash}</span>
                  </summary>
                  <div>
                    ${repeat(
        story.derivedRequirements,
        ((item: ITempPlanningL4, index: number) => item.description) as () => string,
        ((req: ITempPlanningL4, reqIdx: number) => {
          const isEditing = req.isEditMode;
          delete req.isEditMode;
          return html`
                        <div class="planning-checklist-item">
                          <widget-defs-planning-checklist-edit-100554
                            @onSaveEditClick=${() => this.requestUpdate()}
                            @onItemDelete=${(e: CustomEvent) => { this.deleteStoryItem(storyIdx, e.detail.index); }}
                            @onImproveClick=${(e: CustomEvent) => { this.onImproveClick(e.detail.item); }}
                            index=${reqIdx} checkNumber=${reqIdx + 1} 
                            .planningItem=${req}
                            isEditing=${ifDefined(isEditing)}
                          ></widget-defs-planning-checklist-edit-100554>
                        </div>`}) as () => TemplateResult<1>)
        }
                    <div class="planning-add-item" @click=${() => { this.addStoryItem(storyIdx) }}>
                      <i>${collab_plus}</i>
                      <span>Add</span>
                    </div>
                  </div> 
                </details>                          
              </div>
            `})}
  
        </div> 
        <div class="add-new-userStorie-container"> <button @click=${() => { }}>Add new storie</button></div>                
      </div>
    `
  }

  private renderUserRequestFeatures() {
    if (!this.defs?.planning?.userRequestsFeatures) return html``
    return html`
      <h3>User Requests Features ${collab_rectangle_list}</h3>
      <div class="section">
          <div>
            ${this.defs?.planning?.userRequestsFeatures ?

        repeat(
          this.defs.planning.userRequestsFeatures,
          ((item: ITempPlanningL4, index: number) => item.description) as () => string,
          ((req: ITempPlanningL4, reqIdx: number) => {
            const isEditing = req.isEditMode;
            delete req.isEditMode;
            return html`
                        <div class="planning-checklist-item">
                          <widget-defs-planning-checklist-edit-100554
                            @onSaveEditClick=${() => this.requestUpdate()}
                            @onItemDelete=${(e: CustomEvent) => { this.deletePlannigItem('userRequestsFeatures', e.detail.index); }}
                            @onImproveClick=${(e: CustomEvent) => { this.onImproveClick(e.detail.item); }}
                            index=${reqIdx} checkNumber=${reqIdx + 1} 
                            isEditing=${ifDefined(isEditing)}
                            .planningItem=${req}
                          ></widget-defs-planning-checklist-edit-100554>
                      </div>`}) as () => TemplateResult<1>
        )

        : ''
      }
            <div class="planning-add-item" @click=${() => { this.addPlannigItem('userRequestsFeatures') }}>
              <i>${collab_plus}</i>
              <span>Add</span>
            </div>
          </div>                  
      </div>`
  }

  private renderUserRequestsBugs() {

    return html`
      <h3>User Requests Bugs ${collab_bug_x12} </h3>
      <div class="section">
          <div>
            ${this.defs?.planning?.userRequestsBugs ?
        repeat(
          this.defs.planning.userRequestsBugs,
          ((item: ITempPlanningL4, index: number) => item.description) as () => string,
          ((req: ITempPlanningL4, reqIdx: number) => {
            const isEditing = req.isEditMode;
            delete req.isEditMode;
            return html`
                        <div class="planning-checklist-item">
                          <widget-defs-planning-checklist-edit-100554
                            @onSaveEditClick=${() => this.requestUpdate()}
                            @onItemDelete=${(e: CustomEvent) => { this.deletePlannigItem('userRequestsBugs', e.detail.index); }}
                            @onImproveClick=${(e: CustomEvent) => { this.onImproveClick(e.detail.item); }}
                            index=${reqIdx} checkNumber=${reqIdx + 1} 
                            isEditing=${ifDefined(isEditing)}
                            .planningItem=${req}
                          ></widget-defs-planning-checklist-edit-100554>
                      </div>`}) as () => TemplateResult<1>)


        : ''
      }
            <div class="planning-add-item" @click=${() => { this.addPlannigItem('userRequestsBugs') }}>
              <i>${collab_plus}</i>
              <span>Add</span>
            </div>
          </div>                  
      </div>`

  }

  private renderUserRequestsEnhancements() {
    return html`
      <h3>User Requests Enhancements ${collab_lightbulb}</h3>
        <div class="section">
          <div>
            ${this.defs?.planning?.userRequestsEnhancements ?

        repeat(
          this.defs.planning.userRequestsEnhancements,
          ((item: ITempPlanningL4, index: number) => item.description) as () => string,
          ((req: ITempPlanningL4, reqIdx: number) => {
            const isEditing = req.isEditMode;
            delete req.isEditMode;
            return html`
                        <div class="planning-checklist-item">
                          <widget-defs-planning-checklist-edit-100554
                            @onSaveEditClick=${() => this.requestUpdate()}
                            @onItemDelete=${(e: CustomEvent) => { this.deletePlannigItem('userRequestsEnhancements', e.detail.index); }}
                            @onImproveClick=${(e: CustomEvent) => { this.onImproveClick(e.detail.item); }}
                            index=${reqIdx} checkNumber=${reqIdx + 1} 
                            isEditing=${ifDefined(isEditing)}
                            .planningItem=${req}
                          ></widget-defs-planning-checklist-edit-100554>
                      </div>`}) as () => TemplateResult<1>
        )
        : ''
      }
            <div class="planning-add-item" @click=${() => { this.addPlannigItem('userRequestsEnhancements') }}>
              <i>${collab_plus}</i>
              <span>Add</span>
            </div>
          </div>                  
      </div>`
  }

  private onTagsChange(val: string) {
    if (this.defs?.meta.tags) this.defs.meta.tags = val.split(',');
  }

  private deleteStoryItem(indexStory: number, index: number) {
    if (!this.defs?.planning || !this.defs.planning.userStories || !this.defs.planning?.userStories[indexStory]) return;
    this.defs.planning?.userStories[indexStory].derivedRequirements.splice(index, 1);
    this.requestUpdate();
  }

  private addStoryItem(indexStory: number) {
    const item: ITempPlanningL4 = {
      description: '',
      comment: '',
      done: false,
      isEditMode: true
    }

    if (!this.defs?.planning || !this.defs.planning.userStories || !this.defs.planning?.userStories[indexStory]) return;
    this.defs.planning?.userStories[indexStory].derivedRequirements.push(item);
    this.requestUpdate();

  }

  private deletePlannigItem(key: 'userRequestsEnhancements' | 'userRequestsBugs' | 'userRequestsFeatures', index: number) {
    if (!this.defs?.planning || !this.defs.planning[key]) return;
    this.defs.planning[key]?.splice(index, 1)
    this.requestUpdate();
  }

  private addPlannigItem(key: 'userRequestsEnhancements' | 'userRequestsBugs' | 'userRequestsFeatures') {
    const item: ITempPlanningL4 = {
      description: '',
      comment: '',
      done: false,
      isEditMode: true
    }

    if (!this.defs?.planning || !this.defs.planning[key]) return;
    this.defs.planning[key]?.push(item);
    this.requestUpdate();

  }

  private removeStorie(e: MouseEvent, index: number) {
    e.preventDefault();
    if (!this.defs?.planning?.userStories || !this.defs.planning.userStories[index]) return;
    this.defs.planning.userStories.splice(index, 1);
    this.requestUpdate();
  }

  private onImproveClick(item: mls.l4.Planning) {
    const service = getState('preview.service');
    if (!service) return;
    const collabMessagesPrompt: HTMLElement = service.querySelector('collab-messages-prompt-100554');
    if (!collabMessagesPrompt) return;
    const text = `@@Improve { description: ${item.description} comment: ${item.comment}}`
    collabMessagesPrompt.setAttribute('text', text);
  }

  private onSaveCodeInsights(mode: 'todos' | 'securityWarnings' | 'unusedImports' | 'deadCodeBlocks' | 'accessibility' | 'i18nWarnings', value: string[]) {
    if (!this.defs || !this.defs.codeInsights || !this.defs.codeInsights[mode]) return;
    this.defs.codeInsights[mode] = value;
    this.requestUpdate();
  }

  private onSaveReferences(mode: 'statesRO' | 'statesRW' | 'statesWO' | 'imports', value: string[]) {
    if (!this.defs || !this.defs.references || !this.defs.references[mode]) return;
    this.defs.references[mode] = value;
    this.requestUpdate();
  }

  private onSaveReferencesWidgets(value: mls.l4.DefsWidget[]) {

    if (!this.defs || !this.defs.references) return;
    this.defs.references.widgets = value;
    this.requestUpdate();
  }

  private onSaveReferencesPlugins(value: mls.l4.DefsPlugin[]) {
    if (!this.defs || !this.defs.references) return;
    this.defs.references.plugins = value;
    this.requestUpdate();
  }

  private async setInfos() {

    if (!this.page) throw new Error(`Page not found: ${this.page}`);

    const { project, folder, shortName } = mls.l2.getPath(this.page);
    if (!project || !shortName) throw new Error(`Project or shortName invalids: ${this.page}`);
    const mkey = mls.editor.getKeyModel(project, shortName, folder);
    this.models = mls.editor.models[mkey];

    const moduleDefs = await collabImport({ project, folder, shortName, extension: '.defs.ts' });
    if (!moduleDefs) throw new Error('Invalid module defs.ts:' + mkey);
    if (!moduleDefs.defs) throw new Error('Invalid const defs in module .defs.ts:' + mkey);

    this.defs = moduleDefs.defs;
    this.fileType = this.defs?.meta.type;

  }

  private saveDefs() {
    if (!this.defs) return;
    this.updateDefs(this.defs);
  }

  private async updateDefs(result: mls.l4.BaseDefs): Promise<void> {

    if (!result.meta.projectId || !result.meta.shortName) throw new Error("Invalid step in update defs, incorrect meta: '" + result?.meta?.projectId + "', '" + result?.meta?.shortName + "'");

    if ('compileEmbedding' in result) delete result.compileEmbedding;

    let models = mls.editor.getModels(result.meta.projectId, result.meta.shortName, result.meta.folder);
    if (!models) models = await mls.editor.addModels(result.meta.projectId, result.meta.shortName, result.meta.folder || '')
    if (!models) throw new Error('Erro, model error on AddModels, stoping');

    const template = `/// <mls shortName="${result.meta.shortName}" project="${result.meta.projectId}" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = ${JSON.stringify(result, null, 2)}
    `;

    if (models.defs) {

      const serviceSource: ServiceSource100554 = globalState._ica?.serviceSource.left?.service;
      if (!serviceSource) throw new Error('Not found service source instance');
      serviceSource.setValueInModeKeepingUndo(models.defs.model, template, false);
    }

  }

  private setTabActive(tab: 'technical' | 'business' | 'settings') {
    this.mode = tab;
  }

}



const defsMock: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginCreateNewProject",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "project-creation",
      "collab.codes",
      "plugin"
    ]
  },
  "references": {
    "widgets": [
      {
        tag: 'widget-1',
        analysis: {
          hasLogic: true,
          independent: true,
          reusable: true,
          suggestion: 'widget'
        },
        bindings: [], // string[]
        purpose: '',
        used: true
      }
    ],
    "plugins": [],
    "statesRO": [
      "actualSiteSelected",
      "// usado em leitura para verificar seleção",
      "currentScenario"
    ],
    "statesRW": [
      "actualSiteSelected",
      "// alterado em onTypeSiteClick",
      "currentScenario"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabIcons",
      "./_100554_pluginBaseModule"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Uso de alert() para mensagens de erro e avisos. Embora não seja crítico, pode ser considerado inseguro ou inadequado para UX em produção.",
      "Não há sanitização explícita de dados de entrada do usuário nos campos de input/textarea, mas como não há uso de innerHTML, o risco é baixo.",
      "Não há uso de innerHTML, window direto, nem tokens hardcoded sensíveis."
    ],
    "unusedImports": [
      "css (importado de 'lit', mas não utilizado no código)"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "O componente utiliza <input>, <textarea> e <button> nativos, o que garante acessibilidade básica.",
      "Não há uso de atributos aria-* explícitos.",
      "Botões são acessíveis via teclado.",
      "Uso de <summary> dentro de <details> melhora a navegação por teclado.",
      "Contraste de cores parece adequado, mas depende das variáveis CSS definidas no tema.",
      "Sugestão: adicionar labels explícitos para inputs e atributos aria-label onde necessário para melhorar ainda mais a acessibilidade."
    ],
    "i18nWarnings": [
      "Strings como 'Resume', 'Id:', 'Test' e nomes de plugins/títulos de cards não estão internacionalizadas.",
      "A maioria das mensagens essenciais está corretamente internacionalizada via objeto messages."
    ]
  },
  "planning": {
    "generalDescription": "Plugin para criação de novos projetos no Collab.codes, permitindo ao usuário selecionar o tipo de projeto, customizar opções e escolher plugins de publicação e armazenamento.",
    "goal": "Facilitar a criação de novos projetos de diferentes tipos, com seleção de plugins e opções personalizadas, de forma guiada e acessível.",
    "userStories": [
      {
        "story": "Como usuário, quero criar um novo projeto selecionando o tipo de site e plugins desejados, para iniciar rapidamente um novo workspace.",
        "derivedRequirements": [
          {
            "description": "Exibir lista de tipos de projetos disponíveis para seleção.",
            "done": true,
            "comment": "Implementado via tabela e lista no cenário 'select'."
          },
          {
            "description": "Permitir seleção de plugins de publicação e armazenamento.",
            "done": true,
            "comment": "Implementado via cards interativos no cenário 'customize'."
          },
          {
            "description": "Internacionalizar mensagens principais para PT e EN.",
            "done": true,
            "comment": "Mensagens principais estão internacionalizadas, mas há pequenas strings não cobertas."
          },
          {
            "description": "Bloquear avanço se nenhum tipo de projeto for selecionado.",
            "done": true,
            "comment": "Implementado em onBtnContinueClick()."
          },
          {
            "description": "Exibir detalhes do tipo de projeto selecionado.",
            "done": true,
            "comment": "Implementado na coluna direita do cenário 'select'."
          },
          {
            "description": "Permitir navegação entre etapas (select/customize).",
            "done": false,
            "comment": "Controlado via currentScenario."
          }
        ]
      },
      {
        "story": "Como usuário, quero poder entrar no Collab.codes usando minha conta Google, GitHub ou GitLab para facilitar o acesso.",
        "derivedRequirements": [
          {
            "description": "Exibir botões de login para Google, GitHub e GitLab.",
            "done": true,
            "comment": "Implementado nos métodos renderButton e render."
          },
          {
            "description": "Mostrar o estado de conexão do provedor (conectado, pode conectar, pode desconectar, pode adicionar).",
            "done": true,
            "comment": "Implementado em getState e renderButton."
          },
          {
            "description": "Internacionalizar todas as mensagens e labels.",
            "done": true,
            "comment": "Implementado via objetos message_pt e message_en."
          },
          {
            "description": "Permitir logoff do usuário.",
            "done": true,
            "comment": "Implementado no método logoff e renderLogOff."
          },
          {
            "description": "Redirecionar corretamente para os fluxos OAuth de cada provedor.",
            "done": true,
            "comment": "Implementado nos métodos googleLogin, gitHubLogin, gitLabLogin."
          },
          {
            "description": "Exibir links para Termos de Serviço e Política de Privacidade.",
            "done": true,
            "comment": "Implementado em renderFooter."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a mais idiomas além de PT e EN.",
        "done": true,
        "comment": "Atualmente só PT/EN; estrutura permite expansão."
      },
      {
        "description": "Permitir salvar rascunho do projeto antes de criar.",
        "done": false,
        "comment": "Não implementado; só há alerta de 'em desenvolvimento' ao criar."
      }
    ],
    "userRequestsBugs": [{
      "description": "Injeçao de javascript",
      "done": false,
      "comment": "Fazer validação para não permitir injeção de código"
    }],
    "constraints": [],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com labels e aria-*.",
        "done": false,
        "comment": "Inputs não possuem labels explícitos nem aria-label."
      }
    ]
  },
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}


interface ITempPlanningL4 extends mls.l4.Planning {
  isEditMode?: boolean
}