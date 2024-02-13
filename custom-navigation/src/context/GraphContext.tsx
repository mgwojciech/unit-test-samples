import * as React from "react";
import { useAuthentication } from "./AuthenticationContext";
import { AuthHttpClient, BatchGraphClient, FetchHttpClient, IHttpClient } from "mgwdev-m365-helpers";

export interface IGraphContextProps {
    graphClient: IHttpClient;
}

export interface IGraphContextProviderProps extends React.PropsWithChildren<{}> {
    graphClient?: IHttpClient;
}
export const GraphContext = React.createContext<IGraphContextProps | undefined>(undefined);
export const useGraph = () => React.useContext<IGraphContextProps | undefined>(GraphContext);

export const GraphContextProvider = (props: IGraphContextProviderProps) => {
    const { authProvider } = useAuthentication();
    const getGraphClient = () => {
        if (props.graphClient) {
            return props.graphClient;
        }
        else if (authProvider) {
            return new BatchGraphClient(new AuthHttpClient(authProvider, new FetchHttpClient()));
        }
        return undefined;
    }

    const [graphClient, setGraphClient] = React.useState<IHttpClient | undefined>(getGraphClient());

    React.useEffect(() => {
        setGraphClient(getGraphClient());
    }, [props.graphClient, authProvider]);

    return graphClient && (
        <GraphContext.Provider value={{
            graphClient: graphClient
        }}>
            {props.children}
        </GraphContext.Provider>
    );
}