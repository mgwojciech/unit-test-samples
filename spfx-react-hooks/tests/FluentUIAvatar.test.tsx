///<reference types="jest" />

import { RenderResult, act, render } from "@testing-library/react";
import { FluentUIAvatar } from "../src/webparts/helloWorld/components/userAvatar/FluentUIAvatar";
import { assert } from "chai";
import { TestUtils } from "./TestUtils";
import * as React from "react";

describe("<FluentUIAvatar />", ()=>{
    test("should render loading animation", ()=>{
        let profileManager = {
			getUserProfile: () =>
				Promise.resolve({
					id: "test-user-id",
					displayName: "Test User",
					jobTitle: "Test job title",
					presence: "Available",
					imgSrc: "",
				}),
		};
        let avatar: RenderResult;
        act(()=>{
            avatar = render(<FluentUIAvatar profileManager={profileManager as any} userId="test-user-id" />);
        });
        assert.isOk(avatar.container.querySelector(".ms-Spinner"));
    })
    test("should render profile", async ()=>{
        let profileManager = {
			getUserProfile: () =>
				Promise.resolve({
					id: "test-user-id",
					displayName: "Test User",
					jobTitle: "Test job title",
					presence: "Available",
					imgSrc: "",
				}),
		};
        let avatar: RenderResult;
        act(()=>{
            avatar = render(<FluentUIAvatar profileManager={profileManager as any} userId="test-user-id" />);
        });
        await TestUtils.sleep(10);
		let avatarContainer = await avatar.getByTestId("fluent-ui-avatar");
		let presenceElement = avatarContainer.querySelector(".ms-Persona-presence");
		assert.isOk(presenceElement);
		assert.equal(
			avatarContainer.querySelector(".ms-Persona-primaryText").textContent,
			"Test User"
		);
		assert.equal(
			avatarContainer.querySelector(".ms-Persona-secondaryText").textContent,
			"Test job title"
		);
    });
});