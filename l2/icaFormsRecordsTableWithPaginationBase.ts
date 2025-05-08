/// <mls shortName="icaFormsRecordsTableWithPaginationBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsRecordsTableWithPaginationBase extends StateLitElement {

    abstract data: string | undefined;
abstract columns: string | undefined;
abstract selectedrow: string | undefined;
abstract filterable: string | undefined;
abstract sortable: string | undefined;
abstract pageable: string | undefined;


}
