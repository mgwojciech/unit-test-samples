import * as React from "react";
import { SPContext } from "../model/SPContext";
import { SPClient } from "../dal/SPClient";
import { IHttpClient } from "mgwdev-m365-helpers/lib/dal/http/IHttpClient";
import { Msal2AuthenticationService } from "mgwdev-m365-helpers/lib/services/Msal2AuthenticationService";
import { AuthHttpClient } from "mgwdev-m365-helpers/lib/dal/http/AuthHttpClient";
import { FetchHttpClient } from "mgwdev-m365-helpers/lib/dal/http/FetchHttpClient";

export type SPAppContextProviderProps = {
    children: React.ReactNode;
    siteUrl?: string;
    httpClient?: IHttpClient;
}

export type SPAppContextProps = {
    spContext?: SPContext;
    spClient?: IHttpClient;
    isContextLoaded: boolean;
}

export const SPAppContext = React.createContext<SPAppContextProps>({
    isContextLoaded: false
});

export const useSPContext = () => React.useContext(SPAppContext);

export const SPAppContextProvider = (props: SPAppContextProviderProps) => {
    const getSPClient = () => {
        if (props.httpClient) {
            return props.httpClient;
        }
        else {
            if (!process.env.REACT_APP_FRONTEND_CLIENT_ID) throw new Error("REACT_APP_FRONTEND_CLIENT_ID is not defined");

            if (!props.siteUrl && !process.env.REACT_APP_FRONTEND_SITE_URL) throw new Error("No site provided");
            const authService = new Msal2AuthenticationService({
                clientId: process.env.REACT_APP_FRONTEND_CLIENT_ID!,
            });
            let client = new AuthHttpClient(authService, new SPClient(new FetchHttpClient(), props.siteUrl || process.env.REACT_APP_FRONTEND_SITE_URL!));
            client.resourceUri = new URL(props.siteUrl || process.env.REACT_APP_FRONTEND_SITE_URL!).origin;
            return client;
        }
    }
    const [spContext, setSPContext] = React.useState<SPContext>();
    const [isContextLoaded, setIsContextLoaded] = React.useState<boolean>(false);
    const spClient = React.useRef<IHttpClient>(getSPClient()).current;

    const loadSPContext = async () => {
        const spContext = await spClient.get("/_api/web/PageContextInfo");
        return await spContext.json();
    }

    React.useEffect(() => {
        const loadContext = async () => {
            const spContext = await loadSPContext();
            setSPContext(spContext);
            setIsContextLoaded(true);
        }
        loadContext();
    }, [props.siteUrl, props.httpClient]);

    return (
        <SPAppContext.Provider value={{
            spContext: spContext,
            spClient: spClient,
            isContextLoaded: isContextLoaded
        }}>
            {props.children}
        </SPAppContext.Provider>
    );
}