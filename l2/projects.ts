/// <mls shortName="projects" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { setProjectDetails } from './_100554_libCommom';
import './_100554_pluginCreateNewProject'

@customElement('projects-100554')
export class Projects102009 extends StateLitElement {

  @state() currentView: 'list' | 'details' | 'add' = 'list';
  @state() archiveConfirmationText = '';
  @state() selectedProjectDetails: IMyProject | undefined;
  @state() selectedProject: IMyProject | undefined;
  @state() comunityProjects: IMyProject[] = [];
  @state() myProjects: IMyProject[] = [];


  //-----COMPONENT--------

  firstUpdated() {
    this.getOrgsAndProjects();
  }

  render() {

    switch (this.currentView) {
      case ('list'): return this.renderProjectList();
      case ('details'): return this.renderProjectDetails();
      case ('add'): return this.renderAdd();
    }

  }

  renderHeader() {
    return html`
      <div class="header">
        <h2>Projects</h2>
        <input type="text" placeholder="Search projects..." class="search-input" @input="${this.filterLiChange}" />
        <button style="margin-left:5px; width:150px;" @click=${this.onAddNewProjectClick}><svg style="width:12px; fill:#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg></button>
      </div>
    `
  }

  renderProjectList() {
    return html`
      ${this.renderHeader()}
      ${this.renderCurrentProject()}
      ${this.renderListUser()}
      ${this.renderListComunity()}
    `;
  }

  renderCurrentProject() {

    if (!this.selectedProject) return html``;

    return html`
    <div class="section">
        <div class="section-header">
          <h3>Selected Project</h3>
        </div>
        <div class="project-card selected">
          <img class="thumbnail" src=${this.selectedProject.thumbnail} alt=${this.selectedProject.title} />
          <div class="card-content">
            <div class="project-title">${this.selectedProject.title}(${this.selectedProject.project})</div>
            <div class="project-meta">
              <span class="badge">${this.selectedProject.type}</span>
              <div class="actions">
                <a href="#" style=" opacity: .5; pointer-events: none;"> Selected </a>
                <a href="#" @click=${(e: MouseEvent) => this.openDetails(e, this.selectedProject)}>⋯</a>
              </div>
            </div>
          </div>
        </div>
    </div>
    `
  }

  renderListUser() {
    return html`
      <div class="section">
        <div class="section-header">
          <h3>Your Projects</h3>
        </div>

        <div class="projects-grid">
        ${this.myProjects.map(
      (project) => html`
                <div class="project-card" .filter=${project.title+project.project}>
                  <img class="thumbnail" src=${project.thumbnail} alt=${project.title} />
                  <div class="card-content">
                    <div class="project-title">${project.title}(${project.project})</div>
                    <div class="project-meta">
                      <span class="badge">${project.type}</span>
                      <div class="actions">
                        <a href="#" @click=${(e: MouseEvent) =>{ e.preventDefault(); this.onProjectClick(project)}}> Select </a>
                        <a href="#" @click=${(e: MouseEvent) => this.openDetails(e, project)}>⋯</a>
                      </div>
                    </div>
                  </div>
                </div>
              `
    )}
      </div>
    `
  }

  renderListComunity() {
    return html`
      <div class="section">
        <div class="section-header">
          <h3>From the Community</h3>
        </div>

        <div class="projects-grid">
        ${this.mockProjects.map(
      (project) => html`
                <div class="project-card" .filter=${project.title+project.project}>
                  <img class="thumbnail" src=${project.thumbnail} alt=${project.title} />
                  <div class="card-content">
                    <div class="project-title">${project.title}</div>
                    <div class="project-meta">
                      <span class="badge">${project.type}</span>
                      <div class="actions">
                        <a href="#"> Select </a>
                        <a href="#" @click=${(e: MouseEvent) => this.openDetails(e, project)}>⋯</a>
                      </div>
                    </div>
                  </div>
                </div>
              `
    )}
      </div>
    `
  }

  renderProjectDetails() {
    return html`
    <div class="project-details">
      <button class="back-button" @click=${this.goBack}>← Back</button>
      <h2>Project: ${this.selectedProjectDetails?.title}</h2>

      <section>
        <h3>Archive</h3>
        <input
          type="text"
          .value=${this.archiveConfirmationText}
          placeholder="deletar permanentemente"
          @input=${(e: any) => this.archiveConfirmationText = e.target.value}
        />
        <small>archive project ${this.selectedProjectDetails?.project} and delete after 30 days</small>
        <br>
        <button @click=${this.confirmArchive}>Confirm Archive</button>
      </section>

      <section>
        <h3>Get Details</h3>
        <small> In develpoment </small>
      </section>
    </div>
  `;
  }

  renderAdd() {
    return html`
        <div @click="${this.backScenaryList}" style="padding-left: 1rem; padding-top: .5rem; cursor: pointer;">< Back</div>
        <plugin-create-new-project-100554>
        </plugin-create-new-project-100554>
    `

  }


  //----------IMPLEMENTATION-----------

  private backScenaryList() {
    this.currentView = 'list';
  }

  private onAddNewProjectClick() {
    this.currentView = 'add';
  }

  private timeFilterChange = 0;
  private filterLiChange(e: InputEvent) {

    e.stopPropagation();
    const el = e.target as HTMLInputElement;
    if (!el) return;
    clearTimeout(this.timeFilterChange);
    this.timeFilterChange = setTimeout(() => {

      const all = this.querySelectorAll('.project-card');
      all.forEach((card: any) => {

        const name = card.filter ? card.filter : '******';
        const inp = el.value.toLocaleLowerCase();

        if (!inp) this.classList.remove('inFilter');
        else this.classList.add('inFilter');

        if (name.indexOf(inp) >= 0) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      })

    }, 500);

  }

  private getOrgsAndProjects() {

    const arr: IMyProject[] = [];
    Object.keys(mls.stor.orgs).forEach((org, index) => {

      const { name, description, created_at, projects } = mls.stor.orgs[org].sett;
      projects.forEach((p: any) => {
        try {
          const json = JSON.parse(p.value);
          if (!p.id) return;
          const info = mls.l5.getProjectSettings(p.id);
          let doSelect = true;

          let projectDriver = '';
          let projectURL = '';


          if (!json.projectURL && json.l5_actionPrjSettings) {

            projectDriver = json.l5_actionPrjSettings.projectDriver || '';
            projectURL = json.l5_actionPrjSettings.projectURL || '';

          } else if (json.projectURL) {

            projectDriver = json.projectDriver || '';
            projectURL = json.projectURL || '';

          }

          if (!projectDriver || !projectURL || projectDriver === 'mls') return;

          const item = {
            project: p.id,
            title: p.name,
            type: 'user',
            remixes: 0,
            thumbnail: 'https://img.freepik.com/premium-vector/ai-robot-with-chip-processor-website-landing-page_683014-600.jpg',
          };
          if (item.project === mls.actualProject) this.selectedProject = item;
          arr.push(item);

        } catch (e) {
          //console.info('Erro to parse' + p.name);
        }
      });

    });

    this.myProjects = arr;
  }

  private openDetails(ev: MouseEvent, project: any) {
    ev.preventDefault();
    this.selectedProjectDetails = project;
    this.currentView = 'details';
    this.archiveConfirmationText = '';
  }

  private goBack() {
    this.currentView = 'list';
    this.selectedProjectDetails = undefined;
    this.archiveConfirmationText = '';
  }

  private confirmArchive() {
    if (!this.selectedProjectDetails) return;
    const expected = `archive project ${this.selectedProjectDetails.project} and delete after 30 days`;
    if (this.archiveConfirmationText.trim().toLowerCase() === expected) {
      alert('Archived!');
      this.goBack();
    } else {
      alert('Confirmation text does not match.');
    }
  }

  private async onProjectClick(item: IMyProject) {

    this.setProjectActual(item.project);
    this.setOrgActual(item.project);
    window.location.reload();

  }

  private setProjectActual(project: number) {
    mls.setActualProject(project);
    setProjectDetails(project);
  }

  private setOrgActual(project: number) {
    const orgIndex = mls.l5.getProjectOrgIndex(project);
    mls.l5.setActualOrg(orgIndex);
  }

  private mockProjects: IMyProject[] = [
    {
      project: 0,
      title: 'Robot',
      type: 'Community',
      remixes: 20454,
      thumbnail: 'https://img.freepik.com/premium-vector/ai-robot-with-chip-processor-website-landing-page_683014-600.jpg',
    },
    {
      project: 0,
      title: 'Crypto',
      type: 'Community',
      remixes: 12743,
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      project: 0,
      title: 'Petshop',
      type: 'Community',
      remixes: 6453,
      thumbnail: 'https://res2.weblium.site/site/60ba356b4f789e0021d15ae8/preview1600_1000',
    },
  ];

}

interface IMyProject {

  title: string,
  type: string,
  remixes: number,
  thumbnail: string,
  project: number,

}