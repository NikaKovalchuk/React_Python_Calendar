import React, {Component} from 'react';
import {Provider} from "react-redux";
import RootContainer from "./components/RootContainer"
import {store} from "./state/store";

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <RootContainer/>
            </Provider>
        )
    }
}
