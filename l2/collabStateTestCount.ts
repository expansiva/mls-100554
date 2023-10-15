/// <mls shortName="collabStateTestCount" project="100554" enhancement="_100554_enhancementLit" />

import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CollabLitElement, collabState } from 'CollabLitElement';


@customElement('collab-state-test-count-100554')
class MyComponent extends CollabLitElement {
  @collabState() count = 0;

  static styles = css`
    /* seu CSS aqui */
  `;

  render() {
    return html`
      <button @click=${() => this.setCollabState('count', this.count + 1)}>
        Increment
      </button>
      <div>Count: ${this.count}</div>
    `;
  }
}
