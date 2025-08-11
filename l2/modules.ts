/// <mls shortName="modules" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';

@customElement('modules-100554')
export class Modules100554 extends StateLitElement {
    @state() currentView: 'list' | 'details' = 'list';
    @state() archiveConfirmationText = '';
    @state() selectedModule: any = null;

    private mockModules = [
        { name: 'Authentication', category: 'Core', uses: 312 },
        { name: 'Payments', category: 'Integration', uses: 159 },
        { name: 'Dashboard', category: 'UI', uses: 512 },
        { name: 'Notifications', category: 'Service', uses: 98 },
    ];

    render() {
        return html`
      ${this.currentView === 'list' ? this.renderModuleList() : this.renderModuleDetails()}
    `;
    }

    renderModuleList() {
        return html`
      <div class="header">
        <h2>Select a Module</h2>
      </div>

      <div class="modules-list">
        ${this.mockModules.map(module => html`
          <div class="module-card">
            <div class="card-content">
              <div class="module-title">${module.name}</div>
              <div class="module-category">Category: ${module.category}</div>
              <div class="module-uses">Used in ${module.uses} projects</div>
              <div class="actions">
                <a href="#">Select</a>
                <a href="#" @click=${(e: MouseEvent) => this.openDetails(e, module)}>⋯</a>
              </div>
            </div>
          </div>
        `)}
      </div>
    `;
    }

    private renderModuleDetails() {
        return html`
        <div class="module-details">
        <button class="back-button" @click=${this.goBack}>← Back</button>
        <div>In development</div>
      </div>
    `;
    }

    private openDetails(ev: MouseEvent, module: any) {
        ev.preventDefault();
        this.selectedModule = module;
        this.currentView = 'details';
        this.archiveConfirmationText = '';
    }

    private goBack() {
        this.currentView = 'list';
        this.selectedModule = null;
        this.archiveConfirmationText = '';
    }

    private confirmArchive() {
        const expected = `archive module ${this.selectedModule.name}`;
        if (this.archiveConfirmationText.trim().toLowerCase() === expected) {
            alert('Module archived!');
            this.goBack();
        } else {
            alert('Confirmation text does not match.');
        }
    }
}
