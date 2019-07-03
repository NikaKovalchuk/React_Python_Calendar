import React, {Component} from "react";
import {connect} from "react-redux";
import {Redirect} from 'react-router-dom';
import {auth as messages} from "../../../messages";
import {auth} from "../../../actions";
import "../../../css/form.css"
import Auth from "./index";
import PropTypes from "prop-types";


/**
 * Login form component.
 *
 * @param {func} login                  Login function.
 * @param {object} errors               Actual login errors.
 * @param {bool} isAuthenticated        IsAutintificated flag.
 */
class Login extends Component {
    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        return (
            <Auth
                auth={this.props.login}
                footer={messages.helperText.login}
                link={"/registration"}
                title={messages.title.login}
                redirect={messages.title.register}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
}

const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => dispatch(auth.login(username, password))
    };
}

Login.propTypes = {
    login: PropTypes.func,
    isAuthenticated: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);