import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { IUser } from "../model/IUser";

export class AsyncCardController {
    constructor(protected spContext: AdaptiveCardExtensionContext) {

    }

    public async getInitialData(): Promise<IUser> {
        let graphClient = await this.spContext.msGraphClientFactory.getClient();
        let user = await graphClient.api("me").get();

        return user;
    }

    public async getManager(): Promise<IUser> {
        let graphClient = await this.spContext.msGraphClientFactory.getClient();
        let user = await graphClient.api("me/manager").get();

        return user;
    }

}