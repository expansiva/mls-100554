/// <mls shortName="icaApresentationCharts2DBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElement } from './_100554_icaLitElement';

export abstract class IcaApresentationCharts2DBase extends IcaLitElement {

	abstract framework: string | undefined;
	abstract datasource: string | undefined;
	abstract renderer: string | undefined;
	abstract chartTitle: string | undefined;

}
