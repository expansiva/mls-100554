/// <mls fileReference="_100554_/l2/agents/collabAuraPageCommon.ts" enhancement="_blank" />

/**
 * =============================================================================
 * BACKEND BRIDGE (REAL + MOCK)
 * =============================================================================
 */

export interface BeInvoke {
    invoke(
        routine: string,
        params: any
    ): Promise<any>;
}

const isMockMode = true;

export async function beInvoke(
  routine: string,
  requestId: number,
  params: any
): Promise<any> {

  if (isMockMode) {

    const handler = (globalThis as any).__BE_DRIVER__?.invoke
    if (!handler) {
      return { requestId, error: "Mock not implemented: " + routine };
    }

    await delay(50);
    const result = await handler(routine, params, requestId);
    return {
      requestId,
      ...result
    };
  }

  return {
    requestId,
    error: "Real backend not implemented"
  };
}

export async function readLocal(routine: string, params: any): Promise<any> {

}

export async function savelocal(
  routine: string,
  params: any,
  result: any
): Promise<void> {

}

export async function pluginInvoke(pluginRef: string, params: any): Promise<any> {
    console.log('error, plugin not found ' + pluginRef)
    return null;
}

export function generateId(): number {
  return Date.now();
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


