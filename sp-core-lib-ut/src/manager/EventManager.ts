import { Guid } from "@microsoft/sp-core-library";

export class EventManager {
    protected callbacksMap: Map<Guid, (args) => void> = new Map<Guid, (args) => void>();
    public registerCallback<T>(callback: (callbackArgs: T) => void): Guid {
        let callbackGuid = Guid.newGuid();
        this.callbacksMap.set(callbackGuid, callback);
        return callbackGuid;
    }
}