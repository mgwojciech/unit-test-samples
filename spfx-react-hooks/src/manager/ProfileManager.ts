import { MSGraphClient } from "@microsoft/sp-http";
import { IProfile } from "../model/IProfile";

export class ProfileManager {
    constructor(protected graphClient: MSGraphClient) {

    }
    /**
     * Returns profile with picture and presence
     * @param userId userId or login
     */
    public async getUserProfile(userId: string):Promise<IProfile>{
        let profileBaseUrl = `/users/${userId}`;
        let batch = [
            {
                id: "profile",
                url: profileBaseUrl,
                method: "GET"
            },
            {
                id: "photo",
                url: `${profileBaseUrl}/photo/$value`,
                method: "GET"
            }
        ];

        let response = await this.graphClient.api("/$batch").version("beta").post({requests: batch});
        let profile: IProfile;
        let profileResponse = response.responses.find(resp=>resp.id === "profile");
        if(profileResponse.status === 200){
            profile = profileResponse.body;
        }
        let photoResponse = response.responses.find(resp=>resp.id === "photo");
        if(photoResponse.status === 200){
            profile.imgSrc = "data:image/jpeg;base64," + photoResponse.body;
        }
        let presenceResponse = await this.graphClient.api(`/users/${profile.id}/presence`).get();
        if(presenceResponse){
            profile.presence = presenceResponse.availability;
        }

        return profile;
    }
}