/// <mls shortName="pluginBaseModule" project="100554" enhancement="_100554_enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';

export abstract class PluginBaseModule extends CollabLitElement {

    @property() scope: 'detail' | 'dashboard' = 'dashboard';

    abstract render(): any;

}
