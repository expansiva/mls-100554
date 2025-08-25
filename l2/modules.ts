/// <mls shortName="modules" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getInstanceByFile, openService } from './_100554_libCommom';
import { StateLitElement } from './_100554_stateLitElement';

@customElement('modules-100554')
export class Modules100554 extends StateLitElement {


  @state() currentView: 'list' | 'details' | 'error' = 'list';
  @state() error = '';
  @state() archiveConfirmationText = '';
  @state() selectedModule: any = null;
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

    }

  }

  renderHeader() {
    return html`
      <div class="header">
        <h2>Select a Module</h2>
        <input type="text" autocomplete="off" placeholder="Filter modules..." id="module-filter" @input="${this.filterLiChange}">
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
        <div>In development</div>
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
    try {
      let info: any = localStorage.getItem(this.KeyItem);
      if (!info) info = '{}';

      info = JSON.parse(info);

      info[mls.actualProject || 0] = mm;

      localStorage.setItem(this.KeyItem, JSON.stringify(info));

    } catch (e) {
      console.info(e);
    }

  } 

  private getLocal(): string {
    try {
      let info: any = localStorage.getItem(this.KeyItem);
      if (!info) return '';
      info = JSON.parse(info);
      return info[mls.actualProject || 0] as string || '';

    } catch (e) {
      return '';
    }

  }

  private openDetails(ev: MouseEvent, mm: any) {
    ev.preventDefault();
    this.selectedModule = mm;
    this.currentView = 'details';
    this.archiveConfirmationText = '';
  }

  private goBack() {
    this.currentView = 'list';
    this.selectedModule = null;
    this.archiveConfirmationText = '';
  }

  private async setMyModules() {

    try {

      const key = mls.stor.getKeyToFiles(mls.actualProject as number, 2, 'project', '', '.ts');
      const f = mls.stor.files[key];
      if (!f) throw new Error('[setMyModules] Not found storfile');

      const mm = await getInstanceByFile(f) as any;
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
          const project = mls.actualProject;
          const shortName = mm.moduleConfig.initialPage;
          const fullName = folder ? `_${project}_${folder}/${shortName}` : `_${project}_${shortName}`;
          
          mls.actual[4].setFullName(fullName);
          mls.actual[7].setFullName(fullName);

        }

      }

      openService('_100554_servicePage', 'left', 4);

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
