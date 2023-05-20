import { SPFI } from "@pnp/sp";
import { ISPListItem } from "../model/ISPListItem";
import { IListItemProvider } from "./IListItemProvider";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export class PnPListItemProvider<T extends ISPListItem> implements IListItemProvider<T>{
    
    constructor(protected spfi: SPFI, protected listName: string) { }
    
    public async getListItems(): Promise<T[]> {
        return await this.spfi.web.lists.getByTitle(this.listName).items();
    }
    public async getById(id: number): Promise<T> {
        return await this.spfi.web.lists.getByTitle(this.listName).items.getById(id)();
    }
}