/// <reference types="jest" />
import { assert } from "chai";
import { ListItemUtility } from "../../src/utils/ListItemUtility";

describe("ListItemUtility", () => {
    test("should getItemById", async () => {
        let mockHttpClient = {
            post: (url, config, params) => {
                assert.equal(url, "https://test.sharepoint.com/sites/mock-site/_api/web/lists(guid'test-list-id')/RenderListDataAsStream");
                assert.equal(JSON.parse(params.body).parameters.ViewXml.replace(/\s/g, ""), `<View>
                <Query>
                <Where>
                <Eq>
                  <FieldRef Name="ID"/>
                  <Value Type="Number">1</Value>
                </Eq>
              </Where>
                </Query>
                <RowLimit Paged="TRUE">100</RowLimit>
              </View>`.replace(/\s/g, ""));
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        Row: [
                            {
                                Id: 1
                            }
                        ]
                    })
                })
            }
        }
        let mockedContext = {
            pageContext: {
                web: {
                    absoluteUrl: "https://test.sharepoint.com/sites/mock-site"
                },
                list: {
                    id: "test-list-id"
                }
            },
            spHttpClient: mockHttpClient
        };
        let listItemUtility = new ListItemUtility(mockedContext as any);
        let response = await listItemUtility.getItemById(1);
        assert.equal(response.Id, 1);
    });
    test("should getItemById with specific fields", async () => {
        let mockHttpClient = {
            post: (url, config, params) => {
                assert.equal(url, "https://test.sharepoint.com/sites/mock-site/_api/web/lists(guid'test-list-id')/RenderListDataAsStream");
                assert.equal(JSON.parse(params.body).parameters.ViewXml.replace(/\s/g, ""), `<View>
                <ViewFields>
                <FieldRef Name="TestField"/>
        </ViewFields>
                <Query>
                <Where>
                <Eq>
                  <FieldRef Name="ID"/>
                  <Value Type="Number">1</Value>
                </Eq>
              </Where>
                </Query>
                <RowLimit Paged="TRUE">100</RowLimit>
              </View>`.replace(/\s/g, ""));
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        Row: [
                            {
                                Id: 1
                            }
                        ]
                    })
                })
            }
        }
        let mockedContext = {
            pageContext: {
                web: {
                    absoluteUrl: "https://test.sharepoint.com/sites/mock-site"
                },
                list: {
                    id: "test-list-id"
                }
            },
            spHttpClient: mockHttpClient
        };
        let listItemUtility = new ListItemUtility(mockedContext as any);
        let response = await listItemUtility.getItemById(1, [{
            InternalName: "TestField",
            Title: "Test Field",
            Choices: [],
            Description: "Test description",
            TypeAsString: "Text"
        }]);
        assert.equal(response.Id, 1);
    });
    test("getItemById - error handling (false)", async () => {
        let mockHttpClient = {
            post: (url, config, params) => {
                return Promise.resolve({
                    ok: false
                })
            }
        }
        let mockedContext = {
            pageContext: {
                web: {
                    absoluteUrl: "https://test.sharepoint.com/sites/mock-site"
                },
                list: {
                    id: "test-list-id"
                }
            },
            spHttpClient: mockHttpClient
        };
        try {
            let listItemUtility = new ListItemUtility(mockedContext as any);
            await listItemUtility.getItemById(1, [{
                InternalName: "TestField",
                Title: "Test Field",
                Choices: [],
                Description: "Test description",
                TypeAsString: "Text"
            }]);
            throw "Error not thrown";

        } catch (err) {
            assert.equal(err.message, "Something went wrong when obtaining list item. ListId='test-list-id'; ListItemId='1'")
        }
    });
    test("getItemById - error handling (empty response)", async () => {
        let mockHttpClient = {
            post: (url, config, params) => {
                return Promise.resolve()
            }
        }
        let mockedContext = {
            pageContext: {
                web: {
                    absoluteUrl: "https://test.sharepoint.com/sites/mock-site"
                },
                list: {
                    id: "test-list-id"
                }
            },
            spHttpClient: mockHttpClient
        };
        try {
            let listItemUtility = new ListItemUtility(mockedContext as any);
            await listItemUtility.getItemById(1, [{
                InternalName: "TestField",
                Title: "Test Field",
                Choices: [],
                Description: "Test description",
                TypeAsString: "Text"
            }]);
            throw "Error not thrown";

        } catch (err) {
            assert.equal(err.message, "Something went wrong when obtaining list item. ListId='test-list-id'; ListItemId='1'")
        }
    });
    test("getItemById - error handling (empty response)", async () => {
        let mockHttpClient = {
            post: (url, config, params) => {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        Row: [
                        ]
                    })
                })
            }
        }
        let mockedContext = {
            pageContext: {
                web: {
                    absoluteUrl: "https://test.sharepoint.com/sites/mock-site"
                },
                list: {
                    id: "test-list-id"
                }
            },
            spHttpClient: mockHttpClient
        };
        try {
            let listItemUtility = new ListItemUtility(mockedContext as any);
            await listItemUtility.getItemById(1, [{
                InternalName: "TestField",
                Title: "Test Field",
                Choices: [],
                Description: "Test description",
                TypeAsString: "Text"
            }]);
            throw "Error not thrown";

        } catch (err) {
            assert.equal(err.message, "List item not found! ListId='test-list-id'; ListItemId='1'")
        }
    });
    test("createItem", async () => {
        let mockHttpClient = {
            post: (url, config, params) => {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        value: [{
                            FieldName: "Id",
                            FieldValue: 10
                        }]
                    })
                })
            }
        }
        let mockedContext = {
            pageContext: {
                web: {
                    absoluteUrl: "https://test.sharepoint.com/sites/mock-site"
                },
                list: {
                    id: "test-list-id"
                }
            },
            spHttpClient: mockHttpClient
        };
        let listItemUtility = new ListItemUtility(mockedContext as any);
        let id = await listItemUtility.createItem([{
            name: "Title",
            type: "String",
            value: "Test title"
        }]);
        assert.equal(id, 10);
    });
    test("createItem no fields provided", async () => {
        let mockedContext = {
            pageContext: {
                web: {
                    absoluteUrl: "https://test.sharepoint.com/sites/mock-site"
                },
                list: {
                    id: "test-list-id"
                }
            }
        };
        let listItemUtility = new ListItemUtility(mockedContext as any);
        let id = await listItemUtility.createItem(undefined);
        assert.isNull(id);
    });
    test("createItem throw error", async () => {
        try {
            let mockedContext = {
                pageContext: {
                    web: {
                        absoluteUrl: "https://test.sharepoint.com/sites/mock-site"
                    },
                    list: {
                        id: "test-list-id"
                    }
                }
            };
            let listItemUtility = new ListItemUtility(mockedContext as any);
            let id = await listItemUtility.createItem([{
                name: "Title",
                type: "String",
                value: "Test title"
            }]);
            throw "No error handled"
        }
        catch (err) {
        }
    });
    test("createItem no error returned", async () => {
        let mockHttpClient = {
            post: (url, config, params) => {
                return Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({
                        value: [{
                            FieldName: "Id",
                            FieldValue: 10
                        }]
                    })
                })
            }
        }
        let mockedContext = {
            pageContext: {
                web: {
                    absoluteUrl: "https://test.sharepoint.com/sites/mock-site"
                },
                list: {
                    id: "test-list-id"
                }
            },
            spHttpClient: mockHttpClient
        };
        let listItemUtility = new ListItemUtility(mockedContext as any);
        let id = await listItemUtility.createItem([{
            name: "Title",
            type: "String",
            value: "Test title"
        }]);
        assert.isUndefined(id);
    });
    test("createItem no data returned", async () => {
        let mockHttpClient = {
            post: (url, config, params) => {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                    })
                })
            }
        }
        let mockedContext = {
            pageContext: {
                web: {
                    absoluteUrl: "https://test.sharepoint.com/sites/mock-site"
                },
                list: {
                    id: "test-list-id"
                }
            },
            spHttpClient: mockHttpClient
        };
        let listItemUtility = new ListItemUtility(mockedContext as any);
        let id = await listItemUtility.createItem([{
            name: "Title",
            type: "String",
            value: "Test title"
        }]);
        assert.isUndefined(id);
    });
    test("createItem no field error", async () => {
        let mockHttpClient = {
            post: (url, config, params) => {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        value: [{
                            FieldName: "Id",
                            FieldValue: 10,
                            ErrorMessage: "Test error"
                        }]
                    })
                })
            }
        }
        let mockedContext = {
            pageContext: {
                web: {
                    absoluteUrl: "https://test.sharepoint.com/sites/mock-site"
                },
                list: {
                    id: "test-list-id"
                }
            },
            spHttpClient: mockHttpClient
        };
        let listItemUtility = new ListItemUtility(mockedContext as any);
        let id = await listItemUtility.createItem([{
            name: "Title",
            type: "String",
            value: "Test title"
        }]);
        assert.isUndefined(id);
    });
});