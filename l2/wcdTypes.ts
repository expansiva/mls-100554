/// <mls shortName="wcdTypes" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import * as tps from './_100554_icaTypes';

export interface WCDMethods extends HTMLElement {
    updateSize(elBase: HTMLElement, elChange: HTMLElement, changePosition: boolean): void;
    getAndSetScenaryOutDoor(op: string): Promise<HTMLElement | undefined>;
    backNavigationScenaryOutdoor(): void;
    setIconsWcdToolbox(act: tps.ActionTag[], useSelf: boolean, updataSize: 'false' | 'size' | 'padding'): void;
    updateBaseNoPadding(elBase: HTMLElement, elChange: HTMLElement): void;
    updateBackgroundAuxSize(tp: 'show' | 'hide'): void;
}

export interface WCDOverlayMethods extends HTMLElement {
    myKeyEvents: { [key: string]: Function }
    changeOverlayItemsLevel(): void
    createOverlayItems(): void;
    selectItem(ica: tps.IcaLitElementBaseMethods): void;
    getActionsTagsDefault(): { [key: string]: tps.ActionTag };
    myItens: tps.IICADepths[]
}