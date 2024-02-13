import * as React from "react";
import { describe, test, expect, vi } from 'vitest'
import { render} from '@testing-library/react'
import { NavigationNode } from "../../src/components/NavigationNode";

describe("<NavigationNode />", () => {
    test("should render with children", async () => {
        const onRequestChildNodes = vi.fn().mockResolvedValueOnce([{
            title: "Test 1.1",
            url: "https://google.com",
            fileDirRef: "/sites/test/lists/navigation",
            fileLeafRef: "Test 1.1",
            childCount: 0,
            id: "1.1"
        }])
        const wrapper = render(<NavigationNode node={{
            title: "Test 1",
            url: "https://google.com",
            fileDirRef: "/sites/test/lists/navigation",
            fileLeafRef: "Test 1",
            childCount: 1,
            id: "1"
        }} onRequestChildNodes={onRequestChildNodes} />);
        const test1Element = await wrapper.findByText("Test 1");
        expect(test1Element.textContent).toBe("Test 1");
        
        const expandButton = wrapper.getByTestId("expand-button");
        expandButton.click();
        const test11Element = await wrapper.findByText("Test 1.1");
        expect(test11Element.textContent).toBe("Test 1.1");
        expect(onRequestChildNodes).toHaveBeenCalled();
    })
});