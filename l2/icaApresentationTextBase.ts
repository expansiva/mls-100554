/// <mls shortName="icaApresentationTextBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationTextBase extends IcaLitElementBase {

    abstract type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "blockquote" | "span" | undefined;
    abstract text: string | undefined;

    public baseName:string=  'IcaApresentationTextBase';
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
            { name: "edit", args: '{"tp":"edit", "attr":"text"}' },
            { name: "title" },
        ]

        return rc;

    }

    public mySymbol = 'fa-font';
    
}
