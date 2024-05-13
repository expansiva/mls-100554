/// <mls shortName="icaDecorators" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { PropertyDeclaration } from 'lit';
import { property } from 'lit/decorators.js';
import { IcaState } from './_100554_icaState';

export const state1 = new IcaState();

/**
 * Custom decorator to bind properties to multiple data sources dynamically.
 * @param options - Property options including type and default value.
 */
export function propertyCompositeDataSource(options?: PropertyDeclaration) {

  return (proto: any, propName: PropertyKey): any => {
    // Define a Lit property with provided options.
    property(options)(proto, propName);
    const key = String(propName);

    Object.defineProperty(proto, propName, {
      get() {
        // Check if attribute contains template literals
        const attrValue = this.getAttributeValueWithVariation(key);
        if (attrValue && attrValue.includes('{{')) {
          return this.parseCompositeData(attrValue);
        }
        // Default to internal property value
        return attrValue;
      },
      set(value) {

        if (typeof value === 'string' && value.includes('{{')) {
          // Handle template literals for dynamic data binding
          this[`_${key}`] = this.parseCompositeData(value, true);
          if (!window.globalStateManagment) window.globalStateManagment = state1;

        } else {
          // Handle static values
          this[`_${key}`] = value;
        }
        this.requestUpdate();
      }
    });

    // Method to parse composite data from template literals
    proto.parseCompositeData = function (templateStr: string, add: boolean = false) {
      const pattern = /\{\{(.*?)\}\}/g;
      let match;
      let composedData = templateStr;

      while ((match = pattern.exec(templateStr))) {
        const stateKey = match[1].trim();
        if (add && this.hasOwnProperty('stateKeys')) this.stateKeys.add(key + ';' + stateKey);
        const resolvedValue = state1.getState(stateKey) || '';
        composedData = composedData.replace(match[0], resolvedValue);
      }
      return composedData;
    };

    proto.getAttributeValueWithVariation = function (key: string) {
      return getAttributeValueWithVariation(key, this);
    }

  };
}

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

        const attrValue = this.getAttributeValueWithVariation(key);
        if (attrValue && attrValue.includes('{{') && attrValue.includes('}}')) {
          const stateKey = attrValue.replace(/[{{}}]/g, '').trim();
          return state1.getState(stateKey);
        }
        // Default to internal property value
        if (typeof this[`_${key}`] === 'object' || Array.isArray(this[`_${key}`])) return this[`_${key}`];
        return attrValue;
      },
      set(value) {

        if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
          // initialization ex selectedvalue="{{globalState.users[0].sex}}"
          // dynamic data from json
          const stateKey = value.replace(/[{{}}]/g, '').trim();
          if (this.hasOwnProperty('stateKeys')) this.stateKeys.add(key + ';' + stateKey);
          this[`_${key}`] = state1.getState(stateKey);
          if (!window.globalStateManagment) window.globalStateManagment = state1;
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

    proto.getAttributeValueWithVariation = function (key: string) {
      return getAttributeValueWithVariation(key, this);
    }

  };
}

/**
 * Retrieves an attribute value based on the variation.
 * 
 * @param key - The key of the attribute.
 * @param proto - The prototype object containing the attribute.
 * @returns The value of the attribute, considering the variation, or the default value if no variation is found.
 */
function getAttributeValueWithVariation(key: string, proto: any) {

  const htmlLang = document.documentElement.lang;
  const lang = htmlLang.toLowerCase();

  const actualVariation = proto.globalVariation || 0;
  const languageByVariation = lang;
  const languageByVariationSimilar = languageByVariation.split('-')[0];
  
  const defaultValue = proto.getAttribute(key);
  if (actualVariation === 0) return defaultValue;
  const keyVariation = `${key}-${languageByVariation}`;
  const keyVariationSimilar = `${key}-${languageByVariationSimilar}`;
  let variationValue = proto.getAttribute(keyVariation);
  if(!variationValue) variationValue = proto.getAttribute(keyVariationSimilar);
  return variationValue || defaultValue;
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
