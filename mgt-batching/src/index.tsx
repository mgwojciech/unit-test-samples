import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Providers,CacheService } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
import { GraphAutoBatch } from './GraphAutoBatch';

CacheService.config.isEnabled = false;
Providers.globalProvider = new Msal2Provider({
  clientId: process.env.REACT_APP_FRONTEND_CLIENT_ID!,
});
Providers.globalProvider.graph = new GraphAutoBatch(Providers.globalProvider);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
