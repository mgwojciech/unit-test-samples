import { describe, test, expect, vi } from 'vitest'
import { ListNavigationService } from "../../src/services/navigation/ListNavigationService";

describe("ListNavigationService", () => {
    test("Should get data for root", async () => {
        const dataProvider = {
            getData: vi.fn(),
            setQuery: vi.fn()
        }
        dataProvider.getData.mockResolvedValueOnce([{
            Title: "Test 1",
            URL: "https://google.com",
            FileDirRef: "/sites/test/lists/navigation",
            FileLeafRef: "Test 1",
            ItemChildCount: 1,
            FolderChildCount: 2,
            ID: 1
        },
        {
            Title: "Test 2",
            URL: "https://google.com",
            FileDirRef: "/sites/test/lists/navigation",
            FileLeafRef: "Test 2",
            ItemChildCount: 1,
            FolderChildCount: 1,
            ID: 1
        }])
        const service = new ListNavigationService(dataProvider as any);
        const nodes = await service.getNavigationNodes();
        expect(nodes).toHaveLength(2);
        expect(nodes[0].childCount).toBe(3)
    });
    test("should get data for a node", async () => {
        const dataProvider = {
            getData: vi.fn(),
            setQuery: vi.fn()
        }
        dataProvider.getData.mockResolvedValueOnce([{
            Title: "Test 21",
            URL: "https://google.com",
            FileDirRef: "/sites/test/lists/navigation/Test 1",
            FileLeafRef: "Test 21",
            ItemChildCount: 1,
            FolderChildCount: 2,
            ID: 1
        },
        {
            Title: "Test 22",
            URL: "https://google.com",
            FileDirRef: "/sites/test/lists/navigation/Test 1",
            FileLeafRef: "Test 22",
            ItemChildCount: 1,
            FolderChildCount: 1,
            ID: 1
        }])
        const service = new ListNavigationService(dataProvider as any);
        const nodes = await service.getNavigationNodes({
            title: "Test 1",
            url: "https://google.com",
            fileDirRef: "/sites/test/lists/navigation",
            fileLeafRef: "Test 1",
            childCount: 1,
            id: "1"
        });
        expect(nodes).toHaveLength(2);
    })
})