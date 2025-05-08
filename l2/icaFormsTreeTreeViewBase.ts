/// <mls shortName="icaFormsTreeTreeViewBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsTreeTreeViewBase extends StateLitElement {

    abstract data: string | undefined;
abstract selectednode: string | undefined;
abstract expandednodes: string | undefined;


}
