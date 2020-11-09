/// <reference types="jest" />
import { assert } from "chai";
import { TeamsContextProvider } from "../../src/utils/TeamsContextProvider";

describe("TeamsContextProvider", () => {
    test("getTeamsContext from sdks", () => {
        let expectedContext = {
            teamId: "team-id",
            entityId: "entity-id",
            locale: "en-US"
        }
        let ctx = {
            sdks: {
                microsoftTeams: {
                    context: expectedContext
                }
            }
        };

        let teamsContext = TeamsContextProvider.getTeamsContext(ctx as any);

        assert.deepEqual(teamsContext, expectedContext);
    });
    test("getTeamsContext from queryString", () => {
        let expectedContext = {
            teamId: "team-id",
            entityId: "entity-id",
            locale: "en-US"
        }
        delete window.location;
        //@ts-ignore
        window.location = {
            search: `?entityId=${expectedContext.entityId}&locale=${expectedContext.locale}&teamId=${expectedContext.teamId}`
        }

        let teamsContext = TeamsContextProvider.getTeamsContext({} as any);

        for (let prop in expectedContext) {
            assert.equal(teamsContext[prop], expectedContext[prop]);
        }
    });
    test("getTeamsContext from queryString (no query params)", () => {
        delete window.location;
        //@ts-ignore
        window.location = {
            search: ``
        }

        let teamsContext = TeamsContextProvider.getTeamsContext({} as any);

        assert.isNotOk(teamsContext)
    });
    test("getTeamsContext from queryString string provided", () => {
        let expectedContext = {
            teamId: "team-id",
            entityId: "entity-id",
            locale: "en-US"
        }

        let teamsContext = TeamsContextProvider.getContextFromQueryString(`?entityId=${expectedContext.entityId}&locale=${expectedContext.locale}&teamId=${expectedContext.teamId}`);

        for (let prop in expectedContext) {
            assert.equal(teamsContext[prop], expectedContext[prop]);
        }
    });
})