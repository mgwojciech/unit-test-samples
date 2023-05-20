export interface IHttpClient{
    get<T>(url: string): Promise<T>;
    post<T,U>(url: string, data: U): Promise<T>;
}