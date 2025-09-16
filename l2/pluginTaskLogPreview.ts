/// <mls shortName="pluginTaskLogPreview" project="100554" enhancement="_100554_enhancementLit" />

import { html } from 'lit'; 
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';

@customElement('plugin-task-log-preview-100554')
export class PluginTaskLogPreview100554 extends StateLitElement {

  @property() task: mls.msg.TaskData | undefined = undefined;
  @state() itens: ILog[] = [];

  //----COMPONENT---------

  async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {

    window.addEventListener('task-change', this.onTaskChange);

  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('task-change', this.onTaskChange);
  }

  render() {
    return html`
    <div class="log-window" id="logWindow" >
      ${this.itens.map((i) => this.renderItem(i))}
    </div>`;
  }

  renderItem(item: ILog) {
    let cls = '';
    switch (item.status) {
      case ('completed'):
        cls = 'info';
        break;
      case ('in progress'):
        cls = 'warn';
        break;
      case ('failed'):
        cls = 'error';
        break;
      default: cls = 'info';
    }
    return html`
      <div class="log-entry" style="display: flex;">
        <div class="ts">${this.getDtHr()}</div>
        <div class="level ${cls}">${item.status}</div> 
        <div class="message">${item.desc}</div>
      </div>
    `
  }


  //------IMPLEMENTATION--------

  private onTaskChange = async (e: Event) => {

    if (!this.task) return;
    const customEvent = e as CustomEvent;
    const message: mls.msg.Message = customEvent.detail.context.message;
    const _task: mls.msg.TaskData = customEvent.detail.context.task;
    if (this.task.PK !== _task.PK) return;
    this.task = _task;

    this.setLog();

  };

  private setLog() {
    if (!this.task) return;
    this.itens.push({status:this.task.status, desc:this.task.title})
  }

  private getDtHr() {
    const now = new Date();
    const dt = now.toLocaleDateString("pt-BR");
    const hr = now.toLocaleTimeString("pt-BR");
    return `${dt}, ${hr}`;
  }
}

interface ILog {
  status: string,
  desc: string
}
