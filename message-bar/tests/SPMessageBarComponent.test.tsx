/// <reference types="sinon" />
/// <reference types="jest" />

import * as React from 'react';
import { assert } from 'chai';
import { mount, configure } from 'enzyme';
import { SPHttpClient } from "@microsoft/sp-http";
import Adapter from 'enzyme-adapter-react-16';
import { SPMessageBarComponent } from '../src/components/SPMessageBarComponent';
import { NodeSPHttpClient } from './mocks/NodeSPHttpClient';

declare const jest;
configure({ adapter: new Adapter() });

//mock configuration
jest.mock("@microsoft/sp-http", () => {
    return {
        SPHttpClient: {
            configurations: {
                v1: 1
            }
        }
    }
});
let mockHttpClient = new NodeSPHttpClient("https://test.sharepoint.com/sites/dev", {
    username: "admin@test.onmicrosoft.com",
    password: "***",
    online: true
});
let mockedSPContext = {
    pageContext: {
        web: {
            absoluteUrl: "https://test.sharepoint.com/sites/dev"
        }
    },
    spHttpClient: mockHttpClient
}

describe("<SPMessageBarComponent />", () => {
    beforeAll(()=>{
        return mockHttpClient.readInputFile("./mockData.json");
    });
    it("Should render loading", () => {
        let element = mount(<SPMessageBarComponent context={mockedSPContext as any} />);
        let innerText = element.find("div").text();
        assert.equal(innerText, "Loading...");
    });
    it("Should render first message", () => {
        return new Promise(async (resolve, error) => {
            let element = mount(<SPMessageBarComponent context={mockedSPContext as any} />);
            let innerText = element.find("div").text();
            assert.equal(innerText, "Loading...");

            let instance = element.instance();
            await instance.componentDidMount();

            element.update();
            innerText = element.find(".simple_message").text();
            assert.equal(innerText, "Test 2");
            resolve();
        });
    });
    afterAll(()=>{
        if(mockHttpClient.RunAsIntegrations){
            mockHttpClient.save("./mockData.json");
        }
    });
});