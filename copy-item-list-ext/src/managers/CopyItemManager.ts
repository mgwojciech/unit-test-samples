import { ListViewCommandSetContext } from "@microsoft/sp-listview-extensibility";
import { IField, IFieldValue } from "../model/IFIeld";
import { ListItemUtility } from "../utils/ListItemUtility";
import { FieldUtils } from "../utils/FieldUtils";
import { IFieldValueMapper } from "../utils/mappers/IFieldValueMapper";
import { ComposedFieldValueMapper } from "../utils/mappers/ComposedFieldValueMapper";

export class CopyItemManager {
    public fields: IField[];
    public listItemUtil: ListItemUtility;
    public fieldUtils: FieldUtils;
    protected fieldMapper: IFieldValueMapper = new ComposedFieldValueMapper();
    constructor(protected context: ListViewCommandSetContext) {
        this.listItemUtil = new ListItemUtility(context);
        this.fieldUtils = new FieldUtils(context);
    }

    public loadListInfo = async () => {
        this.fields = await this.fieldUtils.getListFields();
    }

    public copyItems = (itemsIds: string[], fieldsToCopyNames: string[], fieldToUpdate: IFieldValue[]) => {
        let fieldsToCopy = this.fields.filter(fld => fieldsToCopyNames.indexOf(fld.InternalName) >= 0);
        return Promise.all(itemsIds.map(id => this.copyItem(id, fieldsToCopy, fieldToUpdate)));
    }
    public mapToRestAcceptedValue(item, field: IField) {
        return this.fieldMapper.mapFieldValue(item, field);
    }
    public copyItem = async (itemId: string, fieldsToCopy: IField[], fieldsToUpdate: IFieldValue[]) => {
        let item = await this.listItemUtil.getItemById(itemId, fieldsToCopy);
        let fieldsValues = [...fieldsToUpdate, ...fieldsToCopy.filter(fld => item[fld.InternalName]).map(fld => this.mapToRestAcceptedValue(item, fld))];

        await this.listItemUtil.createItem(fieldsValues);
    }
}