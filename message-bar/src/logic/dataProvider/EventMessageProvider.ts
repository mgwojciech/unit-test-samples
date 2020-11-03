import { IMessage } from "./../model/IMessage";
import { IHttpClient } from "./../utils/IHttpClient";
import { SimpleMessage } from "./../model/SimpleMessage";

export interface IEventMessageProvider {
    GetMessages(): Promise<IMessage[]>;
}
export class EventMessageProvider implements IEventMessageProvider {
    constructor(protected HttpClient: IHttpClient,
        protected SiteUrl: string,
        protected ListTitle = "Events") {
        if (SiteUrl === "/")
            this.SiteUrl = "";
    }

    public GetMessages(): Promise<IMessage[]> {
        let url = this.GetEndpointUrl();
        return this.HttpClient.get(url).then(async response => {
            let result = await response.json();
            return result.value.map(listItem => {
                return this.ParseListItem(listItem);
            });
        });
    }
    protected ParseListItem(listItem: { Id: number; Title: string; Link: string; }): SimpleMessage {
        return new SimpleMessage({
            Id: listItem.Id,
            Title: listItem.Title,
            Link: listItem.Link
        });
    }

    protected GetEndpointUrl(): string {
        return `${this.SiteUrl}/_api/web/lists/getByTitle('${this.ListTitle}')/items`;
    }
}


