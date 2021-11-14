import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IExternalEntity } from "../model/IExternalEntity";
import { IExternalEntityProvider } from "./IExternalEntityProvider";
import { SPHttpClient, HttpClient } from '@microsoft/sp-http';

export class ExternalEntityProvider implements IExternalEntityProvider {
    constructor(protected context: WebPartContext) {
    }
    public async getExternalEntities(): Promise<IExternalEntity[]> {
        let externalEndpointConfig = await this.getExternalEntityEndpointConfiguration();
        let token = await (await this.context.aadTokenProviderFactory.getTokenProvider()).getToken(externalEndpointConfig.appUri);
        let response = await this.context.httpClient.get(externalEndpointConfig.url + "/api/ExternalEntities", HttpClient.configurations.v1, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if(response.ok){
            return await response.json();
        }
    }
    protected async getExternalEntityEndpointConfiguration(): Promise<{
        url: string,
        appUri: string,
    }> {
        const storageKeyUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/GetStorageEntity('ExternalEntityEndpointUrl')`;
        const storageKeyAppUri = `${this.context.pageContext.web.absoluteUrl}/_api/web/GetStorageEntity('ExternalEntityEndpointAppUri')`;
        let responses = await Promise.all([
            this.context.spHttpClient.get(storageKeyUrl, SPHttpClient.configurations.v1).then(r => r.json()),
            this.context.spHttpClient.get(storageKeyAppUri, SPHttpClient.configurations.v1).then(r => r.json())]);

        return {
            url: responses[0].Value,
            appUri: responses[1].Value
        }
    }
}