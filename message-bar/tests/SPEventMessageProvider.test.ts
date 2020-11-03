/// <reference types="jest" />
import { assert } from 'chai';
import { MockHttpClient } from './../src/logic/utils/MockHttpClient';
import { SPEventMessageProvider } from "./../src/logic/dataProvider/SPEventMessageProvider";

describe("SPEventMessageProvider", () => {
    it("should call api with correct query", () => {
        let date = new Date();
        let dateString = date.toISOString();
        let mockClient = new MockHttpClient();
        mockClient.AddOrUpdate(`http://test.sharepoint.com/sites/dev/_api/web/lists/getByTitle('Events')/items
        ?$filter=EventDate gt '${dateString}'&$top=3`,
            JSON.stringify({
                value: [{
                    Id: 1,
                    Title: "Test 1",
                    Link: "http://test_event_1",
                    Category: "Test"
                }, {
                    Id: 2,
                    Title: "Test 2",
                    Link: "http://test_event_2",
                    Category: "Test"
                }, {
                    Id: 3,
                    Title: "Test 3",
                    Link: "http://test_event_3",
                    Category: "Off-Work"
                }]
            }));
        let provider = new SPEventMessageProvider("http://test.sharepoint.com/sites/dev", mockClient, date);
        return provider.GetMessages().then(messages => {
            assert.equal(messages[0].Title, "Test 1");
        });
    });
});