/// <mls shortName="fcaPage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["wcd-toolbox-100554"]
 * }
 */ 

import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FcaLitElementBase, IAllowCommand } from './_100554_fcaLitElementBase';
import { IActionLevels } from './_100554_fcaGlobal';

@customElement('fca-page-100554')
export class FcaPage extends FcaLitElementBase { 


    // -------------- ABSTRACT ------------------

    public actions: IActionLevels = {'1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': []}

    public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand{
        return { inside: true, before: false, after: false };        
    }

    public renderPreview = (param: string): any => {
        return html``;
    }

    public renderEditActive = (param: string): any => {
        return html``;
    }

    public changeStateHtml(html: string): void {

    }

    public changeStateStyle(style: {}): void {

    }

    // ----------- IMPLEMENTATION ---------------



}
