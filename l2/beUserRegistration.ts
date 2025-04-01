/// <mls shortName="beUserRegistration" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { BEIndexedDBBase } from './_100554_beIndexedDBBase'

export class BeUserRegistration {

    private indexDb = new BEIndexedDBBase();

    constructor() {
        this.initDB();
    }

    public async onsubmit(body: any): Promise<any> {

        return new Promise<any>(async (resolve, reject) => {

            if (!body.action) {
                reject('Action not implemented');
                return;
            }

            try {

                let ret = '';
                switch (body.action) {

                    case 'new': await this.addUser(body); ret = 'Add user'; break;
                    case 'save': await this.updUser(body); ret = 'Update user'; break;
                    case 'del': await this.delUser(body); ret = 'Delete user'; break;
                    case 'get': ret = await this.getUser(''); break;
                    default: throw new Error('Action not implemented');
                }

                resolve(ret);

            } catch (e:any) {

                reject('Error: '+e.message);

            }


        });


    }


    //-----IMPLEMENTS------------

    private initDB() {
        this.indexDb.dbName = 'dbTest';
        const tbUser: any = [
            {
                field: 'id',
                tp: 'NUMBER',
                primaryKey: true,
                autoIncrement: true,
            },
            {
                field: 'user',
                tp: 'STRING',
                primaryKey: false,
                autoIncrement: false,
            },
            {
                field: 'status',
                tp: 'STRING',
                primaryKey: false,
                autoIncrement: false,
            }
        ];

        this.indexDb.createTable('user', tbUser);
    }

    private async addUser(info: any) {

        delete info.selected.id;
        return await this.indexDb.post('user', info.selected);

    }

    private async updUser(info: any) {
        return await this.indexDb.put('user', info.selected);
    }

    private async getUser(nome: string) {
        let bd: any = [];
        if (nome) bd = [{ field: 'nome', value: nome }];
        return await this.indexDb.get('user', bd);

    }

    private async delUser(info: any) {

        if (!info.selected || !info.selected.id) throw new Error('not found id');
        let bd = [{ field: 'id', value: +info.selected.id }];
        return await this.indexDb.delete('user', bd);

    }
}
