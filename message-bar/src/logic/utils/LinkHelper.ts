import * as microsoftTeams from "@microsoft/teams-js";

export class LinkHelper {
    public static teamifyLink(element: HTMLAnchorElement) {
        let supportedExtension = LinkHelper.getSupportedExtension(element.href);
        if (supportedExtension) {
            let teamifiedUrl = `https://teams.microsoft.com/_#/${supportedExtension}/viewer/recent/` + element.href.split("/").join("~2F");

            element.href = teamifiedUrl;
            element.innerText = teamifiedUrl;
            element.onclick = (event) => {
                event.preventDefault();
                microsoftTeams.executeDeepLink(teamifiedUrl);
            };
        }
    }
    static getSupportedExtension(href: string) {
        let extension;
        let url = href.split("?")[0];
        ["docx", "pptx", "xlsx", "pdf", "doc", "xls", "ppt"].forEach(ext => {
            if (url.toLocaleLowerCase().indexOf("." + ext.toLocaleLowerCase()) == (url.length - ext.length - 1)) {
                extension = ext;
            }
        });
        return extension;
    }
}