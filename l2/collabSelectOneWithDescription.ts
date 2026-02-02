/// <mls fileReference="_100554_/l2/collabSelectOneWithDescription.ts" enhancement="_blank" />

import { html } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { propertyDataSource, propertyCompositeDataSource } from '/_100554_/l2/collabDecorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { collab_bolt } from '/_100554_/l2/collabIcons.js';

export const initCollabSelectOneWithDescription = ''; 

/// **collab_i18n_start**
const message_pt = {
    defaultMsg: 'Passe o mouse sobre as opções para saber mais.',
}

const message_en = {
    defaultMsg: 'Hover over the options to learn more.',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('collab-select-one-with-description-100554')
export class CollabSelectOneWithDescription100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    @propertyDataSource({ type: String }) hint: string | undefined;
    @property({ type: Boolean }) required: boolean = false;
    @property({ type: Boolean }) disabled: boolean = false;
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    @propertyDataSource() options: IOptionItem[] | undefined;
    @propertyDataSource() selectedvalue: string | undefined;

    @query('.select_container') select_container: HTMLDivElement | undefined;
    @query('.select_toogle') select_toogle: HTMLDivElement | undefined;
    @query('.desc_container') desc_container: HTMLDivElement | undefined;
    @queryAll('ul > li') optionItems: HTMLElement[] | undefined;


    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        this.defaultMsg = this.msg.defaultMsg;

        return html`
            <div class="select_toogle" tabindex="1" @blur=${this.onBlur} @click=${this.onIconClick}>${collab_bolt}</div>
            <div tabindex="0" @blur=${this.onBlur} class="select_container">
                <ul>
                    ${this.renderOpt()}
                </ul>
                <div tabindex="0" @blur=${this.onBlur} class="desc_container">
                    ${this.defaultMsg}
                </div>
            </div>
   
    `;
    }

    firstUpdated() {
        this.onkeydown = (e) => {
            this.handleKeyDown(e)
        }
    }

    private defaultMsg = ''

    private currentIndex = -1;

    private onIconClick(e: MouseEvent) {
        e.stopPropagation();
        this.toogle();

    }


    private onBlur(e: MouseEvent) {
        if (this.select_container?.contains(e.relatedTarget as HTMLElement)) {
            e.preventDefault();
            return;
        }
        this.select_container?.classList.remove('open');
    }

    renderOpt() {
        if (this.options) {
            return html`
                ${this.options.map((opt: IOptionItem, index: number) => {
                return html`
                <li 
                    tabindex="0"  
                    @blur=${this.onBlur} 
                    @mouseover=${this.handleHover}
                    @mouseout=${this.handleOut}
                    @focus=${(ev: MouseEvent) => { this.handleFocus(ev, index) }}
                    @click=${() => { this.handleChange(opt.value) }}
                    .description=${opt.description}
                    .val=${opt.value}
                    >
                    ${opt.key}
                </li>`
            })}
        `;
        }
    }

    handleHover(ev: MouseEvent) {
        const target = ev.target as HTMLElement;
        if (!this.desc_container || !this.optionItems) return;
        this.desc_container.innerHTML = (target as any).description;
        this.optionItems.forEach((item) => item.classList.remove('hover'))
        target.classList.add('hover');
    }

    handleOut() {
        if (!this.desc_container) return;
        this.desc_container.innerHTML = this.defaultMsg;
    }

    handleFocus(ev: MouseEvent, index: number) {
        const target = ev.target as HTMLElement;
        this.currentIndex = index;
        if (!this.desc_container || !this.optionItems) return;
        this.desc_container.innerHTML = (target as any).description;
        this.optionItems.forEach((item) => item.classList.remove('hover'))
        target.classList.add('hover');
    }

    handleChange(value: string) {
        this.selectedvalue = value;
        this.dispatchEvent(new CustomEvent('select-change', {
            detail: value, bubbles: true, composed: true
        }));
        this.toogle();
    }

    handleKeyDown(event: KeyboardEvent) {
        event.preventDefault();
        switch (event.key) {
            case 'ArrowDown':
                if (this.optionItems && this.currentIndex < this.optionItems.length - 1) {
                    this.currentIndex++;
                    this.optionItems[this.currentIndex].focus();


                }
                break;
            case 'ArrowUp':
                if (this.optionItems && this.currentIndex > 0) {
                    this.currentIndex--;
                    this.optionItems[this.currentIndex].focus();
                }
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (this.optionItems && this.currentIndex > -1) {
                    const val = (this.optionItems[this.currentIndex] as any).val;
                    this.handleChange(val);
                }
                break;
        }
    }

    toogle() {
        if (!this.select_container || !this.optionItems) return;
        this.select_container.classList.toggle('open');
        if (this.select_container.classList.contains('open')) {
            this.calculatePopupPosition();
            if (this.optionItems[this.currentIndex]) this.optionItems[this.currentIndex].focus();
        }
    }

    calculatePopupPosition() {
        if (!this.select_toogle || !this.select_container) return;
        const selectBoxRect = this.select_toogle.getBoundingClientRect();
        const popupHeight = this.select_container.offsetHeight;
        const popupWidth = this.select_container.offsetWidth;

        this.select_container.style.left = '';
        this.select_container.style.top = '';
        this.select_container.style.bottom = '';

        const spaceBelow = window.innerHeight - selectBoxRect.bottom;
        const spaceRight = window.innerWidth - selectBoxRect.right;

        if (spaceBelow >= popupHeight) this.select_container.style.top = `${30}px`;
        else this.select_container.style.top = `-${popupHeight + 5}px`;

        if (spaceRight >= popupWidth) this.select_container.style.left = `${5}px`;
        else this.select_container.style.right = `${5}px`;
    }


}

export interface IOptionItem {
    key: string,
    value: string,
    description: string
}