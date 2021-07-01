/// <reference types="jest" />
import * as React from "react";
import { act, render, RenderResult } from "@testing-library/react";
import HelloWorld from "../../src/webparts/helloWorld/components/HelloWorld";
import { assert } from "chai";

describe("<<HelloWorld />", ()=>{
    test("should render description", ()=>{
        let helloWorldComponent: RenderResult;
        act(()=>{
            helloWorldComponent = render(<HelloWorld description="Test description" />)
        });

        let descriptionParagraph = helloWorldComponent.getByTestId("hello-world-description-paragraph");
        assert.equal(descriptionParagraph.textContent, "Test description");
    });
});