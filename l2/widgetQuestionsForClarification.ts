/// <mls shortName="widgetQuestionsForClarification" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

import { ClarificationValue, endClarification } from '/_100554_/l2/aiAgentOrchestration.js';

export class WidgetQuestionsForClarification100554 extends StateLitElement {
  @property({ type: Object }) value: ClarificationValue | null = null;

  @property({ type: Boolean }) readonly = false;

  // Local state for editing answers
  @state()
  private localAnswers: { [key: string]: string | boolean } = {};

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (name === 'value') {
      try {
        this.value = JSON.parse(newVal);
      } catch (e) {
        console.log("error on widgetQuestionsForClarification.attributeChangedCallback", e);
        this.value = null;
      }
    }
    super.attributeChangedCallback?.(name, oldVal, newVal);
  }

  updated(changedProps: Map<string, any>) {
    // Initialize answers when value changes
    if (changedProps.has('value') && this.value) {
      const initialAnswers: { [key: string]: string | boolean } = {};
      Object.entries(this.value.questions).forEach(([key, q]) => {
        initialAnswers[key] = q.answer ?? (q.type === 'boolean' ? false : '');
      });
      this.localAnswers = initialAnswers;
    }
  }

  // Input change handler for all field types
  private onInputChange(questionId: string, value: string | boolean) {
    this.localAnswers = {
      ...this.localAnswers,
      [questionId]: value,
    };
    // Keep 'value' in sync with localAnswers (two-way)
    if (this.value) {
      this.value = {
        ...this.value,
        questions: Object.fromEntries(
          Object.entries(this.value.questions).map(([key, q]) => [
            key,
            { ...q, answer: this.localAnswers[key] ?? q.answer }
          ])
        )
      };
    }
  }

  private onCancel() {
    if (this.value && !this.readonly) {
      endClarification(this.value, "cancel");
    }
  }

  private onContinue() {
    // Update answers into 'value'
    if (this.value && !this.readonly) {
      this.value = {
        ...this.value,
        questions: Object.fromEntries(
          Object.entries(this.value.questions).map(([key, q]) => [
            key,
            { ...q, answer: this.localAnswers[key] }
          ])
        )
      };
      endClarification(this.value, "continue");
    }
  }

  render() {
    if (!this.value || !this.value.questions || !this.value.legends) return html`<div>No questions available. value is ${typeof this.value}</div>`;

    const isDisabled = this.readonly === true;
    return html`
    <h2 class='title'>${this.value.title}</h2>
    <form class="clarification-form" @submit=${(e: Event) => e.preventDefault()}>
      ${Object.entries(this.value.questions).map(([key, q]) => html`
        <div
          class="clarification-question"
          data-type=${q.type}
        >
          ${q.type === 'boolean' ? html`
            <label style="display: flex; align-items: center; gap: 0.6em;">
              <input
                type="checkbox"
                .checked=${!!this.localAnswers[key]}
                @change=${(e: Event) => this.onInputChange(key, (e.target as HTMLInputElement).checked)}
                style="margin: 0;"
              />
              <span>${q.question}</span>
            </label>
          ` : q.type === 'MoSCoW' ? html`
            <div style="display: flex; align-items: center; gap: 1em;">
              <select
                style="min-width: 110px;"
                .value=${String(this.localAnswers[key] ?? '')}
                @change=${(e: Event) => this.onInputChange(key, (e.target as HTMLSelectElement).value)}
              >
                <option value="">Select...</option>
                <option value="must">Must</option>
                <option value="should">Should</option>
                <option value="could">Could</option>
                <option value="wont">Won't</option>
              </select>
              <span class="moscow-label">${q.question}</span>
            </div>
          ` : q.type === 'range' ? html`
            <label style="display: flex; align-items: center; gap: 1em;">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                .value=${String(this.localAnswers[key] ?? q.answer ?? 50)}
                @input=${(e: Event) => this.onInputChange(key, (e.target as HTMLInputElement).value)}
                style="width: 180px;"
              />
              <span style="min-width: 34px; text-align: right;">
                ${this.localAnswers[key] ?? q.answer ?? 50}
              </span>
              <span style="flex:1;">${q.question}</span>
            </label>
          ` : html`
            <label>${q.question}</label>
            ${q.type === 'open' ? html`
              <textarea
                .value=${String(this.localAnswers[key] ?? '')}
                @input=${(e: Event) => this.onInputChange(key, (e.target as HTMLTextAreaElement).value)}
                rows="2"
              ></textarea>
            ` : q.type === 'select' && q.options ? html`
              <select
                .value=${String(this.localAnswers[key] ?? '')}
                @change=${(e: Event) => this.onInputChange(key, (e.target as HTMLSelectElement).value)}
              >
                <option value="">Select...</option>
                ${q.options.map(option => html`
                  <option value=${option.label}>${option.label}</option>
                `)}
              </select>
            ` : null}
          `}
        </div>
      `)} 
      <div class="clarification-actions">
        <button type="button" class="action-btn cancel" @click=${this.onCancel} ?disabled=${isDisabled}>Cancel</button>
        <button type="button" class="action-btn continue" @click=${this.onContinue} ?disabled=${isDisabled}>Continue</button>
      </div>
      ${this.value.legends?.length ? html`
        <div class="clarification-legends" style="margin-top:2em;">
          ${this.value.legends.map(line => html`<div>${line}</div>`)}
        </div>
      ` : ''}
    </form>
  `;
  }
}

if (!customElements.get('widget-questions-for-clarification-100554')) {
  customElements.define('widget-questions-for-clarification-100554', WidgetQuestionsForClarification100554);
}

