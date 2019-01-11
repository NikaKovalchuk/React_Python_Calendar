import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";
import Calendar from "./Calendar"
import Scheduler from "./Scheduler"

class Settings extends Component {
    state = {
        user: {},
        events: {},
        date: new Date(),
    }

    componentDidMount() {
        this.props.loadUser().then(response => {
            this.setState({
                user: this.props.auth.user
            });
        });
        this.props.loadEvents().then(response => {
            this.setState({
                events: this.props.events
            });
        });
    }

    render() {
        return (
            <div>
                <div className={'side-bar'}>
                    <div className={'calendar'}>
                        <Calendar/>
                    </div>
                </div>
                <div className={'scheduler'}>
                    <Scheduler/>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        auth: state.auth,
        events: state.events,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => {
            return dispatch(auth.loadUser());
        },
        changePassword: (model) => {
            return dispatch(auth.changePassword(model));
        },
        loadEvents: () => {
            return dispatch(events.loadEvents());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);