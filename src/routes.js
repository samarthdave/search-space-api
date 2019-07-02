import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import App from './App';
import Search from './components/Search';
import Welcome from './components/Welcome';

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