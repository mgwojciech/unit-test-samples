import { ISPListItem } from "../model/ISPListItem";

export interface IListItemProvider<T extends ISPListItem> {
    getListItems(): Promise<T[]>;
    getById(id: number): Promise<T>;
}
