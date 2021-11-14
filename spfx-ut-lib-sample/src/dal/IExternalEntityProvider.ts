import { IExternalEntity } from "../model/IExternalEntity";

export interface IExternalEntityProvider{
    getExternalEntities(): Promise<IExternalEntity[]>;
}