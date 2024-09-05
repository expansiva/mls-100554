/// <mls shortName="wcdState" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import {WCDToolboxMethodos} from './_100554_wcdTypes';
import { IcaLitElementBaseMethods } from './_100554_icaTypes';

declare global {
    interface Window {
        wcdState: {
            myParent: WCDToolboxMethodos | undefined;
            elMain: HTMLElement | undefined;
            elICA: IcaLitElementBaseMethods | undefined;
        }
    }
}