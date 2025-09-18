/// <mls shortName="modules" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getInstanceByFile, openService, saveOpenedFile, getLastModule, setLastModule } from './_100554_libCommom';
import { collabImport } from './_100554_collabImport';

import { StateLitElement } from './_100554_stateLitElement';

import '/_100554_pluginDeleteModule';

@customElement('modules-100554')
export class Modules100554 extends StateLitElement {


  @state() currentView: 'list' | 'details' | 'error' | 'add' = 'list';
  @state() error = '';
  @state() archiveConfirmationText = '';
  @state() selectedModule?: IMyModule;
  @state() myModules: IMyModule[] = [];


  //------------COMPONENT---------------

  firstUpdated() {
    this.loadModule();
    this.setMyModules();
  }

  render() {

    switch (this.currentView) {
      case ('list'): return this.renderModuleList();
      case ('details'): return this.renderModuleDetails();
      case ('error'): return this.renderError();
      case ('add'): return this.renderAdd();

    }

  }

  renderHeader() {
    return html`
      <div class="header">
        <h2>Select a Module</h2>
        <input type="text" autocomplete="off" placeholder="Filter modules..." id="module-filter" @input="${this.filterLiChange}">
        <button style="margin:0px; width:150px;" @click=${() => { this.goTo('add') }}><svg style="width:12px; fill:#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg></button>
      </div> 
    `
  }

  renderError() {
    return html`
      <div class="header">
        <h2>Select a Module</h2>
      </div> 
      <h3 style="color:red">${this.error}</h3> 
      `
  }

  renderAdd() {
    return html`
      <button style="margin:0px; width:150px;" @click=${() => { this.goTo('list') }}>cancel</button>
      <div class="header">
        <h2>In developed</h2>
      </div> 
       
      `
  }

  renderModuleList() {

    if (!this.myModules || this.myModules.length <= 0) {
      return html`
      ${this.renderHeader()}
      <div class="modules-list">
        <h3>Any modules found!</h3>
      </div>
      `

    }

    return html`
      ${this.renderHeader()}

      <div class="modules-list">
        ${this.myModules.map(mm => html`
          <div class="module-card ${mls.actualModule === mm.name ? 'selected' : ''} " .filter="${mm.name.toLocaleLowerCase()}">
            <div class="card-content">
              <div class="module-title">${mm.name}</div>
              <div class="module-category">Category: ${mm.category}</div>
              <div class="module-uses">Used in ${mm.totFiles} files</div>
              <div class="actions">
                <a href="#" @click=${(e: MouseEvent) => this.selectThis(e, mm)} class="btnSelect">${mls.actualModule === mm.name ? 'Selected' : 'Select'}</a>
                <a href="#" @click=${(e: MouseEvent) => this.openDetails(e, mm)}>⋯</a>
              </div>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  renderModuleDetails() {
    return html`
        <div class="module-details">
        <button class="back-button" @click=${this.goBack}>← Back</button>
        <div>
          <plugin-delete-module-100554 moduleName=${this.selectedModule?.name} project=${mls.actualProject}></plugin-delete-module-100554>
        </div>
      </div>
    `;
  }

  //--------IMPLEMENTATION-------------
  private KeyItem = '_100554_modules';

  private selectThis(ev: MouseEvent, mm: any) {
    ev.preventDefault();
    mls.setActualModule(mm.name);
    this.setLocal(mm.name);
    this.goToL4();
    this.requestUpdate();
  }

  private loadModule() {
    const mm = this.getLocal();
    if (!mm) return;
    mls.setActualModule(mm);
  }

  private setLocal(mm: string) {
    if (!mls.actualProject) return;
    setLastModule(mls.actualProject, mm);
  }

  private getLocal(): string {
    const modulesLS = getLastModule();
    if (!modulesLS || !mls.actualProject) return '';
    return modulesLS[mls.actualProject];
  }

  private openDetails(ev: MouseEvent, mm: IMyModule) {
    ev.preventDefault();
    this.selectedModule = mm;
    this.currentView = 'details';
    this.archiveConfirmationText = '';
  }

  private goBack() {
    this.currentView = 'list';
    this.setMyModules();
    this.selectedModule = undefined;
    this.archiveConfirmationText = '';
  }

  private goTo(scenary: string) {
    this.currentView = scenary as any;
  }

  private async setMyModules() {

    try {

      const key = mls.stor.getKeyToFiles(mls.actualProject as number, 2, 'project', '', '.ts');
      const f = mls.stor.files[key];
      if (!f) throw new Error('[setMyModules] Not found storfile');

      const { folder, shortName, project } = f;
      const mm = await collabImport({ folder, project, shortName }) as any;
      if (!mm || !mm.modules) throw new Error('[setMyModules] Not found modules')

      const ar: IMyModule[] = [];
      const files = Object.keys(mls.stor.files).reduce((acc, key) => {
        const f = mls.stor.files[key];
        if (f && f.extension === '.ts') acc.push(f);
        return acc;
      }, [] as mls.stor.IFileInfo[]);


      mm.modules.forEach((m: any) => {

        const tot = files.filter((f) => f.folder === m.name || (f.folder === '' && m.name.toLowerCase() === 'default')).length;

        ar.push({
          name: m.name,
          category: 'core',
          totFiles: tot
        })

      });

      this.myModules = this.moveToFirst(ar, mls.actualModule || '');

    } catch (e: any) {
      this.error = e.message;
      this.currentView = 'error';
    }

  }

  private timeFilterChange = 0;
  private filterLiChange(e: InputEvent) {

    e.stopPropagation();
    const el = e.target as HTMLInputElement;
    if (!el) return;
    clearTimeout(this.timeFilterChange);
    this.timeFilterChange = setTimeout(() => {

      const all = this.querySelectorAll('.module-card');
      all.forEach((card: any) => {

        const name = card.filter ? card.filter : '******';
        const inp = el.value.toLocaleLowerCase();

        if (name.indexOf(inp) >= 0) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      })

    }, 500);

  }

  private moveToFirst(modules: IMyModule[], moduleName: string): IMyModule[] {

    const found = modules.find(m => m.name === moduleName);
    if (!found) return modules;
    const others = modules.filter(m => m.name !== moduleName);
    return [found, ...others];
  };

  private async goToL4() {

    try {
      if (mls.actualModule?.toLocaleLowerCase() !== 'default') {

        const key = mls.stor.getKeyToFiles(mls.actualProject as number, 2, 'module', mls.actualModule || '', '.ts');
        const f = mls.stor.files[key];

        if (f) {

          const mm = await getInstanceByFile(f) as any;

          if (!mm || !mm.moduleConfig) throw new Error('[goToL4] Not found moduleConfig');

          const folder = mls.actualModule || '';
          const project = mls.actualProject || 0;
          const shortName = mm.moduleConfig.initialPage;
          const fullName = folder ? `_${project}_${folder}/${shortName}` : `_${project}_${shortName}`;

          mls.actual[4].setFullName(fullName);
          mls.actual[7].setFullName(fullName);
          saveOpenedFile(project, 4, fullName);
          saveOpenedFile(project, 7, fullName);

        }

      }

      openService('_100554_servicePage', 'left', 4, { 'tab': 'navigation' });

    } catch (e) {
      openService('_100554_servicePage', 'left', 4);
    }

  }

  private mockModules = [
    { name: 'Authentication', category: 'Core', uses: 312 },
    { name: 'Payments', category: 'Integration', uses: 159 },
    { name: 'Dashboard', category: 'UI', uses: 512 },
    { name: 'Notifications', category: 'Service', uses: 98 },
  ];
}

interface IMyModule {
  name: string,
  category: string,
  totFiles: number
}
