export class MockGraphRequest {
    constructor(public response){

    }
    public get<T>():Promise<T>{
        return Promise.resolve(this.response);
    }
}