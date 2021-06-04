///<reference types="jest" />
import { assert } from "chai";
import { EventManager } from "../../src/manager/EventManager";
describe("EventManager", () => {
	test("should register callback", async () => {
		let manager = new EventManager();
		let callbackId = manager.registerCallback(() => { });

		assert.isOk(callbackId);
	});
});
