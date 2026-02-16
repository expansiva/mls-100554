/// <mls fileReference="_100554_/l2/agents/agentToBePageTemplate.test.ts" enhancement="_blank" />

import { ICANTest, ICANIntegration, ICANSchema } from '/_100554_/l2/tsTestAST.js';

import { Consistency, pageState, routines, Page1 } from '/_100554_/l2/agents/agentToBePageTemplate.js'; // LLM must replace to page to be tested

import { getState, setState, subscribe, unsubscribe, initState } from '/_100554_/l2/collabState.js';

export const tests: ICANTest[] = [];

/**
 * =============================================================================
 * TEST HARNESS + ICANTest Integration — Collab.codes
 * =============================================================================
 *
 * This file serves two purposes:
 *
 * 1. Development preview (mock backend + mount page)
 * 2. Automated tests using ICANTest
 *
 * =============================================================================
 */

/**
 * =============================================================================
 * MOCK BACKEND
 * =============================================================================
 *
 * LLM MUST implement routines required by the Page.
 */

(globalThis as any).__BE_DRIVER__ = {

    async invoke(routine: string, params: any, requestId: string) {

        await delay(100);

        /**
         * LLM MUST implement mocks here.
         *
         * Example:
         *
         * if (routine === routines.user.get) {
         *   return {
         *     requestId,
         *     entity: createMockEntity(params)
         *   };
         * }
         */

        return {
            requestId,
            error: "Mock not implemented: " + routine
        };

    }

};


/**
 * =============================================================================
 * MOCK LOCAL CACHE
 * =============================================================================
 */

(globalThis as any).__BE_LOCAL_CACHE__ = new Map();


/**
 * =============================================================================
 * PAGE MOUNT (Development Preview)
 * =============================================================================
 */

function mountPage() {

    document.body.innerHTML = "";

    const element = document.createElement(
        "[page-tag-name]"
    );

    document.body.appendChild(element);

    /**
     * LLM MUST initialize required state
     *
     * Example:
     *
     * setState(pageState.user.name, "john");
     */

}


/**
 * =============================================================================
 * ICANTest — PAGE LOAD TEST
 * =============================================================================
 *
 * Validates that the page loads and state is initialized.
 */

const icanTest1: ICANTest = {
    functionName: "test1",
    params: [{ "id": 123 }]
}
tests.push(icanTest1);
async function test1(id: number) { // LLM must change test1
    mountPage();

    await delay(300);

    /**
     * LLM MUST validate expected state.
     *
     * Example:
     *
     * const entity = getState(pageState.user.name);
     *
     * if (!entity)
     *   throw new Error("Entity not loaded");
     */

}

/**
 * =============================================================================
 * ICANTest — BACKEND INTEGRATION TEST
 * =============================================================================
 *
 * Validates SWR and backend flow.
 */

const icanTest2: ICANTest = {
    functionName: "test2",
    params: [{ "id": 123 }]
}
tests.push(icanTest2);
async function test2(id: number) {

    mountPage();

    await delay(500);

    /**
     * LLM MUST validate consistency state.
     *
     * Example:
     *
     * const consistency =  getState(pageState.user.consistency); 
     *
     * if (consistency !== Consistency.fresh)
     *   throw new Error("Data not fresh");
     */

}


/**
 * =============================================================================
 * MOCK DATA FACTORIES
 * =============================================================================
 *
 * LLM SHOULD generate based on Page CONTRACTS
 */

function createMockEntity(params: any) {

    return {

        id: params.id,

        name: "Example Entity"

    };

}


/**
 * =============================================================================
 * HELPERS
 * =============================================================================
 */

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
