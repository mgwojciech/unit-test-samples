import { Constants } from "../../model/Constants";
import { IField, IFieldValue } from "../../model/IFIeld";
import { IFieldValueMapper } from "./IFieldValueMapper";

export class LookupFieldValueMapper implements IFieldValueMapper {
    public supportedFieldTypes: string[] = [Constants.fieldTypeLookup];

    public mapFieldValue(item: any, field: IField): IFieldValue {
        return {
            name: field.InternalName,
            type: field.TypeAsString,
            value: `${item[field.InternalName].ID};#${item[field.InternalName].Title}`//2;#Test SubService 1
        };
    }

}