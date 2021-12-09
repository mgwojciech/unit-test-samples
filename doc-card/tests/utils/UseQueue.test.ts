/// <reference types="jest" />
import { assert } from "chai";
import { queueRequest } from "../../src/utils/FunctionUtils";

describe("useQueue", ()=>{
    class TestQueueClass {
		constructor(protected getDataMethod: () => Promise<string>) {

		}
		@queueRequest("getDataFunctionKey")
		public getData(): Promise<string> {
			return this.getDataMethod();
		}
		@queueRequest("getDataFunctionKey-{0}")
		public getDataWithArgs(arg): Promise<string> {
			return this.getDataMethod().then((result) => `${result}-${arg}`);
		}
	}
    test("should getData and call method only once", async () => {
		const test = {
			getDataMethod: () => new Promise<string>((resolve) => {
				setTimeout(() => resolve("Test"), 500);
			})
		}

		const spy = jest.spyOn(test, "getDataMethod");
		let testClass = new TestQueueClass(test.getDataMethod);
		let [data1, data2, data3, data4] = await Promise.all([testClass.getData(), testClass.getData(), testClass.getData(), testClass.getData()]);

		assert.equal(data1, "Test");
		assert.equal(data2, "Test");
		assert.equal(data3, "Test");
		assert.equal(data4, "Test");

		expect(spy).toHaveBeenCalledTimes(1);
	});
	test("should getData and call method once across multiple instances", async () => {
		const test = {
			getDataMethod: () => new Promise<string>((resolve) => {
				setTimeout(() => resolve("Test"), 500);
			})
		}

		const spy = jest.spyOn(test, "getDataMethod");
		let testClass = new TestQueueClass(test.getDataMethod);
		let testClass1 = new TestQueueClass(test.getDataMethod);
		let [data1, data2, data11, data12] = await Promise.all([
			testClass.getData(),
			testClass.getData(),
			testClass.getData(),
			testClass.getData(),
			testClass1.getData(),
			testClass1.getData(),
			testClass1.getData(),
			testClass1.getData()]);

		assert.equal(data1, "Test");
		assert.equal(data2, "Test");
		assert.equal(data11, "Test");
		assert.equal(data12, "Test");

		expect(spy).toHaveBeenCalledTimes(1);
	});
	test("should getData and call method only twice with different args", async () => {
		const test = {
			getDataMethod: () => new Promise<string>((resolve) => {
				setTimeout(() => resolve("Test"), 500);
			})
		}

		const spy = jest.spyOn(test, "getDataMethod");
		let testClass = new TestQueueClass(test.getDataMethod);
		let [data1, data2, data3, data4] = await Promise.all([
			testClass.getDataWithArgs("1"),
			testClass.getDataWithArgs("1"),
			testClass.getDataWithArgs("2"),
			testClass.getDataWithArgs("2")]);

		assert.equal(data1, "Test-1");
		assert.equal(data2, "Test-1");
		assert.equal(data3, "Test-2");
		assert.equal(data4, "Test-2");

		expect(spy).toHaveBeenCalledTimes(2);
	});
});