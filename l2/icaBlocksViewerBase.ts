/// <mls shortName="icaBlocksViewerBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaBlocksViewerBase extends StateLitElement {

    abstract config: string | undefined;
    abstract data: string | undefined;


}

export interface IConfig {
    recommendedWidget: "pdf" | "spreadsheet" | "document",
    page?: number,              // pdf only
    zoom?: number,              // pdf only
    activesheet?: string,       // spreadsheet only
    type?: "docx" | "pptx" | "pdf" | string,  // for document viewer fallback
    readonly?: boolean
}