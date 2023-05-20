///<reference types="jest" />
import { ItemsWithAuthorDetailsManager } from "../../src/manager/ItemsWithAuthorDetailsManager";
describe("ItemsWithAuthorDetailsManager", ()=>{
	test("should get users", async ()=>{
		const listItemProvider = {
			getListItems: jest.fn(),
			getById: jest.fn()
		};
		const userProvider = {
			getListItems: jest.fn(),
			getById: jest.fn()
		};

		jest.spyOn(listItemProvider, "getListItems").mockResolvedValueOnce([
			{
				Id: 1,
				Title: "Item 1",
				AuthorId: 1
			},
			{
				Id: 2,
				Title: "Item 2",
				AuthorId: 2
			},
			{
				Id: 3,
				Title: "Item 3",
				AuthorId: 1
			}
		]);
		jest.spyOn(userProvider, "getById").mockResolvedValueOnce({
			Id: 1,
			Title: "User 1"
		});
		jest.spyOn(userProvider, "getById").mockResolvedValueOnce({
			Id: 2,
			Title: "User 2"
		});

		const manager = new ItemsWithAuthorDetailsManager(listItemProvider, userProvider);
		const items = await manager.getItemsWithAuthorDetails();

		expect(listItemProvider.getListItems).toBeCalled();
		expect(items[0].Author.Title).toEqual("User 1");
	});
});
				