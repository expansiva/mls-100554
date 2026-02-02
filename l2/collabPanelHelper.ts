/// <mls fileReference="_100554_/l2/collabPanelHelper.ts" enhancement="_blank" />

import { html, css, LitElement, PropertyValueMap } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { collab_chevron_right, collab_chevron_left } from '/_100554_/l2/collabIcons.js';

@customElement('collab-panel-helper-100554')
export class CollabPanelHelper100554 extends LitElement {

    @property() plugin: string = '';

    @property() isHelperContainerOpen: boolean = false;

    @query('.container-open-helper') containerHelpers: HTMLDivElement | undefined;

    private async handleOpenHelperClick() {
        if (!this.containerHelpers) return;
        if (this.isHelperContainerOpen) {
            this.containerHelpers.classList.remove('open');
            this.isHelperContainerOpen = false;
        } else {
            this.containerHelpers.classList.add('open');
            this.isHelperContainerOpen = true;
        }
    }

    
    updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.updated(changedProperties)
        if (changedProperties.has('plugin')) {
            const plg = changedProperties.get('plugin');
            if (plg === this.plugin) return;
        }
    }

    render() {
        return html`<div class="container-open-helper">
                <div class="toogle" @click=${this.handleOpenHelperClick}> 
                    <i>${this.isHelperContainerOpen ? collab_chevron_right : collab_chevron_left}</i>
                </div>
                <div class="helper">
                    
                </div>
            </div>`;
    }

    static styles = css`
        .container-open-helper {
            height: 100%;
            position: absolute;
            top: 0;
            background: #f6f6f6;
            right: 0;
            width: 0;
            z-index: 9999;
            transition: width 0.5s ease;
        }
        .container-open-helper.open {
            width: 40%;
        }
        .container-open-helper.open .helper {
            opacity: 1;
            width: 100%;
            height: 100%;
        }
        .container-open-helper .helper {
            z-index: 0;
            opacity: 0;
            overflow: auto;
            font-size: 14px;
            width: 0;
            height: 0;
        }
        .container-open-helper .helper details[open] {
            margin-bottom: 1rem;
        }
        .container-open-helper .helper details summary {
            font-weight: bold;
            padding-left: 0.5rem;
        }
        .container-open-helper .helper details > div {
            margin-left: 1rem;
            margin-top: 1rem;
            border-bottom: 1px solid #cecece;
        }
        .container-open-helper .toogle {
            position: absolute;
            width: 30px;
            height: 80px;
            background: #f6f6f6;
            top: 50%;
            left: -30px;
            z-index: 9999;
            transform: translate(0%, -50%);
            border-top-left-radius: 5px;
            cursor: pointer;
            border-bottom-left-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
`;

}
