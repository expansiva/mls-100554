/// <mls shortName="wcdState" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { WCDToolboxMethodos, WCDToolboxItemMethodos, WCDOverlayMethods } from '/_100554_/l2/wcdTypes.js';
import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';

/*declare global {
    interface Window {
        wcdState: {
            myParent: WCDToolboxMethodos | undefined;
            elMain: HTMLElement | undefined;
            elICA: IcaLitElementBaseMethods | undefined;
        }
    }
}*/

export const globalWcd: {
    myParent: WCDToolboxMethodos | undefined;
    //elMain: HTMLElement | undefined;
    elICA: IcaLitElementBaseMethods | undefined;
    wcdItens: WCDToolboxItemMethodos[] | undefined;
    overlay: WCDOverlayMethods | undefined;
} = {} as any;

Object.defineProperty(globalWcd, 'myParent', {
    get: function () {
        return (window as any).wcdState.myParent;
    },
    set: function (v: WCDToolboxMethodos | undefined) {
        (window as any).wcdState.myParent = v;
    }
});

Object.defineProperty(globalWcd, 'overlay', {
    get: function () {
        return (window as any).wcdState.overlay;
    },
    set: function (v: WCDOverlayMethods | undefined) {
        (window as any).wcdState.overlay = v;
    }
});

/*Object.defineProperty(globalWcd, 'elMain', {
    get: function () {
        return (window as any).wcdState.elMain;
    },
    set: function (v: HTMLElement | undefined) {
        (window as any).wcdState.elMain = v;
    }
});*/

Object.defineProperty(globalWcd, 'elICA', {
    get: function () {
        return (window as any).wcdState.elICA;
    },
    set: function (v: IcaLitElementBaseMethods | undefined) {
        (window as any).wcdState.elICA = v;
    }
});

Object.defineProperty(globalWcd, 'wcdItens', {
    get: function () {
        return (window as any).wcdState.wcdItens;
    },
    set: function (v: WCDToolboxItemMethodos[] | undefined) {
        (window as any).wcdState.wcdItens = v;
    }
});

(window as any).wcdState = {};
