import { IHttpClient } from "mgwdev-m365-helpers/lib/dal/http/IHttpClient";
import { SPSearchDataProvider } from "mgwdev-m365-helpers/lib/dal/dataProviders/SPSearchDataProvider";
import * as React from "react";
import { Input, Spinner } from "@fluentui/react-components";
import { SPDocument } from "../model/SPDocument";
import { DocumentCard } from "./DocumentCard";
import { useSearchClassNames } from "./SearchStyles";

export type SearchWebProps = {
    webId: string;
    spHttpClient: IHttpClient;
    webUrl: string;
}

export function SearchWeb(props: SearchWebProps) {
    const classNames = useSearchClassNames();
    const [searchText, setSearchText] = React.useState<string>("");
    const [searchResults, setSearchResults] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const searchClient = React.useRef<SPSearchDataProvider<SPDocument>>(
        new SPSearchDataProvider("/_api/search/postquery",
            props.spHttpClient,
            [
                "Path",
                "Title",
                "BannerImageUrlOWSURLH",
                "PictureThumbnailURL",
                "Description",
                "LastModifiedTime",
                "AuthorOWSUSER",
                "EditorOWSUSER",
                "ListID",
                "ListItemID",
                "UniqueId",
                "DepartmentId",
                "NormUniqueId",
                "SiteId",
                "HitHighlightedSummary",
                "ModifiedBy"
            ],
            `{searchTerms} AND WebId:${props.webId} AND IsDocument:1 -.aspx`)
    ).current;
    searchClient.setRefiners([{
        field: "FileType",
        size: 10
    }, {
        field: "DisplayAuthor"
    }]);

    const getData = async (query: string) => {
        setIsLoading(true);
        searchClient.setQuery(query || "*");
        const results = await searchClient.getData();
        setSearchResults(results);
        setIsLoading(false);
    }

    React.useEffect(() => {
        getData(searchText);
    }, []);

    return <div>
        <div>
            <Input
                value={searchText}
                onChange={(ev, data) => {
                    setSearchText(data.value);
                    getData(data.value || "*");
                }}
                placeholder="Search"
            />
        </div>
            {isLoading && <Spinner />}
        <div className={classNames.grid}>
            {searchResults.map((result, index) => {
                return <DocumentCard key={index} document={result} />
            })}
        </div>
    </div>
}