/// <mls shortName="pluginBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, TemplateResult } from 'lit';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { customElement, property, state } from 'lit/decorators.js';


@customElement('plugin-base-100554')
export abstract class PluginBase extends CollabLitElement {

    @property ({ type: String }) scope: string = "";

    abstract description: string;

    abstract getSvg(): TemplateResult;

}