///<reference types="jest" />

import { RenderResult, act, render } from "@testing-library/react";
import { NorthstarAvatar } from "../src/webparts/helloWorld/components/userAvatar/NorthstarAvatar";
import { assert } from "chai";
import { TestUtils } from "./TestUtils";
import * as React from "react";

describe("<NorthstarAvatar />", () => {
	test("should render loading animation", () => {
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
		act(() => {
			avatar = render(
				<NorthstarAvatar profileManager={profileManager as any} userId="test-user-id" />
			);
		});
		assert.isOk(avatar.getByRole("progressbar"));
	});
	test("should render profile", async () => {
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
		act(() => {
			avatar = render(
				<NorthstarAvatar profileManager={profileManager as any} userId="test-user-id" />
			);
		});
		await TestUtils.sleep(10);
		let avatarContainer = await avatar.getByTestId("northstar-avatar");

		let presenceElement = avatarContainer.querySelector("[data-aa-class='Status']");
		assert.isOk(presenceElement);

		let nameAndRoleDiv = avatarContainer.querySelector(".ui-avatar + div");
		assert.equal(nameAndRoleDiv.textContent, "Test UserTest job title");
	});
});
