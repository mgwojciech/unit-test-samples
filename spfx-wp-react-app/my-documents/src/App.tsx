import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MsalAuthenticationService } from './services/auth/MsalAuthenticationService';
import { AuthHttpClient } from 'mgwdev-m365-helpers/lib/dal/http/AuthHttpClient';
import { FetchHttpClient } from 'mgwdev-m365-helpers/lib/dal/http/FetchHttpClient';
import { GraphODataPagedDataProvider } from 'mgwdev-m365-helpers/lib/dal/dataProviders/GraphODataPagedDataProvider';
import { IUsedDocument } from './model/IUsedDocument';
import { UsedDocuments } from './components/UsedDocuments';

function App() {
  const authService = new MsalAuthenticationService({
    clientId: "13e88fe1-beef-46f6-84dc-76c2cba9b667" // You can replace this with your own client ID. This app already has permissions and supports localhost:3000 as reply url.
  });
  const authClient = new AuthHttpClient(authService, new FetchHttpClient());
  const dataProvider = new GraphODataPagedDataProvider<IUsedDocument>(authClient, "https://graph.microsoft.com/v1.0//me/insights/used", true);
  return (
    <div className="App">
      <UsedDocuments dataProvider={dataProvider} />
    </div>
  );
}

export default App;
