/// <mls shortName="icaApresentationVideoEmbeddedVideo" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from './_100554_icaTypes';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

@customElement('ica-apresentation-video-embedded-video-100554')
export abstract class IcaApresentationVideoEmbeddedVideo extends IcaLitElementBase {

    public mySymbol = 'fa-video';

    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "size" },
            { name: "events" },
            { name: "title" },
        ]
    }


    public changeStateHtml(html: string): void {

    }

    public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand {
        return { inside: false, before: false, after: false };
    }

}