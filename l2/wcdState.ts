/// <mls shortName="wcdState" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { WCDToolboxMethodos } from './_100554_wcdTypes';
import { IcaLitElementBaseMethods } from './_100554_icaTypes';

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
    elMain: HTMLElement | undefined;
    elICA: IcaLitElementBaseMethods | undefined;
} = {} as any;

Object.defineProperty(globalWcd, 'myParent', {
    get: function () {
        return (window as any).wcdState.myParent;
    },
    set: function (v: WCDToolboxMethodos | undefined) {
        (window as any).wcdState.myParent = v;
    }
});

Object.defineProperty(globalWcd, 'elMain', {
    get: function () {
        return (window as any).wcdState.elMain;
    },
    set: function (v: HTMLElement | undefined) {
        (window as any).wcdState.elMain = v;
    }
});

Object.defineProperty(globalWcd, 'elICA', {
    get: function () {
        return (window as any).wcdState.elICA;
    },
    set: function (v: IcaLitElementBaseMethods | undefined) {
        (window as any).wcdState.elICA = v;
    }
});

(window as any).wcdState = {};
