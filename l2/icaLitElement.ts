/// <mls shortName="icaLitElement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { IcaState } from './_100554_icaState';
import { PropertyDeclaration } from '_100554_litReactiveElement';

const isTrace = false;
const state1 = new IcaState();

// Declare a global state structure
interface GlobalState {
    [key: string]: any;
}

// Extend the Window interface
declare global {
    interface Window {
        globalState: GlobalState;
    }
}

/**
 * Function to retrieve nested property values using a path string.
 * Handles arrays and nested objects. Assumes all objects are indexable with string keys.
 * ex: 'users[0].name'
 */
function getPathValue(obj: { [key: string]: any }, path: string) {
  return path.split('.').reduce((acc, part) => {
    const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      const prop = arrayMatch[1];
      const index = parseInt(arrayMatch[2], 10);
      return acc[prop][index];
    }
    return acc[part];
  }, obj);
}
// Helper function to set a value in the globalState by path
function setPathValue(obj: { [key: string]: any }, path: string, value: any): void {
  const parts = path.split('.');
  const last: string | undefined = parts.pop();
  if (!last) return;
  const lastObj = parts.reduce((acc, part) => {
    const match = part.match(/(\w+)\[(\d+)\]/);
    return match ? acc[match[1]][parseInt(match[2], 10)] : acc[part];
  }, obj);
  lastObj[last] = value;
}

/**
 * Custom decorator to bind properties either to static data or dynamically from CollabState.
 * @param options - Property options including type and default value.
 */
function propertyDataSource(options?: PropertyDeclaration) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (proto: IcaLitElement, propName: PropertyKey): any => {
    // Define a Lit property with provided options.
    property(options)(proto, propName);
    // const { type } = options;
    const key = String(propName);
    if (proto.hasOwnProperty('stateKeys')) proto.stateKeys.add(key);    

    Object.defineProperty(proto, propName, {
      get() {
        const attrValue = this.getAttribute(key);
        if (attrValue && attrValue.includes('{{') && attrValue.includes('}}')) {
          const stateKey = attrValue.replace(/[{{}}]/g, '').trim();
          return getPathValue(window.globalState, stateKey);
        }
        // Default to internal property value
        return this[`_${key}`];           
      },
      set(value) {
        if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
          // initialization ex selectedvalue="{{globalState.users[0].sex}}"
          // dynamic data from json
          const stateKey = value.replace(/[{{}}]/g, '').trim();
          this[`_${key}`] = getPathValue(window.globalState, stateKey);
        } else if (typeof value === 'string' && ((value.startsWith('[') || value.startsWith('{')) && (value.endsWith(']') || value.endsWith('}')))) {
          // initialization ex options="[{ key: 'm', value: 'male' }, { key: 'f', value: 'female' }, { key: 'o', value: 'other' }]"
          // Parse JSON string for static data
          this[`_${key}`] = JSON.parse(value);
        } else {
          // updates ex selectedValue = 'm';
          // Update both internal property value and globalState if necessary and notify state changes
          if (this.hasAttribute(key) && this.getAttribute(key).includes('{{') && this.getAttribute(key).includes('}}')) {
            const dynamicKey = this.getAttribute(key).replace(/[{{}}]/g, '').trim();
            state1.setState(dynamicKey, value); // Notify state changes
            setPathValue(window.globalState, dynamicKey, value); // change in json
          }
          this[`_${key}`] = value;
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
    if (isTrace) console.info(`connectedCallback, subscribe fields: ${this.stateKeys}`);
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

    if (!this.stateKeys.has(key)) return;
    const ob1: {[key: string]: any} = this;
    const propValue: any = ob1[`_${key}`];
    if (ob1.hasAttribute(key) && !isEqual(value, propValue)) {
      ob1[key] = value; // Ensure this triggers the setter with potential side effects
    }
  }  

}
