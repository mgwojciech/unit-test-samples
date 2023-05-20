import { IHttpClient } from "./IHttpClient";
import { SPHttpClient } from "@microsoft/sp-http";

export class SPFxSPHttpClient implements IHttpClient{
    constructor(protected spHttpClient: SPHttpClient){}

    public async get<T>(url: string): Promise<T>{
        const result = await this.spHttpClient.get(url, SPHttpClient.configurations.v1);
        if(result.ok){
            return await result.json();
        }
        else{
            throw new Error(result.statusText);
        }
    }

    public async post<T,U>(url: string, data: U): Promise<T> {
        const result = await this.spHttpClient.post(url, SPHttpClient.configurations.v1, {
            body: JSON.stringify(data)
        });
        if(result.ok){
            return await result.json();
        }
        else{
            throw new Error(result.statusText);
        }
    }
}