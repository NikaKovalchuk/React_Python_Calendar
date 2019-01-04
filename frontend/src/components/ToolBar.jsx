import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";

class ToolBar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/">CALENDAR</a>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="/event/new">ADD EVENT</a>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="/settings">SETTINGS</a>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="/login">LOG</a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = state => {
    return {
        events: state.events,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addEvent: (text) => {
            return dispatch(events.addEvent(text));
        },
        updateEvent: (id, text) => {
            return dispatch(events.updateEvent(id, text));
        },
        deleteEvent: (id) => {
            dispatch(events.deleteEvent(id));
        },
        loadEvent: (id) => {
            return dispatch(events.loadEvent(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar);