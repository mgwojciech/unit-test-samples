import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Login, Person, Agenda, FileList, Todo } from '@microsoft/mgt-react';

function App() {
  return (<div className="App">
    <header>
      <Login />
    </header>
    <section>
      <Person personQuery="me" view={6} showPresence={true} />
      <Agenda />
      <FileList />
      <Todo />
    </section>
  </div>
  );
}

export default App;
