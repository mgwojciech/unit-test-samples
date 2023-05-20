import { ISPListItem } from "../../src/model/ISPListItem";

export const mockISPListItem: ISPListItem = {
    AuthorId: 1,
    ContentTypeId: '0x01',
    Created: '2023-05-20T14:58:18Z',
    EditorId: 2,
    Id: 100,
    Modified: '2023-05-20T15:58:18Z',
    Title: 'Mock Item',
}

export const mockISPListItems: ISPListItem[] = [];
for (let i = 0; i < 10; i++) {
    mockISPListItems.push({
        AuthorId: i,
        ContentTypeId: '0x01',
        Created: new Date(2023, 5, 20, i, 0, 0).toISOString(),
        EditorId: i,
        Id: i + 100,
        Modified: new Date(2023, 5, 20, i, 0, 0).toISOString(),
        Title: `Mock Item ${i}`,
    });
}