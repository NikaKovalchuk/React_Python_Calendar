import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import DynamicForm from "./DynamicForm"
import {auth} from "../actions";


class Login extends Component {

    state = {
        username: "",
        password: "",
        user: {},
    }

    onSubmit = (model) => {
        this.props.login(model);
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        return (
            <div>
                <DynamicForm className="form"
                             title="Login"
                             data={this.state.user}
                             model={[
                                 {key: "email", label: "Email", type: "email", props: {required: true}},
                                 {key: "password", label: "Password", type: "password", props: {required: true}},
                             ]}
                             onSubmit={(model) => this.onSubmit(model)}
                />
                <p className={"info"}>
                    Don't have an account? <Link to="/registration">Registration</Link>
                </p>
            </div>
        )
    }
}

const mapStateToProps = state => {
    let errors = [];
    if (state.auth.errors) {
        errors = Object.keys(state.auth.errors).map(field => {
            return {field, message: state.auth.errors[field]};
        });
    }
    return {
        errors,
        isAuthenticated: state.auth.isAuthenticated
    };
}

const mapDispatchToProps = dispatch => {
    return {
        login: (model) => {
            return dispatch(auth.login(model));
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);