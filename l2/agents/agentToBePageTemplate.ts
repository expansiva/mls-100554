/// <mls fileReference="_100554_/l2/agents/agentToBePageTemplate.ts" enhancement="_100554_/l2/enhancementAgent" />

// LLM must replace fileReference to new page name
// LLM must add clear and concise comments to improve code readability for humans.

import { html, HTMLTemplateResult, when, repeat, classMap, styleMap, ifDefined } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { beInvoke, BeInvoke, readLocal, savelocal, generateId, pluginInvoke } from '/_100554_/l2/agents/collabAuraPageCommon.js';

import { getState, setState, subscribe, unsubscribe, initState } from '/_100554_/l2/collabState.js';
// getState(key: string): any ...
// setState(key: string, value: any): void
// subscribe(keyOrKeys: string | string[], component: Object): void
// unsubscribe(keyOrKeys: string | string[], component: Object | "*"): void
// initState(path: string, value: string | Object | Array<unknown>): void

// Import organisms and plugins used in render()
// LLM MUST add imports here when needed
import "/_100554_/l2/pluginExploreList.js";

/**
 * =============================================================================
 * I18N SECTION
 * =============================================================================
 */
/* LLM_REMOVE_START */
// LLM MAY EXTEND THIS
// LLM MUST use only the languages specified by the user
/* LLM_REMOVE_END */
/// **collab_i18n_start**
const message_pt = {
    loading: 'Carregando...',
}
const message_en = {
    loading: 'Loading...',
}
type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

/* LLM_REFERENCE_START */
/**
 * =============================================================================
 * EXPERIENCE MODEL — PAGE CONTEXT
 * =============================================================================
 *
 * -----------------------------------------------------------------------------
 * SUPPORTED CAPABILITIES
 * -----------------------------------------------------------------------------
 *
 * LLM must list capabilities
 *
 * -----------------------------------------------------------------------------
 * APPLIED RULES
 * -----------------------------------------------------------------------------
 *
 * LLM must list rules
 *
 */
/* LLM_REFERENCE_END */


/* LLM_REMOVE_START */
/** 
 * =============================================================================
 * PAGE COMPONENT
 * =============================================================================
 *
 * LLM MUST:
 *
 * - Rename class to semantic name
 * - Keep lifecycle structure
 * - Extend States enum
 *
 */
/* LLM_REMOVE_END */


/*
## Web Component tag rule
`kebab-case(folder)--kebab-case(component)-(project)` => ex: 'agents--agent-to-be-page-template-100554'
*/
@customElement('agents--agent-to-be-page-template-100554')
export class Page1 extends StateLitElement {

    /**
     * =========================================================================
     * CONFIGURATION
     * =========================================================================
     */

    private msg: MessageType = messages['en'];

    /* LLM_REMOVE_START */
    /**
     * Base namespace for all states of this page
     * LLM MUST keep consistency between this and States enum
     */
    /* LLM_REMOVE_END */
    private readonly STATE_BASE = "ui.page1";


    /* LLM_REMOVE_START */
    /**
     * =========================================================================
     * LIFECYCLE
     * =========================================================================
     */
    /* LLM_REMOVE_END */
    constructor() {
        super();
    }

    /**
     * Called when component first updated
     * This is the main initialization entrypoint
     */
    async firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {

        super.connectedCallback();

        await this.initState();

        await this.initListeners();

        await this.initData();

    }

    /**
     * Called when component is removed from DOM
     * Responsible for cleanup
     */
    async disconnectedCallback() {

        super.disconnectedCallback();

        await this.dispose();

    }


    /**
     * =========================================================================
     * INITIALIZATION
     * =========================================================================
     */

    /* LLM_REMOVE_START */
    /**
     * Initialize ALL states used by this page
     *
     * LLM MUST initialize every state defined in States enum
     */
    /* LLM_REMOVE_END */
    private async initState() {

        initState(this.STATE_BASE, {
            loading: false,
            name: '',
            error: '',
            updateUser: '',
            consistency: Consistency.empty
        });

    }


    /**
     * Subscribe to state changes
     * LLM_REMOVE_START
     * LLM MUST subscribe to relevant state transitions
     * LLM_REMOVE_END
     */
    private async initListeners() {

        subscribe(pageState.user.events.update, this.handleUpdateUser);

    }


    /**
     * Load initial data from backend
     * LLM_REMOVE_START
     * LLM MAY call backend routines here
     * LLM_REMOVE_END
     */
    private async initData() {

        // LLM must load initial data
        await this.loadUser();

    }

    /* LLM_REMOVE_START */
    /**
     * =========================================================================
     * DISPOSE
     * =========================================================================
     *
     * Cleanup all listeners and resources
     */
    /* LLM_REMOVE_END */
    public async dispose() {

        unsubscribe(pageState.user.events.update, this.handleUpdateUser);

    }

    /**
     * =========================================================================
     * STATE HANDLERS
     * =========================================================================
     *
     * Called when state changes
     * LLM_REMOVE_START
     * LLM MUST implement handlers when needed
     * LLM_REMOVE_END
     */

    private async handleUpdateUser() {

        const value = getState(pageState.user.events.update);

        // LLM MUST implement logic

    }

    /**
     * =========================================================================
     * UI HANDLERS
     * =========================================================================
     *
     * Called from user interactions
     *
     * Example:
     * - button clicks
     * - organism events
     */

    private async handleClickUpdateUser() {

        await this.createOrder();

    }


    /**
     * =========================================================================
     * RENDER
     * =========================================================================
     *
     * RULES:
     *
     * - MUST be pure
     * - MUST NOT call backend
     * - MUST NOT mutate state
     *
     * Only reads state and renders organisms/plugins
     */

    render(): HTMLTemplateResult {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        const loading = getState(pageState.ui.loading);

        if (loading)
            return html`<div>${this.msg.loading}</div>`;

        return html`

            <!--
                LLM MUST render organisms here

                Example:

                <user-list-organism-100554
                    .users=$ {getState(States.users)}
                >
                </user-list-organism-100554>

            -->

            <div>

                Page Template Ready

            </div>

        `;

    }


    /**
     * =============================================================================
     * BACKEND READS
     * =============================================================================
     * LLM_REMOVE_START
     * MODULE Scope
     * LLM MUST define read routines here
     *
     * Reads DO NOT change server state
     * LLM_REMOVE_END
     */

    async loadUser() {

        function updateStates(result: any) {
            // LLM MUST update state here
        }

        const userRequestId = generateId();
        setState(pageState.user.requestId, userRequestId);
        const params = { id: 123 };

        const local = await readLocal(routines.user.get, params);
        if (local) {
            setState(pageState.user.consistency, Consistency.stale);
            updateStates(local);
        } else {
            setState(pageState.user.consistency, Consistency.loading);
        }

        setState(pageState.ui.error, '');
        const result = await beInvoke(routines.user.get, userRequestId, params);
        if (!result.requestId) throw new Error("invalid return, no requestId");
        if (result.requestId !== userRequestId) return; // ignore
        await savelocal(routines.user.get, params, result);

        if (result.error) {
            setState(pageState.user.consistency, Consistency.error);
            setState(pageState.ui.error, result.error);
        } else {
            setState(pageState.user.consistency, Consistency.fresh);
            setState(pageState.ui.error, '');
            updateStates(result);
        }

    }

    /**
     * =============================================================================
     * BACKEND MUTATIONS
     * =============================================================================
     * LLM_REMOVE_START
     * MODULE Scope
     * LLM MUST define mutations here
     *
     * Mutations change server state
     * LLM_REMOVE_END
     */

    async createOrder() {

        setState(pageState.ui.loading, true);
        const orderRequestId = generateId();
        setState(pageState.order.requestId, orderRequestId);
        const params = {
            customerId: "123",
            name: "john"
        };

        function updateStates(result: any) {
            // LLM MUST update state here
        }

        const result = await beInvoke(routines.order.create, orderRequestId, params);

        setState(pageState.ui.loading, false);

        if (result.error) {
            setState(pageState.ui.error, result.error);
        } else {
            setState(pageState.ui.error, '');
            updateStates(result);
        }

    }

    /**
     * =============================================================================
     * PLUGINS INVOKE
     * =============================================================================
     * Ex:
     * const params = { phone: "123", message: "hello" };
     * const result = await pluginInvoke( "whatsapp.openConsultation", params);
     */

}

/**
 * =============================================================================
 * CONTRACTS
 * =============================================================================
 * LLM_REMOVE_START
 * LLM MUST define and export all contracts used by organisms rendered by this page.
 * These contracts define the interface between the page and its organisms.
 * Contracts include:
 * - organism props interfaces
 * - organism event interfaces
 * - data view models
 * LLM_REMOVE_END
 */
export enum Consistency { "empty", "stale", "fresh", "loading", "error" };

/**
 * =============================================================================
 * PAGE STATE — strongly typed state tree
 * =============================================================================
 *
 * Use this object instead of string literals.
 * Provides autocomplete and compile-time safety.
 */

export const pageState = {
    ui: {
        loading: "ui.page1.loading",
        error: "ui.page1.error"
    },
    user: {
        name: "ui.page1.name",
        consistency: "ui.page1.userConsistency",
        requestId: "ui.page1.userRequestId",

        events: {
            update: "ui.page1.updateUser"
        }
    },
    order: {
        consistency: "ui.page1.orderConsistency",
        requestId: "ui.page1.orderRequestId"
    }
} as const;

// page1 = name of this page, exemplo
export const routines = {
    order: {
        create: "page1.order.create"
    },
    user: {
        get: "page1.user.get"
    }
}

