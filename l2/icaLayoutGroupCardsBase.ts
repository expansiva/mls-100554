/// <mls shortName="icaLayoutGroupCardsBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaLayoutGroupCardsBase extends StateLitElement {

    abstract cardsdata: string | undefined;
abstract layout: string | undefined;
abstract spacing: string | undefined;


}
