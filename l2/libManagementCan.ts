/// <mls shortName="libManagementCan" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaState, GlobalState } from './_100554_icaState';

const watchedStates = new Map<string, any>();
const waitingPromises: Map<string, { value: any, resolve: () => void, reject: (err: Error) => void }> = new Map();


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
    waitingPromises.clear();

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
    return true;
}

/**
 * Verifies if the current state at a given path matches the expected value.
 * Optionally retries the verification within a specified time frame.
 * Also validates all watched states.
 * 
 * @param {string} path - The state path to verify.
 * @param {any} value - The expected value.
 * @param {IVerifyOptions} [options] - Optional settings for retry attempts.
 * @returns {boolean} - Returns true if the state matches the expected value.
 * @throws {Error} - Throws an error if the state does not match within the given time frame.
 */
export function verifyState(path: string, value: any, options?: IVerifyOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const stateManager = getStateManager();
        let newValue = typeof value === 'object' ? JSON.stringify(value) : value;
        let startTime = Date.now();

        const checkState = () => {
            let oldValue = stateManager.getState(path);
            if (typeof oldValue === 'object') oldValue = JSON.stringify(oldValue);

            if (oldValue === newValue) {
                resolve(true);
                return;
            }

            if (Date.now() - startTime >= (options?.timeout ?? 0)) {
                reject(new Error(`Test failed: expected: "${newValue}", got: "${oldValue}"`));
                return;
            }

            setTimeout(checkState, options?.retryInterval ?? 100);
        };

        checkState();
    });
}

/**
 * Registers a function to wait until the state at a given path reaches the specified value.
 *
 * @param {string} path - The path of the state to wait for.
 * @param {any} value - The expected value of the state.
 * @returns {Promise<void>} - A promise that resolves once the state value matches the expected value.
 */
export function waitingState(path: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
        waitingPromises.set(path, { value, resolve, reject });
    });
}

/**
 * Validates whether the current state matches the expected value for any registered waiting state.
 * If the state does not match the expected value, the function stops observing and throws an error.
 *
 * @param {IcaState} stateManager - The state manager that holds the global state.
 * @throws {Error} - Throws an error if the state at a given path does not match the expected value.
 */
function validateWaitingStates(stateManager: IcaState): void {
    for (const [path, { value, resolve, reject }] of waitingPromises.entries()) {
        const currentValue = stateManager.getState(path);

        // Check if the current value matches the expected value
        if (JSON.stringify(currentValue) === JSON.stringify(value)) {
            resolve(); // Resolve the promise once the value matches
            waitingPromises.delete(path); // Remove the waiting function
        } else {
            // If the value does not match, stop observing and throw an error
            waitingPromises.delete(path);
            const msg = `Waiting state validation failed: path "${path}" has value "${currentValue}", expected: "${value}"`
            reject(new Error(msg));
        }
    }
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
 * Retrieves the global state and wraps it in a Proxy to intercept changes and validate waiting states.
 *
 * @returns {any} - The proxied state object.
 * @throws {Error} - Throws an error if the preview iframe or state management is invalid.
 */
function getState(): {} {
    if (!window.preview.iframe) throw new Error('Invalid preview iframe');
    if (!window.preview.iframe.contentWindow) throw new Error('Invalid preview iframe contentWindow');

    const state = (window.preview.iframe.contentWindow as IPreviewWindow)._ica;
    if (!state) throw new Error('Invalid preview stateManagment');

    function createProxy(obj: any): any {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        return new Proxy(obj, {
            set(target, key, value) {
                target[key] = createProxy(value);

                validateWaitingStates(getStateManager());
                validateWatchedStates();


                return true;
            },
            get(target, key) {
                const result = target[key];
                return createProxy(result);
            }
        });
    }

    const proxiedState = createProxy(state);
    return proxiedState;
}


interface IPreviewWindow extends Window {
    globalStateManagment: IcaState
    _ica: {},
}

interface IVerifyOptions {
    /** Maximum time (in milliseconds) before giving up. */
    timeout?: number;
    /** Interval (in milliseconds) between each verification attempt. */
    retryInterval?: number;
}

