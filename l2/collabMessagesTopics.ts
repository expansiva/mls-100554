/// <mls shortName="collabMessagesTopics" project="100554" enhancement="_100554_enhancementLit" />

import { html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';

@customElement('collab-messages-topics-100554')
export class CollabMessagesTopics100554 extends StateLitElement {

  @state() messages: IMessage[] = [];
  @state() topics: string[] = [];
  @state() expanded = false;
  @state() selectedTopic: string | null = null;

  @property() threadTopics: string[] = [];

  render() {

    this.topics = this.getTopicsFromMessagesOrdered();
    const grouped = this.groupTopics(this.topics);

    let headerTopics = this.topics.slice(0, 3);
    if (this.selectedTopic && !headerTopics.includes(this.selectedTopic) && this.selectedTopic !== 'all') {
      headerTopics = [...headerTopics, this.selectedTopic];
    }

    if (!this.topics || this.topics.length === 0) return html``;

    return html`

      <div class="topics-header">
        <div class="topics">
          <button
            class=${this.selectedTopic === 'all' ? 'active' : ''}
            @click=${() => this.emitTopic('all')}
          >all</button>

          ${!this.expanded
        ? headerTopics.map(topic => html`
                <button
                  class=${this.selectedTopic === topic ? 'active' : ''}
                  @click=${() => this.emitTopic(topic)}
                >${topic}</button>
              `)
        : null}
        </div>
        <button @click=${() => this.expanded = !this.expanded}>
          ${this.expanded ? 'Hide details' : 'Show details'}
        </button>
      </div>

      ${this.expanded ? html`
        <div class="groups">
          ${Object.entries(grouped).map(([group, items]) => html`
            <div class="group">
              <div class="group-title">${group}</div>
              <div class="group-topics">
                ${items.map(item => html`
                  <button
                    class=${this.selectedTopic === item ? 'active' : ''}
                    @click=${() => this.emitTopic(item)}
                  >${item}</button>
                `)}
              </div>
            </div>
          `)}
        </div>
      ` : null}
    `;
  }

  private emitTopic(topic: string) {
    this.selectedTopic = topic;
    this.dispatchEvent(new CustomEvent("topic-selected", {
      detail: { topic },
      bubbles: true,
      composed: true
    }));
  }

  private getTopicsFromMessages() {
    let topicsResult: string[] = [];
    this.messages.forEach((message) => {
      if (message.content) {
        const topics = this.extractTopics(message.content);
        if (topics.length > 0) {
          topicsResult = [...topicsResult, ...topics];
        }
      }
    });
    return topicsResult;
  }

  private extractTopics(message: string): string[] {
    const regex = /\+[a-zA-Z0-9_]+/g;
    const matches = message.match(regex);
    return matches ? matches : [];
  }

  private groupTopics(topics: string[]) {
    const groups: Record<string, string[]> = {};
    topics.forEach(topic => {
      const clean = topic.slice(1);
      const [prefix] = clean.split('_', 2);
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(topic);
    });
    return groups;
  }

  private getTopicsFromMessagesOrdered(): string[] {
    const seen = new Set<string>();
    const ordered: string[] = [];

    this.messages.forEach((message) => {
      if (message.content) {
        const topics = this.extractTopics(message.content);
        topics.forEach(topic => {
          if (!seen.has(topic)) {
            seen.add(topic);
            ordered.push(topic);
          }
        });
      }
    });

    return ordered;
  }
}

interface IMessage extends mls.msg.MessagePerformanceCache {
  context?: mls.msg.ExecutionContext,
}