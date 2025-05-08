/// <mls shortName="icaNavigationLinksBreadcrumbsBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationLinksBreadcrumbsBase extends StateLitElement {

    abstract items: string | undefined;
abstract separator: string | undefined;


}
