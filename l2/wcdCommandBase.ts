/// <mls shortName="wcdCommandBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { WcdOverlayLitBase } from './_100554_wcdOverlayLitBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

export interface IWCDCommand {
    overlay: WcdOverlayLitBase,
    selectedIca: IcaLitElementBase | undefined,
    args: {},
}

export function dispatchEventConciliate() {
    mls.events.fire([2], ['DOMSync'] as any);
}
