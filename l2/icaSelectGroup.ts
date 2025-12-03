/// <mls shortName="icaSelectGroup" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js'

import {
    getGroups
} from '/_100554_/l2/icaBaseDescription.js';

@customElement('ica-select-group-100554')
export class IcaSelectGroup extends CollabLitElement {

    private rootBread: string = '';

    @property({ type: Array }) actualGroups: string[] = [];

    @property({ type: Array }) actualBreadCrumb: string[] = [];

    @property({ type: String }) actualMode: IActualModeGroup = 'root';

    connectedCallback() {
        super.connectedCallback();
        this.rootBread = this.messages.selectICA;
        this.actualBreadCrumb = [this.rootBread];
    }

    _handleInternalAction() {
        const customEvent = new CustomEvent('selection-changed', {
            bubbles: true,
            composed: true,
            detail: {
                selection: this.actualBreadCrumb.slice(1, this.actualBreadCrumb.length)
             }
        });
        this.dispatchEvent(customEvent);
    }

    clear() {
        this.actualGroups = [];
        this.actualBreadCrumb = [this.rootBread = this.messages.selectICA];
        this.actualMode = 'root';
    }

    render() {
        return html` 
            ${this.renderBreadCrumb()}
            ${this.renderGroups()}        
        `
    }

    private renderGroups() {

        switch (this.actualMode) {
            case 'root':
                return this.renderGroupsRoot();
            case 'subgroup':
                return this.renderSubGroups();
            case 'finalgroup':
                return this.renderFinalGruops();
            default:
                return html``;
        }
    }

    private renderBreadCrumb() {
        return html`
            <div class="breadcrumb">
                ${this.actualBreadCrumb.map((breadItem, index) => {

            const isLast = index === this.actualBreadCrumb.length - 1;
            return html`
            ${isLast
                    ? html`
                    <span @click=${(e:MouseEvent) => this.onBreadClick(breadItem, e)}>
                        ${breadItem}${!isLast ? ' > ' : ''}
                    </span>`
                    : html`
                    <a href="#" @click=${(e:MouseEvent) => this.onBreadClick(breadItem, e)}>
                        ${breadItem}${!isLast ? ' > ' : ''}
                    </a>`
                }
            `
        })}
            </div>
        `
    }

    private renderGroupsRoot() {
        const groups = getGroups();
        return html`
        <div class="group-container">
            ${Object.keys(groups).map((group) => {
            return html`
            <div class="group-item" @click=${() => { this.onClickRootGroup(group) }}>
                <span class="group-title">${group}</span>
            </div>
        `
        })}
        </div>
        `
    }

    private renderSubGroups() {

        const [, rootSelected] = this.actualBreadCrumb;
        const groups = getGroups();
    
        return html`
        <div class="group-container">
            ${Object.keys(groups[rootSelected]).map((subGroup) => {
            return html`
            <div class="group-item" @click=${() => { this.onClickSubGroup(rootSelected, subGroup) }}>
                <span class="group-title">${subGroup}</span>
            </div>
        `
        })}
        </div>
        `
    }

    private renderFinalGruops() {
        const [, rootSelected, subGroupSelected] = this.actualBreadCrumb;
        const groups = getGroups();

        return html`
        <div class="group-container">
            ${groups[rootSelected][subGroupSelected].map((finalGroup) => {
        
            return html`
                <div class="group-item" @click=${() => { this.onClickFinalGroup(rootSelected, subGroupSelected, finalGroup) }}>
                    <span class="group-title">${finalGroup}</span>
                </div>
            `
        })}
        </div>
        `
    }

    private onClickRootGroup(rootGroup: string) {
        this.actualBreadCrumb = [this.rootBread, rootGroup];
        this.actualMode = 'subgroup';
        this.requestUpdate();
        this._handleInternalAction();
    }

    private onClickSubGroup(rootGroup: string, subGroup: string) {
        this.actualBreadCrumb = [this.rootBread, rootGroup, subGroup];
        this.actualMode = 'finalgroup';
        this.requestUpdate();
        this._handleInternalAction();
    }

    private onClickFinalGroup(rootGroup: string, subGroup: string, finalGroup: string) {
        this.actualBreadCrumb = [this.rootBread, rootGroup, subGroup, finalGroup];
        this.actualMode = 'empty';
        this.requestUpdate();
        this._handleInternalAction();
    }

    private onBreadClick(breadItem: string, e: MouseEvent) {
        e.preventDefault();
        const index = this.actualBreadCrumb.findIndex((item) => item === breadItem);
        if (index < 0) throw new Error('Invalid breadcrumb item');
        this.actualBreadCrumb = this.actualBreadCrumb.slice(0, index + 1);
        if (index === 0) this.actualMode = 'root';
        if (index === 1) this.actualMode = 'subgroup';
        if (index === 2) this.actualMode = 'finalgroup';
        this.requestUpdate();
        this._handleInternalAction();
    }

    messages = {
        "selectICA": "Select ICA",
    }

}

type IActualModeGroup = 'root' | 'subgroup' | 'finalgroup' | 'empty'

