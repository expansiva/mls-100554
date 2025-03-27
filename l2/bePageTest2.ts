/// <mls shortName="bePageTest2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { BECollabServer } from './_100554_beCollabServer'
import { BEIndexedDBBase } from './_100554_beIndexedDBBase'

export class Test {

    private server: BECollabServer = new BECollabServer();
    private indexDb = new BEIndexedDBBase();

    constructor() {
        this.setRoutes();
        this.initDB();
    }

    public startServer() {
        return this.server.start('Server no ar');
    }

    //-----IMPLEMENTS------------

    private setRoutes() {
        this.server.on('/api/user', 'POST', async (body: any) => {
            console.log('Caiu api add user');
            return await this.addUser(body);
        });

        this.server.on('/api/user', 'PUT', async (body: any) => {
            console.log('Caiu api upd user');
            return await this.updUser(body);
        });

        this.server.on('/api/user', 'DELETE', async (body: any) => {
            console.log('Caiu api del user');
            return await this.delUser(body);
        });

        this.server.on('/api/user', 'GET', async (body: any) => {
            console.log('Caiu api get user');
            return await this.getUser(body);
        });
    }

    private initDB() {
        this.indexDb.dbName = 'dbTest';
        const tbUser:any = [
            {
                field: 'id',
                tp: 'NUMBER',
                primaryKey: true,
                autoIncrement: true,
            },
            {
                field: 'nome',
                tp: 'STRING',
                primaryKey: false,
                autoIncrement: false,
            },
            {
                field: 'senha',
                tp: 'STRING',
                primaryKey: false,
                autoIncrement: false,
            }
        ];
        
        this.indexDb.createTable('user', tbUser);
    }

    private async addUser(info:any){

        return await this.indexDb.post('user', info);

    }

    private async updUser(info:any){
        return await this.indexDb.put('user', info);
    }

    private async getUser(nome:string){
        let bd:any = [];
        if(nome) bd = [{field:'nome', value:nome}];
        return await this.indexDb.get('user', bd);

    }

    private async delUser(id:string){

        if(!id) throw new Error('not found id');
        let bd = [{field:'id', value:+id}];
        return await this.indexDb.delete('user', bd);

    }
}

(window as any).Test = Test;  