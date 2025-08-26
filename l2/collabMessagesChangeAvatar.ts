/// <mls shortName="collabMessagesChangeAvatar" project="100554" enhancement="_100554_enhancementLit" />

import { html, css, unsafeHTML } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StateLitElement } from './_100554_stateLitElement';
import { IAgent } from './_100554_aiAgentBase';
import { getTemporaryContext } from './_100554_aiAgentHelper';

/// **collab_i18n_start** 
const message_pt = {
  changeAvatar: "Alterar avatar",
  changeButton: "Trocar imagem",
  generateButton: "Gerar com IA",
  panelTitle: "Gerar Avatar com IA",
  generateLabel: "Descreva o avatar",
  generatePlaceholder: "Digite aqui sua descrição...",
  actionGenerate: "Gerar",
  saveButton: "Salvar",
  cancelButton: "Cancelar",
  generating: "Gerando..."
}

const message_en = {
  changeAvatar: "Change avatar",
  changeButton: "Change image",
  generateButton: "Generate with AI",
  panelTitle: "Generate Avatar with AI",
  generateLabel: "Describe the avatar",
  generatePlaceholder: "Type your description here...",
  actionGenerate: "Generate",
  saveButton: "Save",
  cancelButton: "Cancel",
  generating: "Generating..."
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
}
/// **collab_i18n_end**


@customElement("collab-messages-change-avatar-100554")
export class CollabChangeAvatar extends StateLitElement {

  private msg: MessageType = messages['en'];

  private defaultImage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">\x3C!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M320 0c17.7 0 32 14.3 32 32l0 64 120 0c39.8 0 72 32.2 72 72l0 272c0 39.8-32.2 72-72 72l-304 0c-39.8 0-72-32.2-72-72l0-272c0-39.8 32.2-72 72-72l120 0 0-64c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224l16 0 0 192-16 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-16 0 0-192 16 0z"></path></svg>`;

  @property({ type: String }) value?: string;
  @property({ type: String }) userId: string = "20250417120841.1000";
  @property({ type: String }) threadId: string = "20250825143728.1000";

  @state() private avatarPrompt: string = "";

  @state() private avatarFile?: File;
  @state() private isOpen: boolean = false;
  @state() private generating: boolean = false;
  @state() private preview?: string;

  firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
    super.firstUpdated(_changedProperties)
    this.preview = this.value || this.defaultImage;
  }

  render() {

    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    return html`
    <div class="avatar-section">
      <div class="preview">
        ${this.preview
        ? this.preview.startsWith("<svg")
          ? html`${this.safeSvg(this.preview)}`
          : html`<img src="${this.preview}" alt="Avatar" />`
        : this.value
          ? this.value.startsWith("<svg")
            ? html`${this.safeSvg(this.value)}`
            : html`<img src="${this.value}" alt="Avatar" />`
          : html`<div class="placeholder">?</div>`}
      </div>

      <div class="actions-avatar">
        <a style="display:none"  href="#" class="btn" @click=${this.triggerFileInput}>${this.msg.changeButton}</a>
        <input 
          type="file" 
          accept="image/*" 
          class="hidden-file-input"
          @change=${this.onFileSelect}
        />

        <a href="#" class="btn" @click=${(e: MouseEvent) => { e.preventDefault(); this.isOpen = true }}>
          ${this.msg.generateButton}
        </a>
      </div>
    </div>

    ${this.isOpen ? html`
      <div class="panel">
        <h4>${this.msg.panelTitle}</h4>

        <label>${this.msg.generateLabel}</label>
        <textarea
          placeholder=${this.msg.generatePlaceholder}
          .value=${this.avatarPrompt}
          @input=${(e: Event) => this.avatarPrompt = (e.target as HTMLTextAreaElement).value}
        ></textarea>

        <div class="actions-ia">
          <button ?disabled=${this.generating} @click=${this.generateAvatarFromPrompt}>
            ${this.generating ? html`<span class="loader"></span>` : this.msg.actionGenerate}
          </button>
          <button @click=${() => this.isOpen = false}>${this.msg.cancelButton}</button>
        </div>
      </div>
    ` : ""}
  `;
  }


  private onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.avatarFile = input.files[0];
      this.preview = URL.createObjectURL(this.avatarFile);
    }
  }

  private triggerFileInput(e: MouseEvent) {
    e.preventDefault();
    const input = this.querySelector<HTMLInputElement>(".hidden-file-input");
    input?.click();
  }

  private async generateAvatarFromPrompt() {
    if (!this.avatarPrompt) return;
    this.generating = true;
    const agentName = '_100554_agentGenerateAvatarSvg';

    try {

      const moduleAgent = await import(`/${agentName}`);
      if (!moduleAgent?.createAgent || typeof moduleAgent.createAgent !== 'function') {
        throw new Error('Invalid agent');
      }

      const agent: IAgent = moduleAgent.createAgent();
      const context = getTemporaryContext(this.threadId, this.userId, this.avatarPrompt);
      await agent.beforePrompt(context);

      if (context.task &&
        context.task.iaCompressed &&
        context.task.iaCompressed.nextSteps &&
        context.task.iaCompressed.nextSteps[0] &&
        context.task.iaCompressed.nextSteps[0].interaction &&
        context.task.iaCompressed.nextSteps[0].interaction.payload &&
        context.task.iaCompressed.nextSteps[0].interaction.payload[0]

      ) {

        const svg: string = (context.task.iaCompressed?.nextSteps[0]?.interaction?.payload[0] as mls.msg.AIFlexibleResultStep).result
        if (svg && typeof svg === 'string') {
          this.preview = svg;
          this.emitValueChanged(this.preview);
        }

      }

    } catch (err: any) {
      console.error("Erro ao gerar avatar via IA", err);
    } finally {
      this.generating = false;
    }
  }

  private emitValueChanged(value: string) {
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: value,
      bubbles: true,
      composed: true
    }));
  }


  private safeSvg(svg: string) {
    return html`${unsafeHTML(svg)}`;
  }
}
