/// <mls shortName="icaSelectGroup" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
    getDescriptionsRootGroup,
    getDescriptionsFinalGroup,
    getDescriptionsSubGroup,
    getFormComponentsDescription,
} from './_100554_icaBaseDescription';
export function initIcaSelectGroup() {
    return true;
}
@customElement('ica-select-group-100554')
export class IcaSelectGroup extends LitElement {

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
        const groups = getDescriptionsRootGroup();
        return html`
        <div class="group-container">
            ${groups.map((group) => {
            const desc = getFormComponentsDescription(group, null, null);
            return html`
            <div class="group-item" @click=${() => { this.onClickRootGroup(group) }}>
                <span class="group-title">${group}</span>
                <span class="group-desc">${desc}</span>
            </div>
        `
        })}
        </div>
        `
    }

    private renderSubGroups() {

        const [, rootSelected] = this.actualBreadCrumb;
        const groups = getDescriptionsSubGroup(rootSelected);

        return html`
        <div class="group-container">
            ${groups.map((subGroup) => {
            const desc = getFormComponentsDescription(rootSelected, subGroup, null);
            return html`
            <div class="group-item" @click=${() => { this.onClickSubGroup(rootSelected, subGroup) }}>
                <span class="group-title">${subGroup}</span>
                <span class="group-desc">${desc}</span>
            </div>
        `
        })}
        </div>
        `
    }

    private renderFinalGruops() {
        const [, rootSelected, subGroupSelected] = this.actualBreadCrumb;
        const groups = getDescriptionsFinalGroup(rootSelected, subGroupSelected);
        return html`
        <div class="group-container">
            ${groups.map((finalGroup) => {
            const desc = getFormComponentsDescription(rootSelected, subGroupSelected, finalGroup);
            return html`
                <div class="group-item" @click=${() => { this.onClickFinalGroup(rootSelected, subGroupSelected, finalGroup) }}>
                    <span class="group-title">${finalGroup}</span>
                    <span class="group-desc">${desc}</span>
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

    static styles = css`
        :host{
            font-size: 16px;
        }
        .group-container{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
            grid-template-rows: max-content;
            gap: 1em;
            padding: 1em;
        }
        .group-item {
            cursor: pointer;
            width: 20em;
            background-color: rgb(243, 229, 245);
            box-shadow: rgba(55, 27, 61, 0.18) 7px 7px 2px 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            border-radius: 4px;
            padding: 1rem;
        }
        .group-title{
            font-weight:bold;
            text-transform: uppercase;
        }
        .group-desc{
            margin-top: .3rem;
        }
        .breadcrumb {
            padding: 1em;
        }
        .breadcrumb a{
            text-decoration:none;
        }
        .breadcrumb a:visited {
            color: #1890FF;
            text-decoration: inherit;
        }
    `;
}

type IActualModeGroup = 'root' | 'subgroup' | 'finalgroup' | 'empty'

