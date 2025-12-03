/// <mls shortName="icaLitElementBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { property } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import * as tps from '/_100554_/l2/icaTypes.js';

export abstract class IcaLitElementBase extends StateLitElement implements tps.IcaLitElementBaseMethods {

    abstract baseName: string;
    abstract getActionsTags(): tps.ActionTag[];

    public mySymbol: string = 'fa-column';
    public overlayRef: HTMLElement | undefined;
    public originalAttrs: any[] = [];

    @property({ type: String })
    public level: '1' | '2' | '3' | '4' | '5' | '6' | '7' | undefined;


    //--------COMPONENT-----------------

    connectedCallback(): void {
        super.connectedCallback();
        const attrs = this.getAttributes();
        attrs.forEach((atr) => {
            if (atr.name.startsWith('.')) return;
            this.setAttribute(atr.name, atr.value);
        })
    }

    createRenderRoot() {
        return this;
    }

    //--------IMPLEMENTS-------------

    private excludesProps = ['rendertype', 'level', 'style', 'id'];
    private getAttributes() {

        const language = (this.closest('html') as HTMLHtmlElement)?.lang || 'en';
        const attributes = [];
        const attributeNames = this.getAttributeNames();

        for (let attrName of attributeNames) {
            if (this.excludesProps.includes(attrName)) continue;

            let attrValue = this.getAttribute(attrName);
            if (attrName === 'idel') attrName = 'id';
            if (attrName === 'classel') attrName = 'class';

            if (attrValue !== null) {
                attributes.push({
                    name: attrName,
                    value: attrValue
                });

                this.originalAttrs.push({
                    name: attrName,
                    value: attrValue
                });
            }
        }

        const attrsByVariation = this.filterAttributes(attributes, language);
        return attrsByVariation;

    }

    private filterAttributes(attributes: { name: string, value: string }[], variation: string) {

        const variationSuffix = `-${variation.toLowerCase()}`; // -en
        const variationAttributes = attributes.filter(attr => attr.name.endsWith(variationSuffix));

        const nonVariationAttributes = attributes.filter(attr => {
            if (attr.name.includes('-') && attr.name.endsWith(variationSuffix)) return false;
            const split = attr.name.split('-');
            if (split.length > 1) split.pop();
            const attrBase = split.join('-');
            return !attributes.some(a => a.name.startsWith(attrBase) && a !== attr && variationAttributes.includes(a));
        });

        let aux = [...nonVariationAttributes, ...variationAttributes];
        aux.forEach(attr => {
            const split = attr.name.split('-');
            if (split.length > 0) {
                const language = split.pop();
                if (language === variation) attr.name = split.join('-');
            }
        });
        return aux;
    }


}


