/// <reference types="jest" />
/// <reference types="sinon" />

import * as React from 'react';
import { assert, expect } from 'chai';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SimpleMessage } from '../src/logic/model/SimpleMessage';
import { MessageBarWithNavigationComponent } from "./../src/components/MessageBarWithNavigationComponent";

declare const sinon;
configure({ adapter: new Adapter() });

describe("<MessageBarWithNavigationComponent />", () => {
    test("Should render empty", () => {
        let element = mount(<MessageBarWithNavigationComponent Messages={[]} />)
        let innerText = element.find("div").text();

        assert.equal(innerText, "No messages!");
    });
    it("Should render with simple message", () => {
        let element = mount(<MessageBarWithNavigationComponent Messages={[new SimpleMessage({
            Id: 1,
            Title: "Test Message 1",
            Link: "MockLink"
        })]} />)
        let innerText = element.find(".simple_message").text();

        assert.equal(innerText, "Test Message 1");
    });
    it("Should render one out of three messages", () => {
        let element = mount(<MessageBarWithNavigationComponent Messages={[new SimpleMessage({
            Id: 1,
            Title: "Test Message 1",
            Link: "MockLink"
        }), new SimpleMessage({
            Id: 2,
            Title: "Test Message 2",
            Link: "MockLink"
        }), new SimpleMessage({
            Id: 3,
            Title: "Test Message 3",
            Link: "MockLink"
        })]} />)
        let messageElements = element.find(".simple_message");

        assert.equal(messageElements.length, 1);
    });
    it("Should render next message", () => {
        let element = mount(<MessageBarWithNavigationComponent Messages={[new SimpleMessage({
            Id: 1,
            Title: "Test Message 1",
            Link: "MockLink"
        }), new SimpleMessage({
            Id: 2,
            Title: "Test Message 2",
            Link: "MockLink"
        }), new SimpleMessage({
            Id: 3,
            Title: "Test Message 3",
            Link: "MockLink"
        })]} />);

        let nextButton = element.find(".button_next");
        nextButton.simulate("click");
        let messageText = element.find(".simple_message").text();
        assert.equal(messageText, "Test Message 2");
    });
    it("Should render previous message", () => {
        let element = mount(<MessageBarWithNavigationComponent Messages={[new SimpleMessage({
            Id: 1,
            Title: "Test Message 1",
            Link: "MockLink"
        }), new SimpleMessage({
            Id: 2,
            Title: "Test Message 2",
            Link: "MockLink"
        }), new SimpleMessage({
            Id: 3,
            Title: "Test Message 3",
            Link: "MockLink"
        })]} />);

        let prevButton = element.find(".button_prev");
        prevButton.simulate("click");
        let messageText = element.find(".simple_message").text();
        assert.equal(messageText, "Test Message 3");
    });
});