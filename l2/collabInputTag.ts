/// <mls shortName="collabInputTag" project="100554" enhancement="_100554_enhancementLit" groupName="internal" />

import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

export function initCollabInputTag() {
    return true;
}
@customElement('collab-input-tag-100554')
export class CollabInputTag extends LitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property()
    tags: string[] = [];

    @query('#tag-input')
    input: HTMLInputElement | undefined

    allowDelete = false;

    get value() {
        return this.tags.join(',');
    }

    set value(val: string) {
        if (!val) {
            this.empty();
            return;
        }
        const arrTags = val.split(',');
        this.tags = arrTags;
    }

    public onValueChanged: Function | undefined;
    public addTag(tag: string) { return this._addTag(tag); }
    public deleteTag(index: number) { return this._deleteTag(index); }
    public empty() { return this._empty(); }

    private _addTag(tag: string) {

        if (!tag) return;
        tag = tag.toLowerCase();

        if (this.tags.indexOf(tag) === -1) {
            this.tags.push(tag);
            if (this.input) this.input.value = '';
            this.requestUpdate();
        } else {
            const element = this.shadowRoot?.querySelector('[data-index="' + this.tags.indexOf(tag) + '"]') as HTMLElement;
            element.classList.add('duplicate');
            setTimeout(() => {
                element.classList.remove('duplicate');
            }, 500);
        }

    }

    private _deleteTag(index: number) {
        const newTags: string[] = [];
        this.tags.forEach((tag, idx) => {
            if (idx !== index) {
                newTags.push(tag);
            }
        });
        this.tags = newTags;
        this.requestUpdate();
    }

    private _empty() {
        this.tags = [];
        this.requestUpdate();
    }

    private onInputKeyDown(event: KeyboardEvent) {
    
    
        if (!this.input) return;
        const { value } = this.input;
        if (event.keyCode === 13) {
            this._addTag(value);
            if (this.onValueChanged) this.onValueChanged(this.value);
        } else if (event.keyCode === 188) {
            event.preventDefault();
            this._addTag(value);
            if (this.onValueChanged) this.onValueChanged(this.value);
        } else if (event.keyCode === 8 && value.length === 0) {
            if (this.allowDelete) {
                this._deleteTag(this.tags.length - 1);
                if (this.onValueChanged) this.onValueChanged(this.value);
                this.allowDelete = false;
            } else {
                this.allowDelete = true;
            }
        }

    }

    render() {
        return html
            `<div class="collab-tag-input">
                <input id="tag-input" @keydown=${(ev: KeyboardEvent) => { this.onInputKeyDown(ev) }}></input>
                ${this.tags.map((tag: string, index: number) => {
                    return html`
                        <div data-index=${index} class="tag">
                            <div class="remove">x</div>
                            ${tag}
                        </div>
                    `
                })}
        </div>`;
    }
}
