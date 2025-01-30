/// <mls shortName="icaApresentationTextText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement, property } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from './_100554_icaTypes';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

@customElement('ica-apresentation-text-text-100554')
export abstract class IcaApresentationTextText extends IcaLitElementBase {

    @property({ type: String }) type: string | undefined;

    public mySymbol = 'fa-t';

    public getActionsTags(): ActionTag[] {

        let isBlankLine = !this.getAttribute('text');
        if (isBlankLine) {

            let auxEdt = '{"tp":"edit", "attr":"text"}';
            let auxAdd = '';
            const addOpen = this.getAttribute('addOpen');
            this.removeAttribute('addOpen');
            if (addOpen) {
                auxAdd = '{"open":true, "buttons" : "image,unsplash,video,embed,code,part"}';
                auxEdt = '{"tp":"click", "attr":"text"}';
            }

            return [
                { name: "add", args: auxAdd },
                { name: "edit", args: auxEdt, position: 'p-l2' },
                { name: "backButton" }
            ];
        }

        let rc: ActionTag[] = [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" },
            { name: "size" },
            { name: "events" },
            { name: "edit", args: '{"tp":"edit", "attr":"text"}' },
            { name: "title" },
        ]

        return rc;

    }

    public setDefaultAttributes() {
		this.setAttribute('text', `Write your text here.`);
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