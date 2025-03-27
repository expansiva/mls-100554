/// <mls shortName="beIndexedDBBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { DatabaseClient, IKeyFilter, IFieldTable } from './_100554_beDatabaseBase';

export class BEIndexedDBBase extends DatabaseClient {

    public dbName: string = '';

    public createTable(tableName: string, fields: IFieldTable[]): Promise<any> {
        return this._createTable(tableName, fields);
    }

    public get(table: string, key: IKeyFilter[]): Promise<any> {
        return this._get(table, key);
    }

    public put(table: string, item: any): Promise<void> {
        return this._put(table, item);
    }

    public post(table: string, item: any): Promise<void> {
        return this._post(table, item);
    }

    public patch(table: string, item: any): Promise<void> {
        return this._put(table, item);
    }

    public delete(table: string, key: IKeyFilter[]): Promise<void> {
        return this._delete(table, key);
    }

    public query(table: string, filters: IKeyFilter[]): Promise<any[]> {
        return this._get(table, filters);
    }

    //---------IMPLEMENTS-----------------

    private request: IDBOpenDBRequest | undefined;

    private async _createTable(tableName: string, fields: IFieldTable[]): Promise<any> {

        await this.createDB();

        if (!this.request) throw new Error('Not found db');

        this.request.onupgradeneeded = (event: any) => {

            let db = event.target.result;

            if (db.objectStoreNames.contains(tableName)) {
                return;
            }

            const primary = fields.find((f) => f.primaryKey === true);

            let store: any;
            if (primary) {
                store = db.createObjectStore(tableName, { keyPath: primary.field, autoIncrement: primary.autoIncrement });
            } else {
                store = db.createObjectStore(tableName);
            }


            fields.forEach((f) => {

                if (primary && primary.field === f.field) return;
                store.createIndex(f.field, f.field, { unique: false });

            });

        };

        this.request.onsuccess = () => {
            console.log(`Success update db`);
        };

        this.request.onerror = (event: any) => {
            console.log(`Erro update db:` + event.target.error);
        };

    }

    private async _get(table: string, key: IKeyFilter[]): Promise<any> {

        return new Promise(async (resolve, reject) => {

            await this.openDB();
            if (!this.request) throw new Error('Not found db');

            let ret: any[] = [];

            this.request.onsuccess = (event: any) => {

                let db = event.target.result;
                let tx = db.transaction(table, "readonly");
                let store = tx.objectStore(table);

                let cursorRequest = store.openCursor();

                cursorRequest.onsuccess = (csEvt: any) => {
                    let cursor = csEvt.target.result;
                    if (cursor) {

                        let filter = true;
                        key.forEach((f) => {
                            if (!filter) return;
                            if (cursor.value[f.field] !== f.value) filter = false;
                        })

                        if (filter) ret.push({ ...cursor.value });
                        cursor.continue();

                    } else {
                        resolve(ret);
                    }
                };

                cursorRequest.onerror = (errEv: any) => {
                    reject(errEv.target.error);
                };

            };

            this.request.onerror = (event: any) => {
                reject(event.target.error);
            };

        });

    }

    private async _put(table: string, item: any): Promise<void> {
        return new Promise(async (resolve, reject) => {

            await this.openDB();
            if (!this.request) throw new Error('Not found db');

            this.request.onsuccess = (event: any) => {
                let db = event.target.result;
                let transaction = db.transaction(table, "readwrite");
                let store = transaction.objectStore(table);

                let updateRequest = store.put(item);

                updateRequest.onsuccess = () => {
                    resolve();
                };

                updateRequest.onerror = (errEv: any) => {
                    reject(errEv.target.error);
                };
            };

            this.request.onerror = (event: any) => {
                reject(event.target.error);
            };

        });
    }

    private async _post(table: string, item: any): Promise<void> {
        return new Promise(async (resolve, reject) => {

            await this.openDB();
            if (!this.request) throw new Error('Not found db');

            this.request.onsuccess = (event: any) => {

                let db = event.target.result;
                let tx = db.transaction(table, "readwrite");
                let store = tx.objectStore(table);
                store.add(item);

                tx.oncomplete = () => resolve();
                tx.onerror = (erEV: any) => reject(erEV.target.error);
            };

            this.request.onerror = (event: any) => {
                reject(event.target.error);
            };

        });
    }

    private async _delete(table: string, key: IKeyFilter[]): Promise<void> {

        return new Promise(async (resolve, reject) => {

            await this.openDB();
            if (!this.request) throw new Error('Not found db');

            this.request.onsuccess = (event: any) => {

                let db = event.target.result;
                let tx = db.transaction(table, "readwrite");
                let store = tx.objectStore(table);

                let cursorRequest = store.openCursor();

                cursorRequest.onsuccess = (csEvt: any) => {
                    let cursor = csEvt.target.result;
                    if (cursor) {

                        let filter = true;
                        key.forEach((f) => {
                            if (!filter) return;
                            if (cursor.value[f.field] !== f.value) filter = false;
                        })

                        if (filter) {
                            cursor.delete();
                            resolve();
                        }
                        ;
                        cursor.continue();

                    } else {
                        resolve();
                    }
                };

                cursorRequest.onerror = (errEv: any) => {
                    reject(errEv.target.error);
                };

            };

            this.request.onerror = (event: any) => {
                reject(event.target.error);
            };

        });

    }

    private async createDB() {
        if (!this.dbName) throw new Error('Name db invalid');
        let currentVs = await this.getCurrentVerson();
        if (!currentVs) currentVs = 0;
        this.request = indexedDB.open(this.dbName, currentVs + 1);
    }

    private async openDB() {
        if (!this.dbName) throw new Error('Name db invalid');
        let currentVs = await this.getCurrentVerson();
        this.request = indexedDB.open(this.dbName, currentVs);
    }

    private async getCurrentVerson() {
        if (!this.dbName) throw new Error('Name db invalid');
        const dbs = await indexedDB.databases();
        const db = dbs.find(i => i.name === this.dbName);
        return db ? db.version : 0; // Retorna 0 se o banco não existir
    }

}