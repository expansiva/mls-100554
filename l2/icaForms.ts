/// <mls shortName="icaForms" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { LitElement } from 'lit';


export  abstract class IcaForms extends LitElement {

    abstract widget: string | undefined; // The widget selected in this group/subgroup"

}
