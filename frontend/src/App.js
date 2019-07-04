import React, {Component} from 'react';
import {Provider} from "react-redux";
import app from "./reducers";
import {applyMiddleware, createStore} from "redux";
import RootContainer from "./components/RootContainer"
import thunk from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension';

const store = createStore(app, composeWithDevTools(applyMiddleware(thunk)));

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <RootContainer/>
            </Provider>
        )
    }
}
