///<reference types="jest" />
import { PnPListItemProvider } from "../../src/dal/PnPListItemProvider";
import { SPFI } from "@pnp/sp";
import { ISPListItem } from "../../src/model/ISPListItem";
import { mockISPListItem, mockISPListItems } from "./Mocks";

jest.mock("@pnp/sp/webs", () => ({}));
jest.mock("@pnp/sp/lists", () => ({}));
jest.mock("@pnp/sp/items", () => ({}));


describe("PnPListItemProvider", () => {
	let mockSpfi: SPFI;
	const listName = "Test List";
	const itemId = 1;

	it("Should call the correct methods when calling getListItems", async () => {
		// Mock SPFI
		mockSpfi = {
			web: {
				lists: {
					getByTitle: jest.fn().mockReturnValue({ items: () => mockISPListItems })
				},
			},
		} as unknown as SPFI;
		const provider = new PnPListItemProvider<ISPListItem>(mockSpfi, listName);

		const items = await provider.getListItems();

		expect(mockSpfi.web.lists.getByTitle).toBeCalledWith(listName);
		expect(items).toEqual(mockISPListItems);
	});

	it("Should call the correct methods when calling getById", async () => {
		// Mock SPFI
		mockSpfi = {
			web: {
				lists: {
					getByTitle: jest.fn().mockReturnValue({
						items: {
							getById: jest.fn().mockReturnValue(()=>Promise.resolve(mockISPListItem))
						}
					})
				},
			},
		} as unknown as SPFI;
		const provider = new PnPListItemProvider<ISPListItem>(mockSpfi, listName);

		const item = await provider.getById(itemId);

		expect(mockSpfi.web.lists.getByTitle).toBeCalledWith(listName);
		expect(item).toEqual(mockISPListItem);
	});
});



