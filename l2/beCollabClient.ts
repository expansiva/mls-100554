/// <mls shortName="beCollabClient" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export class BECollabClient {

    private serverIframe = (window as any).previewL1 as HTMLIFrameElement;
    private requestId = 0;
    private callbacks:{[key:number]:{resolve:any, reject:any}} = {};

    constructor() {

        this.init();
        
    }

    public request(path:string, method:IMethod = "GET", body:any = null) {

        return new Promise((resolve, reject) => {
            
            if(!this.serverIframe || !this.serverIframe.contentWindow) return;

            const id = this.requestId++;
            this.callbacks[id] = { resolve, reject };

            this.serverIframe.contentWindow.postMessage({ id, path, method, body }, "*");

            setTimeout(() => {
                if (this.callbacks[id]) {
                    reject(new Error("Timeout na requisição"));
                    delete this.callbacks[id];
                }
            }, 5000);

        });

    }

    private init(){
        if(!this.serverIframe) throw new Error('Not found server');
        window.addEventListener("message", (event) => this.handleResponse(event));
    }

   
    private handleResponse(event:any) {
        
        const { id, response, error } = event.data;

        if (this.callbacks[id]) {
            if (error) {
                this.callbacks[id].reject(new Error(error));
            } else {
                this.callbacks[id].resolve(response);
            }
            delete this.callbacks[id];
        }
    }
}

export type IMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';