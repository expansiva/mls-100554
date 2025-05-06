/// <mls shortName="icaNavigationLinksButtonBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationLinksButtonBase extends StateLitElement {

    abstract name: string | undefined;
    abstract label: string | undefined;
    abstract icon: string | undefined; 
    abstract disabled: boolean | undefined; 
    
}