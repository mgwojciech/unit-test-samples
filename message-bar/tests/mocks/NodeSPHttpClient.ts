import * as spauth from 'node-sp-auth';
import { IAuthOptions, IAuthResponse } from "node-sp-auth";
import * as request from 'request-promise';
import { IResponse } from "./../../src/logic/utils/IHttpClient";
const fs = require('fs');


export class NodeSPHttpClient {
    protected AuthResponse?: IAuthResponse;
    protected Responses: { url: string, body: string, response: string }[] = [];
    public RunAsIntegrations: boolean = false;
    constructor(protected SiteUrl: string, protected CredentialOptions: IAuthOptions) {

    }
    public readInputFile(filePath: string): Promise<void> {
        let self = this;
        return new Promise<void>((resolve, error) => {
            fs.readFile(filePath, "utf8", (err, data) => {
                self.Responses = JSON.parse(data);
                resolve();
            });
        });
    }
    public async get<T>(url: string, version: any, options?: any): Promise<IResponse> {
        if (this.RunAsIntegrations) {
            let authHeader = await this.getAuthenticationHeaders(this.SiteUrl, this.CredentialOptions);
            options = options || {};
            options.headers = { ...options.headers, ...authHeader };
            options.headers.accept = options.headers.accept || "application/json";
            let response = await request.get(url, options);
            this.Responses.push({
                url: url,
                body: options.body ? JSON.stringify(options.body) : null,
                response: response,
            });
            return {
                status: 200,
                ok: true,
                json: () => { return Promise.resolve(response); },
                text: () => { return Promise.resolve(JSON.stringify(response)); }
            }
        }
        let response = this.Responses.filter(resp => resp.url === url)[0];
        return {
            status: 200,
            ok: true,
            json: () => { return Promise.resolve(JSON.parse(response.response)); },
            text: () => { return Promise.resolve(response.response); }};
    }
    public async post<T>(url: string, version: any, options?: any): Promise<IResponse> {
        if (this.RunAsIntegrations) {
            let authHeader = await this.getAuthenticationHeaders(this.SiteUrl, this.CredentialOptions);
            options = options || {};
            options.headers = { ...options.headers, ...authHeader };
            options.headers.accept = options.headers.accept || "application/json";
            let response = await request.post(url, options);
            this.Responses.push({
                url: url,
                body: options.body ? JSON.stringify(options.body) : null,
                response: response,
            });
            return {
                status: 200,
                ok: true,
                json: () => { return Promise.resolve(response); },
                text: () => { return Promise.resolve(JSON.stringify(response)); }
            }
        }
        let response = this.Responses.filter(resp => resp.url === url)[0];
        return {
            status: 200,
            ok: true,
            json: () => { return Promise.resolve(JSON.parse(response.response)); },
            text: () => { return Promise.resolve(response.response); }};
    }

    protected async getAuthenticationHeaders(siteUrl: string, credentialsOptions: IAuthOptions) {
        if (this.AuthResponse) {
            return this.AuthResponse.headers;
        }
        let result: IAuthResponse = await spauth.getAuth(siteUrl, credentialsOptions);
        this.AuthResponse = result;
        return this.AuthResponse.headers;
    }
    public save(filePath: string): Promise<void> {
        return new Promise<void>((resolve, error) => {
            fs.writeFile(filePath, JSON.stringify(this.Responses), [resolve])
        })
    }
}