import { IDocument } from "../model/IDocument";

export interface IDocumentsProvider{
    getDocuments():Promise<IDocument[]>;
}