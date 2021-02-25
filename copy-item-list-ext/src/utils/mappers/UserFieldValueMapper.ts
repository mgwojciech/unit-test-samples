import { Constants } from "../../model/Constants";
import { IField, IFieldValue } from "../../model/IFIeld";
import { IFieldValueMapper } from "./IFieldValueMapper";

export class MultiUserFieldValueMapper implements IFieldValueMapper{
    public supportedFieldTypes: string[] = [Constants.fieldTypeUserMulti,Constants.fieldTypeUser];
    public mapFieldValue(item: any, field: IField): IFieldValue {
        return {
            name: field.InternalName,
            type: field.TypeAsString,
            value: JSON.stringify(item[field.InternalName].map(user=>({
                key: user.email
            })))
        };
    }
}