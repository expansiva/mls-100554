/// <mls shortName="pluginBaseModule" project="100554" enhancement="_100554_enhancementLit" />

import { property } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';

export abstract class PluginBaseModule extends IcaLitElement {

    @property() scope: 'detail' | 'dashboard' = 'dashboard';

    abstract render(): any;

}
