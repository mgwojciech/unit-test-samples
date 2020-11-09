import { MockGraphClient } from "./MockGraphClient";

export class MockGraphClientFactory{
    constructor(public client: MockGraphClient){

    }
    public async getClient(): Promise<MockGraphClient>{
        return Promise.resolve(this.client);
    }
}