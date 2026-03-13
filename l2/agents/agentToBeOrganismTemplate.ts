/// <mls fileReference="_100554_/l2/agents/agentToBeOrganismTemplate.ts" enhancement="_100554_/l2/enhancementAgent" />

// =============================================================================
// ORGANISM TEMPLATE — EXECUTION-SAFE CONTRACT
// =============================================================================
//
// This file defines how an Organism must be generated.
//
// CORE PRINCIPLES:
// - Organisms are UI-first components.
// - Organisms do NOT own business logic.
// - Organisms may read pageState ONLY after lifecycle hooks.
// - Organisms must NEVER access pageState during module evaluation
//   or field initialization (this causes circular dependency bugs).
// - Page controls data lifecycle; Organism reacts.
//
// =============================================================================

// LLM must replace fileReference to new organism name
// LLM must add clear and concise comments to improve code readability for humans.
// LLM must replace fileReference to new organism name 
// LLM must add clear and concise comments to improve code readability for humans. 
import {
    html,
    HTMLTemplateResult,
    classMap,
    ifDefined,
    repeat,
    until,
    choose,
    guard,
    keyed,
    live,
    ref
} from 'lit'; // import lit and all directives always from 'lit'

import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { getState, setState, subscribe, unsubscribe, initState } from '/_100554_/l2/collabState.js';

// getState(key: string): any ... 
// setState(key: string, value: any): void
// subscribe(keyOrKeys: string | string[], component: Object): void
// unsubscribe(keyOrKeys: string | string[], component: Object | "*"): void
// initState(path: string, value: string | Object | Array<unknown>): void

// IMPORTANT:
// - Organisms MAY import modules from the Page layer.
// - Organisms MUST NOT read, reference, or initialize values coming from the Page at class definition time.
// - This includes pageState, enums, constants, helpers, or any
//   executable export from the Page.
// - Access to Page exports is allowed ONLY after the component
//   lifecycle has started (connectedCallback or firstUpdated).
//
// WHY:
// - Page modules may not be fully evaluated yet.
// - Early access causes circular dependency and "undefined" errors.
// - Delayed access guarantees execution order safety.
// - Ex: import { pageState, enumX, fc1 } from '/_100554_/l2/{...}.js';

/**
 * =============================================================================
 * I18N SECTION - 
 * =============================================================================
 */

/// **collab_i18n_start**
const message_en = {
    loading: 'Loading...',
};
type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
    en: message_en,
    /// add more languagues if requested 
};
/// **collab_i18n_end**


/*
## Web Component tag rule
`kebab-case(folder)--kebab-case(component)-(project)`
*/
@customElement('agents--agent-to-be-organism-template-100554')
export class UserProfileOrganism extends StateLitElement {

    private msg: MessageType = messages.en;

    /**
     * =========================================================================
     * INPUT DATA (FROM PAGE)
     * =========================================================================
     * Organisms SHOULD receive business data via @property when possible.
     * Reading pageState is allowed, but delayed.
     */

    private user!: {
        name: string;
        consistency: string;
    };

    @property({ type: Boolean })
    loading = false;

    /**
     * =========================================================================
     * LOCAL UI STATE
     * =========================================================================
     * Visual-only state is allowed.
     */

    @state()
    private expanded = false;

    /**
     * =========================================================================
     * LIFECYCLE
     * =========================================================================
     *
     * RULES:
     * - pageState access is SAFE here.
     * - Never read pageState above this section.
     */

    private subs!: string[];


    firstUpdated(_changedProperties: Map<PropertyKey, unknown>): void {
        super.firstUpdated(_changedProperties);
        // SAFE ACCESS: pageState is guaranteed to be initialized at this point.
        void this.initSubscriptions();
    }

    disconnectedCallback(): void {
        // unsubscribe(this.subs, this);
        super.disconnectedCallback();
    }

    /**
     * Called by the Collab state system when subscribed keys change.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleIcaStateChange(_key?: string, _value?: any): void {
        // verify if key is a subscribe key, if not ignore
        // update local UI state only
        this.syncFromState(_key, _value);

    }

    private initSubscriptions() {

    /* subscribe(this.subs, this);
       this.subs = [ this.pageState.xxx];
       subscribe(this.subs, this);
    */
    
    }

    private syncFromState(_key?: string, _value?: any): void {
        // verify if key is a subscribe key, if not ignore
        // update local UI state only
    }

    /**
     * =========================================================================
     * RENDER
     * =========================================================================
     * Pure render only.
     */

    render(): HTMLTemplateResult {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (this.loading) {
            return html`<div>${this.msg.loading}</div>`;
        }

        return html`
            <section>
                <h3>${this.user?.name}</h3>

                <button @click=${this.handleToggle}>
                    Toggle
                </button>

                <button @click=${this.handleUpdateClick}>
                    Update User
                </button>
            </section>
        `;
    }

    /**
     * =========================================================================
     * UI INTENTS
     * =========================================================================
     * Express intent via state only.
     */

    private handleToggle() {
        this.expanded = !this.expanded;
    }

    private handleUpdateClick() {
        setState('ui.page1.user.events.update', {});
    }
}