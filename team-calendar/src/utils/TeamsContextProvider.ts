import { WebPartContext } from "@microsoft/sp-webpart-base";
import * as microsoftTeams from "@microsoft/teams-js";

export class TeamsContextProvider {
    public static getTeamsContext(context: WebPartContext): microsoftTeams.Context {
        if (context.sdks &&
            context.sdks.microsoftTeams) {
            return context.sdks.microsoftTeams.context;
        }
        return this.getContextFromQueryString();
    }
    public static getContextFromQueryString(queryString: string = window.location.search): microsoftTeams.Context {
        let queryParams = new URLSearchParams(queryString);
        if (!queryParams.get("entityId")) {
            return null;
        }
        let teamsContextProps = ["tid", "subEntityId", "groupId", "teamId", "teamName", "channelId", "channelName"];
        let result = {
            entityId: queryParams.get("entityId"),
            locale: queryParams.get("locale")
        };
        for (let contextProp of teamsContextProps) {
            result[contextProp] = queryParams.get(contextProp);
        }

        return result;
    }
}