/// <mls shortName="pluginPrototypeImprove" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { collab_file_pen, collab_magnifying_glass } from './_100554_collabIcons';


@customElement('plugin-prototype-improve-100554')
export class PluginPrototypeImprove100554 extends StateLitElement {

  @state() improve: PrototypeImprove = {
    scope: 'page',
    action: [],
    text: {},
    layout: {},
    visual: {},
    interaction: {},
    accessibility: {},
    responsiveness: {},
    notes: '',
  };

  toggleAction(action: 'review' | 'rewrite') {
    const actions = this.improve.action ?? [];
    if (actions.includes(action)) {
      this.improve = {
        ...this.improve,
        action: actions.filter(a => a !== action),
      };
    } else {
      this.improve = {
        ...this.improve,
        action: [...actions, action],
      };
    }
  }

  updateTextOption(option: keyof NonNullable<PrototypeImprove['text']>, value: any) {
    this.improve = {
      ...this.improve,
      text: {
        ...this.improve.text,
        [option]: value,
      },
    };
  }

  updateLayoutOption(option: keyof NonNullable<PrototypeImprove['layout']>, value: any) {
    this.improve = {
      ...this.improve,
      layout: {
        ...this.improve.layout,
        [option]: value,
      },
    };
  }

  updateVisualOption(option: keyof NonNullable<PrototypeImprove['visual']>, value: any) {
    this.improve = {
      ...this.improve,
      visual: {
        ...this.improve.visual,
        [option]: value,
      },
    };
  }

  updateInteractionOption(option: keyof NonNullable<PrototypeImprove['interaction']>, value: any) {
    this.improve = {
      ...this.improve,
      interaction: {
        ...this.improve.interaction,
        [option]: value,
      },
    };
  }

  updateAccessibilityOption(option: keyof NonNullable<PrototypeImprove['accessibility']>, value: any) {
    this.improve = {
      ...this.improve,
      accessibility: {
        ...this.improve.accessibility,
        [option]: value,
      },
    };
  }

  updateResponsivenessOption(option: keyof NonNullable<PrototypeImprove['responsiveness']>, value: any) {
    this.improve = {
      ...this.improve,
      responsiveness: {
        ...this.improve.responsiveness,
        [option]: value,
      },
    };
  }

  updateNotes(value: string) {
    this.improve = {
      ...this.improve,
      notes: value,
    };
  }

  renderContrastOptions() {
    const options: Contrast[] = ['normal', 'high'];
    const selected = this.improve.visual?.contrast ?? '';

    return html`
      <div class="btn-group">
        ${options.map(opt => html`
          <button
            type="button"
            class="btn ${selected === opt ? 'btn-selected' : ''}"
            @click=${() => this.updateVisualOption('contrast', opt)}
            aria-pressed=${selected === opt}
          >
            ${opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        `)}
      </div>
    `;
  }

  renderTextOptions() {
    const toneOptions: Tone[] = ['friendly', 'professional', 'concise'];
    const toneSelected = this.improve.text?.tone ?? '';

    return html`
      <div>
        <strong>Tone</strong>
        <div class="btn-group">
          ${toneOptions.map(opt => html`
            <button
              type="button"
              class="btn ${toneSelected === opt ? 'btn-selected' : ''}"
              @click=${() => this.updateTextOption('tone', opt)}
              aria-pressed=${toneSelected === opt}
            >
              ${opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          `)}
        </div>

        <strong>Clarify wording</strong>
        <div class="btn-group">
            <button
            type="button"
            class="btn ${this.improve.text?.clarity ? 'btn-selected' : ''}"
            @click=${() => this.updateTextOption('clarity', !this.improve.text?.clarity)}
            aria-pressed=${this.improve.text?.clarity}
            >
            Clarify wording
            </button>
        </div>

        <strong>Shorter</strong>
        <div class="btn-group">
            <button
            type="button"
            class="btn ${this.improve.text?.shorter ? 'btn-selected' : ''}"
            @click=${() => this.updateTextOption('shorter', !this.improve.text?.shorter)}
            aria-pressed=${this.improve.text?.shorter}
            >
            Shorter
            </button>
        </div>
        
      </div>
    `;
  }

  renderLayoutOptions() {
    const gridOptions: Grid[] = ['auto', '1-col', '2-col', '3-col'];
    const spacingOptions: Spacing[] = ['compact', 'comfortable', 'roomy'];

    const gridSelected = this.improve.layout?.grid ?? '';
    const spacingSelected = this.improve.layout?.spacing ?? '';

    return html`
      <div>
        <strong>Grid</strong>
        <div class="btn-group">
          ${gridOptions.map(opt => html`
            <button
              type="button"
              class="btn ${gridSelected === opt ? 'btn-selected' : ''}"
              @click=${() => this.updateLayoutOption('grid', opt)}
              aria-pressed=${gridSelected === opt}
            >
              ${opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          `)}
        </div>

        <strong>Spacing</strong>
        <div class="btn-group">
          ${spacingOptions.map(opt => html`
            <button
              type="button"
              class="btn ${spacingSelected === opt ? 'btn-selected' : ''}"
              @click=${() => this.updateLayoutOption('spacing', opt)}
              aria-pressed=${spacingSelected === opt}
            >
              ${opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          `)}
        </div>

        <strong>Align to Grid</strong>
        <div class="btn-group">
            <button
            type="button"
            class="btn ${this.improve.layout?.alignToGrid ? 'btn-selected' : ''}"
            @click=${() => this.updateLayoutOption('alignToGrid', !this.improve.layout?.alignToGrid)}
            aria-pressed=${this.improve.layout?.alignToGrid}
            >
            Align to Grid
            </button>
        </div>

        <strong>Reorder Sections</strong>
        <div class="btn-group">
            <button
            type="button"
            class="btn ${this.improve.layout?.reorderSections ? 'btn-selected' : ''}"
            @click=${() => this.updateLayoutOption('reorderSections', !this.improve.layout?.reorderSections)}
            aria-pressed=${this.improve.layout?.reorderSections}
            >
            Reorder Sections
            </button>
      </div>
        
      </div>
    `;
  }

  renderVisualOptions() {
    const imageryOptions: ('add' | 'reduce' | 'keep')[] = ['add', 'reduce', 'keep'];
    const imagerySelected = this.improve.visual?.imagery ?? '';

    return html`
      <div>
        <strong>Emphasize Headers</strong>
        <div class="btn-group">
            <button
                type="button"
                class="btn ${this.improve.visual?.emphasizeHeaders ? 'btn-selected' : ''}"
                @click=${() => this.updateVisualOption('emphasizeHeaders', !this.improve.visual?.emphasizeHeaders)}
                aria-pressed=${this.improve.visual?.emphasizeHeaders}
            >
                Emphasize Headers
            </button>
        </div>

        <strong>Imagery</strong>
        <div class="btn-group">
          ${imageryOptions.map(opt => html`
            <button
              type="button"
              class="btn ${imagerySelected === opt ? 'btn-selected' : ''}"
              @click=${() => this.updateVisualOption('imagery', opt)}
              aria-pressed=${imagerySelected === opt}
            >
              ${opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          `)}
        </div>
      </div>
    `;
  }

  renderInteractionOptions() {
    const ctaOptions: CtaLevel[] = ['low', 'medium', 'high'];
    const ctaSelected = this.improve.interaction?.ctaProminence ?? '';

    return html`
      <div>
        <strong>CTA Prominence</strong>
        <div class="btn-group">
          ${ctaOptions.map(opt => html`
            <button
              type="button"
              class="btn ${ctaSelected === opt ? 'btn-selected' : ''}"
              @click=${() => this.updateInteractionOption('ctaProminence', opt)}
              aria-pressed=${ctaSelected === opt}
            >
              ${opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          `)}
        </div>

        <strong>Simplify Navigation</strong>
        <div class="btn-group">
            <button
            type="button"
            class="btn ${this.improve.interaction?.navigationSimplify ? 'btn-selected' : ''}"
            @click=${() => this.updateInteractionOption('navigationSimplify', !this.improve.interaction?.navigationSimplify)}
            aria-pressed=${this.improve.interaction?.navigationSimplify}
            >
          Simplify Navigation
        </button>
        </div>

        <strong>Add Feedback States</strong>
        <div class="btn-group">
            <button
            type="button"
            class="btn ${this.improve.interaction?.addFeedbackStates ? 'btn-selected' : ''}"
            @click=${() => this.updateInteractionOption('addFeedbackStates', !this.improve.interaction?.addFeedbackStates)}
            aria-pressed=${this.improve.interaction?.addFeedbackStates}
            >
            Add Feedback States (hover/active)
            </button>
        </div>
        
        </div>
    `;
  }

  renderAccessibilityOptions() {
    return html`
      <div>
        <strong>Accessibility</strong>
        <div class="btn-group">
            <button
            type="button"
            class="btn ${this.improve.accessibility?.largeTouchTargets ? 'btn-selected' : ''}"
            @click=${() => this.updateAccessibilityOption('largeTouchTargets', !this.improve.accessibility?.largeTouchTargets)}
            aria-pressed=${this.improve.accessibility?.largeTouchTargets}
            >
            Large Touch Targets
            </button>
         </div>

      </div>
    `;
  }

  renderResponsivenessOptions() {
    const optimizeOptions: ('mobile' | 'desktop' | 'both')[] = ['mobile', 'desktop', 'both'];
    const optimizeSelected = this.improve.responsiveness?.optimizeFor ?? '';

    return html`
      <div>
        <strong>Optimize for</strong>
        <div class="btn-group">
          ${optimizeOptions.map(opt => html`
            <button
              type="button"
              class="btn ${optimizeSelected === opt ? 'btn-selected' : ''}"
              @click=${() => this.updateResponsivenessOption('optimizeFor', opt)}
              aria-pressed=${optimizeSelected === opt}
            >
              ${opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          `)}
        </div>

        <strong>Sticky Header</strong>
        <div class="btn-group">
            <button
                type="button"
                class="btn ${this.improve.responsiveness?.stickyHeader ? 'btn-selected' : ''}"
                @click=${() => this.updateResponsivenessOption('stickyHeader', !this.improve.responsiveness?.stickyHeader)}
                aria-pressed=${this.improve.responsiveness?.stickyHeader}
            >
            Sticky Header
            </button>
        </div>
      </div>
    `;
  }

  private renderQuickActions() {

    return html`
            <div class="btn-action">
                <button
                    type="button"
                    class="btn"
                    @click=${() => this.toggleAction('review')}
                >
                    ${collab_magnifying_glass}
                    <span>Review</span>
                </button>
                <button
                    type="button"
                    class="btn"
                    @click=${() => this.toggleAction('rewrite')}
                >
                    ${collab_file_pen}
                    <span>Rewrite</span>
                </button>
                
            </div>
        
        `
  }

  private renderAdditionalNotes() {
    return html`
        <input
            placeholder="Escreva suas observações aqui..."
            .value=${this.improve.notes}
            @input=${(e: any) => this.updateNotes(e.target.value)}
        ></input>
                `
  }

  render() {
    return html`

    <div class="section">${this.renderAdditionalNotes()}</div>
    <div class="section">${this.renderQuickActions()}</div>

    <details>
        <summary>Text</summary>
        <div>
            <div class="section">${this.renderTextOptions()}</div>
            <hr>
        </div>
    </details>
    <details>
        <summary>Layout</summary>
        <div>
             <div class="section">${this.renderLayoutOptions()}</div>
            <hr>

        </div>
    </details>
    <details>
        <summary>Visual</summary>
        <div>
             <div class="section">${this.renderVisualOptions()}</div>
            <hr>

        </div>
    </details>
    <details>
        <summary>Contrast</summary>
        <div>
            <div class="section">${this.renderContrastOptions()}</div>
            <hr>

        </div>
    </details>

    <details>
        <summary>Interaction</summary>
        <div>
            <div class="section">${this.renderInteractionOptions()}</div>
            <hr>
        </div>
    </details>

    <details>
        <summary>Accessibility</summary>
        <div>
            <div class="section">${this.renderAccessibilityOptions()}</div>
            <hr>
        </div>
    </details>

    <details>
        <summary>Responsiveness </summary>
        <div>
            <div class="section">${this.renderResponsivenessOptions()}</div>
            <hr>
        </div>
    </details>

<pre>${JSON.stringify(this.improve, null, 2)}</pre>

      
    `;
  }
}

//

type Tone = 'friendly' | 'professional' | 'concise';
type Grid = 'auto' | '1-col' | '2-col' | '3-col';
type Spacing = 'compact' | 'comfortable' | 'roomy';
type Density = 'low' | 'medium' | 'high';
type Contrast = 'normal' | 'high';
type CtaLevel = 'low' | 'medium' | 'high';

interface PrototypeImprove {
  scope: 'page' | 'section' | 'widget';
  targetId?: string;
  action?: ('review' | 'rewrite')[];
  text?: {
    tone?: Tone;
    clarity?: boolean;
    shorter?: boolean;
  };
  layout?: {
    grid?: Grid;
    spacing?: Spacing;
    density?: Density;
    alignToGrid?: boolean;
    reorderSections?: boolean;
  };
  visual?: {
    contrast?: Contrast;
    emphasizeHeaders?: boolean;
    imagery?: 'add' | 'reduce' | 'keep';
  };
  interaction?: {
    ctaProminence?: CtaLevel;
    navigationSimplify?: boolean;
    addFeedbackStates?: boolean;
  };
  accessibility?: {
    largeTouchTargets?: boolean;
  };
  responsiveness?: {
    optimizeFor?: 'mobile' | 'desktop' | 'both';
    stickyHeader?: boolean;
  };
  notes?: string;
}
