import React, {Component} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import {connect, Provider} from "react-redux";
import app from "./reducers";
import {auth} from "./actions";
import Event from "./components/Event";
import EventForm from "./components/EventForm";
import Account from "./components/Account";
import AccountForm from "./components/AccountForm";
import Login from "./components/Login"
import Register from "./components/Registration"
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
            if (this.props.auth.isLoading) {
                return <em>Loading...</em>;
            } else if (!this.props.auth.isAuthenticated) {
                return <Redirect to="/login"/>;
            } else {
                return <ChildComponent {...props} />
            }
        }}/>
    }


    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/event/new/" component={EventForm}/>
                        <Route exact path="/event/edit/:id" component={EventForm}/>
                        <Route exact path="/event/:id" component={Event}/>

                        <Route exact path="/account" component={Account}/>
                        <Route exact path="/account/edit" component={AccountForm}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/registration" component={Register}/>

                        <Route exact path="*" component={NotFound}/>
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }
}


const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => {
            return dispatch(auth.loadUser());
        }
    }
}

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