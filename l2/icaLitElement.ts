/// <mls shortName="icaLitElement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { IcaState } from './_100554_icaState';
import { PropertyDeclaration } from '_100554_litReactiveElement';

const isTrace = false;
const state1 = new IcaState();



/**
 * Custom decorator to bind properties either to static data or dynamically from CollabState.
 * @param options - Property options including type and default value.
 */
export function propertyDataSource(options?: PropertyDeclaration) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (proto: any, propName: PropertyKey): any => {
    // Define a Lit property with provided options.
    property(options)(proto, propName);
    // const { type } = options;
    const key = String(propName);

    Object.defineProperty(proto, propName, {
      get() {

        const attrValue = this.getAttribute(key);
        if (attrValue && attrValue.includes('{{') && attrValue.includes('}}')) {
          const stateKey = attrValue.replace(/[{{}}]/g, '').trim();
          return state1.getState(stateKey);
        }
        // Default to internal property value
        return this[`_${key}`];
      },
      set(value) {

        if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
          // initialization ex selectedvalue="{{globalState.users[0].sex}}"
          // dynamic data from json
          const stateKey = value.replace(/[{{}}]/g, '').trim();
          if (this.hasOwnProperty('stateKeys')) this.stateKeys.add(key + ';' + stateKey);
          this[`_${key}`] = state1.getState(stateKey);
          if(!window.globalStateManagment) window.globalStateManagment = state1;
        } else if (typeof value === 'string' && ((value.startsWith('[') || value.startsWith('{')) && (value.endsWith(']') || value.endsWith('}')))) {
          // initialization ex options="[{ key: 'm', value: 'male' }, { key: 'f', value: 'female' }, { key: 'o', value: 'other' }]"
          // Parse JSON string for static data
          this[`_${key}`] = JSON.parse(value);
        } else {
          // updates ex selectedValue = 'm';
          // Update both internal property value and globalState if necessary and notify state changes
          if (this.hasAttribute(key) && this.getAttribute(key).includes('{{') && this.getAttribute(key).includes('}}')) {
            const dynamicKey = this.getAttribute(key).replace(/[{{}}]/g, '').trim();
            this[`_${key}`] = value;
            state1.setState(dynamicKey, value); // Notify state changes
          }
          else this[`_${key}`] = value;
        }
        this.requestUpdate();
      }
    });
  };
}

export interface OptionItem {
  key: string;
  value: string;
}

/**
 * Example usage of the propertyDataSource decorator.
 */
// class SelectList extends IcaLitElement {
//   @propertyDataSource({ type: Array })
//   options: OptionItem[] = [];

//   @propertyDataSource({ type: String })
//   selectedValue: string = '';
// }


/**
 * Base class for all components that need to interact with the shared state.
 */
export class IcaLitElement extends LitElement {

  stateKeys: Set<string> = new Set<string>();

  connectedCallback(): void {
    super.connectedCallback();
    if (isTrace) console.info(`connectedCallback, subscribe fields: ${Array.from(this.stateKeys)}`);
    state1.subscribe(Array.from(this.stateKeys), this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    state1.unsubscribe(Array.from(this.stateKeys), this);
  }

  /**
   * Handle state changes from IcaState.
   * @param key - The state key that changed.
   * @param value - The new value of the state.
   */
  handleIcaStateChange(key: string, value: any): void {

    function isEqual(newValue: any, oldValue: any) {
      return JSON.stringify(newValue) === JSON.stringify(oldValue);
    }

    const ob1: { [key: string]: any } = this;
    Array.from(this.stateKeys).forEach((stateKey) => {
      const [propName, path] = stateKey.split(';');
      if (path !== key || !ob1.hasAttribute(propName)) return;
      const propValue: any = ob1[`_${propName}`];
      if (!isEqual(value, propValue)) {
        ob1[`_${propName}`] = value; // Ensure this triggers the setter with potential side effects
        this.requestUpdate();
      }
    })

  }

}
