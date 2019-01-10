import React, {Component} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import {connect, Provider} from "react-redux";
import app from "./reducers";
import {auth} from "./actions";
import Event from "./components/Event";
import EventForm from "./components/EventForm";
import ToolBar from "./components/ToolBar";
import Login from "./components/Login"
import Settings from "./components/Settings"
import Main from "./components/Main"
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
          if (this.props.auth.isAuthenticated) {
            return <ChildComponent {...props} />
          } else if (this.props.auth.isLoading) {
            return <em>Loading...</em>;
          } else {
            console.log('s')
            return <Redirect to="/login" />;
          }
        }} />
      }


    render() {
        let {PrivateRoute} = this;
        return (
            <Provider store={store}>
                <ToolBar/>
                <BrowserRouter>
                    <div id={"content"}>
                        <Switch>
                            <PrivateRoute exact path="/event/new/" component={EventForm}/>
                            <PrivateRoute exact path="/event/edit/:id" component={EventForm}/>
                            <PrivateRoute exact path="/event/:id" component={Event}/>
                            <PrivateRoute exact path="/settings" component={Settings}/>
                            <PrivateRoute exact path="/" component={Main}/>


                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/registration" component={Register}/>
                            <Route exact path="*" component={NotFound}/>
                        </Switch>
                    </div>
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
