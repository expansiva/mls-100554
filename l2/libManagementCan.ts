/// <mls shortName="libManagementCan" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabState, GlobalState, globalState } from './_100554_collabState';

/** Guarda watchers ativos */
const activeWatchers = new Map<string, number>();

/**
 * Inicializa ou atualiza o estado global em um caminho específico.
 */

export function initState(path?: string, value?: string | object | unknown[]) {
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
 * Atualiza o estado em um caminho.
 */
export function setState(path: string, value: any): boolean {
    const stateManager = getStateManager();
    stateManager.setState(path, value);
    return true;
}

/**
 * Espera até que o estado em `path` seja igual a `value`.
 * Se `timeout` for 0 ou undefined, espera indefinidamente.
 */
export async function waitingState(
    path: string,
    value: any,
    options?: IVerifyOptions
): Promise<void> {
    const stateManager = getStateManager();
    const expected = normalizeValue(value);
    const timeout = options?.timeout ?? 0; // 0 = infinito
    const retryInterval = options?.retryInterval ?? 100;
    const startTime = Date.now();
    const initialValue = stateManager.getState(path);

    while (true) {
        const current = normalizeValue(stateManager.getState(path));

        if (current === expected) {
            return;
        }

        if (initialValue !== current) {
            throw new Error(
                `Value for state invalid: path "${path}", expected "${expected}", got "${current}"`
            );
        }

        if (timeout > 0 && Date.now() - startTime >= timeout) {
            throw new Error(
                `Timeout waiting for state: path "${path}", expected "${expected}", got "${current}"`
            );
        }

        await delay(retryInterval);
    }
}

// espera até que o state em `path` tenha um valor "não vazio"
// resolve com o valor atual quando isso acontecer.
// se quiser, aceita timeout em ms (opcional) para rejeitar
export function waitForNonEmptyState(
  path: string,
  options?: { retryInterval?: number; timeout?: number }
): Promise<string> {
  const stateManager = getStateManager();
  const retryInterval = options?.retryInterval ?? 100;
  const timeout = options?.timeout; // ms | undefined

  return new Promise((resolve, reject) => {
    // Checagem imediata (importante: cobre caso já esteja preenchido)
    try {
      const initial = normalizeValue(stateManager.getState(path));
      if (initial !== '' && initial !== undefined && initial !== null) {
        resolve(String(initial));
        return;
      }
    } catch (e) {
      // se getState lançar, rejeitar
      reject(e);
      return;
    }

    const interval = setInterval(() => {
      try {
        const current = normalizeValue(stateManager.getState(path));
        if (current !== '' && current !== undefined && current !== null) {
          clearInterval(interval);
          if (timer) clearTimeout(timer);
          resolve(String(current));
        }
      } catch (e) {
        clearInterval(interval);
        if (timer) clearTimeout(timer);
        reject(e);
      }
    }, retryInterval);

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (typeof timeout === 'number') {
      timer = setTimeout(() => {
        clearInterval(interval);
        reject(new Error(`waitForNonEmptyState timeout after ${timeout}ms for path: ${path}`));
      }, timeout);
    }
  });
}


/**
 * Vigia continuamente um estado. Se ele mudar de valor, lança erro.
 * Fica rodando até chamar `unwatchState` ou `clearWatchers`.
 */
export function watchState(
    path: string,
    expectedValue: any,
    options?: IVerifyOptions
): void {
    const stateManager = getStateManager();
    const expected = normalizeValue(expectedValue);
    const retryInterval = options?.retryInterval ?? 100;

    // Se já existe watcher para esse path, limpa
    if (activeWatchers.has(path)) {
        clearInterval(activeWatchers.get(path)!);
        activeWatchers.delete(path);
    }

    const interval = setInterval(() => {
        const current = normalizeValue(stateManager.getState(path));
        if (current !== expected) {
            clearInterval(interval);
            activeWatchers.delete(path);
            throw new Error(
                `Watch failed: path "${path}" changed. Expected "${expected}", got "${current}"`
            );
        }
    }, retryInterval);

    activeWatchers.set(path, interval);
}

/** Cancela observação de um path específico */
export function unwatchState(path: string): void {
    if (activeWatchers.has(path)) {
        clearInterval(activeWatchers.get(path)!);
        activeWatchers.delete(path);
    }
}

/** Cancela todos os watchers ativos */
export function clearWatchers(): void {
    for (const interval of activeWatchers.values()) {
        clearInterval(interval);
    }
    activeWatchers.clear();
}

/**
 * Verifica estado com timeout opcional, retornando boolean em vez de erro.
 */
export async function verifyState(
    path: string,
    value: any,
    options?: IVerifyOptions
): Promise<boolean> {
    try {
        await waitingState(path, value, options);
        return true;
    } catch {
        return false;
    }
}

/** Utils */
function normalizeValue(val: any): string {
    return typeof val === "object" ? JSON.stringify(val) : String(val);
}
function delay(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

function getStateManager(): CollabState {
    const stateManager = globalState.globalStateManagment;
    if (!stateManager) throw new Error('Invalid preview stateManagment');
    return stateManager;
}

function getState(): {} {
    const state = globalState._ica;
    if (!state) throw new Error('Invalid preview stateManagment');
    return state;
}

/** Types */
interface IPreviewWindow extends Window {
    globalStateManagment: CollabState
    _ica: {},
}

interface IVerifyOptions {
    timeout?: number;       // tempo máximo em ms (0 = infinito)
    retryInterval?: number; // intervalo entre verificações em ms
}
