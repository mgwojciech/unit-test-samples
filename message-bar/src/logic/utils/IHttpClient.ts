export interface IHttpClient {
    get(url: string, parameters?: any): Promise<IResponse>;
    post(url: string, parameters?: any): Promise<IResponse>;
}
export interface IResponse {
    ok: boolean;
    status: number;
    text: () => Promise<string>;
    json: () => Promise<any>
}