import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import DynamicForm from "./DynamicForm"

import {auth} from "../actions";


class Register extends Component {

    state = {
        username: "",
        password: "",
        password2: "",
        user: {},
    }

    onSubmit = (model) => {
        this.props.registration(model);
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        return (
            <div>
                <DynamicForm className="form"
                             title="Registration"
                             data={this.state.user}
                             model={[
                                 {key: "email", label: "Email", type: "email", props: {required: true}},
                                 {key: "password1", label: "Password", type: "password", props: {required: true}},
                                 {
                                     key: "password2",
                                     label: "Password (repeat)",
                                     type: "password",
                                     props: {required: true}
                                 },
                             ]}
                             onSubmit={(model) => this.onSubmit(model)}
                />
                <p className={"info"}>
                    Don't have an account? <Link to="/login">Login</Link>
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
        registration: (model) => {
            return dispatch(auth.registration(model));
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Register);