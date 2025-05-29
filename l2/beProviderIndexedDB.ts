/// <mls shortName="beProviderIndexedDB" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IProviderBase } from "./_100554_beProviderBase";
import { BEIndexedDBBase } from "./_100554_beIndexedDBBase";
import { IFieldTable } from "./_100554_beDatabaseBase";
import { prismaToFieldTable } from "./_100554_beHelper";

export class BEProviderIndexedDB<T extends { id: number }> implements IProviderBase<T> {
  private db: BEIndexedDBBase;
  private dbName: string = "";
  private tableName: string = "";
  private fields: IFieldTable[] = [];

  constructor() {
    this.db = new BEIndexedDBBase();
  }

  async ensureTable(dbName: string, tableName: string, modelPrisma: string): Promise<void> {
    this.dbName = dbName;
    this.tableName = tableName;
    this.fields = prismaToFieldTable(modelPrisma);
    this.db.dbName = dbName;
    await this.db.createTable(tableName, this.fields);
  }

  async read(filter?: Partial<T>, range?: { start: number; end: number }, sort?: { field: keyof T; direction: "asc" | "desc" }): Promise<T[]> {
    const filters = filter
      ? Object.entries(filter).map(([field, value]) => ({ field, value }))
      : [];
    const rows: T[] = await this.db.query(this.tableName, filters);

    // Sort and range em memória
    let result = [...rows];
    if (sort) {
      result.sort((a: any, b: any) => {
        if (a[sort.field] < b[sort.field]) return sort.direction === "asc" ? -1 : 1;
        if (a[sort.field] > b[sort.field]) return sort.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    if (range) {
      result = result.slice(range.start, range.end);
    }
    return result;
  }

  async add(item: Omit<T, "id">): Promise<T> {
    // Gera um id fake se não houver (IndexedDB normalmente auto incrementa, mas garanta que seja retornado)
    const newItem = { ...item } as any;
    await this.db.post(this.tableName, newItem);
    // Busca o último registro inserido (ou idealmente pega o id gerado pelo store, mas IndexedDB não retorna direto)
    const all = await this.db.query(this.tableName, []);
    const last = all[all.length - 1];
    return last as T;
  }

  async update(id: number, item: Partial<Omit<T, "id">>): Promise<T> {
    const obj = { ...item, id };
    await this.db.put(this.tableName, obj);
    return obj as T;
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(this.tableName, [{ field: "id", value: id }]);
  }
}