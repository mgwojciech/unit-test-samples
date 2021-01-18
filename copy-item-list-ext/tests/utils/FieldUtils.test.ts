///<reference types="jest" />

import { assert } from "chai";
import { Constants } from "../../src/model/Constants";
import { FieldUtils } from "../../src/utils/FieldUtils";

describe("FieldUtils", () => {
    test("getListFields", async () => {
        let fields = [{
            Title: "Title",
            InternalName: "Title",
            TypeAsString: Constants.fieldTypeText
        }];
        let fieldUtils = new FieldUtils({
            pageContext: {
                web: {
                    absoluteUrl: "https://mock.sharepoint.com/sites/tea-point"
                },
                list: {
                    id: "test-list-id"
                }
            },
            spHttpClient: {
                get: (url) => {
                    assert.equal(url, `https://mock.sharepoint.com/sites/tea-point/_api/web/lists(guid'test-list-id')/fields?$filter=Hidden eq false and ReadOnlyField eq false&$select=Choices,Title,InternalName,TypeAsString,Description,SspId,TermSetId`);
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve({
                            value: fields
                        })
                    });
                }
            }
        } as any);
        let listFields = await fieldUtils.getListFields();
        assert.deepEqual(listFields, fields);
    });
    test("getListFields (remove attachments)", async () => {
        let fields = [{
            Title: "Title",
            InternalName: "Title",
            TypeAsString: Constants.fieldTypeText
        }];
        let fieldUtils = new FieldUtils({
            pageContext: {
                web: {
                    absoluteUrl: "https://mock.sharepoint.com/sites/tea-point"
                },
                list: {
                    id: "test-list-id"
                }
            },
            spHttpClient: {
                get: (url) => {
                    assert.equal(url, `https://mock.sharepoint.com/sites/tea-point/_api/web/lists(guid'test-list-id')/fields?$filter=Hidden eq false and ReadOnlyField eq false&$select=Choices,Title,InternalName,TypeAsString,Description,SspId,TermSetId`);
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve({
                            value: [...fields,{
                                Title: "Attachments",
                                InternalName: "Attachments",
                                TypeAsString: Constants.fieldTypeText
                            }]
                        })
                    });
                }
            }
        } as any);
        let listFields = await fieldUtils.getListFields();
        assert.deepEqual(listFields, fields);
    });
    test("getListFields (remove ContentType)", async () => {
        let fields = [{
            Title: "Title",
            InternalName: "Title",
            TypeAsString: Constants.fieldTypeText
        }];
        let fieldUtils = new FieldUtils({
            pageContext: {
                web: {
                    absoluteUrl: "https://mock.sharepoint.com/sites/tea-point"
                },
                list: {
                    id: "test-list-id"
                }
            },
            spHttpClient: {
                get: (url) => {
                    assert.equal(url, `https://mock.sharepoint.com/sites/tea-point/_api/web/lists(guid'test-list-id')/fields?$filter=Hidden eq false and ReadOnlyField eq false&$select=Choices,Title,InternalName,TypeAsString,Description,SspId,TermSetId`);
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve({
                            value: [...fields,{
                                Title: "ContentType",
                                InternalName: "ContentType",
                                TypeAsString: Constants.fieldTypeText
                            }]
                        })
                    });
                }
            }
        } as any);
        let listFields = await fieldUtils.getListFields();
        assert.deepEqual(listFields, fields);
    });
});