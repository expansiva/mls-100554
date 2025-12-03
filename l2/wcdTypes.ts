/// <mls shortName="wcdTypes" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import * as tps from '/_100554_/l2/icaTypes.js';

export interface WCDToolboxMethodos extends HTMLElement {
    lastHelper:string,
    //widget:string | undefined,
    level:string,
    //elMain: HTMLElement | undefined; // component from ica render
    elICA: tps.IcaLitElementBaseMethods | undefined; // ica base to wcd
    fcBeforeBackButton: Function | undefined;
    updateSize(elBase: HTMLElement, elChange: HTMLElement, changePosition: boolean): void;
    getAndSetScenaryOutDoor(op: string): Promise<HTMLElement | undefined>;
    backNavigationScenaryOutdoor(): void;
    setIconsWcdToolbox(act: tps.ActionTag[], useSelf: boolean, updataSize: 'false' | 'size' | 'padding'): void;
    updateBaseNoPadding(elBase: HTMLElement, elChange: HTMLElement): void;
    updateBackgroundAuxSize(tp: 'show' | 'hide'): void;
    setStyle(style: string):void;
}

export interface WCDToolboxItemMethodos extends HTMLElement {
    myParent: WCDToolboxMethodos | undefined;
    //elMain: HTMLElement | undefined;
    elICA: tps.IcaLitElementBaseMethods | undefined;
    args: string | undefined;
}

export interface WCDOverlayMethods extends HTMLElement {
    overlayItemTagName: string,
    listWidgetsBase: IListWidgetBase[]
    myKeyEvents: { [key: string]: Function }
    changeOverlayItemsLevel(): void
    createOverlayItems(): void;
    selectItem(ica: tps.IcaLitElementBaseMethods): void;
    getActionsTagsDefault(): { [key: string]: tps.ActionTag };
    refreshOverlay(): void;
    myItens: tps.IICADepths[]
    updateSizeOverlayItems(): void;
}

export interface IListWidgetBase{
    name:string
}

export interface WCDOverlayItensMethods extends HTMLElement {
    info: tps.IICADepths | undefined;
    //widget: string | undefined;
    level: string | undefined;
    boundingPage: DOMRect | undefined;
    overlay: WCDOverlayMethods | undefined;

}

export interface WCDPopupMethodos extends HTMLElement {
    myParent: WCDToolboxItemEditTextMethodos | undefined;
    changeType: (tp: string) => void;
}

export interface WCDToolboxItemEditTextMethodos extends HTMLElement {
    changeType: (tp: string) => void;
}

export interface IWCDCommand {
    overlay: WCDOverlayMethods,
    selectedIca: tps.IcaLitElementBaseMethods | undefined,
    args: Record<string, any>,
}