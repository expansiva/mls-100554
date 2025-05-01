/// <mls shortName="wcClarification" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { postBackClarification } from "./_100554_aiAgentOrchestration";

@customElement('wc-clarification-100554')
export class CollabFCATree extends CollabLitElement {

  @property() clarificationData: IDataClarification = {
    type: 'clarification',
    taskId: '',
    stepId: '',
    clarificationMessage: '',
    json: []
  };

  render() {
    return html`
      <div class="agentPlannerNewPageClarification">
        <div id="content2">
          ${this.clarificationData.json.map((item: IDataClarificationInfo) => this.renderItem(item))}
        </div>
        <div class="buttons">
          <button class="cancel" @click=${() => this.handleAction('cancel')}>
            Cancelar
          </button>
          <button class="continue" @click=${() => this.handleAction('continue')}>
            Continuar
          </button>
        </div>
      </div>
    `;
  }

  renderItem(cl: IDataClarificationInfo) {
    return html`
            <div class="section">
              <h2>${cl.sectionName}</h2>
              <p>${cl.description}</p>
              ${Array.isArray(cl.value)
        ? html`<textarea class="requirement" rows="2" @blur=${(e: Event) => this.fireBlur(e, cl)}>${cl.value.join('\n')}</textarea>`
        : html`<input type="text" .value=${cl.value} @blur=${(e: Event) => this.fireBlur(e, cl)}>`}
            </div>
          `

  }

  private async handleAction(action: string) {
    console.info(action, this.clarificationData)
    await postBackClarification(action as any, this.clarificationData);
  }

  private fireBlur(ev: Event, cl: IDataClarificationInfo) {

    const el = ev.target as HTMLInputElement;
    if (!el || el.value === undefined) return;

    cl.value = el.value;

  }
}

interface IDataClarification {

  type: string,
  taskId: string,
  stepId: string,
  clarificationMessage: string,
  json: IDataClarificationInfo[]

}

interface IDataClarificationInfo {
  sectionName: string,
  description: string,
  value: string | object
}

[
  {
    "sectionName": "pageName",
    "description": "Nome da pagina",
    "value": "[pageLogin]"
  },
  {
    "sectionName": "requirements",
    "description": "requisitos para esta pagina, altere se necessário",
    "value": [
      "[suporte para autenticação de usuário]",
      "[validação de campos de entrada]"
    ]
  }
]