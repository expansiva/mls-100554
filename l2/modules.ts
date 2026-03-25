/// <mls fileReference="_100554_/l2/modules.ts" enhancement="_100554_/l2/enhancementLit" />


import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getInstanceByFile, openService, saveOpenedFile, getLastModule, setLastModule, getProjectConfig } from '/_102027_/l2/libCommom.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js'

/// **collab_i18n_start**
const message_pt = {
  title: 'Módulos Instalados',
  titleAdd: 'Novo Módulo',
  addModule: 'Adicionar Módulo',
  back: 'Voltar',
  loading: 'Carregando...',
  empty: 'Nenhum módulo instalado',
  files: 'arquivos',
  moduleName: 'Nome do Módulo',
  moduleNamePlaceholder: 'Digite o nome do módulo',
  category: 'Categoria',
  categoryPlaceholder: 'Digite a categoria',
  save: 'Salvar Módulo',
}

const message_en = {
  title: 'Installed Modules',
  titleAdd: 'New Module',
  addModule: 'Add Module',
  back: 'Back',
  loading: 'Loading...',
  empty: 'No modules installed',
  files: 'files',
  moduleName: 'Module Name',
  moduleNamePlaceholder: 'Enter module name',
  category: 'Category',
  categoryPlaceholder: 'Enter category',
  save: 'Save Module',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
}
/// **collab_i18n_end**

interface IMyModule {
  name: string;
  category: string;
  totFiles: number;
}

type ViewMode = 'list' | 'add';

@customElement('modules-100554')
export class Modules extends CollabLitElement {

  private msg: MessageType = messages['en'];

  @state() private viewMode: ViewMode = 'list';
  @state() private modules: IMyModule[] = [];
  @state() loading: boolean = false;

  firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
    super.firstUpdated(_changedProperties);
    this.loadModule();
    this.fetchModules();
  }


  private async fetchModules() {
    this.loading = true;
    try {
      this.modules = await this.getModulesByActualProject() || [];
    } catch (error) {
      console.error('Erro ao buscar módulos:', error);
      this.modules = [
        { name: 'Dashboard', category: 'Core', totFiles: 12 },
        { name: 'Authentication', category: 'Security', totFiles: 8 },
        { name: 'Reports', category: 'Analytics', totFiles: 15 },
      ];
    } finally {
      this.loading = false;
    }
  }

  private getLocal(): string {
    const modulesLS = getLastModule();
    if (!modulesLS || !mls.actualProject) return '';
    return modulesLS[mls.actualProject];
  }

  private loadModule() {
    const mm = this.getLocal();
    if (!mm) return;
    mls.setActualModule(mm);
  }

  private async getModulesByActualProject() {

    try {

      const key = mls.stor.getKeyToFiles(mls.actualProject as number, 2, 'project', '', '.ts');
      const f = mls.stor.files[key];
      if (!f) throw new Error('[setMyModules] Not found storfile');

      const { project } = f;
      const mm = await getProjectConfig(project);
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
        });
      });

      const modules = this.moveActualToFirst(ar, mls.actualModule || '');
      return modules;

    } catch (e: any) {
      
    }

  }

  private moveActualToFirst(modules: IMyModule[], moduleName: string): IMyModule[] {
    const found = modules.find(m => m.name === moduleName);
    if (!found) return modules;
    const others = modules.filter(m => m.name !== moduleName);
    return [found, ...others];
  };


  private handleAddClick() {
    this.viewMode = 'add';
  }

  private handleBackClick() {
    this.viewMode = 'list';
  }

  private selectThis(module: IMyModule) {
    mls.setActualModule(module.name);
    this.setLocal(module.name);
    this.goToL4();
    this.requestUpdate();
  }

  private setLocal(moduleName: string) {
    if (!mls.actualProject) return;
    setLastModule(mls.actualProject, moduleName);
  }


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


  private renderListView() {
    return html`
            <div class="container">
                <div class="header">
                    <h2 class="title">${this.msg.title}</h2>
                    <button class="btn-add" @click=${this.handleAddClick}>
                        <span class="icon">+</span>
                        ${this.msg.addModule}
                    </button>
                </div>

                ${this.loading
        ? html`<div class="loading">${this.msg.loading}</div>`
        : html`
                        <div class="modules-list">
                            ${this.modules.length === 0
            ? html`<div class="empty">${this.msg.empty}</div>`
            : this.modules.map(module => html`
                                    <div class="module-card" @click=${() => this.selectThis(module)}>
                                        <div class="module-info">
                                            <span class="module-name">${module.name}</span>
                                            <span class="module-category">${module.category}</span>
                                        </div>
                                        <div class="module-files">
                                            <span class="files-count">${module.totFiles}</span>
                                            <span class="files-label">${this.msg.files}</span>
                                        </div>
                                    </div>
                                `)
          }
                        </div>
                    `
      }
            </div>
        `;
  }

  private renderAddView() {
    return html`
            <div class="container">
                <div class="header">
                    <button class="btn-back" @click=${this.handleBackClick}>
                        <span class="icon">←</span>
                        ${this.msg.back}
                    </button>
                    <h2 class="title">${this.msg.titleAdd}</h2>
                </div>
                    In develpoment
                </div>
            </div>
        `;
  }

  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    return this.viewMode === 'list'
      ? this.renderListView()
      : this.renderAddView();
  }
}