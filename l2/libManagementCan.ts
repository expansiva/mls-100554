/// <mls shortName="libManagementCan" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaState, GlobalState } from './_100554_icaState';

const watchedStates = new Map<string, any>();

/**
 * Initializes or updates a global state at a specified path.
 *
 * This function clears the watched states, retrieves the current global state,
 * and ensures the provided path exists within the global state object. If the
 * path does not exist, it is created. If it already exists and the value is an
 * object, it merges the existing state with the new value.
 *
 * Additionally, it recursively sets nested properties using `stateManager.setState`
 * to ensure that each nested key is properly initialized or updated.
 *
 * @param {string} [path] - The dot-separated path to the state property (e.g., "user.profile.name").
 * @param {string | object | unknown[]} [value] - The value to assign at the specified path.
 */
export function initState(path?: string, value?: string | object | unknown[]) {
    watchedStates.clear();
    let globalState: GlobalState = getState();
    const stateManager = getStateManager();

    if (!path) return;

    const keys = path.split('.');
    if (!globalState) {
        globalState = {};
    }

    keys.forEach((key, index) => {
        if (!globalState[key]) {
            globalState[key] = index === keys.length - 1 ? value : {};
        } else if (index === keys.length - 1 && typeof globalState[key] === 'object' && typeof value === 'object') {
            globalState[key] = { ...globalState[key], ...value };
        }
        globalState = globalState[key];
    });

    function setNestedState(currentPath: string, data: any) {
        if (typeof data !== 'object' || data === null) {
            stateManager.setState(currentPath, data);
            return;
        }

        if (Array.isArray(data)) {
            stateManager.setState(currentPath, data);
            return;
        }

        Object.entries(data).forEach(([key, val]) => {
            setNestedState(`${currentPath}.${key}`, val);
        });
    }

    setNestedState(path, value);
}


/**
 * Updates the state at a given path and validates watched states.
 * 
 * @param {string} path - The state path to update.
 * @param {any} value - The new value to set.
 * @returns {boolean} - Returns true if the state was successfully updated.
 * @throws {Error} - Throws an error if the update fails.
 */
export function setState(path: string, value: any): boolean {
    const stateManager = getStateManager();
    stateManager.setState(path, value);
    validateWatchedStates();
    return true;
}

/**
 * Verifies if the current state at a given path matches the expected value.
 * Also validates all watched states.
 * 
 * @param {string} path - The state path to verify.
 * @param {any} value - The expected value.
 * @returns {boolean} - Returns true if the state matches the expected value.
 * @throws {Error} - Throws an error if the state does not match.
 */
export function verifyState(path: string, value: any): boolean {

    const stateManager = getStateManager();
    let oldValue = stateManager.getState(path);
    let newValue = value;

    if (typeof newValue === 'object') newValue = JSON.stringify(value);
    if (typeof oldValue === 'object') oldValue = JSON.stringify(oldValue);

    if (oldValue !== newValue) {
        throw new Error(`Test failed: result: "${newValue}", expected: "${oldValue}"`);
    }

    validateWatchedStates();
    return true;
}

/**
 * Registers or unregisters a state to be watched.
 * If the value is `null`, the state is removed from observation.
 * 
 * @param {string} path - The state path to watch.
 * @param {any} value - The expected value for this state. If null, the state is removed from observation.
 */
export function watchState(path: string, value: any): void {

    if (value === null) {
        watchedStates.delete(path);
    } else {
        watchedStates.set(path, value);
    }
}

/**
 * Validates all watched states, checking if their current values match the expected ones.
 * If a mismatch is found, an error is thrown.
 * 
 * @throws {Error} - Throws an error if any watched state has changed unexpectedly.
 */
function validateWatchedStates(): void {
    const stateManager = getStateManager();

    for (const [path, expectedValue] of watchedStates.entries()) {

        let currentValue = stateManager.getState(path);
        let expected = expectedValue;
        if (typeof expected === 'object') expected = JSON.stringify(expected);
        if (typeof currentValue === 'object') currentValue = JSON.stringify(currentValue);

        if (currentValue !== expected) {
            throw new Error(`Test failed: path "${path}" changed. Expected: "${expected}" got: "${currentValue}"`);
        }
    }
}

/**
 * Retrieves the global state manager from the preview iframe.
 * 
 * @returns {any} - The global state manager.
 * @throws {Error} - Throws an error if the preview iframe or state manager is not available.
 */
function getStateManager(): IcaState {

    if (!window.preview.iframe) throw new Error('Invalid preview iframe');
    if (!window.preview.iframe.contentWindow) throw new Error('Invalid preview iframe contentWindow');

    const stateManager = (window.preview.iframe.contentWindow as IPreviewWindow).globalStateManagment;
    if (!stateManager) throw new Error('Invalid preview stateManagment');
    return stateManager;
}

/**
 * Retrieves the global state  from the preview iframe.
 * 
 * @returns {any} - The global state.
 * @throws {Error} - Throws an error if the preview iframe or state is not available.
*/
function getState(): {} {

    if (!window.preview.iframe) throw new Error('Invalid preview iframe');
    if (!window.preview.iframe.contentWindow) throw new Error('Invalid preview iframe contentWindow');

    const state = (window.preview.iframe.contentWindow as IPreviewWindow)._ica;
    if (!state) throw new Error('Invalid preview stateManagment');
    return state;
}

interface IPreviewWindow extends Window {
    globalStateManagment: IcaState
    _ica: {},
}
