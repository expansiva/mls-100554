/// <mls shortName="icaFormsRecordsGridBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsRecordsGridBase extends StateLitElement {

    abstract config: string | undefined;
    abstract selectedRows: string | undefined;
    abstract editedRows: string | undefined;


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