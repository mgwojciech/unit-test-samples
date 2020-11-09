import { MockGraphRequest } from "./MockGraphRequest";

export class MockGraphClient {
    constructor(public mockedRequests: { url: string, request: MockGraphRequest }[]) {

    }
    public api(url): MockGraphRequest {
        return this.mockedRequests.filter(req => req.url === url)[0].request;
    }
}