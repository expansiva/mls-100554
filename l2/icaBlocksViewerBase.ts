/// <mls shortName="icaBlocksViewerBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { ActionTag } from './_100554_icaTypes';

export abstract class IcaBlocksViewerBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract data: string | undefined;

    public baseName: string = 'IcaBlocksViewerBase';
    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" },
            { name: "size" },
            { name: "title" },
        ]
    }
}

export interface IConfig {
    recommendedWidget: "pdf" | "spreadsheet" | "document",
    page?: number,              // pdf only
    zoom?: number,              // pdf only
    activesheet?: string,       // spreadsheet only
    type?: "docx" | "pptx" | "pdf" | string,  // for document viewer fallback
    readonly?: boolean
}