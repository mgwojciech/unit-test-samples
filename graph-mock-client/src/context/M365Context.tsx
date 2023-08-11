import { Msal2AuthenticationService } from "mgwdev-m365-helpers/lib/services/Msal2AuthenticationService";
import { AuthHttpClient } from "mgwdev-m365-helpers/lib/dal/http/AuthHttpClient";
import { FetchHttpClient } from "mgwdev-m365-helpers/lib/dal/http/FetchHttpClient";
import { BatchGraphClient } from "mgwdev-m365-helpers/lib/dal/http/BatchGraphClient";
import * as React from "react";
import { IHttpClient } from "mgwdev-m365-helpers/lib/dal/http/IHttpClient";
import { BrandVariants, FluentProvider, teamsDarkTheme, teamsLightTheme, tokens } from '@fluentui/react-components';
import { IAuthenticationService } from "mgwdev-m365-helpers/lib/services/IAuthenticationService";
import { SandboxProxyGraphClient } from "mgwdev-m365-helpers/lib/dal/http/SandboxProxyGraphClient";

let authService: IAuthenticationService = new Msal2AuthenticationService({
  clientId: process.env.REACT_APP_FRONTEND_CLIENT_ID!,
});

const getGraphClient = (useMock: boolean = false, authService: IAuthenticationService) => {
  if(useMock){
    return new BatchGraphClient(new SandboxProxyGraphClient());
  }
  return new BatchGraphClient(
    new AuthHttpClient(authService, new FetchHttpClient())
  )
}
const graphClient = getGraphClient(window.location.search.includes("useMock=true"), authService);

export interface M365ContextProps {
  authService: IAuthenticationService;
  graphClient: IHttpClient;
}

export const M365Context = React.createContext<M365ContextProps>({
  authService,
  graphClient
});

export const useM365 = () => React.useContext<M365ContextProps>(M365Context);

export const M365Provider: React.FC<any> = (props) => {
  const { children, graphClient } = props;

  const authServiceRef = React.useRef(authService);
  const graphClientRef = React.useRef(getGraphClient(window.location.search.includes("useMock=true"), authServiceRef.current));

  return (
    <M365Context.Provider
      value={{
        authService: authServiceRef.current,
        graphClient: graphClient || graphClientRef.current
      }}
    >
      <FluentProvider style={{
      }} theme={props.darkMode ? teamsDarkTheme : teamsLightTheme}
      >
        {children}
      </FluentProvider>
    </M365Context.Provider>
  );
};
