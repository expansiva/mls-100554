/// <mls shortName="icaApresentationCharts3dBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationCharts3dBase extends StateLitElement {

    abstract framework: string | undefined;
abstract data: string | undefined;
abstract renderer: string | undefined;
abstract options3d: string | undefined;


}
