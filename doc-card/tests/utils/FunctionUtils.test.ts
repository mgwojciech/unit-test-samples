///<reference types="jest" />
import { assert } from "chai";
import { useStorage } from "../../src/utils/FunctionUtils";
var localStorageMock = (function () {
	var store = {};
	return {
	  getItem: function (key) {
		let result = store[key];
		return result || null;
	  },
	  setItem: function (key, value) {
		store[key] = value ? value.toString() : "";
		this.length = Object.keys(store).length;
	  },
	  clear: function () {
		store = {};
	  },
	  key: function (id) {
		return Object.keys(store)[id];
	  },
	  removeItem: function (key) {
		delete store[key];
	  },
	  length: 0
	};
  })();
  Object.defineProperty(window, 'localStorage', {
	value: localStorageMock
  });
describe("FunctionUtils", ()=>{
	class TestClass {
		constructor(protected err?:string){

		}
		@useStorage("test-key")
		public getData(): Promise<string> {
			if(this.err){
				throw new Error(this.err);
			}
			return Promise.resolve("data");
		}
	}
	class TestClassComputedKey {
		constructor(protected err?:string){

		}
		@useStorage("test-key-{0}")
		public getData(testArgument: string): Promise<string> {
			if(this.err){
				throw new Error(this.err);
			}
			return Promise.resolve("data");
		}
	}
	beforeEach(()=>{
		localStorage.clear();
	})
	test("should get data and store it", async () => {
		let testClass = new TestClass();
		let data = await testClass.getData();
		expect(data).toBe("data");
		assert.equal(JSON.parse(localStorage.getItem("test-key")), "data");
	});
	test("should return from cache", async () => {
		localStorage.setItem("test-key", JSON.stringify("cached-data"));
		let testClass = new TestClass("test-error");
		let data = await testClass.getData();
		expect(data).toBe("cached-data");
		assert.equal(JSON.parse(localStorage.getItem("test-key")), "cached-data");
	});
	test("should use computed key", async () => {
		let testClass = new TestClassComputedKey();
		let data = await testClass.getData("test-arg");
		expect(data).toBe("data");
		assert.equal(JSON.parse(localStorage.getItem("test-key-test-arg")), "data");
	});
});
				