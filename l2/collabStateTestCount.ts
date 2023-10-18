/// <mls shortName="collabStateTestCount" project="100554" enhancement="_100554_enhancementLit" />

import { html,  } from 'lit';
import { customElement, property  } from 'lit/decorators.js';
import { CollabLitElement, collabState } from './_100554_collabLitElement';
import * as states from './_100554_collabStore';

@customElement('collab-state-test-count-100554')
class MyComponent extends CollabLitElement {
  @property({ type: Number })
  @collabState(states.COUNTHITSPAGES)
  count = 0;


  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this.count += 10; // set count += 10 after 3 sec. 
      super.setCollabState(states.COUNTHITSPAGES, this.count); 
    }, 3000);
  }

  render() {
    return html`
      <button @click=${this.increment}>Increment Lit default</button>
      <button @click=${() => super.setCollabState(states.COUNTHITSPAGES, this.count + 1)} style='margin: 2em'>
        Increment CollabState
      </button>
      <div>Count: ${this.count}</div>
    `;
  }

  increment() {
    this.count++;
    // call setCollabState to update state on others
    super.setCollabState(states.COUNTHITSPAGES, this.count); 
  }  

}
