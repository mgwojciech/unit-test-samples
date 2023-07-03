import { IHttpClient, IHttpClientResponse } from "mgwdev-m365-helpers";

export class SPClient implements IHttpClient {
    constructor(protected baseClient: IHttpClient, protected baseUrl: string) {
    }
    public async get(url: string, options?: RequestInit | undefined): Promise<IHttpClientResponse> {
        let response = await this.baseClient.get(this.baseUrl + url, this.addDefaultOptions(options));
        return response;
    }
    public async post(url: string, options?: RequestInit | undefined): Promise<IHttpClientResponse> {
        let response = await this.baseClient.post(this.baseUrl + url, this.addDefaultOptions(options));
        return response;
    }
    public async patch(url: string, options?: RequestInit | undefined): Promise<IHttpClientResponse> {
        let response = await this.baseClient.patch(this.baseUrl + url, this.addDefaultOptions(options));
        return response;
    }
    public async put(url: string, options?: RequestInit | undefined): Promise<IHttpClientResponse> {
        let response = await this.baseClient.put(this.baseUrl + url, this.addDefaultOptions(options));
        return response;
    }
    public async delete(url: string): Promise<IHttpClientResponse> {
        let response = await this.baseClient.delete(this.baseUrl + url);
        return response;
    }

    private addDefaultOptions(options?: RequestInit | undefined): RequestInit | undefined {
        return{
            ...options,
            headers: {
                ...options?.headers,
            }
        }
    }
}