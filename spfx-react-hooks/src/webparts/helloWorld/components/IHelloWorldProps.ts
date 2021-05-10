import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ProfileManager } from "../../../manager/ProfileManager";

export interface IHelloWorldProps {
  spContext: WebPartContext;
  profileManager?: ProfileManager;
}
