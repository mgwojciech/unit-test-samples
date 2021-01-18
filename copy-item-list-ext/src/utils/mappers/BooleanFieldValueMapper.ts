import { Constants } from "../../model/Constants";
import { IField, IFieldValue } from "../../model/IFIeld";
import { IFieldValueMapper } from "./IFieldValueMapper";

export class BooleanFieldValueMapper implements IFieldValueMapper {
    public supportedFieldTypes: string[] = [Constants.fieldTypeBoolean];
    public mapFieldValue(item: any, field: IField): IFieldValue {
        return {
            name: field.InternalName,
            type: field.TypeAsString,
            value: item[field.InternalName] ? "Yes" : "No"
        };
    }

}