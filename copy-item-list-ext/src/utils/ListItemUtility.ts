import { ListViewCommandSetContext } from "@microsoft/sp-listview-extensibility";
import { SPHttpClient } from "@microsoft/sp-http";
import { IField, IFieldValue } from "../model/IFIeld";

export class ListItemUtility {
    public rowLimit = 100;
    constructor(protected context: ListViewCommandSetContext) {

    }
    private getListItemViewXml(whereSection: string, fieldNames: string[]) {
        let fieldsRef = fieldNames ? fieldNames.map((fieldName) => { return `<FieldRef Name="${fieldName}"/>`; }) : [];
        let fieldRef = "";
        if (fieldNames) {
            fieldRef = `
        <ViewFields>
          ${fieldsRef.join("")}
        </ViewFields>`;
        }

        return `<View>${fieldRef}
                      <Query>
                        ${whereSection}
                      </Query>
                      <RowLimit Paged="TRUE">${this.rowLimit}</RowLimit>
                    </View>`;
    }
    public async getItemById(itemId, fieldsToSelect?: IField[]): Promise<any> {
        let apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${this.context.pageContext.list.id}')/RenderListDataAsStream`;

        const dataResult = await this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
            headers: {
                "content-type": "application/json;odata=nometadata",
                "accept": "application/json;odata=nometadata",
                "odata-version": "3.0"
            },
            body: JSON.stringify({
                parameters: {
                    RenderOptions: 2,
                    ViewXml: this.getListItemViewXml(`<Where>
                              <Eq>
                                <FieldRef Name="ID"/>
                                <Value Type="Number">${itemId}</Value>
                              </Eq>
                            </Where>`, fieldsToSelect ? fieldsToSelect.map(fld => fld.InternalName) : undefined)
                }
            })
        });

        if (!dataResult || !dataResult.ok) {
            throw new Error(`Something went wrong when obtaining list item. ListId='${this.context.pageContext.list.id}'; ListItemId='${itemId}'`);
        }

        const listItemData = await dataResult.json();
        if (!listItemData || !listItemData.Row || listItemData.Row.length <= 0) {
            throw new Error(`List item not found! ListId='${this.context.pageContext.list.id}'; ListItemId='${itemId}'`);
        }
        const listItem = listItemData.Row[0];
        return listItem;
    }
    public async createItem(fieldsValues: IFieldValue[]): Promise<number> {
        if (!fieldsValues) {
            return null;
        }

        try {
            const apiUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${this.context.pageContext.list.id}')/AddValidateUpdateItem`;

            let body = {
                formValues: [...fieldsValues.map(m => ({
                    FieldName: m.name,
                    FieldValue: m.value,
                    HasException: false,
                    ErrorMessage: null
                }))]
            };

            const data = await this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
                body: JSON.stringify(body)
            });

            const result = await data.json();
            if (data && data.ok) {
                if (result.value) {
                    const invalid = result.value.filter(field => field.ErrorMessage !== null && field.ErrorMessage);
                    if (invalid.length === 0) {
                        return parseInt(result.value.filter(field => field.FieldName === "Id")[0].FieldValue);
                    }
                }
            }
        }
        catch (e) {
            throw e;
        }
    }
}