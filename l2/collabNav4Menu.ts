/// <mls shortName="collabNav4Menu" project="100554" enhancement="_100554_enhancementLit" />

import { html, unsafeHTML } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { collab_bars, collab_bell, collab_chevron_down, collab_xmark } from '/_100554_/l2/collabIcons.js';


interface TabItem { 
    text: string;
    icon?: string;
    allowClose?: boolean;  
}

@customElement('collab-nav4-menu-100554')
export class CollabNav4Menu extends StateLitElement {

    @property({ type: Number, reflect: true }) selectedIndex = 0;
    @property({ type: String, reflect: true }) mode: 'full' | 'onlyicon' | 'fixed' = 'full';
    @property() options: TabItem[] = [
        { text: 'Home', icon: collab_bars.strings[0].toString(), allowClose: true },
        { text: 'Config', icon: collab_bell.strings[0].toString(), allowClose: true },
        { text: 'Sair', icon: collab_bars.strings[0].toString(), allowClose: true },

    ];

    @state() private isDropdownOpen = false;

    private toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    private handleSelect(index: number) {
        this.selectedIndex = index;
        this.isDropdownOpen = false;
        this.dispatchEvent(
            new CustomEvent('tab-selected', {
                detail: { index },
                bubbles: true,
                composed: true,
            })
        );
    }

    private handleClose(e: Event, index: number) {
        e.stopPropagation();
        this.isDropdownOpen = false;
        if (!this.options) return;
        const closed = this.options.splice(index, 1);
        this.requestUpdate();
        this.dispatchEvent(
            new CustomEvent('tab-closed', {
                detail: { index, tab: closed[0] },
                bubbles: true,
                composed: true,
            })
        );
    }

    render() {
        return html`
			${this.renderNav()}
		`;
    }

    private renderNav() {
        return html`
		<nav class="collab-nav4-menu-100554-nav ${this.mode}">
        	<!-- Botão tipo "setinha do Chrome" -->
			<button class="dropdown-btn" @click=${this.toggleDropdown}>
				<span class="arrow">${collab_chevron_down}</span>
			</button>
			${this.options.map((tab, i) => {
            const isActive = i === this.selectedIndex;
            return html`
					<div
						class="collab-nav4-menu-100554-tab ${isActive ? 'active' : ''}"
						@click=${() => this.handleSelect(i)}
					>
						${tab.icon ? html`<span class="icon" .innerHTML=${tab.icon}></span>` : ''}
						${this.mode === 'full' || isActive ? html`<span class="text">${tab.text}</span>` : ''}
						${this.mode !== 'fixed' && tab.allowClose
                    ? html`
									<button class="close-btn" @click=${(e: Event) => this.handleClose(e, i)}>
										${collab_xmark}
									</button>
							  `
                    : ''}
					</div>
				`;
        })}

		
		</nav>

		${this.isDropdownOpen
                ? html`
					<div class="dropdown-menu">
                        <div class="dropdown-title">
                            <h3>Guias abertas</h3>
                        </div>
						${this.options.map(
                    (tab, i) => {
                        const isActive = i === this.selectedIndex;

                        return html`
								<div class="dropdown-item ${isActive ? 'selected' : ''}" @click=${() => this.handleSelect(i)}>
									${unsafeHTML(tab.icon || '')}
									${tab.text}
								</div>
							`
                    })}
					</div>
			  `
                : ''}
	`;
    }

}