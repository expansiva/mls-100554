/// <mls fileReference="_100554_/l2/agents/collabAuraPageCommon.ts" enhancement="_blank" />

/**
 * =============================================================================
 * BACKEND BRIDGE (REAL + MOCK)
 * =============================================================================
 */

const isMockMode = true;

const localCache = new Map<string, any>();

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

  // 🔴 Aqui entraria o backend real
  return {
    requestId,
    error: "Real backend not implemented"
  };
}

export async function readLocal(routine: string, params: any): Promise<any> {
  const key = buildCacheKey(routine, params);
  return localCache.get(key);
}

export async function savelocal(
  routine: string,
  params: any,
  result: any
): Promise<void> {
  const key = buildCacheKey(routine, params);
  localCache.set(key, result);
}

export function generateId(): number {
  return Date.now();
}

function buildCacheKey(routine: string, params: any) {
  return routine + "::" + JSON.stringify(params ?? {});
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


