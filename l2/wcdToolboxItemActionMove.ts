/// <mls shortName="wcdToolboxItemActionMove" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';

@customElement('wcd-toolbox-item-action-move-100554')
export class WCDToolboxItemActionMove extends WcdToolboxItemBase {

    public args: string | undefined;

    constructor() {
        super();
    }

    //-------COMPONENT---------------------

    updated(changedProperties: any) {
        super.updated(changedProperties);

    }

    render() {
        if (this.args === 'left') return this.renderLeft();
        if (this.args === 'below') return this.renderBelow();
        return this.renderButton();
        
    }

    renderButton() {
        this.title = "move";
        this.onclick = (e) => this.clickButton(e);
        this.classList.add('f-button');
        return html`<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4V224H109.3l9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4H224V402.7l-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4V288H402.7l-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4H288V109.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"/></svg>`;
    }

    renderLeft() {
        this.title = "move";
        this.style.left = '-30px';
        this.onclick = (e) => this.clickButton(e);
        return html`
            <svg xmlns="http://www.w3.org/2000/svg" style="width: 15px; height: 15px; background: #0099ff; padding: 3px; fill: white; border-radius: 50%;" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
        `
    }

    renderBelow() {
        this.title = "move";
        this.style.bottom = '-30px';
        this.onclick = (e) => this.clickButton(e);
        return html`
            <svg xmlns="http://www.w3.org/2000/svg" style="transform: rotate(90deg); width: 15px; height: 15px; background: #0099ff; padding: 3px; fill: white; border-radius: 50%;" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
        `
    }

    //---------IMPLEMENTATION-----------------

    private clickButton(e: MouseEvent) {

        e.stopPropagation();

        if (!this.myParent || !this.elICA) return;

        const s = this.checkSiblingsPosition(this.elICA);

        if (s === 'nosiblings') return;

        const p = s === 'left' ? 'p-l2' : 'p-m3';

        this.myParent.setIconsWcdToolbox(
            [
                {
                    name: 'backButton'
                },
                {
                    name: '_100554_wcdToolboxItemActionMove',
                    level: [2,3],
                    args: s,
                    position: p
                }
            ],
            false,
            'false'
        )


    }


    private checkSiblingsPosition(element: HTMLElement): 'nosiblings' | 'below' | 'left' {

        if (!element.parentElement) return 'nosiblings';

        const siblings = Array.from(element.parentElement.children).filter(el => el !== element);

        if (siblings.length === 0) return 'nosiblings';

        const elementRect = element.getBoundingClientRect();
        let hasHorizontalSibling = false;
        let hasVerticalSibling = false;

        for (const sibling of siblings) {
            const siblingRect = sibling.getBoundingClientRect();

            if (Math.abs(siblingRect.top - elementRect.top) < 5) {
                
                hasVerticalSibling = true;
            }
            if (Math.abs(siblingRect.left - elementRect.left) < 5) {
                hasHorizontalSibling = true;
            }
        }

        if (hasVerticalSibling) return 'below';
        if (hasHorizontalSibling) return 'left';

        return 'nosiblings';
    }

}