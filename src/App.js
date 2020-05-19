import React from 'react';
import AppShell from './components/Appshell'
import { HashRouter as Router, Route } from 'react-router-dom'
import Home from './components/Home'
import Search from './components/Search'
import Words from './components/Words'
import Test from './components/Test'

function App() {
  return (
    <Router>
      <AppShell>
        <div>
          <Route exact path="/" component={Home}/>
          <Route exact path="/search" component={Search}/>
          <Route exact path="/words" component={Words}/>
          <Route exact path="/test" component={Test}/>
        </div>
      </AppShell>
    </Router>
  );
}

export default App;
