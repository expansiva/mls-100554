/// <mls shortName="icaLitElement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { state1 } from './_100554_icaDecorators';
import { CollabLitElement } from './_100554_collabLitElement';

export * from './_100554_icaDecorators';

const isTrace = false;

/**
 * Base class for all components that need to interact with the shared state.
 */
export abstract class IcaLitElement extends CollabLitElement {


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

