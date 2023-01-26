import { IAuthenticationService } from "mgwdev-m365-helpers/lib/services/IAuthenticationService";
import { queueRequest } from "mgwdev-m365-helpers/lib/utils/FunctionUtils";

export class TokenBrokerAuthService implements IAuthenticationService {
    private token: string = "";
    constructor() {

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
            let oboTokenResponse = await fetch(`/api/TokenBroker?resource=${resource || "https://graph.microsoft.com"}`, {
                redirect: "manual"
            });
            if (oboTokenResponse.status === 401 || oboTokenResponse.status === 302 || oboTokenResponse.status === 0) {
                window.location.href = "/login";
            }
                let tokenBody = await oboTokenResponse.json();
                this.token = tokenBody.accessToken;
            }
            return this.token;
        }
    }