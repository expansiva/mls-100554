/// <mls fileReference="_100554_/l2/pluginCollabLogin.ts" group="other" enhancement="_100554_enhancementLitService" />

import { html, css, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';

/// **collab_i18n_start**

const message_pt = {
  title1: 'Bem vindo!',
  title2: 'no',
  title3: 'Collab Codes!',
  google_canSignIn: 'Continuar com o Google',
  google_canDisconnect: 'Desconectar do Google',
  google_canAdd: 'Adicionar Google',
  google_connected: 'Conectado com o Google',
  github_canSignIn: 'Continuar com o GitHub',
  github_canDisconnect: 'Desconectar do GitHub',
  github_canAdd: 'Adicionar GitHub',
  github_connected: 'Conectado com o GitHub',
  gitlab_canSignIn: 'Continuar com o GitLab',
  gitlab_canDisconnect: 'Desconectar do GitLab',
  gitlab_canAdd: 'Adicionar GitLab',
  gitlab_connected: 'Conectado com o GitLab',
  lblFoot1: 'Ao entrar, você concorda com nossos ',
  lblFoot2: 'Termos de Serviço',
  lblFoot3: ' e ',
  lblFoot4: 'Política de Privacidade',
  or1: " (com repositório) ",
  or2: " ou (sem repositório) ",
  or3: " ou ",
  logoff: 'Sair',
};

const message_en = {
  title1: 'Welcome!',
  title2: ' at ',
  title3: 'Collab Codes!',
  google_canSignIn: 'Sign in with Google',
  google_canDisconnect: 'Disconnect from Google',
  google_canAdd: 'Add Google',
  google_connected: 'Connected with Google',
  github_canSignIn: 'Sign in with GitHub',
  github_canDisconnect: 'Disconnect from GitHub',
  github_canAdd: 'Add GitHub',
  github_connected: 'Connected with GitHub',
  gitlab_canSignIn: 'Sign in with GitLab',
  gitlab_canDisconnect: 'Disconnect from GitLab',
  gitlab_canAdd: 'Add GitLab',
  gitlab_connected: 'Connected with GitLab',
  lblFoot1: 'By signing in, you agree to our ',
  lblFoot2: 'Terms of Service',
  lblFoot3: ' and ',
  lblFoot4: 'Privacy Policy',
  or1: " (with repository) ",
  or2: " or (without repository) ",
  or3: " or ",
  logoff: 'Logoff',
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
  'pt': message_pt,
  'en': message_en
}
/// **collab_i18n_end**

export class PluginCollabLogin100554 extends PluginBaseModule {

  private msg: MessageType = messages['en'];
  private googleState = '';

  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    return html`
    <div class="login-container">
      ${this.renderTitle()}
      ${this.renderDivider(this.msg.or1)}
      ${this.renderButton('github', this.githubIcon(), this.gitHubLogin)}
      ${this.renderButton('gitlab', this.gitlabIcon(), this.gitLabLogin)}
      ${this.renderDivider(this.msg.or2)}
      ${this.renderButton('google', this.googleIcon(), this.googleLogin)}
      ${this.renderLogOff('logoff', this.LogoffIcon(), this.logoff)}
      ${this.renderFooter()}
    </div>
  `;
  }

  renderTitle() {
    return html`
    <div class="login-title">
      ${this.msg.title1}
      <div>${this.msg.title2}</div>
      <div>${this.msg.title3}</div>
    </div>
  `;
  }

  renderDivider(text: string) {
    return html`
    <div class="divider">
      <span>${text}</span>
    </div>
  `;
  }

  renderButton(provider: mls.cbe.Provider, icon: TemplateResult, clickHandler: () => void) {
    const lbl: string = `${provider}_${this.getState(provider)}`;
    return html`
    <button class="login-button ${provider}" @click="${clickHandler}">
      ${icon} ${(this.msg as any)[lbl]}
    </button>
  `;
  }

  renderLogOff(text: string, icon: TemplateResult, clickHandler: () => void) {
    if (mls.l0.providersConnected.length < 1) return html``;
    return html`
      ${this.renderDivider(this.msg.or3)}
    <button class="login-button logoff" @click="${clickHandler}">
      ${icon} ${this.msg.logoff}
    </button>
  `;
  }

  renderFooter() {
    return html`
    <div class="footer">
      ${this.msg.lblFoot1}
      <a href="/?details=termsOfService">${this.msg.lblFoot2}</a>
      ${this.msg.lblFoot3}
      <a href="/?details=privacyPolicy">${this.msg.lblFoot4}</a>.
    </div>
  `;
  }

  logoff() {
    document.cookie = `loginUser=anonymous; path=/; secure; samesite=strict;`;
    window.location.reload();
  }

  getState(provider: mls.cbe.Provider): StateProvider {
    if (mls.api.common.getCookie('loginUser') === 'anonymous') return 'canSignIn';
    if (this.isProviderConnected(provider)) {
      if (mls.l0.providersConnected.length > 1) return 'canDisconnect';
      return 'connected';
    }
    return 'canAdd';
  }

  isProviderConnected(provider: mls.cbe.Provider): boolean {
    return mls.l0.providersConnected.includes(provider);
  }

  googleLogin() {
    if (this.verifyDisconnect('google')) return;
    const clientid = '870551353501-mk6renhaoi3h2tt75n9n5ihudeot8e46.apps.googleusercontent.com';
    const urlBack = 'https://collab.codes?source=google';
    const access_type: 'online' | 'offline' = 'offline';
    const responseType = 'code';
    const scope = 'profile email';
    const state = this.generateRandomState();
    localStorage.setItem('pluginCollabLogin', state)
    const ddm = '1'; // Dynamic Decision-Making
    const o2v = '2'; // version oauth2
    const url = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=${encodeURIComponent(clientid)}&redirect_uri=${encodeURIComponent(urlBack)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&access_type=${encodeURIComponent(access_type)}&prompt=select_account&state=${encodeURIComponent(state)}&service=lso&o2v=${o2v}&ddm=${encodeURIComponent(ddm)}&flowName=GeneralOAuthFlow`;
    window.location.href = url;
  }

  gitHubLogin() {
    if (this.verifyDisconnect('github')) return;
    const clientId = 'Ov23liz6csr4BVqknUlF';
    const redirectUri = encodeURIComponent('https://collab.codes?source=github');
    //const scope = 'repo read:user user:email';
    const scope = [
      'repo',         // Access to repositories (includes issues)
      'project',      // Access to GitHub Projects
      'workflow',      // Access to GitHub Projects
      'admin:org',    // Admin access to organization (very sensitive)
      'user:email'    // Access to user's email address
    ].join(' ');
    const state = this.generateRandomState();
    localStorage.setItem('pluginCollabLogin', state)
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    window.location.href = url;
  }

  gitLabLogin() {
    if (this.verifyDisconnect('gitlab')) return;
    const clientId = '2569db7a06cbd602e6215d850484bdb8bbb6cdace59717015827fd53ed61c565';
    const redirectUri = encodeURIComponent('https://collab.codes?source=gitlab');
    const scope = 'read_user api';
    const state = this.generateRandomState();
    localStorage.setItem('pluginCollabLogin', state)
    const url = `https://gitlab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
    window.location.href = url;
  }

  verifyDisconnect(provider: mls.cbe.Provider): boolean {
    if (this.getState(provider) !== 'canDisconnect') return false;
    window.location.href = `/?source=${provider}&function=disconnect`;
    return true;
  }

  generateRandomState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  LogoffIcon() {
    return svg`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M10 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H10V19H5V5H10V3ZM16.59 7.41L15.17 8.83L17.34 11H9V13H17.34L15.17 15.17L16.59 16.59L21.59 11.59C22 11.2 22 10.6 21.59 10.21L16.59 7.41Z"/>
    </svg>
  `;
  }

  googleIcon() {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4285F4" d="M47.58 24.6c0-1.63-.13-3.26-.37-4.85H24v9.16h13.45c-.58 3.01-2.28 5.57-4.85 7.26l7.9 6.14c4.64-4.29 7.08-10.62 7.08-17.71z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.14 15.91-5.82l-7.9-6.14c-2.2 1.47-5.02 2.34-8.01 2.34-6.14 0-11.35-4.14-13.2-9.73H2.69v6.13C6.7 42.59 14.79 48 24 48z"/><path fill="#FBBC05" d="M10.8 28.65c-.49-1.47-.76-3.02-.76-4.65s.27-3.18.76-4.65V13.21H2.69C.98 16.52 0 20.16 0 24s.98 7.48 2.69 10.79l8.11-6.14z"/><path fill="#EA4335" d="M24 9.66c3.31 0 6.31 1.14 8.67 3.4l6.5-6.5C34.55 2.36 29.11 0 24 0 14.79 0 6.7 5.41 2.69 13.21l8.11 6.14c1.85-5.59 7.06-9.73 13.2-9.73z"/></svg>
    `;
  }

  githubIcon() {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff"><path d="M12 .3c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.5 2.3 1.1 2.8.8.1-.7.4-1.1.7-1.4-2.6-.3-5.3-1.3-5.3-5.6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.3-2.7 5.3-5.3 5.6.4.3.8.9.8 1.9v2.8c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4C24 5.7 18.6.3 12 .3z"/></svg>
    `;
  }

  gitlabIcon() {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 963.197">
        <style>.cls-1 { fill: #e24329; }.cls-2 { fill: #fc6d26; }.cls-3 { fill: #fca326; }</style><g transform="matrix(5.2068817,0,0,5.2068817,-489.30756,-507.76085)"><path class="cls-1" d="m 282.83,170.73 -0.27,-0.69 -26.14,-68.22 a 6.81,6.81 0 0 0 -2.69,-3.24 7,7 0 0 0 -8,0.43 7,7 0 0 0 -2.32,3.52 l -17.65,54 h -71.47 l -17.65,-54 a 6.86,6.86 0 0 0 -2.32,-3.53 7,7 0 0 0 -8,-0.43 6.87,6.87 0 0 0 -2.69,3.24 L 97.44,170 l -0.26,0.69 a 48.54,48.54 0 0 0 16.1,56.1 l 0.09,0.07 0.24,0.17 39.82,29.82 19.7,14.91 12,9.06 a 8.07,8.07 0 0 0 9.76,0 l 12,-9.06 19.7,-14.91 40.06,-30 0.1,-0.08 a 48.56,48.56 0 0 0 16.08,-56.04 z"/><path class="cls-2" d="m 282.83,170.73 -0.27,-0.69 a 88.3,88.3 0 0 0 -35.15,15.8 L 190,229.25 c 19.55,14.79 36.57,27.64 36.57,27.64 l 40.06,-30 0.1,-0.08 a 48.56,48.56 0 0 0 16.1,-56.08 z"/><path class="cls-3" d="m 153.43,256.89 19.7,14.91 12,9.06 a 8.07,8.07 0 0 0 9.76,0 l 12,-9.06 19.7,-14.91 c 0,0 -17.04,-12.89 -36.59,-27.64 -19.55,14.75 -36.57,27.64 -36.57,27.64 z"/><path class="cls-2" d="M 132.58,185.84 A 88.19,88.19 0 0 0 97.44,170 l -0.26,0.69 a 48.54,48.54 0 0 0 16.1,56.1 l 0.09,0.07 0.24,0.17 39.82,29.82 c 0,0 17,-12.85 36.57,-27.64 z"/></g>
      </svg>
    `;
  }

}

if (!customElements.get('plugin-collab-login-100554')) {
  customElements.define('plugin-collab-login-100554', PluginCollabLogin100554);
}

export const pluginData: mls.plugin.IPluginData = {
  title: "Sign In",
  getSvg(): TemplateResult {
    return svg`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110.94 122.88"><title>lookup</title><path fill="currentColor" d="M19.26,40.53a2.74,2.74,0,0,1-2.59-2.82,2.69,2.69,0,0,1,2.59-2.82H63.41A2.72,2.72,0,0,1,66,37.71a2.68,2.68,0,0,1-2.58,2.82ZM79.41,66a24.82,24.82,0,0,1,20.78,38.41l10.75,11.71-7.42,6.77-10.36-11.4A24.82,24.82,0,1,1,79.41,66Zm13.2,11.62a18.66,18.66,0,1,0,5.47,13.2,18.66,18.66,0,0,0-5.47-13.2Zm-73.32-22a2.73,2.73,0,0,1-2.58-2.82A2.68,2.68,0,0,1,19.29,50H41.37A2.74,2.74,0,0,1,44,52.84a2.68,2.68,0,0,1-2.58,2.82ZM82.76,17.14H92a6.64,6.64,0,0,1,6.61,6.61V55.18c-.2,2.07-5.27,2.1-5.7,0V23.75a.92.92,0,0,0-.94-.94H82.73V55.18c-.49,1.88-4.72,2.16-5.67,0V6.61a.92.92,0,0,0-.94-.94H6.58a1,1,0,0,0-.68.27,1,1,0,0,0-.26.67V85.18a1,1,0,0,0,.26.67,1,1,0,0,0,.68.27H43.36c2.86.29,3,5.23,0,5.67H21.5v10.53a.92.92,0,0,0,.94.94H43.36c2.07.23,2.74,4.94,0,5.67H22.48a6.62,6.62,0,0,1-6.61-6.61V91.79H6.61a6.49,6.49,0,0,1-4.66-2A6.56,6.56,0,0,1,0,85.18V6.61A6.49,6.49,0,0,1,2,2,6.55,6.55,0,0,1,6.61,0H76.16a6.51,6.51,0,0,1,4.66,2,6.54,6.54,0,0,1,1.94,4.66V17.14ZM19.26,25.4a2.74,2.74,0,0,1-2.59-2.82,2.69,2.69,0,0,1,2.59-2.82H63.41A2.73,2.73,0,0,1,66,22.58a2.69,2.69,0,0,1-2.58,2.82Z"/></svg>
    `;
  }
};

type StateProvider = 'connected' | 'canSignIn' | 'canDisconnect' | 'canAdd';
