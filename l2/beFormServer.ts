/// <mls shortName="beFormServer" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { BECollabServer } from './_100554_beCollabServer'
import { BeUserRegistration } from './_100554_beUserRegistration'

export class FormServer {

    private server: BECollabServer = new BECollabServer();
    private userRegistration:BeUserRegistration = new BeUserRegistration();

    constructor() {
        this.setRoutes();
    } 

    public startServer() {
        return this.server.start('Server no ar');
    }

    //-----IMPLEMENTS------------

    private setRoutes() {
        this.server.on('beUserRegistration', 'POST', async (body: any) => {
            return await this.userRegistration.onsubmit(body);
        });

        this.server.on('beUserRegistration', 'GET', async (body: any) => {
            return await this.userRegistration.onsubmit({action:'get'});
        });

    }

   
}

(window as any).FormServer = FormServer;  