import { ISPListItem } from "./ISPListItem";
import { IUserListItem } from "./IUserListItem";

export interface IItemWithAuthor extends ISPListItem{
    Author: IUserListItem;
}