/// <mls shortName="aimBase" project="100554" enhancement="_100554_enhancementLit" />

import { html, css, unsafeHTML, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement, collabState } from './_100554_collabLitElement';

@customElement('aim-base-100554')
export class AimBase extends CollabLitElement {

  @property({ type: String, reflect: true }) public mode: cbe.IMode = 'error';
  @property({ type: Number }) public taskIndex = -1;

  createRenderRoot() {
    return this; // dont use shadow root
  }

  renderToolbar() {
    switch (this.mode) {
      case 'initializing': return this.renderToolBarInProgress();
      case 'waiting for user': return this.renderToolBarWaiting();
      case 'in progress': return this.renderToolBarInProgress();
      case 'ready': return this.renderToolBarReady();
      case 'error': return this.renderToolBarError();
      case 'processed': return this.renderToolBarProcessed();
      case 'canceled': return this.renderToolBarCanceled();
      default: return html``; // Retorna vazio para modos não reconhecidos
    }
  }

  renderToolBarInProgress(): TemplateResult {
    return html`
      <span class="toolbar">
      <button class="buttonIcon" title="Stop" @click="${() => this.onIconClick('stop')}">${this.iconStop}</button>
      <button class="buttonIcon" title="Waiting" @click="${() => this.onIconClick('waiting')}">${this.iconClock}</button>
      </span>
    `;
  }

  renderToolBarWaiting(): TemplateResult {
    return html`
      <span class="toolbar">
      <button class="buttonIcon" title="Stop" @click="${() => this.onIconClick('stop')}">${this.iconStop}</button>
      <button class="buttonIcon" title="Play" @click="${() => this.onIconClick('play')}">${this.iconPlay}</button>
      <button class="buttonIcon" title="Run All" @click="${() => this.onIconClick('runall')}">${this.iconRunAll}</button>
      </spam>
    `;
  }

  renderToolBarReady(): TemplateResult {
    return html`
      <span class="toolbar">
      <button class="buttonIcon" title="Stop" @click="${() => this.onIconClick('stop')}">${this.iconStop}</button>
      <button class="buttonIcon" title="Play" @click="${() => this.onIconClick('play')}">${this.iconPlay}</button>
      <button class="buttonIcon" title="Run All" @click="${() => this.onIconClick('runall')}">${this.iconRunAll}</button>
      </span>
    `;
  }

  renderToolBarError(): TemplateResult {
    return html`
      <span class="toolbar">
      <button class="buttonIcon" title="Error" @click="${() => this.onIconClick('error')}">${this.iconError}</button>
      </span>
    `;
  }

  renderToolBarProcessed(): TemplateResult {
    return html`
      <span class="toolbar">
      <button class="buttonIcon" title="Processed" @click="${() => this.onIconClick('processed')}">${this.iconCheckAll}</button>
      </span>
    `;
  }

  renderToolBarCanceled(): TemplateResult {
    return html`
      <span class="toolbar">
      <button class="buttonIcon" title="Canceled" @click="${() => this.onIconClick('canceled')}">${this.iconCanceled}</button>
      </span>
    `;
  }

  onIconClick(action: string): void {
    console.error('on icon click not implemented');
  }




  // icons, ref: https://github.com/microsoft/vscode-codicons/blob/main/src/icons/debug-reverse-continue.svg

  iconPlay = html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.78 2L3 2.41v12l.78.42 9-6V8l-9-6zM4 13.48V3.35l7.6 5.07L4 13.48z"/>
  </svg>
`;

  iconStop = html`<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M13 1.99976L14 2.99976V12.9998L13 13.9998H3L2 12.9998L2 2.99976L3 1.99976H13ZM12.7461 3.25057L3.25469 3.25057L3.25469 12.7504H12.7461V3.25057Z"/></svg>`;

  iconRunAll = html`<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M2.78 2L2 2.41v12l.78.42 9-6V8l-9-6zM3 13.48V3.35l7.6 5.07L3 13.48z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6 14.683l8.78-5.853V8L6 2.147V3.35l7.6 5.07L6 13.48v1.203z"/></svg>`

  iconError = html`<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.877 4.5v-.582a2.918 2.918 0 1 0-5.836 0V4.5h-.833L2.545 2.829l-.593.59 1.611 1.619-.019.049a8.03 8.03 0 0 0-.503 2.831c0 .196.007.39.02.58l.003.045H1v.836h2.169l.006.034c.172.941.504 1.802.954 2.531l.034.055L2.2 13.962l.592.592 1.871-1.872.058.066c.868.992 2.002 1.589 3.238 1.589 1.218 0 2.336-.579 3.199-1.544l.057-.064 1.91 1.92.593-.591-1.996-2.006.035-.056c.467-.74.81-1.619.986-2.583l.006-.034h2.171v-.836h-2.065l.003-.044a8.43 8.43 0 0 0 .02-.58 8.02 8.02 0 0 0-.517-2.866l-.019-.05 1.57-1.57-.592-.59L11.662 4.5h-.785zm-5 0v-.582a2.082 2.082 0 1 1 4.164 0V4.5H5.878zm5.697.837l.02.053c.283.753.447 1.61.447 2.528 0 1.61-.503 3.034-1.274 4.037-.77 1.001-1.771 1.545-2.808 1.545-1.036 0-2.037-.544-2.807-1.545-.772-1.003-1.275-2.427-1.275-4.037 0-.918.164-1.775.448-2.528l.02-.053h7.229z"/></svg>`;

  iconCheckAll = html`<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.62 3.596L7.815 12.81l-.728-.033L4 8.382l.754-.53 2.744 3.907L14.917 3l.703.596z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.234 8.774l4.386-5.178L10.917 3l-4.23 4.994.547.78zm-1.55.403l.548.78-.547-.78zm-1.617 1.91l.547.78-.799.943-.728-.033L0 8.382l.754-.53 2.744 3.907.57-.672z"/></svg>`;

  iconCanceled = html`<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 2H12v12h1.5V2zm-4.936.39L9.75 3v10l-1.186.61-7-5V7.39l7-5zM3.29 8l4.96 3.543V4.457L3.29 8z"/></svg>`;

  iconClock = html`<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_d9Sa{transform-origin:center}.spinner_qQQY{animation:spinner_ZpfF 9s linear infinite}.spinner_pote{animation:spinner_ZpfF .75s linear infinite}@keyframes spinner_ZpfF{100%{transform:rotate(360deg)}}</style><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"/><rect class="spinner_d9Sa spinner_qQQY" x="11" y="6" rx="1" width="2" height="7"/><rect class="spinner_d9Sa spinner_pote" x="11" y="11" rx="1" width="2" height="9"/></svg>`;

  iconRunAllCoverage = html`<svg width="17" height="16" viewBox="0 0 17 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M9 13.3497L15.7795 8.83V8L6.99951 2.14667V3.35L14.5995 8.42L9 12.1481V13.3497Z"/><path d="M2.99951 2.41L3.77951 2L12.7795 8V8.83L9 11.3497V10.1507L11.5995 8.42L3.99951 3.35V7H2.99951V2.41Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.87227 7.80803C4.02215 7.7549 3.16715 7.9667 2.46857 8.44931C1.71646 8.9338 1.23555 9.6327 0.970474 10.4798C0.70131 11.2888 0.756984 12.1983 1.07646 12.997C1.39862 13.8024 1.98841 14.444 2.73373 14.8699C3.48976 15.3019 4.34985 15.407 5.20068 15.2475C6.06198 15.086 6.81126 14.6028 7.34443 13.963L7.34919 13.9568C7.87759 13.2698 8.20141 12.468 8.20141 11.6053C8.20141 10.5403 7.82698 9.63047 7.13464 8.88488L7.12941 8.87965C6.54444 8.29468 5.74055 7.8623 4.87227 7.80803ZM2.95059 9.18281C3.4627 8.81037 4.12262 8.66604 4.74312 8.71377L4.74421 8.71385C5.40049 8.76073 5.9647 9.04069 6.44119 9.51719C6.95689 10.0329 7.24402 10.7907 7.24402 11.5546V11.5618L7.24453 11.5689C7.29089 12.2179 7.0608 12.8292 6.67758 13.3579C6.25159 13.8765 5.68456 14.2071 5.06818 14.3493C4.45885 14.49 3.80161 14.3963 3.23776 14.0674C2.66626 13.7341 2.23786 13.259 1.95045 12.6362C1.67052 12.0297 1.66791 11.3722 1.85872 10.752L1.85983 10.7482C2.04996 10.0827 2.42849 9.56252 2.95059 9.18281ZM6.35355 10.8536L4.35355 12.8536H3.64645L2.64645 11.8536L3.35355 11.1464L4 11.7929L5.64645 10.1464L6.35355 10.8536Z"/></svg>`;

  iconUser = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill='currentColor' style="width: 9px;"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>`;

  iconMoney = html`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512' fill='currentColor' style="width: 7px;"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d='M160 0c17.7 0 32 14.3 32 32V67.7c1.6 .2 3.1 .4 4.7 .7c.4 .1 .7 .1 1.1 .2l48 8.8c17.4 3.2 28.9 19.9 25.7 37.2s-19.9 28.9-37.2 25.7l-47.5-8.7c-31.3-4.6-58.9-1.5-78.3 6.2s-27.2 18.3-29 28.1c-2 10.7-.5 16.7 1.2 20.4c1.8 3.9 5.5 8.3 12.8 13.2c16.3 10.7 41.3 17.7 73.7 26.3l2.9 .8c28.6 7.6 63.6 16.8 89.6 33.8c14.2 9.3 27.6 21.9 35.9 39.5c8.5 17.9 10.3 37.9 6.4 59.2c-6.9 38-33.1 63.4-65.6 76.7c-13.7 5.6-28.6 9.2-44.4 11V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.1c-.4-.1-.9-.1-1.3-.2l-.2 0 0 0c-24.4-3.8-64.5-14.3-91.5-26.3c-16.1-7.2-23.4-26.1-16.2-42.2s26.1-23.4 42.2-16.2c20.9 9.3 55.3 18.5 75.2 21.6c31.9 4.7 58.2 2 76-5.3c16.9-6.9 24.6-16.9 26.8-28.9c1.9-10.6 .4-16.7-1.3-20.4c-1.9-4-5.6-8.4-13-13.3c-16.4-10.7-41.5-17.7-74-26.3l-2.8-.7 0 0C119.4 279.3 84.4 270 58.4 253c-14.2-9.3-27.5-22-35.8-39.6c-8.4-17.9-10.1-37.9-6.1-59.2C23.7 116 52.3 91.2 84.8 78.3c13.3-5.3 27.9-8.9 43.2-11V32c0-17.7 14.3-32 32-32z'/></svg>`;

  iconPrompt = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill='currentColor' style="width: 15px;"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 96c0-35.3 28.7-64 64-64H512c35.3 0 64 28.7 64 64V352H512V96H128V352H64V96zM0 403.2C0 392.6 8.6 384 19.2 384H620.8c10.6 0 19.2 8.6 19.2 19.2c0 42.4-34.4 76.8-76.8 76.8H76.8C34.4 480 0 445.6 0 403.2zM281 209l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-48-48c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM393 175l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>`;

  iconHash = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill='currentColor' style="width: 10px;"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8L197.8 128h95.1l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8L357.8 128H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H347.1L325.8 320H384c17.7 0 32 14.3 32 32s-14.3 32-32 32H315.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7H155.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8L90.2 384H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l21.3-128H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zM187.1 192L165.8 320h95.1l21.3-128H187.1z"/></svg>`;

  iconDate = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill='currentColor' style="width: 10px;"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z"/></svg>`;

    iconRef = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill='currentColor' style="width: 10px;"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M320 464c8.8 0 16-7.2 16-16V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320zM0 64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64z"/></svg>`;


    
}
