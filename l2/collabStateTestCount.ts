/// <mls shortName="collabStateTestCount" project="100554" enhancement="_100554_enhancementLit" />

import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CollabLitElement, collabState } from './_100554_collabLitElement';
import * as states from './_100554_collabStore';


@customElement('collab-state-test-count-100554')
class MyComponent extends CollabLitElement {
  @collabState(states.COUNTHITSPAGES) count = 0;

  @collabState()
  user: { name: string, codigo: number } = { name: 'wagner', codigo: 11 }


  static styles = css`
    /* seu CSS aqui */
  `;

  render() {
    super.setCollabState( 'user', { name: this.user.name, codigo: 12 } )
    
    return html`
      <button @click=${() => super.setCollabState('count', this.count + 1)}>
        Increment
      </button>
      <div>Count: ${this.count}</div>
    `;
  }
}
