/// <mls shortName="collabPreviewL4" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { convertTagToFileName, convertFileNameToTag } from './_100554_utilsLit';
import { selectLevel, openService } from './_100554_libCommom';
import { initState } from './_100554_collabState';
import './_100554_collabL3EditText';

@customElement('collab-preview-l4-100554')
export class CollabPreviewL4 extends CollabLitElement {

    constructor() { 
        super(); 
        this.init();
    }

    //------VARIABLES---------

    private elOverlayHover: HTMLElement | undefined;
    private elOverlaySelected: HTMLElement | undefined;
    private elMenuOverlay: HTMLElement | undefined;

    //-----COMPONENT----------

    render() {
        return html``;
    }

    //-------PUBLIC-----------

    public setHover(elId: string, active: boolean) {
        this._setHover(elId, active);
    }

    public selectElement(elId: string) {
        this._selectElement(elId);
    }

    //------FUNCTIONS---------

    private init() {
        this.createOverlay();
        this.createOverlaySelected();
        this.setEventsMouse();
    }

    private setEventsMouse() {
        const allItens = Array.from(this.querySelectorAll('*[mls_origin]')).filter((el) => el.tagName.toLocaleLowerCase().indexOf('organism-') >= 0) as HTMLHtmlElement[];

        allItens.forEach((el) => {

            if (!el) return;
            el.onmouseover = () => this._setHover(el.id, true);
        });
    }

    private createOverlay() {

        if (this.elOverlayHover && this.elOverlayHover.isConnected) return;
        const div = document.createElement("collab-aux-overlay");
        div.style.outlineOffset = '-2px';
        div.style.zIndex = '99999';
        div.style.display = 'block';
        this.appendChild(div);
        this.elOverlayHover = div;

    }

    private createOverlaySelected() {

        if (this.elOverlaySelected && this.elOverlaySelected.isConnected) return;
        const div = document.createElement("collab-selected-overlay");
        div.style.outlineOffset = '-2px';
        div.style.display = 'block';
        div.onmouseover = () => {
            if (this.elOverlayHover) this.elOverlayHover.style.display = 'none';
        }

        const menu = document.createElement("div");
        menu.id = 'menu';
        menu.className = 'overlay-menu';
        menu.style.display = 'none';

        const edit = document.createElement("button");
        edit.title = 'Edit';
        edit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>`;

        edit.onclick = (e: MouseEvent) => this.editEl(e)

        menu.appendChild(edit);

        this.appendChild(div);
        this.appendChild(menu);
        this.elOverlaySelected = div;
        this.elMenuOverlay = menu;

    }

    private _setElement(el: HTMLElement) {

        const els = this.querySelectorAll('*[clb_mode="edit"]');
        els.forEach((e) => e.removeAttribute('clb_mode'));

        if (this.elOverlayHover) this.elOverlayHover.style.display = 'none';
        if (!this.elOverlaySelected) this.createOverlaySelected();
        if (!this.elOverlaySelected ) return;

        const rect = el.getBoundingClientRect();
        this.elOverlaySelected.style.display = 'block';
        this.elOverlaySelected.style.top = `${rect.top + window.document.body.scrollTop - 2}px`;
        this.elOverlaySelected.style.left = `${rect.left + window.document.body.scrollLeft - 2}px`;
        this.elOverlaySelected.style.width = `${rect.width + 4}px`;
        this.elOverlaySelected.style.height = `${rect.height + 4}px`;
        this.elOverlaySelected.style.setProperty("--id-name", `'${el.tagName.toLocaleLowerCase()}'`);
        (this.elOverlaySelected as any).el = el;

        if (this.elMenuOverlay) {
            this.elMenuOverlay.style.display = "flex";
            this.elMenuOverlay.style.top = (rect.top + window.document.body.scrollTop - 4) + "px"; // mais perto
            this.elMenuOverlay.style.left = (rect.left + + window.document.body.scrollLeft + 4) + "px";

        }
        
        el.setAttribute('clb_mode', 'edit');

        const param = {
            'position': 'right',
            'action': 'select',
            'id': el.id
        }
        mls.events.fire(4, 'L4EditEvents' as any, JSON.stringify(param));
    }

    private _setHover(elId: string, active: boolean) {

        if (!this.elOverlayHover) this.createOverlay();
        if (!this.elOverlayHover) return;

        const el = this.querySelector('#' + elId) as HTMLElement;
        this.elOverlayHover.style.display = 'none';

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
        this.elOverlayHover.style.top = `${rect.top + window.document.body.scrollTop}px`;
        this.elOverlayHover.style.left = `${rect.left + window.document.body.scrollLeft}px`;
        this.elOverlayHover.style.width = `${rect.width}px`;
        this.elOverlayHover.style.height = `${rect.height}px`;
        this.elOverlayHover.onclick = (e) => {
            e.stopPropagation();
            if (this.elOverlayHover) this.elOverlayHover.style.display = 'none';
            this._setElement(el);
        }

    }

    private _selectElement(elId: string) {
        const els = this.querySelectorAll('*[clb_mode="edit"]');
        els.forEach((e) => e.removeAttribute('clb_mode'));

        if (!this.elOverlaySelected) this.createOverlaySelected();
        if (!this.elOverlaySelected) return;

        const el = this.querySelector('#' + elId) as HTMLElement;
        if (!el) return;

        this._setElement(el);
    }

    private editEl(e: MouseEvent) {

        if (!this.elOverlaySelected || !(this.elOverlaySelected as any).el) return;
         const fileInfo = convertTagToFileName((this.elOverlaySelected as any).el.tagName.toLowerCase());
        if (!fileInfo) return;
        const { folder, project, shortName } = fileInfo;

        const param = {
            'position': 'right',
            'action': 'openL3',
            folder,
            project,
            shortName
        }
        mls.events.fire(4, 'L4EditEvents' as any, JSON.stringify(param));
    }


}