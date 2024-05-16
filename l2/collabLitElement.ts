/// <mls shortName="collabLitElement" project="100554" enhancement="_blank" />

import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { CollabState } from './_100554_collabState';

const isTrace = false;
const state1 = new CollabState();

/**
 * Decorator to synchronize a property with a CollabState key.
 * @param customKey - The state key. Defaults to property key.
 */
export function collabState(customKey?: string): PropertyDecorator {
  return (proto: Object, propertyKey: string | symbol) => {
    const key = customKey || String(propertyKey);

    const { connectedCallback, disconnectedCallback } = proto as any;

    (proto as any).connectedCallback = function () {
      if (isTrace) console.log('connectedCallback, key=' + key);
      connectedCallback?.call(this);
      state1.subscribe(key, this);
      // const value = state1.getState(key);
      // this[propertyKey] = value !== undefined ? value : this[propertyKey];
    };

    (proto as any).disconnectedCallback = function () {
      if (isTrace) console.log('disconnectedCallback, key=' + key);
      disconnectedCallback?.call(this);
      state1.unsubscribe(key, this);
    };

    (proto as any).handleCollabStateChange = function (changedKey: string, value: any) {
      if (isTrace) console.log('handleCollabStateChange, key=' + key + ', value=', value);
      this[propertyKey] = value;
      this.requestUpdate(propertyKey as string, value);
      // if (changedKey === key && this[propertyKey] !== value) {
      //   this[propertyKey] = value;
      //   this.requestUpdate(propertyKey as string, value);
      // }
    };

    // Object.defineProperty(proto, propertyKey, {
    //   get() {
    //     const value = state1.getState(key);
    //     console.log('state get, key=' + key + ', value=', value);
    //     return value;
    //   },
    //   set(value: any) {
    //     console.log('state set, key=' + key + ', value=', value);
    //     state1.setState(key, value);
    //   },
    //   configurable: true,
    //   enumerable: true
    // });    
  };
}

/**
 * Class extending LitElement with CollabState functionality.
 */
export class CollabLitElement extends LitElement {

  @property({ type: Number }) globalVariation: number = window.globalVariation || 0;

  /**
   * Update shared state.
   * @param key - The state key to update.
   * @param value - The new state value.
   */
  setCollabState(key: string, value: any): void {
    state1.setState(key, value);
  }

  collabRequestUpdate() {
    super.requestUpdate()
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('globalVariation') && changedProperties.get('globalVariation') !== undefined) {
      this.requestUpdate();
    }
  }

  getMessageKey(messages: any): string {
    const keys = Object.keys(messages);
    if (!keys || keys.length < 1) throw new Error('Error Message not valid for international');
    const firstKey = keys[0];
    const lang = (document.documentElement.lang || '').toLowerCase();
    if (!lang) return firstKey;
    if (messages.hasOwnProperty(lang)) return lang;
    const similarLang = keys.find((key: string) => lang.substring(0, 2) === key);
    if (similarLang) return similarLang;
    return firstKey;
  }
}

