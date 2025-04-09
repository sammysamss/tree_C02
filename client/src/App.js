import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/layout/Navbar';
import Dashboard from './Dashboard';

import AddTree from './components/trees/AddTree';
import TreeDetail from './components/trees/TreeDetail';
import EditTree from './components/trees/EditTree';
import NotFound from './components/layout/NotFound';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/add-tree" component={AddTree} />
            <Route exact path="/trees/:rfidId" component={TreeDetail} />
            <Route exact path="/trees/:rfidId/edit" component={EditTree} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;