/// <mls shortName="projects" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';

@customElement('projects-100554')
export class Projects102009 extends StateLitElement {

    @state() currentView: 'list' | 'details' = 'list';
    @state() archiveConfirmationText = '';
    @state() selectedProject: any = null;

    private mockProjects = [
        {
            title: 'Robot',
            type: 'Website',
            remixes: 20454,
            thumbnail: 'https://img.freepik.com/premium-vector/ai-robot-with-chip-processor-website-landing-page_683014-600.jpg',
        },
        {
            title: 'Crypto',
            type: 'Dashboard',
            remixes: 12743,
            thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'Petshop',
            type: 'Website',
            remixes: 6453,
            thumbnail: 'https://res2.weblium.site/site/60ba356b4f789e0021d15ae8/preview1600_1000',
        },
        {
            title: 'Robot',
            type: 'Website',
            remixes: 20454,
            thumbnail: 'https://img.freepik.com/premium-vector/ai-robot-with-chip-processor-website-landing-page_683014-600.jpg',
        },
        {
            title: 'Crypto',
            type: 'Dashboard',
            remixes: 12743,
            thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'Petshop',
            type: 'Website',
            remixes: 6453,
            thumbnail: 'https://res2.weblium.site/site/60ba356b4f789e0021d15ae8/preview1600_1000',
        },
        {
            title: 'Robot',
            type: 'Website',
            remixes: 20454,
            thumbnail: 'https://img.freepik.com/premium-vector/ai-robot-with-chip-processor-website-landing-page_683014-600.jpg',
        },
        {
            title: 'Crypto',
            type: 'Dashboard',
            remixes: 12743,
            thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'Petshop',
            type: 'Website',
            remixes: 6453,
            thumbnail: 'https://res2.weblium.site/site/60ba356b4f789e0021d15ae8/preview1600_1000',
        },
        {
            title: 'Robot',
            type: 'Website',
            remixes: 20454,
            thumbnail: 'https://img.freepik.com/premium-vector/ai-robot-with-chip-processor-website-landing-page_683014-600.jpg',
        },
        {
            title: 'Crypto',
            type: 'Dashboard',
            remixes: 12743,
            thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'Petshop',
            type: 'Website',
            remixes: 6453,
            thumbnail: 'https://res2.weblium.site/site/60ba356b4f789e0021d15ae8/preview1600_1000',
        },
        {
            title: 'Robot',
            type: 'Website',
            remixes: 20454,
            thumbnail: 'https://img.freepik.com/premium-vector/ai-robot-with-chip-processor-website-landing-page_683014-600.jpg',
        },
        {
            title: 'Crypto',
            type: 'Dashboard',
            remixes: 12743,
            thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'Petshop',
            type: 'Website',
            remixes: 6453,
            thumbnail: 'https://res2.weblium.site/site/60ba356b4f789e0021d15ae8/preview1600_1000',
        },
    ];

    render() {
        return html`
    ${this.currentView === 'list'
                ? this.renderProjectList()
                : this.renderProjectDetails()}
  `;
    }

    renderProjectList() {
        return html`
      <div class="header">
        <h2>From the Community</h2>
        <div class="filters">
          <button class="filter-button">Recents</button>
          <button class="filter-button">Prototype</button>
        </div>
      </div>

      <div class="projects-grid">
        ${this.mockProjects.map(
            (project) => html`
            <div class="project-card">
              <img class="thumbnail" src=${project.thumbnail} alt=${project.title} />
              <div class="card-content">
                <div class="project-title">${project.title}</div>
                <div class="project-meta">
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
    `;
    }

    private renderProjectDetails() {
        return html`
    <div class="project-details">
      <button class="back-button" @click=${this.goBack}>← Back</button>
      <h2>Project: ${this.selectedProject?.title}</h2>

      <section>
        <h3>Archive</h3>
        <input
          type="text"
          .value=${this.archiveConfirmationText}
          placeholder="deletar permanentemente"
          @input=${(e: any) => this.archiveConfirmationText = e.target.value}
        />
        <small>archive project ${this.selectedProject?.id} and delete after 30 days</small>
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



    private openDetails(ev: MouseEvent, project: any) {
        ev.preventDefault();
        this.selectedProject = project;
        this.currentView = 'details';
        this.archiveConfirmationText = '';
    }

    private goBack() {
        this.currentView = 'list';
        this.selectedProject = null;
        this.archiveConfirmationText = '';
    }

    private confirmArchive() {
        const expected = `archive project ${this.selectedProject.id} and delete after 30 days`;
        if (this.archiveConfirmationText.trim().toLowerCase() === expected) {
            alert('Archived!');
            this.goBack();
        } else {
            alert('Confirmation text does not match.');
        }
    }

}