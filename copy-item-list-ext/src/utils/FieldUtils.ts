import { ListViewCommandSetContext } from "@microsoft/sp-listview-extensibility";
import { SPHttpClient } from "@microsoft/sp-http";
import { IField } from "../model/IFIeld";

export class FieldUtils {
    public excludedFields = ["Attachments", "ContentType","Predecessors"];
    constructor(protected context: ListViewCommandSetContext) {

    }
    public getListFields: () => Promise<IField[]> = async () => {
        let url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${this.context.pageContext.list.id}')/fields?$filter=Hidden eq false and ReadOnlyField eq false&$select=Choices,Title,InternalName,TypeAsString,Description,SspId,TermSetId`;
        let response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
        let formattedResponse = await response.json();

        let result: IField[] = formattedResponse.value;
        this.excludedFields.forEach(fld => this.tryToRemoveField(fld, result));

        return result;
    }
    protected tryToRemoveField = (fieldName: string, result: IField[]) => {
        let attachmentField = result.filter(fld => fld.InternalName === fieldName)[0];
        if (attachmentField) {
            result.splice(result.indexOf(attachmentField), 1);
        }
    }
}