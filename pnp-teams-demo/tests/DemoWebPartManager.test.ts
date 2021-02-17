/// <reference types="jest" />
import { assert } from "chai";
import { DemoWebPartManager } from "../src/manager/DemoWebPartManager";

describe("DemoWebPartManager", () => {
    test.each([
        [
            "default",
            "teamsTheme"
        ],
        [
            "dark",
            "teamsDarkTheme"
        ],
        [
            "contrast",
            "teamsHighContrastTheme"
        ]
    ])("should initialize with correct theme %j", (contextTheme, expectedTheme) => {
        let manager = new DemoWebPartManager({
            sdks: {
                microsoftTeams: {
                    context: {
                        theme: contextTheme
                    },
                    teamsJs: {
                        initialize: () => {

                        },
                        registerOnThemeChangeHandler: (callback) => {

                        }
                    }
                }
            }
        } as any, () => { });

        assert.equal(manager.getCurrentThemeName(), expectedTheme);
    });
    test("should execute theme changed callback", () => {
        let registeredCallback;
        let asserted = false;
        let manager = new DemoWebPartManager({
            sdks: {
                microsoftTeams: {
                    context: {
                        theme: "default"
                    },
                    teamsJs: {
                        initialize: () => {

                        },
                        registerOnThemeChangeHandler: (callback) => {
                            registeredCallback = callback;
                        }
                    }
                }
            }
        } as any, (theme) => {
            assert.equal(theme, "teamsDarkTheme");
            asserted = true;
        });
        registeredCallback("dark");
        assert.isTrue(asserted);
    });
});