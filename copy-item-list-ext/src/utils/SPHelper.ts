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
            case "DateTime":{
                return value.toLocaleDateString();
            }
            default:
                return value;
        }
    }
}