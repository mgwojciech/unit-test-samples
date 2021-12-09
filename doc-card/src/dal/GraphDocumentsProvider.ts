import { IDocument } from "../model/IDocument";
import { IDocumentsProvider } from "./IDocumentsProvider";
import { MSGraphClient } from "@microsoft/sp-http";
import { Log } from "@microsoft/sp-core-library";
import { useStorage, queueRequest } from "../utils/FunctionUtils";

export class GraphDocumentsProvider implements IDocumentsProvider {

    constructor(protected msGraphClient: MSGraphClient) {

    }
    @useStorage("documents")
    @queueRequest("GraphDocumentsProvider.getDocument")
    public async getDocuments(): Promise<IDocument[]> {
        try {
            let searchResult = await this.msGraphClient.api("https://graph.microsoft.com/v1.0/search/query").post({
                "requests": [
                    {
                        "entityTypes": [
                            "listItem"
                        ],
                        "query": {
                            "queryString": "IsDocument:1 -*.aspx -.mht"
                        },
                        "from": 0,
                        "size": 5,
                        "fields": [
                            "id",
                            "name",
                            "contentclass",
                            "title",
                            "path"
                        ]
                    }
                ]
            });
            if (searchResult.value[0]) {
                return searchResult.value[0].hitsContainers[0].hits.map(hit => ({
                    id: hit.resource.id,
                    title: hit.resource.fields.title,
                    url: hit.resource.fields.path
                }));
            }
        }
        catch (err) {
            Log.error("GraphDocumentsProvider.getDocuments", err);
            throw err;
        }
    }
}