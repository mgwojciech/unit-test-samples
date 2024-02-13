import { SPListItemCamlPagedDataProvider } from "mgwdev-m365-helpers/lib/dal/dataProviders/SPListItemCamlPagedDataProvider";
import { CamlQueryBuilder } from "mgwdev-m365-helpers/lib/utils/queryBuilders/CamlQueryBuilder";
import { INavigationService } from "./INavigationService";
import { INavigationNode, ISPNavigationNode } from "../../model/INavigationNode";

export class ListNavigationService implements INavigationService {
    constructor(protected listItemService: SPListItemCamlPagedDataProvider<ISPNavigationNode>) {
        listItemService.pageSize = 100;
        listItemService.recursive = false;
    }
    public async getNavigationNodes(node?: INavigationNode): Promise<INavigationNode[]> {
        const queryBuilder = new CamlQueryBuilder();
        queryBuilder.withFieldQuery({
            name: "_ModernAudienceTargetUserField",
            type: "UserMulti",
            value: "",
            comparer: "CurrentUserGroups"
        });
        queryBuilder.withFieldQuery({
            name: "_ModernAudienceTargetUserField",
            type: "UserMulti",
            value: "",
            comparer: "IsNull"
        }, "Or");
        if (node) {
            queryBuilder.withFieldQuery({
                name: "FileDirRef",
                type: "Text",
                value: node.fileDirRef + "/" + node.fileLeafRef,
                comparer: "Eq"
            }, "And");
        }
        this.listItemService.recursive = !!node;
        this.listItemService.setQuery(queryBuilder.build());
        return (await this.listItemService.getData()).map(item=>({
            title: item.Title,
            url: item.URL,
            fileDirRef: item.FileDirRef,
            fileLeafRef: item.FileLeafRef,
            childCount: item.ItemChildCount + item.FolderChildCount,
            id: item.ID
        }))
    }
}