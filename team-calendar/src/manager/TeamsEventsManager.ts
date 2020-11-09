import { WebPartContext } from "@microsoft/sp-webpart-base";
import { TeamsEventsProvider } from "../dal/TeamsEventsProvider";
import { IEvent } from "../model/IEvent";
import { TeamsContextProvider } from "../utils/TeamsContextProvider";

export class TeamsEventsManager {
    protected eventsProvider: TeamsEventsProvider;
    constructor(protected context: WebPartContext) {
        this.eventsProvider = new TeamsEventsProvider(context);
    }
    public async getTeamsEvents(): Promise<IEvent[]> {
        let teamsContext = await TeamsContextProvider.getTeamsContext(this.context);
        return this.eventsProvider.getTeamsEvents(teamsContext.groupId);
    }
}