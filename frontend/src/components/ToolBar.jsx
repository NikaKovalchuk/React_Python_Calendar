import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";

class ToolBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
        };
    }

    componentDidMount() {
        this.props.loadUser().then(response => {
            if (this.props.user) {
                this.setState({user: this.props.user});
            }
        });
    }

    render() {
        let list;
        if (this.props.user) {
            list = <div className={'wide'}>
                <ul className="navbar-nav navbar-left">

                </ul>
                <ul className="navbar-nav navbar-right">
                    <li className="nav-item active">
                        <a className="nav-link" onClick={this.props.logout}> LOG OUT </a>
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

const mapStateToProps = state => {
    return {
        events: state.events,
        user: state.auth.user,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addEvent: (text) => {
            return dispatch(events.addEvent(text));
        },
        loadUser: (id) => {
            return dispatch(auth.loadUser(id));
        },
        logout: () => dispatch(auth.logout()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar);