/// <mls shortName="icaLitElement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabLitElement } from './_100554_collabLitElement';
import { PropertyValueMap } from 'lit';
import { state1 } from './_100554_icaDecorators';
export * from './_100554_icaDecorators';

const isTrace = false;

/**
 * Base class for all components that need to interact with the shared state.
 */
export abstract class IcaLitElement extends CollabLitElement {

  // Controls the states associated with this object.
  // Once disconnected from the DOM, this web component will no longer receive notifications.
  // Paths can be modified dynamically during the web component's lifecycle. For example in attribute html:
  // name='{{globalStore.users.users[0].name}}'
  // ...
  // name='{{globalStore.users.users[1].name}}'
  stateKeys: Map<string, boolean> = new Map<string, boolean>();

  updateStateKeys(attributeName: string, paths: string[]): void {
    // example: 
    // attributeName = "label"
    // paths = ["user.name", "user.age"]
    // example of use in html: label="User {{user.name}} is {{user.age}} users old"
    if (!attributeName || !paths || paths.length === 0) {
      console.warn('Invalid state key update attempt', { attributeName, paths });
      return;
    }

    for (const key of this.stateKeys.keys()) {
      if (key.startsWith(`${attributeName}/`)) {
        this.stateKeys.delete(key);
        state1.unsubscribe([key], this);
      }
    }

    paths.forEach((path, index) => {
      const newItem = `${attributeName}/${index};${path}`;
      if (!this.stateKeys.has(newItem)) {
        this.stateKeys.set(newItem, false);
        this.subscribeToState(newItem);
      }
    });
  }  

  private subscribeToState(stateKey: string): void {
    if (!this.stateKeys.get(stateKey)) {
      state1.subscribe([stateKey], this);
      this.stateKeys.set(stateKey, true);
    }
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (isTrace) {
      console.info(`connectedCallback, subscribe fields: ${Array.from(this.stateKeys.keys())}`);
    }

    this.stateKeys.forEach((isSubscribed, stateKey) => {
      if (!isSubscribed) {
        this.subscribeToState(stateKey);
      }
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stateKeys.forEach((isSubscribed, stateKey) => {
      if (isSubscribed) state1.unsubscribe([stateKey], this);
      this.stateKeys.set(stateKey, false);
    });
  }

  firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    super.firstUpdated(_changedProperties);
    this.stateKeys.forEach((_isSubscribed, stateKey) => {
      const [, path] = stateKey.split(';');
      state1.notify(path);
    });
  }

  /**
   * Handle state changes from IcaState.
   * @param key - The state key that changed, ex: 'users[0].name'
   * @param value - The new value of the state.
   */
  handleIcaStateChange(key: string, value: any): void {
    const isEqual = (a: any, b: any) => a === b || (typeof a === 'object' && JSON.stringify(a) === JSON.stringify(b));
    const ob1: { [key: string]: any } = this;

    this.stateKeys.forEach((_isSubscribed, stateKey) => {
      let [propName, path] = stateKey.split(';');
      propName = propName.split('/')[0]; // ex: name/0 , name/1 for composite dynamic keys
      if (path !== key || !ob1.hasAttribute(propName)) return;
      const propValue: any = ob1[`_${propName}`];
      if (!isEqual(value, propValue)) {
        ob1[`_${propName}`] = value;
        this.requestUpdate();
      }
    });
  }

}

