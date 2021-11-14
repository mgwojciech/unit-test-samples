import { IPageProvider } from "./IPageProvider";
import { SPHttpClient } from "@microsoft/sp-http";
import { ISPPage } from "../model/ISPPage";

export class SPPageProvider implements IPageProvider {
    constructor(private spHttpClient: SPHttpClient, private listId, protected webUrl: string) {

     }

    public async getPage(pageId: number): Promise<ISPPage> {
        let url = `${this.webUrl}_api/web/lists/${this.listId}/items(${pageId})`;
        let response = await this.spHttpClient.get(url, SPHttpClient.configurations.v1);
        if(response.ok){
            return await response.json();
        }
        throw new Error(`Error getting page ${pageId}`);
    }
} 