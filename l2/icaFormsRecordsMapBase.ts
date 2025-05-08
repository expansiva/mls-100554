/// <mls shortName="icaFormsRecordsMapBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsRecordsMapBase extends StateLitElement {

    abstract latitude: string | undefined;
abstract longitude: string | undefined;
abstract zoom: string | undefined;
abstract markers: string | undefined;
abstract maptype: string | undefined;


}
