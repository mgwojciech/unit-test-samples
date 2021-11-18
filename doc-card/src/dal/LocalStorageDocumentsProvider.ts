import { IDocument } from "../model/IDocument";
import { IDocumentsProvider } from "./IDocumentsProvider";

export class LocalStorageDocumentsProvider implements IDocumentsProvider {
    constructor(protected baseProvider: IDocumentsProvider, protected storageKey: string) {

    }
    public async getDocuments(): Promise<IDocument[]> {
        let storedData = localStorage.getItem(this.storageKey);
        if (storedData) {
            return JSON.parse(storedData);
        }
        else {
            let documents = await this.baseProvider.getDocuments();
            localStorage.setItem(this.storageKey, JSON.stringify(documents));
            return documents;
        }
    }
}