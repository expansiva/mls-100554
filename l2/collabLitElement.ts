/// <mls shortName="collabLitElement" project="100554" enhancement="_blank" />
				
import { LitElement } from 'lit';
import { CollabState } from './_100554_collabState';

const state1 = new CollabState();

/**
 * Decorator to synchronize a property with a CollabState key.
 * @param customKey - The state key. Defaults to property key.
 */
export function collabState(customKey?: string): PropertyDecorator {
  return (proto: Object, propertyKey: string | symbol) => {
    const key = customKey || String(propertyKey);

    const { connectedCallback, disconnectedCallback } = proto as any;

    (proto as any).connectedCallback = function() {
      connectedCallback?.call(this);
      state1.subscribe(key, this);
      this[propertyKey] = state1.getState(key);
    };

    (proto as any).disconnectedCallback = function() {
      disconnectedCallback?.call(this);
      state1.unsubscribe(key, this);
    };

    (proto as any).handleCollabStateChange = function(changedKey: string, value: any) {
      if (changedKey === key) {
        this[propertyKey] = value;
        this.requestUpdate(propertyKey as string, value);
      }
    };

    Object.defineProperty(proto, propertyKey, {
      get() {
        return state1.getState(key);
      },
      set(value: any) {
        state1.setState(key, value);
      },
      configurable: true,
      enumerable: true
    });    
  };
}

/**
 * Class extending LitElement with CollabState functionality.
 */
export class CollabLitElement extends LitElement {
  /**
   * Update shared state.
   * @param key - The state key to update.
   * @param value - The new state value.
   */
  setCollabState(key: string, value: any): void {
    state1.setState(key, value);
  }
}

