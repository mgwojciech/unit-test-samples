import * as React from "react";
import { useAuthentication } from "./AuthenticationContext";
import { AuthHttpClient, FetchHttpClient, IHttpClient } from "mgwdev-m365-helpers";

export interface ISPContextProps {
    siteUrl: string;
    spClient: IHttpClient;
}

export interface ISPContextProviderProps extends React.PropsWithChildren<{}> {
    siteUrl: string;
    spClient?: IHttpClient;
}

export const SPContext = React.createContext<ISPContextProps>({
    siteUrl: "",
    spClient: new FetchHttpClient()
});
export const useSP = () => React.useContext<ISPContextProps>(SPContext);

export const SPContextProvider = (props: ISPContextProviderProps) => {
    const { authProvider } = useAuthentication();
    const [spClient, setSPClient] = React.useState<IHttpClient | undefined>(props.spClient);

    React.useEffect(() => {
        if (props.spClient) {
            setSPClient(props.spClient);
        }
        else {
            var client = new AuthHttpClient(authProvider, new FetchHttpClient());
            client.resourceUri = (new URL(props.siteUrl)).origin;
            setSPClient(client)
        }
    }, [props.spClient, authProvider]);

    return spClient && <SPContext.Provider value={{
        siteUrl: props.siteUrl,
        spClient: spClient
    }}>
        {props.children}
    </SPContext.Provider>
}