///<reference types="jest" />
import * as React from "react";
import PnPUnitTestSample from "../../src/webparts/pnPUnitTestSample/components/PnPUnitTestSample";
import { RenderResult, render, act } from "@testing-library/react";
let spfiMockInstance;
jest.mock("@pnp/sp", () => ({
    SPFx: () => spfiMockInstance,
    spfi: () => spfiMockInstance,
    SPFI: () => spfiMockInstance
}));
jest.mock("@pnp/sp/webs", () => ({}));
jest.mock("@pnp/sp/lists", () => ({}));
jest.mock("@pnp/sp/items", () => ({}));
describe("<PnPUnitTestSample />", () => {
    test("should mount TestComponent", async () => {
        //@ts-ignore
        let component: RenderResult = null;
        //mock spfi object
        spfiMockInstance = {
            web:{
                lists:{
                    getByTitle: ()=>({
                        items:{
                            select: ()=>(()=>Promise.resolve([
                                {
                                    Id: 1,
                                    Title: "Test employee 1",
                                    tech: "Test tech 1"
                                }
                            ]))
                        }
                    })
                }
            }
        }
        spfiMockInstance.using = () => spfiMockInstance;
        await act(async () => {
            component = render(<PnPUnitTestSample context={{} as any} />);
        });
        //expect component to be rendered
        expect(component).toBeDefined();
        //as we awaited act method we should get our employee already rendered
        expect(component.getByText("Test employee 1")).toBeDefined();
    });
})