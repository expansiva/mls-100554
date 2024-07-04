/// <mls shortName="icaPageOverlayBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { IcaLitElementBase } from './_100554_icaLitElementBase';

export function getPosition(icaInfo: IICADepths, boundingPage: DOMRect) {

    const elBase = icaInfo.element;
    let { width, height } = icaInfo;
    const ad3 = (n1: number, s1: string, s2: string): number => n1 + parseInt(s1, 10) + parseInt(s2, 10);
    const { marginTop, marginBottom, marginLeft, marginRight, paddingTop, paddingBottom, paddingLeft, paddingRight } = window.getComputedStyle(elBase);

    let left = icaInfo.x;
    let top = icaInfo.y;
    left -= parseInt(marginLeft, 10);
    top -= parseInt(marginTop, 10);
    width = Math.max(ad3(width, marginLeft, marginRight), ad3(0, paddingLeft, paddingRight));

    if (width > elBase.ownerDocument.body.clientWidth) width -= 3;
    height = Math.max(ad3(height, marginTop, marginBottom), ad3(0, paddingTop, paddingBottom));

    return {
        left: `${left - boundingPage.left}px`,
        top: `${top - boundingPage.top}px`,
        width: `${width}px`,
        height: `${height}px`
    }
}

export interface IICADepths {
    element: IcaLitElementBase,
    depth: number,
    x: number,
    y: number,
    height: number,
    width: number,
    opacity: string,
}