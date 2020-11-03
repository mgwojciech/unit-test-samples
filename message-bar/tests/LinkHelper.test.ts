/// <reference types="jest" />

import { assert } from 'chai';
import each from "jest-each";
import { LinkHelper } from "./../src/logic/utils/LinkHelper";

jest.mock("@microsoft/teams-js", () => {
    return global["mockTeamsContext"];
});

describe("LinkHelper", ()=>{
    each(
        [
            [
                "https://test.sharepoint.com/sites/valo-modern-hr/Shared%20Documents/Employee Handbook.docx?web=1",
                "https://teams.microsoft.com/_#/docx/viewer/recent/https:~2F~2Ftest.sharepoint.com~2Fsites~2Fvalo-modern-hr~2FShared%20Documents~2FEmployee%20Handbook.docx?web=1"
            ],
            [
                "https://test.sharepoint.com/sites/valo-modern-hr/Shared%20Documents/Employee Handbook.docx",
                "https://teams.microsoft.com/_#/docx/viewer/recent/https:~2F~2Ftest.sharepoint.com~2Fsites~2Fvalo-modern-hr~2FShared%20Documents~2FEmployee%20Handbook.docx"
            ],
            [
                "https://test.sharepoint.com/sites/valo-modern-hr/Shared%20Documents/Employee Handbook.doc",
                "https://teams.microsoft.com/_#/doc/viewer/recent/https:~2F~2Ftest.sharepoint.com~2Fsites~2Fvalo-modern-hr~2FShared%20Documents~2FEmployee%20Handbook.doc"
            ]
        ]
    ).test("teamifyLink", (link, expectedLink) => {
        let navigationLink = document.createElement("a") as HTMLAnchorElement;
        navigationLink.href = link;
        document.body.appendChild(navigationLink);
        LinkHelper.teamifyLink(navigationLink);

        return new Promise((resolve, error) => {
            global["mockTeamsContext"].executeDeepLinkCallback = (deepLink) => {
                assert.equal(deepLink, expectedLink);
                resolve();
            }
            navigationLink.click();
        });
    });
});