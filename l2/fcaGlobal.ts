/// <mls shortName="fcaGlobal" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { FcaLitElementBase } from "./_100554_fcaLitElementBase";

// typescript new file

export interface IActionsToolbox {
    position: 'p-l1' | 'p-l2' | 'p-l3' | 'p-l4' | 'p-l5' | 'p-m1' | 'p-m2' | 'p-m3' | 'p-m4' | 'p-r1' | 'p-r2' | 'p-r3' | 'p-r4' | '',
    tp: 'menu' | 'button' | 'back-button' | 'action-size' | 'action-margin' | 'action-padding' | 'action-editQuill' | 'action-move',
    format: 'square' | 'circle' | '',
    title: string | undefined,
    iconSvg: string | undefined,
    onclick: Function | undefined,
    menuItens: IActionsToolboxMenu[],
    menuSubItens: IActionsToolboxMenu[],
}

export interface IActionsToolboxMenu {
    iconSvg: string,
    text: string,
    onclick: Function
}

export interface IActionLevels {
    '1': IActionsToolbox[],
    '2': IActionsToolbox[],
    '3': IActionsToolbox[],
    '4': IActionsToolbox[],
    '5': IActionsToolbox[],
    '6': IActionsToolbox[],
    '7': IActionsToolbox[],
}



export const updateSize = (elBase: HTMLElement, elChange: HTMLElement, changePosition: boolean) => {

    if (!elBase) return;
    setTimeout(() => {
        const display = elChange.style.display;
        elChange.style.display = 'none!important';

        const ad3 = (n1: number, s1: string, s2: string): number => n1 + parseInt(s1, 10) + parseInt(s2, 10);

        const { marginTop, marginBottom, marginLeft, marginRight, paddingTop, paddingBottom, paddingLeft, paddingRight } = window.getComputedStyle(elBase);

        let { width, height, y } = elBase.getBoundingClientRect();

        let left = 0;
        let top = 0;
        left -= parseInt(marginLeft, 10);
        top -= parseInt(marginTop, 10);
        if (top > 0) top = 0;

        width = Math.max(ad3(width, marginLeft, marginRight), ad3(0, paddingLeft, paddingRight));

        if (width > elBase.ownerDocument.body.clientWidth) width -= 20;

        height = Math.max(ad3(height, marginTop, marginBottom), ad3(0, paddingTop, paddingBottom));

        if (changePosition) {
            elChange.style.left = `${(left - 1) < 0 ? 0 : (left - 1)}px`;
            elChange.style.top = `${top - 1}px`;
        }

        elChange.style.width = `${width + 2}px`;
        elChange.style.height = `${height + 2}px`;
        elChange.style.display = display;

    }, 50);


}



export const updateBaseNoPadding = (el: HTMLElement, elBaseNoPadding: HTMLElement) => {

    const st = elBaseNoPadding.style;
    st.position = 'absolute';

    const { borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth, paddingTop, paddingBottom, paddingLeft, paddingRight } = window.getComputedStyle(el);

    let { width, height } = el.getBoundingClientRect();

    const cd = (v1: string, v2: string): string => {

        // ex: '1px' + '2px' = '3px'
        let rc = parseInt(v1, 10) + parseInt(v2, 10);
        if (rc < 0) rc = 0;
        return rc + 'px';

    };

    const ci = (v1: string, v2: string): number => {

        // ex: '1px' + '2px' = '3px'
        let rc = parseInt(v1, 10) + parseInt(v2, 10);
        if (rc < 0) rc = 0;
        return rc;

    };

    let cWidth = ci(paddingLeft, paddingRight);
    let cHeight = ci(paddingTop, paddingBottom);

    if (cWidth > 0 && cWidth < width) width = width - cWidth;
    if (cHeight > 0 && cHeight < height) height = height - cHeight;



    st.left = cd(paddingLeft, borderLeftWidth);
    st.bottom = cd(paddingBottom, borderBottomWidth);
    st.top = cd(paddingTop, borderTopWidth);
    st.right = cd(paddingRight, borderRightWidth);

    st.width = width + 'px';
    st.height = height + 'px';

}

export const convertUnits = (startValue: string, actualValue: string, delta: number, noNeg: boolean, noPorc: boolean, body: HTMLBodyElement, styleStart: CSSStyleDeclaration) => {

    const sv: number = parseInt(startValue, 10);
    if (Number.isNaN(sv)) {

        if (noNeg && delta <= 0) return '';
        return delta + 'px';

    }
    const px = sv + delta;

    // use styleStart to calc font pixels
    // units: px , em , %
    if (Number.isNaN(px) || (noNeg && px < 1)) return '';

    if (actualValue.endsWith('em')) {

        const fs = parseInt(styleStart.fontSize, 10);
        if (fs > 0) return (px / fs) + 'em';

    } else if (!noPorc && actualValue.endsWith('%')) {

        const fs = parseInt(styleStart.fontSize, 10);
        if (fs > 0) return Math.trunc((px / fs) * 100) + '%';

    } else if (actualValue.endsWith('rem')) {

        let fs = parseInt(window.getComputedStyle(body).fontSize, 10);
        if (fs < 1) fs = 16; // default font size for document
        return (px / fs) + 'rem';

    }
    return px + 'px';

}

export const getParentFCA = (el: HTMLElement): HTMLElement | undefined => {
    const parent = el.parentElement;
    if (!parent) return;

    const tag = parent.tagName.toLowerCase();

    if (!tag.startsWith('fca-')) {

        return getParentFCA(parent);

    }else if (tag.startsWith('fca-')) {

        return parent;

    }
}

export const updateHtmlTreeFCA = (el: FcaLitElementBase):void  => {

    el.updateMyInnerHtml(false);
    const parent = getParentFCA(el);
    if (!parent) return;
    updateHtmlTreeFCA(parent as FcaLitElementBase);
    
}

export const changeStateDrag = (elBase: FcaLitElementBase, tagMove: string) => {

    if (elBase.getAttribute('renderType') === 'editactive') return;

    const valid = fcValidChildren(elBase, tagMove);

    if (!valid.before && !valid.after && !valid.inside) return;

    const content = document.createElement('wcd-dragdrop-aux');

    content.style.position = 'absolute';
    content.style.display = 'flex';
    content.style.gap = '1rem';
    content.style.justifyContent = 'center';
    content.style.alignItems = 'center';
    content.style.background = '#0c66e461';

    const before = document.createElement('wcd-dragdrop-aux-before');
    const after = document.createElement('wcd-dragdrop-aux-after');
    const inn = document.createElement('wcd-dragdrop-aux-in');

    (before as any).elBase = elBase;
    (after as any).elBase = elBase;
    (inn as any).elBase = elBase;

    const cssItens = `width:18px; height:18px; border-radius:50%;box-shadow: 0 0 4px 1px rgba(57,76,96,.15), 0 0 0 1px rgba(43,59,74,.3); background:#fff; display:flex;justify-content:center; align-items: center `

    before.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>`;
    before.title = 'Before';
    before.style.cssText = cssItens;

    after.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`;
    after.title = 'after';
    after.style.cssText = cssItens;

    inn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M32 64C14.3 64 0 49.7 0 32S14.3 0 32 0l96 0c53 0 96 43 96 96l0 306.7 73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 402.7 160 96c0-17.7-14.3-32-32-32L32 64z"/></svg>`;
    inn.title = 'in';
    inn.style.cssText = cssItens;

    if(valid.before) content.appendChild(before);
    if(valid.after) content.appendChild(after);
    if(valid.inside) content.appendChild(inn);

    updateSize(elBase, content, true);

    elBase.appendChild(content);

}

const fcValidChildren = (elBase:FcaLitElementBase, tagMove: string): { before: boolean, after: boolean, inside: boolean } => {

    let before = false;
    let after = false;
    let inside = elBase.allowsChild(tagMove) && !elBase.myInnerHTML;

    const fatherFca = getParentFCA(elBase) as FcaLitElementBase;
    if (fatherFca) {

        const insideFather = fatherFca.allowsChild(tagMove);
        if (insideFather) {
            before = true;
            after = true;
        }
    
    } else {
        const el = document.createElement(tagMove) as FcaLitElementBase;
        if (el.allowAddBody) {
            before = true;
            after = true;
        }

    }

    return { before, after, inside }
    
}

export const changeStateDrop = (elBase: FcaLitElementBase, tagMove: string) => {

    
    if (elBase.getAttribute('renderType') === 'editactive') return;

    const content = elBase.querySelector(':scope > wcd-dragdrop-aux');
    if (!content) return;
    content.remove();   
    //updateHtmlTreeFCA(elBase); 
    

}
