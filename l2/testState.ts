/// <mls shortName="testState" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { propertyDataSource, propertyCompositeDataSource } from '/_100554_/l2/collabDecorators.js';
import {
    getState, setState, subscribe, unsubscribe, notify, initState
} from '/_100554_/l2/collabState.js';

//
// Test state handling in Lit. Usage:
//
// <test-state-100554 name="{{ui.testState}}"></test-state-100554>
// Use @propertyDataSource for read/write, or @propertyCompositeDataSource for read-only.
//
// From outside Lit, use the functions: 'setState', 'getState', 'subscribe'.
//


@customElement('test-state-100554')
export class TestState100554 extends StateLitElement {

    @propertyDataSource() name: string = 'value default';

    render() {
        return html`
            <p>Hello, ${this.name}!</p>
            <input 
                type="text" 
                .value=${this.name}
                @change=${(e: Event) => this.name = (e.target as HTMLInputElement).value}
            />
        `;
    }
}

((window.parent || window) as any).testState = {
    getName: () => { return getState('ui.testState') },
    setName: (value: any) => { return setState('ui.testState', value) }
}

subscribe('*testState;ui.testState', (stateName: string, stateValue: any) => { console.log(`subscribe, name=${stateName}, value type=${typeof stateValue}, ${stateValue}`) }); // Removes older subscriptions with the exact same key — use '*' at the beginning to enforce uniqueness

console.log('Test the state functions in the console');
