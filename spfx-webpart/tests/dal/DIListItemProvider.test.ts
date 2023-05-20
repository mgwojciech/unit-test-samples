///<reference types="jest" />
import { DIListItemProvider } from "../../src/dal/DIListItemProvider";
import { IHttpClient } from "../../src/dal/IHttpClient";
import { ISPListItem } from "../../src/model/ISPListItem";
import { mockISPListItem, mockISPListItems } from "./Mocks";
describe("DIListItemProvider", () => {
	let mockHttpClient: IHttpClient;
	const siteUrl = "http://test.sharepoint.com";
	const listName = "Test List";
	const itemId = 1;
	
	beforeEach(() => {
		// Mock HttpClient
		mockHttpClient = {
			get: jest.fn(),
			post: jest.fn()
		};
	});

	it("Should call the correct URL when calling getById", async () => {
		const provider = new DIListItemProvider<ISPListItem>(mockHttpClient, siteUrl, listName);
		const itemUrl = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`;

		jest.spyOn(mockHttpClient, "get").mockResolvedValue(mockISPListItem);
		const item = await provider.getById(itemId);

		expect(mockHttpClient.get).toBeCalledWith(itemUrl);
		expect(item.Title).toEqual(mockISPListItem.Title);
	});

	it("Should call the correct URL when calling getListItems", async () => {
		const provider = new DIListItemProvider<ISPListItem>(mockHttpClient, siteUrl, listName);
		const itemsUrl = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`;

		jest.spyOn(mockHttpClient, "get").mockResolvedValue({ value: mockISPListItems });
		const items = await provider.getListItems();

		expect(mockHttpClient.get).toBeCalledWith(itemsUrl);
		expect(items).toEqual(mockISPListItems);
	});
});
