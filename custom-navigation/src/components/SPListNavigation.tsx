import * as React from "react";
import { useSP } from "../context";
import { SPListItemCamlPagedDataProvider } from "mgwdev-m365-helpers/lib/dal/dataProviders/SPListItemCamlPagedDataProvider";
import { ISPNavigationNode } from "../model/INavigationNode";
import { ListNavigationService } from "../services/navigation/ListNavigationService";
import { Navigation } from "./Navigation";

export interface ISPListNavigationProps {
    listId: string;
    classNames?: {
        root?: string;
        rootItemsContainer?: string;
        navigationNode?: string;
    }
}

export function SPListNavigation(props: ISPListNavigationProps) {
    const { spClient, siteUrl } = useSP();
    const navigationService = React.useMemo(() => {

        const listItemService = new SPListItemCamlPagedDataProvider<ISPNavigationNode>(spClient,
            siteUrl,
            props.listId,
            ["Title", "URL", "FileDirRef", "FileLeafRef", "ItemChildCount", "FolderChildCount", "ID"]);
        return new ListNavigationService(listItemService)
    }, [props.listId, siteUrl, spClient])

    return <Navigation {...props} navigationService={navigationService} onNodeClick={(node) => {
        console.log(node);
    }} />
}