///<reference types="jest" />

import { assert } from "chai";
import { GraphDocumentsProvider } from "../../src/dal/GraphDocumentsProvider";

var logCallback: (name, error) => void;
jest.mock("@microsoft/sp-core-library", () => ({
    Log: {
        error: (name, err) => logCallback && logCallback(name, err)
    }
}))

describe("GraphSearchAPIDocumentsProvider", () => {
	beforeEach(()=>{
		localStorage.clear();
	})
    afterEach(() => {
        logCallback = null;
    })
    test("should map graph result", async () => {
        let graphClient = {
            api: () => ({
                post: () => Promise.resolve({
                    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#Collection(microsoft.graph.searchResponse)",
                    "value": [
                        {
                            "searchTerms": [
                                "1"
                            ],
                            "hitsContainers": [
                                {
                                    "total": 69,
                                    "moreResultsAvailable": true,
                                    "hits": [
                                        {
                                            "hitId": "C98242A9-9339-4858-A455-B37232D9C8E9",
                                            "rank": 1,
                                            "summary": "Name Age Sex Race Doe, John 20 Male White Doe, Jane 30 Female Black Doe, Jack 40 Male Asian Name Age Sex Race Doe, John 20 Male White Doe, Jane 30 Female Black Doe, Jack 40 Male<ddd/>",
                                            "resource": {
                                                "@odata.type": "#microsoft.graph.listItem",
                                                "id": "C98242A9-9339-4858-A455-B37232D9C8E9",
                                                "fields": {
                                                    "id": "AAAAAIkiHflS_vFHuOAAQXIIxBoHANNh6pZbjHZPr2k17NOLnogAAAAAAWMAANNh6pZbjHZPr2k17NOLnogAAcMKe5wAAA2",
                                                    "contentclass": "STS_ListItem_DocumentLibrary",
                                                    "title": "Test excel",
                                                    "path": "https://test.sharepoint.com/sites/dev/Deals/Test/Test excel.xlsx"
                                                }
                                            }
                                        },
                                        {
                                            "hitId": "B1FD20A8-92AD-4F98-A69F-56879E4C06ED",
                                            "rank": 2,
                                            "summary": "Header 1 Header 2 Cell 11 Cell12 Cell 21 Cell 22<ddd/>1 0 {B1FD20A8-92AD<ddd/>",
                                            "resource": {
                                                "@odata.type": "#microsoft.graph.listItem",
                                                "id": "B1FD20A8-92AD-4F98-A69F-56879E4C06ED",
                                                "fields": {
                                                    "id": "AAAAAIkiHflS_vFHuOAAQXIIxBoHANNh6pZbjHZPr2k17NOLnogAAAAAAWMAANNh6pZbjHZPr2k17NOLnogAAAAAgWMAAA2",
                                                    "contentclass": "STS_ListItem_DocumentLibrary",
                                                    "title": "1",
                                                    "path": "https://test.sharepoint.com/sites/dev/Shared Documents/test.xlsx"
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                })
            })
        }

        const expectedResult = [{
            id: "C98242A9-9339-4858-A455-B37232D9C8E9",
            title: "Test excel",
            url: "https://test.sharepoint.com/sites/dev/Deals/Test/Test excel.xlsx"
        }, {
            id: "B1FD20A8-92AD-4F98-A69F-56879E4C06ED",
            title: "1",
            url: "https://test.sharepoint.com/sites/dev/Shared Documents/test.xlsx"
        }];

        let dataProvider = new GraphDocumentsProvider(graphClient as any);

        let data = await dataProvider.getDocuments();

        assert.deepEqual(data, expectedResult);
    });
    test("test request body", async () => {
        let asserted = false;
        let graphClient = {
            api: () => ({
                post: (request) => {
                    assert.deepEqual(request, {
                        "requests": [
                            {
                                "entityTypes": [
                                    "listItem"
                                ],
                                "query": {
                                    "queryString": "IsDocument:1 -*.aspx -.mht"
                                },
                                "from": 0,
                                "size": 5,
                                "fields": [
                                    "id",
                                    "name",
                                    "contentclass",
                                    "title",
                                    "path"
                                ]
                            }
                        ]
                    });
                    asserted = true;
                    return Promise.resolve({ value: [] })
                }
            })
        }

        let dataProvider = new GraphDocumentsProvider(graphClient as any);

        let data = await dataProvider.getDocuments();

        assert.isTrue(asserted);

    });
    test("should handle exception", async () => {
        let asserted = false;
        let graphClient = {
            api: () => ({
                post: () => Promise.reject(new Error("Test error"))
            })
        }
        logCallback = (name, err) => {
            assert.equal(name, "GraphDocumentsProvider.getDocuments");
            assert.equal(err.message, "Test error");
            asserted = true;
        }
        let dataProvider = new GraphDocumentsProvider(graphClient as any);
        try {
            let data = await dataProvider.getDocuments();
        }
        catch (err) {
            assert.equal(err.message, "Test error");
        }
        assert.isTrue(asserted);
    })
});