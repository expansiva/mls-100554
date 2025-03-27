/// <mls shortName="bePageTest2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { BECollabServer } from './_100554_beCollabServer'

export class Test {

    private server: BECollabServer = new BECollabServer();
 
    constructor() {
        this.setRoutes(); 
    }   
  
    public startServer(){
        return this.server.start('Server no ar');  
    } 

    //-----IMPLEMENTS------------

    private setRoutes() {
        this.server.on('/api/test', 'POST', async ( body:any ) => { 
            console.log('POST');
            return { message: "Recebi os dados!", data: body };  
        }); 
        
        this.server.on('/api/test', 'GET', async ( body:any ) => {
            console.log('GET'); 
            return { message: "AQUI O RETORNO" };  
        });
    } 
} 

(window as any).Test = Test;  