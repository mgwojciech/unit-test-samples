/// <reference types="jest" />

import { MockGraphClient } from "../mock/graph/MockGraphClient";
import { MockGraphClientFactory } from "../mock/graph/MockGraphClientFactory";
import { MockGraphRequest } from "../mock/graph/MockGraphRequest";
import { TeamsEventsManager } from "../../src/manager/TeamsEventsManager";
import { assert } from "chai";

describe("TeamsEventsManager", () => {
    test("should get team events", async () => {
        let eventPreview = "________________________________________________________________________________\r\nMicrosoft Teams meeting\r\nJoin on your computer or mobile app\r\nClick here to join the meeting\r\nLearn More | Meeting options\r\n___________________________________________";
        let startDate = "2020-11-05T07:30:00.0000000";
        let endDate = "2020-11-05T08:00:00.0000000";
        let expectedContext = {
            teamId: "team-id",
            entityId: "entity-id",
            locale: "en-US",
            groupId: "test-group-id"
        }
        let context = {
            msGraphClientFactory: new MockGraphClientFactory(new MockGraphClient([{
                url: "/groups/test-group-id/events?$select=id,subject,importance,start,end,onlineMeeting,bodyPreview,isAllDay,body",
                request: new MockGraphRequest({
                    value: [
                        {
                            "@odata.etag": "W/\"tCdCRm67jk61XOy77XUMjwAAfd71bA==\"",
                            "id": "AAMkAGQzMTg4MDhmLWFiNjctNGE1YS1hNTA0LTU3YzhmNDIxMzVmZABGAAAAAACnVwk7gIvGR78znyr565l1BwC0J0JGbruOTrVc7LvtdQyPAAAAAAENAAC0J0JGbruOTrVc7LvtdQyPAAB90f4TAAA=",
                            "subject": "Test",
                            "bodyPreview": eventPreview,
                            "importance": "normal",
                            "body":{
                                "content": ""
                            },
                            "isAllDay": false,
                            "start": {
                                "dateTime": startDate,
                                "timeZone": "UTC"
                            },
                            "end": {
                                "dateTime": endDate,
                                "timeZone": "UTC"
                            },
                            "onlineMeeting": {
                                "joinUrl": "https://teams.microsoft.com/l/meetup-join/19%3a3c409a3647594c57877adc3b6c4d87ab%40thread.tacv2/1604514758193?context=%7b%22Tid%22%3a%226bf6c4ac-66ad-453d-b839-578a5c34990c%22%2c%22Oid%22%3a%221ac5ef14-61f1-47c8-b14b-13a393f0e4cf%22%7d"
                            }
                        }]
                })
            }
            ])),
            sdks: {
                microsoftTeams: {
                    context: expectedContext
                }
            }
        }

        let manager = new TeamsEventsManager(context as any);
        let events = await manager.getTeamsEvents();


        let event = events[0];
        assert.equal(event.bodyPreview, eventPreview);
        assert.deepEqual(event.startTime, new Date(startDate));
        assert.equal(event.subject, "Test");
    });
})