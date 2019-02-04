import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";
import PropTypes from 'prop-types';

class ToolBar extends Component {

    render() {
        let list;
        if (this.props.isAuthenticated) {
            list = <div className={'wide'}>
                <ul className="navbar-nav navbar-left">

                </ul>
                <ul className="navbar-nav navbar-right">
                    <li className="nav-item active">
                        <a className="nav-link" onClick={this.props.logout} href="/login"> LOG OUT </a>
                    </li>
                </ul>
            </div>
        } else {
            list = <ul className="navbar-nav"></ul>
        }
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/">CALENDAR</a>
                <div className="collapse navbar-collapse" id="navbarNav">
                    {list}
                </div>
            </nav>
        )
    }
}


ToolBar.propTypes = {
    isAuthenticated: PropTypes.bool
};


const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(auth.logout()),
    }
};

export default connect(null, mapDispatchToProps)(ToolBar);

