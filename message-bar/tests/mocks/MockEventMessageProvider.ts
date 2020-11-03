import { IEventMessageProvider } from "./../../src/logic/dataProvider/EventMessageProvider";
import { IMessage } from "./../../src/logic/model/IMessage";

export class MockEventMessageProvider implements IEventMessageProvider{
    constructor(public MockMessages: IMessage[]){

    }
    GetMessages(): Promise<IMessage[]> {
        return  Promise.resolve(this.MockMessages);
    }
}