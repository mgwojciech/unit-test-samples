import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BackendAPIHttpClient } from './services/http/BackendAPIHttpClient';
import { FetchHttpClient } from "mgwdev-m365-helpers/lib/dal/http/FetchHttpClient";
import { AuthHttpClient } from 'mgwdev-m365-helpers/lib/dal/http/AuthHttpClient';
import { BatchGraphClient } from 'mgwdev-m365-helpers/lib/dal/http/BatchGraphClient';
import { TokenBrokerAuthService } from './services/auth/TokenBrokerAuthService';
import { TeamsSSOAuthTokenBrokerService } from './services/auth/TeamsSSOAuthTokenBrokerService';
import { HelloComponent } from './components/HelloComponent';
import { TeamsSSOAuthService } from './services/auth/TeamsSSOAuthService';

function App() {
  //very naive check for if we are in Teams or not
  const authService = window.parent === window ? new TokenBrokerAuthService() : new TeamsSSOAuthTokenBrokerService();
  const graphClient = new BatchGraphClient(new AuthHttpClient(authService, new FetchHttpClient()));

  const backendClient = window.parent === window ? new BackendAPIHttpClient(new FetchHttpClient(), "/") : new AuthHttpClient(new TeamsSSOAuthService(), new FetchHttpClient()) ;

  return (
    <div className="App">
      <HelloComponent graphClient={graphClient} backendClient={backendClient} />
    </div>
  );
}

export default App;
