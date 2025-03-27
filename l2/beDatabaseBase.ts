/// <mls shortName="beDatabaseBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export abstract class DatabaseClient {

  abstract dbName: string;
  abstract createTable(tableName: string, fields: IFieldTable[]): Promise<any>
  abstract get(table: string, key: IKeyFilter[]): Promise<any>
  abstract put(table: string, item: any): Promise<void>
  abstract post(table: string, item: any): Promise<void>
  abstract patch(table: string, item: any): Promise<void>
  abstract delete(table: string, key: IKeyFilter[]): Promise<void>
  abstract query(table: string, filters: IKeyFilter[]): Promise<any[]>

}


export type ITypeFieldDB = 'STRING' | 'NUMBER' | 'OBJECT' | 'DATE';

export interface IFieldTable {
  field: string,
  tp: ITypeFieldDB,
  primaryKey: boolean,
  autoIncrement: boolean,
}

export interface IKeyFilter {
  field: string,
  value: any;
};