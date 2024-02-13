import * as React from "react";
import ReactDOM from 'react-dom/client'
import App from './App'
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <FluentProvider theme={teamsLightTheme}>
        <App />
    </FluentProvider>,
)
