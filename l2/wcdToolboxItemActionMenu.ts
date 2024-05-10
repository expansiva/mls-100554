/// <mls shortName="wcdToolboxItemActionMenu" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { WCDToolbox } from './_100554_wcdToolbox';
import * as icaGlobal from './_100554_icaGlobal';

//version 4

export const getTemplate = (mode: string = '', position: string = ''): icaGlobal.IActionsToolbox => {

    let ret: icaGlobal.IActionsToolbox = templateActionMenu.menu as icaGlobal.IActionsToolbox;
    ret.menuItens = [];
    ret.menuSubItens = [];
    if (position !== '') ret.position = position as any;
    if (mode === '') {
        ret.menuItens.push(templateActionMenuSub.goToParents);
        ret.menuSubItens.push(templateActionMenuSub.goToFirstChild);
        ret.menuSubItens.push(templateActionMenuSub.removeMe);
    }
    return ret as icaGlobal.IActionsToolbox;

}

const templateActionMenu = {
    menu: {
        position: 'p-m1',
        tp: 'menu',
        format: '',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: '',
        cursor: 'pointer',
        attrs: undefined,
        isDblClick: false
    }
}

const templateActionMenuSub = {
    goToParents: {
        text: 'To Parent',
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3V320c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 53 43 96 96 96H352c53 0 96-43 96-96V352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V352z"/></svg>',
        onclick: (e: MouseEvent, wc: WCDToolbox) => {

            const goToParent = (el: HTMLElement) => {
                
                let parent = el.parentElement;
                if (!parent) parent = el.getRootNode() ? (el.getRootNode() as any).host : null;
                if (!parent) return;
                const tag = parent.tagName.toLowerCase();

                if (!tag.startsWith(`${icaGlobal.PREFIX}-`)) {

                    goToParent(parent);

                } else if (tag.startsWith(`${icaGlobal.PREFIX}-`)) {

                    parent.click();

                }

            }

            goToParent(wc.parentElement as HTMLElement);

        }

    },
    goToFirstChild: {
        text: 'To Child',
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M350 334.5c3.8 8.8 2 19-4.6 26l-136 144c-4.5 4.8-10.8 7.5-17.4 7.5s-12.9-2.7-17.4-7.5l-136-144c-6.6-7-8.4-17.2-4.6-26s12.5-14.5 22-14.5h88l0-192c0-17.7-14.3-32-32-32H32C14.3 96 0 81.7 0 64V32C0 14.3 14.3 0 32 0l80 0c70.7 0 128 57.3 128 128l0 192h88c9.6 0 18.2 5.7 22 14.5z"/></svg>',
        onclick: (e: MouseEvent, wc: WCDToolbox) => {

            const goToFirstChild = (father: HTMLElement, el: HTMLElement) => {
                if (el.children.length === 0) return;
                const findNextIca = (childrens: Element[]): HTMLElement => {
                    const child = childrens.find((item => item.tagName.toLowerCase().startsWith(`${icaGlobal.PREFIX}-`)));

                    if (!child) {
                        for (let ch of childrens) {
                            const arrChildren = (Array.from(ch.shadowRoot ? ch.shadowRoot.children : ch.children));
                            let next = findNextIca(arrChildren);
                            if (!next) continue;
                            return next;
                        }
                    }
                    return child as HTMLElement;
                };

                const arrChildren = (Array.from(el.shadowRoot ? el.shadowRoot.children : el.children));
                const nextIca = findNextIca(arrChildren);
                if (nextIca) {
                    nextIca.setAttribute('renderType', 'edit');
                    setTimeout(() => {
                        nextIca.click();
                    }, 100);
                }

            }

            goToFirstChild(wc.parentElement as HTMLElement, wc.parentElement as HTMLElement);

        }
    },
    removeMe: {
        text: 'Delete',
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>',
        onclick: (e: MouseEvent, wc: WCDToolbox) => {

            const goToParent = (el: HTMLElement) => {

                const parent = el.parentElement;
                if (!parent) return;
                const tag = parent.tagName.toLowerCase();

                if (!tag.startsWith(`${icaGlobal.PREFIX}-`)) {

                    goToParent(parent);

                } else if (tag.startsWith(`${icaGlobal.PREFIX}-`)) {

                    return parent;

                }

            }

            const parent = wc.parentElement as HTMLElement;
            const parentFCA = goToParent(parent);
            if (!parent || !parentFCA) {
                parent.remove();
            } else if (parent.children.length === 1 && parentFCA.children.length === 1) {
                parentFCA.remove();
            } else {
                parent.remove();
            }

        }
    },
}
