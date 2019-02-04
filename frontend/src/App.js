import React, {Component} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import {connect, Provider} from "react-redux";
import app from "./reducers";
import {auth} from "./actions";
import ToolBar from "./components/ToolBar";
import Login from "./components/forms/Login"
import Main from "./components/Main"
import Register from "./components/forms/Registration"
import NotFound from "./components/NotFound"
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";

let store = createStore(app, applyMiddleware(thunk));

class RootContainerComponent extends Component {
    componentDidMount() {
        this.props.loadUser();
    }

    PrivateRoute = ({component: ChildComponent, ...rest}) => {
        return <Route {...rest} render={props => {
            if (this.props.auth.isAuthenticated) {
                return <ChildComponent {...props} />
            } else {
                return <Redirect to="/login"/>;
            }
        }}/>
    };


    render() {
        let {PrivateRoute} = this;
        return (
            <div>
                <ToolBar isAuthenticated={this.props.auth.isAuthenticated}/>
                <BrowserRouter>
                    <div id={"content"}>
                        <Switch>
                            <PrivateRoute exact path="/" component={Main}/>

                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/registration" component={Register}/>
                            <Route exact path="*" component={NotFound}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => {
            return dispatch(auth.loadUser());
        }
    }
};

let RootContainer = connect(mapStateToProps, mapDispatchToProps)(RootContainerComponent);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <RootContainer/>
            </Provider>
        )
    }
}
