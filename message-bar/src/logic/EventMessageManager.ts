import { IEventMessageProvider } from "./dataProvider/EventMessageProvider";
import { IMessage } from "./model/IMessage";

export class EventMessageManager {
    constructor(protected MessageProvider: IEventMessageProvider) {

    }
    public async GetMessages(): Promise<IMessage[]> {
        let temp = await this.MessageProvider.GetMessages();
        temp.forEach(message=>{
            if(message.Category === "Off-Work"){
                message.Title = `(Off-Work)${message.Title}`;
            }
        });
        return temp;
    }
}