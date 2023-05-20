///<reference types="jest" />
import { SPContextListItemProvider } from "../../src/dal/SPContextListItemProvider";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";
import { ISPListItem } from "../../src/model/ISPListItem";
import { mockISPListItem, mockISPListItems } from "./Mocks";

jest.mock("@microsoft/sp-http", () => ({
	SPHttpClient: {
		configurations: {
			v1: "v1",
		},
	},
	SPHttpClientResponse: jest.fn(),
}));

describe("SPContextListItemProvider", () => {
	let mockContext: WebPartContext;
	const listName = "Test List";
	const itemId = 1;

	it("Should call the correct URL when calling getListItems", async () => {
		
		// Mock WebPartContext
		mockContext = {
			spHttpClient: {
				get: jest.fn().mockReturnValue(Promise.resolve({
					ok: true,
					json: jest.fn().mockReturnValue(Promise.resolve({ value: [mockISPListItems] }))
				})),
			},
			pageContext: {
				web: {
					absoluteUrl: "http://test.sharepoint.com",
				},
			},
		} as unknown as WebPartContext;
		const provider = new SPContextListItemProvider<ISPListItem>(mockContext, listName);
		const itemsUrl = `${mockContext.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items`;

		await provider.getListItems();

		expect(mockContext.spHttpClient.get).toBeCalledWith(itemsUrl, SPHttpClient.configurations.v1);
	});

	it("Should call the correct URL when calling getById", async () => {
		// Mock WebPartContext
		mockContext = {
			spHttpClient: {
				get: jest.fn().mockReturnValue(Promise.resolve({
					ok: true,
					json: jest.fn().mockReturnValue(Promise.resolve({ value: mockISPListItem }))
				})),
			},
			pageContext: {
				web: {
					absoluteUrl: "http://test.sharepoint.com",
				},
			},
		} as unknown as WebPartContext;
		const provider = new SPContextListItemProvider<ISPListItem>(mockContext, listName);
		const itemUrl = `${mockContext.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`;

		await provider.getById(itemId);

		expect(mockContext.spHttpClient.get).toBeCalledWith(itemUrl, SPHttpClient.configurations.v1);
	});
});