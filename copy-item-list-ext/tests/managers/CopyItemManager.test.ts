/// <reference types="jest" />
import { assert } from "chai";
import { CopyItemManager } from "../../src/managers/CopyItemManager";
import { Constants } from "../../src/model/Constants";

describe("CopyItemManager", () => {
    test("loadListInfo", async () => {
        let manager = new CopyItemManager({} as any);
        let fields = [{
            InternalName: "TestField",
            Title: "Test Field",
            TypeAsString: Constants.fieldTypeText
        }];
        manager.fieldUtils = {
            getListFields: () => Promise.resolve(fields)
        } as any;
        await manager.loadListInfo();
        assert.deepEqual(manager.fields, fields);
    });
    test("copyItem", async () => {
        let asserted = false;
        let manager = new CopyItemManager({} as any);
        let fields = [{
            InternalName: "TestField",
            Title: "Test Field",
            TypeAsString: Constants.fieldTypeText
        }, {
            InternalName: "Title",
            Title: "Title",
            TypeAsString: Constants.fieldTypeText
        }];
        let expectedFieldValues = [{
            name: "TestField",
            type: Constants.fieldTypeText,
            value: "Updated field"
        }, {
            name: "Title",
            type: Constants.fieldTypeText,
            value: "Test Title"
        }]
        manager.fieldUtils = {
            getListFields: () => Promise.resolve(fields)
        } as any;
        manager.listItemUtil = {
            getItemById: (itemId) => Promise.resolve({
                ID: 1,
                Title: "Test Title",
                TestField: "Test field value"
            }),
            createItem: (fields) => {
                assert.deepEqual(fields, expectedFieldValues);
                asserted = true;
            }
        } as any

        manager.fields = fields;
        await manager.copyItem("1", [fields[1]], [{
            name: "TestField",
            type: Constants.fieldTypeText,
            value: "Updated field"
        }]);
        assert.isTrue(asserted);
    });
    test("copyItems", async () => {
        let asserted = 0;
        let manager = new CopyItemManager({} as any);
        let fields = [{
            InternalName: "TestField",
            Title: "Test Field",
            TypeAsString: Constants.fieldTypeText
        }, {
            InternalName: "Title",
            Title: "Title",
            TypeAsString: Constants.fieldTypeText
        }];
        let expectedFieldValues = [{
            name: "TestField",
            type: Constants.fieldTypeText,
            value: "Updated field"
        }, {
            name: "Title",
            type: Constants.fieldTypeText,
            value: "Test Title"
        }]
        manager.listItemUtil = {
            getItemById: (itemId) => Promise.resolve({
                ID: 1,
                Title: "Test Title",
                TestField: "Test field value"
            }),
            createItem: (fields) => {
                assert.deepEqual(fields, expectedFieldValues);
                asserted++;
            }
        } as any
        manager.fields = fields;
        await manager.copyItems(["1", "2"], ["Title"], [{
            name: "TestField",
            type: Constants.fieldTypeText,
            value: "Updated field"
        }]);
        assert.equal(asserted, 2);
    });
})
