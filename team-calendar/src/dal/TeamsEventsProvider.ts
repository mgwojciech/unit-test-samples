import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IEvent } from "../model/IEvent";
import { IGraphEvent } from "../model/dto/IGraphEvent";

export class TeamsEventsProvider {
    //https://graph.microsoft.com/v1.0/groups/282083f9-60b2-4c9d-b35a-2f093e6fdde8/events
    constructor(protected context: WebPartContext) {

    }

    public async getTeamsEvents(teamId: string): Promise<IEvent[]> {
        let graphClient = await this.context.msGraphClientFactory.getClient();
        let graphResponse: { value: IGraphEvent[] } = await graphClient.api(`/groups/${teamId}/events?$select=id,subject,importance,start,end,onlineMeeting,bodyPreview,isAllDay,body`).get();

        return graphResponse.value.map((graphEvent: IGraphEvent) => (
            {
                ...graphEvent,
                joinLink: graphEvent.onlineMeeting.joinUrl,
                startTime: new Date(graphEvent.start.dateTime),
                endTime: new Date(graphEvent.end.dateTime),
                eventBody: graphEvent.body.content
            }
        ));
    }
}
//https://teams.microsoft.com/l/meetup-join/19:3c409a3647594c57877adc3b6c4d87ab@thread.tacv2/1604514758193?context={"Tid":"6bf6c4ac-66c5-453d-b839-578a5c34990c","Oid":"1ac5ef14-61f1-47c8-b14b-13a393f0e4cf"}