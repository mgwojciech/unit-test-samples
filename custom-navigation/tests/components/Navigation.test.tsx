import * as React from "react";
import { describe, test, expect, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { Navigation } from "../../src/components/Navigation";

describe("<Navigation />", () => {
    test("should render first row", async () => {
        const navigationService = {
            getNavigationNodes: vi.fn().mockResolvedValueOnce([{
                title: "Test 1",
                url: "https://google.com",
                fileDirRef: "/sites/test/lists/navigation",
                fileLeafRef: "Test 1",
                childCount: 1,
                id: "1"
            }, {
                title: "Test 2",
                url: "https://google.com",
                fileDirRef: "/sites/test/lists/navigation",
                fileLeafRef: "Test 2",
                childCount: 3,
                id: "2"
            }])
        }
        const wrapper = render(<Navigation navigationService={navigationService} />);
        await act(async () => {
            await waitFor(() => expect(navigationService.getNavigationNodes).toHaveBeenCalled())
        })
        const test1Element = await wrapper.findByText("Test 1");
        expect(test1Element.textContent).toBe("Test 1")
    })
});