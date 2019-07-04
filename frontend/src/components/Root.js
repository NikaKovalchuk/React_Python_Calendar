import React, {Component} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import {connect} from "react-redux";
import {auth} from "../actions";
import ToolBar from "./ToolBar";
import Login from "./forms/auth/Login"
import Main from "./Main"
import Register from "./forms/auth/Registration"
import NotFound from "./NotFound"

class RootContainerComponent extends Component {
    componentDidMount = () => this.props.loadUser();

    PrivateRoute = ({component: ChildComponent, ...rest}) => {
        const isAuthenticated = this.props;
        return <Route {...rest} render={props => {
            return isAuthenticated ?
                <ChildComponent {...props} /> :
                <Redirect to="/login"/>;
        }}/>
    };


    render() {
        let {PrivateRoute} = this;
        const isAuthenticated = this.props;
        return (
            <div>
                <ToolBar isAuthenticated={isAuthenticated}/>
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
        isAuthenticated: state.auth.isAuthenticated,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => dispatch(auth.loadUser()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RootContainerComponent);
