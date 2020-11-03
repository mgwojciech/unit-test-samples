/// <reference types="jest" />
/// <reference types="sinon" />

import * as React from 'react';
import { assert, expect } from 'chai';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SimpleMessage } from '../src/logic/model/SimpleMessage';
import { MessageBarComponent } from '../src/components/MessageBarComponent';

declare const sinon;
configure({ adapter: new Adapter() });

describe("<MessageBarComponent />", ()=>{
    it("Should render empty",()=>{
        let element = mount(<MessageBarComponent Messages={[]} />)
        let innerText = element.find("div").text();

        assert.equal(innerText, "No messages!");
    });
    it("Should render with simple message",()=>{
        let element = mount(<MessageBarComponent Messages={[new SimpleMessage({
            Id: 1,
            Title: "Test Message 1",
            Link: "MockLink"
        })]} />)
        let innerText = element.find(".simple_message").text();

        assert.equal(innerText, "Test Message 1");
    });
    it("Should render three messages",()=>{
        let element = mount(<MessageBarComponent Messages={[new SimpleMessage({
            Id: 1,
            Title: "Test Message 1",
            Link: "MockLink"
        }),new SimpleMessage({
            Id: 2,
            Title: "Test Message 2",
            Link: "MockLink"
        }),new SimpleMessage({
            Id: 3,
            Title: "Test Message 3",
            Link: "MockLink"
        })]} />)
        let messageElements = element.find(".simple_message");

        assert.equal(messageElements.length, 3);
    });
});