/// <reference types="jest" />
import * as React from "react";
import { assert } from "chai";
import HelloWorld from "../src/webparts/helloWorld/components/HelloWorld";
import { render, fireEvent, getByTestId, RenderResult } from "@testing-library/react";
import { act } from "react-dom/test-utils";

jest.mock("@microsoft/sp-http", () => {
	return {
		SPHttpClient: {
			configurations: {
				v1: 1,
			},
		},
		HttpClient: {
			configurations: {
				v1: 1,
			},
		},
	};
});
describe("<HelloWorld />", () => {
	test("should render spinner", async () => {
		let mockedSPContext = {
			spHttpClient: {
				get: () =>
					Promise.resolve({
						json: () => Promise.resolve({ ThemePrimary: "MockTheme" }),
					}),
			},
			pageContext: {
				web: {
					absoluteUrl: "https://test.sharepoint.com/sites/tea-point",
				},
			},
		};
		let helloWorldComponent = render(<HelloWorld spContext={mockedSPContext as any} />);
		let spinner = await helloWorldComponent.getByTestId("loading-spinner");
		assert.isOk(spinner);
	});
	test("should render loaded data", async () => {
		let helloWorldComponent;
		act(() => {
			let mockedSPContext = {
				spHttpClient: {
					get: () =>
						Promise.resolve({
							json: () => Promise.resolve({ ThemePrimary: "MockTheme" }),
						}),
				},
				pageContext: {
					web: {
						absoluteUrl: "https://test.sharepoint.com/sites/tea-point",
					},
				},
			};
			helloWorldComponent = render(<HelloWorld spContext={mockedSPContext as any} />);
		});
		await sleep(20);
		let propertyDiv = await helloWorldComponent.getByTestId("web-property-div");
		assert.equal(propertyDiv.textContent, "MockTheme");
	});
	test("should load welcome page", async () => {
		let helloWorldComponent;
		act(() => {
			let mockedSPContext = {
				spHttpClient: {
					get: () =>
						Promise.resolve({
							json: () =>
								Promise.resolve({
									ThemePrimary: "MockTheme",
									WelcomePage: "Test.aspx",
								}),
						}),
				},
				pageContext: {
					web: {
						absoluteUrl: "https://test.sharepoint.com/sites/tea-point",
					},
				},
			};
			helloWorldComponent = render(<HelloWorld spContext={mockedSPContext as any} />);
		});
		await sleep(20);
		let loadWelcomePageBtn = await helloWorldComponent.getByTestId("load-welcome-page-btn");
		fireEvent.click(loadWelcomePageBtn);
		await sleep(20);
		let propertyDiv = await helloWorldComponent.getByTestId("welcome-page-div");
		assert.equal(propertyDiv.textContent, "Test.aspx");
	});
	test("should render profile (FluentUI)", async () => {
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
		let helloWorldComponent: RenderResult;
		act(() => {
			let mockedSPContext = {
				spHttpClient: {
					get: () =>
						Promise.resolve({
							json: () =>
								Promise.resolve({
									ThemePrimary: "MockTheme",
									WelcomePage: "Test.aspx",
								}),
						}),
				},
				pageContext: {
					web: {
						absoluteUrl: "https://test.sharepoint.com/sites/tea-point",
					},
					user: {
						loginName: "test.user",
					},
				},
			};
			helloWorldComponent = render(
				<HelloWorld
					spContext={mockedSPContext as any}
					profileManager={profileManager as any}
				/>
			);
		});
		await sleep(20);
		let avatarContainer = await helloWorldComponent.getByTestId("fluent-ui-avatar");
		let presenceElement = avatarContainer.querySelector(".ms-Persona-presence");
		assert.isOk(presenceElement);
		assert.equal(
			avatarContainer.querySelector(".ms-Persona-primaryText").textContent,
			"Test User"
		);
	});
    test("should render profile (Northstar)", async () => {
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
		let helloWorldComponent: RenderResult;
		act(() => {
			let mockedSPContext = {
				spHttpClient: {
					get: () =>
						Promise.resolve({
							json: () =>
								Promise.resolve({
									ThemePrimary: "MockTheme",
									WelcomePage: "Test.aspx",
								}),
						}),
				},
				pageContext: {
					web: {
						absoluteUrl: "https://test.sharepoint.com/sites/tea-point",
					},
					user: {
						loginName: "test.user",
					},
				},
			};
			helloWorldComponent = render(
				<HelloWorld
					spContext={mockedSPContext as any}
					profileManager={profileManager as any}
				/>
			);
		});
		await sleep(20);
		let avatarContainer = await helloWorldComponent.getByTestId("northstar-avatar");
		let presenceElement = avatarContainer.querySelector("[data-aa-class='Status']");
		assert.isOk(presenceElement);
	});
});

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
