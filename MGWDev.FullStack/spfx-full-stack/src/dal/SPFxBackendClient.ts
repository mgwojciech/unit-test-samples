import { IHttpClient, IHttpClientResponse } from "mgwdev-m365-helpers";
import { AadHttpClient } from "@microsoft/sp-http";

export class SPFxBackendClient implements IHttpClient {
    private _spfxClient: AadHttpClient;
    constructor(spfxClient: AadHttpClient, public backendUrl: string) {
        this._spfxClient = spfxClient;
    }
    public async get(url: string, options?: RequestInit): Promise<IHttpClientResponse> {
        return this._spfxClient.get(this.backendUrl + url, AadHttpClient.configurations.v1, options);
    }

    public async post(url: string, options?: RequestInit): Promise<IHttpClientResponse> {
        return this._spfxClient.post(this.backendUrl + url, AadHttpClient.configurations.v1, options);
    }
    public async patch(url: string, options?: RequestInit): Promise<IHttpClientResponse> {
        throw new Error("Method not implemented.");
    }
    public async put(url: string, options?: RequestInit): Promise<IHttpClientResponse> {
        throw new Error("Method not implemented.");
    }
    public async delete(url: string): Promise<IHttpClientResponse> {
        throw new Error("Method not implemented.");
    }

}