/// <mls shortName="collabPreviewL3" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { initState } from './_100554_collabState';
import './_100554_collabL3EditText';

@customElement('collab-preview-l3-100554')
export class CollabPreviewL3 extends CollabLitElement {

    constructor() {
        super();
        this.init();
    }

    //------VARIABLES---------

    private elOverlayHover: HTMLElement | undefined;
    private elOverlaySelected: HTMLElement | undefined;

    //-------PUBLIC-----------

    public setHover(el: HTMLElement | undefined, active:boolean) {
        this._setHover(el, active);
    }

    public selectElement(el: HTMLElement) {
        this._selectElement(el);
    }

    //-----COMPONENT----------

    render() {
        return html``;
    }

    //------FUNCTIONS---------

    private init() {
        this.createOverlay();
        this.createOverlaySelected();
        this.addEdit();
        this.setEventsMouse();
    }

    private setEventsMouse() {
        
        this.onmouseleave = () => { if (this.elOverlayHover) this.elOverlayHover.style.display = 'none' };

    }

    private createOverlay() {

        if (this.elOverlayHover && this.elOverlayHover.isConnected) return;
        const div = document.createElement("collab-aux-overlay");
        div.style.outlineOffset = '-2px';
        div.style.zIndex = '99999';
        div.style.display = 'none';
        this.appendChild(div);
        this.elOverlayHover = div;

    }

    private createOverlaySelected() {

        if (this.elOverlaySelected && this.elOverlaySelected.isConnected) return;
        const div = document.createElement("collab-selected-overlay");
        div.style.outlineOffset = '-2px';
        div.style.display = 'none';
        this.appendChild(div);
        this.elOverlaySelected = div;

    }

    private _setHover(el: HTMLElement | undefined, active: boolean) {

        if (!this.elOverlayHover) this.createOverlay();
        if (!this.elOverlayHover) return;

        if (!el) {

            if (!active) {
                this.elOverlayHover.style.display = 'none';
            }

            return
        }

        if (el.hasAttribute('clb_mode')) {
            this.elOverlayHover.style.display = 'none';
            return;
        }

        if (!active) {
            this.elOverlayHover.style.display = 'none';
            return;
        }

        const rect = el.getBoundingClientRect();
        this.elOverlayHover.style.display = 'block';
        this.elOverlayHover.style.top = `${rect.top + window.scrollY}px`;
        this.elOverlayHover.style.left = `${rect.left + window.scrollX}px`;
        this.elOverlayHover.style.width = `${rect.width}px`;
        this.elOverlayHover.style.height = `${rect.height}px`;
    }

    private _selectElement(el: HTMLElement) {
        const els = this.querySelectorAll('*[clb_mode="edit"]');
        els.forEach((e) => e.removeAttribute('clb_mode'));

        if (!this.elOverlaySelected) this.createOverlaySelected();
        if (!this.elOverlaySelected) return;

        if (this.elOverlayHover) this.elOverlayHover.style.display = 'none';

        const rect = el.getBoundingClientRect();
        this.elOverlaySelected.style.display = 'block';
        this.elOverlaySelected.style.top = `${rect.top + window.scrollY}px`;
        this.elOverlaySelected.style.left = `${rect.left + window.scrollX}px`;
        this.elOverlaySelected.style.width = `${rect.width }px`;
        this.elOverlaySelected.style.height = `${rect.height}px`;
        this.elOverlaySelected.style.setProperty("--id-name", `'${el.id}'`);
        
        el.setAttribute('clb_mode', 'edit');
    }

    private addEdit() {
        
    }
    
}