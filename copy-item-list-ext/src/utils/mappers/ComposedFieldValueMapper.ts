import { IField, IFieldValue } from "../../model/IFIeld";
import { BooleanFieldValueMapper } from "./BooleanFieldValueMapper";
import { DateTimeFieldValueMapper } from "./DateTimeFieldValueMapper";
import { IFieldValueMapper } from "./IFieldValueMapper";
import { LookupFieldValueMapper } from "./LookupFieldValueMapper";
import { MultiChoiceFieldValueMapper } from "./MultiChoiceFieldValueMapper";
import { TaxonomyFieldValueMapper } from "./TaxonomyFieldValueMapper";
import { MultiUserFieldValueMapper } from "./UserFieldValueMapper";

export class ComposedFieldValueMapper implements IFieldValueMapper {
    public fieldValueMappers: IFieldValueMapper[] = [
        new DateTimeFieldValueMapper(),
        new LookupFieldValueMapper(),
        new BooleanFieldValueMapper(),
        new MultiUserFieldValueMapper(),
        new TaxonomyFieldValueMapper(),
        new MultiChoiceFieldValueMapper()
    ];
    public supportedFieldTypes: string[] = [];
    constructor() {
        this.fieldValueMappers.forEach(fld => this.supportedFieldTypes.push(...fld.supportedFieldTypes));
    }
    public mapFieldValue(item: any, field: IField): IFieldValue {
        let mapper = this.fieldValueMappers.filter(fld => fld.supportedFieldTypes.indexOf(field.TypeAsString) >= 0)[0];
        if (mapper) {
            return mapper.mapFieldValue(item, field);
        }
        else {
            return {
                name: field.InternalName,
                type: field.TypeAsString,
                value: item[field.InternalName]
            };
        }
    }
}