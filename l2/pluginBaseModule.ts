/// <mls fileReference="_100554_/l2/pluginBaseModule.ts" enhancement="_100554_enhancementLit" />


import { property } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

export abstract class PluginBaseModule extends StateLitElement {

    @property() scope: 'detail' | 'dashboard' = 'dashboard';
    abstract render(): any;
    
}
