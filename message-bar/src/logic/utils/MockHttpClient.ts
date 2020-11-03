import { IHttpClient } from "./IHttpClient";

export class MockHttpClient implements IHttpClient{
    public GetRequests: {requestUrl: string, response: string}[] = [];
    public PostRequests: {requestUrl: string, response: string}[] = [];
    public OnRequest: (url:string, options?:any)=>void;
    public get(url: string, options?: any): Promise<{ ok: boolean, status: number, text: () => Promise<string>,json: () => Promise<any> }>{
        if(this.OnRequest){
            this.OnRequest(url,options);
        }
        return this.ResolveFromArray(url, this.GetRequests);
    }
    public post(url: string, options?: any): Promise<{ ok: boolean, status: number, text: () => Promise<string>,json: () => Promise<any> }>{
        if(this.OnRequest){
            this.OnRequest(url,options);
        }
        return this.ResolveFromArray(url, this.PostRequests);
    }
    private ResolveFromArray(url: string, requests: {requestUrl: string, response: string}[]) {
        let self = this;
        return new Promise<{
            ok: boolean; 
            status: number;
            text: () => Promise<string>;
            json: () => Promise<any>;
        }>((resolve, error) => {
            let requestedResource = requests.filter((request) => {
                return request.requestUrl === url;
            })[0];
            if (requestedResource) {
                resolve({
                    ok: true,
                    status: 200,
                    text: () => {
                        return Promise.resolve(requestedResource.response);
                    },
                    json: () => {
                        return Promise.resolve(JSON.parse(requestedResource.response));
                    }
                });
            }
            else {
                console.log(`Url: ${url} not found`);
                error("Not found!");
            }
        });
    }
    public AddOrUpdate(url:string, value: string, addToGetRequests: boolean = true){
        let requests = addToGetRequests ? this.GetRequests : this.PostRequests;
        let requestedResource = requests.filter((request) => {
            return request.requestUrl === url;
        })[0];
        if(requestedResource){
            requestedResource.response = value;
        }
        else{
            requests.push({
                requestUrl:url,
                response: value
            });
        }
    }
}