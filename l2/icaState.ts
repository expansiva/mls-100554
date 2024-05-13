/// <mls shortName="icaState" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

const isTrace = false;

// Declare a global state structure
interface GlobalState {
  [key: string]: any;
}

// Extend the Window interface
declare global {
  interface Window {
    globalState: GlobalState;
    globalStateManagment: IcaState;
    globalVariation: number;
  }
}

/**
 * Function to retrieve nested property values using a path string.
 * Handles arrays and nested objects. Assumes all objects are indexable with string keys.
 * ex: 'users[0].name'
 */
function getPathValue(obj: { [key: string]: any }, path: string) {
  return path.split('.').reduce((acc, part) => {
    const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      const prop = arrayMatch[1];
      const index = parseInt(arrayMatch[2], 10);
      return acc[prop][index];
    }
    return acc[part];
  }, obj);
}
// Helper function to set a value in the globalState by path
function setPathValue(obj: { [key: string]: any }, path: string, value: any): void {
  const parts = path.split('.');
  const last: string | undefined = parts.pop();
  if (!last) return;
  const lastObj = parts.reduce((acc, part) => {
    const match = part.match(/(\w+)\[(\d+)\]/);
    return match ? acc[match[1]][parseInt(match[2], 10)] : acc[part];
  }, obj);
  lastObj[last] = value;
}

/**
 * Class responsible for managing shared state.
 */
export class IcaState {
  private stateMap: Map<string, any> = new Map(); // values of variables
  private componentMap: Map<string, Set<Object>> = new Map(); // subscribes

  /**
   * Update state for a given key.
   * @param key - The state key.
   * @param value - The new state value.
   */
  setState(key: string, value: any): void {
    const oldValue = this.stateMap.get(key);
    if (isTrace) console.info('setState key: ' + key + ' value=', value, ", oldValue=", oldValue)
    if (oldValue !== value) {
      this.stateMap.set(key, value);
      setPathValue(window.globalState, key, value);
      this.notify(key);
    }
  }

  /**
   * Retrieve state for a given key.
   * @param key - The state key.
   */
  getState(key: string): any {
    const value = this.stateMap.get(key);
    if (isTrace) console.info('getState key: ' + key + ' value=', value);
    return getPathValue(window.globalState, key);
  }

  /**
   * Subscribe a component to a state key or keys.
   * @param keyOrKeys - The state key or keys.
   * @param component - The subscribing component.
   */
  subscribe(keyOrKeys: string | string[], component: Object): void {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];

    keys.forEach((key) => {
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
  unsubscribe(keyOrKeys: string | string[], component: Object): void {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];

    keys.forEach((key) => {
      this.componentMap.get(key)?.delete(component);
    });
  }

  /**
   * Notify subscribed components about a state change.
   * @param key - The state key that changed.
   */
  private notify(key: string): void {
    Array.from(this.componentMap).find((map) => {
      const [stateKey, arr] = map;
      const path = stateKey.split(';')[1];
      if (path !== key) return;
      arr.forEach((component: any) => {
        if ('handleIcaStateChange' in component) {
          component['handleIcaStateChange'](key, this.getState(key));
        }
      });
    })
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

