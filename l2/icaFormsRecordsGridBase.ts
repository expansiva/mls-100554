/// <mls shortName="icaFormsRecordsGridBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsRecordsGridBase extends StateLitElement {

    abstract config: string | undefined;
abstract selectedRows: string | undefined;
abstract editedRows: string | undefined;


}
