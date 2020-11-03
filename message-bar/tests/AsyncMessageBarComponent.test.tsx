/// <reference types="jest" />
/// <reference types="sinon" />

import * as React from 'react';
import { assert, expect } from 'chai';
import { mount, configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SimpleMessage } from '../src/logic/model/SimpleMessage';
import { AsyncMessageBarComponent } from '../src/components/AsyncMessageBarComponent';
import { SPClientProvider } from '../src/logic/utils/SPClientProvider';

declare const sinon;
configure({ adapter: new Adapter() });

describe("<AsyncMessageBarComponent />", () => {
    it("Should render empty", () => {
        let date = new Date();
        let dateString = date.toISOString();
        SPClientProvider.MockGetRequests = [{
            requestUrl: `http://test.sharepoint.com/sites/dev/_api/web/lists/getByTitle('Events')/items`,
            response:
                JSON.stringify({
                    value: []
                })
        }];
        return new Promise(async (resolve, error) => {
            let element = mount(<AsyncMessageBarComponent SiteUrl="http://test.sharepoint.com/sites/dev"
            />);
            let innerText = element.find("div").text();
            assert.equal(innerText, "Loading...");

            let instance = element.instance();
            await instance.componentDidMount();

            element.update();
            innerText = element.find("div").text();
            assert.equal(innerText, "No messages!");
            resolve();
        });
    });
    it("Should render first of 3 messages", () => {
        let date = new Date();
        let dateString = date.toISOString();
        SPClientProvider.MockGetRequests = [{
            requestUrl: `http://test.sharepoint.com/sites/dev/_api/web/lists/getByTitle('Events')/items`,
            response:
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
                })
        }]
        return new Promise(async (resolve, error) => {
            let element = mount(<AsyncMessageBarComponent SiteUrl="http://test.sharepoint.com/sites/dev" />);
            let innerText = element.find("div").text();
            assert.equal(innerText, "Loading...");
            let instance = element.instance();
            await instance.componentDidMount();

            element.update();
            innerText = element.find(".simple_message").text();
            assert.equal(innerText, "Test 1");
            resolve();
        });
    });
});