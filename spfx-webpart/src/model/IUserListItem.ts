import { ISPListItem } from "./ISPListItem";

export interface IUserListItem extends ISPListItem {
    JobTitle: string;
    IsSiteAdmin: boolean;
    EMail: string;
}