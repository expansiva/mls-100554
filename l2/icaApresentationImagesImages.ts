/// <mls shortName="icaApresentationImagesImages" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from './_100554_icaTypes';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

@customElement('ica-apresentation-images-images-100554')
export abstract class IcaApresentationImagesImages extends IcaLitElementBase {

    public mySymbol = 'fa-image';

    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" , args:'{"itens":[{"item":"_100554_wcdMenuItemImage", "args":"normal"},{"item":"_100554_wcdMenuItemImage", "args":"center"},{"item":"_100554_wcdMenuItemImage", "args":"big"}]}'},
            { name: "size" },
            { name: "events" },
            { name: "title" },
        ]
    }

    

    public changeStateHtml(html: string): void {

    }

    public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand {
        if (cmd === 'move') return this.commandMove(scope, target);
        return { inside: false, before: false, after: false };
    }


    // ----------- IMPLEMENTATION ---------------

    private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand {

        return { inside: false, before: false, after: false }

    }

}