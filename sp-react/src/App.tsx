import React from 'react';
import './App.css';
import { SPAppContextProvider } from './context/SPAppContext';
import { HelloWorldComponent } from './components/HelloWorld';

function App() {
  return (
    <SPAppContextProvider>
      <HelloWorldComponent />
    </SPAppContextProvider>
  );
}

export default App;
