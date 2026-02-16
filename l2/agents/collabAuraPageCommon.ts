/// <mls fileReference="_100554_/l2/agents/collabAuraPageCommon.ts" enhancement="_blank" />

/**
 * =============================================================================
 * BACKEND CONTRACT
 * =============================================================================
 */

export interface BeInvoke {
    invoke(
        routine: string,
        params: any
    ): Promise<any>;
}

export async function beInvoke(routine: string, requestId: number, params: any): Promise<any> {
    return {
        requestId: requestId,
        error: 'not implemented'
    }
}

export async function pluginInvoke(pluginRef: string, params: any): Promise<any> {
    console.log('error, plugin not found ' + pluginRef)
    return null;
}

export async function readLocal(routine: string, params: any): Promise<any> {
    return undefined;
}

export async function savelocal(routine: string, params: any, result: any): Promise<void> {

}

export function generateId(): number {
    return 1;
}
