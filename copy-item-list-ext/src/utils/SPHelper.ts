import { Constants } from "../model/Constants";
import { IField } from "../model/IFIeld";

export class SPHelper {
    public static mapFieldValueToSPFormat(field: IField, value: any): any {
        switch (field.TypeAsString) {
            case "UserMulti":
            case "User": {
                return JSON.stringify(value.map(user => {
                    return {
                        key: user.id
                    };
                }));
            }
            case "Choice":{
                return value.text;
            }
            case "MultiChoice":{
                return `;#${value.map(val=>val.text || val).join(";#")};#`;
            }
            case "DateTime":{
                return value.toLocaleDateString();
            }
            case Constants.fieldTypeTaxonomyMulti:{
                return value = value.map(v => `${v.name}|${v.key}`).join(`;`);
            }
            case Constants.fieldTypeTaxonomy:{
                return value = `${value.Label}|${value.TermID}`;
            }
            default:
                return value;
        }
    }
}