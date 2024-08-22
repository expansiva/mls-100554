/// <mls shortName="icaApresentationEmbedsSocialMedia" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { ActionTag } from './_100554_icaGlobal';
import { IcaLitElementBase, IAllowCommand } from './_100554_icaLitElementBase';

@customElement('ica-apresentation-embeds-social-media-100554')
export abstract class IcaApresentationEmbedsSocialMedia100554 extends IcaLitElementBase {
    
    public getActionsTags(): ActionTag[] {

        let rc: ActionTag[] = [
            { name: "margin" },
            { name: "size" },
            { name: "title" },
        ]

        return rc;
    }

    public changeStateHtml(html: string): void {

    }

    public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand {
        return { inside: false, before: false, after: false };
    }

    private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand {
        return { inside: false, before: false, after: false };
    }
}
