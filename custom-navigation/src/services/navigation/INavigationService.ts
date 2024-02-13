import { INavigationNode } from "../../model/INavigationNode";

export interface INavigationService {
    getNavigationNodes(node?: INavigationNode): Promise<INavigationNode[]>;
}