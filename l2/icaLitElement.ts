/// <mls shortName="icaLitElement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { CollabState } from './_100554_collabState';
import { PropertyDeclaration } from '_100554_litReactiveElement';

const isTrace = false;
const state1 = new CollabState();

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

/**
 * Custom decorator to bind properties either to static data or dynamically from CollabState.
 * @param options - Property options including type and default value.
 */
function propertyDataSource(options?: PropertyDeclaration) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (proto: Object, propName: PropertyKey): any => {
    // Define a Lit property with provided options.
    property(options)(proto, propName);
    // const { type } = options;
    const key = String(propName);

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
          const stateKey = value.replace(/[{{}}]/g, '').trim();
          this[`_${key}`] = getPathValue(window.globalState, stateKey);
        } else if (typeof value === 'string' && ((value.startsWith('[') || value.startsWith('{')) && (value.endsWith(']') || value.endsWith('}')))) {
          // Parse JSON string for static data
          this[`_${key}`] = JSON.parse(value);
        } else {
          // Assume it's a simple static value
          this[`_${key}`] = value;
        }
        this.requestUpdate();
      }
    });
  };
}

/**
 * Base class for components, extending LitElement with enhanced state management capabilities.
 */
export class IcaLitElement extends LitElement {
  /**
   * Update shared state.
   * @param key - The state key to update.
   * @param value - The new state value.
   */
  setCollabState(key: string, value: any): void {
    state1.setState(key, value);
  }

  collabRequestUpdate() {
    super.requestUpdate(); // Trigger a re-render
  }
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


