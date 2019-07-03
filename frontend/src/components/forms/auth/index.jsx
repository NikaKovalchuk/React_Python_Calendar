import React, {PureComponent} from "react";
import {Link, Redirect} from 'react-router-dom';
import "../../../css/form.css"
import PropTypes from "prop-types";
import {connect} from "react-redux";


/**
 * Common component for auth forms.
 * Contains username and password fields, submit button and link to another auth form.
 *
 * @param {func} auth           onSubmit function.
 * @param {object} errors       Actual form errors.
 * @param {string} footer       Helper text.
 * @param {string} link         Redirect link.
 * @param {string} title        Form title.
 * @param {string} redirect     Redirect form title.
 */
class Auth extends PureComponent {

    state = {
        username: "",
        password: "",
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.auth(this.state.username, this.state.password);
    }

    render() {

        const {
            title,
            errors,
            footer,
            link,
            redirect
        } = this.props;

        if (this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        return (
            <div className={'form'}>
                <form onSubmit={this.onSubmit}>
                    <fieldset>
                        <legend className={'title'}>{title} </legend>
                        {errors.length > 0 && (
                            <ul>
                                {errors.map(error => (
                                    <li key={error.field}>{error.message}</li>
                                ))}
                            </ul>
                        )}
                        <div className={'group'}>
                            <label className={'label'} htmlFor="username">Username</label>
                            <input
                                className={'input'}
                                type="text" id="username"
                                onChange={e => this.setState({username: e.target.value})}/>
                        </div>
                        <div className={'group'}>
                            <label className={'label'} htmlFor="password">Password</label>
                            <input
                                className={'input'}
                                type="password" id="password"
                                onChange={e => this.setState({password: e.target.value})}/>
                        </div>
                        <div><button className={'btn btn-secondary'} type="submit">{title}</button></div>
                        <div>{footer} <Link to={link}>{redirect}</Link> </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}

Auth.propTypes = {
    auth: PropTypes.func,
    footer: PropTypes.any,
    errors: PropTypes.object,
    link: PropTypes.string,
    title: PropTypes.string,
    redirect: PropTypes.string,
};

const mapStateToProps = state => {
    const errors = state.auth.loginErrors ? Object.keys(state.auth.loginErrors).map(field => {
        return {field, message: state.auth.loginErrors[field]};
    }) : [];
    return {
        errors
    };
}

export default connect(mapStateToProps, null)(Auth);