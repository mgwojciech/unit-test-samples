import { IAuthenticationService } from "mgwdev-m365-helpers/lib/services/IAuthenticationService";
import { queueRequest } from "mgwdev-m365-helpers/lib/utils/FunctionUtils";
import * as teamsjs from "@microsoft/teams-js";

export class TeamsSSOAuthTokenBrokerService implements IAuthenticationService {
    private token: string = "";
    constructor() {
        teamsjs.app.initialize();
    }
    public async getCurrentUser(): Promise<any> {
        let token = await this.getAccessToken();
        let tokenInfo = JSON.parse(atob(token.split(".")[1]));
        return {
            id: tokenInfo.oid,
            displayName: tokenInfo.name
        }
    }

    @queueRequest("getAccessToken")
    public async getAccessToken(resource?: string): Promise<string> {
        if (!this.token) {
            let teamsToken = await teamsjs.authentication.getAuthToken({});
            let oboTokenResponse = await fetch(`/api/TokenBroker?resource=${resource || "https://graph.microsoft.com"}`, {
                headers: {
                    "Authorization": "Bearer " + teamsToken
                }
            });
            let tokenBody = await oboTokenResponse.json();
            this.token = tokenBody.accessToken;
        }
        return this.token;
    }
}