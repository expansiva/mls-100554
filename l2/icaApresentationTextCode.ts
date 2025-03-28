/// <mls shortName="icaApresentationTextCode" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement, property } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from './_100554_icaTypes';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

@customElement('ica-apresentation-text-code-100554')
export abstract class IcaApresentationTextCode extends IcaLitElementBase {

    @property({ type: String, reflect: true }) language = 'typescript';

    @property({ type: Array }) languages = [];

    @property({ type: String, reflect: true }) text = '';

    public mySymbol = 'fa-code';

    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "menu" },
            { name: "size" },
            { name: "edit-code" },
            { name: "title" },
            { name: "code-language" },
        ]
    }

    public setDefaultAttributes() {
		this.setAttribute('text', `const example = '123';`);
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