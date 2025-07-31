/// <mls shortName="collabL3PreviewText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { propertyDataSource } from './_100554_collabDecorators';

@customElement('collab-l3-preview-text-100554')
export class CollabL3PreviewText extends StateLitElement {

    @property() findby: string = '';
    @propertyDataSource({ type: String }) value: string | undefined;

    render() {
        this.onclick = this.handleClick.bind(this);
        this.onblur = this.handleChange.bind(this);
        this.setAttribute('contenteditable', 'true');
        return html`${this.value}`;
    }

    handleChange(event: Event) {
        this.value = this.innerText;
    }

    handleClick(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        this.onSelect();
        this.fireEvent();    
    }

    private timeFireEvent = 0;
    private fireEvent() {
        clearTimeout(this.timeFireEvent);
        this.timeFireEvent = setTimeout(() => {
            const el = this.closest('[id]') as HTMLElement;
            if (!el) return;
            const param = {
                'position': 'right',
                'action': 'select',
                'id': el.id
            }
            mls.events.fire(3, 'L3EditEvents' as any, JSON.stringify(param));
        }, 500);

    }

    private onSelect() {
        const elActive = document.querySelector('*[clb_mode]') as HTMLElement;
        if (elActive && elActive.id === this.findby) return;

        const el = document.querySelector('#'+this.findby) as HTMLElement;
        if(el) el.setAttribute('clb_mode', 'edit');
        if(elActive) elActive.removeAttribute('clb_mode')
        
    }

}