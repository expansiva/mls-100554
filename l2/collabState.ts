/// <mls shortName="collabState" project="100554" enhancement="_blank" />

const isTrace = false;

/**
 * Class responsible for managing shared state.
 */
export class CollabState {
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
    return value;
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
    this.componentMap.get(key)?.forEach((component: any) => {
      if ('handleCollabStateChange' in component) {
        component['handleCollabStateChange'](key, this.getState(key));
      }
    });
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

