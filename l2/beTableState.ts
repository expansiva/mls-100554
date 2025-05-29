/// <mls shortName="beTableState" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

// Common state for any table row (generic)
export type EntityState<T extends object> = T & {
  _status: "ready" | "loading" | "updating";
  _sync: "pending" | "synced" | "error";
  _original?: Omit<T, "id">;
  _redo?: Omit<T, "id">;
};

// Table state for any table
export type EntitiesState<T extends object> = Record<number, EntityState<T>> & {
  action?: any; // or your action type
  error?: string;
  newRow?: T;
  history: string[];
};

export interface ActionRead<T> {
    command: "read";
    filter?: { categoria?: string; nome?: string };
    range?: { start: number; end: number };
    sort?: { field: keyof T; direction: "asc" | "desc" };
}

export interface ActionAdd {
    // new row in db.xxx.newRow
    command: "add";
}

export interface ActionUpdate {
    command: "update";
    id: number;
}

export interface ActionDelete {
    command: "delete";
    id: number;
}

export interface ActionUndo {
    command: "undo";
    id: number;
}

export interface ActionRedo {
    command: "redo";
    id: number;
}

export type Actions<T> = ActionRead<T> | ActionAdd | ActionUpdate | ActionDelete | ActionUndo | ActionRedo;

