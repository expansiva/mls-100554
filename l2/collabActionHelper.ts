/// <mls fileReference="_100554_/l2/collabActionHelper.ts" enhancement="_blank" />

export const ambient: "RPC" | "" = "";

export async function callBackend<Req = any, Res = any>(
    config: ActionRef,
    req: Req
): Promise<Res> {
    const response = await fetch('/api/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: config.module, organism: config.organism, action: config.action, req })
    });
    if (!response.ok) throw new Error('Backend error');
    return response.json();
}

export interface CollabTrace {
    traceId: string;           
    correlationId: string;    
    parentId?: string;         
    layer: "organism" | "usecase" | "table" | "backend";
    module: string;
    action: string;
    origem: string;
    status?: "ok" | "warn" | "error";
    userId?: string;
    timestamp: string;
    durationMs?: number;
    params?: any;
    result?: string;
    details?: Record<string, string>;
}

export interface UserInfo {
    userId: string;
    name: string;
    rules: string[];
}

export interface ExecutionContext {
    user: UserInfo;
    authority: string[];
    tenantId: string; // organization id, for acess in DB
    io: Record<string, string>; // ex: io[users]?.searchById(1)
    correlationId: string; // request id
}

export function getExecutionContext(): ExecutionContext {
    return {
        user: {
            userId: "123",
            name: "John",
            rules: ["admin"]
        },
        authority: [],
        tenantId: "xyz",
        io: {},
        correlationId: Math.random().toString(36)
    }
}

const TRACE_LIMIT = 100;

export function addOrganismTrace(trace: CollabTrace) {
    let win = window as any;
    if (win.parent) win = win.parent;
    if (!win.traceOrganism) win.traceOrganism = [];
    win.traceOrganism.push(trace);
    if (win.traceOrganism.length > TRACE_LIMIT) {
        win.traceOrganism = win.traceOrganism.slice(-TRACE_LIMIT);
    }
}

export function getOrganismTraces(): CollabTrace[] {
    let win = window as any;
    if (win.parent) win = win.parent;
    return win.traceOrganism || [];
}

function genId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
}

export async function traceOrganismAction<Req, Res>(
    config: { module: string; organism: string; action: string },
    req: Req,
    exec: (ctx: ExecutionContext) => Promise<Res>
): Promise<Res> {
    const start = performance.now();
    const ctx = getExecutionContext();
    let status: "ok" | "error" = "ok";
    let details: any;
    try {
        const result = await exec(ctx);
        return result;
    } catch (err) {
        status = "error";
        details = err;
        throw err;
    } finally {
        const duration = performance.now() - start;
        addOrganismTrace({
            traceId: genId(),
            correlationId: ctx.correlationId,
            layer: "organism",
            module: config.module,
            origem: config.organism,
            action: config.action,
            result: "Action executed",
            status,
            details,
            durationMs: duration,
            timestamp: new Date().toISOString()
        });
    }
}

export interface ActionRef {
    module: string;  // Module name, e.g. "petshop"
    organism: string; // Organism/component name, e.g. "organismFeaturedProducts"
    action: string; // Action name, e.g. "getFeaturedProducts"
}

export function withInstrumentation<Req, Res>(
    meta: ActionRef,
    handler: (req: Req, ctx: ExecutionContext) => Promise<Res>
): (req: Req) => Promise<Res> {
    return (req: Req) =>
        traceOrganismAction(meta, req, (ctx: ExecutionContext) => handler(req, ctx));
}

export function CollabAction<Req, Res>(
    meta: ActionRef,
    handler: (req: Req) => Promise<Res>
): (req: Req) => Promise<Res> {
    return withInstrumentation(meta, handler);
}
