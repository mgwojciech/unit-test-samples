/// <reference types="jest" />
import { assert } from "chai";
import { mount, configure } from 'enzyme';
import * as  Adapter from 'enzyme-adapter-react-16';
import * as React from "react";
import PnPDemoWebPart from "../src/webparts/pnPDemoWebPart/components/PnPDemoWebPart";

configure({ adapter: new Adapter() });

describe("<PnPDemoWebPart />", () => {
    test("should render initial widgets", () => {
        let component = mount(<PnPDemoWebPart context={{
            sdks: {
                microsoftTeams: {
                    context: {
                        theme: "default"
                    },
                    teamsJs: {
                        initialize: () => { },
                        registerOnThemeChangeHandler: (callback) => { }
                    }
                }
            }
        } as any
        } />);

        let widgets = component.instance().getWidgets();
        assert.equal(widgets[0].title, "Widget 1");
    });
});