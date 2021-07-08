///<reference types="jest" />

import { act, render, RenderResult } from "@testing-library/react";
import { assert } from "chai";
import * as React from "react";
import { Documents } from "../../src/webparts/helloWorld/components/Documents";

describe("<Documents />", ()=>{
    test("should render loading animation", ()=>{
        let documents: RenderResult;
        let mockDataProvider = {
            getDocuments: ()=>Promise.resolve([{
                id: "test-id",
                title: "Test document",
                url: "https://test.sharepoint.com/sites/tea-point/shared documents/test documents.docx"
            }])
        }
        act(()=>{
            documents = render(<Documents documentsProvider={mockDataProvider} />);
        });

        let loadingAnimation = documents.getByTestId("documents-loading-animation");
        assert.isOk(loadingAnimation);
    });
    test("should render document", async ()=>{
        let documents: RenderResult;
        let mockDataProvider = {
            getDocuments: ()=>Promise.resolve([{
                id: "test-id",
                title: "Test document",
                url: "https://test.sharepoint.com/sites/tea-point/shared documents/test documents.docx"
            }])
        }
        await act(async ()=>{
            documents = render(<Documents documentsProvider={mockDataProvider} />);
        });

        let doc = documents.getByTestId("document-href-element");
        assert.equal(doc.textContent, "Test document");
        assert.equal(doc.getAttribute("href"), "https://test.sharepoint.com/sites/tea-point/shared documents/test documents.docx");
    })
})