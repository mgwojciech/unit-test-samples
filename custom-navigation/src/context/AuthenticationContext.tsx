import { IAuthenticationService } from "mgwdev-m365-helpers";
import * as React from "react";

export interface IAuthenticationContextProps {
    authProvider: IAuthenticationService;
}

export interface IAuthenticationContextProviderProps extends React.PropsWithChildren<{}> {
    authProvider?: IAuthenticationService;
    authProviderFactory?: () => Promise<IAuthenticationService>;
}

export const AuthenticationContext = React.createContext<IAuthenticationContextProps>({
    authProvider: {
        getAccessToken: () => {
            throw new Error("No authentication provider available");
        }
    }
});

export const useAuthentication = () => React.useContext<IAuthenticationContextProps>(AuthenticationContext);

export const AuthenticationContextProvider = (props: IAuthenticationContextProviderProps) => {
    const [authProvider, setAuthProvider] = React.useState<IAuthenticationService | undefined>(props.authProvider);
    const isProviderAvailable = React.useMemo(() => authProvider !== undefined, [authProvider]);

    React.useEffect(() => {
        if (props.authProvider) {
            setAuthProvider(props.authProvider);
        } else if (props.authProviderFactory) {
            props.authProviderFactory().then((authProvider) => {
                setAuthProvider(authProvider);
            });
        }
    }, [props.authProvider, props.authProviderFactory]);

    return authProvider && <AuthenticationContext.Provider value={{
        authProvider: authProvider
    }}>
        {isProviderAvailable && props.children}
    </AuthenticationContext.Provider>
}