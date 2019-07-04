import React, {Component} from "react";
import {connect} from "react-redux";

import {Redirect} from "react-router-dom";
import {auth as messages} from "../../../messages";
import {auth} from "../../../actions";
import Auth from "./index";
import PropTypes from "prop-types";


/**
 * Register form component.
 *
 * @param {func} register               Register function.
 * @param {object} errors               Actual register errors.
 * @param {bool} isAuthenticated        IsAutintificated flag.
 */
class Register extends Component {
    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        return (
            <Auth
                auth={this.props.register}
                footer={messages.helperText.register}
                link={"/login"}
                title={messages.title.register}
                redirect={messages.title.login}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
};

const mapDispatchToProps = dispatch => {
    return {
        register: (username, password) => dispatch(auth.register(username, password)),
    };
};

Register.propTypes = {
    register: PropTypes.func,
    isAuthenticated: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
