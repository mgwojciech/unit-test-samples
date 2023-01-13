export class TokenUtils{
    /**
     * Parses access token and returns its info
     * @param accessToken access token to get info from
     * @returns parsed access token info
     */
    public static getTokenInfo(accessToken: string): any{
        //I know there is a deprecation warning but note it's only for nodejs projects. In web atob is very much supported.
        var tokenInfo = atob(accessToken.split(".")[1]);
        return JSON.parse(tokenInfo);
    }
    /**
     * 
     * @param accessToken 
     * @returns false if token is expired, true otherwise
     */
    public static isTokenValid(accessToken: string): boolean{
        let jwtToken = TokenUtils.getTokenInfo(accessToken);
        if (jwtToken.exp < new Date().getTime() / 1000) {
            return false;
        }
        return true;
    }
}