/// <mls fileReference="_100554_/l2/collabTabSlider.ts" enhancement="_blank" />

import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';


@customElement('collab-tab-slider-100554')
export class PluginCreateProject extends StateLitElement {

    @property({ type: Number }) activeIndex = 0;
    @property({ type: Number }) animationTimer = 800;

    private previousIndex = -1;

    updated(changedProps: Map<string, any>) {

        if (changedProps.has('animationTimer')) {
            this.style.setProperty('--animation-timer', `${this.animationTimer}ms`);
        }
        if (changedProps.has('activeIndex')) {
            this.switchTab(this.activeIndex);
        }
    }

    private switchTab(index: number) {
        if (index === this.previousIndex) return;
        const goingRight = index > this.previousIndex;

        const children = Array.from(this.children) as HTMLElement[];
        const currentEl = children[this.previousIndex];
        const nextEl = children[index];
        if (!nextEl) return;

        nextEl.classList.remove('tab-exit-left', 'tab-exit-right', 'tab-active');
        nextEl.classList.add(goingRight ? 'tab-enter-right' : 'tab-enter-left');
        nextEl.getBoundingClientRect();

        if (currentEl) {
            currentEl.classList.add(goingRight ? 'tab-exit-left' : 'tab-exit-right');
            currentEl.classList.remove('tab-active');
        }

        nextEl.classList.add('tab-active');
        nextEl.classList.remove('tab-enter-left', 'tab-enter-right');

        setTimeout(() => {
            if (currentEl) currentEl.classList.remove('tab-exit-left', 'tab-exit-right');
        },  this.animationTimer);

        this.previousIndex = index;
    }

    render() {
        return html``;
    }

}