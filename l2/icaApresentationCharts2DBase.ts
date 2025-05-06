/// <mls shortName="icaApresentationCharts2DBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationCharts2DBase extends StateLitElement {

	abstract framework: string | undefined;
	abstract data: string | undefined;
	abstract renderer: string | undefined;
	abstract chartTitle: string | undefined;

}
