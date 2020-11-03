import { IHttpClient } from "./IHttpClient";
import { SPHttpClient } from "@microsoft/sp-http";

export class SharePointHttpClient implements IHttpClient{
    constructor(protected HttpClient: SPHttpClient){

    }
    public get(url: string, parameters?: any): Promise<{ok:boolean, status:number, text: () => Promise<string>,json: () => Promise<any>}> {
          return this.HttpClient.get(url, SPHttpClient.configurations.v1, parameters);
    }    
    public post(url: string, parameters?: any): Promise<{ok:boolean, status:number, text: () => Promise<string>,json: () => Promise<any>}> {
        return this.HttpClient.post(url, SPHttpClient.configurations.v1, parameters);
    }
}