/// <mls shortName="pluginPresenterRecorder" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult, LitElement } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { getMessageKey } from "./_100554_collabLitElement";

/// **collab_i18n_start**
const message_pt = {
  title: "Gravação de Apresentação",
  btnStart: 'Iniciar',
  btnStop: 'Parar',
  msgDesc: `Grava a tela do navegador e sua câmera (avatar) no canto, com áudio. Após parar, faça o download do vídeo e compartilhe onde quiser, como no WhatsApp.`
}
const message_en = {
  title: "Presentation Recording",
  btnStart: 'Start',
  btnStop: 'Stop',
  msgDesc: `Records the browser screen and your camera (avatar) in the corner, with audio. After stopping, download the video and share it anywhere, such as WhatsApp.`
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
}
const lang = getMessageKey(messages);
let msg: MessageType = messages[lang];
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
  title: "Record Presenter",
  getSvg(): TemplateResult {
    return svg`<svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
      <path d="M512 80h-64l-34-56a32 32 0 0 0-27-16h-192a32 32 0 0 0-27 16l-34 56H64A64 64 0 0 0 0 144v304a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V144a64 64 0 0 0-64-64zm-256 80a112 112 0 1 1 0 224 112 112 0 0 1 0-224zm0 48a64 64 0 1 0 0 128 64 64 0 0 0 0-128z"/></svg>`;
  }
};

@customElement('plugin-presenter-recorder-100554')
export class PluginPresenterRecorder extends PluginBaseModule {

  private screenStream: MediaStream | null = null;
  private cameraStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private downloadUrl: string | null = null;

  // Appearance config (reactive properties)
  @property({ type: String }) avatarShape: 'square' | 'round' = 'square';
  @property({ type: Number }) avatarZoom: number = 1;
  @property({ type: Boolean }) isRecording: boolean = false;
  @property({ type: Boolean }) isCountdown: boolean = false;
  @property({ type: Number }) countdownValue: number = 5;
  private countdownTimer?: number;

  render(): TemplateResult {
    return html`
<div>
  <h3>🎤 ${msg.title}</h3>
  <p>${msg.msgDesc}</p>
  <fieldset>
    <legend><b>Camera Style</b></legend>
    <div class="radio-row">
      <label>
        <input type="radio" name="shape" value="square" .checked=${this.avatarShape === 'square'} @change=${() => this.avatarShape = 'square'}>
        Square
      </label>
      <label>
        <input type="radio" name="shape" value="round" .checked=${this.avatarShape === 'round'} @change=${() => this.avatarShape = 'round'}>
        Round
      </label>
    </div>
    <div class="zoom-row">
      <span>Zoom:</span>
      <select @change=${this.handleZoomChange}>
        <option value="1" ?selected=${this.avatarZoom === 1}>1x</option>
        <option value="1.5" ?selected=${this.avatarZoom === 1.5}>1.5x</option>
        <option value="2" ?selected=${this.avatarZoom === 2}>2x</option>
      </select>
    </div>
  </fieldset>
  <br>
  ${this.isCountdown ? html`
    <div style="font-size:2rem; color:#ff4444; margin:1rem 0; font-weight:bold;">
      Recording starts in ${this.countdownValue}...
    </div>
  ` : ''}
  <br>
  <button 
    @click=${this.startRecording} 
    ?disabled=${this.isRecording || this.isCountdown}
  >🎥 ${msg.btnStart}</button>
  <button 
    @click=${this.stopRecording} 
    ?disabled=${!this.isRecording}
  >🛑 ${msg.btnStop}</button>

  ${this.downloadUrl ? html`
    <a href="${this.downloadUrl}" download="apresentacao.webm" style="margin-left:1rem;">
      ⬇️ Baixar vídeo
    </a>` : ''}
  <div id="pip-avatar-container" class="pip-avatar-${this.avatarShape === 'round' ? 'round' : 'square'}">
    <video
      id="plugin-presenter-camera-preview"
      autoplay
      muted
      class="avatar-zoom-${this.avatarZoom === 1 ? '1x' : this.avatarZoom === 1.5 ? '15x' : '2x'}"
    ></video>
  </div>
</div>
  `;
  }

  // Event for zoom combo
  handleZoomChange(e: Event) {
    const value = +(e.target as HTMLSelectElement).value;
    this.avatarZoom = value;
  }

  updated() {
    const preview = this.querySelector('#plugin-presenter-camera-preview') as HTMLVideoElement | null;
    if (preview && this.cameraStream) {
      preview.srcObject = this.cameraStream;
    }
  }

  async startRecording() {
    this.downloadUrl = null;
    this.chunks = [];
    this.requestUpdate();

    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          sampleRate: 48000,
        }
      });

      // Start countdown before recording
      this.countdownValue = 5;
      this.isCountdown = true;
      this.requestUpdate();

      this.countdownTimer = window.setInterval(() => {
        this.countdownValue -= 1;
        this.requestUpdate();
        if (this.countdownValue <= 0) {
          clearInterval(this.countdownTimer);
          this.isCountdown = false;
          this._doStartRecording();
        }
      }, 1000);

    } catch (err) {
      this.isRecording = false;
      this.isCountdown = false;
      this.screenStream = null;
      this.cameraStream = null;
      this.requestUpdate();
    }
  }

  private _doStartRecording() {
    if (!this.screenStream || !this.cameraStream) return;
    this.isRecording = true;

    const preview = this.querySelector('#plugin-presenter-camera-preview') as HTMLVideoElement | null;
    if (preview) {
      preview.srcObject = this.cameraStream;
    }

    const combinedStream = new MediaStream([
      ...this.screenStream.getVideoTracks(),
      ...this.cameraStream.getAudioTracks()
    ]);

    this.mediaRecorder = new MediaRecorder(combinedStream);

    this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);

    this.mediaRecorder.onstop = () => {
      this.saveRecording();
      this.isRecording = false;
      this.requestUpdate();
    };

    this.mediaRecorder.start();
    this.requestUpdate();
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.screenStream?.getTracks().forEach((t) => t.stop());
    this.cameraStream?.getTracks().forEach((t) => t.stop());
    // this.isRecording = false;
    // this.requestUpdate();
  }

  saveRecording() {
    const blob = new Blob(this.chunks, { type: 'video/webm' });
    this.downloadUrl = URL.createObjectURL(blob);
    this.chunks = [];
    this.requestUpdate();
  }
}

