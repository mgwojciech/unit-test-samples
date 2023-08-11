import React from 'react';
import logo from './logo.svg';
import { M365Provider } from './context/M365Context';
import { HelloComponent } from './components/HelloComponent';

function App() {
  return (
    <M365Provider darkMode={false}>
      <div className="App">
        <header className="App-header">
          <HelloComponent />
        </header>
      </div>
    </M365Provider>
  );
}

export default App;
