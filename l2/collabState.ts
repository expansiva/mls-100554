/// <mls shortName="collabState" project="100554" enhancement="_blank" />

const isTrace = false;

// Declare a global state structure
export interface GlobalState {
  [key: string]: any;
}

// Extend the Window interface
/*declare global {
  export interface Window {
    globalState: GlobalState;
    globalStateManagment: IcaState;
    globalVariation: number;
  }
}*/


export const globalState: {
  _ica: GlobalState;
  globalStateManagment: CollabState;
  globalVariation: number;
} = {} as any;

function getCollabWindow(): any {
  if (window.parent && window.parent !== window && (window.parent as any).globalStateManagment) {
    return window.parent;
  }
  return window;
}

(window as any).getCollabWindow = getCollabWindow;

Object.defineProperty(globalState, '_ica', {
  get: function () {
    return getCollabWindow()._ica;
  },
  set: function (v: GlobalState) {
    getCollabWindow()._ica = v;
  }
});

Object.defineProperty(globalState, 'globalStateManagment', {
  get: function () {
    return getCollabWindow().globalStateManagment;
  },
  set: function (v: CollabState) {
    getCollabWindow().globalStateManagment = v;
  }
});

Object.defineProperty(globalState, 'globalVariation', {
  get: function () {
    return getCollabWindow().globalVariation;
  },
  set: function (v: number) {
    getCollabWindow().globalVariation = v;
  }
});

/**
 * Initializes a nested property in the global state object if it doesn't already exist.
 * If the property exists, it retains its current value without being overwritten.
 *
 * @param {string} path - The dot-separated path specifying the property to initialize (e.g., "globalState.users").
 * @param {*} value - The value to set if the property at the given path does not exist.
 */
export function initState(path: string, value: string | Object | Array<unknown>) {
  const keys = path.split('.');
  if (!globalState._ica) {
    globalState._ica = {}
  }
  let current = globalState._ica;

  keys.forEach((key, index) => {
    // changed
    if (!current[key]) {
      // Create an object or set the value if it doesn't exist
      current[key] = index === keys.length - 1 ? value : {};
    } else if (index === keys.length - 1 && typeof current[key] === 'object' && typeof value === 'object') {
      // Merge objects if both existing and new values are objects
      current[key] = { ...current[key], ...value };
    }
    current = current[key];
  });
}

/**
 * Function to retrieve nested property values using a path string.
 * Handles arrays and nested objects. Assumes all objects are indexable with string keys.
 * ex: 'users[0].name'
 */
function getPathValue(obj: { [key: string]: any }, path: string) {
  return (path || '').split('.').reduce((acc, part) => {
    if (acc == null) return undefined;

    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const prop = arrayMatch[1];
      const index = parseInt(arrayMatch[2], 10);
      return acc[prop]?.[index];
    }
    return acc[part];
  }, obj);
}

// Helper function to set a value in the globalState by path
function setPathValue(obj: { [key: string]: any }, path: string, value: any): void {
  const parts = (path || '').split('.');
  const last = parts.pop();
  if (!last) return;

  let lastObj;

  try {
    lastObj = parts.reduce((acc, part) => {
      const match = part.match(/^(\w+)\[(\d+)\]$/);
      if (match) {
        const prop = match[1];
        const index = parseInt(match[2], 10);
        acc[prop] = acc[prop] || [];
        acc[prop][index] = acc[prop][index] || {};
        return acc[prop][index];
      } else {
        acc[part] = acc[part] || {};
        return acc[part];
      }
    }, obj);
  } catch (e) {
    const isArray = parts.some(p => /^\w+\[\d+\]$/.test(p));
    initState(parts.join('.'), isArray ? [] : {});
    obj = globalState._ica; // reload after initState
    lastObj = parts.reduce((acc, part) => {
      const match = part.match(/^(\w+)\[(\d+)\]$/);
      if (match) {
        const prop = match[1];
        const index = parseInt(match[2], 10);
        acc[prop] = acc[prop] || [];
        acc[prop][index] = acc[prop][index] || {};
        return acc[prop][index];
      } else {
        acc[part] = acc[part] || {};
        return acc[part];
      }
    }, obj);
  }

  const lastIsArray = /^\w+\[\d+\]$/.test(last);
  if (lastIsArray && !Array.isArray(lastObj[last])) lastObj[last] = [];
  if (!lastIsArray && typeof lastObj[last] !== 'object') lastObj[last] = {};

  lastObj[last] = value;
}


export function setState(key: string, value: any, systemChange?: boolean): void {
  if (!globalState || !globalState.globalStateManagment) return;
  globalState.globalStateManagment.setState(key, value, systemChange);
}

export interface CollabState {
  getState(key: string): any;
  setState(key: string, value: any, systemChange?: boolean): void;

  getHistory(): Array<{ timestamp: number; system: boolean; key: string; value: any }>;
  clearHistory(): void;

  /**
   * Subscribe a component to a state key or keys.
   * @param keyOrKeys - The state key or keys.
   * @param component - The subscribing component.
   */
  subscribe(keyOrKeys: string | string[], component: Object): void;
  /**
   * Unsubscribe a component from a state key or keys.
   * @param keyOrKeys - The state key or keys.
   * @param component - The unsubscribing component.
   */
  unsubscribe(keyOrKeys: string | string[], component: Object | "*"): void;
  /**
   * Notify subscribed components about a state change.
   * @param key - The state key that changed.
   */
  notify(key: string): void;


}

/**
 * Class responsible for managing shared state.
 */
class CollabStateSingleton implements CollabState {
  private stateMap: Map<string, any> = new Map(); // values of variables
  private componentMap: Map<string, Set<Object>> = new Map(); // subscribes
  private history: Array<{ timestamp: number; system: boolean; key: string; value: any }> = [];

  /**
   * Updates the state for a given key.
   * @param key - The state key.
   * @param value - The new state value.
   * @param systemChange - (optional) Set to true if setState is used in the constructor.
   */
  public setState(key: string, value: any, systemChange?: boolean): void {
    // Default systemChange to this.inNotify if not provided
    systemChange = systemChange ?? false;
    const oldValue = this.stateMap.get(key);

    if (isTrace) console.info('setState key: ' + key + ' value=', value, ", oldValue=", oldValue)
    if (oldValue !== value) {
      this.stateMap.set(key, value);
      setPathValue(globalState._ica, key, value);
      this.logHistory(key, value, systemChange);
      this.notify(key);
    }
  }

  /**
   * Logs the state change in history.
   * @param key - The state key that was changed.
   * @param value - The new state value.
   * @param system - Indicates whether the change was made by the system.
   */
  private logHistory(key: string, value: any, system: boolean): void {
    const entry = {
      timestamp: Date.now(),
      system,
      key,
      value
    };

    this.history.push(entry);

    // Keep only the last 10,000 entries
    if (this.history.length > 10000) {
      this.history.shift();
    }
  }

  /**
   * Retrieves the history of state changes.
   */
  public getHistory(): Array<{ timestamp: number; system: boolean; key: string; value: any }> {
    return this.history;
  }

  /**
   * clear all entries in the history
   */
  public clearHistory(): void {
    this.history = [];
  }

  /**
   * Retrieve state for a given key. 
   * @param key - The state key.
   */
  public getState(key: string): any {
    const value = this.stateMap.get(key);
    if (isTrace) console.info('getState key: ' + key + ' value=', value);
    return getPathValue(globalState._ica, key);
  }

  /**
   * Subscribe a component to a state key or keys.
   * @param keyOrKeys - The state key or keys.
   * @param component - The subscribing component.
   */
  public subscribe(keyOrKeys: string | string[], component: Object): void {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    keys.forEach((key) => {
      if (!key.includes(';')) key = `;${key}`;
      if (isTrace) console.log('subscribe key(s)', keyOrKeys)
      if (!this.componentMap.has(key)) {
        this.componentMap.set(key, new Set());
      }
      this.componentMap.get(key)!.add(component);
    });
  }

  /**
   * Unsubscribe a component from a state key or keys.
   * @param keyOrKeys - The state key or keys.
   * @param component - The unsubscribing component.
   */
  public unsubscribe(keyOrKeys: string | string[], component: Object | "*"): void {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];

    keys.forEach((key) => {
      if (!key.includes(';')) key = `;${key}`;
      if (component === "*") {
        if (isTrace) console.log('unsubscribe key', key, " all components");
        this.componentMap.set(key, new Set());
      } else {
        if (isTrace) console.log('unsubscribe key', key, this.componentMap.get(key)?.has(component))
        this.componentMap.get(key)?.delete(component);
      }
    });
  }

  private notifyQueue: string[] = [];
  private isNotifying: boolean = false;

  /**
   * Notify subscribed components about a state change.
   * @param key - The state key that changed.
   */
  public notify(key: string): void {
    if (!this.notifyQueue.includes(key)) {
      this.notifyQueue.push(key);
    }
    if (this.isNotifying) return;

    this.isNotifying = true;
    try {
      while (this.notifyQueue.length > 0) {
        const nextKey = this.notifyQueue.shift()!;
        if (isTrace) console.log(`notify key=${nextKey}`, this.componentMap);
        Array.from(this.componentMap).find((map) => {
          const [stateKey, arr] = map;
          const path = stateKey.split(';')[1];
          if (path !== nextKey) return;
          arr.forEach((component: any) => {
            if ('handleIcaStateChange' in component) {
              component['handleIcaStateChange'](nextKey, this.getState(nextKey));
            } else if (typeof component === 'function') {
              component(nextKey, this.getState(nextKey));
            } else {
              console.error('invalid notify on key: ' + nextKey);
            }
          });
        });
      }
    } catch (e) {
      console.error("error on notify, key: " + key, e);
    } finally {
      this.isNotifying = false;
    }
  }

  /**
   * Get statistics about current state keys and their subscribers.
   */
  getStateStatistics(): Map<string, number> {
    const statistics = new Map<string, number>();
    this.componentMap.forEach((value, key) => {
      statistics.set(key, value.size);
    });
    return statistics;
  }
}

export function getCollabStateInstance(): CollabState {
  const win = getCollabWindow();
  if (!win.collabState) {
    win.collabState = new CollabStateSingleton();
  }
  return win.collabState;
}
