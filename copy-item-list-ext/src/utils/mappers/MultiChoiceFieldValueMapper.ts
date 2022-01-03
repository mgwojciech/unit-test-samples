import { Constants } from "../../model/Constants";
import { IField, IFieldValue } from "../../model/IFIeld";
import { SPHelper } from "../SPHelper";
import { IFieldValueMapper } from "./IFieldValueMapper";

export class MultiChoiceFieldValueMapper implements IFieldValueMapper {
    public supportedFieldTypes: string[] = [Constants.fieldTypeChoiceMulti];

    public mapFieldValue(item: any, field: IField): IFieldValue {
        let value = SPHelper.mapFieldValueToSPFormat(field, item[field.InternalName]);
        return {
            name: field.InternalName,
            type: field.TypeAsString,
            value
        };
    }
}