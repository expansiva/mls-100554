/// <mls shortName="icaBlocksViewerPdfViewerBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaBlocksViewerPdfViewerBase extends StateLitElement {

    abstract src: string | undefined;
abstract page: string | undefined;
abstract zoom: string | undefined;


}
