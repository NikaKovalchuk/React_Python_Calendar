import React, { Component } from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';

import { Provider } from "react-redux";
import app from "./reducers";

import Events from "./components/Events";
import Login from "./components/Login"
import NotFound from "./components/NotFound";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

let store = createStore(app, applyMiddleware(thunk));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/event" component={Events} />
            <Route exact path="/login" component={Login} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;