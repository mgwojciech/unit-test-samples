import { IEventMessageProvider } from "./EventMessageProvider";
import { IMessage } from "./../model/IMessage";
import { IHttpClient } from "./../utils/IHttpClient";

export class SPEventMessageProvider implements IEventMessageProvider {
    constructor(protected siteUrl: string, protected HttpClient: IHttpClient, protected FilterDate: Date = new Date()) {

    }
    public async GetMessages(): Promise<IMessage[]> {
        let url = this.GetEndpointUrl();
        let response = await this.HttpClient.get(url);
        let results = await response.json();
        return results.value;
    }
    protected GetEndpointUrl(): string {
        return `${this.siteUrl}/_api/web/lists/getByTitle('Events')/items
        ?$filter=EventDate gt '${this.FilterDate.toISOString()}'&$top=3`;
    }
}