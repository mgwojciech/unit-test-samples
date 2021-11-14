import { ISPPage } from "../model/ISPPage";

export interface IPageProvider {
    getPage(pageId: number): Promise<ISPPage>;
}