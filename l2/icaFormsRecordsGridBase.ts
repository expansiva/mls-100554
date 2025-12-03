/// <mls shortName="icaFormsRecordsGridBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaFormsRecordsGridBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract selectedRows: string | undefined;
    abstract editedRows: string | undefined;

    public baseName: string = 'IcaFormsRecordsGridBase';
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

    table: string,                 // DB ou endpoint
    range?: { start: number, end: number },
    recommendedWidget: "readonly" | "editable" | "grouping" | "pivot" | "tree" | "virtual-scroll",
    columns: {
        field: string,
        header?: string,
        width?: string,
        resizable?: boolean,
        sortable?: boolean,
        filterable?: boolean,
        editable?: boolean,
        expandable?: boolean         // tree grid
    }[],
    pageable?: boolean,
    pageSize?: number,
    rowHeight?: number,
    selection?: "single" | "multi",
    aggregation?: "sum" | "avg" | string

}