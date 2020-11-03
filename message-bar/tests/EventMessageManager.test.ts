/// <reference types="jest" />
import { assert } from 'chai';
import { EventMessageManager } from "./../src/logic/EventMessageManager";
import { MockEventMessageProvider } from './mocks/MockEventMessageProvider';

describe("EventMessageManager",()=>{
    it("should get messages (without title change)", ()=>{
        let dataProvider = new MockEventMessageProvider([{
            Id: 1,
            Title: "Test 1",
            Link: "http://test_event_1",
            Category: "Test"
        }]);
        let eventManager = new EventMessageManager(dataProvider);
        return eventManager.GetMessages().then(result=>{
            assert.equal(result[0].Title,"Test 1");
        });
    });
    it("should get messages (with title change)", ()=>{
        let dataProvider = new MockEventMessageProvider([{
            Id: 1,
            Title: "Test 1",
            Link: "http://test_event_1",
            Category: "Off-Work"
        }]);
        let eventManager = new EventMessageManager(dataProvider);
        return eventManager.GetMessages().then(result=>{
            assert.equal(result[0].Title,"(Off-Work)Test 1");
        });
    });
});