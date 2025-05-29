/// <mls shortName="beProviderBase" project="100554" enhancement="_blank" groupName="other" />

export interface IProviderBase<T> {
    read(
        filter?: Partial<T>,
        range?: { start: number; end: number },
        sort?: { field: keyof T; direction: "asc" | "desc" }
    ): Promise<T[]>;
    add(item: Omit<T, "id">): Promise<T>;
    update(id: number, item: Partial<Omit<T, "id">>): Promise<T>;
    delete(id: number): Promise<void>;
    ensureTable(dbName: string, tableName: string, modelPrisma: string): Promise<void>;
}
