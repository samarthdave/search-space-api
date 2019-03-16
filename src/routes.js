import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import App from './App';
import Welcome from './components/Welcome';
import Search from './components/Search';

const createRoutes = () => (
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Welcome}/>
        <Route exact path="/search" component={Search}/>
      </Switch>
    </App>
  </Router>
);

export default createRoutes;