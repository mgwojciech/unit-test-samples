///<reference types="jest" />
import { ExternalEntityProvider } from "../../src/dal/ExternalEntityProvider";
import { MockHttpClient, SPWebPartContextMock } from "spfx-ut-library";
import { assert } from "chai";
describe("ExternalEntityProvider", () => {
	test("should get external entities", async () => {
		let mockContext = new SPWebPartContextMock();
		let spClientMock: MockHttpClient = mockContext.spHttpClient as MockHttpClient;
		//register url response
		const urlStorageMock = {
			Value: "https://contoso.webapp.com"
		}
		spClientMock.registerResponse({
			url: `https://contoso.sharepoint.com/sites/test-site/_api/web/GetStorageEntity('ExternalEntityEndpointUrl')`,
			response: JSON.stringify(urlStorageMock),
			status: 200,
			method: "GET"
		});
		//register app uri response
		const appUriStorageMock = {
			Value: "api://app-id"
		}
		spClientMock.registerResponse({
			url: `https://contoso.sharepoint.com/sites/test-site/_api/web/GetStorageEntity('ExternalEntityEndpointAppUri')`,
			response: JSON.stringify(appUriStorageMock),
			status: 200,
			method: "GET"
		});
		//register token
		mockContext.aadTokenProviderFactory.aadTokenProviderMock.registerToken("api://app-id", "test-token");
		//register response and add token assertion
		const expectedResult = [{
			id: 1,
			name: "Test 1",
			description: "Test 1 description"
		}]
		let httpClient: MockHttpClient = mockContext.httpClient as MockHttpClient;
		httpClient.OnRequestCalled = (url, request: any) => {
			assert.equal(request.headers.Authorization, "Bearer test-token");

			return {
				url: `https://contoso.webapp.com/api/ExternalEntities`,
				response: JSON.stringify(expectedResult),
				status: 200,
				method: "GET"
			};
		}
		let provider = new ExternalEntityProvider(mockContext as any);
		let externalEntities = await provider.getExternalEntities();

		assert.deepEqual(externalEntities, expectedResult);
	});
});
