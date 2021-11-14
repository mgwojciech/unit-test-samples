///<reference types="jest" />
import { SPPageProvider } from "../../src/dal/SPPageProvider";
import { MockHttpClient } from "spfx-ut-library";
import { assert } from "chai";
describe("SPPageProvider", () => {
	test("get listItem", async () => {
		let mockClient: MockHttpClient = new MockHttpClient(null);
		const expectedResult = {
			AuthorId: 1,
			BannerImageUrl: {
				Description: "Test",
				Url: "https://contoso.sharepoint.com/sites/test-site/test-image.jpg"
			},
			CanvasContent1: "<div></div>",
			CheckoutUserId: 1,
			ContentTypeId: "0x01",
			Id: 1,
			Created: "2019-01-01T00:00:00Z",
			Modified: "2019-01-01T00:00:00Z",
			GUID: "0c56ced0-b871-4672-98a3-e6a17dd9f1c9",
			Title: "Home"
		};
		mockClient.registerResponse({
			url: `https://contoso.sharepoint.com/sites/test-site/_api/web/lists/test-id/items(1)`,
			response: JSON.stringify(expectedResult),
			status: 200,
			method: "GET"
		});

		let provider = new SPPageProvider(mockClient as any, "test-id", "https://contoso.sharepoint.com/sites/test-site/");
		let result = await provider.getPage(1);

		assert.deepEqual(result, expectedResult);
	});
});
