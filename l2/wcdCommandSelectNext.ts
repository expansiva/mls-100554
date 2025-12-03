/// <mls shortName="wcdCommandSelectNext" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IWCDCommand } from '/_100554_/l2/wcdTypes.js';

export async function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');

    const args: ISelectNext = param.args as any;
    if (!args?.position ||
        !['left', 'right', 'up', 'down'].includes(args.position)) throw new Error('invalid param.args.position');
    if (!args.positionMode ||
        !['visual', 'tree'].includes(args.positionMode)) throw new Error('invalid param.args.positionMode');

    if (args.positionMode === 'tree') {
        navigateTree(param.selectedIca, args.position, param.overlay.selectItem as any)
    } else {
        navigateVisual(param.selectedIca, args.position, param.overlay.selectItem as any)
    }    
}

function navigateVisual(el: HTMLElement,
    position: SelectDirection,
    selectItem: (ica: HTMLElement) => void)
{
    const allElements = getAllIcaElements(document, 9999);
    let target: HTMLElement | null = findVisual(el, position, allElements);
    if (!target) {
        // try again with childs
        switch (position) {
            case 'left':
                target = findVisual(el, 'leftchild', getAllIcaElements(el, 1));
                break;
            case 'right':
                target = findVisual(el, 'rightchild', getAllIcaElements(el, 1));
                break;
        }
    }
    if (target) {
        selectItem(target)
    }
}

function navigateTree(el: HTMLElement,
    position: SelectDirection,
    selectItem: (ica: HTMLElement) => void)
{
    let target: HTMLElement | null = null;
    switch (position) {
        case 'left':
            target = findSibling(el, -1);
            break;
        case 'right':
            target = findSibling(el, 1);
            break;
        case 'up':
            target = findParent(el);
            break;
        case 'down':
            target = findFirstChild(el);
            break;
    }
    if (target) {
        selectItem(target)
    }
}

function findSibling(el: HTMLElement, direction: number): HTMLElement | null {
    let sibling = direction === -1 ? el.previousElementSibling : el.nextElementSibling;

    while (sibling) {
        if (isValidComponent(sibling as HTMLElement)) {
            return sibling as HTMLElement;
        }
        sibling = direction === -1 ? sibling.previousElementSibling : sibling.nextElementSibling;
    }

    return null;
}

function findParent(el: HTMLElement): HTMLElement | null {
    let parent: HTMLElement | null = el.parentElement;
    if (!parent && el.getRootNode() instanceof ShadowRoot) {
        parent = (el.getRootNode() as ShadowRoot).host as HTMLElement;
    }
    while (parent) {
        if (isValidComponent(parent)) {
            return parent;
        }
        if (!parent.parentElement && parent.getRootNode() instanceof ShadowRoot) {
            parent = (parent.getRootNode() as ShadowRoot).host as HTMLElement;
        } else {
            parent = parent.parentElement;
        }
    }
    return null;
}

function findFirstChild(el: HTMLElement): HTMLElement | null {
    const allChilds = getAllIcaElements(el, 1);
    return allChilds.length > 0 ? allChilds[0] : null;
}

function isValidComponent(el: HTMLElement): boolean {
    return el.tagName.startsWith('ICA-');
}

function getAllIcaElements(root: Document | ShadowRoot | HTMLElement, deep: number): HTMLElement[] {
    let rc: HTMLElement[] = [];
    const els = Array.from(root
        .querySelectorAll<HTMLElement>('*'))
    rc = rc.concat(els.filter(element => element.tagName.toLowerCase().startsWith('ica-')));
    els.forEach(el => {
        if (el.shadowRoot && deep > 0) {
            rc = rc.concat(getAllIcaElements(el.shadowRoot, deep - 1)); // reentrance
        }
    })
    return rc;
}

function calculateDistance(target: DOMRect, centerX: number, centerY: number): number {
    const dx = centerX - (target.left + target.right) / 2;
    const dy = centerY - (target.top + target.bottom) / 2;
    return Math.sqrt(dx * dx + dy * dy);
}


function findVisual(el: HTMLElement, direction: SelectDirection | 'leftchild' | 'rightchild', allElements: HTMLElement[]): HTMLElement | null {
    const rect = el.getBoundingClientRect();
    const centerX = (rect.left + rect.right) / 2;
    const centerY = (rect.top + rect.bottom) / 2;
    let bestMatch: HTMLElement | null = null;
    let bestMatchDistance = Infinity;
    allElements.forEach(element => {
        if (element === el) return;
        const elementRect = element.getBoundingClientRect();
        let validTarget = false;

        switch (direction) {
            case 'left':
                validTarget = elementRect.right <= rect.left;
                break;
            case 'leftchild':
                validTarget = elementRect.right >= rect.right;
                break;
            case 'right':
                validTarget = elementRect.left >= rect.right;
                break;
            case 'rightchild':
                validTarget = elementRect.left <= rect.left;
                break;
            case 'up':
                validTarget = elementRect.bottom <= rect.top;
                break;
            case 'down':
                validTarget = elementRect.top >= rect.bottom;
                break;
        }
        if (validTarget) {
            const distance = calculateDistance(elementRect, centerX, centerY);
            if (distance < bestMatchDistance) {
                bestMatchDistance = distance;
                bestMatch = element;
            }
        }
    });
    return bestMatch;
}

type SelectDirection = 'left' | 'right' | 'up' | 'down';
interface ISelectNext{
    position: SelectDirection,
    positionMode: 'visual' | 'tree'

}