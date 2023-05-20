import * as React from "react";
import { ItemsWithAuthorDetailsManager } from "../manager/ItemsWithAuthorDetailsManager";
import { IItemWithAuthor } from "../model/IItemWithAuthor";
import { Checkbox, Spinner, Stack } from "office-ui-fabric-react";

export interface IItemsWithAdminInfoProps {
    manager: ItemsWithAuthorDetailsManager;
}

export function ItemsWithAdminInfo(props: IItemsWithAdminInfoProps): JSX.Element {
    const [loading, setLoading] = React.useState(true);
    const [items, setItems] = React.useState<IItemWithAuthor[]>([]);

    React.useEffect(() => {
        props.manager.getItemsWithAuthorDetails().then((items) => {
            setItems(items);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Spinner data-testId="spinner" />;
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