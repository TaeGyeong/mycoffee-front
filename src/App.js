import React from 'react';
import AppShell from './components/Appshell'
import { HashRouter as Router, Route } from 'react-router-dom'
import Home from './components/Home'
import Texts from './components/Texts'
import Words from './components/Words'
import Test from './components/Test'

function App() {
  return (
    <Router>
      <AppShell>
        <div>
          <Route exact path="/" component={Home}/>
          <Route exact path="/texts" component={Texts}/>
          <Route exact path="/words" component={Words}/>
          <Route exact path="/test" component={Test}/>
        </div>
      </AppShell>
    </Router>
  );
}

export default App;
