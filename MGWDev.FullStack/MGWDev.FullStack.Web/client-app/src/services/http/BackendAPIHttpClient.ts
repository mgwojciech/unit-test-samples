import { IHttpClient, IHttpClientResponse } from "mgwdev-m365-helpers/lib/dal/http/IHttpClient";
import { queueRequest } from "mgwdev-m365-helpers/lib/utils/FunctionUtils";

export class BackendAPIHttpClient implements IHttpClient{
    constructor(protected baseClient: IHttpClient, protected baseUrl: string) {
    }
    public async get(url: string, options?: RequestInit | undefined): Promise<IHttpClientResponse> {
        await this.ensureAuthCookie();
        let response = await this.baseClient.get(this.baseUrl + url, this.addRedirectOption(options));
        this.ensureResponse(response);
        return response;
    }
    public async post(url: string, options?: RequestInit | undefined): Promise<IHttpClientResponse> {
        await this.ensureAuthCookie();
        let response = await this.baseClient.post(this.baseUrl + url, this.addRedirectOption(options));
        this.ensureResponse(response);
        return response;
    }
    public async patch(url: string, options?: RequestInit | undefined): Promise<IHttpClientResponse> {
        await this.ensureAuthCookie();
        let response = await this.baseClient.patch(this.baseUrl + url, this.addRedirectOption(options));
        this.ensureResponse(response);
        return response;
    }
    public async put(url: string, options?: RequestInit | undefined): Promise<IHttpClientResponse> {
        await this.ensureAuthCookie();
        let response = await this.baseClient.put(this.baseUrl + url, this.addRedirectOption(options));
        this.ensureResponse(response);
        return response;
    }
    public async delete(url: string): Promise<IHttpClientResponse> {
        await this.ensureAuthCookie();
        let response = await this.baseClient.delete(this.baseUrl + url);
        this.ensureResponse(response);
        return response;
    }

    protected addRedirectOption(options?: RequestInit): RequestInit {
        if(!options){
            options = {};
        }
        options.redirect = "manual";
        return options;
    }
    //queueing request with the same key as getAccessToken method in TokenBrokerAuthService
    @queueRequest("getAccessToken")
    protected async ensureAuthCookie(): Promise<void> {
        if(!document.cookie.match(/^(.*;)?\s*\.AspNetCore\.Cookies\s*=\s*[^;]+(.*)?$/)){
            //window.location.href = (this.baseUrl || window.location.origin) + "/login";
        }
    }
    protected async ensureResponse(response: IHttpClientResponse) {
        //just in case cookie is expired
        if(response.status === 0 || response.status === 302 || response.status === 401){
            //window.location.href = this.baseClient + "/login";
        }
    }
}