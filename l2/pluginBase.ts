/// <mls fileReference="_100554_/l2/pluginBase.ts" group="other" enhancement="_100554_enhancementLit" />

import { html, LitElement, TemplateResult } from 'lit';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { customElement, property, state } from 'lit/decorators.js';


@customElement('plugin-base-100554')
export abstract class PluginBase extends CollabLitElement {

    @property ({ type: String }) scope: string = "";

    abstract description: string;

    abstract getSvg(): TemplateResult;

}