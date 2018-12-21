import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";

import {auth} from "../actions";


class Register extends Component {

    state = {
        username: "",
        password: "",
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.login(this.state.username, this.state.password);
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        return (
            <form onSubmit={this.onSubmit}>
                <h2>Registration</h2>
                {this.props.errors.length > 0 && (
                    <ul>
                        {this.props.errors.map(error => (
                            <li key={error.field}>{error.message}</li>
                        ))}
                    </ul>
                )}
                <p>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text" id="username"
                        onChange={e => this.setState({username: e.target.value})}/>
                </p>
                <p>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password" id="password"
                        onChange={e => this.setState({password: e.target.value})}/>
                </p>
                <p>
                    <label htmlFor="password">Repeat password</label>
                    <input
                        type="password" id="password"
                        onChange={e => this.setState({password: e.target.value})}/>
                </p>
                <p>
                    <button type="submit">Registration</button>
                </p>

                <p>
                    Have an account? <Link to="/login">Login</Link>
                </p>
            </form>
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
        login: (username, password) => {
            return dispatch(auth.login(username, password));
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Register);