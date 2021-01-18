import { IField, IFieldValue } from "../../model/IFIeld";

export interface IFieldValueMapper {
    supportedFieldTypes: string[];
    mapFieldValue(item: any, field: IField): IFieldValue;
}