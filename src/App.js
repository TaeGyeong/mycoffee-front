import React from 'react';
import AppShell from './components/Appshell'
import { HashRouter as Router, Route } from 'react-router-dom'
import Home from './components/Home'
import Search from './components/Search'
import Test from './components/Test'
import CafeList from './components/CafeList'
import Likes from './components/Likes';

function App() {
  return (
    <Router>
      <AppShell>
        <div>
          <Route exact path="/" component={Home}/>
          <Route exact path="/list" component={CafeList}/>
          <Route exact path="/search" component={Search}/>
          <Route exact path="/likes" component={Likes}/>
          <Route exact path="/test" component={Test}/>
        </div>
      </AppShell>
    </Router>
  );
}

export default App;
