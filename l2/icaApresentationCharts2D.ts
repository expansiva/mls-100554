/// <mls shortName="icaApresentationCharts2D" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


import { customElement } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from './_100554_icaTypes';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

@customElement('ica-apresentation-charts2-d-100554')
export abstract class IcaApresentationCharts2D extends IcaLitElementBase {
    
    public getActionsTags(): ActionTag[] {

        let rc: ActionTag[] = [
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
