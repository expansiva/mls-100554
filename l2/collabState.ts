/// <mls shortName="collabState" project="100554" enhancement="_blank" />
				
/**
 * Class responsible for managing shared state.
 */
export class CollabState {
  private stateMap: Map<string, any> = new Map();
  private componentMap: Map<string, Set<Object>> = new Map();

  /**
   * Update state for a given key.
   * @param key - The state key.
   * @param value - The new state value.
   */
  setState(key: string, value: any): void {
    this.stateMap.set(key, value);
    this.notify(key);
  }

  /**
   * Retrieve state for a given key.
   * @param key - The state key.
   */
  getState(key: string): any {
    return this.stateMap.get(key);
  }

  /**
   * Subscribe a component to a state key.
   * @param key - The state key.
   * @param component - The subscribing component.
   */
  subscribe(key: string, component: Object): void {
    if (!this.componentMap.has(key)) {
      this.componentMap.set(key, new Set());
    }
    this.componentMap.get(key)!.add(component);
  }

  /**
   * Unsubscribe a component from a state key.
   * @param key - The state key.
   * @param component - The unsubscribing component.
   */
  unsubscribe(key: string, component: Object): void {
    this.componentMap.get(key)?.delete(component);
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

