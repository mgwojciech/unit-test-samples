import { WebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import { IItemWithAuthor } from "../model/IItemWithAuthor";
import { Checkbox, Spinner, Stack } from "office-ui-fabric-react";
import { SPFx, spfi, SPFI } from "@pnp/sp";
import { PnPListItemProvider } from "../dal/PnPListItemProvider";
import { ISPListItem } from "../model/ISPListItem";
import { IUserListItem } from "../model/IUserListItem";
import { ItemsWithAuthorDetailsManager } from "../manager/ItemsWithAuthorDetailsManager";

export interface IComplexComponentProps {
    context: WebPartContext;
}

export function ComplexComponent(props: IComplexComponentProps): JSX.Element {
    const [loading, setLoading] = React.useState(true);
    const [items, setItems] = React.useState<IItemWithAuthor[]>([]);

    const loadItems: ()=>Promise<IItemWithAuthor[]> = async () => {
        const sp: SPFI = spfi().using(SPFx(props.context));
        const itemsProvider = new PnPListItemProvider<ISPListItem>(sp, "Documents");
        const usersProvider = new PnPListItemProvider<IUserListItem>(sp, "User Information List");

        const manager = new ItemsWithAuthorDetailsManager(itemsProvider, usersProvider);
        return await manager.getItemsWithAuthorDetails();
        
    }
    React.useEffect(() => {
        loadItems().then((items) => {
            setItems(items);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
            setLoading(false);
        });
    }, []);

    
    if (loading) {
        return <Spinner />;
    }
    return <Stack>
        {items.map((item) => {
            return <Stack horizontal key={item.Id}>
                <Stack.Item>{item.Title}</Stack.Item>
                <Stack.Item>{item.Author.Title}</Stack.Item>
                <Stack.Item>{item.Author.JobTitle}</Stack.Item>
                <Stack.Item>{<Checkbox label="Is admin" disabled checked={item.Author.IsSiteAdmin} />}</Stack.Item>
            </Stack>
        })}
    </Stack>
}