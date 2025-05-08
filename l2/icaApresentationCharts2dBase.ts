/// <mls shortName="icaApresentationCharts2dBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationCharts2dBase extends StateLitElement {

    abstract framework: string | undefined;
abstract data: string | undefined;
abstract renderer: string | undefined;


}
