import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ISPListItem } from "../model/ISPListItem";
import { IListItemProvider } from "./IListItemProvider";
import { SPHttpClient } from "@microsoft/sp-http";

export class SPContextListItemProvider<T extends ISPListItem> implements IListItemProvider<T>{
    constructor(protected context: WebPartContext, protected listName: string) { }

    public async getListItems(): Promise<T[]> {
        const result = await this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.listName}')/items`, SPHttpClient.configurations.v1);
        const resultJson = await result.json();

        return resultJson.value;
    }
    public async getById(id: number): Promise<T> {
        const result = await this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.listName}')/items(${id})`, SPHttpClient.configurations.v1);
        const resultJson = await result.json();

        return resultJson;
    }
}