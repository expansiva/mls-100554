/// <mls shortName="beCollabServer" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export class BECollabServer { 

    private routes: IRoutes = {
        'GET': {},
        'POST': {},
        'PATCH': {},
        'PUT': {},
        'DELETE': {}, 
    };

    //--------METHODS----------------- 

    public on(path: string, methods: IMethod, handler: Function) {
        this.routes[methods][path] = handler;
    }

    public start(msg: string): string {

        try {  
            window.addEventListener("message", (event) => {this.handleRequest(event)});
            return msg || 'Collab server start';  

        } catch (e: any) {
            return e.message;
        }

    } 

    //--------IMPLEMENTATION----------

    private async handleRequest(event: any) {

        const { id, path, method, body } = event.data;

        const r = (this.routes as any)[method];

        if (!r || !r[path]) {
            return event.source.postMessage({ id, error: "Route not found: " + path }, "*");
        }

        try {
            const response = await r[path](body);
            event.source.postMessage({ id, response }, "*");
        } catch (error: any) {
            event.source.postMessage({ id, error: error.message }, "*");
        }
    }


}

export type IMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface IRoutes {
    'GET': { [key: string]: Function },
    'POST': { [key: string]: Function },
    'PATCH': { [key: string]: Function },
    'PUT': { [key: string]: Function },
    'DELETE': { [key: string]: Function },
}
