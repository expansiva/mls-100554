/// <mls shortName="beTableBase" project="100554" enhancement="_blank" groupName="other" />

import { BEIndexedDBBase } from "./_100554_beIndexedDBBase";
import { getCollabStateInstance } from "./_100554_collabState";
import { EntitiesState, EntityState, ActionRead, ActionAdd, ActionUpdate, ActionDelete, ActionRedo, ActionUndo, Actions } from "./_100554_beTableState"
import { IProviderBase } from "./_100554_beProviderBase";


export abstract class TableDriverBase<
    TModel extends { id: number },
    TState extends EntityState<TModel>,
    TAction
> {
    protected state = getCollabStateInstance();
    protected abstract entityKey: string;
    protected abstract dbName: string;
    protected abstract tableName: string;
    protected abstract modelPrisma: string;
    protected provider: IProviderBase<TModel>;
    private tableInitialized = false;

    constructor(provider: IProviderBase<TModel>) {
        this.provider = provider;
    }

    protected onAction = async (key: string, action: TAction & { command: string }) => {
        //const action = this.state.getState(this.actionKey) as TAction & { command: string };
        if ((key !== this.actionKey) || 
            (!action || !action.command)) {
            this.setError(`invalidAction key:${key}, action:${action}`);
            return;
        }
        this.setError("");
        if (!await this.ensureTable()) return;
        switch (action.command) {
            case "read": return this.onRead(action as any);
            case "add": return this.onAdd(action as any);
            case "update": return this.onUpdate(action as any);
            case "delete": return this.onDelete(action as any);
            case "undo": return this.onUndo(action as any);
            case "redo": return this.onRedo(action as any);
            default: this.setError('invalidAction: "' + (action as any).command + '"');
        }
    };

    protected async onRead(action: any): Promise<void> {
        try {
            const rows = await this.provider.read(action.filter, action.range, action.sort);
            const map = rows.reduce<Record<number, TState>>((acc, r) => {
                acc[r.id] = { ...r, _status: "ready", _sync: "synced" } as TState;
                return acc;
            }, {});
            const current = this.state.getState(this.dataKey) || {};
            this.state.setState(this.dataKey, { ...current, ...map });
            this.setError("");
            this.setHistory(`read: filter=${JSON.stringify(action.filter)}`);
        } catch (e: any) {
            this.setError(e.message || "read error");
        }
    }

    protected async onAdd(action: any): Promise<void> {
        try {
            const newRow: TModel | undefined = this.state.getState(this.dataKey + ".newRow");
            if (!newRow) {
                this.setError("No data in newRow");
                return;
            }
            const { id, ...itemToAdd } = newRow as any;
            const added = await this.provider.add(itemToAdd);
            const current = this.state.getState(this.dataKey) || {};
            const newState: TState = { ...added, _status: "ready", _sync: "synced" } as TState;
            current[added.id] = newState;
            this.state.setState(this.dataKey, current);
            this.state.setState(this.dataKey + ".newRow", undefined);
            this.setError("");
            this.setHistory(`add: ${JSON.stringify(added)}`);
        } catch (e: any) {
            this.setError(e.message || "add error");
        }
    }

    protected async onUpdate(action: any): Promise<void> {
        const item: TState | undefined = this.findId(action.id);
        if (!item) {
            this.setError(`error on update ${this.entityKey}: id not found: ${action.id}`);
            return;
        }
        try {
            await this.provider.update(action.id, item);
            item._sync = "synced";
            item._status = "ready";
            this.setError("");
            this.setHistory(`update id ${action.id}, item: ${JSON.stringify(item)}`);
            const current = this.state.getState(this.dataKey) || {};
            current[action.id] = item;
            this.state.setState(this.dataKey, current);
        } catch (error: any) {
            this.setError(`error on update ${this.entityKey}: ` + error.message || "?");
            item._sync = "error";
        }
    }

    protected async onDelete(action: any): Promise<void> {
        const item: TState | undefined = this.findId(action.id);
        if (!item) {
            this.setError(`error on delete ${this.entityKey}: id not found: ${action.id}`);
            return;
        }
        try {
            await this.provider.delete(action.id);
            const current = this.state.getState(this.dataKey) || {};
            delete current[action.id];
            this.state.setState(this.dataKey, current);
            this.setError("");
            this.setHistory(`delete id ${action.id}`);
        } catch (error: any) {
            this.setError(`error on delete ${this.entityKey}: ` + error.message || "?");
        }
    }

    protected async onUndo(action: any): Promise<void> {
        const item: TState | undefined = this.findId(action.id);
        if (!item || !item._original) {
            this.setError(`undo failed: original not found for id ${action.id}`);
            return;
        }
        const restored = { ...item, ...item._original, _status: "ready", _sync: "pending" } as TState;
        (restored as any)._redo = { ...item };
        delete (restored as any)._original;
        const current = this.state.getState(this.dataKey) || {};
        current[action.id] = restored;
        this.state.setState(this.dataKey, current);
        this.setError("");
        this.setHistory(`undo id ${action.id}`);
    }

    protected async onRedo(action: any): Promise<void> {
        const item: TState | undefined = this.findId(action.id);
        if (!item || !item._redo) {
            this.setError(`redo failed: redo not found for id ${action.id}`);
            return;
        }
        const redone = { ...item, ...item._redo, _status: "ready", _sync: "pending" } as TState;
        (redone as any)._original = { ...item };
        delete (redone as any)._redo;
        const current = this.state.getState(this.dataKey) || {};
        current[action.id] = redone;
        this.state.setState(this.dataKey, current);
        this.setError("");
        this.setHistory(`redo id ${action.id}`);
    }

    protected findId(id: number): TState | undefined {
        const all: EntitiesState<TModel> = this.state.getState(this.dataKey) || {};
        return all[id] as TState | undefined;
    }

    protected setHistory(msg: string) {
        let his: string[] | undefined = this.state.getState(this.historyKey);
        if (!his) his = [];
        his.push(new Date().toISOString() + " " + msg);
        if (his.length > 10) his.splice(0, 2);
        this.state.setState(this.historyKey, his);
    }

    protected setError(msg: string) {
        this.state.setState(this.errorKey, msg);
    }

    protected get historyKey() {
        return `db.${this.entityKey}.history`;
    }

    protected get errorKey() {
        return `db.${this.entityKey}.error`;
    }

    protected get actionKey() {
        return `db.${this.entityKey}.action`;
    }

    protected get dataKey() {
        return `db.${this.entityKey}`;
    }

    protected async ensureTable(): Promise<boolean> {
        if (this.tableInitialized) return true;
        this.tableInitialized = true;
        await this.provider.ensureTable(this.dbName, this.tableName, this.modelPrisma)
            .catch((reason) => {
                this.setError("error on init table: " + reason.message || "?");
                return false;
            });
        return true;
    }

  public subscribe() {
    const key = this.dataKey + "._unsubscribe";
    const old = this.state.getState(key);
    if (old && typeof old === "string") {
        this.unsubscribeAll(old);
    }
    this.state.subscribe(this.actionKey, this.onAction);
    this.state.setState(key, this.actionKey);
  }

  public unsubscribeAll(actionKey: string) {
    this.state.unsubscribe(actionKey, "*");
  }

}
