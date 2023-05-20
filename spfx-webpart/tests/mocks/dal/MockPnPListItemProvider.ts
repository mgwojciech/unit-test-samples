import { SPFI } from "@pnp/sp";
import { ISPListItem } from "../../../src/model/ISPListItem";
import { IListItemProvider } from "../../../src/dal/IListItemProvider";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export class PnPListItemProvider<T extends ISPListItem> implements IListItemProvider<T>{
    
    constructor(protected spfi: SPFI, protected listName: string) { }
    
    public getListItemsResult?: T[];
public on_getListItems?: ()=>T[];
public async getListItems(): Promise<T[]> {
        return await this.spfi.web.lists.getByTitle(this.listName).items()
    }{
let result = this.getListItemsResult;
if(this.on_getListItems){
result = this.on_getListItems();
}
//@ts-ignore
return Promise.resolve(result);
}
    public getByIdResult?: T;
public on_getById?: (id: number)=>T;
public async getById(id: number): Promise<T> {
        return await this.spfi.web.lists.getByTitle(this.listName).items.getById(id)()
    }{
let result = this.getByIdResult;
if(this.on_getById){
result = this.on_getById(id);
}
//@ts-ignore
return Promise.resolve(result);
}
}