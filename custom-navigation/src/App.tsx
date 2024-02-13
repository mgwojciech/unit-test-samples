import * as React from "react";
import { SPListNavigation } from './components/SPListNavigation'
import { AuthenticationContextProvider, GraphContextProvider, SPContextProvider } from './context'
import { Msal2AuthenticationService } from "mgwdev-m365-helpers/lib/services/Msal2AuthenticationService";

const listId = import.meta.env.VITE_LIST_ID
function App() {
  const clientId = import.meta.env.VITE_APP_ID;
  const authProvider = new Msal2AuthenticationService({
    clientId
  })
  return (
    <AuthenticationContextProvider authProvider={authProvider} >
      <GraphContextProvider>
        <SPContextProvider siteUrl={import.meta.env.VITE_SITE_URL} >
          <SPListNavigation listId={listId} />
          <div>
            Test content
          </div>
        </SPContextProvider>
      </GraphContextProvider>
    </AuthenticationContextProvider>)
}

export default App
