import { WebPartContext } from "@microsoft/sp-webpart-base";

export class DemoWebPartManager {
    protected theme: string;
    constructor(protected context: WebPartContext, onThemeUpdated: (themeName: string) => void) {
        this.theme = this.getThemeName(this.context.sdks.microsoftTeams.context.theme);
        this.context.sdks.microsoftTeams.teamsJs.initialize();
        this.context.sdks.microsoftTeams.teamsJs.registerOnThemeChangeHandler(theme => {
            this.theme = this.getThemeName(theme);
            onThemeUpdated(this.theme);
        });
    }
    public getCurrentThemeName = ()=>{
        return this.theme;
    }
    public getThemeName = (theme: string) => {
        switch (theme) {
            case "dark":
                return "teamsDarkTheme";
            case "contrast":
                return "teamsHighContrastTheme";
            default:
                return "teamsTheme";
        }
    }
}